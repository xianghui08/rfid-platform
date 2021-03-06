$(function () {
    //获取当前转户
    $(".selectpicker").selectpicker({
        noneSelectedText : '--请选择--'//默认显示内容
    });

    initMultiSelect();
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    if (month < 10) {
        if (day < 10) {
            $("#filter_gte_billDate").val(year + "-0" + month + "-0" + day);
            $("#filter_lte_billDate").val(year + "-0" + month + "-0" + day);
        } else {
            $("#filter_gte_billDate").val(year + "-0" + month + "-" + day);
            $("#filter_lte_billDate").val(year + "-0" + month + "-" + day);
        }
    } else {
        if(day < 10){
            $("#filter_gte_billDate").val(year + "-" + month + "-0" + day);
            $("#filter_lte_billDate").val(year + "-" + month + "-0" + day);
        }else{
            $("#filter_gte_billDate").val(year + "-" + month + "-" + day);
            $("#filter_lte_billDate").val(year + "-" + month + "-" + day);
        }

    }
    if(Codes=="admin"){
        initKendoUIGrid();
        $("#isadmin").show();
        $("#noadmin").hide();
        /*$("#filter_contains_groupid").val("");*/
    }else{
        initnoKendoUIGrid();
        $("#isadmin").hide();
        $("#noadmin").show();
        $("#filter_contains_groupid").val(groupid);
    }

    inttitledata();
    $(".k-dropdown").css("width", "6em");
    $(".k-grid-toolbar").css("display", "none");//隐藏toolbar
    var count =0;
    for(var a=0;a<divRole.length;a++){
        console.info(a);
        $(".all").hide();
        if(divRole[a].isShow == 0){
            $("#noadmin").hide();
            $("."+divRole[a].privilegeId+"s").show();
            count++;
        }
    }
    if(count == 2){
        $(".all").show();
        $(".pressAlls").hide();
        $(".grossprofitss").hide();
        $("#noadmin").hide();
    }
    if(count ==0){
        $(".all").hide();
        $(".pressAlls").hide();
        $(".grossprofitss").hide();
        $("#noadmin").show();
    }
    var grid = $("#searchGrid").data("kendoGrid");
    for(b in tableRole){
        if(tableRole[b].isShow != 0){
            grid.hideColumn(""+tableRole[b].privilegeId);
        }
    }
});

function inttitledata() {
    var serializeArray = $("#searchForm").serializeArray();
    var params = array2obj(serializeArray);

    $.ajax({
        url: basePath + "/search/saleorderCountView/findtitledate.do",
        cache: false,
        async: false,
        data: {"dates": JSON.stringify(params)},
        type: "POST",
        success: function (data, textStatus) {
            var result = data.result;
            $(".salesum").text(":" + result.sum);
            $(".salereturnsum").text(":" + result.rsum);
            $(".salemony").text(": ￥" + result.allmony.toFixed(2));
            $(".pressAll").text(": ￥" + result.passall.toFixed(2));
            if (result.grossprofits == "NaN%") {
                $(".grossprofits").text(": 0%");
            } else {
                $(".grossprofits").text(": " + parseFloat(result.grossprofits).toFixed(2));
            }


        }
    });
}

function initMultiSelect() {
    $.ajax({
        url: basePath +  "/sys/property/listMultiLevel.do?type=C3",
        cache: false,
        async: false,
        type: "POST",
        success: function (data, textStatus) {
            $("#filter_eq_class3").empty();
            var json = data;
            $("#filter_eq_class3").append("<option value='' >请选择大类</option>");
            for (var i = 0; i < json.length; i++) {
                $("#filter_eq_class3").append("<option value='" + json[i].code + "'>" + json[i].name + "</option>");
            }
            $('.selectpicker').selectpicker('refresh');
        }
    });
    if(isJMS === "true"){
        $.ajax({
            url: basePath + "/unit/list.do?filter_EQI_type=9&filter_EQS_ownerId="+curOwnerId,
            cache: false,
            async: false,
            type: "POST",
            success: function (data, textStatus) {
                $("#filter_in_deport").empty();
                var json = data;
                for (var i = 0; i < json.length; i++) {
                    $("#filter_in_deport").append("<option value='" + json[i].id + "'>" + "[" + json[i].code + "]" + json[i].name + "</option>");
                }
                $("#filter_in_deport").val(deportId);
                $(".selectpicker").selectpicker('refresh');
            }
        });
    }else{
        $.ajax({
            url: basePath + "/unit/list.do?filter_EQI_type=9",
            cache: false,
            async: false,
            type: "POST",
            success: function (data, textStatus) {
                $("#filter_in_deport").empty();
                $("#filter_in_deport").append("<option value='' >请选择仓库</option>");
                $("#filter_in_deport").append("<option value='allDG' >所有门店仓库</option>");
                $("#filter_in_deport").append("<option value='allJMS' >所有加盟商仓库</option>");
                var json = data;
                for (var i = 0; i < json.length; i++) {
                    $("#filter_in_deport").append("<option value='" + json[i].id + "'>" + "[" + json[i].code + "]" + json[i].name + "</option>");
                }
                $(".selectpicker").selectpicker('refresh');
            }
        });
    }

    var queryShopUrl = "";
    if(isJMS === "true"){
        queryShopUrl = basePath + "/unit/list.do?filter_EQI_type=4&filter_EQS_code="+curOwnerId
    }else {
        queryShopUrl = basePath + "/unit/list.do?filter_EQI_type=4"
    }
    $.ajax({
        url: queryShopUrl,
        cache: false,
        async: false,
        type: "POST",
        success: function (data, textStatus) {
            $("#filter_in_destUnitId").empty();
            var json = data;
            for (var i = 0; i < json.length; i++) {
                $("#filter_in_destUnitId").append("<option value='" + json[i].code + "'>" + json[i].name + "</option>");
            }
            if(isJMS){
                $("#filter_in_destUnitId").val(curOwnerId);
            }
            $(".selectpicker").selectpicker('refresh');
        }
    });
}

function refresh() {
    resetData();
}
function resetData() {
    var gridData;
    if(exportExcelid == "searchGrid"){
        gridData = $("#searchGrid").data("kendoGrid");
    }else if(exportExcelid == "searchsaleGrid"){
        gridData = $("#searchsaleGrid").data("kendoGrid");
    }else if(exportExcelid == "searchsalebusinessnameGrid"){
        gridData = $("#searchsalebusinessnameGrid").data("kendoGrid");
    }else if(exportExcelid == "searchsaleorignameGrid"){
        gridData = $("#searchsaleorignameGrid").data("kendoGrid");
    }

    var filters = serializeToFilter($("#searchForm"));

    if(gridData != null && gridData != "" && gridData != undefined){
        if(isJMS === "true"){
            gridData.dataSource.filter({
                logic: "and",
                filters: filters
            });
        }else {
            gridData.dataSource.filter({});
        }
    }

    _reset();

}
var exportExcelid = "";

function chooseExportFunction() {
  /*  if(exportExcelid === "searchGrid" || exportExcelid === "searchsaleGrid"){
     exportExcelPOI();
     }else {
     exportExcelKendo();
     }*/
    exportExcelKendo();
}
function newchooseExportFunction() {
    if(exportExcelid === "searchGrid" || exportExcelid === "searchsaleGrid"){
        exportExcelPOI();
    }else {
        exportExcelProPOI();
    }
}

