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
          <el-form-item label="封面" class="cover">
            <el-upload
              v-model="fileList"
              :file-list="fileList"
              accept="image/*"
              action="#"
              :auto-upload="true"
              list-type="picture-card"
              :http-request="beforeUpload"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :class="objClass"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
              <el-icon>
                <Plus />
              </el-icon>
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
            <!-- :on-exceed="handleExceed" -->
            <el-upload
              ref="uploadT"
              class="upload-demo"
              drag
              action="#"
              accept="video/*,audio/*"
              multiple
              :auto-upload="true"
              :on-change="beforeUploadResChange"
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
          <el-form-item label="简介" class="textarea">
            <el-input
              v-model="textarea"
              rows="8"
              :maxRows="8"
              :minRows="8"
              type="textarea"
              placeholder="请简单介绍一下资源内容"
            />
          </el-form-item>
        </div>
      </div>

      <el-form-item class="submitBtn">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确认修改</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import tools from "@/utils/tools";
import { UploadFilled, Plus, CloseBold } from "@element-plus/icons-vue";
import { uploadMultiple } from "@/utils/uploadVideo";
import { uploadFile } from "@/utils/upload";
import { ElMessage, genFileId } from "element-plus";
import { setLocalStorage, getLocalStorage } from "@/utils/index";

