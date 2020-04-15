/** 
 * api接口的统一出口
 */
import imgapi from '@/api/imgapi';
import design from '@/api/design';
import qiniu from '@/api/qiniu';

// 导出接口
export default {
  imgapi,
  design,
  qiniu
};