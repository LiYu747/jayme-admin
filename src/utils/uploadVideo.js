import { getFileMD5 } from './md5'

import store from '@/store'
// import Vue from 'vue'
let Vue = {}

import api from '../request/api'
import { ElLoading } from 'element-plus'
function uploadMultiple(file, callback) {
  let burstSize = 2 * 1024 * 1024 //分片大小2M
  let count = 0 //成功上传了几个分片
  // const loading = ElLoading.service({
  //   lock: true,
  //   text: '正在上传...',
  //   // spinner: 'el-icon-loading',
  //   background: 'rgba(0, 0, 0, 0.7)',
  // })
  // 文件上传进度
  let progress = 0
  // 添加上传进度监听

  getFileMD5(file.file, async (md5, chunkArr) => {
    let burstSize = 2 * 1024 * 1024 //分片大小2M
    //当文件大于分片大小时，进行分片上传
    if (file.file.size > burstSize) {
      let formData_upload = new FormData() //上传参数
      let formData_fileName = new FormData() //上传参数
      let fileName =
        md5 +
        '.' +
        file.file.name.split('.')[file.file.name.split('.').length - 1]
      formData_fileName.append(
        'fileName',
        md5 +
          '.' +
          file.file.name.split('.')[file.file.name.split('.').length - 1]
      ) //文件名
      // console.log(fileName)
      // let generateID = await Vue.prototype.$axios({method: 'post',url: generateUploadId+'?fileName='+fileName,headers: {Authorization:token,}});//生成分片上传唯一标识
      let generateID = await api.generateUploadId(formData_fileName)
    //   console.log('generateID', generateID)
      if (generateID.data.result.url) {
        console.log('有分片数据')
        // loading.close();
        let uploadId = generateID.data.result.uploadId
        store.commit('setUploadProgress', {
          progress: 100,
          id: uploadId,
        })
        callback(generateID.data.result)
      } else {
        console.log('没有分片数据')
        if (generateID.data.code === 0) {
          let generate = generateID.data.result.uploadId
          let partETagsList = []
          formData_upload.append('partNumber', null) //分片号，从1开始
          formData_upload.append('partSize', null) //分片大小
          formData_upload.append('file', null) //分片文件
          formData_upload.append('uploadId', generate) //分片上传事件的唯一标识
          formData_upload.append('fileName', fileName) //文件名,文件MD5+后缀
          for (var i = 0; i < chunkArr.length; i++) {
            formData_upload.set('partNumber', i + 1) //分片号，从1开始
            formData_upload.set('partSize', chunkArr[i].currentSize) //分片大小
            formData_upload.set('file', chunkArr[i].file) //分片文件
            // let uploadChunk = await Vue.prototype.$axios({method: 'post',url: chunkUpload,headers: {Authorization:token,},data:formData_upload});//分片上传
            let uploadChunk = await api.chunkUpload(formData_upload)
            if (uploadChunk.data.code === 0) {
              partETagsList.push(uploadChunk.data.result.partETag)
              count++
              let text =
                '上传' +
                ((count / Math.ceil(file.file.size / burstSize)) * 100).toFixed(
                  2
                ) +
                '%'
              let prValue = (
                (count / Math.ceil(file.file.size / burstSize)) *
                100
              ).toFixed(2)
              // console.log('上传进度', text)
              // setUploadProgress({ progress: prValue, id: '' })
              store.commit('setUploadProgress', {
                progress: prValue,
                id: generate,
              })
              // loading.text = text
            } else {
              // loading.close();
              // let uploadId = generateID.data.result.uploadId
              store.commit('setUploadProgress', {
                progress: 100,
                id: generate,
              })
              break
            }
          }
          if (count == Math.ceil(file.file.size / burstSize)) {
            let dataRequest = {
              fileName: fileName,
              partETags: partETagsList,
              uploadId: generate,
            }
            // let merge = await Vue.prototype.$axios({method: 'post',url: completeUpload,headers: {Authorization:token},data:dataRequest});
            let merge = await api.completeUpload(dataRequest)
            if (merge.data.code === 0) {
              store.commit('setUploadProgress', {
                progress: 100,
                id: generate,
              })
              // loading.close();
              callback(merge.data.result)
            }
            store.commit('setUploadProgress', {
              progress: 100,
              id: generate,
            })
            // loading.close();
          }
        }
      }
    } else {
      let formData_upload = new FormData() //上传参数
      formData_upload.append('file', file.file) //文件
      formData_upload.append(
        'fileName',
        md5 +
          '.' +
          file.file.name.split('.')[file.file.name.split('.').length - 1]
      ) //文件名
      // let affirm = await Vue.prototype.$axios({method: 'post',url: uploadUrl+'?fileName='+md5+'.'+file.file.name.split('.')[file.file.name.split('.').length-1],headers: {Authorization:token,},data:formData_upload});
      let affirm = await api.cosUpload(formData_upload)
      if (affirm.data.code === 0) {
        store.commit('setUploadProgress', {
          progress: 100,
          id: affirm?.data?.result?.uploadId || '',
        })
        // loading.close();
        callback(affirm.data.result)
      } else {
        store.commit('setUploadProgress', {
          progress: 100,
          id: affirm?.data?.result?.uploadId || '',
        })
        // loading.close();
      }
    }
  })
}
export { uploadMultiple }
