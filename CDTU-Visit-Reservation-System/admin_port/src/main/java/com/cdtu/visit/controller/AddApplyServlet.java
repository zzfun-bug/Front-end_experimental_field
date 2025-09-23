//package com.cdtu.visit.controller;
//
//import com.alibaba.fastjson.JSONObject;
//import com.cdtu.visit.entity.ApplicationUser;
//
//import javax.servlet.ServletException;
//import javax.servlet.annotation.WebServlet;
//import javax.servlet.http.HttpServlet;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.BufferedReader;
//import java.io.IOException;
//import java.io.PrintWriter;
//@WebServlet("/apply")
//public class AddApplyServlet extends HttpServlet {
//    @Override
//    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        // 设置编码
//        request.setCharacterEncoding("UTF-8");
//        // 前端在请求体中携带JSON对象字符串数据
//        // 获取request的输入（流）对象
//        BufferedReader reader = request.getReader();
//        // 通过输入对象的读取方法，获取请求时携带JSON字符串数据
//        String jsonString = reader.readLine();
//        // 通过fastjson的方法将JSON对象字符串转为指定类型的Java对象
//        ApplicationUser applicationUser = JSONObject.parseObject(jsonString, ApplicationUser.class);
//
//        // 通过Alt+Insert，给实体类重写toString方法，测试使用完注意需要删除
//        System.out.println("添加的申请信息："+ applicationUser);
//
//        // 省略Service业务方法调用步骤，直接静态模拟返回值
//        int rows = 1;// 模拟方法调用返回受影响行数
//
//        PrintWriter writer = response.getWriter();
//        // 判断受影响行数值，给出不同返回提示
//        if(rows > 0){
//            writer.write("success");
//        }else{
//            writer.write("error");
//        }
//        // 释放资源
//        writer.close();
//    }
//}
