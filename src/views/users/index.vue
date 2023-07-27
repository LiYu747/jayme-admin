<template>
  <div class="container">
    <div class="header">
      <div class="box-1">

        <el-input v-model="input" placeholder="搜索用户" class="input-with-select" @keyup.enter.native="search">
          <template #suffix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
      <div class="box-2">
      </div>

    </div>
    <div class="orderList-content">
      <!-- <template class="table-box"> -->

      <el-table :data="dataList" style="width: 100%" :cell-class-name="tableCellClassName"
        :header-row-class-name="headerRow" :default-sort="{ prop: 'name', order: 'descending' }">
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="用户名称" sortable>
          <template class="inf" #default="scope">
            <div class="inf-box">
              <div class="inf-none"></div>
              <el-image style="width: 100px; height: 100px; border-radius: 50%;" :src="scope.row.portrait" />
              <div class="inf-name"> {{ scope.row.name }}</div>
            </div>

          </template>
        </el-table-column>
        <el-table-column prop="openId" label="微信ID" />
        <el-table-column prop="createdAt" label="创建时间" sortable>
          <template #default="scope">
            {{ tools.transitionTime(scope.row.createdAt) }}
          </template>
        </el-table-column>

        <!-- <el-table-column prop="city" label="地区" />
        <el-table-column prop="address" label="活跃" /> -->
      </el-table>
      <!-- </template> -->
    </div>
    <div class="page">
      <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
        layout="total, prev, pager, next, jumper" :total="total" :background="true" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
      <!-- <div class="total"> 用户({{ total }})</div> -->
    </div>

  </div>
</template>
<script>
import tools from '@/utils/tools'
import { Search } from '@element-plus/icons-vue'
// import { Search } from '@element-plus/icons-vue'
export default {
  data() {
    return {
      tools,
      input: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      options: [
        {
          value: 'Option1',
          label: '时间排序',
        },
        {
          value: 'Option2',
          label: '用户名排序',
        },
        {
          value: 'Option2',
          label: '活跃排序',
        }
      ],
      options2: [
        {
          value: 'Option1',
          label: '全部类型',
        },
        {
          value: 'Option2',
          label: '仅音频',
        },
        {
          value: 'Option2',
          label: '仅视频',
        }
      ],
      value: "",
      value2: "",
      dataList: [],
      checked: false,
      tools,
      tableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
      ]
    }
  },
  created() {
    console.log('created', this.$router.currentRoute.fullPath)
  },
  mounted() {
    this.getList();
    this.value = "时间排序"
    this.value2 = "全部类型"
    // console.log("123")
    // 
  },
  methods: {
    getList() {
      let _this = this;
      // getUser
      let from = {
        page: this.currentPage - 1,
        size: 10,
      }
      this.$http
        .getUser(from)
        .then((res) => {
          console.log(res)
          this.dataList = res.data.result.content
          this.total = res.data.result.totalElements
          this.dataList.forEach((item, index) => {
            // console.log(item)
            item.delStu = false
          })
          console.log(this.dataList)
          // dataList

        })

    },
    search() {
      let _this = this;
      // getUser
      let from = {
        name: this.input,
        page: this.currentPage - 1,
        size: 10,
      }
      this.$http
        .getUser(from)
        .then((res) => {
          console.log(res)
          this.dataList = res.data.result.content
          this.total = res.data.result.totalElements
          this.dataList.forEach((item, index) => {
            // console.log(item)
            item.delStu = false
          })
          console.log(this.dataList)
          // dataList

        })

    },
    handleSizeChange() {

    },
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.getList()

    },
    selectChecked(val) {
      // console.log(val)
      if (val == true) {
        this.dataList.forEach((item) => {
          item.delStu = true
        })
      } else {
        this.dataList.forEach((item) => {
          item.delStu = false
        })
      }
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        return 'cell-start'
      } else if (columnIndex == 9) {
        return 'cell-end'
      } else {
        return 'cell-middle'
      }
    },
    headerRow({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex)
      if (rowIndex === 0) {
        console.log('123')
        return 'warning-row';
      }
    }
  },
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  // height: calc(100vh - 60px);
  display: flex;
  flex-wrap: wrap;
  background: white;
  justify-content: center;
  align-items: center;
}

