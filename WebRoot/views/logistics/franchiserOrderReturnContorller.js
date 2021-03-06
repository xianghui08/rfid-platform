var searchUrl = basePath + "/logistics/franchiserOrderReturn/page.do?filter_GTI_status=-1&userId=" + userId;
var autoSelect =false;//是否自动选中
var addDetailgridiRow;//存储iRow
var addDetailgridiCol;//存储iCol
var taskType; //用于判断出入库类型 1入库 0 出库
var wareHouse;
var isCheckWareHouse=false;//是否检测出库仓库
var slaeOrderReturn_customerType;
$(function () {
    /*初始化左侧grig*/
    initSearchGrid();
    initSearchAndEditForm();
    /*初始化右侧grig*/
    initAddGrid();
    initButtonGroup(0);
    initEditFormValid();
    setEditFormVal();
    /*回车监事件*/
    keydown();
    addProduct_keydown();
    input_keydown();
});

/*
 *@param preId id前缀 search/edit 区分回调框id
 **/
function openSearchGuestDialog(preId) {
    dialogOpenPage = "saleOrderReturn";
    prefixId =preId;
    $("#modal_guest_search_table").modal('show').on('shown.bs.modal', function () {
        initGuestSelect_Grid();
    });
    console.log(prefixId);
    $("#searchGuestDialog_buttonGroup").html("" +
        "<button type='button'  class='btn btn-primary' onclick='confirm_selected_GuestId_saleReturn()'>确认</button>"
    );
}
function initSelectDestForm() {
    $.ajax({
        url: basePath + "/unit/list.do?filter_EQI_type=9",
        cache: false,
        async: false,
        type: "POST",
        success: function (data, textStatus) {
            $("#search_destId").empty();
            $("#search_destId").append("<option value=''>--请选择--</option>");
            var json = data;
            for (var i = 0; i < json.length; i++) {
                $("#search_destId").append("<option value='" + json[i].id + "'>" + "[" + json[i].code + "]" + json[i].name + "</option>");
            }
        }
    });
}
function initSelectOrigForm() {
    var searchOrigIdUrl="";
    if (userId == "admin") {
        searchOrigIdUrl=basePath + "/unit/list.do?filter_EQI_type=9";
    } else {
        searchOrigIdUrl=basePath + "/unit/list.do?filter_EQI_type=9&filter_EQS_ownerId=" + curOwnerId;
    }
    $.ajax({
        url: searchOrigIdUrl,
        cache: false,
        async: false,
        type: "POST",
        success: function (data, textStatus) {
            $("#search_origId").empty();
            $("#search_origId").append("<option value=''>--请选择--</option>");
            var json = data;
            for (var i = 0; i < json.length; i++) {
                $("#search_origId").append("<option value='" + json[i].id + "'>" + "[" + json[i].code + "]" + json[i].name + "</option>");
            }
            console.log($("#search_origId").val())
        }
    });
}
function initSelectOrigEditForm() {
    $.ajax({
        url: basePath + "/unit/list.do?filter_EQI_type=9",
        cache: false,
        async: false,
        type: "POST",
        success: function (data, textStatus) {
            $("#edit_origId").empty();
            $("#edit_origId").append("<option value=''>--请选择出库仓库--</option>");
            var json = data;
            for (var i = 0; i < json.length; i++) {
                $("#edit_origId").append("<option value='" + json[i].id + "'>" + "[" + json[i].code + "]" + json[i].name + "</option>");
                $("#edit_origId").selectpicker('refresh');
                $("#edit_origId").val(defaultWarehId);
            }
        }
    });
}

