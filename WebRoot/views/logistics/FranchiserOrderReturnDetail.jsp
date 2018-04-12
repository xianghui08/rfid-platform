<%--
  Created by IntelliJ IDEA.
  User: admin
  Date: 2018/4/11
  Time: 14:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page pageEncoding="UTF-8" import="java.util.*" language="java" %>
<%
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../baseView.jsp"></jsp:include>
    <script>
        var basePath = '<%=basePath%>';
        var billNo = "${saleOrderReturn.billNo}";
        var pageType = '${pageType}';
        var returnStatus = "${saleOrderReturn.status}";
        var ownersId="${ownersId}";
        var saleOrderReturn_customerType = "${saleOrderReturn.customerType}";
        var saleOrderReturn_origId = "${saleOrderReturn.origId}";
        var saleOrderReturn_destId = "${saleOrderReturn.destId}";
        var curOwnerId = "${ownerId}";

        var userId = "${userId}";
        var defaultWarehId = "${defaultWarehId}";
        var defaultSaleStaffId="${defaultSaleStaffId}";
        var defalutCustomerId="${defalutCustomerId}";
        var defalutCustomerName="${defalutCustomerName}";
        var defalutCustomerdiscount="${defalutCustomerdiscount}";
        var defalutCustomercustomerType="${defalutCustomercustomerType}";
        var defalutCustomerowingValue="${defalutCustomerowingValue}";
        var saleOrderReturn_status = "${saleOrderReturn.status}";
        var saleOrderReturn_busnissId = "${saleOrderReturn.busnissId}";
        var srcBillNo="${saleOrderReturn.srcBillNo}";
        var roleid = "${roleid}";
    </script>
