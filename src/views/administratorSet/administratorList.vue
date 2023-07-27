<template>
  <div class="administratorList">
    <div class="search">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="用户名">
                <el-input v-model="formInline.username"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="wrapper">
      <el-button type="primary" @click="openAddadmin"
        >添加管理员</el-button
      >
      <p class="pwd-tips">管理员默认密码为：{{ this.resetpasswording }}</p>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" @sort-change="sortChange" :header-cell-style="{ background: 'rgb(250, 250, 250)' }">
          <el-table-column prop="id" label="ID" width="80px" align="center" sortable="id"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="username" label="用户名" align="center"></el-table-column>
          <el-table-column prop="activate" label="状态" align="center"></el-table-column>
          <el-table-column prop="registerIP" label="注册IP" align="center"></el-table-column>
          <el-table-column prop="lastLoginIP" label="最后登录IP" align="center"></el-table-column>
          <el-table-column prop="lastLoginTime" label="最后登录时间" width="180px" align="center" sortable="lastLoginTime"></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180px" align="center" sortable="createdAt"></el-table-column>
          <el-table-column label="操作" align="center" width="180px">
              <template #default="scope">
                  <el-button @click.native.prevent="openEditor(scope.row)" link size="small" type="primary">编辑</el-button>
                  <el-button @click="resetpasswords(scope.row)" link size="small" type="primary">重置密码</el-button>
                  <el-button @click="deleEdit(scope.row)" link size="small" type="danger">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" :current-page="currentPage" :pager-count="pagerCount" layout="total, prev, pager, next, jumper" background :total="total">
            </el-pagination>
      </div>
      
    </div>
    <el-dialog
      title="添加管理员"
      v-model="dialogVisibleAddUser"
      :append-to-body="true"
      width="30%"
    >
      <el-form
        :model="addUserForm"
        ref="addUserForm"
        label-width="80px"
        class="demo-form"
      >
        <el-form-item label="姓名">
          <el-input v-model="addUserForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="addUserForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="addUserForm.password"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item class="addBtn">
          <el-button @click="dialogVisibleAddUser = false">取消</el-button>
          <el-button type="primary" @click="addadmin">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="编辑管理员"
      :append-to-body="true"
      v-model="dialogVisibleeditor"
      width="30%"
    >
      <el-form
        :model="editorUserForm"
        ref="editorUserForm"
        label-width="80px"
        class="demo-form"
      >
        <el-form-item label="姓名">
          <el-input v-model="setName" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="setusername" :disabled="true" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否激活">
          <el-radio v-model="radio" label="true">是</el-radio>
          <el-radio v-model="radio" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全部</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="city in cities"
              :label="city.id"
              :key="city.id"
              >{{ city.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="addBtn">
          <el-button @click="dialogVisibleeditor = false">取消</el-button>
          <el-button type="primary" @click="editoradmin">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import tools from './../../utils/tools'
import md5 from 'js-md5'
export default {
  data() {
    return {
      setName: '',
      setusername: null,
      // resetpasswords:'',
      resetpasswording: 'jayme123',
      radio: null,
      cities: [],
      checkedCities: [],
      checkAll: false,
      isIndeterminate: true,
      dialogVisibleeditor: false,
      editorUserForm: {},
      addUserForm: {},
      dialogVisibleAddUser: false,
      sort: 'createdAt,asc',
      formInline: {},
      userInfo: {},
      tableData: [],
      total: 1, // 总条目数
      pageSize: 15, // 每页显示个数
      currentPage: 1, // 默认显示页
      pagerCount: 5, // 页码数量，超过折叠
      pwdPreFix:'jayme'
    }
  },
  methods: {
    //重置密码
    resetpasswords(val) {
      let _this = this
      let valname = val.username
      this.$confirm('是否要重置管理员' + valname + '的密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          _this.$http
            .resetPassword({
              adminId: val.id,
              password: md5(_this.pwdPreFix + this.resetpasswording),
            })
            .then((res) => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '重置密码成功!',
                })
                _this.$http.operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:
                    '管理员' +
                    this.userInfo.name +
                    '重置了管理员' +
                    val.name +
                    '的密码',
                })
              } else {
                _this.$message({
                  type: 'error',
                  message: res.data.msg,
                })
              }
            })
        })
        .catch(() => {
          return false
        })
    },
    publicInterface(page) {
      let sub = {
        size: this.pageSize,
        page: page,
        sort: this.sort,
        ...this.formInline,
      }
      this.$http.adminAll(sub).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.result.content
          this.total = res.data.result.totalElements
          this.tableData.forEach((row) => {
            if (row.createdAt) {
              row.createdAt = tools.transitionTime(row.createdAt)
            }else{
              row.createdAt = '暂无'
            }
            if (row.lastLoginTime) {
              row.lastLoginTime = tools.transitionTime(row.lastLoginTime)
            }
            if (row.enabled) {
              row.activate = '激活'
            } else {
              row.activate = '关闭'
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg,
          })
        }
      })
    },
    handleCurrentChange(index) {
      this.currentPage = index
      let number = index - 1
      this.publicInterface(number)
    },
    onSubmit() {
      this.publicInterface(0)
    },
    handleCheckAllChange(val) {
      let checkedArr = []
      this.cities.forEach((row) => {
        checkedArr.push(row.id)
      })
      this.checkedCities = val ? checkedArr : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    },
    editoradmin() {
      let _this = this
      this.editorUserForm.roleIds = []
      this.editorUserForm.roleIds = this.checkedCities
      this.editorUserForm.enabled = this.radio
      this.editorUserForm.username = this.setusername
      this.editorUserForm.name = this.setName
      let name = this.setName
      const reg = /^(?! +$).+/ //包含空格，但是不全是空格
      // if(!this.setName) return this.$message.error('请输入姓名')
      if (!reg.test(this.setName))
        return this.$message.error('请输入正确的姓名')
      _this.$http.adminUpdate(this.editorUserForm).then((res) => {
        if (res.data.code === 0) {
          this.dialogVisibleeditor = false
          this.$message({
            type: 'success',
            message: '编辑成功',
          })
          _this.$http
            .operateLogSave({
              operateLogType: 'ADMIN_OPT',
              detail: '管理员' + this.userInfo.name + '编辑了管理员' + name,
            })
            .then(() => {
              this.publicInterface(this.currentPage - 1)
            })
        } else {
          _this.$message({
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    openEditor(row) {
      this.checkedCities = []
      this.editorUserForm.id = row.id
      this.setusername = row.username
      this.setName = row.name
      if (row.enabled) {
        this.radio = 'true'
      } else {
        this.radio = 'false'
      }
      this.dialogVisibleeditor = true
      this.$http.roleFindByAdmin({ adminId: row.id }).then((res) => {
        if (res.data.code === 0) {
          res.data.result.forEach((row) => {
            this.checkedCities.push(row.id)
          })
          if (this.checkedCities.length == 0) {
            this.isIndeterminate = false
          } else {
            this.isIndeterminate = true
          }
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg,
          })
        }
      })
    },
    deleEdit(row) {
      let _this = this
      _this
        .$confirm('确认删除此管理员吗?', '提示', {
          type: 'warning',
        })
        .then(() => {
          this.$http.adminDelete({ id: row.id }).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功',
              })
              _this.$http
                .operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:
                    '管理员' + this.userInfo.name + '删除了管理员' + row.name,
                })
                .then(() => {
                  if (this.currentPage == 1) {
                    this.publicInterface(0)
                  } else {
                    if (this.tableData.length == 1) {
                      this.publicInterface(this.currentPage - 2)
                    } else {
                      this.publicInterface(this.currentPage - 1)
                    }
                  }
                })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg,
              })
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    sortChange(column) {
      if (!column.order) return
      let sort
      if (column.order == 'descending') {
        sort = `${column.prop},desc`
      } else if (column.order == 'ascending') {
        sort = `${column.prop},asc`
      }
      this.sort = sort
      this.publicInterface(this.currentPage - 1)
    },
    openAddadmin() {
      console.log(1212)
      this.dialogVisibleAddUser = true
    },
    addadmin() {
      let _this = this
      _this.addUserForm.password = md5(_this.pwdPreFix + _this.addUserForm.password)
      _this.$http
        .adminRegister({
          username: _this.addUserForm.username,
          password: _this.addUserForm.password,
          name: _this.addUserForm.name,
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.dialogVisibleAddUser = false
            _this.$http
              .operateLogSave({
                operateLogType: 'ADMIN_OPT',
                detail:
                  '管理员' +
                  this.userInfo.name +
                  '创建管理员' +
                  res.data.result.name,
              })
              .then(() => {
                this.publicInterface(this.currentPage - 1)
                this.addUserForm = {}
              })
          } else {
            _this.$message({
              message: res.data.msg,
              type: 'error',
            })
          }
        })
    },
  },
  created() {
    let _this = this
    // let objDate = {
    //   path: '/administratorList',
    //   name: '管理员列表',
    //   code: 106.1,
    //   parentName: '管理员设置',
    // }
    // this.$store.dispatch('changeN', objDate)
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // console.log('this.userInfo',this.userInfo)
    this.publicInterface(0)
    _this.$http.roleAll().then((res) => {
      if (res.data.code === 0) {
        this.cities = res.data.result
      } else {
        _this.$message({
          type: 'error',
          message: res.data.msg,
        })
      }
    })
  },
}
</script>
<style lang="scss" scoped>
    .pagination{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-top: 15px;
    }
.administratorList {
  margin: 10px;
  padding: 10px 0 10px 20px;
  box-sizing: border-box;
  .search {
    background-color: #fff;
    box-sizing: border-box;
    p {
      margin-bottom: 20px;
    }
  }
  .wrapper {
    display: flex;
    /*justify-content: space-between;*/
    margin-bottom: 14px;
    box-sizing: border-box;
    align-items: center;
  }
  .pwd-tips {
    margin-left: 8px;
    color: #909399;
  }
}
</style>
