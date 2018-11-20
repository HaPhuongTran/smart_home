
function createTableDevice(datasource, listIdIntervalSaveDevice){
    $("#grid").shieldGrid({
        dataSource: {
            data: datasource,
            schema: {
                fields:{
                	id: {path: "id", type: Number},
					ip: {path:"ip", type: String},
                    subnetMask: {path:"subnetMask", type: String},
                    gateway: {path:"gateway", type: String},
					nameDevice: {path:"nameDevice", type: String},
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
            { field: "subnetMask", title: "Device Subnet", width: "120px" },
            { field: "gateway", title: "Device Gateway", width: "120px" },
			{ field: "nameDevice", title: "Device Name", width: "120px" },
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
                            var nameRoom = $(".detailroomname").text();

                            if(status_create === 200 && item.type === "Temperature Device"){
                                $(".tempertaureIn"+nameRoom).html('');
                                    clearIntervalDevice(listIdIntervalSaveDevice, nameRoom,item.ip );
                            }
                            if(status_create === 200 && item.type === "Humidity Device"){
                                $(".humidityIn"+nameRoom).html('');
                                    clearIntervalDevice(listIdIntervalSaveDevice, nameRoom, item.ip );
                            }
                            return "Delete row with IP = " + item.ip;  
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

function clearIntervalDevice(listIdIntervalSaveDevice, nameRoom, ipItem){
    if(listIdIntervalSaveDevice != undefined && listIdIntervalSaveDevice.length>0){
        for(var i = 0; i<listIdIntervalSaveDevice.length; i++){
            if(listIdIntervalSaveDevice[i].nameroom === nameRoom && listIdIntervalSaveDevice[i].ipDevice === ipItem){
                clearInterval(listIdIntervalSaveDevice[i].id);
                listIdIntervalSaveDevice.splice(i,1);
            }
        }
    }
}

function myCustomEditor(cell, item) {
$('<div id="dropdown"/>')
  .appendTo(cell)
  .shieldDropDown({
    dataSource: {
      data: ["Dehumidifier", "Heating Equipment", "Air-Conditioner", "Temperature Device", "Humidity Device"]
    },
    value: !item["transport"] ? null : item["transport"].toString()
  }).swidget().focus();
}

