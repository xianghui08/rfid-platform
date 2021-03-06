package com.casesoft.dmc.controller.logistics;

import com.alibaba.fastjson.JSON;
import com.casesoft.dmc.cache.CacheManager;
import com.casesoft.dmc.core.Constant;
import com.casesoft.dmc.core.controller.BaseController;
import com.casesoft.dmc.core.controller.ILogisticsBillController;
import com.casesoft.dmc.core.dao.PropertyFilter;
import com.casesoft.dmc.core.util.CommonUtil;
import com.casesoft.dmc.core.util.json.FastJSONUtil;
import com.casesoft.dmc.core.util.mock.GuidCreator;
import com.casesoft.dmc.core.util.page.Page;
import com.casesoft.dmc.core.vo.MessageBox;
import com.casesoft.dmc.model.logistics.*;
import com.casesoft.dmc.model.sys.*;
import com.casesoft.dmc.model.tag.Epc;
import com.casesoft.dmc.model.tag.Init;
import com.casesoft.dmc.model.task.Business;
import com.casesoft.dmc.service.logistics.PurchaseOrderBillService;
import com.casesoft.dmc.service.logistics.PurchaseReturnBillService;
import com.casesoft.dmc.service.logistics.ReplenishBillService;
import com.casesoft.dmc.service.sys.ResourcePrivilegeService;
import com.casesoft.dmc.service.sys.SettingService;
import com.casesoft.dmc.service.sys.impl.ResourceService;
import com.casesoft.dmc.service.tag.InitService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Alvin on 2017-06-13.
 */
@Controller
@RequestMapping("/logistics/purchaseOrderBill")
public class    PurchaseOrderBillController extends BaseController implements ILogisticsBillController<PurchaseOrderBill> {
    @Autowired
    private PurchaseOrderBillService purchaseOrderBillService;
    @Autowired
    private InitService initService;
    @Autowired
    private ReplenishBillService replenishBillService;
    @Autowired
    private ResourceService resourceService;
    @Autowired
    private ResourcePrivilegeService resourcePrivilegeService;
    @Autowired
    private PurchaseReturnBillService purchaseReturnBillService;
    @Autowired
    private SettingService settingService;


    @RequestMapping(value = "/index")
    public ModelAndView indexMV() throws Exception {
        //查询系统操作
        Setting setting = this.settingService.get("id","repositoryManagement");
        ModelAndView mv = new ModelAndView("/views/logistics/purchaseOrderBill");
        mv.addObject("pageType", "add");
        List<ResourcePrivilege> resourcePrivilege = this.resourcePrivilegeService.findPrivilege("logistics/purchaseOrderBill", this.getCurrentUser().getRoleId());
        mv.addObject("resourcePrivilege", FastJSONUtil.getJSONString(resourcePrivilege));
        User user = this.getCurrentUser();
        mv.addObject("ownerId", user.getOwnerId());
        mv.addObject("userId", getCurrentUser().getId());
        Unit unit = CacheManager.getUnitByCode(getCurrentUser().getOwnerId());
        String defaultWarehId = unit.getDefaultWarehId();
        mv.addObject("defaultWarehId", defaultWarehId);
        this.getRequest().setAttribute("rm", setting);
        return mv;
    }

    @RequestMapping(value = "/page")
    @ResponseBody
    @Override
    public Page<PurchaseOrderBill> findPage(Page<PurchaseOrderBill> page) throws Exception {
        this.logAllRequestParams();
        List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(this
                .getRequest());
        String ownerId = getCurrentUser().getOwnerId();
        String id = getCurrentUser().getId();
        if (!id.equals("admin")) {
            PropertyFilter filter = new PropertyFilter("EQS_ownerId", ownerId);
            filters.add(filter);
        }
        page.setPageProperty();
        page = this.purchaseOrderBillService.findPage(page, filters);
        return page;
    }

    @RequestMapping(value = "/list")
    @ResponseBody
    @Override
    public List<PurchaseOrderBill> list() throws Exception {
        this.logAllRequestParams();
        List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(this
                .getRequest());
        List<PurchaseOrderBill> purchaseOrderBillList = this.purchaseOrderBillService.find(filters);
        return purchaseOrderBillList;
    }

