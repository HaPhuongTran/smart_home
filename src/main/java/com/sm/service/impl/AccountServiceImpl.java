package com.sm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.sm.dao.AccountDao;
import com.sm.entity.Account;
import com.sm.service.AccountService;

@Service
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class AccountServiceImpl implements AccountService {
	
	@Autowired
	AccountDao accountDao;

	@Override
	@Transactional
	public void createAccount(Account account) {
			accountDao.createAccount(account);
	}

	@Override
	public Account getAccountByName(String account) {
		return accountDao.getAccountByName(account);
	}

	@Override
	public Boolean isExistAccount(Account account) {
		if(accountDao.getAccountByName(account.getUserName()) == null)
			return true;
		else return false;
	}

}
