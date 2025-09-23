package com.cdtu.visit.service.impl;

import com.cdtu.visit.dao.ApplicationUserDao;
import com.cdtu.visit.dao.impl.ApplicationUserDaoImpl;
import com.cdtu.visit.entity.ApplicationUser;
import com.cdtu.visit.entity.VO.PageVO;
import com.cdtu.visit.service.ApplicationUserService;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class ApplicationUserServiceImpl implements ApplicationUserService {
    private ApplicationUserDao applicationUserDao = new ApplicationUserDaoImpl();
    @Override
    public PageVO getPage(Map<String, Object> params) throws SQLException, ClassNotFoundException {
        // 创建方法返回对象
        PageVO pageVO = new PageVO();
        // 调用dao层方法，获取满足查询条件的数据总条数
        int total = applicationUserDao.count(params);
        // 将总条数装配到返回对象中
        pageVO.setTotal(total);
        // 获取分页大小参数
        int pageSize = (int)params.get("pageSize");
        // 计算总页数
        int pages = total % pageSize == 0 ? total / pageSize : total / pageSize + 1;
        // 将总页数装配到返回对象中
        pageVO.setPages(pages);
        // 调用dao层方法，进行分页条件查询
        List<ApplicationUser> applyList = applicationUserDao.getPage(params);
        // 将查询结果装配到返回对象中
        pageVO.setApplyList(applyList);
        return pageVO;
    }

    @Override
    public void updateApplicationUser(ApplicationUser applicationUser) throws SQLException, ClassNotFoundException {
        applicationUserDao.updateApplicationUser(applicationUser);
    }

    @Override
    public ApplicationUser findById(int id) {
        try {
            // 调用DAO层的findById方法获取用户信息
            return applicationUserDao.findById(id);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }
}
