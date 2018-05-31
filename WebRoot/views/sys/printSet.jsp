<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017-06-20
  Time: 下午 3:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page import="java.util.*" language="java" pageEncoding="UTF-8" %>
<%
    String basePath = request.getScheme() + "://" + request.getServerName()+":"+request.getServerPort() + request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../baseView.jsp"></jsp:include>
    <script>
        var basePath = "<%=basePath%>";
    </script>
    <style>
        body {
            background-color: #ffffff;
            min-height: 100%;
            padding-bottom: 0;
            font-family: 'Open Sans';
            font-size: 13px;
            color: #393939;
            line-height: 1.5;
        }
        .stecs i {
             display: inline-block;
             width: 13px;
             height: 13px;
             border: 1px solid #19B394;
             margin-right: 5px;
             vertical-align: middle;
             position: relative;
             cursor: pointer;

         }
        .stecs.on i{
            height: 13px;
            background: #19B394;
        }
        .headTitle{
            width: 100%;
            position: relative;
            overflow: hidden;
            border: 1px solid #EAECED;
            padding: 18px;
        }
        .headTitle>h3{
            width: 100%;
            padding: 10px 0 20px 0;
            border-bottom: 1px solid #EAECED;
            overflow: hidden;
        }
        .headTitleDiv{
            width: 100%;
            position: relative;
            overflow: hidden;
            border: 1px solid #EAECED;
            padding: 18px;
        }
        .headTitleLi{
            width: 100%;
            position: relative;
            clear: both;
            margin-bottom: 18px;
            display: inline-block;
            margin-left: 8px;
        }
        .Print-Bg-Top {
            width: 100%;
            height: auto;
            overflow:hidden;
            background-image: url(<%=basePath%>/images/print/SmallTicketTop.png);
            background-position: center top;
            background-repeat: no-repeat;
            background-size:100%;
            padding: 100px 40px;
            padding-bottom: 0px;
        }
        .Print-Bg-Center {
            background-repeat: repeat-y;
            background-image: url(<%=basePath%>/images/print/SmallTicketCenter.png);
            background-position: center;
            background-size:100% 100%;
            min-height: 180px;
            display: inline-block;
            float: left;
        }
        .Print-Bg-Top-div{
            margin-left: 30px;
        }
        .Print-Bg{
            width:100%;
            height: 40px;
            background-image: url(<%=basePath%>/images/print/SmallTicketBottom.png);
            background-position: center bottom;
            background-size:100% 100%;
            background-repeat: no-repeat;
        }



    </style>