function initSelectDestEditForm() {
    $.ajax({
        url: basePath + "/unit/list.do?filter_EQI_type=9",
        cache: false,
        async: false,
        type: "POST",
        success: function (data, textStatus) {
            $("#edit_destId").empty();
            $("#edit_destId").append("<option value='' style='background-color: #eeeeee'>--请选择入库仓库--</option>");
            var json = data;
            for (var i = 0; i < json.length; i++) {
                $("#edit_destId").append("<option value='" + json[i].id + "'>" + "[" + json[i].code + "]" + json[i].name + "</option>");
                $("#edit_destId").selectpicker('refresh');
            }
        }
    });
}
function initSearchAndEditForm(){
    initSelectDestForm();
    initSelectOrigForm();
    initSelectDestEditForm();
    initSelectOrigEditForm();
    initCustomerTypeForm();
    $(".selectpicker").selectpicker('refresh');
}
function initSearchGrid() {
    $("#grid").jqGrid({
        height: 'auto',
        datatype: 'json',
        url: basePath + "/logistics/franchiserOrderReturn/page.do?filter_GTI_status=-1&userId=" + userId,
        mtype: 'POST',
        colModel: [
            {name: 'billNo', label: "单号", width: 45, sortable: true,hidden:true},
            {name: "status", hidden: true},
            {name: 'outStatus', label: '出库状态', hidden: true},
            {name: 'inStatus', label: '入库状态', hidden: true},
            {name: "ownerId", hidden: true},
            {name: 'billDate', label: '单据日期', width: 30},
            {
                name: '', label: '状态', width: 15, align: "center", sortable: false,
                formatter: function (cellValue, options, rowObject) {
                    var html = "";
                    switch (rowObject.status) {
                        case -1 :
                            html = "<i class='fa fa-undo blue' title='撤销'></i>";
                            break;
                        case 0 :
                            html = "<i class='fa fa-caret-square-o-down blue' title='录入'></i>";
                            break;
                        case 1:
                            html = "<i class='fa fa-check-square-o blue' title='审核'></i>";
                            break;
                        case 2 :
                            html = "<i class='fa fa-archive blue' title='结束'></i>";
                            break;
                        case 3:
                            html = "<i class='fa fa-wrench blue' title='操作中'></i>";
                            break;
                        case 4:
                            html = "<i class='fa fa-paper-plane blue' title='申请撤销'></i>";
                        default:
                            break;
                    }
                    return html;
                }

            },
            {
                name: 'outStatusImg', label: '出库状态', width: 15, align: 'center', sortable: false, hidden: true,
                formatter: function (cellValue, options, rowObject) {
                    if (rowObject.outStatus == 0) {
                        return '<i class="fa fa-tasks blue" title="订单状态"></i>';
                    } else if (rowObject.outStatus == 2) {
                        return '<i class="fa fa-sign-out blue" title="已出库"></i>';
                    } else if (rowObject.outStatus == 3) {
                        return '<i class="fa fa-truck blue" title="出库中"></i>';
                    } else {
                        return '';
                    }
                }
            },
            {
                name: 'inStatusImg', label: '入库状态', width: 15, align: 'center', sortable: false, hidden: true,
                formatter: function (cellValue, options, rowObject) {
                    if (rowObject.inStatus == 0) {
                        return '<i class="fa fa-tasks blue" title="订单状态"></i>';
                    } else if (rowObject.inStatus == 1) {
                        return '<i class="fa fa-sign-in blue" title="已入库"></i>';
                    } else if (rowObject.inStatus == 4) {
                        return '<i class="fa fa-sign-out blue" title="入库中"></i>';
                    } else {
                        return '';
                    }
                }
            },

            {name: 'customerType', label: "客户类型", width: 30, hidden: true},
            {name: 'customerTypeName', label: "客户类型", width: 30, hidden: true},
            {
                label: "客户类型", width: 40, hidden: true,
                formatter: function (cellValue, options, rowObject) {
                    if (rowObject.customerType == "CT-AT")
                        return "省代客户";
                    else if (rowObject.customerType == "CT-ST")
                        return "门店客户";
                    else if (rowObject.customerType == "CT-LS")
                        return "零售客户"
                }
            },
            {name: 'origUnitId', label: '退货客户ID', hidden: true},
            {name: 'origUnitName', label: '退货客户', width: 30, hidden: true},
            {name: 'origId', label: '出库仓库ID', hidden: true},
            {name: 'origName', label: '出库仓库', width: 30},
            {name: 'destId', label: '收货仓库ID', hidden: true},
            {name: 'destName', label: '收货仓库', width: 30},
            {name: 'destUnitId', label: '收货方ID', hidden: true},
            {name: 'destUnitName', label: '收货方', width: 30, hidden: true},
            {name: 'totQty', label: '单据数量', width: 20,align:"center"},
            {name: 'totOutQty', label: '已出库数量', width: 20,align:"center"},
            // {name: 'totOutVal', label: '总出库金额', width: 30},
            {name: 'totInQty', label: '已入库数量', width: 30, hidden: true},
            // {name: 'totInVal', label: '总入库金额', width: 30},
            {name: 'actPrice', label: '应付金额', width: 30,hidden: true,
                formatter: function (cellValue, options, rowObject) {
                    if(cellValue) {
                        var actPrice = cellValue.toFixed(2);
                        return actPrice;
                    }else{
                        return cellValue;
                    }
                }
            },
            {name: 'payPrice', label: '实付金额', width: 30, hidden: true,
                formatter: function (cellValue, options, rowObject) {
                    if(cellValue) {
                        var payPrice = cellValue.toFixed(2);
                        return payPrice;
                    }else{
                        return cellValue;
                    }
                }
            },
            {name: 'srcBillNo', label: '原始单号', hidden: true},
            {name: 'discount', label: '折扣', hidden: true},
            {name: 'busnissId', label: '销售员', hidden: true},
            {name: 'remark', label: '备注', hidden: true},
            {name: 'remark', label: '备注', hidden: true},
            {name: 'preBalance', label: '售前余额', hidden: true},
            {name: 'afterBalance', label: '售后余额', hidden: true},
            {name: 'busnissName', label: '销售员',width: 30,hidden: true},
            {name:'payType',hidden:true},
            {name:'remark',hidden:true}
        ],
        viewrecords: true,
        autowidth: true,
        rownumbers: true,
        altRows: true,
        rowNum: 20,
        rowList: [20, 50, 100],
        pager: "#grid-pager",
        multiselect: false,
        shrinkToFit: true,
        sortname: 'billNo',
        sortorder: 'desc',
        autoScroll: false,
        footerrow: true,
        gridComplete: function () {
            setFooterData();
            if(autoSelect){
                var rowIds = $("#grid").getDataIDs();
                $("#grid").setSelection(rowIds[0]);
                autoSelect =false;
            }
        },
        onSelectRow: function (rowid, status) {
            initDetailData(rowid)
        }
    });
}
function initDetailData(rowid) {
    var rowData = $("#grid").getRowData(rowid);
    $("#editForm").setFromData(rowData);
    slaeOrderReturn_status = rowData.status;
    slaeOrderReturn_customerType = rowData.customerType;
    if (slaeOrderReturn_status != "0" && userId != "admin") {
        $("#edit_origId").attr('disabled', true);
        $("#edit_destId").attr('disabled', true);
        $("#edit_billDate").attr('readOnly', true);
    } else {
        $("#edit_origId").removeAttr('disabled');
        $("#edit_destId").removeAttr('disabled');
        $("#edit_billDate").removeAttr('readOnly');
    }
    if (userId == "admin") {
        $("#edit_guest_button").removeAttr("disabled");
    }
    $(".selectpicker").selectpicker('refresh');
    $('#addDetailgrid').jqGrid("clearGridData");
    $('#addDetailgrid').jqGrid('GridUnload');
    initeditGrid(rowData.billNo);
    $("#SRDtl_wareHouseOut").attr({"disabled": "disabled"});
    initButtonGroup(slaeOrderReturn_status);
}
function initeditGrid(billId) {
    var billNo = billId;
    $("#addDetailgrid").jqGrid({
        height: "auto",
        datatype: "json",
        url: basePath + "/logistics/saleOrderReturn/returnDetails.do?billNo=" + billNo,
        colModel: [
            {name: 'id', label: 'id', hidden: true},
            {name: 'billId', label: 'billId', hidden: true},
            {name: 'billNo', label: 'billNo', hidden: true},
            {name: 'status', hidden: true},
            {name: 'inStatus', hidden: true},
            {name: 'outStatus', hidden: true},
            {
                name: "operation", label: '操作', width: 30, align: 'center', sortable: false,
                formatter: function (cellValue, options, rowObject) {
                    return "<a href='javascript:void(0);' onclick=saveItem('" + options.rowId + ")'><i class='ace-icon ace-icon fa fa-save' title='保存'></i></a>"
                        + "<a href='javascript:void(0);' style='margin-left: 20px'  onclick=deleteRow('" + options.rowId + "')><i class='ace-icon fa fa-trash-o red' title='删除'></i></a>";
                }
            },
            {
                label: '状态', width: 20, hidden: true, sortable: false,
                formatter: function (cellValue, options, rowObject) {
                    return '<i class="ace-icon fa fa-tasks blue"></i>'
                }
            },
            {
                name: 'inStatusImg', label: '入库状态', width: 30, align: 'center', sortable: false,
                formatter: function (cellValue, options, rowObject) {
                    if (rowObject.inStatus == 0) {
                        return '<i class="fa fa-tasks blue" title="订单状态"></i>';
                    } else if (rowObject.inStatus == 1) {
                        return '<i class="fa fa-sign-in blue" title="已入库"></i>';
                    } else if (rowObject.inStatus == 4) {
                        return '<i class="fa fa-truck blue" title="入库中"></i>';
                    } else {
                        return '';
                    }
                }
            },
            {
                name: 'outStatusImg', label: '出库状态', width: 30, align: 'center', sortable: false,
                formatter: function (cellValue, options, rowObject) {
                    if (rowObject.outStatus == 0) {
                        return '<i class="fa fa-tasks blue" title="订单状态"></i>';
                    } else if (rowObject.outStatus == 2) {
                        return '<i class="fa fa-sign-out blue" title="已出库"></i>';
                    } else if (rowObject.outStatus == 3) {
                        return '<i class="fa fa-truck blue" title="出库中"></i>';
                    } else {
                        return '';
                    }
                }
            },
            {name: 'styleId', label: '款号', width: 40},
            {name: 'styleName', label: '款式', width: 40},
            {name: 'colorId', label: '色号', width: 40},
            {name: 'colorName', label: '颜色', width: 30},
            {name: 'sizeId', label: '尺码', width: 30},
            {name: 'sizeName', label: '尺寸', width: 40},
            {
                name: 'qty', label: '数量', width: 40, editable: true,
                editrules: {
                    number: true,
                    minValue: 1
                }
            },
            {name: 'outQty', label: '已出库数量', width: 40},
            {name: 'inQty', label: '已入库数量', width: 40},
            {name: 'sku', label: 'sku', width: 50},
            {
                name: 'price', label: '成交价格', width: 40,
                formatter: function (cellValue, options, rowObject) {
                    var price = parseFloat(cellValue).toFixed(2);
                    return price;
                }
            },
            {
                name: 'tagPrice', label: '吊牌价格', width: 40,
                formatter: function (cellValue, options, rowObject) {
                    var tagPrice = parseFloat(cellValue).toFixed(2);
                    return tagPrice;
                }
            },
            {
                name: 'totPrice', label: '销售金额', width: 40,hidden:true,
                formatter: function (cellValue, options, rowObject) {
                    var totPrice = parseFloat(cellValue).toFixed(2);
                    return totPrice;
                }
            },
            {name: 'discount', label: '折扣', width: 40, editable: true,hidden:true},
            {
                name: 'actPrice', label: '实际价格', editable: true, width: 40,hidden:true,
                editrules: {
                    number: true
                },
                formatter: function (cellValue, options, rowObject) {
                    var actPrice = parseFloat(cellValue).toFixed(2);
                    return actPrice;
                }
            },
            {
                name: 'totActPrice', label: '实际金额', width: 40,hidden:true,
                formatter: function (cellValue, options, rowObject) {
                    var totActPrice = parseFloat(cellValue).toFixed(2);
                    return totActPrice;
                }
            },
            {name: 'uniqueCodes', label: '唯一码', hidden: true},
            {
                name: '', label: '唯一码明细', width: 40, align: "center",
                formatter: function (cellValue, options, rowObject) {
                    return "<a href='javascript:void(0);' onclick=showCodesDetail('" + rowObject.uniqueCodes + "')><i class='ace-icon ace-icon fa fa-list' title='显示唯一码明细'></i></a>";
                }
            },
            {name: 'stylePriceMap', label: '价格表', hidden: true}
        ],
        autowidth: true,
        rownumbers: true,
        altRows: true,
        rowNum: -1,
        pager: '#addDetailgrid-pager',
        multiselect: false,
        shrinkToFit: true,
        sortname: 'id',
        sortorder: "asc",
        footerrow: true,
        cellEdit: true,
        cellsubmit: 'clientArray',
        // onSelectRow: function (rowId, status) {/logistics/monthAccountStatement
        //     if (pageType != "edit") {
        //         if (editDtailRowId != null) {
        //             saveItem(editDtailRowId);
        //         }
        //         editDtailRowId = rowId;
        //         $('#addDetailgrid').editRow(rowId);
        //     }
        // },

        afterEditCell: function (rowid, celname, value, iRow, iCol) {
            addDetailgridiRow = iRow;
            addDetailgridiCol = iCol;
        },
        afterSaveCell: function (rowid, cellname, value, iRow, iCol) {
            if (cellname === "discount") {
                var var_actPrice = Math.round(value * $('#addDetailgrid').getCell(rowid, "price")) / 100;
                var var_totActPrice = -Math.abs(Math.round(var_actPrice * $('#addDetailgrid').getCell(rowid, "qty") * 100) / 100);
                $('#addDetailgrid').setCell(rowid, "actPrice", var_actPrice);
                $('#addDetailgrid').setCell(rowid, "totActPrice", var_totActPrice);
            } else if (cellname === "actPrice") {
                var var_discount = Math.round(value / $('#addDetailgrid').getCell(rowid, "price") * 100);
                var var_totActPrice = -Math.abs(Math.round(value * $('#addDetailgrid').getCell(rowid, "qty") * 100) / 100);
                $('#addDetailgrid').setCell(rowid, "discount", var_discount);
                $('#addDetailgrid').setCell(rowid, "totActPrice", var_totActPrice);
            }
            else if (cellname === "qty") {
                $('#addDetailgrid').setCell(rowid, "totPrice", -Math.abs(Math.round($('#addDetailgrid').getCell(rowid, "price") * value * 100) / 100));
                $('#addDetailgrid').setCell(rowid, "totActPrice", -Math.abs(Math.round($('#addDetailgrid').getCell(rowid, "actPrice") * value * 100) / 100));
            }
            setAddFooterData();
        },
        gridComplete: function () {
            setAddFooterData();
        },
        loadComplete: function () {
            initAllCodesList();
        }
    });

    if (pageType === "edit" && $("#edit_status").val() !== "0" || $("#edit_srcBillNo").val() !== "") {
        $("#addDetailgrid").setGridParam().hideCol("operation");
    } else {
        $("#addDetailgrid").setGridParam().showCol("operation");
        $("#addDetailgrid").jqGrid('navGrid', "#addDetailgrid-pager",
            {
                edit: false,
                add: true,
                addicon: "ace-icon fa fa-plus",
                addfunc: function () {
                    addDetail();
                },
                del: false,
                search: false,
                refresh: false,
                view: false
            });
    }
    $("#addDetailgrid-pager_center").html("");
}

