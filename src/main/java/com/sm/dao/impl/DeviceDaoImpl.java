package com.sm.dao.impl;


import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sm.dao.DeviceDao;
import com.sm.entity.Device;

@Repository
public class DeviceDaoImpl implements DeviceDao {
	
	@Autowired
	SessionFactory sessionFactory;

	@Override
	public void saveOrUpdate(List<Device> devices) {
		Session session = sessionFactory.getCurrentSession();
		for (Device device : devices) {
			session.saveOrUpdate(device);
		}
	}
	
}
