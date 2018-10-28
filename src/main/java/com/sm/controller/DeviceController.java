package com.sm.controller;

import java.util.ArrayList;
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

import com.sm.entity.Account;
import com.sm.entity.Device;
import com.sm.entity.HomeProject;
import com.sm.entity.Rooms;
import com.sm.service.AccountService;
import com.sm.service.DeviceService;
import com.sm.service.HomeService;
import com.sm.service.RoomService;

@RestController
@CrossOrigin
@RequestMapping("/smarthome")
public class DeviceController {
	
	@Autowired
	DeviceService deviceService;
	
	@Autowired
	AccountService accountService;
	
	@Autowired
	HomeService homeService;
	
	@Autowired
	RoomService roomService;

	@RequestMapping(value = "/savedevice/{room_name}/{user_name}/{home_name}", method = RequestMethod.POST)
	public ResponseEntity<HttpStatus> createDevices( @RequestBody List<Device> devices,@PathVariable("room_name") String room_name, @PathVariable("user_name") String user,  @PathVariable("home_name") String home){
		Account account = accountService.getAccountByName(user);
		List<HomeProject> homes = account.getHome();
		List<Rooms> rooms = new ArrayList<Rooms>();
		for(HomeProject eachhome : homes) {
			if(eachhome.getNameHome().equals(home)) {
				rooms = eachhome.getRooms();
			}
		}
		for(Rooms room: rooms) {
			if(room.getNameRoom().equals(room_name)) {
				for(Device device : devices) {
					device.setRoomId(room);
				}
				break;
			}
		}
		
		if(deviceService.saveOrUpdate(devices, rooms)) {
			return new ResponseEntity<>(HttpStatus.CREATED);
		}else {
			return new ResponseEntity<>(HttpStatus.FOUND);
		}

	}
	
	@RequestMapping(value = "/deletedevice/{id_device}", method = RequestMethod.DELETE)
	public ResponseEntity<HttpStatus> deleteDevices( @PathVariable("id_device") int id_device){
//		Rooms  room = roomService.getRoom(room_name);
//		device.setRoomId(room);
		deviceService.deleteDevice(id_device);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