function setFooterData() {
    var sum_totQty = $("#grid").getCol('totQty', false, 'sum');
    var sum_actPrice = $("#grid").getCol('actPrice', false, 'sum');
    var sum_totOutQty = $("#grid").getCol('totOutQty', false, 'sum');
    $("#grid").footerData('set', {
        billDate: "合计",
        totQty: sum_totQty,
        actPrice: sum_actPrice,
        totOutQty: sum_totOutQty
    });
}

function initAllCodesList() {
    allCodeStrInDtl = "";
    $.each($("#addDetailgrid").getDataIDs(), function (index, value) {
        var rowData = $("#addDetailgrid").getRowData(value);
        allCodeStrInDtl = allCodeStrInDtl + "," + rowData.uniqueCodes;
    });
    if (allCodeStrInDtl !== "") {
        if (allCodeStrInDtl.substr(0, 1) === ",") {
            allCodeStrInDtl = allCodeStrInDtl.substr(1);
        }
    }
}

/**
 * 查询左侧表格内容
 * */
function _search() {
    var serializeArray = $("#searchForm").serializeArray();
    var params = array2obj(serializeArray);
    $("#grid").jqGrid('setGridParam', {
        page: 1,
        url: searchUrl,
        postData: params
    });
    $("#grid").trigger("reloadGrid");
}

function _resetForm() {
    $("#searchForm").clearForm();
    $("#search_destId").val();
    $("#search_origId").val();
    $("#filter_INI_outStatus").val();
    $("#filter_INI_inStatus").val();
    $(".selectpicker").selectpicker('refresh');
}


function initCustomerTypeForm() {
    $.ajax({
        url: basePath + "/sys/property/searchByType.do?type=CT",
        cache: false,
        async: false,
        type: "POST",
        success: function (data, textStatus) {
            $("#edit_customerType").empty();
            $("#edit_customerType").append("<option value=''>--请选择--</option>");
            var json = data;
            for (var i = 0; i < json.length; i++) {
                $("#edit_customerType").append("<option value='" + json[i].id + "'>" + "[" + json[i].code + "]" + json[i].name + "</option>");
            }
            if (defalutCustomerId != "" && defalutCustomerId != undefined) {
                $("#edit_customerType").selectpicker('val', "CT-ST");
            }
        }
    });
}

/*根据权限初始化按钮*/
function initButtonGroup(billStatus) {
    $("#buttonGroup").html("" +
        "<button id='SRDtl_add' type='button' style='margin: 8px' class='btn btn-xs btn-primary' onclick='addNew()'>" +
        "    <i class='ace-icon fa fa-plus'></i>" +
        "    <span class='bigger-110'>新增</span>" +
        "</button>" +
        "<button id='SRDtl_cancel' type='button' style='margin: 8px' class='btn btn-xs btn-primary' onclick='cancel()'>" +
        "    <i class='ace-icon fa fa-undo'></i>" +
        "    <span class='bigger-110'>撤销</span>" +
        "</button>" +
        "<button id='SRDtl_save' type='button' style='margin: 8px'  class='btn btn-xs btn-primary' onclick='save()'>" +
        "    <i class='ace-icon fa fa-save'></i>" +
        "    <span class='bigger-110'>保存</span>" +
        "</button>" +
        "<button id='SRDtl_addUniqCode' type='button' style='margin: 8px'  class='btn btn-xs btn-primary' onclick='addUniqCode()'>" +
        "    <i class='ace-icon fa fa-barcode'></i>" +
        "    <span class='bigger-110'>扫码</span>" +
        "</button>" +
        "<button id='SRDtl_wareHouseOut' type='button' style='margin: 8px'  class='btn btn-xs btn-primary' onclick='wareHouseInOut(" + "\"out\"" + ")'>" +
        "    <i class='ace-icon fa fa-sign-out'></i>" +
        "    <span class='bigger-110'>出库</span>" +
        "</button>"
    );
    loadingButtonDivTable(billStatus);
    if ($("#edit_origId").val() && $("#edit_origId").val() !== null && $("#edit_origId").val() !== "") {
        $("#SRDtl_wareHouseIn").show();
        $("#SRDtl_wareHouseIn_noOutHouse").hide();
    } else {
        $("#SRDtl_wareHouseIn").hide();
        $("#SRDtl_wareHouseIn_noOutHouse").show();
    }
}

/**
 * 动态配置按钮,div,表格列字段
 * */
function loadingButtonDivTable(billStatus) {
    var privilegeMap = ButtonAndDivPower(resourcePrivilege);
    $.each(privilegeMap['table'],function(index,value){
        if(value.isShow!=0) {
            $('#addDetailgrid').setGridParam().hideCol(value.privilegeId);
        }
    });
    var disableButtonIds = "";
    switch (billStatus){
        case "-1" :
            disableButtonIds = ["SRDtl_wareHouseOut","SRDtl_save","SRDtl_addUniqCode","SRDtl_cancel"];
            break;
        case "0" :
            disableButtonIds = ["SRDtl_wareHouseOut"];
            break;
        case "1":
            disableButtonIds = ["SRDtl_save","SRDtl_addUniqCode","SRDtl_cancel"];
            break;
        case "2" :
            disableButtonIds = ["SRDtl_wareHouseOut","SRDtl_save","SRDtl_addUniqCode","SRDtl_cancel"];
            break;
        case "3":
            disableButtonIds = ["SRDtl_wareHouseOut","SRDtl_save","SRDtl_addUniqCode","SRDtl_cancel"];
            break;
        default:
            disableButtonIds = [];
    }
    //根据单据状态disable按钮
    $.each(privilegeMap['button'],function(index,value){
        if($.inArray(value.privilegeId,disableButtonIds)!= -1){
            $("#"+value.privilegeId).attr({"disabled": "disabled"});
        }else{
            $("#"+value.privilegeId).removeAttr("disabled");
        }
    });
}

