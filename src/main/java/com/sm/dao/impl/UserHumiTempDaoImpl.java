package com.sm.dao.impl;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sm.dao.UserHumiTempDao;
import com.sm.entity.HumiTempUser;

@Repository
public class UserHumiTempDaoImpl implements UserHumiTempDao {
	
	@Autowired
	SessionFactory sessionFactory;

	@Override
	public void saveUserHumiTemp(HumiTempUser userHumiTemp) {
		Session session = sessionFactory.getCurrentSession();
		session.saveOrUpdate(userHumiTemp);
	}

	@Override
	public void deleteHumiTempUser(HumiTempUser userHumiTemp) {
		Session session = sessionFactory.getCurrentSession();
		session.delete(userHumiTemp);
		
	}

}
