<template>
  <div class="raffle">
      <!-- 增加部分  -->
      <div class="btn_section">
        <el-button type="primary" @click="addLuckyDraw()">创建抽奖活动</el-button>
      </div>
      <!-- 图标部分 -->
      <div class="table_section">
        <el-table :data="tableData" style="width: 100%;height: 100%;">
          <!-- 封面 -->
          <el-table-column prop="coverUrl" label="封面" width="220" align="center">
              <template #default="scope">
                  <el-image style="width: 180px; height: 100px" :src="scope.row.cover" fit="contain" lazy />
              </template>
          </el-table-column>
          <!-- 活动名称 -->
          <el-table-column prop="name" label="活动名称"  align="center">
            <template #default="scope">
                {{ scope.row.name || '暂无' }}
            </template>
          </el-table-column>
          <!-- 活动时间 -->
          <el-table-column prop="startTime" label="活动时间"   align="center">
            <template #default="scope">
                <!-- {{
                    tools.transitionTime(scope.row.startTime)+'-'+tools.transitionTime(scope.row.endTime)
                }} -->
                <div>
                  <p>开始时间: {{ tools.transitionTime(scope.row.startTime) }}</p>
                  <p>结束时间: {{ tools.transitionTime(scope.row.endTime)   }}</p>
                </div>
            </template>
          </el-table-column>  
          <!-- 活动状态 -->
          <el-table-column  label="活动状态"   align="center">
              <template #default="scope">
                  {{
                      activestate(scope.row)
                  }}
              </template>
          </el-table-column>
          
          <!-- 上架状态 -->
          <el-table-column prop="shelves" label="上架状态"   align="center">
              <template #default="scope">
                <el-switch v-model="scope.row.shelves" @change="open($event, scope.row)"  />
              </template>
          </el-table-column>
          <!-- 查看抽奖情况 -->
          <el-table-column prop="status" label="查看抽奖情况"   align="center">
              <template #default="scope">
                <div class="handle">
                  <el-link
                    :underline="false"
                    type="success"
                    @click="seedetailed(scope.row)"
                    >活动详情</el-link
                  >
                  <el-link
                    :underline="false"
                    type="success"
                    @click="seenamelist(scope.row)"
                    >中奖名单</el-link
                  >
                  
                </div>
              </template>
          </el-table-column>  
          <!-- 操作 -->
          <el-table-column label="操作"  width="220" align="center">
              <template #default="scope">
                <div class="handle">
                  <el-link
                    :underline="false"
                    :disabled="scope.row.shelves"
                    type="primary"
                    @click="reviseLuckyDraw(scope.row)"
                    >修改</el-link
                  >
                  <el-link
                    :underline="false"
                    type="danger"
                    :disabled="scope.row.shelves"
                    @click="delBtn(scope.row)"
                    >删除</el-link
                    
                  >
                </div>
              </template>
          </el-table-column>

        </el-table>
      </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, onUnmounted} from "vue"
import { ElMessage, ElMessageBox } from 'element-plus'
import {useRouter} from 'vue-router'
import http from '@/request/api'
import tools from "../../utils/tools";
// import { data } from "dom7";

const  route = useRouter();
const tableData = ref([
  // {
  //   cover:'111',
  //   name:'wy',
  //   startTime:1680759560452,
  //   endTime:1680759560452,
  //   status:'未开始',
  //   shelves:true

  // }
])
const showDlgType = ref('edit')
const pageSize = ref(20)
const currentPage = ref(1)
const pagerCount = ref(7)
const total = ref(0)
// const title = ref('上架')

//创建抽奖活动
const addLuckyDraw = ()=>{
  route.push({
    name:'addluckydraw',
    query:{
    	showDlgType:'add',
      
    }
  })
}
//修改抽奖活动
const reviseLuckyDraw = (data)=>{
  console.log(JSON.stringify(data));
  route.push({
    name:'addluckydraw',
    query:{
    	showDlgType:showDlgType.value,
      data:JSON.stringify(data)
    }
  })
}
//查看活动详细
const seedetailed = (data)=>{
  route.push({
    path:`/eventdetails?name1=${data.name}`,
    query:data
  })
}
//查看中奖名单
const seenamelist = (data)=>{
  
  route.push({
    path:`/winninglist?name1=${data.name}&id=${data.id}`,
    query:{name1:data.name,id:data.id}
  })
}
//上架状态弹框
const open = ($event, data)=>{
  console.log($event, data.name);
  
  ElMessageBox.confirm(
    `是否将该活动${data.name}`+(data.shelves? '上架' : '下架') ,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      
    }
  )
    .then(() => {
      console.log(data.shelves);
      if(data.shelves){
        shelves(data)
      }else{
        cancelShelves(data)
      }
    })
    .catch(() => {
      data.shelves = !data.shelves
      ElMessage({
        type: 'info',
        message: data.shelves? '取消下架' : '取消上架',
      })
    })
}
//操作删除
const delBtn = (data) =>{
  console.log(data);
  ElMessageBox.confirm(
    `是否将${data.name}删除` ,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      
    }
  )
    .then(() => {
      luckyDrawdelete(data)
      
      // ElMessage({
      //   type: 'success',
      //   message: '删除成功！',
      // })
      
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除！',
      })
    })
}
//获取数据
const getData = async () => {
  let params = {
    page: currentPage.value - 1,
    size: pageSize.value,
    sort: 'createdAt,desc',
  }
  const {
    data: { code },
    data: { result },
  } = await http.LuckyDrawFindAll(params)
    if(code === 0 && result) {
      console.log('获取数据成功', result)
      const { content, totalElements } = result
      tableData.value = content
    }else{
      ElMessage.error('获取数据失败')
    }
}
//删除抽奖活动
const luckyDrawdelete = async (data) => {
  let params = {
    id:data.id
  }
  const {
    data: {code},
  } = await http.LuckyDrawDelete(params)
  if (code === 0) {
      ElMessage.success('删除成功')
      getData()
  } else {
      ElMessage.error('删除失败')
  }

}
//上架活动
const shelves = async (data) => {
  let params = {
    id:data.id
  }
  const {
    data: {code},
  } = await http.LuckyDrawShelves(params)
  if (code === 0) {
      ElMessage.success('上架成功')
      getData()
  } else if(code === 30100) {
      ElMessage.error('该时间段已有抽奖')
      data.shelves = !data.shelves
  }else{
      ElMessage.error('上架失败')
  }
}
//下架活动
const cancelShelves = async (data) => {
  let params = {
    id:data.id
  }
  const {
    data: {code},
  } = await http.LuckyDrawCancelShelves(params)
  if (code === 0) {
      ElMessage.success('下架成功')
      getData()
  } else {
      ElMessage.error('下架失败')
  }
}
//活动状态
const activestate = (data) => {
  console.log(data.startTime);
  console.log(new Date().getTime());
  if(new Date().getTime() > data.startTime && new Date().getTime() < data.endTime ){
    return '进行中'
  }else if(new Date().getTime() < data.startTime){
    return '未开始'
  }else{
    return '已结束'
  }
}
onMounted(()=>{
  getData()
})

</script>

<style lang="less" scoped>
  .raffle{
    display: flex;
    height: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
    flex-direction: column;
    .btn_section{
      padding:  0.5rem 0;
    }
    .table_section{
      flex: 1;
      .handle{
        .el-link{
            margin-right: 0.5rem;
        }
      }
    }
  }


</style>
