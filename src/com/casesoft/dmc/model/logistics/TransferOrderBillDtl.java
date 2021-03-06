package com.casesoft.dmc.model.logistics;

import javax.persistence.*;

/**
 * Created by yushen on 2017/7/3.
 */
@Entity
@Table(name = "LOGISTICS_TRANSFERORDERBILLDTL")
public class TransferOrderBillDtl extends BaseBillDtl {

    @Id
    @Column()
    private String id;

    @Column()
    private Integer outQty=0;//出库数量
    @Column()
    private Double outVal =0D;//出库金额
    @Column()
    private Integer inQty =0; //入库数量
    @Column()
    private Double inVal =0D;  //入库金额

    @Column()
    private int outStatus=0;
    @Column()
    private int inStatus =0;
    @Transient
    private String noOutPutCode;

    public String getNoOutPutCode() {
        return noOutPutCode;
    }

    public void setNoOutPutCode(String noOutPutCode) {
        this.noOutPutCode = noOutPutCode;
    }

    @Transient
    private String supplierName;//供应商名字关联款中class1对应name


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getInQty() {
        return inQty;
    }

    public void setInQty(Integer inQty) {
        this.inQty = inQty;
    }

    public Double getInVal() {
        return inVal;
    }

    public void setInVal(Double inVal) {
        this.inVal = inVal;
    }

    public Integer getOutQty() { return outQty; }

    public void setOutQty(Integer outQty) { this.outQty = outQty; }

    public Double getOutVal() { return outVal; }

    public void setOutVal(Double outVal) { this.outVal = outVal; }

    public Integer getOutStatus() {
        return outStatus;
    }

    public void setOutStatus(Integer outStatus) {
        this.outStatus = outStatus;
    }

    public Integer getInStatus() {
        return inStatus;
    }

    public void setInStatus(Integer inStatus) {
        this.inStatus = inStatus;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }
}
