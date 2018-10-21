package com.sm.dao.impl;

import java.util.List;


import org.hibernate.Session;
import org.hibernate.SessionFactory;
import javax.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sm.dao.RoomDao;
import com.sm.entity.Rooms;

@Repository
public class RoomDaoImpl implements RoomDao {
	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	public void addRoom(Rooms room) {
		 Session session = sessionFactory.getCurrentSession();
		 session.saveOrUpdate(room);
	}
	
	@Override
	public void updateRoom(Rooms room) {
		Session session = sessionFactory.getCurrentSession();
		session.update(room);
	}
	
	@Override
	public List<Rooms> getListRooms(String name_home) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM Rooms WHERE homeId = (SELECT id FROM HomeProject WHERE nameHome = :name)");
		query.setParameter("name", name_home);
		List<Rooms> room = (List<Rooms>) query.getResultList();
		return room;
	}
	
	@Override
	public Rooms getRoom(String nameRoom) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM Rooms WHERE nameRoom =:name");
		query.setParameter("name", nameRoom);
		Rooms room = (Rooms) query.getSingleResult();
		return room;
	}

	@Override
	public void saveOrUpdate(Rooms room) {
		Session session = sessionFactory.getCurrentSession();
		session.saveOrUpdate(room);
		
	}

	@Override
	public void deleteRoom(Rooms room) {
		Session session = sessionFactory.getCurrentSession();
		session.delete(room);
		
	}
}
