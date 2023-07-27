<template>
  <div class="active">
    <div class="card_header">
        <!-- <el-breadcrumb separator-icon="ArrowRightBold">
            <el-breadcrumb-item :to="{ path: '/active' }">游戏</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/listenSong' }">听歌猜歌名</el-breadcrumb-item>
        </el-breadcrumb> -->
        <div class="card_opt">
            <el-form :model="searchRuleForm" ref="searchRuleForm" :inline="true" class="searchRuleForm">
                <el-form-item label="难度" prop="region">
                    <el-select v-model="searchRuleForm.region" placeholder="请选择难度">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="1星" value="1"></el-option>
                        <el-option label="2星" value="2"></el-option>
                        <el-option label="3星" value="3"></el-option>
                        <el-option label="4星" value="4"></el-option>
                        <el-option label="5星" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否上架" prop="shelves">
                    <el-select v-model="searchRuleForm.shelves" placeholder="">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" prop="date">
                    <el-date-picker v-model="searchRuleForm.date" type="daterange" range-separator="-"  />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">查询</el-button>
                    <el-button @click="resetForm('searchRuleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="card_opt2">
            <el-button @click="addBtn" type="primary">添加题目</el-button>
            <el-button @click="configure">配置表</el-button>            
            <!-- <el-button @click="back" type="danger">返回</el-button> -->
        </div>
    </div>
    <div class="card_content">
      <!-- {{ musicdata }} -->
      <el-table :data="musicdata" stripe style="width: 100%">
        <!-- <el-table-column type="selection" width="30px" /> -->
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="musicUrl" label="音乐资源" width="350">
          <template #default="scope">
            <audio class="audio" :src="scope.row.musicUrl" controls></audio>
          </template>
        </el-table-column>
        <el-table-column prop="options" label="选项">
          <template #default="scope">
            {{ options(scope.row.answers) }}
          </template>
        </el-table-column>
        <el-table-column label="答案">
          <template #default="scope">
            {{ right(scope.row.answers) }}
          </template>
        </el-table-column>
        <el-table-column prop="difficulty" label="难度" width="100" >
          <template #default="scope">
            {{ scope.row.difficulty }}星
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="Address" /> -->
        <el-table-column prop="address" label="创建时间" width="165">
          <template #default="scope">
            {{ tools.transitionTime(scope.row.createdAt) }}</template
          >
        </el-table-column>
        <el-table-column prop="" label="是否上架" width="120">
          <template #default="scope">
            <!-- :before-change="beforeChange()" -->
            <el-switch
              v-model="scope.row.shelves"
              @change="shelvesChange(scope.row)"
              :loading="shelvesLoading"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <div class="handle">
              <!-- <el-link
                :underline="false"
                type="primary"
                @click="check(scope.row)"
                >查看</el-link
              > -->
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
    <div class="card_footer">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :background="true"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加商品 -->
    <!-- addDialogVisible -->
    <addListenQues
      v-if="addDialogVisible"
      :dialogVisible.sync="addDialogVisible"
      @update:dialogVisible="updateAddDialogVisible"
    >  
    </addListenQues>
    <!-- 修改商品 -->
    <el-dialog
      class="modDialog"
      v-model="modDialogVisible"
      width="800px"
      :append-to-body="true"
      @close="closeDialog"
    >
      <template #header>
        <div class="header-box">修改题目</div>
      </template>
      <el-form
        :model="modifyruleForm"
        :rules="rules"
        ref="modifyruleForm"
        label-width="100px"
        class="addruleForm"
      >
        <!-- <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item> -->
        <el-form-item label="资源" prop="filelist">
          <el-upload
            class="upload-demo"
            action="#"
            accept="audio/*"
            :http-request="() => {}"
            :before-upload="beforeUpload2"
            v-model:file-list="modifyruleForm.filelist"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传音乐文件</div>
          </el-upload>
          <!-- <el-dialog v-model="dialogVisible" class="showdialog">
          <img :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog> -->
        </el-form-item>
        <el-form-item label="难度" prop="region">
          <el-rate v-model="modifyruleForm.region"></el-rate>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in modifyruleForm.domains"
          :label="'答案' + (index + 1)"
          :key="domain.key"
          :prop="'domains.' + index + '.text'"
          :rules="{
            required: true,
            message: '答案不能为空',
            trigger: 'blur',
          }"
          class="domains"
        >
          <el-input v-model="domain.text" :maxlength="20" @change="inputChange"></el-input
          ><el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增答案</el-button>
        </el-form-item>
        <el-form-item label="正确答案" prop="answers">
          <el-radio-group v-model="modifyruleForm.answers">
            <el-radio
              v-for="(item, index) in modifyruleForm.domains"
              :key="index"
              :label="item.text"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm2('modifyruleForm')"
            >立即修改</el-button
          >
          <el-button @click="resetForm('modifyruleForm')">重置</el-button>
        </el-form-item></el-form
      >
    </el-dialog>
    <!-- 配置表 -->
    <el-dialog
      class="addDialog"
      v-model="configureDialogVisible"
      width="800px"
      :append-to-body="true"
      @close="closeDialog"
    >
      <template #header>
        <div class="header-box">配置表</div>
      </template>
      <el-form
        :model="configureRuleForm"
        :rules="rules2"
        ref="configureRuleForm"
        label-width="120px"
        class="configureRuleForm"
      >
        <el-form-item label="游戏时长(秒)" prop="tokinaga">
          <el-input-number
            :min="1" :step="10"
            v-model="configureRuleForm.tokinaga"
            placeholder="请输入游戏时长"
          ></el-input-number>
        </el-form-item>
        <div class="card_difficulty">
          <el-form-item label="难度" prop="region">
            <el-rate v-model="difficultyValue" disabled text-color="#ff9900" />
          </el-form-item>
          <el-form-item label="答题数" prop="num">
            <el-input-number
              v-model="configureRuleForm.num"
              :step="1"
              :min="1"
              :max="100"
            />
          </el-form-item>
          <el-form-item label="难度" prop="region">
            <el-rate v-model="difficultyValue2" disabled text-color="#ff9900" />
          </el-form-item>
          <el-form-item label="答题数" prop="num2">
            <el-input-number
              v-model="configureRuleForm.num2"
              :step="1"
              :min="1"
              :max="100"
            />
          </el-form-item>
          <el-form-item label="难度" prop="region">
            <el-rate v-model="difficultyValue3" disabled text-color="#ff9900" />
          </el-form-item>
          <el-form-item label="答题数" prop="num3">
            <el-input-number
              v-model="configureRuleForm.num3"
              :step="1"
              :min="1"
              :max="100"
            />
          </el-form-item>
          <el-form-item label="难度" prop="region">
            <el-rate v-model="difficultyValue4" disabled text-color="#ff9900" />
          </el-form-item>
          <el-form-item label="答题数" prop="num4">
            <el-input-number
              v-model="configureRuleForm.num4"
              :step="1"
              :min="1"
              :max="100"
            />
          </el-form-item>
          <el-form-item label="难度" prop="region">
            <el-rate v-model="difficultyValue5" disabled text-color="#ff9900" />
          </el-form-item>
          <el-form-item label="答题数" prop="num5">
            <el-input-number
              v-model="configureRuleForm.num5"
              :step="1"
              :min="1"
              :max="100"
            />
          </el-form-item>
        </div>
        <el-form-item class="btn_submit">
          <el-button type="primary" @click="submitForm3('configureRuleForm')"
            >立即修改</el-button
          >
          <!-- <el-button @click="resetForm('modifyruleForm')">重置</el-button> -->
        </el-form-item></el-form
      >
    </el-dialog>
  </div>
