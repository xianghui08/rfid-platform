   var start,end; 
   $(function(){
    
    	initKendoUIGrid();
    	$(".k-dropdown").css("width", "6em");
    	$(".k-grid-toolbar").css("display","none");//隐藏toolbar
    	initMultiSelect();
    	$(".k-dropdown").css("width", "6em");
    	$(".k-grid-toolbar").css("display","none");
    	

    	
    	setTimeout(function() {
    		search();
        },500);
    });
    
    function refresh(){
    	resetData();
    }
    function resetData(){
    	var gridData = $("#stockGrid").data("kendoGrid");
        gridData.dataSource.filter({ 
        	field: "warehType",
            operator: "eq",
            value: 4});
    }
    function exportExcel(){
    	$(".k-grid-excel").click();
    }
    function showAdvSearchPanel(){
    	 $("#searchPanel").slideToggle("fast");
    }
    function search(){
    	var gridData = $("#stockGrid").data("kendoGrid");
    	var filters = serializeToFilter($("#searchForm"));
        filters.push({
            field: "warehType",
            operator: "eq",
            value: 4
        });
    	gridData.dataSource.filter({
            logic: "and",
            filters: filters
        });
    	
    }
    
    function initMultiSelect(){
        $("#filter_in_warehId").kendoMultiSelect({
            dataTextField: "name",
            dataValueField: "code",
            height: 400,
            suggest: true,
            dataSource: {
                transport: {
                    read:  basePath + "/sys/shop/search.do?filter_EQI_type=4"
                }
            }
        });
        var multiSelect=$("#filter_in_warehId").data("kendoMultiSelect");
        multiSelect.value(shopId);
    }
    
    function initKendoUIGrid(){

        $("#stockGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "实时库存统计.xlsx",
                proxyURL: basePath + "/search/detailStockViewSearch/export.do",
                filterable: true
            },
            excelExport: function(e) {
                var sheet = e.workbook.sheets[0];
                var warehIdTemplate = kendo.template(this.columns[0].template);


                var groupNum = this.dataSource._group.length;
                for (var i = 1; i < sheet.rows.length; i++) {
                    var row = sheet.rows[i];
                    if(row.cells[0+groupNum]){
                        var gridRow = $("#stockGrid").data("kendoGrid").dataItem("tr:eq("+rowIndex+")");
                        var dataItem = {
                            warehId: row.cells[0+groupNum].value,
                            warehName:row.warehName
                        };
                        row.cells[0+groupNum].value = warehIdTemplate(dataItem);
                        rowIndex++;
                    }
                }
            },
            dataSource: {
                schema : {
                    total : "total",
                    model : {

                        fields: {

                            warehId: { type: "string" },
                            warehName: { type :"string"},
                            sku:{type:"string"},
                            styleId: { type: "string" },
                            styleName: { type: "string" },
                            colorId: { type: "string" },
                            sizeId: { type: "string" },
                            qty: { type: "number" },
                            inQty:{type:"number"},
                            outQty:{type:"number"},
                            price: { type: "number" }
                        }
                    },
                    data : "data",
                    groups : "data",
                    aggregates: "aggregates"
                },

                transport: {
                    read: {
                        url: basePath + "/search/detailStockViewSearch/list.do",
                        type:"POST",
                        dataType: "json",
                        contentType:'application/json'
                    },
                    parameterMap : function(options) {
                        return JSON.stringify(options);
                    }
                },
                pageSize: 500.0,
                serverSorting : true,
                serverPaging : true,
                serverGrouping : true,
                serverFiltering : true,
                serverAggregates: true,
                aggregate: [
                    { field: "inQty", aggregate: "sum" },
                    { field: "outQty", aggregate: "sum" },
                    { field: "qty", aggregate: "sum" },
                    { field: "styleId", aggregate: "count" },
                    { field: "price", aggregate: "average" },

                ]


            },
            sortable: {
                mode: "multiple",
                allowUnsort: true
            },
            pageable: {
                input : true,
                buttonCount: 5,
                pageSize: 500.0,
                pageSizes : [100, 500, 1000, 2000, 5000]
            },

            groupable: true,
            columnMenu: true,
            filterable: {
                extra:false
            },
            //   selectable: "multiple row",
            reorderable: true,
            resizable: true,
            scrollable: true,
            columns: [

                {
                    field:"warehId",
                    title:"仓店",
                    width:"180px",
                    template:function(data) {
                        if (data.warehName) {
                            return "[" + data.warehId + "]" + data.warehName;
                        } else {
                            return "[" + data.warehId + "]";
                        }
                    },
                    groupFooterTemplate:"合计:",
                    footerTemplate:"合计:"
                },
                { field:"sku",title:"SKU",width:"180px"},
                { field:"styleId",title:"款号",width:"120px",
                    aggregates: ["count"],
                    groupHeaderTemplate: function(data) {

                        var totQty = data.aggregates.qty.sum;
                        var value = data.value;
                        var avgPrice = data.aggregates.price.average;
                        return "款号:"+value +" 总数量:"+totQty+"; 平均价 :"+kendo.toString(avgPrice, '0.00');
                    }},
                { field:"styleName",title:"款名",width:"120px"},
                { field:"colorId",title:"色号",width:"80px"},
                { field:"sizeId",title:"尺号",width:"80px"},
                { field:"inQty",title:"入库数量",width:"110px",groupable: false,
                    groupable: false,
                    aggregates: ["sum"] ,
                    groupFooterTemplate: "#= sum#",
                    footerTemplate: " #= sum#"},
                { field:"outQty",title:"出库数量",width:"110px",groupable: false,
                    groupable: false,
                    aggregates: ["sum"] ,
                    groupFooterTemplate: "#= sum#",
                    footerTemplate: "#= sum#"
                },
                { field:"qty",title:"库存数量",width:"110px",groupable: false,
                    groupable: false,
                    aggregates: ["sum"],
                    groupFooterTemplate: "#= sum#",
                    footerTemplate: "#= sum#"
                },


                { field:"price",title:"吊牌价",width:"110px",groupable: false,aggregates: ["average"]}


            ]
        });
    
    }
   
    function onGrouping(arg) {
 //       kendoConsole.log("Group on " + kendo.stringify(arg.groups));
    }
   