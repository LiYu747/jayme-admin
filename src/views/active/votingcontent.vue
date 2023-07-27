<template>
  <div class="active">
    <div class="card_header">
      <!-- <el-breadcrumb separator-icon="ArrowRightBold">
        <el-breadcrumb-item :to="{ path: '/active' }">游戏</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/soundhound' }">歌词接龙</el-breadcrumb-item>
      </el-breadcrumb> -->
    </div>
    <!-- 增加部分 -->
    <div class="btn-section">
        <el-button @click="addvote"  type="primary">新增</el-button>

    </div>
    <!-- 图标部分 -->
    <div class="table-section">
        <el-table :data="tableData"  stripe style="width: 100%;">
            <el-table-column prop="id" label="ID" width="100" align="center">
            </el-table-column>
            <!-- 标题 -->
            <el-table-column prop="title" label="标题"  align="center">
                <template #default="scope">
                    {{ scope.row.title || '暂无' }}
                </template>
            </el-table-column>
            <!-- 封面 -->
            <!-- <el-table-column prop="cover" label="封面" width="350" align="center">
                <template #default="scope">
                    {{ scope.row.cover || '暂无' }}
                </template>
            </el-table-column> -->
            <!-- 封面图片 -->
            <el-table-column prop="coverUrl" label="封面"  align="center">
                <template #default="scope">
                    <!-- {{ scope.row.coverUrl || '暂无' }} -->
                    <el-image
                        style="width: 180px; height: 100px"
                        :src="scope.row.coverUrl"

                        fit="contain"
                    />
                </template>
            </el-table-column>
            <!-- 最大投票数量 -->
            <el-table-column prop="maxNumber" label="最大投票数量"  align="center">
                <template #default="scope">
                    {{ scope.row.maxNumber || '暂无' }}
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column  label="操作" width="200" align="center">
                <template #default="scope">
                    <div class="handle">
                        <el-link
                            :underline="false"
                            type="primary"
                            @click="Voteddetailed(scope.row)"
                            >详情</el-link
                        >
                        <el-link
                            :underline="false"
                            type="primary"
                            @click="Votedrevise(scope.row)"
                            >修改</el-link
                        >
                        <el-link
                            :underline="false"
                            type="danger"
                            @click="Votedeletion(scope.row)"
                            >删除</el-link
                        >

                    </div>
                </template>
            </el-table-column>
        </el-table>


    </div>
    <!-- 弹窗 -->
    <VotingPopup
        v-if="dialogVisible"
        v-model:showDlg="dialogVisible"
        :editVote="editVote"
        @handleAddAdmin="getNewData"
        :showType="showDlgType"
    />
  </div>
</template>

<script>
import { UploadFile, ElLoading ,ElMessage, ElMessageBox} from 'element-plus'
import { uploadFile } from '@/utils/upload'
import tools from './../../utils/tools'
import VotingPopup from "./components/voting_popup.vue"
export default {
    name:'active',
    components:{
        VotingPopup
    },
    data() {
        return {
            // 图标部分数据
            tableData:[
                // {
                //     id:1,
                //     title:'我说哥哥'
                // },
                // {
                //     id:2,
                //     title:'我说哥哥'
                // },
                // {
                //     id:3,
                //     title:'我说哥哥'
                // },
                // {
                //     id:4,
                //     title:'我说哥哥'
                // }
            ],
            //获取数据请求参数
            currentPage:1,
            pageSize: 10,
            //对话框显示
            dialogVisible:false,
            //传弹窗数据
            editVote:{},
            //新增修改类型
            showDlgType:'edit'
        }
    },
    methods: {
        //获取数据
        async getData(){
            let _this = this
            let params = {
                page: _this.currentPage - 1 ,
                size: _this.pageSize,
                sort: 'createdAt,desc',
            }
            const {
                data:{code},
                data:{msg},
                data:{result}
            } = await _this.$http.VotedBackFindAll(params)
            if(code === 0 && result){
                console.log(result);
                const {content=[] , totalElements} = result
                _this.tableData = content
            }else {
                ElMessage.error('获取数据失败')
            }

           //console.log(_this.$http);
        },
        //表格操作-删除
        Votedeletion(data){
            let _this = this
            const {id,title} = data
            ElMessageBox.confirm(`确定要删除${title}吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const {
                    data:{code}
                } = await _this.$http.VotedBackDelete({id})
                if(code === 0){
                    _this.getNewData()
                    ElMessage.success('删除成功')
                    
                }else{
                    ElMessage.error('删除失败')
                }

            })
            .catch(() => {
                ElMessage.info('已取消删除')
            })
        },
        //表格操作-修改
        Votedrevise(data) {
            let _this = this
            _this.dialogVisible = true
            _this.editVote = data
            console.log(_this.editVote);
            console.log(_this.dialogVisible);
            _this.showDlgType = 'edit'
        },
        //重新获取数据
        getNewData(){
            this.getData()
            console.log(111111111);
        },
        //新增
        addvote(){
            let _this = this
            _this.dialogVisible = true
            _this.showDlgType = 'add'
        },
        //表格操作-详细
        Voteddetailed(data){
            
            //this.$router.push(`/detailed?id=${data.id}`)
            this.$router.push({
                name: "detailed",
                query: {
                    id: data.id
                }
            })
            //console.log(data.id);
            
        },
    
    },
    mounted() {
        let _this = this
        _this.getData()
    },
    computed: {

    },
    watch: {
        $route(to, from){
            console.log(to);
            //console.log(from);
        }
      }
}
</script>

<style lang="less" scoped>

.active {
    width: 100%;
    height: calc(100vh - 60px);
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;

    .card_header {
        width: 100%;
        padding-top: 1rem;
        position: relative;
        display: flex;
        .el-tabs {
            width: 50%;
            height: 100%;
            margin-left: 20px;
            display: flex;
            align-items: center;
        }
    }

    .table-section{
        width: 100%;
        height: 90%;
        overflow: auto;
        .handle {
            display: flex;
            align-items: center;
            justify-content: space-evenly;
        }
    }
}
.btn-section{
    margin: 0.5rem;
    margin-bottom: 1rem;
    width: 100%;
    display: flex;
    justify-content: flex-start;
}



</style>
