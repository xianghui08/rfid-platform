package com.casesoft.dmc.model.search;

import com.alibaba.fastjson.annotation.JSONField;
import org.jeecgframework.poi.excel.annotation.Excel;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Administrator on 2017/8/31.
 */
@Entity
@Table(name = "search_saleordercountoviews")
public class saleorderCountOViews {
    @Id
    @Column()
    private String id;
    @Column()
    private String billno;
    @Column()
    private Double actprice;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    @Column()
    private Integer actqty;
    @Column()
    private String colorid;
    @Column()
    private Integer initqty;
    @Column()
    private Integer manualqty;
    @Column()
    private Integer premanualqty;
    @Column()
    private Double price;
    @Column()
    private Integer qty;
    @Column()
    private Integer scanqty;
    @Column()
    private String sizeid;
    @Column()
    private String stylename;

    public String getStylename() {
        return stylename;
    }

    public void setStylename(String stylename) {
        this.stylename = stylename;
    }

    @Column()
    private String sku;
    @Column()
    private String styleid;
    @Column()
    private Double totactprice;
    @Column()
    private Double totprice;
    @Column()
    private Integer outqty;
    @Column()
    private Double outval;
    @Column()
    private Integer instatus;
    @Column()
    private Integer outstatus;
    @Column()
    private Double stockval;
    /* @Column()
     private Double avgpreprice;*/
    @Column()
    private Double inval;
    /* @Column()
     private Double profit;*/
    @Column()
    private Double discount;

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    /*    @Column()
        private Double profitrate;*/
    @JSONField(format="yyyy-MM-dd")
    @Column(nullable = false,length = 19)
    private Date billDate;
    @Column()
    private String destid;
    private String destname;
    @Column()
    private String destunitid;
    @Column()
    private String destunitname;
    @Column()
    private String oprid;
    @Column()
    private String origid;
    @Column()
    private String origname;

    public String getDestid() {
        return destid;
    }

    public void setDestid(String destid) {
        this.destid = destid;
    }

    public String getDestname() {
        return destname;
    }

    public void setDestname(String destname) {
        this.destname = destname;
    }

    @Column()
    private String origunitid;
    @Column()
    private String origunitname;
    @Column()
    private String ownerid;
    @Column()
    private Double payprice;
    @Column()
    private Integer status;
    @Column()
    private Double totprices;
    @Column()
    private Integer totqty;
    @Column()
    private String customertypeid;
    @Column()
    private Double totstockval;
    @Column()
    private Double gross;
    @Column()
    private Double grossall;
    @Column()
    private String class3;
    @Column()
    private String class3Name;

    public Double getGross() {
        return gross;
    }

    public void setGross(Double gross) {
        this.gross = gross;
    }

    public Double getGrossall() {
        return grossall;
    }

    public void setGrossall(Double grossall) {
        this.grossall = grossall;
    }
    /* @Column()
    private Double profits;*/

    public String getBillno() {
        return billno;
    }

    public void setBillno(String billno) {
        this.billno = billno;
    }

    public Double getActprice() {
        return actprice;
    }

    public void setActprice(Double actprice) {
        this.actprice = actprice;
    }

    public Integer getActqty() {
        return actqty;
    }

    public void setActqty(Integer actqty) {
        this.actqty = actqty;
    }

    public String getColorid() {
        return colorid;
    }

    public void setColorid(String colorid) {
        this.colorid = colorid;
    }

    public Integer getInitqty() {
        return initqty;
    }

    public void setInitqty(Integer initqty) {
        this.initqty = initqty;
    }

    public Integer getManualqty() {
        return manualqty;
    }

    public void setManualqty(Integer manualqty) {
        this.manualqty = manualqty;
    }

    public Integer getPremanualqty() {
        return premanualqty;
    }

