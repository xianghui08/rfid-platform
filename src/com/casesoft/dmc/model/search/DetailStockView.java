package com.casesoft.dmc.model.search;





import org.jeecgframework.poi.excel.annotation.Excel;

import javax.persistence.*;

/**
 * Created by WingLi on 2016-01-24.
 */
@Entity
@Table(name = "search_detailstockviews")
public class DetailStockView extends BaseProductView {


    @Id
    @Column()
    private String id;
    @Column()
    private String ownerId;
    @Column()
    @Excel(name = "仓库ID", width = 20D)
    private String warehId;
    @Column()
    private Integer warehType;
    @Column()
    private Double stockprice = 0D;
    @Column()
    @Excel(name = "SKU", width = 20D)
    private String sku;
    @Column()
    @Excel(name = "库存数量")
    private Integer qty;
    @Column()
    private Double precast =0D;
    @Column()
    private Double puprice=0D;
    @Column()
    private Double wsprice=0D;
    @Column()
    private String insotretype;
    @Transient
    @Excel(name = "仓库")
    private String warehName;
    @Transient
    private String colorname;
    @Transient
    @Excel(name = "库存金额")
    private Double inStockPrice;
    @Column()
    @Excel(name="厂家")
    private String class1Name;

    public String getClass1Name() {
        return class1Name;
    }

    public void setClass1Name(String class1Name) {
        this.class1Name = class1Name;
    }

    @Transient
    @Excel(name = "图片", type = 2 ,width = 20 , height = 20)
    private String url;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getColorname() {
        return colorname;
    }

    public void setColorname(String colorname) {
        this.colorname = colorname;
    }

    public String getWarehName() {
        return warehName;
    }

    public void setWarehName(String warehName) {
        this.warehName = warehName;
    }

    public Double getStockprice() {
        return stockprice;
    }

    public void setStockprice(Double stockprice) {
        this.stockprice = stockprice;
    }

    public Double getPrecast() {
        return precast;
    }

    public void setPrecast(Double precast) {
        this.precast = precast;
    }

    public Double getPuprice() {
        return puprice;
    }

    public void setPuprice(Double puprice) {
        this.puprice = puprice;
    }

    public Double getWsprice() {
        return wsprice;
    }

    public void setWsprice(Double wsprice) {
        this.wsprice = wsprice;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getWarehId() {
        return warehId;
    }

    public void setWarehId(String warehId) {
        this.warehId = warehId;
    }

    public Integer getWarehType() {
        return warehType;
    }

    public void setWarehType(Integer warehType) {
        this.warehType = warehType;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getInsotretype() {
        return insotretype;
    }

    public void setInsotretype(String insotretype) {
        this.insotretype = insotretype;
    }

    public Double getInStockPrice() {
        return inStockPrice;
    }

    public void setInStockPrice(Double inStockPrice) {
        this.inStockPrice = inStockPrice;
    }
}
