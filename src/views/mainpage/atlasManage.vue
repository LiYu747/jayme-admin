<template>
<div class="box">
    <div class="c-header">
        <el-button type="primary" @click="addDialogVisible = true;editRowData = null;">新增分类</el-button>
    </div>
    <div class="c-body">
      <el-table :data="listData" style="width: 100%;height: 100%;">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="coverUrl" label="封面" width="220">
            <template #default="scope">
                <el-image style="width: 180px; height: 100px" :src="scope.row.coverUrl" fit="contain" lazy />
            </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="serialNumber" label="排序" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="scope">
            {{ tools.transitionTime(scope.row.createdAt) }}</template
          >
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <div class="handle">
              <el-link
                :underline="false"
                type="primary"
                @click="intoGalleryType(scope.row)"
                >查看</el-link
              >
              <el-link
                :underline="false"
                type="primary"
                @click="modBtn(scope.row)"
                >修改</el-link
              >
              <el-link
                :underline="false"
                type="danger"
                @click="delBtn(scope.row)"
                >删除</el-link
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="c-footer">
        <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            :background="true"
            @current-change="handleCurrentChange"
          />
    </div> -->

    <addGallerytype
      v-if="addDialogVisible"
      :dialogVisible.sync="addDialogVisible"
      :rowData="editRowData"
      @update:dialogVisible="updateAddDialogVisible"
    >  
    </addGallerytype>
</div>
</template>
<script>
import { UploadFile, ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { ArrowRight, ArrowRightBold } from "@element-plus/icons-vue";
import { uploadFile } from "@/utils/upload";
import { getLocalStorage, setLocalStorage } from "@/utils/index";
import tools from "./../../utils/tools";

import addGallerytype from "./components/add-gallerytype";

export default {
    name: "atlasManage",
    components: {
        addGallerytype
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
            this.currentPage = val
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
            _self.$http.findAllGalleryType(from).then((res) => {
                console.log(res);
                this.listData = res.data.result;
                // this.total = res.data.result.totalElements;
            });
        }, 
        updateAddDialogVisible(newValue){
            this.addDialogVisible = newValue;
            this.currentPage = 1;
            this.getList();
        },
        intoGalleryType(row){
            console.log(row)
            let _self = this;
            this.$router.push(`/atlasContent/${row.id}`)
        },
        modBtn(row){
            console.log(row)
            let _self = this;
            _self.addDialogVisible = true;
            _self.editRowData = row;
            // this.$router.push(`/atlasContent/${row.id}`)
        },
        async delBtn(row){
            console.log(row)
            let _self = this;
            let ret = null;
            ret = await _self.$http.deleteGalleryType({
                id: row.id
            })
            console.log(ret);
            if(ret.data.code == 0){
                ElMessage({
                    type: "success",
                    message: "操作成功",
                });
                _self.$http.operateLogSave({
                  operateLogType: 'ADMIN_OPT',
                  detail:`管理员 [${_self.userInfo.name}] 删除了图集分类[${row.name}]`
                })
                this.currentPage = 1;
                this.getList();
            }
            else{
                ElMessage({
                    type: "info",
                    message: `操作失败，原因：${ret.data.msg}`,
                });
            }
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