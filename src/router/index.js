import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/login.vue"),
  },
  {
    path: "/homePage",
    name: "homePage",
    component: () => import("@/layout/layout.vue"),
    children: [
      {
        path: "/category",
        name: "category",
        component: () =>
          import(/* webpackChunkName: "order" */ "@/views/category/index"),
        meta: {
          title: "分级管理",
          parentLevel: 101,
          keepAlive: true,
        },
      },
      {
        path: "/checkCategory",
        name: "checkCategory",
        component: () =>
          import(
            /* webpackChunkName: "order" */ "@/views/category/checkCategory"
          ),
        meta: {
          title: "查看分级",
          parentLevel: 101,
          keepAlive: false,
        },
      },
      {
        path: "/checkdeepCategory",
        name: "checkdeepCategory",
        component: () =>
          import(
            /* webpackChunkName: "order" */ "@/views/category/checkdeepCategory"
          ),
        meta: {
          title: "查看深层分级",
          parentLevel: 101,
          keepAlive: true,
        },
      },
      {
        path: "/commodity",
        name: "commodity",
        component: () =>
          import(/* webpackChunkName: "order" */ "@/views/commodity/index"),
        meta: {
          title: "商品管理",
          parentLevel: 102,
          keepAlive: false,
        },
      },
      {
        path: "/upload",
        name: "upload",
        component: () =>
          import(/* webpackChunkName: "order" */ "@/views/commodity/uploadRes"),
        meta: {
          title: "资源上传",
          parentLevel: 102,
          keepAlive: true,
        },
      },
      {
        path: "/modifyRes",
        name: "modifyRes",
        component: () =>
          import(/* webpackChunkName: "order" */ "@/views/commodity/modifyRes"),
        meta: {
          title: "资源修改",
          parentLevel: 102,
          keepAlive: true,
        },
      },
      {
        path: "/users",
        name: "users",
        component: () =>
          import(/* webpackChunkName: "order" */ "@/views/users/index"),
        meta: {
          title: "用户管理",
          parentLevel: 103,
          keepAlive: true,
        },
      },
      {
        path: "/atlasManage",
        name: "atlasManage",
        component: () =>
          import(/* webpackChunkName: "atlasManage" */ "@/views/mainpage/atlasManage"),
        meta: {
          title: "图集管理",
          parentLevel: 101,
          keepAlive: false,
        },
      },
      {
        path: "/atlasContent/:id",
        name: "atlasContent",
        component: () =>
          import(/* webpackChunkName: "atlasManage" */ "@/views/mainpage/atlasContent"),
        meta: {
          title: "图集管理",
          parentLevel: 101,
          keepAlive: false,
        },
      },
      {
        path: "/newsManage",
        name: "newsManage",
        component: () =>
          import(/* webpackChunkName: "newsManage" */ "@/views/mainpage/newsManage"),
        meta: {
          title: "资讯管理",
          parentLevel: 101,
          keepAlive: false,
        },
      },
      {
        path: "/insManage",
        name: "insManage",
        component: () =>
          import(/* webpackChunkName: "insManage" */ "@/views/mainpage/insManage"),
        meta: {
          title: "ins管理",
          parentLevel: 101,
          keepAlive: false,
        },
      },
      {
        path: "/bannerManage",
        name: "bannerManage",
        component: () =>
          import(/* webpackChunkName: "bannerManage" */ "@/views/mainpage/bannerManage"),
        meta: {
          title: "banner管理",
          parentLevel: 101,
          keepAlive: false,
        },
      },
      {
        path: "/active",
        name: "active",
        component: () =>
          import(/* webpackChunkName: "active" */ "@/views/active/index"),
        meta: {
          title: "活动管理",
          parentLevel: 106,
          // keepAlive: true,
        },
      },
      {
        path: "/listenSong",
        name: "listenSong",
        component: () =>
          import(/* webpackChunkName: "listenSong" */ "@/views/active/listenSong"),
        meta: {
          title: "听歌猜歌名",
          parentLevel: 106,
          keepAlive: true,
        },
      },
      {
        path: "/soundhound",
        name: "soundhound",
        component: () =>
          import(/* webpackChunkName: "soundhound" */ "@/views/active/soundhound"),
        meta: {
          title: "歌词接龙",
          parentLevel: 106,
          keepAlive: true,
        },
      },
      {
        path: "/votingcontent",
        name: "votingcontent",
        component: () =>
          import (/* webpackChunkName: "soundhound" */ "@/views/active/votingcontent"),
        meta: {
          title:"投票内容",
          parentLevel: 106,
          keepAlive:true
        }
      },
      {
        path: "/votingrecord",
        name: "votingrecord",
        component: () =>
          import (/* webpackChunkName: "soundhound" */ "@/views/active/votingrecord"),
        meta: {
          title:"用户投票记录",
          parentLevel: 106,
          keepAlive:false
        }
      },
      {
        path: "/detailed",
        name: "detailed",
        component: () =>
          import (/* webpackChunkName: "soundhound" */ "@/views/active/detailed"),
        meta: {
          title:"投票内容详情",
          parentLevel: 106,
          keepAlive:false
        }
      },
      {
        path: "/order",
        name: "order",
        component: () =>
          import(/* webpackChunkName: "order" */ "@/views/order/index"),
        meta: {
          title: "订单管理",
          parentLevel: 107,
          keepAlive: true,
        },
      },
      {
        path: "/personalSetting",
        name: "personalSetting",
        component: () =>
          import(
            /* webpackChunkName: "personal" */ "@/views/personalSetting/personalSetting.vue"
          ),
        meta: {
          title: "个人设置",
          parentLevel: 11,
        },
      },
      {
        path: "/administratorList",
        name: "administratorList",
        component: () =>
          import(
            /* webpackChunkName: "role" */ "@/views/administratorSet/administratorList"
          ),
        meta: {
          title: "管理员列表",
          parentLevel: 999,
        },
      },
      {
        path: "/jurisdiction",
        name: "jurisdiction",
        component: () =>
          import(
            /* webpackChunkName: "role" */ "@/views/administratorSet/jurisdiction"
          ),
        meta: {
          title: "权限管理",
          parentLevel: 999,
        },
      },
      {
        path: "/role",
        name: "role",
        component: () =>
          import(
            /* webpackChunkName: "role" */ "@/views/administratorSet/role"
          ),
        meta: {
          title: "角色管理",
          parentLevel: 999,
        },
      },
      {
        path: "/operationNote",
        name: "operationNote",
        component: () =>
          import(
            /* webpackChunkName: "operation" */ "@/views/administratorSet/operationNote"
          ),
        meta: {
          title: "日志管理",
          parentLevel: 999,
        },
      },
      {
        path: "/banner",
        name: "banner",
        component: () =>
          import(/* webpackChunkName: "banner" */ "@/views/banner/index"),
        meta: {
          title: "广告管理",
          parentLevel: 104,
        },
      },
      {
        path: "/recommend",
        name: "recommend",
        component: () =>
          import(/* webpackChunkName: "recommend" */ "@/views/recommend/index"),
        meta: {
          title: "推荐管理",
          parentLevel: 105,
        },
      },
      {
        path: "/recommendRes",
        name: "recommendRes",
        component: () =>
          import(
            /* webpackChunkName: "recommendRes" */ "@/views/recommend/resource"
          ),
        meta: {
          title: "资源推荐",
          parentLevel: 105,
        },
      },
      {
        path: "/recommendBook",
        name: "recommendBook",
        component: () =>
          import(
            /* webpackChunkName: "recommendBook" */ "@/views/recommend/newBook"
          ),
        meta: {
          title: "新上书籍",
          parentLevel: 105,
        },
      },
      {
        path: "/userManage",
        name: "userManage",
        component: () =>
          import(
            /* webpackChunkName: "userManage" */ "@/views/userManage/index"
          ),
        meta: {
          title: "用户管理",
          parentLevel: 102,
        },
      },
      //抽奖管理
      {
        path: "/rafflemanage",
        name: "rafflemanage",
        component: () =>
          import(/* webpackChunkName: "order" */ "@/views/rafflemanage/index"),
        meta: {
          title: "抽奖管理",
          parentLevel: 999,
        },
      },
      {
        path: "/addluckydraw",
        name: "addluckydraw",
        component: () =>
          import(/* webpackChunkName: "atlasManage" */ "@/views/rafflemanage/addluckydraw"),
        meta: {
          title: "创建抽奖活动",
          
        },
      },
      {
        path: "/winninglist",
        name: "winninglist",
        component: () =>
          import(/* webpackChunkName: "atlasManage" */ "@/views/rafflemanage/winninglist"),
        meta: {
          title: "中奖名单",
          
        },
      },
      {
        path: "/eventdetails",
        name: "eventdetails",
        component: () =>
          import(/* webpackChunkName: "atlasManage" */ "@/views/rafflemanage/eventdetails"),
        meta: {
          title: "活动详情",
          
        },
      },
      
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
