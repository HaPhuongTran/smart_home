package com.sm.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cascade;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "temp_humi_user")
public class HumiTempUser {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private int id;
	
	@Column(name = "temp")
	private int temp;
	
	@Column(name = "humi")
	private int humi;
	
	@OneToOne
	@JoinColumn(name = "id_room", referencedColumnName = "id", nullable = false)
	private Rooms roomIdtemphumi;

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
	public Rooms getRoomIdtemphumi() {
		return roomIdtemphumi;
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

	public void setRoomIdtemphumi(Rooms roomIdtemphumi) {
		this.roomIdtemphumi = roomIdtemphumi;
	}

}
