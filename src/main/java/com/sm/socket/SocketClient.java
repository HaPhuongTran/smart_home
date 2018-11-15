package com.sm.socket;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import org.json.JSONException;
import org.json.JSONObject;



public class SocketClient {
	public static void main(String agrs[]) {
		final int serverPort = 3333;
		final String ipServer = "127.0.0.1";
		
		try {
			Socket socket = new Socket(ipServer, serverPort);
			InputStream input = socket.getInputStream();
			OutputStream output = socket.getOutputStream();
			PrintWriter pw = new PrintWriter(output);
			JSONObject obj = new JSONObject();
			obj.put("state", false);
			obj.put("temp", 30);
			String a = obj.toString();
			pw.println(obj.toString());
			pw.flush();
			
			Scanner sn = new Scanner(input);
			String data = sn.nextLine();
			System.out.println(data);
			socket.close();
		}catch(IOException e) {
			System.err.print(e);
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
}
