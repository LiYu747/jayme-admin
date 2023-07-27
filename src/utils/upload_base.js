import api from '@/request/api'
import { getFileMD5 } from './md5'

/**
 * @param file 文件
 */
async function uploadFile(file, callback = () => {}) {
  return new Promise((resolve, reject) => {
    getFileMD5(file, async (md5, chunkArr) => {
      // Bytes转kb
      let kb = (file.size / 1024).toFixed(2)
      // 转为number
      kb = Number(kb)
      const chunkSize = 1024 * 1024 * 2 // 分片大小（默认2M）
      let size = file.size // 文件大小
      let chunks = Math.ceil(size / chunkSize) // 分片总数
      let i = file.name.lastIndexOf('.')
      let suffix = i == -1 ? '' : file.name.substring(i + 1) // 文件名后缀
      let checkData = new FormData()
      checkData.append('fileMd5', md5)
      checkData.append('fileName', `${file.name}`)
      checkData.append('chunk', 0)
      checkData.append('fileSize', file.size)
      checkData.append('type', 0)
      checkData.append('suffix', suffix)
      const res = await api.fileCheck(checkData)
      if (res && res.data.code == 0) {
        resolve(res.data)
        return callback({ ...res.data, size: kb })
      }
      let allPromise = []
      let allUploadSuccess = true
      if (size > chunkSize) {
        for (let i = 0; i < chunks - 1; i++) {
          let formData = new FormData()
          formData.append('fileMd5', md5)
          formData.append('name', `${file.name}`)
          formData.append('suffix', suffix)
          formData.append('file', chunkArr[i].file)
          formData.append('chunk', i)
          formData.append('chunkSize', 1024 * 1024 * 2)
          formData.append('chunks', chunks)
          formData.append('size', size)
          allPromise.push(await api.fileUpload(formData))
        }
        let res = await Promise.all(allPromise)
        let errorIndex = 0
        allPromise = []
        res.forEach(async (item) => {
          if (!item.data || item.data.code !== 50007)
            allPromise.push(await api.fileUpload(item.config.data))
        })
        // 重传
        if (allPromise.length > 0) {
          res = await Promise.all(allPromise)
          res.forEach((item, index) => {
            if (!item.data || item.data.code !== 50007) {
              allUploadSuccess = false
              errorIndex = index
            }
          })
        }
        if (!allUploadSuccess)
          reject(res[errorIndex].data || res[errorIndex].message)
        // 判断所有的分片是否上传成功，成功则上传最后一个分片
        if (allUploadSuccess) {
          let formData = new FormData()
          formData.append('fileMd5', md5)
          formData.append('name', `${file.name}`)
          formData.append('suffix', suffix)
          formData.append('file', chunkArr[chunks - 1].file)
          formData.append('chunk', chunks - 1)
          formData.append('chunkSize', 1024 * 1024 * 2)
          formData.append('chunks', chunks)
          formData.append('size', size)

          const lastChunkData = await api.fileUpload(formData)
          if (lastChunkData.data.code === 0) {
            resolve(lastChunkData.data)
            callback({ ...lastChunkData.data, size: kb })
            return true
          } else {
            reject(lastChunkData.data)
          }
        }
      } else {
        // 不分片
        let formData = new FormData()
        formData.append('fileMd5', md5)
        formData.append('name', `${file.name}`)
        // formData.append('suffix', suffix)
        formData.append('file', chunkArr[0].file)
        // formData.append('chunk', chunks - 1)
        // formData.append('chunkSize', 1024 * 1024 * 2)
        // formData.append('chunks', chunks)
        const notChunkData = await api.fileUpload(formData)
        if (notChunkData.data.code == 0) {
          resolve(notChunkData.data)
          return callback({ ...notChunkData.data, size: kb })
        } else {
          reject(notChunkData.data)
        }
      }
    })
  }).catch((err) => {
    callback({
      errMessage: err,
    })
  })
}
export { uploadFile }
