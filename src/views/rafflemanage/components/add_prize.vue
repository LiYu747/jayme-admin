<template>
  <el-dialog v-model="dialogVisible" class="addDialog"  width="800px" :append-to-body="false" @close="closeDialog()">
        <template #header>
            <div class="header_box">{{props.showDlgType == 'edit_goods' || props.showDlgType == 'edit_goods_add'  ? '修改': '添加'}}奖品</div>
        </template>
        <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="100px" class="addform">
            <!-- 奖品名称 -->
            <el-form-item label="奖品名称" prop="name" >
                <el-input style="width: 30%;" v-model="formData.name"></el-input>
            </el-form-item> 
            <!-- v-if="props.showDlgType == 'edit_goods'" -->
            <el-form-item  label="奖品图片" prop="pic">
                <el-upload class="cover-uploader" :show-file-list="false" :http-request="() => {}" :before-upload="beforeCoverUpload">
                    <img v-if="formData.picurl" :src="formData.picurl" class="cover" />
                    <el-icon v-else class="cover-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <!-- <el-form-item v-else="props.showDlgType == 'edit_goods_add'" label="奖品图片1" prop="pic">
                <el-upload class="cover-uploader" :show-file-list="false" :http-request="() => {}" :before-upload="beforeCoverUpload">
                    <img v-if="formData.picurl" :src="formData.picurl" class="cover" />
                    <el-icon v-else class="cover-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>  -->
            <!-- <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item> 
            <el-form-item label="排序" prop="serialNumber" v-if="rowData">
                <el-input-number v-model="form.serialNumber" :min="1" step-strictly></el-input-number>
            </el-form-item>  -->
            <!-- 奖品数量 -->
            <el-form-item label="奖品数量" prop="number" >
                <!-- <el-input-number v-model="formData.commodity.number_to" :min="1" step-strictly></el-input-number> -->
                <el-input-number v-model="formData.number" :min="0"    />
            </el-form-item> 
            <!-- 商品类型 -->
            <el-form-item label="奖品类型" prop="prizeType" >

                <el-select v-model="formData.prizeType" placeholder="请选择奖品类型"  style="width: 30%;">
                    <el-option v-for="(value,key) in PRIZE_TYPE_ENUM" :key="key" :label="value" :value="key"></el-option>
                </el-select>
            </el-form-item> 
            <!-- 中奖概率 -->
            <el-form-item label="中奖概率" prop="probability" >
                <el-input
                style="width: 30%;"
                 v-model="formData.probability"></el-input><span>%</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit(formDataRef)">{{props.showDlgType == 'edit_goods' || props.showDlgType == 'edit_goods_add'  ? '确定': '创建'}}</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </el-form-item>
        </el-form>
  </el-dialog>

</template>

<script setup>
import {ref, reactive, onMounted, onUnmounted} from "vue"
import {  ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { uploadFile } from "@/utils/upload";
import http from '@/request/api'
import tools from "@/utils/tools";
const formDataRef = ref(null)
const formData= reactive({
    name:'',
    number:'',
    pic:'',
    picurl:'',
    prizeType:'',
    probability:'', 

})
const PRIZE_TYPE_ENUM = {
  TICKET: "门票购买资格",
  MATERIAL_OBJECT: "实物奖品",
  SUPPOSITIONAL_YOUKU: "虚拟奖品",
}
// 定义emit
const emit = defineEmits(['update:showDlg', 'handleAddAdmin','addProductdata'])

const dialogVisible = ref(true)
// props
const props = defineProps({
  showDlgType: {
        type: String,
        default: 'edit_goods_add',
  },
  luckyDrawId:   {
        type: Number,
        default: {},
  },
  listData: {
        type: Object,
        default: {},
  },
})
//校验
const rules = reactive({
    name: [
    {
      required: true,
      message: '请输入奖品名称',
      trigger: 'blur',
    },

  ],
  pic: [
    {
      required: true,
      message: '请上传奖品图片',
      trigger: 'blur',
    },
  ],
  number: [
    {
      required: true,
      message: '请输入奖品数量',
      trigger: 'blur',
    },
    {
      
      pattern: /^[+]{0,1}(\d+)$/,
      // pattern: /^([0-9][0-9]{0,2}|1000)$/,
      message: "请输入正确的奖品数量",
    },
  ],
  prizeType: [
    {
      required: true,
      message: '请选择奖品类型',
      trigger: 'blur',
    },
  ],
  probability: [
    {
      required: true,
      message: '请输入中奖概率',
      trigger: 'blur',
      
    },
    {
      pattern: /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,2}$)|100$/,
      message: "请输入0到100的正确中奖概率",
    },
  ],
})