    public void setPremanualqty(Integer premanualqty) {
        this.premanualqty = premanualqty;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public Integer getScanqty() {
        return scanqty;
    }

    public void setScanqty(Integer scanqty) {
        this.scanqty = scanqty;
    }

    public String getSizeid() {
        return sizeid;
    }

    public void setSizeid(String sizeid) {
        this.sizeid = sizeid;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getStyleid() {
        return styleid;
    }

    public void setStyleid(String styleid) {
        this.styleid = styleid;
    }

    public Double getTotactprice() {
        return totactprice;
    }

    public void setTotactprice(Double totactprice) {
        this.totactprice = totactprice;
    }

    public Double getTotprice() {
        return totprice;
    }

    public void setTotprice(Double totprice) {
        this.totprice = totprice;
    }

    public Integer getOutqty() {
        return outqty;
    }

    public void setOutqty(Integer outqty) {
        this.outqty = outqty;
    }

    public Double getOutval() {
        return outval;
    }

    public void setOutval(Double outval) {
        this.outval = outval;
    }

    public Integer getInstatus() {
        return instatus;
    }

    public void setInstatus(Integer instatus) {
        this.instatus = instatus;
    }

    public Integer getOutstatus() {
        return outstatus;
    }

    public void setOutstatus(Integer outstatus) {
        this.outstatus = outstatus;
    }

    public Double getStockval() {
        return stockval;
    }

    public void setStockval(Double stockval) {
        this.stockval = stockval;
    }

/*    public Double getAvgpreprice() {
        return avgpreprice;
    }

    public void setAvgpreprice(Double avgpreprice) {
        this.avgpreprice = avgpreprice;
    }*/

    public Double getInval() {
        return inval;
    }

    public void setInval(Double inval) {
        this.inval = inval;
    }

/*    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    public Double getProfitrate() {
        return profitrate;
    }

    public void setProfitrate(Double profitrate) {
        this.profitrate = profitrate;
    }*/

    public Date getBillDate() {
        return billDate;
    }

    public void setBillDate(Date billDate) {
        this.billDate = billDate;
    }

    public String getDestunitid() {
        return destunitid;
    }

    public void setDestunitid(String destunitid) {
        this.destunitid = destunitid;
    }

    public String getDestunitname() {
        return destunitname;
    }

    public void setDestunitname(String destunitname) {
        this.destunitname = destunitname;
    }

    public String getOprid() {
        return oprid;
    }

    public void setOprid(String oprid) {
        this.oprid = oprid;
    }

    public String getOrigid() {
        return origid;
    }

    public void setOrigid(String origid) {
        this.origid = origid;
    }

    public String getOrigname() {
        return origname;
    }

    public void setOrigname(String origname) {
        this.origname = origname;
    }

    public String getOrigunitid() {
        return origunitid;
    }

    public void setOrigunitid(String origunitid) {
        this.origunitid = origunitid;
    }

    public String getOrigunitname() {
        return origunitname;
    }

    public void setOrigunitname(String origunitname) {
        this.origunitname = origunitname;
    }

    public String getOwnerid() {
        return ownerid;
    }

    public void setOwnerid(String ownerid) {
        this.ownerid = ownerid;
    }

    public Double getPayprice() {
        return payprice;
    }

    public void setPayprice(Double payprice) {
        this.payprice = payprice;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Double getTotprices() {
        return totprices;
    }

    public void setTotprices(Double totprices) {
        this.totprices = totprices;
    }

    public Integer getTotqty() {
        return totqty;
    }

    public void setTotqty(Integer totqty) {
        this.totqty = totqty;
    }

    public String getCustomertypeid() {
        return customertypeid;
    }

    public void setCustomertypeid(String customertypeid) {
        this.customertypeid = customertypeid;
    }

    public Double getTotstockval() {
        return totstockval;
    }

    public void setTotstockval(Double totstockval) {
        this.totstockval = totstockval;
    }

/*    public Double getProfits() {
        return profits;
    }

    public void setProfits(Double profits) {
        this.profits = profits;
    }

    public Double getProfitrates() {
        return profitrates;
    }

    public void setProfitrates(Double profitrates) {
        this.profitrates = profitrates;
    }*/


    /*@Column()
    private Double profitrates;*/
    @Column()
    private String busnissname;

    public String getBusnissname() {
        return busnissname;
    }

    public void setBusnissname(String busnissname) {
        this.busnissname = busnissname;
    }

    @Transient
    private String saletype;

    public String getSaletype() {
        return saletype;
    }

    public void setSaletype(String saletype) {
        this.saletype = saletype;
    }

    @Column()
    private String deport;

    public String getDeport() {
        return deport;
    }

    public void setDeport(String deport) {
        this.deport = deport;
    }
    @Column()
    private String  groupid;

    public String getGroupid() {
        return groupid;
    }

    public void setGroupid(String groupid) {
        this.groupid = groupid;
    }

    public String getClass3() {
        return class3;
    }

    public void setClass3(String class3) {
        this.class3 = class3;
    }

    public String getClass3Name() {
        return class3Name;
    }

    public void setClass3Name(String class3Name) {
        this.class3Name = class3Name;
    }
}
