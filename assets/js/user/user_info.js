$(function () {
  const form = layui.form
  // 校验规则
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '用户昵称长度在1~6个字符内'
      }
    }
  })
  initUserInfo()
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: res => {
        if (res.status !== 0) return layer.msg('提交失败')
        // 表单自动填充数据,layuiAPI
        form.val('formUserInfo', res.data)
      }
    })
  }
  // 重置按钮点击事件,重新请求数据
  $('#btnReset').on('click', function (e) {
    e.preventDefault()
    initUserInfo()
  })
  // 表单提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) return layer.msg('更新用户信息失败')
        layer.msg('更新用户信息成功')
        // 从全局中找到index中的获取用户信息方法,实现刷新
        window.parent.getUserInfo()
      }
    })
  })
})
