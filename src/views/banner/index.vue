<template>
  <div class="operationNote">
    <el-form
      :inline="true"
      :model="formInline"
      @submit.native.prevent
      class="demo-form-inline"
    >
      <el-row>
        <el-col :span="12"> 广告管理 </el-col>
        <el-col :span="12" class="text-right">
          <div style="width: 100%; text-align: right">
            <el-button type="primary" @click="showAddDlg = true"
              >创建广告</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-top: 1rem">
      <!-- @selection-change="handleSelectionChange" -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
        :row-key="getRowKeys3"
        style="width: 100%"
      >
        <!-- <el-table-column
          type="selection"
          :reserve-selection="true"
        ></el-table-column> -->
        <el-table-column label="封面" align="center">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
              :preview-teleported="true"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="广告名称"
          align="center"
        ></el-table-column>
        <el-table-column
          label="广告链接"
          min-width="200px"
          show-overflow-tooltip
          align="center"
        >
          <template #default="scope">
            <span>{{ scope.row.link || '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="创建时间"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="serialNumber"
          label="展示排序"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="是否上架" align="center">
          <template #default="scope">
            <!-- :before-change="beforeChange()" -->
            <el-switch
              v-model="scope.row.shelves"
              @change="shelvesChange(scope.row)"
              :loading="shelvesLoading"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              @click.native.prevent="handleEdit(scope.row)"
              text
              size="small"
              type="primary"
              >编辑</el-button
            >
            <el-button
              @click.native.prevent="deleEdit(scope.row)"
              size="small"
              type="danger"
              text
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="buttom">
        <!-- <div class="btn">
          <el-button
            size="small"
            type="primary"
            @click="toggleSelection(tableData)"
            >全选</el-button
          >
          <el-button size="small" @click="invertSelection">反选</el-button>
          <el-button size="small" @click="batchDele">批量删除</el-button>
        </div> -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          :pager-count="pagerCount"
          :page-sizes="[10, 20, 30, 50]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 新增商品 -->
    <el-dialog
      title="添加广告"
      v-model="showAddDlg"
      :append-to-body="true"
      width="800px"
      class="add-view"
      @close="closeAddDlg"
    >
      <el-form
        :model="addForm"
        ref="addForm"
        class="form"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item prop="name" label="广告名称">
          <el-input
            v-model="addForm.name"
            maxlength="20"
            :clearable="true"
            tabindex="1"
            placeholder="请输入广告名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="image" label="封面" class="image">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/*"
            :show-file-list="false"
            :http-request="uploadCover"
            :on-remove="handleRemoveImage"
          >
            <img v-if="showCover" :src="showCover" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item prop="link" label="广告链接">
          <el-input
            v-model="addForm.link"
            tabindex="2"
            :clearable="true"
            placeholder="请输入广告链接"
          ></el-input>
        </el-form-item>
        <el-form-item align="center">
          <div class="align">
            <el-button type="primary" @click="submitAdd('addForm')"
              >确认</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑商品 -->
    <el-dialog
      title="编辑广告"
      v-model="showEditDlg"
      :append-to-body="true"
      width="800px"
      class="add-view"
      @close="closeEditDlg"
    >
      <el-form
        :model="editForm"
        ref="editForm"
        class="form"
        label-width="80px"
        :rules="editRules"
      >
        <el-form-item prop="name" label="广告名称">
          <el-input
            v-model="editForm.name"
            maxlength="20"
            :clearable="true"
            tabindex="1"
            placeholder="请输入广告名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="image" label="封面" class="image">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/*"
            :show-file-list="false"
            :http-request="uploadCover"
            :on-remove="handleRemoveImage"
          >
            <img v-if="showCover" :src="showCover" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item prop="link" label="广告链接">
          <el-input
            v-model="editForm.link"
            tabindex="2"
            :clearable="true"
            placeholder="请输入广告链接"
          ></el-input>
        </el-form-item>
        <!-- 排序 -->
        <el-form-item prop="serialNumber" label="排序">
          <el-input
            v-model="editForm.serialNumber"
            tabindex="4"
            maxlength="10"
            :clearable="true"
            placeholder="请输入排序"
          ></el-input>
        </el-form-item>
        <el-form-item align="center">
          <div class="align">
            <el-button type="primary" @click="submitEdit('editForm')"
              >确认</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import tools from '@/utils/tools'
import { uploadMultiple } from '@/utils/uploadVideo'
import { Plus } from '@element-plus/icons-vue'
const rulesBase = {
  name: [
    {
      required: true,
      message: '请输入广告名称',
      trigger: 'blur',
    },
  ],
  image: [
    {
      required: true,
      message: '请上传封面',
      trigger: 'blur',
    },
  ],
  link: [
    // {
    //   required: true,
    //   message: '请输入广告链接',
    //   trigger: 'blur',
    // },
    // 判断是否是网址
    {
      validator: (rule, value, callback) => {
        if (value) {
          if (!tools.isUrl(value)) {
            callback(new Error('请输入正确的网址'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
export default {
  data() {
    return {
      formInline: {},
      tableData: [],
      userInfo: {},
      getRowKeys3(row) {
        return row.key
      },
      bonusOpencheck: false,
      invertopencheck: false,
      bonusIDslist: [],
      total: 1, // 总条目数
      pageSize: 10, // 每页显示个数
      currentPage: 1, // 默认显示页
      pagerCount: 5, // 页码数量，超过折叠
      // 改变上架状态loading
      shelvesLoading: false,
      showAddDlg: false,
      showCover: '',
      addForm: {
        image: '',
        name: '',
        link: '',
      },
      rules: { ...rulesBase },
      editForm: {
        image: '',
        name: '',
        link: '',
        serialNumber: '',
      },
      editRules: {
        ...rulesBase,
        serialNumber: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'blur',
          },
        ],
      },
      editItem: {},
      showEditDlg: false,
      showCoverEdit: '',
    }
  },
  methods: {
    FilterData(array2, array1) {
      var result = []
      for (var i = 0; i < array2.length; i++) {
        var obj = array2[i]
        var num = obj.id
        var flag = false
        for (var j = 0; j < array1.length; j++) {
          var aj = array1[j]
          var n = aj.id
          if (n == num) {
            flag = true
            break
          }
        }
        if (!flag) {
          result.push(obj)
        }
      }
      return result
    },
    //全选
    toggleSelection(data) {
      if (this.bonusIDslist.length === 0) {
        data.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
        data.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        })
      }
      this.bonusOpencheck = true
    },
    //反选
    invertSelection() {
      this.invertopencheck = true
      let arr1 = []
      let tableData = this.tableData
      if (this.bonusIDslist.length == tableData.length) {
        this.$refs.multipleTable.clearSelection()
      } else {
        arr1 = this.FilterData(tableData, this.bonusIDslist)
        this.$refs.multipleTable.clearSelection()
        this.$nextTick(() => {
          arr1.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        })
      }
    },
    //批量删除
    batchDele() {
      let ids = JSON.parse(JSON.stringify(this.bonusIDslist))
      ids.forEach((r, o, w) => {
        w[o] = r.id
      })
      let _this = this
      _this
        .$confirm('是否批量删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          if (ids.length === 0) {
            this.$message({
              message: '请选择批量删除的内容',
            })
            return
          }
          _this.$http.operateLogBatchDelete({ ids: ids }).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功',
              })
              this.$refs.multipleTable.clearSelection()
              this.$http
                .operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:
                    '管理员' + this.userInfo.name + '批量删除了操作记录' + ids,
                })
                .then(() => {
                  // location.reload();
                  this.bonusIDslist = []
                  if (this.isEmpty(this.formInline)) {
                    this.publicQuery(
                      this.pageSize,
                      this.currentPage - 1,
                      this.formInline
                    )
                  } else {
                    if (this.tableData.length == ids.length) {
                      if (this.currentPage == 1) {
                        this.publicQuery(
                          this.pageSize,
                          this.currentPage - 1,
                          {}
                        )
                      } else {
                        this.publicQuery(
                          this.pageSize,
                          this.currentPage - 2,
                          {}
                        )
                      }
                    } else {
                      this.publicQuery(this.pageSize, this.currentPage - 1, {})
                    }
                  }
                })
            } else {
              _this.$message({
                message: res.data.msg,
                type: 'error',
              })
            }
          })
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //选择项发生变化时
    handleSelectionChange(val) {
      this.bonusIDslist = val
    },
    //是否为对象
    isEmpty(obj) {
      for (var name in obj) {
        if (obj[name]) return true
        return false
      }
      return false
    },
    publicQuery(size, page, form) {
      this.$http
        .operateLogAll({
          size: size,
          page: page,
          sort: 'createdAt,desc',
          ...form,
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.result.content
            this.total = res.data.result.totalElements
            this.tableData.forEach((row) => {
              if (row.createdAt) {
                row.createdAt = tools.transitionTime(row.createdAt)
              }
              row.explain = row.user + row.content
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg,
            })
          }
        })
    },
    //pageSize 改变
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      // this.publicQuery(val, 0, this.formInline)
      this.getData(val, 0)
    },
    //翻页
    handleCurrentChange(index) {
      if (this.bonusOpencheck || this.invertopencheck) {
        this.bonusIDslist = []
        this.$refs.multipleTable.clearSelection()
        this.bonusOpencheck = false
      } else {
        this.bonusIDslist = []
        this.$refs.multipleTable.clearSelection()
        this.bonusOpencheck = false
      }
      this.currentPage = index
      let number = index - 1
      if (!this.isEmpty(this.formInline)) {
        // this.publicQuery(this.pageSize, number, {})
        this.getData(this.pageSize, number)
      } else {
        // this.publicQuery(this.pageSize, number, this.formInline)
        this.getData(this.pageSize, number)
      }
    },

    //删除banner
    deleEdit(row) {
      let _this = this
      _this
        .$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          _this.$http.bannerDel({ id: row.id }).then((res) => {
            if (res.data.code === 0) {
              _this.$message({
                type: 'success',
                message: '删除成功',
              })
              _this.$http
                .operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:
                    '管理员' + _this.userInfo.name + '删除了banner' + row.id,
                })
                .then(() => {
                  if (_this.isEmpty(_this.formInline)) {
                    _this.getData(_this.pageSize, _this.currentPage - 1)
                  } else {
                    _this.getData(_this.pageSize, _this.currentPage - 1)
                  }
                })
            } else {
              _this.$message({
                message: res.data.msg,
                type: 'error',
              })
            }
          })
        })
    },
    // 获取数据
    getData(size, page) {
      let _this = this
      _this.$http
        .getBannerList({
          size: size,
          page: page,
          sort: 'createdAt,desc',
        })
        .then((res) => {
          if (res.data.code === 0) {
            const { content = [], totalElements = 0 } = res.data.result
            content.forEach((row) => {
              if (row.createdAt) {
                row.createdAt = tools.transitionTime(row.createdAt)
              }
            })
            console.log('content', content)
            console.log('totalElements', totalElements)
            _this.tableData = content
            _this.total = totalElements
          } else {
            _this.$message({
              type: 'error',
              message: res.data.msg,
            })
          }
        })
    },
    async shelvesChange(data) {
      let _this = this
      console.log('shelvesChange', data)
      _this.shelvesLoading = true
      const {
        data: { code },
        data: { msg },
        data: { result },
      } = await _this.$http.bannerShelves({
        id: data.id,
        shelves: data.shelves,
      })
      if (code === 0 && result) {
        _this.$http
          .operateLogSave({
            operateLogType: 'ADMIN_OPT',
            detail: `管理员${_this.userInfo.name}${
              data.shelves ? '上' : '下'
            }架了广告${data.name}`,
          })
          .then(() => {
            _this.shelvesLoading = false
            _this.$message({
              type: 'success',
              message: '操作成功',
            })
          })
      } else {
        _this.shelvesLoading = false
        data.shelves = !data.shelves
        _this.$message({
          type: 'error',
          message: msg,
        })
      }
    },
    /** 上传封面 */
    uploadCover(e) {
      let _this = this
      uploadMultiple(e, (res) => {
        _this.showCover = res.url
        _this.addForm.image = res.src
        _this.editForm.image = res.src
      })
    },
    // 提交新增
    submitAdd(formName) {
      let _this = this
      _this.addForm.name = _this.addForm.name.trim()
      if (_this.editForm.link) {
        _this.editForm.link = _this.editForm.link.trim()
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('this.addForm', _this.addForm)
          _this.$http.bannerAdd(_this.addForm).then((res) => {
            if (res.data.code === 0) {
              _this.$message({
                type: 'success',
                message: '新增成功',
              })
              _this.$http
                .operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:
                    '管理员' +
                    _this.userInfo.name +
                    '创建了广告' +
                    _this.addForm.name,
                })
                .then(() => {
                  _this.showAddDlg = false
                  _this.$refs[formName].resetFields()
                  _this.showCover = ''
                  _this.addForm = {
                    image: '',
                    link: '',
                    name: '',
                  }
                  if (_this.isEmpty(_this.formInline)) {
                    _this.getData(_this.pageSize, _this.currentPage - 1)
                  } else {
                    _this.getData(_this.pageSize, _this.currentPage - 1)
                  }
                })
            } else {
              _this.$message({
                message: res.data.msg,
                type: 'error',
              })
            }
          })
        } else {
          // this.addForm = {}
          return false
        }
      })
    },
    // 提交编辑
    submitEdit(formName) {
      let _this = this
      _this.editForm.name = _this.editForm.name.trim()
      if (_this.editForm.link) {
        _this.editForm.link = _this.editForm.link.trim()
      }
      // console.log('this.editForm', _this.editForm)
      // console.log('this.editItem', _this.editItem)
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            id: _this.editItem.id,
          }
          let keyName = []
          for (let key in _this.editItem) {
            if (_this.editItem[key] !== _this.editForm[key]) {
              params[key] = _this.editForm[key]
              keyName.push(key)
            }
          }
          // console.log('params', params)
          _this.$http.bannerUpdate(params).then(async (res) => {
            if (res.data.code === 0) {
              await _this.editBannerLog(keyName)
              _this.showEditDlg = false
              _this.$refs[formName].resetFields()
              _this.showCover = ''
              _this.editForm = {
                image: '',
                link: '',
                name: '',
                serialNumber: '',
              }
              _this.$message({
                type: 'success',
                message: '编辑成功',
              })

              if (_this.isEmpty(_this.formInline)) {
                _this.getData(_this.pageSize, _this.currentPage - 1)
              } else {
                _this.getData(_this.pageSize, _this.currentPage - 1)
              }
            } else {
              _this.$message({
                message: res.data.msg,
                type: 'error',
              })
            }
          })
        } else {
          return false
        }
      })
    },

    closeAddDlg() {
      console.log('closeAddDlg')
      this.addForm = {}
      this.showCover = ''
      this.$refs.addForm.resetFields()
    },
    closeEditDlg() {
      console.log('closeEditDlg')
      this.editForm = {}
      this.showCover = ''
      this.$refs.editForm.resetFields()
    },
    // 打开编辑
    handleEdit(row) {
      console.log('handleEdit', row)
      this.showEditDlg = true
      this.editForm = {
        id: row.id,
        image: row.image,
        link: row.link,
        name: row.name,
        serialNumber: row.serialNumber,
      }
      this.showCover = row.image
      this.editItem = { ...this.editForm }

      // this.editForm = row
      // this.showCover = row.image
      // this.editDialogVisible = true
    },
    handleRemoveImage(uploadFile, uploadFiles) {
      console.log('handleRemoveImage', uploadFile, uploadFiles)
      this.showCover = ''
      this.addForm.image = ''
    },
    // 编辑banner产生的日志
    async editBannerLog(keyName) {
      let _this = this
      // console.log('keyName', keyName)
      // console.log('现在的', this.editForm)
      // console.log('原来的', this.editItem)
      // 日志说明列表
      let logDeList = []
      for (let i = 0; i < keyName.length; i++) {
        let logDe = ''
        if (keyName[i] === 'image') {
          logDe = `管理员${_this.userInfo.name}修改了广告${_this.editForm.name}的封面`
        } else if (keyName[i] === 'link') {
          logDe = `管理员${_this.userInfo.name}将广告${
            _this.editForm.name
          }的链接${_this.editItem.link || '空白'}修改为${
            _this.editForm.link || '空白'
          }`
        } else if (keyName[i] === 'name') {
          logDe = `管理员${_this.userInfo.name}将广告${_this.editItem.name}的名称修改为${_this.editForm.name}`
        } else if (keyName[i] === 'serialNumber') {
          logDe = `管理员${_this.userInfo.name}将广告${_this.editForm.name}的排序${_this.editItem.serialNumber}修改为${_this.editForm.serialNumber}`
        }
        logDeList.push(logDe)
      }
      console.log('logDeList', logDeList)
      // 请求接口
      for (let i = 0; i < logDeList.length; i++) {
        await _this.$http.operateLogSave({
          operateLogType: 'ADMIN_OPT',
          detail: logDeList[i],
        })
      }
    },
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.getData(this.pageSize, 0)
    this.currentPage = 1
  },
}
</script>
<style lang="scss" scoped>
.operationNote {
  margin: 10px;
  padding: 10px 0 10px 20px;
  .buttom {
    margin-top: 15px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    .btn {
      display: inline-block;
      // float: left;
    }
    // .el-pagination {
    //   display: inline-block;
    // }
  }
}
.avatar-uploader .avatar {
  width: 278px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 278px;
  height: 178px;
  text-align: center;
}
.align {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
