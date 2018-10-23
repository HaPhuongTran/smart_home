$(document).ready(function (){
	$("#grid").shieldGrid({
		dataSource: {
			data:[//device source
				{id: 1, ip: "name1", name:"dfdd", state:"off", temparture:30, humidity: 50},
				{id: 1, ip: "name2", name:"dfdd", state:"off", temparture:20, humidity: 60}
			],
			schema: {
				fields:{
					ip: {path:"ip", type: String},
					name: {path:"name", type: String},
					state: {path: "state", type: String},
					temparture: {path: "temp", type: Number},
					humidity: {path: "humidity", type:Number}
				}
			}
		},
		sorting: {
			multiple: true
		},
		rowHover: false,
		columns:[
			{ field: "ip", title: "Device IP", width: "120px" },
			{ field: "name", title: "Device Name", width: "120px" },
			{ field: "state", title: "State", width: "120px"},
			{ field: "temparture", title : "Temparture", width: "120px"},
			{ field: "humidity", title: "Humidity", width: "120px"},
			{
                width: 150,
                title: "Update/Delete Column",
                buttons: [
                    { commandName: "edit", caption: "Edit" },
                    { commandName: "delete", caption: "Delete" }
                ],
                width: "100px"
            }
		],
		editting: {
			enable: true,
			mode:"popup",
			confirmation: {
				"delete": {
					enable: true,
					template: function(item){
						return "Delete device with ip:" + item.ip
					} 
				}
			}
		},

	})
})