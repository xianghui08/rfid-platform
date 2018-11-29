<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../baseView.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=basePath%>/views/NoOneCashier/css/mynumkb.css">
    <script type="text/javascript">
        var basePath = "<%=basePath%>";
        var curOwnerId = "${ownerId}";
        var ownersId = "${ownersId}";
        var userId = "${userId}";
        var billNo = "${billNo}";
        var isUserAbnormal="${isUserAbnormal}";
        var saleOrder_customerTypeId = "${saleOrderBill.customerTypeId}";
        var saleOrder_origId = "${saleOrderBill.origId}";
        var saleOrder_destId = "${saleOrderBill.destId}";
        var defaultWarehId = "${defaultWarehId}";
        var defaultSaleStaffId = "${defaultSaleStaffId}";
        var defalutCustomerId = "${defalutCustomerId}";
        var defalutCustomerName = "${defalutCustomerName}";
        var defalutCustomerdiscount = "${defalutCustomerdiscount}";
        var defalutCustomercustomerType = "${defalutCustomercustomerType}";
        var defalutCustomerowingValue = "${defalutCustomerowingValue}";

        var saleOrder_busnissId = "${saleOrderBill.busnissId}";
        var slaeOrder_status = "${saleOrderBill.status}";
        var roleid = "${roleid}";
        var Codes = "${Codes}";
        var groupid="${groupid}";
        var pageType = "${pageType}";
        var resourcePrivilege =${resourcePrivilege};
        var cargoTrack = "${cargoTracking}";
        var cTbillNo = "${cTbillNo}";
        var defaultPayType = "${payType}";//默认支付方式
    </script>
    <style>
        *{padding:0;margin:0;}
            /*对搜索下拉的框规定高度*/
         .ui-autocomplete {
             max-height: 200px;
             overflow-y: auto;
             /* 防止水平滚动条 */
             overflow-x: hidden;
         }


    </style>

