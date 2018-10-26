package com.sm.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.sm.dao.DeviceDao;
import com.sm.entity.Device;
import com.sm.entity.Rooms;
import com.sm.service.DeviceService;

@Service
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class DeviceServiceImpl implements DeviceService {
	
	@Autowired
	DeviceDao deviceDao;
	
	@Override
	@Transactional
	public Boolean saveOrUpdate(List<Device> devices, Rooms room) {
		Boolean isexits = false;
		List<Device> listdevice = room.getDevices();
//		review here
		for(Device device: devices) { 
			if(device.getId() == 0) {
				for(Device checkDevice: listdevice) {
					if(device.getIp().equals(checkDevice.getIp())) 
						isexits = true;
				}
			}
		}
		if(!isexits) {
			deviceDao.saveOrUpdate(devices);
			return true;
		}else {
			return false;
		}
	}

	@Override
	public void deleteDevice(Device device) {
		deviceDao.deleteDevice(device);
		
	}

}
