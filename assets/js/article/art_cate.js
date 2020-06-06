$(function () {
  const layer = layui.layer
  const form = layui.form
  // 添加弹框
  let indexAdd = null
  // 编辑弹框
  let indexEdit = null
  initArtCateList()

  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        if (res.status !== 0) return layer.msg('获取文章分类列表错误')
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 添加分类
  $('#addCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      title: '添加文章分类',
      area: ['500px', '250px'],
      content: $('#diolog-add').html()
    })
  })
  // 由于弹框动态生成，无法直接绑定事件,因此使用代理的形式冒泡绑定
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) return layer.msg('修改失败')
        initArtCateList()
        layer.msg('新增成功')
        layer.close(indexAdd)
      }
    })
  })
  // 编辑按钮
  $('tbody').on('click', '#edit', function () {
    indexEdit = layer.open({
      type: 1,
      title: '编辑文章分类',
      area: ['500px', '250px'],
      content: $('#diolog-edit').html()
    })
    let id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: res => {
        if (res.status !== 0) return layer.msg('获取分类数据失败')
        // 给指定的form表单填充数据
        form.val('form-edit', res.data)
      }
    })
  })
  // 编辑信息提交
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) layer.msg('更新信息失败')
        initArtCateList()
        layer.msg('更新信息成功')
        layer.close(indexEdit)
      }
    })
  })
  // 根据ID删除
  $('tbody').on('click', '#delete', function () {
    let id = $(this).attr('data-id')
    layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: res => {
          if (res.status !== 0) return layer.msg('删除失败')
          layer.msg('删除成功')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })
})