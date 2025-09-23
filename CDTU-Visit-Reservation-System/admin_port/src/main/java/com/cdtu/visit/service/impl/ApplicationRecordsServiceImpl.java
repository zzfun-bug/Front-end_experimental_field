package com.cdtu.visit.service.impl;

import com.cdtu.visit.dao.ApplicationRecordsDao;
import com.cdtu.visit.dao.impl.ApplicationRecordsDaoImpl;
import com.cdtu.visit.entity.ApplicationRecords;
import com.cdtu.visit.service.ApplicationRecordsService;

import java.sql.SQLException;
import java.util.Date;

public class ApplicationRecordsServiceImpl implements ApplicationRecordsService {

    private ApplicationRecordsDao applicationRecordsDao = new ApplicationRecordsDaoImpl();
    @Override
    public void saveApplicationRecord(ApplicationRecords applicationRecords) throws SQLException, ClassNotFoundException {
        // 设置 createBy 和 createTime
        applicationRecords.setCreateBy(applicationRecords.getContactName());
        applicationRecords.setCreateTime(new Date());

        applicationRecordsDao.insertVisitRecord(applicationRecords);
    }
}
