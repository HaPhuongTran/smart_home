package com.sm.dao.impl;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sm.dao.ReportDao;
import com.sm.entity.Report;

@Repository
public class ReportDaoImpl implements ReportDao {
	@Autowired
	SessionFactory sessionFactory;

	@Override
	public void save(Report report) {
		Session session = sessionFactory.getCurrentSession();
		session.save(report);
	}

}
