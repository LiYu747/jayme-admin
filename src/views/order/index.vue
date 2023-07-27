<template>
  <div class="active">
    <div class="card_header">
      <el-button @click="addBtn">添加</el-button>
    </div>
    <div class="card_content">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="selection" width="30px" />
        <el-table-column prop="date" label="ID" width="180" />

        <el-table-column prop="address" label="商品封面">
          <template #default="scope">
            <!-- {{scope.row}} -->
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.url"
              :preview-src-list="scope.row.url"
              fit="cover"
            />
            <!-- <img
              style="width: 100px; height: 100px"
              :src="scope.row.url"
              alt=""
            /> -->
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
        <el-table-column prop="address" label="Address" />
        <el-table-column prop="address" label="Address" />
        <el-table-column prop="" label="是否上架">
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
        <el-table-column label="操作">
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
    <el-dialog
      class="addDialog"
      v-model="addDialogVisible"
      width="800px"
      :append-to-body="true"
      @close="closeDialog"
    >
      <template #header>
        <div class="header-box">添加商品</div>
      </template>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="addruleForm"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="filelist">
          <el-upload
            action="#"
            accept="image/*"
            :auto-upload="true"
            :show-file-list="false"
            :http-request="beforeUpload"
            :file-list="ruleForm.filelist"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <!-- <el-dialog v-model="dialogVisible" class="showdialog">
          <img :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog> -->
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                placeholder="选择时间"
                v-model="ruleForm.date2"
                style="width: 100%"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
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
        <div class="header-box">修改商品</div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { UploadFile, ElMessage, ElMessageBox } from "element-plus";
import { uploadMultiple } from "@/utils/uploadVideo";
export default {
  name: "active",
  data() {
    return {
      currentPage: 1,
      pageSize: 3,
      total: 90,
      tableData: [
        {
          date: "2016-05-03",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
          // url: "https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=false&word=%E5%91%A8%E6%9D%B0%E4%BC%A6&step_word=&hs=0&pn=0&spn=0&di=46137345&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=2&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=-1&cs=2973991832%2C2507809645&os=390947551%2C2910471118&simid=3975263118%2C550298953&adpicid=0&lpn=0&ln=708&fr=&fmq=1670927128942_R&fm=result&ic=&s=undefined&hd=&latest=&copyright=&se=&sme=&tab=0&width=&height=&face=undefined&ist=&jit=&cg=star&bdtype=11&oriquery=&objurl=https%3A%2F%2Fgimg2.baidu.com%2Fimage_search%2Fsrc%3Dhttp%3A%2F%2Fp8.itc.cn%2Fq_70%2Fimages03%2F20221213%2F6ea4b3f2f4aa443b91f524ab20ca4da0.jpeg%26refer%3Dhttp%3A%2F%2Fp8.itc.cn%26app%3D2002%26size%3Df9999%2C10000%26q%3Da80%26n%3D0%26g%3D0n%26fmt%3Dauto%3Fsec%3D1673519131%26t%3Dc276ca55273a792b8193d27bddc0a2a0&fromurl=ippr_z2C%24qAzdH3FAzdH3Fgjof_z%26e3Bf5i7_z%26e3Bv54AzdH3FwAzdH3Fm8mm9ml99_8d88ddbb9&gsm=1e&rpstart=0&rpnum=0&islist=&querylist=&nojc=undefined&dyTabStr=MCwzLDYsNyw0LDIsMSw1LDgsOQ%3D%3D",
        },
        {
          date: "2016-05-02",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-04",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-01",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
      ],
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        filelist: [],
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        filelist: [
          {
            type: "array",
            required: true,
            message: "请至少上传一张封面",
            trigger: "change",
          },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
      addDialogVisible: false,
      modDialogVisible: false,
      dialogVisible: false,
      imageUrl: "",
      // 改变上架状态loading
      shelvesLoading: false,
    };
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val);
    },
    addBtn() {
      this.addDialogVisible = true;
    },
    modBtn() {
      this.modDialogVisible = true;
    },
    delBtn() {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ElMessage({
            type: "success",
            message: "删除成功",
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
      this.imageUrl = ""
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    beforeUpload(file) {
      console.log(file);
      console.log(this.ruleForm.filelist);
      uploadMultiple(file, (res) => {
        console.log(res);
        this.imageUrl = res.url;
        // this.ruleForm.filelist.push({
        //   name:
        // })
      });
    },
  },
};
</script>

<style lang="less" scoped>
.active {
  width: 100%;
  height: calc(100vh - 60px);
  box-sizing: border-box;
  border: 1px red solid;
  display: flex;
  flex-wrap: wrap;
  .card_header {
    width: 100%;
    height: 10%;
    border: 1px red solid;
  }
  .card_content {
    width: 100%;
    height: 80%;
    // border: 1px red solid;
    .handle {
      // border: 1px red solid;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  }
  .card_footer {
    width: 100%;
    height: 10%;
    border: 1px red solid;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.addruleForm {
  border: 1px red solid;
}
:deep(.cell) {
  text-align: center;
}
:deep(.showdialog) {
  // border: 1px red solid;
  .el-dialog__body {
    // border: 1px red solid;
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
</style>
