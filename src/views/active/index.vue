<template>
  <div class="active">
    <div class="card_header">
      <div class="card_opt">
        <el-button @click="addBtn" type="primary">添加活动</el-button>
      </div>
    </div>
    <el-table
      class="gameData"
      :data="gameData"
      style="width: 100%"
      @row-click="rowClick"
    >
      <el-table-column prop="name" label="游戏" class="name" width="343" />
      <el-table-column class="name" />
      <el-table-column prop="address" width="343">
        <template #default="scope">
          <el-icon><ArrowRight /></el-icon
        ></template>
      </el-table-column>
    </el-table>
    <el-table :data="activeData" class="activeData" style="width: 100%">
      <el-table-column prop="name" label="活动名称" class="active" />
      <el-table-column prop="serialNumber" label="排序" class="active" />
      <el-table-column label="活动海报" class="active">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.poster"
            :preview-src-list="[scope.row.poster]"
            :preview-teleported="true"
            fit="contain"
          />
        </template>
      </el-table-column>
      <el-table-column prop="link" label="活动链接" class="active" />
      <el-table-column prop="" label="是否上架">
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
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <div class="handle">
            <el-link
              :underline="false"
              type="primary"
              @click="modBtn(scope.row)"
              >编辑</el-link
            >
            <el-link :underline="false" type="danger" @click="delBtn(scope.row)"
              >删除</el-link
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="card_footer">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :background="true"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增商品 -->
    <el-dialog
      title="添加活动"
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
        <el-form-item prop="name" label="活动名称">
          <el-input
            v-model="addForm.name"
            maxlength="20"
            :clearable="true"
            tabindex="1"
            placeholder="请输入活动名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="image" label="活动海报" class="image">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/*"
            :show-file-list="false"
            :http-request="() => {}"
            :before-upload="beforeUpload"
            v-model:file-list="addForm.filelist"
          >
            <img v-if="showCover" :src="showCover" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item prop="link" label="活动链接">
          <el-input
            v-model="addForm.link"
            tabindex="2"
            :clearable="true"
            placeholder="请输入活动链接"
          ></el-input>
        </el-form-item>
        <el-form-item prop="content" label="活动内容">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入活动内容"
            v-model="addForm.content"
          >
          </el-input>
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
      title="编辑活动"
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
        :rules="rules2"
      >
        <el-form-item prop="name" label="活动名称">
          <el-input
            v-model="editForm.name"
            maxlength="20"
            :clearable="true"
            tabindex="1"
            placeholder="请输入活动名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="image" label="活动海报" class="image">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/*"
            :show-file-list="false"
            :http-request="() => {}"
            :before-upload="beforeUpload"
            v-model:file-list="editForm.filelist"
          >
            <img v-if="showCover" :src="showCover" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item prop="serialNumber" label="活动排序">
          <el-input
            v-model="editForm.serialNumber"
            maxlength="20"
            :clearable="true"
            tabindex="1"
            placeholder="请输入活动排序"
          ></el-input>
        </el-form-item>
        <el-form-item prop="link" label="活动链接">
          <el-input
            v-model="editForm.link"
            tabindex="2"
            :clearable="true"
            placeholder="请输入活动链接"
          ></el-input>
        </el-form-item>
        <el-form-item prop="content" label="活动内容">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入活动内容"
            v-model="editForm.content"
          >
          </el-input>
        </el-form-item>
        <el-form-item align="center">
          <div class="align">
            <el-button type="primary" @click="submitedit('editForm')"
              >确认</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import tools from "./../../utils/tools";
