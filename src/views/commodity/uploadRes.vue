<template>
  <div class="container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="header-box">
        <div class="box-1">
          <el-form-item label="标题" prop="name" class="name">
            <el-input
              v-model="ruleForm.name"
              maxlength="20"
              placeholder="请输入资源名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover" class="cover">
            <el-upload
              action="#"
              accept="image/*"
              :auto-upload="true"
              :http-request="beforeUpload"
              :on-preview="handlePictureCardPreview"
              :on-exceed="handleExceed"
              :on-remove="handleRemove"
              :list-type="ptype"
              :limit="1"
              :class="objClass"
              :file-list="fileList"
            >
              <i class="el-icon-plus"></i>
              <!-- <img v-if="showCover" :src="showCover" class="avatar" /> -->
              <el-icon class="avatar-uploader-icon">
                <Plus />
              </el-icon>
              <!-- <template #file="{ file }">
                <div>
                  <img class="avatar" :src="showCover" alt="" />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <el-icon><zoom-in /></el-icon>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleDownload(file)"
                    >
                      <el-icon><Download /></el-icon>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <el-icon><Delete /></el-icon>
                    </span>
                  </span>
                </div>
              </template> -->
            </el-upload>

            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
          </el-form-item>
        </div>
        <div class="box-2">
          <el-icon @click="back">
            <CloseBold />
          </el-icon>
        </div>
      </div>
      <div class="content">
        <div class="box-3">
          <el-form-item label="资源" required>
            <el-upload
              class="upload-demo"
              drag
              action="#"
              multiple
              :auto-upload="true"
              accept="video/*,audio/*"
              :http-request="beforeUploadRes"
              :on-progress="handleprogress"
              :file-list="urlList"
              :limit="2"
            >
              <el-icon class="el-icon--upload">
                <upload-filled />
              </el-icon>
              <div class="el-upload__text">
                将文件拖到此处,<em>或点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">只能上传音频或视频文件</div>
              </template>
            </el-upload>
          </el-form-item>
        </div>
        <div class="box-4">
          <el-form-item label="简介" prop="brief" class="textarea">
            <el-input
              v-model="textarea"
              :rows="8"
              type="textarea"
              placeholder="请简单介绍一下资源内容"
            />
          </el-form-item>
        </div>
      </div>
      <el-form-item class="submitBtn">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >立即上传</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import tools from "@/utils/tools";
