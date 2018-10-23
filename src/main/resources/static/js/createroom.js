
 $(document).ready(function(){
 	var userinfo, homeinfo;
 	var getHomeName, getUserName;
 	var countroom = 0, status_create, counthome = 0;
 	var temperture_humidity;
 	$(".createroom").load("model_createroom.html");
 	$(".detailroom").load("modal_detailroom.html");
 	var hasStorage = ("sessionStorage" in window && window.sessionStorage),
		storageKey = "sessionUser",
    	now, expiration, dataStorage = false;
    checkSessionUser();
    addHomeToList(getUser(getUserName).home, counthome);
    loadRoomOfHome(getHome(getHomeName).rooms);
    addRoom();

    for(var count =0; count<=counthome; count++){
    	swichHome(count);
    }
    getTempatureHumidity();
    setTemperatureOut();
    setHumidityOut();
    setTemperatureIn();
    setHumidityIn();

    setInterval(function(){checkSessionUser();}, 3000000);
    setInterval(function(){
    	getTempatureHumidity();
    	setTemperatureOut();
    	setHumidityOut();
    	setTemperatureIn();
    	setHumidityIn();
    }, 5000);

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
    		loadRoomOfHome(getHome($(this).text()).rooms);//review here
    	})
	}

    function getHome(homename){
    	$.ajax({
		async : false,
		method: "get",
		contentType: "application/json",
		url: "http://localhost/smarthome/gethome/"+homename
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
    		detailRoom(countroom);
    		deleteRoom(countroom,listroom[countroom].nameRoom);
    	}
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
			url: "http://localhost/smarthome/createroom/"+$('.thisroom').text()
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
			url: "http://localhost/smarthome/deleteroom/"+nameroom
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

	function setTemperatureOut(){
		for(var temp = 0; temp<countroom; temp++){
			$(".tempertaureOut"+temp).html(temperture_humidity[0].temperature);
		}
	}

	function setHumidityOut(){
		for(var temp = 0; temp<countroom; temp++){
			$(".humidityOut"+temp).html(temperture_humidity[1].humidity);
		}
	}

	function setTemperatureIn(){
		for(var temp = 0; temp<countroom; temp++){
			$(".tempertaureIn"+temp).html(Math.floor(Math.random()*100)-50);
		}
	}

	function setHumidityIn(){
		for(var temp = 0; temp<countroom; temp++){
			$(".humidityIn"+temp).html(Math.floor(Math.random()*100)-50);
		}
	}

	function detailRoom(roomcount){// REVIEW THIS FUNCTION, CALL FUNCTION FROM ANOTHER JS FILE
		$(".detail-btn"+roomcount).click(function(){
			var listroom = homeinfo.rooms;
			var deviceSource;
			for(var list = 0; list<listroom.length; list++){
				if($(".nameroom"+roomcount).text() == listroom[list].devices.nameDevice){
					deviceSource = listroom[list];
					break;
				}
			}
			// localStorage.setItem('dataDevice', deviceSource);
		})
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
											+'<td class="tempertaureIn'+roomcount+'"></td>'
											+'<td class="tempertaureOut'+roomcount+'"></td>'
										+'</tr>'
										+'<tr>'
											+'<td>Humidity(&#37;)</td>'
											+'<td class = "humidityIn'+roomcount+'"></td>'
											+'<td class = "humidityOut'+roomcount+'"></td>'
										+'</tr>'
									+'</tbody>'
								+'</table>'
							+'</div>'
							+'<button type="button" data-toggle="modal" data-target="#modaldetailroom" class="btn btn-default detail-btn'+roomcount+'">Detail</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		)
	}
 });

// 	$(".roomDetail").load("detailroom.html");
// 	$(".tableDecive").load("componentroom.html", function(){
// 		getDeviceHome();
// 	});

// 	var getNameHome = localStorage.getItem("storageNameHome");
// 	var dataHome;
// 	var status_create;
// 	var loadRoom = 0;
// 	var dataRoomGet;
// 	var listRoom;
// 	var nameRoom;
// 	var idRoom;

// 	$(".room-table").hide();

// 	//Begin get home
// 	$.ajax({
// 		//async : false,
// 		method: "get",
// 		contentType: "application/json",
// 		url: "http://localhost:8080/smarthome/gethome/"+getNameHome,
// 	}).done(function(data, textStatus, xhr){
// 		dataHome = data;
// 	});
// 	//End get Home


