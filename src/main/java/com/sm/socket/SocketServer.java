package com.sm.socket;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Scanner;

import org.json.JSONObject;

public class SocketServer {
	private final static int defaultPort = 3333;

	public static void main(String[] args) {
	
		try {
			ServerSocket serverSocket = new ServerSocket(defaultPort);
			while(true) {
				try {
					Socket socket = serverSocket.accept();
					InputStream input = socket.getInputStream();
					OutputStream output = socket.getOutputStream();
					Scanner sn = new Scanner(input);
					String content = sn.nextLine();
					JSONObject json = new JSONObject(content);
					System.out.println(json.get("temp"));
					socket.close();
				}catch(IOException e) {
					System.err.println("Connect Error: " + e);
				}
			}
			
		}catch(IOException e) {
			System.err.print("Can't create server" + e);
		}
	}

}
