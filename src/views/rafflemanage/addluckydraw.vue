<template>
    <div class="luckydraw">
        <!-- 面包屑导航 -->
        <div class="breadcrumb">
            <div style="margin-bottom: 1rem;">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/rafflemanage' }">抽奖管理</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ route.query.showDlgType == 'edit' ? '修改' : '创建' }}抽奖活动</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <el-form :model="formData" ref="formDataRef" :rules="rules" label-width="120px">
            <el-form-item label="活动名称" prop="name">
                <el-input style="width: 15%;" :rows="4" placeholder="请输入活动名称" v-model="formData.name"></el-input>

            </el-form-item>
            <!-- 海报封面 -->
            <el-form-item label="海报封面" prop="cover">
                <el-upload class="cover-uploader" :show-file-list="false" :http-request="() => { }"
                    :before-upload="beforeCoverUpload">
                    <img style="object-fit: contain;" v-if="formData.coverurl" :src="formData.coverurl" class="cover" />
                    <el-icon v-else class="cover-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <!-- 活动起止时间 -->
            <el-form-item label="活动时间" prop="value2" style="width: 584px" >
                <!-- <el-date-picker v-model="formData.startTime" type="datetime" placeholder="起始活动时间"
                    format="YYYY/MM/DD HH:mm:ss" value-format="x" />
                <span style="border-top: 1px solid #333; width: 10px; margin: 0 10px;"></span>
                <el-date-picker v-model="formData.endTime" type="datetime" placeholder="结束活动时间"
                    format="YYYY/MM/DD HH:mm:ss" value-format="x" /> -->


                <el-date-picker
                    v-model="formData.value2"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="YYYY/MM/DD HH:mm:ss"
                    value-format="x"
                />
            </el-form-item>
            <!-- 奖品设置 -->
            <el-form-item v-if="route.query.showDlgType == 'edit'" label="奖品设置" prop="examTime" label-position
                style="width: 80%;">
                {{ testValue }}
                <div class="prize_list" v-for="item in formData.prizeVOS" @click="itemcommodity(item)">
                    <el-image  v-if="!item.picurl" style="width: 120px; object-fit: contain;  height: 130px" :src="item.pic" />

                    <el-image  v-else="item.picurl" style="width: 120px; object-fit: contain;  height: 130px" :src="item.picurl" />
                    <Delete class="delete" style="width: 2em; height: 2em; margin-right: 8px"
                        @click.stop="itemdelBtn(item)" />
                    <div class="item_name">
                        
                        <p>奖品名称: {{ item.name }}</p>
                        <p>奖品数量: {{ item.number }}</p>
                        <p>奖品类型: {{ PRIZE_TYPE_ENUM[item.prizeType] }}</p>
                        <p>中奖概率: {{ item.probability }}%</p>
                    </div>

                </div>

                <!-- 添加商品 -->
                <div class="cover-uploader" @click="Addproduct(luckyDrawId)">
                    <el-icon class="cover-uploader-icon" style="display: flex; flex-direction: column;">
                        <Plus style="width: 2em; height: 2em;" />
                        <div style="font-size: 14px;">添加奖品</div>
                    </el-icon>
                </div>
            </el-form-item>
            <el-form-item v-else="route.query.showDlgType == 'add'" label="奖品设置" prop="examTime" label-position
                style="width: 80%;">
                <div class="prize_list" v-for="(item) in prelist" @click="additemcommodity(item)">
                    <el-image v-if="!item.picurl" style="width: 120px;   height: 130px" :src="item.pic" />

                    <el-image v-else="item.picurl" style="width: 120px;   height: 130px" :src="item.picurl" />
                    <Delete class="delete" style="width: 2em; height: 2em;  margin-right: 8px"
                        @click.stop="additemdelBtn(item)" />
                    <div class="item_name">
                        {{ index }}
                        <p>奖品名称:{{ item.name }}</p>
                        <p>奖品数量: {{ item.number }}</p>
                        <p>奖品类型: {{ PRIZE_TYPE_ENUM[item.prizeType] }}</p>
                        <p>中奖概率: {{ item.probability }}%</p>
                    </div>

                </div>

                <!-- 添加商品 -->
                <div class="cover-uploader" @click="Addproductto()">
                    <el-icon class="cover-uploader-icon" style="display: flex; flex-direction: column;">
                        <Plus style="width: 2em; height: 2em;" />
                        <div style="font-size: 14px;">添加奖品</div>
                    </el-icon>
                </div>
            </el-form-item>

            <!-- 活动规则 -->
            <!-- v-if=" formData.rule" -->
            <el-form-item label="活动规则" prop="rule" v-if="route.query.showDlgType == 'add'">

                <Editor v-model:editPost="formData.rule" />
            </el-form-item>
            <el-form-item label="活动规则" prop="rule" v-else="route.query.showDlgType">

                <Editor v-model:editPost="formData.rule" v-if="formData.rule" />
            </el-form-item>
            <el-form-item>
                <el-button style="margin-left: 40px !important; " @click="preview">预览</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="large" style="margin-left: 400px;"
                    @click="handleSubmit(formDataRef)" v-if="route.query.showDlgType == 'edit'">确定</el-button>
                    <el-button type="primary" size="large" v-else="route.query.showDlgType != 'edit'" style="margin-left: 400px;"
                    @click="handleSubmit(formDataRef)">创建</el-button>
            </el-form-item>

            <!-- 弹窗 -->
            <AddPrize v-if="dialogShow.template" v-model:showDlg="dialogShow.template" :listData="listData"
                @addProductdata="Productdata" @handleAddAdmin="getNewData" :showDlgType="showDlgType"
                :luckyDrawId="luckyDrawId" />
            <!-- 浏览弹窗 -->
            <AddPreview v-if="dialogShow.preview" v-model:showDlg="dialogShow.preview" :listData="formData" />


        </el-form>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue"
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { uploadFile } from "@/utils/upload";
import { useRoute ,useRouter} from 'vue-router'
import Editor from './components/Editor.vue'
import AddPrize from './components/add_prize.vue'
import AddPreview from './components/add_preview.vue'
import http from '@/request/api'
import tools from "../../utils/tools";
const route = useRoute();
const router = useRouter();
const formDataRef = ref(null)
const formData = reactive({
    cover: '',
    endTime: '',
    name: '',
    rule: '',
    startTime: '',
    //投票vo
    prizeVOS: [],
    value2:'',
})

