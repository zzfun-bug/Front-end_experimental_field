package com.cdtu.visit.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.cdtu.visit.entity.VO.LoginUserVO;
import com.cdtu.visit.entity.VisitUser;
import com.cdtu.visit.service.VisitUserService;
import com.cdtu.visit.service.impl.VisitUserServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet("/manage/login")
public class WebLoginServlet extends HttpServlet {
    private VisitUserService visitUserService = new VisitUserServiceImpl();

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 获取JSON数据
        BufferedReader reader = request.getReader();
        String jsonString = reader.readLine();
        LoginUserVO loginUserVO = JSONObject.parseObject(jsonString, LoginUserVO.class);
        // 登录判断逻辑流程
        // 先使用用户名去用户表中查询用户数据对象
        VisitUser visitUser = null;
        try {
            visitUser = visitUserService.getVisitUserByUsername(loginUserVO.getUsername());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
        PrintWriter writer = response.getWriter();
        // 判断用户对象是否为空
        if(visitUser == null){//表示数据库中不存在指定用户名的数据行
            // 直接响应
            writer.write("error");

            return;// 在方法中可以使用return;,结束当前方法的继续向后执行
        }
        // 解决响应中文乱码问题
        response.setCharacterEncoding("UTF-8");

        // 用户对象不空，就表示用户名正确，那么就继续判断密码
        // 使用数据库中的密码和用户输入的密码进行判断，字符串值判断相等是通过：字符串值1.equals(字符串值2)
        if (visitUser.getPassword().equals(loginUserVO.getPassword())){
            // 专业操作：为了安全，返回的用户数据应该先擦除密码
            visitUser.setPassword(null);
            // 调用fastjson方法将数据库返回对象，转为JOSN字符串响应请求端
            String userString = JSON.toJSONString(visitUser);
            // 响应用户数据
            writer.write(userString);
        }
    }
}

