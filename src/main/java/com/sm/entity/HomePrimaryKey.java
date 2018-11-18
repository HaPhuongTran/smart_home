package com.sm.entity;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

@Embeddable
public class HomePrimaryKey implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	protected int idHome;
	
	@Column(name = "name", nullable = false)
	protected String nameHome;
	
	public HomePrimaryKey() {};
	
	public HomePrimaryKey(int idHome, String nameHome) {
		this.idHome = idHome;
		this.nameHome = nameHome;
	}

	public int getIdHome() {
		return idHome;
	}

	public String getNameHome() {
		return nameHome;
	}

	public void setIdHome(int idHome) {
		this.idHome = idHome;
	}

	public void setNameHome(String nameHome) {
		this.nameHome = nameHome;
	}
	
	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HomePrimaryKey)) return false;
        HomePrimaryKey that = (HomePrimaryKey) o;
        return Objects.equals(getIdHome(), that.getIdHome()) &&
                Objects.equals(getNameHome(), that.getNameHome());
    }
 
    @Override
    public int hashCode() {
        return Objects.hash(getIdHome(), getNameHome());
    }
	
}
