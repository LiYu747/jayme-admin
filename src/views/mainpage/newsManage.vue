<template>
<div class="box">
    <div class="c-header">
        <el-button type="primary" @click="addDialogVisible = true;editRowData = null;">新增资讯</el-button>
    </div>
    <div class="c-body">
      <el-table :data="listData" style="width: 100%;height: 100%;">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="coverUrl" label="封面" width="220">
            <template #default="scope">
                <el-image style="width: 180px; height: 100px" :src="scope.row.coverUrl" fit="contain" lazy />
            </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" >
          <template #default="scope">
            <el-tag v-if="scope.row.isTop">置顶</el-tag>
            {{ scope.row.title }}
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
                    <el-link :underline="false" type="primary" @click="openNews(scope.row)">打开文章</el-link>
                    <el-link v-if="scope.row.isTop" :underline="false" type="primary" @click="cancelTopNews(scope.row)">取消置顶</el-link>
                    <el-link v-else :underline="false" type="primary" @click="topNews(scope.row)">置顶</el-link>
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

    <addNews
      v-if="addDialogVisible"
      :dialogVisible.sync="addDialogVisible"
      :rowData="editRowData"
      @update:dialogVisible="updateAddDialogVisible"
    >  
    </addNews>
</div>
</template>
<script>
import { UploadFile, ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { ArrowRight, ArrowRightBold } from "@element-plus/icons-vue";
import { uploadFile } from "@/utils/upload";
import { getLocalStorage, setLocalStorage } from "@/utils/index";
import tools from "./../../utils/tools";

import addNews from "./components/add-news";

export default {
    name: "newsManage",
    components: {
        addNews
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
            _self.$http.findAllInformation(from).then((res) => {
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
          this.$confirm("是否删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              console.log(val);
              let from = {
                id: val.id,
              };
              this.$http.deleteInformation(from).then((res) => {
                if (res.data.code == 0) {
                  ElMessage({
                    type: "success",
                    message: "删除成功",
                  });
                  this.getList();
                }
              });
            })
            .catch(() => {
              ElMessage({
                type: "info",
                message: "取消删除",
              });
            });
        },
        updateAddDialogVisible(newValue){
            this.addDialogVisible = newValue;
            this.currentPage = 1;
            this.getList();
        },
        openNews(row){
            console.log(row)
            window.open(row.link);
        },
        topNews(row){
            console.log(row)
            this.$http.topInformation({id:row.id}).then((res) => {
                if (res.data.code == 0) {
                  ElMessage({
                    type: "success",
                    message: "操作成功",
                  });
                  this.getList();
                }
            });
        },
        cancelTopNews(row){
            console.log(row)
            this.$http.cancelTopInformation({id:row.id}).then((res) => {
                if (res.data.code == 0) {
                  ElMessage({
                    type: "success",
                    message: "操作成功",
                  });
                  this.getList();
                }
            });
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