import { UploadFilled, Plus, CloseBold, Delete } from "@element-plus/icons-vue";
import { uploadMultiple } from "@/utils/uploadVideo";
import { ElMessage, ElLoading } from "element-plus";
import { setLocalStorage, getLocalStorage } from "@/utils/index";
// import {  } from '@element-plus/icons-vue'
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      urlList:[],
      dialogImageUrl: "",
      textarea: "",
      ruleForm: {
        name: "",
        brief: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
          { max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" },
        ],
      },
      fileType: "",
      cover: "",
      showCover: "",
      url: "",
      userInfo: {},
      ptype: "picture-card",
      disabled: false,
      hideUpload_introduce: false,
      limitCount: 1,
      fileList: [],
      objClass: {
        upLoadShow: true,
        upLoadHide: false,
      },
      fileName: "",
      loading: {},
    };
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  },
  mounted() {},
  computed: {
    ...mapGetters(["uploadProgress"]),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          if (this.fileType == "audio") {
            this.fileType = "AUDIO";
          }
          if (this.fileType == "video") {
            this.fileType = "VIDEO";
          }
          const resourcesVO = {
            cover: this.cover,
            introduce: this.textarea,
            name: this.ruleForm.name,
            resourcesType: this.fileType,
            url: this.url,
          };
          console.log(resourcesVO);
          let _this = this;
          _this.$http.saveRes(resourcesVO).then((res) => {
            console.log(res);
            if (res.status == 200) {
              if (res.data.code == 30000) {
                ElMessage({
                  message: res.data.msg,
                  type: "warning",
                });
                // this.delDialogVisible = false
              }
              if (res.data.code == 0) {
                ElMessage({
                  message: res.data.msg,
                  type: "success",
                });
                let data = getLocalStorage("resfile");
                if (data) {
                  let tempData = {
                    id: res.data.result.id,
                    fileName: this.fileName,
                  };
                  data.push(tempData);
                  setLocalStorage("resfile", data);
                } else {
                  let Array = [];
                  let tempData = {
                    id: res.data.result.id,
                    fileName: this.fileName,
                  };
                  Array.push(tempData);
                  setLocalStorage("resfile", Array);
                }

                this.$router.push({
                  path: "./res",
                });
                this.$http
                  .operateLogSave({
                    operateLogType: "ADMIN_OPT",
                    detail:
                      "管理员" +
                      this.userInfo.name +
                      "上传了资源" +
                      this.ruleForm.name,
                  })
                  .then((res) => {
                    // console.log(res)
                  });
              }
              if (res.data.code == 10006) {
                ElMessage({
                  message: res.data.msg,
                  type: "warning",
                });
                // this.getList()
              }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //移除封面
    handleRemove(uploadFile, uploadFiles) {
      console.log(uploadFile, uploadFiles);
      this.cover = "";
      this.showCover = "";
      this.objClass.upLoadShow = true; //删除图片后显示上传框
      this.objClass.upLoadHide = false;
    },
    //点击上传的封面
    handlePictureCardPreview(uploadFile) {
      this.dialogImageUrl = uploadFile.url;
      this.dialogVisible = true;
      console.log(uploadFile);
    },
    handleExceed(files) {},
    //封面上传
    beforeUpload(file) {
      let _this = this;
      console.log(file);
      uploadMultiple(file, (res) => {
        console.log(res);
        this.cover = res.src;
        this.showCover = res.url;
        this.objClass.upLoadHide = true; //上传图片后置upLoadHide为真，隐藏上传框
        this.objClass.upLoadShow = false;
      });
    },
    beforeUploadRes(file) {
      console.log(file);
      uploadMultiple(file, (res) => {
        console.log(res);
        this.url = res.src;
        // console.log(file.file.name)
        this.fileName = file.file.name;
        this.urlList = [
          {
            name: file.file.name,
            url: res.src,
          }
        ]
      });
      this.fileType = tools.fileType(file.file.name);
      console.log(this.fileType);
      this.loading = ElLoading.service({
        lock: true,
        text: "正在上传...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // console.log(this.loading)
    },
    success(response, uploadFile, uploadFiles) {
      console.log("response", response);
      console.log("uploadFile", uploadFile);
      console.log("uploadFiles", uploadFiles);
    },
    handleprogress(UploadProgressEvent, uploadFile, uploadFiles) {
      console.log("uploadFile", uploadFile);
      console.log("uploadFiles", uploadFiles);
    },
    back() {
      this.$router.push({
        path: "./res",
      });
    },
  },
  // 监听路由变化
  watch: {
    uploadProgress(newV, oldV) {
      // console.log("进度条", newV);
      this.loading.setText("正在上传1个资源"+"("+`${newV.progress}%`+")")
      if(newV.progress >= 100)
      {
        this.loading.close();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  flex-wrap: wrap;

  // background: #000;
  .el-form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    // border: 1px red solid;
  }

  .header-box {
    width: 100%;
    height: 30%;
    display: flex;
    // border: 1px red solid;

    .box-1 {
      width: 50%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      // border: 1px red solid;

      .name {
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
      }

      .cover {
        width: 100%;
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        :deep(.el-form-item__content) {
          width: 100%;
          display: flex;
          div {
            display: flex;
            // border: 1px red solid;
            .avatar {
              width: 100%;
              height: 100%;
              display: block;
              object-fit: cover;
              object-fit: cover;
            }
            // ul > div {
            // display: none;
            // border: 1px red solid;
            // }
          }
        }
        :deep(.el-upload > .el-upload--picture-card) {
          border: 1px red solid;
        }
        // :deep(.el-upload-list) {
        //   border: 1px red solid;
        // }
      }

      // margin: 20px auto;
      .el-input {
        width: 50%;
      }
    }

    .box-2 {
      width: 50%;
      height: 100%;
      display: flex;
      justify-content: flex-end;

      .el-icon {
        margin-top: 2rem;
        margin-right: 2rem;
        font-size: 1.5rem;
        // border: 1px red solid;
        color: red;
        cursor: pointer;
      }

      // border: 1px red solid;
    }
  }

  .content {
    width: 100% !important;
    height: 60%;
    display: flex;
    // border: 1px red solid;
    flex-wrap: wrap;

    .box-3 {
      width: 100%;
      height: 65%;
      // border: 1px red solid;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .el-form-item {
        display: flex;
        width: 100%;

        // background: red;
        .upload-demo {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          // border: 1px pink solid;

          :deep(.el-upload.is-drag) {
            width: 79%;
            display: flex;

            .el-upload-dragger {
              width: 100%;
            }
          }

          .el-upload__tip {
            width: 100%;
            padding-left: 1rem;
          }

          .el-upload > .el-upload--text > .is-drag {
            width: 100%;
          }
        }
      }

      :deep(.el-form-item__content) {
        width: 100%;
      }

      :deep(.el-upload-dragger) {
        width: 94.5%;
      }
    }

    .box-4 {
      width: 100%;
      height: 35%;
      // border: 1px red solid;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      .textarea {
        width: 80%;
        height: 100%;
        // border: 1px red solid;
        display: flex;
        justify-content: center;
        align-items: flex-start;
      }

      :deep(.el-textarea__inner) {
        display: flex;
        min-height: 100%;
        height: 100%;
        // border: 1px red solid;
        resize: none;
      }

      // .el-input {
      //     width: 50%;
      // }
    }
  }
}

.submitBtn {
  width: 100%;
  height: 50px;
  display: flex;
  // justify-content: flex-end;
  // border: 1px red solid;
  position: relative;

  .el-button {
    position: absolute;
    // border: 1px red solid;
    right: 80px;
  }
}

.avatar {
  //   width: calc(100% - 100px);
  height: 178px;
  display: block;
  object-fit: cover;
  object-fit: cover;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 178px;
  text-align: center;
}
// :deep(.el-upload el-upload--text){
//     border: 1px red solid;
// }
</style>
<style>
/*当upLoadShow为true时，启用如下样式，即上传框的样式，若为false则不启用该样式*/
/* .upLoadShow .el-upload {
  width: 30rem !important;
  height: 30rem !important;
  line-height: 30rem !important;
} */

/*当upLoadHide为true时，启用如下样式，即缩略图的样式，若为false则不启用该样式*/
/* s */
/*当upLoadHide为true时，启用如下样式，即上传框的样式，若为false则不启用该样式*/
.upLoadHide .el-upload {
  display: none !important;
}
</style>