import { ElMessage, ElLoading } from "element-plus";
import { getLocalStorage, setLocalStorage } from "@/utils/index";
import { Plus } from "@element-plus/icons-vue";
import { uploadFile } from "@/utils/upload";
const rulesBase = {
  name: [
    {
      required: true,
      message: "请输入活动名称",
      trigger: "blur",
    },
  ],
  content: [
    {
      required: true,
      message: "请输入活动内容",
      trigger: "blur",
    },
  ],
  image: [
    {
      required: true,
      message: "请上传活动海报",
      trigger: "blur",
    },
  ],
  link: [
    {
      required: true,
      message: "请输入活动链接",
      trigger: "blur",
    },
    // 判断是否是网址
    {
      validator: (rule, value, callback) => {
        if (value) {
          if (!tools.isUrl(value)) {
            callback(new Error("请输入正确的网址"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
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
      gameData: [
        {
          date: "2016-05-03",
          name: "听歌识曲",
          url: "listenSong",
        },
        {
          date: "2016-05-02",
          name: "歌词接龙",
          url: "soundhound",
        },
      ],
      activeData: [
        {
          date: "2016-05-03",
          name: "投票活动",
          url: "listenSong",
        },
        {
          date: "2016-05-02",
          name: "竞猜活动",
          url: "soundhound",
        },
      ],
      showCover: "",
      addForm: {
        image: "",
        name: "",
        link: "",
        content: "",
        filelist: [],
      },
      editForm: {
        image: "",
        name: "",
        link: "",
        content: "",
        serialNumber: "",
        filelist: [],
      },
      editdata: [],
      rules: { ...rulesBase },
      rules2: {
        ...rulesBase,
        serialNumber: [
          {
            required: true,
            message: "请输入活动排序",
            trigger: "blur",
          },
        ],
      },
      showAddDlg: false,
      showEditDlg: false,
      shelvesLoading: false,
      modId: "",
    };
  },
  mounted() {
    this.getAllActive();
    // let a = "http://10.0.30.117/upload/506be11969a5a3f7f11146b927a54a6a.png";
    // let b = a.split("http://10.0.30.117/upload/")[1]
    // // .split("?")[0];
    // console.log(b)
  },
  methods: {
    getAllActive() {
      let _this = this;
      let from = {
        // parentId: this.parentId,.
        page: this.currentPage - 1,
        size: this.pageSize,
        // sort: "serialNumber,asc",
      };
      _this.$http.findAllActivity(from).then((res) => {
        console.log(res);
        this.activeData = res.data.result.content;
        this.total = res.data.result.totalElements;
        console.log(this.activeData);
      });
    },
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.getAllActive();
    },
    rowClick(row) {
      console.log("rowClick", `/${row.url}`);
      this.$router.push(`/${row.url}`);
      // this.$router.push('/homePage')
      // this.$router.push('/administratorList')
    },
    addBtn() {
      console.log("123");
      this.showAddDlg = true;
    },
    closeAddDlg() {
      console.log("close");
      this.addForm.name = "";
      this.addForm.link = "";
      this.addForm.image = "";
      this.addForm.content = "";
      this.showCover = "";
    },
    closeEditDlg() {
      this.editForm.name = "";
      this.editForm.link = "";
      this.editForm.image = "";
      this.editForm.content = "";
      this.editForm.serialNumber = ""
      this.showCover = "";
    },
    beforeUpload(file) {
      console.log(file);
      this.loading = ElLoading.service({
        lock: true,
        text: "正在上传...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      uploadFile(file, async (res) => {
        console.log(res);
        if (res.code == 0) {
          this.loading.close();
          this.showCover = res.result.url;
          this.addForm.image = res.result.fileName;
          this.editForm.image = res.result.fileName;
          if (this.addForm.filelist.length > 1) {
            this.addForm.filelist = [
              this.addForm.filelist[this.addForm.filelist.length - 1],
            ];
          }
          if (this.editForm.filelist.length > 1) {
            this.editForm.filelist = [
              this.editForm.filelist[this.editForm.filelist.length - 1],
            ];
          }
          // console.log(this.addForm.filelist);

          // _this.editForm.image = res.src;
        }
      });

      console.log(this.showCover);
    },
    handleRemoveImage(uploadFile, uploadFiles) {
      console.log("handleRemoveImage", uploadFile, uploadFiles);
      this.showCover = "";
      this.addForm.image = "";
    },
    // 提交新增
    submitAdd(formName) {
      this.addForm.name = this.addForm.name.trim();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("this.addForm", this.addForm);
          let from = {
            content: this.addForm.content,
            link: this.addForm.link,
            name: this.addForm.name,
            poster: this.addForm.image,
          };
          console.log(from);
          this.$http.addActivity(from).then((res) => {
            if (res.data.code == 0) {
              ElMessage({
                message: "添加成功",
                type: "success",
              });
              let posterData = getLocalStorage("file_poster");
              let a = {
                name: this.addForm.name,
                poster: this.addForm.image,
              };
              if (posterData) {
                posterData.push(a);
                setLocalStorage("file_poster", posterData);
              } else {
                setLocalStorage("file_poster", [a]);
              }
            }
            this.showAddDlg = false;
            this.getAllActive();
          });
        } else {
          // this.addForm = {}
          return false;
        }
      });
    },
    submitedit(formName) {
      this.$refs[formName].validate((valid) => {
        // let posterData = getLocalStorage("file_poster");
        if (valid) {
          let from = {
            id: this.modId,
            content: this.editForm.content,
            link: this.editForm.link,
            name: this.editForm.name,
            poster: this.editForm.image,
          };
          let from2 = {
            id: this.modId,
            serialNumber: this.editForm.serialNumber,
          };
          console.log("from", from);
          // return;
          this.$http.modifyActivity(from).then((res) => {
            if (res.data.code == 0) {
              if (this.editForm.serialNumber != this.editdata.serialNumber) {
                this.$http.updateSerialNumber(from2).then((res) => {
                  console.log(res);
                  if (res.data.code == 0) {
                    ElMessage({
                      message: "修改成功",
                      type: "success",
                    });
                    this.showEditDlg = false;
                    this.getAllActive();
                  }
                });
              } else {
                ElMessage({
                  message: "修改成功",
                  type: "success",
                });
                this.showEditDlg = false;
                this.getAllActive();
              }
            }
          });
        }

        // console.log("from", from);
        // console.log("data", this.editdata);
      });
    },
    shelvesChange(val) {
      let _self = this;
      let from = {
        id: val.id,
      };
      console.log(val.shelves);
      if (val.shelves == true) {
        //上架
        _self.$http.shelvesActivity(from).then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            // console.log(';1233132')
            this.getAllActive();
            ElMessage({
              message: "上架成功",
              type: "success",
            });
          }
        });
      } else {
        _self.$http.cancelShelvesActivity(from).then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            this.getAllActive();
            ElMessage({
              message: "下架成功",
              type: "success",
            });
          }
        });
      }
    },
    modBtn(val) {
      this.editdata = val;
      this.showEditDlg = true;
      console.log(val);
      this.editForm.name = val.name;
      this.editForm.link = val.link;
      this.showCover = val.poster;
      this.modId = val.id;
      // let posterData = getLocalStorage("file_poster");
      // posterData.forEach((item, index) => {
      //   if (item.name == val.name) {s
      //     this.editForm.image = item.poster;
      //   }
      // });
      this.editForm.image = val.poster.split("http://10.0.30.117/upload/")[1];
      console.log(this.editForm.image);
      this.editForm.serialNumber = val.serialNumber;
      this.editForm.content = val.content;
      // console.log('123')
    },
    delBtn(val) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(val);
          let from = {
            id: val.id,
          };
          this.$http.deleteActivity(from).then((res) => {
            if (res.data.code == 0) {
              ElMessage({
                type: "success",
                message: "删除成功",
              });
              this.getAllActive();
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
// .name {
// :deep(.cell:first-child) {
//   border: 1px red solid;
//   // padding-left: 100px;
// }
// }
.card_footer {
  // border: 1px red solid;
  display: flex;
  justify-content: center;
}
.gameData {
  :deep(.el-table__header) {
    // border: 1px red solid;
    // text-align: center;
    .cell {
      // border: 1px red solid;
      text-align: center;
      // padding-left: 0;
      // padding-left: 50px;
      // border: 1px red solid;
    }
  }
  :deep(.el-table__cell) {
    // border: 1px red solid;
    text-align: center;
  }
}
.activeData {
  :deep(.el-table__header) {
    // border: 1px red solid;
    .cell {
      // border: 1px red solid;
      text-align: center;
      padding-left: 0;
      // padding-left: 50px;
      // border: 1px red solid;
    }
  }
  :deep(.el-table__cell) {
    // border: 1px red solid;
    text-align: center;
  }
}
.avatar-uploader .avatar {
  width: 278px;
  height: 178px;
  display: block;
  object-fit: cover;
}
.handle {
  // border: 1px red solid;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
:deep(.el-dialog__body) {
  border: 1px red solid;
}
.el-form {
  // border: 1px red solid;
  max-height: 600px;
  overflow-y: auto;
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