</head>
<body class="no-skin">
<div class="main-container" id="main-container" style="">
    <script type="text/javascript">
        try {
            ace.settings.check('main-container', 'fixed')
        } catch (e) {
        }
    </script>
    <div class="main-content">
        <div class="main-content-inner">
            <!-- /.page-header -->
            <div class="row">
                <div class="col-md-12">
                    <!-- PAGE CONTENT BEGINS -->
                    <div class="center">
                        <div class="col-md-4 order-panel-left">
                            <!-- 左则面板 -->
                            <div class="panel panel-default  left-panel">
                                <div class="panel-body">
                                    <div class="widget-body">


                                        <form class="form-horizontal" role="form" id="searchForm">
                                            <div class="form-group">
                                                <label class="col-md-2 control-label" for="search_billId">单号</label>
                                                <div class="col-md-10">
                                                    <input class="form-control" id="search_billId"
                                                           name="filter_LIKES_billNo"
                                                           type="text" onkeyup="this.value=this.value.toUpperCase()"
                                                           placeholder="模糊查询"/>
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label class="col-md-2 control-label"
                                                       for="search_createTime">创建日期</label>
                                                <div class="col-md-10">
                                                    <div class="input-group">
                                                        <input class="form-control date-picker"
                                                               id="search_createTime"
                                                               type="text" name="filter_GED_billDate"
                                                               data-date-format="yyyy-mm-dd"/>
                                                <span class="input-group-addon">
                                                    <i class="fa fa-exchange"></i>
                                                </span>
                                                        <input class="form-control date-picker" type="text"
                                                               class="input-sm form-control"
                                                               name="filter_LED_billDate"
                                                               data-date-format="yyyy-mm-dd"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="col-md-2 control-label"
                                                       for="search_destUnitId">客户</label>
                                                <div class="col-md-10">
                                                    <div class="input-group">
                                                        <input class="form-control" id="search_destUnitId"
                                                               type="text"
                                                               name="filter_EQS_destUnitId" readonly/>
                                                        <span class="input-group-btn">
                                                            <button class="btn btn-sm btn-default"
                                                                    id="search_guest_button"
                                                                    type="button"
                                                                    onclick="openSearchGuestDialog('search')">
                                                                <i class="ace-icon fa fa-list"></i>
                                                            </button>
											            </span>
                                                        <input class="form-control" id="search_destUnitName"
                                                               type="text"
                                                               name="search_destUnitName" readonly/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="search_origId_div">
                                                <div class="form-group">
                                                    <label class="col-md-2 control-label"
                                                           for="search_origId">出库仓库</label>
                                                    <div class="col-md-4">
                                                        <select class="form-control selectpicker show-tick"
                                                                id="search_origId"
                                                                name="filter_LIKES_origId"
                                                                style="width: 100%;" data-live-search="true">
                                                        </select>
                                                    </div>
                                                    <label class="col-md-2 control-label"
                                                           for="select_outStatus">出库状态</label>
                                                    <div class="col-md-4">
                                                        <select class="form-control selectpicker show-tick"
                                                                id="select_outStatus"
                                                                name="filter_INI_outStatus" data-live-search="true">
                                                            <option value="">--请选择--</option>
                                                            <option value="0,3">订单状态</option>
                                                            <option value="2">已出库</option>
                                                            <option value="3">出库中</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="search_destId_div">
                                                <div class="form-group">
                                                    <label class="col-md-2 control-label"
                                                           for="search_destId">入库仓库</label>
                                                    <div class="col-md-4">
                                                        <select class="form-control selectpicker show-tick"
                                                                id="search_destId"
                                                                name="filter_LIKES_destId"
                                                                style="width: 100%;" data-live-search="true">
                                                        </select>
                                                    </div>
                                                    <label class="col-md-2 control-label"
                                                           for="select_inStatus">入库状态</label>
                                                    <div class="col-md-4">
                                                        <select class="form-control selectpicker show-tick"
                                                                id="select_inStatus"
                                                                name="filter_INI_inStatus" data-live-search="true">
                                                            <option value="">--请选择--</option>
                                                            <option value="0">订单状态</option>
                                                            <option value="1">已入库</option>
                                                            <option value="4">入库中</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="col-md-2 control-label"
                                                       for="search_busnissId">销售员</label>
                                                <div class="col-md-4">
                                                    <select class="form-control selectpicker show-tick"
                                                            id="search_busnissId"
                                                            name="filter_EQS_busnissId"
                                                            style="width: 100%;" data-live-search="true">
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <div class="col-md-offset-3 col-md-6">
                                                    <button type="button" class="btn btn-sm btn-primary"
                                                            onclick="_search()">
                                                        <i class="ace-icon fa fa-search"></i>
                                                        <span class="bigger-110">查询</span>
                                                    </button>
                                                    <button type="reset" class="btn btn-sm btn-warning" ,
                                                            onclick="_resetForm()">
                                                        <i class="ace-icon fa fa-undo"></i>
                                                        <span class="bigger-110">清空</span></button>
                                                </div>
                                            </div>
                                        </form>

                                    </div>
                                    <div class="col-md-12">
                                        <table id="grid"></table>
                                        <div id="grid-pager"></div>
                                    </div>
                                </div>
                            </div>
                            <!-- 左则面板 end -->
                        </div>
                        <div class="col-md-8 order-panel-right">

                            <div class="panel panel-default">
                                <div class="panel-heading" style="text-align: right">
                                    <div id="buttonGroup">
                                    </div>
                                </div>
                                <div class="panel-body">
                                    <div class="widget-body">
                                        <div class="widget-main padding-12">
                                            <form id="editForm" class="form-horizontal" role="form"
                                                  onkeydown="if(event.keyCode==13)return false;">
                                                <div class="form-group" style="text-align: left;margin-left: 20px;margin-bottom: 10px;">
                                                    <%--添加一个复选框--%>
                                                    <div class="checkbox_" style="display: inline-block;">
                                                        <input id="check"  onclick="test()" type="checkbox" style=" width:20px; height:20px ;padding-top: 10px" />
                                                    </div>
                                                    <div class="userinput" style="display: inline-block" >
                                                        <div id="text1"><input type="text" id="text2" style=" width:300px " placeholder="请输入衣服的编号或者名称"  autofocus = autofocus>
                                                        </div>
                                                        <%--添加一个隐藏的搜索框--%>
                                                        <div id="search"   style="display: none">
                                                       <%--<select name="select_id" id="select_id"  class="selectpicker show-tick form-control" data-width="300px" data-first-option="false" data-live-search="true">
                                                            <foreach dealer in dealerList>
                                                                <option value="">请输入衣服的编号或者名称</option>
                                                                <option value="">2</option>

                                                                <option value="">3</option>

                                                                <option value="">4</option>

                                                                <option value="">5</option>


                                                            </foreach>
                                                        </select>--%>

                                                               <label for="tags"></label>
                                                           <input type="search" id="tags" style=" width:300px " placeholder="请输入衣服的编号或者名称"  autofocus = autofocus />





                                                           </div>

                                                </div>
                                                    <div style="display: inline-block; height: 36px">
                                                    <button class="btn btn-xs btn-primary" id="bt_is" style="width: 60px;height: 100%">确认</button>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <div id="destUnitId_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_destUnitId">客户</label>
                                                        <div class="col-md-5">
                                                            <div class="input-group">
                                                                <input class="form-control" id="edit_destUnitId"
                                                                       type="text"
                                                                       name="destUnitId"
                                                                       value="${saleOrderBill.destUnitId}" readonly/>
                                                                <span class="input-group-btn">
												                <button class="btn btn-sm btn-default"
                                                                        id="edit_guest_button"
                                                                        type="button"
                                                                        onclick="openSearchGuestDialog('edit')">
                                                                    <i class="ace-icon fa fa-list"></i>
                                                                </button>
											                </span>
                                                                <input class="form-control" id="edit_destUnitName"
                                                                       type="text"
                                                                       name="destUnitName"
                                                                       value="${saleOrderBill.destUnitName}" readonly/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="customerTypeId_div">
                                                        <label class="col-md-3 control-label"
                                                               for="edit_customerType">客户类型</label>
                                                        <div class="col-md-3">
                                                            <select class="form-control selectpicker"
                                                                    id="edit_customerType"
                                                                    name="customerTypeId"
                                                                    style="width: 100%;"
                                                                    value="${saleOrderBill.customerTypeId}" disabled>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <div id="billNo_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_billNo">单据编号</label>
                                                        <div class="col-md-3">
                                                            <input class="form-control" id="edit_billNo" name="billNo"
                                                                   type="text" readOnly
                                                                   value="${saleOrderBill.billNo}"/>
                                                        </div>
                                                    </div>
                                                    <div id="billDate_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_billDate">单据日期</label>
                                                        <div class="col-md-3">
                                                            <input class="form-control date-picker" id="edit_billDate"
                                                                   name="billDate"
                                                                   type="text" value="${saleOrderBill.billDate}"/>
                                                        </div>
                                                    </div>
                                                    <div id="payType_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_payType">支付方式</label>
                                                        <div class="col-md-3">
                                                            <select class="form-control selectpicker" id="edit_payType" name="payType">
                                                                <option value="xianjinzhifu">现金支付</option>
                                                                <option value="zhifubaozhifu">支付宝支付</option>
                                                                <option value="wechatpay">微信支付</option>
                                                                <option value="cardpay">刷卡支付</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <div id="destId_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_destId">入库仓库</label>
                                                        <div class="col-md-3">
                                                            <select class="form-control selectpicker show-tick"
                                                                    id="edit_destId" name="destId"
                                                                    style="width: 100%;" value="${saleOrderBill.destId}"
                                                                    data-live-search="true">
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div id="origId_div">
                                                        <label class="col-md-1 control-label"
                                                               for="search_origId">出库仓库</label>
                                                        <div class="col-md-3">
                                                            <select class="form-control selectpicker show-tick"
                                                                    id="edit_origId" name="origId"
                                                                    style="width: 100%;" value="${saleOrderBill.origId}"
                                                                    data-live-search="true">
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div id="busnissId_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_busnissId">销售员</label>
                                                        <div class="col-md-3">
                                                            <select class="form-control selectpicker show-tick"
                                                                    id="edit_busnissId"
                                                                    name="busnissId"
                                                                    style="width: 100%;" data-live-search="true">
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <div id="preBalance_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_pre_Balance">售前余额</label>
                                                        <div class="col-md-3">
                                                            <input class="form-control" id="edit_pre_Balance"
                                                                   name="preBalance"
                                                                   value="${saleOrderBill.preBalance}" readonly>
                                                            </input>
                                                        </div>
                                                    </div>
                                                    <div id="afterBalance_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_after_Balance">售后余额</label>
                                                        <div class="col-md-3">
                                                            <input class="form-control" id="edit_after_Balance"
                                                                   name="afterBalance"
                                                                   value="${saleOrderBill.afterBalance}" readonly>
                                                            </input>
                                                        </div>
                                                    </div>
                                                    <div id="discount_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_discount">整单折扣</label>
                                                        <div class="col-md-3">
                                                            <input class="form-control" id="edit_discount"
                                                                   name="discount"
                                                                   value="${saleOrderBill.discount}"
                                                                   onblur="edit_discount_onblur()">
                                                            </input>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <div id="actPrice_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_actPrice">应收金额</label>
                                                        <div class="col-md-3">
                                                            <div class="input-group">
                                                                <span class="input-group-addon"><i
                                                                        class="fa fa-jpy"></i></span>
                                                                <input class="form-control" id="edit_actPrice"
                                                                       name="actPrice"
                                                                       type="number" step="0.01" readonly
                                                                       value="${saleOrderBill.actPrice}"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="payPrice_div">
                                                        <label class="col-md-1 control-label"
                                                               for="edit_payPrice">实收金额</label>
                                                        <div class="col-md-3">
                                                            <div class="input-group">
                                                                <span class="input-group-addon"><i
                                                                        class="fa fa-jpy"></i></span>
                                                                <input class="form-control" id="edit_payPrice"
                                                                       name="payPrice"
                                                                       type="number" step="0.01"
                                                                       value="${saleOrderBill.payPrice}"
                                                                onblur="payPriceChange()"/>
                                                                <span class="input-group-btn">
                                                                    <button class="btn btn-sm btn-default"
                                                                            type="button"
                                                                            onclick="payPriceShow()">
                                                                        <i class="ace-icon fa fa-list"></i>
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <div id="remark_div">
                                                        <label class="col-md-1 control-label" for="edit_remark">备注</label>
                                                        <div class="col-md-11 col-sm-11">
                                                            <textarea maxlength="400" class="form-control" id="edit_remark"
                                                                      name="remark">${saleOrderBill.remark}
                                                            </textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <input id="edit_status" name="status"
                                                           value="${saleOrderBill.status}"
                                                           type="hidden">
                                                    </input>
                                                    <input id="edit_outStatus" name="outStatus"
                                                           value="${saleOrderBill.outStatus}"
                                                           type="hidden">
                                                    </input>
                                                    <input id="edit_inStatus" name="inStatus"
                                                           value="${saleOrderBill.inStatus}"
                                                           type="hidden">
                                                    </input>
                                                    <input id="edit_ownerId" name="ownerId"
                                                           value="${saleOrderBill.ownerId}"
                                                           type="hidden">
                                                    </input>
                                                    <input id="edit_returnBillNo" name="returnBillNo" hidden>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div class="widget-body">
                                        <div class="widget-main padding-12 no-padding-left no-padding-right">
                                            <div class="tab-content padding-4">
                                                <div id="addDetail" class="tab-pane in active">
                                                    <table id="addDetailgrid"></table>
                                                    <div id="addDetailgrid-pager"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.col -->
            </div>
            <!-- /.row -->
            <!--/#page-content-->
        </div>
    </div>
