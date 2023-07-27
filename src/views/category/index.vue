<template>
  <div class="container">
    <div class="box">
      <div class="header">
        <div class="box-1">
          <el-breadcrumb separator-icon="ArrowRightBold">
            <el-breadcrumb-item
              :to="{ path: '/category' }"
              v-for="(item, index) in breadList"
              >{{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="box-2">
          <el-button type="primary" @click="add()">新增分类</el-button>
        </div>
      </div>
      <div class="orderList-content">
        <el-table :data="dataList" style="width: 100%">
          <el-table-column prop="cover" label="封面">
            <template #default="scope">
              <!-- {{scope.row}} -->
              <el-image
                style="width: 100px; height: 100px"
                fit="cover"
                :preview-teleported="true"
                :preview-src-list="[scope.row.cover]"
                :src="scope.row.cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="分类名称" />
          <el-table-column prop="createdAt" label="创建时间">
            <template #default="scope">
              {{ tools.transitionTime(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="serialNumber" label="排序" />
          <el-table-column prop="shelves" label="是否上架">
            <template #default="scope">
              <el-switch
                v-model="scope.row.shelves"
                @change="putAway(scope.row)"
              />
            </template> </el-table-column
          >>
          <el-table-column prop="address" label="操作">
            <template #default="scope">
              <div class="handle">
                <el-link
                  :underline="false"
                  type="primary"
                  @click="check(scope.row)"
                  >查看</el-link
                >
                <el-link
                  :underline="false"
                  type="primary"
                  @click="modify(scope.row)"
                  >修改</el-link
                >
                <el-link
                  :underline="false"
                  type="danger"
                  @click="del(scope.row)"
                  >删除</el-link
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 修改弹出层 -->
    <el-dialog
      v-if="centerDialogVisible"
      class="modifydialog"
      v-model="centerDialogVisible"
      @close="closeDialog"
      :title="dialogStu == 'add' ? '新增分类' : '分类信息编辑'"
      width="800px"
      :append-to-body="true"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :hide-required-asterisk="false"
      >
        <div class="content">
          <div class="title-box">
            <el-form-item label="分类名称：" prop="input">
              <el-input
                v-model="ruleForm.input"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </div>
          <div class="uplpad-box">
            <el-form-item label="分类封面：" prop="image" class="imgavatar">
              <el-upload
                action="#"
                :auto-upload="true"
                accept="image/*"
                :http-request="beforeUpload"
                :on-remove="handleRemoveImage"
                :show-file-list="false"
              >
                <img v-if="showCover" :src="showCover" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item
              class="showType"
              v-if="dialogStu == 'modify'"
              label="展示类型："
              prop="selval"
            >
              <el-select
                v-model="selval"
                placeholder="Select"
                size="large"
                @change="atType(selval)"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              class="sort"
              v-if="dialogStu == 'modify'"
              label="当前排序："
              prop="sortNumber"
            >
              <el-input
                oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                v-model="ruleForm.sortNumber"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </div>
          <div class="footer">
            <el-button type="primary" @click="confirm('ruleForm')">
              确认
            </el-button>
          </div>

          <!-- <el-dialog class="imgdialog" v-model="dialogVisible">
            <el-image :src="dialogImageUrl" :file-list="fileList" alt="Preview Image" />
          </el-dialog> -->
        </div>
      </el-form>
    </el-dialog>
    <!-- 删除弹出层 -->
    <el-dialog
      class="deldialog"
      v-model="delDialogVisible"
      title="确认提示"
      width="40%"
      align-center
      center
    >
      <span class="delHint"> 确认删除该分类吗？ </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="sureDel()"> 确认 </el-button>
          <el-button @click="delDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import tools from "@/utils/tools";
// import { thisTypeAnnotation } from '@babel/types'
import {
  Delete,
  Download,
  Plus,
  ZoomIn,
  ArrowRight,
  ArrowRightBold,
} from "@element-plus/icons-vue";
import { UploadFile, ElMessage } from "element-plus";
import { uploadMultiple } from "@/utils/uploadVideo";
// import {  } from 'element-plus'
const rulesBase = {
  image: [
    {
      required: true,
      message: "请上传封面",
      trigger: "blur",
    },
  ],
};
export default {
  data() {
    return {
      tools,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      value1: false,
      centerDialogVisible: false,
      delDialogVisible: false,
      dataList: [],
      input: "",
      selval: "",
      sortNumber: "",
      modifyId: "",
      modifyType: "",
      shelves: "",
      showCover: "",
      dialogStu: "",
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      delId: "",
      cover: "",
      url: "",
      breadList: [
        {
          name: "分类管理",
          id: 0,
        },
      ],
      userInfo: {},
      ruleForm: {
        name: "",
        input: "",
        image: "",
        selval: "",
        sortNumber: "",
      },
      rules: {
        input: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        selval: [
          { required: true, message: "请上传分类封面", trigger: "blur" },
        ],
        sortNumber: [
          { required: true, message: "请输入分类排序", trigger: "blur" },
        ],
        ...rulesBase,
        // name: [
        //   { required: true, message: '请输入分类名称', trigger: 'blur' },
        //   { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        // ]
      },
      options: [
        {
          value: "IMAGE_TEXT_EXHIBITION",
          label: "图文展示",
        },
        {
          value: "TABULATION_EXHIBITION",
          label: "列表展示",
        },
      ],
      modifydata: {},
    };
  },
  created() {
    //
    console.log("created", this.$router.currentRoute.fullPath);
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  },
  mounted() {
    this.getList();
    sessionStorage.removeItem("breadList");
  },
  methods: {
    getList() {
      // location.reload()
      let _this = this;
      let from = {
        parentId: 0,
        page: this.currentPage - 1,
        size: 10,
        sort: "serialNumber,asc",
      };
      _this.$http.getCategory(from).then((res) => {
        console.log(res);
        this.dataList = res.data.result.content;
        this.total = res.data.result.totalElements;
        this.dataList.forEach((item, index) => {
          // console.log(item)
          item.delStu = false;
        });
        // console.log(this.dataList)
        // dataList
      });
    },
    handleSizeChange() {},
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.getList();
    },
    //查看点击事件
    check(val) {
      console.log("scope.row", val);
      this.$router.replace({
        path: "./checkCategory",
        query: {
          data: val.name,
          id: val.id,
        },
      });
    },
    //新增分类点击事件
    add() {
      this.dialogStu = "add";
      this.centerDialogVisible = true;
      this.ruleForm.input = "";
    },
    //修改分类点击事件
    modify(val) {
      this.modifydata = val;
      console.log(this.modifydata);
      this.fileList.push({
        name: val.name,
        url: val.cover,
      });
      this.showCover = val.cover;
      this.ruleForm.image = val.cover;
      this.ruleForm.input = val.name;
      this.ruleForm.sortNumber = val.serialNumber;
      this.shelves = val.shelves;
      this.dialogStu = "modify";
      if (val.exhibitionType == "IMAGE_TEXT_EXHIBITION") {
        this.selval = "图文展示";
        this.ruleForm.selval = "图文展示";
      }
      if (val.exhibitionType == "TABULATION_EXHIBITION") {
        this.selval = "列表展示";
        this.ruleForm.selval = "列表展示";
      } else {
        this.selval = "图文展示";
        this.ruleForm.selval = "图文展示";
      }
      console.log(this.showCover);
      this.centerDialogVisible = true;
      console.log(val);
      this.modifyId = val.id;
    },
    //删除分类点击事件
    del(val) {
      let _this = this;
      console.log(val);
      this.delId = val.id;
      let from = {
        id: this.delId,
      };
      _this
        .$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          _this.$http.deleteCategory(from).then((res) => {
            if (res.data.code === 0) {
              _this.$message({
                type: "success",
                message: "删除成功",
              });

              _this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    "管理员" + _this.userInfo.name + "删除了分类" + val.name,
                })
                .then(() => {
                  this.getList();
                });
            } else {
              _this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          });
        });

      // this.delDialogVisible = true
    },
    sureDel() {
      let from = {
        id: this.delId,
      };
      let _this = this;
      _this.$http.deleteCategory(from).then((res) => {
        console.log(res);
        if (res.data.code == 0) {
          ElMessage({
            message: res.data.msg,
            type: "success",
          });
          this.getList();
          this.delDialogVisible = false;
          this.$http
            .operateLogSave({
              operateLogType: "ADMIN_OPT",
              detail:
                "管理员" + this.userInfo.name + "删除了分类," + this.delId,
            })
            .then((res) => {
              // console.log(res)
            });
        }
        if (res.status == 200) {
          if (res.data.code == 30000) {
            ElMessage({
              message: res.data.msg,
              type: "warning",
            });
            this.delDialogVisible = false;
          }
        }
      });
    },
    //移除封面点击事件
    handleResmove(file) {
      // console.log(file)
      // let a = {}
      // this.fileList = a
      // this.fileList[0].name = ""
      // this.fileList[0].
    },
    //查看封面点击事件
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //下载封面点击事件
    handleDownload(file) {
      console.log(file);
    },
    beforeUpload(file) {
      console.log(12124154545);
      let _this = this;
      console.log(file);
      uploadMultiple(file, (res) => {
        console.log(res);
        this.cover = res.src;
        this.url = res.url;
        this.showCover = res.url;
        this.ruleForm.image = res.url;
        console.log(this.fileList);
      });

      // if(this.dialogStu == "add"){
      this.fileList.push({
        naem: this.cover,
        url: this.url,
      });
      // }
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.dialogStu == "modify") {
          if (
            this.ruleForm.input == "" ||
            this.fileList.length == 0 ||
            this.ruleForm.sortNumber == ""
          ) {
            // ElMessage({
            //   message: "请输入完整修改的分类信息",
            //   type: "warning",
            // });
            return;
          } else {
            console.log("modify");
            console.log(this.fileList);
            if (this.selval == "图文展示") {
              this.modifyType = "IMAGE_TEXT_EXHIBITION";
            } else {
              this.modifyType = "TABULATION_EXHIBITION";
            }
            console.log(this.modifyType);
            let from = {
              serialNumber: this.ruleForm.sortNumber,
              exhibitionType: this.modifyType,
              cover: this.cover,
              name: this.ruleForm.input,
              id: this.modifyId,
              shelves: this.shelves,
            };
            console.log(from);
            // return;
            let _this = this;
            // debugger;
            _this.$http.updateCategory(from).then((res) => {
              console.log(res);
              if (res.status == 200) {
                if (res.data.code == 30000) {
                  ElMessage({
                    message: res.data.msg,
                    type: "warning",
                  });
                  this.centerDialogVisible = false;
                }
                if (res.data.code == 0) {
                  ElMessage({
                    message: res.data.msg,
                    type: "success",
                  });
                  // console.log(this.ruleForm.input, this.modifydata.name);
                  // console.log('showCover',this.showCover);
                  //  console.log(this.modifydata.cover);
                  // console.log(this.ruleForm.sortNumber, this.modifydata.serialNumber);
                  // debugger
                  if (this.ruleForm.input != this.modifydata.name) {
                    this.$http
                      .operateLogSave({
                        operateLogType: "ADMIN_OPT",
                        detail:
                          "管理员" +
                          this.userInfo.name +
                          "将分类" +
                          this.modifydata.name +
                          "的名称修改为" +
                          this.ruleForm.input,
                      })
                      .then((res) => {});
                  }
                  if (this.showCover != this.modifydata.cover) {
                    this.$http
                      .operateLogSave({
                        operateLogType: "ADMIN_OPT",
                        detail:
                          "管理员" +
                          this.userInfo.name +
                          "修改了分类" +
                          this.ruleForm.input +
                          "的封面",
                      })
                      .then((res) => {});
                  }
                  if (
                    this.ruleForm.sortNumber != this.modifydata.serialNumber
                  ) {
                    this.$http
                      .operateLogSave({
                        operateLogType: "ADMIN_OPT",
                        detail:
                          "管理员" +
                          this.userInfo.name +
                          "将分类" +
                          this.ruleForm.input +
                          "的排序修改为" +
                          this.ruleForm.sortNumber,
                      })
                      .then((res) => {});
                  }
                  if (this.modifyType != this.modifydata.exhibitionType) {
                    let a = "";
                    if (this.modifyType == "IMAGE_TEXT_EXHIBITION") {
                      a = "图文展示";
                    } else {
                      a = "列表展示";
                    }
                    this.$http
                      .operateLogSave({
                        operateLogType: "ADMIN_OPT",
                        detail:
                          "管理员" +
                          this.userInfo.name +
                          "将分类" +
                          this.ruleForm.input +
                          "的展示类型修改为" +
                          a,
                      })
                      .then((res) => {});
                  }
                  this.cover = "";
                  this.url = "";
                  this.getList();
                  this.centerDialogVisible = false;
                }
                if (res.data.code == 10006) {
                  ElMessage({
                    message: res.data.msg,
                    type: "warning",
                  });
                  this.centerDialogVisible = false;
                  this.getList();
                }
              }
            });
          }
        }
        if (this.dialogStu == "add") {
          // console.log('add')
          if (this.ruleForm.input == "" || this.fileList.length == 0) {
            // ElMessage({
            //   message: "请输入完整添加的分类信息",
            //   type: "warning",
            // });
            return;
          } else {
            this.centerDialogVisible = false;
            let from = {
              // parentId: 1,
              cover: this.cover,
              name: this.ruleForm.input,
            };
            console.log(from);
            let _this = this;
            _this.$http.addCategory(from).then((res) => {
              console.log(res);
              if (res.status == 200) {
                if (res.data.code == 30000) {
                  ElMessage({
                    message: res.data.msg,
                    type: "warning",
                  });
                  this.centerDialogVisible = false;
                }
                if (res.data.code == 0) {
                  ElMessage({
                    message: res.data.msg,
                    type: "success",
                  });
                  this.getList();
                  // this.dialogImageUrl = ""

                  this.$http
                    .operateLogSave({
                      operateLogType: "ADMIN_OPT",
                      detail:
                        "管理员" +
                        this.userInfo.name +
                        "新增了分类" +
                        this.ruleForm.input,
                    })
                    .then((res) => {
                      // location.reload()
                      // console.log(res)
                    });
                  this.centerDialogVisible = false;
                }
                if (res.data.code == 10006) {
                  ElMessage({
                    message: res.data.msg,
                    type: "warning",
                  });
                  this.centerDialogVisible = false;
                  this.getList();
                }
              }
            });
          }
        }
      });
    },
    handleRemoveImage(uploadFile, uploadFiles) {
      console.log("handleRemoveImage", uploadFile, uploadFiles);
      this.showCover = "";
      // this.fileList.image = ''
    },
    closeDialog() {
      this.fileList = [];
      this.showCover = "";
      this.url = "";
      this.cover = "";
      this.ruleForm.sortNumber = "";
      // this.ruleForm.input = "123"
      this.ruleForm.input = "";
    },
    //是否上架开关
    putAway(val) {
      // console.log(val);
      // console.log(val.shelves);
      let from = {
        id: val.id,
        shelves: val.shelves,
      };
      console.log(from);
      let _this = this;
      _this.$http.updateCategoryState(from).then((res) => {
        console.log(res);
        if (res.status == 200) {
          if (res.data.code == 0) {
            ElMessage({
              message: res.data.msg,
              type: "success",
            });
            this.$http
              .operateLogSave({
                operateLogType: "ADMIN_OPT",
                detail:
                  val.shelves == true
                    ? "管理员" + this.userInfo.name + "上架了" + val.name
                    : "管理员" + this.userInfo.name + "下架了" + val.name,
              })
              .then((res) => {
                // console.log(res)
              });
            this.getList();
          } else {
            ElMessage({
              message: res.data.msg,
              type: "warning",
            });
          }
        }
      });
    },
    atType(val) {
      this.modifyType = val;
      if (val == "TABULATION_EXHIBITION") {
        this.selval = "列表展示";
      }
      if (val == "IMAGE_TEXT_EXHIBITION") {
        this.selval = "图文展示";
      }
      console.log(val);
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  // height: calc(100vh - 60px);
  display: flex;
  // flex-wrap: wrap;
  background: white;
  justify-content: center;
  align-items: center;
}