function initAddGrid() {
    $("#addDetailgrid").jqGrid({
        height: "auto",
        datatype: "local",
        //url: basePath + "/logistics/saleOrderReturn/returnDetails.do?billNo=" + billNo,
        colModel: [
            {name: 'id', label: 'id', hidden: true},
            {name: 'billId', label: 'billId', hidden: true},
            {name: 'billNo', label: 'billNo', hidden: true},
            {name: 'status', hidden: true},
            {name: 'inStatus', hidden: true},
            {name: 'outStatus', hidden: true},
            {
                name: "operation", label: '操作', width: 30, align: 'center', sortable: false,
                formatter: function (cellValue, options, rowObject) {
                    return "<a href='javascript:void(0);' onclick=saveItem('" + options.rowId + ")'><i class='ace-icon ace-icon fa fa-save' title='保存'></i></a>"
                        + "<a href='javascript:void(0);' style='margin-left: 20px'  onclick=deleteRow('" + options.rowId + "')><i class='ace-icon fa fa-trash-o red' title='删除'></i></a>";
                }
            },
            {
                label: '状态', width: 20, hidden: true, sortable: false,
                formatter: function (cellValue, options, rowObject) {
                    return '<i class="ace-icon fa fa-tasks blue"></i>'
                }
            },
            {
                name: 'inStatusImg', label: '入库状态', width: 30, align: 'center', sortable: false,
                formatter: function (cellValue, options, rowObject) {
                    if (rowObject.inStatus == 0) {
                        return '<i class="fa fa-tasks blue" title="订单状态"></i>';
                    } else if (rowObject.inStatus == 1) {
                        return '<i class="fa fa-sign-in blue" title="已入库"></i>';
                    } else if (rowObject.inStatus == 4) {
                        return '<i class="fa fa-truck blue" title="入库中"></i>';
                    } else {
                        return '';
                    }
                }
            },
            {
                name: 'outStatusImg', label: '出库状态', width: 30, align: 'center', sortable: false,
                formatter: function (cellValue, options, rowObject) {
                    if (rowObject.outStatus == 0) {
                        return '<i class="fa fa-tasks blue" title="订单状态"></i>';
                    } else if (rowObject.outStatus == 2) {
                        return '<i class="fa fa-sign-out blue" title="已出库"></i>';
                    } else if (rowObject.outStatus == 3) {
                        return '<i class="fa fa-truck blue" title="出库中"></i>';
                    } else {
                        return '';
                    }
                }
            },

            {name: 'styleId', label: '款号', width: 20,hidden: true},
            {name: 'colorId', label: '色码', width: 20,hidden: true},
            {name: 'sizeId', label: '尺码', width: 20,hidden: true},
            {name: 'styleName', label: '款名', width: 20},
            {name: 'colorName', label: '颜色', width: 20,hidden: true},
            {name: 'sizeName', label: '尺码', width: 20,hidden: true},
            {
                name: 'qty', label: '数量', width: 40, editable: true,
                editrules: {
                    number: true,
                    minValue: 1
                }
            },
            {name: 'outQty', label: '已出库数量', width: 40},
            {name: 'inQty', label: '已入库数量', width: 40},
            {name: 'sku', label: 'sku', width: 50},
            {
                name: 'price', label: '销售价格', width: 40,
                formatter: function (cellValue, options, rowObject) {
                    var price = parseFloat(cellValue).toFixed(2);
                    return price;
                }
            },
            {
                name: 'totPrice', label: '销售金额', width: 40,
                formatter: function (cellValue, options, rowObject) {
                    var totPrice = parseFloat(cellValue).toFixed(2);
                    return totPrice;
                }
            },
            {name: 'discount', label: '折扣', width: 40, editable: true,},
            {
                name: 'actPrice', label: '实际价格', editable: true, width: 40,
                editrules: {
                    number: true
                },
                formatter: function (cellValue, options, rowObject) {
                    var actPrice = parseFloat(cellValue).toFixed(2);
                    return actPrice;
                }
            },
            {
                name: 'totActPrice', label: '实际金额', width: 40,
                formatter: function (cellValue, options, rowObject) {
                    var totActPrice = parseFloat(cellValue).toFixed(2);
                    return totActPrice;
                }
            },
            {name: 'uniqueCodes', label: '唯一码', hidden: true},
            {
                name: '', label: '唯一码明细', width: 40, align: "center",
                formatter: function (cellValue, options, rowObject) {
                    return "<a href='javascript:void(0);' onclick=showCodesDetail('" + rowObject.uniqueCodes + "')><i class='ace-icon ace-icon fa fa-list' title='显示唯一码明细'></i></a>";
                }
            },
            {name: 'stylePriceMap', label: '价格表', hidden: true}
        ],
        autowidth: true,
        rownumbers: true,
        altRows: true,
        rowNum: -1,
        pager: '#addDetailgrid-pager',
        multiselect: false,
        shrinkToFit: true,
        sortname: 'id',
        sortorder: "asc",
        footerrow: true,
        cellEdit: true,
        cellsubmit: 'clientArray',
        afterEditCell: function (rowid, celname, value, iRow, iCol) {
            addDetailgridiRow = iRow;
            addDetailgridiCol = iCol;
        },
        afterSaveCell: function (rowid, cellname, value, iRow, iCol) {
            if (cellname === "discount") {
                var var_actPrice = Math.round(value * $('#addDetailgrid').getCell(rowid, "price")) / 100;
                var var_totActPrice = -Math.abs(Math.round(var_actPrice * $('#addDetailgrid').getCell(rowid, "qty") * 100) / 100);
                $('#addDetailgrid').setCell(rowid, "actPrice", var_actPrice);
                $('#addDetailgrid').setCell(rowid, "totActPrice", var_totActPrice);
            } else if (cellname === "actPrice") {
                var var_discount = Math.round(value / $('#addDetailgrid').getCell(rowid, "price") * 100);
                var var_totActPrice = -Math.abs(Math.round(value * $('#addDetailgrid').getCell(rowid, "qty") * 100) / 100);
                $('#addDetailgrid').setCell(rowid, "discount", var_discount);
                $('#addDetailgrid').setCell(rowid, "totActPrice", var_totActPrice);
            }
            else if (cellname === "qty") {
                $('#addDetailgrid').setCell(rowid, "totPrice", -Math.abs(Math.round($('#addDetailgrid').getCell(rowid, "price") * value * 100) / 100));
                $('#addDetailgrid').setCell(rowid, "totActPrice", -Math.abs(Math.round($('#addDetailgrid').getCell(rowid, "actPrice") * value * 100) / 100));
            }
            setAddFooterData();
        },
        gridComplete: function () {
            setAddFooterData();
        },
        loadComplete: function () {
            initAllCodesList();
        }
    });

    $("#addDetailgrid").setGridParam().showCol("operation");
    $("#addDetailgrid").jqGrid('navGrid', "#addDetailgrid-pager",
        {
            edit: false,
            add: true,
            addicon: "ace-icon fa fa-plus",
            addfunc: function () {
                addDetail();
            },
            del: false,
            search: false,
            refresh: false,
            view: false
        });
    $("#addDetailgrid-pager_center").html("");
}

function edit_discount_onblur() {
    setDiscount();
}

//将整单折扣设置到明细中
function setDiscount() {

    if (addDetailgridiRow != null && addDetailgridiCol != null) {
        $("#addDetailgrid").saveCell(addDetailgridiRow, addDetailgridiCol);
        addDetailgridiRow = null;
        addDetailgridiCol = null;
    }
    var discount = $("#edit_discount").val();
    if (discount && discount != null && discount != "") {
        $.each($("#addDetailgrid").getDataIDs(), function (index, value) {
            $('#addDetailgrid').setCell(value, "discount", discount);
            var var_actPrice = Math.round(discount * $('#addDetailgrid').getCell(value, "price")) / 100;
            var var_totActPrice = -Math.abs(Math.round(var_actPrice * $('#addDetailgrid').getCell(value, "qty") * 100) / 100);
            $('#addDetailgrid').setCell(value, "actPrice", var_actPrice);
            $('#addDetailgrid').setCell(value, "totActPrice", var_totActPrice);
        });
    }
    setAddFooterData();
}

