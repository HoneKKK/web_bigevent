$(function () {
  const layer = layui.layer
  getUserInfo()
  $('#logout').on('click', function () {
    layer.confirm('确定退出吗', { icon: 3, title: '提示' }, function (index) {
      localStorage.removeItem('token')
      location.href = 'login.html'
      layer.close(index)
    });
  })
})


function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: res => {
      if (res.status !== 0) return layui.layer.msg('获取信息失败')
      renderAvatar(res.data)
    }
  })
}
function renderAvatar(user) {
  const name = user.username || user.nickname
  $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    $('.layui-nav-img').hide()
    const first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}