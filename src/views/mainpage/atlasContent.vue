<template>
<div class="box">
    <div class="c-header">
        <div style="margin-bottom: 1rem;">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/atlasManage' }">图集管理</el-breadcrumb-item>
            <el-breadcrumb-item>图集详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-upload class="cover-uploader" :multiple="true" :show-file-list="false" :http-request="() => {}" :before-upload="beforeCoverUpload">
            <el-button type="primary" >上传图片</el-button>
        </el-upload>
    </div>
    <div class="c-body">
        <el-card class="box-card" v-for="it in listData">
            <template #header>
              <div class="card-header">
                <span>ID: {{it.id}}</span>
                <el-link :underline="false" type="danger" @click="deleteRow(it)">删除</el-link>
              </div>
            </template>
            <div style="width: 300px; height: 300px" @click="showPicture(it)">
                <!-- :preview-src-list="[it.pictureUrl]" -->
                <el-image style="width: 300px; height: 300px" :src="it.pictureUrl" fit="cover" :preview-src-list="[thumbnailurl] "   />
            </div>            
        </el-card>
    </div>
    <div class="c-footer">
        <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            :background="true"
            @current-change="handleCurrentChange"
          />
    </div>

    <addGallerytype
      v-if="addDialogVisible"
      :dialogVisible.sync="addDialogVisible"
      :rowData="editRowData"
      @update:dialogVisible="updateAddDialogVisible"
    >  
    </addGallerytype>
</div>
</template>
<script>
import { UploadFile, ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { ArrowRight, ArrowRightBold } from "@element-plus/icons-vue";
import { uploadFile } from "@/utils/upload";
import { getLocalStorage, setLocalStorage } from "@/utils/index";
import tools from "./../../utils/tools";

import addGallerytype from "./components/add-gallerytype";

export default {
    name: "atlasManage",
    components: {
        addGallerytype
    },
    data() {
        return {
            tools,
            userInfo: {},
            currentPage: 1,
            pageSize: 10,
            total: 0,
            listData:[],
            addDialogVisible:false,
            editRowData: null,
            thumbnail:'',
            thumbnailurl:''
        };
    },
    methods: {
        handleCurrentChange(val){
            console.log(val);
            this.currentPage = val
            this.getList()
        },        
        getList(){
            let _self = this;

            let from = {
                galleryTypeId: this.$route.params.id,
                page: this.currentPage - 1,
                size: this.pageSize,
                sort: "createdAt,desc",
            };
            _self.$http.findAllGallery(from).then((res) => {
                console.log(res);
                this.listData = res.data.result.content;
                this.total = res.data.result.totalElements;
            });
        }, 
        updateAddDialogVisible(newValue){
            this.addDialogVisible = newValue;
            this.currentPage = 1;
            this.getList();
        },        
        beforeCoverUpload(file) {
          console.log(file);
          let _self = this;
        //   if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        //     ElMessage.error('图片只能是JPG或PNG格式！')
        //     return false
        //   }
          const fileType = file.type.substring(
                file.type.lastIndexOf("/") + 1,
                file.type.length
          ).toLowerCase();
          let type = 
                fileType == "jpg" ||
                fileType == "jpeg" ||
                fileType == "png"
          if(!type){
            ElMessage.error('图片只能是JPG或PNG格式！')
          } else {

          

        //   this.loading = ElLoading.service({
        //     lock: true,
        //     text: "正在上传...",
        //     background: "rgba(0, 0, 0, 0.7)",
        //   });
          // console.log(this.form.filelist);
            uploadFile(file, async (res) => {
                console.log(res);
                if (res.code == 0) {
                // this.form.cover = res.result.fileName;
                // this.form.coverUrl = res.result.url;
                    let ret = null;
                    let ret1 = null;
                    ret = await _self.$http.addGallery({
                        galleryTypeId: this.$route.params.id,
                        picture: res.result.fileName
                    })
                    console.log(ret);
                    
                    if(ret.data.code == 0){
                        // ElMessage({
                        //     type: "success",
                        //     message: "操作成功",
                        // });
                        _self.thumbnail = res.result.fileName
                        console.log(res.result.fileName);
                        console.log(_self.thumbnail);
                        // ret1 = await _self.$http.ImageRelationSave({
                        //     artworkMaster:res.result.fileName
                        // })
                       
                        _self.$http.operateLogSave({
                        operateLogType: 'ADMIN_OPT',
                        detail:`管理员 [${_self.userInfo.name}] 上传了新的图片`
                        })
                        this.currentPage = 1;
                        this.getList();
                    }
                    else{
                        ElMessage({
                            type: "info",
                            message: `操作失败，原因：${ret.data.msg}`,
                        });
                    }
                    this.loading.close();
                }
            });

        }
          // console.log(this.form.filelist);
          // console.log(this.fileList)
        },
        async deleteRow(row){
            console.log(row)
            let _self = this;
            // this.$router.push(`/galleryType/${row.id}`)
            let ret = null;
            ret = await _self.$http.deleteGallery({
                id: row.id
            })
            console.log(ret);
            if(ret.data.code == 0){
                ElMessage({
                    type: "success",
                    message: "操作成功",
                });
                _self.$http.operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:`管理员 [${_self.userInfo.name}] 删除了图片[id: ${row.id}]`
                })
                this.currentPage = 1;
                this.getList();
            }
            else{
                ElMessage({
                    type: "info",
                    message: `操作失败，原因：${ret.data.msg}`,
                });
            }
        },

        async showPicture(type){
            console.log(type);
            let _self = this;
            // this.$router.push(`/galleryType/${row.id}`)
            let ret = null;
            ret = await _self.$http.FindByThumbnail({
                thumbnail:type.picture
            })
            if(ret.data.code == 0){
                console.log(ret.data);
                _self.thumbnailurl = ret.data.result.url
            }
            else{
                ElMessage({
                    type: "info",
                    message: `操作失败，原因：${ret.data.msg}`,
                });
            }
        }
    },
    mounted() {
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        this.getList();
    },
    computed: {},
};
</script>
<style lang="less" scoped>
.box{
    display: flex;
    height: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
    flex-direction: column;
    .c-header{
        padding: 1rem 0;
        :deep(.el-upload){
            border: none;
        }
    }
    .c-body{
        flex: 1;
        :deep(.el-card__body){
            padding: 0;
        }
        /*display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;*/
    }
    .c-footer{
        display: flex;
        justify-content: flex-end;
        padding: 0.5rem 0;
    }
    .handle{
        .el-link{
            margin-right: 0.5rem;
        }
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .box-card{
        width: 300px;
        display: inline-block;
        margin-right: 1rem;
        margin-bottom: 1rem;
    }
}
</style>