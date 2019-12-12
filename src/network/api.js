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
export function changeUserStateApi(url) {
  return request({
    url: url,
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
export function getUserInfoApi(urlId) {
  return request({
    url: urlId,
    method: 'get'
  }).then(res => {
    return res.data
  })
}

// 修改用户信息
export function editUserInfoApi(url, data) {
  return request({
    url,
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
