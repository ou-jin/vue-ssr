# RIS 放射信息管理系统

### 1.软件功能介绍

### 2. 安装环境和运行方法

##### 1）环境依赖
环境版本：

```
"engines": {
    "node": ">= 6.0.0",
    "npm": ">= 3.0.0"
  }
```
重要依赖：
```
"dependencies": {
    "element-ui": "^2.9.1" // elementUI版本号
    "dexie": "^2.0.4", // indexDB插件
    "js-md5": "^0.7.3", // md5密码加密
    "vue-clipboard2": "^0.3.0", // 剪贴板
    "vuedraggable": "^2.21.0", // vue拖拽插件
}
"devDependencies": {
    "sass-loader": "^7.1.0", // css预处理
}
```

##### 2）运行命令
```
npm install // 安装依赖

npm run proto // 编译生成proto.js

npm run dev // 运行项目

npm run build // 打包项目
```

### 3. 代码目录结构说明
```
|-- deveop
    |-- .babelrc
    |-- .editorconfig
    |-- .gitignore
    |-- .postcssrc.js
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- build
    |-- config
    |-- src
    |   |-- App.vue
    |   |-- main.js
    |   |-- assets
    |   |   |-- common.css
    |   |   |-- common.scss
    |   |   |-- convert_pinyin.js // 中文转拼音插件
    |   |   |-- lock.js // 系统锁定
    |   |   |-- mixin.scss
    |   |   |-- print // 打印插件引用
    |   |   |-- font
    |   |-- components
    |   |-- config
    |   |   |-- apiConfig.js
    |   |   |-- dbConfig.js
    |   |   |-- expandListMixin.js
    |   |   |-- fcnTemplate.js // 通用方法
    |   |   |-- formLengthValidata.js
    |   |   |-- generalMethod.js // 通用方法
    |   |   |-- iconConfig.js
    |   |   |-- innerModelMixin.js
    |   |   |-- lengthValidate.js
    |   |   |-- miniStore.js
    |   |   |-- mixinConfig.js
    |   |   |-- paramsHandler.js // 请求参数params处理
    |   |   |-- pluginConfig.js
    |   |   |-- proxyConfig.js
    |   |   |-- routerConfig.js // router配置
    |   |   |-- vuexConfig.js
    |   |   |-- jsonApi // json通信方式
    |   |   |-- protoApi // protobuf通信方式
    |   |   |-- store
    |   |-- configFile
    |   |   |-- contextMenus.js // 列表右键功能集合
    |   |   |-- global.js // 全局常量定义
    |   |   |-- pageConfig.js // 侧边栏导航页面配置
    |   |   |-- paramsLength.js // 参数长度判断
    |   |   |-- validator.js // 表单验证规则
    |   |   |-- proto // proto文件
    |   |-- excel
    |   |-- plugins
    |   |   |-- contextmenu
    |   |   |-- multiselect
    |   |   |-- textarea
    |   |   |-- tree
    |   |-- views
    |-- static
        |-- .gitkeep
        |-- favicon.ico
        |-- file // api接口文件
        |-- fonts // 字体文件
        |-- icon // svgIcon图片
        |-- image // 普通svg/png图片
        |-- js
        |   |-- globalConfig.js // 域名配置
        |-- scss
        |-- style
        |-- theme // 主题色
```


### 4.特殊模块说明
##### 1）公共组件 
> 项目所有的公共组件或者说通用组件路径为 ```src>components>common```
> 通用组件无需在页面单```import```，可直接使用。
> 具体配置方法： ```src>config>pluginConfig.js```

##### 2）系统锁定 src>assets>lock.js
> 系统锁定原理是：
> 1.获取参数设置的锁定时间，定时器监听```document.onmousemove``` 事件, 在超过锁定时间未动鼠标的情况下锁定系统;
> 2. 获取参数设置的锁定时间，定时器监听```document.onkeyup``` 事件, 在超过锁定时间键盘未输入的情况下锁定系统。
##### 3）主题色配置
> 更换主题色，首先需要生成一套主题色文件，以主题色命名，包含一个fonts文件夹和一个index.css 
> 生成主题色需要一个工具项目hdh电脑D盘【thememaker】
> 主题色文件目录结构：
> ```
> |-- theme
> |   |-- 7fb9a2
> |   |   |-- fonts
> |   |   |-- index.css
> ```
##### 4）支持 protobuf 与 json 通讯
> 本项目支持两种通信方式：
> (1) protobuf
> > 配置路径：```src>config>protoApi```
> > proto文件存放路径： ```src>configFile>proto```
> ```
> |-- protoApi
> |   |-- protoApiConfig.js // 解析api文件（excel文件）生成api列表
> |   |-- protoReqConfig.js // proto解析和ajax请求方法处理
> ```
> 调用方式 
>   ``` this.api.xxx({data: params}) ```
> (2) json
> > 配置路径：```src>config>jsonApi```
> ```
> |-- jsonApi
> |   |-- apiUrl.js // api列表
> |   |-- apiUtil.js // ajax请求方法处理
> ```
> 调用方式 
>   ``` this.http.xxx(params) ```

##### 5）集成 dexie 实现indexedDb存储
> 项目内部分数据信息缓存在indexDB中，```src>config>dbConfig.js```
> 详细使用方法参考 [dexie](https://dexie.org/)

##### 6）通过配置文件自动生成懒加载路由和多级侧边栏

##### 7）eWordCommplug打印插件引用
~~eWordCommplug插件下载文件存放地址 ```static>file```~~
 ~~eWordCommplug.rar文件， 线上环境下载安装文件时，浏览器安全策略会导致无法成功下载安装包文件，因此下载rar文件~~
~~eWordCommplug使用之前要判断是否已经安装插件 判断是否安装的方法 ```src>assets>print```~~
> eWordCommplug插件通过 ```/api/Plugin/download?name="全网云通用插件安装包&systemType=${WindowsXP|Windows7}``` 下载
>> 1. ```systemType```支持WindowsXP和Windows7，因此首先要判断系统类型,下载方法参考组件```components/common/prtInstall.vue```
>> 2. eWordCommplug使用之前要判断是否已经安装插件 判断是否安装的方法
> ```
> |-- print
> |   |-- checkInstall.js // 判断是否安装插件
> ```
> 调用插件前 根据checkPluginInstall方法的回调 判断是否安装打印插件
> ```
> import checkPluginInstall from '../assets/print/checkInstall.js'
> 
> checkPluginInstall(res => {
>    console.log('Is eWordCommplug installed: ',res)
> })
> ```

##### 8）lodop打印插件引用(弃用)
> lodop插件下载文件存放地址 ```static>cLodop>```
> > 其中包含exe和rar文件， 线上环境下载安装文件时，浏览器安全策略会导致无法成功下载exe文件，因此下载rar文件
> lodop使用之前要判断是否已经安装插件 判断是否安装的方法 ```src>assets>cLodop```
> ```
> |-- cLodop
> |   |-- checkInstall.js // 判断是否安装插件
> |   |-- LodopFuncs.js // lodop插件的引入文件
> ```

### 5.常见问题说明
1.当本地proto和服务端proto不匹配时 会产生报错 Uncaught (in promise) Error: invalid wire type 4 at offset 1

