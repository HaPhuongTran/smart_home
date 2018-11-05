package com.sm.dao.impl;


import java.util.List;
import java.util.Set;

import javax.persistence.Query;

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
	public void saveOrUpdate(Set<Device> devices) {
		Session session = sessionFactory.getCurrentSession();
		for (Device device : devices) {
			session.saveOrUpdate(device);
		}
	}

	@Override
	public void deleteDevice(int id) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("DELETE FROM Device where id= :id");
		query.setParameter("id", id);
		query.executeUpdate();
	}
	
}
