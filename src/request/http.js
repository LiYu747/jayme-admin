// 在http.js中引入axios
import axios from 'axios'; // 引入axios
import { ElMessage, ElLoading } from 'element-plus'
import store from '../store/index'

let loading        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
    loading = ElLoading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}
//showFullScreenLoading() 与 tryHideFullScreenLoading() 目的是合并同一页面多个请求触发loading

let needLoadingRequestCount = 0;//声明一个变量

let showFullScreenLoading = () => {
    if (needLoadingRequestCount === 0) { //当等于0时证明第一次请求 这时开启loading
        startLoading()
    }
    needLoadingRequestCount++ //全局变量值++ 
}

let tryHideFullScreenLoading = () => {
    if (needLoadingRequestCount <= 0) return //小于等于0 证明没有开启loading 此时return
    needLoadingRequestCount-- //正常响应后 全局变量 --
    if (needLoadingRequestCount === 0) {  //等于0 时证明全部加载完毕 此时结束loading 加载
        endLoading()
    }
}
// 创建axios实例
var instance = axios.create({ timeout: 1000 * 12 });

/****** request拦截器 ==> 对请求参数做处理 ******/
instance.interceptors.request.use(
    config => {
        // let token = JSON.parse(sessionStorage.getItem('userInfo')) || store.state;
        let token;
        if (JSON.parse(sessionStorage.getItem('userInfo'))) {
            token = JSON.parse(sessionStorage.getItem('userInfo')).access_token
        } else if (store.getters.getToken) {
            token = store.getters.getToken
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        if(config.url.indexOf("/common/file/download") != -1 ){
            config['responseType'] = 'blob';
        }
        //判断是否存在token，如果存在的话，则每个http header都加上token
        if (config.url.indexOf("/common/file/upload") == -1 && config.url.indexOf("/common/file/check") == -1 && config.url.indexOf("/common/unpack") == -1 && config.url.indexOf("/back/asyncTask/find") == -1 && config.url.indexOf("/common/cos/file/generateUploadId") == -1 && config.url.indexOf("/common/cos/file/chunkUpload") == -1) {
            // if (!config.notLoadding) showFullScreenLoading();
        }

        return config;
    },
    err => {
        return Promise.reject(err);
    });
let isShowRes401Tips = false;
/****** response拦截器 ==> 对响应做处理 ******/
instance.interceptors.response.use(
    response => {  //成功请求到数据
        if (response.config.url.indexOf("/common/file/upload") == -1 && response.config.url.indexOf("/common/file/check") == -1 && response.config.url.indexOf("/common/unpack") == -1 && response.config.url.indexOf("/back/asyncTask/find") == -1 && response.config.url.indexOf("/common/cos/file/generateUploadId") == -1 && response.config.url.indexOf("/common/cos/file/chunkUpload") == -1) {
            if (!response.config.notLoadding) tryHideFullScreenLoading();
        }
        if (response.data.code === 400 || response.data.code === 401) { //未经授权时，统一处理
            if (!isShowRes401Tips) {
                isShowRes401Tips = true;
                ElMessage({
                    message: '你的登录授权信息已过期或已在其他设备上登录，请重新登录！',
                    type: 'warning'
                })
                sessionStorage.clear();
                setTimeout(() => {
                    // window.location.href = window.location.protocol + '//' + window.location.host + '/';
                    window.location.href = './';
                }, 1000);
            }
        }
        return response;
    },
    error => {  //响应错误处理
        if (!error.config.notLoadding) tryHideFullScreenLoading();
        ElMessage({
            message: '服务器开小差啦，请稍后重试！！',
            type: 'error'
        })
        return Promise.reject(error)
    }
)
export default instance;