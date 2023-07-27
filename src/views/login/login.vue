<template>
  <div class="login">
    <header>
      <img :src="logo" style="width: 128px" alt="" srcset="" />
      <div class="writing">Jayme小程序后台</div>
    </header>
    <main class="content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        ref="ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="账号"
            v-model="ruleForm.username"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            show-password
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item class="footer">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <Verify
        @success="success"
        mode="pop"
        captchaType="blockPuzzle"
        :imgSize="{ width: '330px', height: '155px' }"
        ref="verify"
      ></Verify>
    </main>
    <el-dialog title="注册" :visible.sync="dialogRegister" width="40%">
      <el-form
        :model="register"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号">
          <el-input v-model="register.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="register.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="affirm">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup></script>
<script>
import md5 from 'js-md5'
import sidentify from '@/components/identify'
import { Menu } from 'element-plus'
import Verify from '@/components/verifition/Verify.vue'
import logo from '@/assets/admin-logo.png'

export default {
  data() {
    return {
      dialogRegister: false,
      loginState: false,
      register: {},
      ruleForm: {},
      test: null,
      imgsrc: null,
      rules: {
        username: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        // code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      logo,
    }
  },
  components: {
    sidentify,
    Verify,
  },
  mounted() {},
  methods: {
    success() {
      let _this = this
      if (_this.loginState) return
      _this.loginState = true
      this.$http
        .login({
          username: _this.ruleForm.username,
          password: md5('jayme'+this.ruleForm.password),
        })
        .then((res) => {
          _this.loginState = false
          if (res.data.code === 0) {
            let userInfo = {
              username: res.data.result.admin.username, //登录账号
              id: res.data.result.admin.id, //登录账号ID
              access_token: res.data.result.token.access_token, //登录账号token
              name: res.data.result.admin.name, //管理员名称
            }
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
            sessionStorage.setItem(
              'userRole',
              JSON.stringify(res.data.result.admin.authorityList)
            )
            // this.$store.commit("SET_TOKEN", res.data.result.token.access_token);
            this.$store.commit('setUserInfo', userInfo)
            this.$message({
              type: 'success',
              message: '登录成功',
            })
            this.$http
              .operateLogSave({
                operateLogType: 'LOGIN_LOG',
                detail: '管理员' + res.data.result.admin.name + '成功登录',
              })
              .then(() => {
                // 跳转页面
                _this.goHome(res.data.result.admin)
              })
          } else {
            _this.$message({
              message: res.data.msg,
              type: 'error',
            })
          }
        })
        .catch(() => {
          _this.loginState = false
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          _this.$refs.verify.show()
        } else {
          return false
        }
      })
    },
    /** 根据权限跳转页面 */
    goHome({ authorityList }) {
      let routerObj = {
        101: 'atlasManage', // 首页管理
        102: 'userManage', // 用户管理
        106: 'listenSong', // 活动管理
        107: 'rafflemanage', // 抽奖管理
        999: 'administratorList', // 管理员管理
      }
      if (authorityList.length > 0) {
        let arr = []
        authorityList.map((item) => {
          return arr.push(item.idCode)
        })
        arr.sort()
        
        this.$router.push(`/${routerObj[arr[0]]}`)
      } else {
        this.$router.push('/homePage')
      }
    },
  },
}
</script>
<style lang="scss" rel="stylesheet/sass">
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  header {
    position: relative;
    text-align: center;
    .writing {
      width: 100%;
      // position: absolute;
      color: #676968;
      font-size: 23px;
      // top: 150px;
      // left: 0;
      text-align: center;
    }
  }
  .content {
    padding: 20px 50px;
    margin-top: 0px;
    .el-form-item__content {
      display: flex !important;
      margin-left: 0 !important;
    }
    .code1 {
      position: relative;
      .input {
        width: 60%;
        margin-right: 12px;
      }
      .idenCode {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .footer {
      .el-button {
        width: 100%;
      }
    }
  }
}
@media screen and (min-width: 768px) {
  .content {
    width: 20rem !important;
  }
}
</style>