</div>
<!--/.fluid-container#main-container-->
<jsp:include page="payDetail.jsp"></jsp:include>
<jsp:include page="../layout/footer_js.jsp"></jsp:include>
<jsp:include page="add_detail_dialog.jsp"></jsp:include>
<jsp:include page="saleOrderBillPrint.jsp"></jsp:include>
<jsp:include page="../sys/print_two.jsp"></jsp:include>
<jsp:include page="../sys/print_Test.jsp"></jsp:include>
<jsp:include page="add_uniqCode_dialog.jsp"></jsp:include>
<jsp:include page="search_saleOrder_code_dialog.jsp"></jsp:include>
<jsp:include page="uniqueCode_detail_list.jsp"></jsp:include>
<jsp:include page="exchageGood_dialog.jsp"></jsp:include>
<jsp:include page="findRetrunNo.jsp"></jsp:include>
<jsp:include page="findTransferOrder.jsp"></jsp:include>
<jsp:include page="findWxShop.jsp"></jsp:include>
<jsp:include page="sendStreamNO.jsp"></jsp:include>
<jsp:include page="batch_scanning_result.jsp"></jsp:include>
<jsp:include page="show_check_out_result.jsp"></jsp:include>
<jsp:include page="show_check_In_result.jsp"></jsp:include>
<jsp:include page="allUniqeCode_detail_list.jsp"></jsp:include>
<jsp:include page="../base/search_guest_dialog.jsp"></jsp:include>
<script type="text/javascript" src="<%=basePath%>/views/logistics/saleOrderBillController.js"></script>
<script type="text/javascript" src="<%=basePath%>/Olive/plugin/dateFormatUtil.js"></script>
<script src="<%=basePath%>/views/logistics/websocket.js"></script>
<jsp:include page="../base/search_guest_dialog.jsp"></jsp:include>
<script type="text/javascript" src="<%=basePath%>/views/logistics/saleOrderBillController.js"></script>
<script type="text/javascript" src="<%=basePath%>/Olive/plugin/dateFormatUtil.js"></script>
<script src="<%=basePath%>/Olive/plugin/print/LodopFuncs.js"></script>
<script src="<%=basePath%>/Olive/assets/js/jquery-ui.js"></script>

