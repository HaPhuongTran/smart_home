package com.sm.service;

import com.sm.entity.Account;

public interface AccountService {
	public void createAccount(Account account);
	public Account getAccountByName(String account);
	public Boolean isExistAccount(Account account);
}
