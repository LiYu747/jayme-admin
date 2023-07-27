<template>
    <div class="container">
        <div class="box">
            <div class="header">
                <div class="box-1">
                    <el-breadcrumb separator-icon="ArrowRightBold">
                        <el-breadcrumb-item :to="{ path: '/category' }">分类管理</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{
                            path: '/checkCategory',
                            query: {
                                data: this.lastbreadcrumbName,
                                id: this.Id2
                            }
                        }">{{ lastbreadcrumbName }}</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{ path: '/checkdeepCategory' }">{{ breadcrumbName }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="box-2" v-if="this.delManyStu == false">
                    <el-link :underline="false" type="info" @click="delMany">批量操作</el-link>
                    <el-button type="primary" @click="addRes">添加资源</el-button>
                </div>
                <div class="box-2" v-if="this.delManyStu == true">
                    <el-button type="danger" @click="delBtn">删除</el-button>
                    <el-button icon="ArrowLeftBold" @click="back">返回</el-button>
                </div>
            </div>
            <div class="orderList-content">
                <el-table :data="dataList" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="30px" v-if="this.delManyStu == true" />
                    <el-table-column prop="cover" label="资源封面">
                        <template #default="scope">
                            <!-- {{ scope.row.resources.cover }} -->
                            <el-image style="width: 100px; height: 100px" :src="scope.row.resources.cover" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="resources.name" label="资源名称" />
                    <el-table-column prop="createdAt" label="创建时间">
                        <template #default="scope">
                            {{ tools.transitionTime(scope.row.createdAt) }}
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="排序" width="100" />
                    <el-table-column prop="resourcesType" label="类型">
                        <template #default="scope">
                            <!-- <el-switch v-model="scope.row.resourceType" /> -->
                            {{ scope.row.resourcesType == "VIDEO" ? '视频' : '音频' }}
                        </template>
                    </el-table-column>>
                    <el-table-column prop="address" label="操作">
                        <template #default="scope">
                            <div class="handle">
                                <el-link :underline="false" type="danger" @click="del(scope.row)">删除</el-link>
                            </div>

                        </template>
                    </el-table-column>

                </el-table>

            </div>
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize"
                layout="total, prev, pager, next, jumper" :total="total" :background="true"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />


        </div>
        <!-- 删除弹出层 -->
        <el-dialog class="deldialog" v-model="delDialogVisible" title="确认提示" width="40%" align-center center>
            <span class="delHint">
                确认删除该分类吗？
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="sureDel()">
                        确认
                    </el-button>
                    <el-button @click="delDialogVisible = false">取消</el-button>

                </span>
            </template>
        </el-dialog>
        <!-- 添加资源弹出层 -->
        <el-dialog class="adddialog" v-model="addDialogVisible" width="50%">
            <template #header>
                <div class="header-box">
                    添加资源
                </div>
            </template>
            <div class="content-box">
                <div class="box-1">
                    <div class="input-box">
                        <el-input v-model="input" placeholder="请输入你需要的资源名称" @keyup.enter.native="search" />
                    </div>
                    <div class="add-box">
                        <el-button type="primary" @click="addCatRes">添加</el-button>
                    </div>
                </div>
                <div class="box-2">
                    <el-table ref="multipleTableRef" :data="diadataList" style="width: 100%"
                        @selection-change="handleSelectionChange2">
                        <el-table-column type="selection" width="55" />
                        <el-table-column label="资源名称">
                            <template #default="scope">{{ scope.row.name }}</template>
                        </el-table-column>
                        <el-table-column label="封面">
                            <template #default="scope">
                                <el-image style="width: 50px; height: 50px" :src="scope.row.cover" />
                            </template>

                        </el-table-column>
                        <el-table-column property="createdAt" label="创建时间">
                            <template #default="scope">
                                {{ tools.transitionTime(scope.row.createdAt) }}
                            </template>
                        </el-table-column>
                        <el-table-column property="address" label="操作" />
                    </el-table>





                </div>
            </div>
            <template #footer>
                <div class="footer">
                    <el-pagination v-model:currentPage="currentPage2" v-model:page-size="pageSize2"
                        layout="total, prev, pager, next, jumper" :total="total2" :background="true"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange2" />
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import tools from '@/utils/tools'
import { ArrowRight, ArrowRightBold, ArrowLeftBold } from '@element-plus/icons-vue'
import { UploadFile, ElMessage } from 'element-plus'
export default {
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            currentPage2: 1,
            pageSize2: 10,
            total2: 0,
            value1: false,
            lastbreadcrumbName: "",
            breadcrumbName: "",
            Id: "",
            Id2: "",
            input: "",
            dataList: [],
            diadataList: [],
            tools,
            delDialogVisible: false,
            addDialogVisible: false,
            delManyStu: false,
            delId: "",
            multipleSelection: [],
            multipleSelection2: [],
            // filterArray: []
        }
    },
    created() {
        // console.log('created', this.$router.currentRoute.fullPath)


    },
    mounted() {
        this.getbreadcrumbName()
        this.getList()
        // this.breadcrumbName = this.$route.query.data
        // console.log(this.$route.query.data)
        // this.$route.params.id
    },
    methods: {
        getbreadcrumbName() {
            this.lastbreadcrumbName = this.$route.query.data
            this.breadcrumbName = this.$route.query.data2
            this.Id = this.$route.query.id
            this.Id2 = this.$route.query.id2
            console.log(this.breadcrumbName)
            console.log('Id', this.Id)
        },
        handleSizeChange() {

        },
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val
            this.getList()

        },
        handleCurrentChange2(val) {
            console.log(val)
            this.currentPage2 = val
            this.getDiaList()

        },
        getList() {
            let _this = this;
            let from = {
                classificationId: _this.Id,
                page: 0,
                size: 10,
            }
            console.log(from)
            _this.$http.findByResources(from)
                .then((res) => {
                    console.log(res)
                    this.dataList = res.data.result.content
                    this.total = res.data.result.totalElements
                    this.dataList.forEach((item, index) => {
                        item.delStu = false
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        getDiaList() {
            let _this = this;
            let from = {
                classificationId: _this.Id,
                page: 0,
                size: 10,
            }
            // console.log(from)
            _this.$http.findAllRes(from)
                .then((res) => {
                    const resourceList =  res.data.result.content
                    console.log('所有资源', resourceList)
                    console.log('已有资源', _this.dataList)
                    let filterArray = []
                    _this.diadataList = res.data.result.content//这是所有资源
                    const haveIds =  _this.dataList.map((item) => item.resources.id);
                    console.log("haveIds",haveIds)
                    resourceList.forEach((item) => {
                        // console.log(item)
                        if(!haveIds.includes(item.id)){
                            filterArray.push(item)
                        }
                      
                    })
                    // _this.diadataList.forEach((item, index) => {
                    //     console.log(item.id)
                    //     // if(_this.dataList.)

                    //     // _this.dataList.forEach((item2) => {
                    //     //     console.log(item2.resources.id)
                    //     //     if (item.id != item2.resources.id) {
                    //     //         filterArray.push(item)
                    //     //     }
                    //     // })
                    // })


                    console.log('filterArray', filterArray)
                    this.diadataList = filterArray

                    this.total2 = res.data.result.totalElements

                    // this.diadataList.forEach((item, index) => {
                    //     item.delStu = false
                    // })
                })
        },
        //删除弹层开关
        del(val) {
            // console.log(val)
            this.delId = val.resources.id
            this.delDialogVisible = true
        },
        //单个删除
        sureDel() {
            let from = {
                classificationId: +this.Id,
                resourcesIds: []
            }
            from.resourcesIds.push(this.delId)
            let _this = this;
            _this.$http.batchDelete(from)
                .then((res) => {
                    console.log(res)
                    if (res.status == 200) {
                        if (res.data.code == 30000) {
                            ElMessage({
                                message: res.data.msg,
                                type: 'warning',
                            })
                            this.delDialogVisible = false
                        }
                        if (res.data.code == 0) {
                            ElMessage({
                                message: res.data.msg,
                                type: 'success',
                            })
                            this.getList()
                            this.delDialogVisible = false
                        }

                    }
                })
        },
        //批量删除弹层开关
        delMany() {
            this.delManyStu = true
        },
        //返回页面关闭弹层
        back() {
            this.delManyStu = false
        },
        //批量删除选中
        handleSelectionChange(val) {
            this.multipleSelection = val;
        
        },
        handleSelectionChange2(val) {
            this.multipleSelection2 = val;
        
        },
        //批量删除
        delBtn() {
            console.log(this.multipleSelection)
            let from = {
                classificationId: +this.Id,
                resourcesIds: []
            }
            this.multipleSelection.forEach((item, index) => {
                from.resourcesIds.push(item.resources.id)
                console.log(item.resources)
            })
            let _this = this;
            _this.$http.batchDelete(from)
                .then((res) => {
                    console.log(res)
                    if (res.status == 200) {
                        if (res.data.code == 30000) {
                            ElMessage({
                                message: res.data.msg,
                                type: 'warning',
                            })
                            this.delDialogVisible = false
                        }
                        if (res.data.code == 0) {
                            location.reload()
                            ElMessage({
                                message: res.data.msg,
                                type: 'success',
                            })
                            this.delManyStu = false
                            this.getDiaList()
                            // this.delDialogVisible = false
                        }

                    }
                })
        },
        addRes() {
            this.addDialogVisible = true
            this.getDiaList()
        },
        addCatRes() {
            let _this = this;
            let from = {
                classificationId: this.Id,
                resourcesIds: []
            }
            this.multipleSelection2.forEach((item, index) => {
                from.resourcesIds.push(item.id)
            })

            _this.$http.addResources(from)
                .then((res) => {
                    console.log(res)
                    if (res.status == 200) {
                        if (res.data.code == 30000) {
                            ElMessage({
                                message: res.data.msg,
                                type: 'warning',
                            })
                            this.addDialogVisible = false
                        }
                        if (res.data.code == 0) {
                            this.addDialogVisible = false
                            ElMessage({
                                message: res.data.msg,
                                type: 'success',
                            })
                            this.getList()

                        }
                    }
                })
            // console.log(this.multipleSelection2)
        },
        search() {
            let _this = this;
            let from = {
                name: this.input,
                page: this.currentPage - 1,
                size: 15,
                sort: "createdAt,asc"
            }
            _this.$http
                .findAllRes(from)
                .then((res) => {
                    console.log(res)
                    _this.diadataList = res.data.result.content
                    _this.total2 = res.data.result.totalElements
                    _this.diadataList.forEach((item, index) => {
                        // console.log(item)
                        item.delStu = false
                    })
                    console.log(this.diadataList)
                    // dataList

                })

        },
    },
    watch: {
        $route(to, from) {
            // console.log(to)
            this.getbreadcrumbName()


            // console.log(from)
        },
    }
}
</script>
<style lang="less" scoped>
.container {
    width: 100%;
    // height: calc(100vh - 60px);
    display: flex;
    flex-wrap: wrap;
    background: white;
    justify-content: center;
    align-items: center;
}

.box {
    width: 97%;
    height: 95%;
    background: white;
}

.header {
    width: 100%;
    // border: 1px red solid;
    height: 80px;
    display: flex;
    align-items: center;

    .box-1 {
        width: 50%;
        height: 100%;
        // background: red;
        // border: 1px red solid;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 20px;
    }

    .box-2 {
        width: 50%;
        height: 100%;
        display: flex;
        // border: 1px red solid;
        align-items: center;
        position: relative;
        justify-content: flex-end;
        margin-right: 20px;

        .el-input {
            width: 40%;
            height: 100%;
        }

        .el-link {
            width: 12%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .el-select {
            width: 13%;
            height: 40px;

            :deep(.el-input__wrapper) {
                height: 30px;
            }
        }

        .backBtn {
            position: absolute;
            right: 1rem;
            // top: 1rem;

        }

    }
}

.orderList-content {
    width: 100%;
    height: 83%;
    display: flex;
    flex-wrap: wrap;
    // border: 1px red solid;
    // justify-content: space-around;
    // flex-direction: column;
    // align-content: space-around;

    // align-items: ;
    // columns: ;
    .card {
        width: 14%;
        height: 26%;
        // background: red;
        // border: 1px red solid;
        display: flex;
        flex-wrap: wrap;
        margin-left: 80px;
        position: relative;

        .el-checkbox {
            position: absolute;
            right: 0;
            top: -13px;
        }

        .property {
            position: absolute;
            left: 0;
            top: 0;
        }

        img {
            width: 100%;
            height: 70%;
            background: red;
        }

        .inf {
            width: 100%;
            height: 30%;
            display: flex;
            flex-wrap: wrap;

            .bookName {
                width: 100%;
                height: 66%;
            }

            span {
                overflow: hidden; //超出的文本隐藏
                display: -webkit-box;
                -webkit-line-clamp: 2; // 超出多少行
                -webkit-box-orient: vertical;

                font-size: 0.7rem;
                // line-height: 100%;
            }

            .createTime {
                width: 100%;
                height: 33%;
                display: flex;

                .time {
                    width: 93%;
                    display: flex;
                    flex-wrap: wrap;
                    // border: 1px red solid;
                    font-size: 0.2px;
                }

                img {
                    width: 5%;
                    cursor: pointer;
                }
            }

        }


    }

    // background: yellow;
}

.el-pagination {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    margin-top: 0;
    // border: 1px red solid;
    // background: red;
}

.Btn {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    // border: 1px red solid;
    cursor: pointer;

    .modify {
        width: 100%;
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .delete {
        width: 100%;
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px rgb(235, 237, 240) solid;
    }

    // background: #000;
}

.max-h-300px {
    max-height: 300px;
}

.overflow-auto {
    overflow: auto;
}

.handle {
    width: 50%;
    // border: 1px red solid;
    display: flex;
    justify-content: center;
    margin: 0 auto;

    .el-link {
        width: 33%;
        // border: 1px red solid;
    }

}

.header-box {
    width: 100%;
    height: 20%;
    // border: 1px red solid;
}

.content-box {
    width: 100%;
    height: 100%;
    overflow: auto;

    .box-1 {
        // border: 1px red solid;
        display: flex;

        .input-box {
            width: 50%;
            display: flex;
            justify-content: center;

            .el-input {
                width: 70%;
            }

        }

        .add-box {
            width: 50%;
            display: flex;
            justify-content: flex-end;

            .el-button {
                margin-right: 1rem;
            }
        }

    }

    // border: 1px red solid;
}

.footer {
    width: 100%;
    height: 20%;
    // border: 1px red solid;
}
</style>
<style>
.el-popover.my-popover {
    width: 20px;
    height: 60px;
    padding: 0;
}

.el-popover.el-popper {
    min-width: 80px;
}

.el-table .cell {
    text-align: center;
    /* border: 1px red solid; */
}

.deldialog {
    width: 30%;
    height: 30%;
    display: flex;
    flex-wrap: wrap;
    /* border: 1px red solid; */
}

.deldialog .el-dialog__body {
    width: 100%;
    height: 30%;
    border-top: 2px #BBBBBB solid;
    text-align: center;
}

.deldialog .el-dialog__footer {
    width: 100%;
    display: flex;
    justify-content: center;
}

.adddialog {
    width: 50%;
    height: 60%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* border: 1px red solid; */
}

.adddialog .el-dialog__header {
    width: 100%;
    height: 5%;
    display: flex;
    flex-wrap: wrap;
    /* border: 1px red solid; */
}

.adddialog .el-dialog__body {
    width: 100%;
    height: 75%;
    padding: 0;
    /* border: 1px red solid; */
}

.adddialog .el-dialog__footer {
    width: 100%;
    height: 20%;
    padding: 0;
}
</style>
  