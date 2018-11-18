// Animations init
new WOW().init();
$(document).ready(function(){
	var status_create = 0;
	$(".create-btn").click(function(){
		var nameHome = $("#namehome").val();

		$.ajax({
			async : false,
			method: "post",
			data: JSON.stringify({ nameHome:nameHome }),
			contentType: "application/json",
			url: "http://localhost:8080/smarthome/createhome"
		}).done(function(data, textStatus, xhr){
			status_create = xhr.status;
		});

		$.ajax({
			async : false,
			method: "post",
			data: JSON.stringify({ nameHome:nameHome, rooms:[]}),
			contentType: "application/json",
			url: "http://localhost:8080/smarthome/createhome"
		}).done(function(data, textStatus, xhr){
			status_create = xhr.status;
		});

		if(status_create == 201){
			localStorage.setItem("storageNameHome",nameHome);
			document.location.href = "newhome.html";
		}
	});
});