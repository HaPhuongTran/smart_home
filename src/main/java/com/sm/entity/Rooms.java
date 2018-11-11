package com.sm.entity;


import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "rooms")
public class Rooms{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "home_id", referencedColumnName = "id")
	private HomeProject home;
	
	@Column(name = "name_room", nullable = false)
	private String nameRoom;
	
	@OneToMany(mappedBy = "roomId", fetch = FetchType.EAGER)
	private Set<Device> devices;
	
	@OneToOne(mappedBy = "roomIdtemphumi", fetch = FetchType.EAGER)
	private HumiTempUser humitemp;
	
	@OneToMany(mappedBy = "roomIdReport", fetch = FetchType.EAGER)
	private Set<Report> reports;
	
	public Rooms() {}
	
	public Rooms(int id) {
		this.id = id;
	}

	public HumiTempUser getHumitemp() {
		return humitemp;
	}

	public void setHumitemp(HumiTempUser humitemp) {
		this.humitemp = humitemp;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@JsonIgnore
	public HomeProject getHome() {
		return home;
	}

	public void setHome(HomeProject home) {
		this.home = home;
	}

	public String getNameRoom() {
		return nameRoom;
	}

	public void setNameRoom(String nameRoom) {
		this.nameRoom = nameRoom;
	}

	public Set<Device> getDevices() {
		return devices;
	}

	public void setDevices(Set<Device> devices) {
		this.devices = devices;
	}

	public Set<Report> getReports() {
		return reports;
	}

	public void setReports(Set<Report> reports) {
		this.reports = reports;
	}
	

}