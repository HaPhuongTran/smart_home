package com.sm.controller;

import java.util.List;
import java.util.Set;

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
import com.sm.entity.HomeProject;
import com.sm.entity.HumiTempUser;
import com.sm.entity.Report;
import com.sm.entity.Rooms;
import com.sm.service.HomeService;
import com.sm.service.ReportService;
import com.sm.service.RoomService;
import com.sm.service.UserHumiTempService;

@RestController
@CrossOrigin
@RequestMapping("/smarthome")
public class RoomController {
	
	@Autowired
	RoomService roomService;
	
	@Autowired
	HomeService homeService;
	
	@Autowired
	UserHumiTempService userHumiTempService;
	
	@Autowired
	ReportService reportService;
	
	@RequestMapping(value = "/getroom/{name_room}/{namehome}", method = RequestMethod.GET, headers="Accept=application/json")
	public Rooms getRoomByName(@PathVariable("name_room") String name_room, @PathVariable("namehome") String namehome){
		Rooms room =roomService.getRoom(name_room, namehome);
        return room;
	}
	
	@RequestMapping(value = "/createroom/{name_home}/{userName}", method = RequestMethod.POST, headers="Accept=application/json")
	public ResponseEntity<HttpStatus> createRooms(@RequestBody Rooms room, @PathVariable("name_home") String name_home, @PathVariable("userName") String userName){
		Boolean isexits = false;
		HomeProject home = homeService.getHome(name_home, userName);
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
	
//	@RequestMapping(value = "/getlistrooms/{name_home}", method = RequestMethod.GET, headers="Accept=application/json")
//	public List<Rooms> getListRoomByIdHome(@PathVariable("name_home") String name_home){
//		return roomService.getListRooms(name_home);
//	}
	
	@RequestMapping(value = "/deleteroom/{name_room}/{name_home}", method = RequestMethod.DELETE, headers="Accept=application/json")
	public ResponseEntity<HttpStatus> deleteRoom(@PathVariable("name_room") String name_room, @PathVariable("name_home") String name_home){
		Rooms rooms = roomService.getRoom(name_room, name_home);
		try {
			HumiTempUser humiTempUser = rooms.getHumitemp();
			if(humiTempUser != null) {
				userHumiTempService.deleteHumiTempUser(humiTempUser);
			}
		}catch(NullPointerException e) {}
		
		try {
			Set<Report> report = rooms.getReports();
			if(report != null && report.size()>0) {
				reportService.delete(rooms.getId());
			}
		}catch(NullPointerException e) {}
		
		Set<Device> devices = rooms.getDevices();
		if(devices.size()<=0) {
			roomService.deleteRoom (rooms);
			return new ResponseEntity<>(HttpStatus.OK);
		}else {
			return new ResponseEntity<>(HttpStatus.FOUND);
		}
		
	}
	
}
