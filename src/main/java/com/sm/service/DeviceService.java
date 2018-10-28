package com.sm.service;

import java.util.List;

import com.sm.entity.Device;
import com.sm.entity.Rooms;

public interface DeviceService {
	public Boolean saveOrUpdate(List<Device> devices, List<Rooms> rooms);
	public void deleteDevice(int id);
}
