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

import com.sm.entity.Account;
import com.sm.entity.HomeProject;
import com.sm.service.AccountService;
import com.sm.service.HomeService;

@RestController
@CrossOrigin
@RequestMapping("/smarthome")
public class HomeController {
	@Autowired
	HomeService homeService;
	
	@Autowired
	AccountService accountService;
	
	@RequestMapping(value = "/createhome/{user_name}", method = RequestMethod.POST, headers="Accept=application/json")
	public ResponseEntity<HttpStatus> createHome(@RequestBody HomeProject homeProject, @PathVariable("user_name") String user_name){
		Account account = accountService.getAccountByName(user_name);
		if(account!=null) {
			homeProject.setAccount(account);
			HomeProject homeCheck = homeService.getHome(homeProject.getNameHome()/*add variable account*/);
			if(homeCheck != null && homeCheck.getAccount().getId() == account.getId()) {
				return new ResponseEntity<>(HttpStatus.FOUND);
			}else {
				homeService.createHome(homeProject);
		        return new ResponseEntity<>(HttpStatus.CREATED);
			}
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@RequestMapping(value = "/gethome/{name_home}", method = RequestMethod.GET, headers="Accept=application/json")
	public HomeProject getHomeByName(@PathVariable("name_home") String name_home){
		HomeProject home =homeService.getHome(name_home);
        return home;
	}
	
	@RequestMapping(value = "deletehome/{id_home}", method = RequestMethod.GET)
	public ResponseEntity<HttpStatus> deleteHomeById(@PathVariable("id_home") int idHome){
		homeService.DeleteHome(idHome);
		return new ResponseEntity<>(HttpStatus.OK);
	}

}
