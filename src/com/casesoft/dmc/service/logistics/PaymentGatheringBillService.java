package com.casesoft.dmc.service.logistics;

import com.casesoft.dmc.core.dao.PropertyFilter;
import com.casesoft.dmc.core.service.IBaseService;
import com.casesoft.dmc.core.util.CommonUtil;
import com.casesoft.dmc.core.util.page.Page;
import com.casesoft.dmc.dao.logistics.PaymentGatheringBillDao;
import com.casesoft.dmc.dao.shop.payDetailDao;
import com.casesoft.dmc.dao.sys.UnitDao;
import com.casesoft.dmc.model.logistics.PaymentGatheringBill;
import com.casesoft.dmc.model.shop.Customer;
import com.casesoft.dmc.model.shop.PayDetail;
import com.casesoft.dmc.model.sys.Unit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by yushen on 2017/7/8.
 */
@Service
@Transactional
public class PaymentGatheringBillService implements IBaseService<PaymentGatheringBill,String> {

    @Autowired
    private PaymentGatheringBillDao paymentGatheringBillDao;
    @Autowired
    private UnitDao unitDao;
    @Autowired
    private payDetailDao payDetailDao;


    @Override
    public Page<PaymentGatheringBill> findPage(Page<PaymentGatheringBill> page, List<PropertyFilter> filters) {
        return this.paymentGatheringBillDao.findPage(page,filters);
    }

    @Override
    public void save(PaymentGatheringBill entity) {
        this.paymentGatheringBillDao.save(entity);

    }
    public void saveandunit(PaymentGatheringBill entity) {
        this.paymentGatheringBillDao.save(entity);
        Unit load = this.unitDao.get(entity.getVendorId());
        load.setOwingValue((load.getOwingValue()-entity.getPayPrice()));
        this.unitDao.update(load);
    }

    @Override
    public PaymentGatheringBill load(String id) {
        return this.paymentGatheringBillDao.load(id);
    }

    @Override
    public PaymentGatheringBill get(String propertyName, Object value) {
        return this.paymentGatheringBillDao.findUniqueBy(propertyName,value);
    }

    @Override
    public List<PaymentGatheringBill> find(List<PropertyFilter> filters) {
        return this.paymentGatheringBillDao.find(filters);
    }

    @Override
    public List<PaymentGatheringBill> getAll() {
        return this.paymentGatheringBillDao.getAll();
    }

    @Override
    public <X> List<X> findAll() {
        return null;
    }

    @Override
    public void update(PaymentGatheringBill entity) {
        this.paymentGatheringBillDao.saveOrUpdate(entity);
    }

    @Override
    public void delete(PaymentGatheringBill entity) {
        this.paymentGatheringBillDao.delete(entity);
    }

    @Override
    public void delete(String id) {
        this.paymentGatheringBillDao.delete(id);
    }

    public String getMaxNo(String prefix) {
        String hql = "select max(CAST(SUBSTRING(t.id,9),integer))"
                + " from PaymentGatheringBill as t where t.id like ?";
        Integer code = this.paymentGatheringBillDao.findUnique(hql, prefix + '%');
        return code == null ? (prefix + "001") : prefix + CommonUtil.convertIntToString(code + 1, 3);
    }

    public void saveGuest(PaymentGatheringBill entity) {
        this.paymentGatheringBillDao.save(entity);
        //保存收银表
        PayDetail payDetail = new PayDetail();
        payDetail.setId(entity.getBillNo()+entity.getPayType());
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
        payDetail.setPayDate(df.format(new Date()));
        payDetail.setCustomerId(entity.getCustomsId());
        payDetail.setCustomerName(entity.getCustomsName());
        payDetail.setShop(entity.getVendorId());
        payDetail.setShopName(entity.getVendorName());
        payDetail.setBillNo(entity.getBillNo());
        payDetail.setPayType(entity.getPayType());
        payDetail.setPayPrice(entity.getPayPrice());
        payDetail.setActPayPrice(entity.getPayPrice());
        payDetail.setBillType(entity.getBillType());
        payDetail.setDonationPrice(entity.getDonationPrice());
        payDetail.setStatus("1");
        if("2".equals(entity.getBillType())){
            payDetail.setActPayPrice(-entity.getPayPrice());
            payDetail.setPayPrice(-entity.getPayPrice());
        }
        this.payDetailDao.saveOrUpdate(payDetail);
        Unit unit = this.paymentGatheringBillDao.findUnique("from Unit where id = ?",new Object[]{entity.getCustomsId()});
        if(CommonUtil.isBlank(unit)){
            Customer customer = this.paymentGatheringBillDao.findUnique("from Customer where id = ? ",new Object[]{entity.getCustomsId()});
            customer.setOwingValue((customer.getOwingValue()-entity.getPayPrice()));
            this.paymentGatheringBillDao.saveOrUpdateX(customer);
        }else {
            unit.setOwingValue((unit.getOwingValue()-entity.getPayPrice()));
            this.paymentGatheringBillDao.saveOrUpdateX(unit);
        }
    }
}