    @RequestMapping(value = "/findBill")
    @ResponseBody
    public List<PurchaseOrderBill> findBill(String billNo)throws Exception{
        List<PurchaseOrderBill> orderBillList =this.purchaseOrderBillService.find(billNo);
        return orderBillList;
    }

    @RequestMapping(value = "/findBillDtl")
    @ResponseBody
    public List<PurchaseOrderBillDtl> findBillDtl(String billNo) throws Exception {
        this.logAllRequestParams();
        List<PurchaseOrderBillDtl> purchaseOrderBillDtls = this.purchaseOrderBillService.findBillDtlByBillNo(billNo);
        for (PurchaseOrderBillDtl dtl : purchaseOrderBillDtls) {
            dtl.setStyleName(CacheManager.getStyleNameById(dtl.getStyleId()));
            dtl.setColorName(CacheManager.getColorNameById(dtl.getColorId()));
            dtl.setSizeName(CacheManager.getSizeNameById(dtl.getSizeId()));
        }
        return purchaseOrderBillDtls;
    }

    @RequestMapping("/endNb")
    @ResponseBody
    public MessageBox endNb(String purchaseBillStr ,String strDtlList,String userId,String PbillNo)throws Exception{
        this.logAllRequestParams();
        try {
            PurchaseReturnBill purchaseReturnBill = JSON.parseObject(purchaseBillStr, PurchaseReturnBill.class);
            List<PurchaseReturnBillDtl> purchaseReturnBillDtlList = JSON.parseArray(strDtlList, PurchaseReturnBillDtl.class);
            String prefix = BillConstant.BillPrefix.purchaseReturn
                    + CommonUtil.getDateString(new Date(), "yyMMddHHmmssSSS");
            String billNo = this.purchaseReturnBillService.findMaxBillNo(prefix);
            purchaseReturnBill.setBillNo(billNo);
            purchaseReturnBill.setId(billNo);
            User currentUser = CacheManager.getUserById(userId);
            double actPriceSum = 0;
            for (PurchaseReturnBillDtl returnBill :purchaseReturnBillDtlList){
                actPriceSum +=returnBill.getTotActPrice();
            }
            purchaseReturnBill.setActPrice(actPriceSum);
            purchaseReturnBill.setPayPrice(actPriceSum);
            BillConvertUtil.convertToPurchaseReturnBill(purchaseReturnBill, purchaseReturnBillDtlList,currentUser);
            this.purchaseReturnBillService.saveBatch(purchaseReturnBill, purchaseReturnBillDtlList,PbillNo,billNo);
            return returnSuccessInfo("保存成功", purchaseReturnBill.getBillNo());
        }catch (Exception e){
            e.printStackTrace();
            return new MessageBox(false, e.getMessage());
        }
    }

    @RequestMapping(value = {"/save","/saveWS"})
    @ResponseBody
    @Override
    public MessageBox save(String purchaseBillStr, String strDtlList, String userId) throws Exception {
        this.logAllRequestParams();
        try {
            PurchaseOrderBill purchaseOrderBill = JSON.parseObject(purchaseBillStr, PurchaseOrderBill.class);
            if(CommonUtil.isNotBlank(request.getParameter("allocationId"))){
                purchaseOrderBill.setCageId(request.getParameter("cageId"));
                purchaseOrderBill.setRackId(request.getParameter("rackId"));
                purchaseOrderBill.setLevelId(request.getParameter("levelId"));
                purchaseOrderBill.setAllocationId(request.getParameter("allocationId"));
            }
            if (CommonUtil.isBlank(purchaseOrderBill.getBillNo())) {
                String prefix = BillConstant.BillPrefix.purchase
                        + CommonUtil.getDateString(new Date(), "yyMMddHHmmssSSS");
                //String billNo = this.purchaseOrderBillService.findMaxBillNo(prefix);
                purchaseOrderBill.setId(prefix);
                purchaseOrderBill.setBillNo(prefix);
            } else {

                Integer status = this.purchaseOrderBillService.findBillStatus(purchaseOrderBill.getBillNo());
                if (status != Constant.ScmConstant.BillStatus.saved && !userId.equals("admin")) {
                    return new MessageBox(false, "单据不是录入状态无法保存,请返回");
                }

            }
            //purchaseOrderBill.setId(purchaseOrderBill.getBillNo());
            List<PurchaseOrderBillDtl> purchaseOrderBillDtlList = JSON.parseArray(strDtlList, PurchaseOrderBillDtl.class);
            User curUser = CacheManager.getUserById(userId);
            BillConvertUtil.covertToPurchaseBill(purchaseOrderBill, purchaseOrderBillDtlList, curUser);
            this.purchaseOrderBillService.save(purchaseOrderBill, purchaseOrderBillDtlList);
            return new MessageBox(true, "保存成功", purchaseOrderBill.getBillNo());

        } catch (Exception e) {
            e.printStackTrace();
            return new MessageBox(false, e.getMessage());
        }
    }

