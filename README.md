# Post-Summary-AI
一个较通用的，生成网站内文章**摘要**(简介)，并**推荐**相关文章的AI(前端实现)，基于tianliGPT后端

你可以前往这篇文章查看效果[文章添加预设或实时生成的AI简介](https://www.qcqx.cn/article/17d3383a.html)

更多的 Post-Summary-AI 部署效果可以往后查看[部署展示](https://github.com/qxchuckle/Post-Summary-AI#8%E9%83%A8%E7%BD%B2%E5%B1%95%E7%A4%BA)

> 该项目理论支持所有类型的网站，无论动态还是静态站，起初该项目是为了个人博客而生的

## 1.效果
![image](https://github.com/qxchuckle/Post-Summary-AI/assets/55614189/a0029aac-7f6a-4888-b037-8cabbdc76053)
![image](https://github.com/qxchuckle/Post-Summary-AI/assets/55614189/08e897d2-90a4-4497-ac11-39b4a1f43cbd)


## 2.快速上手
非常简单，引入下面这些代码到你的网站内，并修改配置项后即可

TIP: 为避免CDN和浏览器缓存的影响，建议指定**资源版本号**使用

cdn1.tianli0.top 和 cdn.chuqis.com是公益cdn，若无法访问或为确保资源的稳定，建议下载仓库对应文件至本地引入

```html
<!-- css -->
<link rel="stylesheet" href="https://cdn.chuqis.com/gh/qxchuckle/Post-Summary-AI@4.4/chuckle-post-ai.css">
<!-- chuckle-post-ai.js现在可以在网页结构的任何位置插入，只要你能够 -->
<script src="https://cdn.chuqis.com/gh/qxchuckle/Post-Summary-AI@4.4/chuckle-post-ai.js"></script>
<!-- 但要确保的是，AI构造代码一定要在chuckle-post-ai.js之后插入 -->
<script data-pjax defer>
  // AI构造函数
  new ChucklePostAI({
    /* 必须配置 */
    // 文章内容所在的元素属性的选择器，也是AI挂载的容器，AI将会挂载到该容器的最前面
    el: '#post>#article-container',
    // 驱动AI所必须的key，即是tianliGPT后端服务所必须的key
    key:'123456',
    /* 非必须配置，但最好根据自身需要进行配置 */
    // 文章标题所在的元素属性的选择器，默认获取当前网页的标题
    title_el: '.post-title',
    // 文章推荐方式，all：匹配数据库内所有文章进行推荐，web：仅当前站内的文章，默认all
    rec_method: 'web',
  })
</script>
```

**AI构造函数 `ChucklePostAI({ /* 传入配置对象 */ })` 详解**
1. `el` **文章内容**所在的元素属性的选择器，也是AI**挂载**的容器，AI将会挂载到该容器的最前面
2. `key` 驱动AI所必须的key，即是tianliGPT后端服务所必须的**key**
3. `title_el` **文章标题**所在的元素属性的选择器，默认获取当前**网页的标题**
4. `rec_method` 文章推荐方式，**all**：匹配数据库内所有文章进行推荐，**web**：仅当前站内的文章，**默认all**

>更多**进阶**配置项，请往后查看[进阶操作](https://github.com/qxchuckle/Post-Summary-AI#6%E8%BF%9B%E9%98%B6%E6%93%8D%E4%BD%9C)

项目开发不易，可以前往[爱发电](https://afdian.net/a/chuckle)给予我赞助

## 3.什么是TianliGPT
TianliGPT是一个基于GPT-3.5的文字摘要生成工具，你可以将需要提取摘要的文本内容发送给TianliGPT，稍等一会他就可以给你发送一个基于这段文本内容的摘要。该服务端暂未开源。

## 4.tianliGPT-KEY
tianliGPT的key请到[爱发电](https://afdian.net/item/f18c2e08db4411eda2f25254001e7c00)中购买，10元5万字符（常有优惠）。请求过的内容再次请求不会消耗key，可以无限期使用。

- 相比实时请求OpenAI，使用tianliGPT可以让你请求过的内容不再消耗key，并在国内更快速的获取摘要，适合生产环境。
- key消耗完毕，已经请求过的内容仍然可以继续请求，避免了被恶意请求造成的资金损失和业务停摆。
- 符合中国大陆法律法规。

**注意事项：**
1. 购买完成后，进入[管理后台](https://summary.zhheo.com/)：summary.zhheo.com ，登录后点击右上角的“添加新网站”，输入密钥即可绑定成功。
2. 若需要进行**本地调试**，请在管理后台将 127.0.0.1:端口 加入白名单，否则会触发防盗KEY，无法正常获取摘要。

## 5.版本升级
修改引入资源的版本号，版本号可在[releases](https://github.com/qxchuckle/Post-Summary-AI/releases)查看
![image](https://github.com/qxchuckle/Post-Summary-AI/assets/55614189/7e9d3ef9-bdfa-40f7-bd97-9183a02e96d8)

## 6.进阶操作
**1、自定义界面信息，修改AI名称和自我介绍等**，新增 `interface` 配置项。

```js
new ChucklePostAI({
  // ......
  interface: {
    name: "QX-AI", // AI名称
    introduce: "我是文章辅助AI: QX-AI，点击下方的按钮，让我生成本文简介、推荐相关文章等。", // 自我介绍
    version: "GPT-4", // 右上角GPT版本文字
  },
})
```

***

**2、获取文章内容时，排除某些元素及其子元素的内容**  
你可能不需要文章内一些元素的内容去生成摘要，或者这些内容对于生成摘要并没有帮助，比如代码框、版权信息等等。

如有需要可以使用 `exclude` 配置项。

往数组中加入需要排除的元素的 **className**，摘要AI会自动跳过对该**元素及其子元素**内容的获取。

```js
new ChucklePostAI({
  // ......
  exclude: ['post-ai', 'highlight', 'Copyright-Notice', 'post-series', 'mini-sandbox'],
})
```

以上是该配置项的默认值，建议保留对 **post-ai** 也就是摘要元素本身的排除，【todo】后续版本会将其默认进行排除，无论是否做了配置，但考虑到兼容性，在配置项中最好也做排除

***

**3、让指定页面、文章不显示摘要AI**  
可能你想让某篇文章没有摘要AI，这个 `eliminate`  配置就对你有用。通过匹配当前 URL 中**唯一标识**的关键字符串实现排除。

```js
new ChucklePostAI({
  // ......
  eliminate: [],
})
```

例如你想让 https://www.qcqx.cn/article/544ba770.html 这篇文章不显示摘要AI，544ba770 是可以唯一标识该文章的字符串，则将其加入到数组中

当然，你也可以将除去域名外的路径，填入数组中。下面展示了多种写法。

```js
eliminate: ['544ba770', '/article/544ba770.html'],
```

另外，当 `el` 配置项无法区分一般页面和文章页面时，这个配置项也会有用。

## 7.技术支持
若你的网站接入该项目有困难，可以提 [issues](https://github.com/qxchuckle/Post-Summary-AI/issues)，简单讲述你所遇到的困难，并附上**网站地址**，你将会获得快速的回复。

也可以加入**QQ频道**：点击链接加入讨论子频道【TianliGPT 问题交流】：https://pd.qq.com/s/7cx85i9l0

## 8.部署展示
这里展示已经成功部署 Post-Summary-AI 的网站，若你已成功部署，可以提 [issues](https://github.com/qxchuckle/Post-Summary-AI/issues)，会将你展示于此

1. [MoyuqLのBlog](https://blog.moyuql.top/)

## 9.同类友情项目
[Post-Abstract-AI](https://github.com/qxchuckle/Post-Abstract-AI)

友情项目和本项目都是基于tianliGPT的AI摘要前端实现，可自行选择适合你网站的项目。

![image](https://github.com/qxchuckle/Post-Summary-AI/assets/55614189/352ebdec-c43a-40a7-8060-30230ed5aa0d)

