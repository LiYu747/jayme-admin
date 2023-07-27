<template>
    <el-dialog class="addDialog" :model-value="dialogVisible" width="800px" :append-to-body="true" :before-close="closeDialog">
        <template #header>
            <div class="header-box">
                {{ rowData ? '编辑' : '新增资讯' }}
            </div>
        </template>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="addform">
            <el-form-item label="封面" prop="cover">
                <el-upload class="cover-uploader" :show-file-list="false" :http-request="() => {}" :before-upload="beforeCoverUpload">
                    <img v-if="form.coverUrl" :src="form.coverUrl" class="cover" />
                    <el-icon v-else class="cover-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
                <div class="tips-label">建议尺寸为1080*455或等比例尺寸</div>
            </el-form-item> 
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item> 
            <el-form-item label="简介" prop="introduction">
                <el-input v-model="form.introduction" type="textarea" :rows="3" resize="none"></el-input>
            </el-form-item> 
            <el-form-item label="文章连接" prop="link">
                <el-input v-model="form.link"></el-input>
            </el-form-item> 
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">{{ rowData ? '更新' : '创建' }}</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { UploadFile, ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { ArrowRight, ArrowRightBold } from "@element-plus/icons-vue";
import { uploadFile } from "@/utils/upload";
import { getLocalStorage, setLocalStorage } from "@/utils/index";
import tools from "@/utils/tools";
export default {
  name: "addNews",
  props: {
    dialogVisible: Boolean,
    rowData: Object
  },
  data() {
    return {
      tools,
      form:{
        "cover": "",
        "introduction": "",
        "link": "",
        "releaseTime": 0,
        "title": ""
      },
      rules:{
        title:[{ required: true, message: '请输入标题', trigger: 'blur' }],
        cover:[{ required: true, message: '请上传封面', trigger: 'blur' }],
        introduction:[{ required: true, message: '请输入简介', trigger: 'blur' }],
        link:[{ required: true, message: '文章连接', trigger: 'blur' }],
        // title:[{ required: true, message: '请输入标题', trigger: 'blur' }]
      }
    };
  },
  methods: {
    closeDialog() {
      console.log("弹窗关闭");
      this.$emit('update:dialogVisible', false)
    },
    submitForm(formName) {
      let _self = this;
      console.log(_self.form)
      _self.$refs[formName].validate(async (valid) => {
        console.log(valid)
        if(valid){

            let ret = null;
            if (_self.rowData) {
                ret = await _self.$http.modifyInformation(_self.form)
            }
            else{
                ret = await _self.$http.addInformation(_self.form)
            }
            console.log(ret);
            if(ret.data.code == 0){
                ElMessage({
                    type: "success",
                    message: "操作成功",
                });
                if (_self.rowData) {
                    _self.$http.operateLogSave({
                      operateLogType: 'ADMIN_OPT',
                      detail:`管理员 [${_self.userInfo.name}] 编辑了资讯[${_self.form.title}]`
                    })
                }
                else{
                    _self.$http.operateLogSave({
                      operateLogType: 'ADMIN_OPT',
                      detail:`管理员 [${_self.userInfo.name}] 新增了资讯[${_self.form.title}]`
                    })
                }
                    
                _self.$emit('update:dialogVisible', false)
            }
            else{
                ElMessage({
                    type: "info",
                    message: `操作失败，原因：${ret.data.msg}`,
                });
            }
            
        }
      })
    },
    beforeCoverUpload(file) {
      console.log(file);
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        ElMessage.error('封面只能是JPG或PNG格式！')
        return false
      }
      this.loading = ElLoading.service({
        lock: true,
        text: "正在上传...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // console.log(this.form.filelist);
      uploadFile(file, async (res) => {
        console.log(res);
        if (res.code == 0) {
          this.form.cover = res.result.fileName;
          this.form.coverUrl = res.result.url;
          this.loading.close();
        }
      });
      // console.log(this.form.filelist);
      // console.log(this.fileList)
    },
    addQues(){
      let _self = this;
      _self.answersList.push({"text": "", "is_right": false});
    },
    removeQues(idx){
      let _self = this;
      console.log(`removeQues:${idx}`);
      _self.answersList.splice(idx, 1);
      console.log(_self.answersList)
    }
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if(this.rowData){
        this.form = this.rowData
    }
    // this.activeName = 'second'
    // this.activeName = "first";
    // console.log("123");
  },
  computed: {
  },
};
</script>

<style lang="less" scoped>
.cover-uploader{
    /*border: 1px dashed var(--el-border-color);*/
    /*border-radius: 6px;*/
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}
.cover{
    width: 540px;
    height: 227px;
    display: block;
    object-fit: contain;
}
.cover-uploader-icon{
    font-size: 28px;
    color: #8c939d;
    width: 540px;
    height: 227px;
    text-align: center;
}
.tips-label{
    color: #888;
}
</style>
