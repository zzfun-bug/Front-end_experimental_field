package com.cdtu.visit.controller;

import com.alibaba.fastjson.JSON;
import com.cdtu.visit.entity.VO.PageVO;
import com.cdtu.visit.service.ApplicationUserService;
import com.cdtu.visit.service.impl.ApplicationUserServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.*;

@WebServlet("/page")
public class GetPageServlet extends HttpServlet {

    private ApplicationUserService applicationUserService = new ApplicationUserServiceImpl();

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1.设置请求编码
        request.setCharacterEncoding("UTF-8");
        // 获取地址上的参数数据
        int pageNum = Integer.parseInt(request.getParameter("currentPage"));
        int pageSize = Integer.parseInt(request.getParameter("pageSize"));
        String visitUnit = request.getParameter("visitUnit");
        String contactName = request.getParameter("contactName");
        String contactPhone = request.getParameter("contactPhone");

        //2.处理中文编码问题 - 使用URLDecoder
        try {
            if (visitUnit != null && !visitUnit.equals("")) {
                visitUnit = java.net.URLDecoder.decode(visitUnit, "UTF-8");
            }
            if (contactName != null && !contactName.equals("")) {
                contactName = java.net.URLDecoder.decode(contactName, "UTF-8");
            }
            if (contactPhone != null && !contactPhone.equals("")) {
                contactPhone = java.net.URLDecoder.decode(contactPhone, "UTF-8");
            }
        } catch (Exception e) {
            System.out.println("URL解码异常: " + e.getMessage());
        }


        // 使用Map组装打包所有参数
        Map<String, Object> params = new HashMap<>();
        params.put("pageNum", pageNum);
        params.put("pageSize", pageSize);
        params.put("visitUnit", visitUnit);
        params.put("contactName", contactName);
        params.put("contactPhone", contactPhone);

        // 调用业务方法，查询返回分页需要的相关数据
        PageVO pageVO = null;
        try {
            pageVO = applicationUserService.getPage(params);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }

        // 解决响应中文乱码
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        // 调用fastjson方法，将Java数据转为JSON字符串
        String jsonString = JSON.toJSONString(pageVO);

        // 获取响应输出对象,并使用响应对象的方法输出JSON字符串给客户端
        PrintWriter writer = response.getWriter();
        writer.write(jsonString);

        // 释放资源
        writer.close();

    }
}
