package com.sm.dao.impl;


import javax.persistence.NoResultException;
import javax.persistence.Query;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sm.dao.HomeDao;
import com.sm.entity.HomeProject;

@Repository
public class HomeDaoImpl implements HomeDao {
	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	public void addHome(HomeProject homeProject) {
		 Session session = sessionFactory.getCurrentSession();
		 session.saveOrUpdate(homeProject);
	}
	
	@Override
	public HomeProject getHome(String nameHome, String userName) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM HomeProject WHERE nameHome =:name and account = (SELECT id FROM Account WHERE userName = :username)");
		query.setParameter("name", nameHome);
		query.setParameter("username", userName);
		HomeProject home = null;
		try{
			home = (HomeProject) query.getSingleResult();
			}
		catch (NoResultException nre){
			}
		return home;
	}

	@Override
	public void DeleteHome(int idHome) {
		Session session = sessionFactory.getCurrentSession();
		HomeProject home = session.byId(HomeProject.class).load(idHome);
		session.delete(home);
	}

}