// 	// //Begin list room
// 	// $.ajax({
// 	// 	async : false,
// 	// 	method: "get",
// 	// 	contentType: "application/json",
// 	// 	url: "http://localhost:8080/smarthome/getlistrooms/"+ getNameHome,
// 	// }).done(function(data, textStatus, xhr){
// 	// 	listRoom = data;
// 	// });
// 	// //End get list room

// 	// for(loadRoom; loadRoom < listRoom.length; loadRoom++){
// 	// 	appendRoom(loadRoom);
// 	// 	$(".nameroom"+loadRoom).val(listRoom[loadRoom].nameRoom);
// 	// 	$(".idroom"+loadRoom).val(listRoom[loadRoom].id);
// 	// 	saveRoom(loadRoom);
// 	// 	deleteRoom(loadRoom);
// 	// 	roomDetail(loadRoom);
// 	// }

// 	function appendRoom(countRoom){
//   		$(".table-room").append(
//   			"<tr class = 'row"+countRoom+"'>"
//   				+ "<td class = 'roomnamecol'>"
// 	  				+ "<input placeholder='Room Name' type='text' id='nameroom' class='form-control nameroom"+countRoom+"'>"
// 	  				+ "<input type='hidden' class='idroom"+countRoom+"'>"
//   				+ "</td>"

//   				+ "<td class = 'componentcol'>"
//   					+ "<a class='trigger info-color text-white detail"+countRoom+"' data-toggle='modal' data-target='.roomDetail'>Detail<i class='fa'></i></a>"
//   				+ "</td>"

//   				+ "<td class = 'homenamecol'>"
//   					+ "<p class = 'homename'>"+getNameHome+"</p>"
//   				+ "</td>"

//   				+ "<td class = 'closecol'>"
// 	  				+ "<a><i class='fa fa-save mx-1 btn-saveRoom"+countRoom+"'></i></a>"
// 	  				+ "<a><i class='fa fa-times mx-1 delete-btn"+countRoom+"'></i></a>"
//   				+ "</td>"
//   			+"</tr>");
//   		$(".room-table").show();
// 	}

// 	function deleteRoom(deleteCountRoom){
// 		$(".delete-btn"+deleteCountRoom).click(function(){
// 			nameRoom = $(".nameroom"+ deleteCountRoom).val();
// 			idRoom = parseInt($(".idroom"+ deleteCountRoom).val());
// 			$(".row"+deleteCountRoom).remove();
			
// 			//Begin delete room
// 		    $.ajax({
// 				method: "post",
// 				data: JSON.stringify({id: idRoom, nameRoom:nameRoom }),
// 				contentType: "application/json",
// 				url: "http://localhost:8080/smarthome/deleteroom"
// 			}).done(function(data, textStatus, xhr){
// 				status_create = xhr.status;
// 			});
// 		// //End delete room
// 		});
// 	}

// 	function saveRoom(saveCount){
// 		$(".btn-saveRoom"+saveCount).click(function(){
//   			nameRoom = $(".nameroom"+ saveCount).val();
//   			idRoom = parseInt($(".idroom"+ saveCount).val());
//   			if(isNaN(idRoom)|| idRoom == null){
//   				idRoom = 0;
//   			}
//   			//Begin create room
// 		    $.ajax({
// 				method: "post",
// 				data: JSON.stringify({ id: idRoom, homeId:dataHome, nameRoom:nameRoom }),
// 				contentType: "application/json",
// 				url: "http://localhost:8080/smarthome/createroom"
// 			}).done(function(data, textStatus, xhr){
// 				status_create = xhr.status;
// 			});
// 			//End create room
// 			getRoom(saveCount);
// 		});
// 	}

// 	function saveDevice(){
// 		$(".btn-saveDevice").click(function(){
// 			getDeviceSave();
// 		});
// //		$(".btn-saveDevice").click(
// //			$.ajax({
// //				method: "post",
// //				contentType: "application/json",
// //				url:"",
// //				data: getDeviceSave()
// //			}).done(function(){
// //
// //			})
// //		);
// 	}

