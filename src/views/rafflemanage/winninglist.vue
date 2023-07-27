<template>
  <div class="winninglist">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
        <div style="margin-bottom: 1rem;">
            <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/rafflemanage' }">抽奖管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{route.query.name1}}活动中奖名单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </div>
    <!-- 搜索部分 -->
    <div class="header_section">
        <el-form
          ref="searchFormRef" 
          :inline="true"
          :model="searchForm"
          @submit.native.prevent
          class="demo-form-inline"
          
          
        >
            <el-form-item prop="userId"  label="网龙用户ID" style="width: 276px">
                <el-input v-model="searchForm.userId" clearable placeholder="请输入网龙用户ID"></el-input>
            </el-form-item>
            <el-form-item prop="userName" label="用户昵称" style="width: 276px">
                <el-input v-model="searchForm.userName" clearable placeholder="请输入用户昵称"></el-input>
            </el-form-item>
            <el-form-item  prop="prizeType" label="奖品类型" style="width: 276px">
                <el-select v-model="searchForm.prizeType" placeholder="请选择奖品类型">
                    <!-- <el-option v-for="" label="门票购买资格" value="1"></el-option>
                    <el-option label="虚拟奖品"  value="2"></el-option>
                    <el-option label="实物产品"  value="3"></el-option> -->
                    <el-option v-for="(value,key) in PRIZE_TYPE_ENUM" :key="key" :label="value" :value="key"></el-option>

                </el-select>
            </el-form-item>
            <el-form-item prop="prizeName" label="奖品" style="width: 276px" >
                <el-input v-model="searchForm.prizeName" clearable placeholder="请输入奖品"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="startWinnerTime" label="中奖时间" >
                <el-date-picker
                    v-model="searchForm.startWinnerTime"
                    type="datetime"
                    placeholder="起始中奖时间"
                    format="YYYY/MM/DD HH:mm:ss"
                    value-format="x"
                />
                <hr style=" width: 10px; margin-left: 18px;"/>
                
                
                
            </el-form-item>
            <el-form-item  style="margin-left: -51px; !important">
            </el-form-item>
            
            <el-form-item prop="endWinnerTime" >
                <el-date-picker
                    v-model="searchForm.endWinnerTime"
                    type="datetime"
                    placeholder="结束中奖时间"
                    format="YYYY/MM/DD HH:mm:ss"
                    value-format="x"
                />
                
            </el-form-item> -->
            <el-form-item prop="value2"  label="中奖时间" style="width: 584px">
              <el-date-picker
                v-model="value2"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY/MM/DD HH:mm:ss"
                value-format="x"
              />
            </el-form-item>
            <el-form-item prop="pickupMobile" label="收件手机号" style="width: 276px"  >
                <el-input v-model="searchForm.pickupMobile" clearable placeholder="请输入收件手机号"></el-input>
            </el-form-item>
            <el-form-item prop="cardNumber" label="身份证号" style="width: 276px" >
                <el-input v-model="searchForm.cardNumber" clearable placeholder="请输入身份证号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmitSearch()">搜索</el-button>
                <el-button type="primary" @click="resetSearchForm()">重置</el-button>
            </el-form-item>

        </el-form>
    </div>
    <!-- 增加部分 -->
    <div class="btn_section">
        <el-button type="primary"  @click="handleExportList">导出名单</el-button>
        <!-- <el-button type="primary"  @click="openFullScreen2"> 导出名单 </el-button> -->
    </div>
    <!-- 图表部分 -->
    <div class="table_section">
        <el-table :data="tableData" stripe style="width: 100%">
        <!-- <el-table-column type="selection" width="30px" /> -->
        <el-table-column prop="userId" label="网龙用户ID" align="center" width="120" >
          <template #default="scope">
            {{ scope.row.user.userId }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户昵称" align="center" >
          <template #default="scope">
            {{ scope.row.user.name || scope.row.user.orgUserCode ||  '暂无姓名'}}
          </template>
        </el-table-column>
        <el-table-column prop="prizeType" label="奖品类型" align="center" >
          <template #default="scope">
            {{ PRIZE_TYPE_ENUM[scope.row.prize.prizeType] }}
          </template>
        </el-table-column>
        <el-table-column prop="prizeName" label="奖品" align="center" >
          <template #default="scope">
            {{ scope.row.prize.name }}
          </template>
        </el-table-column>
        <el-table-column prop="pickupMobile" label="手机号" align="center" >
          <template #default="scope">
            {{ scope.row.user.mobile }}
          </template>
        </el-table-column>
        <el-table-column prop="winnerTime" label="中奖时间" align="center" >
          <template #default="scope">
            {{ tools.transitionTime(scope.row.winnerTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="startWinnerTime" label="收件地址" align="center">
          <template #default="scope">
            {{ scope.row.winnerAddressList[0]?.location }}
            {{ scope.row.winnerAddressList[0]?.address}}
            <div>
              
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pickupMobile" label="收件手机号" align="center" >
          <template #default="scope">
            <div>
              <p>{{ scope.row.winnerAddressList[0]?.mobile }}</p>
              <p>{{ scope.row.winnerAddressList[1]?.mobile }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cardNumber" label="兑换信息" align="center" >
          <template #default="scope">
            <!-- {{ scope.row.winnerAddressList[0]?.cardNumber }} -->
            <div>
              <p><span>{{scope.row.winnerAddressList[0]?.name }}&nbsp</span>{{scope.row.winnerAddressList[0]?.cardNumber }}</p>
              
              <p v-if="scope.row.winnerAddressList[1]?.cardNumber"><span>{{scope.row.winnerAddressList[1]?.name }}&nbsp</span>{{scope.row.winnerAddressList[1]?.cardNumber || ''}}</p>
              <br v-else="scope.row.winnerAddressList[1]?.cardNumber">
            </div>
          </template>
        </el-table-column>


      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination_section">
      <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
        layout="total,sizes, prev, pager, next, jumper" :total="total" :background="true" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>


  </div>
</template>

<script setup>
import {ref, reactive, onMounted, onUnmounted} from "vue"
import {useRoute} from 'vue-router'
import { ElMessage, ElMessageBox,ElLoading  } from 'element-plus'
import { downloadFile } from '@/utils'
import { useIntervalFn } from '@vueuse/core'
import http from '@/request/api'
import tools from "../../utils/tools";
const PRIZE_TYPE_ENUM = {
  TICKET: "门票购买资格",
  MATERIAL_OBJECT: "实物奖品",
  SUPPOSITIONAL_YOUKU: "虚拟奖品",
}
const  route = useRoute();
const searchFormRef = ref(null)
//搜索数据
const searchForm = reactive({
  userId:'',
  userName:'',
  cardNumber: '',
  prizeType:'',
  prizeName:'',
  pickupMobile:'',
  startWinnerTime:'',
  endWinnerTime:''
  


  
})
const value2 = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(6)
const tableData = ref([])
const postList = ref({})
//搜索表单
const onSubmitSearch = () => {
  console.log(value2.value);
  
  searchForm.startWinnerTime = value2.value[0]
  searchForm.endWinnerTime = value2.value[1]
  currentPage.value = 1
  getData()
}
//重置搜索表单
const resetSearchForm = () => {
  console.log('resetSearchForm', searchFormRef.value);
  value2.value = ''
  searchForm.startWinnerTime = ''
  searchForm.endWinnerTime = ''
  searchFormRef.value.resetFields()

  //getData()
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
//导出
const handleExportList = async () => {
  console.log('导出列表信息');
  const loading = ElLoading.service({
    lock: true,
    text: '下载中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  
  //导出对象
  let params = {
    luckyDrawId:route.query.id,
    page: currentPage.value - 1,
    size: pageSize.value,
    sort: 'createdAt,desc',
  }
  //遍历searchForm属性，如果有值则传参
  for (const key in searchForm) {
    if (searchForm[key]) {
      params[key] = searchForm[key]
    }
  }
  const {
    data: { code },
    data: { result },
  } = await http.WinnerExport(params)
  if (code === 0 && result) {
    //console.log(result);
    const { id, complete, success } = result
    console.log('导出结果', id, complete, success);
    const { pause, resume, isActive } = useIntervalFn(() => {
      let params = {
        id,
      }
      http.getAsyncTask(params).then((res) => {
        const { code, result } = res.data
        console.log('getAsyncTask- 异步任务', code, result)
        const { complete, success, errMsg } = result
        if (code === 0 && complete) {
          pause()
          if (success) {

           
            setTimeout(() => {
              loading.close()
              ElMessage.success('导出成功')
              const { fileUrl, fileName } = result
              downloadFile(fileUrl, fileName)
            }, 2000)
          } else {
            ElMessage.error(errMsg)
          }
        }
      })


    }, 1000)
  } else {
    ElMessage.error('导出失败')
    loadingObj.exportList = false
  }
}
// 重新获取数据
const getNewData = () => {
  currentPage.value = 1
  console.log(111111);
  resetSearchForm()
  getData()
}
//获取数据
const getData = async () => {
  let params = {
    luckyDrawId:route.query.id,
    page: currentPage.value - 1,
    size: pageSize.value,
    sort: 'createdAt,desc',
  }
  for (const key in searchForm) {
    if (searchForm[key]) {
      params[key] = searchForm[key];
    }
  }
  console.log(params);
  const {
    data: { code },
    data: { result }
  } = await http.WinnerFindAll(params)
  if (code === 0 && result) {
    console.log('获取数据成功', result);
    const { content = [], totalElements } = result
    tableData.value = content
    total.value = totalElements
    console.log(tableData.value);
  } else {
    ElMessage.error('获取数据失败')
  }

}

onMounted(()=>{
    getData()
    console.log(route.query.name1);
})

</script>

<style lang="less" scoped>
.winninglist{
    display: flex;
    height: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
    flex-direction: column;
    .breadcrumb{
        padding: 1rem 0;
    }
    .header_section {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .pagination_section{
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    .table_section{
        width: 100%;
        height: 70%;
        overflow: auto;
    }
}

</style>
