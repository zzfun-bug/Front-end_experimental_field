package com.cdtu.visit.dao;

import com.cdtu.visit.entity.ApplicationRecords;

import java.sql.SQLException;

public interface ApplicationRecordsDao {
    void insertVisitRecord(ApplicationRecords applicationRecords) throws ClassNotFoundException, SQLException;
}
