<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div id="pay-Detail-dialog" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog " style="width: 70%">
        <div class="modal-content">
            <div class="modal-header no-padding">
                <div class="table-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        <span class="white">&times;</span>
                    </button>
                    选择款信息
                </div>
            </div>
            <div class="modal-content no-padding" style="width:100%;height:550px;">
                <div class="modal-body ">
                    <div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 head" style="height: 92%">
                        <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6  left" style="height: 100%">
                            <div class="col-md-12 col-xs-12 col-sm-12 col-lg-12">
                                <form id="payForm">
                                    <ul class="pay-settlement-input">
                                    </ul>
                                </form>
                            </div>
                        </div>
                        <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6 right" style="height: 100%">
                            <div class="col-md-12 col-xs-12 col-sm-12 col-lg-12">
                                <div class="right-head">
                                    <ul class="paywaylist">
                                    </ul>
                                </div>
                                <div class="right-foot">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer no-margin-top">
                <a href="#" class="btn" onclick="deleteBill()">关闭</a>
                <a href="#" class="btn btn-primary" onclick="savePayPrice()">确定</a>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>
<script>
    var payhtml = "";//支付金额页面
    var paywayhtml = "";//支付方式页面
    var defaultPayType =null;//默认支付方式
    var payNum = 0;//选择支付个数，不能超过三个
    var price = 0;//应收
    var payPrice = 0;//控制变量
    var actpayPrice = 0;//实收
    function initPayDetail() {
        payNum=0;
        var actPrice=$("#edit_payPrice").val();
        $.ajax({
            url: basePath + "/sys/property/searchByTypeWS.do?type=PT",
            dataType: 'json',
            async:false,//同步
            success: function (result) {
                payhtml += "<li>"
                    +"<span id='Price'>应收金额</span>"

                    +"<input id='Priced' type='text' readonly value='"+actPrice+"' name='payPrice'>"

                    +"</li>";
                payhtml += "<li>"
                    +"<span id='actPayPrice'>实收金额</span>"
                    +"<input id='actPayPriced' type='text' readonly placeholder='0.00' name='actPayPrice'>"
                    +"</li>";
                payhtml += "<li>"
                    +"<span id='payPrice'>待收金额</span>"
                    +"<input id='payPriced' type='text' readonly placeholder='0.00'>"
                    +"</li>";
                payhtml += "<li>"
                    +"<span id='returnPrice'>找零</span>"
                    +"<input id='returnPriced' type='text' readonly placeholder='0.00'>"
                    +"</li>";
                $.each(result,function(index,value){
                    paywayhtml  +="<li class="+result[index].iconCode+">"
                        +"<svg class='icon' aria-hidden='true'>"
                        +"<use xlink:href='#icon-"+result[index].iconCode+"'></use>"
                        +"</svg>"
                        +"<span>"+result[index].name+"</span>"
                        +"</li>";
                    if(result[index].isDefault == "1"){
                        payhtml +="<li class="+result[index].iconCode+">"
                            +"<span id="+result[index].iconCode+">"+result[index].name+"</span>"
                            +"<input id="+result[index].iconCode+"d"+" type='text' placeholder='0.00'>"
                            +"</li>";
                        defaultPayType = result[index].iconCode;
                        payNum += 1;
                    }
                });
                $(".pay-settlement-input").html(payhtml);
                $(".paywaylist").html(paywayhtml);
                payhtml="";
                paywayhtml="";
                $(".paywaylist").find("."+defaultPayType).addClass("active");//默认变色
                $("#"+defaultPayType+"d").mynumkb();//input框id加d
                price =  Number($("#Priced").val());//得到应收金额
                $("#"+defaultPayType+"d").val(price);
                $("#actPayPriced").attr("value",price);
                $("#"+defaultPayType+"d").focus();

                //绑定事件
                $(".paywaylist").find("li").each(function () {
                    //默认付款方式
                    if($(this).hasClass("active")){
                        $(this).css("background","#31c17b");
                        payPrice += Number($("#"+$(this).attr("class")+"d").val());
                        if(payPrice - Number($("#Priced").val()) > 0){
                            console.info("2222");
                            return;
                        }
                    }
                    //付款方式点击方法
                    $(this).bind("click",function () {

                        if($(this).hasClass("active")){
                            if(payNum ==1){
                                return;//至少有一个付款方式
                            }
                            else {
                                $(this).css("background","#fff");
                                $(this).removeClass("active");

                                $("#payPriced").attr("value",Number($("#payPriced").val())+Number($("#"+$(this).attr("class")+"d").val()));//代收加
                                $("#actPayPriced").attr("value",Number($("#actPayPriced").val())-Number($("#"+$(this).attr("class")+"d").val()));//实收减

                                $(".pay-settlement-input").find("."+$(this).attr("class")).remove();
                                payNum -= 1;
                            }
                        }
                        else {
                            if(payNum <3){
                                //待收为0不让添加
                                if($("#payPriced").val() == 0){

                                    return;
                                }
                                var html = "<li class="+$(this).attr("class")+">"
                                    +"<span id="+$(this).attr("class")+">"+$(this).text()+"</span>"
                                    +"<input id="+$(this).attr("class")+"d"+" type='text'  placeholder='0.00'>"
                                    +"</li>";
                                $(".pay-settlement-input").append(html);
                                $("#"+$(this).attr("class")+"d").mynumkb();
                                $("#"+$(this).attr("class")+"d").focus();
                                //绑定左侧键盘点击事件
                                $("."+$(this).attr("class")).bind("click",function () {
                                    $("#"+$(this).attr("class")+"d").mynumkb();
                                });
                                //绑定输入事件
                                $("#"+$(this).attr("class")+"d").bind("input propertychange",function () {
                                    changeValue();
                                });
                                $(this).css("background","#31c17b");
                                $(this).addClass("active");
                                payNum += 1;
                            }
                            else {
                                return;//最多三个付款方式
                            }
                        }
                    });
                });

            }
        });
        //绑定左侧默认键盘事件
        $(".pay-settlement-input").find("li").each(function () {
            $(this).bind("click",function () {
                $("#"+$(this).attr("class")+"d").mynumkb();
            });
            //绑定输入事件
            $(this).bind("input propertychange",function () {
                changeValue();
            });
        });
    }
    function changeValue() {
        actpayPrice =0;
        $(".paywaylist").find("li").each(function () {
            if($(this).hasClass("active")){
                $(this).removeClass("active");//移除active方便取值
                actpayPrice += Number($("#"+$(this).attr("class")+"d").val());
                $("#actPayPriced").attr("value",actpayPrice);//所有支付方式之和
                $("#payPriced").attr("value",price-Number($("#actPayPriced").val()));//代收金额=应收-实收
                $(this).addClass("active");//加回来
            }

        });
        if(actpayPrice - Number($("#Priced").val()) > 0){
            $("#payPriced").attr("value",0);//代收金额0
            $("#actPayPriced").attr("value",price);//实收为应收
            $("#returnPriced").attr("value",actpayPrice-price);//数据实收-应收
        }
        else {
            $("#returnPriced").attr("value",0);//找零0
        }
    }
    function savePayPrice() {
        var returnPrice = $("#returnPriced").val();
        var payPrice = $("#Priced").val();
        var actPayPrice = $("#actPayPriced").val();
        var shop = defaultWarehId;
        var returnBillNo = $("#edit_returnBillNo").val();
        var customerId = userId;
        $.ajax({
            url: basePath + "/sys/property/changePayDetail.do",
            dataType: 'json',
            data: {
                billNo: billNo
            },
            success: function (result) {
                cs.closeProgressBar();
                if (result.msg) {
                    $(".paywaylist").find("li").each(function () {
                        if ($(this).hasClass("active")) {
                            $(this).removeClass("active");//移除active方便取值
                            var payType = $(this).attr("class");
                            $.ajax({
                                url: basePath + "/sys/property/savePayPriceWS.do",
                                dataType: 'json',
                                data: {
                                    billNo: billNo,
                                    shop: shop,
                                    returnBillNo: returnBillNo,
                                    customerId: customerId,
                                    payPrice: payPrice,
                                    actPayPrice: actPayPrice,
                                    returnPrice: returnPrice,
                                    payType: payType
                                },
                                success: function (result) {
                                    cs.closeProgressBar();
                                    if (result.msg) {
                                        $.gritter.add({
                                            text: "支付明细保存成功",
                                            class_name: 'gritter-success  gritter-light'
                                        });
                                        deleteBill();
                                        $("#edit_payPrice").val(payPrice);
                                    }
                                    else {
                                        $.gritter.add({
                                            text: "支付明细保存失败",
                                            class_name: 'gritter-success  gritter-light'
                                        });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    $.gritter.add({
                        text: "支付明细保存失败",
                        class_name: 'gritter-success  gritter-light'
                    });
                }
            }
        });
    }

    function deleteBill(){
        $("#pay-Detail-dialog").modal('hide');
    }
</script>

