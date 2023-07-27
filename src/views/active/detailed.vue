<template>
    <div class="active">
      <div class="card_header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/votingcontent' }">投票内容</el-breadcrumb-item>
          <el-breadcrumb-item >投票详细</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 增加部分 -->
      <div class="btn-section">
          <el-button @click="addvote()"  type="primary">新增</el-button>
  
      </div>
      <!-- 图标部分 -->
      <div class="table-section">
          <el-table :data="tableData"  stripe style="width: 100%;">
              <el-table-column prop="id" label="ID" width="100"  align="center">
              </el-table-column>
              <!-- 名称 -->
              <el-table-column prop="name" label="名称"   align="center">
                  <template #default="scope">
                      {{ scope.row.name || '暂无' }}
                  </template>
              </el-table-column>
              <!-- 图片 -->
              <!-- <el-table-column prop="picture" label="图片"  align="center">
                  <template #default="scope">
                      {{ scope.row.picture || '暂无' }}
                  </template>
              </el-table-column> -->

              <!-- 图片地址 -->
              <el-table-column prop="pictureUrl" width="220" label="封面"  align="center">
                  <template #default="scope">
                      <!-- {{ scope.row.pictureUrl || '暂无' }} -->
                      <el-image
                        style="width: 180px; height: 100px"
                        :src="scope.row.pictureUrl"
                        
                        fit="contain"
                    />
                  </template>
              </el-table-column>
            <!-- 数量 -->
              <el-table-column prop="quantity" label="投票数量"  align="center">
                  <template #default="scope">
                      {{ scope.row.quantity || '0' }}
                  </template>
              </el-table-column>

              <!-- <el-table-column prop="totalQuantity" label="已投数量"  align="center">
                  <template #default="scope">
                      {{ scope.row.totalQuantity || '0' }}
                  </template>
              </el-table-column> -->
              <!-- 操作 -->
              <el-table-column  label="操作" width="200" align="center">
                  <template #default="scope">
                      <div class="handle">
                          <!-- <el-link
                              :underline="false"
                              type="primary"
                              @click="Voteddetailed(scope.row)"
                              >详情</el-link
                          > -->
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
      <VotingdetailsPopup
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
  import VotingdetailsPopup from "./components/Voting_details_Popup.vue"
  export default {
      name:'active',
      components:{
        VotingdetailsPopup
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
              showDlgType:'edit',

          }
      },
      methods: {
          //获取数据
          async getData(){
              let _this = this
              let params = {
                  voteId:_this.$route.query.id
              }
              console.log(params);
              const {
                  data:{code},
                  data:{msg},
                  data:{result}
              } = await _this.$http.VoteItemBackFindAllId(params)
              if(code === 0 && result){
                  console.log(result);
                  //const {content=[] , totalElements} = result
                  _this.tableData = result
              }else {
                  ElMessage.error('获取数据失败')
              }
  
             console.log(_this.$http);
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
                  } = await _this.$http.VoteItemBackDelete({id})
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
          addvote(data){
              let _this = this
              _this.dialogVisible = true
              _this.showDlgType = 'add'
            //   console.log(this.$route.query.id);
          },
          //表格操作-详细
          Voteddetailed(data){
              
          }
      },
      mounted() {
          let _this = this
          _this.getData()
          //console.log(this.$route.query.id);
      },
  }
  </script>
  
  <style lang="less" scoped>
  
  .active {
      width: 100%;
      padding: 0 1rem;
      height: calc(100vh - 60px);
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      .c-header{
        padding: 1rem 0;
        :deep(.el-upload){
            border: none;
        }
    }
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
    //   margin: 0.5rem;
    margin-top: 1rem;
      margin-bottom: 1rem;
      width: 100%;
      display: flex;
      justify-content: flex-start;
  }
  
  
  
  </style>
  