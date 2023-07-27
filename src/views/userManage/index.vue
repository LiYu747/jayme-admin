<template>
  <div class="operationNote">
    <div>
      <el-form
        :inline="true"
        :model="searchForm"
        @submit.native.prevent
        class="demo-form-inline"
      >
        <el-form-item label="网龙用户ID">
          <el-input v-model="searchForm.userId" clearable></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="searchForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="searchForm.telephone" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-box">
      <!-- max-height="780" -->
      <el-table
       
        stripe
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
        style="width: 100%"
      >
        <el-table-column label="头像" width="140" align="center">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.portrait"
              :preview-src-list="[scope.row.portrait]"
              :preview-teleported="true"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column label="网龙用户ID" show-overflow-tooltip align="center">
          <template #default="scope">
            {{ scope.row.userId || '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="昵称" show-overflow-tooltip align="center">
          <template #default="scope">
            {{ scope.row.name || scope.row.orgUserCode || '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="电话号码" show-overflow-tooltip align="center">
          <template #default="scope">
            {{ scope.row.telephone || scope.row.phone || '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="出生日期" show-overflow-tooltip align="center">
          <template #default="scope">
            <!-- {{ scope.row.birthday || '暂无' }} -->
            {{
              scope.row.birthday
                ? tools.transitionTime(scope.row.birthday)
                : '暂无'
            }}
          </template>
        </el-table-column>
        <el-table-column label="省" show-overflow-tooltip align="center">
          <template #default="scope">
            {{ scope.row.province || '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="市" show-overflow-tooltip align="center">
          <template #default="scope">
            {{ scope.row.city || '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="区/县" show-overflow-tooltip align="center">
          <template #default="scope">
            {{ scope.row.county || '暂无' }}
          </template>
        </el-table-column>
        <el-table-column
          label="组织用户code"
          show-overflow-tooltip
          align="center"
        >
          <template #default="scope">
            {{ scope.row.orgUserCode || '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" show-overflow-tooltip align="center">
          <template #default="scope">
            {{
              scope.row.createdAt
                ? tools.transitionTime(scope.row.createdAt)
                : '暂无'
            }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <div class="desc">注：后台中仅展示登录过小程序的用户列表，并非实际所有JayMe用户列表</div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:page-size="pageSize"
        v-model:current-page="currentPage"
        :pager-count="pagerCount"
        background
        :page-sizes="[20, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script setup>
import http from '@/request/api'
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import tools from '@/utils/tools'
const tableData = ref([])
const searchForm = ref({
  name: '',
  telephone: '',
  userId: '',
})
const pageSize = ref(20)
const currentPage = ref(1)
const pagerCount = ref(7)
const total = ref(0)
const onSubmit = () => {
  console.log(searchForm.value)
  currentPage.value = 1
  getData()
}
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`)
  pageSize.value = val
  currentPage.value = 1
  getData()
}
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`)
  currentPage.value = val
  getData()
}
// 获取数据
const getData = async () => {
  let params = {
    page: currentPage.value - 1,
    size: pageSize.value,
    sort: 'createdAt,desc',
  }
  // console.log(params)
  // 根据searchForm的值判断是否需要传参
  searchForm.value.name && (params.name = searchForm.value.name)
  searchForm.value.telephone && (params.telephone = searchForm.value.telephone)
  searchForm.value.userId && (params.userId = searchForm.value.userId)

  const {
    data: { code },
    data: { result },
  } = await http.getUser(params)
  console.log(code, result)
  if (code === 0 && result) {
    console.log('获取数据成功', result)
    const { content, totalElements } = result
    tableData.value = content
    total.value = totalElements
    console.log(tableData.value);
  } else {
    ElMessage.error('获取数据失败')
  }
}

onMounted(() => {
  // console.log('mounted')
  getData()
})
</script>
<style lang="scss" scoped>
.operationNote {
  height: 100%;
  // margin: 10px;
  padding: 10px 20px 10px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // overflow: hidden;
  .bottom {
    margin-top: 15px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .desc{
      color: #888
    }
  }
}
.table-box {
  width: 100%;
  // background: red;
  flex: 1;
  overflow: auto;
  // height: 200px;
}
</style>
