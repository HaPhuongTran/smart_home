package com.sm.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.sm.entity.InfoDevice;
@RestController
@CrossOrigin
@RequestMapping("/smarthome")
public class SocketController {
	final int serverPort = 3333;
	final String ipServer = "127.0.0.1";
	
	@RequestMapping(value = "/control", method = RequestMethod.POST, headers="Accept=application/json")
	public void ControlDevice(@RequestBody InfoDevice deviceInfo){
		 try {
			 Socket socket = new Socket(ipServer,serverPort);
			 InputStream  input = socket.getInputStream();
			 OutputStream output = socket.getOutputStream();
			 if(deviceInfo.getTime() == 0) {
				 socket.setSoTimeout(10*1000);
			 }
		 }catch(IOException e) {
			 System.err.print(e);
		 }
			
	}

}
