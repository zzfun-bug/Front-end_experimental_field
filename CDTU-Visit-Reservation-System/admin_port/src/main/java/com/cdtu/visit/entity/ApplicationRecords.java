package com.cdtu.visit.entity;


import java.util.Date;

public class ApplicationRecords {
    private Long id;
    private Date visitDate;
    private String visitUnit;
    private Integer visitNature;
    private Integer visitNum;
    private String visitCar;
    private String contactName;
    private String contactPhone;
    private String createBy;
    private Date createTime;

    // Get 和 Set

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public Integer getVisitNature() {
        return visitNature;
    }

    public void setVisitNature(Integer visitNature) {
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
}
