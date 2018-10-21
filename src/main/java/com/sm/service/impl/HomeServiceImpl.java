package com.sm.service.impl;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.sm.dao.HomeDao;
import com.sm.entity.HomeProject;
import com.sm.service.HomeService;

@Service
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class HomeServiceImpl implements HomeService {
	
	@Autowired
    HomeDao homeDao;
	
	@Override
	@Transactional
	public void createHome(HomeProject homeProject) {
		homeDao.addHome(homeProject);	
	}
	
	@Override
	public HomeProject getHome(String nameHome) {
		return homeDao.getHome(nameHome);
	}

	@Override
	@Transactional
	public void DeleteHome(int idHome) {
		homeDao.DeleteHome(idHome);
		
	}
}
