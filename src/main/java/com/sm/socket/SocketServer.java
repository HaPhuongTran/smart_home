package com.sm.socket;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URL;
import java.net.URLConnection;
import java.util.Scanner;

import org.json.JSONObject;

public class SocketServer {
	private static int defaultPort = 3333;

	public static void main(String[] args) {
	
		try {
			ServerSocket serverSocket = new ServerSocket(defaultPort);
			while(true) {
				try {
					Socket socket = serverSocket.accept();
					InputStream input = socket.getInputStream();
					OutputStream output = socket.getOutputStream();
					Scanner sn = new Scanner(input);
					PrintWriter wr = new PrintWriter(output);
					String content = sn.nextLine();
					JSONObject json = new JSONObject(content);
					if((boolean) json.get("state")) {
						wr.println("The "+json.get("temp")+ "is" + json.get("state"));
					    wr.flush();
						socket.close();
						break;
					}
					//Begin
					URL url = new URL("http://localhost/login");
					URLConnection conn = url.openConnection();
					conn.setDoOutput(true);
				    wr.println("The "+json.get("temp")+ " is " + json.get("state"));
				    wr.flush();
				    //End
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
