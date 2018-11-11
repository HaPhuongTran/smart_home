package com.sm.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "device")
public class Device {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private int id;
	
	@Column(name = "ip")
	private String ip;
	
	@Column(name = "subnet_mask")
	private String subnetMask;
	
	@Column(name = "gateway")
	private String gateway;
	
	@Column(name = "name", nullable = false)
	private String nameDevice;
	
	
	@Column(name = "type")
	private String type;

	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "id_room", referencedColumnName = "id", nullable = false)
	private Rooms roomId;
	
	public Device(){}
	
	public Device(String ip) {
		this.ip = ip;
	}

	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getNameDevice() {
		return nameDevice;
	}

	public void setNameDevice(String nameDevice) {
		this.nameDevice = nameDevice;
	}


	@JsonIgnore
	public Rooms getRoomId() {
		return roomId;
	}

	public void setRoomId(Rooms roomId) {
		this.roomId = roomId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSubnetMask() {
		return subnetMask;
	}

	public void setSubnetMask(String subnetMask) {
		this.subnetMask = subnetMask;
	}

	public String getGateway() {
		return gateway;
	}

	public void setGateway(String gateway) {
		this.gateway = gateway;
	}

}