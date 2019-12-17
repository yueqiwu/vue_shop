import request from './request'

// ------------------------------登录页------------------------------
// 登录接口
export function loginApi(params) {
  return request({
    url: 'login',
    method: 'post',
    params: params
  }).then(res => {
    return res.data
  })
}
// ------------------------------users用户页------------------------------
// 菜单接口
export function getMenuApi() {
  return request({
    url: 'menus',
    method: 'get'
  }).then(res => {
    return res.data
  })
}

// 获取用户列表
export function getUserListApi(queryInof) {
  return request({
    url: 'users',
    method: 'get',
    params: queryInof
  }).then(res => {
    return res.data
  })
}

// 改变用户状态
export function changeUserStateApi(id, mgState) {
  return request({
    url: `users/${id}/state/${mgState}`,
    method: 'put'
  }).then(res => {
    return res.data
  })
}

// 添加用户
export function addUserApi(params) {
  return request({
    url: 'users',
    method: 'post',
    data: params
  }).then(res => {
    return res.data
  }).catch(err => {
    console.log(err)
  })
}

// 根据 ID 查询用户信息
export function getUserInfoApi(id) {
  return request({
    url: 'users/' + id,
    method: 'get'
  }).then(res => {
    return res.data
  })
}

// 修改用户信息
export function editUserInfoApi(id, data) {
  return request({
    url: 'users/' + id,
    method: 'put',
    data
  }).then(res => {
    return res.data
  })
}

// 根据id删除用户
export function deleteUserApi(id) {
  return request({
    url: 'users/' + id,
    method: 'delete'
  }).then(res => {
    return res.data
  })
}
// ---------------------------------rights权限页------------------------------
// 获取权限list
export function getRightsListApi() {
  return request({
    url: 'rights/list',
    method: 'get'
  }).then(res => {
    return res.data
  })
}

// 获取权限tree
export function getRightsTreeApi() {
  return request({
    url: 'rights/tree',
    method: 'get'
  }).then(res => {
    return res.data
  })
}
// ---------------------------------roles角色分配页------------------------------
// 获取角色列表
export function getRolesListApi() {
  return request({
    url: 'roles',
    method: 'get'
  }).then(res => {
    return res.data
  })
}

// 删除角色指定权限
export function removeRightByIdApi(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  }).then(res => {
    return res.data
  })
}

// 角色授权
export function allotRightsApi(id, idStr) {
  return request({
    url: `roles/${id}/rights`,
    method: 'post',
    data: { rids: idStr }
  }).then(res => {
    return res.data
  })
}

// 获取所有角色的列表
export function getRolesApi() {
  return request({
    url: 'roles',
    method: 'get'
  }).then(res => {
    return res.data
  })
}

// 分配角色
export function setRolesApi(userId, roleId) {
  return request({
    url: `users/${userId}/role`,
    method: 'put',
    data: { rid: roleId }
  }).then(res => {
    return res.data
  })
}
// ------------------------------cate商品分类页------------------------------
// 获取商品分类数据列表
export function getCateListApi(params) {
  // 如果params不存在 默认全部获取
  if (params) {
    return request({
      url: 'categories',
      method: 'get',
      params
    }).then(res => {
      return res.data
    })
  } else {
    return request({
      url: 'categories',
      method: 'get'
    }).then(res => {
      return res.data
    })
  }
}

// 添加分类
export function addCategoryApi(params) {
  return request({
    url: 'categories',
    method: 'post',
    data: params
  }).then(res => {
    return res.data
  })
}
// ------------------------------------params商品参数页------------------------------
// 获取参数列表
/**
 * @param { 商品三级分类的id } id
 * @param { many only 动态属性或静态参数 } sel
 */
export function getParamsListApi(id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: { sel }
  }).then(res => {
    return res.data
  })
}

// 添加动态参数或者静态属性
export function addParamsApi(cateId, attrName, attrSel, attrVals = null) {
  return request({
    url: `categories/${cateId}/attributes`,
    method: 'post',
    data: {
      'attr_name': attrName,
      'attr_sel': attrSel,
      'attr_vals': attrVals
    }
  }).then(res => {
    return res.data
  })
}

// 根据 ID 查询参数
export function getAttributeByIdApi(id, attrid, attrSel) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: 'get',
    params: { attrSel }
  }).then(res => {
    return res.data
  })
}

// 删除参数
export function removeParamsApi(cateId, atrrId) {
  return request({
    url: `categories/${cateId}/attributes/${atrrId}`,
    method: 'delete'
  }).then(res => {
    return res.data
  })
}

// 编辑提交参数
/**
 * cateId 当前三级分类的id
 * attrId 当前属性的id
 * atrrName 如果要修改属性名 就把新的名称传这里 不修改则传原值
 * attrSel 属性的类型[many或only]
 * attrVals 如果增加或删除属性的值 就把增删后总的值传这里 不该则传原值
 */
export function editParamsApi(cateId, attrId, atrrName, attrSel, attrVals) {
  return request({
    url: `categories/${cateId}/attributes/${attrId}`,
    method: 'put',
    data: {
      'attr_name': atrrName,
      'attr_sel': attrSel,
      'attr_vals': attrVals
    }
  }).then(res => {
    return res.data
  })
}

// ------------------------------------商品列表list业-----------------------------------
// 获取商品列表
export function getGoodsListApi(params) {
  return request({
    url: 'goods',
    method: 'get',
    params
  }).then(res => {
    return res.data
  })
}

// 删除商品
export function removeGoodById(id) {
  return request({
    url: `goods/${id}`,
    method: 'delete'
  }).then(res => {
    return res.data
  })
}

// 添加商品
export function addGoodApi(params) {
  return request({
    url: 'goods',
    method: 'post',
    data: params
  }).then(res => {
    return res.data
  })
}

// ----------------------------------订单列表页---------------------------------
// 获取订单列表
export function getOrderListApi(params) {
  return request({
    url: 'orders',
    method: 'get',
    params
  }).then(res => {
    return res.data
  })
}
// 获取物流详情
export function getProgressApi(id) {
  return request({
    url: `/kuaidi/${id}`,
    method: 'get'
  }).then(res => {
    return res.data
  })
}
// ----------------------------------报表页---------------------------------
export function getReportApi() {
  return request({
    url: 'reports/type/1',
    method: 'get'
  }).then(res => {
    return res.data
  })
}
