package com.sm.service;

import com.sm.entity.HomeProject;

public interface HomeService {
	public void createHome(HomeProject homeProject);
	public HomeProject getHome(String nameHome);
	public void DeleteHome(int idHome);
}