</head>
<body>
<div class="main-container" id="main-container">

    <script type="text/javascript">
        try {
            ace.settings.check('main-container', 'fixed')
        } catch (e) {
        }
    </script>
    <div class="main-content">
        <div class="row">
            <div class="col-xs-12">
                <div class="widget-box widget-color-blue  light-border">
                    <div class="widget-header">
                        <h5 class="widget-title">基本信息</h5>
                        <div class="widget-toolbar no-border">
                            <a class="btn btn-xs bigger btn-yellow dropdown-toggle" href="<%=basePath%>/${mainUrl}">
                                <i class="ace-icon fa fa-arrow-left"></i> 返回
                            </a>
                        </div>
                    </div>
                    <div class="widget-body">
                        <div class="widget-main padding-12">
                            <form id="editForm" class="form-horizontal" role="form" onkeydown="if(event.keyCode==13)return false;">
                                <div class="form-group">
                                    <label class="col-xs-1 control-label" for="search_billNo">单据编号</label>
                                    <div class="col-xs-2">
                                        <input class="form-control" value="${saleOrderReturn.billNo}" name="billNo" disabled="disabled"
                                               id="search_billNo" readonly/>
                                    </div>
                                    <label class="col-xs-1 control-label" for="search_billDate">单据日期</label>
                                    <div class="col-xs-2">
                                        <input class="form-control date-picker" name="billDate" disabled="disabled"
                                               value='<fmt:formatDate value="${saleOrderReturn.billDate}" pattern="yyyy-MM-dd" />'
                                               id="search_billDate"/>
                                    </div>
                                    <label class="col-xs-1 control-label" for="search_payType">支付方式</label>
                                    <div class="col-xs-2">
                                        <input class="form-control" id="search_payType" name="payType" disabled="disabled"
                                               type="text" value="${saleOrderReturn.payType}"/>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-xs-1 control-label" for="search_origUnitId">客户</label>
                                    <div class="col-xs-2">
                                        <div class="input-group">
                                            <input class="form-control" id="search_origUnitId" type="text" disabled="disabled"
                                                   name="origUnitId" value="${saleOrderReturn.origUnitId}" readonly/>
                                            <span class="input-group-btn">
												<button class="btn btn-sm btn-default" id="search_guest_button" disabled="disabled"
                                                        type="button"
                                                        onclick="openSearchGuestDialog()">
													<i class="ace-icon fa fa-list"></i>
												</button>
											</span>
                                            <input class="form-control" id="search_origUnitName" type="text" disabled="disabled"
                                                   name="origUnitName" value="${saleOrderReturn.origUnitName}" readonly/>
                                        </div>
                                    </div>
                                    <label class="col-xs-1 control-label" for="search_origId">出库仓库</label>
                                    <div class="col-xs-2">
                                        <select class="form-control" id="search_origId" name="origId"
                                                style="width: 100%;">
                                        </select>
                                    </div>
                                    <label class="col-xs-1 control-label" for="search_destId">入库仓库</label>
                                    <div class="col-xs-2">
                                        <select class="form-control" id="search_destId" name="destId"
                                                style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-xs-1 control-label" for="search_customerType">客户类型</label>
                                    <div class="col-xs-2">
                                        <select class="form-control" id="search_customerType" name="customerType"
                                                style="width: 100%;">
                                        </select>
                                    </div>
                                    <label class="col-xs-1 control-label" for="search_busnissId">销售员</label>
                                    <div class="col-xs-2">
                                        <select class="form-control selectpicker show-tick" id="search_busnissId" name="busnissId"
                                                style="width: 100%;" data-live-search="true">
                                        </select>
                                    </div>
                                    <label class="col-xs-1 control-label" for="search_srcbillno">原始单号</label>
                                    <div class="col-xs-2">
                                        <input class="form-control" value="${saleOrderReturn.srcBillNo}" name="srcBillNo" disabled="disabled"
                                               id="search_srcbillno" readonly/>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-xs-1 control-label"
                                           for="edit_remark">备注</label>
                                    <div class="col-xs-9 col-sm-9">
                                        <textarea class="form-control limited" name="remark" maxlength="400" readonly="readonly"
                                                  id="edit_remark">${saleOrderReturn.remark}</textarea>
                                    </div>
                                </div>
                                <div>
                                    <input id="search_status" name="status" value="${saleOrderReturn.status}" type="hidden" disabled="disabled">
                                    </input>
                                    <input id="search_ownerId" name="ownerId"  disabled="disabled" value="${saleOrderReturn.ownerId}"
                                           type="hidden">
                                    </input>
                                </div>
                            </form>
                            <input class="form-control" id="returnCode" type="text" disabled="disabled"
                                   name="origUnitName" value="${saleOrderReturn.returnCode}" STYLE="display: none"/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <div class="hr hr4"></div>
    <div class="widget-box transparent">
        <div class="widget-header ">
            <h4 class="widget-title lighter">单据明细</h4>
            <div class="widget-toolbar no-border">
                <ul class="nav nav-tabs" id="myTab">
                    <li class="active">
                        <a data-toggle="tab" href="#detail">SKU明细</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="widget-body">
            <div class="widget-main padding-12 no-padding-left no-padding-right">
                <div class="tab-content padding-4">
                    <div id="addDetail" class="tab-pane in active" style="height:80%;">
                        <table id="addDetailgrid"></table>
                        <div id="addDetailgrid-pager"></div>
                    </div>
                </div>
                <div id="buttonGroup" class="col-sm-offset-5 col-sm-10 ">
                </div>
            </div>
        </div>
    </div>
    <jsp:include page="../layout/footer.jsp"></jsp:include>
</div>
<jsp:include page="../layout/footer_js.jsp"></jsp:include>
<jsp:include page="add_detail_dialog.jsp"></jsp:include>
<jsp:include page="saleOrderBillPrint.jsp"></jsp:include>
<jsp:include page="../sys/print_two.jsp"></jsp:include>
<jsp:include page="add_uniqCode_dialog.jsp"></jsp:include>
<jsp:include page="uniqueCode_detail_list.jsp"></jsp:include>
<jsp:include page="../base/waitingPage.jsp"></jsp:include>
<jsp:include page="../base/search_guest_dialog.jsp"></jsp:include>
<link href="<%=basePath%>/kendoUI/styles/kendo.common-material.min.css" rel="stylesheet">
<link href="<%=basePath%>/kendoUI/styles/kendo.rtl.min.css" rel="stylesheet">
<link href="<%=basePath%>/kendoUI/styles/kendo.material.min.css" rel="stylesheet">
<script src="<%=basePath%>/kendoUI/js/kendo.all.min.js"></script>
<script src="<%=basePath%>/kendoUI/js/kendo.timezones.min.js"></script>
<script src="<%=basePath%>/kendoUI/js/cultures/kendo.culture.zh-CN.min.js"></script>
<script type="text/javascript" src="<%=basePath%>/views/logistics/FranchiserOrderReturnDetailController.js"></script>
<script type="text/javascript" src="<%=basePath%>/Olive/plugin/dateFormatUtil.js"></script>
<script src="<%=basePath%>/Olive/plugin/print/LodopFuncs.js"></script>

</body>
</html>