function save() {
    cs.showProgressBar();
    $("#edit_customerType").removeAttr('disabled');
    $("#edit_origId").removeAttr('disabled');
    $("#edit_destId").removeAttr('disabled');
    $("#edit_billDate").val(updateTime($("#edit_billDate").val()));
    if ($("#edit_origId").val() == $("#edit_destId").val()) {
        bootbox.alert("不能在相同的单位之间做销售退货");
        cs.closeProgressBar();
        return;
    }

    if (pageType == "edit") {
        if (slaeOrderReturn_customerType != $("#edit_customerType").val()) {
            bootbox.alert("客户类型不相同");
            cs.closeProgressBar();
            return;
        }
    }

    $("#editForm").data('bootstrapValidator').destroy();
    $('#editForm').data('bootstrapValidator', null);
    initEditFormValid();
    $('#editForm').data('bootstrapValidator').validate();
    if (!$('#editForm').data('bootstrapValidator').isValid()) {
        cs.closeProgressBar();
        return;
    }

    if ($("#addDetailgrid").getDataIDs().length == 0) {
        bootbox.alert("请添加退货商品");
        cs.closeProgressBar();
        return;
    }

    if (addDetailgridiRow != null && addDetailgridiCol != null) {
        $("#addDetailgrid").saveCell(addDetailgridiRow, addDetailgridiCol);
        addDetailgridiRow = null;
        addDetailgridiCol = null;
    }
    /*$("#edit_origName").val($("#edit_origId").find("option:selected").text());*/
    var purchaseReturnBill = JSON.stringify(array2obj($("#editForm").serializeArray()));
    var dtlArray = [];
    $.each($("#addDetailgrid").getDataIDs(), function (index, value) {
        var rowData = $("#addDetailgrid").getRowData(value);
        dtlArray.push(rowData);
    });

    //将客户传回去

    $.ajax({
        dataType: "json",
        async: true,
        url: basePath + "/logistics/saleOrderReturn/save.do",
        data: {
            'bill': purchaseReturnBill,
            'strDtlList': JSON.stringify(dtlArray),
            userId: 'CJM001'
        },
        type: "POST",
        success: function (msg) {
            cs.closeProgressBar();
            if (msg.success) {
                $.gritter.add({
                    text: msg.msg,
                    class_name: 'gritter-success  gritter-light'
                });
                $("#search_billNo").val(msg.result);
                billNo = msg.result;

                $("#addDetailgrid").jqGrid('setGridParam', {
                    page: 1,
                    url: basePath + "/logistics/saleOrderReturn/returnDetails.do?billNo=" + msg.result,
                });
                $("#addDetailgrid").trigger("reloadGrid");
                _search()
            } else {
                bootbox.alert(msg.msg);
            }
        }
    });

}

function initEditFormValid() {
    $('#editForm').bootstrapValidator({
        message: '输入值无效',
        excluded: [':disabled'],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        submitHandler: function (validator, form, submitButton) {
            $.post(form.attr('action'), form.serialize(), function (result) {
                if (result.success == true || result.success == 'true') {

                } else {


                    // Enable the submit buttons
                    $('#editForm').bootstrapValidator('disableSubmitButtons', false);
                }
            }, 'json');
        },
        fields: {
            destUnitId: {
                validators: {
                    notEmpty: {
                        message: "供应商不能为空"
                    }
                }
            },
            destId: {
                validators: {
                    notEmpty: {
                        message: "收货仓库不能为空"
                    }
                }
            },
            customerId: {
                validators: {
                    notEmpty: {
                        message: '客户不能为空'
                    }
                }
            },
            billType: {
                validators: {
                    notEmpty: {
                        message: "请填写退货类型"
                    }
                }
            },
            billDate: {
                validators: {
                    notEmpty: {
                        message: '请选择单据日期'
                    }
                }
            },
            discount: {
                validators: {
                    numeric: {
                        message: '折扣只能只能为0-100之间的数字'
                    },
                    callback: {
                        message: '折扣只能只能为0-100之间的数字',
                        callback: function (value, validator) {
                            if (parseInt(value) < 0 || parseInt(value) > 100) {
                                return false;
                            }
                            return true;
                        }
                    }
                }
            }
        }
    });

}

/*添加订货商品*/
function addDetail() {

    var ct = $("#edit_customerType").val();
    if (ct && ct != null) {
        $("#modal-addDetail-table").modal('show').on('hidden.bs.modal', function () {
            $("#StyleSearchForm").resetForm();
            $("#stylegrid").clearGridData();
            $("#color_size_grid").clearGridData();
        });
        initStyleGridColumn(ct);
        $ ("#stylegrid").setGridParam().hideCol("wsPrice");
    } else {
        bootbox.alert("请选择客户！");
    }
}

/*选中订货商品添加*/
function addProductInfo(status) {

    if (addDetailgridiRow != null && addDetailgridiCol != null) {
        $("#addDetailgrid").saveCell(addDetailgridiRow, addDetailgridiCol);
        addDetailgridiRow = null;
        addDetailgridiCol = null;
    }

    var addProductInfo = [];
    if (editcolosizeRow != null) {

        $('#color_size_grid').saveRow(editcolosizeRow, false, 'clientArray');//仅保存数据到grid中，而不会发送ajax请求服务器
    }
    var ct = $("#edit_customerType").val();
    var styleRow = $("#stylegrid").getRowData($("#stylegrid").jqGrid("getGridParam", "selrow"));
    $.each($("#color_size_grid").getDataIDs(), function (index, value) {

        var productInfo = $("#color_size_grid").getRowData(value);
        if (productInfo.qty > 0) {

            if (ct == "CT-AT") {//省代价格
                productInfo.price = styleRow.puPrice;
            } else if (ct == "CT-ST") {//门店价格
                productInfo.price = styleRow.wsPrice;
            } else if (ct == "CT-LS") {//吊牌价格
                productInfo.price = styleRow.price;
            }
            productInfo.outQty = 0;
            productInfo.inQty = 0;
            productInfo.status = 0;
            productInfo.inStatus = 0;
            productInfo.outStatus = 0;
            if ($("#edit_discount").val() && $("#edit_discount").val() !== null) {
                productInfo.discount = $("#edit_discount").val();
            } else {
                productInfo.discount = 100;
            }
            productInfo.actPrice = Math.round(productInfo.price * productInfo.discount) / 100;
            productInfo.totPrice = productInfo.qty * productInfo.price;
            productInfo.totActPrice = productInfo.qty * productInfo.actPrice;
            productInfo.sku = productInfo.code;
            productInfo.inStockType = styleRow.class6;
            addProductInfo.push(productInfo);
        }
    });

    jQuery("#color_size_grid").trigger("reloadGrid");  //清空数据重新加载

    var isAdd = true;
    $.each(addProductInfo, function (index, value) {
        isAdd = true;
        $.each($("#addDetailgrid").getDataIDs(), function (dtlndex, dtlValue) {
            var dtlRow = $("#addDetailgrid").getRowData(dtlValue);
            if (value.code === dtlRow.sku) {
                dtlRow.qty = parseInt(dtlRow.qty) + parseInt(value.qty);
                dtlRow.totPrice = dtlRow.qty * dtlRow.price;
                dtlRow.totActPrice = dtlRow.qty * dtlRow.actPrice;
                if (dtlRow.id) {
                    $("#addDetailgrid").setRowData(dtlRow.id, dtlRow);
                } else {
                    $("#addDetailgrid").setRowData(dtlndex, dtlRow);
                }
                isAdd = false;
            }
        });
        if (isAdd) {
            $("#addDetailgrid").addRowData($("#addDetailgrid").getDataIDs().length, value);
        }
    });
    if (status) {
        $("#modal-addDetail-table").modal('hide');
    }
    setAddFooterData();

}

function setAddFooterData() {

    var sum_qty = $("#addDetailgrid").getCol('qty', false, 'sum');
    var sum_outQty = $("#addDetailgrid").getCol('outQty', false, 'sum');
    var sum_inQty = $("#addDetailgrid").getCol('inQty', false, 'sum');
    var sum_totPrice = $("#addDetailgrid").getCol('totPrice', false, 'sum');
    var sum_totActPrice = Math.round($("#addDetailgrid").getCol('totActPrice', false, 'sum'));
    var sum_tagPrice = $("#addDetailgrid").getCol('tagPrice', false, 'sum');
    $("#edit_actPrice").val(sum_totActPrice);
    $("#addDetailgrid").footerData('set', {
        styleId: "合计",
        qty: sum_qty,
        outQty: sum_outQty,
        inQty: sum_inQty,
        tagPrice:-Math.abs(sum_tagPrice),
        totPrice: -Math.abs(sum_totPrice),
        totActPrice: -Math.abs(sum_totActPrice)
    });
}

function setEditFormVal() {
    $("#edit_billDate").val(getToDay("yyyy-MM-dd"));
    $("#edit_discount").val(defalutCustomerdiscount);
    $("#edit_outStatus").val(0);
    $("#edit_inStatus").val(0);
    $("#edit_status").val(0);
    $("#edit_payPrice").val(0);
    $("#edit_actPrice").val(0);
    $("#edit_destId").selectpicker('val', "AUTO_WH008");
    $("#edit_pre_Balance").val((0 - defalutCustomerowingValue).toFixed(2));
    $("#SRDtl_wareHouseOut").attr({"disabled": "disabled"});
    $("#edit_origUnitId").val(curOwnerId);
    $("#edit_origUnitName").val(name);
    $("#edit_customerType").selectpicker('val', "CT-ST");
}

