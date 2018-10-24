package com.sm.dao;

import java.util.List;

import com.sm.entity.Device;

public interface DeviceDao {
	public void saveOrUpdate(List<Device> devices);
}
