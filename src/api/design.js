import base from './base'; // 导入接口域名列表
import axios from '@/request'; // 导入http中创建的axios实例

const design = {
  getGoodsList() {
    return axios.post(`${base.http}/getGoodsList`);
  },
  getAllGoodsList() {
    return axios.post(`${base.http}/getAllGoodsList`);
  },
  getEditor() {
    return axios.post(`${base.http}/getEditor`);
  }
}

export default design;