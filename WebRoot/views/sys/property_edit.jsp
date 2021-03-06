<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<div id="edit-dialog" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog">
        <div class="modal-header no-padding">
            <div class="table-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                    <span class="white">&times;</span>
                </button>
                编辑
            </div>
        </div>
        <div class="modal-content">
            <div class="modal-body">
                <form class="form-horizontal" role="form" id="editForm">
                    <div class="form-group">
                        <label class="col-sm-2 control-label no-padding-right" for="form_id">分类编号</label>

                        <div class="col-xs-14 col-sm-7">
                            <input class="form-control" id="form_id" name="id"
                                   onkeyup="this.value=this.value.toUpperCase()"
                                   type="text"
                                   placeholder=""/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label no-padding-right" for="form_type">类型</label>

                        <div class="col-xs-14 col-sm-7">
                            <input class="form-control" id="form_type" name="type"
                                   type="text" placeholder=""/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label no-padding-right" for="form_value">名称</label>

                        <div class="col-xs-14 col-sm-7">
                            <input class="form-control" id="form_value" name="value"
                                   type="text" placeholder=""/>
                        </div>
                    </div>
                </form>

            </div>
        </div>
        <div class="modal-footer">

            <a href="#" class="btn" onclick="closeEditDialog()">关闭</a>

            <button type="button" href="#" class="btn btn-primary" onclick="savetype()">保存</button>

        </div>
    </div>
</div>
<script>
    $(function () {
        $("#edit-dialog").on('show.bs.modal', function () {   //在调用show方法后触发
            initEditFormValid();          //执行一些动作
        });
        $("#edit-dialog").on('show.bs.modal', function () {
            $("#editForm").data('bootstrapValidator').destroy();
            $('#editForm').data('bootstrapValidator', null);
           initEditFormValid();
        });
    });

    function initEditFormValid() {
        $('#editForm').bootstrapValidator({      //数据验证
            message: '输入值无效',
            feedbackIcons: {       //只是一个样式表，显示验证成功或者失败时的小图标
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
                id: {
                    validators: {
                        threshold: 5, //有5字符以上才发送ajax请求，（input中输入一个字符，插件会向服务器发送一次，设置限制，6字符以上才开始）
                        remote: {//ajax验证。server result:{"valid",true or false} 向服务发送当前input name值，获得一个json数据。例表示正确：{"valid",true}
                            url: basePath + "/sys/property/checkCode.do?pageType=" + pagetype,//验证地址
                            message: '分类编号已存在',//提示消息
                            delay: 2000,//每输入一个字符，就发ajax请求，服务器压力还是太大，设置2秒发送一次ajax（默认输入一个字符，提交一次，服务器压力太大）
                            type: 'POST',//请求方式
                            data: function (validator) {
                                return {
                                    //  password: $('[name="passwordNameAttributeInYourForm"]').val(),
                                    //  whatever: $('[name="whateverNameAttributeInYourForm"]').val()
                                };
                            }
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_]+$/,
                            message: '分类编号由数字字母下划线和.组成'
                        },
                        stringLength: {
                            min: 0,
                            max: 6,
                            message: '分类编号长度必须在0到5之间'
                        },
                    }
                },
                type: {
                    validators: {
                        notEmpty: {
                            message: '类型不能为空'
                        }
                    }
                },
                value: {
                    validators: {
                        notEmpty: {
                            message: '名称不能为空'
                        }
                    }
                },
            }
        });
    }

    function closeEditDialog() {
        $("#edit-dialog").modal('hide');
    }
</script>