.box {
  width: 97%;
  height: 95%;
  background: white;
}

.header {
  width: 100%;
  // border: 1px red solid;
  height: 80px;
  display: flex;
  align-items: center;

  .box-1 {
    width: 50%;
    height: 100%;
    // background: red;
    // border: 1px red solid;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 20px;
  }

  .box-2 {
    width: 50%;
    height: 100%;
    display: flex;
    // border: 1px red solid;
    align-items: center;
    position: relative;
    justify-content: flex-end;
    margin-right: 20px;

    .el-input {
      width: 40%;
      height: 100%;
    }

    .el-link {
      width: 12%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .el-select {
      width: 13%;
      height: 40px;

      :deep(.el-input__wrapper) {
        height: 30px;
      }
    }

    .backBtn {
      position: absolute;
      right: 1rem;
      // top: 1rem;
    }
  }
}

.orderList-content {
  width: 100%;
  height: 83%;
  display: flex;
  flex-wrap: wrap;
  // border: 1px red solid;
  // justify-content: space-around;
  // flex-direction: column;
  // align-content: space-around;

  // align-items: ;
  // columns: ;
  .card {
    width: 14%;
    height: 26%;
    // background: red;
    // border: 1px red solid;
    display: flex;
    flex-wrap: wrap;
    margin-left: 80px;
    position: relative;

    .el-checkbox {
      position: absolute;
      right: 0;
      top: -13px;
    }

    .property {
      position: absolute;
      left: 0;
      top: 0;
    }

    img {
      width: 100%;
      height: 70%;
      background: red;
    }

    .inf {
      width: 100%;
      height: 30%;
      display: flex;
      flex-wrap: wrap;

      .bookName {
        width: 100%;
        height: 66%;
      }

      span {
        overflow: hidden; //超出的文本隐藏
        display: -webkit-box;
        -webkit-line-clamp: 2; // 超出多少行
        -webkit-box-orient: vertical;

        font-size: 0.7rem;
        // line-height: 100%;
      }

      .createTime {
        width: 100%;
        height: 33%;
        display: flex;

        .time {
          width: 93%;
          display: flex;
          flex-wrap: wrap;
          // border: 1px red solid;
          font-size: 0.2px;
        }

        img {
          width: 5%;
          cursor: pointer;
        }
      }
    }
  }

  // background: yellow;
}

.el-pagination {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  margin-top: 0;
  // border: 1px red solid;
  // background: red;
}

.Btn {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  // border: 1px red solid;
  cursor: pointer;

  .modify {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .delete {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px rgb(235, 237, 240) solid;
  }

  // background: #000;
}

.max-h-300px {
  max-height: 300px;
}

.overflow-auto {
  overflow: auto;
}

.handle {
  width: 50%;
  // border: 1px red solid;
  display: flex;
  justify-content: center;
  margin: 0 auto;

  .el-link {
    width: 33%;
    // border: 1px red solid;
  }
}

.el-dialog__body {
  width: 100%;
  height: 60%;
  // border: 1px red solid;
}

.content {
  width: 100% !important;
  height: 100%;
  // border: 1px red solid;
  display: flex;
  flex-wrap: wrap;

  .title-box {
    width: 97%;
    // border: 1px red solid;
    display: flex;
    align-items: center;

    .el-input {
      width: 100%;
    }
  }
}
:deep(.el-upload > .el-upload--text) {
  border: 1px red solid;
}
.avatar {
  width: calc(100% - 100px);
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

.uplpad-box {
  width: 100%;
  height: 280px;
  // border: 1px red solid;
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  .imgavatar {
    // border: 1px red solid;
    div {
      width: calc(100% - 100px);
      height: 200px;
      display: flex;
      // border: 1px red solid;
      :deep(.el-upload) {
        // border: 1px red solid;
        width: 40%;
        display: flex;
        img {
          width: 100%;
          height: 100%;
          // border: 1px red solid;
        }
      }
    }
  }
  .el-upload {
    border: 1px red solid;
  }
}
.sort {
  width: 97%;
  :deep(.el-form-item__content .el-input) {
    width: 96% !important;
  }
}
.showType {
  height: 30px;
  // border: 1px red solid;
  :deep(.el-form-item__content > div) {
    // width: 55%;
    height: 100%;
  }
  :deep(.el-form-item__content) {
    height: 100%;
  }
  :deep(.el-form-item__content .el-input) {
    width: 100%;
    height: 32px;
  }
  .el-select {
    // border: 1px red solid;
    width: 34%;
  }
  :deep(.select-trigger) {
    width: 100%;
    // border: 1px red solid;
  }
}
:deep(.el-dialog.is-align-center) {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}

.modifydialog {
  height: 50%;
  display: flex;
  flex-wrap: wrap;
  // border: 1px red solid;

  .el-dialog__footer {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .el-dialog--center .el-dialog__body {
    width: 100%;
    height: 60%;
    text-align: center;
  }
}

:deep(.el-table .cell) {
  text-align: center;
}

.deldialog {
  width: 20%;
  height: 30%;
  display: flex;
  flex-wrap: wrap;
}

.deldialog .el-dialog__body {
  width: 100%;
  height: 30%;
  border-top: 2px #bbbbbb solid;
  text-align: center;
}

.deldialog .el-dialog__footer {
  width: 100%;
  display: flex;
  justify-content: center;
}
:deep(.el-form-item) {
  width: 100%;
  // border: 1px red solid;
  display: flex;
  div {
    width: 55%;
  }
}
:deep(.el-form-item__content) {
  width: 100%;
  display: flex;
  .el-input {
    width: 100%;
  }
}

.footer {
  width: 100%;
  // border: 1px red solid;
  display: flex;
  justify-content: center;
  align-items: center;
  // margin-right: 2rem;
  align-content: flex-end;
  margin-left: 0;
  padding-top: 3.2rem;
}
</style>
<style>
.el-popover.my-popover {
  width: 20px;
  height: 60px;
  padding: 0;
}

.el-popover.el-popper {
  min-width: 80px;
}

.el-dialog__header {
  width: 100%;
  height: 10%;
  display: flex;
}

.el-upload-list__item-actions {
  width: 200px;
  height: 200px;
}

.imgdialog {
  height: 80%;
}

:deep(.el-dialog .is-align-center .el-dialog--center) {
  height: 50%;
}
</style>
