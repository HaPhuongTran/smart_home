
 $(document).ready(function(){
 	var userinfo, homeinfo;
 	var getHomeName, getUserName;
 	var countroom = 0, status_create, counthome = 0;
 	var temperture_humidity, deviceSource, listIdInterval = [];
 	var listIdIntervalSaveDevice = [];
 	var roominfo, recortInfo;
 	$(".insideReportmodel").load("modal_report.html");
 	$(".createroom").load("model_createroom.html");
 	var hasStorage = ("sessionStorage" in window && window.sessionStorage),
		storageKey = "sessionUser",
    	now, expiration, dataStorage = false;
    checkSessionUser();
    listenSaveDevice();
	addDevice();
    addHomeToList(getUser(getUserName).home, counthome);
    
    loadRoomOfHome(getHome(getHomeName).rooms);
    setvalue();
    addRoom();

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
    	var isTempDeviceExits = false;
    	var isHumiDeviceExits = false;
    	for(countroom; countroom<listroom.length; countroom++){
    		appendRoom(countroom, listroom[countroom].nameRoom);
    		listDevice = listroom[countroom].devices;
    		if(listDevice.length>0){
    			for(var i = 0; i<listDevice.length; i++){
    				if(listDevice[i].type === "Temperature Device"){
    					isTempDeviceExits = true;
    					continue;
    				}
    				if(listDevice[i].type === "Humidity Device" ){
    					isHumiDeviceExits = true;
    					continue;
    				}
    			}
		    }
		    checkExitsDevices(listroom[countroom].nameRoom, isTempDeviceExits, isHumiDeviceExits);
    		detailRoom(countroom);
    		setHumiTempForRoom(countroom);
    		deleteRoom(countroom,listroom[countroom].nameRoom);
    		viewReport(countroom);

    		isTempDeviceExits = isHumiDeviceExits = false;
    	}
    }

    function scheduleTempHumi(counttag){
    	var schedule = setInterval(function(){
	    	getTempatureHumidity();
	    	setTemperatureOut(counttag);
	    	setHumidityOut(counttag);
	    	setTemperatureIn(counttag);
	    	setHumidityIn(counttag);
	    	saveInfoToReport(counttag);
	    	}, 15000);
    	return schedule;
    }

    function scheduleTemp(counttag){
		var scheduleTemp = setInterval(function(){
			getTempatureHumidity();
	    	setTemperatureOut(counttag);
	    	setHumidityOut(counttag);
	    	setTemperatureIn(counttag);
	    	saveInfoToReport(counttag);
	    }, 15000);
	    return scheduleTemp;
    }

    function scheduleHumi(counttag){
    	var scheduleHumi = setInterval(function(){
    		getTempatureHumidity();
	    	setTemperatureOut(counttag);
	    	setHumidityOut(counttag);
	    	setHumidityIn(counttag);
	    	saveInfoToReport(counttag);
	    }, 15000);
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
			setHumiTempForRoom(countroom);
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
    			clearInterval(scheduleTempHumi(nameroom));
	    	}else if(status_create == 302){
	    		alert("Can't delete");
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

	function detailRoom(roomcount){
		$(".detail-btn"+roomcount).click(function(){
			deviceSource = [];
			$(".content-gird").append('<div id="grid"></div>');
			var listroom = getHome($(".thishome").text()).rooms;
			var thisroom;
			for(var list = 0; list<listroom.length; list++){
				if($(".nameroom"+roomcount).text() === listroom[list].nameRoom){
					$(".detailroomname").text($(".nameroom"+roomcount).text());
					deviceSource = listroom[list].devices;
					thisroom = listroom[list];
					break;
				}
			}
			createTableDevice(deviceSource);
			$(".close-detailroom").click(function(){
				closeDetailRoom();
			})
		})
	}

	function createChart(listDataTime, listTemp, listHumi){

		var createChart = document.getElementById("reportChart").getContext('2d');
		//get value of date to set labels, datasets
		var chart = new Chart(createChart, {
		    type: 'line',
		    data: {
		        labels:listDataTime,
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
		    },
		    options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
                            responsive:true
                        }
                    }]
                },
            }
		});
	}

	function viewReport(roomcount){
		$(".report"+roomcount).click(function(){
			pickDate();
			var room = getRoom(roomcount);
			var listrecordReport = room.reports;
			var listDataTime = [];
			var listDate = [], listTime = [], listTemp = [], listHumi = [];
			for(var i =0; i<listrecordReport.length; i++){
				listDate.push(listrecordReport[i].date);
				listTime.push(listrecordReport[i].time);
				listTemp.push(listrecordReport[i].temp);
				listHumi.push(listrecordReport[i].humi);
				listDataTime.push(listrecordReport[i].date+"  "+listrecordReport[i].time);
			}
			var table = $('#dtBasicExample').DataTable({
				data: listrecordReport,
				columns: [
			        { data: 'date'},
			        { data: 'time'},
			        { data: 'temp' },
			        { data: 'humi' }
			    ],
			    destroy: true,
			    "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
			});
  			$('.dataTables_length').addClass('bs-select');
  			createChart(listDataTime, listTemp, listHumi);
		})

		// $(".close-report").click(function(){
		// 	table.destroy();
		// })
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
			$(".sui-table tbody tr").each(function(){
				var id = $(this).find("td").eq(0).text();
				var ip = $(this).find("td").eq(1).text();
				var namedevice = $(this).find("td").eq(2).text();
				var state = $(this).find("td").eq(3).text();
				var type = $(this).find("td").eq(4).text();
				var temp = {id: id, ip:ip, nameDevice:namedevice, state:state, type:type};
				listDevice.push(temp);
			})
			for( var i =1; i<=listDevice.length - 1; i++){
				if(listDevice[i].ip != "0.0.0.0" && listDevice[i].ip.length>0){
					if(!validate(listDevice[i].ip)){
					alert("IP is not invalid, please try another IP!")
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
			}
			if(checksameip === true){
				alert("can't use same ip for mutil device");
			}else{
				$.ajax({
			    	async : false,
					method: "post",
					data: JSON.stringify(listDeviceSave),
					contentType: "application/json",
					url: "http://localhost/smarthome/savedevice/"+$(".detailroomname").text() + "/" + $(".username").text()+ "/" + nameHome
				}).done(function(data, textStatus, xhr){
					status_create = xhr.status;
				}).fail(function(data, textStatus, xhr){
					status_create = data.status;
				});

				if(status_create == 201){
					if(listIdIntervalSaveDevice != undefined && listIdIntervalSaveDevice.length>0){
						for(var i = 0; i<listIdIntervalSaveDevice.length; i++){
							if(listIdIntervalSaveDevice[i].nameroom === $(".detailroomname").text());
							clearInterval(listIdIntervalSaveDevice[i].id);
							listIdIntervalSaveDevice.splice(this,1);
						}
					}
					var isTempDeviceExits = isHumiDeviceExits = false;
	    			alert("Save success")
	    			loadDevice(listDeviceSave);
	    			for(var i = 0; i<listDeviceSave.length; i++){
	    				if(listDeviceSave[i].type === "Temperature Device"){
	    					isTempDeviceExits = true;
	    					continue;
	    				}
	    				if(listDeviceSave[i].type === "Humidity Device" ){
	    					isHumiDeviceExits = true;
	    					continue;
	    				}
	    			}
	    			checkExitsDevices($(".detailroomname").text(), isTempDeviceExits, isHumiDeviceExits);
	    		}else if(status_create == 302){
	    			alert("The Ip is exits, please use another Ip")
	    		}
			}
		})
	}

	function checkExitsDevices(nameRoom, isTempExit, isHumiexit){
		if(isTempExit && !isHumiexit){
			listIdIntervalSaveDevice.push({nameroom:nameRoom, id:scheduleTemp(nameRoom)});
	    }
	    if(isHumiexit && !isTempExit){
	    	listIdIntervalSaveDevice.push({nameroom:nameRoom, id:scheduleHumi(nameRoom)});
	    }
	    if(isHumiexit && isTempExit){
	    	listIdIntervalSaveDevice.push({nameroom:nameRoom, id:scheduleTempHumi(nameRoom)});
	    }
	    return listIdIntervalSaveDevice;
	}

	function loadDevice(listDevice){
		closeDetailRoom();
		$(".content-gird").append('<div id="grid"></div>');
		createTableDevice(listDevice);
	}

	function addDevice(){
		$(".adddevice-btn").click(function(){
			deviceSource = [];	
			$(".sui-table tbody tr").each(function(){
				var id = $(this).find("td").eq(0).text();
				var ip = $(this).find("td").eq(1).text();
				var namedevice = $(this).find("td").eq(2).text();
				var state = $(this).find("td").eq(3).text();
				var type = $(this).find("td").eq(4).text();
				var temp = {id: id, ip:ip, nameDevice:namedevice, state:state, type:type};
				if(id != ""){
				deviceSource.push(temp);}
			})
			deviceSource.push({id: 0, ip: "0.0.0.0", nameDevice:"Device Name", state:"off"});
			closeDetailRoom();
			$(".content-gird").append('<div id="grid"></div>');
			createTableDevice(deviceSource);
		})
	}

	function setHumiTempForRoom(roomcount){
		var Room = getRoom(roomcount);
		if(Room.humitemp != null){
			$(".tempertaureUser"+$(".nameroom"+roomcount).text()).text(Room.humitemp.temp);
			$(".humidityUser"+$(".nameroom"+roomcount).text()).text(Room.humitemp.humi)
		}
		conditionComparevalue($(".nameroom"+roomcount).text());
		$(".set-btn"+roomcount).click(function(){
			var RoomAfter = getRoom(roomcount);
			$(".roomNameSet").text($(".nameroom"+roomcount).text());
			setHumiAndTemp();
			if(RoomAfter.humitemp != null && RoomAfter.humitemp != ""){
				setValueForForm(Room.humitemp.id, RoomAfter.humitemp.humi, RoomAfter.humitemp.temp);
			}else{
				setValueForForm(0, 0, 0);
			}
		})
	}
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
	function conditionComparevalue(roomName){
		var tempUser = $(".tempertaureUser"+roomName).text();
		if( tempUser != 0 && tempUser != "" ){
			$("#grid").remove();
			var idsetInterval = setInterval(function(){
				compareValue(roomName);
			},15000);
			listIdInterval.push({roomName:roomName, id:idsetInterval});
		}else{
			if(listIdInterval != undefined){
				for(var i = 0; i<listIdInterval.length; i++){
					if(listIdInterval[i].roomName === roomName);
					clearInterval(listIdInterval[i].id);
					listIdInterval.splice(this,1);
				}
			}
		}
	}
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

	function setvalue(){
		$(".btn-ok").click(function(){
			var tagset = $(".roomNameSet").text();
			setHumidityUser(tagset);
			setTemperatureUser(tagset);
			$.ajax({
		    	async : false,
				method: "post",
				data: JSON.stringify({ id: parseInt($(".idHumiTemp").val()), temp:parseInt(getTemperatureUser(tagset)), humi: parseInt(getHumidityUser(tagset))}),
				contentType: "application/json",
				url: "http://localhost/smarthome/savehumitempuser/"+tagset+"/" + $(".thishome").text()
			}).done(function(data, textStatus, xhr){
				status_create = xhr.status;
			}).fail(function(data, textStatus, xhr){
				status_create = data.status;
			});
			conditionComparevalue(tagset);

		})
	}
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
		if(parseInt(getTemperatureIn(tagset)) > parseInt(getTemperatureUser(tagset))){
			changeValue("Air-Conditioner", "on", tagset);
			changeValue("Heating Equipment", "off", tagset);

		}else{
			changeValue("Air-Conditioner", "off", tagset);
			changeValue("Heating Equipment", "on", tagset);
		}
		if(parseInt(getHumidityIn(tagset)) > parseInt(getHumidityUser(tagset))){
			changeValue("Dehumidifier", "on", tagset);
			changeValue("Nebulizer", "off", tagset);
		}else{
			changeValue("Dehumidifier", "off", tagset);
			changeValue("Nebulizer", "on", tagset);
		}
	}



	function appendRoom(roomcount, roomname){
		$(".row").append(
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
							+'<button type="button" data-toggle="modal" data-target="#modaldetailroom" class="btn btn-default detail-btn'+roomcount+'">Detail</button>'
							+'<button type="button" data-toggle="modal" data-target="#sethumitemp" class="btn btn-default set-btn'+roomcount+'">Set</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		)
	}
 });

