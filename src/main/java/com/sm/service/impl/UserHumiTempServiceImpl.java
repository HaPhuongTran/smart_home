package com.sm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.sm.dao.UserHumiTempDao;
import com.sm.entity.HumiTempUser;
import com.sm.service.UserHumiTempService;

@Service
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class UserHumiTempServiceImpl implements UserHumiTempService {
	
	@Autowired
	UserHumiTempDao userHumiTempDao;

	@Override
	@Transactional
	public void createHumiTempUser(HumiTempUser userHumiTemp) {
		userHumiTempDao.saveUserHumiTemp(userHumiTemp);
	}

	@Override
	@Transactional
	public void deleteHumiTempUser(HumiTempUser userHumiTemp) {
		userHumiTempDao.deleteHumiTempUser(userHumiTemp);
		
	}

}
