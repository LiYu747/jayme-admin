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
            <!-- 名称 -->
            <el-form-item label="名称" prop="name">
                <el-input
                        v-model="formData.name"
                        tabindex="2"
                        :clearable="true"
                        placeholder="请输入名称"
                    >
                </el-input>
            </el-form-item>

            <el-form-item label="封面" prop="picture">
                <!-- <el-input
                        v-model="formData.picture"
                        tabindex="2"
                        :clearable="true"
                        placeholder="请输入图片"
                    >
                </el-input> -->

                <el-upload class="cover-uploader" :show-file-list="false" :http-request="() => {}" :before-upload="beforeCoverUpload">
                    <img v-if="formData.pictureUrl" :src="formData.pictureUrl"   class="cover" />
                    <el-icon v-else  class="cover-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>

            <!-- <el-form-item label="数量" prop="quantity">
                <el-input
                        v-model="formData.quantity"
                        tabindex="2"
                        :clearable="true"
                        placeholder="数量"
                    >
                </el-input>
            </el-form-item>
            <el-form-item label="已投数量" prop="totalQuantity">
                <el-input
                        v-model="formData.totalQuantity"
                        tabindex="2"
                        :clearable="true"
                        placeholder="请输入已投数量"
                    >
                </el-input>
            </el-form-item> -->

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
                name:'',
                picture:'',
                quantity:'',
                pictureUrl:'',
                totalQuantity:'',

            },
            formrules:{
                name: [
                    { required: true, message: "请输入名称", trigger: "blur" },
                ],
                picture: [
                    { required: true, message: "请输入图片", trigger: "blur" },
                ],
                quantity: [
                    { required: true, message: "请输入数量", trigger: "blur" },
                ],
                pictureUrl: [
                    { required: true, message: "请输入图片地址", trigger: "blur" },
                ],
                totalQuantity: [
                    { required: true, message: "请输入已投数量", trigger: "blur" },
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
            _this.formData.name && (params.name = _this.formData.name)
            _this.formData.picture && (params.picture = _this.formData.picture)
            console.log(_this.$http);
            const {
                data:{code},
                data:{result}
            } = await _this.$http.VoteItemBackUpdate(params)
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
                voteId:Number(_this.$route.query.id),
                // maxNumber:Number(_this.formData.maxNumber),
                // title:_this.formData.title,
                // voteType:_this.formData.voteType,
                // cover:_this.formData.cover,quantity
                voteItemVOS:[
                    {
                        name:_this.formData.name,
                        picture:_this.formData.picture
                    }
                ]
            }
            console.log(params);
            const {
                data:{code},
                data:{result}
            } = await _this.$http.VoteItemBackSave(params)
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
                    this.formData.picture = res.result.fileName;
                    this.formData.pictureUrl = res.result.url;
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
