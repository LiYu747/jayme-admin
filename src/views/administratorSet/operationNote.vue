<template>
    <div class="operationNote">
        <el-form :inline="true" :model="formInline" @submit.native.prevent class="demo-form-inline">
            <el-form-item label="操作员">
                <el-input v-model="formInline.adminUsername" clearable></el-input>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker v-model="searchTime" type="daterange" range-separator="-" />
            </el-form-item>
            <el-form-item label="日志内容">
                <el-input v-model="formInline.keyword" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item>
        </el-form>
        <div>
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" :header-cell-style="{ background: 'rgb(250, 250, 250)' }" :row-key="getRowKeys3" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true"></el-table-column>
                <el-table-column prop="adminUsername" label="操作员" align="center"></el-table-column>
                <el-table-column prop="ip" label="IP" align="center"></el-table-column>
                <el-table-column prop="detail" label="说明" min-width="300px" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="操作时间" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button @click.native.prevent="deleEdit(scope.row)" size="small" type="danger" link>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="buttom">
                <div class="btn">
                    <el-button type="primary" @click="toggleSelection(tableData)">全选</el-button>
                    <el-button @click="invertSelection">反选</el-button>
                    <el-button @click="batchDele">批量删除</el-button>
                </div>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-model:page-size="pageSize" v-model:current-page="currentPage" :pager-count="pagerCount" background :page-sizes="[20, 30, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import tools from "./../../utils/tools";
export default {
  data() {
    return {
      formInline: {},
      searchTime: [],
      tableData: [{}],
      userInfo: {},
      getRowKeys3(row) {
        return row.key;
      },
      bonusOpencheck: false,
      invertopencheck: false,
      bonusIDslist: [],
      total: 1, // 总条目数
      pageSize: 20, // 每页显示个数
      currentPage: 1, // 默认显示页
      pagerCount: 5, // 页码数量，超过折叠
    };
  },
  methods: {
    FilterData(array2, array1) {
      var result = [];
      for (var i = 0; i < array2.length; i++) {
        var obj = array2[i];
        var num = obj.id;
        var flag = false;
        for (var j = 0; j < array1.length; j++) {
          var aj = array1[j];
          var n = aj.id;
          if (n == num) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          result.push(obj);
        }
      }
      return result;
    },
    //全选
    toggleSelection(data) {
      if (this.bonusIDslist.length === 0) {
        data.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
        data.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      }
      this.bonusOpencheck = true;
    },
    //反选
    invertSelection() {
      this.invertopencheck = true;
      let arr1 = [];
      let tableData = this.tableData;
      if (this.bonusIDslist.length == tableData.length) {
        this.$refs.multipleTable.clearSelection();
      } else {
        arr1 = this.FilterData(tableData, this.bonusIDslist);
        this.$refs.multipleTable.clearSelection();
        this.$nextTick(() => {
          arr1.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          });
        });
      }
    },
    //批量删除
    batchDele() {
      let ids = JSON.parse(JSON.stringify(this.bonusIDslist));
      ids.forEach((r, o, w) => {
        w[o] = r.id;
      });
      let _this = this;
      _this
        .$confirm("是否批量删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          if (ids.length === 0) {
            this.$message({
              message: "请选择批量删除的内容",
            });
            return;
          }
          _this.$http.operateLogBatchDelete({ ids: ids }).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.$refs.multipleTable.clearSelection();
              this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    "管理员" + this.userInfo.name + "批量删除了操作记录" + ids,
                })
                .then(() => {
                  // location.reload();
                  this.bonusIDslist = [];
                  if (this.isEmpty(this.formInline)) {
                    this.publicQuery(
                      this.pageSize,
                      this.currentPage - 1,
                      this.formInline
                    );
                  } else {
                    if (this.tableData.length == ids.length) {
                      if (this.currentPage == 1) {
                        this.publicQuery(
                          this.pageSize,
                          this.currentPage - 1,
                          {}
                        );
                      } else {
                        this.publicQuery(
                          this.pageSize,
                          this.currentPage - 2,
                          {}
                        );
                      }
                    } else {
                      this.publicQuery(this.pageSize, this.currentPage - 1, {});
                    }
                  }
                });
            } else {
              _this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //选择项发生变化时
    handleSelectionChange(val) {
      this.bonusIDslist = val;
    },
    //是否为对象
    isEmpty(obj) {
      for (var name in obj) {
        if (obj[name]) return true;
        return false;
      }
      return false;
    },
    publicQuery(size, page, form) {
      this.$http
        .operateLogAll({
          size: size,
          page: page,
          sort: "createdAt,desc",
          ...form,
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.result.content;
            this.total = res.data.result.totalElements;
            this.tableData.forEach((row) => {
              if (row.createdAt) {
                row.createdAt = tools.transitionTime(row.createdAt);
              }
              row.explain = row.user + row.content;
            });
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
          }
        });
    },
    //pageSize 改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.publicQuery(val, 0, this.formInline);
    },
    //翻页
    handleCurrentChange(index) {
      if (this.bonusOpencheck || this.invertopencheck) {
        this.bonusIDslist = [];
        this.$refs.multipleTable.clearSelection();
        this.bonusOpencheck = false;
      } else {
        this.bonusIDslist = [];
        this.$refs.multipleTable.clearSelection();
        this.bonusOpencheck = false;
      }
      this.currentPage = index;
      let number = index - 1;
      if (!this.isEmpty(this.formInline)) {
        this.publicQuery(this.pageSize, number, {});
      } else {
        this.publicQuery(this.pageSize, number, this.formInline);
      }
    },
    //搜索
    onSubmit() {
      this.currentPage = 1;
      if (this.searchTime && this.searchTime.length == 2) {
        this.formInline.startDate = this.searchTime[0]?.getTime()
        this.searchTime[1].setHours(23,59,59,999)
        this.formInline.endDate = this.searchTime[1]?.getTime()
      }
      else{
        this.formInline.startDate = null
        this.formInline.endDate = null
      }

      this.publicQuery(this.pageSize, 0, this.formInline);
    },
    //删除
    deleEdit(row) {
      let _this = this;
      _this
        .$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          _this.$http.operateLogDelete({ id: row.id }).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    "管理员" + this.userInfo.name + "删除了操作记录" + row.id,
                })
                .then(() => {
                  // location.reload();
                  if (this.isEmpty(this.formInline)) {
                    this.publicQuery(
                      this.pageSize,
                      this.currentPage - 1,
                      this.formInline
                    );
                  } else {
                    this.publicQuery(this.pageSize, this.currentPage - 1, {});
                  }
                });
            } else {
              _this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          });
        });
    },
  },
  created() {
    // let objDate = {
    //   path: "/operationNote",
    //   name: "日志管理",
    //   code: 106.3,
    //   parentName: "管理员设置",
    // };
    // this.$store.dispatch("changeN", objDate);
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.publicQuery(this.pageSize, 0, {});
    this.currentPage = 1;
  },
};
</script>
<style lang="scss" scoped>
.operationNote {
  margin: 10px;
  padding: 10px 0 10px 20px;
  box-sizing: border-box;
  .buttom {
    margin-top: 15px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .btn {
      display: inline-block;
      float: left;
    }
    // .el-pagination {
    //   display: inline-block;
    // }
  }
}
</style>
