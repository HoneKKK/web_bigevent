$(function () {
  // 用对象存储发送请求数据,请求时将该对象作为data传递即可
  let q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  }
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage
  initTable()
  initCateList()

  // 请求表格数据
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: res => {
        if (res.status !== 0) return layer.msg('请求失败')
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 分页是以表格中的数据作为参照生成,根据数据的多少来生成对应的页码数,因此要在表格生成后再生成分页区
        renderPage(res.total)
      }
    })
  }
  // 校验规则
  template.defaults.imports.dateFormat = date => {
    const dt = new Date(date)
    const y = dt.getFullYear()
    const m = padZero(dt.getMonth() + 1)
    const day = padZero(dt.getDate())
    const hh = padZero(dt.getHours())
    const min = padZero(dt.getMinutes())
    const sec = padZero(dt.getSeconds())

    return y + '-' + m + '-' + day + ' ' + hh + ':' + min + ":" + sec
  }
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  function initCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        if (res.status !== 0) return layer.msg('请求文章分类失败')
        const htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 更新渲染
        form.render()
      }
    })
  }

  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
  })

  // 接收数据的总数目
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      limits: [2, 3, 5, 10],
      layout: ['count', , 'limit', 'prev', 'page', 'next'],
      jump: (obj, first) => {
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        // first（是否首次，一般用于初始加载的判断）
        if (!first) {
          initTable()
        }
      }
    })
  }

  $("body").on('click', '#delete', function () {
    let len = $('#delete').length
    console.log(len);
    let Id = $(this).attr('data-id')
    layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + Id,
        success: res => {
          if (res.status !== 0) return layer.msg('删除失败')
          layer.msg('删除成功')
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    });
  })



})