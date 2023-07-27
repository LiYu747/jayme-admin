<template>
  <div class="container">
    <div class="header">
      <div class="box-1">
        <div class="checkbox" v-if="this.state == false">
          <!-- <el-checkbox v-model="checked" label="全选" size="large" @change="selectChecked(checked)" />
          <el-link :underline="false" @click="delMany">删除</el-link> -->

          <el-select
            v-model="value2"
            class="m-2"
            placeholder="Select"
            size="large"
            @change="atType(value2)"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="input"
            class="w-50 m-2"
            size="small"
            placeholder="搜索资源"
            @keyup.enter.native="search"
          >
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="checkbox" v-if="this.state == true">
          <div class="delpage">
            <el-checkbox
              v-model="checked"
              label="全选"
              size="large"
              @change="selectChecked(checked)"
            />
            <el-link :underline="false" @click="delMany">删除</el-link>
          </div>
        </div>
      </div>
      <div class="box-2" v-if="this.state == false">
        <!-- <el-link :underline="false" @click="showState">批量操作</el-link> -->
        <!-- <el-select v-model="value" class="m-2" placeholder="Select" size="large" @change="atMost(value)">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->

        <el-button type="primary" @click="upload">上传资源</el-button>
      </div>
      <div class="box-2" v-if="this.state == true">
        <el-button class="backBtn" @click="back">返回</el-button>
      </div>
    </div>

    <div
      class="orderList-content"
      style="justify-content: center"
      v-if="this.dataList.length == 0"
    >
      <el-empty :image-size="400" />
    </div>
    <div class="orderList-content" v-if="this.dataList.length !== 0">
      <el-row>
        <el-card
          v-if="this.state == false"
          :body-style="{
            padding: '0px',
          }"
          v-for="(item, index) in dataList"
          :key="index"
          shadow="hover"
        >
          <el-checkbox
            v-model="item.delStu"
            size="large"
            @change="delThis(item)"
            v-if="this.state == true"
          />
          <div
            class="type"
            v-if="this.state == false && item.resourcesType == 'VIDEO'"
          >
            <el-icon>
              <VideoCameraFilled />
            </el-icon>
          </div>
          <div
            class="type"
            v-if="this.state == false && item.resourcesType == 'AUDIO'"
          >
            <el-icon>
              <Headset />
            </el-icon>
          </div>
          <img
            v-if="item.cover"
            :src="item.cover"
            alt=""
            class="image"
            @click="modify(item)"
          />
          <img
            v-if="item.cover == null"
            class="image"
            src="@/assets/default.png"
            alt=""
            style="object-fit: contain"
            @click="modify(item)"
          />
          <div style="padding: 3px; height: 20%; width: 100%">
            <div class="bookName">
              <h4>{{ item.name }}</h4>
            </div>
          </div>
          <div class="bottom clearfix" id="btn">
            <span class="time"
              >创建于：{{ tools.transitionTime(item.createdAt) }}</span
            >
            <span style="justify-content: flex-end">
              <el-popover
                placement="bottom"
                :width="80"
                :visible="item.delStu[index]"
                ref="setRemovePop"
                popper-class="my-popover"
                :fallback-placements="['bottom', 'top', 'right', 'left']"
              >
                <template #reference>
                  <img
                    src="@/assets/more.png"
                    alt=""
                    style="height: 1rem"
                    @click="showVisible(item.delStu, index)"
                  />
                </template>
                <template #default>
                  <div class="Btn">
                    <div class="modify" @click="modify(item)">修改</div>
                    <div class="delete" @click="del(item, index)">删除</div>
                  </div>
                </template>
              </el-popover>
            </span>
          </div>
        </el-card>
        <el-card
          :body-style="{
            padding: '0px',
          }"
          v-for="(item, index) in dataList"
          :key="index"
          shadow="hover"
          v-if="this.state == true"
          @click="chosedel(item)"
        >
          <el-checkbox
            v-model="item.delStu"
            size="large"
            @change="delThis(item)"
            v-if="this.state == true"
          />
          <div
            class="type"
            v-if="this.state == false && item.resourcesType == 'VIDEO'"
          >
            <el-icon>
              <VideoCameraFilled />
            </el-icon>
          </div>
          <div
            class="type"
            v-if="this.state == false && item.resourcesType == 'AUDIO'"
          >
            <el-icon>
              <Headset />
            </el-icon>
          </div>
          <img v-if="item.cover" :src="item.cover" alt="" class="image" />
          <img
            v-if="item.cover == null"
            class="image"
            src="@/assets/default.png"
            alt=""
            style="object-fit: contain"
          />
          <div style="padding: 3px; height: 20%; width: 100%">
            <div class="bookName">
              <h4>{{ item.name }}</h4>
            </div>
          </div>
          <div class="bottom clearfix" id="btn">
            <span class="time"
              >创建于：{{ tools.transitionTime(item.createdAt) }}</span
            >
            <span style="justify-content: flex-end">
              <el-popover
                placement="bottom"
                :width="80"
                :visible="item.delStu[index]"
                ref="setRemovePop"
                popper-class="my-popover"
                :fallback-placements="['bottom', 'top', 'right', 'left']"
              >
                <template #reference>
                  <img
                    src="@/assets/more.png"
                    alt=""
                    style="height: 1rem"
                    @click="showVisible(item.delStu, index)"
                  />
                </template>
                <template #default>
                  <div class="Btn">
                    <div class="modify" @click="modify(item)">修改</div>
                    <div class="delete" @click="del(item, index)">删除</div>
                  </div>
                </template>
              </el-popover>
            </span>
          </div>
        </el-card>
      </el-row>
    </div>
    <div class="page">
      <div class="delMany">
        <el-link :underline="false" @click="showState">批量操作</el-link>
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
  </div>
