package com.casesoft.dmc.extend.tag;

import com.casesoft.dmc.cache.CacheManager;
import com.casesoft.dmc.core.Constant;
import com.casesoft.dmc.core.util.CommonUtil;
import com.casesoft.dmc.core.util.file.PropertyUtil;
import com.casesoft.dmc.core.util.secret.EpcSecretUtil;
import com.casesoft.dmc.model.product.Product;

/**
 * Created by WinLi on 2017/3/1.
 */
public class EllassayTag extends AbstractBaseTag {

    public EllassayTag() {
    }

    public EllassayTag(String styleId, String colorId, String sizeId) {
        super();
        this.styleId = styleId;
        this.colorId = colorId;
        this.sizeId = sizeId;
    }

    @Override
    public boolean isUniqueCodeStock() {
        return false;
    }

    @Override
    public String getEpc() {

        this.epc = uniqueCode
                + CommonUtil.produceIntToString(0, 24 - uniqueCode.length());
        return this.epc;
    }

    @Override
    public int getEpcLength() {
        return 24;
    }

    @Override
    public String getSecretEpc() {
        return EpcSecretUtil.encodeEpc(this.epc);
    }

    @Override
    public void setSecretEpc(String secretEpc) {
        // TODO Auto-generated method stub

    }

    @Override
    public String getUniqueCode(int startNo, int i) {


        Product p = CacheManager.getProductByCode(sku);
        this.uniqueCode = p.getId()
                + CommonUtil.produceIntToString(startNo + i - 1,
                this.getSerialLength()) + Constant.TagSerial.Ellassay;
        return uniqueCode;
    }

    @Override
    public String getUniqueCode() {
        return this.uniqueCode;
    }

    @Override
    public String setUniqueCode(String uniqueCode) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getSku() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public int getSerialLength() {
        // TODO Auto-generated method stub
        return 5;
    }

    @Override
    public int getStyleLength() {

        return CommonUtil.isBlank(this.styleId) ? 8 : this.styleId.length();
    }

    @Override
    public int getColorLength() {
        return CommonUtil.isBlank(this.colorId) ? 2 : this.colorId.length();
    }

    @Override
    public int getSizeLength() {

        return CommonUtil.isBlank(this.sizeId) ? 2 : this.sizeId.length();
    }

    @Override
    public void setStyleId(String styleId) {
        this.styleId = styleId;
    }

    @Override
    public void setColorId(String colorId) {
        this.colorId = colorId;
    }

    @Override
    public void setSizeId(String sizeId) {
        this.sizeId = sizeId;
    }

    @Override
    public String convertToStyle(int temp) throws Exception {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String convertToColor(int temp) throws Exception {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String convertToSize(int temp) throws Exception {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String[] getSizeConfig() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getTypeName() {
        return "EllassayTag";
    }

    @Override
    public String getServerUrl() throws Exception {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getClientUpdateFilePath() throws Exception {
        return PropertyUtil.getValue("SpecialCloud_updateFile_Path");
    }

    @Override
    public String getEpc(String uniqueCode) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getSecretEpc(String epc) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getUniqueCodeBySku(int startNo, int i, String sku) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getSkuByUniqueCode(String uniqueCode) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getStyleIdByUniqueCode(String uniqueCode) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getColorIdByUniqueCode(String uniqueCode) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getSizeIdByUniqueCode(String uniqueCode) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void setSku(String sku) {
        this.sku=sku;
    }
}
