$(function () {
  const form = layui.form
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    samePwd: value => {
      if (value === $('[name=oldpsw]').val()) {
        return '新密码不能与旧密码相同'
      }
    },
    rePwd: value => {
      if (value !== $('[name=newpsw]').val()) {
        return '两次密码不一致'
      }
    }
  })
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) return layui.layer.msg('修改失败')
        layui.layer.msg('修改成功')
      }
    })
  })
})