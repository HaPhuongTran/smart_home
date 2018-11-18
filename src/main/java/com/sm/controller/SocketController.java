package com.sm.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sm.entity.InfoDevice;
@RestController
@CrossOrigin
@RequestMapping("/smarthome")
public class SocketController {
	private static final int SERVERPORT = 3333;
	private static final String IP = "127.0.0.1";
	
	@PostMapping(value = "/control")
	public String controlDevice(@RequestBody InfoDevice deviceInfo){
		try(Socket socket = new Socket(IP, SERVERPORT);) {
			InputStream input = socket.getInputStream();
			OutputStream output = socket.getOutputStream();
			PrintWriter printWriter = new PrintWriter(output);
			JSONObject deviceInfoSentToServer = new JSONObject();
			deviceInfoSentToServer.put("fanLevel", deviceInfo.getFanLevel());
			deviceInfoSentToServer.put("humi", deviceInfo.getHumi());
			deviceInfoSentToServer.put("mode", deviceInfo.getMode());
			deviceInfoSentToServer.put("state", deviceInfo.getState());
			deviceInfoSentToServer.put("temp", deviceInfo.getTemp());
			deviceInfoSentToServer.put("time", deviceInfo.getTime());
			deviceInfoSentToServer.put("ip",deviceInfo.getIp());
			deviceInfoSentToServer.put("nameDevice", deviceInfo.getNameDevice());
			printWriter.println(deviceInfoSentToServer.toString());
			printWriter.flush();
			
			Scanner sn = new Scanner(input);
			String data = sn.nextLine();
			sn.close();
			return data;
		}catch(IOException e) {
			return e.toString();
		}	
	}

}
