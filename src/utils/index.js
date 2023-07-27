/** 获取本地存储 */
export const getLocalStorage = (key) => {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key))
  }
}
/** 设置本地存储 */
export const setLocalStorage = (key, val) => {
  return localStorage.setItem(key, JSON.stringify(val))
}
/** 删除本地存储 */
export const removeLocalStorage = (key) => {
  return localStorage.removeItem(key)
}

export const getSessionStorage = (key) => {
  if (sessionStorage.getItem(key)) {
    return JSON.parse(sessionStorage.getItem(key))
  }
}
export const setSessionStorage = (key, val) => {
  return sessionStorage.setItem(key, JSON.stringify(val))
}
export const removeSessionStorage = (key) => {
  return sessionStorage.removeItem(key)
}
// 文件下载
export function downloadFile(url, fileName = '未知文件') {
  // console.log(url);
  // const link = document.createElement('a')
  // link.style.display = 'none'
  // link.href = url
  // link.setAttribute('download', fileName)
  // document.body.appendChild(link)
  // link.click()
  // document.body.removeChild(link)

  var newUrl = url
  if(newUrl.substring(0,5) === 'http:'){
    newUrl = url.replace('http', 'https')
  }
  window.open(newUrl, '_self');
}
export default {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
  downloadFile
}
