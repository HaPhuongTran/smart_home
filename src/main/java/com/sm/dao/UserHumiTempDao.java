package com.sm.dao;

import com.sm.entity.HumiTempUser;

public interface UserHumiTempDao {
	public void saveUserHumiTemp(HumiTempUser userHumiTemp);
	public void deleteHumiTempUser(HumiTempUser userHumiTemp);
}
