import axios from './http.js'
/** 根据id查询异步任务 */
export const getAsyncTask = (params) => {
  return axios.get(`/common/getAsyncTask`, {
    params: params,
  })
}
