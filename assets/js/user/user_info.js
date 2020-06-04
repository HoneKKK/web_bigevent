$(function () {
  const form = layui.form
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
        form.val('formUserInfo', res.data)
      }
    })
  }
  $('#btnReset').on('click', function (e) {
    e.preventDefault()
    initUserInfo()
  })
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) return layer.msg('更新用户信息失败')
        layer.msg('更新用户信息成功')
        window.parent.getUserInfo()
      }
    })
  })
})
