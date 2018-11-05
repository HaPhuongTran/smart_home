
function createTableDevice(datasource){
    $("#grid").shieldGrid({
        dataSource: {
            data: datasource,
            schema: {
                fields:{
                	id: {path: "id", type: Number},
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
        	{ field: "id", title: "Device ID", width: "120px" },
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
                        var confirmDelete = confirm("Are you sure deletr device with IP = " + item.ip )
                        if(confirmDelete === true){
                            $.ajax({
                                async : false,
                                method: "delete",
                                contentType: "application/json",
                                url: "http://localhost/smarthome/deletedevice/"+item.id
                            }).done(function(data, textStatus, xhr){
                                status_create = xhr.status;
                            }).fail(function(data, textStatus, xhr){
                                status_create = data.status;
                            });
                            return "Delete row with ID = " + item.id;  
                        }
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

