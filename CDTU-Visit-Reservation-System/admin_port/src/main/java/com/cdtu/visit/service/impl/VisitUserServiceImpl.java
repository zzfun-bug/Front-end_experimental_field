package com.cdtu.visit.service.impl;

import com.cdtu.visit.dao.VisitUserDao;
import com.cdtu.visit.dao.impl.VisitUserDaoImpl;
import com.cdtu.visit.entity.VisitUser;
import com.cdtu.visit.service.VisitUserService;

import java.sql.SQLException;

/**
 * 访问用户服务实现
 *
 * @author zzfun
 * @date 2024/08/09
 */
public class VisitUserServiceImpl implements VisitUserService {
    private VisitUserDao visitUserDao = new VisitUserDaoImpl();

    @Override
    public VisitUser getVisitUserByUsername(String username ) throws SQLException, ClassNotFoundException {
        VisitUser visitUser = visitUserDao.selectUserByUsername(username);
        return visitUser;
    }
}
