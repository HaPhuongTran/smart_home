package com.sm.dao.impl;


import javax.persistence.Query;

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

	@Override
	public void delete(int idRoom) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("DELETE FROM Report where roomIdReport = (SELECT id FROM Rooms WHERE id = :id)");
		query.setParameter("id", idRoom);
		query.executeUpdate();
		
	}

}
