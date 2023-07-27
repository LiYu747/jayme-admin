<template>
  <div class="box">
    <div class="c-header">
      <!-- <el-upload class="cover-uploader" :multiple="true" :show-file-list="false" :http-request="() => {}" :before-upload="beforeInsUpload">
            <el-button type="primary" >上传Ins</el-button>
        </el-upload> -->
      <el-button
        type="primary"
        @click="
          () => {
            addDialogVisible = true
            editRowData = null
          }
        "
        >上传Ins</el-button
      >
    </div>
    <div class="c-body">
      <el-table :data="listData" style="width: 100%; height: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="insFiles" label="Ins">
          <template #default="scope">
            <el-carousel
              :autoplay="false"
              arrow="always"
              type="card"
              height="200px"
            >
              <el-carousel-item
                v-for="ins in scope.row.insFiles"
                :key="ins.fileUrl"
              >
                <el-image
                  v-if="ins.fileType == 'PICTURE'"
                  style="width: 355px; height: 200px"
                  :z-index="99"
                  preview-teleported
                  :src="ins.fileUrl"
                  fit="contain"
                  lazy
                  :preview-src-list="[ins.fileUrl]"
                />
                <video
                  v-else-if="ins.fileType == 'VIDEO'"
                  :src="ins.fileUrl"
                  style="width: 355px; height: 200px"
                  controls
                ></video>
              </el-carousel-item>
            </el-carousel>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="fileType" label="类型" width="120">
          <template #default="scope">
            {{ getFileTypeName(scope.row.fileType) }}</template
          >
        </el-table-column> -->
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="scope">
            {{ tools.transitionTime(scope.row.createdAt) }}</template
          >
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <div class="handle">
              <!-- <el-link
                :underline="false"
                type="primary"
                @click="intoGalleryType(scope.row)"
                >查看</el-link
              >-->
              <el-link
                :underline="false"
                type="primary"
                @click="modBtn(scope.row)"
                >修改</el-link
              >
              <el-link
                :underline="false"
                type="danger"
                @click="delBtn(scope.row)"
                >删除</el-link
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
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
    <addIns
      v-if="addDialogVisible"
      :dialogVisible.sync="addDialogVisible"
      :rowData="editRowData"
      @update:dialogVisible="updateAddDialogVisible"
    >
    </addIns>
  </div>
</template>
<script>
import { UploadFile, ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { ArrowRight, ArrowRightBold } from '@element-plus/icons-vue'
import { uploadFile } from '@/utils/upload'
import { getLocalStorage, setLocalStorage } from '@/utils/index'
import tools from './../../utils/tools'

import addIns from './components/add-ins'

export default {
  name: 'insManage',
  components: {
    addIns,
  },
  data() {
    return {
      tools,
      userInfo: {},
      currentPage: 1,
      pageSize: 10,
      total: 0,
      listData: [],
      addDialogVisible: false,
      editRowData: null,
    }
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.getList()
    },
    getFileTypeName(fileType) {
      let name = ''
      switch (fileType) {
        case 'PICTURE':
          name = '图片'
          break
        case 'VIDEO':
          name = '视频'
          break
      }
      return name
    },
    getList() {
      let _self = this
      let from = {
        // parentId: this.parentId,.
        page: this.currentPage - 1,
        size: this.pageSize,
        sort: 'createdAt,desc',
      }
      _self.$http.findAllIns(from).then((res) => {
        // console.log(res)
        this.listData = res.data.result.content
        this.total = res.data.result.totalElements
      })
    },
    updateAddDialogVisible(newValue) {
      this.addDialogVisible = newValue
      this.currentPage = 1
      this.getList()
    },
    beforeInsUpload(file) {
      console.log(file)
      let _self = this
      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/png' &&
        file.type !== 'video/mp4'
      ) {
        ElMessage.error('只能上传图片或视频格式！')
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
          // this.form.cover = res.result.fileName;
          // this.form.coverUrl = res.result.url;
          // let ret = null;
          let fileType = 'PICTURE'
          if (file.type == 'video/mp4') {
            fileType = 'VIDEO'
          }
          let ret = await _self.$http.addIns({
            fileType: fileType,
            file: res.result.fileName,
          })
          console.log(ret)
          if (ret.data.code == 0) {
            // ElMessage({
            //     type: "success",
            //     message: "操作成功",
            // });
            _self.$http.operateLogSave({
              operateLogType: 'ADMIN_OPT',
              detail: `管理员 [${_self.userInfo.name}] 上传了新的Ins`,
            })
            this.currentPage = 1
            this.getList()
          } else {
            ElMessage({
              type: 'info',
              message: `操作失败，原因：${ret.data.msg}`,
            })
          }
          this.loading.close()
        }
      })
      // console.log(this.form.filelist);
      // console.log(this.fileList)
    },
    async delBtn(row) {
      console.log(row)
      let _self = this
      let ret = null
      ret = await _self.$http.deleteIns({
        id: row.id,
      })
      console.log(ret)
      if (ret.data.code == 0) {
        ElMessage({
          type: 'success',
          message: '操作成功',
        })
        _self.$http.operateLogSave({
          operateLogType: 'ADMIN_OPT',
          detail: `管理员 [${_self.userInfo.name}] 删除了Ins[id: ${row.id}]`,
        })
        this.currentPage = 1
        this.getList()
      } else {
        ElMessage({
          type: 'info',
          message: `操作失败，原因：${ret.data.msg}`,
        })
      }
    },
    // 编辑
    modBtn(item) {
      this.addDialogVisible = true
      this.editRowData = item
    },
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.getList()
  },
  computed: {},
}
</script>
<style lang="less" scoped>
.box {
  display: flex;
  height: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  flex-direction: column;
  .c-header {
    padding: 0.5rem 0;
    :deep(.el-upload) {
      border: none;
    }
  }
  .c-body {
    flex: 1;
  }
  .c-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem 0;
  }
  .handle {
    .el-link {
      margin-right: 0.5rem;
    }
  }
  .insfiles-box {
    display: flex;
  }
}
</style>