// 	function getDeviceSave(){
// 		var listDevice = [];
// 		for(var tablecount = 0; tablecount<($(".Device tr").length -1); tablecount++){
// 			var tempListDevice = JSON.parse('{"ip": "'+$(".IP").val()+'" , "nameDecive": "'+$("#devicesName").val()+'", "roomId": "'+dataRoomGet+'"}');
// 			listDevice.push(tempListDevice);
// 		}
// 		return listDevice;
// 	}

// 	function deleteDevice(deviceCount){
// 		$(".delete-btn"+deviceCount).click(function(){
// 			$("#device"+deviceCount).remove();
// 		});
// 	}

// 	function getRoom(getRoomCount){
// 	    $.ajax({
// 		async : false,
// 		method: "get",
// 		contentType: "application/json",
// 		url: "http://localhost:8080/smarthome/getroom/"+ nameRoom
// 	    }).done(function(data, textStatus, xhr){
// 			dataRoomGet = data;
// 		});
// 		// Set value for fields value 
// 		$(".nameroom"+getRoomCount).val(dataRoomGet.nameRoom);
// 		$(".idroom"+getRoomCount).val(dataRoomGet.id);
// 	}


// 	function roomDetail(roomDetailCount){
// 		$(".detail"+roomDetailCount).click(function(){
// 			nameRoom = $(".nameroom"+roomDetailCount).val();
// 			getRoom(roomDetailCount);
// 			$(".roomName").html($(".nameroom"+ dataRoomGet.nameRoom).val());
// 		});
// 	}

// 	function getDeviceHome(){
// 		$(".btn-ok").click(function(){
// 			if(($('.Device tr').length - 1)>0){
// 				addcomponent($('.Device tr').length - 1);
// 				upAndDown();
// 			}else{
// 				addcomponent(0);
// 				upAndDown();
// 			}
// 			saveDevice();
// 		});
// 	}

// 	function addcomponent(deviceCount){
// 		var componentArray = [];
// 		$(".component-check:checked").each(function(){
// 			var deviceNumber = $(("#"+$(this).val()).replace(/ /g, '')).val();
// 			while(deviceNumber>0){
// 				componentArray.push($(this).val());
// 				deviceNumber--;
// 			};
// 			$(".component-check").prop('checked', false);
// 		});
// 		var test = getTempatureHumidity();
// 		$.each(componentArray, function(index, value){
// 			switch(value){
// 				case 'Humidity Device':
// 					addDevice(value, deviceCount, 0, test[0].temperature , "checked");
// 					controlDevice(deviceCount);
// 					deleteDevice(deviceCount);
// 					break;
// 				case 'Temperature Device':
// 					addDevice(value, deviceCount, test[1].humidity, 0, "checked");
// 					controlDevice(deviceCount);
// 					deleteDevice(deviceCount);
// 					break;
// 				case 'Air-Conditioner':
// 					addDevice(value, deviceCount, 0, 0, "");
// 					controlDevice(deviceCount);
// 					deleteDevice(deviceCount);
// 					break;
// 				case 'Heating Equipment':
// 					addDevice(value, deviceCount, 0, 0, "");
// 					controlDevice(deviceCount);
// 					deleteDevice(deviceCount);
// 					break;
// 				case 'Nebulizer':
// 					addDevice(value, deviceCount, 0, 0, "");
// 					controlDevice(deviceCount);
// 					deleteDevice(deviceCount);
// 					break;
// 				case 'Dehumidifier':
// 					addDevice(value, deviceCount, 0, 0, "");
// 					controlDevice(deviceCount);
// 					deleteDevice(deviceCount);               
// 					break;
// 			}
// 			deviceCount++;
// 		});
// 	}


// 	function addDevice(deviceName, deviceCount, temperature, humidity, state){
// 		$(".roomDetailTable").append(
//   			"<tr class = 'row"+deviceCount+"' id = 'device"+deviceCount+"'>"
//   				+ "<td class = 'ipDevice'>"
//   					+ "<input type='text' placeholder ='0.0.0.0' class='form-control IP IPDevice"+deviceCount+"'>"
//   				+ "</td>"

//   				+ "<td class = 'deviceNameCol'>"
// 	  				+ "<input type='text' placeholder = '"+deviceName+"' id='devicesName' class='form-control deviceName"+deviceCount+"'>"
//   				+ "</td>"

//   				+ "<td class = 'temperatureCol'>"
//   					+ "<p class = 'temperature'>"+temperature+"°C</p>"
//   				+ "</td>"

