<template>
  <div class="personalSetting">
    <div class="personalDetails">
      <el-icon @click="back">
        <CloseBold />
      </el-icon>
      <el-divider content-position="left">个人信息</el-divider>
      <div class="personalContent">
        <div class="formContent">
          <el-form
            ref="messageForm"
            :rules="rules"
            label-position="left"
            :model="messageForm"
          >
            <el-form-item label="登录账号" label-width="80px">
              <div>{{ userInfo.username || "" }}</div>
            </el-form-item>
            <el-form-item label="姓名" prop="name" label-width="80px">
              <el-input v-model="messageForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" label-width="80px">
              <el-select v-model="messageForm.sex" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select> </el-form-item
            ><br />
            <el-form-item label="联系方式" prop="phone" label-width="80px">
              <el-input v-model="messageForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="角色" label-width="80px">
              <el-tag class="role-tag" v-for="r in roleList">{{
                r.name
              }}</el-tag>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="editInformation('messageForm')"
            >更新</el-button
          >
        </div>
      </div>
    </div>
    <div class="changePassword">
      <el-divider content-position="left">修改密码</el-divider>
      <div class="personalContent">
        <el-form
          ref="passForm"
          label-position="left"
          :rules="rules"
          :model="passForm"
        >
          <el-form-item label="旧密码" prop="oldPassword" label-width="80px">
            <el-input v-model="passForm.oldPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" label-width="80px">
            <el-input v-model="passForm.newPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="affirmPass" label-width="80px">
            <el-input v-model="passForm.affirmPass" show-password></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="changePassword('passForm')"
          >修改密码</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";
import { time } from "@/components/time.js";
import { CloseBold } from '@element-plus/icons-vue'
export default {
  components: {},
  props: [],
  data() {
    var username = (rule, value, callback) => {
      let reg = /^(?! +$).+/;
      if (value === "") {
        callback(new Error("请输入名字"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入正确名字"));
        }
        callback();
      }
    };
    var iphone = (rule, value, callback) => {
      let reg = /^1[3456789]\d{9}$/;
      if (value === "") {
        callback(new Error("请输入联系方式"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入正确联系方式"));
        }
        callback();
      }
    };
    let pass = (rule, value, callback) => {
      let reg = /^(?! +$).+/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("密码不能全为空格"));
        }
        callback();
      }
    };
    return {
      copeMessageForm: {},
      messageForm: {
        name: "",
        sex: "",
        phone: "",
        id: null,
      },
      roleList: [],
      passForm: {
        oldPassword: "",
        newPassword: "",
        affirmPass: "",
      },
      options: [
        {
          value: 1,
          label: "男",
        },
        {
          value: 2,
          label: "女",
        },
        {
          value: 0,
          label: "未知",
        },
      ],
      value: "",
      userInfo: {},
      userMessage: {},
      rules: {
        // phone: [{ required: true, validator: iphone, trigger: "blur" }],
        oldPassword: [{ required: true, validator: pass, trigger: "blur" }],
        newPassword: [{ required: true, validator: pass, trigger: "blur" }],
        affirmPass: [{ required: true, validator: pass, trigger: "blur" }],
        username: [{ required: true, validator: username, trigger: "blur" }],
      },
    };
  },
  watch: {
    $route(to, from) {
      console.log(to);
      console.log(from);
    },
  },
  computed: {},
  methods: {
    userInit(date) {
      let _this = this;
      this.$http.updateAdmin(date).then((res) => {
        if (res.data.code === 0) {
          _this.$http
            .operateLogSave({
              operateLogEnum: "ADMIN_OPT",
              detail: "管理员" + this.userInfo.name + "更新了个人信息",
            })
            .then(() => {
              location.reload();
              this.$message({
                type: "success",
                message: "编辑信息",
              });
            });
        } else {
          _this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    editInformation(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            _this.messageForm.id == _this.copeMessageForm.id &&
            _this.messageForm.phone == _this.copeMessageForm.phone &&
            _this.messageForm.sex == _this.copeMessageForm.sex &&
            _this.messageForm.name == _this.copeMessageForm.name
          )
            return;
          _this.userInit(_this.messageForm);
        } else {
          return false;
        }
      });
    },
    changePassword(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.passForm.newPassword != _this.passForm.affirmPass) {
            _this.$message({
              message: "两次密码不一致！,请重新输入密码！",
              type: "warning",
            });
          } else {
            _this.$http
              .updatePassword({
                newPassword: md5("jayme" + _this.passForm.newPassword),
                oldPassword: md5("jayme" + _this.passForm.oldPassword),
              })
              .then((res) => {
                if (res.data.code === 0) {
                  _this.$http
                    .operateLogSave({
                      operateLogEnum: "ADMIN_OPT",
                      detail: "管理员" + _this.userInfo.name + "修改了密码",
                    })
                    .then(() => {
                      _this.$message({
                        type: "success",
                        message: "修改成功",
                      });
                      // _this.$store.commit('logOut')
                      _this.$router.replace("/");
                    });

                  _this.passForm = {};
                } else {
                  _this.$message({
                    type: "error",
                    message: res.data.msg,
                  });
                }
              });
          }
        } else {
          return false;
        }
      });
    },
    back() {
      this.$router.back();
    },
  },
  created() {
    let _this = this;
    // this.$store.dispatch("changeN", "null");
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.$http.findByAdmin({ adminId: this.userInfo.id }).then((res) => {
      _this.roleList = res.data.result;
    });
    this.$http.adminInfo().then((res) => {
      if (res.data.result.createdAt) {
        res.data.result.createdAt = time(res.data.result.createdAt);
      }
      this.userMessage = res.data.result;
      let objData = {
        name: this.userMessage.name,
        sex: _this.userMessage.sex,
        phone: _this.userMessage.phone,
        id: _this.userMessage.id,
      };
      _this.messageForm = objData;
      _this.copeMessageForm = JSON.parse(JSON.stringify(objData));
    });
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.personalSetting {
  padding: 16px;
  .personalDetails {
    width: 100%;
    //   height: 250px;
    background-color: white;
    .personalContent {
      width: 50%;
      .top {
        width: 100%;
        .courseName {
          display: inline-block;
        }
        .creationTime {
          display: inline-block;
          margin-left: 30px;
        }
      }
      .formContent {
        input {
          width: 150px;
        }
      }
    }
  }
  .changePassword {
    width: 100%;
    margin: 20px 0 0 0;
    background-color: white;
    .personalContent {
      width: 50%;
    }
  }
}
.role-tag {
  margin-right: 8px;
}
.el-icon{
  color: red;
  font-size: 1.8rem;
  position: absolute;
  right: 1rem;
  top: 4rem;
}
</style>
