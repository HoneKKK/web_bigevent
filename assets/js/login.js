$(function () {
  const form = layui.form
  const layer = layui.layer
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })
  form.verify({
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须为6-12位,且不能出现空格'
    ],
    repwd: function (value) {
      let psw = $('.reg-box [name=password]').val()
      if (psw !== value) {
        return '密码不一致'
      }
    }
  })
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    const data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $.post('/api/reguser', data, res => {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功')
      $('#link_login').click()
    })
  })
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) return layer.msg('登录失败')
        layer.msg(res.message)
        localStorage.setItem('token', res.token)
        location.href = './index.html'
      }
    })
  })
})

