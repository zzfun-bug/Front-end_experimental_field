package com.cdtu.visit.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.web.client.RestTemplate;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/wx/login")
public class WXLoginServlet extends HttpServlet {
    //创建RestTemplate对象，用来在java程序中发起HTTP请求
    private RestTemplate restTemplate = new RestTemplate();
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //微信接口地址
        String url ="https://api.weixin.qq.com/sns/jscode2session";
        //String appId = "wx48658669bbb8628f";
        String appId = "wx8c404cc9f548a0e9";
        //String secret = "edea284494ee95b8e62ad01791a794d6";
        String secret = "ad2545164789c25c5ae78b9f3e778523";
        //小程序端传入
        String jsCode =request.getParameter("code");
        System.out.println(jsCode);
        //String grantType = "authorization_code";
        String grantType = "authorization_code";
        //拼接接完整的URL
        //url += "?appid=" + appId + "&secret=" + secret + "&js_code=" + jsCode + "&grant_type=" + grantType;
        url += "?appid=" + appId + "&secret=" + secret + "&js_code=" + jsCode + "&grant_type=" + grantType;
        System.out.println(" 完整请求请求地址："+url);
        //发起GET请求,并获取返回结果(json字符串对象)
        String jsonString = restTemplate.getForObject(url, String.class);
        //调用fastjson将json字符串转为Java对象的格式
        JSONObject jsonObject = JSON.parseObject(jsonString);
        /*
        微信官方返回的对象示例：
        {
            "openid":"xxxxxx",
            "session_key":"xxxxx",
            "unionid":"xxxxx",
            "errcode":0,
            "errmsg":"xxxxx"
         }
         */
        // 检查是否有错误码
        if (jsonObject.containsKey("errcode")) {
            return;
        }

        //获取openid
        String openid = jsonObject.getString("openid");
        System.out.println("返回的微信标识："+openid);
        response.getWriter().write(openid);
    }
}







