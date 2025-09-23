package com.cdtu.visit.dao.impl;

import com.cdtu.visit.dao.ApplicationRecordsDao;
import com.cdtu.visit.entity.ApplicationRecords;

import java.sql.*;

public class ApplicationRecordsDaoImpl implements ApplicationRecordsDao {
    @Override
    public void insertVisitRecord(ApplicationRecords applicationRecords) throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.jdbc.Driver");

        String url = "jdbc:mysql://localhost:3306/visit_db?useUnicode=true&characterEncoding=utf8";
        String name = "root";
        String password = "root";

        Connection connection = DriverManager.getConnection(url, name, password);

        String sql = "INSERT INTO application_user (visit_date, visit_unit, visit_nature, visit_num, visit_car, contact_name, contact_phone, create_by, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);

        preparedStatement.setDate(1, new java.sql.Date(applicationRecords.getVisitDate().getTime()));
        preparedStatement.setString(2, applicationRecords.getVisitUnit());
        preparedStatement.setInt(3, applicationRecords.getVisitNature());
        preparedStatement.setInt(4, applicationRecords.getVisitNum());
        preparedStatement.setString(5, applicationRecords.getVisitCar());
        preparedStatement.setString(6, applicationRecords.getContactName());
        preparedStatement.setString(7, applicationRecords.getContactPhone());
        preparedStatement.setString(8, applicationRecords.getContactName()); // createBy 设置为 contactName
        preparedStatement.setTimestamp(9, new Timestamp(applicationRecords.getCreateTime().getTime())); // createTime 设置为当前时间

        preparedStatement.executeUpdate();

        //关闭连接
        preparedStatement.close();
        connection.close();
    }
}
