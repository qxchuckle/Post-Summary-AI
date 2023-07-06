# Post-Summary-AI

一个较通用的文章摘要、简介生成AI，基于tianliGPT后端

你可以前往这篇文章查看效果[文章添加预设或实时生成的AI简介](https://www.qcqx.cn/article/17d3383a.html)

## 效果
![image](https://github.com/qxchuckle/Post-Summary-AI/assets/55614189/af9236a1-fa37-4446-b5d3-0e9dd4d59ae6)
![image](https://github.com/qxchuckle/Post-Summary-AI/assets/55614189/5712f1df-7b62-4398-8841-8c2829f8b8fa)

## 什么是TianliGPT

TianliGPT是一个基于GPT-3.5的文字摘要生成工具，你可以将需要提取摘要的文本内容发送给TianliGPT，稍等一会他就可以给你发送一个基于这段文本内容的摘要。

- 实时生成的摘要
- 自动生成，无需人工干预
- 一次生成，再次生成无需消耗key
- 包含文字审核过滤，适用于中国大陆
- 支持中国大陆访问

## 快速上手
非常简单，引入下面这些代码到你的网站内即可，其中JS的引入的位置应该在文章内容之后

```html
<link rel="stylesheet" href="https://cdn1.tianli0.top/gh/qxchuckle/Post-Summary-AI/chuckle-post-ai.css">
<script data-pjax defer="true">
  ai_option={
    el: '#post #article-container',
    key:'123456'
  }
</script>
<script src="https://cdn1.tianli0.top/gh/qxchuckle/Post-Summary-AI/chuckle-post-ai.js" data-pjax defer="true"></script>
```

**ai_option配置详解：**
1. **el** 文章内容所在的元素属性的选择器，也是AI挂载的容器，AI将会挂载到该容器的最前面
2. **key** 驱动AI所必须的key，即是tianliGPT后端服务所必须的key

tianliGPT的key请到[爱发电](https://afdian.net/item/f18c2e08db4411eda2f25254001e7c00)中购买，10元5万字符（常有优惠）。请求过的内容再次请求不会消耗key，可以无限期使用。

- 相比实时请求openai，使用tianliGPT可以让你请求过的内容不再消耗key，适合生产环境。
- 相比实时请求openai，使用tianliGPT可以在国内更快速的获取摘要。

- key消耗完毕，已经请求过的内容仍然可以继续请求，避免了被恶意请求造成的资金损失和业务停摆。

- 符合中国大陆法律法规。

购买完成后，进入管理后台：https://summary.zhheo.com/

登录后点击右上角的“添加新网站”，输入密钥即可绑定成功。

## 进阶操作
前往查看：[进阶文档](/qxchuckle/Post-Summary-AI/blob/main/Advanced.md)

## 技术支持
点击链接加入讨论子频道【TianliGPT 问题交流】：https://pd.qq.com/s/7cx85i9l0

## 同类友情项目
[Post-Abstract-AI](https://github.com/qxchuckle/Post-Abstract-AI)

友情项目和本项目都是基于tianliGPT的AI摘要前端实现，可自行选择适合你网站的项目。

