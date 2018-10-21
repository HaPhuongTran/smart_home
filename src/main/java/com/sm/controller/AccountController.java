package com.sm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.sm.dao.AccountDao;
import com.sm.entity.Account;
import com.sm.service.AccountService;

@RestController
@CrossOrigin
public class AccountController {

	@Autowired
	AccountService accountService;
	
	@Autowired
	AccountDao accountDao;
	
	@RequestMapping(value = "/createaccount", method = RequestMethod.POST, headers="Accept=application/json")
	public ResponseEntity<HttpStatus> createAccount(@RequestBody Account account){
		if(accountService.isExistAccount(account)) {
			accountService.createAccount(account);
			return new ResponseEntity<>(HttpStatus.CREATED);
		}else {
			return new ResponseEntity<>(HttpStatus.CONFLICT);
		}
	}
	
	@RequestMapping(value = "/getaccount/{account_name}", method = RequestMethod.GET, headers="Accept=application/json")
	public Account getAccountByName(@PathVariable("account_name") String accountName){
		return accountService.getAccountByName(accountName);
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseEntity<HttpStatus>Login(@RequestBody Account account){
		Account accountcheck = accountService.getAccountByName(account.getUserName());
		if(accountcheck!=null && accountcheck.getPassword().equals(account.getPassword())) {
			return new ResponseEntity<>(HttpStatus.FOUND);
		}
		else {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
	}
		

}
