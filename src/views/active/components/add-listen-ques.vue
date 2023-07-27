<template>
  <el-dialog class="addDialog" :model-value="dialogVisible" width="800px" :append-to-body="true"
    :before-close="closeDialog">
    <template #header>
      <div class="header-box">添加题目</div>
    </template>
    <el-form :model="ruleForm" :rules="rules"  ref="ruleForm" label-width="100px" class="addruleForm">
      <el-form-item label="音乐资源" prop="filelist">
        <el-upload class="upload-demo" action="#" accept="audio/*" :http-request="() => { }" :before-upload="beforeUpload"
          v-model:file-list="ruleForm.filelist">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传音乐文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="难度" prop="difficulty">
        <el-rate v-model="ruleForm.difficulty"></el-rate>
      </el-form-item>
      <el-form-item
      v-for="(domain, index) in ruleForm.answersList"
      :key="domain.key"
      :label="'答案' + (index+1)"
      :prop="'answersList.' + index + '.text'"
      :rules="[
        {
          required: true,
          message: '答案不能为空',
          trigger: 'blur', 
        },

      ]" class="domains">
        <!-- <el-input v-model="answer.text">{{ answer.text }}</el-input> -->
        <el-input v-model="domain.text" :maxlength="20" @change="inputChange" />
        <el-button @click.prevent="removeQues(index)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addQues">新增答案</el-button>
      </el-form-item>
   
      <el-form-item label="正确答案" prop="curAnswer">
                <el-radio-group v-model="ruleForm.curAnswer">
                    <el-radio v-for="(item, index) in ruleForm.answersList" :key="index" :label="item.text" @change="radioChange"></el-radio>
                </el-radio-group>
            </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">创建</el-button>
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
  name: "addListenQues",
  props: {
    dialogVisible: Boolean,
  },
  data() {
    // 行内自定义校验
    var validatePass = (rule, value, callback) => {
      if (value === '' || value == undefined || value == 0) {
        callback(new Error('请点击选择评分'));
      }
      callback();
    };
    return {
      tools,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      musicdata: [],
      //answersList: [{ "text": '', "is_right": false }],//答案选项列表
      ruleForm: {
        region: 0,
        filelist: [],
        answers: "",
        curAnswer:'',
        answersList: [
        {
          text: '',
          is_right: false
        },
        ],
      
      },
      modifyruleForm: {
        region: "",
        filelist: [],
        answers: "",
        answersList: [
          {
            text: "",
          },
        ],
      },
      rules: {
        region: [{ required: true, message: "请选择难度", trigger: "change" }],
        filelist: [
          {
            type: "array",
            required: true,
            message: "请上传资源文件",
            trigger: "change",
          },
        ],
        // answers: [
        //   { required: true, message: "请选择一个正确答案", trigger: "change" },
        // ],
        difficulty: [
          // { type: "array",required: true, message: "请选择难度", trigger: "change" },
          { validator: validatePass, required: true, trigger: 'change', message: "请选择难度" },
        ],
        curAnswer: [
          { required: true, message: "请选择一个正确答案", trigger: "change" },
          

        ]
      },
      modDialogVisible: false,
      configureDialogVisible: false,
      musicUrl: "",
      modId: "",
      musicName: "",
      modifyConfigureData: [],
    };
  },
  methods: {
    inputChange(value){
      this.ruleForm.curAnswer=value
      console.log(this.ruleForm.answersList)
      const temp = this.ruleForm.answersList.map(item => item.text)
      console.log(temp);
      const newArr  = [...new Set([...temp])]
      if(temp.length != newArr.length ){
        this.ruleForm.curAnswer = ""
      }
      console.log("111111",newArr);
    },
    radioChange(value){
      console.log(value);
      this.ruleForm.curAnswer=value
    },
    closeDialog() {
      console.log("弹窗关闭");
      this.$emit('update:dialogVisible', false)
    },
    submitForm(formName) {
      console.log(formName);
      // return
      let _self = this;
      this.$refs[formName].validate((valid,a,b) => {
        console.log(valid)
        console.log(a)
        console.log(b)
        if (valid) {
          let from = {
            answers: this.ruleForm.answersList,
            difficulty: this.ruleForm.difficulty,
            music: this.musicUrl,
          };
          this.ruleForm.answersList.forEach((item, index) => {
            item.is_right = false;
            if (item.text == this.ruleForm.curAnswer) {
              item.is_right = true;
            }
          });
          console.log(this.ruleForm.curAnswer);
          console.log(this.ruleForm);
          console.log(this.musicName);
          this.$http.addListenMusic(from).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              ElMessage({
                message: "添加成功",
                type: "success",
              });
              _self.$emit('update:dialogVisible', false)
            }
          });

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    beforeUpload(file) {
      console.log(file);
      this.musicName = file.name;
      this.loading = ElLoading.service({
        lock: true,
        text: "正在上传...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // console.log(this.ruleForm.filelist);
      uploadFile(file, async (res) => {
        console.log(res);
        if (res.code == 0) {
          this.musicUrl = res.result.fileName;
          this.loading.close();
          console.log(this.ruleForm.filelist);
          if (this.ruleForm.filelist.length > 1) {
            this.ruleForm.filelist = [
              this.ruleForm.filelist[this.ruleForm.filelist.length - 1],
            ];
          }
        }
      });
      console.log(this.ruleForm.filelist);
      // console.log(this.fileList)
    },
    addQues() {
      let _self = this;
      _self.ruleForm.answersList.push({ "text": "", "is_right": false });
    },
    removeQues(idx) {
      let _self = this;
      console.log(idx);
      console.log(`removeQues:${idx}`);
      _self.ruleForm.answersList.splice(idx, 1);
      _self.ruleForm.curAnswer=''
      console.log(_self.answersList)
    }
  },
  mounted() {
    // this.activeName = 'second'
    // this.activeName = "first";
    // console.log("123");
  },
  computed: {
  },
};
</script>

<style lang="less" scoped>
.active {
  width: 100%;
  height: calc(100vh - 60px);
  box-sizing: border-box;
  // border: 1px red solid;
  display: flex;
  flex-wrap: wrap;

  .card_header {
    width: 100%;
    height: 22%;
    position: relative;
    // border: 1px red solid;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    // .el-tabs {
    //   // border: 1px red solid;
    //   width: 50%;
    //   height: 100%;
    //   margin-left: 20px;
    //   display: flex;
    //   align-items: center;
    //   // position: absolute;
    //   // bottom: 0;
    // }
  }

  .card_content {
    width: 100%;
    height: 70%;
    // border: 1px red solid;
    overflow: auto;

    .handle {
      // border: 1px red solid;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  }

  .card_footer {
    width: 100%;
    height: 8%;
    // height: 100px;
    // border: 1px red solid;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

:deep(.cell) {
  text-align: center;
}

:deep(.showdialog) {

  // border: 1px red solid;
  .el-dialog__body {
    // border: 1px red solid;
    display: flex;

    img {
      width: 100%;
    }
  }
}

.avatar {
  width: 278px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 278px;
  height: 178px;
  text-align: center;
}

:deep(.el-upload) {
  border: none;
}

.domains {

  // border: 1px red solid;
  .el-input {
    width: 90%;
    // border: 1px red solid;
  }
}

.el-form {
  /* border: 1px red solid; */
  max-height: 600px;
  overflow-y: auto;
}

.el-breadcrumb {
  // border: 1px red solid;
  width: 100%;
  height: 30%;
  // background: gray;
  // color: aliceblue;
  display: flex;
  font-size: 1rem;
  margin-left: 15px;
}

.card_opt {
  width: 100%;
  height: 30%;
  // border: 1px red solid;
  display: flex;

  // justify-content: flex-end;
  // position: absolute;
  // right: 50px;
  // top: 25px;
  .el-button {
    margin-right: 20px;
  }
}

.card_opt2 {
  width: 100%;
  height: 35%;
  // border: 1px red solid;
  display: flex;
  justify-content: flex-start;

  // position: absolute;
  // right: 50px;
  // top: 25px;
  .el-button {
    margin-left: 40px;
  }
}

:deep(.el-form-item__label) {
  width: 110px !important;
  // border: 1px red solid;
}

.card_difficulty {
  // border: 1px red solid;
  display: flex;
  flex-wrap: wrap;

  .el-form-item {
    width: 50%;
    // border: 1px red solid;
  }
}

.btn_submit {
  // border: 1px red solid;
  margin-top: 30px;

  :deep(.el-form-item__content) {
    // border: 1px red solid;
    // margin-top: 50px;
    margin-right: 50px;
    justify-content: flex-end;
  }
}</style>
