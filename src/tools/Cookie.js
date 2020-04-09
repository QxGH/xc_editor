import Cookies from 'js-cookie'
import { AesDecrypt } from './Crypto'

// 获取 token
const getUserToken = () => {
  let token = Cookies.get('userToken');
  if(token) {
    // 有 token 直接返回
    return token;
  } else {
    // 开发模式 写死 token
    // if (process.env.NODE_ENV == 'development') {
    //   return 'token.token.token';
    // };
    return ''
  };
}

// 获取 角色权限
const getUserRole = () => {
  let roles = Cookies.get('userRoles');
  
  if (roles) {
    return JSON.parse(AesDecrypt(roles))
  } else {
    if (process.env.NODE_ENV != 'development') {
      return ['master'];
    } else {
      return []
    }
  }
}

// 获取用户的信息
const getUserInfo = () => {
  return Cookies.getJSON('userInfo') || '';
}

// 获取店铺信息
const getStoreInfo = () => {
  return Cookies.getJSON('storeInfo') || '';
}

const getStoreToken = () => {
  return Cookies.getJSON('storeToken') || '';
}

// 清除cookie信息
const clearCookie = () => {
  Cookies.remove('userToken', { path: '/' });
  Cookies.remove('userRoles', { path: '/' });
  Cookies.remove('userInfo', { path: '/' });
  Cookies.remove('storeInfo', { path: '/' });
  Cookies.remove('storeToken', { path: '/' });
}

export {
  getUserToken,
  getUserRole,
  getUserInfo,
  getStoreInfo,
  clearCookie,
  getStoreToken
}