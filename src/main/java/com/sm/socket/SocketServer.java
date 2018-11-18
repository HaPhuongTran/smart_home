package com.sm.socket;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Scanner;

public class SocketServer {
	private static int defaultPort = 3333;

	public static void main(String[] args) throws IOException {
		try(ServerSocket serverSocket = new ServerSocket(defaultPort)){
			while(serverSocket != null) {
				Socket socket = null;
				try {
					socket = serverSocket.accept();
					System.out.println("A new client is connected : " + socket);
					
					InputStream input = socket.getInputStream();
					OutputStream output = socket.getOutputStream();
					
					Scanner scanner = new Scanner(input);
					PrintWriter printWriter = new PrintWriter(output);
					
					System.out.println("Assigning new thread for this client"); 
					
					Thread clientThreat = new ClientHandler(socket, scanner, printWriter);
					clientThreat.start();
				}catch(IOException e) {
					socket.close();
					System.err.println("Connect Error: " + e);
				}
			}
		}
	}
}
