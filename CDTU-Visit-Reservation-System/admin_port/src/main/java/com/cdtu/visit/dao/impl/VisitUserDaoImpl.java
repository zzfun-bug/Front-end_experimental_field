package com.cdtu.visit.dao.impl;

import com.cdtu.visit.dao.VisitUserDao;
import com.cdtu.visit.entity.VisitUser;

import java.sql.*;

public class VisitUserDaoImpl implements VisitUserDao {
    @Override
    public VisitUser selectUserByUsername(String username) throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.jdbc.Driver");

        String url = "jdbc:mysql://localhost:3306/visit_db?useUnicode=true&characterEncoding=utf8";
        String name = "root";
        String password = "root";


        Connection connection = DriverManager.getConnection(url, name, password);
        //编写SQL
        String sql = "SELECT id, username, `password`, avatar, realname, phone, unit_name, unit_nature, license_plate_number, `status`, del_flag, create_by, create_time, update_by, update_time, openid FROM visit_user where username = ?";
        //创建PreparedStatement
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        //设置username
        preparedStatement.setString(1,username);
        //执行SQL,
        ResultSet rs = preparedStatement.executeQuery();
        //设置用户变量初始值为null
        VisitUser visitUser = null;
        if (rs.next()) {
             //如果查询有数据行，才给用户变量赋值用户对象
            visitUser = new VisitUser();
            visitUser.setId(rs.getInt("id"));
            visitUser.setUsername(rs.getString("username"));
            visitUser.setPassword(rs.getString("password"));
            visitUser.setAvatar(rs.getString("avatar"));
            visitUser.setRealname(rs.getString("realname"));
            visitUser.setPhone(rs.getString("phone"));
            visitUser.setUnitName(rs.getString("unit_name"));
            visitUser.setUnitNature(rs.getInt("unit_nature"));
            visitUser.setLicensePlateNumber(rs.getString("license_plate_number"));
            visitUser.setStatus(rs.getInt("status"));
            visitUser.setDelFlag(rs.getInt("del_flag"));
            visitUser.setCreateBy(rs.getString("create_by"));
            visitUser.setCreateTime(rs.getDate("create_time"));
        }
        //返回结果
        return visitUser;
    }
}
