package com.cdtu.visit.service;

import com.cdtu.visit.entity.ApplicationRecords;

import java.sql.SQLException;

public interface ApplicationRecordsService {
    void saveApplicationRecord(ApplicationRecords applicationRecords) throws SQLException, ClassNotFoundException;
}