//扫码
function addUniqCode() {
    var ct = $("#edit_customerType").val();

    if (ct && ct != null) {

        inOntWareHouseValid = 'addPage_scanUniqueCode';
        billNo = $("#edit_billNo").val();
        if ($("#edit_origId").val() && $("#edit_origId").val() !== null) {
            taskType = 0; //出库
            wareHouse = $("#edit_origId").val();
            isCheckWareHouse=true;
        } else if (($("#edit_destId").val() && $("#edit_destId").val() !== null)) {
            taskType = -1; //没有出库仓库时，直接入库。入库类型等于 -1 表明校验时不需要该参数
            wareHouse = $("#edit_destId").val();
        } else {
            $.gritter.add({
                text: "请选择入库仓库",
                class_name: 'gritter-success  gritter-light'
            });
            return
        }

        $("#dialog_buttonGroup").html("" +
            "<button type='button' id='so_savecode_button' class='btn btn-primary' onclick='addProductsOnCode()'>保存</button>"
        );
        $("#add-uniqCode-dialog").modal('show').on('hidden.bs.modal', function () {
            $("#uniqueCodeGrid").clearGridData();
        });
        var priceType = "price";
        initUniqeCodeGridColumn(priceType);
        $("#codeQty").text(0);
    } else {
        bootbox.alert("请选择客户！");
    }
    allCodes = "";
}

function addProductsOnCode() {
    if (!$('#so_savecode_button').prop('disabled')) {
        $("#so_savecode_button").attr({"disabled": "disabled"});
        var productListInfo = [];
        var ct = $("#edit_customerType").val();
        $.each($("#uniqueCodeGrid").getDataIDs(), function (index, value) {
            var productInfo = $("#uniqueCodeGrid").getRowData(value);
            if(productInfo.code!=""&&productInfo.code!=undefined){
                productInfo.qty = 1;
                productInfo.price = productInfo.price;
                productInfo.outQty = 0;
                productInfo.inQty = 0;
                productInfo.status = 0;
                productInfo.inStatus = 0;
                productInfo.outStatus = 0;
                if ($("#edit_discount").val() && $("#edit_discount").val() !== null) {
                    productInfo.discount = $("#edit_discount").val();
                } else {
                    productInfo.discount = 100;
                }
                productInfo.uniqueCodes = productInfo.code;
                productInfo.totPrice = -Math.abs(productInfo.price);
                productInfo.actPrice = Math.round(productInfo.price * productInfo.discount) / 100;
                productInfo.totActPrice = -Math.abs(productInfo.actPrice);
                productListInfo.push(productInfo);
            }
        });
        if (productListInfo.length == 0) {
            bootbox.alert("请添加唯一码");
            return;
        }
        var isAdd = true;
        var alltotActPrice = 0;
        $.each(productListInfo, function (index, value) {
            isAdd = true;
            $.each($("#addDetailgrid").getDataIDs(), function (dtlIndex, dtlValue) {
                var dtlRow = $("#addDetailgrid").getRowData(dtlValue);
                if (value.sku === dtlRow.sku) {
                    if (dtlRow.uniqueCodes.indexOf(value.code) != -1) {
                        isAdd = false;
                        $.gritter.add({
                            text: value.code + "不能重复添加",
                            class_name: 'gritter-success  gritter-light'
                        });
                        return true;
                    }
                    dtlRow.qty = parseInt(dtlRow.qty) + 1;
                    dtlRow.totPrice = -Math.abs(dtlRow.qty * dtlRow.price);
                    dtlRow.totActPrice = -Math.abs(dtlRow.qty * dtlRow.actPrice);
                    alltotActPrice += -Math.abs(dtlRow.qty * dtlRow.actPrice);
                    dtlRow.uniqueCodes = dtlRow.uniqueCodes + "," + value.code;
                    if (dtlRow.id) {
                        $("#addDetailgrid").setRowData(dtlRow.id, dtlRow);
                    } else {
                        $("#addDetailgrid").setRowData(dtlIndex, dtlRow);
                    }
                    isAdd = false;
                }
                console.log(dtlRow.uniqueCodes);
            });
            if (isAdd) {
                $("#addDetailgrid").addRowData($("#addDetailgrid").getDataIDs().length, value);
            }
        });
        $("#so_savecode_button").removeAttr("disabled");
        $("#add-uniqCode-dialog").modal('hide');
        setFooterData();
        saveother(0 - alltotActPrice);
    }
}

function input_keydown() {
    $("#edit_discount").keydown(function (event) {
        if (event.keyCode == 13) {
            setDiscount();
        }
    })
}

function saveother(totActPrice) {
    $("#edit_billDate").val(updateTime($("#edit_billDate").val()));
    cs.showProgressBar();
    $("#edit_customerType").removeAttr('disabled');
    $("#edit_origId").removeAttr('disabled');
    $("#edit_destId").removeAttr('disabled');

    if ($("#edit_origId").val() == $("#edit_destId").val()) {
        bootbox.alert("不能在相同的单位之间做销售退货");
        cs.closeProgressBar();
        return;
    }

    $("#editForm").data('bootstrapValidator').destroy();
    $('#editForm').data('bootstrapValidator', null);
    initEditFormValid();
    $('#editForm').data('bootstrapValidator').validate();
    if (!$('#editForm').data('bootstrapValidator').isValid()) {
        cs.closeProgressBar();
        return;
    }
    if (pageType == "edit") {
        if (slaeOrderReturn_customerType != $("#edit_customerType").val()) {
            bootbox.alert("客户类型不相同");
            cs.closeProgressBar();
            return;
        }
    }

    if (addDetailgridiRow != null && addDetailgridiCol != null) {
        $("#addDetailgrid").saveCell(addDetailgridiRow, addDetailgridiCol);
        addDetailgridiRow = null;
        addDetailgridiCol = null;
    }
//实收金额的计算
    var payPrice = $("#edit_payPrice").val();
    if (parseFloat(payPrice) < 0) {
        var summun = parseFloat(payPrice) - parseFloat(totActPrice);
        if (summun < 0) {
            $("#edit_payPrice").val(summun.toFixed(2));
        }
    }
    var actPrice = parseFloat($("#edit_actPrice").val());
    var payPrice = parseFloat($("#edit_payPrice").val());
    var preBalance = parseFloat($("#edit_pre_Balance").val());
    var afterBalance = parseFloat(preBalance + payPrice - actPrice).toFixed(2);
    $("#edit_after_Balance").val(afterBalance);
    var purchaseReturnBill = JSON.stringify(array2obj($("#editForm").serializeArray()));
    var dtlArray = [];
    $.each($("#addDetailgrid").getDataIDs(), function (index, value) {
        var rowData = $("#addDetailgrid").getRowData(value);
        dtlArray.push(rowData);
    });
    $.ajax({
        dataType: "json",
        // async: false,
        url: basePath + "/logistics/saleOrderReturn/save.do",
        data: {
            'bill': purchaseReturnBill,
            'strDtlList': JSON.stringify(dtlArray),
            userId: 'CJM001'
        },
        type: "POST",
        success: function (msg) {
            cs.closeProgressBar();
            if (msg.success) {
                $.gritter.add({
                    text: msg.msg,
                    class_name: 'gritter-success  gritter-light'
                });
                $("#edit_billNo").val(msg.result);
                billNo = msg.result;
                $("#addDetailgrid").jqGrid('setGridParam', {
                    page: 1,
                    url: basePath + "/logistics/saleOrderReturn/returnDetails.do?billNo=" + msg.result,
                });
            } else {
                bootbox.alert(msg.msg);
            }
        }
    });
}

