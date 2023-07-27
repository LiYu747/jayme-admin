<template>
<div class="box">
    <div class="c-header">
        <el-button type="primary" @click="addDialogVisible = true;editRowData = null;">新增Banner</el-button>
    </div>
    <div class="c-body">
      <el-table :data="listData" style="width: 100%;height: 100%;">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="poster" label="封面" width="220">
            <template #default="scope">
                <el-image style="width: 180px; height: 100px" :src="scope.row.poster" fit="contain" lazy />
            </template>
        </el-table-column>
        <el-table-column prop="bannerType" label="内容类型" width="180">
          <template #default="scope">
            {{ getBannerTypeName(scope.row.bannerType) }}</template
          >
        </el-table-column>
        <el-table-column prop="link" label="链接地址" >
          <template #default="scope">
            <span v-if=" scope.row.bannerType == 'JAYME_OFFICIAL_ACCOUNTS_ARTICLE' ">
                {{ scope.row.link }}
            </span>
            <span v-else>
                {{ scope.row.content }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="serialNumber" label="排序" />
        <el-table-column prop="shelves" label="上架状态" width="180">
          <template #default="scope">            
            <el-switch v-model="scope.row.shelves" @change="shelvesChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="scope">
            {{ tools.transitionTime(scope.row.createdAt) }}</template
          >
        </el-table-column>
        <el-table-column label="操作" width="180">
            <template #default="scope">
                <div class="handle">
                    <el-link :underline="false" type="primary" @click="modBtn(scope.row)">修改</el-link>
                    <el-link :underline="false" type="danger" @click="delBtn(scope.row)">删除</el-link>
                </div>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="c-footer">
        <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            :background="true"
            @current-change="handleCurrentChange"
          />
    </div>

    <addBanner
      v-if="addDialogVisible"
      :dialogVisible.sync="addDialogVisible"
      :rowData="editRowData"
      @update:dialogVisible="updateAddDialogVisible"
    >  
    </addBanner>
</div>
</template>
<script>
import { UploadFile, ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { ArrowRight, ArrowRightBold } from "@element-plus/icons-vue";
import { uploadFile } from "@/utils/upload";
import { getLocalStorage, setLocalStorage } from "@/utils/index";
import tools from "./../../utils/tools";

import addBanner from "./components/add-banner";

export default {
    name: "bannerManage",
    components: {
        addBanner
    },
    data() {
        return {
            tools,
            userInfo: {},
            currentPage: 1,
            pageSize: 10,
            total: 0,
            listData:[],
            addDialogVisible:false,
            editRowData: null
        };
    },
    methods: {
        handleCurrentChange(val){
            console.log(val);
            this.currentPage = val;
            this.getList()
        },
        getList(){
            let _self = this;
            let from = {
                // parentId: this.parentId,.
                page: this.currentPage - 1,
                size: this.pageSize,
                sort: "createdAt,desc",
            };
            _self.$http.findAllActivity(from).then((res) => {
                console.log(res);
                this.listData = res.data.result.content;
                this.total = res.data.result.totalElements;
            });
        },
        modBtn(row){
            console.log(row)
            let _self = this;
            _self.addDialogVisible = true;
            _self.editRowData = row;
        },     
        delBtn(val) {
            let _self = this;
            _self.$confirm(`是否删除该Banner？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
            .then(() => {
              console.log(val);
              let from = {
                id: val.id,
              };
              _self.$http.deleteActivity(from).then((res) => {
                if (res.data.code == 0) {
                    ElMessage({
                        type: "success",
                        message: "删除成功",
                    });
                    _self.$http.operateLogSave({
                      operateLogType: 'ADMIN_OPT',
                      detail:`管理员 [${_self.userInfo.name}] 删除了Banner[id: ${val.id}]`
                    })
                    _self.getList();
                }
                else{
                    ElMessage({
                        type: "info",
                        message: "取消删除",
                    });
                }
              });
            })
            .catch(() => {
              
            });
        },
        updateAddDialogVisible(newValue){
            this.addDialogVisible = newValue;
            this.currentPage = 1;
            this.getList();
        },
        async shelvesChange(row){
            console.log(row)
            let _self = this;
            let ret = null;
            if(row.shelves){
                ret = await _self.$http.shelvesActivity({id:row.id})
                
            }
            else{
                ret = await _self.$http.cancelShelvesActivity({id:row.id})
            }

            if(ret.data.code == 0){                

                let opt = '下架'
                if(row.shelves){
                    opt = '上架'                    
                }
                ElMessage({
                    type: "success",
                    message: `${opt}Banner成功`,
                });
                await _self.$http.operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:`管理员 [${_self.userInfo.name}] ${opt}了Banner[id: ${row.id}]`
                })
            }
                
            // this.$http.deleteActivity(from)
        },
        getBannerTypeName(type){
            let name = '';
            switch(type){
                case 'JAYME_OFFICIAL_ACCOUNTS_ARTICLE':
                    name = '公众号文章';
                    break;
                case 'INS':
                    name = 'Ins';
                    break;
                case 'GALLERY':
                    name = '高清图集';
                    break;
                case 'INFORMATION':
                    name = '新闻资讯';
                    break;
                case 'VOTE':
                    name = '投票';
                    break;
            }
            return name;
        }
    },
    mounted() {
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        this.getList();
    },
    computed: {},
};
</script>
<style lang="less" scoped>
.box{
    display: flex;
    height: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
    flex-direction: column;
    .c-header{
        padding: 0.5rem 0;
    }
    .c-body{
        flex: 1;
    }
    .c-footer{
        display: flex;
        justify-content: flex-end;
        padding: 0.5rem 0;
    }

    .handle{
        .el-link{
            margin-right: 0.5rem;
        }
    }
}
</style>