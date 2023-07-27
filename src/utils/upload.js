import api from '@/request/api'
import { getFileMD5 } from './md5'

// 获取网龙token
export function getWlToken() {
  return new Promise((resolve, reject) => {
    api.getWlToken().then((res) => {
      if (res.data.code === 0) {
        resolve(res.data.result)
      } else {
        resolve(res.data)
      }
    })
  })
}
// 网龙文件上传检查，传入fileName与fileMd5
export function wlFileCheck(fileName, fileMd5) {
  return new Promise((resolve, reject) => {
    const checkData = new FormData()
    checkData.append('fileMd5', fileMd5)
    checkData.append('fileName', fileName)
    api
      .wlUploadFileCheck(checkData)
      .then((res) => {
        if (res.data.code === 0) {
          resolve(res.data)
        } else {
          resolve(res.data)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * @param file 文件
 */
async function uploadFile(file, callback = () => {}) {
  return new Promise((resolve, reject) => {
    getFileMD5(file, async (md5, chunkArr) => {
      // 网龙文件检查
      const wlCheckRes = await wlFileCheck(file.name, md5)
      if (wlCheckRes.code === 0) {
        resolve(wlCheckRes)
        return callback(wlCheckRes)
      }
      // 获取网龙token
      const { date, dentryId, token, policy } = ({} = await getWlToken())
      // Bytes转kb
      let kb = (file.size / 1024).toFixed(2)
      // 转为number
      kb = Number(kb)
      const chunkSize = 1024 * 1024 * 2 // 分片大小（默认2M）
      let size = file.size // 文件大小
      let chunks = Math.ceil(size / chunkSize) // 分片总数
      // 获取文件后缀
      const suffix = file.name.split('.').pop()
      let allPromise = []
      let allUploadSuccess = true
      if (size > chunkSize) {
        for (let i = 0; i < chunks - 1; i++) {
          let formData = new FormData()
          formData.append('fileMd5', md5)
          formData.append('name', `${file.name}`)
          // formData.append('suffix', suffix)
          formData.append('file', chunkArr[i].file)
          formData.append('chunk', i)
          formData.append('chunkSize', 1024 * 1024 * 2)
          formData.append('chunks', chunks)
          formData.append('size', size)
          // 网龙参数
          formData.append('date', date)
          formData.append('dentryId', dentryId)
          formData.append('token', token)
          formData.append('policy', policy)
          // 计算进度保留两位小数
          console.log('上传中', (i / chunks).toFixed(2))
          try {
            const upRes = await api.wlFileUpload(formData)
            if (!upRes.data || upRes.data.code !== 50007) {
              // console.log('upRes异常', upRes)
              allUploadSuccess = false
              resolve(upRes.data)
              return callback(upRes.data)
            } else {
              // console.log('upRes正常', upRes)
              allPromise.push(upRes)
            }
          } catch (e) {
            // console.log('上传异常')
            reject(e)
            return callback(e)
          }
        }
        let res = await Promise.all(allPromise)
        let errorIndex = 0
        allPromise = []
        res.forEach(async (item) => {
          if (!item.data || item.data.code !== 50007) {
            console.log('上传在进行')
            allPromise.push(await api.wlFileUpload(item.config.data))
          }
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
          // formData.append('suffix', suffix)
          formData.append('file', chunkArr[chunks - 1].file)
          formData.append('chunk', chunks - 1)
          formData.append('chunkSize', 1024 * 1024 * 2)
          formData.append('chunks', chunks)
          formData.append('size', size)
          // 网龙参数
          formData.append('date', date)
          formData.append('dentryId', dentryId)
          formData.append('token', token)
          formData.append('policy', policy)

          const lastChunkData = await api.wlFileUpload(formData)
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
        formData.append('chunk', 0)
        formData.append('chunkSize', size)
        formData.append('chunks', 1)
        formData.append('fileMd5', md5)
        formData.append('name', `${file.name}`)
        // formData.append('suffix', suffix)
        formData.append('file', chunkArr[0].file)
        // 网龙参数
        formData.append('date', date)
        formData.append('dentryId', dentryId)
        formData.append('token', token)
        formData.append('policy', policy)

        const notChunkData = await api.wlFileUpload(formData)
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
