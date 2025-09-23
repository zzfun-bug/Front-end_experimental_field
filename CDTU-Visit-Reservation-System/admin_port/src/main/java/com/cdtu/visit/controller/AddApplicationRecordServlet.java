package com.cdtu.visit.controller;

import com.alibaba.fastjson.JSONObject;
import com.cdtu.visit.entity.ApplicationRecords;
import com.cdtu.visit.service.ApplicationRecordsService;
import com.cdtu.visit.service.impl.ApplicationRecordsServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

@WebServlet("/add")
public class AddApplicationRecordServlet extends HttpServlet {
    private ApplicationRecordsService applicationRecordsService = new ApplicationRecordsServiceImpl();

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. 设置请求编码
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");

        // 2. 读取 JSON 请求体
        StringBuilder jsonString = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonString.append(line);
            }
        }

        // 3. 解析 JSON 对象
        JSONObject jsonObject = JSONObject.parseObject(jsonString.toString());

        // 4. 提取参数
        Date visitDate = jsonObject.getDate("visitDate");
        String visitUnit = jsonObject.getString("visitUnit");
        Integer visitNature = jsonObject.getInteger("visitNature");
        Integer visitNum = jsonObject.getInteger("visitNum");
        String visitCar = jsonObject.getString("visitCar");
        String contactName = jsonObject.getString("contactName");
        String contactPhone = jsonObject.getString("contactPhone");

        // 检查必要的参数是否存在
        if (visitDate == null || visitUnit == null || visitNature == null || visitNum == null || contactName == null || contactPhone == null) {
            sendResponse(response, false, "Invalid input parameters");
            return;
        }

        // 5. 构建 ApplicationRecords 对象
        ApplicationRecords applicationRecords = new ApplicationRecords();
        applicationRecords.setVisitDate(visitDate);
        applicationRecords.setVisitUnit(visitUnit);
        applicationRecords.setVisitNature(visitNature);
        applicationRecords.setVisitNum(visitNum);
        applicationRecords.setVisitCar(visitCar);
        applicationRecords.setContactName(contactName);
        applicationRecords.setContactPhone(contactPhone);
        applicationRecords.setCreateBy(contactName); // 使用 contactName 作为 createBy
        applicationRecords.setCreateTime(new Date()); // 自动生成当前时间

        // 6. 调用 Service 添加记录addApplicationRecord.(applicationRecords);
        try {
            applicationRecordsService.saveApplicationRecord(applicationRecords);
            sendResponse(response, true, "Application record added successfully");
        } catch (Exception e) {
            sendResponse(response, false, "Failed to add application record");
            throw new RuntimeException("Failed to add application record", e);
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
