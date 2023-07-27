<template>
    <el-dialog class="addDialog" :model-value="dialogVisible" width="800px" :append-to-body="true" :before-close="closeDialog">
        <template #header>
            <div class="header-box">
                {{ rowData ? '编辑' : '新增Banner' }}
            </div>
        </template>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="addform">
            <el-form-item label="封面" prop="poster">
                <el-upload class="cover-uploader" :show-file-list="false" :http-request="() => {}" :before-upload="beforeCoverUpload">
                    <img v-if="form.posterUrl" :src="form.posterUrl" class="cover" />
                    <el-icon v-else class="cover-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>                
            </el-form-item> 
            <el-form-item>
                <div class="tips-label">建议尺寸为1172*1132、800*772或等比例尺寸</div>
            </el-form-item> 
            <el-form-item label="内容类型" prop="bannerType">
                <el-radio-group v-model="form.bannerType" class="ml-4">
                  <el-radio label="JAYME_OFFICIAL_ACCOUNTS_ARTICLE">公众号文章</el-radio>
                  <el-radio label="INS">Ins</el-radio>
                  <el-radio label="GALLERY">高清图集</el-radio>
                  <el-radio label="INFORMATION">新闻资讯</el-radio>
                  <el-radio label="VOTE">投票</el-radio>
                  <el-radio label="NOT_HAVE">无连接</el-radio>
                  <el-radio label="LUCKY_DRAW">抽奖</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="链接地址" prop="link" v-if=" form.bannerType != 'NOT_HAVE' && form.bannerType != 'LUCKY_DRAW' ">
                <el-input v-model="form.link" v-if=" form.bannerType == 'JAYME_OFFICIAL_ACCOUNTS_ARTICLE' "></el-input>
                <div v-else-if=" form.bannerType == 'INS' " style="width: 100%">
                      <el-table :data="tableData" style="width: 100%" highlight-current-row @current-change="handleTableCurrentChange">
                        <el-table-column width="50" >
                          <template #default="scope">
                            <el-icon color="#409EFF" v-if="form.link == scope.row.id"><Select /></el-icon>
                          </template>
                        </el-table-column>
                        <el-table-column prop="id" label="ID" width="60" />
                        <el-table-column label="Ins">
                          <template #default="scope">
                            {{ scope.row.content || "暂无" }}
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination small style="margin-top: 0.5rem;" v-model:current-page="currentPage" v-model:page-size="pageSize" layout="prev, pager, next" :total="total" :background="true" @current-change="handlePaginationChange" />
                </div>
                <div v-else-if=" form.bannerType == 'GALLERY' " style="width: 100%">
                      <el-table :data="tableData" style="width: 100%" highlight-current-row @current-change="handleTableCurrentChange">
                        <el-table-column width="50" >
                          <template #default="scope">
                            <el-icon color="#409EFF" v-if="form.link == scope.row.id"><Select /></el-icon>
                          </template>
                        </el-table-column>
                        <el-table-column prop="id" label="ID" width="60" />
                        <el-table-column prop="name" label="图集分类" />
                      </el-table>
                </div>
                <div v-else-if=" form.bannerType == 'INFORMATION' " style="width: 100%">
                      <el-table :data="tableData" style="width: 100%" highlight-current-row @current-change="handleTableCurrentChange">
                        <el-table-column width="50" >
                          <template #default="scope">
                            <el-icon color="#409EFF" v-if="form.link == scope.row.id"><Select /></el-icon>
                          </template>
                        </el-table-column>
                        <el-table-column prop="id" label="ID" width="60" />
                        <el-table-column prop="title" label="资讯标题" />
                      </el-table>
                      <el-pagination small style="margin-top: 0.5rem;" v-model:current-page="currentPage" v-model:page-size="pageSize" layout="prev, pager, next" :total="total" :background="true" @current-change="handlePaginationChange" />
                </div>
                <div v-else-if=" form.bannerType == 'VOTE' " style="width: 100%">
                      <el-table :data="tableData" style="width: 100%" highlight-current-row @current-change="handleTableCurrentChange">
                        <el-table-column width="50" >
                          <template #default="scope">
                            <el-icon color="#409EFF" v-if="form.link == scope.row.id"><Select /></el-icon>
                          </template>
                        </el-table-column>
                        <el-table-column prop="id" label="ID" width="60" />
                        <el-table-column prop="title" label="标题" />
                        <el-table-column prop="maxNumber" label="最大投票数量" />
                      </el-table>
                      <el-pagination small style="margin-top: 0.5rem;" v-model:currentPage="currentPage" v-model:page-size="pageSize" layout="prev, pager, next" :total="total" :background="true" @current-change="handlePaginationChange" />
                </div>
            </el-form-item>  
            <el-form-item label="排序" prop="serialNumber" v-if="rowData">
                <el-input-number v-model="form.serialNumber" :min="1" step-strictly></el-input-number>
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
  name: "addBanner",
  props: {
    dialogVisible: Boolean,
    rowData: Object
  },
  data() {
    return {
      tools,
      currentPage: 1,
      pageSize: 10,
      total: 100,
      form:{
        "poster": "",
        "bannerType": "JAYME_OFFICIAL_ACCOUNTS_ARTICLE",
        "name": "Banner",
        "link": "",
        "serialNumber": 1
      },
      tableData:[
      ],
      rules:{
        title:[{ required: true, message: '请输入标题', trigger: 'blur' }],
        poster:[{ required: true, message: '请上传封面', trigger: 'blur' }],
        // link:[{ required: true, message: '请选择一个连接地址', trigger: 'blur' }],
        // title:[{ required: true, message: '请输入标题', trigger: 'blur' }]
      }
    };
  },
  watch:{
    'form.bannerType':function (val, oldVal){
        console.log(val, oldVal);
        this.currentPage = 1;
        this.getList();
    }
  },
  methods: {
    closeDialog() {
      console.log("弹窗关闭");
      this.$emit('update:dialogVisible', false)
    },
    handlePaginationChange(val){
        this.currentPage = val;
        this.getList();
    },
    handleTableCurrentChange(row){
        let _self = this;
        console.log("handleTableCurrentChange");
        console.log(row);
        _self.form.link = row.id;        
        if (_self.form.bannerType == 'INS') {
            _self.form.content = row.id;
        }
        else if (_self.form.bannerType == 'GALLERY') {
            _self.form.content = row.name;
        }
        else if (_self.form.bannerType == 'INFORMATION') {
            _self.form.content = row.title;
            _self.form.link = row.link;        
        }
        else if (_self.form.bannerType == 'VOTE') {
            // _self.form.content = row.id;
            _self.form.content = row.title;
        }
        else if (_self.form.bannerType == 'JAYME_OFFICIAL_ACCOUNTS_ARTICLE') {
            _self.form.content = '';
        }
    },
    getList(){
        
        let _self = this;
        console.log("getList",_self.form.bannerType);
        let from = {
            // parentId: this.parentId,.
            page: this.currentPage - 1,
            size: this.pageSize,
            sort: "createdAt,desc",
        };
        if (_self.form.bannerType == 'INS') {
            _self.$http.findAllIns(from).then((res) => {
                console.log(res);
                this.tableData = res.data.result.content;
                this.total = res.data.result.totalElements;
            });
        }
        else if (_self.form.bannerType == 'GALLERY') {
            _self.$http.findAllGalleryType(from).then((res) => {
                console.log(res);
                this.tableData = res.data.result;
                this.total = res.data.result.totalElements;
            });
        }
        else if (_self.form.bannerType == 'INFORMATION') {
            _self.$http.findAllInformation(from).then((res) => {
                console.log(res);
                this.tableData = res.data.result.content;
                this.total = res.data.result.totalElements;
            });
        }
        else if (_self.form.bannerType == 'VOTE') {
            _self.$http.VotedBackFindAll(from).then((res) => {
                console.log(res);
                this.tableData = res.data.result.content;
                this.total = res.data.result.totalElements;
            });
        }
            
    },
    submitForm(formName) {
      let _self = this;
      console.log(_self.form)
      _self.$refs[formName].validate(async (valid) => {
        console.log(valid)
        if(valid){

            let ret = null;
            if (_self.rowData) {
                if( _self.form.poster.indexOf('http://')==0 || _self.form.poster.indexOf('https://')==0 ){
                    delete _self.form.poster;
                }
                ret = await _self.$http.modifyActivity(_self.form)
            }
            else{
                ret = await _self.$http.addActivity(_self.form)
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
                      detail:`管理员 [${_self.userInfo.name}] 编辑了Banner[id: ${_self.form.id}]`
                    })
                }
                else{
                    _self.$http.operateLogSave({
                      operateLogType: 'ADMIN_OPT',
                      detail:`管理员 [${_self.userInfo.name}] 新增了Banner`
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
          this.form.poster = res.result.fileName;
          this.form.posterUrl = res.result.url;
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
        this.form = this.rowData;
        this.form.posterUrl = this.form.poster;
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
    width: 200px;
    height: 193px;
    display: block;
    object-fit: contain;
}
.cover-uploader-icon{
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 193px;
    text-align: center;
}
.tips-label{
    color: #888;
}
</style>
