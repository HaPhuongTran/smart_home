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
import com.sm.entity.HomeProject;
import com.sm.entity.Report;
import com.sm.entity.Rooms;
import com.sm.service.AccountService;
import com.sm.service.ReportService;

@RestController
@CrossOrigin
@RequestMapping("/smarthome")
public class ReportController {
	
	@Autowired
	ReportService reportService;
	
	@Autowired
	AccountService accountService;
	@RequestMapping(value = "/savereport/{room_name}/{user_name}/{home_name}", method = RequestMethod.POST)
	public ResponseEntity<HttpStatus> createDevices( @RequestBody Report report, @PathVariable("room_name") String room_name, @PathVariable("user_name") String user,  @PathVariable("home_name") String home){
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
				report.setRoomIdReport(room);
				report.setDate(java.time.LocalDate.now());
				report.setTime(java.time.LocalTime.now());
				reportService.save(report);
				break;
			}
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
}
