<template>
  <div class="container">
    <div class="box">
      <div class="header">
        <div class="box-1">
          <el-breadcrumb separator-icon="ArrowRightBold">
            <el-breadcrumb-item :to="{ path: '/category' }"
              >分类管理</el-breadcrumb-item
            >
            <el-breadcrumb-item
              v-for="(item, index) in breadList"
              @click="toPath(item)"
              >{{ item.name }}</el-breadcrumb-item
            >
            <!-- <el-breadcrumb-item>promotion management</el-breadcrumb-item>
              <el-breadcrumb-item>promotion list</el-breadcrumb-item>
              <el-breadcrumb-item>promotion detail</el-breadcrumb-item> -->
          </el-breadcrumb>
        </div>
        <div class="box-2" v-if="this.delManyStu == false">
          <el-link
            :underline="false"
            type="info"
            @click="delMany"
            v-if="this.hasRes == true"
            >批量操作</el-link
          >
          <!-- :http-request="beforeUploadfile" -->
          <!-- :on-change="handFileChange" -->
          <!-- <el-upload
            v-if="this.hasRes == true || this.dataList.length == 0"
            multiple
            v-model:file-list="fileInf"
            accept="video/*,audio/*"
            action="#"
            :auto-upload="true"
            :http-request="beforeUploadfile"
            :on-success="handleSuccess"
            :on-change="handleUpload"
            class="upload-demo"
          >
            <el-button type="primary">上传资源</el-button>
          </el-upload>
           -->
          <el-button
            class="setCover"
            v-if="this.dataList.length != 0"
            type="primary"
            @click="setCover"
            >一键设置封面</el-button
          >
          <el-upload
            v-if="this.hasRes == true || this.dataList.length == 0"
            multiple
            v-model:file-list="fileInf"
            accept="video/*,audio/*"
            action="#"
            :show-file-list="false"
            :auto-upload="true"
            :http-request="beforeUploadfile"
            :on-change="handleUpload"
            class="upload-file"
            style="margin-right: 1rem"
          >
            <el-button type="primary">上传资源</el-button>
          </el-upload>
          <el-button
            v-if="this.hasRes == true || this.dataList.length == 0"
            type="primary"
            @click="addRes"
          >
            添加资源
          </el-button>
          <el-button
            v-if="this.hasRes == false || this.dataList.length == 0"
            type="primary"
            @click="add"
            >新增分类
          </el-button>
        </div>
        <div class="box-2" v-if="this.delManyStu == true">
          <el-button type="danger" @click="delBtn">删除</el-button>
          <el-button icon="ArrowLeftBold" @click="back">返回</el-button>
        </div>
      </div>
      <div
        class="orderList-content"
        style="justify-content: center; align-items: center"
        v-if="this.dataList.length == 0"
      >
        <el-empty :image-size="200" />
      </div>

      <div class="orderList-content" v-if="this.dataList.length != 0">
        <!-- 这是没有资源时展示的分类列表 -->
        <el-table
          :data="dataList"
          style="width: 100%"
          v-if="this.hasRes == false"
        >
          <el-table-column prop="cover" label="封面">
            <template #default="scope">
              <!-- {{scope.row}} -->
              <el-image
                style="width: 100px; height: 100px"
                fit="cover"
                :preview-teleported="true"
                :preview-src-list="[scope.row.cover]"
                :src="scope.row.cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="分类名称" />
          <el-table-column prop="createdAt" label="创建时间">
            <template #default="scope">
              {{ tools.transitionTime(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="serialNumber" label="排序" />
          <el-table-column prop="shelves" label="是否上架">
            <template #default="scope">
              <el-switch
                v-model="scope.row.shelves"
                @change="putAway(scope.row)"
              />
            </template> </el-table-column
          >>
          <el-table-column prop="address" label="操作">
            <template #default="scope">
              <div class="handle">
                <el-link
                  :underline="false"
                  type="primary"
                  @click="check(scope.row)"
                  >查看</el-link
                >
                <el-link
                  :underline="false"
                  type="primary"
                  @click="modify(scope.row)"
                  >修改</el-link
                >
                <el-link
                  :underline="false"
                  type="danger"
                  @click="del(scope.row)"
                  >删除</el-link
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 这是没有分类时展示的资源列表 -->
        <el-table
          :data="dataList"
          style="width: 100%"
          v-if="this.hasRes == true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="30px"
            v-if="this.delManyStu == true"
          />
          <el-table-column prop="cover" label="资源封面">
            <template #default="scope">
              <!-- {{ scope.row.resources.cover }} -->
              <img
                v-if="scope.row.resources.cover == null"
                style="width: 100px; height: 100px; object-fit: cover"
                src="@/assets/default.png"
                alt=""
              />
              <el-image
                v-else
                style="width: 100px; height: 100px"
                fit="cover"
                :preview-teleported="true"
                :preview-src-list="[scope.row.resources.cover]"
                :src="scope.row.resources.cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="resources.name" label="资源名称" />
          <el-table-column prop="createdAt" label="创建时间">
            <template #default="scope">
              {{ tools.transitionTime(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <!-- type="index"
            :index="indexMethod" -->
          <el-table-column porp="serialNumber" label="排序" width="100">
            <template #default="scope">
              {{ scope.row.serialNumber }}
            </template>
          </el-table-column>
          <el-table-column prop="resourcesType" label="类型">
            <template #default="scope">
              <!-- <el-switch v-model="scope.row.resourceType" /> -->
              {{
                scope.row.resources.resourcesType == "VIDEO" ? "视频" : "音频"
              }}
            </template> </el-table-column
          >>
          <el-table-column prop="address" label="操作">
            <template #default="scope">
              <div class="handle">
                <el-link
                  :underline="false"
                  type="primary"
                  @click="modifySort(scope.row)"
                  >修改排序</el-link
                >
                <el-link
                  :underline="false"
                  type="danger"
                  @click="del(scope.row)"
                  >删除</el-link
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="this.dataList.length != 0"
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 修改/添加分级弹出层 -->
    <el-dialog
      v-if="centerDialogVisible"
      class="modifydialog"
      v-model="centerDialogVisible"
      :title="dialogStu == 'add' ? '新增分类' : '分类信息编辑'"
      width="800px"
      :append-to-body="true"
      @close="closeDialog"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="content">
          <div class="title-box">
            <el-form-item label="分类名称：" prop="input">
              <el-input
                v-model="ruleForm.input"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </div>
          <div class="uplpad-box">
            <el-form-item label="分类封面：" prop="image" class="imgavatar">
              <el-upload
                action="#"
                accept="image/*"
                :auto-upload="true"
                :show-file-list="false"
                :http-request="beforeUpload"
                :on-remove="handleRemoveImage"
              >
                <img v-if="showCover" :src="showCover" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item
              class="showType"
              v-if="dialogStu == 'modify'"
              label="展示类型："
              prop="selval"
            >
              <el-select
                v-model="selval"
                placeholder="Select"
                size="large"
                @change="atType(selval)"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="this.dialogStu == 'modify'"
              class="sort"
              label="当前排序："
              prop="sortNumber"
            >
              <el-input
                oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                v-model="ruleForm.sortNumber"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </div>
          <el-dialog
            class="imgdialog"
            v-model="dialogVisible"
            @close="closeDialog"
          >
            <el-image
              :src="dialogImageUrl"
              :file-list="fileList"
              alt="Preview Image"
            />
          </el-dialog>
        </div>
        <div class="footer">
          <el-button type="primary" @click="confirm('ruleForm')">
            确认
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 资源 -->
    <!-- 修改排序弹出层 -->
    <el-dialog
      class="modifySortdialog"
      v-model="modifySortDialogVisible"
      width="800px"
      :append-to-body="true"
      @close="closeDialog"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="card_content">
          <div class="title-box">
            <el-form-item class="sort" label="当前排序：" prop="name">
              <el-input
                oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                v-model="sortNumber"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </div>
          <div class="uplpad-box">
            <el-form-item label="分类封面：" prop="showCover" class="imgavatar">
              <el-image
                :src="avatarImage"
                class="avatar"
                fit="cover"
                :preview-teleported="true"
                :preview-src-list="[avatarImage]"
              />
            </el-form-item>
            <el-form-item label="分类名称：" prop="name">
              <el-input
                v-model="input"
                placeholder="请输入内容"
                disabled
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="footer">
          <el-button type="primary" @click="sureModify"> 确认 </el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 添加资源弹出层 -->
    <el-dialog
      class="adddialog"
      v-model="addDialogVisible"
      width="50%"
      @close="closeAddDialog"
    >
      <template #header>
        <div class="header-box">添加资源</div>
      </template>
      <div class="content-box">
        <div class="box-1">
          <div class="input-box">
            <el-input
              v-model="searchName"
              placeholder="请输入你需要的资源名称"
              @keyup.enter.native="search"
            />
            <el-button type="primary" @click="search" style="margin-left: 1rem"
              >查询</el-button
            >
          </div>
          <div class="add-box">
            <el-button
              type="primary"
              @click="addCatAllRes"
              :disabled="this.multipleSelection2 == ''"
              >添加已选择</el-button
            >
          </div>
        </div>
        <div class="box-2">
          <el-table
            ref="multipleTableRef"
            :data="diadataList"
            style="width: 100%"
            @selection-change="handleSelectionChange2"
          >
            <el-table-column
              type="selection"
              width="55"
              :selectable="checkSelectable"
            >
            </el-table-column>
            <el-table-column label="资源名称">
              <template #default="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="封面">
              <template #default="scope">
                <!-- <image
                  
                  style="width: 50px; height: 50px"
                  src="@/assets/default.png"
                /> -->
                <img
                  v-if="scope.row.cover == null"
                  style="width: 50px; height: 50px; object-fit: cover"
                  src="@/assets/default.png"
                  alt=""
                />
                <el-image
                  v-else
                  style="width: 50px; height: 50px"
                  :src="scope.row.cover"
                />
              </template>
            </el-table-column>
            <el-table-column property="createdAt" label="创建时间">
              <template #default="scope">
                {{ tools.transitionTime(scope.row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column property="address" label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  @click="addCatRes(scope)"
                  :disabled="scope.row.hasExist"
                >
                  {{
                    scope.row.hasExist == false ? "添加" : "已添加"
                  }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <div class="footer-page" v-if="this.searchflag == false">
          <el-pagination
            v-model:currentPage="currentPage2"
            v-model:page-size="pageSize2"
            layout="total, prev, pager, next, jumper"
            :total="total2"
            :background="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange2"
          />
        </div>
        <div class="footer-page" v-else>
          <el-pagination
            v-model:currentPage="currentPage3"
            v-model:page-size="pageSize3"
            layout="total, prev, pager, next, jumper"
            :total="total3"
            :background="true"
            @current-change="handleCurrentChange3"
          />
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import tools from "@/utils/tools";
import { uploadMultiple } from "@/utils/uploadVideo";
import { ArrowRight, ArrowRightBold } from "@element-plus/icons-vue";
import { UploadFile, ElMessage, ElMessageBox } from "element-plus";
// import { pid } from 'process';
import { ElLoading } from "element-plus";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tools,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      currentPage2: 1,
      pageSize2: 10,
      total2: 0,
      currentPage3: 1,
      pageSize3: 10,
      total3: 0,
      value1: false,
      centerDialogVisible: false,
      delDialogVisible: false,
      dataList: [],
      diadataList: [], //资源列表
      input: "",
      sortNumber: "", //排序
      avatarImage: "", //排序图片
      modifyId: "",
      showCover: "",
      dialogStu: "",
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      addDialogVisible: false, //添加资源对话框状态
      modifySortDialogVisible: false, //修改排序对话框状态
      breadcrumbName: "",
      Id: "", //第一级传过来的id
      delId: "", //删除资源或分级的id
      addId: "", //添加资源或分级的id
      pId: "", //请求时从面包屑获取的id
      cover: "",
      url: "",
      fileList: [],
      fileArray: [], //文件多选上传时的数组
      fileInf: [],
      hasRes: false,
      breadList: [
        {
          name: "",
          id: 0,
        },
      ],
      uploadNum: 0,
      delManyStu: false,
      multipleSelection: [], //这是资源删除多选存id的数组
      multipleSelection2: [], //这是资源添加多选存id的数组
      userInfo: {},
      ruleForm: {
        name: "",
        input: "",
        image: "",
        sortNumber: "",
        selval: "",
      },
      rules: {
        input: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        image: [
          {
            required: true,
            message: "请上传封面",
            trigger: "blur",
          },
        ],
        sortNumber: [
          { required: true, message: "请输入分类排序", trigger: "blur" },
        ],
        selval: [
          { required: true, message: "请输入分类排序", trigger: "blur" },
        ],
      },
      count: 0, //上传资源计数
      searchflag: false, //搜索状态
      searchName: "",
      addIdList: [],
      shelves: "",
      options: [
        {
          value: "IMAGE_TEXT_EXHIBITION",
          label: "图文展示",
        },
        {
          value: "TABULATION_EXHIBITION",
          label: "列表展示",
        },
      ],
      modifydata: {},
      selval: "",
      modifyType: "",
      addIdNameList: [],
      loading: {},
      uploadingNum: 1,
      times: false,
    };
  },
  created() {
    // // console.log('created', this.$router.currentRoute.fullPath)
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  },
  mounted() {
    this.getbreadcrumbName();
    this.getList();

    // if(!a) {
    //     this.breadcrumbName = this.$route.query.data
    //     // console.log(this.$route.query.data)
    //     this.$route.params.id
    // }
  },
  computed: {
    ...mapGetters(["uploadProgress"]),
  },
  methods: {
    getbreadcrumbName() {
      let a = JSON.parse(sessionStorage.getItem("breadList"));
      this.breadcrumbName = this.$route.query.data;
      this.Id = this.$route.query.id;
      if (a) {
        // this.breadList[0].name = a.name
        // this.breadList[0].id = a.id
        // // console.log(a)
        // // console.log('123', this.breadList)
        this.breadList = a;
      } else {
        this.breadList[0].name = this.breadcrumbName;
        this.breadList[0].id = this.Id;
      }

      // // console.log(this.breadList);
      // // console.log('parentId', this.parentId)
    },
    handleSizeChange() {},
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
      // // console.log(this.hasRes);
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.getDiaList();
      this.getList2();
    },
    handleCurrentChange3(val) {
      this.currentPage3 = val;
      let _this = this;
      this.searchflag = true;
      let from = {
        name: this.searchName,
        page: this.currentPage3 - 1,
        size: 10,
        sort: "createdAt,desc",
      };
      _this.$http.findAllRes(from).then((res) => {
        // // console.log(res);
        _this.diadataList = res.data.result.content;
        _this.total3 = res.data.result.totalElements;
        _this.diadataList.forEach((item, index) => {
          // // console.log(item)
          item.delStu = false;
          item.hasExist = false;
          this.addIdList.forEach((item2, index2) => {
            if (item2.id == item.id) {
              item.hasExist = true;
            }
          });
        });
        // // console.log(this.diadataList);
        // dataList
      });
      if (this.addIdList.length != 0) {
        this.addIdNameList = [];
      }
      //   this.getDiaList();
      //   this.getList2();
    },

    check(val) {
      // // console.log(val);
      this.breadList.push({
        name: val.name,
        id: val.id,
      });
      sessionStorage.setItem("breadList", JSON.stringify(this.breadList));
      let _this = this;
      let from = {
        page: this.currentPage - 1,
        parentId: val.id,
        size: 10,
        sort: "serialNumber,asc",
      };
      _this.$http.getCategory(from).then((res) => {
        if (res.data.result.content.length == 0) {
          let _this = this;
          let from = {
            classificationId: val.id,
            page: 0,
            size: 10,
            sort: "serialNumber,asc",
          };
          // // console.log(from);
          _this.$http
            .findByResources(from)
            .then((res) => {
              if (res.data.result.content.length == 0) {
                this.dataList = [];
              } else {
                this.hasRes = true;
                // // console.log(res);
                this.dataList = res.data.result.content;
                this.total = res.data.result.totalElements;
                this.dataList.forEach((item, index) => {
                  item.delStu = false;
                });
              }
            })
            .catch((err) => {
              // // console.log(err);
            });
        } else {
          this.hasRes = false;
          // // console.log(res);
          this.dataList = res.data.result.content;
          this.total = res.data.result.totalElements;
        }
      });
    },
    // 查询分类
    getList() {
      // 如果储存的面包屑存在，就读取最后一组的数据查询
      let a = JSON.parse(sessionStorage.getItem("breadList"));
      if (a) {
        if (typeof a == "object") {
          this.pId = a.id;
        } else {
          this.pId = a[a.length - 1].id;
        }
        this.pId = a[a.length - 1].id;
        // // console.log();
        // // console.log(this.pId);
        let _this = this;
        let from = {
          page: this.currentPage - 1,
          parentId: this.pId,
          size: 10,
          sort: "serialNumber,asc",
        };
        // // console.log(from, "from");
        _this.$http.getCategory(from).then((res) => {
          if (res.data.result.content.length == 0) {
            this.getList2();
          } else {
            this.hasRes = false;
            // // console.log(res);
            this.dataList = res.data.result.content;
            this.total = res.data.result.totalElements;
            this.dataList.forEach((item, index) => {
              // // console.log(item)
              item.delStu = false;
            });
          }
        });
        // // console.log(this.dataList);
      } else {
        let _this = this;
        let from = {
          page: this.currentPage - 1,
          parentId: this.Id,
          size: 10,
          sort: "serialNumber,asc",
        };

        _this.$http.getCategory(from).then((res) => {
          if (res.data.result.content.length == 0) {
            this.getList2();
          } else {
            this.hasRes = false;
            // // console.log(res);
            this.dataList = res.data.result.content;
            this.total = res.data.result.totalElements;
            this.dataList.forEach((item, index) => {
              // // console.log(item)
              item.delStu = false;
            });
          }
        });
        // // console.log(this.dataList);
      }
    },
    // 查询资源
    getList2() {
      if (JSON.parse(sessionStorage.getItem("breadList"))) {
        let a = JSON.parse(sessionStorage.getItem("breadList"));
        let _this = this;
        let from = {
          classificationId: a[a.length - 1].id || a.id,
          page: this.currentPage - 1,
          size: 10,
          sort: "serialNumber,asc",
        };
        // // console.log(from);
        _this.$http
          .findByResources(from)
          .then((res) => {
            if (res.data.result.content.length == 0) {
              this.dataList = [];
              this.hasRes = false;
            } else {
              this.hasRes = true;
              // // console.log(res);
              this.dataList = res.data.result.content;
              this.total = res.data.result.totalElements;
              this.dataList.forEach((item, index) => {
                item.delStu = false;
              });
            }
          })
          .catch((err) => {
            // // console.log(err);
          });
      } else {
        let _this = this;
        let from = {
          classificationId: _this.Id,
          page: this.currentPage - 1,
          size: 10,
          sort: "serialNumber,asc",
        };
        // // console.log(from);
        _this.$http
          .findByResources(from)
          .then((res) => {
            if (res.data.result.content.length == 0) {
              this.dataList = [];
            } else {
              this.hasRes = true;
              // // console.log(res);
              this.dataList = res.data.result.content;
              this.total = res.data.result.totalElements;
              this.dataList.forEach((item, index) => {
                item.delStu = false;
              });
            }
          })
          .catch((err) => {
            // // console.log(err);
          });
      }
    },
    //查询资源列表
    getDiaList() {
      let _this = this;
      let a = JSON.parse(sessionStorage.getItem("breadList"));
      if (a) {
        if (a.id) {
          this.pId = a.id;
        } else {
          this.pId = a[a.length - 1].id;
        }
      }
      if (!a) {
        this.pId = this.Id;
      }
      let from = {
        classificationId: _this.pId,
        page: this.currentPage2 - 1,
        size: 10,
        sort: "createdAt,desc",
      };
      // // console.log(from)
      _this.$http.findAllRes(from).then((res) => {
        const resourceList = res.data.result.content;
        // // console.log('所有资源', resourceList)
        // // console.log('已有资源', _this.dataList)
        // let filterArray = []
        _this.diadataList = res.data.result.content; //这是所有资源(这一页)
        const haveIds = _this.dataList.map((item) => item.resources.id);
        // // console.log("haveIds", haveIds)
        resourceList.forEach((item) => {
          item.hasExist = false;
        });
        // console.log("diadataList", this.diadataList);
        // this.diadataList = filterArray
        this.total2 = res.data.result.totalElements;
        this.diadataList.forEach((item, index) => {
          if (this.addIdList.includes(item.id)) {
            item.hasExist = true;
          }
        });
      });
    },
    //资源对话框里面的搜索功能
    search() {
      let _this = this;
      this.searchflag = true;
      let from = {
        name: this.searchName,
        page: this.currentPage3 - 1,
        size: 10,
        sort: "createdAt,desc",
      };
      _this.$http.findAllRes(from).then((res) => {
        // // console.log(res);
        _this.diadataList = res.data.result.content;
        _this.total3 = res.data.result.totalElements;
        // console.log(_this.diadataList);
        _this.diadataList.forEach((item, index) => {
          item.hasExist = false;
          // console.log(item.hasExist);
          this.addIdList.forEach((item2, index2) => {
            if (item2 == item.id) {
              item.hasExist = true;
            }
          });
        });

        // console.log(this.diadataList);
        // dataList
      });
    },
    //添加资源操作，在这级分类下添加资源
    addCatRes(val) {
      // console.log("val", val.row);
      // return;
      let a = JSON.parse(sessionStorage.getItem("breadList"));
      if (a) {
        if (a.id) {
          this.pId = a.id;
        } else {
          this.pId = a[a.length - 1].id;
        }
      } else {
        this.pid = this.Id;
      }
      let _this = this;
      let from = {
        classificationId: this.pId,
        resourcesIds: [],
      };
      // // console.log(_this.multipleSelection2);
      let addIdNameList = [];
      if (_this.multipleSelection2.length == 0) {
        from.resourcesIds.push(val.row.id);
        // addIdNameList.push(val.row.name);
        this.addIdList.push(val.row.id);
      } else {
        this.multipleSelection2.forEach((item, index) => {
          from.resourcesIds.push(item.id);
          this.addIdList.push(item.id);
          // addIdNameList.push(val.row.name);
        });
      }
      // console.log(addIdNameList);
      // return;
      // // console.log(this.addIdList);
      _this.$http.addResources(from).then((res) => {
        // // console.log(res);
        if (res.status == 200) {
          if (res.data.code == 30000) {
            ElMessage({
              message: res.data.msg,
              type: "warning",
            });
          }
          if (res.data.code == 0) {
            ElMessage({
              message: res.data.msg,
              type: "success",
            });
            // this.addIdList = []

            this.diadataList.forEach((item, index) => {
              // if (item.id)
              if (this.addIdList.includes(item.id)) {
                item.hasExist = true;
              }
            });
            let a = JSON.parse(sessionStorage.getItem("breadList"));
            if (a) {
              let tempText = "";
              let b = [];
              a.forEach((item, index) => {
                // console.log(item.name);
                b.push(item.name);
              });
              tempText = b.join(">");
              this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    "管理员" +
                    this.userInfo.name +
                    "在分类" +
                    a[a.length - 1].name +
                    "(" +
                    tempText +
                    ")" +
                    "中添加了资源" +
                    val.row.name,
                })
                .then((res) => {
                  this.toggleSelection();
                });
            } else {
              this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    "管理员" +
                    this.userInfo.name +
                    "在分类" +
                    this.breadcrumbName +
                    "中添加了资源" +
                    val.row.name,
                })
                .then((res) => {
                  this.toggleSelection();
                });
            }

            this.getList();
          }
        }
      });
      // // console.log(this.multipleSelection2);
    },
    addCatAllRes() {
      // // console.log("val", val.row);
      // return;
      let a = JSON.parse(sessionStorage.getItem("breadList"));
      if (a) {
        if (a.id) {
          this.pId = a.id;
        } else {
          this.pId = a[a.length - 1].id;
        }
      } else {
        this.pid = this.Id;
      }
      let _this = this;
      let from = {
        classificationId: this.pId,
        resourcesIds: [],
      };
      // // console.log(_this.multipleSelection2);
      // let addIdNameList = [];
      if (_this.multipleSelection2.length == 0) {
        from.resourcesIds.push(val.row.id);
        // addIdNameList.push(val.row.name);
        this.addIdList.push(val.row.id);
      } else {
        this.multipleSelection2.forEach((item, index) => {
          from.resourcesIds.push(item.id);
          this.addIdList.push(item.id);
          // addIdNameList.push(val.row.name);
        });
      }
      // console.log(this.addIdNameList);
      // return;
      // // console.log(this.addIdList);
      _this.$http.addResources(from).then((res) => {
        // // console.log(res);
        if (res.status == 200) {
          if (res.data.code == 30000) {
            ElMessage({
              message: res.data.msg,
              type: "warning",
            });
          }
          if (res.data.code == 0) {
            ElMessage({
              message: res.data.msg,
              type: "success",
            });
            // this.addIdList = []

            this.diadataList.forEach((item, index) => {
              if (this.addIdList.includes(item.id)) {
                item.hasExist = true;
              }
            });
            let a = JSON.parse(sessionStorage.getItem("breadList"));
            if (a) {
              let tempText = "";
              let b = [];
              a.forEach((item, index) => {
                // console.log(item.name);
                b.push(item.name);
              });
              tempText = b.join(">");
              let resText = this.addIdNameList.join("、");
              // // console.log(tempText);
              this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    "管理员" +
                    this.userInfo.name +
                    "在分类" +
                    a[a.length - 1].name +
                    "(" +
                    tempText +
                    a[a.length - 1].name +
                    ")" +
                    "中上传了资源" +
                    "(" +
                    resText +
                    ")",
                })
                .then((res) => {});
            } else {
              let resText = this.addIdNameList.join("、");
              this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    "管理员" +
                    this.userInfo.name +
                    "在分类" +
                    this.breadcrumbName +
                    "中上传了资源" +
                    "(" +
                    resText +
                    ")",
                })
                .then((res) => {});
            }
            this.toggleSelection();
            this.getList();
          }
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          // TODO: improvement typing when refactor table
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          this.$refs.multipleTableRef.toggleRowSelection(row, undefined);
        });
      } else {
        this.$refs.multipleTableRef.clearSelection();
      }
    },
    //新增分类点击事件
    add() {
      this.dialogStu = "add";
      this.centerDialogVisible = true;
      this.ruleForm.input = "";
      // this.cover = ""
      // this.fileList[0].url = ""
    },
    //修改分类点击事件
    modify(val) {
      this.modifydata = val;
      this.dialogStu = "modify";
      this.centerDialogVisible = true;
      this.ruleForm.input = val.name;
      this.modifyId = val.id;
      this.ruleForm.image = val.cover;
      this.ruleForm.sortNumber = val.serialNumber;
      this.sortNumber = val.serialNumber;
      this.fileList.push({
        name: val.name,
        url: val.cover,
      });
      this.showCover = val.cover;
      if (val.exhibitionType == "IMAGE_TEXT_EXHIBITION") {
        this.selval = "图文展示";
        this.ruleForm.selval = "图文展示";
      }
      if (val.exhibitionType == "TABULATION_EXHIBITION") {
        this.selval = "列表展示";
        this.ruleForm.selval = "列表展示";
      } else {
        this.selval = "图文展示";
        this.ruleForm.selval = "图文展示";
      }
      // console.log(val.exhibitionType);
      // console.log(this.ruleForm.selval);
      // // console.log(this.fileList);
    },
    //修改排序点击事件
    modifySort(val) {
      // console.log(val);
      this.modifySortDialogVisible = true;
      this.sortNumber = val.serialNumber;
      this.avatarImage = val.resources.cover;
      this.ruleForm.input = val.resources.name;
      this.modifyId = val.id;
      this.shelves = val.shelves;
    },
    sureModify() {
      let from = {
        id: this.modifyId,
        serialNumber: +this.sortNumber,
        // shelves: this.shelves
      };
      // console.log(from);
      // updateCategoryOrder
      this.$http.updateCategoryOrder(from).then((res) => {
        // console.log(res);
        if (res.data.code == 0) {
          ElMessage({
            message: res.data.msg,
            type: "success",
          });
          let a = JSON.parse(sessionStorage.getItem("breadList"));
          if (a) {
            let tempText = "";
            let b = [];
            a.forEach((item, index) => {
              // console.log(item.name);
              b.push(item.name);
            });
            tempText = b.join(">");
            this.$http
              .operateLogSave({
                operateLogType: "ADMIN_OPT",
                detail:
                  "管理员" +
                  this.userInfo.name +
                  "将分类" +
                  a[a.length - 1].name +
                  "(" +
                  tempText +
                  ">" +
                  this.ruleForm.input +
                  ")" +
                  "的排序修改为" +
                  this.sortNumber,
              })
              .then((res) => {
                // // console.log(res)
              });
          } else {
            this.$http
              .operateLogSave({
                operateLogType: "ADMIN_OPT",
                detail:
                  "管理员" +
                  this.userInfo.name +
                  "将分类" +
                  this.breadcrumbName +
                  "(" +
                  this.breadcrumbName +
                  ">" +
                  ")" +
                  "的排序修改为" +
                  this.sortNumber,
              })
              .then((res) => {
                // // console.log(res)
              });
          }
          this.modifySortDialogVisible = false;
          this.getList();
        } else {
          ElMessage({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    //删除点击事件
    del(val) {
      let _this = this;
      // console.log(val);
      // console.log(this.delId);
      // return
      //如果有资源
      if (this.hasRes == true) {
        this.delId = val.resources.id;
        _this
          .$confirm("是否删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            let a = JSON.parse(sessionStorage.getItem("breadList"));
            if (a) {
              if (a.id) {
                this.pId = a.id;
              } else {
                this.pId = a[a.length - 1].id;
              }
            } else {
              this.pId = this.Id;
            }
            let from = {
              classificationId: this.pId,
              resourcesIds: [],
            };
            from.resourcesIds.push(this.delId);
            let _this = this;
            _this.$http.batchDelete(from).then((res) => {
              // console.log(res);
              if (res.status == 200) {
                if (res.data.code == 30000) {
                  ElMessage({
                    message: res.data.msg,
                    type: "warning",
                  });
                  this.delDialogVisible = false;
                }
                if (res.data.code == 0) {
                  ElMessage({
                    message: res.data.msg,
                    type: "success",
                  });
                  this.getList();
                  let a = JSON.parse(sessionStorage.getItem("breadList"));
                  if (a) {
                    let tempText = "";
                    let b = [];
                    a.forEach((item, index) => {
                      // console.log(item.name);
                      b.push(item.name);
                    });
                    tempText = b.join(">");
                    this.$http
                      .operateLogSave({
                        operateLogType: "ADMIN_OPT",
                        detail:
                          "管理员" +
                          this.userInfo.name +
                          "在分类" +
                          a[a.length - 1].name +
                          "(" +
                          tempText +
                          ")" +
                          "移除了资源" +
                          val.resources.name,
                      })
                      .then((res) => {
                        // // console.log(res)
                      });
                  } else {
                    this.$http
                      .operateLogSave({
                        operateLogType: "ADMIN_OPT",
                        detail:
                          "管理员" +
                          this.userInfo.name +
                          "在分类" +
                          this.breadcrumbName +
                          "移除了资源" +
                          val.resources.name,
                      })
                      .then((res) => {
                        // // console.log(res)
                      });
                  }

                  this.delDialogVisible = false;
                }
                if (res.data.code == 30001) {
                  ElMessage({
                    message: res.data.msg,
                    type: "warning",
                  });
                  this.getList();
                  this.delDialogVisible = false;
                }
              }
            });
          });
      } else {
        this.delId = val.id;
        let from = {
          id: this.delId,
        };
        _this
          .$confirm("是否删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            _this.$http.deleteCategory(from).then((res) => {
              if (res.data.code === 0) {
                _this.$message({
                  type: "success",
                  message: "删除成功",
                });
                let a = JSON.parse(sessionStorage.getItem("breadList"));
                if (a) {
                  let tempText = "";
                  let b = [];
                  a.forEach((item, index) => {
                    // console.log(item.name);
                    b.push(item.name);
                  });
                  tempText = b.join(">");
                  _this.$http
                    .operateLogSave({
                      operateLogType: "ADMIN_OPT",
                      detail:
                        "管理员" +
                        _this.userInfo.name +
                        "在分类" +
                        a[a.length - 1].name +
                        "(" +
                        tempText +
                        a[a.length - 1].name +
                        ")" +
                        "中删除了分类" +
                        val.name,
                    })
                    .then(() => {
                      this.getList();
                    });
                } else {
                  _this.$http
                    .operateLogSave({
                      operateLogType: "ADMIN_OPT",
                      detail:
                        "管理员" +
                        _this.userInfo.name +
                        "在分类" +
                        this.breadcrumbName +
                        "(" +
                        this.breadcrumbName +
                        ">" +
                        val.name +
                        ")" +
                        "中删除了分类" +
                        val.name,
                    })
                    .then(() => {
                      this.getList();
                    });
                }
              } else {
                _this.$message({
                  message: res.data.msg,
                  type: "error",
                });
              }
            });
          });
      }

      // this.delDialogVisible = true
    },
    //移除封面点击事件
    handleRemove(file) {
      // console.log(file);
    },
    handleRemoveImage(uploadFile, uploadFiles) {
      // console.log("handleRemoveImage", uploadFile, uploadFiles);
      this.showCover = "";
      // this.fileList.image = ''
    },
    //查看封面点击事件
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //下载封面点击事件
    handleDownload(file) {
      // console.log(file);
    },
    beforeUpload(file) {
      let _this = this;
      // console.log("beforeUpload");
      uploadMultiple(file, (res) => {
        this.cover = res.src;
        this.url = res.url;
        this.showCover = res.url;
        this.ruleForm.image = res.url;
        loading.close();
      });
      if (this.dialogStu == "add") {
        this.fileList.push({
          naem: this.cover,
          url: this.url,
        });
        this.ruleForm.image = this.url;
      }
    },
    handleSuccess(res, file, fileList) {
      //   this.$message.success("文件上传成功");
      // console.log(res);
    },
    handleUpload(file, files) {
      var upload_img = document.getElementsByClassName("upload-file");
      if (upload_img && upload_img.length > 0) {
        var upload = upload_img[0].getElementsByTagName("input");
        if (
          upload &&
          upload.length > 0 &&
          upload[0].files &&
          upload[0].files.length > 0
        ) {
          this.uploadNum = upload[0].files.length;
          setTimeout(() => {
            this.test();
          }, 1000);
        }
      }
    },
    upload(file) {
      let _this = this;
      let fileType = tools.fileType(file.file.name);
      if (fileType == "audio") {
        fileType = "AUDIO";
      }
      if (fileType == "video") {
        fileType = "VIDEO";
      }
      console.log("upload");
      // return
      // console.log("文件", file);
      return new Promise((resolve, reject) => {
        // console.log("这没走");
        uploadMultiple(file, (res) => {
          resolve(res);
          const src = res.src;
          let from = {
            name: file.file.name,
            resourcesType: fileType,
            url: src,
          };
          _this.$http.saveRes(from).then((res) => {
            // console.log("123");
            // console.log(res);
            if (res.status == 200) {
              if (res.data.code == 30000) {
                ElMessage({
                  message: res.data.msg,
                  type: "warning",
                });
              }
              if (res.data.code == 0) {
                let a = JSON.parse(sessionStorage.getItem("breadList"));
                if (a) {
                  if (a.id) {
                    this.pId = a.id;
                  } else {
                    this.pId = a[a.length - 1].id;
                  }
                }
                if (!a) {
                  this.pId = this.Id;
                }
                let list = {
                  classificationId: this.pId,
                  resourcesIds: [res.data.result.id],
                };
                _this.$http.addResources(list).then((res) => {
                  // console.log("we");
                  // console.log("ews", res);
                  if (res.status == 200) {
                    if (res.data.code == 30000) {
                      ElMessage({
                        message: res.data.msg,
                        type: "warning",
                      });
                    }
                    if (res.data.code == 0) {
                      //   // console.log("uploadNum", this.uploadNum);
                      console.log("count", this.count);

                      let a = JSON.parse(sessionStorage.getItem("breadList"));
                      if (a) {
                        let tempText = "";
                        let b = [];
                        a.forEach((item, index) => {
                          // console.log(item.name);
                          b.push(item.name);
                        });
                        tempText = b.join(">");
                        this.$http
                          .operateLogSave({
                            operateLogType: "ADMIN_OPT",
                            detail:
                              "管理员" +
                              this.userInfo.name +
                              "在分类" +
                              a[a.length - 1].name +
                              "(" +
                              tempText +
                              ">" +
                              ")" +
                              // +
                              "上传了资源" +
                              file.file.name,
                          })
                          .then((res) => {});
                      } else {
                        this.$http
                          .operateLogSave({
                            operateLogType: "ADMIN_OPT",
                            detail:
                              "管理员" +
                              this.userInfo.name +
                              "在分类" +
                              this.breadcrumbName +
                              "上传了资源" +
                              file.file.name,
                          })
                          .then((res) => {});
                      }

                      this.getList();
                    }
                  }
                });
              }
            }
          });
        });
      });
    },
    async test() {
      let _this = this;
      _this.count = 0;
      // console.log("asasasasasa")
      // return
      this.loading = ElLoading.service({
        lock: true,
        text: "正在上传...",
        background: "rgba(0, 0, 0, 0.7)",
      });

      // console.log("fileArray", _this.fileArray);
      // console.log("count", this.count);
      for (let i = 0; i < _this.fileArray.length; ) {
        let res = await _this.upload(_this.fileArray[i]);
        // console.log("res", res);
        i++;
        this.count = i;
      }
      ElMessage({
          message: "上传成功",
          type: "success",
        });
      _this.fileArray = [];
    },
    async beforeUploadfile(file) {
      this.fileArray.push(file);
      // console.log("121312312");
    },
    toPath(val) {
      // console.log(val);
      let a = JSON.parse(sessionStorage.getItem("breadList"));
      let e = a.findIndex((item, index) => {
        return item.id === val.id && item.name === val.name;
      });
      // console.log(e);
      if (e == 0) {
        // console.log(a);
        // console.log(this.breadList);
        let tempArray = [];
        tempArray.push({
          id: a[0].id,
          name: a[0].name,
        });
        // console.log(tempArray);
        this.breadList = tempArray;
        // console.log(this.breadList);
        sessionStorage.setItem("breadList", JSON.stringify(tempArray));
      } else {
        let b = a.slice(0, e + 1);
        // console.log(b);
        sessionStorage.setItem("breadList", JSON.stringify(b));
      }

      location.reload();
    },

    confirm(formName) {
      // console.log(this.hasRes);

      if (this.hasRes == false) {
        this.$refs[formName].validate((valid) => {
          if (this.dialogStu == "modify") {
            if (
              this.ruleForm.input == "" ||
              this.fileList.length == 0 ||
              this.ruleForm.sortNumber == ""
            ) {
              return;
            }
            if (this.ruleForm.selval == "图文展示") {
              this.modifyType = "IMAGE_TEXT_EXHIBITION";
            } else {
              this.modifyType = "TABULATION_EXHIBITION";
            }

            let from = {
              exhibitionType: this.modifyType,
              cover: this.cover,
              name: this.ruleForm.input,
              id: this.modifyId,
              serialNumber: this.ruleForm.sortNumber,
              shelves: this.shelves,
            };
            // console.log(from);
            // return;
            let _this = this;
            _this.$http.updateCategory(from).then((res) => {
              // console.log(res);
              if (res.status == 200) {
                if (res.data.code == 30000) {
                  ElMessage({
                    message: res.data.msg,
                    type: "warning",
                  });
                  this.centerDialogVisible = false;
                }
                if (res.data.code == 0) {
                  ElMessage({
                    message: res.data.msg,
                    type: "success",
                  });
                  this.cover = "";
                  this.url = "";
                  this.ruleForm.image = "";
                  this.getList();
                  let a = JSON.parse(sessionStorage.getItem("breadList"));
                  if (a) {
                    let tempText = "";
                    let b = [];
                    a.forEach((item, index) => {
                      // console.log(item.name);
                      b.push(item.name);
                    });
                    tempText = b.join(">");
                    if (from.exhibitionType != this.modifydata.exhibitionType) {
                      let x = "";
                      if (this.modifyType == "IMAGE_TEXT_EXHIBITION") {
                        x = "图文展示";
                      } else {
                        x = "列表展示";
                      }
                      this.$http
                        .operateLogSave({
                          operateLogType: "ADMIN_OPT",
                          detail:
                            "管理员" +
                            this.userInfo.name +
                            "将分类" +
                            this.ruleForm.input +
                            "的展示类型修改为" +
                            x +
                            "(" +
                            tempText +
                            ">" +
                            this.ruleForm.input +
                            ")",
                        })
                        .then((res) => {
                          // // console.log(res)
                          // this.closeDialog();
                          // this.centerDialogVisible = false;
                        });
                    }
                    if (this.ruleForm.input != this.modifydata.name) {
                      this.$http
                        .operateLogSave({
                          operateLogType: "ADMIN_OPT",
                          detail:
                            "管理员" +
                            this.userInfo.name +
                            "将分类" +
                            this.modifydata.name +
                            "的名称修改为" +
                            this.ruleForm.input +
                            "(" +
                            tempText +
                            ">" +
                            this.ruleForm.input +
                            ")",
                        })
                        .then((res) => {});
                    }
                    if (this.showCover != this.modifydata.cover) {
                      this.$http
                        .operateLogSave({
                          operateLogType: "ADMIN_OPT",
                          detail:
                            "管理员" +
                            this.userInfo.name +
                            "修改了分类" +
                            this.ruleForm.input +
                            "的封面" +
                            "(" +
                            tempText +
                            ">" +
                            this.ruleForm.input +
                            ")",
                        })
                        .then((res) => {});
                    }
                    if (
                      this.ruleForm.sortNumber != this.modifydata.serialNumber
                    ) {
                      this.$http
                        .operateLogSave({
                          operateLogType: "ADMIN_OPT",
                          detail:
                            "管理员" +
                            this.userInfo.name +
                            "将分类" +
                            this.ruleForm.input +
                            "的排序修改为" +
                            this.ruleForm.sortNumber +
                            "(" +
                            tempText +
                            ">" +
                            this.ruleForm.input +
                            ")",
                        })
                        .then((res) => {});
                    }
                    this.closeDialog();
                    this.centerDialogVisible = false;
                  } else {
                    if (from.exhibitionType != this.modifydata.exhibitionType) {
                      let x = "";
                      if (this.modifyType == "IMAGE_TEXT_EXHIBITION") {
                        x = "图文展示";
                      } else {
                        x = "列表展示";
                      }
                      this.$http
                        .operateLogSave({
                          operateLogType: "ADMIN_OPT",
                          detail:
                            "管理员" +
                            this.userInfo.name +
                            "将分类" +
                            this.ruleForm.input +
                            "的展示类型修改为" +
                            x +
                            "(" +
                            this.breadcrumbName +
                            ">" +
                            this.ruleForm.input +
                            ")",
                        })
                        .then((res) => {
                          // // console.log(res)
                        });
                    }
                    if (this.ruleForm.input != this.modifydata.name) {
                      this.$http
                        .operateLogSave({
                          operateLogType: "ADMIN_OPT",
                          detail:
                            "管理员" +
                            this.userInfo.name +
                            "将分类" +
                            this.modifydata.name +
                            "的名称修改为" +
                            this.ruleForm.input +
                            "(" +
                            this.breadcrumbName +
                            ">" +
                            this.ruleForm.input +
                            ")",
                        })
                        .then((res) => {});
                    }
                    if (this.showCover != this.modifydata.cover) {
                      this.$http
                        .operateLogSave({
                          operateLogType: "ADMIN_OPT",
                          detail:
                            "管理员" +
                            this.userInfo.name +
                            "修改了分类" +
                            this.ruleForm.input +
                            "的封面" +
                            "(" +
                            this.breadcrumbName +
                            ">" +
                            this.ruleForm.input +
                            ")",
                        })
                        .then((res) => {});
                    }
                    if (
                      this.ruleForm.sortNumber != this.modifydata.serialNumber
                    ) {
                      this.$http
                        .operateLogSave({
                          operateLogType: "ADMIN_OPT",
                          detail:
                            "管理员" +
                            this.userInfo.name +
                            "将分类" +
                            this.ruleForm.input +
                            "的排序修改为" +
                            this.ruleForm.sortNumber +
                            "(" +
                            this.breadcrumbName +
                            ">" +
                            this.ruleForm.input +
                            ")",
                        })
                        .then((res) => {});
                    }
                    this.closeDialog();
                    this.centerDialogVisible = false;
                  }
                }
                if (res.data.code == 10006) {
                  ElMessage({
                    message: res.data.msg,
                    type: "warning",
                  });
                  this.centerDialogVisible = false;
                  this.getList();
                }
              }
            });
          }
          if (this.dialogStu == "add") {
            if (this.ruleForm.input == "" || this.fileList.length == 0) {
              return;
            } else {
              // console.log("add");
              let a = JSON.parse(sessionStorage.getItem("breadList"));
              // console.log(a);
              // return
              if (a) {
                // this.addId = a[a.length - 1].id
                if (typeof a == "object") {
                  this.addId = a.id;
                }
                this.addId = a[a.length - 1].id;
                // console.log("addId", this.addId);
                let from = {
                  cover: this.cover,
                  name: this.ruleForm.input,
                  parentId: this.addId,
                  exhibitionType: "IMAGE_TEXT_EXHIBITION",
                };
                // console.log(from);
                this.centerDialogVisible = false;
                // console.log(from);
                let _this = this;
                _this.$http.addCategory(from).then((res) => {
                  // console.log(res);
                  if (res.status == 200) {
                    if (res.data.code == 30000) {
                      ElMessage({
                        message: res.data.msg,
                        type: "warning",
                      });
                      this.centerDialogVisible = false;
                    }
                    if (res.data.code == 0) {
                      ElMessage({
                        message: res.data.msg,
                        type: "success",
                      });
                      this.getList();
                      let a = JSON.parse(sessionStorage.getItem("breadList"));
                      let tempText = "";
                      let b = [];
                      a.forEach((item, index) => {
                        // console.log(item.name);
                        b.push(item.name);
                      });
                      tempText = b.join(">");
                      // console.log(tempText);
                      this.$http
                        .operateLogSave({
                          operateLogType: "ADMIN_OPT",
                          detail:
                            "管理员" +
                            this.userInfo.name +
                            "添加分类" +
                            this.ruleForm.input +
                            "(" +
                            tempText +
                            ">" +
                            this.ruleForm.input +
                            ")",
                        })
                        .then((res) => {
                          // // console.log(res)
                        });

                      this.centerDialogVisible = false;
                    }
                    if (res.data.code == 10006) {
                      ElMessage({
                        message: res.data.msg,
                        type: "warning",
                      });
                      this.centerDialogVisible = false;
                      this.getList();
                    }
                  }
                });
              } else {
                let from = {
                  cover: this.cover,
                  name: this.ruleForm.input,
                  parentId: this.Id,
                };
                // console.log(from);
                this.centerDialogVisible = false;
                // console.log(from);
                let _this = this;
                _this.$http.addCategory(from).then((res) => {
                  // console.log(res);
                  if (res.status == 200) {
                    if (res.data.code == 30000) {
                      ElMessage({
                        message: res.data.msg,
                        type: "warning",
                      });
                      this.centerDialogVisible = false;
                    }
                    if (res.data.code == 0) {
                      ElMessage({
                        message: res.data.msg,
                        type: "success",
                      });
                      this.getList();
                      this.$http
                        .operateLogSave({
                          operateLogType: "ADMIN_OPT",
                          detail:
                            "管理员" +
                            this.userInfo.name +
                            "添加分类" +
                            this.ruleForm.input +
                            "(" +
                            this.breadcrumbName +
                            ">" +
                            this.ruleForm.input +
                            ")",
                        })
                        .then((res) => {
                          // // console.log(res)
                        });
                      this.centerDialogVisible = false;
                      this.showCover = "";
                    }
                    if (res.data.code == 10006) {
                      ElMessage({
                        message: res.data.msg,
                        type: "warning",
                      });
                      this.centerDialogVisible = false;
                      this.getList();
                    }
                  }
                });
              }
            }
          }
        });
      }
    },
    //批量删除选中
    handleSelectionChange(val) {
      // console.log(val);
      this.multipleSelection = val;
      let nameArry = val.map((item) => item.resources.name);
      // console.log(nameArry);
      this.addIdNameList = nameArry;
      // console.log(val);
    },
    handleSelectionChange2(val) {
      // console.log(val);
      this.multipleSelection2 = val;
      // val.forEach((item, index) => {
      //   this.addIdNameList.push(item.name);
      // });
      let nameArry = val.map((item) => item.name);
      // console.log(nameArry);
      this.addIdNameList = nameArry;
      // console.log(this.addIdNameList);
    },
    //批量删除弹层开关
    delMany() {
      this.delManyStu = true;
    },
    closeDialog() {
      this.fileList = [];
      this.showCover = "";
      this.ruleForm.input = "";
      this.cover = "";
      this.ruleForm.sortNumber = "";
      this.ruleForm.image = "";
      this.ruleForm.input = "";
    },
    //返回页面s
    back() {
      this.delManyStu = false;
    },
    //批量删除
    delBtn() {
      // console.log(this.addIdNameList);
      // return
      let _this = this;
      _this
        .$confirm("是否批量删除这些资源?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          let a = JSON.parse(sessionStorage.getItem("breadList"));
          if (a) {
            if (a.id) {
              this.pId = a.id;
            } else {
              this.pId = a[a.length - 1].id;
            }
          } else {
            this.pId = this.Id;
          }
          // console.log(this.multipleSelection);
          let from = {
            classificationId: this.pId,
            resourcesIds: [],
          };
          this.multipleSelection.forEach((item, index) => {
            from.resourcesIds.push(item.resources.id);
            // console.log(item.resources);
          });
          _this.$http.batchDelete(from).then((res) => {
            // console.log(res);
            if (res.status == 200) {
              if (res.data.code == 30000) {
                ElMessage({
                  message: res.data.msg,
                  type: "warning",
                });
                this.delDialogVisible = false;
              }
              if (res.data.code == 0) {
                ElMessage({
                  message: res.data.msg,
                  type: "success",
                });
                let a = JSON.parse(sessionStorage.getItem("breadList"));
                if (a) {
                  let tempText = "";
                  let b = [];
                  a.forEach((item, index) => {
                    // console.log(item.name);
                    b.push(item.name);
                  });
                  tempText = b.join(">");
                  let resText = this.addIdNameList.join("、");
                  this.$http
                    .operateLogSave({
                      operateLogType: "ADMIN_OPT",
                      detail:
                        "管理员" +
                        this.userInfo.name +
                        "批量删除了分类" +
                        a[a.length - 1].name +
                        "(" +
                        tempText +
                        ")" +
                        "下的资源" +
                        "(" +
                        resText +
                        ")",
                    })
                    .then((res) => {
                      // // console.log(res)
                    });
                } else {
                  let resText = this.addIdNameList.join("、");
                  this.$http
                    .operateLogSave({
                      operateLogType: "ADMIN_OPT",
                      detail:
                        "管理员" +
                        this.userInfo.name +
                        "批量删除了分类" +
                        this.breadcrumbName +
                        "下的资源" +
                        "(" +
                        resText +
                        ")",
                    })
                    .then((res) => {
                      // // console.log(res)
                    });
                }
                let resText = this.addIdNameList.join("、");
                // console.log(resText);
                // console.log(this.addIdNameList);
                // return;
                this.delManyStu = false;
                this.getDiaList();
                this.addIdNameList = [];
                location.reload();
                // this.delDialogVisible = false
              }
            }
          });
        });
    },
    closeAddDialog() {
      this.searchflag = false;
      this.addIdList = [];
      this.addIdNameList = [];
    },
    addRes() {
      this.addDialogVisible = true;
      this.getDiaList();
    },
    //是否上架开关
    putAway(val) {
      // console.log(val);
      // return;
      // // console.log(val.shelves);
      let _this = this;
      let from = {
        id: val.id,
        shelves: val.shelves,
      };
      let a = JSON.parse(sessionStorage.getItem("breadList"));
      if (a) {
        let tempText = "";
        let b = [];
        a.forEach((item, index) => {
          // console.log(item.name);
          b.push(item.name);
        });
        tempText = b.join(">");
        _this.$http.updateCategoryState(from).then((res) => {
          // // console.log(res);
          if (res.status == 200) {
            if (res.data.code == 0) {
              ElMessage({
                message: res.data.msg,
                type: "success",
              });
              this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    val.shelves == true
                      ? "管理员" +
                        this.userInfo.name +
                        "上架了" +
                        val.name +
                        "(" +
                        tempText +
                        ">" +
                        val.name +
                        ")"
                      : "管理员" +
                        this.userInfo.name +
                        "下架了" +
                        val.name +
                        "(" +
                        tempText +
                        ">" +
                        val.name +
                        ")",
                })
                .then((res) => {
                  // // console.log(res)
                });
              this.getList();
            } else {
              ElMessage({
                message: res.data.msg,
                type: "warning",
              });
            }
          }
        });
      } else {
        _this.$http.updateCategoryState(from).then((res) => {
          // // console.log(res);
          if (res.status == 200) {
            if (res.data.code == 0) {
              ElMessage({
                message: res.data.msg,
                type: "success",
              });
              this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    val.shelves == true
                      ? "管理员" +
                        this.userInfo.name +
                        "上架了" +
                        val.name +
                        "(" +
                        this.breadcrumbName +
                        ">" +
                        val.name +
                        ")"
                      : "管理员" +
                        this.userInfo.name +
                        "下架了" +
                        val.name +
                        "(" +
                        this.breadcrumbName +
                        ">" +
                        val.name +
                        ")",
                })
                .then((res) => {
                  // // console.log(res)
                });
              this.getList();
            } else {
              ElMessage({
                message: res.data.msg,
                type: "warning",
              });
            }
          }
        });
      }
    },
    checkSelectable(row) {
      // // console.log('row', row)
      return row.hasExist == false;
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + (index + 1);
    },
    atType(val) {
      this.modifyType = val;
      // console.log("val", val);
      if (val == "TABULATION_EXHIBITION") {
        this.ruleForm.selval = "列表展示";
      }
      if (val == "IMAGE_TEXT_EXHIBITION") {
        this.ruleForm.selval = "图文展示";
      }
      // console.log(this.ruleForm.selval);
    },
    setCover() {
      // console.log("一键设置封面");
      let a = JSON.parse(sessionStorage.getItem("breadList"));
      if (a) {
        ElMessageBox.confirm(
          "是否将" +
            a[a.length - 1].name +
            "的资源与分类的封面统一设置为" +
            a[a.length - 1].name +
            "的封面?",
          "确认提示",
          {
            confirmButtonText: "确认",
            type: "warning",
          }
        ).then(() => {
          let a = JSON.parse(sessionStorage.getItem("breadList"));
          let from = {};
          if (a) {
            from = {
              id: a[a.length - 1].id,
            };
          } else {
            from = {
              id: this.Id,
            };
          }
          this.$http.setAllCover(from).then((res) => {
            // console.log(res);
            if (res.data.code == 0) {
              ElMessage({
                type: "success",
                message: res.data.msg,
              });
              this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    "管理员" +
                    this.userInfo.name +
                    "将" +
                    a[a.length - 1].name +
                    "的资源与分类的封面统一设置为" +
                    a[a.length - 1].name +
                    "的封面",
                })
                .then((res) => {
                  // // console.log(res)
                });
              this.getList();
            }
          });
        });
      } else {
        ElMessageBox.confirm(
          "是否将" +
            this.breadcrumbName +
            "的资源与分类的封面统一设置为" +
            this.breadcrumbName +
            "的封面?",
          "确认提示",
          {
            confirmButtonText: "确认",
            type: "warning",
          }
        ).then(() => {
          let a = JSON.parse(sessionStorage.getItem("breadList"));
          let from = {};
          if (a) {
            from = {
              id: a[a.length - 1].id,
            };
          } else {
            from = {
              id: this.Id,
            };
          }
          this.$http.setAllCover(from).then((res) => {
            // console.log(res);
            if (res.data.code == 0) {
              ElMessage({
                type: "success",
                message: res.data.msg,
              });
              this.$http
                .operateLogSave({
                  operateLogType: "ADMIN_OPT",
                  detail:
                    "管理员" +
                    this.userInfo.name +
                    "将" +
                    this.breadcrumbName +
                    "的资源与分类的封面统一设置为" +
                    this.breadcrumbName +
                    "的封面",
                })
                .then((res) => {
                  // // console.log(res)
                });
              this.getList();
            }
          });
        });
      }
    },
  },
  watch: {
    $route(to, from) {
      // // console.log(to)
      this.getbreadcrumbName();
      // // console.log(from)
    },
    uploadProgress(newV, oldV) {
      console.log("进度条", newV);
      // “正在上传第1个资源，共3个（12.34%）
      // return;
      // console.log(
      //   "正在上传第" +
      //     `${this.uploadingNum}` +
      //     "个资源,共" +
      //     `${this.uploadNum}` +
      //     "个" +
      //     "(" +
      //     `${newV.progress}%` +
      //     ")"
      // );
      if (this.uploadNum == 1) {
        this.loading.setText("正在上传" + "(" + `${newV.progress}%` + ")");
      } else {
        this.loading.setText(
          "正在上传第" +
            `${this.uploadingNum}` +
            "个资源,共" +
            `${this.uploadNum}` +
            "个" +
            "(" +
            `${newV.progress}%` +
            ")"
        );
      }

      if (newV.progress == 100) {
        this.uploadingNum += 1;
        // this.times += 1;
        newV.progress = 0;
        //正在上传的文件数量大于总文件数量
        if (this.uploadingNum > this.uploadNum) {
          this.uploadingNum = this.uploadNum;
          newV.progress = 100;
        }
      }

      // console.log("newV.progress", newV.progress);
      // console.log("uploadingNum", this.uploadingNum);
      // console.log("uploadNum", this.uploadNum);
      // console.log("uploadNum", this.uploadNum);
      // console.log(newV.progress * this.uploadingNum);
      // console.log(100 * this.uploadNum);
      if (newV.progress * this.uploadingNum == 100 * this.uploadNum) {
        this.loading.close();
        this.uploadNum = 0;
        this.uploadingNum = 1;
        this.time = true;
        // if (this.loading.close()) {
        //   ElMessage({
        //     message: "上传成功",
        //     type: "success",
        //   });
        // }
        // console.log("times", this.times);
        // if (this.times >= this.uploadNum) {

        // }
      }
      // if (this.time == true) {
      //   ElMessage({
      //     message: "上传成功",
      //     type: "success",
      //   });
      //   this.time = false;
      // }
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  // height: calc(100vh - 60px);
  display: flex;
  // flex-wrap: wrap;
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

.avatar {
  width: calc(100% - 100px);
  height: 178px;
  display: block;
  object-fit: cover;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 178px;
  text-align: center;
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
  width: 60%;
  // border: 1px red solid;
  display: flex;
  justify-content: center;
  margin: 0 auto;

  .el-link {
    width: 33%;
    // border: 1px red solid;
  }
}

.el-dialog__body {
  width: 100%;
  height: 60%;
  border: 1px red solid;
}

.content {
  width: 100% !important;
  // height: 350px;
  height: 100%;
  // border: 1px red solid;
  display: flex;
  flex-wrap: wrap;

  .title-box {
    width: 97%;
    height: 10%;
    // border: 1px red solid;
    // display: flex;
    // align-items: center;

    .el-input {
      width: 100%;
    }
  }
  .uplpad-box {
    width: 100%;
    height: 280px;
    // border: 1px red solid;
    display: flex;
    flex-wrap: wrap;
    .imgavatar {
      width: 100%;
      height: 80%;
      // border: 1px red solid;
    }
    .el-input {
      width: 96%;
    }
  }
}
:deep(.el-form-item) {
  width: 100%;
  // border: 1px red solid;
  display: flex;
  div {
    width: 98%;
  }
}
:deep(.el-form-item__content) {
  width: 100%;
  display: flex;
  //   border: 1px red solid;
  .el-input {
    width: 100%;
  }
}
.uplpad-box {
  width: 100%;
  height: 280px;
  // border: 1px red solid;
  display: flex;
  // margin-top: 30px;
}
.imgavatar {
  // border: 1px red solid;
  div {
    width: calc(100% - 100px);
    height: 200px;
    display: flex;
    // border: 1px red solid;
    :deep(.el-upload) {
      // border: 1px red solid;
      width: 40%;
      display: flex;
      img {
        width: 100%;
        height: 100%;
        // border: 1px red solid;
      }
    }
  }
}

.modifydialog {
  height: 50%;
  display: flex;
  flex-wrap: wrap;

  .el-dialog__footer {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .el-dialog--center .el-dialog__body {
    // border: 1px red solid;
    width: 100%;
    height: 60%;
    text-align: center;
    padding: 0;
  }
}

.upload-demo {
  // border: 1px red solid;
  display: flex;
  margin-right: 1rem;
}

.upload-demo:hover {
  color: #409eff;
  border-color: #409eff;
  background-color: #409eff;
  outline: #409eff;
}

:deep(.upload-demo > .el-upload-list) {
  display: none;
  border: 1px red solid;
  color: red;
}

:deep(.adddialog) {
  width: 50%;
  height: 60%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

:deep(.adddialog .el-dialog__header) {
  width: 100%;
  height: 5%;
  display: flex;
  flex-wrap: wrap;
}

:deep(.adddialog .el-dialog__footer) {
  width: 100%;
  height: 20%;
  padding: 0;
}

:deep(.adddialog > .el-dialog__body) {
  width: 100%;
  height: 75%;
  padding: 0;
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
}
:deep(.el-dialog.is-align-center) {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: flex-end;
  margin-left: 0;
  padding-top: 4rem;
}
.card_content {
  height: 350px;
  .uplpad-box {
    height: 280px;
    display: flex;
    flex-wrap: wrap;
    // border: 1px red solid;
    .imgavatar {
      width: 100%;
      // border: 1px red solid;
      div {
        // border: 1px red solid;
        width: 36%;
      }
    }
  }
}

.showType {
  :deep(.el-form-item__content .el-input) {
    width: 100%;
    height: 32px;
  }
  .el-select {
    // border: 1px red solid;
    width: 34%;
    height: 40px;
  }
  :deep(.select-trigger) {
    width: 100%;
    // border: 1px red solid;
  }
}
.setCover {
  margin-right: 20px;
}
// .el-select {
//   width: 13%;
//   height: 40px;

//   :deep(.el-input__wrapper) {
//     width: 200px;
//     height: 30px;
//   }
// }
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
  border-top: 2px #bbbbbb solid;
  text-align: center;
}

.deldialog .el-dialog__footer {
  width: 100%;
  display: flex;
  justify-content: center;
  border: 1px red solid;
}

.el-dialog__header {
  width: 100%;
  height: 10%;
  display: flex;
}

.el-upload-list__item-actions {
  width: 200px;
  height: 200px;
}

.imgdialog {
  height: 80%;
}

:deep(.el-dialog .is-align-center .el-dialog--center) {
  height: 50%;
}
</style>
