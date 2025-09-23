package com.cdtu.visit.service;

import com.cdtu.visit.entity.ApplicationUser;
import com.cdtu.visit.entity.VO.PageVO;

import java.sql.SQLException;
import java.util.Map;

public interface ApplicationUserService {
    /**
     * 分页查询
     *
     * @param params 参数
     * @return {@link PageVO }
     * @throws SQLException           SQLException
     * @throws ClassNotFoundException 未找到类异常
     */
    PageVO getPage(Map<String, Object> params) throws SQLException, ClassNotFoundException;

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
     */
    ApplicationUser findById(int id);
}
