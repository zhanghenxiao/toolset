import{V as _,a as O,b as z}from"./vue-vendor-b0d8f4d9.js";import{M as U}from"./markdown-98eb5fe8.js";import{H as C}from"./highlight-2a9f9d24.js";import{s as b}from"./ffmpeg-3bd2b020.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(a){if(a.ep)return;a.ep=!0;const n=e(a);fetch(a.href,n)}})();function d(s,t,e,i,a,n,o,u){var l=typeof s=="function"?s.options:s;t&&(l.render=t,l.staticRenderFns=e,l._compiled=!0),i&&(l.functional=!0),n&&(l._scopeId="data-v-"+n);var r;if(o?(r=function(p){p=p||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!p&&typeof __VUE_SSR_CONTEXT__<"u"&&(p=__VUE_SSR_CONTEXT__),a&&a.call(this,p),p&&p._registeredComponents&&p._registeredComponents.add(o)},l._ssrRegister=r):a&&(r=u?function(){a.call(this,(l.functional?this.parent:this).$root.$options.shadowRoot)}:a),r)if(l.functional){l._injectStyles=r;var m=l.render;l.render=function(N,y){return r.call(y),m(N,y)}}else{var g=l.beforeCreate;l.beforeCreate=g?[].concat(g,r):[r]}return{exports:s,options:l}}const H={name:"App"};var W=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[e("transition",{attrs:{name:"page",mode:"out-in"}},[e("router-view")],1)],1)},Z=[],j=d(H,W,Z,!1,null,null,null,null);const q=j.exports,J="modulepreload",Q=function(s){return"/"+s},w={},X=function(t,e,i){if(!e||e.length===0)return t();const a=document.getElementsByTagName("link");return Promise.all(e.map(n=>{if(n=Q(n),n in w)return;w[n]=!0;const o=n.endsWith(".css"),u=o?'[rel="stylesheet"]':"";if(!!i)for(let m=a.length-1;m>=0;m--){const g=a[m];if(g.href===n&&(!o||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${n}"]${u}`))return;const r=document.createElement("link");if(r.rel=o?"stylesheet":J,o||(r.as="script",r.crossOrigin=""),r.href=n,document.head.appendChild(r),o)return new Promise((m,g)=>{r.addEventListener("load",m),r.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${n}`)))})})).then(()=>t()).catch(n=>{const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=n,window.dispatchEvent(o),!o.defaultPrevented)throw n})};const K={name:"SiteHeader",directives:{"click-outside":{bind(s,t,e){s.clickOutsideEvent=function(i){s===i.target||s.contains(i.target)||e.context[t.expression](i)},document.body.addEventListener("click",s.clickOutsideEvent)},unbind(s){document.body.removeEventListener("click",s.clickOutsideEvent)}}},data(){return{langOpen:!1,themeOpen:!1,menuOpen:!1,currentTheme:"light"}},computed:{currentLangLabel(){return this.$i18n.locale==="en"?"EN":"CN"},currentLang(){return this.$i18n.locale}},created(){const s=localStorage.getItem("theme")||"light";this.setTheme(s)},methods:{toggleLang(){this.langOpen=!this.langOpen,this.themeOpen=!1},toggleTheme(){this.themeOpen=!this.themeOpen,this.langOpen=!1},toggleMenu(){this.menuOpen=!this.menuOpen,this.menuOpen&&(this.langOpen=!1,this.themeOpen=!1)},closeLang(){this.langOpen=!1},closeTheme(){this.themeOpen=!1},closeMenu(){this.menuOpen=!1},setLang(s){this.$i18n.locale=s,localStorage.setItem("language",s),document.documentElement.lang=s==="zh"?"zh-CN":"en-US",this.langOpen=!1},setTheme(s){this.currentTheme=s,this.themeOpen=!1,localStorage.setItem("theme",s);let t=s;s==="auto"&&(t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),document.documentElement.setAttribute("data-theme",t)}}};var Y=function(){var t=this,e=t._self._c;return e("header",{staticClass:"site-header"},[e("div",{staticClass:"container header-content"},[e("div",{staticClass:"logo-section"},[e("div",{staticClass:"logo-icon"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"24",height:"24"}},[e("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"}})])]),e("span",{staticClass:"logo-text"},[t._v("数维探索_IT")])]),e("button",{staticClass:"mobile-menu-btn",class:{active:t.menuOpen},on:{click:t.toggleMenu}},[e("span"),e("span"),e("span")]),e("nav",{staticClass:"main-nav",class:{"mobile-open":t.menuOpen}},[e("ul",[e("li",{on:{click:t.closeMenu}},[e("router-link",{attrs:{to:"/","exact-active-class":"active"}},[t._v(t._s(t.$t("nav.home")))])],1),e("li",{on:{click:t.closeMenu}},[e("router-link",{attrs:{to:"/tools","active-class":"active"}},[t._v(t._s(t.$t("nav.tools")))])],1)])]),e("div",{staticClass:"header-actions"},[e("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:t.closeLang,expression:"closeLang"}],staticClass:"dropdown-wrapper"},[e("div",{staticClass:"action-item lang-selector",on:{click:t.toggleLang}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08-2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.28 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"}})]),e("span",{staticClass:"action-label"},[t._v(t._s(t.currentLangLabel))]),e("svg",{class:{rotate:t.langOpen},attrs:{viewBox:"0 0 24 24",width:"12",height:"12"}},[e("path",{attrs:{fill:"currentColor",d:"M7 10l5 5 5-5z"}})])]),t.langOpen?e("div",{staticClass:"dropdown-menu"},[e("div",{staticClass:"dropdown-item",class:{active:t.currentLang==="zh"},on:{click:function(i){return t.setLang("zh")}}},[t._v("简体中文")]),e("div",{staticClass:"dropdown-item",class:{active:t.currentLang==="en"},on:{click:function(i){return t.setLang("en")}}},[t._v("English")])]):t._e()]),e("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:t.closeTheme,expression:"closeTheme"}],staticClass:"dropdown-wrapper"},[e("div",{staticClass:"action-item theme-toggle",on:{click:t.toggleTheme}},[t.currentTheme==="light"?e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"}})]):t.currentTheme==="dark"?e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"}})]):e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.13-14.71a.5.5 0 0 0-.58.12l-3 4a.5.5 0 0 0 .4.8h1.55l-2.07 4.14a.5.5 0 0 0 .45.72h2l-2.22 4.44a.5.5 0 0 0 .89.44l7-14a.5.5 0 0 0-.42-.66z"}})]),e("svg",{class:{rotate:t.themeOpen},attrs:{viewBox:"0 0 24 24",width:"12",height:"12"}},[e("path",{attrs:{fill:"currentColor",d:"M7 10l5 5 5-5z"}})])]),t.themeOpen?e("div",{staticClass:"dropdown-menu"},[e("div",{staticClass:"dropdown-item",class:{active:t.currentTheme==="light"},on:{click:function(i){return t.setTheme("light")}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"}})]),e("span",[t._v(t._s(t.$t("theme.light")||"浅色"))])]),e("div",{staticClass:"dropdown-item",class:{active:t.currentTheme==="dark"},on:{click:function(i){return t.setTheme("dark")}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"}})]),e("span",[t._v(t._s(t.$t("theme.dark")||"深色"))])]),e("div",{staticClass:"dropdown-item",class:{active:t.currentTheme==="auto"},on:{click:function(i){return t.setTheme("auto")}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"}})]),e("span",[t._v(t._s(t.$t("theme.auto")||"自动"))])])]):t._e()]),e("div",{staticClass:"auth-buttons"})])])])},tt=[],et=d(K,Y,tt,!1,null,"f88b9ae3",null,null);const G=et.exports;const st={name:"DropdownFilter",props:{placeholder:{type:String,default:"请选择"},options:{type:Array,required:!0},value:{type:Array,default:()=>[]},searchable:{type:Boolean,default:!0},showChips:{type:Boolean,default:!1}},data(){return{isOpen:!1,searchQuery:"",internalValue:[...this.value]}},watch:{value(s){this.internalValue=[...s]}},computed:{filteredOptions(){if(!this.searchQuery)return this.options;const s=this.searchQuery.toLowerCase();return this.options.filter(t=>t.toLowerCase().includes(s))}},methods:{toggle(){this.isOpen=!this.isOpen},close(){this.isOpen=!1},updateValue(){this.$emit("input",this.internalValue)},remove(s){const t=this.internalValue.indexOf(s);t>-1&&(this.internalValue.splice(t,1),this.updateValue())}},directives:{"click-outside":{bind(s,t,e){s.clickOutsideEvent=function(i){s===i.target||s.contains(i.target)||e.context[t.expression](i)},document.body.addEventListener("click",s.clickOutsideEvent)},unbind(s){document.body.removeEventListener("click",s.clickOutsideEvent)}}}};var it=function(){var t=this,e=t._self._c;return e("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:t.close,expression:"close"}],staticClass:"dropdown-filter"},[e("div",{staticClass:"dropdown-trigger",class:{"is-open":t.isOpen},on:{click:t.toggle}},[e("div",{staticClass:"selected-area"},[t.value.length>0?[t.showChips?e("div",{staticClass:"chips"},t._l(t.value,function(i){return e("span",{key:i,staticClass:"chip"},[t._v(" "+t._s(i)+" "),e("i",{staticClass:"close-icon",on:{click:function(a){return a.stopPropagation(),t.remove(i)}}},[t._v("×")])])}),0):e("span",{staticClass:"text-truncate"},[t._v(t._s(t.value.join(", ")))])]:e("span",{staticClass:"placeholder"},[t._v(t._s(t.placeholder))])],2),e("div",{staticClass:"arrow-icon"},[e("svg",{style:{transform:t.isOpen?"rotate(180deg)":""},attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M7 10l5 5 5-5z"}})])])]),e("transition",{attrs:{name:"fade-slide"}},[t.isOpen?e("div",{staticClass:"dropdown-panel"},[t.searchable?e("div",{staticClass:"search-box"},[e("svg",{staticClass:"search-icon",attrs:{viewBox:"0 0 24 24",width:"16",height:"16"}},[e("path",{attrs:{fill:"currentColor",d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}})]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.searchQuery,expression:"searchQuery"}],staticClass:"search-input",attrs:{type:"text",placeholder:"搜索"+t.placeholder+"..."},domProps:{value:t.searchQuery},on:{input:function(i){i.target.composing||(t.searchQuery=i.target.value)}}}),t.searchQuery?e("i",{staticClass:"clear-icon",on:{click:function(i){t.searchQuery=""}}},[t._v("×")]):t._e()]):t._e(),e("div",{staticClass:"options-list"},[t._l(t.filteredOptions,function(i){return e("label",{key:i,staticClass:"option-item"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.internalValue,expression:"internalValue"}],attrs:{type:"checkbox"},domProps:{value:i,checked:Array.isArray(t.internalValue)?t._i(t.internalValue,i)>-1:t.internalValue},on:{change:[function(a){var n=t.internalValue,o=a.target,u=!!o.checked;if(Array.isArray(n)){var l=i,r=t._i(n,l);o.checked?r<0&&(t.internalValue=n.concat([l])):r>-1&&(t.internalValue=n.slice(0,r).concat(n.slice(r+1)))}else t.internalValue=u},t.updateValue]}}),e("span",{staticClass:"checkbox-custom"}),e("span",{staticClass:"option-label"},[t._v(t._s(i))])])}),t.filteredOptions.length===0?e("div",{staticClass:"no-options"},[t._v("无匹配结果")]):t._e()],2)]):t._e()])],1)},at=[],nt=d(st,it,at,!1,null,"23fe5532",null,null);const ot=nt.exports,f="/assets/thumb-1-02307e90.png",x="/assets/thumb-2-9a0be4a2.png",k="/assets/thumb-3-49794369.png",T="/assets/thumb-4-8c527afd.png",rt="/assets/leaf-main-a05e1022.png",lt="/assets/jsonview-thumb-e1134dfc.png",ct="/assets/cors-thumb-5c824e56.png",I="/assets/mapbox-3d-thumb-ee13df80.png",A="/assets/thumb-2-9a0be4a2.png",L="/assets/antigravity-thumb-5b6695cb.png",S="/assets/antigravity-thumb-5b6695cb.png",$="/assets/wireshark-windows-xp-guide-thumb-df60f83d.png",P="/assets/google-antigravity-2026-guide-thumb-67aaf437.png",c=`

---
专注于分享经过验证的开发技巧与实用资源，致力于为你节省检索信息的时间，以及AI工具经验分享获取更多干货。关注微信公众号：数维探索`,v=[{id:1,slug:"antigravity-unban-guide",title:"Google Antigravity 账号解封指南, 官方解封教程来了(附唯一申诉入口)",image:S,date:"2026-04-07",author:"数维探索",views:"2,500",category:"视频",duration:"05:30",excerpt:"近期, 不少开发者反映其用于体验 Google 全新 AI IDE Antigravity(或 Gemini CLI)的账号遭到了封禁. 如果你也遇到了同样的问题, 不必惊慌. 本期视频将为你提供一份详尽的官方解封教程, 帮助你抓住这唯一一次的解封机会.",tags:[{name:"账号解封",type:"blue"},{name:"Antigravity",type:"blue"},{name:"AI工具",type:"green"}],collection:"AI百科",relatedIds:[13,2,3],recommendationIds:[2,3,6,7],gallery:[S],markdownContent:`
> 1. 账号解封url

\`\`\`
https://docs.google.com/forms/d/e/1FAIpQLScOJWibQ_-hYuVv63kJTgEqlgAaOwRLGFTbXm-QY1gz8U0CGA/viewform
\`\`\`

#####  总结内容

# Google Antigravity 账号解封指南, 官方解封教程来了(附唯一申诉入口)

## Google Antigravity 账号解封终极指南

近期, 不少开发者反映其用于体验 Google 全新 AI IDE **Antigravity**(或 Gemini CLI)的账号遭到了封禁. 如果你也遇到了同样的问题, 不必惊慌. 本期视频将为你提供一份详尽的官方解封教程, 帮助你抓住这**唯一一次**的解封机会.

### 为什么你的 Antigravity 账号会被封禁?

根据官方申诉表单的提示, 封禁的主要原因通常是违反了服务条款(ToS), 例如通过**非官方的第三方工具或方式**来使用 Antigravity 或 Gemini API. 官方旨在确保用户在其指定的环境(如 Gemini CLI)中使用服务.

### 解封步骤详解

整个解封流程围绕一份官方的英文申诉表单展开. 请严格按照以下步骤操作：

1. **找到官方申诉链接**
   - 视频中提到, 你可以访问 \`tooset.site\` 并搜索关键词“账号解封”来找到包含该链接的文章.
   - 这个链接是唯一的官方申诉入口. 请务必核对 URL, 确保你访问的是正确的页面.
2. **填写申诉表单**
   - **确认邮箱**：表单会要求你确认申诉的 Gmail 邮箱. 请确保选择的是你被封禁的那个 Antigravity 账号所绑定的邮箱.
   - **勾选承诺复选框**：这是最关键的一步. 你需要勾选一个复选框, 其内容大致为：“我理解并承诺, 我将仅在官方允许的 Antigravity / Gemini CLI 环境下使用该服务, 不再违反用户协议. 如果我再次违规, Google 有权**永久封禁**我的账号. ”
3. **提交并耐心等待**
   - 提交表单后, 你需要耐心等待审核结果. 根据经验, 等待时间可能在 **5 小时到 72 小时**之间.
   - 如果申诉成功, 你会收到一封邮件, 通知你的账号访问权限已经恢复.

### 关键警告：机会仅此一次!

请务必重视申诉表单中的承诺. 明确表示, 如果再次违规, 账号将被**永久封禁**, 届时将再无申诉机会. 因此, 在解封后, 请严格遵守 Google 的服务条款, 避免使用任何第三方或未经授权的工具.

希望这期视频能帮助到所有遇到问题的开发者. 祝大家好运, 也希望你永远用不到这个教程.
`+c},{id:2,slug:"antigravity-2026-ban-analysis",title:"Google AI IDE Antigravity 2026大规模封号事件深度解析: 原因与应对策略",image:L,date:"2026-04-07",author:"数维探索",views:"1,000",category:"视频",duration:"08:00",excerpt:"2026年2月12日, 科技圈迎来一次震动, 许多开发者登录 Google 的前沿 AI IDE Antigravity时, 惊讶地发现自己的账号已被封禁. 这次事件波及范围广泛, 从普通用户到付费的Pro乃至Ultra用户都未能幸免...",tags:[{name:"封号事件",type:"blue"},{name:"AI工具",type:"blue"},{name:"Antigravity",type:"green"}],collection:"AI百科",relatedIds:[1,3,4],recommendationIds:[3,4,7,8],gallery:[L],markdownContent:`
# Google AI IDE Antigravity 2026大规模封号事件深度解析: 原因与应对策略

## 🚨 警报: Google AI IDE Antigravity 2026大规模封号事件回顾

2026年2月12日, 科技圈迎来一次震动, 许多开发者登录 Google 的前沿 AI IDE Antigravity 时, 惊讶地发现自己的账号已被封禁. 这次事件波及范围广泛, 从普通用户到付费的Pro乃至Ultra用户都未能幸免, 引发了社区的激烈讨论. 本视频将带你深入了解事件的始末、分析背后的原因, 并提供切实可行的应对建议.

### ❓ 如何判断你的账号是否被封禁？

如果你遇到了以下情况, 那么很可能已成为本次封禁潮中的一员:

1. **IDE 登录界面异常**: 登录 Antigravity IDE 时看到特定的封禁提示页面.
2. **第三方工具返回403错误**: 通过非官方工具调用API时, 收到 \`403 Forbidden\` 的错误码.
3. **Gemini CLI 确认**: 通过官方的 Gemini 命令行工具登录, 会明确提示账号因“违反用户协议”而被暂停, 并提供一个申诉邮箱.

### 💥 封禁范围: 付费也非“免死金牌”

本次封禁行动覆盖面极广, 明确波及了以下用户群体:

- **Pro 用户** (包括学生Pro和付费Pro)
- **Ultra 付费用户**

这表明, 仅仅为服务付费, 并不能豁免用户遵守服务条款的义务. 官方对违规行为采取了“一视同仁”的强硬态度.

### 🔍 根本原因: 开源工具的“双刃剑”效应

视频的核心观点指出, 本次大规模封号很可能与**使用绕过官方IDE的开源项目**有关. 演讲者提出了一个发人深省的思考链:

- **开源意味着透明**: 任何旨在“便利”用户、绕过官方限制的开源工具, 其代码都是公开的.
- **AI 助力审查**: 官方工程师可以轻易获取这些开源代码, 并利用强大的AI模型进行分析, 从而生成一套高精度的检测方案来识别违规用户.
- **极低的检测成本**: 对于Google这样的巨头来说, 利用AI分析代码并标记违规账号的成本（Token消耗）微乎其微.
- **高精度标记**: 这套自动化方案可以达到极高的准确率（如95%-99%）, 精准定位违规账号.

因此, 那些看似便捷的开源工具, 在平台收紧政策时, 反而成为了官方精准打击的“靶子”. 这正是开源在这类场景下的“双刃剑”效应.

### 行业趋势与官方态度

值得注意的是, 这并非孤立事件. 视频中也提到了友商（如Kiro）同样在进行类似的封号行动. 这预示着整个行业正在加强对API和服务使用行为的规范化管理, 合规使用将成为新常态.

### 🛡️ 给开发者的建议

面对日益收紧的环境, 视频给出了以下核心建议:

1. **珍惜你的账号**: 随着环境趋严, 每一个合规的、功能完备的账号都将变得越来越宝贵.
2. **评估违规代价**: 在使用任何非官方工具前, 请深刻思考违反用户协议可能带来的后果（账号永久封禁、数据丢失等）, 并判断自己是否能承受.
3. **坚持合规使用**: 对于绝大多数普通用户 and 开发者, 最安全的方式是在官方IDE内完成登录和API调用等所有操作, 严格遵守平台的用户协议.

### 总结

这次 Antigravity 封号事件是一个明确的信号: AI 服务的“蛮荒时代”正在结束. 平台方正利用其技术优势, 以前所未有的效率和精度来执行规则. 对于开发者而言, 理解并尊重规则, 将是未来在AI浪潮中稳健前行的关键.
`+c},{id:3,slug:"llm-open-source-panic-v2",title:"AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?",image:A,date:"2026-04-07",author:"数维探索",views:"1,500",category:"视频",duration:"06:30",excerpt:"近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本视频将带你深入探究这一话题的来龙去脉。",tags:[{name:"AI趋势",type:"blue"},{name:"LLM",type:"blue"},{name:"开源",type:"green"}],collection:"AI百科",relatedIds:[1,7,14],recommendationIds:[2,7,8,12],gallery:[A],markdownContent:`
# AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?

## 开源模型的“闭源”风波: 是恐慌还是未来?

近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本视频将带你深入探究这一话题的来龙去脉。

### 传闻的源头与真相

一切始于几则看似孤立的行业动态:

- **智谱AI (GLM)**: 官方发布海报安抚社区，承诺 GLM-5.1 将继续开源，这本身就暗示了社区存在恐慌情绪。与此同时，其为特定场景定制的 \`GLM-Turbo\` 模型并未开源。
- **MiniMax** 和 **小米 (Xiaomi)**: 其新发布的 \`MM-2.7\` 和 \`MiMo-V2-Pro\` 模型同样在发布之初选择了不开源。

然而，经过深入挖掘，我们发现情况更为复杂:

- **MiniMax** 的模型据传只是 **推迟开源**。
- **小米** 的 \`MiMo-V2-Flash\` 已经开源，并承诺未来将有更多模型开放。

这种商业时代下的不确定性，加上许多模型在宣传时声称“对标或优化了顶级闭源模型”却不开放权重，自然会引发开发者的联想和担忧。

### 开源的两种模式: 你真的了解吗?

视频中用一个生动的“做蛋糕”比喻，解释了开源的两种主流形式:

1. **权重开源 (Weight Open-Source)**: 就像给你一个做好的蛋糕。你可以直接“吃”（使用模型），也可以在上面加奶油（进行微调）。代表模型有 **Qwen (通义千问)** 和 **GLM**。
2. **完整开源 (Fully Open-Source)**: 不仅给你蛋糕，还附上烤箱设计图和独家烘焙秘方（训练代码、数据集等）。这对于学习和研究意义重大。代表模型是 **DeepSeek**。

### 开源与商业: 混合模式是更优解?

开源与闭源并非完全对立，二者结合往往能形成更成功的商业模式。

- **“开源引流，闭源盈利”**: 厂商通过开源中小型模型构建社区生态，吸引用户，而将最顶尖、性能最强的“Max”或“Turbo”系列作为闭源的商业化产品。Qwen 和 GLM 都是这一策略的踐行者。
- **理想模式展望**: 视频作者提出了一个大胆的设想——当新一代模型发布时，将上一代模型开源。这虽然充满挑战，但或许能平衡商业利益和社区贡献。

有趣的是，作者认为，当前许多模型的开源并非完全自愿，而是在 **DeepSeek** 毅然决然地选择完整开源后，被市场“推”了一把的结果。因此，未来部分模型选择闭源，是符合商业逻辑的正常现象。

### 对个人和中小企业的影响微乎其微

对于绝大多数个人用户和小型公司而言，顶级大模型（如400B参数量）即使开源，本地部署的硬件门槛和技术难度也极高。因此，我们更应该关注 **小参数模型的开源情况**，这才是真正触手可及的资源。对于极少数因隐私需求而必须自部署的用户，其市场占比过小，难以影响厂商的整体战略。

### 现阶段模型选择建议

- **搜索任务**: 优先考虑 **Grok**
- **编程辅助**: **Opus-4.6** 或 **GPT-5.4 (Codex驱动)** 是当前的最优解。
- **UI设计**: **Gemini-3.1-Pro (满血版)** 是目前的首选。
- **本地部署**: 考虑 **Qwen** 或其他模型的小参数版本。

### 结语

AI 发展的历史车轮滚滚向前，不会因为某个模型的闭源而停滞。我们特别要感谢 **DeepSeek** 为开源社区做出的不可磨灭的贡献，它的行动惠及了每一位开发者。无论未来风云如何变幻，持续学习、拥抱变化，才是我们在AI时代立于不败之地的关键。
`+c},{id:4,slug:"cli-proxy-settings-ai-beginners",title:"AI新手必备: 命令行代理设置终极教程(临时与永久)",image:k,date:"2026-04-07",author:"数维探索",views:"2,100",category:"教程",duration:"10:30",excerpt:"在探索AI的世界时，网络限制常是第一道坎。本指南手把手教你如何为命令行设置临时与永久代理，助你高效学习。",tags:[{name:"AI学习",type:"blue"},{name:"命令行",type:"blue"},{name:"代理设置",type:"green"}],collection:"数维探索工具箱",relatedIds:[13,5,6],recommendationIds:[5,6,9,10],gallery:[k],markdownContent:`
# AI新手必备: 命令行代理设置终极教程(临时与永久)

## 告别网络错误: AI新手的命令行代理完全指南

在探索人工智能(AI)的广阔世界时，许多新手开发者会遇到一个共同的障碍: 由于网络限制，无法顺利访问所需的资源、库或模型。这个问题通常可以通过为命令行(Terminal)设置代理来解决。本指南将教你如何配置代理，让你专注于学习和创造。

### 为什么需要为命令行设置代理？
许多AI工具、包管理器(如pip、conda)和版本控制系统(如Git)都需要通过命令行访问国际网络资源。如果你的网络环境受限，就会导致下载失败、连接超时等一系列问题。

### 方法一: 一次性临时代理
这种方法最简单快捷，适合临时性的任务。它只在当前的终端窗口中生效。

**核心步骤:**
1. **设置代理**:
   \`\`\`bash
   export https_proxy=http://127.0.0.1:7890
   export http_proxy=http://127.0.0.1:7890
   \`\`\`
2. **验证代理**: \`echo $https_proxy\`
3. **测试连接**: \`curl -I https://www.google.com\`
4. **取消代理**: \`unset https_proxy\`

### 方法二: 一劳永逸的自动化代理
修改终端的配置文件(如 \`~/.zshrc\` 或 \`~/.bash_profile\`)。

**配置示例:**
\`\`\`shell
# Proxy Functions
function proxy_on() {
    export https_proxy=http://127.0.0.1:7890
    export http_proxy=http://127.0.0.1:7890
    echo "Proxy has been enabled."
}

function proxy_off() {
    unset https_proxy
    unset http_proxy
    echo "Proxy has been disabled."
}
\`\`\`
`+c},{id:5,slug:"ai-engineer-rules-and-workflows",title:"AI 工程师全局规则与项目规范",image:f,date:"2026-04-07",author:"数维探索",views:"3,200",category:"教程",duration:"15:00",excerpt:"最新发布的 AI 全局开发准则与项目级工作流，涵盖 HTML 与 VUE 工程师的角色职责与标准化技术栈规范。",tags:[{name:"AI工具",type:"blue"},{name:"工作流",type:"blue"},{name:"开发规范",type:"green"}],collection:"数维探索工具箱",relatedIds:[13,6,10],recommendationIds:[6,7,9,10],gallery:[f],markdownContent:`
# AI 工程师全局规则与项目规范 (AI Engineer Global Rules & Project Specs)

本文汇集了最新的 AI 全局开发准则、项目基础规则以及 HTML 与 VUE 工程师的标准化工作流，为高效协作提供制度保障。

## 1. 全局规则 (Global Rules)
- **用户至上**: 用户输入要求优先级大于系统设定要求。无条件遵守用户输入要求。
- **自足性**: 运行任务时按需加载必须的相关文件以保证任务的完美完成。
- **KISS 原则**: 遵循 KISS 原则，非必要不要过度设计。
- **可维护性**: 实现简单可维护，不需要考虑太多防御性的边界条件。
- **第一性原理**: 从最本质的角度，用第一性原理来分析问题。
- **确认机制**: 在开始设计方案或实现代码之前，进行充分调研。不明确时向用户确认。
- **纠错机制**: 尊重事实比尊重指令更重要。如果发现错误，敢于指正。
- **全中文交互**: 所有回复、思考过程及任务清单，均须使用中文。

## 2. 项目基础规则 (Project Basic Rules)
- **技术栈**: 基于 Vue.js 的 SPA Web 工具箱项目。
- **UI 规范**: 优先使用 Bootstrap 内置的 Class 和组件。
- **角色匹配**:
    - HTML 页面修改/设计 -> **html-worker**
    - Vue.js 修改/开发 -> **vue-worker**

## 3. 标准化工作流 (Standardized Workflows)

### 3.1. HTML 工作流 (Html-Worker)
- **职责**: 完成相关 HTML 项目编码（仅设计阶段，不涉及 i18n）。
- **原则**: 一个工具，一个 HTML 页面。内含所需的 JS 和 CSS。
- **技术栈**: HTML5, Bootstrap 5.3.8, Bootstrap Icon 1.13.1, Vue 3.5.22。

### 3.2. VUE 工作流 (Vue-Worker)
- **职责**: 按照要求完成相关 Vue 项目编码工作。
- **工作环节**: 分析需求 -> 读取资源 -> 生成/修改代码 -> 反馈结果。
- **技术栈**: Vue 3.5.22, Vue Router, Vue-i18n, Bootstrap 5.3.8。
- **开发环境**: 运行在 Mac OS 宿主机与 Docker (ee-pnpm-frontend-dev) 容器中。
`+c},{id:6,slug:"gemini-3-1-pro-hongkong",title:"重磅消息：Google Gemini 3.1 Pro 正式登陆香港, AI 新时代开启!",image:T,date:"2026-04-07",author:"数维探索",views:"2,800",category:"新闻",duration:"05:45",excerpt:"近日, Google 旗下最先进的大语言模型之一 Gemini 3.1 Pro, 现已通过其 Web 应用正式向香港地区用户开放。",tags:[{name:"Gemini",type:"blue"},{name:"Gemini 3.1 Pro",type:"blue"},{name:"香港",type:"green"}],collection:"AI百科",relatedIds:[1,7,8],recommendationIds:[1,2,9,10],gallery:[T],markdownContent:`
# 重磅消息：Google Gemini 3.1 Pro 正式登陆香港, AI 新时代开启!

## 🚀 Google AI 重大进展：Gemini 3.1 Pro 在香港可用

近日, 科技圈迎来一个振奋人心的消息：Google 旗下最先进的大语言模型之一 **Gemini 3.1 Pro**, 现已通过其 Web 应用正式向香港地区用户开放。在过去很长一段时间里, 香港地区的用户都无法直接访问 Google 的高级 AI 模型服务, 而这次更新无疑是一个历史性的突破。

------

## ✅ 解锁“完全体”Gemini 体验

根据用户的实际测试截图, 我们可以确认以下几点关键信息：

1. **Web App 全功能上线**：用户现在可以通过网页端 \`gemini.google.com\` 访问服务。
2. **顶级模型可用**：界面清晰地显示了 \`Fast\` 和 \`Pro\` 两种模型选项, 并且模型确认其身份为 **Gemini 3.1 Pro**, 这代表着用户可以使用当前业界第一梯队的 AI 模型进行交互。
3. **付费渠道畅通**：页面下方出现了升级至 \`Google One AI Plus\` 的付费订阅提示。这意味着不仅是模型本身, 与之配套的整个付费生态系统也已在香港落地, 用户可以获得更强大的功能和更高的使用限额。

这表明, 此次开放的并非“阉割版”, 而是一个功能齐备的“完全体”Gemini 应用。

------

## 展望未来：从 Web 端到全平台覆盖

尽管目前仅限于 Web App, 但这通常是 Google 推广新服务的第一步。我们可以合理预期, 在不久的将来, 这一服务将逐步扩展到：

- **原生移动应用 (Android & iOS)**
- **开发者工具 (Agent, 命令行等)**
- **集成到更多 Google 产品中**

这次在香港的落地, 不仅仅是增加了一个可用地区, 更是一个强烈的信号：世界顶级的 AI 技术正在加速普及, 区域性的壁垒正在被打破. 对于香港乃至周边地区的开发者、研究人员和广大科技爱好者来说, 这意味着能够站在同一起跑线上, 利用最前沿的工具进行创新和学习。

总而言之, 这是一个值得庆祝的重要时刻, 它预示着 AI 应用将迎来更加广阔和光明的未来。
`+c},{id:7,slug:"llm-open-source-panic",title:"AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?",image:x,date:"2026-04-07",author:"数维探索",views:"1,500",category:"新闻",duration:"06:30",excerpt:"近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本文将带你深入探究这一话题的来龙去脉。",tags:[{name:"AI趋势",type:"blue"},{name:"LLM",type:"blue"},{name:"开源",type:"green"}],collection:"AI百科",relatedIds:[3,8,12],recommendationIds:[3,12,14,15],gallery:[x],markdownContent:`
# AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?

开源模型的“闭源”风波: 是恐慌还是未来?
近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本文将带你深入探究这一话题的来龙去脉。

## 传闻的源头与真相
一切始于几则看似孤立的行业动态:

* **智谱AI (GLM)**: 官方发布海报安抚社区，承诺 GLM-5.1 将继续开源，这本身就暗示了社区存在恐慌情绪。与此同时，其为特定场景定制的 GLM-Turbo 模型并未开源。
* **MiniMax 和 小米 (Xiaomi)**: 其新发布的 MM-2.7 和 MiMo-V2-Pro 模型同样在发布之初选择了不开源。

然而，经过深入挖掘，我们发现情况更为复杂:
* MiniMax 的模型据传只是 **推迟开源**。
* 小米 的 MiMo-V2-Flash 已经开源，并承诺未来将有更多模型开放。
这种商业时代下的不确定性，加上许多模型在宣传时声称“对标或优化了顶级闭源模型”却不开放权重，自然会引发开发者的联想和担忧。

## 开源的两种模式: 你真的了解吗?
文章中用一个生动的“做蛋糕”比喻，解释了开源的两种主流形式:
* **权重开源 (Weight Open-Source)**: 就像给你一个做好的蛋糕。你可以直接“吃”（使用模型），也可以在上面加奶油（进行微调）。代表模型有 Qwen (通义千问) 和 GLM。
* **完整开源 (Fully Open-Source)**: 不仅给你蛋糕，还附上烤箱设计图和独家烘焙秘方（训练代码、数据集等）。这对于学习和研究意义重大。代表模型是 DeepSeek。

## 开源与商业: 混合模式是更优解?
开源与闭源并非完全对立，二者结合往往能形成更成功的商业模式.
* **“开源引流，闭源盈利”**: 厂商通过开源中小型模型构建社区生态，吸引用户，而将最顶尖、性能最强的“Max”或“Turbo”系列作为闭源的商业化产品。Qwen 和 GLM 都是这一策略的踐行者。
* **理想模式展望**: 我们提出了一个大胆的设想——当新一代模型发布时，将上一代模型开源。这虽然充满挑战，但或许能平衡商业利益和社区贡献。

有趣的是，当前许多模型的开源并非完全自愿，而是在 DeepSeek 毅然决然地选择完整开源后，被市场“推”了一把的结果。因此，未来部分模型选择闭源，是符合商业逻辑的正常现象。

## 对个人和中小企业的影响微乎其微
对于绝大多数个人用户和小型公司而言，顶级大模型（如400B参数量）即使开源，本地部署的硬件门槛和技术难度也极高。因此，我们更应该关注 **小参数模型** 的开源情况，这才是真正触手可及的资源。对于极少数因隐私需求而必须自部署的用户，其市场占比过小，难以影响厂商的整体战略。

## 现阶段模型选择建议
* **搜索任务**: 优先考虑 Grok
* **编程辅助**: Opus-4.6 或 GPT-5.4 (Codex驱动) 是当前的最优解。
* **UI设计**: Gemini-3.1-Pro (满血版) 是目前的首选。
* **本地部署**: 考虑 Qwen 或其他模型的小参数版本。

## 结语
AI 发展的历史车轮滚规向前，不会因为某个模型的闭源而停滞。我们特别要感谢 DeepSeek 为开源社区做出的不可磨灭的贡献，它的行动惠及了每一位开发者。无论未来风云如何变幻，持续学习、拥抱变化，才是我们在AI时代立于不败之地的关键。
`+c},{id:8,slug:"claude-opus-4-6-antigravity",title:"Claude Opus 4.6 登陆 Antigravity: 是完整升级还是“残血版”? Pro 用户上手初体验",image:f,date:"2026-04-07",author:"数维探索",views:"1,000",category:"评测",duration:"08:00",excerpt:"备受期待的 Claude Opus 4.6 模型终于在 Google 的 AI IDE 平台 Antigravity 上线! 本视频将为你详细解析更新内容及1M上下文测试。",tags:[{name:"Claude",type:"blue"},{name:"Opus 4.6",type:"blue"},{name:"Antigravity",type:"green"}],collection:"AI百科",relatedIds:[1,9,10],recommendationIds:[1,10,12,14],gallery:[f],markdownContent:`
# Claude Opus 4.6 登陆 Google AI IDE Antigravity: 你需要知道的一切

备受期待的 Claude Opus 4.6 模型终于在 Google 的 AI IDE 平台 Antigravity 上线! 本次更新为用户带来了新的可能性, 但也引发了一些疑问. 本视频将为你详细解析此次更新的重点内容.

## 🚀 上线详情与配额机制
* **分层上线**: 与以往类似, Ultra 套餐用户会比 Pro 套餐用户提前 1-2 天体验到新模型.
* **模型更替**: 目前 Opus 4.5 和 4.6 并存, 但根据产品迭代逻辑, 预计 Opus 4.5 很快会被 4.6 完全替代.
* **配额平移**: 根据初步测试, Opus 4.5 and 4.6 似乎共享配额. 也就是说, 升级到 4.6 后, 你的消息使用限额（Quota）不会改变. 但值得注意的是, Pro 用户的配额本身存在不确定性, 从 40 到 150 不等, 具体原因未知.

## 🤔 核心争议: 是完整的 Opus 4.6 吗?
本次更新最大的争议点在于, Antigravity 上的 Opus 4.6 似乎是一个**“残血版”**.

**关键证据: 200K vs 1M 上下文窗口**
根据社区用户分享的技术测试截图, 我们发现:
* 模型标识为 \`Opus 4.6 thinking\`.
* 尽管模型的理论上下文长度（Context Window）应为 1M tokens, 但实际测试中, 当输入内容超过 200K tokens 时便会达到上限.
* 这意味着, 至少对于 Pro 用户而言, 当前在 Antigravity 上可用的 Opus 4.6 并没有提供其宣传的 1M 超长上下文能力, 而是维持在了 200K 的水平.

## 📢 总结与展望
总而言之, Claude Opus 4.6 在 Antigravity 的上线虽然带来了新的模型选择, 但其核心能力——1M 上下文窗口——似乎尚未对所有用户完全开放. 这可能是平台方出于稳定性或成本考虑的灰度策略.

我们呼吁正在使用 Ultra 套餐并具备技术测试能力的用户, 可以分享你在 1M 上下文方面的测试结果, 帮助社区更全面地了解此次更新的真实情况.
`+c},{id:9,slug:"mapbox-3d-map",title:"Mapbox GL JS 初始化 3D 建筑与地形教程",image:I,date:"2026-04-03",author:"数维探索",views:"1,100",category:"教程",duration:"12:30",excerpt:"学习如何使用 Mapbox GL JS 快速初始化一个包含 3D 建筑挤压（Fill-Extrusion）和数字高程模型（DEM）地形的交互式 3D 地图。",tags:[{name:"Mapbox",type:"blue"},{name:"3D地图",type:"blue"},{name:"WebGIS",type:"green"}],collection:"地图",relatedIds:[10,11,12],recommendationIds:[10,11,12,1],gallery:[I],markdownContent:`
mapbox初始化一个3D地图

效果图：

代码：
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>3D City with Mapbox</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.js"><\/script>
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.css" rel="stylesheet" />
    <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
        .controls { position: absolute; top: 10px; left: 10px; background: white; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
<div id="map"></div>
<div class="controls">
    <button onclick="toggle3DBuildings()">切换3D建筑</button>
    <button onclick="adjustTerrain()">调整地形</button>
</div>

<script>
    mapboxgl.accessToken = '你自己的';
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-122.4194, 37.7749], // 旧金山，多山地形
        zoom: 14,
        pitch: 60,
        bearing: 0
    });

    let buildingsVisible = true;
    let terrainExaggeration = 1.5;

    map.on('load', () => {
        // 添加地形
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        
        // 设置地形
        map.setTerrain({ 
            'source': 'mapbox-dem', 
            'exaggeration': terrainExaggeration
        });

        // 添加3D建筑
        add3DBuildings();
    });

    function add3DBuildings() {
        map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 13,
            'paint': {
                'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'height'],
                    0, 'lightblue',
                    50, 'blue',
                    100, 'darkblue'
                ],
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.8,
                'fill-extrusion-vertical-gradient': true
            }
        });
    }

    function toggle3DBuildings() {
        buildingsVisible = !buildingsVisible;
        const visibility = buildingsVisible ? 'visible' : 'none';
        map.setLayoutProperty('3d-buildings', 'visibility', visibility);
    }

    function adjustTerrain() {
        terrainExaggeration = terrainExaggeration === 1.5 ? 3.0 : 1.5;
        map.setTerrain({ 
            'source': 'mapbox-dem', 
            'exaggeration': terrainExaggeration 
        });
    }
<\/script>
</body>
</html>
\`\`\`
`+c},{id:10,slug:"chrome-cors-plugin",title:"Chrome & Firefox 跨域插件配置教程",image:ct,date:"2026-04-02",author:"数维探索",views:"1,800",category:"教程",duration:"08:15",excerpt:"本地开发遇到 Cross-Origin 跨域问题？通过 Chrome 和 Firefox 插件轻松开启 Access-Control-Allow-Origin，加速前后端调试。",tags:[{name:"Chrome",type:"blue"},{name:"插件",type:"blue"},{name:"跨域",type:"green"}],collection:"数维探索工具箱",relatedIds:[11,12,1],recommendationIds:[11,12,1,2],gallery:[],markdownContent:`
## 1.Chrome跨域插件配置
使用chrome插件“Allow CORS: Access-Control-Allow-origin ”来解决跨域问题。
<img src="/10/1.png" alt="">


点击pin图标，然后插件会显示在地址栏 
<img src="/10/2.png" alt="">


### 1.1启动插件
点击文本和图标都可以

开启完以后图标就变成彩色的了， 关闭插件图标就变灰的了。
<img src="/10/3.png" alt="">



### 1.2设置本地调试跨域


点击Open option page这个页面，这是以下内容
<img src="/10/4.png" alt="">




这样就完成本地跨域了 

## 2 Firefox跨域插件
### 2.1安装插件 CORS Everywhere
CORS Everywhere – Get this Extension for 🦊 Firefox (en-US)



### 2.2启动插件
下载并安装这个插件。
安装完以后地址栏后面有这个图标，点击启动就可以。



## 3 工具下载链接
夸克网盘：
\`\`\`html
https://pan.quark.cn/s/811ec5bc5242?pwd=UJJW 提取码：UJJW
\`\`\`
`+c},{id:11,slug:"chrome-jsonview-install",title:"Chrome 安装 JSONview 插件教程",image:lt,date:"2026-04-02",author:"数维探索",views:"1,500",category:"教程",duration:"05:00",excerpt:"Chrome 安装 JSONview 插件后，可以在浏览器中直接查看格式化后的 JSON 内容，是开发者必备的工具。",tags:[{name:"Chrome",type:"blue"},{name:"插件",type:"blue"},{name:"JSON",type:"green"}],collection:"数维探索工具箱",relatedIds:[10,12,1],recommendationIds:[10,12,1,2],gallery:["/11/1.png","/11/2.png","/11/3.png","/11/4.png"],markdownContent:`
本文介绍如何安装JSONview插件 美化浏览器查看的JSON数据

chrome安装JSONview插件，即可在浏览中查看json文件

由于浏览器查看返回的json字符串比较乱，安装这个插件后看起来很清爽
 ### 1、下载JSONview压缩包

夸克网盘：
\`\`\`html
https://pan.quark.cn/s/51502e7068de?pwd=fDLE
\`\`\`

### 2.解压

### 3.打开chorme浏览器的扩展程序
<img src="/11/1.png" alt="">
或者是在输入框中输入chrome://extensions/



加载已解压的扩展程序-->选择WebContent文件夹

<img src="/11/2.png" alt="">

 ### 效果图：

<img src="/11/3.png" alt="">
`+c},{id:12,slug:"offline-leaflet-map",title:"Leaflet 离线地图下载与加载教程",image:rt,date:"2026-04-02",author:"数维探索",views:"1,200",category:"教程",duration:"10:00",excerpt:"本教程详细介绍了下载离线地图瓦片的两种方式（osm 和 MapTileDownloader），并提供了在 Leaflet 中加载离线地图的代码示例。",tags:[{name:"Leaflet",type:"blue"},{name:"地图",type:"blue"}],collection:"数维探索工具箱",relatedIds:[13,1,2],recommendationIds:[1,2,3,11],gallery:[],markdownContent:`


# 效果图：

<img src='/12/1.png'>

# 一 下载离线地图的二种方式

## 1.osm 的方式下载瓦片

<img src='/12/2.png'>

## 2、下载MapTileDownloader 
 文件格式选为瓦片!
 <img src='/12/3.png'>

# 二 代码（推荐使用osm方式）

>
>  \`\`\`html
>  <html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>offline-leaflet-map-ID15</title><link rel="stylesheet" href="./leaflet/leaflet.css"/><script src="./leaflet/leaflet.js"><\/script><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;}#my-offline-leaflet-map{width:100%;height:100%;}</style></style></head><body><div id="my-offline-leaflet-map"></div><script>
>
> 
> var mymap=L.map('my-offline-leaflet-map',
>
> {minZoom:9,maxZoom:10})
>
> .setView([29.55402225, 106.54383115], 9);
> L.TileLayer.Custom = L.TileLayer.extend({getTileUrl : function(coords){
> url='./newtask/'+coords.z+'/'+coords.x+'/'+coords.y+'.png';
> return url;}
>
> });
> L.tileLayer.Custom = function(){return new L.TileLayer.Custom();}
> L.tileLayer.Custom().addTo(mymap);
>
> 
>
> 
>
> 
>
> 
> <\/script>
> </body>
>
> </html>
>  \`\`\`

# 三 osm和MapTileDownloader 下载方式

 官方tool下载地址：http://www.allmapsoft.com/

夸克网盘：
\`\`\`html
osm下载：https://pan.quark.cn/s/996f10a338d0?pwd=VUXq

MapTileDownloader下载链接：https://pan.quark.cn/s/369d3d7cd970?pwd=bbvL
\`\`\`
`+c},{id:13,slug:"wireshark-windows-xp-guide",title:"Wireshark在Windows XP系统上的安装与使用指南",image:$,date:"2026-04-15",author:"数维探索",views:"1,200",category:"教程",duration:"10:00",excerpt:"Wireshark在Windows XP系统上运行需要特定的旧版本。本教程为你整理了最稳定的版本下载、WinPcap驱动安装及抓包注意事项。",tags:[{name:"Wireshark",type:"blue"},{name:"Windows XP",type:"blue"},{name:"抓包",type:"green"}],collection:"数维探索工具箱",relatedIds:[1,2,4],recommendationIds:[1,2,6,7],gallery:[$],markdownContent:`
# Wireshark在Windows XP系统上的安装与使用指南

## 📌 概述

Wireshark是一款广泛使用的网络协议分析工具，但在Windows XP系统上运行需要特定的旧版本。由于系统内核和驱动架构的限制，现代的Wireshark版本无法在XP上安装或运行。

## 🏆 兼容版本推荐

### 主要推荐版本

| 版本号 | 推荐理由 | 适用场景 | 稳定性评级 |
| ------ |------ |------ |------ |
| **Wireshark 1.10.14** | 最推荐的最终版，功能相对完善，对XP的兼容性最好 | 日常抓包、协议分析 | ⭐⭐⭐⭐⭐ |
| **Wireshark 1.12.13** | 便携版首选，解压即用，适合维护老机器 | 临时调试、免安装使用 | ⭐⭐⭐⭐ |
| **Wireshark 2.0.14** | 理论上的极限版本，但对系统环境要求较高 | 高级用户、特定需求 | ⭐⭐ |


## 📥 安装步骤指南

### 标准安装流程

**准备工作**
    - 确保使用Administrator账户登录
    - 关闭防火墙和杀毒软件（避免安装冲突）

**验证安装**
    - 启动Wireshark
    - 检查接口列表是否显示网卡
    - 尝试进行简单的抓包测试

## 🌐 下载资源
夸克网盘:

\`\`\`html
https://pan.quark.cn/s/03159145f730
\`\`\`

## ⚡ 使用注意事项

### 功能限制

- **HTTPS解密限制**：由于XP时代的加密协议较老，可能只能看到加密的乱码流量
- **现代协议支持**：对TLS 1.2/1.3等现代协议支持有限
- **性能问题**：在较老的XP机器上可能运行较慢

### 安全风险

- **系统风险**：Windows XP已停止支持多年
- **建议环境**：仅在虚拟机或断网隔离环境中运行
- **网络攻击**：直接连接互联网存在安全风险

## 🛠️ 故障排除

### 常见问题及解决

**问题1：无法找到网卡**

- 重启系统后重试
- 确认以管理员身份运行

**问题2：权限错误**

- 确保使用Administrator账户
- 右键以管理员身份运行
- 检查系统权限设置

**问题3：安装失败**

- 关闭所有安全软件
- 确保系统满足最低要求
- 尝试不同的兼容模式

## 📝 总结建议

### 最佳实践

1. **首选方案**：使用Wireshark 1.10.14
2. **安全考虑**：在虚拟机环境中运行，避免直接连接互联网
3. **备份准备**：安装前备份重要数据，防止意外情况

### 适用场景

- 老旧系统维护
- 特定工业控制环境
- 历史系统调试
- 学习和研究用途
`+c},{id:14,slug:"google-antigravity-2026-guide",title:"Google Antigravity：2026 年 AI 编程终极指南",image:P,date:"2026-04-16",author:"数维探索",views:"1,200",category:"教程",duration:"12:00",excerpt:"Google 于 2025 年底发布的 Agent-First IDE，原生支持 Gemini 3 Pro 和 Claude Sonnet 4.5，开启 Vibe Coding 全栈自动化新纪元。",tags:[{name:"Antigravity",type:"blue"},{name:"AI工具",type:"blue"},{name:"开发指南",type:"green"}],collection:"AI百科",relatedIds:[1,2,9,13],recommendationIds:[2,3,9,13],gallery:[P],markdownContent:`
### 🚀 Google Antigravity：2026 年 AI 编程终极指南

**Google Antigravity** 是 Google 于 2025 年底发布的 **Agent-First IDE**（智能体优先集成开发环境）。它不仅仅是一个代码编辑器，更是一个能够自主规划、执行和验证任务的智能开发平台。

#### 🌟 核心亮点

- **智能体驱动**：AI 不再是辅助，而是主导。它能自主操作终端、浏览器和文件系统。
- **多模型支持**：原生支持 **Gemini 3 Pro/Flash** 和 **Claude Sonnet 4.5/Opus**，可根据任务灵活切换。
- **三表面协同**：AI 同时在 **编辑器**、**终端** 和 **浏览器** 中工作，实现全栈自动化。
- **Vibe Coding**：支持从设计稿（如 Google Stitch）直接生成可运行的原生 App 代码。

#### 🛠️ 安装与配置（避坑必看）

**1. 下载与安装**

- **官网**：访问 Google Antigravity 官网下载对应系统（Windows/macOS/Linux）的安装包，但是需要科学上网。

夸克网盘：

\`\`\`html
https://pan.quark.cn/s/57d47f19b40e?pwd=mcx1
\`\`\`

- **迁移配置**：首次启动时，建议选择导入 VS Code 或 Cursor 的配置（主题、快捷键、插件），实现无缝切换。

**2. 网络与账号（关键！）**

**注意**：国内用户直接使用通常会遇到登录问题，请务必检查以下两点：

- **开启 TUN 模式**：必须开启代理软件的 **TUN 模式**（虚拟网卡模式），否则软件无法连接服务器。
- **账号地区**：建议使用地区设置为 **美国** 的 Google 账号，避免提示“不在服务区域”。

#### 💻 核心工作流

Antigravity 的工作流主要分为两种模式，适应不同复杂度的任务：

| 模式 | 适用场景 | 操作建议 |
| ------ |------ |------ |
| **Planning (规划模式)** | 复杂任务、从零开发、重构架构 | AI 会先生成实施计划，经你批准后再执行，确保方向正确。 |
| **Fast (快速模式)** | 简单修改、解释代码、单文件操作 | 即问即答，速度快，适合日常编码辅助。 |

#### 💡 高效实战技巧

**1. 混合模型策略**

- **前端/视觉**：指定使用 **Gemini 3 Pro**。它能自动截图并调整 CSS，实现“所见即所得”。
- **后端/逻辑**：切换为 **Claude Sonnet 4.5**。逻辑推理更强，适合处理复杂算法和 Bug。

**2. 多智能体并行**
在 **Manager（管理中心）** 视图中，你可以同时开启多个智能体：

- **场景**：指派 Agent A 写前端页面，同时指派 Agent B 写数据库接口。
- **管理**：像项目经理一样监控进度，最后在“Inbox”统一审核合并代码。

**3. 配合 Google Stitch 生成 App**
这是 2026 年最火的“Vibe Coding”玩法：

1. 在 **Google Stitch** 用文字生成 UI 设计稿。
2. 导出素材到文件夹。
3. 在 Antigravity 中打开文件夹，输入指令：“基于 design 目录，使用 Flutter 生成完整代码”。
4. AI 会自动解析设计图并写出可运行的原生 App 代码。

#### ⚠️ 注意事项

- **额度限制**：免费版对 Gemini 3 Pro 和 Claude 的调用有每周额度限制，用完需等待刷新或切换模型。
- **保持更新**：作为快速迭代的软件，建议保持最新版本以修复 Bug 并获得新功能。
`+c}].reverse(),dt=["AI百科","2.5G网络","2026","AI","AI IDE","AI Studio","AI工具","AI学习","AI新闻","AI编程","AI趋势","acme.sh","Antigravity","Claude","DeepSeek","Gemini","Mac OS","Python","账号解封","Wireshark","Windows XP","抓包","开发指南"],ut=["AI百科","Docker百科","地图","数维探索工具箱","数维探索 行业研报"],pt=["视频","文章","教程","新闻","评测","展望"];const ht={name:"FilterSection",components:{DropdownFilter:ot},props:{totalResults:{type:Number,default:0}},data(){return{allTags:dt,allCollections:ut,allTypes:pt,filters:{tags:[],collections:[],types:[],keyword:""}}},computed:{hasFilters(){return this.filters.tags.length>0||this.filters.collections.length>0||this.filters.types.length>0||this.filters.keyword!==""}},watch:{filters:{deep:!0,handler(s){this.$emit("filter-change",{...s})}}},methods:{handleSearch(){this.$emit("filter-change",{...this.filters})},clearFilters(){this.filters={tags:[],collections:[],types:[],keyword:""}}}};var mt=function(){var t=this,e=t._self._c;return e("section",{staticClass:"filter-section"},[e("div",{staticClass:"container"},[e("div",{staticClass:"filter-card fade-in"},[e("div",{staticClass:"filter-grid"},[e("div",{staticClass:"filter-item"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("search.tagLabel")))]),e("DropdownFilter",{attrs:{placeholder:t.$t("search.tagPlaceholder"),options:t.allTags,showChips:!0},model:{value:t.filters.tags,callback:function(i){t.$set(t.filters,"tags",i)},expression:"filters.tags"}})],1),e("div",{staticClass:"filter-item"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("search.collectionLabel")))]),e("DropdownFilter",{attrs:{placeholder:t.$t("search.collectionPlaceholder"),options:t.allCollections},model:{value:t.filters.collections,callback:function(i){t.$set(t.filters,"collections",i)},expression:"filters.collections"}})],1),e("div",{staticClass:"filter-item"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("search.typeLabel")))]),e("DropdownFilter",{attrs:{placeholder:t.$t("search.typePlaceholder"),options:t.allTypes},model:{value:t.filters.types,callback:function(i){t.$set(t.filters,"types",i)},expression:"filters.types"}})],1),e("div",{staticClass:"filter-item search-box-wrapper"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("search.keywordLabel")))]),e("div",{staticClass:"search-box"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.filters.keyword,expression:"filters.keyword"}],staticClass:"search-input",attrs:{type:"text",placeholder:t.$t("search.keywordPlaceholder")},domProps:{value:t.filters.keyword},on:{keyup:function(i){return!i.type.indexOf("key")&&t._k(i.keyCode,"enter",13,i.key,"Enter")?null:t.handleSearch.apply(null,arguments)},input:function(i){i.target.composing||t.$set(t.filters,"keyword",i.target.value)}}}),e("button",{staticClass:"search-btn",on:{click:t.handleSearch}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}})])])])])]),e("div",{staticClass:"results-bar"},[e("div",{staticClass:"results-count",domProps:{innerHTML:t._s(t.$t("search.resultsCount",{total:`<span class='highlight'>${t.totalResults}</span>`}))}}),t.hasFilters?e("button",{staticClass:"clear-btn",on:{click:t.clearFilters}},[t._v(t._s(t.$t("search.clear")))]):t._e()])])])])},gt=[],vt=d(ht,mt,gt,!1,null,"3a2c80c9",null,null);const ft=vt.exports;const _t={name:"ContentCard",props:{item:{type:Object,required:!0}}};var yt=function(){var t=this,e=t._self._c;return e("div",{staticClass:"content-card fade-in"},[e("div",{staticClass:"card-image"},[e("img",{attrs:{src:t.item.image,alt:t.item.title}}),e("div",{staticClass:"image-overlay"})]),e("div",{staticClass:"card-body"},[e("h3",{staticClass:"card-title"},[t._v(t._s(t.item.title))]),e("div",{staticClass:"card-meta"},[e("div",{staticClass:"meta-item"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"}})]),e("span",[t._v(t._s(t.item.date))])]),e("div",{staticClass:"meta-item"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}})]),e("span",[t._v(t._s(t.item.author))])])]),e("p",{staticClass:"card-excerpt"},[t._v(t._s(t.item.excerpt))]),e("div",{staticClass:"card-tags"},t._l(t.item.tags,function(i){return e("span",{key:i,staticClass:"tag",class:"tag-"+i.type},[t._v(t._s(i.name))])}),0)])])},Ct=[],bt=d(_t,yt,Ct,!1,null,"3bba609e",null,null);const D=bt.exports;const wt={name:"Pagination",props:{total:{type:Number,required:!0},current:{type:Number,required:!0},totalItems:{type:Number,required:!0}},computed:{displayedPages(){const s=[];for(let t=1;t<=this.total;t++)s.push(t);return s}},methods:{changePage(s){s>=1&&s<=this.total&&this.$emit("change",s)}}};var xt=function(){var t=this,e=t._self._c;return e("div",{staticClass:"pagination-container fade-in"},[e("div",{staticClass:"pagination"},[e("button",{staticClass:"page-btn prev",attrs:{disabled:t.current===1},on:{click:function(i){return t.changePage(t.current-1)}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}})])]),e("div",{staticClass:"page-numbers"},t._l(t.displayedPages,function(i){return e("button",{key:i,staticClass:"page-number",class:{active:i===t.current},on:{click:function(a){return t.changePage(i)}}},[t._v(" "+t._s(i)+" ")])}),0),e("button",{staticClass:"page-btn next",attrs:{disabled:t.current===t.total},on:{click:function(i){return t.changePage(t.current+1)}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}})])])]),e("div",{staticClass:"pagination-info"},[t._v(" "+t._s(t.$t("pagination.info",{total:t.totalItems,current:t.current,pages:t.total}))+" ")])])},kt=[],Tt=d(wt,xt,kt,!1,null,"a694815c",null,null);const It=Tt.exports;const At={name:"SiteFooter",data(){return{showScrollTop:!1}},mounted(){window.addEventListener("scroll",this.handleScroll)},beforeDestroy(){window.removeEventListener("scroll",this.handleScroll)},methods:{handleScroll(){this.showScrollTop=window.pageYOffset>300},scrollToTop(){window.scrollTo({top:0,behavior:"smooth"})}}};var Lt=function(){var t=this,e=t._self._c;return e("footer",{staticClass:"site-footer"},[e("div",{staticClass:"container footer-grid"},[e("div",{staticClass:"footer-col"},[e("h4",{staticClass:"footer-title"},[t._v(t._s(t.$t("footer.navTitle")))]),e("ul",[e("li",[e("a",{attrs:{href:"/"}},[t._v(t._s(t.$t("footer.home")))])]),e("li",[e("a",{attrs:{href:"/"}},[t._v(t._s(t.$t("footer.contentList")))])]),e("li",[e("a",{attrs:{href:"/"}},[t._v(t._s(t.$t("footer.userCenter")))])]),e("li",[e("a",{attrs:{href:"/"}},[t._v(t._s(t.$t("footer.favorites")))])])])]),e("div",{staticClass:"footer-col"},[e("h4",{staticClass:"footer-title"},[t._v(t._s(t.$t("footer.aboutTitle")))]),e("ul",[e("li",[e("a",{attrs:{href:"/"}},[t._v(t._s(t.$t("footer.company")))])]),e("li",[e("a",{attrs:{href:"/"}},[t._v(t._s(t.$t("footer.contact")))])]),e("li",[e("a",{attrs:{href:"/"}},[t._v(t._s(t.$t("footer.join")))])]),e("li",[e("a",{attrs:{href:"/privacy-policy"}},[t._v(t._s(t.$t("footer.privacy")))])])])]),e("div",{staticClass:"footer-col"},[e("h4",{staticClass:"footer-title"},[t._v(t._s(t.$t("footer.ecoTitle")))]),e("ul",[e("li",[e("a",{attrs:{href:"/tools",target:"_blank",rel:"noopener noreferrer"}},[t._v(t._s(t.$t("footer.tools")))])]),e("li",[e("a",{attrs:{href:"/",target:"_blank",rel:"noopener noreferrer"}},[t._v(t._s(t.$t("footer.blog")))])]),e("li",[e("a",{attrs:{href:"/",target:"_blank",rel:"noopener noreferrer"}},[t._v(t._s(t.$t("footer.wiki")))])]),e("li",[e("a",{attrs:{href:"https://blog.csdn.net/qq_37550440?type=blog",target:"_blank",rel:"noopener noreferrer"}},[t._v(t._s(t.$t("footer.tracker")))])])])]),e("div",{staticClass:"footer-col subscribe-col"},[e("h4",{staticClass:"footer-title"},[t._v(t._s(t.$t("footer.subscribe")))]),e("p",[t._v(t._s(t.$t("footer.subscribeDesc")))]),e("div",{staticClass:"subscribe-form"},[e("input",{attrs:{type:"email",placeholder:t.$t("footer.emailPlaceholder")}}),e("button",{staticClass:"btn btn-primary"},[t._v(t._s(t.$t("footer.subscribeBtn")))])]),e("div",{staticClass:"social-links"},[e("h4",{staticClass:"footer-title"},[t._v(t._s(t.$t("footer.socialTitle")))]),t._m(0)])])]),t._m(1),e("div",{staticClass:"floating-actions",class:{show:t.showScrollTop}},[e("button",{staticClass:"float-btn to-top",attrs:{title:"回到顶部"},on:{click:t.scrollToTop}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"24",height:"24"}},[e("path",{attrs:{fill:"currentColor",d:"M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"}})])])])])},St=[function(){var s=this,t=s._self._c;return t("div",{staticClass:"social-icons"},[t("a",{staticClass:"social-icon",attrs:{href:"/"}},[s._v("YT")]),t("a",{staticClass:"social-icon",attrs:{href:"/"}},[s._v("Bili")]),t("a",{staticClass:"social-icon",attrs:{href:"/"}},[s._v("抖音")]),t("a",{staticClass:"social-icon",attrs:{href:"/"}},[s._v("微信")])])},function(){var s=this,t=s._self._c;return t("div",{staticClass:"footer-bottom"},[t("div",{staticClass:"container"},[t("p",[s._v("© 2026 内容创作展示网站 toolset.site 保留所有权利 | 代理条款 | "),t("a",{attrs:{href:"/privacy-policy"}},[s._v("隐私政策")])])])])}],$t=d(At,Lt,St,!1,null,"a674e54c",null,null);const E=$t.exports;const Pt={name:"Home",components:{SiteHeader:G,FilterSection:ft,ContentCard:D,Pagination:It,SiteFooter:E},data(){return{contentItems:v,filters:{tags:[],collections:[],types:[],keyword:""},currentPage:1,pageSize:8}},computed:{filteredItems(){return this.contentItems.filter(s=>{const t=!this.filters.keyword||s.title.toLowerCase().includes(this.filters.keyword.toLowerCase())||s.excerpt.toLowerCase().includes(this.filters.keyword.toLowerCase()),e=this.filters.tags.length===0||s.tags.some(n=>this.filters.tags.includes(n.name)),i=this.filters.collections.length===0||this.filters.collections.includes(s.collection),a=this.filters.types.length===0||this.filters.types.includes(s.category);return t&&e&&i&&a})},totalPages(){return Math.ceil(this.filteredItems.length/this.pageSize)||1},paginatedItems(){const s=(this.currentPage-1)*this.pageSize,t=s+this.pageSize;return this.filteredItems.slice(s,t)}},methods:{handleFilterChange(s){this.filters={...s},this.currentPage=1},handlePageChange(s){this.currentPage=s,window.scrollTo({top:0,behavior:"smooth"})},goToDetail(s){const t=this.contentItems.find(e=>e.id===s);t&&this.$router.push(`/detail/${t.slug}`)}}};var Mt=function(){var t=this,e=t._self._c;return e("div",{staticClass:"home-page"},[e("SiteHeader"),e("main",[e("FilterSection",{attrs:{totalResults:t.filteredItems.length},on:{"filter-change":t.handleFilterChange}}),e("section",{staticClass:"container py-40"},[t.paginatedItems.length>0?e("div",[e("div",{staticClass:"grid fade-in"},t._l(t.paginatedItems,function(i){return e("ContentCard",{key:i.id,attrs:{item:i},nativeOn:{click:function(a){return t.goToDetail(i.id)}}})}),1),e("Pagination",{attrs:{total:t.totalPages,current:t.currentPage,totalItems:t.filteredItems.length},on:{change:t.handlePageChange}})],1):e("div",{staticClass:"no-results fade-in"},[e("div",{staticClass:"no-results-content"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"64",height:"64"}},[e("path",{attrs:{fill:"currentColor",d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}})]),e("p",[t._v(t._s(t.$t("search.noResults")))])])])])],1),e("SiteFooter")],1)},Ft=[],Ot=d(Pt,Mt,Ft,!1,null,"c1f16c41",null,null);const zt=Ot.exports;const Gt={name:"RelatedContent",props:{items:{type:Array,required:!0}},methods:{handleItemClick(s){this.$emit("select",s)}}};var Dt=function(){var t=this,e=t._self._c;return e("aside",{staticClass:"sidebar"},[e("div",{staticClass:"sidebar-header"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"var(--primary-color)",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4h2v4zm0-6h-2V7h2v4z"}})]),e("span",[t._v("关联内容")])]),e("div",{staticClass:"related-list"},t._l(t.items,function(i){return e("div",{key:i.id,staticClass:"related-item",on:{click:function(a){return t.handleItemClick(i.id)}}},[e("div",{staticClass:"related-thumb"},[e("img",{attrs:{src:i.image,alt:"Thumbnail"}})]),e("div",{staticClass:"related-info"},[e("h4",{staticClass:"related-title"},[t._v(t._s(i.title))]),e("div",{staticClass:"related-meta"},[e("span",[t._v("时长: "+t._s(i.duration))]),e("span",{staticClass:"author"},[t._v("| "+t._s(i.author))])]),e("div",{staticClass:"related-tags"},t._l(i.tags.slice(0,2),function(a){return e("span",{key:a.name,staticClass:"mini-tag"},[t._v(t._s(a.name))])}),0)])])}),0)])},Et=[],Vt=d(Gt,Dt,Et,!1,null,"e7c5a0d7",null,null);const Rt=Vt.exports;const V=new U({html:!0,highlight:function(s,t){if(t&&C.getLanguage(t))try{return`<pre class="hljs"><code>${C.highlight(s,{language:t}).value}</code><button class="copy-btn" data-clipboard-text="${encodeURIComponent(s)}">Copy</button></pre>`}catch{}return`<pre class="hljs"><code>${V.utils.escapeHtml(s)}</code><button class="copy-btn" data-clipboard-text="${encodeURIComponent(s)}">Copy</button></pre>`}}),Bt={name:"MarkdownRenderer",props:{content:{type:String,default:""}},computed:{previewHtml(){return V.render(this.content)}},mounted(){this.$el.addEventListener("click",this.handleCopy),this.addLazyLoading()},beforeDestroy(){this.$el.removeEventListener("click",this.handleCopy)},watch:{content(){this.$nextTick(()=>{this.addLazyLoading()})}},methods:{handleCopy(s){if(s.target.classList.contains("copy-btn")){const t=decodeURIComponent(s.target.getAttribute("data-clipboard-text"));navigator.clipboard.writeText(t).then(()=>{const e=s.target.innerText;s.target.innerText="Copied!",setTimeout(()=>{s.target.innerText=e},2e3)})}},addLazyLoading(){this.$el.querySelectorAll("img").forEach(t=>{t.setAttribute("loading","lazy")})}}};var Nt=function(){var t=this,e=t._self._c;return e("div",{staticClass:"markdown-body",domProps:{innerHTML:t._s(t.previewHtml)}})},Ut=[],Ht=d(Bt,Nt,Ut,!1,null,null,null,null);const Wt=Ht.exports;const Zt={name:"ContentDetail",components:{SiteHeader:G,SiteFooter:E,ContentCard:D,RelatedContent:Rt,MarkdownRenderer:Wt},props:{slug:{type:String,required:!0}},data(){return{item:null,relatedItems:[],recommendationItems:[]}},watch:{slug:{handler:"loadItem",immediate:!0}},methods:{loadItem(){if(this.item=v.find(s=>s.slug===this.slug),this.item){this.relatedItems=v.filter(t=>this.item.relatedIds.includes(t.id));const s=this.item.recommendationIds;this.recommendationItems=v.filter(t=>s.includes(t.id)).slice(0,4)}},goToDetail(s){const t=v.find(e=>e.id===s);t&&t.slug!==this.slug&&this.$router.push(`/detail/${t.slug}`)}}};var jt=function(){var t=this,e=t._self._c;return e("div",{staticClass:"content-detail-page"},[e("SiteHeader"),e("main",{staticClass:"container detail-container fade-in"},[t.item?e("div",{staticClass:"detail-layout"},[e("div",{staticClass:"main-content"},[e("div",{staticClass:"video-player"},[e("img",{attrs:{src:t.item.image,alt:"Thumbnail"}}),e("div",{staticClass:"player-overlay"},[e("div",{staticClass:"play-btn-large"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"48",height:"48"}},[e("path",{attrs:{fill:"white",d:"M8 5v14l11-7z"}})])])])]),e("div",{staticClass:"content-info"},[e("h1",{staticClass:"detail-title"},[t._v(t._s(t.item.title))]),t._m(0),e("div",{staticClass:"meta-data-section"},[e("div",{staticClass:"full-meta"},[e("div",{staticClass:"meta-row"},[e("span",{staticClass:"meta-label"},[t._v("发布时间:")]),e("span",{staticClass:"meta-value"},[t._v(t._s(t.item.date))]),e("span",{staticClass:"meta-label ml-20"},[t._v("作者:")]),e("span",{staticClass:"meta-value"},[t._v(t._s(t.item.author))])]),e("div",{staticClass:"meta-row"},[e("span",{staticClass:"meta-label"},[t._v("浏览数:")]),e("span",{staticClass:"meta-value"},[t._v(t._s(t.item.views)+" 次")]),e("span",{staticClass:"meta-label ml-20"},[t._v("分类:")]),e("span",{staticClass:"meta-value"},[t._v(t._s(t.item.category))])])]),e("div",{staticClass:"interaction-bar"},[e("div",{staticClass:"stats-group"},[e("button",{staticClass:"stat-btn"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"}})]),e("span",[t._v("0")])]),e("button",{staticClass:"stat-btn"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"}})]),e("span",[t._v("0")])]),e("button",{staticClass:"stat-btn"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"}})]),e("span",[t._v("0")])])])])]),e("div",{staticClass:"detail-tags"},t._l(t.item.tags,function(i){return e("span",{key:i.name,staticClass:"tag",class:"tag-"+i.type},[t._v(t._s(i.name))])}),0),e("section",{staticClass:"markdown-section"},[e("div",{staticClass:"section-header"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}})]),e("span",[t._v("支持内容")])]),e("div",{staticClass:"markdown-content-card"},[e("MarkdownRenderer",{attrs:{content:t.item.markdownContent}})],1)])])]),e("RelatedContent",{attrs:{items:t.relatedItems},on:{select:t.goToDetail}})],1):e("div",{staticClass:"not-found"},[t._v(" Loading... ")]),e("section",{staticClass:"recommendations"},[e("div",{staticClass:"section-header"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.13-14.71a.5.5 0 0 0-.58.12l-3 4a.5.5 0 0 0 .4.8h1.55l-2.07 4.14a.5.5 0 0 0 .45.72h2l-2.22 4.44a.5.5 0 0 0 .89.44l7-14a.5.5 0 0 0-.42-.66z"}})]),e("span",[t._v("相关推荐")])]),e("div",{staticClass:"grid"},t._l(t.recommendationItems,function(i){return e("ContentCard",{key:i.id,attrs:{item:i},nativeOn:{click:function(a){return t.goToDetail(i.id)}}})}),1)])]),e("SiteFooter")],1)},qt=[function(){var s=this,t=s._self._c;return t("div",{staticClass:"social-links-bar"},[t("button",{staticClass:"social-btn douyin"},[t("span",[s._v("DouYin")])]),t("button",{staticClass:"social-btn bilibili"},[t("span",[s._v("BiliBili")])]),t("button",{staticClass:"social-btn youtube"},[t("span",[s._v("Youtube")])])])}],Jt=d(Zt,jt,qt,!1,null,"5ad60e31",null,null);const Qt=Jt.exports,M=[{category:"AI 热门应用",icon:"🔥",tools:[{name:"股票趋势分析",desc:"基于历史数据和AI算法分析股票价格走势",url:"https://www.tradingview.com",icon:"https://api.iowen.cn/favicon/tradingview.com.png"},{name:"市场情绪分析",desc:"分析新闻、社交媒体等数据，评估市场情绪",url:"https://www.sentimentinvestor.com",icon:"https://api.iowen.cn/favicon/sentimentinvestor.com.png"},{name:"投资组合优化",desc:"根据风险偏好和目标收益优化投资组合",url:"https://www.portfoliooptimizer.io",icon:"https://api.iowen.cn/favicon/portfoliooptimizer.io.png"},{name:"股票预测模型",desc:"使用机器学习算法预测股票未来价格",url:"https://www.stockprediction.ai",icon:"https://api.iowen.cn/favicon/stockprediction.ai.png"}]},{category:"AI 对话",icon:"💬",tools:[{name:"Jasper Chat",desc:"Jasper针对内容创作者出品的AI聊天工具",url:"https://www.jasper.ai",icon:"https://api.iowen.cn/favicon/jasper.ai.png"},{name:"IngestAI",desc:"一种帮助人们将他们的知识库转化为聊天机器人的工具",url:"https://ingestai.io",icon:"https://api.iowen.cn/favicon/ingestai.io.png"},{name:"Andi",desc:"人工智能搜索——Andi机器人",url:"https://andi.com",icon:"https://api.iowen.cn/favicon/andi.com.png"},{name:"AI对话【问答宝】",desc:"【问答宝】ChatGPT，目前这个工具很受欢迎",url:"https://www.askbob.ai",icon:"https://api.iowen.cn/favicon/askbob.ai.png"},{name:"ChatGPT",desc:"open AI",url:"https://chat.openai.com",icon:"https://api.iowen.cn/favicon/openai.com.png"},{name:"文心一言",desc:"文心一言",url:"https://yiyan.baidu.com",icon:"https://api.iowen.cn/favicon/baidu.com.png"},{name:"CatGPT",desc:"完全免费",url:"https://catgpt.app",icon:"https://api.iowen.cn/favicon/catgpt.app.png"},{name:"趣学ChatGPT",desc:"免费链，国内可用",url:"https://chatgpt.kuxueai.com",icon:"https://api.iowen.cn/favicon/kuxueai.com.png"},{name:"ChatGPT3.5",desc:"chat3.5，免费链，国内可用",url:"https://chatgpt35.com",icon:"https://api.iowen.cn/favicon/chatgpt35.com.png"}]},{category:"AI 写作",icon:"✍️",tools:[{name:"AI帮个忙",desc:"多功能AI小帮手",url:"https://aibang.ai",icon:"https://api.iowen.cn/favicon/aibang.ai.png"},{name:"Glasp",desc:"高亮网页，全文摘要，内容概要",url:"https://glasp.co",icon:"https://api.iowen.cn/favicon/glasp.co.png"},{name:"Fireflies",desc:"为会议生成成绩单和智能摘要",url:"https://fireflies.ai",icon:"https://api.iowen.cn/favicon/fireflies.ai.png"},{name:"Yaara",desc:"几分钟内创建高质量、引人入胜的内容",url:"https://yaara.ai",icon:"https://api.iowen.cn/favicon/yaara.ai.png"},{name:"Hoppy Copy",desc:"编写长篇内容，将混乱的笔记转换成清晰的文章",url:"https://hoppycopy.co",icon:"https://api.iowen.cn/favicon/hoppycopy.co.png"}]},{category:"AI 编程",icon:"💻",tools:[{name:"GitHub Copilot",desc:"AI 编程助手",url:"https://github.com/features/copilot",icon:"https://api.iowen.cn/favicon/github.com.png"},{name:"Cursor",desc:"基于 AI 的代码编辑器",url:"https://cursor.sh",icon:"https://api.iowen.cn/favicon/cursor.sh.png"}]},{category:"影音编辑",icon:"🎬",tools:[{name:"Easy-Peasy",desc:"包含AI生成文案、图片、智能对话等多种功能",url:"https://easy-peasy.ai",icon:"https://api.iowen.cn/favicon/easy-peasy.ai.png"},{name:"Papercup",desc:"下一代人工智能配音服务，使视频内容更具吸引力",url:"https://papercup.com",icon:"https://api.iowen.cn/favicon/papercup.com.png"},{name:"Mubert",desc:"面向内容创作者、品牌和开发者的AI音乐生成平台",url:"https://mubert.com",icon:"https://api.iowen.cn/favicon/mubert.com.png"},{name:"Murf",desc:"20种语言的AI语音生成器，120多个语音选项",url:"https://murf.ai",icon:"https://api.iowen.cn/favicon/murf.ai.png"}]}];let h=null;const Xt={name:"VideoCutter",data(){return{videoSrc:"",videoFile:null,fileName:"video.mp4",startTime:0,endTime:0,duration:0,currentTime:0,isProcessing:!1,progress:0,loadingStatus:"idle"}},computed:{loadingStatusText(){return{"loading-engine":this.isZh?"正在加载引擎...":"Loading Engine...",uploading:this.isZh?"正在读取文件...":"Reading File...",processing:this.isZh?"正在处理...":"Processing...",saving:this.isZh?"正在保存...":"Saving..."}[this.loadingStatus]||""},isZh(){return this.$i18n.locale==="zh"},cutDuration(){return Math.max(0,this.endTime-this.startTime)},supportsWasm(){return typeof WebAssembly<"u"},ffmpegCommand(){const s=`cut_${this.fileName}`;return`ffmpeg -i "${this.fileName}" -ss ${this.startTime.toFixed(2)} -t ${this.cutDuration.toFixed(2)} -c copy "${s}"`}},methods:{handleFileChange(s){const t=s.target.files[0];t&&(this.videoFile=t,this.fileName=t.name,this.videoSrc=URL.createObjectURL(t))},onVideoLoaded(){const s=this.$refs.videoPlayer;this.duration=s.duration,this.endTime=s.duration},onTimeUpdate(){this.currentTime=this.$refs.videoPlayer.currentTime},updatePreview(s){const t=this.$refs.videoPlayer;s==="start"?t.currentTime=this.startTime:t.currentTime=this.endTime},setCurrentTime(s){s==="start"?this.startTime=Number(this.currentTime.toFixed(2)):this.endTime=Number(this.currentTime.toFixed(2))},async loadFFmpeg(){if(!(h&&h.isLoaded())){console.log("[FFmpeg v0.11] Initializing single-threaded engine..."),this.loadingStatus="loading-engine",h=b.createFFmpeg({corePath:"/ffmpeg-core-st.js",log:!0,progress:({ratio:s})=>{this.progress=Math.round(s*100)}});try{console.log("[FFmpeg v0.11] Calling ffmpeg.load()..."),await h.load(),console.log("[FFmpeg v0.11] Engine loaded successfully!")}catch(s){console.error("[FFmpeg v0.11] Load failed:",s);const t=(this.isZh?"加载 FFmpeg 引擎失败：":"Failed to load FFmpeg: ")+s.message;throw new Error(t)}}},async cutAndDownload(){if(this.videoFile)try{this.isProcessing=!0,this.progress=0,await this.loadFFmpeg(),console.log("Starting cut process..."),this.loadingStatus="uploading";const s="input_"+this.fileName.replace(/[^a-zA-Z0-9.]/g,"_"),t=`output_${Date.now()}.mp4`;console.log(`Writing ${this.fileName} to virtual FS...`),h.FS("writeFile",s,await b.fetchFile(this.videoFile)),console.log("File written"),this.loadingStatus="processing";const e=["-ss",this.startTime.toFixed(2),"-i",s,"-t",this.cutDuration.toFixed(2),"-c","copy",t];console.log(`Executing: ffmpeg ${e.join(" ")}`);try{await h.run(...e),console.log("FFmpeg run completed")}catch(u){throw console.error("FFmpeg run error:",u),new Error(this.isZh?"FFmpeg 执行失败，请检查视频格式。":"FFmpeg execution failed. Check video format.")}this.loadingStatus="saving",console.log(`Reading output: ${t}`);let i;try{i=h.FS("readFile",t)}catch(u){throw console.error("Read error:",u),new Error(this.isZh?"读取输出文件失败。":"Failed to read output file.")}const a=new Blob([i.buffer],{type:"video/mp4"}),n=URL.createObjectURL(a),o=document.createElement("a");o.href=n,o.download=`cut_${this.fileName}`,o.click(),URL.revokeObjectURL(n);try{h.FS("unlink",s),h.FS("unlink",t)}catch(u){console.warn("Cleanup error:",u)}this.isProcessing=!1,this.loadingStatus="idle",alert(this.isZh?"剪切成功！":"Video cut successfully!")}catch(s){console.error("Processing error:",s),alert((this.isZh?"处理出错：":"Error: ")+s.message),this.isProcessing=!1,this.loadingStatus="idle"}},reset(){this.videoSrc="",this.videoFile=null,this.startTime=0,this.endTime=0,this.duration=0},copyCommand(){navigator.clipboard.writeText(this.ffmpegCommand).then(()=>{alert(this.isZh?"命令已复制":"Command copied")})}}};var Kt=function(){var t=this,e=t._self._c;return e("div",{staticClass:"video-cutter-tool"},[e("div",{staticClass:"tool-header"},[e("h3",[t._v(t._s(t.isZh?"视频剪切工具":"Video Cutter"))]),e("p",[t._v(t._s(t.isZh?"通过可视化界面轻松剪切视频并生成 FFmpeg 命令。":"Easily cut videos and generate FFmpeg commands with a visual interface."))])]),t.supportsWasm?t._e():e("div",{staticClass:"warning-banner"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"}})]),e("span",[t._v(t._s(t.isZh?"您的浏览器尚未启用共享内存支持。请确保已重启开发服务器（npm run dev），并使用最新版 Chrome/Edge 访问。":"SharedArrayBuffer is not enabled. Please restart dev server (npm run dev) and use latest Chrome/Edge."))])]),e("div",{staticClass:"tool-container"},[t.videoSrc?e("div",{staticClass:"editor-layout"},[e("div",{staticClass:"preview-section"},[e("video",{ref:"videoPlayer",attrs:{src:t.videoSrc,controls:""},on:{loadedmetadata:t.onVideoLoaded,timeupdate:t.onTimeUpdate}}),e("div",{staticClass:"range-controls"},[e("div",{staticClass:"range-inputs"},[e("div",{staticClass:"input-group"},[e("label",[t._v(t._s(t.isZh?"开始时间 (秒)":"Start Time (s)"))]),e("input",{directives:[{name:"model",rawName:"v-model.number",value:t.startTime,expression:"startTime",modifiers:{number:!0}}],attrs:{type:"number",min:"0",max:t.endTime,step:"0.1"},domProps:{value:t.startTime},on:{input:[function(i){i.target.composing||(t.startTime=t._n(i.target.value))},function(i){return t.updatePreview("start")}],blur:function(i){return t.$forceUpdate()}}})]),e("div",{staticClass:"input-group"},[e("label",[t._v(t._s(t.isZh?"结束时间 (秒)":"End Time (s)"))]),e("input",{directives:[{name:"model",rawName:"v-model.number",value:t.endTime,expression:"endTime",modifiers:{number:!0}}],attrs:{type:"number",min:t.startTime,max:t.duration,step:"0.1"},domProps:{value:t.endTime},on:{input:[function(i){i.target.composing||(t.endTime=t._n(i.target.value))},function(i){return t.updatePreview("end")}],blur:function(i){return t.$forceUpdate()}}})]),e("div",{staticClass:"input-group duration-info"},[e("label",[t._v(t._s(t.isZh?"持续时间":"Duration"))]),e("div",{staticClass:"value"},[t._v(t._s(t.cutDuration.toFixed(2))+"s")])])]),e("div",{staticClass:"quick-actions"},[e("button",{staticClass:"btn-outline",on:{click:function(i){return t.setCurrentTime("start")}}},[t._v(t._s(t.isZh?"设为开始点":"Set as Start"))]),e("button",{staticClass:"btn-outline",on:{click:function(i){return t.setCurrentTime("end")}}},[t._v(t._s(t.isZh?"设为结束点":"Set as End"))]),e("button",{staticClass:"btn-primary",attrs:{disabled:t.isProcessing||!t.supportsWasm||!t.videoFile},on:{click:t.cutAndDownload}},[t.isProcessing?e("span",[t.loadingStatus==="processing"?[t._v(t._s(t.isZh?"处理中 "+t.progress+"%":"Processing "+t.progress+"%"))]:[t._v(t._s(t.loadingStatusText))]],2):e("span",[t._v(t._s(t.isZh?"开始剪切并下载":"Start Cut & Download"))])]),e("button",{staticClass:"btn-danger",attrs:{disabled:t.isProcessing},on:{click:t.reset}},[t._v(t._s(t.isZh?"清除视频":"Clear Video"))])])])]),e("div",{staticClass:"command-section"},[e("h4",[t._v(t._s(t.isZh?"生成的 FFmpeg 命令":"Generated FFmpeg Command"))]),e("div",{staticClass:"command-box"},[e("code",[t._v(t._s(t.ffmpegCommand))]),e("button",{staticClass:"btn-copy",on:{click:t.copyCommand}},[t._v(" "+t._s(t.isZh?"复制命令":"Copy Command")+" ")])]),e("div",{staticClass:"tips"},[e("p",[e("strong",[t._v(t._s(t.isZh?"提示：":"Tip:"))])]),e("ul",[e("li",[t._v(t._s(t.isZh?"点击“开始剪切并下载”将直接在浏览器中处理，无需上传服务器。":'Clicking "Start Cut & Download" will process directly in your browser.'))]),e("li",[t._v(t._s(t.isZh?"首次使用会加载约 30MB 的处理引擎，请耐心等待。":"The processing engine (~30MB) will be loaded on first use."))]),e("li",[t._v(t._s(t.isZh?"处理大视频可能需要较多内存和 CPU。":"Processing large videos may require significant memory and CPU."))])])])])]):e("div",{staticClass:"upload-zone",on:{click:function(i){return t.$refs.fileInput.click()}}},[e("div",{staticClass:"upload-icon"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"48",height:"48"}},[e("path",{attrs:{fill:"currentColor",d:"M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"}})])]),e("p",[t._v(t._s(t.isZh?"点击或拖拽视频文件到此处进行预览":"Click or drag video file here to preview"))]),e("input",{ref:"fileInput",attrs:{type:"file",accept:"video/*",hidden:""},on:{change:t.handleFileChange}})])])])},Yt=[],te=d(Xt,Kt,Yt,!1,null,"2e00e448",null,null);const ee=te.exports;const se={name:"ToolStation",components:{VideoCutter:ee},data(){return{currentTs:Math.floor(Date.now()/1e3),timer:null,inputTs:"",inputDate:"",convertResult:"",aiToolsGroups:M,activeCategory:M[0].category}},computed:{isZh(){return this.$i18n.locale==="zh"},currentGroup(){return this.aiToolsGroups.find(s=>s.category===this.activeCategory)},description(){return this.isZh?"快速在 Unix 时间戳和人类可读时间之间进行准确转换。":"Quickly convert between Unix timestamps and human-readable time."}},mounted(){this.startTimer()},beforeDestroy(){this.stopTimer()},methods:{startTimer(){this.timer=setInterval(()=>{this.currentTs=Math.floor(Date.now()/1e3)},1e3)},stopTimer(){this.timer&&(clearInterval(this.timer),this.timer=null)},toggleTimer(){this.timer?this.stopTimer():this.startTimer()},copy(s){navigator.clipboard.writeText(s).then(()=>{alert(this.isZh?"已复制到剪贴板":"Copied to clipboard")})},toTime(){if(!this.inputTs)return;let s=parseInt(this.inputTs);this.inputTs.length===10&&(s*=1e3);const t=new Date(s);this.convertResult=t.toLocaleString()},toTs(){if(!this.inputDate)return;const s=new Date(this.inputDate);if(isNaN(s.getTime())){this.convertResult=this.isZh?"无效的日期格式":"Invalid date format";return}this.convertResult=Math.floor(s.getTime()/1e3).toString()},handleImgError(s){s.target.src="/favicon-default.png"}}};var ie=function(){var t=this,e=t._self._c;return e("div",{staticClass:"tool-station-page"},[e("div",{staticClass:"container"},[e("section",{staticClass:"tool-section timestamp-converter"},[e("div",{staticClass:"section-header"},[e("h2",[t._v(t._s(t.isZh?"时间戳转换工具":"Timestamp Converter"))]),e("p",{staticClass:"section-desc"},[t._v(t._s(t.description))])]),e("div",{staticClass:"converter-card"},[e("div",{staticClass:"current-box"},[e("div",{staticClass:"input-field"},[e("label",[t._v(t._s(t.isZh?"当前时间戳 (秒)":"Current Timestamp (s)"))]),e("div",{staticClass:"input-with-action"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.currentTs,expression:"currentTs"}],attrs:{type:"text",readonly:""},domProps:{value:t.currentTs},on:{input:function(i){i.target.composing||(t.currentTs=i.target.value)}}}),e("button",{staticClass:"btn-icon",on:{click:t.toggleTimer}},[t.timer?e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M6 19h4V5H6v14zm8-14v14h4V5h-4z"}})]):e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M8 5v14l11-7z"}})])]),e("button",{staticClass:"btn-text",on:{click:function(i){return t.copy(t.currentTs)}}},[t._v(t._s(t.isZh?"复制":"Copy"))])])])]),e("div",{staticClass:"converter-grid"},[e("div",{staticClass:"input-field"},[e("label",[t._v("Unix 时间戳 (s/ms)")]),e("div",{staticClass:"input-with-action"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.inputTs,expression:"inputTs"}],attrs:{type:"text",placeholder:"1712110000"},domProps:{value:t.inputTs},on:{input:function(i){i.target.composing||(t.inputTs=i.target.value)}}}),e("button",{staticClass:"btn-primary",on:{click:t.toTime}},[t._v(t._s(t.isZh?"转换为日期":"To Date"))])])]),e("div",{staticClass:"input-field"},[e("label",[t._v(t._s(t.isZh?"日期时间":"Datetime"))]),e("div",{staticClass:"input-with-action"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.inputDate,expression:"inputDate"}],attrs:{type:"text",placeholder:"2024-04-03 10:00:00"},domProps:{value:t.inputDate},on:{input:function(i){i.target.composing||(t.inputDate=i.target.value)}}}),e("button",{staticClass:"btn-primary",on:{click:t.toTs}},[t._v(t._s(t.isZh?"转换为时间戳":"To Timestamp"))])])])]),t.convertResult?e("div",{staticClass:"result-box"},[e("span",{staticClass:"label"},[t._v(t._s(t.isZh?"转换结果：":"Result:"))]),e("span",{staticClass:"value"},[t._v(t._s(t.convertResult))])]):t._e()])]),e("section",{staticClass:"tool-section video-cutter-section"},[e("VideoCutter")],1)])])},ae=[],ne=d(se,ie,ae,!1,null,"f3fa7e30",null,null);const oe=ne.exports;_.use(O);const re=[{path:"/",name:"Home",component:zt},{path:"/tools",name:"ToolStation",component:oe},{path:"/detail/:slug",name:"ContentDetail",component:Qt,props:!0},{path:"/privacy-policy",name:"PrivacyPolicy",component:()=>X(()=>import("./PrivacyPolicy-32cbf486.js"),["assets/PrivacyPolicy-32cbf486.js","assets/vue-vendor-b0d8f4d9.js","assets/markdown-98eb5fe8.js","assets/highlight-2a9f9d24.js","assets/ffmpeg-3bd2b020.js","assets/highlight-a597b77c.css","assets/PrivacyPolicy-e33969c0.css"])}],le=new O({mode:"hash",base:"/",routes:re,scrollBehavior(){return{x:0,y:0}}}),ce={nav:{home:"首页",content:"内容",about:"关于",tools:"在线工具站"},header:{login:"登录",register:"注册"},search:{tagLabel:"标签搜索",tagPlaceholder:"请选择标签",collectionLabel:"合集筛选",collectionPlaceholder:"请选择合集",typeLabel:"内容类型",typePlaceholder:"请选择内容类型",keywordLabel:"关键词搜索",keywordPlaceholder:"输入关键词搜索...",resultsCount:"搜索结果：共找到 {total} 个",clear:"清空重置",noResults:"未找到匹配的内容，请尝试更换关键词或清除筛选条件"},pagination:{info:"共 {total} 个，当前第 {current} 页，共 {pages} 页",prev:"上一页",next:"下一页"},footer:{subscribe:"邮件订阅",subscribeDesc:"加入邮件列表，获取最新内容更新和资讯",emailPlaceholder:"请输入您的邮箱地址...",subscribeBtn:"订阅",navTitle:"网站导航",aboutTitle:"关于我们",ecoTitle:"lib00 生态",socialTitle:"社交媒体",home:"首页",contentList:"内容列表",userCenter:"用户中心",favorites:"收藏夹",company:"公司介绍",contact:"联系我们",join:"加入我们",privacy:"隐私政策",tools:"在线工具站",blog:"数维探索IT 博客",wiki:"Wiki",tracker:"CSDN 博客"}},de={nav:{home:"Home",content:"Content",about:"About",tools:"Online Tools"},header:{login:"Log In",register:"Sign Up"},search:{tagLabel:"Tags",tagPlaceholder:"Select Tags",collectionLabel:"Collections",collectionPlaceholder:"Select Collection",typeLabel:"Content Type",typePlaceholder:"Select Type",keywordLabel:"Keywords",keywordPlaceholder:"Search keywords...",resultsCount:"Results: {total} found",clear:"Clear All",noResults:"No content matched your filters. Please try changing keywords or clearing filters."},pagination:{info:"Total {total}, Page {current} of {pages}",prev:"Previous",next:"Next"},footer:{subscribe:"Subscribe",subscribeDesc:"Join our mailing list for the latest updates",emailPlaceholder:"Enter your email address...",subscribeBtn:"Subscribe",navTitle:"Navigation",aboutTitle:"About Us",ecoTitle:"Ecosystem",socialTitle:"Social Media",home:"Home",contentList:"Content List",userCenter:"User Center",favorites:"Favorites",company:"Company Profile",contact:"Contact Us",join:"Join Us",privacy:"Privacy Policy",tools:"Online Tools",blog:"数维探索IT Blog",wiki:"Wiki",tracker:"CSDN Blog"}};_.use(z);const R={zh:ce,en:de},F=localStorage.getItem("language")||"zh",B=Object.keys(R).includes(F)?F:"zh";document.documentElement.lang=B==="zh"?"zh-CN":"en-US";const ue=new z({locale:B,fallbackLocale:"zh",messages:R});new _({router:le,i18n:ue,render:s=>s(q)}).$mount("#app");export{d as n};
