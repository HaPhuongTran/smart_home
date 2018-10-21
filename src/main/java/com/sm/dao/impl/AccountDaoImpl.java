package com.sm.dao.impl;

import javax.persistence.NoResultException;
import javax.persistence.Query;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sm.dao.AccountDao;
import com.sm.entity.Account;

@Repository
public class AccountDaoImpl implements AccountDao {
	@Autowired
	SessionFactory sessionFactory;

	@Override
	public void createAccount(Account account) {
		Session session = sessionFactory.getCurrentSession();
		session.saveOrUpdate(account);
	}

	@Override
	public Account getAccountByName(String accountName) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM Account WHERE userName =:name");
		query.setParameter("name", accountName);
		Account account = null;
		try{
			account = (Account) query.getSingleResult();
			}
		catch (NoResultException nre){
			}
		return account;
		
	}

}
