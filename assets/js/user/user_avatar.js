$(function () {
  const layer = layui.layer
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)


  // 上传按钮点击事件。思路为点击按钮时设为点击隐藏的input type=file
  $('#upload').on('click', function () {
    $('#file').click()
  })
  $('#file').on('change', function (e) {
    // e.target.files为一个伪数组
    const fileList = e.target.files
    if (fileList.length === 0) return layer.msg('请选择图片')
    const file = fileList[0]
    const newImageURL = URL.createObjectURL(file)
    $image.cropper('destroy')
      .attr('src', newImageURL)
      .cropper(options)
  })
  // 上传至服务器
  $('#uploadImg').on('click', function () {
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        width: 100,
        height: 100
      })
      .toDataURL('image/png')
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: res => {
        if (res.status !== 0) return layer.msg("更新头像失败")
        window.parent.getUserInfo()
      }
    })
  })
})