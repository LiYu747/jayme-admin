<template>
  <div class="sidebar">
    <p class="title">JayMe小程序后台</p>
    <el-menu
      class="sidebar-el-menu"
      background-color="#282E38"
      text-color="#fff"
      :default-active="onRoutes"
      @select="selectPath"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index">
            <template #title>
              <i
                :class="item.icon"
                style="margin-right: 6px; font-size: 24px"
              ></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="(subItem, i) in item.subs"
              :key="i"
              :index="subItem.index"
            >
              {{ subItem.title }}
              
            </el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i
              :class="item.icon"
              style="margin-right: 6px; font-size: 24px"
            ></i>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      collapse: false,
      pathTo: '',
      parentLevel: null,
      items: [],
      items1: [
        {
          icon: 'iconfont icon-integral',
          index: 'home',
          idCode: 101,
          title: '首页管理',
          subs: [
            {
              index: '/atlasManage',
              title: '图集管理',
            },
            {
              index: '/newsManage',
              title: '资讯管理',
            },
            {
              index: '/insManage',
              title: 'ins管理',
            },
            {
              index: '/bannerManage',
              title: 'banner管理',
            },
          ],
        },
        {
          icon: 'iconfont icon-Customermanagement',
          index: 'userManage',
          idCode: 102,
          title: '用户管理',
          // subs: [],
        },
        {
          icon: 'iconfont icon-good',
          index: 'active',
          idCode: 106,
          title: '活动管理',
          subs: [
            {
              index: '/listenSong',
              title: '听歌猜歌名',
            },
            {
              index: '/soundhound',
              title: '歌词接龙',
            },
            {
              index: '/votingcontent',
              title: '投票内容',
            },
            {
              index: '/votingrecord',
              title: '用户投票记录',
            },
            // {
            //   index: "active",
            //   title: "活动管理",
            // },
          ],
        },
        // {
        //   icon: "iconfont icon-integral",
        //   index: "category",
        //   idCode: 101,
        //   title: "分类管理",
        // },
        // {
        //   icon: "iconfont icon-video",
        //   index: "commodity",
        //   idCode: 102,
        //   title: "商品管理",
        // },
        // {
        //   icon: "iconfont icon-Customermanagement",
        //   index: "users",
        //   idCode: 103,
        //   title: "用户管理",
        // },
        // {
        //   icon: "iconfont icon-shuffling-banner",
        //   index: "banner",
        //   idCode: 104,
        //   title: "广告管理",
        // },
        // {
        //   icon: "iconfont icon-good",
        //   index: "recommend",
        //   idCode: 105,
        //   title: "推荐管理",
        // },
        // {
        //   icon: "iconfont icon-good",
        //   index: "order",
        //   idCode: 107,
        //   title: "订单管理",
        // },
        {
          icon: 'iconfont icon-set',
          index: 'rafflemanage',
          title: '抽奖管理',
          idCode: 107,
        },

        {
          icon: 'iconfont icon-set',
          index: 'administratorList',
          title: '管理员设置',
          idCode: 999,
          name: '管理员设置',
          subs: [
            {
              index: '/administratorList',
              title: '管理员列表',
            },
            {
              index: '/operationNote',
              title: '日志管理',
            },
            {
              index: '/jurisdiction',
              title: '权限管理',
            },
            {
              index: '/role',
              title: '角色管理',
            },
          ],
        },
      ],
    }
  },
  computed: {
    onRoutes() {
      // 默认展开的菜单
      let _this = this
      return this.$route.path.replace('/', '')
    },
  },
  methods: {
    selectPath(index) {
      this.pathTo = index
    },
    uniq(array) {
      var temp = []
      var l = array.length
      for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
          if (array[i].id === array[j].id) {
            i++
            j = i
          }
        }
        temp.push(array[i])
      }
      return temp
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    const userInfoRole = JSON.parse(sessionStorage.getItem('userRole'))
    const userRole = this.uniq(userInfoRole)
    if (userInfoRole) {
      for (let i = 0; i < this.items1.length; i++) {
        for (let j = 0; j < userRole.length; j++) {
          if (this.items1[i].idCode == userRole[j].idCode) {
            this.items.push(this.items1[i])
            console.log(this.items);
          }
        }
      }
    } else {
      this.$router.push('/')
    }

    this.routes = this.$route
  },
}
</script>
<style lang="scss">
.sidebar {
  height: 100%;

  .el-menu {
    border-right: none;
  }

  .title {
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 18px;
  }

  .el-menu-item {
    height: 44px;
    line-height: 44px;
  }

  .sidebar-el-menu {
    .cachebtn {
      margin-top: 80px;
      text-align: center;
      width: 100%;
    }
  }

  .sidebar-foot {
    div {
      padding-left: 30px;
      height: 30px;
      line-height: 30px;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;

      a {
        color: black;
        width: 100%;
        height: 100%;
        display: inline-block;
        text-decoration: none;
      }
    }
  }
}
</style>
