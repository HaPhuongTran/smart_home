package com.sm.entity;

import java.time.LocalDate;
import java.time.LocalTime;

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
@Table(name = "report")
public class Report {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private int id;
	
	@Column(name = "Date")
	private java.time.LocalDate date;
	
	@Column(name = "Time")
    private java.time.LocalTime time;
	
	@Column(name = "Temp")
	private int temp;
    
	@Column(name = "Humi")
	private int humi;
	
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "id_room", referencedColumnName = "id", nullable = false)
	private Rooms roomIdReport;
	
	public Report() {}

	public int getId() {
		return id;
	}


	public int getTemp() {
		return temp;
	}

	public int getHumi() {
		return humi;
	}
	
	@JsonIgnore
	public Rooms getRoomIdReport() {
		return roomIdReport;
	}

	public void setId(int id) {
		this.id = id;
	}

	public void setTemp(int temp) {
		this.temp = temp;
	}

	public void setHumi(int humi) {
		this.humi = humi;
	}

	public void setRoomIdReport(Rooms roomIdReport) {
		this.roomIdReport = roomIdReport;
	}

	public LocalDate getDate() {
		return date;
	}

	public LocalTime getTime() {
		return time;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public void setTime(LocalTime time) {
		this.time = time;
	}
	
}
