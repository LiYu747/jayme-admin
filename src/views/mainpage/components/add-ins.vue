<template>
  <el-dialog
    class="addDialog"
    :model-value="dialogVisible"
    width="800px"
    :append-to-body="true"
    :before-close="closeDialog"
  >
    <template #header>
      <div class="header-box">
        {{ rowData ? '编辑' : '上传Ins' }}
      </div>
    </template>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      class="addform"
    >
      <!-- 资源 -->
      <el-form-item label="Ins" prop="insFiles">
        <el-upload
          class="cover-uploader"
          :show-file-list="false"
          :http-request="() => {}"
          :before-upload="beforeCoverUpload"
        >
          <!-- <img  :src="form.insFiles" class="cover" /> -->
          <div class="cover-uploader-scope">
            <div v-for="ins in form.insFiles" class="cover-item">
              <img
                v-if="ins.fileType == 'PICTURE'"
                :src="ins.fileUrl"
                class="cover"
              />
              <video
                v-else-if="ins.fileType == 'VIDEO'"
                :src="ins.fileUrl"
                style="width: 355px; height: 200px"
                controls
              ></video>
            </div>
          </div>
          <template #trigger>
            <!-- <el-icon class="cover-uploader-icon" >
                                <Plus />
                            </el-icon> -->
            <el-button type="primary">选择文件</el-button>
          </template>
        </el-upload>
      </el-form-item>
      <!-- 标签 -->
      <el-form-item label="标签" class="tag-box">
        <el-input placeholder="" clearable :style="{ width: '100%' }">
          <p class="mr-10px" slot="suffix">
            还可以添加{{ 6 - dynamicTags.length }}个标签
          </p>
        </el-input>
        <div class="tag-list">
          <div :key="tag" v-for="tag in dynamicTags" class="tag-item">
            <span class="tag-text">{{ tag }}</span>
            <el-icon
              style="cursor: pointer"
              size="20"
              @click.stop="handleClose(tag)"
              ><Close
            /></el-icon>
          </div>
          <el-input
            v-if="!inputVisible && dynamicTags.length <= 6"
            :disabled="dynamicTags.length >= 6"
            :placeholder="`${
              dynamicTags.length >= 6 ? '' : '按回车键Enter创建标签'
            }`"
            class="tag-input"
            v-model="inputTagValue"
            :maxlength="15"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
        </div>
      </el-form-item>
      <!-- 内容 -->
      <el-form-item label="内容" prop="content">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="form.content"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">{{
          rowData ? '更新' : '创建'
        }}</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { UploadFile, ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { ArrowRight, ArrowRightBold } from '@element-plus/icons-vue'
import { uploadFile } from '@/utils/upload'
import { getLocalStorage, setLocalStorage } from '@/utils/index'
import tools from '@/utils/tools'
export default {
  name: 'addIns',
  props: {
    dialogVisible: Boolean,
    rowData: Object,
  },
  data() {
    return {
      tools,
      currentPage: 1,
      pageSize: 10,
      total: 100,
      form: {
        insFiles: [],
      },
      tableData: [],
      rules: {
        // title:[{ required: true, message: '请输入标题', trigger: 'blur' }],
        // poster:[{ required: true, message: '请上传封面', trigger: 'blur' }],
        // link:[{ required: true, message: '请选择一个连接地址', trigger: 'blur' }],
        // title:[{ required: true, message: '请输入标题', trigger: 'blur' }]
      },
      dynamicTags: [],
      inputTagValue: '',
      inputVisible: false,
    }
  },
  watch: {
    'form.bannerType': function (val, oldVal) {
      console.log(val, oldVal)
      this.currentPage = 1
      this.getList()
    },
  },
  methods: {
    closeDialog() {
      console.log('弹窗关闭')
      this.$emit('update:dialogVisible', false)
    },
    handlePaginationChange(val) {
      this.currentPage = val
      this.getList()
    },
    handleTableCurrentChange(row) {
      let _self = this
      console.log('handleTableCurrentChange')
      console.log(row)
      _self.form.link = row.id
      if (_self.form.bannerType == 'INS') {
        _self.form.content = row.id
      } else if (_self.form.bannerType == 'GALLERY') {
        _self.form.content = row.name
      } else if (_self.form.bannerType == 'INFORMATION') {
        _self.form.content = row.title
      } else if (_self.form.bannerType == 'VOTE') {
        _self.form.content = row.id
      } else if (_self.form.bannerType == 'JAYME_OFFICIAL_ACCOUNTS_ARTICLE') {
        _self.form.content = ''
      }
    },
    getList() {
      console.log('getList')
      let _self = this
      let from = {
        // parentId: this.parentId,.
        page: this.currentPage - 1,
        size: this.pageSize,
        sort: 'createdAt,desc',
      }
      if (_self.form.bannerType == 'INS') {
        _self.$http.findAllIns(from).then((res) => {
          console.log(res)
          this.tableData = res.data.result.content
          this.total = res.data.result.totalElements
        })
      } else if (_self.form.bannerType == 'GALLERY') {
        _self.$http.findAllGalleryType(from).then((res) => {
          console.log(res)
          this.tableData = res.data.result
          this.total = res.data.result.totalElements
        })
      } else if (_self.form.bannerType == 'INFORMATION') {
        _self.$http.findAllInformation(from).then((res) => {
          console.log(res)
          this.tableData = res.data.result.content
          this.total = res.data.result.totalElements
        })
      } else if (_self.form.bannerType == 'VOTE') {
        _self.$http.findAllIns(from).then((res) => {
          console.log(res)
          this.tableData = res.data.result.content
          this.total = res.data.result.totalElements
        })
      }
    },
    submitForm(formName) {
      let _self = this
      // console.log(_self.form)
      console.log('_self.dynamicTags', _self.dynamicTags)
      let params = {
        ..._self.form,
        tag: _self.dynamicTags.join(','), // 标签
      }
      // console.log('params',params)
      // return
      _self.$refs[formName].validate(async (valid) => {
        console.log(valid)
        if (valid) {
          let ret = null
          if (_self.rowData) {
            ret = await _self.updateData(params)
            // if (
            //   _self.form.poster.indexOf('http://') == 0 ||
            //   _self.form.poster.indexOf('https://') == 0
            // ) {
            //   delete _self.form.poster
            // }
            // ret = await _self.$http.modifyActivity(_self.form)
          } else {
            ret = await _self.$http.addIns(params)
          }
          console.log(ret)
          if (ret.data.code == 0) {
            ElMessage({
              type: 'success',
              message: '操作成功',
            })
            if (_self.rowData) {
              _self.$http.operateLogSave({
                operateLogType: 'ADMIN_OPT',
                detail: `管理员 [${_self.userInfo.name}] 编辑了Ins[id: ${_self.form.id}]`,
              })
            } else {
              _self.$http.operateLogSave({
                operateLogType: 'ADMIN_OPT',
                detail: `管理员 [${_self.userInfo.name}] 上传了新的Ins`,
              })
            }

            _self.$emit('update:dialogVisible', false)
          } else {
            ElMessage({
              type: 'info',
              message: `操作失败，原因：${ret.data.msg}`,
            })
          }
        }
      })
    },
    // 更改数据
    updateData(data) {
      let _this = this
      console.log('updateData', data)
      const { id, content, insFiles, tag } = ({} = data)
      const tempInsFiles = insFiles.map((item) => {
        return {
          fileType: item.fileType,
          file: item.file,
        }
      })
      let params = {
        id,
        content,
        tag,
        insFiles: tempInsFiles,
      }
      // console.log('params', params)
      // return
      return new Promise(async (resolve, reject) => {
        const res = await _this.$http.modifyIns(params)
        resolve(res)
      })
    },
    beforeCoverUpload(file) {
      console.log(file)
      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/png' &&
        file.type !== 'video/mp4'
      ) {
        ElMessage.error('只能上传JPG、PNG、MP4格式！')
        return false
      }
      this.loading = ElLoading.service({
        lock: true,
        text: '正在上传...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      // console.log(this.form.filelist);
      uploadFile(file, async (res) => {
        console.log(res)
        if (res.code == 0) {
          // this.form.poster = res.result.fileName;
          // this.form.posterUrl = res.result.url;
          let fileType = 'PICTURE'
          if (file.type == 'video/mp4') {
            fileType = 'VIDEO'
          }

          this.form.insFiles.push({
            fileType: fileType,
            file: res.result.fileName,
            fileUrl: res.result.url,
          })
          this.loading.close()
        } else {
          this.loading.close()
        }
      })
      // console.log(this.form.filelist);
      // console.log(this.fileList)
    },
    addQues() {
      let _self = this
      _self.answersList.push({ text: '', is_right: false })
    },
    removeQues(idx) {
      let _self = this
      console.log(`removeQues:${idx}`)
      _self.answersList.splice(idx, 1)
      console.log(_self.answersList)
    },
    handleInputConfirm() {
      if (this.dynamicTags.indexOf(this.inputTagValue) !== -1) {
        this.$message.warning('已存在该标签')
        return
      }
      let inputValue = this.inputTagValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputTagValue = ''
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.rowData) {
      const { tag = '' } = ({} = this.rowData)
      this.form = this.rowData
      this.form.posterUrl = this.form.poster
      this.dynamicTags = tag ? tag.split(',') : []
    }
    // this.activeName = 'second'
    // this.activeName = "first";
    // console.log("123");
  },
  computed: {},
}
</script>

<style lang="less" scoped>
.cover-uploader {
  /*border: 1px dashed var(--el-border-color);*/
  /*border-radius: 6px;*/
  /*width: 360px;*/
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.cover {
  width: 200px;
  height: 200px;
  display: block;
  object-fit: contain;
}
.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  text-align: center;
  margin: 4px;
}
.cover-uploader-scope {
  display: flex;
  flex-direction: column;
}
.cover-item {
  display: inline-block;
  margin: 4px;
}
.tips-label {
  color: #888;
}
:deep(.tag-input .el-input__inner) {
  background: transparent !important;
  border: none !important;
  box-shadow: none;
}
:deep(.tag-input .el-input__wrapper) {
  box-shadow: none;
}
// 标签
.tag-box {
  position: relative;
  .tag-list {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    position: absolute;
    padding: 0 3px;
    top: 0;

    .tag-item {
      margin-right: 6px;
      height: 28px;
      min-width: 60px;
      line-height: 28px;
      background: #6ea8fe;
      color: #fff;
      border-radius: 0.375rem;
      padding: 0 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      .tag-text {
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        margin-right: 4px;
      }
    }
  }
}
</style>
