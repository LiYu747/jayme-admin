<template>
  <div class="jurisdiction">
    <div class="wrapper">
      <el-button type="primary" @click="adduser"
        >新增权限</el-button
      >
    </div>
    <el-table
      :data="jurisdictionData"
      :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
    >
      <el-table-column
        prop="idCode"
        label="权限码"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="名称"
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
            @click.native.prevent="jurisdictiondele(scope.row)"
            link
            size="small"
            type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新增权限"
      :append-to-body="true"
      v-model="dialogjurisdiction"
      width="40%"
    >
      <el-form
        :model="jurisdictionAdd"
        :rules="rules"
        ref="jurisdictionAdd"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="jurisdictionAdd.name"></el-input>
        </el-form-item>
        <el-form-item label="权限码" prop="idCode">
          <el-input v-model="jurisdictionAdd.idCode"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="align">
            <el-button type="primary" @click="affirm('jurisdictionAdd')"
              >确认</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="权限编辑"
      :append-to-body="true"
      v-model="dialogVisible"
      width="40%"
    >
      <el-form
        :model="jurisdictionEditor"
        :rules="rules1"
        ref="jurisdictionEditor"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="jurisdictionEditor.name"></el-input>
        </el-form-item>
        <el-form-item label="权限码" prop="idCode">
          <el-input v-model="jurisdictionEditor.idCode" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <div class="align">
            <el-button
              type="primary"
              @click="editoraffirm('jurisdictionEditor')"
              >确认</el-button
            >
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
      dialogjurisdiction: false,
      dialogVisible: false,
      jurisdictionData: [{}],
      jurisdictionAdd: {},
      jurisdictionEditor: {},
      jurisdictionID: '',
      jurisdictionName: '',
      userInfo: {},
      rules: {
        name: { required: true, message: '请输入权限名称', trigger: 'blur' },
        idCode: { required: true, message: '请输入权限码', trigger: 'blur' },
      },
      rules1: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        idCode: [{ required: true, message: '请输入权限码', trigger: 'blur' }],
      },
    }
  },
  methods: {
    handleEdit(row) {
      // console.log(row.name);
      this.jurisdictionName = row.name
      this.dialogVisible = true
      this.jurisdictionID = row.id
      this.jurisdictionEditor = row
    },
    editoraffirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.jurisdictionEditor.value = this.jurisdictionEditor.name
          this.jurisdictionEditor.description = ''
          this.$http
            .authorityUpdate({
              id: this.jurisdictionID,
              name: this.jurisdictionEditor.name,
            })
            .then((res) => {
              if (res.data.code === 0) {
                this.dialogVisible = false
                this.$message({
                  type: 'success',
                  message: '修改成功',
                })
                // let str;
                // if(this.jurisdictionID == res.data.result.name)
                this.$http
                  .operateLogSave({
                    operateLogType: 'ADMIN_OPT',
                    detail:
                      '管理员' +
                      this.userInfo.name +
                      '将管理员权限' +
                      this.jurisdictionName +
                      '更改为' +
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
          return false
        }
      })
    },
    adduser() {
      this.dialogjurisdiction = true
    },
    affirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.jurisdictionAdd.value = this.jurisdictionAdd.name
          this.$http.authoritySave(this.jurisdictionAdd).then((res) => {
            if (res.data.code === 0) {
              this.dialogjurisdiction = false
              this.$http
                .operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:
                    '管理員' +
                    this.userInfo.name +
                    '新增管理员权限' +
                    this.jurisdictionAdd.name,
                })
                .then(() => {
                  location.reload()
                })
              this.$message({
                type: 'success',
                message: '新增成功',
              })
              this.jurisdictionAdd = {}
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
    jurisdictiondele(row) {
      let _this = this
      _this
        .$confirm('确认删除此权限吗?', '提示', {
          type: 'warning',
        })
        .then(() => {
          this.$http.authorityDelete({ id: row.id }).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功',
              })
              this.$http
                .operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail: '管理员' + this.userInfo.name + '删除了' + row.name,
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
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // let objDate = {
    //   path: '/jurisdiction',
    //   name: '权限管理',
    //   code: 106.2,
    //   parentName: '管理员设置',
    // }
    // this.$store.dispatch('changeN', objDate)
    this.$http.authorityAll().then((res) => {
      if (res.data.code === 0) {
        this.jurisdictionData = res.data.result
        this.jurisdictionData.forEach((row) => {
          row.createdAt = tools.transitionTime(row.createdAt)
          row.updatedAt = tools.transitionTime(row.updatedAt)
        })
      } else {
        this.$message({
          type: 'error',
          message: res.data.msg,
        })
      }
    })
  },
}
</script>
<style lang="scss" scoped>
.jurisdiction {
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