function exportExcelKendo() {
    $("#" + exportExcelid).children().find(".k-grid-excel").click();
}
function exportExcelProPOI() {
    var filters = serializeToFilter($("#searchForm"));
    console.info(filters);
    var gridData = $("#" + exportExcelid).data("kendoGrid");
    var total = gridData.dataSource._total;
    var request = {};
    request.page = 1;
    request.pageSize =total;
    request.take = total;
    request.skip = 0;
    request.filter = {
        logic: "and",
        filters : filters
    };
    /*$.ajax({
     url: basePath + "/search/saleorderCountView/export.do?",
     type: 'POST',
     data: {
     gridId: exportExcelid,
     request: JSON.stringify(request)
     },
     success: function (data) {
     /!* $.gritter.add({
     text: data.msg,
     class_name: 'gritter-success  gritter-light'
     });*!/
     }

     })*/
    //window.location.href=basePath+"/search/saleorderCountView/export.do?gridId="+exportExcelid + "&request="+JSON.stringify(request);
    var url=basePath+"/search/saleorderCountView/export.do";
    /* document.write("<form action="+url+" method=post name=form1 style='display:none'>");
     document.write("<input type=hidden  name='gridId' value='"+exportExcelid+"'>");
     document.write("<input type=hidden  name='request' value='"+JSON.stringify(request)+"'>");
     document.write("</form>");
     document.form1.submit();*/
    $("#form1").attr("action",url);
    $("#gridId").val(exportExcelid);
    $("#request").val(JSON.stringify(request));
    $("#form1").submit();
    /* var Path=basePath+"/search/saleorderCountView/export.do";
     document.write("<form action="+Path+" method=post name=form1 style='display:none'>");
     document.write("<input type=hidden name=name value='"+username+"'");
     document.write("</form>");
     document.form1.submit();*/
    // $("#" + exportExcelid).children().find(".k-grid-excel").click();
    /*$("from").ajaxSubmit({
     type: 'post', // 提交方式 get/post
     url: 'basePath+"/search/saleorderCountView/export.do', // 需要提交的 url
     data: {
     gridId: exportExcelid,
     request: JSON.stringify(request)
     },
     success: function(data) { // data 保存提交后返回的数据，一般为 json 数据
     // 此处可对 data 作相关处理
     alert('提交成功！');
     }

     });*/
}
function exportExcelPOI() {

    var filters = serializeToFilter($("#searchForm"));
    var gridData = $("#" + exportExcelid).data("kendoGrid");
    console.info(filters);
    var total = gridData.dataSource._total;
    console.log(total);
    var request = {};
    request.page = 1;
    request.pageSize = -1;
    request.take = total;
    request.skip = 0;
    request.filter = {
        logic: "and",
        filters : filters
    };
    /*$.ajax({
        url: basePath + "/search/saleorderCountView/export.do?",
        type: 'POST',
        data: {
            gridId: exportExcelid,
            request: JSON.stringify(request)
        },
        success: function (data) {
           /!* $.gritter.add({
                text: data.msg,
                class_name: 'gritter-success  gritter-light'
            });*!/
        }

    })*/
  //window.location.href=basePath+"/search/saleorderCountView/export.do?gridId="+exportExcelid + "&request="+JSON.stringify(request);
    var url=basePath+"/search/saleorderCountView/export.do";

   $("#form1").attr("action",url);
   $("#gridId").val(exportExcelid);
   $("#request").val(JSON.stringify(request));
   console.info(exportExcelid);
    console.info(JSON.stringify(request));
    $("#form1").submit();

   /* $("#gridId").val(exportExcelid);
    $("#request").val(JSON.stringify(request));
   var options  = {
        url:url,   //同action
        type:'post',
        success:function(data)
        {
             alert('成功..');
        },
        complete:function(xhr){//请求完成

            alert('请求完成..');
        },
        error: function(xhr,status,msg){

            alert('加载中..');

        }
    };
    $("#form1").ajaxSubmit(options);*/

}

