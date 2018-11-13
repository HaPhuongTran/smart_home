package com.sm.socket;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;



public class SocketClient {
	public static void main(String agrs[]) {
		final int serverPort = 3333;
		final String ipServer = "127.0.0.1";
		
		try {
			Socket socket = new Socket(ipServer, serverPort);
			InputStream input = socket.getInputStream();
			OutputStream output = socket.getOutputStream();
			while(true) { 	
				Map<String, String> json = new HashMap<>();
					json.put("type", "CONNECT");
					System.out.println(json);
					PrintWriter pw = new PrintWriter(output);
					pw.println(json);
					pw.flush();
			}
//			socket.close();
		}catch(IOException e) {
			System.err.print(e);
		}
	}

}
