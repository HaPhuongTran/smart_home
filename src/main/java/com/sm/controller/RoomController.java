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

import com.sm.entity.HomeProject;
import com.sm.entity.Rooms;
import com.sm.service.HomeService;
import com.sm.service.RoomService;

@RestController
@CrossOrigin
@RequestMapping("/smarthome")
public class RoomController {
	
	@Autowired
	RoomService roomService;
	
	@Autowired
	HomeService homeService;
	
	
	@RequestMapping(value = "/getroom/{name_room}", method = RequestMethod.GET, headers="Accept=application/json")
	public Rooms getRoomByName(@PathVariable("name_room") String name_room){
		Rooms room =roomService.getRoom(name_room);
        return room;
	}
	
	@RequestMapping(value = "/createroom/{name_home}", method = RequestMethod.POST, headers="Accept=application/json")
	public ResponseEntity<HttpStatus> createRooms(@RequestBody Rooms room, @PathVariable("name_home") String name_home){
		Boolean isexits = false;
		HomeProject home = homeService.getHome(name_home);
		if(home!=null) {
			room.setHome(home);
			List<Rooms> listrooms = home.getRooms();
			for(Rooms rooms : listrooms) {
				if(rooms.getNameRoom().compareTo(room.getNameRoom())==0) {
					isexits = true;
					break;
				}
			}
			if(!isexits) {
				roomService.createRoom(room);
				return new ResponseEntity<>(HttpStatus.CREATED);
			}else {
				return new ResponseEntity<>(HttpStatus.FOUND);
			}
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@RequestMapping(value = "/getlistrooms/{name_home}", method = RequestMethod.GET, headers="Accept=application/json")
	public List<Rooms> getListRoomByIdHome(@PathVariable("name_home") String name_home){
		return roomService.getListRooms(name_home);
	}
	
	@RequestMapping(value = "/deleteroom", method = RequestMethod.POST, headers="Accept=application/json")
	public ResponseEntity<HttpStatus> deleteRoom(@RequestBody Rooms room){
		roomService.deleteRoom (room);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
}
