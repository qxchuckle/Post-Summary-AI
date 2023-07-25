if(!window.hasOwnProperty("aiExecuted")){
  console.log("\n %c Post-Summary-AI 开源博客文章摘要AI生成工具 %c https://github.com/qxchuckle/Post-Summary-AI \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;");
  window.aiExecuted = "chuckle";
}
function ChucklePostAI(AI_option) {
  // 如果有则删除
  const box = document.querySelector(".post-ai");
  if (box) {
    box.parentElement.removeChild(box);
  }
  // 挂载
  const targetElement = document.querySelector(AI_option.el ? AI_option.el : '#post #article-container');
  // 获取文章标题，默认获取网页标题
  const post_title = document.querySelector(AI_option.title_el) ? document.querySelector(AI_option.title_el).textContent : document.title;
  if (!targetElement) {
    console.log("ai挂载失败!请检查挂载的容器是否正确。");
    return
  };
  const post_ai_box = document.createElement('div');
  post_ai_box.className = 'post-ai';
  targetElement.insertBefore(post_ai_box, targetElement.firstChild);
  post_ai_box.innerHTML = `<div class="ai-title">
      <div class="ai-title-text">QX-AI</div>
      <div class="ai-tag">GPT-4</div>
    </div>
    <div class="ai-explanation">QX-AI初始化中...</div>
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
    // console.log(completeGenerate);
    if (!completeGenerate) {
      controller.abort();
      // console.log(completeGenerate);
    }
    ai_str = '';
    ai_str_length = '';
    observer.disconnect();// 暂停上一次监听
  }
  function startAI(str, df = true) {
    resetAI(df);
    ai_str = str;
    ai_str_length = ai_str.length;
    observer.observe(post_ai);//启动新监听
  }
  function aiIntroduce() {
    startAI('我是文章辅助AI: QX-AI，点击下方的按钮，让我生成本文简介、推荐相关文章等。');
  }
  function aiRecommend() {
    resetAI();
    sto[2] = setTimeout(async() => {
      let info = await recommendList();
      if(!info){
        startAI('QX-AI未能找到任何可推荐的文章。');
      }else{
        explanation.innerHTML = info;
      }
    }, 300);
  }
  async function aiGenerateAbstract() {
    // if(!verifyDomainName()){btf.snackbarShow('未经授权的域名');return;}
    // if(!completeGenerate){
    //   btf.snackbarShow('AI摘要正在生成，请勿重复发起');
    //   return;
    // }
    // if (clickFrequency()) {
    //   return;
    // }
    // localStorage.setItem('aiTime', Date.now());
    resetAI();
    const ele = targetElement
    const content = getTextContent(ele);
    // console.log(content);
    const response = await getGptResponse(content, choiceApi);//true使用tianliGPT，false使用官方api
    // console.log(response);
    startAI(response);
  }
  async function recommendList() {
    completeGenerate = false;
    controller = new AbortController();
    signal = controller.signal;
    let response = '';
    let info = '';
    let data = '';
    const options = {
      method: 'GET',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
    };
    // 利用sessionStorage缓存推荐列表，有则缓存中读取，无则获取后缓存
    if(sessionStorage.getItem('recommendList')){
      data = JSON.parse(sessionStorage.getItem('recommendList'));
    }else{
      try {
        response = await fetch(`https://summary.tianli0.top/recommends?url=${encodeURIComponent(window.location.href)}&author=${AI_option.rec_method ? AI_option.rec_method : 'all'}`, options)
        if (response.status === 429) {
          startAI('请求过于频繁，请稍后再请求AI。');
        }
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        // 处理响应
      } catch (error) {
        console.error('Error occurred:', error);
        startAI("获取推荐出错了，请稍后再试。");
      }
      // 解析响应并返回结果
      data = await response.json();
      sessionStorage.setItem('recommendList', JSON.stringify(data));
      // console.log(data);
    }
    completeGenerate = true;
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
  function ai_init() {
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
    aiIntroduce();
  }
  function clickFrequency(t = 3000) {
    let time = Date.now() - localStorage.getItem('aiTime');
    if (time < t) {
      if(typeof btf!=="undefined"){
        btf.snackbarShow(`${3 - parseInt(time / 1000)}秒后才能再次点击生成AI简介`);
      }else{
        alert(`${3 - parseInt(time / 1000)}秒后才能再次点击生成AI简介`)
      }
      return true;
    } else {
      return false;
    }
  }
  // 真AI简介相关函数

  // function verifyDomainName(){
  //   const domain = window.location.hostname;
  //   const authorized = ['www.qcqx.cn','www.chuckle.top','127.0.0.1'];
  //   return authorized.includes(domain)
  // }
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
          //不同元素内获取的文本用句号隔开
          let innerTextContent = getText(node);
          // if (textContent && innerTextContent) {
          //   //如果本来有标点符号则不添加
          //   if (/[：:,.，。?？/；;!！（）、)(]$/.test(textContent) || /^[：:,.，。?？/；;!！（）、@#￥$%&)(]/.test(innerTextContent)) {
          //     textContent += innerTextContent;
          //   } else {
          //     textContent += '。' + innerTextContent;
          //   }
          // } else {
          //   textContent += innerTextContent;
          // }
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
            url: window.location.href
          })
        });
        if (response.status === 429) {
          startAI('请求过于频繁，请稍后再请求AI。');
        }
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        // 处理响应
      } catch (error) {
        console.error('Error occurred:', error);
        startAI("QX-AI请求tianliGPT出错了，请稍后再试。");
      }
      // 解析响应并返回结果
      const data = await response.json();
      const outputText = data.summary;
      // console.log(outputText);
      completeGenerate = true;
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
        if (response.status === 429) {
          startAI('请求过于频繁，请稍后再请求AI。');
        }
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        // 处理响应
      } catch (error) {
        console.error('Error occurred:', error);
        startAI("QX-AI请求chatGPT出错了，请稍后再试。");
      }
      // 解析响应并返回结果
      const data = await response.json();
      const outputText = data.choices[0].message.content;
      completeGenerate = true;
      sessionStorage.setItem('summary', outputText);
      return outputText;
    }
  }
  ai_init();
}
// 兼容旧版本配置项
if(typeof ai_option!=="undefined"){
  console.log("正在使用旧版本配置方式，请前往项目仓库查看最新配置写法");
  new ChucklePostAI(ai_option);
}