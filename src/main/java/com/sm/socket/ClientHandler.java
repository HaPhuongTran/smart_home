package com.sm.socket;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

import org.json.JSONObject;

public class ClientHandler extends Thread {
	final Scanner scanner;
	final PrintWriter printWriter;
	final Socket socket;
	
	public ClientHandler(Socket socket, Scanner scanner, PrintWriter printWriter ) {
		this.scanner = scanner;
		this.printWriter = printWriter;
		this.socket = socket;
	}
	
	public void closeSocket() {
		try {
			System.out.println(this.socket + "is closing");
			this.socket.close();
			this.scanner.close();
			this.printWriter.close();
			System.out.println(this.socket + "is closed");
		} catch (IOException e) {				
			e.printStackTrace();
		}
	}
	
	@Override
	public void run() {
		while(true) {
			String content = scanner.nextLine();
			JSONObject json = new JSONObject(content);
			if((boolean) json.get("state")) {
				printWriter.println(json.get("nameDevice")+" with ip: " + json.get("ip") + " is ON");
				printWriter.flush();
				closeSocket();
				return;
			}else {
				printWriter.println(json.get("nameDevice")+" with ip: " + json.get("ip") + " is OFF");
				printWriter.flush();
				closeSocket();
				return;
			}
		}
	}
}
