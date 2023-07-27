<template>
    <div class="luckydraw">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
          <div style="margin-bottom: 1rem;">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/rafflemanage' }">抽奖管理</el-breadcrumb-item>
              <el-breadcrumb-item>{{ route.query.name }}活动</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
      </div>
      <!-- :rules="rules" -->
      <el-form :model="formData" ref="formDataRef"   label-width="120px" >
          <el-form-item label="活动名称" prop="name">
            
                {{ formData.name }}
            

          </el-form-item>
          <!-- 海报封面 -->
          <el-form-item label="海报封面" prop="cover">
            <el-image style="width: 180px; height: 100px" :src="formData.cover"  />
          </el-form-item>
          <!-- 活动起止时间 -->
          <el-form-item label="活动时间" prop="startTime" >
              <!-- <div>
                <p></p>
                <p></p>
                {{tools.transitionTime(Number(formData.startTime))+'-'+tools.transitionTime(Number(formData.endTime))}}
              </div> -->
              <div>
                  <p>开始时间: {{ tools.transitionTime(Number(formData.startTime)) }}</p>
                  <p>结束时间: {{tools.transitionTime(Number(formData.endTime))   }}</p>
                </div>
              
          </el-form-item>
          <!-- 奖品设置 -->
          <el-form-item label="奖品设置" prop="examTime" label-position style="width: 80%;">
              <div class="prize_list" v-for="item in formData.prizeVOS" @click="itemcommodity(item)">
                  <el-image style="width: 120px;  height: 130px" :src="item.pic"   />
                  <!-- <Delete  class="delete" style="width: 2em; height: 2em;color: #fff; margin-right: 8px" @click.stop="itemdelBtn(item)"   /> -->
                  <div class="item_name">
                          <p>奖品名称:{{item.name}}</p>
                          <p>奖品数量: {{item.number}}</p>
                          <p>奖品类型: {{PRIZE_TYPE_ENUM[item.prizeType]}}</p>
                          <p>中奖概率: {{item.probability}}%</p>
                  </div>
  
              </div>
  
          </el-form-item>
  
          <!-- 活动规则 -->
          <!-- v-if=" formData.rule" -->
          <el-form-item label="活动规则" prop="rule">
            <el-scrollbar height="400px" >
                <p   v-html="formData.rule"></p>
            </el-scrollbar>
                        
          </el-form-item>

            
  
      </el-form>
      
    </div>
  </template>
  
  <script setup>
  import {ref, reactive, onMounted, onUnmounted} from "vue"
  import {  ElMessage, ElMessageBox, ElLoading } from "element-plus";
  import { uploadFile } from "@/utils/upload";
  import {useRoute} from 'vue-router'
  import Editor  from './components/Editor.vue'
  import AddPrize  from './components/add_prize.vue'
  import AddPreview  from './components/add_preview.vue'
  import http from '@/request/api'
  import tools from "../../utils/tools";
  const  route = useRoute();
  const formDataRef = ref(null)
  const formData= reactive({
      
      endTime:'',
      name:'',
      rule:'',
      startTime:'',
      coverUrl:'',
      //投票vo
      prizeVOS:[],
  })
  //抽奖id
  const luckyDrawId = ref()
  //修改  
  const showDlgType = ref()
  const listData = ref()
  const PRIZE_TYPE_ENUM = {
    TICKET: "门票购买资格",
    MATERIAL_OBJECT: "实物奖品",
    SUPPOSITIONAL_YOUKU: "虚拟奖品",
  }
  //校验
  const rules = reactive({
      name: [
          {
          required: true,
          message: '请输入奖品名称',
          trigger: 'blur',
          },
  
      ],
      coverUrl: [
          {
          required: true,
          message: '请上传奖品图片',
          trigger: 'blur',
          },
      ],
      startTime: [
          {
          required: true,
          message: '请输入活动起止时间',
          trigger: 'blur',
          }
      ],
  
      rule: [
          {
              required: true,
              message: '请输入活动规则',
              trigger: 'blur',
          }
      ]
  })
  //弹框
  const dialogShow = reactive({
    template: false,
    preview:false,
  })
  
  
  
  //点击添加商品
  const Addproduct = ()=>{
      showDlgType.value == 'edit'
      dialogShow.template = true
      console.log(formData);
  }
  // 确定创造抽奖活动
  const handleSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
         
          if(route.query.showDlgType == 'edit'){
              revisedefine()
          }else{
              founddefine()
          }
          
      } else {
          console.log('error submit!', fields)
      }
    })
  }
  
  //上传图片
  const beforeCoverUpload = (file) =>{
      console.log(file);
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
          ElMessage.error('封面只能是JPG或PNG格式！')
          return false
      }
      uploadFile(file, async (res) => {
          console.log(res);
          if (res.code == 0) {
              formData.cover = res.result.fileName;
              formData.coverurl = res.result.url;
          }
          console.log(formData);
        });
  }
  //浏览
  const preview = () => {
      dialogShow.preview = true
  }
  //新增确定
  const founddefine = async () => {
      let params = {
          cover: formData.cover,
          endTime: formData.endTime,
          name: formData.name,
          rule: formData.rule,
          startTime: formData.startTime,
          prizeVOS:formData.prizeVOS
          
      }
      console.log(params);
      const {
          data: { code },
          data: { result }
      } = await http.LuckyDrawSave(params)
          console.log('获取数据成功', result);
          if (code === 0 && result) {
              ElMessage.success('创建抽奖活动成功')
          } else {
              ElMessage.error('创建抽奖活动失败')
          }
          location.reload()
  
  }
  
  //子传的商品数据
  const Productdata = (val) => {
      console.log(val);
      formData.prizeVOS.push(val)
      
  }
  //奖品设置查询
  const prizesave = async () => {
    let params = {
      luckyDrawId: luckyDrawId.value
    }
    console.log(params);
    const {
      data: { code },
      data: { result }
    } = await http.PrizeFindByLuckyDrawId(params)
      console.log(code);
      if(code === 0 && result) {
          console.log('获取数据成功', result)
          formData.prizeVOS = result
          console.log(formData);
      }else{
          ElMessage.error('获取数据失败')
      }
    
  }
  //修改确认
  const revisedefine = async () => {
      let params = {
          cover: formData.cover,
          endTime: formData.endTime,
          name: formData.name,
          rule: formData.rule,
          startTime: formData.startTime,
          prizeVOS:formData.prizeVOS,
          id:luckyDrawId.value
          
      }
      console.log(params);
      const {
          data: { code },
          data: { result }
      } = await http.LuckyDrawUpdate(params)
          console.log('获取数据成功', result);
          if (code === 0 && result) {
              ElMessage.success('创建抽奖活动成功')
          } else {
              ElMessage.error('创建抽奖活动失败')
          }
          //location.reload()
  }
  //商品单个点击
  const itemcommodity = (item) => {
      console.log(item);
      listData.value = item
      showDlgType.value = 'edit_goods'
      dialogShow.template = true
      
  }
  // 重新获取数据
  const getNewData = () => {
      prizesave()
  }
  //操作删除
  const itemdelBtn = (data) =>{
    console.log(data);
    ElMessageBox.confirm(
      '是否将该活动删除' ,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        
      }
    )
      .then(() => {
        //luckyDrawdelete(data)
        
        // ElMessage({
        //   type: 'success',
        //   message: '删除成功！',
        // })
        prizeDelete(data)
        
        
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除！',
        })
      })
  }
  
  //商品删除
  const prizeDelete = async (data) => {
    let params = {
      id:data.id
    }
    const {
      data: {code},
    } = await http.PrizeDelete(params)
    if (code === 0) {
        ElMessage.success('删除成功')
        prizesave()
    } else {
        ElMessage.error('删除失败')
    }
  
  
  }



  //查询活动详细
  const getData = async () => {
  let params = {
    luckyDrawId:route.query.id
  }
  console.log(params);
  const {
    data: { code },
    data: { result },
  } = await http.PrizeFindByLuckyDrawId(params)
    if(code === 0 && result) {
      console.log('获取数据成功', result)
    //   const { content, totalElements } = result
    //   tableData.value = content
        formData.prizeVOS=result
    }else{
      ElMessage.error('获取数据失败')
    }
}
  
  
  
  
  onMounted(() =>{
    formData.name = route.query.name
    formData.cover = route.query.cover
    formData.startTime = route.query.startTime
    formData.endTime = route.query.endTime
    formData.rule = route.query.rule
    console.log(formData);
    getData()
  })
  </script>
  
  
  
  <style lang="less" scoped>
  // :deep(.el-input){
  //     width: 15%;
  // }
  :deep(.el-image__inner){
    object-fit: contain ;
  }
  .luckydraw{
      display: flex;
      height: 100%;
      padding: 0 1rem;
      box-sizing: border-box;
      flex-direction: column;
      .breadcrumb{
          padding: 1rem 0;
      }
  }
  .prize_list{
      display: flex;
      // justify-content: space-around;
      position: relative;
      align-items: center;
      width: 300px;
      height: 150px;
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      padding: 10px;
      box-sizing: border-box;
      margin-right: 20px;
      margin-bottom: 10px;
      .item_name{
          box-sizing: border-box;
          display: flex;
          margin-left: 10px;
          flex-direction: column;
          height: 100%;
          justify-content: space-around;
          p{
              font-size: 12px;
              line-height: 20px;
          }
      }
  
  }
  
  //海报封面css
  .cover-uploader{
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
      width: 102px;
      height: 102px;
  }
  .cover-uploader-icon{
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      text-align: center;
  }
  .cover{
      width: 100px;
      height: 100px;
      display: block;
  }
  .delete{
      position: absolute;
      top: 107px;
      left: 100px;
      right: 0;
      bottom: 0;
      z-index: 999;
  }
  </style>
  