</template>
<script>
import tools from "@/utils/tools";
import { VideoCameraFilled, Headset } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      input: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      options: [
        {
          value: "createdAt",
          label: "最新上传",
        },
        {
          value: "broadcastNumber",
          label: "最多播放",
        },
      ],
      options2: [
        {
          value: "",
          label: "全部类型",
        },
        {
          value: "AUDIO",
          label: "仅音频",
        },
        {
          value: "VIDEO",
          label: "仅视频",
        },
      ],
      value: "",
      value2: "",
      dataList: [],
      state: false,
      checked: false,
      delDialogVisible: false,
      visible: false,
      tools,
      resType: "",
      delId: "",
      valM: "",
      valT: "",
      multipleSelection: [],
      delManyNameList: [],
      userInfo: {},
      resdata: {},
    };
  },
  created() {
    console.log("created", this.$router.currentRoute.fullPath);
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  },
  mounted() {
    this.getList();
    this.value = "最新上传";
    this.value2 = "全部类型";
    // console.log("123")
    //
  },
  methods: {
    getList() {
      let _this = this;
      let from = {};
      if (this.input.length != 0) {
        from = {
          name: this.input,
          page: this.currentPage - 1,
          size: 10,
          sort: "createdAt,desc",
        };
      } else {
        from = {
          page: this.currentPage - 1,
          size: 10,
          sort: "createdAt,desc",
        };
      }

      _this.$http.findAllRes(from).then((res) => {
        console.log(res);
        _this.dataList = res.data.result.content;
        _this.total = res.data.result.totalElements;
        _this.dataList.forEach((item, index) => {
          // console.log(item)
          item.delStu = false;
        });
        console.log(this.dataList);
        // dataList
      });
    },
    handleSizeChange() {},
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      let _this = this;
      let from = {
        resourcesType: this.resType,
        name: this.input,
        page: this.currentPage - 1,
        size: 10,
        sort: "createdAt,desc",
      };
      _this.$http.findAllRes(from).then((res) => {
        console.log(res);
        _this.dataList = res.data.result.content;
        _this.total = res.data.result.totalElements;
        _this.dataList.forEach((item, index) => {
          item.delStu = false;
        });
        console.log(this.dataList);
        // dataList
      });
      // this.getList();
    },
    showState() {
      this.state = true;
    },
    back() {
      this.state = false;
    },
    selectChecked(val) {
      console.log(val);

      if (val == true) {
        this.dataList.forEach((item) => {
          item.delStu = true;
        });
        this.dataList.forEach((item) => {
          this.delManyNameList.push(item.name);
        });
        
      } else {
        this.dataList.forEach((item) => {
          item.delStu = false;
        });
      }
      console.log(this.dataList);
      console.log(this.delManyNameList);
      this.dataList.forEach((item, index) => {
        if (item.delStu == true) {
          this.multipleSelection.push(item.id);
        }
        if (item.delStu == false) {
          let a = this.multipleSelection.findIndex((item2) => {
            return item2 == item.id;
          });
          this.multipleSelection.splice(a, 1);
          console.log(a);
        }
      });
    },
    upload() {
      this.$router.push({
        path: "./upload",
      });
    },
    modify(val) {
      console.log(val);
      this.$router.push({
        path: "./modifyRes",
        query: {
          id: val.id,
          // name: val.name,
          // cover: val.cover,
          // url: val.url,
          // introduce: val.introduce
        },
      });
      // cancelRemove()
    },
    del(val, index) {
      console.log(val);
      let _this = this;
      this.delId = val.id;
      this.dataList[index].delStu = false;
      _this
        .$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          let from = {
            id: this.delId,
          };
          _this.$http.deleteRes(from).then((res) => {
            console.log(res);
            if (res.status == 200) {
              if (res.data.code == 30000) {
                ElMessage({
                  message: res.data.msg,
                  type: "warning",
                });
                this.delDialogVisible = false;
              }
              if (res.data.code == 0) {
                ElMessage({
                  message: res.data.msg,
                  type: "success",
                });

                this.$http
                  .operateLogSave({
                    operateLogType: "ADMIN_OPT",
                    detail:
                      "管理员" + this.userInfo.name + "删除了资源" + val.name,
                  })
                  .then((res) => {
                    // console.log(res)
                    this.getList();
                    this.delDialogVisible = false;
                  });
              }
            }
          });
        });
      // this.delDialogVisible = true;
      // this.visible = false
      // cancelRemove()
    },
    showVisible(val, index) {
      // this.visible = true
      this.dataList[index].delStu = true;
      console.log(val, index);
      val = !val;
    },
    search() {
      let _this = this;
      console.log(this.resType);
      let from = {
        resourcesType: this.resType,
        name: this.input,
        page: this.currentPage - 1,
        size: 10,
        sort: "createdAt,desc",
      };
      _this.$http.findAllRes(from).then((res) => {
        console.log(res);
        _this.dataList = res.data.result.content;
        _this.total = res.data.result.totalElements;
        _this.dataList.forEach((item, index) => {
          // console.log(item)
          item.delStu = false;
        });
        console.log(this.dataList);
        // dataList
      });
    },
    atMost(val) {
      console.log(val);
      this.valM = val;
      let _this = this;
      let from = {
        page: this.currentPage - 1,
        size: 10,
        sort: `${val},desc`,
      };
      _this.$http.findAllRes(from).then((res) => {
        _this.dataList = res.data.result.content;
        _this.total = res.data.result.totalElements;
        _this.dataList.forEach((item, index) => {
          item.delStu = false;
        });
      });
    },
    atType(val) {
      console.log(val);
      this.resType = val;
      let _this = this;
      let from = {
        page: this.currentPage - 1,
        size: 10,
        name: this.input,
        resourcesType: val,
        sort: "createdAt,desc",
      };
      _this.$http.findAllRes(from).then((res) => {
        _this.dataList = res.data.result.content;
        _this.total = res.data.result.totalElements;
        _this.dataList.forEach((item, index) => {
          item.delStu = false;
        });
      });
    },
    //批量删除选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delThis(val) {
      console.log(val);
      this.chosedel(val);
      // if (val.delStu == true) {
      //   this.multipleSelection.push(val.id);
      // }
      // if (val.delStu == false) {
      //   let a = this.multipleSelection.findIndex((item) => {
      //     return item == val.id;
      //   });
      //   this.multipleSelection.splice(a, 1);
      //   console.log(a);
      // }
    },
    chosedel(val) {
      // console.log(val);
      val.delStu = !val.delStu;
      if (val.delStu == true) {
        this.multipleSelection.push(val.id);
        this.delManyNameList.push(val.name);
      }

      if (val.delStu == false) {
        let a = this.multipleSelection.findIndex((item) => {
          return item == val.id;
        });
        let b = this.delManyNameList.findIndex((item) => {
          return item == val.name;
        });
        this.multipleSelection.splice(a, 1);
        this.delManyNameList.splice(b, 1);
        console.log(a);
      }
      console.log(this.delManyNameList)
    },
    delMany() {
      let _this = this;
      console.log(this.multipleSelection);
      console.log("delManyNameList", this.delManyNameList);
      _this
        .$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          console.log(this.multipleSelection);
          let from = {
            ids: this.multipleSelection,
          };
          let _this = this;
          _this.$http.batchDeleteeRes(from).then((res) => {
            console.log(res);
            if (res.status == 200) {
              if (res.data.code == 30000) {
                ElMessage({
                  message: res.data.msg,
                  type: "warning",
                });
                this.delDialogVisible = false;
              }
              if (res.data.code == 0) {
                ElMessage({
                  message: res.data.msg,
                  type: "success",
                });
                this.delManyNameList[0] = "资源" + this.delManyNameList[0];
                let tempText = this.delManyNameList.join("、资源");
                console.log(this.delManyNameList);
                console.log(tempText);
                this.$http
                  .operateLogSave({
                    operateLogType: "ADMIN_OPT",
                    detail:
                      "管理员" + this.userInfo.name + "批量删除了" + tempText,
                  })
                  .then((res) => {
                    // console.log(res)
                    this.delDialogVisible = false;
                    this.getList();
                  });
              }
            }
          });
        });
    },
    watch: {
      $route(to, from) {
        this.getList();
      },
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
  // background: red;
}

