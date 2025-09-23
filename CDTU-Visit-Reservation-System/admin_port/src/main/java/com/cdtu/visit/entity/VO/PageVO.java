package com.cdtu.visit.entity.VO;
import com.cdtu.visit.entity.ApplicationUser;
import java.util.List;

public class PageVO {
    private int total;
    private int pages;
    private List<ApplicationUser> applyList;

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public List<ApplicationUser> getApplyList() {
        return applyList;
    }

    public void setApplyList(List<ApplicationUser> applyList) {
        this.applyList = applyList;
    }

    @Override
    public String toString() {
        return "PageVO{" +
                "total=" + total +
                ", pages=" + pages +
                ", applyList=" + applyList +
                '}';
    }
}
