package com.sm.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.sm.dao.DeviceDao;
import com.sm.entity.Device;
import com.sm.service.DeviceService;

@Service
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class DeviceServiceImpl implements DeviceService {
	
	@Autowired
	DeviceDao deviceDao;
	
	@Override
	@Transactional
	public void save(List<Device> devices) {
		deviceDao.save(devices);
	}

}
