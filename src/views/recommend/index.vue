<template>
  <div class="recommend">
    <div class="card_header">
      <div class="card_header_left">
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="资源推荐" name="first"></el-tab-pane>
          <el-tab-pane label="新上书籍" name="second"></el-tab-pane>
        </el-tabs>
        <!-- <div class="card_resource" @click="toResource">资源推荐</div>
        <div class="card_newbook" @click="toNewBook">新上书籍</div> -->
      </div>
      <div class="card_header_right">
        <el-popover
          placement="top"
          title=""
          :width="200"
          trigger="hover"
          content="注:资源推荐只有排序前六的才能在小程序首页展示"
        >
          <template #reference>
            <el-icon class="hint"><Warning /></el-icon>
          </template>
        </el-popover>

        <el-button class="card_addRes" type="primary" @click="openAddRes"
          >添加推荐分类</el-button
        >
        <!-- <div class="card_addRes" ></div> -->
      </div>
    </div>
    <div class="card_content">
      <el-table :data="dataList" style="width: 100%">
        <el-table-column prop="cover" label="封面">
          <template #default="scope">
            <!-- {{scope.row}} -->
            <el-image
              style="width: 100px; height: 100px"
              fit="cover"
              :preview-teleported="true"
              :preview-src-list="[scope.row.classification.cover]"
              :src="scope.row.classification.cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称">
          <template #default="scope">
            {{ scope.row.classification.name }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间">
          <template #default="scope">
            {{ tools.transitionTime(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="serialNumber" label="排序" />
        <!-- <el-table-column prop="shelves" label="是否上架">
          <template #default="scope">
            <el-switch
              v-model="scope.row.shelves"
              @change="putAway(scope.row)"
            />
          </template> </el-table-column
        > -->
        <el-table-column prop="address" label="操作">
          <template #default="scope">
            <div class="handle">
              <el-link
                :underline="false"
                type="primary"
                @click="modify(scope.row)"
                >修改排序</el-link
              >
              <el-link :underline="false" type="danger" @click="del(scope.row)"
                >取消推荐</el-link
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="card_footer">
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
    <!-- 添加推荐分类弹窗 -->
    <el-dialog
      v-if="centerDialogVisible"
      class="addDialog"
      v-model="centerDialogVisible"
      @close="closeDialog"
      title="添加分级"
      width="1000px"
      :append-to-body="true"
    >
      <div class="card_add_content">
        <div class="card_add_header">
          <div class="card_add_left">
            <el-breadcrumb separator-icon="ArrowRightBold">
              <el-breadcrumb-item @click="toHome">一级分类</el-breadcrumb-item>
              <el-breadcrumb-item
                v-for="(item, index) in breadList"
                :key="index"
                @click="toPath(item)"
                >{{ item.name }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>
          <div class="card_add_right">
            <el-button
              type="primary"
              :disabled="this.addIdNameList.length == 0 ? true : false"
              @click="addMany"
              >批量添加</el-button
            >
          </div>
        </div>
        <div class="card_add_container">
          <el-table
            ref="multipleTableRef"
            :data="diadataList"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              :selectable="checkSelectable"
            >
            </el-table-column>

            <el-table-column label="封面">
              <template #default="scope">
                <img
                  v-if="scope.row.cover == null"
                  style="width: 50px; height: 50px; object-fit: cover"
                  src="@/assets/default.png"
                  alt=""
                />
                <el-image
                  v-else
                  style="width: 50px; height: 50px"
                  :src="scope.row.cover"
                />
              </template>
            </el-table-column>
            <el-table-column label="资源名称">
              <template #default="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column property="createdAt" label="创建时间">
              <template #default="scope">
                {{ tools.transitionTime(scope.row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column property="address" label="操作">
              <template #default="scope">
                <el-link
                  :underline="false"
                  type="primary"
                  @click="check(scope.row)"
                  >查看</el-link
                >
                <el-link
                :underline="false"
                  type="primary"
                  class="addBtn"
                  @click="add(scope.row)"
                  :disabled="scope.row.hasExit"
                >
                  {{
                    scope.row.hasExit == false ? "添加" : "已添加"
                  }}</el-link
                >
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination
          v-model:currentPage="currentPage2"
          v-model:page-size="pageSize2"
          layout="total, prev, pager, next, jumper"
          :total="total2"
          :background="true"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
        />
      </div>
    </el-dialog>
    <!-- 修改推荐分类弹窗 -->
    <el-dialog
      v-if="modifyDialogVisible"
      class="modDialog"
      v-model="modifyDialogVisible"
      @close="closeDialog2"
      title="修改分级"
      width="600px"
      :append-to-body="true"
    >
      <div class="card_mod_content">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="60px"
          class="demo-ruleForm"
        >
          <el-form-item label="名称:" prop="name">
            <el-input disabled v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="封面:" prop="cover">
            <!-- <el-input
              v-model="ruleForm.cover"
              type="password"
              autocomplete="off"
            /> -->
            <el-image
              style="width: 150px; height: 150px"
              :src="ruleForm.cover"
              :preview-src-list="[ruleForm.cover]"
              fit="cover"
            />
          </el-form-item>
          <el-form-item label="排序:" prop="serialNumber">
            <el-input v-model.number="ruleForm.serialNumber" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleFormRef')"
              >确认修改</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tools from "@/utils/tools";
import { ElMessage } from "element-plus";
export default {
  name: "recommend",
  data() {
    return {
      tools,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      currentPage2: 1,
      pageSize2: 10,
      total2: 0,
      parentId: 0,
      dataList: [],
      diadataList: [],
      multipleSelection: [], //这是资源添加多选存id的数组
      breadList: [], //面包屑数组
      hasExitList: [],
      addIdNameList: [],
      modifydata: [],
      ruleForm: {
        name: "",
        cover: "",
        serialNumber: "",
      },
      rules: {
        serialNumber: [
          { required: true, message: "请输入分类排序", trigger: "blur" },
        ],
      },
      userInfo: {},
      centerDialogVisible: false,
      modifyDialogVisible: false,
      activeName:'first',
    };
  },
  created() {
    this.getList();
    // this.activeName = "资源推荐"
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  },
  methods: {
    getList() {
      let _this = this;
      let from = {
        page: this.currentPage - 1,
        size: 10,
        sort: "serialNumber,asc",
      };
      _this.$http.getResourceList(from).then((res) => {
        console.log(res);
        this.dataList = res.data.result.content;
        this.total = res.data.result.totalElements;
        // console.log(this.dataList)
        // dataList
      });
    },
    getAddResList() {
      // location.reload()
      let _this = this;
      let from = {
        parentId: this.parentId,
        page: this.currentPage2 - 1,
        size: 10,
        sort: "serialNumber,asc",
      };
      _this.$http.getCategory(from).then((res) => {
        console.log(res);
        this.diadataList = res.data.result.content;
        this.total2 = res.data.result.totalElements;
        this.diadataList.forEach((item, index) => {
          item.hasExit = false;
          this.hasExitList.forEach((item2, index2) => {
            if (item2 == item.id) {
              item.hasExit = true;
            }
          });
        });
      });
    },
    toResource() {
      this.$router.push("./recommend");
    },
    toNewBook() {
      this.$router.push("./recommendBook");
    },
    handleSizeChange() {},
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.getList();
    },
    handleSizeChange2() {},
    handleCurrentChange2(val) {
      console.log(val);
      this.currentPage2 = val;
      this.getAddResList();
    },
    openAddRes() {
      this.centerDialogVisible = true;
      this.getAddResList();
    },
    modify(val) {
      this.modifyDialogVisible = true;
      console.log(val);
      this.modifydata = val;
      this.ruleForm.name = this.modifydata.classification.name;
      this.ruleForm.cover = this.modifydata.classification.cover;
      this.ruleForm.serialNumber = this.modifydata.serialNumber;
    },
    closeDialog() {
      this.multipleSelection = [];
      this.addIdNameList = [];
      this.hasExitList = [];
      this.getList();
    },
    closeDialog2() {},
    //批量删除选中
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      let nameArry = val.map((item) => item.id);
      console.log(nameArry);
      this.addIdNameList = nameArry;
      console.log(val);
      // console.log(this.multipleSelection)
    },
    check(val) {
      // console.log(val);
      this.parentId = val.id;
      this.breadList.push({
        name: val.name,
        id: val.id,
      });
      this.getAddResList();
    },
    toHome() {
      this.parentId = 0;
      this.getAddResList();
      this.breadList = [];
    },
    toPath(val) {
      // console.log(val);
      // console.log(this.breadList);
      let a = this.breadList.findIndex((item) => item.name == val.name);
      // console.log(a);
      let b = this.breadList.slice(0, a + 1);
      // console.log(b);
      this.breadList = b;
      this.parentId = val.id;
      this.getAddResList();
    },
    checkSelectable(row) {
      return row.hasExit == false;
    },
    add(val) {
      // console.log(val);
      // return
      let from = {
        classificationIds: [],
      };
      from.classificationIds.push(val.id);
      this.$http.addResource(from).then((res) => {
        // console.log(res);
        if (res.data.code == 0) {
          val.hasExit = true;
          this.hasExitList.push(val.id);
          ElMessage({
            message: res.data.msg,
            type: "success",
          });
          this.$http
            .operateLogSave({
              operateLogType: "ADMIN_OPT",
              detail:
                "管理员" + this.userInfo.name + "添加了推荐分类" + val.name,
            })
            .then(() => {
              // this.getList();
            });
        }
        // this.diadataList = res.data.result.content;
        // this.total2 = res.data.result.totalElements;
      });
      // addResource
    },
    addMany() {
      console.log(this.addIdNameList);
      let from = {
        classificationIds: this.addIdNameList,
      };
      this.$http.addResource(from).then((res) => {
        // console.log(res);
        if (res.data.code == 0) {
          this.addIdNameList.forEach((item, index) => {
            this.hasExitList.push(item);
          });
          ElMessage({
            message: res.data.msg,
            type: "success",
          });
          let b = [];
          this.multipleSelection.forEach((item, index) => {
            console.log(item.name);
            b.push(item.name);
          });
          let tempText = b.join("、");
          this.$http
            .operateLogSave({
              operateLogType: "ADMIN_OPT",
              detail:
                "管理员" + this.userInfo.name + "批量添加了推荐分类" + tempText,
            })
            .then(() => {
              this.getAddResList();
            });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(123);
          console.log(this.modifydata.id);
          let from = {
            id: this.modifydata.id,
            serialNumber: this.ruleForm.serialNumber,
          };
          this.$http.updateSerialNumber(from).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              ElMessage({
                message: res.data.msg,
                type: "success",
              });
              if (this.ruleForm.serialNumber != this.modifydata.serialNumber) {
                this.$http
                  .operateLogSave({
                    operateLogType: "ADMIN_OPT",
                    detail:
                      "管理员" +
                      this.userInfo.name +
                      "将分类" +
                      this.ruleForm.name +
                      "的排序修改为" +
                      this.ruleForm.serialNumber,
                  })
                  .then(() => {
                    // this.getList();
                  });
              }
              this.getList();
              this.modifyDialogVisible = false;
              // this.closeDialog2()
            }
          });
          // updateSerialNumber
        }
      });
    },
    del(val) {
      // console.log(val);
      // return
      this.$confirm("是否取消推荐?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let from = {
          id: val.id,
        };
        this.$http.deleteResource(from).then((res) => {
          if (res.data.code == 0) {
            ElMessage({
              message: res.data.msg,
              type: "success",
            });
            // this.getList();
            this.$http
              .operateLogSave({
                operateLogType: "ADMIN_OPT",
                detail:
                  "管理员" +
                  this.userInfo.name +
                  "取消推荐了分类" +
                  val.classification.name,
              })
              .then(() => {
                this.getList();
              });
            // this.modifyDialogVisible = false;
            // this.closeDialog2()
          }
        });
      });
    },
    handleClick(tab, event) {
        // console.log(tab, event);
        console.log(tab.props)
        if(tab.props.name == 'second'){
          this.$router.push("./recommendBook");
        }
      }
  },
};
</script>

<style lang="less" scoped>
.recommend {
  // border: 1px red solid;
  box-sizing: border-box;
  height: calc(100vh - 60px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  .card_header {
    width: 100%;
    height: 10%;
    // border: 1px red solid;
    display: flex;

    .card_header_left {
      width: 50%;
      height: 100%;
      // border: 1px red solid;
      display: flex;
      align-items: flex-end;
      .card_resource {
        // border: 1px red solid;
        width: 120px;
        height: 55%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 20px;
        border-radius: 5px;
        background: white;
        color: #4090fd;
        border: 1px #d4d4d4 solid;
        cursor: pointer;
      }
      .card_newbook {
        // border: 1px red solid;
        width: 120px;
        height: 55%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
        border-radius: 5px;
        background: #fafafa;
        border: 1px #d4d4d4 solid;
        cursor: pointer;
      }
    }
    .card_header_right {
      width: 50%;
      height: 100%;
      // border: 1px red solid;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .card_addRes {
        margin-right: 20px;
        cursor: pointer;
      }
      .hint {
        // border: 1px red solid;
        color: #454545;
        font-size: 1.5rem;
        margin-right: 10px;
      }
    }
  }
  .card_content {
    width: 100%;
    height: 80%;
    box-sizing: border-box;
    border-top: 1px #d4d4d4 solid;
    overflow: auto;
  }
  .card_footer {
    width: 100%;
    height: 10%;
    // border: 1px red solid;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

:deep(.el-table .cell) {
  text-align: center;
}
.card_add_content {
  width: 100%;
  height: 500px;
  // border: 1px red solid;
  position: relative;
  .card_add_header {
    width: 100%;
    height: 30px;
    // border: 1px red solid;
    position: absolute;
    top: -30px;
    display: flex;

    .card_add_left {
      width: 50%;
      display: flex;
      align-items: center;
    }
    .card_add_right {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .card_add_container {
    height: 480px;
    overflow-y: auto;
  }
  .addBtn {
    margin-left: 10px;
  }
  .el-pagination {
    // border: 1px red solid;
    display: flex;
    justify-content: center;
  }
  .el-breadcrumb {
    // border: 1px red solid;
    cursor: pointer;
  }
  :deep(.el-breadcrumb__inner) {
    // border: 1px red solid;
    cursor: pointer;
  }
}
.handle {
  // border: 1px red solid;
  display: flex;
  justify-content: space-evenly;
}
.modDialog {
  .card_mod_content {
    width: 100%;
    height: 300px;
    // border: 1px red solid;
    display: flex;
    flex-wrap: wrap;
    .el-form {
      width: 100%;
      height: 100%;
      // display: flex;
      // flex-wrap: wrap;
    }
    .card_name {
      width: 100%;
      height: 10%;
      // border: 1px red solid;
    }
    :deep(.el-form-item__content) {
    }
    :deep(.el-form-item__label) {
      width: 30px;
      // border: 1px red solid;
      display: flex;
      justify-content: center;
    }
  }
}
.el-tabs{
  // border: 1px red solid;
  margin-left: 20px;
}
</style>
