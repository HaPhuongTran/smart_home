// Animations init
new WOW().init();

$(document).ready(function(){
	var hasStorage = ("sessionStorage" in window && window.sessionStorage),
		storageKey = "sessionUser",
    	now, expiration, dataStorage = false;
    checkSessionUser();

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
	            	document.location.href = "newhome.html";
	            }
	    	}
    	}
    }

	$(".login-form").load("model_login.html");
	var username;
	var password;

	$(".alert").hide();
	var status_create = 0;

	$(".login").click(function(){
		listenLogin();
	});

	$(".signUp").click(function(){
		username = $(".uName").val();
		password = $(".pWord").val();
		var email = $(".uEmail").val();
		var checkUserPass = true;
		if(username.length < 6){
			$(".uName").css("border-color", "red");
			$(".inputname p").css("display", "block");
			checkUserPass = false;
		}
		if(password.length < 6){
			$(".pWord").css("border-color", "red");
			$(".inputpass p").css("display", "block");
			checkUserPass = false;
		}
		if(checkUserPass === true){
			createAccount(username, password,email);
		}
	});

	function listenLogin(){
		$(".login-btn").click(function(){
			username = $(".nameLogin").val();
			password = $(".passLogin").val();
			if(login(username, password)== 302){
				var sessionUser = {
				    expirestime: new Date(),
				    userData: {
				        username: username
				    }
				}
				sessionStorage.setItem('sessionUser', JSON.stringify(sessionUser));
				document.location.href = "newhome.html";
			}
			else{
				$("p.anncounce").css("display", "block");
				$("p.anncounce").removeAttr("text-align");
			}
		});
	}

	function login(username, password){
		$.ajax({
		async:false,
		method: "post",
		data: JSON.stringify({ userName: username, 	password:password}),
		contentType: "application/json",
		url: "http://localhost:80/login"
		})
		.done(function(data, textStatus, xhr){
			status_create = xhr.status;
		}).fail(function(data, textStatus, xhr){
			 status_create = data.status;
		});

		return status_create;
	}

	function createAccount(username, password, email){
		$.ajax({
		async:false,
		method: "post",
		data: JSON.stringify({ userName: username, 	password:password, email:email }),
		contentType: "application/json",
		url: "http://localhost/createaccount"
		}).done(function(data, textStatus, xhr){
			status_create = xhr.status;
		}).fail(function(data, textStatus, xhr){
			status_create = data.status;
		});
		signUpAccount();
	}

	function signUpAccount(){
		if(status_create == 201){
			$(".uName").css("border-color", "");
			$(".pWord").css("border-color", "");
			alertAnnounce("Create Account success. Please login to start!!!");
		}else if(status_create == 409){
			$(".uName").css("border-color", "red");
			alertAnnounce("Username already exist");
		}
	}

	function alertAnnounce(stringAnnounce){
		$(".alert strong").html(stringAnnounce);
		$(".alert").show('slow').delay(1000);
		$(".alert").hide('slow');
	}
});