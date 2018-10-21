package com.sm.dao;

import java.util.List;

import com.sm.entity.HomeProject;

public interface HomeDao {
	public void addHome(HomeProject homeProject);
	public HomeProject getHome(String nameHome);
//	public List<HomeProject> getListHomeByUName(String userName);
	public void DeleteHome(int idHome);
}