export default {
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      objClass: {
        upLoadShow: true,
        upLoadHide: false,
      },
      urlList: [],
      fileType: "",
      dialogImageUrl: "",
      textarea: "",
      data: [],
      id: "",
      fileName: "",
      ruleForm: {
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
        ],
      },
      cover: "",
      url: "",
      src: "",
      coverurl: "",
      userInfo: {},
    };
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  },
  mounted() {
    this.getRouterData();
    console.log(this.fileList);
  },
  methods: {
    submitForm(formName) {
      console.log("ruleForm", this.ruleForm);
      if (this.fileType == "audio") {
        this.fileType = "AUDIO";
      }
      if (this.fileType == "video") {
        this.fileType = "VIDEO";
      }
      console.log("url", this.urlList[0].url.substring(73, 109) || this.url);
      console.log("fileList", this.fileList);
      let tempurl = "";
      let resourcesVO = {};
      //没有封面时
      if (this.fileList.length == 0) {
        this.cover == null;
        tempurl = null;
        resourcesVO = {
          id: +this.$route.query.id,
          cover: "",
          introduce: this.textarea,
          name: this.ruleForm.name,
          resourcesType: this.fileType,
          url: this.urlList[0].url.substring(73, 109) || this.url,
        };
        // console.log('无封面')
        //有封面时
      } else {
        //
        var str = this.fileList[0].url;
        var newStr = "";
        console.log("str", str.length);
        if (str.length <= 40) {
          newStr = str;
        } else {
          newStr = str.split("upload-dev/")[1].split("?")[0];
        }
        console.log("newStr", newStr);
        // return
        // tempurl = this.fileList[0].url.substring(73, 109);
        if (newStr == "") {
          newStr = this.fileList[0].url;
        }
        resourcesVO = {
          id: +this.$route.query.id,
          cover: newStr,
          introduce: this.textarea,
          name: this.ruleForm.name,
          resourcesType: this.fileType,
          url: this.url,
        };
        // console.log('有封面')
        console.log("filelist", this.fileList);
      }
      console.log(resourcesVO);
      console.log(this.urlList);
      // console.log(tempurl);
      // console.log(this.fileList)
      // return;
      this.$refs[formName].validate((valid) => {
        console.log(valid);

        if (valid) {
          console.log(resourcesVO);
          // debugger
          this.$http.updateRes(resourcesVO).then((res) => {
            console.log(res);
            if (res.status == 200) {
              if (res.data.code == 0) {
                ElMessage({
                  message: res.data.msg,
                  type: "success",
                });
                let falg = true;
                let data = getLocalStorage("resfile") || [];
                console.log("data", data);
                console.log("新增", this.id, this.fileName);
                let tempIndex = data.findIndex((item) => item.id === this.id);
                console.log("tempIndex", tempIndex);
                if (tempIndex == -1) {
                  let tempData = {
                    id: this.id,
                    fileName: this.fileName,
                  };
                  data.push(tempData);
                  setLocalStorage("resfile", data);
                } else {
                  data[tempIndex].fileName = this.fileName;
                  setLocalStorage("resfile", data);
                }

                // return;
                if (data && falg == true) {
                  data.forEach((item, index) => {
                    if (item.id == resourcesVO.id) {
                      console.log("fileName", this.fileName);
                      item.fileName = this.fileName;

                      setLocalStorage("resfile", data);
                    } else {
                      falg = false;
                    }
                  });
                  if (falg == false) {
                    let tempData = {
                      id: this.id,
                      fileName: this.fileName,
                    };
                    data.push(tempData);
                    setLocalStorage("resfile", data);
                  }
                } else {
                  let Array = [];
                  let tempData = {
                    id: this.id,
                    fileName: this.fileName,
                  };
                  Array.push(tempData);
                  setLocalStorage("resfile", Array);
                }
                // return;
                // debugger;s

                if (this.data.name != this.ruleForm.name) {
                  this.$http
                    .operateLogSave({
                      operateLogType: "ADMIN_OPT",
                      detail:
                        "管理员" +
                        this.userInfo.name +
                        "将资源" +
                        this.data.name +
                        "的名称修改为" +
                        this.ruleForm.name,
                    })
                    .then((res) => {
                      // console.log(res)
                    });
                }
                console.log(this.fileList);
                console.log("上传的图片", resourcesVO.cover);
                console.log("返回的图片", this.coverurl);
                if (this.coverurl == null) {
                  this.coverurl = "";
                }
                if (this.coverurl.length >= 40) {
                  this.coverurl = this.coverurl
                    .split("upload-dev/")[1]
                    .split("?")[0];
                }

                if (resourcesVO.cover != this.coverurl || null) {
                  this.$http
                    .operateLogSave({
                      operateLogType: "ADMIN_OPT",
                      detail:
                        "管理员" +
                        this.userInfo.name +
                        "修改了资源" +
                        this.data.name +
                        "的封面",
                    })
                    .then((res) => {
                      // console.log(res)
                    });
                }
                // return
                if (this.urlList[0].url != this.data.url) {
                  this.$http
                    .operateLogSave({
                      operateLogType: "ADMIN_OPT",
                      detail:
                        "管理员" +
                        this.userInfo.name +
                        "修改了资源" +
                        this.data.name +
                        "的资源文件",
                    })
                    .then((res) => {
                      // console.log(res)
                    });
                }
                if (this.textarea != this.data.introduce) {
                  this.$http
                    .operateLogSave({
                      operateLogType: "ADMIN_OPT",
                      detail:
                        "管理员" +
                        this.userInfo.name +
                        "修改了资源" +
                        this.data.name +
                        "的简介",
                    })
                    .then((res) => {
                      // console.log(res)
                    });
                }
                this.$router.push({
                  path: "./res",
                });
              } else {
                ElMessage({
                  message: res.data.msg,
                  type: "warning",
                });
              }
            }
          });
          // alert('submit!');
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //移除封面
    handleRemove(uploadFile, uploadFiles) {
      console.log(uploadFile, uploadFiles);
      this.objClass.upLoadShow = true; //删除图片后显示上传框
      this.objClass.upLoadHide = false;
    },
    //点击上传的封面
    handlePictureCardPreview(uploadFile) {
      this.dialogImageUrl = uploadFile.url;
      this.dialogVisible = true;
      console.log(uploadFile);
    },
    beforeUpload(file) {
      let _this = this;
      // console.log(file)
      uploadMultiple(file, (res) => {
        // console.log(res)
        this.cover = res.src;
        this.objClass.upLoadHide = true; //上传图片后置upLoadHide为真，隐藏上传框
        this.objClass.upLoadShow = false;
        if (this.fileList[0]) {
          this.fileList[0].url = this.cover;
          this.fileList[0].name = file.fil.name;
        } else {
          this.fileList.push({
            url: this.cover,
            name: file.file.name,
          });
        }
      });
      console.log(this.fileList);
    },
    beforeUploadResChange(file) {
      // console.log(file)
      console.log("文件变化", file);
      // var formData = new FormData();
      // formData.set("file", file);
      // var formData = {
      //     file:file
      // };
      // formData.set("file", file);

      //     console.log('formData',formData)
      //     // return
      //     uploadMultiple(formData, (res) => {
      //     console.log('uploadFile',res);
      //     // this.url = res.src;
      //     // this.url = [];

      //     // // this.urlList[0].url = res.src;
      //     // // this.urlList[0].name = file.file.name;
      //   });
    },
    handleExceed(files) {
      console.log(121212);
      this.$refs["uploadT"].clearFiles();
      const file = files[0];
      file.uid = genFileId();
      this.$refs["uploadT"].handleStart(file);
      //   console.log("file", file);
      //   this.urlList = [];
      //   console.log(file[0].name);
      //   this.urlList.push({
      //     name: file[0].name,
      //   });
      // this.
    },
    //上传资源
    beforeUploadRes(file) {
      console.log("beforeUploadRes", file);
      //   console.log("urlList",urlList)
      uploadMultiple(file, (res) => {
        console.log(res);
        this.url = res.src;
        this.fileName = file.file.name;
        this.urlList = [
          {
            name: file.file.name,
            url: res.src,
          },
        ];
        console.log("urlList", this.urlList);
        // this.urlList[0].url = res.src;
        // this.urlList[0].name = file.file.name;
      });
      console.log(this.urlList);
      this.fileType = tools.fileType(file.file.name);
      //   console.log(this.fileType);
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
    getRouterData() {
      let _this = this;
      let from = {
        resourcesId: this.$route.query.id,
      };
      _this.$http.findResById(from).then((res) => {
        console.log(res);
        this.id = res.data.result.id;
        this.data = res.data.result;
        // console.log(this.data.name)
        this.coverurl = this.data.cover;
        if (_this.data.cover == null) {
          this.fileList = [];
        } else {
          this.fileList.push({
            url: this.data.cover,
            name: this.data.name,
          });
          this.objClass.upLoadHide = true; //上传图片后置upLoadHide为真，隐藏上传框
          this.objClass.upLoadShow = false;
        }
        let data = getLocalStorage("resfile");
        if (data) {
          let flag = false;
          data.forEach((item, index) => {
            if (item.id == res.data.result.id) {
              // console.log("有");
              flag = true;
              this.fileName = item.fileName;
            }
          });
          if (!flag) {
            this.fileName = this.data.name;
          }
        } else {
          // console.log("有2");
          this.fileName = this.data.name;
        }
        // console.log("this.data.name", this.data.name);
        console.log("this.fileName", this.fileName);
        // return;
        this.urlList.push({
          url: _this.data.url,
          name: this.fileName,
        });

        // this.urlList[0].url = _this.data.url;
        // this.urlList[0].name = _this.data.name;
        this.cover = this.data.cover;
        _this.ruleForm.name = _this.data.name;
        _this.textarea = _this.data.introduce;
        this.fileType = _this.data.resourcesType;
        // console.log("data", this.fileName);
        // console.log(this.urlList);
        // console.log("data", this.data);
      });
    },
    back() {
      this.$router.push({
        path: "./res",
      });
    },
  },
  watch: {
    $route(to, from) {
      // console.log(to)
      // this.getRouterData()
      // console.log(from)
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

      .el-textarea {
        display: flex;
        // border: 1px red solid;
        // height: 200px;
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

:deep(.el-dialog__body) {
  width: 100%;
  // border: 1px red solid;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-dialog__body > img) {
  width: 90%;
  margin-right: 2rem;
  // border: 1px red solid;
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
:deep(.el-upload-list) {
  width: 200px;
  li {
    border-bottom: 1px gray solid;
  }
  // border: 1px red solid;
}
</style>
<style>
.upLoadHide .el-upload {
  display: none !important;
}
</style>