function showAdvSearchPanel() {
    $("#searchPanel").slideToggle("fast");
}
function search() {
    var gridData = $("#" + exportExcelid).data("kendoGrid");
    var filters = serializeToFilter($("#searchForm"));
    console.log(filters);
    gridData.dataSource.filter({
        logic: "and",
        filters: filters
    });
    inttitledata();
}
var isoneinitKendoUIGrid = true;
function initKendoUIGrid() {
    exportExcelid = "searchGrid";
    if (isoneinitKendoUIGrid) {
        var filters = serializeToFilter($("#searchForm"));
        console.log(filters);
        $("#searchGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "销售明细统计.xlsx",
                proxyURL: basePath + "/search/saleorderCountView/export.do",
                allPages:true,
                filterable: true
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                /* var tokenTemplate = kendo.template(this.columns[4].template);
                 var destTemplate = kendo.template(this.columns[6].template);
                 var destUnitTemplate = kendo.template(this.columns[7].template);
                 var origTemplate = kendo.template(this.columns[8].template);
                 var diffTemplate = kendo.template(this.columns[15].template);*/
                var rowIndex = 1;
                var groupNum = this.dataSource._group.length;
                for (var i = 1; i < sheet.rows.length; i++) {
                    var row = sheet.rows[i];
                    if (row.cells[3 + groupNum] && row.cells[5 + groupNum] && row.cells[6 + groupNum] && row.cells[7 + groupNum]) {
                        var gridRow = $("#searchGrid").data("kendoGrid").dataItem("tr:eq(" + rowIndex + ")");
                       /* var dataItem = {
                            token: row.cells[4 + groupNum].value,
                            destid: row.cells[6 + groupNum].value,
                            destUnitId: row.cells[7 + groupNum].value,
                            origid: row.cells[8 + groupNum].value,
                            //destName: gridRow.destName,
                            //destUnitName: gridRow.destUnitName,
                           // origName: gridRow.origName,
                            billNo: gridRow.billNo,
                            qty: gridRow.qty,
                            billQty: gridRow.billQty
                        };*/
                        /* row.cells[4+groupNum].value = tokenTemplate(dataItem);
                         row.cells[6+groupNum].value = destTemplate(dataItem);
                         row.cells[7+groupNum].value = destUnitTemplate(dataItem);
                         row.cells[8+groupNum].value = origTemplate(dataItem);
                         row.cells[15+groupNum].value = diffTemplate(dataItem);*/
                        rowIndex++;
                    }

                }
            },
            dataSource: {
                schema: {
                    total: "total",
                    model: {

                        fields: {
                            billDate: {type: "date"},
                            billno: {type: "string"},
                            taskId: {type: "string"},
                            token: {type: "number"},
                            deviceId: {type: "string"},
                            origid: {type: "string"},
                            destid: {type: "string"},
                            destUnitId: {type: "string"},
                            busnissname: {type: "string"},
                            origName: {type: "string"},
                            destName: {type: "string"},
                            destUnitName: {type: "string"},
                            styleId: {type: "string"},
                            stylename: {type: "string"},
                            colorId: {type: "string"},
                            sizeId: {type: "string"},
                            qty: {type: "number"},
                            billQty: {type: "number"},
                            diffQty: {type: "number"},
                            price: {type: "number"},
                            saletype: {type: "string"},
                            class3Name: {type: "string"}
                        }
                    },

                    data: "data",
                    groups: "data"
                },
                filter: {
                    logic: "and",
                    filters: filters
                },

                transport: {
                    read: {
                        url: basePath + "/search/saleorderCountView/list.do",
                        type: "POST",
                        dataType: "json",
                        async: false,
                        contentType: 'application/json'
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    }
                },
                sort: [{field: "billDate", dir: "desc"}],
                pageSize: 100.0,
                serverSorting: true,
                serverPaging: true,
                serverGrouping: false,
                serverFiltering: true,
                aggregate: [

                    {field: "qty", aggregate: "sum"},
                    {field: "styleId", aggregate: "count"},
                    {field: "price", aggregate: "average"},
                    {field: "totactprice", aggregate: "sum"},

                ]


            },
            sortable: {
                mode: "multiple",
                allowUnsort: true
            },
            rowNumber: true,
            pageable: {
                input: true,
                buttonCount: 5,
                pageSize: 100.0,
                pageSizes: [100, 500, 1000, 2000]
            },

            groupable: true,
            group: onGrouping,
            columnMenu: true,
            filterable: {
                extra: false
            },
            //selectable: "multiple row",
            reorderable: true,
            resizable: true,
            scrollable: true,

            columns: [
                {
                    field: "", title: "图片", width: 100,
                    template: function (data) {
                        var url = data.url;
                        if (url == null) {
                            return "无图片";
                        } else {
                            return "<img width=80 height=100  onclick=showImagesUrl('" +basePath + data.url + "') src='" +basePath+ data.url + "' alt='" + data.styleid + "'/>";
                        }
                    }

                },

                {
                    title: "日期",
                    field: "billDate",
                    width: "200px",
                    aggregates: ["count"],
                    filterable: {
                        extra: true,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: "yyyy-MM-dd",
                                culture: "zh-CN"
                            });
                        }

                    },

                    format: "{0:yyyy-MM-dd}",
                    groupHeaderTemplate: function (data) {

                        var totQty = data.aggregates.qty.sum;
                        var value = kendo.toString(data.value, 'yyyy-MM-dd HH:mm:ss');
                        var totactprice = data.aggregates.totactprice.sum;
                        return "日期:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }
                },
                {
                    title: "单号",
                    field: "billno",
                    width: "250px",
                    aggregates: ["count"],
                    groupHeaderTemplate: function (data) {
                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var totactprice = data.aggregates.totactprice.sum;
                        return "单号:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }
                },
                {
                    field: "status",
                    title: "单据状态",
                    width: "150px",
                    template:function(data) {
                        var value = "";
                        switch (data.status) {
                            case -1 :
                                value = "撤销";
                                break;
                            case 0 :
                                value = "录入";
                                break;
                            case 1:
                                value = "审核";
                                break;
                            case 2 :
                                value = "结束";
                                break;
                            case 3:
                                value = "操作中";
                                break;
                            case 4:
                                value = "申请撤销";
                                break;
                            case 6:
                                value = "商城订单暂存";
                                break;
                            case 7:
                                value = "商城订单录入";
                                break;
                            default:
                                break;
                        }
                        return value;
                    }
                },
                {
                    field: "sku",
                    title: "SKU",
                    width: "150px"
                },
                {
                    field: "origname",
                    title: "发货仓店",
                    width: "180px",
                    /* template:function(data) {
                     if(data.origName){
                     return "["+data.origid+"]"+data.origName;
                     }else{
                     if(data.origid){
                     return "["+data.origid+"]";
                     }else{
                     return "";
                     }
                     }
                     }*/
                },
                {
                    field: "deportname",
                    title: "仓店",
                    width: "180px",
                    /* template:function(data) {
                     if(data.origName){
                     return "["+data.origid+"]"+data.origName;
                     }else{
                     if(data.origid){
                     return "["+data.origid+"]";
                     }else{
                     return "";
                     }
                     }
                     }*/
                },
                {
                    field: "origunitname",
                    title: "客户编号",
                    width: "180px",
                    groupHeaderTemplate: function (data) {
                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var totactprice = data.aggregates.totactprice.sum;
                        if (value == undefined) {
                            value = "";
                        }
                        return "客户编号:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }

                },
                {
                    field: "busnissname",
                    title: "销售员",
                    width: "180px",
                    groupHeaderTemplate: function (data) {
                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var totactprice = data.aggregates.totactprice.sum;
                        if (value == undefined) {
                            value = "";
                        }
                        return "销售员:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }

                },
                {
                    field: "saletype",
                    title: "单据类型",
                    width: "180px",
                    groupHeaderTemplate: function (data) {
                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var totactprice = data.aggregates.totactprice.sum;
                        if (value == undefined) {
                            value = "";
                        }
                        return "单据类型:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }

                },
                {
                    field: "discount",
                    title: "折扣",
                    width: "180px",

                },
                {
                    field: "class3Name",
                    title: "大类",
                    width: "180px",

                },
                {
                    field: "actprice",
                    title: "实际价格",
                    width: "180px",
                    template: function (data) {
                        var actprice=data.actprice.toFixed(2);
                        return actprice;
                    }
                },
                {
                    field: "precast",
                    title: "成本价",
                    width: "180px",

                },
                /* {
                 field:"a",
                 title:"成本总价",
                 width:"180px",
                 },*/
                {
                    field: "gross",
                    title: "销售毛利",
                    width: "180px",
                    template: function (data) {
                        var gross=parseFloat(data.gross).toFixed(2);
                        return gross;
                    }
                },
                {
                    field: "grossprofits",
                    title: "销售毛利率(%)",
                    width: "180px",
                },
                {
                    field: "totactprice",
                    title: "实际金额",
                    width: "180px",
                    groupable: false,
                    aggregates: ["sum"],
                    footerTemplate: "#=kendo.toString(sum,'0.00')#",
                    template: function (data) {
                        var totactprice=parseFloat(data.totactprice).toFixed(2);
                        return totactprice;
                    }

                },

                {
                    field: "styleid", title: "款号", width: "140px",
                    aggregates: ["count"],
                    groupHeaderTemplate: function (data) {

                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var avgPrice = data.aggregates.price.average;
                        return "款号:" + value + " 总数量:" + totQty + "; 平均价 :" + kendo.toString(avgPrice, '0.00');
                    }
                },
                {field: "stylename", title: "款名", width: "80px"},
                {field: "sizeid", title: "尺号", width: "80px"},
                {field: "outqty", title: "出库数量", width: "80px"},
                {field: "initqty", title: "入库数量", width: "80px"},
                {
                    field: "qty", title: "数量", width: "80px", groupable: false,
                    aggregates: ["sum"],
                    footerTemplate: "#=sum#"

                },
                {field: "price", title: "吊牌价", width: "110px", groupable: false, aggregates: ["average"]},
                {
                    field: "outstatus",
                    title: "出库状态",
                    width: "150px",
                    template:function(data) {
                        if (data.outstatus == 0) {
                            return "订单状态";
                        } else if (data.outstatus == 2) {
                            return "已出库";
                        } else if (data.outstatus == 3) {
                            return "出库中";
                        } else {
                            return '';
                        }
                    }
                },
                {
                    field: "instatus",
                    title: "入库状态",
                    width: "150px",
                    template:function(data) {
                        if (data.instatus == 0) {
                            return "订单状态";
                        } else if (data.instatus == 1) {
                            return "已入库";
                        } else if (data.instatus == 4) {
                            return "入库中";
                        } else {
                            return '';
                        }
                    }
                }


            ]

        });
        isoneinitKendoUIGrid = false;
        console.info(tableRole);
        console.info(divRole);
        var b=null;
        var grid = $("#searchGrid").data("kendoGrid");
        for(b in divRole){
            if(divRole[b].ishow != 0){
                grid.hideColumn(""+b.buttonId);
            }
        }
    } else {
        search();
    }


}
var isoneinitKendoUIGrid=true;
function initnoKendoUIGrid() {
    exportExcelid = "searchGrid";
    if (isoneinitKendoUIGrid) {
        var filters = serializeToFilter($("#searchForm"));
        console.log(filters);
        $("#searchGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "销售明细统计.xlsx",
                proxyURL: basePath + "/search/saleorderCountView/export.do",
                allPages:true,
                filterable: true
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                /* var tokenTemplate = kendo.template(this.columns[4].template);
                 var destTemplate = kendo.template(this.columns[6].template);
                 var destUnitTemplate = kendo.template(this.columns[7].template);
                 var origTemplate = kendo.template(this.columns[8].template);
                 var diffTemplate = kendo.template(this.columns[15].template);*/
                var rowIndex = 1;
                var groupNum = this.dataSource._group.length;
                for (var i = 1; i < sheet.rows.length; i++) {
                    var row = sheet.rows[i];
                    if (row.cells[3 + groupNum] && row.cells[5 + groupNum] && row.cells[6 + groupNum] && row.cells[7 + groupNum]) {
                        var gridRow = $("#searchGrid").data("kendoGrid").dataItem("tr:eq(" + rowIndex + ")");
                      /*  var dataItem = {
                            token: row.cells[4 + groupNum].value,
                            destid: row.cells[6 + groupNum].value,
                            destUnitId: row.cells[7 + groupNum].value,
                            origid: row.cells[8 + groupNum].value,
                           // destName: gridRow.destName,
                            //destUnitName: gridRow.destUnitName,
                           // origName: gridRow.origName,
                            billNo: gridRow.billNo,
                            qty: gridRow.qty,
                            billQty: gridRow.billQty
                        };*/
                        /* row.cells[4+groupNum].value = tokenTemplate(dataItem);
                         row.cells[6+groupNum].value = destTemplate(dataItem);
                         row.cells[7+groupNum].value = destUnitTemplate(dataItem);
                         row.cells[8+groupNum].value = origTemplate(dataItem);
                         row.cells[15+groupNum].value = diffTemplate(dataItem);*/
                        rowIndex++;
                    }

                }
            },
            dataSource: {
                schema: {
                    total: "total",
                    model: {

                        fields: {
                            billDate: {type: "date"},
                            billno: {type: "string"},
                            taskId: {type: "string"},
                            token: {type: "number"},
                            deviceId: {type: "string"},
                            origid: {type: "string"},
                            destid: {type: "string"},
                            destUnitId: {type: "string"},
                            busnissname: {type: "string"},
                            origName: {type: "string"},
                            destName: {type: "string"},
                            destUnitName: {type: "string"},
                            styleId: {type: "string"},
                            stylename: {type: "string"},
                            colorId: {type: "string"},
                            sizeId: {type: "string"},
                            qty: {type: "number"},
                            billQty: {type: "number"},
                            diffQty: {type: "number"},
                            price: {type: "number"},
                            saletype: {type: "string"}
                        }
                    },

                    data: "data",
                    groups: "data"
                },
                    filter: {
                    logic: "and",
                    filters: filters
                },

                transport: {
                    read: {
                        url: basePath + "/search/saleorderCountView/list.do",
                        type: "POST",
                        dataType: "json",
                        async: false,
                        contentType: 'application/json'
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    }
                },
                sort: [{field: "billDate", dir: "desc"}],
                pageSize: 100.0,
                serverSorting: true,
                serverPaging: true,
                serverGrouping: false,
                serverFiltering: true,
                aggregate: [

                    {field: "qty", aggregate: "sum"},
                    {field: "styleId", aggregate: "count"},
                    {field: "price", aggregate: "average"},
                    {field: "totactprice", aggregate: "sum"},

                ]


            },
            sortable: {
                mode: "multiple",
                allowUnsort: true
            },
            rowNumber: true,
            pageable: {
                input: true,
                buttonCount: 5,
                pageSize: 100.0,
                pageSizes: [100, 500, 1000, 2000]
            },

            groupable: true,
            group: onGrouping,
            columnMenu: true,
            filterable: {
                extra: false
            },
            //selectable: "multiple row",
            reorderable: true,
            resizable: true,
            scrollable: true,

            columns: [
                {
                    title: "日期",
                    field: "billDate",
                    width: "200px",
                    aggregates: ["count"],
                    filterable: {
                        extra: true,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: "yyyy-MM-dd",
                                culture: "zh-CN"
                            });
                        }

                    },

                    format: "{0:yyyy-MM-dd}",
                    groupHeaderTemplate: function (data) {

                        var totQty = data.aggregates.qty.sum;
                        var value = kendo.toString(data.value, 'yyyy-MM-dd HH:mm:ss');
                        var totactprice = data.aggregates.totactprice.sum;
                        return "日期:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }
                },
                {
                    title: "单号",
                    field: "billno",
                    width: "250px",
                    aggregates: ["count"],
                    groupHeaderTemplate: function (data) {
                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var totactprice = data.aggregates.totactprice.sum;
                        return "单号:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }
                },
                {
                    field: "sku",
                    title: "SKU",
                    width: "150px"
                },
                {
                    field: "origname",
                    title: "发货仓店",
                    width: "180px",
                    /* template:function(data) {
                     if(data.origName){
                     return "["+data.origid+"]"+data.origName;
                     }else{
                     if(data.origid){
                     return "["+data.origid+"]";
                     }else{
                     return "";
                     }
                     }
                     }*/
                },
                {
                    field: "deportname",
                    title: "仓店",
                    width: "180px",
                    /* template:function(data) {
                     if(data.origName){
                     return "["+data.origid+"]"+data.origName;
                     }else{
                     if(data.origid){
                     return "["+data.origid+"]";
                     }else{
                     return "";
                     }
                     }
                     }*/
                },
                {
                    field: "origunitname",
                    title: "客户编号",
                    width: "180px",
                    groupHeaderTemplate: function (data) {
                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var totactprice = data.aggregates.totactprice.sum;
                        if (value == undefined) {
                            value = "";
                        }
                        return "客户编号:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }

                },
                {
                    field: "busnissname",
                    title: "销售员",
                    width: "180px",
                    groupHeaderTemplate: function (data) {
                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var totactprice = data.aggregates.totactprice.sum;
                        if (value == undefined) {
                            value = "";
                        }
                        return "销售员:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }

                },
                {
                    field: "saletype",
                    title: "单据类型",
                    width: "180px",
                    groupHeaderTemplate: function (data) {
                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var totactprice = data.aggregates.totactprice.sum;
                        if (value == undefined) {
                            value = "";
                        }
                        return "单据类型:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }

                },
                {
                    field: "discount",
                    title: "折扣",
                    width: "180px",

                },
                {
                    field: "actprice",
                    title: "实际价格",
                    width: "180px",
                    template: function (data) {
                        var actprice=data.actprice.toFixed(2);
                        return actprice;
                    }
                },
                /*{
                    field: "precast",
                    title: "成本价",
                    width: "180px",
                },*/
                /* {
                 field:"a",
                 title:"成本总价",
                 width:"180px",
                 },*/
              /*  {
                    field: "gross",
                    title: "销售毛利",
                    width: "180px",
                },
                {
                    field: "grossprofits",
                    title: "销售毛利率(%)",
                    width: "180px",
                },*/
                {
                    field: "totactprice",
                    title: "实际金额",
                    width: "180px",
                    groupable: false,
                    aggregates: ["sum"],
                    footerTemplate: "#=kendo.toString(sum,'0.00')#",
                    template: function (data) {
                        var totactprice=parseFloat(data.totactprice).toFixed(2);
                        return totactprice;
                    }

                },

                {
                    field: "styleid", title: "款号", width: "140px",
                    aggregates: ["count"],
                    groupHeaderTemplate: function (data) {

                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var avgPrice = data.aggregates.price.average;
                        return "款号:" + value + " 总数量:" + totQty + "; 平均价 :" + kendo.toString(avgPrice, '0.00');
                    }
                },
                {field: "stylename", title: "款名", width: "80px"},
                {field: "sizeid", title: "尺号", width: "80px"},
                {field: "outqty", title: "出库数量", width: "80px"},
                {field: "initqty", title: "入库数量", width: "80px"},
                {
                    field: "qty", title: "数量", width: "80px", groupable: false,
                    aggregates: ["sum"],
                    footerTemplate: "#=sum#"
                },
                {field: "price", title: "吊牌价", width: "110px", groupable: false, aggregates: ["average"]}


            ]

        });
        console.info(tableRole);
        console.info(divRole);
        isoneinitKendoUIGrid = false;
        var b =null;
        var grid1 = $("#searchGrid").data("kendoGrid");
        for(b in divRole){
            if(divRole[b].ishow != 0){
                grid1.hideColumn(""+b.buttonId);
            }
        }
    } else {
        search();
    }
}
var isoneinitKendoUIsearchsaleGrid = true;
function initKendoUIGridSale() {
    exportExcelid = "searchsaleGrid";
    if (isoneinitKendoUIsearchsaleGrid) {
        var filters = serializeToFilter($("#searchForm"));
        console.log(filters);
        $("#searchsaleGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "销售明细统计.xlsx",
                proxyURL: basePath + "/search/saleorderCountView/export.do",
                allPages:true,
                filterable: true
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                /* var tokenTemplate = kendo.template(this.columns[4].template);
                 var destTemplate = kendo.template(this.columns[6].template);
                 var destUnitTemplate = kendo.template(this.columns[7].template);
                 var origTemplate = kendo.template(this.columns[8].template);
                 var diffTemplate = kendo.template(this.columns[15].template);*/
                var rowIndex = 1;
                var groupNum = this.dataSource._group.length;
                for (var i = 1; i < sheet.rows.length; i++) {
                    var row = sheet.rows[i];
                    if (row.cells[3 + groupNum] && row.cells[5 + groupNum] && row.cells[6 + groupNum] && row.cells[7 + groupNum]) {
                       /* var gridRow = $("#searchGrid").data("kendoGrid").dataItem("tr:eq(" + rowIndex + ")");*/
                       /* var dataItem = {
                            token: row.cells[4 + groupNum].value,
                            destid: row.cells[6 + groupNum].value,
                            destUnitId: row.cells[7 + groupNum].value,
                            origid: row.cells[8 + groupNum].value,
                           // destName: gridRow.destName,
                            //destUnitName: gridRow.destUnitName,
                           // origName: gridRow.origName,
                            billNo: gridRow.billNo,
                            qty: gridRow.qty,
                            billQty: gridRow.billQty
                        };*/
                        /* row.cells[4+groupNum].value = tokenTemplate(dataItem);
                         row.cells[6+groupNum].value = destTemplate(dataItem);
                         row.cells[7+groupNum].value = destUnitTemplate(dataItem);
                         row.cells[8+groupNum].value = origTemplate(dataItem);
                         row.cells[15+groupNum].value = diffTemplate(dataItem);*/
                        rowIndex++;
                    }

                }
            },
            dataSource: {
                schema: {
                    total: "total",
                    model: {

                        /* fields: {
                         billDate: { type: "date" },
                         billno: { type: "string" },
                         taskId:{type:"string"},
                         token:{ type: "number"},
                         deviceId: { type: "string" },
                         origid: { type: "string" },
                         destid:{ type: "string" },
                         destUnitId:{ type: "string" },
                         busnissname:{ type: "string" },
                         origName:{type:"string"},
                         destName:{ type : "string" },
                         destUnitName:{ type: "string" },
                         styleId: { type: "string" },
                         stylename: { type: "string" },
                         colorId: { type: "string" },
                         sizeId: { type: "string" },
                         qty: { type: "number" },
                         billQty: { type: "number" },
                         diffQty: { type: "number" },
                         price: { type: "number" },
                         saletype: { type: "string" }
                         }*/
                    },

                    data: "data",
                    groups: "data"
                },
                filter: {
                    logic: "and",
                    filters: filters
                },

                transport: {
                    read: {
                        url: basePath + "/search/saleorderCountView/listsale.do",
                        type: "POST",
                        dataType: "json",
                        async: false,
                        contentType: 'application/json'
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    }
                },
                sort: [{field: "billDate", dir: "desc"}],
                pageSize: 100.0,
                serverSorting: true,
                serverPaging: true,
                serverGrouping: false,
                serverFiltering: true,
                aggregate: [
                    {field: "totqty", aggregate: "sum"},
                    {field: "totoutqty", aggregate: "sum"},
                    {field: "totinqty", aggregate: "sum"},
                    {field: "actprice", aggregate: "sum"},
                    {field: "payprice", aggregate: "sum"},

                ]


            },
            sortable: {
                mode: "multiple",
                allowUnsort: true
            },
            rowNumber: true,
            pageable: {
                input: true,
                buttonCount: 5,
                pageSize: 100.0,
                pageSizes: [100, 500, 1000, 2000]
            },

            groupable: true,
            group: onGrouping,
            columnMenu: true,
            filterable: {
                extra: false
            },
            //selectable: "multiple row",
            reorderable: true,
            resizable: true,
            scrollable: true,

            columns: [
                {
                    title: "日期",
                    field: "billDate",
                    width: "200px",
                    aggregates: ["count"],
                    filterable: {
                        extra: true,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: "yyyy-MM-dd",
                                culture: "zh-CN"
                            });
                        }

                    },

                    format: "{0:yyyy-MM-dd}",
                    /*groupHeaderTemplate: function(data) {

                     var totQty = data.aggregates.qty.sum;
                     var value = kendo.toString(data.value, 'yyyy-MM-dd HH:mm:ss');
                     var avgPrice = data.aggregates.totactprice.average;
                     return "日期:"+value +" 总数量:"+totQty+"; 平均价 :"+kendo.toString(avgPrice, '0.00');
                     }*/
                },
                {
                    title: "单号",
                    field: "billno",
                    width: "250px",
                },
                {
                    field: "origunitname",
                    title: "客户",
                    width: "150px"
                },
                {
                    field: "origunitname",
                    title: "发货方",
                    width: "150px"
                },
                {
                    field: "origname",
                    title: "发货仓库",
                    width: "180px",
                    /* template:function(data) {
                     if(data.origName){
                     return "["+data.origid+"]"+data.origName;
                     }else{
                     if(data.origid){
                     return "["+data.origid+"]";
                     }else{
                     return "";
                     }
                     }
                     }*/
                },
                {
                    field: "destname",
                    title: "收货仓库",
                    width: "150px"
                },
                {
                    field: "customertypeid",
                    title: "客户类型",
                    width: "180px",
                    template: function (data) {
                        if (data.customertypeid == "CT-AT") {
                            return "省代客户";
                        } else if (data.customertypeid == "CT-ST") {
                            return "门店客户";
                        } else if (data.customertypeid == "CT-LS") {
                            return "零售客户";
                        } else {
                            return "";
                        }
                    }
                },
                {
                    field: "totqty",
                    title: "单据数量",
                    width: "180px",
                    aggregates: ["sum"],
                    footerTemplate: "#=sum#"

                },
                {
                    field: "totoutqty",
                    title: "已出库数量",
                    width: "180px",
                    aggregates: ["sum"],
                    footerTemplate: "#=sum#"

                },
                {
                    field: "totinqty",
                    title: "已入库数量",
                    width: "180px",
                    aggregates: ["sum"],
                    footerTemplate: "#=sum#"

                },
                {
                    field: "actprice",
                    title: "应付付金额",
                    width: "180px",
                    aggregates: ["sum"],
                    footerTemplate: "#=kendo.toString(sum,'0.00')#",
                    template: function (data) {


                        var actprice=data.actprice.toFixed(2);
                        return actprice;
                    }

                },
                {
                    field: "payprice",
                    title: "实付金额",
                    width: "180px",
                    aggregates: ["sum"],
                    footerTemplate: "#=kendo.toString(sum,'0.00')#",
                    template: function (data) {

                        var payprice=data.payprice.toFixed(2);
                        return payprice;
                    }

                },
                {
                    field: "busnissname",
                    title: "销售员",
                    width: "180px",
                    groupHeaderTemplate: function (data) {
                        var totQty = data.aggregates.totqty.sum;
                        var value = data.value;
                        var totactprice = data.aggregates.actprice.sum;
                        if (value == undefined) {
                            value = "";
                        }
                        return "销售员:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }

                },
                {
                    field: "saletype",
                    title: "单据类型",
                    width: "180px",
                    groupHeaderTemplate: function (data) {
                        var totQty = data.aggregates.totqty.sum;
                        var value = data.value;
                        var totactprice = data.aggregates.actprice.sum;
                        if (value == undefined) {
                            value = "";
                        }
                        return "单据类型:" + value + " 总数量:" + totQty + "; 总价 :" + kendo.toString(totactprice, '0.00');
                    }

                },
                {
                    field: "remark",
                    title: "备注",
                    width: "180px",
                }
            ]

        });
        $(".k-grid-toolbar").hide();
        isoneinitKendoUIsearchsaleGrid = false;
    } else {
        search();
    }

}