//创建商品数据
const prelist = ref([])
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
            message: '请输入活动名称',
            trigger: 'blur',
        },

    ],
    cover: [
        {
            required: true,
            message: '请上传活动图片',
            trigger: 'blur',
        },
    ],
    value2: [
        {
            required: true,
            message: '请输入活动时间',
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
    preview: false,
})




//点击添加商品
const Addproduct = (data) => {
    if (route.query.showDlgType == 'edit') {
        showDlgType.value = 'edit'
    } else {
        showDlgType.value = 'add'
    }

    dialogShow.template = true
    luckyDrawId.value = data
    console.log(showDlgType.value);
    console.log(data);

}
//点击添加商品
const Addproductto = () => {
    
    showDlgType.value = 'add'
    dialogShow.template = true
    console.log(showDlgType.value);
}


// 确定创造抽奖活动
const handleSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (route.query.showDlgType == 'edit') {
                revisedefine()
                
            } else {
                //
                formData.prizeVOS = prelist.value
                founddefine()
                console.log(formData);
            }

        } else {
            console.log('error submit!', fields)
        }
    })
}

//上传图片
const beforeCoverUpload = (file) => {
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
    formData.startTime = formData.value2[0]
    formData.endTime = formData.value2[1]
    console.log(formData);
    if(formData.startTime >= formData.endTime) {
        ElMessage.error('活动时间错误')
        return
    }
    
    let params = {
        cover: formData.cover,
        endTime: formData.endTime,
        name: formData.name,
        rule: formData.rule,
        startTime: formData.startTime,
        prizeVOS: formData.prizeVOS

    }
    console.log(params);
    const {
        data: { code },
        data: { result }
    } = await http.LuckyDrawSave(params)
    console.log('获取数据成功', result);
    if (code === 0 && result) {
        ElMessage.success('创建抽奖活动成功')
        router.push({
            name:'rafflemanage',
        })
    } else if(code === 30100) {
        ElMessage.error('该时间段已有抽奖')
    }else{
        ElMessage.error('创建抽奖活动失败')
    }
    //location.reload()

}


