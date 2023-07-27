<template>
    <el-dialog v-model="dialogVisible" class="addDialog" width="800px"  lock-scroll   :append-to-body="false" @close="closeDialog()">
        <!-- <h1>{{ props.listData.rule }}</h1> -->
        <!-- <p style="height: 500px;" v-html="props.listData.rule"></p> -->
        <!-- <el-text class="mx-1" size="large" v-html="props.listData.rule"></el-text> -->
        <h3 style="display: flex; justify-content: center; margin-bottom: 16px;">活动规则</h3>
        <el-scrollbar height="400px" >
            <p   v-html="props.listData.rule"></p>
        </el-scrollbar>
    </el-dialog>
  
  </template>
  
  <script setup>
  import {ref, reactive, onMounted, onUnmounted} from "vue"

  // 定义emit
  const emit = defineEmits(['update:showDlg', 'handleAddAdmin'])
  const dialogVisible = ref(true)
  // props
  const props = defineProps({
    listData: {
        type: Object,
        default: {},
    },
   })
  
  //弹窗关闭
  const closeDialog = ()=>{
      console.log("弹窗关闭");
      emit('update:showDlg', false)
  }

  
  
  onMounted(()=>{
      //formData.value = props.listData
      //console.log(formData.value);
  })
  </script>
  
  <style lang="less" scoped>
  //海报封面css
  .cover-uploader{
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
  }
  .cover{
      width: 178px;
      height: 178px;
      display: block;
  }
  .cover-uploader-icon{
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
      
  }
  
  </style>
  