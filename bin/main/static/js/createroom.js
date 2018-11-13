
 $(document).ready(function(){
 	var userinfo, homeinfo;
 	var getHomeName, getUserName;
 	var countroom = 0, status_create, counthome = 0;
 	var temperture_humidity, deviceSource, listIdInterval = [];
 	var listLable = [''], 
 		listHumi = [''],
		listTemp = [''];
 	var listIdIntervalSaveDevice = [];
 	var roominfo, recortInfo;
 	$(".insideReportmodel").load("modal_report.html");
 	$(".createroom").load("model_createroom.html");
 	$(".AirConditionModel").load("ControlAirConditioner.html");
 	$(".DehumidifierModel").load("ControlDehumidifier.html");
 	$(".HeatingEquipmentModel").load("ControlHeatingEquipment.html");
 	var hasStorage = ("sessionStorage" in window && window.sessionStorage),
		storageKey = "sessionUser",
    	now, expiration, dataStorage = false;
    checkSessionUser();
    listenSaveDevice();
	addDevice();
    addHomeToList(getUser(getUserName).home, counthome);
    
    loadRoomOfHome(getHome(getHomeName).rooms);
    // setvalue();
    addRoom();
    choiceDeviceControl();

    for(var count =0; count<=counthome; count++){
    	swichHome(count);
    }

    setInterval(function(){checkSessionUser();}, 3000000);

	function checkSessionUser(){
    	if(hasStorage){
    		dataStorage = sessionStorage.getItem(storageKey);
	    	if(dataStorage){
	    		dataStorage = JSON.parse(dataStorage);
	    		now = new Date();
	    		expiration = new Date(dataStorage.expirestime);
	            expiration.setMinutes(expiration.getMinutes() + 60);
	            if(now.getTime()>expiration.getTime()){
	            	dataStorage = false;
	            	sessionStorage.removeItem(storageKey);
	            	alert("Your session is exprity, please login agin");
	            	document.location.href = "index.html";
	            }else{
	            	getHomeName = dataStorage.userData.homename;
	            	getUserName = dataStorage.userData.username;
	            	$(".username").html(dataStorage.userData.username);
	            	$(".thishome").html(dataStorage.userData.homename);
	            }
	    	}
    	}
    }

    function addHomeToList(listhome, homecount){
    	for(homecount; homecount<listhome.length; homecount++){
    		$(".listhome").append(
    			'<a class="dropdown-item listhome'+homecount+'" href="#">'+listhome[homecount].nameHome+'</a>'
    		)
    		counthome++
    	}
    }

    function appendListDevice(roomcount){
    	var listDevice = getRoom(roomcount).devices;
    	$(".select-Device option").remove();
    	for(var list = 0; list<listDevice.length; list++){
    		if(listDevice[list].type != "Temperature Device" && listDevice[list].type != "Humidity Device" )
    		$(".select-Device").append(
    			'<option id ='+listDevice[list].ip+' value='+listDevice[list].type+'>'+listDevice[list].nameDevice+'</option>'
    		)
    	}
    }

    function choiceDeviceControl(){
    	$(".btn-ok-control").click(function(){
    		var typeDevice = $( ".select-Device option:selected" ).val();
    		var nameDevice = $( ".select-Device option:selected" ).text();
    		if(typeDevice === "Air-Conditioner"){
    			$(".nameAirConditioner").text(nameDevice);
    			$("#AirConditionControl").modal();
    			var spinerTemp = $( "#spinner-temperature" ).spinner();
    			var spinerTime = $( "#spinner-timer" ).spinner();
    			getvalueAirSentToSocketServer(spinerTemp, spinerTime);
    		}else if(typeDevice === "Dehumidifier"){
    			$(".nameDehumidifier").text(nameDevice);
    			$("#DehumidifierControl").modal();
    			var spinerDehumi = $( "#spinner-Dehumidifier" ).spinner();
    			var spinerTime = $( "#Dehumidifier-timer" ).spinner();
    			getvalueDehumiSentToSocketServer(spinerDehumi, spinerTime);
    		}else if(typeDevice === "Heating"){
    			$(".nameHeatingEquipmentr").text(nameDevice);
    			$("#HeatingEquipmentrControl").modal();
    			var spinerHeat  = $( "#spinner-HeatingEquipmentr" ).spinner();
    			var spinerTime = $( "#HeatingEquipmentr-timer" ).spinner();
    			getvalueHeatSentToSocketServer(spinerHeat, spinerTime);
    		}
    	})
    }
    function getvalueDehumiSentToSocketServer(spinerDevice, spinerTime){
    	$(".btn-setcontrolDehumi").click(function(){
    		var data;
    		var state = false;
    		var humidity, time, fan_level;
			if($(".DHcheckbox").prop("checked") == true){
				state = true;
    		}
			temp = parseInt(spinerDevice[0].value);
			time = parseInt(spinerTime[0].value);
			fan_level = $( ".fan-air option:selected" ).text();
			data = {state:state, humi:humidity, time: time, fanLevel:fan_level};
			sentDataToSocket(data);
    	})
    }

    function getvalueHeatSentToSocketServer(spinerDevice, spinerTime){
    	$(".btn-setcontrolHeat").click(function(){
    		var data = [];
    		var state = false;
    		var temp, time, fan_level;
			if($(".HEcheckbox").prop("checked") == true){
				state = true;
    		}
			temp = parseInt(spinerDevice[0].value);
			time = parseInt(spinerTime[0].value);
			fan_level = $( ".fan-air option:selected" ).text();
			data = {state:state,temp:temp, time: time, fanLevel:fan_level};
			sentDataToSocket(data);
    	})
    }
    function getvalueAirSentToSocketServer(spinerDevice, spinerTime){
    	$(".btn-setcontrolAir").click(function(){
    		var state = false;
    		var data;
    		var mode, temp, time, fan_level;
			if($(".ACcheckbox").prop("checked") == true){
				state = true;
    		}
			mode = $("input[name='modeair']:checked").val();
			temp = parseInt(spinerDevice[0].value);
			time = parseInt(spinerTime[0].value);
			fan_level = $( ".fan-air option:selected" ).text();
			data = {state:state, mode:mode, temp:temp, time: time, fanLevel:fan_level};
			sentDataToSocket(data);

    	})
    }

    function sentDataToSocket(data){
    	$.ajax({
	    	async : false,
			method: "post",
			data: JSON.stringify(data),
			contentType: "application/json",
			url: "http://localhost/smarthome/control"
		}).done(function(data, textStatus, xhr){
			status_create = xhr.status;
		}).fail(function(data, textStatus, xhr){
				 status_create = data.status;
		});
    }

    function swichHome(homecount){
    	$(".listhome"+homecount).click(function(){
    		countroom = 0;
    		$(".room-contain").remove();
    		$(".thishome").text($(this).text());
    		loadRoomOfHome(getHome($(this).text()).rooms);
    	})
	}

    function getHome(homename){
    	$.ajax({
		async : false,
		method: "get",
		contentType: "application/json",
		url: "http://localhost/smarthome/gethome/"+homename+"/"+$(".username").text()
		}).done(function(data, textStatus, xhr){
			homeinfo = data;
		});
		return homeinfo;
    }

    function loadRoomOfHome(listroom){
    	if(listroom.length>0){
    		$(".wellcome").remove();
    	}
    	for(countroom; countroom<listroom.length; countroom++){
    		appendRoom(countroom, listroom[countroom].nameRoom);
    		listDevice = listroom[countroom].devices;
    		if(listDevice.length>0){
    			for(var i = 0; i<listDevice.length; i++){
    				if(listDevice[i].type === "Temperature Device"){
    					listIdIntervalSaveDevice.push({nameroom:listroom[countroom].nameRoom, id:scheduleTemp(listroom[countroom].nameRoom), idDevice:listDevice[i].id});
    				}
    				if(listDevice[i].type === "Humidity Device" ){
    					listIdIntervalSaveDevice.push({nameroom:listroom[countroom].nameRoom, id:scheduleHumi(listroom[countroom].nameRoom), idDevice:listDevice[i].id});
    				}
    			}
		    }
    		detailRoom(countroom);
    		controlDevice(countroom);
    		// setHumiTempForRoom(countroom);
    		deleteRoom(countroom,listroom[countroom].nameRoom);
    		viewReport(countroom);
    	}
    }

    function scheduleTemp(counttag){
		var scheduleTemp = setInterval(function(){
			getTempatureHumidity();
	    	setTemperatureOut(counttag);
	    	setHumidityOut(counttag);
	    	setTemperatureIn(counttag);
	    	saveInfoToReport(counttag);
	    }, 60000);
	    return scheduleTemp;
    }

    function scheduleHumi(counttag){
    	var scheduleHumi = setInterval(function(){
    		getTempatureHumidity();
	    	setTemperatureOut(counttag);
	    	setHumidityOut(counttag);
	    	setHumidityIn(counttag);
	    	saveInfoToReport(counttag);
	    }, 60000);
	    return scheduleHumi;
    }

    function getUser(username){
		$.ajax({
		async : false,
		method: "get",
		contentType: "application/json",
		url: "http://localhost/getaccount/"+username
		}).done(function(data, textStatus, xhr){
			userinfo = data;
		});
		return userinfo;
	}

	function addRoom(){
		$(".btn-add").click(function(){
			$(".wellcome").remove();
			createRoom();
		});
	}

	function createRoom(){
		$('.btnOk').one('click', function(){
			var roomname = $('.roomname').val();
			getInfoCreateRoom(saveRoom(roomname,countroom), roomname);
			detailRoom(countroom);
			controlDevice(countroom);
			// setHumiTempForRoom(countroom);
			deleteRoom(countroom,roomname);
			viewReport(countroom);
			countroom++;
		})
	}

	function saveRoom(roomname, countroom){
  		//Begin create room
	    $.ajax({
	    	async : false,
			method: "post",
			data: JSON.stringify({ nameRoom:roomname }),
			contentType: "application/json",
			url: "http://localhost/smarthome/createroom/"+$('.thishome').text()+"/"+$(".username").text()
		}).done(function(data, textStatus, xhr){
			status_create = xhr.status;
		}).fail(function(data, textStatus, xhr){
				 status_create = data.status;
		});

		return status_create;
	}

	function getInfoCreateRoom(info,roomname){
    	if(info == 201){
    		appendRoom(countroom,roomname);
    	}else if(info == 302){
    		$("p.anncounce").css("display", "block");
    	}
    }

    function deleteRoom(roomcount, nameroom){
    	$(".delete"+roomcount).click(function(){
    		$.ajax({
	    	async : false,
			method: "delete",
			data: JSON.stringify({ nameRoom:nameroom }),
			contentType: "application/json",
			url: "http://localhost/smarthome/deleteroom/"+nameroom+"/"+$(".thishome").text()
			}).done(function(data, textStatus, xhr){
				status_create = xhr.status;
			}).fail(function(data, textStatus, xhr){
				status_create = data.status;
			});
			if(status_create == 200){
    			$('.room'+roomcount).remove();
    			alert("Delete Success");
	    	}else if(status_create == 302){
	    		alert("The room contain device. Can't delete");
	    	}
    	})
    }

    function getTempatureHumidity(){
		
		$.ajax({
			async:false,
			url: "https://api.openweathermap.org/data/2.5/weather?q=Ho%20Chi%20Minh%20City,VN&APPID=efe6e214a09caa3cd0319cef3384a9fd&units=metric"
		}).done(function(data, textStatus, xhr){
			var temperHumi = '[{"temperature":"'+data.main.temp+'"}, {"humidity": "'+data.main.humidity+'"}]';
			temperture_humidity = JSON.parse(temperHumi);
		});
	}
/////////////////////////////////////////////////////////////////////////////
	function setTemperatureOut(tagset){
		$(".tempertaureOut"+tagset).html(temperture_humidity[0].temperature);
	}

	function setHumidityOut(tagset){
		$(".humidityOut"+tagset).html(temperture_humidity[1].humidity);
	}
/////////////////////////////////////////////////////////////////////////////

	function setTemperatureIn(tagset){
		var tempIn = Math.floor(Math.random()*7) + parseInt(temperture_humidity[0].temperature);
		$(".tempertaureIn"+tagset).html(tempIn);
	}

	function getTemperatureIn(tagset){
		return $(".tempertaureIn"+tagset).text();
	}

	function setHumidityIn(tagset){
		var humiIn = Math.floor(Math.random()*7) + parseInt(temperture_humidity[1].humidity);
		$(".humidityIn"+tagset).html(humiIn);
	}


	function getHumidityIn(tagset){
		return $(".humidityIn"+tagset).text();
	}
//////////////////////////////////////////////////////////////////////////////////
	function setHumidityUser(tagset){
		$(".humidityUser"+tagset).text($(".setHumidity").val());
	}

	function getHumidityUser(tagset){
		return $(".humidityUser"+tagset).text();;
	}

	function setTemperatureUser(tagset){
		$(".tempertaureUser"+tagset).text($(".setTemperature").val());
	}

	function getTemperatureUser(tagset){
		return $(".tempertaureUser"+tagset).text();
	}

	function controlDevice(roomcount){
		$(".control-btn"+roomcount).click(function(){
			$(".room-device").text($(".nameroom"+roomcount).text());
			appendListDevice(roomcount);
		})
	}

	function detailRoom(roomcount){
		$(".detail-btn"+roomcount).click(function(){
			deviceSource = [];
			$(".content-gird").append('<div id="grid"></div>');
			var listroom = getHome($(".thishome").text()).rooms;
			for(var list = 0; list<listroom.length; list++){
				if($(".nameroom"+roomcount).text() === listroom[list].nameRoom){
					$(".detailroomname").text($(".nameroom"+roomcount).text());
					deviceSource = listroom[list].devices;
					break;
				}
			}
			createTableDevice(deviceSource, listIdIntervalSaveDevice);
			$(".close-detailroom").click(function(){
				closeDetailRoom();
			})
		})
	}

	function reformatDateString(day) {
	  var dayconvert = day.split('/').join('-');
	  return dayconvert.substring(6)+"-"+dayconvert.substring(0,5);
	}
	function createChart(listDateTime_Humi_Temp){
		listLable = [];
		listHumi = [];
		listTemp = [];
		var fromDate = new Date(reformatDateString($(".fromDate").val())+"T00:00:00");
		var toDate = new Date(reformatDateString($(".toDate").val())+"T23:00:00");
		for (var i = 0; i<listDateTime_Humi_Temp.length; i++){
			if(Date.parse(listDateTime_Humi_Temp[i].date) >= Date.parse(fromDate) 
				&& Date.parse(listDateTime_Humi_Temp[i].date)<=Date.parse(toDate)){
				listLable.push(listDateTime_Humi_Temp[i].date);
				listHumi.push(listDateTime_Humi_Temp[i].humi);
				listTemp.push(listDateTime_Humi_Temp[i].temp);
			}
		}
		$("#reportChart").remove();
		$(".chart-container").append('<canvas id="reportChart"></canvas>');
		var createChart = document.getElementById("reportChart").getContext('2d');

		var data = {
	        labels:listLable,
	        datasets: [{
	            label: "Temp",
	            backgroundColor: 'rgba(255, 255, 255,0)',
	            borderColor: 'rgb(0, 128, 128)',
	            data: listTemp
	        },
	        {
	        	label: "Humi",
	        	backgroundColor: 'rgba(255, 255, 255,0)',
	            borderColor: 'rgb(159, 59, 168)',
	            data: listHumi,
	        }
	        ]
	    }
		var chart = new Chart(createChart, {
		    type: 'line',
		    data: data,
		    options: {
		    	scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
		    }
		});
	}

	function viewCharWithDate(listDateTime_Humi_Temp){
		$(".viewChartDate").click(function(){
			createChart(listDateTime_Humi_Temp);
		});
	}

	function viewReport(roomcount){
		$(".report"+roomcount).click(function(){
			pickDate();
			var room = getRoom(roomcount);
			var listrecordReport = room.reports;
			var listDateTime_Humi_Temp = [];
			for(var i =0; i<listrecordReport.length; i++){
				listrecordReport[i].date = new Date(listrecordReport[i].date).toString().substring(0,24);
				listDateTime_Humi_Temp.push({DateTime:new Date(listrecordReport[i].date), Humi:listrecordReport[i].humi, Temp:listrecordReport[i].temp});
			}
			var table = $('#dtBasicExample').DataTable({
				data: listrecordReport,
				columns: [
			        { data: 'date'},
			        { data: 'temp' },
			        { data: 'humi' }
			    ],
			    destroy: true,
			    "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
			});
  			$('.dataTables_length').addClass('bs-select');
  			createChart(listrecordReport);//thaphuong
  			viewCharWithDate(listrecordReport);//thaphuong
		});
	}

	function closeDetailRoom(){
		$("#grid").remove();
	}

	function validate( ipaddress ) {
	    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
		    return (true)  
		}else return false;
	}

	function listenSaveDevice(){
		$(".save-btn").click(function(){
			var listDevice = [];
			var listDeviceSave = [];
			var checksameip = false;
			var nameHome = $(".thishome").text();
			var nameRoom = $(".detailroomname").text();
			$(".sui-table tbody tr").each(function(){
				var id = $(this).find("td").eq(0).text();
				var ip = $(this).find("td").eq(1).text();
				var subnet = $(this).find("td").eq(2).text();
				var gateway = $(this).find("td").eq(3).text();
				var namedevice = $(this).find("td").eq(4).text();
				var type = $(this).find("td").eq(5).text();
				var temp = {id: id, ip:ip, subnetMask:subnet, gateway: gateway, nameDevice:namedevice, type:type};
				if(id != "No records to display" && id != ""){
					listDevice.push(temp);
				}
			})
			for( var i =0; i<=listDevice.length-1; i++){
				if(listDevice[i].ip  === "0.0.0.0" || listDevice[i].ip.length == 0 || !validate(listDevice[i].ip)){
					alert("IP is invalid, please try another IP!")
					return;
				}
				if(listDevice[i].subnetMask  === "0.0.0.0" || listDevice[i].subnetMask.length == 0 || !validate(listDevice[i].subnetMask)){
					alert("Subnet is invalid, please try another IP!")
					return;
				}

				if(listDevice[i].gateway  === "0.0.0.0" || listDevice[i].gateway.length == 0 || !validate(listDevice[i].gateway)){
					alert("Gateway is invalid, please try another IP!")
					return;
				}

				for (var j = i+1; j < listDevice.length; j++) {
					if(listDevice[i].ip === listDevice[j].ip){
						checksameip = true;
						break;
					}
				}
				listDeviceSave.push(listDevice[i]);
			}
			if(checksameip === true){
				alert("can't use same ip for mutil device");
			}else{
				$.ajax({
			    	async : false,
					method: "post",
					data: JSON.stringify(listDeviceSave),
					contentType: "application/json",
					url: "http://localhost/smarthome/savedevice/"+nameRoom + "/" + $(".username").text()+ "/" + nameHome
				}).done(function(data, textStatus, xhr){
					status_create = xhr.status;
				}).fail(function(data, textStatus, xhr){
					status_create = data.status;
				});

				if(status_create == 201){
					if(listIdIntervalSaveDevice != undefined && listIdIntervalSaveDevice.length>0){
						for(var i = 0; i<listIdIntervalSaveDevice.length; i++){
							if(listIdIntervalSaveDevice[i].nameroom === nameRoom){
								clearInterval(listIdIntervalSaveDevice[i].id);
								listIdIntervalSaveDevice.splice(this,1);
							}
						}
					}
	    			alert("Save success")
	    			var listroom = getHome($(".thishome").text()).rooms;
	    			var deviceSource = [];
					for(var list = 0; list<listroom.length; list++){
						if( nameRoom === listroom[list].nameRoom){
							deviceSource = listroom[list].devices;
							break;
						}
					}
	    			loadDevice(deviceSource);
					if(deviceSource.length>0){
		    			for(var i = 0; i<deviceSource.length; i++){
		    				if(deviceSource[i].type === "Temperature Device"){
		    					listIdIntervalSaveDevice.push({nameroom:nameRoom, id:scheduleTemp(nameRoom), idDevice:deviceSource[i].id});
		    				}
		    				if(deviceSource[i].type === "Humidity Device" ){
		    					listIdIntervalSaveDevice.push({nameroom:nameRoom, id:scheduleHumi(nameRoom), idDevice:deviceSource[i].id});
		    				}
		    			}
				    }
	    		}else if(status_create == 302){
	    			alert("The Ip is exits, please use another Ip")
	    		}
			}
		})
	}
	function loadDevice(listDevice){
		closeDetailRoom();
		$(".content-gird").append('<div id="grid"></div>');
		createTableDevice(listDevice, listIdIntervalSaveDevice);
	}

	function addDevice(){
		$(".adddevice-btn").click(function(){
			deviceSource = [];	
			$(".sui-table tbody tr").each(function(){
				var id = $(this).find("td").eq(0).text();
				var ip = $(this).find("td").eq(1).text();
				var subnet = $(this).find("td").eq(2).text();
				var gateway = $(this).find("td").eq(3).text();
				var namedevice = $(this).find("td").eq(4).text();
				var type = $(this).find("td").eq(5).text();
				var temp = {id: id, ip:ip, subnetMask:subnet, gateway: gateway, nameDevice:namedevice, type:type};
				if(id != ""){
					deviceSource.push(temp);
				}
			})
			deviceSource.push({id: 0, ip: "0.0.0.0", subnetMask:"0.0.0.0", gateway: "0.0.0.0", nameDevice:"Device Name"});
			closeDetailRoom();
			$(".content-gird").append('<div id="grid"></div>');
			createTableDevice(deviceSource, listIdIntervalSaveDevice);
		})
	}

	// function setHumiTempForRoom(roomcount){
	// 	var Room = getRoom(roomcount);
	// 	if(Room.humitemp != null){
	// 		$(".tempertaureUser"+$(".nameroom"+roomcount).text()).text(Room.humitemp.temp);
	// 		$(".humidityUser"+$(".nameroom"+roomcount).text()).text(Room.humitemp.humi)
	// 	}
	// 	// conditionComparevalue($(".nameroom"+roomcount).text());
	// 	$(".set-btn"+roomcount).click(function(){
	// 		var RoomAfter = getRoom(roomcount);
	// 		$(".roomNameSet").text($(".nameroom"+roomcount).text());
	// 		setHumiAndTemp();
	// 		if(RoomAfter.humitemp != null && RoomAfter.humitemp != ""){
	// 			setValueForForm(Room.humitemp.id, RoomAfter.humitemp.humi, RoomAfter.humitemp.temp);
	// 		}else{
	// 			setValueForForm(0, 0, 0);
	// 		}
	// 	})
	// }
	function saveInfoToReport(counttag){
    	var temp = getTemperatureIn(counttag);
    	var humi = getHumidityIn(counttag);
    	$.ajax({
	    	async : false,
			method: "post",
			data: JSON.stringify({temp:temp, humi:humi}),
			contentType: "application/json",
			url: "http://localhost/smarthome/savereport/"+counttag+ "/" + $(".username").text()+ "/" + $(".thishome").text()
		}).done(function(data, textStatus, xhr){
			status_create = xhr.status;
		}).fail(function(data, textStatus, xhr){
			status_create = data.status;
		});

    }

    function pickDate(){  
		$('.datepicker').datepicker({
        weekStart: 1,
        daysOfWeekHighlighted: "6,0",
        autoclose: true,
        todayHighlight: true,
    });
    	$('.datepicker').datepicker("setDate", new Date());
    }
	function setValueForForm(id, humi, temp){
		$(".idHumiTemp").val(id);
		$(".setHumidity").val(humi);
		$(".setTemperature").val(temp);
	}
	// function conditionComparevalue(roomName){
	// 	var tempUser = $(".tempertaureUser"+roomName).text();
	// 	if( tempUser != 0 && tempUser != "" ){
	// 		$("#grid").remove();
	// 		var idsetInterval = setInterval(function(){
	// 			compareValue(roomName);
	// 		},15000);
	// 		listIdInterval.push({roomName:roomName, id:idsetInterval});
	// 	}else{
	// 		if(listIdInterval != undefined){
	// 			for(var i = 0; i<listIdInterval.length; i++){
	// 				if(listIdInterval[i].roomName === roomName);
	// 				clearInterval(listIdInterval[i].id);
	// 				listIdInterval.splice(this,1);
	// 			}
	// 		}
	// 	}
	// }
	function getRoom(roomcount){
		$.ajax({
			async : false,
			method: "get",
			contentType: "application/json",
			url: "http://localhost/smarthome/getroom/"+$(".nameroom"+roomcount).text()+"/"+$(".thishome").text()
		}).done(function(data, textStatus, xhr){
			roominfo = data;
		});
		return roominfo;
	}


	function setHumiAndTemp(){
		$("#btn-up-humidityDevice, #btn-up-temperatureDevice").click(function(){
			var typeDevice = $(this).attr("id");
			if(typeDevice === "btn-up-humidityDevice"){
				increaseOrDecreaseValue("setHumidity", 1);
			}else{
				increaseOrDecreaseValue("setTemperature", 1);
			}
		})

		$("#btn-down-humidityDevice, #btn-down-temperatureDevice").click(function(){
			var typeDevice = $(this).attr("id");
			if(typeDevice === "btn-down-humidityDevice"){
				increaseOrDecreaseValue("setHumidity", 0);
			}else{
				increaseOrDecreaseValue("setTemperature", 0);
			}
		})
	}

	function increaseOrDecreaseValue(checkHumiOrTemp, checkupdown){
		var value = $("."+checkHumiOrTemp).val();
		if(checkupdown === 1){
			value++;
		}
		else if (value >1){
			value--;
		}
		$("."+checkHumiOrTemp).val(value);
	}

	// function setvalue(){
	// 	$(".btn-ok").click(function(){
	// 		var tagset = $(".roomNameSet").text();
	// 		setHumidityUser(tagset);
	// 		setTemperatureUser(tagset);
	// 		$.ajax({
	// 	    	async : false,
	// 			method: "post",
	// 			data: JSON.stringify({ id: parseInt($(".idHumiTemp").val()), temp:parseInt(getTemperatureUser(tagset)), humi: parseInt(getHumidityUser(tagset))}),
	// 			contentType: "application/json",
	// 			url: "http://localhost/smarthome/savehumitempuser/"+tagset+"/" + $(".thishome").text()
	// 		}).done(function(data, textStatus, xhr){
	// 			status_create = xhr.status;
	// 		}).fail(function(data, textStatus, xhr){
	// 			status_create = data.status;
	// 		});
	// 		conditionComparevalue(tagset);

	// 	})
	// }
	function changeValue(typeDevice, state, tagset){
		// var listRoom = homeinfo.rooms;
		// var isDeviceExits = false;
		// for(var i =0; i<listRoom.length; i++){
		// 	if(listRoom[i].nameRoom === tagset){
		// 		var deviceSourceschel = listRoom[i].devices;
		// 		for(var j = 0; j<deviceSourceschel.length; j++){
		// 			if(deviceSourceschel[j].type === typeDevice){
		// 				$(".sui-table tbody tr").each(function(){
		// 					var type = $(this).find("td").eq(4).text();
		// 					if(type === typeDevice && $(".detailroomname").text()=== tagset){
		// 						$(this).find("td").eq(3).text(state);
		// 						return;
		// 					}
		// 				})
		// 				showToastr(typeDevice + " of room " + tagset + " is " + state, "info");
		// 				return;
		// 			}
		// 		}
		// 		showToastr(tagset + " is not exits " + typeDevice, "warning");
		// 		return;
		// 	}
		// }
	}
	function showToastr(message, typetoastr){
		toastr.options = {
              "closeButton": true,
              "positionClass": "toast-bottom-right",
              "onclick": null,
              "timeOut": "2000",
              "extendedTimeOut": "1000"
            };
        if(typetoastr === "warning"){
        	toastr.warning(message);
        }else{
        	toastr.info(message);
        }
	}
	function compareValue(tagset){
		// if(parseInt(getTemperatureIn(tagset)) > parseInt(getTemperatureUser(tagset))){
		// 	changeValue("Air-Conditioner", "on", tagset);
		// 	changeValue("Heating Equipment", "off", tagset);

		// }else{
		// 	changeValue("Air-Conditioner", "off", tagset);
		// 	changeValue("Heating Equipment", "on", tagset);
		// }
		// if(parseInt(getHumidityIn(tagset)) > parseInt(getHumidityUser(tagset))){
		// 	changeValue("Dehumidifier", "on", tagset);
		// 	changeValue("Nebulizer", "off", tagset);
		// }else{
		// 	changeValue("Dehumidifier", "off", tagset);
		// 	changeValue("Nebulizer", "on", tagset);
		// }
	}



	function appendRoom(roomcount, roomname){
		$(".row-room").append(
			 '<div class="col-sm-4 room-contain room'+roomcount+'">'
				+'<div class="card card-image home">'
					+'<div class="deleteroom">'
						+'<button type="button" class="close delete'+roomcount+'" aria-label="Close">'
							+'<span aria-hidden="true">×</span>'
						+'</button>'
					+'</div>'
					+'<div class="text-white text-center d-flex align-items-center rgba-black-strong py-5 px-4">'
						+'<div class="contain-info">'
							+'<h5 class="pink-text" ><i class="fa fa-pie-chart"></i><a class = "report'+roomcount+'" data-toggle="modal" data-target="#modelreport">Report</a></h5>'
							+'<h3 class="card-title pt-2 nameroom'+roomcount+'">'+roomname+'</h3>'
							+'<div>'
								+'<table class="table view-table">'
									+'<thead>'
										+'<tr>'
											+'<th scope="col">#</th>'
											+'<th scope="col">In</th>'
											+'<th scope="col">Out</th>'
											+'<th scope="col">User</th>'
										+'</tr>'
									+'</thead>'
									+'<tbody>'
										+'<tr class = "temp">'
											+'<td>Temperature(°C)</td>'
											+'<td class="tempertaureIn'+roomname+'"></td>'
											+'<td class="tempertaureOut'+roomname+'"></td>'
											+'<td class="tempertaureUser'+roomname+'"></td>'
										+'</tr>'
										+'<tr>'
											+'<td>Humidity(&#37;)</td>'
											+'<td class = "humidityIn'+roomname+'"></td>'
											+'<td class = "humidityOut'+roomname+'"></td>'
											+'<td class = "humidityUser'+roomname+'"></td>'
										+'</tr>'
									+'</tbody>'
								+'</table>'
							+'</div>'
							+'<button type="button" data-toggle="modal" data-target="#modaldetailroom" class="btn btn-default detail-btn'+roomcount+'">Add</button>'
							+'<button type="button" data-toggle="modal" data-target="#control" class="btn btn-default control-btn'+roomcount+'">Control</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		)
	}
 });

