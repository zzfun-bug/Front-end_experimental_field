package com.cdtu.visit.dao;



import com.cdtu.visit.entity.ApplicationUser;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface ApplicationUserDao {

    /**
     * 更新用户
     *
     * @param applicationUser 用户
     * @throws SQLException           SQLException
     * @throws ClassNotFoundException 未找到类异常
     */
    void updateApplicationUser(ApplicationUser applicationUser) throws SQLException, ClassNotFoundException;

    /**
     * 按 ID 查找
     *
     * @param id
     * @return {@link ApplicationUser }
     * @throws SQLException           SQLException
     * @throws ClassNotFoundException 未找到类异常
     */
    ApplicationUser findById(int id) throws SQLException, ClassNotFoundException;

    /**
     * 统计数据行数
     *
     * @param params 参数
     * @return int
     */
    int count(Map<String, Object> params) throws ClassNotFoundException, SQLException;

    /**
     * 分页条件查询
     *
     * @param params 参数
     * @return {@link List }<{@link ApplicationUser }>
     */
    List<ApplicationUser> getPage(Map<String, Object> params) throws ClassNotFoundException, SQLException;
}
