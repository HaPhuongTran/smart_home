package com.sm.dao;

import java.util.Set;

import com.sm.entity.Device;

public interface DeviceDao {
	public void saveOrUpdate(Set<Device> devices);
	public void deleteDevice(int id);
}
