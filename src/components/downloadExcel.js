//excel  下载
/* eslint-disable */
// import Vue from 'vue'
import { ElMessage, ElLoading } from 'element-plus';
function pubilcDownload(form, apiUrl, cb) {
    // Vue.prototype.$confirm('是否确定下载?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    // }).then(() => {
    //     Vue.prototype.$http.exportExcel(form, apiUrl).then((res) => {
    //         if (res.data.code == 0) {
    //             let loading = ElLoading.service({
    //                 lock: true,
    //                 text: '加载中……',
    //                 background: 'rgba(0, 0, 0, 0.7)'
    //             })
    //             // 轮询判断是否完成
    //             let timer = setInterval(() => {
    //                 Vue.prototype.$http.getExcelTask({ id: res.data.result.id }).then((taskRes) => {
    //                     // console.error(taskRes);
    //                     if (!taskRes.data.result) {
    //                         loading.close();
    //                         clearInterval(timer);
    //                         return Vue.prototype.$message({
    //                             type: 'error',
    //                             message: '导出失败'
    //                         });;
    //                     };
    //                     const { complete, success, errMsg, fileName, fileRelativeUrl } = taskRes.data.result;
    //                     if (taskRes.data.code == 0) {
    //                         if (complete) {
    //                             loading.close();
    //                             clearInterval(timer);
    //                             if (success) {
    //                                 Vue.prototype.$http.fileDownload({ fileName: fileName,filePathName:fileRelativeUrl}).then(res=>{
    //                                     console.log(res)
    //                                     if(res.status == 200){
    //                                         let blob = new Blob([res.data], {type: "application/vnd.ms-excel"}); 
    //                                         const blobUrl = window.URL.createObjectURL(blob)
    //                                         const eleLink = document.createElement('a');
    //                                         eleLink.download = fileName;
    //                                         eleLink.style.display = 'none';
    //                                         eleLink.href = blobUrl;
    //                                         // 触发点击
    //                                         document.body.appendChild(eleLink);
    //                                         eleLink.click();
    //                                         // 然后移除
    //                                         document.body.removeChild(eleLink);
    //                                         cb();
    //                                     }else{
    //                                         Vue.prototype.$message({
    //                                             type: 'error',
    //                                             message: `${errMsg}`
    //                                         });
    //                                     }
                                        
    //                                 })
    //                             } else {
    //                                 Vue.prototype.$message({
    //                                     type: 'error',
    //                                     message: `${errMsg}`
    //                                 });
    //                             }
    //                         }
    //                     }
    //                 }).catch(() => {
    //                     loading.close();
    //                     clearInterval(timer);
    //                 })
    //             }, 2000);
    //         } else {
    //             Vue.prototype.$message({
    //                 type: 'error',
    //                 message: '导出失败'
    //             });
    //         }
    //         // var reader = new FileReader()
    //         // reader.readAsDataURL(res.data)      
    //         // reader.onload = function (e) { 
    //         //     var a = document.createElement('a'); 
    //         //     a.download = fileName; 
    //         //     a.href = e.target.result; 
    //         //     document.body.appendChild(a);
    //         //     a.click(); 
    //         //     document.body.appendChild(a);
    //         //     // 执行回调
    //         //     cb();
    //         // }  
    //     })

    // })
    //     .catch(() => {
    //         Vue.prototype.$message({
    //             type: 'info',
    //             message: '已取消下载'
    //         });
    //     })
}

async function setTimer(saleId, token, fileName) {
    // console.log(fileName)
    // let fileFunName = fileName;
    // let timer;
    // const loading = Vue.prototype.$loading({
    //     lock: true,
    //     text: '加载中……',
    //     background: 'rgba(0, 0, 0, 0.7)'
    // })
    // let download = await Vue.prototype.$axios({ method: 'get', url: Vue.prototype.URLserver + '/back/asyncTask/getAsyncTask', params: { id: saleId }, headers: { Authorization: token } })
    // if (download.data.code === 0) {
    //     if (download.data.result.success && !download.data.result.complete) {
    //         timer = setTimeout(() => {
    //             setTimer(saleId)
    //         }, 5000)
    //     } else if (download.data.result.success && download.data.result.complete) {
    //         loading.close();
    //         clearTimeout(timer)
    //         var $a = document.createElement('a');
    //         $a.setAttribute("href", download.data.result.fileUrl);
    //         // console.log(fileName)
    //         $a.setAttribute("download", 'sssss.xlsx');
    //         document.body.appendChild($a);
    //         $a.click();
    //         document.body.removeChild($a);


    //     } else if (!download.data.result.success) {
    //         loading.close();
    //         Vue.prototype.$message({
    //             type: "error",
    //             message: '下载失败'
    //         });
    //         clearTimeout(timer)
    //     }
    // } else {
    //     Vue.prototype.$message({
    //         type: "error",
    //         message: download.data.msg
    //     });
    // }
}

function test(obj) {
    let str = ''
    for (var name in obj) {
        if (obj[name]) {
            str += name + '=' + obj[name] + '&';
        }
    }
    return str
}
export {
    pubilcDownload
}
