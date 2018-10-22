package com.sm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.sm.entity.Device;
import com.sm.service.DeviceService;

@RestController
@CrossOrigin
@RequestMapping("/smarthome")
public class DeviceController {
	
	@Autowired
	DeviceService deviceService;

	@RequestMapping(value = "/savedevice", method = RequestMethod.POST)
	public ResponseEntity<HttpStatus> createDevices( @RequestBody List<Device> devices){
		deviceService.save(devices);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
//	@RequestMapping(value = "/getdevice", method = RequestMethod.GET)
//	public ResponseEntity<HttpStatus> getDevices( @RequestBody List<Device> devices){
//		deviceService.getDevice(devices);
//		return new ResponseEntity<>(HttpStatus.CREATED);
//	}
}
