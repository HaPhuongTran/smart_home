package com.sm.dao;

import com.sm.entity.Account;

public interface AccountDao {
	public void createAccount(Account account);
	public Account getAccountByName(String account);
}
