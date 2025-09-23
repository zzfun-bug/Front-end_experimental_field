package com.cdtu.visit.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")
public class CorsFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 过滤器初始化
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse res = (HttpServletResponse) response;
        HttpServletRequest req = (HttpServletRequest) request;

        // 设置CORS头部
        res.setHeader("Access-Control-Allow-Origin", "*"); // 允许所有来源
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT"); // 允许的方法
        res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // 允许的头部

        // 如果是预检请求，直接返回
        if (req.getMethod().equals("OPTIONS")) {
            response.getWriter().println("OK");
            return;
        }

        // 继续链路
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // 过滤器销毁
    }
}