    @RequestMapping(value = "/add")
    @ResponseBody
    @Override
    public ModelAndView add() throws Exception {
        ModelAndView mv = new ModelAndView("views/logistics/purchaseOrderBillDetail");
        mv.addObject("pageType", "add");
        mv.addObject("mainUrl", "/logistics/purchase/index.do");
        User user = this.getCurrentUser();
        mv.addObject("ownerId", user.getOwnerId());
        mv.addObject("userId", getCurrentUser().getId());
        Unit unit = CacheManager.getUnitByCode(getCurrentUser().getOwnerId());
        String defaultWarehId = unit.getDefaultWarehId();
        mv.addObject("defaultWarehId", defaultWarehId);
        return mv;
    }

    @RequestMapping(value = "/copyAdd")
    @ResponseBody
    public ModelAndView copyAdd(String billNo) throws Exception {
        PurchaseOrderBill purchaseOrderBill = this.purchaseOrderBillService.get("billNo", billNo);
        ModelAndView mv = new ModelAndView("views/logistics/purchaseOrderBillDetail");
        User user = this.getCurrentUser();
        mv.addObject("OwnerId", user.getOwnerId());
        mv.addObject("userId", getCurrentUser().getId());
        mv.addObject("pageType", "add");
        mv.addObject("purchaseOrderBill", purchaseOrderBill);
        mv.addObject("mainUrl", "/logistics/purchase/index.do");
        return mv;
    }

    @RequestMapping(value = "/edit")
    @ResponseBody
    @Override
    public ModelAndView edit(String billNo) throws Exception {
        PurchaseOrderBill purchaseOrderBill = this.purchaseOrderBillService.get("billNo", billNo);
        Boolean isAllowEdit = false;
        if (CommonUtil.isBlank(purchaseOrderBill.getBillType())) {
            isAllowEdit = true;
            purchaseOrderBill.setBillType(Constant.ScmConstant.BillType.Edit);
            HttpServletRequest request = this.getRequest();
            HttpSession session = request.getSession();
            session.setAttribute("billNopurchase", billNo);
        } else {
            if (purchaseOrderBill.getBillType().equals(Constant.ScmConstant.BillType.Save)) {
                isAllowEdit = true;
                purchaseOrderBill.setBillType(Constant.ScmConstant.BillType.Edit);
                HttpServletRequest request = this.getRequest();
                HttpSession session = request.getSession();
                session.setAttribute("billNopurchase", billNo);
            } else {
                isAllowEdit = false;
            }
        }
        if (isAllowEdit) {
            ModelAndView mv = new ModelAndView("views/logistics/purchaseOrderBillDetail");
            mv.addObject("pageType", "edit");
            mv.addObject("purchaseOrderBill", purchaseOrderBill);
            mv.addObject("mainUrl", "/logistics/purchase/back.do?billNo=" + billNo);
            User user = this.getCurrentUser();
            mv.addObject("OwnerId", user.getOwnerId());
            mv.addObject("userId", getCurrentUser().getId());
            Unit unit = CacheManager.getUnitByCode(getCurrentUser().getOwnerId());
            String defaultWarehId = unit.getDefaultWarehId();
            mv.addObject("defaultWarehId", defaultWarehId);
            return mv;
        } else {
            ModelAndView mv = new ModelAndView("/views/logistics/purchaseOrderBill");
            mv.addObject("billNo", billNo);
            mv.addObject("ownerId", getCurrentUser().getOwnerId());
            mv.addObject("userId", getCurrentUser().getId());
            return mv;
        }

    }

