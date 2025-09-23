package com.cdtu.visit.service;

import com.cdtu.visit.entity.VisitUser;

import java.sql.SQLException;

public interface VisitUserService {
    /**
     * 通过用户名获取访问用户
     *
     * @param username 用户名
     * @return {@link VisitUser }
     * @throws SQLException           SQLException
     * @throws ClassNotFoundException 未找到类异常
     */
    VisitUser getVisitUserByUsername(String username) throws SQLException, ClassNotFoundException;
}
