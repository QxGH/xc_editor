import { getUserToken, getUserRole, getStoreToken, clearCookie } from 'tools/Cookie'
const befroeEach = (to, from, next) => {
  let roles = getUserRole();
  let userToken = getUserToken();

  let whiteList = ['/403', '/404', '/login', '/'];
  let toIndexPath = ['/', '/index'];

  if (whiteList.indexOf(to.path) != -1) {
    next();
  } else if (userToken) {
    let storeToken = getStoreToken();
    if (storeToken) {
      if (to.meta.roles.length == 0 || arrHas(to.meta.roles, roles) || toIndexPath.indexOf(to.path) != -1) {
        // 判断路由权限
        next();
      } else {
        next('/404')
      }
    } else if(to.path == '/platform') {
      Cookies.remove('storeInfo', { path: '/' });
      next();
    } else {
      Cookies.remove('storeInfo', { path: '/' });
      next('/platform')
    }
  } else {
    clearCookie();
    next('/login')
  }
};


const arrHas = (roles, userRoles) => {
  for (let item of roles) {
    if (userRoles.includes(item)) {
      return true
    }
  }
  return false
}

export default befroeEach;