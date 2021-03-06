package com.casesoft.dmc.extend.api.wechat;

import com.casesoft.dmc.cache.CacheManager;
import com.casesoft.dmc.controller.product.StyleUtil;
import com.casesoft.dmc.core.dao.PropertyFilter;
import com.casesoft.dmc.core.util.CommonUtil;
import com.casesoft.dmc.core.util.file.ImgUtil;
import com.casesoft.dmc.core.util.page.Page;
import com.casesoft.dmc.core.vo.MessageBox;
import com.casesoft.dmc.extend.api.web.ApiBaseController;
import com.casesoft.dmc.model.search.DetailStockChatView;
import com.casesoft.dmc.model.search.DetailStockCodeView;
import com.casesoft.dmc.model.search.DetailStockView;
import com.casesoft.dmc.model.sys.Unit;
import com.casesoft.dmc.service.search.DetailStockCodeViewService;
import com.casesoft.dmc.service.search.DetailStockViewChatService;
import com.casesoft.dmc.service.search.DetailStockViewService;
import com.casesoft.dmc.service.sys.impl.UnitService;
import com.casesoft.dmc.service.sys.impl.WarehouseService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/12/7.
 */
@Controller
@RequestMapping(value = "/api/wechat/warehStock", method = {RequestMethod.POST, RequestMethod.GET})
@Api(description="微信库存接口")
public class WxwarehStockController extends ApiBaseController {
    @Autowired
    private WarehouseService warehouseService;
    @Autowired
    private DetailStockViewChatService detailStockViewChatService;
    @Autowired
    private DetailStockCodeViewService detailStockCodeViewService;

    @Autowired
    private DetailStockViewService detailStockViewService;
    @Autowired
    private UnitService unitService;

    @Override
    public String index() {
        return null;
    }
    @RequestMapping(value = "/findwarehId.do")
    @ResponseBody
    public MessageBox findwarehId(String ownerId){
        this.logAllRequestParams();
        boolean isJMS = false;
        List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(this
                .getRequest());
        if(CommonUtil.isNotBlank(ownerId)) {
            Unit unitById = CacheManager.getUnitById(ownerId);
            if (CommonUtil.isBlank(unitById)) {
                unitById = this.unitService.getunitbyId(ownerId);
            }
            if (CommonUtil.isNotBlank(unitById)) {
                if (CommonUtil.isNotBlank(unitById.getGroupId())) {
                    if (unitById.getGroupId().equals("JMS")) {
                        isJMS = true;
                        PropertyFilter filter = new PropertyFilter("EQS_ownerId", unitById.getId());
                        filters.add(filter);
                    }
                }
            }
        }
        List<Unit> warehouse = new ArrayList<>();
        if(!isJMS){
            Unit unitAll = new Unit();
            unitAll.setId("");
            unitAll.setName("所有");
            Unit unitAllDG = new Unit();
            unitAllDG.setId("allDG");
            unitAllDG.setName("所有门店仓库");
            Unit unitAllJMS = new Unit();
            unitAllJMS.setId("allJMS");
            unitAllJMS.setName("所有加盟商仓库");
            warehouse.add(unitAll);
            warehouse.add(unitAllDG);
            warehouse.add(unitAllJMS);
        }
        warehouse.addAll(this.warehouseService.find(filters));

        return returnSuccessInfo("保存成功",warehouse);
    }

    @RequestMapping(value = "/findwerahStock.do")
    @ResponseBody
    public MessageBox findwerahStock(String pageSize,String pageNo,String sortName,String order){
        this.logAllRequestParams();
        List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(this.getRequest());
        Page<DetailStockChatView> page = new Page<DetailStockChatView>(Integer.parseInt(pageSize));
        page.setPage(Integer.parseInt(pageSize));
        page.setPageNo(Integer.parseInt(pageNo));
        if(CommonUtil.isNotBlank(sortName)){
            page.setOrderBy(sortName);
        }
        if(CommonUtil.isNotBlank(order)){
            page.setOrder(order);
        }
        page = this.detailStockViewChatService.findPageList(page,filters);
        String rootPath = this.getSession().getServletContext().getRealPath("/");
        for(DetailStockChatView d : page.getRows()){
            String url = StyleUtil.returnImageUrl(d.getStyleId(), rootPath);
            d.setUrl(url);
        }
        return this.returnSuccessInfo("获取成功",page.getRows());
    }

    @RequestMapping(value = "/findwerahStockListWS.do")
    @ResponseBody
    public MessageBox findwerahStockListWS(String pageSize,String pageNo,String sortName,String order){
        this.logAllRequestParams();
        List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(this.getRequest());
        Page<DetailStockChatView> page = new Page<DetailStockChatView>(Integer.parseInt(pageSize));
        page.setPage(Integer.parseInt(pageSize));
        page.setPageNo(Integer.parseInt(pageNo));
        if(CommonUtil.isNotBlank(sortName)){
            page.setOrderBy(sortName);
        }
        if(CommonUtil.isNotBlank(order)){
            page.setOrder(order);
        }
        page = this.detailStockViewChatService.findPage(page,filters);
        String rootPath = this.getSession().getServletContext().getRealPath("/");
        for(DetailStockChatView d : page.getRows()){
            String url = StyleUtil.returnImageUrl(d.getStyleId(), rootPath);
            d.setUrl(url);
        }
        return this.returnSuccessInfo("获取成功",page.getRows());
    }

