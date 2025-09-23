package com.cdtu.visit.controller;

import com.alibaba.fastjson.JSONObject;
import com.cdtu.visit.entity.ApplicationUser;
import com.cdtu.visit.service.ApplicationUserService;
import com.cdtu.visit.service.impl.ApplicationUserServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.sql.Timestamp;

@WebServlet("/audit")
public class AuditServlet extends HttpServlet {
    private ApplicationUserService applicationUserService = new ApplicationUserServiceImpl();

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. 设置请求编码
        request.setCharacterEncoding("UTF-8");

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        //
        // 读取 JSON 请求体
        StringBuilder jsonString = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonString.append(line);
            }
        }
        //
        // 解析 JSON 对象
        JSONObject jsonObject = JSONObject.parseObject(jsonString.toString());

        // 提取参数
        Integer id = jsonObject.getInteger("id");
        Integer status = jsonObject.getInteger("status");
        String commentatorName = jsonObject.getString("commentatorName");
        String commentatorPhone = jsonObject.getString("commentatorPhone");
        String rejectReason = jsonObject.getString("rejectReason");
        String updateBy = jsonObject.getString("updateBy");
        // 检查必要的参数是否存在
        if (id == -1 || status == -1) {
            sendResponse(response, false, "Invalid input parameters");
            return;
        }


            // 4. 使用 findById 获取用户信息
            ApplicationUser existingUser;
            try {
                existingUser = applicationUserService.findById(id);
                if (existingUser == null) {
                    sendResponse(response, false, "User not found");
                    return;
                }
                
                // 检查是否已经审核过
                if (existingUser.getStatus() != 0) {
                    sendResponse(response, false, "该记录已经审核过，不能重复审核");
                    return;
                }

            // 5. 构建 ApplicationUser 对象
            ApplicationUser applicationUser = new ApplicationUser();
            applicationUser.setId(id);
            applicationUser.setStatus(status);
            applicationUser.setCommentatorName(commentatorName);
            applicationUser.setCommentatorPhone(commentatorPhone);
            applicationUser.setRejectReason(rejectReason);
            applicationUser.setUpdateBy(updateBy);

            // 设置 updateTime 为当前时间
            applicationUser.setUpdateTime(new Timestamp(System.currentTimeMillis()));

            // 6. 调用 Service 更新数据
            applicationUserService.updateApplicationUser(applicationUser);

            // 响应客户端成功信息
            sendResponse(response, true, "Update successful");
        } catch (SQLException | ClassNotFoundException e) {
            sendResponse(response, false, "Update failed");
            throw new RuntimeException("更新失败", e);
        }
    }

    private void sendResponse(HttpServletResponse response, boolean success, String message) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.write(String.format("{\"success\": %b, \"message\": \"%s\"}", success, message));
        out.flush();
        out.close();
    }
}

