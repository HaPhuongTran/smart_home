
 $(document).ready(function(){
 	var userinfo, homeinfo;
 	var getHomeName, getUserName;
 	var countroom = 0, status_create, counthome = 0;
 	var temperture_humidity, deviceSource;
 	$(".createroom").load("model_createroom.html");
 	$(".sethumitemp").load("settemphumi.html");
 	var hasStorage = ("sessionStorage" in window && window.sessionStorage),
		storageKey = "sessionUser",
    	now, expiration, dataStorage = false;
    checkSessionUser();
    listenSaveDevice();
	addDevice();
    addHomeToList(getUser(getUserName).home, counthome);
    loadRoomOfHome(getHome(getHomeName).rooms);
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
	            	$(".thisroom").html(dataStorage.userData.homename);
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
    		$(".thisroom").text($(this).text());
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
    		if(listroom[countroom].devices.length>0){
    			scheduleTempHumi(listroom[countroom].nameRoom);
		    }
    		detailRoom(countroom);
    		setHumiTempForRoom(countroom);
    		deleteRoom(countroom,listroom[countroom].nameRoom);
    	}
    }

    function scheduleTempHumi(counttag){
    	setInterval(function(){
	    	getTempatureHumidity();
	    	setTemperatureOut(counttag);
	    	setHumidityOut(counttag);
	    	setTemperatureIn(counttag);
	    	setHumidityIn(counttag);
	    	}, 30000);
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
			url: "http://localhost/smarthome/createroom/"+$('.thisroom').text()+"/"+$(".username").text()
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
			url: "http://localhost/smarthome/deleteroom/"+nameroom+"/"+$(".thisroom").text()
			}).done(function(data, textStatus, xhr){
				status_create = xhr.status;
			}).fail(function(data, textStatus, xhr){
				status_create = data.status;
			});
			if(status_create == 200){
    			$('.room'+roomcount).remove();
    			alert("Delete Success");
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

	function setTemperatureOut(temp){
			$(".tempertaureOut"+temp).html(temperture_humidity[0].temperature);
	}

	function setHumidityOut(temp){
			$(".humidityOut"+temp).html(temperture_humidity[1].humidity);
	}

	function setTemperatureIn(temp){
			$(".tempertaureIn"+temp).html(Math.floor(Math.random()*100)-50);
	}

	function setHumidityIn(temp){
			$(".humidityIn"+temp).html(Math.floor(Math.random()*100)-50);
	}

	function detailRoom(roomcount){//review here
		$(".detail-btn"+roomcount).click(function(){
			$(".content-gird").append('<div id="grid"></div>');
			var listroom = getHome($(".thisroom").text()).rooms;
			var thisroom;
			for(var list = 0; list<listroom.length; list++){
				if($(".nameroom"+roomcount).text() === listroom[list].nameRoom){
					$(".detailroomname").text($(".nameroom"+roomcount).text());
					deviceSource = listroom[list].devices;
					thisroom = listroom[list];
					break;
				}
			}

			if(deviceSource.length>0){
				createTableDevice(deviceSource);
			}else{
				deviceSource = [
					{id: 0, ip: "0.0.0.0", nameDevice:"Humidity Device Name", state:"off"},
					{id: 0, ip: "0.0.0.0", nameDevice:"Temperature Device Name", state:"off"},
					{id: 0, ip: "0.0.0.0", nameDevice:"Air-Conditioner Name", state:"off"},
					{id: 0, ip: "0.0.0.0", nameDevice:"Heating Equipment Name", state:"off"},
					{id: 0, ip: "0.0.0.0", nameDevice:"Nebulizer Name", state:"off"},
					{id: 0, ip: "0.0.0.0", nameDevice:"Dehumidifier Name", state:"off"}
				] 
				createTableDevice(deviceSource);
			}
			$(".close-detailroom").click(function(){
				closeDetailRoom();
			})
		})
	}

	function closeDetailRoom(){
		$("#grid").remove();
	}

	function validate( ipaddress ) {//check here
	    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
		    return (true)  
		}else return false;
	}

	function listenSaveDevice(){
		$(".save-btn").click(function(){
			var listDevice = [];
			var listDeviceSave = [];
			var checksameip = false;
			var nameHome = $(".thisroom").text();
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
					url: "http://localhost/smarthome/savedevice/"+$(".detailroomname").text() + "/" + $(".username").text()+ "/" + nameHome//falses
				}).done(function(data, textStatus, xhr){
					status_create = xhr.status;
				}).fail(function(data, textStatus, xhr){
					status_create = data.status;
				});

				if(status_create == 201){
	    			alert("Save success")
	    			var home = getHome(nameHome);
	    			for(var i = 0; i<home.rooms.length; i++){
	    				if(home.rooms[i].nameRoom === $(".detailroomname").text()){
	    					loadDevice(home.rooms[i].devices);
	    					return;
	    				}
	    			}

	    		}else if(status_create == 302){
	    			alert("The Ip is exits, please use another Ip")
	    		}
				scheduleTempHumi($(".detailroomname").text());
			}
		})
	}

	function loadDevice(listDevice){
		var loadListDevice = [];
		for(var i =0; i<listDevice.length; i++){
			loadListDevice.push(listDevice[i]);

			closeDetailRoom();
			$(".content-gird").append('<div id="grid"></div>');
			createTableDevice(loadListDevice);
		}
	}

	function addDevice(){
		$(".adddevice-btn").click(function(){
			deviceSource.push({id: 0, ip: "0.0.0.0", nameDevice:"Humidity Device Name", state:"off"})
			closeDetailRoom();
			$(".content-gird").append('<div id="grid"></div>');
			createTableDevice(deviceSource);
		})
	}

	function setHumiTempForRoom(roomcount){
		$(".set-btn"+roomcount).click(function(){
			setHumiAndTemp();
		})
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
							+'<h5 class="pink-text"><i class="fa fa-pie-chart"></i> Report</h5>'
							+'<h3 class="card-title pt-2 nameroom'+roomcount+'">'+roomname+'</h3>'
							+'<div>'
								+'<table class="table">'
									+'<thead>'
										+'<tr>'
											+'<th scope="col">#</th>'
											+'<th scope="col">InSide</th>'
											+'<th scope="col">OutSide</th>'
										+'</tr>'
									+'</thead>'
									+'<tbody>'
										+'<tr>'
											+'<td>Temperature(°C)</td>'
											+'<td class="tempertaureIn'+roomname+'"></td>'
											+'<td class="tempertaureOut'+roomname+'"></td>'
										+'</tr>'
										+'<tr>'
											+'<td>Humidity(&#37;)</td>'
											+'<td class = "humidityIn'+roomname+'"></td>'
											+'<td class = "humidityOut'+roomname+'"></td>'
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

