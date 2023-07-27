<template>
  <div class="active">
    <div class="card_header">
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
        </div>
      <!-- <el-breadcrumb separator-icon="ArrowRightBold">
        <el-breadcrumb-item :to="{ path: '/active' }">游戏</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/soundhound' }">歌词接龙</el-breadcrumb-item>
      </el-breadcrumb> -->
    </div>
   
    <!-- <div class="search-box">
      <el-button @click="addBtn" type="primary">添加题目</el-button>

      <el-button @click="configure">配置表</el-button>
    </div> -->
    <div class="card_content">
      <!-- {{ musicdata }} -->
      <el-table :data="musicdata" stripe style="width: 100%">
        <!-- <el-table-column type="selection" width="30px" /> -->
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="lyrics" label="题干">
          <template #default="scope">
            <span style="white-space: pre-line">
              {{ scope.row.lyrics }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="musicUrl" label="题干音乐" width="350">
          <template #default="scope">
            <audio class="audio" :src="scope.row.musicUrl" controls></audio>
          </template>
        </el-table-column>
        <el-table-column prop="answersAudioUrl" label="正确音乐" width="350">
          <template #default="scope">
            <audio
              class="audio"
              :src="scope.row.answersAudioUrl"
              controls
            ></audio>
          </template>
        </el-table-column>
        <el-table-column prop="difficulty" label="难度">
          <template #default="scope"> {{ scope.row.difficulty }}星 </template>
        </el-table-column>
        <el-table-column prop="address" label="创建时间">
          <template #default="scope">
            {{ tools.transitionTime(scope.row.createdAt) }}</template
          >
        </el-table-column>
        <el-table-column prop="" label="是否上架">
          <template #default="scope">
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

    <!-- 添加题目 -->
    <el-dialog
      class="addDialog"
      v-model="addDialogVisible"
      width="800px"
      :append-to-body="true"
      @close="closeDialog"
    >
      <template #header>
        <div class="header-box">添加题目</div>
      </template>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="addruleForm"
      >
        <el-form-item label="题干音乐" prop="filelist">
          <el-upload
            class="upload-demo"
            action="#"
            accept="audio/*"
            :http-request="() => {}"
            :before-upload="beforeUpload"
            v-model:file-list="ruleForm.filelist"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip" style="margin-left: 8px">
              建议上传mp3格式
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="题干" prop="lyrics">
          <el-input
            v-model="ruleForm.lyrics"
            :rows="5"
            type="textarea"
            resize="none"
          />
        </el-form-item>
        <el-form-item label="难度" prop="region">
          <el-rate v-model="ruleForm.region"></el-rate>
        </el-form-item>
        <el-form-item label="正确音乐" prop="answersAudioFilelist">
          <el-upload
            class="upload-demo"
            action="#"
            accept="audio/*"
            :http-request="() => {}"
            :before-upload="answersAudioBeforeUpload"
            v-model:file-list="ruleForm.answersAudioFilelist"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip" style="margin-left: 8px">
              建议上传mp3格式
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in ruleForm.domains"
          :label="'歌词' + (index + 1)"
          :key="domain.key"
          :prop="'domains.' + index + '.text'"
          :rules="{
            required: true,
            message: '歌词不能为空',
            trigger: 'blur',
          }"
          class="domains"
        >
          <el-input v-model="domain.text" :maxlength="16"></el-input>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          <el-button @click="addDomain" v-if="index + 1 == ruleForm.domains.length">添加{{ index }}</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="addDomain">新增歌词</el-button>
        </el-form-item> -->
        <!-- <el-form-item label="打乱后顺序" class="card_order" prop="newOrderlist">
                <el-button type="primary" @click="reset('add')" icon="Refresh" circle></el-button>
                <el-form-item v-for="(itrm, index) in ruleForm.newOrderlist" :label="'歌词' + (index + 1)" :key="itrm.key" :prop="'newOrderlist.' + index + '.text'" :rules="{
                  required: true,
                  message: '歌词不能为空',
                  trigger: 'blur',
                }" class="newOrderlist">
                    <el-input v-model="itrm.text" :disabled="true"></el-input>
                </el-form-item>
            </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
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
        <el-form-item label="题干音乐" prop="filelist">
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
            <div slot="tip" class="el-upload__tip">建议上传mp3格式</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="题干" prop="lyrics">
          <el-input
            v-model="modifyruleForm.lyrics"
            :rows="5"
            type="textarea"
            resize="none"
          />
        </el-form-item>
        <el-form-item label="难度" prop="region">
          <el-rate v-model="modifyruleForm.region"></el-rate>
        </el-form-item>
        <el-form-item label="正确音乐" prop="answersAudioFilelist">
          <el-upload
            class="upload-demo"
            action="#"
            accept="audio/*"
            :http-request="() => {}"
            :before-upload="answersAudioBeforeUpload"
            v-model:file-list="ruleForm.answersAudioFilelist"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip" style="margin-left: 8px">
              建议上传mp3格式
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in modifyruleForm.domains"
          :label="'歌词' + (index + 1)"
          :key="domain.key"
          :prop="'domains.' + index + '.text'"
          :rules="{
            required: true,
            message: '歌词不能为空',
            trigger: 'blur',
          }"
          class="domains"
        >
          <el-input v-model="domain.text" :maxlength="16"></el-input>
          <el-button @click.prevent="removeDomain1(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增歌词</el-button>
        </el-form-item>
        <!-- <el-form-item label="顺序" class="card_order" prop="newOrderlist">
                <el-button type="primary" @click="reset('mod')" icon="Refresh" circle></el-button>
                <el-form-item v-for="(domain, index) in modifyruleForm.newOrderlist" :label="'歌词' + (index + 1)" :key="domain.key" :prop="'newOrderlist.' + index + '.text'" :rules="{
                  required: true,
                  message: '歌词不能为空',
                  trigger: 'blur',
                }" class="newOrderlist">
                    <el-input v-model="domain.text" :disabled="true"></el-input>
                </el-form-item>
            </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm2('modifyruleForm')"
            >立即修改</el-button
          >
          <el-button @click="resetForm('modifyruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
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
            :min="1"
            :step="10"
            v-model="configureRuleForm.tokinaga"
            placeholder="请输入游戏时长"
          ></el-input-number>
        </el-form-item>
        <div class="card_difficulty">
          <el-form-item label="难度" prop="region">
            <el-rate v-model="levels.levelOne" disabled text-color="#ff9900" />
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
            <el-rate v-model="levels.levelTwo" disabled text-color="#ff9900" />
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
            <el-rate
              v-model="levels.levelThree"
              disabled
              text-color="#ff9900"
            />
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
            <el-rate v-model="levels.levelFour" disabled text-color="#ff9900" />
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
            <el-rate v-model="levels.levelFive" disabled text-color="#ff9900" />
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
import { UploadFile, ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { uploadFile } from '@/utils/upload'
import tools from './../../utils/tools'
export default {
  name: 'active',
  data() {
    // 行内自定义校验
    var validatePass = (rule, value, callback) => {
      if (value === '' || value == undefined || value == 0) {
        callback(new Error('请点击选择评分'));
      }
      callback();
    };
    return {
      tools,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      musicdata: [],
      orderdata: [],
      orderdata2: [],
      ruleForm: {
        region: 0,
        filelist: [],
        answersAudioFilelist: [],
        // ordertext: "",
        // answers: "",
        domains: [
          {
            text: '',
          },
        ],
        newOrderlist: [],
      },
      modifyruleForm: {
        region: 0,
        filelist: [],
        answersAudioFilelist: [],
        ordertext: '',
        // answers: "",
        domains: [
          {
            text: '',
          },
        ],
        newOrderlist: [],
      },

      rules: {
        region: [{ required: true, message: '请选择难度', trigger: 'change' }],
        lyrics: [{ required: true, message: '请输入题干', trigger: 'change' }],
        filelist: [
          {
            type: 'array',
            required: true,
            message: '请上传资源文件',
            trigger: 'change',
          },
        ],
        answersAudioFilelist: [
          {
            type: 'array',
            required: true,
            message: '请上传资源文件',
            trigger: 'change',
          },
        ],
        newOrderlist: [
          {
            required: true,
            message: '请打乱顺序后上传',
            trigger: 'blur',
          },
        ],
        region: [
          // { type: "array",required: true, message: "请选择难度", trigger: "change" },
          { validator: validatePass, required: true, trigger: 'change', message: "请选择难度" },
        ],
      },
      rules2: {
        tokinaga: [
          {
            required: true,
            message: '请输入游戏时长',
            trigger: 'blur',
          },
        ],
        num: [
          {
            required: true,
            message: '请输入答题数',
            trigger: 'blur',
          },
        ],
        num2: [
          {
            required: true,
            message: '请输入答题数',
            trigger: 'blur',
          },
        ],
        num3: [
          {
            required: true,
            message: '请输入答题数',
            trigger: 'blur',
          },
        ],
        num4: [
          {
            required: true,
            message: '请输入答题数',
            trigger: 'blur',
          },
        ],
        num5: [
          {
            required: true,
            message: '请输入答题数',
            trigger: 'blur',
          },
        ],
      },
      addDialogVisible: false,
      modDialogVisible: false,
      dialogVisible: false,
      musicUrl: '',
      // 改变上架状态loading
      shelvesLoading: false,
      activeName: 'second',
      modId: '',
      // 配置表
      configureDialogVisible: false,
      configureData: {},
      configureRuleForm: {
        tokinaga: 0,
        num: 0,
        num2: 0,
        num3: 0,
        num4: 0,
        num5: 0,
      },
      configureRuleFormTemp: {},
      levels: {
        levelOne: 1,
        levelTwo: 2,
        levelThree: 3,
        levelFour: 4,
        levelFive: 5,
      },
      searchRuleForm: {
        region: "",
        shelves: "",
      },
    }
  },
  methods: {
    search(formName) {
        this.currentPage = 1;
        this.getAllMusic();
    },
    getAllMusic() {
      let _this = this
      let from = {
        // parentId: this.parentId,.
        page: this.currentPage - 1,
        size: this.pageSize,
        sort: 'createdAt,desc',
      }
      if(_this.searchRuleForm.region){
        from.difficulty = _this.searchRuleForm.region;
      }
      from.shelves = _this.searchRuleForm.shelves; 
      
      // from.shelves && (from.shelves = _this.searchRuleForm.shelves);    
      if (_this.searchRuleForm.date && _this.searchRuleForm.date.length == 2) {
        let startTime = _this.searchRuleForm.date[0];
        let endTime = _this.searchRuleForm.date[1];
        startTime.setHours(0, 0, 0, 0);
        endTime.setHours(23, 59, 59, 999);
        from.startDate = startTime.getTime();
        from.endDate = endTime.getTime();
      }
      _this.$http.findAllSongRelay(from).then((res) => {
        console.log(res)
        this.musicdata = res.data.result.content
        this.total = res.data.result.totalElements
      })
    },
    shelvesChange(val) {
      // console.log(val)
      let _self = this
      let from = {
        id: val.id,
      }
      console.log(val.shelves)
      if (val.shelves == true) {
        //上架
        _self.$http.shelvesSongSolitaire(from).then((res) => {
          console.log(res)
          if (res.data.code == 0) {
            // console.log(';1233132')
            ElMessage({
              message: '上架成功',
              type: 'success',
            })
          }
        })
      } else {
        _self.$http.cancelShelvesSongSolitaire(from).then((res) => {
          console.log(res)
          if (res.data.code == 0) {
            ElMessage({
              message: '下架成功',
              type: 'success',
            })
          }
        })
      }
    },
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.getAllMusic()
    },
    addBtn() {
      this.addDialogVisible = true
    },
    modBtn(val) {
      this.modDialogVisible = true
      console.log(val)
      this.modifyruleForm.filelist.push({
        name: val.music,
        url: val.music,
      })
      this.modifyruleForm.answersAudioFilelist.push({
        name: val.answersAudio,
        url: val.answersAudio,
      })

      this.modId = val.id
      this.musicUrl = val.music
      this.modifyruleForm.lyrics = val.lyrics
      let originalArray = []
      this.modifyruleForm.region = val.difficulty
      // val.answers.forEach((item, index) => {
      //   originalArray.push({
      //     text: "",
      //     order: index,
      //   });
      // });
      // val.answers.forEach((item, index) => {
      //   originalArray[item.order].text = item.text;
      // });
      this.modifyruleForm.domains = val.answers
      console.log('originalArray', originalArray)
      this.modifyruleForm.newOrderlist = val.answers
      this.orderdata2 = val.answers
    },
    splitToDigit(str) {
      // console.log([...(str + "")].map(Number));
      return [...(str + '')]
    },
    shuffle(arr) {
      // let a = arr;
      for (let i = 0; i < arr.length; i++) {
        const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i
        ;[arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
      }
      // if (a == arr) {
      //   this.shuffle();
      // }
      // console.log(arr);
      return arr
    },
    delBtn(val) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          console.log(val)
          let from = {
            id: val.id,
          }
          this.$http.deletesongSolitaire(from).then((res) => {
            if (res.data.code == 0) {
              ElMessage({
                type: 'success',
                message: '删除成功',
              })
              this.getAllMusic()
            }
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          })
        })
    },
    closeDialog() {
      console.log('弹窗关闭')
      this.imageUrl = ''
      this.modifyruleForm.domains = [
        {
          text: '',
        },
      ]
      this.modifyruleForm.ordertext = ''
      this.modifyruleForm.filelist = []
      this.modifyruleForm.answersAudioFilelist = []

      this.ruleForm.domains = [
        {
          text: '',
        },
      ]
      this.ruleForm.answers = ''
      this.ruleForm.filelist = []
      this.ruleForm.answersAudioFilelist = []
      this.ruleForm.region = ''
      this.ruleForm.newOrderlist = []
      // this.resetForm("ruleForm");
      this.musicUrl = ''
      this.musicName = ''
      this.orderdata = []
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let from = {
            answers: this.ruleForm.domains,
            difficulty: this.ruleForm.region,
            lyrics: this.ruleForm.lyrics,
            music: this.musicUrl,
            answersAudio: this.answersAudioUrl,
          }
          console.log('from', from)
          // return;
          this.$http.addsongSolitaire(from).then((res) => {
            console.log(res)
            if (res.data.code == 0) {
              ElMessage({
                message: '添加成功',
                type: 'success',
              })
            }
            this.addDialogVisible = false
            this.getAllMusic()
          })
          // console.log("tempArray", tempArray);
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitForm2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let from = {
            answers: this.modifyruleForm.domains,
            difficulty: this.modifyruleForm.region,
            lyrics: this.modifyruleForm.lyrics,
            music: this.musicUrl || this.modifyruleForm.filelist[0].url,
            answersAudio: this.answersAudioUrl,
            id: this.modId,
          }
          console.log('from', from)
          // return;
          this.$http.modifySongSolitaire(from).then((res) => {
            console.log(res)
            if (res.data.code == 0) {
              ElMessage({
                message: '修改成功',
                type: 'success',
              })
              this.modDialogVisible = false
              this.getAllMusic()
            }
          })
        } else {
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    beforeUpload(file) {
      console.log(file)
      this.loading = ElLoading.service({
        lock: true,
        text: '正在上传...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      // console.log(this.ruleForm.filelist);
      uploadFile(file, async (res) => {
        console.log(res)
        if (res.code == 0) {
          this.musicUrl = res.result.fileName
          this.loading.close()
          console.log(this.ruleForm.filelist)
          if (this.ruleForm.filelist.length > 1) {
            this.ruleForm.filelist = [
              this.ruleForm.filelist[this.ruleForm.filelist.length - 1],
            ]
          }
        }
      })
      console.log(this.ruleForm.filelist)
      // console.log(this.fileList)
    },
    answersAudioBeforeUpload(file) {
      console.log(file)
      this.loading = ElLoading.service({
        lock: true,
        text: '正在上传...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      // console.log(this.ruleForm.filelist);
      uploadFile(file, async (res) => {
        console.log(res)
        if (res.code == 0) {
          this.answersAudioUrl = res.result.fileName
          this.loading.close()
          // console.log(this.ruleForm.filelist);
          // if (this.ruleForm.filelist.length > 1) {
          //   this.ruleForm.filelist = [
          //     this.ruleForm.filelist[this.ruleForm.filelist.length - 1],
          //   ];
          // }
        }
      })
      console.log(this.ruleForm.filelist)
      // console.log(this.fileList)
    },
    beforeUpload2(file) {
      console.log(file)
      this.loading = ElLoading.service({
        lock: true,
        text: '正在上传...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      // console.log(this.ruleForm.filelist);
      uploadFile(file, async (res) => {
        console.log(res)
        if (res.code == 0) {
          this.musicUrl = res.result.fileName
          this.loading.close()
          // console.log(this..filelist);
          if (this.modifyruleForm.filelist.length > 1) {
            this.modifyruleForm.filelist = [
              this.modifyruleForm.filelist[
                this.modifyruleForm.filelist.length - 1
              ],
            ]
          }
        }
      })
    },
    handleClick(tab) {
      // console.log(tab, event);
      console.log(this.activeName)
      console.log(tab.props)
      // this.activeName = tab.props.name;
      if (tab.props.name == 'first') {
        this.$router.push('./active')
      }
    },
    changeClick() {
      this.activeName = 'second'
      this.$router.push('./active')
    },
    addDomain() {
      console.log(this.ruleForm.domains.length)
      // if (this.ruleForm.domains.length <= 3) {
      this.ruleForm.domains.push({
        text: '',
      })
      this.modifyruleForm.domains.push({
        text: '',
      })
      // }
    },
    removeDomain(item) {
      if (this.ruleForm.domains.length-1 < 1) {
       
        return
      }else{
        console.log(this.ruleForm.domains.length-1);
        console.log(item);
        var index = this.ruleForm.domains.indexOf(item)
        
        if (index !== -1) {
          this.ruleForm.domains.splice(index, 1)
        }
        // if (index2 !== -1) {
        //   this.modifyruleForm.domains.splice(index, 1)
        // }
      }
      
    },
    removeDomain1(item) {

      if (this.modifyruleForm.domains.length-1 < 1) {
       
        return
      }else{
        console.log(this.modifyruleForm.domains.length-1);
        var index2 = this.modifyruleForm.domains.indexOf(item)
        if (index2 !== -1) {
          this.modifyruleForm.domains.splice(index2, 1)
        }
      }
      
    },
    back() {
      this.$router.back()
    },
    // 配置表
    async configure() {
      this.configureDialogVisible = true
      await this.getConfigureData()
    },
    // 获取配置表数据
    async getConfigureData() {
      let _this = this
      const {
        data: { code },
        data: { result },
      } = await _this.$http.findAllConfig()
      if (code === 0 && result) {
        console.log('获取配置表数据成功', result)
        _this.configureData = result || []
        // 获取列表中name为'song-solitaire-one-star'的数据赋值给this.configureRuleForm的num，以此类推
        _this.configureRuleForm.num =
          +_this.configureData.filter(
            (item) => item.name === 'song-solitaire-one-star'
          )[0].value || 0
        _this.configureRuleForm.num2 =
          +_this.configureData.filter(
            (item) => item.name === 'song-solitaire-two-star'
          )[0].value || 0
        _this.configureRuleForm.num3 =
          +_this.configureData.filter(
            (item) => item.name === 'song-solitaire-three-star'
          )[0].value || 0
        _this.configureRuleForm.num4 =
          +_this.configureData.filter(
            (item) => item.name === 'song-solitaire-four-star'
          )[0].value || 0
        _this.configureRuleForm.num5 =
          +_this.configureData.filter(
            (item) => item.name === 'song-solitaire-five-star'
          )[0].value || 0
        _this.configureRuleForm.tokinaga =
          +_this.configureData.filter(
            (item) => item.name === 'song-solitaire-game-time'
          )[0].value / 1000 || 0
        _this.configureRuleFormTemp = {
          ..._this.configureRuleForm,
        }
      } else {
        console.log('获取配置表数据失败')
      }
    },
    submitForm3(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('this.configureData', _this.configureData)
          console.log('this.configureRuleForm', _this.configureRuleForm)
          // 取出configureRuleForm中与configureRuleFormTemp不同的数据
          let arr = []
          for (let key in _this.configureRuleForm) {
            if (
              _this.configureRuleForm[key] !== _this.configureRuleFormTemp[key]
            ) {
              arr.push({
                name: key,
                value: _this.configureRuleForm[key],
              })
            }
          }

          _this.changeConfig(arr)
        }
      })
    },
    async changeConfig(array = []) {
      let _this = this
      // console.log('改变配置', array)
      if (array.length === 0) {
        _this.configureDialogVisible = false
        return
      }
      let params = {}
      let saveSuccess = true
      for (let index = 0; index < array.length; index++) {
        params = {}
        const { name } = array[index]
        if (name === 'num') {
          params = {
            ...params,
            id: _this.configureData.filter(
              (item) => item.name === 'song-solitaire-one-star'
            )[0].id,
            name: 'song-solitaire-one-star',
            value: _this.configureRuleForm.num,
          }
        } else if (name === 'num2') {
          params = {
            ...params,
            id: _this.configureData.filter(
              (item) => item.name === 'song-solitaire-two-star'
            )[0].id,
            name: 'song-solitaire-two-star',
            value: _this.configureRuleForm.num2,
          }
        } else if (name === 'num3') {
          params = {
            ...params,
            id: _this.configureData.filter(
              (item) => item.name === 'song-solitaire-three-star'
            )[0].id,
            name: 'song-solitaire-three-star',
            value: _this.configureRuleForm.num3,
          }
        } else if (name === 'num4') {
          params = {
            ...params,
            id: _this.configureData.filter(
              (item) => item.name === 'song-solitaire-four-star'
            )[0].id,
            name: 'song-solitaire-four-star',
            value: _this.configureRuleForm.num4,
          }
        } else if (name === 'num5') {
          params = {
            ...params,
            id: _this.configureData.filter(
              (item) => item.name === 'song-solitaire-five-star'
            )[0].id,
            name: 'song-solitaire-five-star',
            value: _this.configureRuleForm.num5,
          }
        } else if (name === 'tokinaga') {
          params = {
            ...params,
            id: _this.configureData.filter(
              (item) => item.name === 'song-solitaire-game-time'
            )[0].id,
            name: 'song-solitaire-game-time',
            value: _this.configureRuleForm.tokinaga * 1000,
          }
        }
        console.log('params', params)
        const {
          data: { code },
        } = await _this.$http.updateConfig(params)
        if (code !== 0) {
          saveSuccess = false
        }
      }
      if (saveSuccess) {
        _this.$message({
          message: '修改成功',
          type: 'success',
        })
      } else {
        _this.$message({
          message: '修改失败',
          type: 'error',
        })
      }
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      _this.$http.operateLogSave({
        operateLogType: 'ADMIN_OPT',
        detail: `管理员 [${userInfo.name}] 修改了歌词接龙游戏配置项`,
      })
      _this.configureDialogVisible = false
    },
  },
  mounted() {
    this.getAllMusic()
    // this.activeName = 'first'
    // this.shuffle([1,2,3,4,5,6])
  },
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
    flex-wrap: wrap;
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
    .el-tabs {
      width: 50%;
      height: 100%;
      margin-left: 20px;
      display: flex;
      align-items: center;
    }
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
    height: 10%;
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
.card_order {
  .el-input {
    width: 90%;
  }
}
.el-breadcrumb {
  display: flex;
  font-size: 1rem;
  margin-left: 15px;
}
// .card_opt {
//   position: absolute;
//   right: 50px;
//   top: 25px;
//   .el-button {
//     margin-right: 30px;
//   }
// }
.newOrderlist {
  width: 100%;
  :deep(.el-form-item__label) {
    width: 62px !important;
  }
  label {
    border: 1px red solid;
  }
}
.search-box {
  margin: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  // padding: 0 14px;
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