// @param: type     出入库类型，"in"入库；"out"出库
function wareHouseInOut(type) {
    cs.showProgressBar();
    var billNo = $("#edit_billNo").val();
    $("#SRDtl_wareHouseOut").attr({"disabled": "disabled"});
    if (billNo && billNo != null) {
        if (inOutStockCheck(type)) {
            cs.closeProgressBar();
            return;
        }
        var url_ajax;
        var inOutString;
        url_ajax = basePath + "/logistics/saleOrderReturn/convertOut.do";
        inOutString = "出";
        taskType = 0;
        wareHouse = $("#edit_origId").val();
        var allUniqueCodes = "";
        $.each($("#addDetailgrid").getDataIDs(), function (index, value) {
            var rowData = $("#addDetailgrid").getRowData(value);
            allUniqueCodes = allUniqueCodes + "," + rowData.uniqueCodes;
        });
        if (allUniqueCodes.substr(0, 1) == ",") {
            allUniqueCodes = allUniqueCodes.substr(1);
        }
        var uniqueCodes_inHouse;

        $.ajax({
            async: true,
            dataType: "json",
            url: basePath + "/stock/warehStock/checkCodes.do",
            data: {
                warehId: wareHouse,
                codes: allUniqueCodes,
                type: taskType,
                billNo: billNo
            },
            type: "POST",
            success: function (data) {
                uniqueCodes_inHouse = data.result;

                var epcArray = [];
                $.each($("#addDetailgrid").getDataIDs(), function (index, value) {
                    var rowData = $("#addDetailgrid").getRowData(value);
                    var codes = rowData.uniqueCodes.split(",");
                    if (codes && codes != null && codes != "") {
                        $.each(codes, function (index, value) {
                            if (uniqueCodes_inHouse.indexOf(value) != -1) {
                                var epc = {};
                                epc.code = value;
                                epc.styleId = rowData.styleId;
                                epc.sizeId = rowData.sizeId;
                                epc.colorId = rowData.colorId;
                                epc.qty = 1;
                                epc.sku = rowData.sku;
                                epcArray.push(epc)
                            }
                        });
                    }
                });
                if (epcArray.length === 0) {
                    $.gritter.add({
                        text: "没有可以直接" + inOutString + "库的商品",
                        class_name: 'gritter-success  gritter-light'
                    });
                    if (pageType === "edit") {
                        if (type === "out") {
                            edit_wareHouseOut();
                        } else {
                            edit_wareHouseIn_noOutHouse();
                        }
                    }
                    cs.closeProgressBar();
                    if (type === "in") {
                        $("#SRDtl_wareHouseIn_noOutHouse").removeAttr("disabled");
                    } else if (type === "out") {
                        $("#SRDtl_wareHouseOut").removeAttr("disabled");
                    }
                    return;
                }

                var dtlArray = [];
                $.each($("#addDetailgrid").getDataIDs(), function (index, value) {
                    var rowData = $("#addDetailgrid").getRowData(value);
                    dtlArray.push(rowData);
                });

                $.ajax({
                    async: true,
                    dataType: "json",
                    url: url_ajax,
                    data: {
                        billNo: billNo,
                        strEpcList: JSON.stringify(epcArray),
                        strDtlList: JSON.stringify(dtlArray),
                        userId: userId
                    },
                    type: "POST",
                    success: function (msg) {
                        cs.closeProgressBar();
                        if (type === "in") {
                            $("#SRDtl_wareHouseIn_noOutHouse").removeAttr("disabled");
                        } else if (type === "out") {
                            $("#SRDtl_wareHouseOut").removeAttr("disabled");
                        }
                        if (msg.success) {
                            $.gritter.add({
                                text: msg.msg,
                                class_name: 'gritter-success  gritter-light'
                            });
                            $("#modal-addEpc-table").modal('hide');

                            var sum_qty = parseInt($("#addDetailgrid").footerData('get').qty);        //reload前总数量
                            $("#addDetailgrid").jqGrid('setGridParam', {
                                page: 1,
                                url: basePath + "/logistics/saleOrderReturn/returnDetails.do?billNo=" + billNo
                            });
                            $("#addDetailgrid").trigger("reloadGrid");

                            var diff_qty = sum_qty - epcArray.length;
                            if (pageType === "edit") {
                                // $("#addDetailgrid").setColProp('qty',{editable:{value:"True:False"}});
                                // $("#addDetailgrid-pager_left").hide();
                                $("#edit_guest_button").attr({"disabled": "disabled"});
                                $("#SRDtl_save").attr({"disabled": "disabled"});
                                $("#SRDtl_addUniqCode").attr({"disabled": "disabled"});
                                $("#edit_origId").attr('disabled', true);
                                $("#edit_destId").attr('disabled', true);
                                $("#edit_billDate").attr('readOnly', true);
                                if (sum_qty > epcArray.length) {
                                    $.gritter.add({
                                        text: "已" + inOutString + "库数量为：" + epcArray.length + "；剩余数量为：" + diff_qty + "，其余商品请扫码" + inOutString + "库",
                                        class_name: 'gritter-success  gritter-light'
                                    });
                                    if (type === "out") {
                                        edit_wareHouseOut();
                                    } else {
                                        edit_wareHouseIn_noOutHouse();
                                    }
                                } else if (sum_qty === epcArray.length) {
                                    $.gritter.add({
                                        text: "共" + epcArray.length + "件商品，已全部" + inOutString + "库",
                                        class_name: 'gritter-success  gritter-light'
                                    });
                                }
                            } else if (pageType === "add") {
                                var alertMessage;
                                if (sum_qty > epcArray.length) {
                                    alertMessage = "已" + inOutString + "库数量为：" + epcArray.length + "；剩余数量为：" + diff_qty + "，其余商品请扫码" + inOutString + "库"
                                } else if (sum_qty === epcArray.length) {
                                    alertMessage = "共" + epcArray.length + "件商品，已全部" + inOutString + "库";
                                }
                                bootbox.alert({
                                    buttons: {ok: {label: '确定'}},
                                    message: alertMessage,
                                    callback: function () {
                                    }
                                });
                            }
                        } else {
                            bootbox.alert(msg.msg);
                        }
                    }
                });
            }
        });
    } else {
        cs.closeProgressBar();
        $("#SODtl_wareHouseOut").removeAttr("disabled");
        bootbox.alert("请先保存当前单据");
    }
}

// @param: type     出入库类型，"in"入库；"out"出库
function inOutStockCheck(type) {
    var sum_qty = parseInt($("#addDetailgrid").footerData('get').qty);
    var sum_outQty = parseInt($("#addDetailgrid").footerData('get').outQty);
    var sum_inQty = parseInt($("#addDetailgrid").footerData('get').inQty);
    if (type === "in") {
        if (sum_qty <= sum_inQty) {
            $.gritter.add({
                text: '已全部入库',
                class_name: 'gritter-success  gritter-light'
            });
            return true;
        }
    } else {
        if (sum_qty <= sum_outQty) {
            $.gritter.add({
                text: '已全部出库',
                class_name: 'gritter-success  gritter-light'
            });
            return true;
        }
    }
}

function showCodesDetail(uniqueCodes) {

    // $("#show-uniqueCode-list").modal('show');

    wareHouse = $("#search_destId").val();
    var billNo = $("#edit_billNo").val()
    $("#show-uniqueCode-saleReturn-list").modal('show');
    initUniqueCodeSaleReturnList(uniqueCodes, billNo);
    codeSaleReturnListReload(uniqueCodes, billNo);
}

function doPrint() {
    $("#edit-dialog-print").modal('show');
    $("#form_code").removeAttr("readOnly");
    var billNo = $("#edit_billNo").val();
    $("#billno").val(billNo);
    $("#edit-dialog-print").show();
    $.ajax({
        dataType: "json",
        url: basePath + "/sys/printset/findPrintSetListByOwnerId.do",
        type: "POST",
        data: {
            type: "SR"
        },
        success: function (msg) {

            if (msg.success) {
                var addcont = "";
                //var ishave = false;
                for (var i = 0; i < msg.result.length; i++) {
                    addcont += "<div class='form-group' onclick=set('" + msg.result[i].id + "') title='" + msg.result[i].name + "'>" +
                        "<button class='btn btn-info'>" +
                        "<i class='cae-icon fa fa-refresh'></i>" +
                        "<span class='bigger-10'>套打" + msg.result[i].name + "</span>" +
                        "</button>" +
                        "</div>"
                }
                $("#addbutton").html(addcont);

            } else {
                bootbox.alert(msg.msg);
            }
        }
    });
}