function onGrouping(arg) {
    /*
     kendoConsole.log("Group on " + kendo.stringify(arg.groups));
     */
}

/*function saleDetail() {
 initKendoUIGrid();
 }
 function saleorderDetail(){
 alert(123);
 initKendoUIGridSale();
 }*/
var isoneinitKendoUIGridSalebusinessname=true;
function initKendoUIGridSalebusinessname(){
    exportExcelid = "searchsalebusinessnameGrid";
    if (isoneinitKendoUIGridSalebusinessname) {
        var filters = serializeToFilter($("#searchForm"));
        console.log(filters);
        $("#searchsalebusinessnameGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "销售明细统计.xlsx",
                proxyURL: basePath + "/search/saleorderCountView/export.do",
                allPages:true,
                filterable: true
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                /* var tokenTemplate = kendo.template(this.columns[4].template);
                 var destTemplate = kendo.template(this.columns[6].template);
                 var destUnitTemplate = kendo.template(this.columns[7].template);
                 var origTemplate = kendo.template(this.columns[8].template);
                 var diffTemplate = kendo.template(this.columns[15].template);*/
                var rowIndex = 1;
                var groupNum = this.dataSource._group.length;
                for (var i = 1; i < sheet.rows.length; i++) {
                    var row = sheet.rows[i];
                    if (row.cells[3 + groupNum] && row.cells[5 + groupNum] && row.cells[6 + groupNum] && row.cells[7 + groupNum]) {
                        /* var gridRow = $("#searchGrid").data("kendoGrid").dataItem("tr:eq(" + rowIndex + ")");*/
                        /* var dataItem = {
                         token: row.cells[4 + groupNum].value,
                         destid: row.cells[6 + groupNum].value,
                         destUnitId: row.cells[7 + groupNum].value,
                         origid: row.cells[8 + groupNum].value,
                         // destName: gridRow.destName,
                         //destUnitName: gridRow.destUnitName,
                         // origName: gridRow.origName,
                         billNo: gridRow.billNo,
                         qty: gridRow.qty,
                         billQty: gridRow.billQty
                         };*/
                        /* row.cells[4+groupNum].value = tokenTemplate(dataItem);
                         row.cells[6+groupNum].value = destTemplate(dataItem);
                         row.cells[7+groupNum].value = destUnitTemplate(dataItem);
                         row.cells[8+groupNum].value = origTemplate(dataItem);
                         row.cells[15+groupNum].value = diffTemplate(dataItem);*/
                        rowIndex++;
                    }

                }
            },
            dataSource: {
                schema: {
                    total: "total",
                    model: {

                         fields: {
                             busnissname: { type: "string" },
                             origname:{type:"string"},
                             precast:{ type: "string"},
                             gross: { type: "string" },
                             grossprofits: { type: "string" },
                             totactprice:{ type: "string" }
                         }
                    },

                    data: "data",
                    groups: "data"
                },
                filter: {
                    logic: "and",
                    filters: filters
                },

                transport: {
                    read: {
                        url: basePath + "/search/saleorderCountView/readSaleBybusinessname.do",
                        type: "POST",
                        dataType: "json",
                        async: false,
                        contentType: 'application/json'
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    }
                },
                sort: [{field: "totactprice", dir: "desc"}],
                pageSize: 100.0,
                serverSorting: true,
                serverPaging: true,
                serverGrouping: false,
                serverFiltering: true,
                aggregate: [
                   /* {field: "totqty", aggregate: "sum"},
                    {field: "totoutqty", aggregate: "sum"},
                    {field: "totinqty", aggregate: "sum"},
                    {field: "actprice", aggregate: "sum"},
                    {field: "payprice", aggregate: "sum"},*/

                ]


            },
            sortable: {
                mode: "multiple",
                allowUnsort: true
            },
            rowNumber: true,
            pageable: {
                input: true,
                buttonCount: 5,
                pageSize: 100.0,
                pageSizes: [100, 500, 1000, 2000]
            },

            groupable: true,
            group: onGrouping,
            columnMenu: true,
            filterable: {
                extra: false
            },
            //selectable: "multiple row",
            reorderable: true,
            resizable: true,
            scrollable: true,

            columns: [
                {
                    title: "销售员",
                    field: "busnissname",
                    width: "250px",
                },
                {
                    field: "origname",
                    title: "部门",
                    width: "150px"
                },
                {
                    field: "precast",
                    title: "成本价",
                    width: "150px"
                },
                {
                    field: "gross",
                    title: "毛利",
                    width: "180px",
                    template: function (data) {
                        var gross=parseFloat(data.gross).toFixed(2);
                        return gross;
                    }
                },
                {
                    field: "grossprofits",
                    title: "毛利率",
                    width: "180px",
                },
                {
                    field: "salesum",
                    title: "销售单品数",
                    width: "150px"
                },
                {
                    field: "salereturnsum",
                    title: "销售退货单品数",
                    width: "150px"
                },
                {
                    field: "salemoney",
                    title: "销售金额",
                    width: "150px",
                    template: function (data) {
                        var salemoney=parseFloat(data.salemoney).toFixed(2);
                        return salemoney;
                    }
                },
                {
                    field: "salereturnmoney",
                    title: "销售退货金额",
                    width: "150px",
                    template: function (data) {
                        var salereturnmoney=parseFloat(data.salereturnmoney).toFixed(2);
                        return salereturnmoney;
                    }
                },
                {
                    field: "totactprice",
                    title: "销售额",
                    width: "180px",
                    template: function (data) {
                        var totactprice=parseFloat(data.totactprice).toFixed(2);
                        return totactprice;
                    }
                }

            ]

        });
        $(".k-grid-toolbar").hide();
        isoneinitKendoUIGridSalebusinessname = false;
    } else {
        search();
    }
}
function initKendoUIGridSalebusinessnameno(){
    exportExcelid = "searchsalebusinessnameGrid";
    if (isoneinitKendoUIGridSalebusinessname) {
        var filters = serializeToFilter($("#searchForm"));
        console.log(filters);
        $("#searchsalebusinessnameGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "销售明细统计.xlsx",
                proxyURL: basePath + "/search/saleorderCountView/export.do",
                allPages:true,
                filterable: true
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                /* var tokenTemplate = kendo.template(this.columns[4].template);
                 var destTemplate = kendo.template(this.columns[6].template);
                 var destUnitTemplate = kendo.template(this.columns[7].template);
                 var origTemplate = kendo.template(this.columns[8].template);
                 var diffTemplate = kendo.template(this.columns[15].template);*/
                var rowIndex = 1;
                var groupNum = this.dataSource._group.length;
                for (var i = 1; i < sheet.rows.length; i++) {
                    var row = sheet.rows[i];
                    if (row.cells[3 + groupNum] && row.cells[5 + groupNum] && row.cells[6 + groupNum] && row.cells[7 + groupNum]) {
                        /* var gridRow = $("#searchGrid").data("kendoGrid").dataItem("tr:eq(" + rowIndex + ")");*/
                        /* var dataItem = {
                         token: row.cells[4 + groupNum].value,
                         destid: row.cells[6 + groupNum].value,
                         destUnitId: row.cells[7 + groupNum].value,
                         origid: row.cells[8 + groupNum].value,
                         // destName: gridRow.destName,
                         //destUnitName: gridRow.destUnitName,
                         // origName: gridRow.origName,
                         billNo: gridRow.billNo,
                         qty: gridRow.qty,
                         billQty: gridRow.billQty
                         };*/
                        /* row.cells[4+groupNum].value = tokenTemplate(dataItem);
                         row.cells[6+groupNum].value = destTemplate(dataItem);
                         row.cells[7+groupNum].value = destUnitTemplate(dataItem);
                         row.cells[8+groupNum].value = origTemplate(dataItem);
                         row.cells[15+groupNum].value = diffTemplate(dataItem);*/
                        rowIndex++;
                    }

                }
            },
            dataSource: {
                schema: {
                    total: "total",
                    model: {

                        fields: {
                            busnissname: { type: "string" },
                            origname:{type:"string"},
                            precast:{ type: "string"},
                            gross: { type: "string" },
                            grossprofits: { type: "string" },
                            totactprice:{ type: "string" }
                        }
                    },

                    data: "data",
                    groups: "data"
                },
                filter: {
                    logic: "and",
                    filters: filters
                },

                transport: {
                    read: {
                        url: basePath + "/search/saleorderCountView/readSaleBybusinessname.do",
                        type: "POST",
                        dataType: "json",
                        async: false,
                        contentType: 'application/json'
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    }
                },
                sort: [{field: "totactprice", dir: "desc"}],
                pageSize: 100.0,
                serverSorting: true,
                serverPaging: true,
                serverGrouping: false,
                serverFiltering: true,
                aggregate: [
                    /* {field: "totqty", aggregate: "sum"},
                     {field: "totoutqty", aggregate: "sum"},
                     {field: "totinqty", aggregate: "sum"},
                     {field: "actprice", aggregate: "sum"},
                     {field: "payprice", aggregate: "sum"},*/

                ]


            },
            sortable: {
                mode: "multiple",
                allowUnsort: true
            },
            rowNumber: true,
            pageable: {
                input: true,
                buttonCount: 5,
                pageSize: 100.0,
                pageSizes: [100, 500, 1000, 2000]
            },

            groupable: true,
            group: onGrouping,
            columnMenu: true,
            filterable: {
                extra: false
            },
            //selectable: "multiple row",
            reorderable: true,
            resizable: true,
            scrollable: true,

            columns: [
                {
                    title: "销售员",
                    field: "busnissname",
                    width: "250px",
                },
                {
                    field: "origname",
                    title: "部门",
                    width: "150px"
                },
                {
                    field: "salesum",
                    title: "销售单品数",
                    width: "150px"
                },
                {
                    field: "salereturnsum",
                    title: "销售退货单品数",
                    width: "150px"
                },
                {
                    field: "salemoney",
                    title: "销售金额",
                    width: "150px",
                    template: function (data) {
                        var salemoney=parseFloat(data.salemoney).toFixed(2);
                        return salemoney;
                    }
                },
                {
                    field: "salereturnmoney",
                    title: "销售退货金额",
                    width: "150px",
                    template: function (data) {
                        var salereturnmoney=parseFloat(data.salereturnmoney).toFixed(2);
                        return salereturnmoney;
                    }
                },
               /* {
                    field: "precast",
                    title: "成本价",
                    width: "150px"
                },
                {
                    field: "gross",
                    title: "毛利",
                    width: "180px",
                },
                {
                    field: "grossprofits",
                    title: "毛利率",
                    width: "180px",
                },*/
                {
                    field: "totactprice",
                    title: "销售额",
                    width: "180px",
                    template: function (data) {
                        var totactprice=parseFloat(data.totactprice).toFixed(2);
                        return totactprice;
                    }
                }

            ]

        });
        $(".k-grid-toolbar").hide();
        isoneinitKendoUIGridSalebusinessname = false;
    } else {
        search();
    }
}
var isoneinitKendoUIGridSaleorigname=true;
function initKendoUIGridSaleorigname(){
    exportExcelid = "searchsaleorignameGrid";
    if (isoneinitKendoUIGridSaleorigname) {
        var filters = serializeToFilter($("#searchForm"));
        console.log(filters);
        $("#searchsaleorignameGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "销售明细统计.xlsx",
                proxyURL: basePath + "/search/saleorderCountView/export.do",
                allPages:true,
                filterable: true
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                /* var tokenTemplate = kendo.template(this.columns[4].template);
                 var destTemplate = kendo.template(this.columns[6].template);
                 var destUnitTemplate = kendo.template(this.columns[7].template);
                 var origTemplate = kendo.template(this.columns[8].template);
                 var diffTemplate = kendo.template(this.columns[15].template);*/
                var rowIndex = 1;
                var groupNum = this.dataSource._group.length;
                for (var i = 1; i < sheet.rows.length; i++) {
                    var row = sheet.rows[i];
                    if (row.cells[3 + groupNum] && row.cells[5 + groupNum] && row.cells[6 + groupNum] && row.cells[7 + groupNum]) {
                        /* var gridRow = $("#searchGrid").data("kendoGrid").dataItem("tr:eq(" + rowIndex + ")");*/
                        /* var dataItem = {
                         token: row.cells[4 + groupNum].value,
                         destid: row.cells[6 + groupNum].value,
                         destUnitId: row.cells[7 + groupNum].value,
                         origid: row.cells[8 + groupNum].value,
                         // destName: gridRow.destName,
                         //destUnitName: gridRow.destUnitName,
                         // origName: gridRow.origName,
                         billNo: gridRow.billNo,
                         qty: gridRow.qty,
                         billQty: gridRow.billQty
                         };*/
                        /* row.cells[4+groupNum].value = tokenTemplate(dataItem);
                         row.cells[6+groupNum].value = destTemplate(dataItem);
                         row.cells[7+groupNum].value = destUnitTemplate(dataItem);
                         row.cells[8+groupNum].value = origTemplate(dataItem);
                         row.cells[15+groupNum].value = diffTemplate(dataItem);*/
                        rowIndex++;
                    }

                }
            },
            dataSource: {
                schema: {
                    total: "total",
                    model: {

                        fields: {
                            busnissname: { type: "string" },
                            origname:{type:"string"},
                            precast:{ type: "string"},
                            gross: { type: "string" },
                            grossprofits: { type: "string" },
                            totactprice:{ type: "string" }
                        }
                    },

                    data: "data",
                    groups: "data"
                },
                filter: {
                    logic: "and",
                    filters: filters
                },

                transport: {
                    read: {
                        url: basePath + "/search/saleorderCountView/readSaleByorigname.do",
                        type: "POST",
                        dataType: "json",
                        async: false,
                        contentType: 'application/json'
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    }
                },
                sort: [{field: "totactprice", dir: "desc"}],
                pageSize: 100.0,
                serverSorting: true,
                serverPaging: true,
                serverGrouping: false,
                serverFiltering: true,
                aggregate: [
                    /* {field: "totqty", aggregate: "sum"},
                     {field: "totoutqty", aggregate: "sum"},
                     {field: "totinqty", aggregate: "sum"},
                     {field: "actprice", aggregate: "sum"},
                     {field: "payprice", aggregate: "sum"},*/

                ]


            },
            sortable: {
                mode: "multiple",
                allowUnsort: true
            },
            rowNumber: true,
            pageable: {
                input: true,
                buttonCount: 5,
                pageSize: 100.0,
                pageSizes: [100, 500, 1000, 2000]
            },

            groupable: true,
            group: onGrouping,
            columnMenu: true,
            filterable: {
                extra: false
            },
            //selectable: "multiple row",
            reorderable: true,
            resizable: true,
            scrollable: true,

            columns: [
                {
                    field: "origname",
                    title: "部门",
                    width: "150px"
                },
                {
                    field: "precast",
                    title: "成本价",
                    width: "150px"
                },
                {
                    field: "gross",
                    title: "毛利",
                    width: "180px",
                    template: function (data) {
                        var gross=parseFloat(data.gross).toFixed(2);
                        return gross;
                    }
                },
                {
                    field: "grossprofits",
                    title: "毛利率",
                    width: "180px",
                },
                {
                    field: "salesum",
                    title: "销售单品数",
                    width: "150px"
                },
                {
                    field: "salereturnsum",
                    title: "销售退货单品数",
                    width: "150px"
                },
                {
                    field: "salemoney",
                    title: "销售金额",
                    width: "150px",
                    template: function (data) {
                        var salemoney=parseFloat(data.salemoney).toFixed(2);
                        return salemoney;
                    }
                },
                {
                    field: "salereturnmoney",
                    title: "销售退货金额",
                    width: "150px",
                    template: function (data) {
                        var salereturnmoney=parseFloat(data.salereturnmoney).toFixed(2);
                        return salereturnmoney;
                    }
                },
                {
                    field: "totactprice",
                    title: "销售额",
                    width: "180px",
                    template: function (data) {
                        var totactprice=parseFloat(data.totactprice).toFixed(2);
                        return totactprice;
                    }
                }

            ]

        });
        $(".k-grid-toolbar").hide();
        isoneinitKendoUIGridSaleorigname = false;
    } else {
        search();
    }
}
function initKendoUIGridSaleorignameno(){
    exportExcelid = "searchsaleorignameGrid";
    if (isoneinitKendoUIGridSaleorigname) {
        var filters = serializeToFilter($("#searchForm"));
        console.log(filters);
        $("#searchsaleorignameGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "销售明细统计.xlsx",
                proxyURL: basePath + "/search/saleorderCountView/export.do",
                allPages:true,
                filterable: true
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                /* var tokenTemplate = kendo.template(this.columns[4].template);
                 var destTemplate = kendo.template(this.columns[6].template);
                 var destUnitTemplate = kendo.template(this.columns[7].template);
                 var origTemplate = kendo.template(this.columns[8].template);
                 var diffTemplate = kendo.template(this.columns[15].template);*/
                var rowIndex = 1;
                var groupNum = this.dataSource._group.length;
                for (var i = 1; i < sheet.rows.length; i++) {
                    var row = sheet.rows[i];
                    if (row.cells[3 + groupNum] && row.cells[5 + groupNum] && row.cells[6 + groupNum] && row.cells[7 + groupNum]) {
                        /* var gridRow = $("#searchGrid").data("kendoGrid").dataItem("tr:eq(" + rowIndex + ")");*/
                        /* var dataItem = {
                         token: row.cells[4 + groupNum].value,
                         destid: row.cells[6 + groupNum].value,
                         destUnitId: row.cells[7 + groupNum].value,
                         origid: row.cells[8 + groupNum].value,
                         // destName: gridRow.destName,
                         //destUnitName: gridRow.destUnitName,
                         // origName: gridRow.origName,
                         billNo: gridRow.billNo,
                         qty: gridRow.qty,
                         billQty: gridRow.billQty
                         };*/
                        /* row.cells[4+groupNum].value = tokenTemplate(dataItem);
                         row.cells[6+groupNum].value = destTemplate(dataItem);
                         row.cells[7+groupNum].value = destUnitTemplate(dataItem);
                         row.cells[8+groupNum].value = origTemplate(dataItem);
                         row.cells[15+groupNum].value = diffTemplate(dataItem);*/
                        rowIndex++;
                    }

                }
            },
            dataSource: {
                schema: {
                    total: "total",
                    model: {

                        fields: {
                            busnissname: { type: "string" },
                            origname:{type:"string"},
                            precast:{ type: "string"},
                            gross: { type: "string" },
                            grossprofits: { type: "string" },
                            totactprice:{ type: "string" }
                        }
                    },

                    data: "data",
                    groups: "data"
                },
                filter: {
                    logic: "and",
                    filters: filters
                },

                transport: {
                    read: {
                        url: basePath + "/search/saleorderCountView/readSaleByorigname.do",
                        type: "POST",
                        dataType: "json",
                        async: false,
                        contentType: 'application/json'
                    },
                    parameterMap: function (options) {
                        return JSON.stringify(options);
                    }
                },
                sort: [{field: "totactprice", dir: "desc"}],
                pageSize: 100.0,
                serverSorting: true,
                serverPaging: true,
                serverGrouping: false,
                serverFiltering: true,
                aggregate: [
                    /* {field: "totqty", aggregate: "sum"},
                     {field: "totoutqty", aggregate: "sum"},
                     {field: "totinqty", aggregate: "sum"},
                     {field: "actprice", aggregate: "sum"},
                     {field: "payprice", aggregate: "sum"},*/

                ]


            },
            sortable: {
                mode: "multiple",
                allowUnsort: true
            },
            rowNumber: true,
            pageable: {
                input: true,
                buttonCount: 5,
                pageSize: 100.0,
                pageSizes: [100, 500, 1000, 2000]
            },

            groupable: true,
            group: onGrouping,
            columnMenu: true,
            filterable: {
                extra: false
            },
            //selectable: "multiple row",
            reorderable: true,
            resizable: true,
            scrollable: true,

            columns: [
                {
                    field: "origname",
                    title: "部门",
                    width: "150px"
                },
               /* {
                    field: "precast",
                    title: "成本价",
                    width: "150px"
                },
                {
                    field: "gross",
                    title: "毛利",
                    width: "180px",
                },
                {
                    field: "grossprofits",
                    title: "毛利率",
                    width: "180px",
                },*/
                {
                    field: "salesum",
                    title: "销售单品数",
                    width: "150px"
                },
                {
                    field: "salereturnsum",
                    title: "销售退货单品数",
                    width: "150px"
                },
                {
                    field: "salemoney",
                    title: "销售金额",
                    width: "150px",
                    template: function (data) {
                        var salemoney=parseFloat(data.salemoney).toFixed(2);
                        return salemoney;
                    }
                },
                {
                    field: "salereturnmoney",
                    title: "销售退货金额",
                    width: "150px",
                    template: function (data) {
                        var salereturnmoney=parseFloat(data.salereturnmoney).toFixed(2);
                        return salereturnmoney;
                    }
                },
                {
                    field: "totactprice",
                    title: "销售额",
                    width: "180px",
                    template: function (data) {
                        var totactprice=parseFloat(data.totactprice).toFixed(2);
                        return totactprice;
                    }
                }

            ]

        });
        $(".k-grid-toolbar").hide();
        isoneinitKendoUIGridSaleorigname = false;
    } else {
        search();
    }
}
var dialogOpenPage;
var prefixId;
function openSearchGuestDialog() {
    dialogOpenPage = "saleOrderReturn";
    prefixId="search";
    $("#modal_guest_search_table").modal('show').on('shown.bs.modal', function () {
        initGuestSelect_Grid();
    });
    $("#searchGuestDialog_buttonGroup").html("" +
        "<button type='button'  class='btn btn-primary' onclick='confirm_selected_GuestId_saleReturn()'>确认</button>"
    );
}
var pageType = "edit";
function initSelectOrigForm() {
    $.ajax({
        url: basePath + "/unit/list.do?filter_EQI_type=9&filter_EQS_ownerId=" + $("#search_origUnitId").val(),
        cache: false,
        async: false,
        type: "POST",
        success: function (data, textStatus) {
            $("#search_origId").empty();
            $("#search_origId").append("<option value='' style='background-color: #eeeeee'>--请选择出库仓库--</option>");
            var json = data;
            for (var i = 0; i < json.length; i++) {
                $("#search_origId").append("<option value='" + json[i].id + "'>" + "[" + json[i].code + "]" + json[i].name + "</option>");
                $("#search_origId").trigger('chosen:updated');
            }
        }
    });
}
function hideImage() {
    $("#divshowImage").hide();

}
function showImagesUrl(url) {
    console.log(url);
    var Url="";
    var urlArray=url.split("_");
    var urlArrays=urlArray[1].split(".");
    Url=urlArray[0]+"."+urlArrays[1];
    $("#showImage").attr("src",Url);
    $("#divshowImage").show();

}
function changedeport() {
    var deport=$("#filter_in_deport").val();
    if(deport=="allDG"){
        $("#filter_contains_groupid").val("DG");
        $("#filter_in_deport").attr("name","");
    }else if(deport=="allJMS"){
        $("#filter_contains_groupid").val("JMS");
        $("#filter_in_deport").attr("name","");
    }else{
        $("#filter_contains_groupid").val("");
        $("#filter_in_deport").attr("name","filter_in_deport");
    }


}
