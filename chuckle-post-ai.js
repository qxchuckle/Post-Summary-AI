if(!window.hasOwnProperty("aiExecuted")){
  console.log(`%cPost-Summary-AI 文章摘要AI生成工具:%chttps://github.com/qxchuckle/Post-Summary-AI%c`, "border:1px #888 solid;border-right:0;border-radius:5px 0 0 5px;padding: 5px 10px;color:white;background:#4976f5;margin:10px 0", "border:1px #888 solid;border-left:0;border-radius:0 5px 5px 0;padding: 5px 10px;","");
  window.aiExecuted = "chuckle";
}
function ChucklePostAI(AI_option) {
  // 如果有则删除
  const box = document.querySelector(".post-ai");
  if (box) {
    box.parentElement.removeChild(box);
  }
  const currentURL = window.location.href;
  // 排除页面
  if(AI_option.eliminate && AI_option.eliminate.length && AI_option.eliminate.some(item => currentURL.includes(item))){
    console.log("Post-Summary-AI 已排除当前页面(黑名单)");
    return;
  }
  if(AI_option.whitelist && AI_option.whitelist.length && !AI_option.whitelist.some(item => currentURL.includes(item))){
    console.log("Post-Summary-AI 已排除当前页面(白名单)");
    return;
  }
  // 获取挂载元素，即文章内容所在的容器元素
  let targetElement = "";
  // 若el配置不存在则自动获取，如果auto_mount配置为真也自动获取
  if(!AI_option.auto_mount && AI_option.el){
    targetElement = document.querySelector(AI_option.el ? AI_option.el : '#post #article-container');
  }else{
    targetElement = getArticleElements();
  }
  // 获取文章标题，默认获取网页标题
  const post_title = document.querySelector(AI_option.title_el) ? document.querySelector(AI_option.title_el).textContent : document.title;
  if (!targetElement) {
    return;
  };
  const interface = {
    name: "QX-AI",
    introduce: "我是文章辅助AI: QX-AI，点击下方的按钮，让我生成本文简介、推荐相关文章等。",
    version: "GPT-4",
    ...AI_option.interface
  }
  insertCSS(); // 插入css
  // 插入html结构
  const post_ai_box = document.createElement('div');
  post_ai_box.className = 'post-ai';
  post_ai_box.setAttribute('id', 'post-ai');
  targetElement.insertBefore(post_ai_box, targetElement.firstChild);
  post_ai_box.innerHTML = `<div class="ai-title">
      <div class="ai-title-text">${interface.name}</div>
      <div class="ai-tag">${interface.version}</div>
    </div>
    <div class="ai-explanation">${interface.name}初始化中...</div>
    <div class="ai-btn-box">
      <div class="ai-btn-item">介绍自己</div>
      <div class="ai-btn-item">推荐相关文章</div>
      <div class="ai-btn-item">生成AI简介</div>
    </div>`;

  // ai主体业务逻辑
  let animationRunning = true; // 标志变量，控制动画函数的运行
  let explanation = document.querySelector('.ai-explanation');
  let post_ai = document.querySelector('.post-ai');
  let ai_btn_item = document.querySelectorAll('.ai-btn-item');
  let ai_str = '';
  let ai_str_length = '';
  let delay_init = 600;
  let i = 0;
  let j = 0;
  let sto = [];
  let elapsed = 0;
  let completeGenerate = false;
  let controller = new AbortController();//控制fetch
  let signal = controller.signal;
  let visitorId = ""; // 标识访客ID
  //默认true，使用tianliGPT，false使用官方api，记得配置Key
  const choiceApi = true;
  const apiKey = "填入chatGPT的apiKey";
  //tianliGPT的参数
  const tlReferer = `https://${window.location.host}/`;
  const tlKey = AI_option.key ? AI_option.key : '123456';
  //-----------------------------------------------
  const animate = (timestamp) => {
    if (!animationRunning) {
      return; // 动画函数停止运行
    }
    if (!animate.start) animate.start = timestamp;
    elapsed = timestamp - animate.start;
    if (elapsed >= 20) {
      animate.start = timestamp;
      if (i < ai_str_length - 1) {
        let char = ai_str.charAt(i + 1);
        let delay = /[,.，。!?！？]/.test(char) ? 150 : 20;
        if (explanation.firstElementChild) {
          explanation.removeChild(explanation.firstElementChild);
        }
        explanation.innerHTML += char;
        let div = document.createElement('div');
        div.className = "ai-cursor";
        explanation.appendChild(div);
        i++;
        if (delay === 150) {
          document.querySelector('.ai-explanation .ai-cursor').style.opacity = "0";
        }
        if (i === ai_str_length - 1) {
          observer.disconnect();// 暂停监听
          explanation.removeChild(explanation.firstElementChild);
        }
        sto[0] = setTimeout(() => {
          requestAnimationFrame(animate);
        }, delay);
      }
    } else {
      requestAnimationFrame(animate);
    }
  };
  const observer = new IntersectionObserver((entries) => {
    let isVisible = entries[0].isIntersecting;
    animationRunning = isVisible; // 标志变量更新
    if (animationRunning) {
      delay_init = i === 0 ? 200 : 20;
      sto[1] = setTimeout(() => {
        if (j) {
          i = 0;
          j = 0;
        }
        if (i === 0) {
          explanation.innerHTML = ai_str.charAt(0);
        }
        requestAnimationFrame(animate);
      }, delay_init);
    }
  }, { threshold: 0 });
  function clearSTO() {
    if (sto.length) {
      sto.forEach((item) => {
        if (item) {
          clearTimeout(item);
        }
      });
    }
  }
  function resetAI(df = true) {
    i = 0;//重置计数器
    j = 1;
    clearSTO();
    animationRunning = false;
    elapsed = 0;
    if (df) {
      explanation.innerHTML = '生成中. . .';
    } else {
      explanation.innerHTML = '请等待. . .';
    }
    if (!completeGenerate) {
      controller.abort();
    }
    ai_str = '';
    ai_str_length = '';
    observer.disconnect();// 暂停上一次监听
  }
  function startAI(str, df = true) {
    // 如果打字机配置项存在且为false，则关闭打字机，否则默认开启打字机效果
    if(AI_option.hasOwnProperty('typewriter') && !AI_option.typewriter){
      explanation.innerHTML = str;
    }else{
      resetAI(df);
      ai_str = str;
      ai_str_length = ai_str.length;
      observer.observe(post_ai);//启动新监听
    } 
  }
  function aiIntroduce() {
    startAI(interface.introduce);
  }
  function aiRecommend() {
    resetAI();
    sto[2] = setTimeout(async() => {
      let info = await recommendList();
      if(info === ""){
        startAI(`${interface.name}未能找到任何可推荐的文章。`);
      }else if(info){
        explanation.innerHTML = info;
      }
    }, 200);
  }
  async function aiGenerateAbstract() {
    resetAI();
    const ele = targetElement
    const content = getTextContent(ele);
    const response = await getGptResponse(content, choiceApi);//true使用tianliGPT，false使用官方api
    if(response){
      startAI(response);
    }
  }
  async function recommendList() {
    completeGenerate = false;
    controller = new AbortController();
    signal = controller.signal;
    let response = '';
    let info = '';
    let data = '';
    const options = {
      signal,
      method: 'GET',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
    };
    // 利用sessionStorage缓存推荐列表，有则缓存中读取，无则获取后缓存
    if(sessionStorage.getItem('recommendList')){
      data = JSON.parse(sessionStorage.getItem('recommendList'));
    }else{
      try {
        response = await fetch(`https://summary.tianli0.top/recommends?url=${encodeURIComponent(window.location.href)}&author=${AI_option.rec_method ? AI_option.rec_method : 'all'}`, options);
        completeGenerate = true;
        if (response.status === 429) {
          startAI('请求过于频繁，请稍后再请求AI。');
        }
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        // 处理响应
      } catch (error) {
        if (error.name === "AbortError") {
          // console.log("请求已被中止");
        }else{
          console.error('Error occurred:', error);
          startAI("获取推荐出错了，请稍后再试。");
        }
        completeGenerate = true;
        return false;
      }
      // 解析响应并返回结果
      data = await response.json();
      sessionStorage.setItem('recommendList', JSON.stringify(data));
    }
    if(data.hasOwnProperty("success") && !data.success){
      return false;
    }else{
      info = `推荐文章：<br />`;
      info += '<div class="ai-recommend">';
      data.forEach((item, index) => {
        info += `<div class="ai-recommend-item"><span>推荐${index + 1}：</span><a target="_blank" href="${item.url}" title="${item.title ? item.title : "未获取到题目"}">${item.title ? item.title : "未获取到题目"}</a></div>`;
      });
      info += '</div>'
    }
    return info;
  }
  //ai首屏初始化，绑定按钮注册事件
  async function ai_init() {
    // 清除缓存
    sessionStorage.removeItem('recommendList');
    sessionStorage.removeItem('summary');
    explanation = document.querySelector('.ai-explanation');
    post_ai = document.querySelector('.post-ai');
    ai_btn_item = document.querySelectorAll('.ai-btn-item');
    const funArr = [aiIntroduce, aiRecommend, aiGenerateAbstract];
    ai_btn_item.forEach((item, index) => {
      item.addEventListener('click', () => {
        funArr[index]();
      });
    });
    if(AI_option.summary_directly){
      aiGenerateAbstract();
    }else{
      aiIntroduce();
    }
    // 获取或生成访客ID
    visitorId = localStorage.getItem('visitorId') || await generateVisitorID();
  }
  async function generateVisitorID() {
    try {
      const FingerprintJS = await import('https://openfpcdn.io/fingerprintjs/v4');
      const fp = await FingerprintJS.default.load();
      const result = await fp.get();
      const visitorId = result.visitorId;
      localStorage.setItem('visitorId', visitorId);
      return visitorId;
    } catch (error) {
      console.error("生成ID失败：", error);
      return null;
    }
  }
  //获取某个元素内的所有纯文本，并按顺序拼接返回
  function getText(element) {
    //需要排除的元素及其子元素
    const excludeClasses = AI_option.exclude ? AI_option.exclude : ['highlight', 'Copyright-Notice', 'post-ai', 'post-series', 'mini-sandbox'];
    let textContent = '';
    for (let node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        //如果是纯文本节点则获取内容拼接
        textContent += node.textContent.trim();
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        let hasExcludeClass = false;//跟踪元素是否包含需要排除的类名
        //遍历类名
        for (let className of node.classList) {
          //如果包含则hasExcludeClass设为true，且break跳出循环
          if (excludeClasses.includes(className)) {
            hasExcludeClass = true;
            break;
          }
        }
        //如果hasExcludeClass为false，即该标签不包含需要排除的类，可以继续向下遍历子元素
        if (!hasExcludeClass) {
          let innerTextContent = getText(node);
          textContent += innerTextContent;
        }
      }
    }
    //返回纯文本节点的内容
    return textContent.replace(/\s+/g, '');
  }
  //获取各级标题
  function extractHeadings(element) {
    const headings = element.querySelectorAll('h1, h2, h3, h4');
    const result = [];
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const headingText = heading.textContent.trim();
      result.push(headingText);
      const childHeadings = extractHeadings(heading);
      result.push(...childHeadings);
    }
    return result.join(";");
  }
  //按比例切割字符串
  function extractString(str) {
    // 截取前500个字符
    var first500 = str.substring(0, 500);
    // 截取末尾200个字符
    var last200 = str.substring(str.length - 200);
    // 截取中间300个字符
    var midStartIndex = (str.length - 300) / 2; // 计算中间部分的起始索引
    var middle300 = str.substring(midStartIndex, midStartIndex + 300);
    // 将三个部分拼接在一起
    var result = first500 + middle300 + last200;
    // 返回截取后的字符串
    return result;
  }
  //获得字符串，默认进行切割，false返回原文纯文本
  function getTextContent(element, i = true) {
    let content;
    if (i) {
      content = `文章的各级标题：${extractHeadings(element)}。文章内容的截取：${extractString(getText(element))}`;
    } else {
      content = `${getText(element)}`;
    }
    return content;
  }
  //发送请求获得简介
  async function getGptResponse(content, i = true) {
    if (!tlKey) {
      return "没有获取到key，代码可能没有安装正确。如果你需要在tianli_gpt文件引用前定义tianliGPT_key变量。详细请查看文档。";
    }
    if (tlKey === "123456") {
      return "请购买 key 使用，如果你能看到此条内容，则说明代码安装正确。";
    }
    completeGenerate = false;
    controller = new AbortController();
    signal = controller.signal;
    let response = '';
    if(sessionStorage.getItem('summary')){
      return sessionStorage.getItem('summary');
    }
    if (i) {
      try {
        response = await fetch('https://summary.tianli0.top/', {
          signal: signal,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Referer": tlReferer
          },
          body: JSON.stringify({
            content: content,
            key: tlKey,
            title: post_title,
            url: window.location.href,
            user_openid: visitorId
          })
        });
        completeGenerate = true;
        if (response.status === 429) {
          startAI('请求过于频繁，请稍后再请求AI。');
        }
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        // 处理响应
      } catch (error) {
        if (error.name === "AbortError") {
          // console.log("请求已被中止");
        }else if(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
          startAI(`${interface.name}请求tianliGPT出错了，你正在本地进行调试，请前往summary.zhheo.com添加本地域名（127.0.0.1:端口）的白名单。`);
        }else{
          startAI(`${interface.name}请求tianliGPT出错了，请稍后再试。`);
        }
        completeGenerate = true;
        return "";
      }
      // 解析响应并返回结果
      const data = await response.json();
      const outputText = data.summary;
      sessionStorage.setItem('summary', outputText);
      return outputText;
    } else {
      const prompt = `你是一个摘要生成工具，你需要解释我发送给你的内容，不要换行，不要超过200字，只需要介绍文章的内容，不需要提出建议和缺少的东西。请用中文回答，文章内容为：${content}`;
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      try {
        response = await fetch(apiUrl, {
          signal: signal,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": prompt }],
          })
        });
        completeGenerate = true;
        if (response.status === 429) {
          startAI('请求过于频繁，请稍后再请求AI。');
        }
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        // 处理响应
      } catch (error) {
        console.error('Error occurred:', error);
        startAI(`${interface.name}请求chatGPT出错了，请稍后再试。`);
        completeGenerate = true;
        return "";
      }
      // 解析响应并返回结果
      const data = await response.json();
      const outputText = data.choices[0].message.content;
      sessionStorage.setItem('summary', outputText);
      return outputText;
    }
  }
  // 实验性功能，自动获取文章内容所在容器元素
  function getArticleElements(){
    // 计算元素的后代元素总个数
    function countDescendants(element) {
      let count = 1;
      for (const child of element.children) {
        count += countDescendants(child);
      }
      return count;
    }
    // 判断是否有要排除的元素
    function judgeElement(element) {
      const excludedTags = ['IFRAME', 'FOOTER', 'HEADER', 'BLOCKQUOTE']; // 添加要排除的标签
      if(excludedTags.includes(element.tagName)){
        return true;
      }
      const exclusionStrings = ['aplayer', 'comment']; // 排除包含其中字符串的className
      return Array.from(element.classList).some(className => exclusionStrings.some(exclusion => className.includes(exclusion)));
    }
    // 深度搜索，找到得分最高的父元素
    function findMaxHeadingParentElement(element) {
      const tagScores = {
        'H1': 1.5,
        'H2': 1,
        'H3': 0.5,
        'P': 1
      };
      let maxScore = 0;
      let maxHeadingParentElement = null;
      function dfs(element) {
        if (judgeElement(element)) {
          return;
        }
        let score = 0;
        for (const child of element.children) {
          if (child.tagName in tagScores) {
            score += tagScores[child.tagName];
          }
        }
        if (score > maxScore) {
          maxScore = score;
          maxHeadingParentElement = element;
        }
        for (const child of element.children) {
          dfs(child);
        }
      }
      dfs(element);
      return maxHeadingParentElement;
    }
    // 广度优先搜索，标记所有元素，并找到得分最高的父元素
    function findArticleContentElement() {
      const queue = [document.body];
      let maxDescendantsCount = 0;
      let articleContentElement = null;
      while (queue.length > 0) {
        const currentElement = queue.shift();
        // 判断当前元素是否要排除
        if (judgeElement(currentElement)) {
          continue;
        }
        const descendantsCount = countDescendants(currentElement);
        if (descendantsCount > maxDescendantsCount) {
          maxDescendantsCount = descendantsCount;
          articleContentElement = currentElement;
        }
        for (const child of currentElement.children) {
          queue.push(child);
        }
      }
      return findMaxHeadingParentElement(articleContentElement);
    }
    // 返回文章内容所在的容器元素
    return findArticleContentElement();
  }

  // 插入css
  function insertCSS(){
    const styleId = 'qx-ai-style';
    if(document.getElementById(styleId)) { return; }
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = `:root{--ai-font-color:#353535;--ai-post-bg:rgba(255,255,255,0.32);--ai-border:1px solid #e3e8f7bd;--ai-tag-bg:rgba(48,52,63,0.86);--ai-cursor:#333;}[data-theme=dark],.theme-dark,body.dark,body.dark-theme{--ai-font-color:rgba(255,255,255,0.86);--ai-post-bg:rgba(48,52,63,0.35);--ai-border:1px solid #3d3d3f;--ai-tag-bg:#30343f;--ai-cursor:rgb(255,255,255,0.9);}#post-ai.post-ai{background:var(--ai-post-bg);border-radius:12px;padding:12px 16px;line-height:1.3;border:var(--ai-border);margin-top:10px;margin-bottom:6px;transition:all 0.3s;-webkit-transition:all 0.3s;-moz-transition:all 0.3s;-ms-transition:all 0.3s;-o-transition:all 0.3s;}#post-ai .ai-title{display:flex;color:var(--ai-font-color);border-radius:8px;align-items:center;padding:0 5px;}#post-ai .ai-title i{font-weight:800;}#post-ai .ai-title-text{font-weight:bold;margin-left:8px;}#post-ai .ai-tag{font-size:12px;background-color:var(--ai-tag-bg);color:rgba(255,255,255,0.9);border-radius:4px;margin-left:auto;line-height:1;padding:4px 5px;border:var(--ai-border);}#post-ai .ai-explanation{margin-top:11px;font-size:15.5px;line-height:1.4;}#post-ai .ai-cursor{display:inline-block;width:7px;background:var(--ai-cursor);height:16px;margin-bottom:-2px;opacity:0.95;margin-left:3px;transition:all 0.3s;-webkit-transition:all 0.3s;-moz-transition:all 0.3s;-ms-transition:all 0.3s;-o-transition:all 0.3s;}#post-ai .ai-btn-box{font-size:15.5px;width:100%;display:flex;flex-direction:row;flex-wrap:wrap;}#post-ai .ai-btn-item{padding:5px 10px;margin:10px 16px 0px 5px;width:fit-content;line-height:1;background:rgba(48,52,63,0.75);border:var(--ai-border);color:#fff;border-radius:6px 6px 6px 0;-webkit-border-radius:6px 6px 6px 0;-moz-border-radius:6px 6px 6px 0;-ms-border-radius:6px 6px 6px 0;-o-border-radius:6px 6px 6px 0;user-select:none;transition:all 0.3s;-webkit-transition:all 0.3s;-moz-transition:all 0.3s;-ms-transition:all 0.3s;-o-transition:all 0.3s;}#post-ai .ai-btn-item:hover{background:#49b0f5dc;}#post-ai .ai-recommend{display:flex;flex-direction:row;flex-wrap:wrap;}#post-ai .ai-recommend-item{width:50%;margin-top:2px;}#post-ai .ai-recommend-item a{border-bottom:2px solid #4c98f7;padding:0 .2em;color:#4c98f7;font-weight:700;text-decoration:none;transition:all 0.3s;-webkit-transition:all 0.3s;-moz-transition:all 0.3s;-ms-transition:all 0.3s;-o-transition:all 0.3s;}#post-ai .ai-recommend-item a:hover{background-color:#49b1f5;border-bottom:2px solid #49b1f5;color:#fff;border-radius:5px;}`;
    document.head.appendChild(styleElement);
  }

  // 请求个性化推荐
  async function personalizedRecommend(){
    completeGenerate = false;
    controller = new AbortController();
    signal = controller.signal;
    const options = {
      signal,
      method: 'GET',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
    };
    try{
      const response = await fetch(`https://summary.tianli0.top/personalized_recommends?openid=${visitorId}`, options);
      completeGenerate = true;
      const data = await response.json();
      return data;
    }catch{
      startAI(`${interface.name}获取个性化推荐出错了，请稍后再试。`);
      completeGenerate = true;
      return null;
    }
  }

  ai_init();
}
// 兼容旧版本配置项
if(typeof ai_option!=="undefined"){
  console.log("正在使用旧版本配置方式，请前往项目仓库查看最新配置写法");
  new ChucklePostAI(ai_option);
}