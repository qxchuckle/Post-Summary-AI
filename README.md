> 本库短期内暂时无继续对接tianliGPT的更新计划，请查看最新的 [Post-Abstract-AI](https://github.com/zhheo/Post-Abstract-AI) 项目

# Post-Summary-AI
一个较通用的，生成网站内文章**摘要**(简介)，并**推荐**相关文章的AI(前端实现)，基于tianliGPT后端

你可以前往这篇文章查看效果[文章添加预设或实时生成的AI简介](https://www.qcqx.cn/article/17d3383a.html)

> 该项目理论支持所有类型的网站，无论动态还是静态站，起初该项目是为了个人博客而生的

***

## 1.效果
更多的 Post-Summary-AI 部署效果请查看[部署展示](https://github.com/qxchuckle/Post-Summary-AI#8%E9%83%A8%E7%BD%B2%E5%B1%95%E7%A4%BA)
![image](https://github.com/qxchuckle/Post-Summary-AI/assets/55614189/9dda32f5-f97b-43a1-89a5-83fc014980df)
![image](https://github.com/qxchuckle/Post-Summary-AI/assets/55614189/3e63a44b-c16f-46aa-98c8-1ba5c05fae78)

***

## 2.快速上手
非常简单，引入下面这些代码到你的网站内，并修改配置项后即可

cdn1.tianli0.top、jsd.onmicrosoft.cn 是公益cdn，若无法访问或为确保资源的稳定，建议下载仓库对应文件至本地引入

**基本配置**如下，更多**进阶**配置项和**实验性**功能，请查看[进阶操作](https://github.com/qxchuckle/Post-Summary-AI/blob/master/Advanced.md)

```html
<!-- chuckle-post-ai.js可以在网页结构的任何位置插入，只要你能够 -->
<script src="https://jsd.onmicrosoft.cn/gh/qxchuckle/Post-Summary-AI@6.0/chuckle-post-ai.min.js"></script>
<!-- 但要确保的是，AI构造代码一定要在chuckle-post-ai.js之后插入 -->
<script data-pjax defer>
  new ChucklePostAI({
    // 文章内容所在的元素属性的选择器，也是AI挂载的容器，AI将会挂载到该容器的最前面
    el: '#post>#article-container',
    // 驱动AI所必须的key，即是tianliGPT后端服务所必须的key
    key: '123456',
    // 文章推荐方式，all：匹配数据库内所有文章进行推荐，web：仅当前站内的文章，默认all
    rec_method: 'web',
  })
</script>
```

**4.7**版本开始，无需再手动引入 CSS，JS 会在合适时机自动插入 CSS

**AI构造函数 `ChucklePostAI({ /* 传入配置对象 */ })` 详解**
1. `el` **文章内容**所在的元素属性的选择器，也是AI**挂载**的容器，AI将会挂载到该容器的最前面
2. `key` 驱动AI所必须的key，即是tianliGPT后端服务所必须的**key**
3. `rec_method` 文章推荐方式，**all**：匹配数据库内所有文章进行推荐，**web**：仅当前站内的文章，**默认all**

项目开发不易，可以前往[爱发电](https://afdian.net/a/chuckle)给予我赞助

***

## 3.注意事项
1. 若是**动态网站**（静态或服务端渲染网站无需注意此事项），文章内容需要通过后端接口获取后返回给前端展示的，建议将 `new ChucklePostAI()` 放到获取文章成功后的**回调**中(即获取文章成功后才执行某些JS代码)，这样可以保证访客在文章出现后，才能去点击按钮获取AI摘要，以免获取到空文章内容，返回错误的摘要。不同的网站有各自的获取文章成功后的回调，请查阅自己网站系统的文档。

2. 若网站开启了**PJAX**，可能会存在切换页面后JS插件无法正常执行的问题，若你不知该如何主动适配，可以将 `pjax` 配置项设为 **true**，具体请查看[进阶操作](https://github.com/qxchuckle/Post-Summary-AI/blob/master/Advanced.md)的第 **9** 点。

***

## 4.tianliGPT-KEY
tianliGPT的key请到[爱发电](https://afdian.net/item/f18c2e08db4411eda2f25254001e7c00)中购买，10元5万字符（常有优惠）。请求过的内容再次请求不会消耗key，可以无限期使用。

- 相比实时请求OpenAI，使用tianliGPT可以让你请求过的内容不再消耗key，并在国内更快速的获取摘要，适合生产环境。
- key消耗完毕，已经请求过的内容仍然可以继续请求，避免了被恶意请求造成的资金损失和业务停摆。
- 符合中国大陆法律法规。

**注意事项：**
1. 购买完成后，进入[管理后台](https://summary.zhheo.com/)：summary.zhheo.com ，登录后点击右上角的“添加新网站”，输入密钥即可绑定成功。
2. 若需要进行**本地调试**，请在管理后台将 127.0.0.1:端口 加入白名单，否则会触发防盗KEY，无法正常获取摘要。

***

## 5.版本升级
修改引入资源的版本号，版本号可在[releases](https://github.com/qxchuckle/Post-Summary-AI/releases)查看
![image](https://github.com/qxchuckle/Post-Summary-AI/assets/55614189/7e9d3ef9-bdfa-40f7-bd97-9183a02e96d8)

***

## 6.进阶操作
摘要AI的**进阶用法**，以及一些**实验性**功能：[进阶操作](https://github.com/qxchuckle/Post-Summary-AI/blob/master/Advanced.md)

***

## 7.技术支持
若你的网站接入该项目有困难，可以提 [issues](https://github.com/qxchuckle/Post-Summary-AI/issues)，简单讲述你所遇到的困难，并附上**网站地址**，你将会获得快速的回复。

工单系统、反馈互动社区：https://support.qq.com/product/600565

也可以加入**QQ频道**：点击链接加入讨论子频道【TianliGPT 问题交流】：https://pd.qq.com/s/7cx85i9l0

***

## 8.部署展示
这里展示已经成功部署 Post-Summary-AI 的网站，若你已成功部署，可以提 [issues](https://github.com/qxchuckle/Post-Summary-AI/issues)，会将你展示于此

1. [MoyuqLのBlog](https://blog.moyuql.top/)
2. [佳凌雾杨的日记](https://www.chukogals.top/)
3. [王卓Sco](https://blog.sondy.top/)
4. [Teink](https://te.ink/)

***

## 9.同类友情项目
[Post-Abstract-AI](https://github.com/zhheo/Post-Abstract-AI)

友情项目和本项目都是基于tianliGPT的AI摘要前端实现，可自行选择适合你网站的项目。

![image](https://github.com/qxchuckle/Post-Summary-AI/assets/55614189/352ebdec-c43a-40a7-8060-30230ed5aa0d)

