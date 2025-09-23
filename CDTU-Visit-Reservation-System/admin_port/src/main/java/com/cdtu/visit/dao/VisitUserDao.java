package com.cdtu.visit.dao;

import com.cdtu.visit.entity.VisitUser;

import java.sql.SQLException;

public interface VisitUserDao {
    /**
     * 按用户名查询用户
     *
     * @param username 用户名
     * @return {@link VisitUser }
     * @throws ClassNotFoundException 未找到类异常
     * @throws SQLException           SQLException
     */
    VisitUser selectUserByUsername(String username) throws ClassNotFoundException, SQLException;
}