.header {
  width: 100%;
  // border: 1px red solid;
  height: 10%;
  display: flex;
  align-items: center;

  .box-1 {
    width: 39%;
    height: 35%;
    // background: red;
    // border: 1px red solid;
    display: flex;
    justify-content: flex-start;
    margin-left: 80px;

    .checkbox {
      width: 100%;
      height: 100%;
      // border: 1px red solid;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .el-input {
        width: 60%;
        // border: 1px red solid;
      }

      .el-select {
        width: 30%;
        height: 100%;
        margin-bottom: 3px;
        // border: 1px red solid;
      }

      .el-checkbox {
        display: flex;
        align-items: flex-end;
        height: 100%;
      }

      .delpage {
        width: 20%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // border: 1px red solid;
      }

      .el-link {
        height: 100%;
        display: flex;
        align-items: flex-end;
        margin-left: 1rem;
        // position: relative;
        // margin-top: 3px;
      }

      :deep(.el-input__wrapper) {
        height: 30px;
      }

      :deep(.el-link > .el-link__inner) {
        // position: absolute;
        display: flex;
        align-items: flex-end;
        margin-bottom: -2px;
      }

      // .el-select {
      //   width: 100px;
      //   height: 40px;
      //   margin-left: 100px;

      //   :deep(.el-input__wrapper) {
      //     height: 30px;
      //   }
      // }
    }
  }

  .box-2 {
    width: 61%;
    height: 35%;
    display: flex;
    // border: 1px red solid;
    position: relative;
    justify-content: flex-end;
    margin-right: 50px;

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
  overflow-y: auto;
  // border: 1px red solid;
  // justify-content: space-around;
  // flex-direction: column;
  // align-content: space-around;

  // align-items: ;
  // columns: ;
  .card {
    width: 250px;
    // height: 26%;
    // background: red;
    // border: 2px #bbbbbb solid;
    display: flex;
    flex-wrap: wrap;
    margin-left: 80px;
    position: relative;
    cursor: pointer;

    img {
      width: 100%;
      height: 70%;

      // background: red;
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

.page {
  width: 92.5%;
  height: 50px;
  display: flex;
  // border: 1px red solid;
  justify-content: center;
  align-items: center;
  // margin: 0 auto;
  margin-bottom: 1rem;
  margin-left: 80px;

  .delMany {
    width: 70px;
    // width: 20%;
    // border: 1px red solid;
  }

  .el-pagination {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 0;
    margin-right: 70px;
    // border: 1px red solid;
    // background: red;
  }

  .total {
    display: flex;
    justify-content: flex-end;
    width: 20%;
    // border: 1px red solid;
  }
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
.time {
  width: 93%;
  font-size: 0.2rem;
  color: #999;
}
.el-row {
  width: 100%;
  height: 100%;
  display: flex;
  // justify-content: center;
  // align-items: center;
  // border: 1px red solid;
  .el-card {
    // border: 1px red solid;
    width: 250px;
    height: 30%;
    // background: red;
    border: 2px #bbbbbb solid;
    display: flex;
    flex-wrap: wrap;
    margin-left: 80px;
    margin-top: 40px;
    // position: relative;
    cursor: pointer;
  }
  :deep(.el-card__body) {
    // border: 1px red solid;
    width: 250px;
    height: 80%;
    // background: red;
    // border: 2px #bbbbbb solid;
    display: flex;
    flex-wrap: wrap;
    // margin-left: 80px;
    position: relative;
    cursor: pointer;
  }
  .el-checkbox {
    position: absolute;
    right: 0;
    top: -13px;
  }
  // .property {
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  // }
}
.bottom {
  width: 100%;
  display: flex;
  // justify-content: space-evenly;
  // border: 1px red solid;
  // margin-top: 13px;
  // line-height: 12px;
}

.image {
  width: 100%;
  height: 90%;
  border-bottom: 2px #bbbbbb solid;
  object-fit: cover;
  // display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.type {
  width: 0;
  height: 0;
  border-right: 40px solid transparent;
  border-top: 40px solid #409eff;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  .el-icon {
    // border: 1px red solid;
    position: absolute;
    top: -2.3rem;
    left: 4px;
    color: white;
    font-size: 1rem;
    // transform:translate(1.5,1.5)
  }
  // .property {
  // position: absolute;
  // left: 0;
  // top: 0;
  // }
}
.bookName {
  // border: 1px red solid;
  h4 {
    // border: 1px red solid;
    overflow: hidden; //超出的文本隐藏
    display: -webkit-box;
    -webkit-line-clamp: 2; // 超出多少行
    -webkit-box-orient: vertical;

    font-size: 0.9rem;
  }
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

.deldialog {
  width: 30%;
  height: 30%;
  display: flex;
  flex-wrap: wrap;
  /* border: 1px red solid; */
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
</style>
