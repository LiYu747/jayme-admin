<template>
  <div class="resource">
    <div class="card_header">
      <div class="card_header_left">
        <el-breadcrumb separator-icon="ArrowRightBold">
          <el-breadcrumb-item :to="{ path: '/recommend' }"
            >推荐管理</el-breadcrumb-item
          >
          <el-breadcrumb-item :to="{ path: '/recommendRes' }"
            >资源推荐</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="card_header_right"></div>
    </div>
    <div class="card_content"></div>
    <div class="card_footer"></div>
  </div>
</template>

<script>
import { ArrowRightBold } from "@element-plus/icons-vue";
export default {
  name: "resource",
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.resource {
  box-sizing: border-box;
  height: calc(100vh - 60px);
  border: 1px red solid;
  display: flex;
  flex-wrap: wrap;
  .card_header {
    width: 100%;
    height: 10%;
    border: 1px red solid;
    box-sizing: border-box;
    display: flex;
    .card_header_left {
      width: 50%;
      border: 1px red solid;
      display: flex;
      .el-breadcrumb {
        width: 100%;
        height: 100%;
        border: 1px red solid;
        display: flex;
        font-size: 1.1rem;
      }
    }
  }
  .card_content {
    width: 100%;
    height: 80%;
    border: 1px red solid;
    box-sizing: border-box;
  }
  .card_footer {
    width: 100%;
    height: 10%;
    border: 1px red solid;
    box-sizing: border-box;
  }
}
</style>
