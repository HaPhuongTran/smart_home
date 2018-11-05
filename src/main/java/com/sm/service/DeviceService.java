package com.sm.service;

import java.util.List;
import java.util.Set;

import com.sm.entity.Device;
import com.sm.entity.Rooms;

public interface DeviceService {
	public Boolean saveOrUpdate(Set<Device> devices, List<Rooms> rooms);
	public void deleteDevice(int id);
}
