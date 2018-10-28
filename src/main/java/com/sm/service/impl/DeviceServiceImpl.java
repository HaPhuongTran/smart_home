package com.sm.service.impl;

import java.util.ArrayList;
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
	public Boolean saveOrUpdate(List<Device> devices, List<Rooms> rooms) {
		Boolean isexits = false;
		List<Device> listIpDeviceInDB = new ArrayList<Device>();
		for(Rooms room : rooms ) {
			List<Device> deviceInDB = room.getDevices();
			if(deviceInDB != null && deviceInDB.size()>0) {
				listIpDeviceInDB.addAll(deviceInDB);
			}
		}
		
		for(Device device:devices) {
			if(listIpDeviceInDB != null && listIpDeviceInDB.size()>0) {
				for(Device devicecheck: listIpDeviceInDB) {
					if(device.getIp().equals(devicecheck.getIp())) {
						if(device.getId() == 0) {
							isexits = true;
						}else {
							deviceDao.saveOrUpdate(devices);
							return true;
						}
						break;
					}
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
	@Transactional
	public void deleteDevice(int id) {
		deviceDao.deleteDevice(id);
		
	}

}
