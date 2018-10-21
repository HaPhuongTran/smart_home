$(document).ready(function(){

	var status_create;
	var userinfo;
	var getUserName;
	$(".createhome").load("model_createhome.html");
	var hasStorage = ("sessionStorage" in window && window.sessionStorage),
		storageKey = "sessionUser",
    	now, expiration, dataStorage = false;
    checkSessionUser();
    addListHomeInSelect();

    setInterval(function(){checkSessionUser();}, 3600000);

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
	            	getUserName = dataStorage.userData.username;
	            }
	    	}
    	}
    }

    function addListHomeInSelect(){
    	appendOption(getListHome());

    }

    function appendOption(listhome){
    	for(var list = 0; list<listhome.length; list++){
    		$(".select-home").append(
    			'<option value='+listhome[list].nameHome+'>'+listhome[list].nameHome+'</option>'
    		)
    	}
    }
    function getListHome(){
    	var listHome = getUser(getUserName).home;
		return listHome;
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

	$(".btn-create").click(function(){
		createHome();
	})

	$(".btn-ok").click(function(){
		var homename = $( ".select-home option:selected" ).text();
		insidehome(homename);
	});

    function createHome(){
    	$(".ok-btn").click(function(){
    		var homeName = $(".homename").val();
    		$.ajax({
			async : false,
			method: "post",
			data: JSON.stringify({ nameHome:homeName}),
			contentType: "application/json",
			url: "http://localhost/smarthome/createhome/"+ getUserName
			}).done(function(data, textStatus, xhr){
				status_create = xhr.status;
			}).fail(function(data, textStatus, xhr){
				 status_create = data.status;
			});
			getInfoCreateHome(status_create);
    	})
    }

    function getInfoCreateHome(info){
    	if(info == 201){
    		var homename = $(".homename").val();
    		insidehome(homename);
    	}else if(info == 302){
    		$("p.anncounce").css("display", "block");
    	}
    }

    function insidehome(homename){
    	var sessionUser = {
				    expirestime: dataStorage.expirestime,
				    userData: {
				        homename: homename,
				        username: dataStorage.userData.username
				    }
				}
    	sessionStorage.setItem('sessionUser', JSON.stringify(sessionUser));
    	document.location.href = "newroom.html";
    }

	// var homenum=0;
	// $(".addhome-btn").click(function(){
	// 	setHomeName();
	// });
	// var listHome = getUser(getUserName).home;
	// for(homenum; homenum<listHome.lenght; homenum++){
	// 	appendHome(homenum,listHome[homenum].nameHome);
	// 	$(".nameHome"+homenum).val(listHome[homenum].nameHome);
	// 	$(".idHome"+homenum).val(listHome[homenum].idHome);
	// 	deleteHome(homenum);
	// 	detailHome(homenum);
	// }

	// function getUser(username){
	// 	$.ajax({
	// 	async : false,
	// 	method: "get",
	// 	contentType: "application/json",
	// 	url: "http://localhost/getaccount/"+username
	// 	}).done(function(data, textStatus, xhr){
	// 		userinfo = data;
	// 	});
	// 	return userinfo;
	// }

	// function saveHome(nameHome){
	// 	$.ajax({
	// 		async : false,
	// 		method: "post",
	// 		data: JSON.stringify({ nameHome:nameHome}),
	// 		contentType: "application/json",
	// 		url: "http://localhost/smarthome/createhome/"+ getUserName
	// 	}).done(function(data, textStatus, xhr){
	// 		status_create = xhr.status;
	// 	}).fail(function(data, textStatus, xhr){
	// 		 status_create = data.status;
	// 	});
	// 	return status_create;
	// }

	// function getHome(nameHome, homecount){
	// 	$.ajax({
	// 		async : false,
	// 		method: "get",
	// 		contentType: "application/json",
	// 		url: "http://localhost/smarthome/gethome/"+nameHome
	// 	}).done(function(data, textStatus, xhr){
	// 		home = data;
	// 	});
	// 	$(".nameHome"+homecount).html(home.nameHome);
	// 	$(".idHome"+homecount).html(home.idHome);
	// }

	// function getListHome(){
	// 	$.ajax({
	// 		async : false,
	// 		method: "get",
	// 		contentType: "application/json",
	// 		url: "http://localhost/smarthome/gethome/"+nameHome
	// 	}).done(function(data, textStatus, xhr){
	// 		home = data;
	// 	})
	// }

	// function setHomeName(){
	// 	$(".ok-btn").click(function(){
	// 		var homename = $(".homename").val();
	// 		if(saveHome(homename)==302){
	// 			$("p.anncounce").css("display", "block");
	// 		}else{
	// 			appendHome(homenum, homename);
	// 			getHome(homename, homenum);
	// 			deleteHome(homenum);
	// 		}
	// 	})
	// 	homenum++;
	// }

	// function deleteHome(homecount){
	// 	$(".del-btn"+homecount).click(function(){
	// 		var idhome = $(".idHome"+homecount).val();
	// 		$.ajax({
	// 			method: "delete",
	// 			data: JSON.stringify({ idHome:idhome }),
	// 			contentType: "application/json",
	// 			url: "http://localhost/smarthome/deletehome/"+idhome
	// 		}).done(function(data, textStatus, xhr){
	// 			status_create = xhr.status;
	// 		}).fail(function(data, textStatus, xhr){
	// 			 status_create = data.status;
	// 		});
	// 		if(status_create==200){
	// 			$(".homeobject"+homecount).remove();
	// 		}
	// 	})
	// }//review here

	// function detailHome(homecount){
	// 	$(".detail-btn"+homecount).click(function(){
	// 		document.location.href = "newroom.html"
	// 	})
	// }

	// function appendHome(homecount, homename){
	// 	$(".row").append(
	// 		'<div class="col-sm-4 homeobject'+homecount+'" style= "padding-bottom:20px !important;">'
	// 			+'<div class="card">'
	// 				+'<div class="view overlay">'
	// 					+'<a><div class="mask rgba-white-slight"></div></a>'
	// 				+'</div>'
	// 				+'<div class="card-body elegant-color white-text rounded-bottom">'
	// 					+'<a class="activator waves-effect mr-4"><i class="fa fa-share-alt white-text"></i></a>'
	// 					+'<h4 class="card-title nameHome'+homecount+'">'+homename+'</h4>'
	// 					+'<h4 class="card-title idHome'+homecount+'" id = "homeid"></h4>'
	// 					+'<hr class="hr-light">'
	// 					+'<p class="card-text white-text mb-4">Some quick example</p>'
	// 					+'<a href="#" class="btn btn-primary detail-btn'+homecount+'">Detail</a>'
	// 					+'<a href="#" class="btn btn-primary del-btn'+homecount+'" id= "btn-delete">Delete</a>'
	// 					+'<a href="#" class="btn btn-primary edit-btn'+homecount+'" id= "btn-delete">Edit</a>'
	// 				+'</div>'
	// 			+'</div>'
	// 		+'</div>'
	// 	)
	// }
});
