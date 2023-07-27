<template>
  <el-container class="body-wrap">
    <sidebar id="leftContent" />
    <el-container>
      <el-header class="elHeader">
        <div class="bigLeft">
          <div class="left" @click="onPersonalSetting">
            <span>{{ userInfo.name ? userInfo.name : '管理员' }}</span>
          </div>
          <div class="left" @click="onLogOut">
            <!-- <i class="iconfont icon-tuichu" style="margin-right: 5px"></i> -->
            <span>退出</span>
          </div>
        </div>
      </el-header>
      <el-main id="rightContent">
        <div class="main">
          <!-- <div style="height: 60px"></div> -->
          <!-- <div class="breadcrumbBox" v-if="routerDate.length >= 1">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <template v-for="(item, index) in routerDate">
                <el-breadcrumb-item v-if="item.path == 'null'" :key="index">{{
                  item.name
                }}</el-breadcrumb-item>
                <el-breadcrumb-item
                  v-else
                  :key="index+1000"
                  :to="{ path: item.path }"
                  >{{ item.name }}</el-breadcrumb-item
                >
              </template>
            </el-breadcrumb>
          </div> -->

          <div style="height: 100%;">
            <router-view v-if="$route.meta.keepAlive" v-slot="{ Component }">
              <transition name="move" mode="out-in">
                <keep-alive>
                  <component :is="Component"></component>
                </keep-alive>
              </transition>
            </router-view>

            <router-view v-if="!$route.meta.keepAlive" v-slot="{ Component }">
              <transition>
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import sidebar from './Sidebar'
export default {
  data() {
    return {
      userInfo: {},
    }
  },
  components: {
    sidebar,
  },
  computed: {
    routerDate() {
      return this.$store.state.routerList
    },
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // console.log(this.$store.state.routerList);
    // this.routerDate=this.$store.state.routerList
  },
  methods: {
    onLogOut() {
      let _this = this
      const token = JSON.parse(sessionStorage.getItem('userInfo')).access_token
      _this
        .$confirm('确认退出吗?', '提示', {
          type: 'warning',
        })
        .then(() => {
          // _this.$router.push("/");
          this.$http.logouting({ access_token: token }).then((res) => {
            if (res.data.code === 0) {
              sessionStorage.removeItem('userInfo')
              sessionStorage.removeItem('userRole')
              sessionStorage.removeItem('routerDate')
              _this.$store.commit('logOut')
              _this.$router.push('/')
            } else {
              _this.$message({
                type: 'error',
                message: res.data.msg,
              })
            }
          })
        })
        .catch(() => {})
    },
    onPersonalSetting() {
      this.$router.push('/personalSetting')
    },
  },
}
</script>
<style lang="scss" scoped>
.main{
  height: 100%;
}
.body-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  .elHeader {
    line-height: 60px;
    height: 60px;
    background-color: rgb(36, 104, 169);
    color: #fff;

    .bigLeft {
      float: right;
      font-size: 16px;
      text-align: right;
      display: flex;
      .left {
        cursor: pointer;
        display: inline-block;
        height: 100%;
        margin-left: 30px;
        i {
          font-size: 20px;
        }
      }
    }
  }
  .breadcrumbBox {
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    padding-left: 25px;
    box-sizing: border-box;
    background-color: rgb(240, 240, 242);
    position: fixed;
    top: 60px;
    z-index: 20;
    i {
      font-size: 18px;
      margin-right: 10px;
    }
    .el-breadcrumb__item {
      font-size: 16px;
    }
  }
  #leftContent {
    z-index: 999;
    min-width: 200px;
    // border-right: 1px solid #dddddd;
    min-height: 100%;
    overflow-y: auto;
    background-color: #282e38;
    color: #fff;
    // @media screen and (max-width: 500px) {
    //     position: absolute;
    //     left: -200px;
    // };
  }
  #rightContent {
    z-index: 1;
    // min-height: 100%;
    // background-color: #eaeaea;
    // @media screen and (max-width: 500px) {
    //     margin-left: 0;
    // };
    // .el-mian{
    padding: 0;
    // }
    .header {
      background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      align-items: center;
      .top-nav {
        width: 200px;
        display: flex;
        justify-content: space-around;
      }
    }
  }
}
</style>
<style>
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload:hover {
  border-color: #409eff;
}
</style>
