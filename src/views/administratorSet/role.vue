<template>
  <div class="role">
    <div class="wrapper">
      <el-button type="primary" @click="adduser"
        >新增角色</el-button
      >
    </div>

    <el-table
      :data="roleData"
      :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
    >
      <el-table-column
        prop="name"
        label="名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建时间"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="updatedAt"
        label="修改时间"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            @click.native.prevent="handleEdit(scope.row)"
            link
            size="small"
            type="primary"
            >编辑</el-button
          >
          <el-button
            @click.native.prevent="roledele(scope.row)"
            link
            size="small"
            type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新增角色"
      v-model="dialogrole"
      :append-to-body="true"
      width="40%"
    >
      <el-form
        :model="roleAdd"
        :rules="rules"
        ref="roleAdd"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleAdd.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleAdd.description"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="align">
            <el-button type="primary" @click="affirm('roleAdd')"
              >确认</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="角色编辑"
      v-model="dialogVisible"
      :append-to-body="true"
      width="40%"
    >
      <el-form
        :model="roleEditor"
        ref="roleEditor"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称">
          <el-input v-model="editorname"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editordescription"></el-input>
        </el-form-item>
        <el-form-item label="绑定权限">
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
              v-for="item in jurisdictionList"
              :label="item.id"
              :key="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <div class="align">
            <el-button type="primary" @click="editoraffirm">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import tools from './../../utils/tools'
export default {
  data() {
    return {
      editorname: null,
      editordescription: null,
      checkAll: false,
      isIndeterminate: true,
      checkedCities: [],
      dialogrole: false,
      dialogVisible: false,
      roleData: [{}],
      roleAdd: {},
      userInfo: {},
      roleEditor: {},
      jurisdictionList: [],
      rules: {
        name: { required: true, message: '请输入角色名称', trigger: 'blur' },
        description: {
          required: true,
          message: '请输入角色描述',
          trigger: 'blur',
        },
      },
    }
  },
  methods: {
    affirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.roleSave(this.roleAdd).then((res) => {
            if (res.data.code === 0) {
              this.dialogrole = false
              this.$message({
                type: 'success',
                message: '新增成功',
              })
              this.roleAdd = {}
              this.$http
                .operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:
                    '管理员' +
                    this.userInfo.name +
                    '新增管理员角色' +
                    res.data.result.name,
                })
                .then(() => {
                  location.reload()
                })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg,
              })
            }
          })
        } else {
          this.jurisdictionAdd = {}
          return false
        }
      })
    },

    editoraffirm() {
      this.roleEditor.description = this.editordescription
      this.roleEditor.name = this.editorname
      this.roleEditor.authorityIds = this.checkedCities
      this.$http.roleUpdate(this.roleEditor).then((res) => {
        if (res.data.code === 0) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功',
          })
          this.$http
            .operateLogSave({
              operateLogType: 'ADMIN_OPT',
              detail:
                '管理员' +
                this.userInfo.name +
                '编辑了管理员角色' +
                this.roleEditor.name,
            })
            .then(() => {
              location.reload()
            })
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg,
          })
        }
      })
    },
    roledele(row) {
      let _this = this
      _this
        .$confirm('确认删除此角色吗?', '提示', {
          type: 'warning',
        })
        .then(() => {
          this.$http.roleDelete({ id: row.id }).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功',
              })
              this.$http
                .operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:
                    '管理员' +
                    this.userInfo.name +
                    '删除了管理员角色' +
                    row.name,
                })
                .then(() => {
                  location.reload()
                })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg,
              })
            }
          })
        })
        .catch(() => {})
    },
    adduser() {
      this.dialogrole = true
    },
    handleCheckAllChange(val) {
      let checkedArr = []
      this.jurisdictionList.forEach((row) => {
        checkedArr.push(row.id)
      })
      this.checkedCities = val ? checkedArr : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.jurisdictionList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.jurisdictionList.length
    },
    handleEdit(row) {
      this.dialogVisible = true
      this.checkedCities = []
      this.$http.authorityFindByRole({ roleId: row.id }).then((res) => {
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
      this.roleEditor.id = row.id
      this.editorname = row.name
      this.editordescription = row.description
    },
  },
  created() {
    let _this = this
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // let objDate = {
    //   path: '/role',
    //   name: '角色管理',
    //   code: 106.4,
    //   parentName: '管理员设置',
    // }
    // this.$store.dispatch('changeN', objDate)
    _this.$http.roleAll().then((res) => {
      if (res.data.code === 0) {
        this.roleData = res.data.result
        this.roleData.forEach((row) => {
          row.createdAt = tools.transitionTime(row.createdAt)
          row.updatedAt = tools.transitionTime(row.updatedAt)
        })
      } else {
        _this.$message({
          type: 'error',
          message: res.data.msg,
        })
      }
    })
    _this.$http.authorityAll().then((res) => {
      if (res.data.code === 0) {
        this.jurisdictionList = res.data.result
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
.role {
  margin: 10px;
  padding: 10px 0 10px 20px;
  box-sizing: border-box;
  .wrapper {
    display: flex;
    margin-bottom: 14px;
    box-sizing: border-box;
    align-items: center;
  }
}
</style>
