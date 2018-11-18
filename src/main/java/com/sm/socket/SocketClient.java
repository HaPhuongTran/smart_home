package com.sm.socket;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;
import org.json.JSONObject;



public class SocketClient {
	public static void main(String []agrs) throws IOException {
		final int serverPort = 3333;
		final String ipServer = "127.0.0.1";
		try(Socket socket = new Socket(ipServer, serverPort)) {
			String data = null;
			JSONObject obj = new JSONObject();
			System.out.println("Connected to server");
			InputStream input = socket.getInputStream();
			OutputStream output = socket.getOutputStream();
			PrintWriter pw = new PrintWriter(output);
			obj.put("fanLevel", "weak");
			obj.put("humi", 30);
			obj.put("mode", "Cold");
			obj.put("state", true);
			obj.put("temp", 30);
			obj.put("time", 30);
			obj.put("ip","10.0.0.1");
			obj.put("nameDevice", "Ac1");
			Scanner sn = new Scanner(input);
			Scanner sn1 = new Scanner(System.in);
			while(true) {
				System.out.print("Send data? ");
				String keyboard = sn1.nextLine();
				if(keyboard.equals("y")) {
					pw.println(obj.toString());
					pw.flush();
					data = sn.nextLine();
					System.out.println(data);
				}else {
					pw.println("Close");
					pw.flush();
					break;
				}
			}
			System.out.println("Socket is closing");
			sn.close();
			sn1.close();
			pw.close();
			System.out.println("Socket is closed ");
		}catch(IOException e) {
			System.err.print(e);}
	}
}
