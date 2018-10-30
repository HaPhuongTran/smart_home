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
import com.sm.entity.HumiTempUser;
import com.sm.entity.Rooms;
import com.sm.service.RoomService;
import com.sm.service.UserHumiTempService;

@RestController
@CrossOrigin
@RequestMapping("/smarthome")
public class UserHumiTemp {
	@Autowired
	UserHumiTempService userHumiTempService; 
	
	@Autowired
	RoomService roomService;
	
	@RequestMapping(value = "/savehumitempuser/{name_room}/{name_home}", method = RequestMethod.POST, headers="Accept=application/json")
	public ResponseEntity<HttpStatus> createRooms(@RequestBody HumiTempUser userHumiTemp, @PathVariable("name_home") String name_home, @PathVariable("name_room") String nameRoom){
		Boolean isexits = false;
//		HomeProject home = homeService.getHome(name_home, userName);
		Rooms room = roomService.getRoom(nameRoom, name_home);
		if(room!=null) {
			userHumiTemp.setRoomIdtemphumi(room);
			userHumiTempService.createHumiTempUser(userHumiTemp);
			return new ResponseEntity<>(HttpStatus.CREATED);
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
