import {getFileMD5} from './md5'
import Vue from 'vue'
import api from '../request/api'
// let token = JSON.parse(localStorage.getItem('userInfo')).access_token,
// 	checkUrl = Vue.prototype.URLserver + '/common/file/check',//校验路径
//     uploadUrl = Vue.prototype.URLserver + '/common/file/upload';//不分片上传路径
    // generateUploadId = Vue.prototype.URLserver + '/common/file/generateUploadId',//生成分片上传唯一标识
    // chunkUpload = Vue.prototype.URLserver + '/common/file/chunkUpload',//分片上传路径
    // completeUpload = Vue.prototype.URLserver + '/common/file/completeUpload';//合并分片路径
    //原来分片上传
function beforeRevision(file,callback,test){
    const loading = Vue.prototype.$loading({
        lock: true,
        text: file.file.size>2097152?0:'加载中.....',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    getFileMD5(file.file, async (md5,chunkArr) => {
        let formData_check = new FormData();//校验参数
        let formData_upload = new FormData();//上传参数
        formData_check.append('type',null);//0为未分片，1为分片
        formData_check.append('fileSize',file.file.size);//文件总大小
        // formData_check.append('fileName',file.file.name);//文件名
        formData_check.append('fileName',md5+'.'+file.file.name.split('.')[file.file.name.split('.').length-1]);//文件名
        formData_check.append('fileMd5',md5);//文件md5
        
        // formData_upload.append('name',file.file.name);
        formData_upload.append('name',md5+'.'+file.file.name.split('.')[file.file.name.split('.').length-1]);
        formData_upload.append('size',file.file.size);
        formData_upload.append('file',null);//分片文件
        formData_upload.append('chunkSize',2097152);//设置分片的大小
        formData_upload.append('fileMd5',md5);
        if(file.file.size>2097152){
            //分片上传
            formData_check.set('type',1);
            formData_check.append('chunkSize',null);//每一片的大小
            formData_check.append('chunk',null);//分片下标
            formData_upload.append('chunk',null);//分片下标
            formData_upload.append('chunks',Math.ceil(file.file.size / 2097152));//总片数
            for(var i=0;i<chunkArr.length;i++){
                formData_check.set('chunk',i);
                formData_upload.set('file',chunkArr[i].file);
                formData_check.set('chunkSize',chunkArr[i].currentSize);
                formData_upload.set('chunk',i);
                loading.text=((i/chunkArr.length)*100).toFixed(0)+'%'
                // let checkout = await Vue.prototype.$axios({method: 'post',url: checkUrl,headers: {Authorization:token,},data:formData_check});
                let checkout = await api.knobbleFileCheck(formData_check)
                if(checkout.data.code === 0){
                    if(test == 'compress'){
                        callback(checkout.data.result)
                        
                        loading.close();
                    }else{
                        callback(checkout.data.result)
                        loading.close();
                        // Vue.prototype.$message({
                        //     type: "success",
                        //     message: '文件上传成功'
                        // });
                    }
                    break; 
                    // continue;
                }else {
                    // let affirm = await Vue.prototype.$axios({method: 'post',url: uploadUrl,headers: {Authorization:token,},data:formData_upload}); 
                    let affirm = await api.knobbleFileUpload(formData_upload)
                    if(affirm.data.code === 0){
                        if(test == 'compress'){
                            callback(affirm.data.result)
                            loading.close();
                        }else{
                            callback(affirm.data.result)
                            Vue.prototype.$set(affirm.data.result)
                            loading.close();
                            // Vue.prototype.$message({
                            //     type: "success",
                            //     message: '文件上传成功'
                            // });
                        }
                    }
                }
            }
        }else{
            //未分片上传
            formData_check.set('type',0);
            formData_upload.set('file',file.file);
            // let checkout = await Vue.prototype.$axios({method: 'post',url: checkUrl,headers: {Authorization:token,},data:formData_check});
            let checkout = await api.knobbleFileCheck(formData_check)
            if(checkout.data.code === 0){
                if(test == 'compress'){
                    callback(checkout.data.result)
                    loading.close();

                }else{
                    callback(checkout.data.result)
                    loading.close();
                    // Vue.prototype.$message({
                    //     type: "success",
                    //     message: '文件上传成功'
                    // });
                }
            }else{      
                // let affirm = await Vue.prototype.$axios({method: 'post',url: uploadUrl,headers: {Authorization:token,},data:formData_upload}); 
                let affirm = await api.knobbleFileUpload(formData_upload)
                if(affirm.data.code === 0){
                    if(test == 'compress'){
                        callback(affirm.data.result)
                        loading.close();
                    }else{
                        callback(affirm.data.result)
                        loading.close();
                        // Vue.prototype.$message({
                        //     type: "success",
                        //     message: '文件上传成功'
                        // });
                    }
                }else{
                        loading.close();
                    Vue.prototype.$message({
                        type: "error",
                        message: '文件上传失败'
                    });
                }
            }
        }
    })
}
export {  
    beforeRevision,
} 