    @RequestMapping(value = "/findtitleMessage.do")
    @ResponseBody
    public MessageBox findtitleMessage(String warehId,String styleid,String groupId,String class3){
        try {
            String[] aArray = new String[2];
            Long num = this.detailStockViewChatService.findwarehNum(warehId, styleid,groupId,class3);
            if(CommonUtil.isBlank(num)){
                num=0L;
            }
            aArray[0]=num+"";
            Double Monnum = this.detailStockViewChatService.findwarehMun(warehId, styleid,groupId,class3);
            if(CommonUtil.isBlank(Monnum)){
                Monnum=0D;
            }
            aArray[1]=Monnum+"";
            return this.returnSuccessInfo("查询成功",aArray);
        } catch (Exception e) {
            e.printStackTrace();
            return new MessageBox(false, e.getMessage());
        }

    }

    @RequestMapping(value = "/findTotalStock.do")
    @ResponseBody
    public MessageBox findTotalStock(String warehId,String styleid){
        try {
            String[] aArray = new String[1];
            Long num = this.detailStockViewChatService.findstockNum(warehId, styleid);
            if(CommonUtil.isBlank(num)){
                num=0L;
            }
            aArray[0]=num+"";
            return this.returnSuccessInfo("查询成功",aArray);
        } catch (Exception e) {
            e.printStackTrace();
            return new MessageBox(false, e.getMessage());
        }

    }

    @RequestMapping(value = "/findMessage.do")
    @ResponseBody
    public MessageBox findMessage(String pageSize,String pageNo){
        this.logAllRequestParams();
        List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(this.getRequest());
        Page<DetailStockCodeView> page = new Page<DetailStockCodeView>(Integer.parseInt(pageSize));
        page.setPage(Integer.parseInt(pageSize));
        page.setPageNo(Integer.parseInt(pageNo));
        page = this.detailStockCodeViewService.findPage(page,filters);
        for(int i=0;i<page.getRows().size();i++){
            DetailStockCodeView  detailStockCodeView= page.getRows().get(i);
            Unit unitByCode = CacheManager.getUnitByCode(detailStockCodeView.getWarehId());
            detailStockCodeView.setWarehName(unitByCode.getName());
        }
        return this.returnSuccessInfo("获取成功",page.getRows());

    }
    @RequestMapping(value = "/findAllImgByStyleId")
    @ResponseBody
    public MessageBox findAllImgByStyleId(String styleId){
        String rootPath = this.getSession().getServletContext().getRealPath("/");
        File file =  new File(rootPath + "/product/photo/" + styleId);
        List<String> pathList = new ArrayList<>();
        if (file.exists()) {
            LinkedList<File> list = new LinkedList<File>();
            File[] files = file.listFiles();
            for (File file2 : files) {
                if (file2.isDirectory()) {
                    list.add(file2);
                }
            }
            File temp_file;
            while (!list.isEmpty()) {
                temp_file = list.removeFirst();
                files = temp_file.listFiles();
                for (File file2 : files) {
                    if (file2.isDirectory()) {
                        list.add(file2);
                    } else {
                        if(!file2.getName().contains(ImgUtil.ImgExt.small)) {
                            String imgPath = file2.getAbsolutePath().substring(rootPath.length()).replaceAll("\\\\", "/");
                            pathList.add(imgPath);
                            System.out.println(imgPath);
                        }
                    }
                }
            }
        } else {
            System.out.println("文件不存在!");
        }
        return new MessageBox(true,"ok",pathList);
    }
    @RequestMapping(value = "/findSkuStock")
    @ResponseBody
    public MessageBox findSkuStock(String pageSize,String pageNo){
        this.logAllRequestParams();
        List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(this.getRequest());
        Page<DetailStockView> page = new Page<>(Integer.parseInt(pageSize));
        page.setPage(Integer.parseInt(pageNo));
        page.setPageNo(Integer.parseInt(pageNo));
        page = this.detailStockViewService.findPage(page, filters,"1");
        for(DetailStockView d : page.getRows()){
            Unit u = CacheManager.getUnitByCode(d.getWarehId());
            if(CommonUtil.isNotBlank(u)){
                d.setWarehName(u.getName());
            }
        }
        return this.returnSuccessInfo("获取成功",page.getRows());

    }
    @RequestMapping(value="sumStockQty")
    @ResponseBody
    public MessageBox sumStockQty(String styleId,String warehId){
        this.logAllRequestParams();
        Map<String,Long> skuSumMap = this.detailStockViewService.sumStockByStyleId(styleId,warehId);
        return  new MessageBox(true,"获取成功",skuSumMap);
    }


}