//奖品设置查询
const prizesave = async () => {
    console.log('测试---------------------------3');
    let params = {
        luckyDrawId: luckyDrawId.value
    }
    console.log(params);
    const {
        data: { code },
        data: { result }
    } = await http.PrizeFindByLuckyDrawId(params)
    console.log(code);
    if (code === 0 && result) {
        console.log('获取数据成功', result)
        formData.prizeVOS = result
        console.log(formData);
    } else {
        ElMessage.error('获取数据失败')
    }

}
//修改确认
const revisedefine = async () => {
    console.log(formData.value2);

    formData.startTime = formData.value2[0]
    formData.endTime = formData.value2[1]

    
    
    console.log(formData.startTime);
    console.log(formData);
    if(formData.startTime >= formData.endTime) {
        ElMessage.error('活动起止时间错误')
        return
    }
    let params = {
        cover: formData.cover,
        endTime: formData.endTime,
        name: formData.name,
        rule: formData.rule,
        startTime: formData.startTime,
        id: luckyDrawId.value

    }
    console.log(params);
    
    const {
        data: { code },
        data: { result }
    } = await http.LuckyDrawUpdate(params)
    console.log('获取数据成功', result);
    if (code === 0 && result) {
        ElMessage.success('修改抽奖活动成功')
        router.push({
            name:'rafflemanage',
        })
    }else if(code === 30100) {
        ElMessage.error('该时间段已有抽奖')
    } else {
        ElMessage.error('修改抽奖活动失败')
    }
    //location.reload()
    //history.back()
}
//修改商品单个点击
const itemcommodity = (item) => {
    console.log(item);
    listData.value = item
    showDlgType.value = 'edit_goods'
    dialogShow.template = true

}
//子传的商品数据
const Productdata = (val) => {
    console.log(val.iddata);
    console.log(val);
    // prelist.value.filter((item)=>{
    //     if (item.iddata == val.iddata) {
    //         console.log(1111);
    //     }
    // })
    // formData.prizeVOS.push({
    //     ...val,
    //     index:formData.prizeVOS.length
    // })
    
    if(val.iddata){
        prelist.value.forEach((item)=>{
            console.log(item,val);
            console.log(item.iddata,val.iddata);
            if(item.iddata === val.iddata){
                item.name = val.name
                item.number = val.number
                item.pic = val.pic
                item.picurl = val.picurl
                item.prizeType = val.prizeType
                item.probability = val.probability  
            }
        })
    }else{
        prelist.value.push({
            ...val,
            iddata: Date.now()
        })
    }
    

    



}

//创建商品单个点击
const additemcommodity = (data) => {
    // console.log(item);
    listData.value = data
    showDlgType.value = 'edit_goods_add'
    dialogShow.template = true
    
      
}
//删除商品单个点击
const additemdelBtn = (data) => {
    prelist.value = prelist.value.filter((item => item.iddata !== data.iddata))
    console.log(prelist.value);
}

// 重新获取数据
const getNewData = () => {

    console.log(111);
    prizesave()
}
//操作删除
const itemdelBtn = (data) => {
    console.log(data);
    ElMessageBox.confirm(
        '是否将该活动删除',
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
        id: data.id
    }
    const {
        data: { code },
    } = await http.PrizeDelete(params)
    if (code === 0) {
        ElMessage.success('删除成功')
        prizesave()
    } else {
        ElMessage.error('删除失败')
    }


}




onMounted(() => {
    console.log(route.query.showDlgType);
    if (route.query.showDlgType == 'edit') {
        luckyDrawId.value = JSON.parse(route.query.data).id
        console.log(route.query.data);
        console.log(JSON.parse(route.query.data));
        formData.name = JSON.parse(route.query.data).name
        formData.startTime = Number(JSON.parse(route.query.data).startTime) 
        formData.endTime = Number(JSON.parse(route.query.data).endTime) 
        console.log(formData.startTime,formData.endTime);
        formData.value2 =[new Date(formData.startTime),new Date(formData.endTime)]
        formData.value2[0] = formData.startTime
        formData.value2[1] = formData.endTime
        let coverurl= JSON.parse(route.query.data).cover
        console.log(coverurl.substring(coverurl.lastIndexOf('/')+1));
        formData.cover = coverurl.substring(coverurl.lastIndexOf('/')+1)
        formData.coverurl = JSON.parse(route.query.data).cover
        formData.rule = JSON.parse(route.query.data).rule
        showDlgType.value = route.query.showDlgType
        console.log(formData);
        prizesave()
    }


})
</script>



<style lang="less" scoped>
// :deep(.el-input){
//     width: 15%;
// }
:deep(.el-image__inner){
    object-fit: contain ;
}
:deep(.el-form-item__content){
    margin-left: 40px;
}
:deep(.el-form-item){
    margin-bottom: 26px !important;
}
.luckydraw {
    display: flex;
    height: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
    flex-direction: column;

    .breadcrumb {
        padding: 1rem 0;
    }
}

.prize_list {
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

    .item_name {
        box-sizing: border-box;
        display: flex;
        margin-left: 10px;
        flex-direction: column;
        height: 100%;
        justify-content: space-around;

        p {
            font-size: 12px;
            line-height: 20px;
        }
    }

}

//海报封面css
.cover-uploader {
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    width: 102px;
    height: 102px;
}

.cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}

.cover {
    width: 100px;
    height: 100px;
    display: block;
}

.delete {
    position: absolute;
    top: 112px;
    left: 100px;
    right: 0;
    bottom: 0;
    z-index: 999;
}
</style>