</head>
<body class="no-skin">
<div class="main-container" id="main-container">
    <div class="row">

    <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12" style="margin-top: 20px;margin-left: 50px">
        <div class="col-xs-3 col-sm-3 col-md-3	col-lg-3">
            <div class="Print-Bg-Center">
                <div class="Print-Bg-Top">
                    <div id="printTop">
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4" id="storeName">
                                <span>店铺名称</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8" id="billType">
                                <span >销售单</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="billNo" >
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>单号:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="weChat" >
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>微信:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="makeBill">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>制单人:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="billDate">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>日期:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="coustmer">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>客户:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="VIPNumber">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>会员卡号:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="remark">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>备注:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                    </div>

                    <div id="edit-dialog" style="text-align: center ;font-size:12px;" class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div">

                        <table style="text-align: center;font-size:12px;"class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                            <thead style="text-align:center" border="0" cellspacing="0" cellpadding="0" width="100%" align="center">
                                  <tr >
                                        <th align="left"  nowrap="nowrap" style="border:0px;height: 20px;width: 20%">商品</th>
                                        <th align="right" nowrap="nowrap" style="border:0px;height: 20px;width: 20%">数量</th>
                                        <th align="right" nowrap="nowrap"style="border:0px;height: 20px;width: 20%">原价</th>
                                        <th  align="right" nowrap="nowrap" style="border:0px;height: 20px;width: 20%">折后价</th>
                                        <th align="right" nowrap="nowrap" style="border:0px;height: 20px;width: 20%">金额</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="border-top:1px dashed black;padding-top:5px;">
                                        <td align="left" style="border-top:1px dashed black;padding-top:5px;">合计:</td>
                                        <td align="right"style="border-top:1px dashed black;padding-top:5px;">0</td>
                                        <td style="border-top:1px dashed black;padding-top:5px;">&nbsp;</td>
                                        <td style="border-top:1px dashed black;padding-top:5px;">&nbsp;</td>
                                        <td align="right" style="border-top:1px dashed black;padding-top:5px;">0</td>
                                    </tr>
                                </tbody>
                        </table>
                    </div>
                    <div id="printFoot">
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="businessId">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>销售员:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="printTime">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>打印时间:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="shopBefore">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>售前余额:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="shopAfter">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>售后余额:</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>xxxxxx</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="integral">
                            <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                                <span>积分(本次/剩余):</span>
                            </div>
                            <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
                                <span>100/2000</span>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="footExtend">
                            <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12">
                                <span >欢迎来到Ancient Stone</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Print-Bg"></div>
            </div>

        </div>
        <div class="col-xs-8 col-sm-8 col-md-8	col-lg-8">
            <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div" id="ruleReceipt">
                <div class="col-xs-2 col-sm-2 col-md-2	col-lg-2">
                    <span style="text-align:center;display: block">小票规格:</span>
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2	col-lg-2">
                    <ul class="stecs" data-name="58" onclick="selectRuleReceipt(58);">
                        <i></i>
                        <span>58mm</span>
                    </ul>
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2	col-lg-2">
                    <ul class="stecs" data-name="80" onclick="selectRuleReceipt(80);">
                        <i></i>
                        <span>80mm</span>
                    </ul>
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2	col-lg-2">
                    <ul class="stecs" data-name="110" onclick="selectRuleReceipt(110);">
                        <i></i>
                        <span>110mm</span>
                    </ul>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div">
                <div class="col-xs-10 col-sm-10 col-md-10	col-lg-10">
                    <div class="headTitle">
                        <input type="text" id="id" style="display: none"/>
                        <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                            <span>小票名称:</span>
                            <input type="text" id="receiptName"/>
                        </div>
                        <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                            <span>小票类型:</span>
                            <select id="receiptType">
                                <option value="SO">销售单据</option>
                                <option value="PI">采购单据</option>
                                <option value="PR">采购退货</option>
                                <option value="SR">销售退货</option>
                                <option value="TR">调拨单</option>
                            </select>
                        </div>
                        <div class="col-xs-4 col-sm-4 col-md-4	col-lg-4">
                            <span>公共类型:</span>
                            <select id="commonType">
                                <option value="1">否</option>
                                <option value="0">是</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div">
                <div class="col-xs-10 col-sm-10 col-md-10	col-lg-10">
                    <div class="headTitle">
                        <h3 onclick="selectheadPrint()">
                            <span style="font-size: 14px;">头部打印</span>
                        </h3>
                        <div class="headTitleDiv" id="headPrint">
                            <ul>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'storeName')">
                                        <i></i>
                                        <span>门店名称</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'billType')">
                                        <i></i>
                                        <span>小票类型</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'billNo')">
                                        <i></i>
                                        <span>单号</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'weChat')">
                                        <i></i>
                                        <span>微信</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'makeBill')">
                                        <i></i>
                                        <span>制单人</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'billDate')">
                                        <i></i>
                                        <span>日期</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'coustmer')">
                                        <i></i>
                                        <span>客户</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'VIPNumber')">
                                        <i></i>
                                        <span>会员卡号</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'remark')">
                                        <i></i>
                                        <span>备注</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div">
                <div class="col-xs-10 col-sm-10 col-md-10	col-lg-10">
                    <div class="headTitle">
                        <h3  onclick="selectfoorerPrint()">
                            <span style="font-size: 14px;">页脚打印</span>
                        </h3>
                        <div class="headTitleDiv" id="footerPrint" style="display: none">
                            <ul>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'businessId')">
                                        <i></i>
                                        <span>销售员</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'printTime')">
                                        <i></i>
                                        <span>打印时间</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'shopBefore')">
                                        <i></i>
                                        <span>售前余额</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'shopAfter')">
                                        <i></i>
                                        <span>售后余额</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <div class="stecs on" onclick="selectThis(this,'integral')">
                                        <i></i>
                                        <span>积分(本次/剩余)</span>
                                    </div>
                                </li>
                                <li class="headTitleLi">
                                    <span>扩展打印(在页脚展示扩展信息,换行请输入&lt;br&gt;)：</span>
                                    <br>
                                    <textarea class="col-xs-8 col-sm-8 col-md-8	col-lg-8" id="footExtendWrite" onkeyup="writeFootExtend(this)">欢迎来到Ancient Stone</textarea>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12	col-lg-12 Print-Bg-Top-div">
                <div class="col-xs-10 col-sm-10 col-md-10	col-lg-10">
                    <div class="headTitle">
                        <button id='save_guest_button' type='button' style='margin-left: 20px' class='btn btn-sm btn-primary' onclick='test()'>
                            <i class='ace-icon fa fa-save'></i>
                            <span class='bigger-110'>测试</span>
                        </button>
                    </div>
                </div>
            </div>


        </div>
    </div>

    </div>
    <jsp:include page="../layout/footer.jsp"></jsp:include>
</div>
<jsp:include page="../layout/footer_js.jsp"></jsp:include>
<jsp:include page="../base/unit_dialog.jsp"></jsp:include>
<jsp:include page="print_one.jsp"></jsp:include>
<jsp:include page="print_two.jsp"></jsp:include>
<jsp:include page="print_threes.jsp"></jsp:include>
<script src="<%=basePath%>/views/sys/printSetController.js"></script>
<script src="<%=basePath%>/Olive/plugin/print/LodopFuncs.js"></script>

</body>
</html>