    @RequestMapping(value = "/back")
    @ResponseBody
    public ModelAndView back(String billNo) {
        PurchaseOrderBill purchaseOrderBill = this.purchaseOrderBillService.get("billNo", billNo);
        purchaseOrderBill.setBillType(Constant.ScmConstant.BillType.Save);
        HttpServletRequest request = this.getRequest();
        HttpSession session = request.getSession();
        session.removeAttribute("billNopurchase");
        this.purchaseOrderBillService.update(purchaseOrderBill);
        ModelAndView mv = new ModelAndView("/views/logistics/purchaseOrderBill");
        mv.addObject("ownerId", getCurrentUser().getOwnerId());
        mv.addObject("userId", getCurrentUser().getId());
        return mv;
    }

    @RequestMapping(value = "/quit")
    @ResponseBody
    public void quit(String billNo) {
        PurchaseOrderBill purchaseOrderBill = this.purchaseOrderBillService.get("billNo", billNo);
        purchaseOrderBill.setBillType(Constant.ScmConstant.BillType.Save);
        HttpServletRequest request = this.getRequest();
        HttpSession session = request.getSession();
        session.removeAttribute("billNopurchase");
        this.purchaseOrderBillService.update(purchaseOrderBill);
    }

    @RequestMapping(value = "/covertToTagBirth")
    @ResponseBody
    public MessageBox covertToTagBirth(String strDtlList) {
        this.logAllRequestParams();
        try {
            User currentUser = (User) this.getSession().getAttribute(
                    Constant.Session.User_Session);
            String prefixTaskId = Constant.Bill.Tag_Init_Prefix
                    + CommonUtil.getDateString(new Date(), "yyMMdd");
            String taskId = this.initService.findMaxNo(prefixTaskId);
            List<PurchaseOrderBillDtl> purchaseOrderBillDtlList = JSON.parseArray(strDtlList, PurchaseOrderBillDtl.class);
            Init master = BillConvertUtil.covertToTagBirth(taskId, purchaseOrderBillDtlList, initService, currentUser);
            if (master.getTotEpc() > 0) {
                this.purchaseOrderBillService.saveBirthTag(master, purchaseOrderBillDtlList);
                return new MessageBox(true, "成功生成标签初始化数据");
            } else {
                return new MessageBox(true, "无待打印的数据");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new MessageBox(false, e.getMessage());
        }

    }

    @RequestMapping(value = "/findNotInEpc")
    @ResponseBody
    public List<Epc> findNotInEpc(String billNo) {
        this.logAllRequestParams();
        List<Epc> epcList = this.purchaseOrderBillService.findNotInEpc(billNo);
        return epcList;

    }

    @RequestMapping(value = "/check")
    @ResponseBody
    @Override
    public MessageBox check(String billNo) throws Exception {

        PurchaseOrderBill purchaseOrderBill = this.purchaseOrderBillService.get("billNo", billNo);
        purchaseOrderBill.setStatus(BillConstant.BillStatus.Check);
        this.purchaseOrderBillService.update(purchaseOrderBill);
        return new MessageBox(true, "审核成功");

    }

    @RequestMapping(value = "/end")
    @ResponseBody
    @Override
    public MessageBox end(String billNo) throws Exception {
        PurchaseOrderBill purchaseOrderBill = this.purchaseOrderBillService.get("billNo", billNo);
        purchaseOrderBill.setStatus(BillConstant.BillStatus.End);
        this.purchaseOrderBillService.update(purchaseOrderBill);
        return new MessageBox(true, "结束成功");
    }

    @RequestMapping(value = "/cancel")
    @ResponseBody
    @Override
    public MessageBox cancel(String billNo) throws Exception {
        PurchaseOrderBill purchaseOrderBill = this.purchaseOrderBillService.get("billNo", billNo);
        if(purchaseOrderBill.getStatus().equals(BillConstant.BillStatus.Enter)) {
            purchaseOrderBill.setStatus(BillConstant.BillStatus.Cancel);
            this.purchaseOrderBillService.cancel(purchaseOrderBill);
            return new MessageBox(true, "撤销成功");
        }else{
            return returnFailInfo("不是录入状态，无法取消");
        }
    }

    @RequestMapping(value = "/apply")
    @ResponseBody
    public MessageBox apply(String billNo) throws Exception {
        PurchaseOrderBill purchaseOrderBill = this.purchaseOrderBillService.get("billNo", billNo);
        purchaseOrderBill.setStatus(BillConstant.BillStatus.Apply);
        this.purchaseOrderBillService.update(purchaseOrderBill);
        return new MessageBox(true, "申请成功");
    }


    @RequestMapping(value = "/convert")
    @ResponseBody
    @Override
    public MessageBox convert(String strDtlList, String recordList) throws Exception {
        List<PurchaseOrderBillDtl> purchaseOrderBillDtlList = JSON.parseArray(strDtlList, PurchaseOrderBillDtl.class);
        List<Epc> epcList = JSON.parseArray(recordList, Epc.class);
        if (epcList.size() != 0) {

            User currentUser = (User) this.getSession().getAttribute(
                    Constant.Session.User_Session);
            PurchaseOrderBill purchaseOrderBill = this.purchaseOrderBillService.get("billNo", purchaseOrderBillDtlList.get(0).getBillNo());
            //转入库单
            Business business = BillConvertUtil.covertToPurchaseBusiness(purchaseOrderBill, purchaseOrderBillDtlList, epcList, currentUser);
            this.purchaseOrderBillService.saveBusiness(purchaseOrderBill, purchaseOrderBillDtlList, business);
            String srcBillNo = purchaseOrderBill.getSrcBillNo();
            //与ParisService.uploadTaskToErp 方法中采购单入库的代码相同，同步修改
            if(CommonUtil.isNotBlank(srcBillNo)){
                ReplenishBill replenishBill = this.replenishBillService.get("id", srcBillNo);
                List<ReplenishBillDtl> replenishBillDtlList = this.replenishBillService.findBillDtl(srcBillNo);
                //复制一遍，后面保存的时候会先删除
                ArrayList<ReplenishBillDtl> newReplenishBillDtlList = new ArrayList<>();
                for (ReplenishBillDtl dtl : replenishBillDtlList) {
                    ReplenishBillDtl replenishBillDtl = new ReplenishBillDtl();
                    BeanUtils.copyProperties(dtl, replenishBillDtl);
                    replenishBillDtl.setId(new GuidCreator().toString());
                    newReplenishBillDtlList.add(replenishBillDtl);
                }
                BillConvertUtil.convertPurchaseToReplenish(purchaseOrderBill,purchaseOrderBillDtlList,replenishBill,newReplenishBillDtlList);
                this.replenishBillService.saveMessage(replenishBill, newReplenishBillDtlList);
            }
            return new MessageBox(true, "生成采购入库单");
        } else {
            return new MessageBox(true, "无待入库唯一码信息");
        }
    }

    @Override
    public String index() {
        return "/views/logistics/purchaseOrderBill";
    }

    @RequestMapping(value = "/findResourceButton")
    @ResponseBody
    public MessageBox findResourceButton(){
        try {
            Resource resource = this.resourceService.get("url", "logistics/purchaseOrderBill");
            List<ResourcePrivilege> resourcePrivilege = this.resourcePrivilegeService.findResourceButtonByCodeAndRoleId(resource.getCode(), this.getCurrentUser().getRoleId(),"button");
            return new MessageBox(true, "查询成功", resourcePrivilege);
        }catch (Exception e){
            e.printStackTrace();
            return new MessageBox(true, "查询失败");
        }
    }
}
