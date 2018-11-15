package com.sm.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

import org.json.JSONException;
import org.json.JSONObject;
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
	
	@RequestMapping(value = "/control", method = RequestMethod.POST)
	public String ControlDevice(@RequestBody InfoDevice deviceInfo){
		try {
			Socket socket = new Socket(ipServer, serverPort);
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
			String a = deviceInfoSentToServer.toString();
			printWriter.println(deviceInfoSentToServer.toString());
			printWriter.flush();
			
			Scanner sn = new Scanner(input);
			String data = sn.nextLine();
			System.out.println(data);
			socket.close();
			return data;
		}catch(IOException e) {
			return e.toString();
		}	
	}

}
