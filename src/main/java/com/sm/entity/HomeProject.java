package com.sm.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;



@Entity
@Table(name = "home")
public class HomeProject {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private int idHome;
	
	@Column(name = "name", nullable = false)
	private String nameHome;
	
	@OneToMany(mappedBy = "home", fetch = FetchType.EAGER)
	private List<Rooms> rooms;
	
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private Account account;
	
	@JsonIgnore
	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public HomeProject(){}
	
	public HomeProject(int idHome, String nameHome, List<Rooms> rooms) {
		this.idHome = idHome;
		this.nameHome = nameHome;
		this.rooms = rooms;
	}

	public int getIdHome() {
		return idHome;
	}

	public String getNameHome() {
		return nameHome;
	}

	public List<Rooms> getRooms() {
		return rooms;
	}

	public void setIdHome(int idHome) {
		this.idHome = idHome;
	}

	public void setNameHome(String nameHome) {
		this.nameHome = nameHome;
	}

	public void setRooms(List<Rooms> rooms) {
		this.rooms = rooms;
	}
}