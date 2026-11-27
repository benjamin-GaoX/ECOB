/* ECOB+ presentation-only localization. No model inputs, IDs, numeric values or coefficients are translated. */
(()=>{'use strict';
 const dict=window.ECOBTranslations||{}, key='ecob_language_v1';
 const textCache=new WeakMap(), attrCache=new WeakMap();
 const attrs=['aria-label','aria-valuetext','title','placeholder','alt'];
 let lang='en', observer, menuButton, menuPanel;
 const normalize=s=>s.trim().replace(/\s+/g,' ');
 const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const patterns=[
  [/^(\+\s*(?:<\s*)?[\d.]+) equiv\.$/,(_,a)=>`${a} equiv.`],
  [/^(cost|energy|id) sensitivity chart$/,(_,a)=>`${({cost:'成本',energy:'泵送电耗',id:'内径'})[a]}敏感性图`],
  [/^(.+?): (.+) · NPS (.+) · Cost (.+) · Pumping (.+) · ID (.+)$/,(_,a,b,c,d,e,f)=>`${dict[a]||a}：${b} · NPS ${c} · 成本 ${d} · 泵送电耗 ${e} · 内径 ${f}`],
  [/^(.+?): (.+) · Invalid: (.+)$/,(_,a,b,c)=>`${dict[a]||a}：${b} · 无效：${translate(c)}`],
  [/^Case (\d+): full-process (.+), ECOB (.+)$/i,(_,a,b,c)=>`案例 ${a}：全流程 ${b}，ECOB ${c}`],
  [/^Case (\d+) · Full-process (.+) · ECOB (.+) · tabulated absolute cost deviation (.+)$/i,(_,a,b,c,d)=>`案例 ${a} · 全流程 ${b} · ECOB ${c} · 表列绝对成本偏差 ${d}`],
  [/^Case (\d+)$/i,(_,a)=>`案例 ${a}`],
  [/^([\d.]+) million tonnes per year; NPS (.+)$/,(_,a,b)=>`${a} MtCO₂/y；NPS ${b}`],
  [/^Requested NPS (.+)$/,(_,a)=>`指定 NPS ${a}`],
  [/^Case (\d+) · (Cost|Diameter) parity plot · highlighted point corresponds to the selected case\.$/,(_,a,b)=>`案例 ${a} · ${dict[b]||b}一致性图 · 高亮点为所选案例。`],
  [/^(.+): Reported (.+)$/,(_,a,b)=>`${a}：报告值 ${b}`],
  [/^(.+) · reference year (\d+)$/,(_,a,b)=>`${a} · 参考年份 ${b}`],
  [/^Section (\d+(?:\.\d+)?)$/,(_,a)=>`章节 ${a}`],
  [/^Selected candidate (.+)$/,(_,a)=>`已选候选方案 ${a}`],
  [/^Compared with lowest cost: (.+) transport cost · (.+) lifecycle GHG$/,(_,a,b)=>`相较最低成本：输送成本 ${a} · 生命周期 GHG ${b}`],
  [/^Endpoint-to-commercial OD rounding is within (.+)\. All displayed commercial options satisfy the current screening checks\.$/,(_,a)=>`端点至商用外径的取整差异在 ${a} 以内。所有显示方案均满足当前初步筛选条件。`],
  [/^One or more endpoint theoretical ODs lie outside the current NPS table range\. Extend the commercial pipe database before final engineering use\. Maximum endpoint OD mapping difference: (.+)\.$/,(_,a)=>`一个或多个理论端点外径超出当前 NPS 表范围。最终工程应用前应扩充商用管道数据库。最大端点外径映射差异：${a}。`],
  [/^Engineered wall (.+); verify commercial schedule\.$/,(_,a)=>`工程计算壁厚 ${a}；请核实商用壁厚等级。`],
  [/^(\d+) planned cases? · final sampled value (.+?)(?: \(To (.+) is not on this step grid\))? · other inputs fixed$/,(_,a,b,c)=>`计划 ${a} 个案例 · 最后采样值 ${b}${c?`（终止值 ${c} 不在步长网格上）`:''} · 其他输入固定`],
  [/^(\d+) changed inputs?$/,(_,a)=>`${a} 项输入变化`],
  [/^(\d+) cases · (\d+) invalid · (\d+) with engineering warnings · (.+)$/,(_,a,b,c,d)=>`${a} 个案例 · ${b} 个无效 · ${c} 个有工程警告 · ${translate(d)}`],
  [/^(.+) sensitivity$/,(_,a)=>`${dict[a]||a}敏感性分析`],
  [/^(Higher|Lower|Unchanged) · (.+)$/,(_,a,b)=>`${dict[a]||a} · ${b}`],
  [/^Case A NPS (.+) · Case B NPS (.+)$/,(_,a,b)=>`Case A NPS ${a} · Case B NPS ${b}`],
  [/^Enter a valid number for (.+)\.$/,(_,a)=>`请输入有效数值：${dict[a]||a}。`],
  [/^Please correct the project inputs to refresh the results\. (.+)$/,(_,a)=>`请修正项目输入以更新结果。${translate(a)}`],
  [/^Screening warning: (.+)$/,(_,a)=>`初步评估警告：${a.split(' · ').map(translate).join(' · ')}`],
  [/^Requested NPS (.+) unavailable; used NPS (.+)$/,(_,a,b)=>`请求的 NPS ${a} 不可用；采用 NPS ${b}`],
  [/^Case A saved from current project(?: · Practical candidate NPS (.+))?\. Edit inputs above to create Case B\.$/,(_,a)=>`已将当前项目保存为 Case A${a?' · 折中候选 NPS '+a:''}。修改上方输入以创建 Case B。`],
  [/^Cannot save Case A: (.+)$/,(_,a)=>`无法保存 Case A：${translate(a)}`],
  [/^Cannot compare: (.+)$/,(_,a)=>`无法对比：${translate(a)}`],
  [/^(Case A|Case B): (.+)$/,(_,a,b)=>`${dict[a]||a}：${translate(b)}`],
  [/^Commercial design changes at (.+)\. Steps in pumping energy reflect the new commercial pipe size or wall schedule, rather than a direct change in pump efficiency\.$/,(_,a)=>`商用设计在 ${a} 处发生变化。泵送电耗的阶跃反映商用管径或壁厚等级变化，而非泵效率直接变化。`],
  [/^Why the pumping curve steps: a longer project lifetime changes the cost trade-off and can select a different commercial pipe \((.+)\)\. For the same pipe geometry and flow, project lifetime alone does not change specific pumping electricity\.$/,(_,a)=>`泵送曲线出现阶跃：更长的项目寿命改变成本权衡，并可能选用不同商用管道（${a}）。管道几何和流量相同时，项目寿命本身不改变单位泵送电耗。`],
  [/^Operating-hours sweep holds instantaneous mass flow \(kg\/s\) fixed, so annual CO₂ throughput changes with hours\. (.+)$/,(_,a)=>`运行小时数扫描保持瞬时质量流量（kg/s）不变，因此年 CO₂ 输送量随运行小时数变化。${translate(a)}`],
  [/^Selected commercial design changes at (.+); this can also create steps in pumping electricity\.$/,(_,a)=>`商用设计在 ${a} 处发生变化，也可能导致泵送电耗阶跃。`],
  [/^(.+) \((.+)\)$/,(_,a,b)=>dict[a]?`${dict[a]}（${dict[b]||b}）`:null],
  [/^(.+) · (.+)$/,(_,a,b)=>{let x=translate(a),y=translate(b);return x!==a||y!==b?`${x} · ${y}`:null;}],
 ];
 function translate(s){const n=normalize(s);if(!n||!/[A-Za-z]{2}/.test(n)||/^Schedule\s+\S+$/.test(n)||/^NPS\s+[\d.¼½¾/ -]+(?: · Sch\s+\S+)?$/.test(n))return s;let z=Object.hasOwn(dict,n)?dict[n]:null;
  if(z==null)for(const [r,f] of patterns){const m=n.match(r);if(m){z=f(...m);if(z!=null)break;}}
  return z==null?s:s.match(/^\s*/)[0]+z+s.match(/\s*$/)[0];}
 function allowed(node){const e=node.parentElement;return e&&!e.closest('script,style,math,code,pre,textarea,[data-i18n-skip]');}
 function convertNode(n){if(!allowed(n))return;let cur=n.nodeValue, prev=textCache.get(n);let original=prev&&cur===prev.zh?prev.en:cur;
  if(lang==='en'){if(prev&&cur===prev.zh)n.nodeValue=prev.en;return;}
  if(n.parentElement.tagName==='OPTION'){if(!n.parentElement.hasAttribute('value'))n.parentElement.setAttribute('value',n.parentElement.value);n.parentElement.dataset.i18nEnText=original.trim();}
  let zh=translate(original);if(zh!==original){textCache.set(n,{en:original,zh});if(cur!==zh)n.nodeValue=zh;}}
 function convertAttrs(e){if(!e.getAttribute||e.closest('script,style,math,[data-i18n-skip]'))return;let m=attrCache.get(e)||{};
  for(const a of attrs){let cur=e.getAttribute(a);if(cur==null)continue;let old=m[a],original=old&&cur===old.zh?old.en:cur;
   if(lang==='en'){if(old&&cur===old.zh)e.setAttribute(a,old.en);continue;}
   let zh=translate(original);if(zh!==original){m[a]={en:original,zh};if(cur!==zh)e.setAttribute(a,zh);}}
  if(Object.keys(m).length)attrCache.set(e,m);}
 function localize(root){if(!root)return;if(root.nodeType===3){convertNode(root);return;}if(root.nodeType!==1||root.matches('script,style,math,code,pre,[data-i18n-skip]'))return;
  convertAttrs(root);const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode())convertNode(node);
  root.querySelectorAll('[aria-label],[aria-valuetext],[title],[placeholder],[alt]').forEach(convertAttrs);}
 function observe(){if(lang!=='zh')return;
  if(document.getElementById('siteNav')){
    const targets=document.querySelectorAll('#main,.tooltip-portal,.scv-hover-tip');
    targets.forEach(e=>observer.observe(e,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrs}));
  }else if(document.getElementById('how-it-works')){
    const label=document.getElementById('ev2-stage-label');if(label)observer.observe(label,{subtree:true,childList:true,characterData:true});
  }else{
    // Homepage animations write numeric results only; no text observer on every frame.
  }
 }
 // Only changed DOM nodes are localized; styles, animation attributes and numeric-only nodes are ignored.
 observer=new MutationObserver(records=>{observer.disconnect();const nodes=new Set();for(const r of records){if(r.type==='attributes'){if(r.target.isConnected)convertAttrs(r.target);}else if(r.type==='characterData')nodes.add(r.target);else for(const n of r.addedNodes)nodes.add(n);}for(const n of nodes){if(!n.isConnected)continue;if(n.nodeType===3&&!/[A-Za-z]{2}/.test(n.nodeValue)&&!textCache.has(n))continue;localize(n);}observe();});
 const globe='<svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>';
 function makeToggle(){const b=document.createElement('button');b.type='button';b.className='ecob-language-toggle';b.dataset.i18nSkip='';b.innerHTML=globe+'<span>中文</span>';b.addEventListener('click',()=>{const mobile=b.closest('.ecob-mobile-panel');const calcMobile=b.closest('#siteNav')&&matchMedia('(max-width:880px)').matches;setLanguage(lang==='en'?'zh':'en',true);closeMenu();if(mobile)menuButton?.focus({preventScroll:true});else if(calcMobile)document.getElementById('navMobileToggle')?.focus({preventScroll:true});});return b;}
 function closeMenu(){if(menuButton){menuButton.setAttribute('aria-expanded','false');menuPanel.classList.remove('ecob-menu-open');}const calc=document.getElementById('siteNav');if(calc){calc.classList.remove('mobile-open');document.getElementById('navMobileToggle')?.setAttribute('aria-expanded','false');}}
 function installNav(){const nav=document.querySelector('.intro-nav .intro-nav-links')||document.querySelector('.nav-links');if(!nav)return;
  const calc=!!document.getElementById('siteNav'),cta=nav.querySelector('.intro-tool,.nav-cta');
  if(calc){nav.append(makeToggle());return;}
  const existing=[...nav.querySelectorAll(':scope > a')].filter(a=>a!==cta);menuPanel=document.createElement('div');menuPanel.className='ecob-mobile-panel';menuPanel.id='ecobMobileNavPanel';
  existing.forEach(a=>{const clone=a.cloneNode(true);clone.removeAttribute('id');menuPanel.append(clone);a.classList.add('ecob-desktop-link');});
  const desktop=makeToggle();desktop.classList.add('ecob-desktop-language');nav.insertBefore(desktop,cta||null);
  menuButton=document.createElement('button');menuButton.type='button';menuButton.className='ecob-mobile-menu';menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-controls',menuPanel.id);menuButton.innerHTML='<span>Menu</span><svg aria-hidden="true" viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m4 6 4 4 4-4"/></svg>';nav.insertBefore(menuButton,cta||null);
  menuPanel.append(makeToggle());nav.append(menuPanel);menuButton.addEventListener('click',()=>{let open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuPanel.classList.toggle('ecob-menu-open',open);});
  menuPanel.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});document.addEventListener('click',e=>{if(!nav.contains(e.target))closeMenu();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});matchMedia('(max-width:760px)').addEventListener?.('change',closeMenu);
 }
 function updateLinks(){document.querySelectorAll('a[href]').forEach(a=>{let href=a.getAttribute('href');if(!href||href.startsWith('#')||! /^(?:\.\/)?(?:index|calculator|how-it-works)\.html(?:[?#]|$)/i.test(href))return;const u=new URL(href,'https://ecob.invalid/');u.searchParams.set('lang',lang);a.setAttribute('href',href.split(/[?#]/)[0]+u.search+u.hash);});}
 function setLanguage(next,write){observer.disconnect();lang=next==='zh'?'zh':'en';document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  if(write){try{localStorage.setItem(key,lang);}catch{}try{const u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(history.state,'',u);}catch{}}
  localize(document.body);for(const b of document.querySelectorAll('.ecob-language-toggle')){b.querySelector('span').textContent=lang==='zh'?'EN':'中文';b.setAttribute('aria-label',lang==='zh'?'Switch to English':'切换至简体中文');}
  const titles={'index.html':['ECOB+ | CO₂ 管道快速选径与成本评估','ECOB+ | CO₂ Pipeline Sizing & Cost Screening'],'calculator.html':['ECOB+ 计算器 | CO₂ 管道选径与成本评估','ECOB+ Calculator | CO₂ Pipeline Sizing & Cost Screening'],'how-it-works.html':['ECOB+ | 方法原理','How ECOB Works | ECOB+']};const page=document.getElementById('siteNav')?'calculator.html':document.getElementById('how-it-works')?'how-it-works.html':'index.html';const pair=titles[page];document.title=pair[lang==='zh'?0:1];
  updateLinks();observe();window.dispatchEvent(new Event('resize'));window.dispatchEvent(new CustomEvent('ecob:languagechange',{detail:{lang}}));
 }
 installNav();let initial='en';try{initial=localStorage.getItem(key)||'en';}catch{}const requested=new URLSearchParams(location.search).get('lang');if(requested==='zh'||requested==='en'){initial=requested;try{localStorage.setItem(key,requested);}catch{}}setLanguage(initial,false);
 window.ECOBI18n={setLanguage,get language(){return lang;},t:s=>lang==='zh'?translate(s):s,localize:root=>localize(root),originalText:node=>{let m=textCache.get(node);return m&&node.nodeValue===m.zh?m.en:node.nodeValue;}};
})();
