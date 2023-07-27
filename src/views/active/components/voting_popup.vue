<template>
    <el-dialog
        title="提示"
        v-model="dialogVisible"
        width="30%"
        :append-to-body="false"
        @close="cancel"
        >
        <!-- 标题 -->
        <template #header>
            <div class="header-box">{{showType==='add'?'新增投票':'修改投票'}}</div>
        </template>
        <el-form 
            :model="formData"
            :rules="formrules"
            ref="formDataRef"
            label-width="100px" 
            class="addruleForm"
        >
            <!-- 标题 -->
            <el-form-item label="标题" prop="title">
                <el-input
                        v-model="formData.title"
                        tabindex="2"
                        :clearable="true"
                        placeholder="请输入标题"
                    >
                </el-input>
            </el-form-item>
            <el-form-item label="封面" prop="cover">
                <!-- <el-input
                        v-model="formData.cover"
                        tabindex="2"
                        :clearable="true"
                        placeholder="请输入封面"
                        :src="form.coverUrl" 
                        v-if="form.coverUrl"
                        v-else
                    >
                </el-input> -->
                <el-upload class="cover-uploader" :show-file-list="false" :http-request="() => {}" :before-upload="beforeCoverUpload">
                    <img v-if="formData.coverUrl" :src="formData.coverUrl"   class="cover" />
                    <el-icon v-else  class="cover-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="最大投票量" prop="maxNumber">
                <el-input
                        v-model="formData.maxNumber"
                        tabindex="2"
                        :clearable="true"
                        placeholder="请输入最大投票量"
                    >
                </el-input>
                
            </el-form-item>
            <el-form-item label="投票类型" prop="voteType">
                <!-- <el-input
                        v-model="formData.voteType"
                        tabindex="2"
                        :clearable="true"
                        placeholder="请输入投票类型"
                    >
                </el-input> -->
                
                <el-radio-group v-model="formData.voteType">
                    <el-radio :label="'day'">day</el-radio>
                    <el-radio :label="'forever'">forever</el-radio>
                </el-radio-group>
                <!-- <el-radio-group v-model="radio">
                    <el-radio :label="3">备选项</el-radio>
                    <el-radio :label="6">备选项</el-radio>
                    <el-radio :label="9">备选项</el-radio>
                </el-radio-group> -->
                
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="define('formDataRef')">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </el-form-item>

        </el-form>
    </el-dialog>
</template>

<script>
import { ElMessage, ElLoading } from "element-plus";
import { uploadFile } from "@/utils/upload";
import tools from "@/utils/tools";
export default {
    name:'voting_popup',
    props:{
        showDlg: {
            type: Boolean,
            default: false,
        },
        editVote: {
            type: Object,
            default: {},
        },
        showType: {
            type: String,
            default: 'edit',
        },
    },
    data(){
        return{
            //弹窗
            dialogVisible:true,
            //表单参数
            formData:{
                'cover':'',
                'maxNumber':null,
                'title':'',
                'voteType':'day',
                'coverUrl':'',

            },
            radio: 3,
            formrules:{
                title: [
                    { required: true, message: "请输入标题", trigger: "blur" },
                    
                ],
                cover: [
                    { required: true, message: "请输入封面", trigger: "blur" },
                ],
                maxNumber: [
                    { required: true, message: "请输入最大投票量", trigger: "blur" },
                    {
                        pattern: /^([0-9][0-9]{0,2}|1000)$/,
                        message: "请输入正确的投票量",
                    },
                ],
                voteType: [
                    { required: true, message: "请输入投票类型", trigger: "blur" },
                ],
            },
            newPhotoList: [],
            
        }
    },
    methods:{
        //弹窗确认
        define(formName){
            
            console.log("弹窗关闭");
            let _this = this
            _this.$refs[formName].validate((valid) => {
                if(valid){
                    if(_this.showType === 'edit'){
                        _this.editvote();
                        console.log(_this.formData);
                    }else{
                        _this.addvote();
                    }

                    
                }else{
                    console.log('error submit!!');
                    return false;
                }
            })
            
        },
        //弹窗取消
        cancel(){
            console.log("弹窗关闭");
            this.$emit('handleAddAdmin')
            this.$emit('update:showDlg', false)
        },

        //修改
        async editvote(){
            let _this = this
            let params = {
                id:_this.editVote.id
            }
            _this.formData.cover && (params.cover = _this.formData.cover)
            _this.formData.maxNumber && (params.maxNumber = _this.formData.maxNumber)
            _this.formData.title && (params.title = _this.formData.title)
            _this.formData.voteType && (params.voteType = _this.formData.voteType)
            console.log(_this.$http);
            const {
                data:{code},
                data:{result}
            } = await _this.$http.VotedBackUpdate(params)
            if(code === 0 && result){
                console.log(_this.formData)
                this.$emit('handleAddAdmin')
                
            } else {
                ElMessage.error('失败')
            }
            this.$emit('update:showDlg', false)
            
        },
        //新增
        async addvote(){
            let _this = this
            let params = {
                maxNumber:Number(_this.formData.maxNumber),
                title:_this.formData.title,
                voteType:_this.formData.voteType,
                cover:_this.formData.cover,
            }
            const {
                data:{code},
                data:{result}
            } = await _this.$http.VotedBackSave(params)
            if(code === 0 && result){
                console.log(_this.formData)
                this.$emit('handleAddAdmin')
                
            } else {
                ElMessage.error('失败')
            }
            this.$emit('update:showDlg', false)
        },
        //上传
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
                    this.formData.cover = res.result.fileName;
                    this.formData.coverUrl = res.result.url;
                    this.loading.close();
                }
            });
            // console.log(this.form.filelist);
            // console.log(this.fileList)
        },


    },
    mounted(){
        let _this = this
        if(_this.showType === 'edit'){
            _this.formData = _this.editVote
            console.log(_this.formData);
        }

        
       
    }


}

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
.cover-uploader-icon{
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 193px;
    text-align: center;
}
.cover{
    width: 200px;
    height: 193px;
    display: block;
    object-fit: contain;
}




</style>
