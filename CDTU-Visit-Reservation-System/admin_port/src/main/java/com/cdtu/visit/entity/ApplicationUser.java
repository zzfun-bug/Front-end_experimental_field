package com.cdtu.visit.entity;

import java.util.Date;

public class ApplicationUser {
    /**
     * 主键
     */
    private Integer id;
    /**
     * 参观时间
     */
    private Date visitDate;
    /**
     * 单位名称
     */
    private String visitUnit;
    /**
     * 单位性质
     */
    private int visitNature;
    /**
     * 来访人数
     */
    private Integer visitNum;
    /**
     * 车牌号
     */
    private String visitCar;
    /**
     * 联系人姓名
     */
    private String contactName;
    /**
     * 联系人电话
     */
    private String contactPhone;
    /**
     * 预约时间段
     */
    private String timeSolt;
    /**
     * 预约状态（0-审核中，1-通过，2-驳回，3-取消）
     */
    private Integer status;
    /**
     * 讲解员姓名
     */
    private String commentatorName;
    /**
     * 讲解员电话
     */
    private String commentatorPhone;
    /**
     * 拒绝原因
     */
    private String rejectReason;
    /**
     * 删除状态（0-未删除，1-已删除）
     */
    private Integer delFlag;
    /**
     * 创建者
     */
    private String createBy;
    /**
     * 创建时间
     */
    private Date createTime;
    /**
     * 更新者
     */
    private String updateBy;
    /**
     * 更新时间
     */
    private Date updateTime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(Date visitDate) {
        this.visitDate = visitDate;
    }

    public String getVisitUnit() {
        return visitUnit;
    }

    public void setVisitUnit(String visitUnit) {
        this.visitUnit = visitUnit;
    }

    public int getVisitNature() {
        return visitNature;
    }

    public void setVisitNature(int visitNature) {
        this.visitNature = visitNature;
    }

    public Integer getVisitNum() {
        return visitNum;
    }

    public void setVisitNum(Integer visitNum) {
        this.visitNum = visitNum;
    }

    public String getVisitCar() {
        return visitCar;
    }

    public void setVisitCar(String visitCar) {
        this.visitCar = visitCar;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getTimeSolt() {
        return timeSolt;
    }

    public void setTimeSolt(String timeSolt) {
        this.timeSolt = timeSolt;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getCommentatorName() {
        return commentatorName;
    }

    public void setCommentatorName(String commentatorName) {
        this.commentatorName = commentatorName;
    }

    public String getCommentatorPhone() {
        return commentatorPhone;
    }

    public void setCommentatorPhone(String commentatorPhone) {
        this.commentatorPhone = commentatorPhone;
    }

    public String getRejectReason() {
        return rejectReason;
    }

    public void setRejectReason(String rejectReason) {
        this.rejectReason = rejectReason;
    }

    public Integer getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(Integer delFlag) {
        this.delFlag = delFlag;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    @Override
    public String toString() {
        return "ApplicationUser{" +
                "id=" + id +
                ", visitDate=" + visitDate +
                ", visitUnit='" + visitUnit + '\'' +
                ", visitNature=" + visitNature +
                ", visitNum=" + visitNum +
                ", visitCar='" + visitCar + '\'' +
                ", contactName='" + contactName + '\'' +
                ", contactPhone='" + contactPhone + '\'' +
                ", timeSolt='" + timeSolt + '\'' +
                ", status=" + status +
                ", commentatorName='" + commentatorName + '\'' +
                ", commentatorPhone='" + commentatorPhone + '\'' +
                ", rejectReason='" + rejectReason + '\'' +
                ", delFlag=" + delFlag +
                ", createBy='" + createBy + '\'' +
                ", createTime=" + createTime +
                ", updateBy='" + updateBy + '\'' +
                ", updateTime=" + updateTime +
                '}';
    }
}

