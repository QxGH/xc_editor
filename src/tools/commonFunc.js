import Cookies from "js-cookie";
import { clearCookie } from "@/tools/Cookie";
import store from "@/store";


const logout = () => {
  clearCookie();
  this.$router.push("/login");
  window.location.href = store.state.domainURL + "/#/login";
}

const switchPlatform = () => {
  Cookies.remove("storeInfo", { path: "/" });
  Cookies.remove("storeToken", { path: "/" });
  window.location.href = store.state.domainURL + "/#/platform";
}

const accountManage = () => {
  window.location.href = store.state.domainURL + "/#/accountManage";
}

export {
  logout,
  switchPlatform,
  accountManage
}