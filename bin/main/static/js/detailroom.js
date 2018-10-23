$(document).ready(function () {
	var initDataSource = [
						{id: 0, ip: "0.0.0.0", name:"Humidity Device Name", state:"off", temparture:0, humidity: 0},
						{id: 0, ip: "0.0.0.0", name:"Temperature Device Name", state:"off"},
						{id: 0, ip: "0.0.0.0", name:"Air-Conditioner Name", state:"off"},
						{id: 0, ip: "0.0.0.0", name:"Heating Equipment Name", state:"off"},
						{id: 0, ip: "0.0.0.0", name:"Nebulizer Name", state:"off"},
						{id: 0, ip: "0.0.0.0", name:"Dehumidifier Name", state:"off"}
					] 
	var getDataDevice = localStorage.getItem('dataDevice');
	if(getDataDevice != null){
		createTableDevice(getDataDevice);
	}else{
		createTableDevice(initDataSource);
	}

	function createTableDevice(datasource){
	    $("#grid").shieldGrid({
	        dataSource: {
	            data: datasource,
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
	        columns: [
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
	        editing: {
	            enabled: true,
	            mode: "popup",
	            confirmation: {
	                "delete": {
	                    enabled: true,
	                    template: function (item) {
	                        return "Delete row with ID = " + item.id
	                    }
	                }
	            }
	        }            
	    });
	}

   
});