function set(id) {

    $.ajax({
        dataType: "json",
        url: basePath + "/sys/printset/printMessage.do",
        data: {"id": id, "billno": $("#billno").val()},
        type: "POST",
        success: function (msg) {
            if (msg.success) {

                var print = msg.result.print;
                var cont = msg.result.cont;
                var contDel = msg.result.contDel;
                var LODOP = getLodop();
                //var LODOP=getLodop(document.getElementById('LODOP2'),document.getElementById('LODOP_EM2'));
                eval(print.printCont);
                var printCode = print.printCode;
                var printCodes = printCode.split(",");
                for (var i = 0; i < printCodes.length; i++) {
                    var plp = printCodes[i];
                    var message = cont[plp];
                    if (message != "" && message != null && message != undefined) {
                        LODOP.SET_PRINT_STYLEA(printCodes[i], 'Content', message);
                    } else {
                        LODOP.SET_PRINT_STYLEA(printCodes[i], 'Content', "");
                    }

                }

                var recordmessage = "";
                var sum = 0;
                var allprice = 0;
                var alldiscount = 0;
                for (var a = 0; a < contDel.length; a++) {
                    var conts = contDel[a];
                    recordmessage += "<tr style='border-top:1px dashed black;padding-top:5px;'>" +
                        "<td align='left' style='border-top:1px dashed black;padding-top:5px;font-size:12px;'>" + conts.sku + "</td>" +
                        "<td align='left'style='border-top:1px dashed black;padding-top:5px;font-size:12px;'>" + conts.qty + "</td>" +
                        "<td style='border-top:1px dashed black;padding-top:5px;font-size:12px;'>" + conts.price.toFixed(1) + "</td>" +
                        "<td style='border-top:1px dashed black;padding-top:5px;font-size:12px;'>" + conts.actPrice.toFixed(1) + "</td>" +
                        "<td align='right' style='border-top:1px dashed black;padding-top:5px;font-size:12px;'>" + (conts.actPrice * conts.qty).toFixed(2) + "</td>" +
                        "</tr>";

                    sum = sum + parseInt(conts.qty);
                    //allprice = allprice + parseFloat(conts.actPrice*conts.qty.toFixed(2));
                    alldiscount = alldiscount + parseFloat((conts.actPrice * conts.qty).toFixed(2));
                }
                alldiscount = alldiscount.toFixed(0);
                recordmessage += " <tr style='border-top:1px dashed black;padding-top:5px;'>" +
                    "<td align='left' style='border-top:1px dashed black;padding-top:5px;'>合计:</td>" +
                    "<td align='left'style='border-top:1px dashed black;padding-top:5px;'>" + sum + "</td>" +
                    "<td style='border-top:1px dashed black;padding-top:5px;'>&nbsp;</td>" +
                    " <td style='border-top:1px dashed black;padding-top:5px;'>&nbsp;</td>" +
                    "<td align='right' style='border-top:1px dashed black;padding-top:5px;'>" + alldiscount + "</td>" +
                    " </tr>";

                $("#loadtab").html(recordmessage);
                LODOP.SET_PRINT_STYLEA("baseHtml", 'Content', $("#edit-dialog2").html());
                //LODOP.PREVIEW();
                LODOP.PRINT();
                $("#edit-dialog-print").hide();


            } else {
                bootbox.alert(msg.msg);
            }
        }
    });
}

/**
 * 新增单据调用
 * */
function addNew() {
    $('#addDetailgrid').jqGrid("clearGridData");
    $('#addDetailgrid').jqGrid('GridUnload');
    initAddGrid();
    $("#editForm").clearForm();
    setEditFormVal();
    initCustomerTypeForm();
    $("#addDetailgrid").trigger("reloadGrid");
    $(".selectpicker").selectpicker('refresh');
    initButtonGroup($("#edit_status").val());
    $("#edit_customerType").selectpicker('val', "CT-ST");
    addUniqCode();
    $("#edit_origId").attr('disabled', false);
    $("#edit_destId").attr('disabled', false);
    $("#edit_billDate").attr('readOnly', false);
    $("#edit_destId").selectpicker('val', "AUTO_WH008");
    $("#edit_origId").selectpicker('val', defaultWarehId);
    $("#SRDtl_wareHouseOut").attr({"disabled": "disabled"});
    $("#edit_origUnitId").val(curOwnerId);
    $("#edit_origUnitName").val(name);
}

function cancel() {

    var billId = $("#edit_billNo").val();
    var status = $("#edit_status").val();
    if (status != "0") {
        bootbox.alert("不是录入状态，无法撤销");
        return;
    }
    if (billId == "" || billId == undefined) {
        bootbox.alert("不是录入状态，无法撤销");
        return;
    }
    bootbox.confirm({
        /*title: "余额确认",*/
        buttons: {confirm: {label: '确定'}, cancel: {label: '取消'}},
        message: "撤销确定",
        callback: function (result) {
            /* $("#SODtl_save").removeAttr("disabled");*/
            if (result) {
                cancelAjax(billId);

            } else {
            }
        }
    });
}

function cancelAjax(billId) {
    $.ajax({
        dataType: "json",
        url: basePath + "/logistics/saleOrderReturn/cancel.do",
        data: {billNo: billId},
        type: "POST",
        success: function (msg) {
            if (msg.success) {
                $.gritter.add({
                    text: msg.msg,
                    class_name: 'gritter-success  gritter-light'
                });
                $("#grid").trigger("reloadGrid");

            } else {
                bootbox.alert(msg.msg);
            }
        }
    });
}

function edit_wareHouseIn() {
    skuQty = {};
    $.each($("#addDetailgrid").getDataIDs(), function (index, value) {
        var rowData = $("#addDetailgrid").getRowData(value);
        skuQty[rowData.sku] = rowData.inQty;
    });

    inOntWareHouseValid = 'wareHouseIn_valid';
    taskType = 1;
    var destId = $("#edit_destId").val();
    wareHouse = destId;
    var ct = $("#edit_customerType").val();
    if (destId && destId !== null) {
        $("#dialog_buttonGroup").html("" +
            "<button type='button' id='WareHouseIn_dialog_buttonGroup' class='btn btn-primary' onclick='confirmWareHouseIn()'>确认入库</button>"
        );
        $("#add-uniqCode-dialog").modal('show').on('hidden.bs.modal', function () {
            $("#uniqueCodeGrid").clearGridData();
        });
        initUniqeCodeGridColumn(ct);
        $("#codeQty").text(0);
    } else {
        bootbox.alert("客户仓库不能为空！");
    }
    allCodes = "";
}

function confirmWareHouseIn() {
    cs.showProgressBar();
    var billNo = $("#edit_billNo").val();
    $("#WareHouseIn_dialog_buttonGroup").attr({"disabled": "disabled"});
    var epcArray = [];
    $.each($("#uniqueCodeGrid").getDataIDs(), function (index, value) {
        var rowData = $("#uniqueCodeGrid").getRowData(value);
        epcArray.push(rowData);
    });
    if (epcArray.length === 0) {
        bootbox.alert("请添加唯一码!");
        cs.closeProgressBar();
        $("#WareHouseIn_dialog_buttonGroup").removeAttr("disabled");
        return;
    }
    var dtlArray = [];
    $.each($("#addDetailgrid").getDataIDs(), function (index, value) {
        var rowData = $("#addDetailgrid").getRowData(value);
        dtlArray.push(rowData);
    });

    $.ajax({
        dataType: "json",
        // async: false,
        url: basePath + "/logistics/saleOrderReturn/convertIn.do",
        data: {
            billNo: billNo,
            strEpcList: JSON.stringify(epcArray),
            strDtlList: JSON.stringify(dtlArray),
            userId: userId
        },
        type: "POST",
        success: function (msg) {
            cs.closeProgressBar();
            $("#WareHouseIn_dialog_buttonGroup").removeAttr("disabled");
            if (msg.success) {
                $.gritter.add({
                    text: msg.msg,
                    class_name: 'gritter-success  gritter-light'
                });
                $("#modal-addEpc-table").modal('hide');
                $("#addDetailgrid").trigger("reloadGrid");
            } else {
                bootbox.alert(msg.msg);
            }
        }
    });
    $("#add-uniqCode-dialog").modal('hide');
}

function updateBillDetailData() {
    var ct = $("#edit_customerType").val();
    $.each($("#addDetailgrid").getDataIDs(), function (index, value) {
        var dtlRow = $("#addDetailgrid").getRowData(value);
        var stylePriceMap = JSON.parse(dtlRow.stylePriceMap);
        if (ct == "CT-AT") {//省代价格
            dtlRow.price = stylePriceMap['puPrice'];
        } else if (ct == "CT-ST") {//门店价格
            dtlRow.price = stylePriceMap['wsPrice'];
        } else if (ct == "CT-LS") {//吊牌价格
            dtlRow.price = stylePriceMap['price'];
        }
        dtlRow.totPrice = -Math.abs(dtlRow.qty * dtlRow.price).toFixed(2);
        dtlRow.totActPrice = -Math.abs(dtlRow.qty * dtlRow.actPrice).toFixed(2);
        if (dtlRow.id) {
            $("#addDetailgrid").setRowData(dtlRow.id, dtlRow);
        } else {
            $("#addDetailgrid").setRowData(value, dtlRow);
        }
    });
}
