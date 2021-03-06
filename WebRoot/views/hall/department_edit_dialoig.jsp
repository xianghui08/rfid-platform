<%@ page pageEncoding="UTF-8" import="java.util.*" language="java" %>
<div class="modal fade" id="edit_dialog" tabindex="-1" role="doalog">
    <div class="modal-dialog">
        <div class="modal-header no-padding">
            <div class="table-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                    <span class="white">&times;</span>
                </button>
                部门信息
            </div>
        </div>
        <div class="modal-content">
            <div class="modal-body">
                <form class="form-horizontal" role="form" id="editForm">
                    <div class="form-group" id="codeGroup">
                        <label class="col-sm-2 text-right" for="form_code">编号</label>
                        <div class="col-sm-7">
                            <input class="form-control" name="code" id="form_code" type="text" readonly/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 text-right" for="form_name">部门名称</label>
                        <div class="col-sm-7">
                            <input class="form-control" name="name" id="form_name" type="text"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 text-right" for="form_linkTel">联系电话</label>
                        <div class="col-sm-7">
                            <input class="form-control" name="linkTel" id="form_linkTel" type="text"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 text-right" for="form_linkman">联系人</label>
                        <div class="col-sm-7">
                            <input class="form-control" name="linkman" id="form_linkman" type="text"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 text-right" for="form_email">邮箱</label>
                        <div class="col-sm-7">
                            <input class="form-control" name="email" id="form_email" type="text"/>
                        </div>
                    </div>
                    <div class="form-group" id="createTimeGroup">
                        <label class="col-sm-2 text-right" for="form_createTime">创建时间</label>
                        <div class="col-sm-7">
                            <input class="form-control" name="createTime" id="form_createTime" type="text" readonly/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 text-right" for="form_remark">备注</label>
                        <div class="col-sm-7">
                            <input class="form-control" name="remark" id="form_remark" type="text"/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="modal-footer">

            <a href="#" class="btn" onclick="closeEditDialog()">关闭</a>

            <button type="button" href="#" class="btn btn-primary" onclick="save()">保存</button>

        </div>
    </div>
</div>
<script>
    $(function(){
        $("#edit_dialog").on('show.bs.modal', function () {
            initEditFormValid();
            $("#editForm").resetForm();
        });
        $("#edit_dialog").on('hide.bs.modal',function(){
            $("#editForm").data('bootstrapValidator').destroy();
            $('#editForm').data('bootstrapValidator', null);
            initEditFormValid();
        });
    });

    function closeEditDialog(){
        $("#edit_dialog").modal("hide");
    }

    function initEditFormValid(){
        $('#editForm').bootstrapValidator({
            message: '输入值无效',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            submitHandler: function(validator, form, submitButton) {
                $.post(form.attr('action'), form.serialize(), function(result) {
                    if (result.success == true || result.success == 'true') {
                    } else {
                        // Enable the submit buttons
                        $('#editForm').bootstrapValidator('disableSubmitButtons', false);
                    }
                }, 'json');
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: '名称不能为空'
                        }
                    }
                },
                linkTel: {
                    validators: {
                        notEmpty:{
                            message:'联系电话不能为空'
                        },
                        stringLength: {
                            min: 11,
                            max: 11,
                            message: '请输入11位手机号码'
                        },
                        regexp: {
                            regexp: /^1[2|3|4|5|6|7|8]{1}[0-9]{9}$/,
                            message: '请输入正确的手机号码'
                        }
                    }
                } ,
                linkman: {
                    validators: {
                        notEmpty: {
                            message: '联系人不能为空'
                        }
                    }
                },
                email:{
                    validators:{
                        emailAddress: {
                            message: '邮箱地址格式有误'
                        },
                    }
                }
            }
        });
    }
</script>
