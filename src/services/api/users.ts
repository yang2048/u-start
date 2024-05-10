import { request } from '@/services/request'

// 获取用户信息
export const getUserInfo = (id) => request.Get('/user/' + id)

// 编辑用户信息
export const editUserInfo = (name, age, mobile) =>
  request.Post('/user', {
    name,
    age,
    mobile,
  })

  // 移除用户
export const removeUser = id => request.Delete('/user/' + id);