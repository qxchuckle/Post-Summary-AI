## 进阶操作
这里是摘要AI的进阶用法，以及一些实验性功能

**所有进阶配置项：**

```js
new ChucklePostAI({
  // ......
  interface: {
    name: "QX-AI", // AI名称
    introduce: "我是文章辅助AI: QX-AI，点击下方的按钮，让我生成本文简介、推荐相关文章等。", // 自我介绍
    version: "GPT-4", // 右上角GPT版本文字
  },
  // 获取文章内容时，排除某些元素及其子元素的内容
  exclude: ['post-ai', 'highlight', 'Copyright-Notice', 'post-series', 'mini-sandbox'],
  // 让指定页面、文章不显示摘要AI
  eliminate: [],
  // 摘要AI挂载后直接请求并显示摘要
  summary_directly: true,
})
```

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

***

**4、摘要AI挂载后直接请求并显示摘要**  
默认是显示摘要AI的自我介绍，需要访客点击指定按钮后才显示摘要，但你可能想要**直接**显示摘要，那么 `summary_directly` 配置项正合你意。

将该配置项设置为 true 后，摘要AI会在挂载完后立刻请求并显示摘要。

```js
new ChucklePostAI({
  // ......
  summary_directly: true,
})
```

> 不推荐前后端分离的网站打开此配置项(服务端渲染的动态站不受此影响)，当文章还没从后端返回到前端渲染，摘要AI将获取到空的文章内容，当然大部分动态站都有文章加载好后再执行部分JS的配置，将 `new ChucklePostAI()` 放入其中，即可避免上述问题。

***

## 实验性功能
**以下是实验性功能，不保证其稳定性，但都已经过测试**

**1、自动获取文章所在容器元素，而无需el配置项**
开启 `auto_mount` 将不需要 el 配置项，JS会自动通过一些算法找到文章所在的容器元素，经测试兼容大部分网站

开启该功能后，el 配置项将无效

**注意**：前后端分离的、文章内容需要通过后端接口获取的网站，不要开启此功能

```js
new ChucklePostAI({
  // ......
  auto_mount: true,
})
```

若你一不小心 el 配置项为空，该功能也会启用，无论你是否主动配置为 true

***