//弹窗关闭
const closeDialog = ()=>{
    formData.name = ''
    //formData.pic = props.listData.pic
    formData.picurl=''
    formData.number = ''
    formData.prizeType =''
    formData.probability = ''
    console.log("弹窗关闭");
    emit('update:showDlg', false)
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
            formData.pic = res.result.fileName;
            formData.picurl = res.result.url;
        }
      });
}
// 添加商品确定
const handleSubmit = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
        console.log(props.showDlgType);

        if(props.showDlgType == 'edit'){
          // formData.luckyDrawId=props.luckyDrawId
          // emit('addProductdata',formData)
         await prizesave()
         
          
        }else if(props.showDlgType == 'edit_goods'){
          await revisecommodity()
         
        }else if(props.showDlgType == 'add'){
          //formData.luckyDrawId=props.luckyDrawId
          emit('addProductdata',formData)
          console.log('addProductdata1111111111111111');
        }else if(props.showDlgType == 'edit_goods_add'){
          console.log(props.listData);
          console.log(props.listData.iddata);
          formData.iddata=props.listData.iddata
          console.log(formData);
          emit('addProductdata',formData)
        }
        
        emit('update:showDlg', false)
       
        

    } else {
        console.log('error submit!', fields)
    }
  })
}
//奖品新增
const prizesave = async () => {
  let params = {
    luckyDrawId: props.luckyDrawId,
    name:formData.name,
    pic:formData.pic,
    number:formData.number,
    prizeType:formData.prizeType,
    probability:formData.probability,
  }
  console.log(params);
  const {
    data:{code},
    data:{result},

  } = await http.PrizeSave(params)
  if (code === 0 && result) {
    // emit('handleAddAdmin')
    ElMessage.success('奖品新增完成！')
    emit('handleAddAdmin')
    //location.reload()
    
    console.log(formData);
    
  } else {
    ElMessage.error('奖品新增失败！')
  }
  emit('update:showDlg', false)
}
//修改奖品设置
const revisecommodity = async () => {
  console.log('revisecommodity-----------------------------1');
  let params = {
    id: props.listData.id,
    luckyDrawId: props.luckyDrawId,
  }
  formData.name && (params.name = formData.name)
  formData.pic && (params.pic = formData.pic)
  // formData.number && (params.number = formData.number)
  params.number = formData.number
  formData.prizeType && (params.prizeType = formData.prizeType)
  formData.probability && (params.probability = formData.probability)
  console.log(formData.number);
  console.log(params.number);
  const {
    data:{code},
    data:{result},

  } = await http.PrizeUpdate(params)
  if (code === 0 && result) {
    console.log('revisecommodity-----------------------------2');
    ElMessage.success('奖品修改完成！')
    emit('handleAddAdmin')
    console.log(formData);
  } else {
    ElMessage.error('奖品修改失败！')
  }
  emit('update:showDlg', false)

}


onMounted(()=>{
  console.log(props.showDlgType);
  if(props.showDlgType == 'edit_goods'){
    formData.name = props.listData.name
    //formData.pic = props.listData.pic

    formData.picurl=props.listData.pic
    let picurl= props.listData.pic
    formData.pic = picurl.substring(picurl.lastIndexOf('/')+1)
    formData.number = props.listData.number
    formData.prizeType = props.listData.prizeType
    formData.probability = props.listData.probability
    console.log(formData.number);
  }else if(props.showDlgType == 'edit'){

  }else if(props.showDlgType == 'edit_goods_add'){
    formData.name = props.listData.name
    formData.pic = props.listData.pic
    formData.picurl=props.listData.picurl
    formData.number = props.listData.number
    formData.prizeType = props.listData.prizeType
    formData.probability = props.listData.probability
    formData.createdAt = props.listData.createdAt
    console.log(formData.number);
  }
 

})
</script>

<style lang="less" scoped>
.header_box{
  
  font-size: 16px;
}

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
    object-fit: contain ;
}
.cover-uploader-icon{
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

</style>
