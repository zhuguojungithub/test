# 全时系统

全时系统是全时天地在线研发的一款朋友圈广告投放平台

仓库地址：[http://gitlab.372163.com:8081/tdsys/tdsysApp](http://gitlab.372163.com:8081/tdsys/tdsysApp)

线上地址：[https://tdsys.372163.com](https://tdsys.372163.com)

开发环境：[http://tdsysdev.372163.com](http://tdsysdev.372163.com)

测试环境：[http://tdsysfull.372163.com](http://tdsysfull.372163.com)

#### 支持浏览器
- IE11
- Edge
- Chrome
- Firefox
- QQ浏览器9

#### 安装
`npm install`

#### 启动
`npm run start`

浏览器访问：`localhost:3000`

#### 构建
`npm run build`

#### 运行环境
- nodejs v8.11.1
- npm v6.0.0

#### Team
- 产品经理：高源
- UI：马文惠
- 前端：徐忠元 朱国军 
- 后端：左珅 岳松燃 张吉日木图 杨烈
- QA：祁慧 闫飞飞

#### 技术栈
- react
- react-router v4
- redux
- react-redux
- redux-saga
- antd
- echarts
- sass
- webpack

#### 版本工具
- git
- svn

#### 前端架构
```
.
├── build                           # 生产文件（构建后的前端文件）
│   ├── index.html                  # html
│   └── static                      # 构建后的文件
│       ├── css                     # css
│       ├── js                      # js
│       └── media                   # images/font/video
├── config                          # webpack相关配置文件
├── public                          # 静态资源
├── scripts                         # 本地服务器及构建相关文件
├── src                             # 开发文件（所有的业务模块）
│   ├── index.js                    # 入口文件
│   ├── APP.js                      # 放置一级路由和公共资源样式等
│   ├── api                         # 接口配置文件
│   ├── assets                      # 全局资源文件
│   │   ├── style                   # 全局样式
│   │   │   ├── index.scss          # 全局样式入口
│   │   │   ├── _common.scss        # 公共样式
│   │   │   ├── _mixins.scss        # mixins
│   │   │   ├── _variables.scss     # 变量模块
│   │   │   ├── _breakpoints.scss   # 响应断点
│   │   │   └── _normalize.css      # 初始样式
│   │   └── images                  # 全局公共图片
│   ├── components                  # 全局公共组件
│   │   ├── LayoutMain              # 前台布局组件
│   │   ├── LayoutAdmin             # 后台布局组件
│   │   └── loading                 # loading组件
│   ├── containers                  # redux 容器组件
│   ├── actions                     # 全局 actions
│   ├── reducers                    # 全局 reducers
│   ├── store                       # store
│   ├── sagas                       # redux-sagas
│   ├── page                        # 业务组件（与路由保持一致）
│   │   ├── home                    # 首页
│   │   │   ├── index.js            # 首页入口
│   │   │   ├── assets              # 首页资源文件
│   │   │   └── Carousel.js         # 轮播组件
│   │   ├── login                   # 登陆注册
│   │   │   ├── index.js            # 
│   │   │   ├── assets              # 
│   │   │   └── Main.jsx            # 
│   │   └── admin                   # 后台目录
│   │       ├── index.js            # 后台入口文件
│   │       ├── Main.js             # 后台首页
│   │       ├── asstes              # 后台公共资源文件
│   │       │   ├── images          # 后台公共图片
│   │       │   └── style.scss      # 后台公共样式
│   │       │── Routes.js           # 后台路由
│   │       ├── product             # 广告套餐
│   │       ├── search              # 客户搜索
│   │       ├── account             # 账号管理
│   │       ├── message             # 消息通知
│   │       └── customer            # 客户列表
│   ├── tools                       # 工具助手
│   ├── Modal.jsx                   # portal
│   ├── componentsTemp.jsx          # react组件样板
│   └── Routes.js                   # 路由
├── gitignore                       # git配置文件
├── package.json                    # 项目依赖包
└── README.md                       # 文档
```

#### 开发规范
- 关于html
    - 全部使用html5语义化标签
- 关于样式
    - 类名使用中横岗 `user-name`
    - sass模块定义 `"_" + 名称.scss`
    - 使用flex布局
- 关于js
    - 使用es6语法进行开发
        - 变量声明
            - 使用驼峰命名规则 `userName`
            - 使用const let。
            - 当一次声明多个变量时，不要使用逗号，每个变量前都应该有const或let关键字。
        - 使用箭头函数 () => {}
        - 解构
        - 异步使用async函数编写，尽量不用回调
    - 代码结尾不加分号
    - 字符串类型使用单引号 ''
    - 代码层级4空格缩进 CRLF
    - 条件比较使用严格模式 `=== !==`
- 关于组件
    - 模块拆分：当代码超过500行，必须要进行模块拆分

#### 其他说明
- 一般每个page下的模块都会一个index.js和一个Main.js。如果当前页面拥有二级路由，则index.js里主要用来配置动态路由和公共样式文件，而Main.js用来放当前路由的首页内容。
- 

