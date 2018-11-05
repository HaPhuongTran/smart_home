package com.sm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.sm.dao.ReportDao;
import com.sm.entity.Report;
import com.sm.service.ReportService;

@Service
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class ReportServiceImpl implements ReportService{
	
	@Autowired
	ReportDao reportDao;

	@Override
	@Transactional
	public void save(Report report) {
		reportDao.save(report);
	}

}