<%--typehead方法--%>



<%--实收金额--%>
<script src="<%=basePath%>/views/NoOneCashier/js/mynumkb.js"></script>
<script src="<%=basePath%>/views/NoOneCashier/js/iconfont.js"></script>



<div id="dialog"></div>
<div id="progressDialog"></div>
<span id="notification"></span>
<script type="text/javascript">

    function test() {
        /*如果复选框被选中*/

        if(document.getElementById('check').checked == true) {

            subMit();
           /* showDropdown(document.getElementById("select_id"));*/
        }
        /*如果复选框没被选中*/
        if(document.getElementById('check').checked == false) {

            subMit1();


        }
    }

                function subMit(){
                    document.getElementById("text1").style.display  = "none";
                    document.getElementById("search").style.display = "block";
                    document.getElementById("tags").focus();

                }
                /**/
                function subMit1(){
                    document.getElementById("text1").style.display  = "block";
                    document.getElementById("search").style.display = "none";
                    document.getElementById("text2").focus();


                }
    $(function() {
        var availableTags = [
            "ActionScript",
            "AppleScript",
            "Asp",
            "BASIC",
            "C",
            "C++",
            "Clojure",
            "COBOL",
            "ColdFusion",
            "Erlang",
            "Fortran",
            "Groovy",
            "Haskell",
            "Java",
            "JavaScript",
            "Lisp",
            "Perl",
            "PHP",
            "Python",
            "Ruby",
            "Scala",
            "Scheme"

        ];
        $( "#tags" ).autocomplete({
            /*获取数据*/
            source: availableTags
        });
    });






</script>

</body>
</html>