.header {
  width: 100%;
  // border: 1px red solid;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;

  .box-1 {
    width: 39%;
    height: 60%;
    // background: red;
    // border: 1px red solid;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 80px;

    .checkbox {
      width: 100%;
      height: 100%;
      // border: 1px red solid;
      display: flex;
      align-items: flex-end;

      .el-checkbox {
        display: flex;
        align-items: flex-end;
        height: 100%;

      }

      .el-link {
        height: 100%;
        display: flex;
        align-items: flex-end;
        margin-left: 1rem;
        // position: relative;
        // margin-top: 3px;

      }

      :deep(.el-link>.el-link__inner) {
        // position: absolute;
        display: flex;
        align-items: flex-end;
        margin-bottom: -2px;
      }

    }
  }

  .box-2 {
    width: 61%;
    height: 100%;
    display: flex;
    // border: 1px red solid;
    position: relative;
    justify-content: space-evenly;

    .el-input {
      width: 40%;
      height: 70%;
      display: flex;
      align-items: flex-end;
      margin-top: 0.5rem;
      // border: 1px red solid;
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
      margin-top: 1.5rem;
      display: flex;
      align-items: flex-end;

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

}

.el-table {
  width: 100%;
  // border: 1px red solid;
  max-width: 90%;
  margin: 0 auto;
}

.el-table__row {
  border: 1px red solid;

}

:deep(.el-table__row) {
  border: 1px red solid;
  height: 80px;
}

tr {
  border: 1px red solid;
}

:deep(tr) {
  border: 1px red solid;
}

.table-box {
  width: 90%;
  height: 100%;
  border: 1px red solid;

}

.page {
  width: 100%;
  height: 50px;
  display: flex;
  position: relative;

  .el-pagination {
    width: 95%;
    // border: 1px red solid;
    justify-content: center;
    margin-top: 0;

  }

  .total {
    color: 	#A1A1A1;
    width:5%;
    position: absolute;
    top: 20px;
    right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 100px;
    // margin-bottom: 1rem;
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

.inf-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inf-none {
  width: 33%;
  height: 100%;
}

.inf-name {
  width: 33%;
  height: 100%;
  display: flex;
  margin-left: 1rem;
  align-items: center;
  justify-content: flex-start;
}

:deep(.el-table .cell) {
  text-align: center;
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
</style>
<style>
/* .cell-start {
  border-top: 10px solid #E8E8E8;
  border-bottom: 10px solid #E8E8E8 !important;
  border-left: 1px solid #E8E8E8;
}

.cell-end {
  border-top: 10px solid #E8E8E8;
  border-bottom: 10px solid #E8E8E8 !important;
  border-right: 1px solid #E8E8E8;
}

.cell-middle {
  border-top: 10px solid #E8E8E8;
  border-bottom: 10px solid #E8E8E8 !important;
}


.el-table__body {
  border-spacing: 0px 5px !important;
  background: #E8E8E8;
}

.el-table td {
  height: 56px;
}

.warning-row {
  border: 1px red solid;
  border-bottom: 10px solid red !important;
  background: #E8E8E8;
}

.warning-row>th {
  background: none;
}

.el-table th.el-table__cell.is-leaf {
  background: #E8E8E8;
  text-align: center;
}

:deep(.el-table__header-wrapper>.el-table__header) {
  border: 1px red solid;
}

.el-table .cell {
  text-align: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
:deep(.el-table_1_column_3 .cell-middle .el-table__cell>) {
  border: 1px red solid;
} */
</style>
