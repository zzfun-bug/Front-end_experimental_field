package com.cdtu.visit.dao.impl;

import com.cdtu.visit.dao.ApplicationUserDao;
import com.cdtu.visit.entity.ApplicationUser;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ApplicationUserDaoImpl implements ApplicationUserDao {
    @Override
    public void updateApplicationUser(ApplicationUser applicationUser) throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.jdbc.Driver");

        String url = "jdbc:mysql://localhost:3306/visit_db?useUnicode=true&characterEncoding=utf8";
        String name = "root";
        String password = "root";
        Connection connection = DriverManager.getConnection(url, name, password);
        String sql = "UPDATE application_user SET status = ?, commentator_name = ?, commentator_phone = ?, reject_reason = ?,update_by = ?, update_time = ? WHERE id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        //设置参数
        preparedStatement.setInt(1, applicationUser.getStatus());
        preparedStatement.setString(2, applicationUser.getCommentatorName());
        preparedStatement.setString(3, applicationUser.getCommentatorPhone());
        preparedStatement.setString(4, applicationUser.getRejectReason());
        preparedStatement.setString(5, applicationUser.getUpdateBy());
        preparedStatement.setTimestamp(6, new java.sql.Timestamp(System.currentTimeMillis()));

        preparedStatement.setLong(7, applicationUser.getId());
        //执行sql
        preparedStatement.executeUpdate();
        // 关闭资源
        preparedStatement.close();
        connection.close();
    }

    @Override
    public ApplicationUser findById(int id) throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.jdbc.Driver");

        String url = "jdbc:mysql://localhost:3306/visit_db?useUnicode=true&characterEncoding=utf8";
        String name = "root";
        String password = "root";
        Connection connection = DriverManager.getConnection(url, name, password);
        String sql = "SELECT * FROM application_user WHERE id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setInt(1, id);
        ResultSet rs = preparedStatement.executeQuery();

        ApplicationUser applicationUser = null;
        if (rs.next()) {
            applicationUser = new ApplicationUser();
            applicationUser.setId(rs.getInt("id"));
            applicationUser.setVisitUnit(rs.getString("visit_unit"));
            applicationUser.setVisitNature(rs.getInt("visit_nature"));
            applicationUser.setVisitDate(rs.getDate("visit_date")); // 注意这里使用了 String 类型
            applicationUser.setVisitNum(rs.getInt("visit_num"));
            applicationUser.setVisitCar(rs.getString("visit_car"));
            applicationUser.setTimeSolt(rs.getString("time_solt"));
            applicationUser.setContactName(rs.getString("contact_name"));
            applicationUser.setContactPhone(rs.getString("contact_phone"));
            applicationUser.setStatus(rs.getInt("status"));
            applicationUser.setCommentatorName(rs.getString("commentator_name"));
            applicationUser.setCommentatorPhone(rs.getString("commentator_phone"));
            applicationUser.setRejectReason(rs.getString("reject_reason"));
            applicationUser.setDelFlag(rs.getInt("del_flag"));
            applicationUser.setCreateBy(rs.getString("create_by"));
            applicationUser.setCreateTime(rs.getDate("create_time"));
            applicationUser.setUpdateBy(rs.getString("update_by"));
            applicationUser.setUpdateTime(rs.getDate("update_time"));
        }

        rs.close();
        preparedStatement.close();
        connection.close();

        return applicationUser;
    }

    @Override
    public int count(Map<String, Object> params) throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.jdbc.Driver");

        String url = "jdbc:mysql://localhost:3306/visit_db?useUnicode=true&characterEncoding=utf8";
        String name = "root";
        String password = "root";

        Connection connection = DriverManager.getConnection(url, name, password);

        String sql = "SELECT COUNT(*) FROM application_user WHERE del_flag = 0";
        // 查询条件动态组装
        String visitUnit = (String)params.get("visitUnit");
        if (visitUnit != null && !visitUnit.equals("")) {
            sql += " AND visit_unit LIKE CONCAT('%', ?, '%')";
        }
        String contactName = (String)params.get("contactName");
        if (contactName != null && !contactName.equals("")) {
            sql += " AND contact_name = ?";
        }
        String contactPhone = (String)params.get("contactPhone");
        if (contactPhone != null && !contactPhone.equals("")) {
            sql += " AND contact_phone = ?";
        }

        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        int index = 1;
        if (visitUnit != null && !visitUnit.equals("")) {
            preparedStatement.setString(index++, visitUnit);
        }
        if (contactName != null && !contactName.equals("")) {
            preparedStatement.setString(index++, contactName);
        }
        if (contactPhone != null && !contactPhone.equals("")) {
            preparedStatement.setString(index++, contactPhone);
        }

        ResultSet rs = preparedStatement.executeQuery();
        int rows = 0;
        if (rs.next()) {
            rows = rs.getInt(1);
        }
        rs.close();
        preparedStatement.close();
        connection.close();

        return rows;
    }




    @Override
    public List<ApplicationUser> getPage(Map<String, Object> params) throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.jdbc.Driver");

        String url = "jdbc:mysql://localhost:3306/visit_db?useUnicode=true&characterEncoding=utf8";
        String name = "root";
        String password = "root";
        Connection connection = DriverManager.getConnection(url, name, password);

        String sql = "SELECT id, visit_unit, visit_nature, visit_date, visit_num, visit_car, time_solt, contact_name, contact_phone, status, commentator_name, commentator_phone, reject_reason, del_flag, create_by, create_time, update_by, update_time FROM application_user WHERE del_flag = 0";
        // 查询条件动态组装
        String visitUnit = (String)params.get("visitUnit");
        if (visitUnit != null && !visitUnit.equals("")) {
            sql += " AND visit_unit LIKE CONCAT('%', ? , '%')";
        }
        String contactName = (String)params.get("contactName");
        if (contactName != null && !contactName.equals("")) {
            sql += " AND contact_name = ?";
        }
        String contactPhone = (String)params.get("contactPhone");
        if (contactPhone != null && !contactPhone.equals("")) {
            sql += " AND contact_phone = ?";
        }

        // 分页条件组装
        int pageNo = (Integer)params.get("pageNum");
        int pageSize = (Integer)params.get("pageSize");
        int startIndex = (pageNo - 1) * pageSize;
        sql += " LIMIT ?, ?";

        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        int index = 1;
        if (visitUnit != null && !visitUnit.equals("")) {
            preparedStatement.setString(index++, visitUnit);
        }
        if (contactName != null && !contactName.equals("")) {
            preparedStatement.setString(index++, contactName);
        }
        if (contactPhone != null && !contactPhone.equals("")) {
            preparedStatement.setString(index++, contactPhone);
        }
        preparedStatement.setInt(index++, startIndex);
        preparedStatement.setInt(index, pageSize);

        ResultSet rs = preparedStatement.executeQuery();
        List<ApplicationUser> list = new ArrayList<>();
        while (rs.next()) {
            ApplicationUser applicationUser = new ApplicationUser();
            applicationUser.setId(rs.getInt("id"));
            applicationUser.setVisitUnit(rs.getString("visit_unit"));
            applicationUser.setVisitNature(rs.getInt("visit_nature"));
            applicationUser.setVisitDate(rs.getDate("visit_date"));
            applicationUser.setVisitNum(rs.getInt("visit_num"));
            applicationUser.setVisitCar(rs.getString("visit_car"));
            applicationUser.setTimeSolt(rs.getString("time_solt"));
            applicationUser.setContactName(rs.getString("contact_name"));
            applicationUser.setContactPhone(rs.getString("contact_phone"));
            applicationUser.setStatus(rs.getInt("status"));
            applicationUser.setCommentatorName(rs.getString("commentator_name"));
            applicationUser.setCommentatorPhone(rs.getString("commentator_phone"));
            applicationUser.setRejectReason(rs.getString("reject_reason"));
            applicationUser.setDelFlag(rs.getInt("del_flag"));
            applicationUser.setCreateBy(rs.getString("create_by"));
            applicationUser.setCreateTime(rs.getDate("create_time"));
            applicationUser.setUpdateBy(rs.getString("update_by"));
            applicationUser.setUpdateTime(rs.getDate("update_time"));
            list.add(applicationUser);
        }
        rs.close();
        preparedStatement.close();
        connection.close();

        return list;
    }

}
