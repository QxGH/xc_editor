
const qiniu = {
  // 获取 token
  getQiniuToken(formData) {
    return request({
      url: `tools/oss/uploadToken`,
      method: 'post',
      source: 'qiniu',
      data: formData
    });
  }
}

export default qiniu;