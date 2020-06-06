$(function () {
  const layer = layui.layer
  const form = layui.form
  let art_state = '已发布'

  initCate()
  initEditor()
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  function initCate() {
    $.ajax({
      methood: 'GET',
      url: '/my/article/cates',
      success: res => {
        if (res.status !== 0) return layer.msg('请求数据失败')
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })
  $('#coverFile').on('change', function (e) {
    const fileList = e.target.files
    if (fileList.length <= 0) return layer.msg('请选择图片')
    var newImgURL = URL.createObjectURL(fileList[0])
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)
  })
  $('#savaAsDraft').on('click', function () {
    art_state = '草稿'
  })
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    const fd = new FormData($(this)[0])
    fd.append('state', art_state)
    // 将封面裁剪过后的图片输出为图片对象
    $image
      .cropper('getCroppedCanvas', {
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        fd.append('cover_img', blob)
      })

    // 发布文章
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: res => {
        if (res.status !== 0) return layer.msg('发布失败')
        layer.msg('发布成功')
        location.href = 'art_list.html'
      }
    })
  })
})