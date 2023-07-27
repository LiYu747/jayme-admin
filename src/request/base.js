/**
 * 接口域名的管理
 * @param {String} apiServer [api服务器]
 * @param {String} knobbleServer [小节内容上传服务器]
 */
const baseLsit =[
    {    
        apiServer: 'http://10.0.30.117:10089',//开发服务器(任) 0
        knobbleServer: 'http://10.0.30.117/section',//开发服务器
        // knobbleServer: 'http://10.0.30.109:8199',//开发服务器
    },
    {    
        apiServer: 'http://10.0.30.109:10089',//开发服务器(李) 1
        knobbleServer: 'http://10.0.30.109/section',//开发服务器
        // knobbleServer: 'http://10.0.30.109:8199',//开发服务器
    },
    {
        apiServer: 'https://jayme-wx-service.sdp.101.com',//正式服务器 2
        knobbleServer:"https://jayme-wx-service.sdp.101.com/section"//正式服务器
    },
    {
        apiServer: 'https://jayme-api.boran-tech.com',//测试环境服务器 3
        knobbleServer:"https://jayme-api.boran-tech.com/section"//测试环境服务器
    },
    {
        apiServer: 'https://jayme-wx-service.beta.101.com',//网龙预生产环境 4
        knobbleServer:"https://jayme-wx-service.beta.101.com/section"//网龙预生产环境
    }
]
const ServerNumber = process.env.VUE_APP_SERVER_ID?process.env.VUE_APP_SERVER_ID:1;
// const ServerNumber = 1;
const base = baseLsit[ServerNumber];

export default base;

