import request from './request'

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

// 获取商品分类数据列表
export function getCateListApi(params) {
  return request({
    url: 'categories',
    method: 'get',
    params
  }).then(res => {
    return res.data
  })
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
