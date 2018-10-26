package com.sm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.sm.entity.Device;
import com.sm.entity.Rooms;
import com.sm.service.DeviceService;
import com.sm.service.RoomService;

@RestController
@CrossOrigin
@RequestMapping("/smarthome")
public class DeviceController {
	
	@Autowired
	DeviceService deviceService;
	
	@Autowired
	RoomService roomService;

	@RequestMapping(value = "/savedevice/{room_name}", method = RequestMethod.POST)
	public ResponseEntity<HttpStatus> createDevices( @RequestBody List<Device> devices, @PathVariable("room_name") String room_name){
		Rooms room = roomService.getRoom(room_name);
		for( Device device : devices){
			device.setRoomId(room);
		}
		if(deviceService.saveOrUpdate(devices, room)) {
			return new ResponseEntity<>(HttpStatus.CREATED);
		}else {
			return new ResponseEntity<>(HttpStatus.FOUND);
		}
		
	}
	
	@RequestMapping(value = "/deletedevice/{room_name}", method = RequestMethod.DELETE)
	public ResponseEntity<HttpStatus> getDevices( @RequestBody Device device, @PathVariable("room_name") String room_name){
		Rooms  room = roomService.getRoom(room_name);
		device.setRoomId(room);
		try {
		deviceService.deleteDevice(device);}
		catch(Exception e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
