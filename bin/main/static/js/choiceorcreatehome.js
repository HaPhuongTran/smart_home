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
		if(homename === null || homename.length<=0){
			alert("Please choice or create your home!!!")
		}else{
			insidehome(homename);
		}
		
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
});
