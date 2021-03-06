<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="../baseView.jsp"></jsp:include>
<script type="text/javascript">
        var basePath = "<%=basePath%>";
    </script>

</head>
<body class="no-skin">
	<div class="main-container" id="main-container">
		<script type="text/javascript">
        try {
            ace.settings.check('main-container', 'fixed')
        } catch (e) {
        }
    </script>
		<div class="main-content">
			<div class="main-content-inner">
				<!-- /.page-header -->

				<div id="page-content">
				
					<div class="row">
						<div class="col-xs-12">
							<!-- PAGE CONTENT BEGINS -->
							<div class="widget-body">

								<div class="widget-toolbox padding-8 clearfix">
									<div class="btn-toolbar" role="toolbar">
										<div class="btn-group btn-group-sm pull-left">
											<button class="btn btn-info" onclick="refresh()">
												<i class="ace-icon fa fa-refresh"></i> <span
													class="bigger-110">刷新</span>
											</button>
										</div>


										<div class="btn-group btn-group-sm pull-right">

											<button type="button" class="btn btn-info"
												onclick="showAdvSearchPanel();">
												<i class="ace-icon fa fa-binoculars"></i> <span
													class="bigger-110">高级查询</span>
											</button>

										</div>
									</div>
								</div>

                                <div class="hr hr-2 hr-dotted"></div>
                                
								<div class="widget-main" id="searchPanel" style="display:none">
                                    <form class="form-horizontal" role="form" id="searchForm">
                                        <div class="form-group">
                                            <label class="col-xs-4 col-sm-4 col-md-1 col-lg-1 control-label text-right" for="search_id">任务编号</label>

                                            <div class="col-xs-8 col-sm-8 col-md-3 col-lg-3">
                                                <input class="form-control" id="search_id" name="filter_LIKES_id"
                                                       type="text" onkeyup="this.value=this.value.toUpperCase()"
                                                       placeholder="模糊查询"/>
                                            </div>
                                            
                                            <label class="col-xs-4 col-sm-4 col-md-1 col-lg-1 control-label text-right" for="search_token">出库方式</label>

                                            <div class="col-xs-8 col-sm-8 col-md-3 col-lg-3">
                                                <select class="chosen-select form-control" id="search_token"
                                                        name="filter_EQI_token">
                                                    <option value="">--请选择--</option>
                                                    <option value="26">退货出库</option>
                                                    <option value="10">普通出库</option>
                                                    <option value="24">调拨出库</option>
                                                </select>
                                            </div>
                                            
											<label class="col-xs-4 col-sm-4 col-md-1 col-lg-1 control-label text-right" for="search_origId">出库仓库</label>

                                            <div class="col-xs-8 col-sm-8 col-md-3 col-lg-3">

												<div class="input-group">
													<input class="form-control" id="search_origId"
														name="filter_INS_origId" type="text" placeholder="编号列表" />
													<span class="input-group-btn">
														<button class="btn btn-sm btn-default" type="button"
															onclick="open_multi_warehouseDialog('#search_origId',callback)">
															<i class="ace-icon fa fa-list"></i>
														</button>
													</span>
												</div>
											</div>

                                        </div>
                                        <!-- #section:elements.form -->
                                        <div class="form-group">
                                            <label class="col-xs-4 col-sm-4 col-md-1 col-lg-1 control-label text-right" for="search_destUnitId">收货方</label>

                                            <div class="col-xs-8 col-sm-8 col-md-3 col-lg-3">
                                             <div class="input-group">
													<input class="form-control" id="search_destUnitId"
														name="filter_INS_destUnitId" type="text"
														placeholder="编号列表" /> <span class="input-group-btn">
														<button class="btn btn-sm btn-default" type="button"
															onclick="openUnitDialog('#search_destUnitId','',callback)">
															<i class="ace-icon fa fa-list"></i>
														</button>
													</span>
												</div>
                                            </div>
                                            
                                            <label class="col-xs-4 col-sm-4 col-md-1 col-lg-1 control-label text-right" for="search_destId">收货仓库</label>

                                            <div class="col-xs-8 col-sm-8 col-md-3 col-lg-3">
                                                <div class="input-group">
													<input class="form-control" id="search_destId"
														name="filter_INS_destId" type="text" placeholder="编号列表" />
													<span class="input-group-btn">
														<button class="btn btn-sm btn-default" type="button"
															onclick="_openUnitDialog('#search_destId','')">
															<i class="ace-icon fa fa-list"></i>
														</button>
													</span>
												</div>
                                            </div>

                                            <label class="col-xs-4 col-sm-4 col-md-1 col-lg-1 control-label text-right" for="search_beginTime">创建日期 </label>

                                            <div class="col-xs-8 col-sm-8 col-md-3 col-lg-3">
                                                <div class="input-group">
                                                    <input class="form-control date-picker" id="search_beginTime"
                                                           type="text" name="filter_GED_beginTime"
                                                           data-date-format="yyyy-mm-dd"/>

                                            <span class="input-group-addon">
																		<i class="fa fa-exchange"></i>
																	</span>

                                                    <input class="form-control date-picker" type="text"
                                                           class="input-sm form-control" name="filter_LED_endTime"
                                                           data-date-format="yyyy-mm-dd"/>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-11 btnPosition">
                                                <button type="button" class="btn btn-sm btn-primary" onclick="_search()">
                                                    <i class="ace-icon fa fa-search"></i>
                                                    <span class="bigger-110">查询</span>
                                                </button>
                                                <button type="reset" class="btn btn-sm btn-warning"
                                                        onclick="_clearSearch()">
                                                    <i class="ace-icon fa fa-undo"></i>
                                                    <span class="bigger-110">清空</span></button>
                                            </div>
                                        </div>

                                    </form>

                            </div>
							</div>

							<table id="grid" style="background:#ffffff"></table>

							<div id="grid-pager"></div>


							<!-- PAGE CONTENT ENDS -->
						</div>
						<!-- /.col -->
					</div>
					<!-- /.row -->
					<!--/#page-content-->
				</div>
			</div>
		</div>


		<!--/.fluid-container#main-container-->
	</div>
     
	<jsp:include page="../layout/footer_js.jsp"></jsp:include>
		<jsp:include page="../base/unit_dialog.jsp"></jsp:include>
		<jsp:include page="../base/wareh_shop_dialog.jsp"></jsp:include>
		<jsp:include page="../base/warehouse_multi_dialog.jsp"></jsp:include>
	
	<script type="text/javascript"
		src="<%=basePath%>/views/task/outboundController.js"></script>
<script type="text/javascript">
	function callback(){}
</script>
</body>
</html>