</template>

<script>
import { UploadFile, ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { ArrowRight, ArrowRightBold } from "@element-plus/icons-vue";
import { uploadFile } from "@/utils/upload";
import { getLocalStorage, setLocalStorage } from "@/utils/index";
import addListenQues from "./components/add-listen-ques";
import tools from "./../../utils/tools";
export default {
  name: "active",
  components:{
    addListenQues
  },
  data() {
    return {
      tools,
      userInfo: {},
      currentPage: 1,
      pageSize: 10,
      total: 0,
      musicdata: [],
      ruleForm: {
        region: 0,
        filelist: [],
        answers: "",
        domains: [],
      },
      modifyruleForm: {
        region: "",
        filelist: [],
        answers: "",
        domains: [
          {
            text: "",
          },
        ],
      },
      rules: {
        region: [{ required: true, message: "请选择难度", trigger: "change" }],
        filelist: [
          {
            type: "array",
            required: true,
            message: "请上传资源文件",
            trigger: "change",
          },
        ],
        answers: [
          { required: true, message: "请选择一个正确答案", trigger: "change" },
        ],
      },
      configureRuleForm: {
        tokinaga: "",
        num: 0,
        num2: 0,
        num3: 0,
        num4: 0,
        num5: 0,
      },
      searchRuleForm: {
        region: "",
        shelves: "",
      },
      rules2: {
        tokinaga: [
          {
            required: true,
            message: "请输入游戏时长",
            trigger: "blur",
          },
        ],
        num: [
          {
            required: true,
            message: "请输入答题数",
            trigger: "blur",
          },
        ],
        num2: [
          {
            required: true,
            message: "请输入答题数",
            trigger: "blur",
          },
        ],
        num3: [
          {
            required: true,
            message: "请输入答题数",
            trigger: "blur",
          },
        ],
        num4: [
          {
            required: true,
            message: "请输入答题数",
            trigger: "blur",
          },
        ],
        num5: [
          {
            required: true,
            message: "请输入答题数",
            trigger: "blur",
          },
        ],
      },
      addDialogVisible: false,
      modDialogVisible: false,
      configureDialogVisible: false,
      dialogVisible: false,
      musicUrl: "",

      // 改变上架状态loading
      shelvesLoading: false,
      difficultyValue: 1,
      difficultyValue2: 2,
      difficultyValue3: 3,
      difficultyValue4: 4,
      difficultyValue5: 5,
      configuredata: [],
      activeName: "first",
      modId: "",
      musicName: "",
      modifyConfigureData: [],
    };
  },
  methods: {
    inputChange(value){
      this.modifyruleForm.answers=value
      console.log(this.modifyruleForm.answers);
      console.log(this.modifyruleForm.domains)
      const temp = this.modifyruleForm.domains.map(item => item.text)
      console.log(temp);
      const newArr  = [...new Set([...temp])]
      if(temp.length != newArr.length ){
        this.modifyruleForm.answers = ""
      }
      console.log("111111",newArr);
    },
    getAllMusic() {
      let _this = this;
      let from = {
        // parentId: this.parentId,.
        page: this.currentPage - 1,
        size: this.pageSize,
        sort: "createdAt,desc",
      };
      console.log(_this.searchRuleForm);
      if(_this.searchRuleForm.region){
        from.difficulty = _this.searchRuleForm.region;
      }
      from.shelves = _this.searchRuleForm.shelves;     
      if (_this.searchRuleForm.date && _this.searchRuleForm.date.length == 2) {
        let startTime = _this.searchRuleForm.date[0];
        let endTime = _this.searchRuleForm.date[1];
        startTime.setHours(0, 0, 0, 0);
        endTime.setHours(23, 59, 59, 999);
        from.startDate = startTime.getTime();
        from.endDate = endTime.getTime();
      }
      _this.$http.findAllMusic(from).then((res) => {
        console.log(res);
        this.musicdata = res.data.result.content;
        this.total = res.data.result.totalElements;
      });
    },
    shelvesChange(val) {
      // console.log(val)
      let _self = this;
      let from = {
        id: val.id,
      };
      console.log(val.shelves);
      if (val.shelves == true) {
        //上架
        _self.$http.shelvesMusic(from).then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            // console.log(';1233132')
            this.getAllMusic();
            ElMessage({
              message: "上架成功",
              type: "success",
            });
          }
        });
      } else {
        _self.$http.cancelShelvesMusic(from).then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            this.getAllMusic();
            ElMessage({
              message: "下架成功",
              type: "success",
            });
          }
        });
      }
    },
    shelvesflagChange() {},
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.getAllMusic();
    },
    addBtn() {
      this.addDialogVisible = true;
    },
    removeDomain(item) {
      var index = this.ruleForm.domains.indexOf(item);
      var index2 = this.modifyruleForm.domains.indexOf(item);
      if (index !== -1) {
        this.ruleForm.domains.splice(index, 1);
        this.ruleForm.answers=''
      }
      if (index2 !== -1) {
        this.modifyruleForm.domains.splice(index, 1);
        this.modifyruleForm.answers=''
      }
    },
    modBtn(val) {
      this.modDialogVisible = true;
      console.log(val);
      this.modifyruleForm.domains = val.answers;
      this.modifyruleForm.domains.forEach((item, index) => {
        if (item.is_right == true) {
          this.modifyruleForm.answers = item.text;
        }
      });
      this.modifyruleForm.region = val.difficulty;
      this.modifyruleForm.filelist.push({
        name: val.music,
        url: val.music,
      });
      this.modId = val.id;
      this.musicUrl = val.music;
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
          this.$http.deleteListenMusic(from).then((res) => {
            if (res.data.code == 0) {
              ElMessage({
                type: "success",
                message: "删除成功",
              });
              this.getAllMusic();
              this.$http.operateLogSave({
                operateLogType: 'ADMIN_OPT',
                detail:`管理员 [${this.userInfo.name}] 删除了听歌猜歌名游戏题目[id:${val.id}]`
              })
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
    closeDialog() {
      console.log("弹窗关闭");
      // this.$refs[formName].resetFields();
      this.imageUrl = "";
      this.modifyruleForm.domains = [
        {
          text: "",
        },
      ];
      this.modifyruleForm.answers = "";
      this.modifyruleForm.filelist = [];
      this.ruleForm.domains = [
        {
          text: "",
        },
      ];
      this.ruleForm.region = 0;
      this.ruleForm.answers = "";
      this.ruleForm.filelist = [];
      // this.resetForm("ruleForm");
      this.musicUrl = "";
      this.musicName = "";
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let from = {
            answers: this.ruleForm.domains,
            difficulty: this.ruleForm.region,
            music: this.musicUrl,
          };
          this.ruleForm.domains.forEach((item, index) => {
            item.is_right = false;
            if (item.text == this.ruleForm.answers) {
              item.is_right = true;
            }
          });
          console.log(from);
          console.log(this.musicName);
          // let urldata = getLocalStorage("urldata")
          // if(urldata){

          // }
          // return;
          this.$http.addListenMusic(from).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              ElMessage({
                message: "添加成功",
                type: "success",
              });
              this.getAllMusic();
            }
          });

          console.log(this.ruleForm.answers);
          this.addDialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm2(formName) {
      let _self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let from = {
            id: this.modId,
            answers: this.modifyruleForm.domains,
            difficulty: this.modifyruleForm.region,
            music: this.musicUrl || this.modifyruleForm.filelist[0].url,
          };
          this.modifyruleForm.domains.forEach((item, index) => {
            item.is_right = false;
            if (item.text == this.modifyruleForm.answers) {
              item.is_right = true;
            }
          });
          console.log(from);
          console.log(this.musicName);
          // return;
          this.$http.modifyListenMusic(from).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              ElMessage({
                message: "修改成功",
                type: "success",
              });
              this.modDialogVisible = false;
              this.getAllMusic();
              this.$http.operateLogSave({
                operateLogType: 'ADMIN_OPT',
                detail:`管理员 [${this.userInfo.name}] 修改了听歌猜歌名游戏题目[id:${this.modId}]`
              })
            }
          });
        } else {
        }
      });
    },
    submitForm3(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.configuredata);
          let fromdata = [
            {
              id: 1,
              name: "listen-song-game-time",
              value: this.configureRuleForm.tokinaga * 1000,
            },
            {
              id: 2,
              name: "listen-song-one-star",
              value: this.configureRuleForm.num,
            },
            {
              id: 3,
              name: "listen-song-two-star",
              value: this.configureRuleForm.num2,
            },
            {
              id: 4,
              name: "listen-song-three-star",
              value: this.configureRuleForm.num3,
            },
            {
              id: 5,
              name: "listen-song-four-star",
              value: this.configureRuleForm.num4,
            },
            {
              id: 6,
              name: "listen-song-five-star",
              value: this.configureRuleForm.num5,
            },
          ];
          fromdata.forEach((item, index) => {
            // if(item)
            // console.log(
            //   item,
            //   "--------------------",
            //   this.configuredata[index]
            // );
            if (item.value != this.configuredata[index].value) {
              // console.log(item);
              this.modifyConfigureData.push(item);

              return;
              this.$http.updateConfig(item).then((res) => {
                console.log(res);
              });
            }
          });
          this.changeConfig();
          // console.log(this.modifyConfigureData);
          // console.log(fromdata);
        } else {
        }
      });
    },
    async changeConfig() {
      console.log("改变配置", this.modifyConfigureData);
      const array = this.modifyConfigureData || [];
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        console.log("element", element);
        const res = await this.$http.updateConfig(element);
        console.log("res", res);
      }
      this.$http.operateLogSave({
        operateLogType: 'ADMIN_OPT',
        detail:`管理员 [${this.userInfo.name}] 修改了听歌猜歌名游戏配置项`
      })
      this.configureDialogVisible = false;
    },
    search(formName) {
        this.currentPage = 1;
        this.getAllMusic();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    beforeUpload(file) {
      console.log(file);
      this.musicName = file.name;
      this.loading = ElLoading.service({
        lock: true,
        text: "正在上传...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // console.log(this.ruleForm.filelist);
      uploadFile(file, async (res) => {
        console.log(res);
        if (res.code == 0) {
          this.musicUrl = res.result.fileName;
          this.loading.close();
          console.log(this.ruleForm.filelist);
          if (this.ruleForm.filelist.length > 1) {
            this.ruleForm.filelist = [
              this.ruleForm.filelist[this.ruleForm.filelist.length - 1],
            ];
          }
        }
      });
      console.log(this.ruleForm.filelist);
      // console.log(this.fileList)
    },
    beforeUpload2(file) {
      console.log(file);
      this.loading = ElLoading.service({
        lock: true,
        text: "正在上传...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // console.log(this.ruleForm.filelist);
      uploadFile(file, async (res) => {
        console.log(res);
        if (res.code == 0) {
          this.musicUrl = res.result.fileName;
          this.loading.close();
          // console.log(this..filelist);
          if (this.modifyruleForm.filelist.length > 1) {
            this.modifyruleForm.filelist = [
              this.modifyruleForm.filelist[
                this.modifyruleForm.filelist.length - 1
              ],
            ];
          }
        }
      });
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      console.log(this.activeName);
      console.log(tab.props);
      if (tab.props.name == "second") {
        this.$router.push("./soundhound");
        this.activeName = "first";
        tab.props.name == "first";
      }
    },
    changeClick(name) {
      console.log("name", name);
      this.activeName = "first";
      this.$router.push("./soundhound");
    },
    addDomain() {
      console.log(this.ruleForm.domains.length);
      // if (this.ruleForm.domains.length <= 3) {
      // if (this.ruleForm.domains[this.ruleForm.domains.length - 1].text != "") {
      //   this.ruleForm.domains.push({
      //     text: "",
      //   });
      // }
      // this.modifyruleForm.domains.push({
      //   text: "",
      // });
      let _self = this;
      _self.modifyruleForm.domains.push({ "text": "", "is_right": false });
      // }
    },
    getConfigureData() {
      this.$http.findAllConfig().then((res) => {
        console.log(res);
        // this.configuredata = res.data.result;
        res.data.result.forEach((item, index) => {
          this.configuredata.push({
            id: item.id,
            name: item.name,
            value: +item.value,
          });
        });
        this.configureRuleForm.tokinaga = res.data.result[0].value / 1000;
        this.configureRuleForm.num = +res.data.result[1].value;
        this.configureRuleForm.num2 = +res.data.result[2].value;
        this.configureRuleForm.num3 = +res.data.result[3].value;
        this.configureRuleForm.num4 = +res.data.result[4].value;
        this.configureRuleForm.num5 = +res.data.result[5].value;
      });
    },
    configure() {
      console.log("0901");
      this.configureDialogVisible = true;
      this.getConfigureData();
    },
    back() {
      this.$router.back();
    },
    options(val) {
      let str = "";
      let tempArray = [];
      val.forEach((item, index) => {
        tempArray.push(item.text);
        str = tempArray.join("\xa0\xa0\xa0 | \xa0\xa0\xa0");
      });
      return str;
    },
    right(val) {
      let str = "";
      val.forEach((item, index) => {
        if (item.is_right == true) {
          str = item.text;
        }
      });
      return str;
    },
    updateAddDialogVisible(newValue){
        this.addDialogVisible = newValue;
        this.$http.operateLogSave({
          operateLogType: 'ADMIN_OPT',
          detail:`管理员 [${this.userInfo.name}] 新增了听歌猜歌名游戏题目`
        })
        this.getAllMusic();
    }
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.getAllMusic();
    this.getConfigureData();
    // this.activeName = 'second'
    // this.activeName = "first";
    // console.log("123");
  },
  computed: {
    ruleFormDomains() {
      this.ruleForm.domains = [];
      this.getConfigureData();
      // console.log('this.ruleForm.region',this.ruleForm.region)
      // console.log('this.ruleForm.region',this.configuredata[this.ruleForm.region].value)
      if (this.ruleForm.region == 0) {
        this.ruleForm.domains.push({
          text: "",
        });
      } else {
        for (
          let index = 0;
          index < this.configuredata[this.ruleForm.region].value;
          index++
        ) {
          this.ruleForm.domains.push({
            text: "",
          });
        }
      }

      return this.ruleForm.domains;
    },
    // options(val){
    //   return 1
    // }
  },
};
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
    flex-wrap: wrap;
  }
  .card_content {
    width: 100%;
    height: 70%;
    overflow: auto;
    .handle {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  }
  .card_footer {
    width: 100%;
    height: 8%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
:deep(.cell) {
  text-align: center;
}
:deep(.showdialog) {
  .el-dialog__body {
    display: flex;
    img {
      width: 100%;
    }
  }
}
.avatar {
  width: 278px;
  height: 178px;
  display: block;
  object-fit: cover;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 278px;
  height: 178px;
  text-align: center;
}
:deep(.el-upload) {
  border: none;
}
.domains {
  .el-input {
    width: 90%;
  }
}
.el-form {
  max-height: 600px;
  overflow-y: auto;
}
.el-breadcrumb {
  width: 100%;
  height: 30%;
  display: flex;
  font-size: 1rem;
  margin-left: 15px;
}
.card_opt {
  width: 100%;
  padding: 0 14px;
}
.card_opt2 {
  width: 100%;
  display: flex;
  padding: 0 14px;
  justify-content: flex-start;
}

.card_difficulty {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 50%;
  }
}
.btn_submit {
  margin-top: 30px;
  :deep(.el-form-item__content) {
    margin-right: 50px;
    justify-content: flex-end;
  }
}
</style>