//   				+ "<td class = 'humidityCol'>"
//   					+ "<p class = 'humidity'>"+humidity+"%</p>"
//   				+ "</td>"

//   				+ "<td class = 'stateCol'>"
// 	  				+ "<lable class='bs-switch sm-switch"+deviceCount+"'>"
// 	  					+ "<input type = 'checkbox' class = 'switch"+deviceCount+"' "+state+">"
// 	  					+ "<span class = 'slider round'></span>"
// 	  				+ "</lable>"
//   				+ "</td>"

//   				+ "<td class = 'closecol'>"
// 	  				+ "<a><i class='fa fa-times mx-1 delete-btn"+deviceCount+"'></i></a>"
//   				+ "</td>"
//   			+"</tr>");
// 	}

// 	function controlDevice(deviceCount){
// 		$(".sm-switch"+deviceCount).click(function(){
// 			if($(".switch"+deviceCount).is(':checked'))
// 				$(".switch"+deviceCount).attr("checked", false);
// 			else
// 				$(".switch"+deviceCount).attr("checked", true);
// 		});
// 	}

// 	function upAndDown(){
// 		$("#btn-up-humidityDevice, #btn-up-temperatureDevice, #btn-up-airConditioner, #btn-up-heatingEquipment, #btn-up-nebulizer, #btn-up-dehumidifier").click(function(){
// 			switch($(this).attr("id")){
// 				case 'btn-up-humidityDevice':
// 					setGetValue("humidityDevice", 1);
// 					break;
// 				case 'btn-up-temperatureDevice':
// 					setGetValue("temperatureDevice", 1);
// 					break;
// 				case 'btn-up-airConditioner':
// 					setGetValue("airConditioner", 1);
// 					break;
// 				case 'btn-up-heatingEquipment':
// 					setGetValue("heatingEquipment", 1);
// 					break;
// 				case 'btn-up-nebulizer':
// 					setGetValue("nebulizer", 1);
// 					break;
// 				case 'btn-up-dehumidifier':
// 					setGetValue("dehumidifier", 1);
// 					break;
// 			}
// 		});
// 		$("#btn-down-humidityDevice, #btn-down-temperatureDevice, #btn-down-airConditioner, #btn-down-heatingEquipment, #btn-down-nebulizer, #btn-down-dehumidifier").click(function(){
// 			switch($(this).attr("id")){
// 				case 'btn-down-humidityDevice':
// 					setGetValue("humidityDevice", 0);
// 					break;
// 				case 'btn-down-temperatureDevice':
// 					setGetValue("temperatureDevice", 0);
// 					break;
// 				case 'btn-down-airConditioner':
// 					setGetValue("airConditioner", 0);
// 					break;
// 				case 'btn-down-heatingEquipment':
// 					setGetValue("heatingEquipment", 0);
// 					break;
// 				case 'btn-down-nebulizer':
// 					setGetValue("nebulizer", 0);
// 					break;
// 				case 'btn-down-dehumidifier':
// 					setGetValue("dehumidifier", 0);
// 					break;
// 			}
// 		});
// 	}

// 	function setGetValue(nameDecive, checkupdown){
// 		var value = $("."+nameDecive).val();
// 		if(checkupdown == 1){
// 			value++;
// 		}
// 		else if (value >1){
// 			value--;
// 		}
// 		$("."+nameDecive).val(value);
// 	}

// 	function getTempatureHumidity(){
// 		var temperture_humidity;
// 		$.ajax({
// 			async:false,
// 			url: "https://api.openweathermap.org/data/2.5/weather?q=Ho%20Chi%20Minh%20City,VN&APPID=efe6e214a09caa3cd0319cef3384a9fd&units=metric"
// 		}).done(function(data, textStatus, xhr){
// 			var temperHumi = '[{"temperature":"'+data.main.temp+'"}, {"humidity": "'+data.main.humidity+'"}]';
// 			temperture_humidity = JSON.parse(temperHumi);
// 		});
// 		return temperture_humidity;
// 	}

//   	$(".add-btn").click(function(){
//   		appendRoom(loadRoom + 1);
//  		saveRoom(loadRoom + 1);
//  		deleteRoom(loadRoom + 1);
//  		roomDetail(loadRoom + 1);
//  		getDeviceHome();
// 		loadRoom++;
//   	});
