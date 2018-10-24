// $(document).ready(function () {
//	var initDataSource = [
//						{id: 0, ip: "0.0.0.0", name:"Humidity Device Name", state:"off"},
//						{id: 0, ip: "0.0.0.0", name:"Temperature Device Name", state:"off"},
//						{id: 0, ip: "0.0.0.0", name:"Air-Conditioner Name", state:"off"},
//						{id: 0, ip: "0.0.0.0", name:"Heating Equipment Name", state:"off"},
//						{id: 0, ip: "0.0.0.0", name:"Nebulizer Name", state:"off"},
//						{id: 0, ip: "0.0.0.0", name:"Dehumidifier Name", state:"off"}
//					] 
	// var getDataDevice = localStorage.getItem('dataDevice');
	// if(getDataDevice != null){
	// 	createTableDevice(getDataDevice);
	// }else{
	// 	createTableDevice(initDataSource);
	// }

	function createTableDevice(datasource){
	    $("#grid").shieldGrid({
	        dataSource: {
	            data: datasource,
	            schema: {
	                fields:{
						ip: {path:"ip", type: String},
						nameDevice: {path:"nameDevice", type: String},
						state: {path: "state", type: String},
						type: {path: "type", type: String}
					}
	            }
	        },
	        sorting: {
	            multiple: true
	        },
	        rowHover: false,
	        columns: [
	            { field: "ip", title: "Device IP", width: "120px" },
				{ field: "nameDevice", title: "Device Name", width: "120px" },
				{ field: "state", title: "State", width: "120px"},
				{ field: "type", title: "Type of device", width: "120px", editor:myCustomEditor},
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
	        },
	        events: {
		      getCustomEditorValue: function(e) {
		        e.value = $("#dropdown").swidget().value();
		        $("#dropdown").swidget().destroy();
		      }
		    }            
	    });
	}

function myCustomEditor(cell, item) {
    $('<div id="dropdown"/>')
      .appendTo(cell)
      .shieldDropDown({
        dataSource: {
          data: ["Dehumidifier", "Nebulizer", "Heating Equipment", "Air-Conditioner", "Temperature Device", "Humidity Device"]
        },
        value: !item["transport"] ? null : item["transport"].toString()
      }).swidget().focus();
  }
   
// });