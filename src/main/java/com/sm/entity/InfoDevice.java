package com.sm.entity;

public class InfoDevice {
	private Boolean state;
	private String mode;
	private int temp;
	private int humi;
	private int time;
	private String fanLevel;
	private String ip;
	private String nameDevice;
	public Boolean getState() {
		return state;
	}
	public String getMode() {
		return mode;
	}
	public int getTemp() {
		return temp;
	}
	public int getHumi() {
		return humi;
	}
	public int getTime() {
		return time;
	}
	public String getFanLevel() {
		return fanLevel;
	}
	public void setState(Boolean state) {
		this.state = state;
	}
	public void setMode(String mode) {
		this.mode = mode;
	}
	public void setTemp(int temp) {
		this.temp = temp;
	}
	public void setHumi(int humi) {
		this.humi = humi;
	}
	public void setTime(int time) {
		this.time = time;
	}
	public void setFanLevel(String fanLevel) {
		this.fanLevel = fanLevel;
	}
	public String getIp() {
		return ip;
	}
	public String getNameDevice() {
		return nameDevice;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public void setNameDevice(String nameDevice) {
		this.nameDevice = nameDevice;
	}
	
}
