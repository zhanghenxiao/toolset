import{V as y,a as F,b as E}from"./vue-vendor-b0d8f4d9.js";import{M as B}from"./markdown-98eb5fe8.js";import{H as w}from"./highlight-2a9f9d24.js";import{s as C}from"./ffmpeg-3bd2b020.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();function d(i,e,t,s,a,n,o,u){var c=typeof i=="function"?i.options:i;e&&(c.render=e,c.staticRenderFns=t,c._compiled=!0),s&&(c.functional=!0),n&&(c._scopeId="data-v-"+n);var r;if(o?(r=function(p){p=p||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!p&&typeof __VUE_SSR_CONTEXT__<"u"&&(p=__VUE_SSR_CONTEXT__),a&&a.call(this,p),p&&p._registeredComponents&&p._registeredComponents.add(o)},c._ssrRegister=r):a&&(r=u?function(){a.call(this,(c.functional?this.parent:this).$root.$options.shadowRoot)}:a),r)if(c.functional){c._injectStyles=r;var h=c.render;c.render=function(R,_){return r.call(_),h(R,_)}}else{var g=c.beforeCreate;c.beforeCreate=g?[].concat(g,r):[r]}return{exports:i,options:c}}const N={name:"App"};var H=function(){var e=this,t=e._self._c;return t("div",{attrs:{id:"app"}},[t("transition",{attrs:{name:"page",mode:"out-in"}},[t("router-view")],1)],1)},j=[],Z=d(N,H,j,!1,null,null,null,null);const q=Z.exports,J="modulepreload",K=function(i){return"/"+i},b={},X=function(e,t,s){if(!t||t.length===0)return e();const a=document.getElementsByTagName("link");return Promise.all(t.map(n=>{if(n=K(n),n in b)return;b[n]=!0;const o=n.endsWith(".css"),u=o?'[rel="stylesheet"]':"";if(!!s)for(let h=a.length-1;h>=0;h--){const g=a[h];if(g.href===n&&(!o||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${n}"]${u}`))return;const r=document.createElement("link");if(r.rel=o?"stylesheet":J,o||(r.as="script",r.crossOrigin=""),r.href=n,document.head.appendChild(r),o)return new Promise((h,g)=>{r.addEventListener("load",h),r.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${n}`)))})})).then(()=>e()).catch(n=>{const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=n,window.dispatchEvent(o),!o.defaultPrevented)throw n})};const Q={name:"SiteHeader",directives:{"click-outside":{bind(i,e,t){i.clickOutsideEvent=function(s){i===s.target||i.contains(s.target)||t.context[e.expression](s)},document.body.addEventListener("click",i.clickOutsideEvent)},unbind(i){document.body.removeEventListener("click",i.clickOutsideEvent)}}},data(){return{langOpen:!1,themeOpen:!1,menuOpen:!1,currentTheme:"light"}},computed:{currentLangLabel(){return this.$i18n.locale==="en"?"EN":"CN"},currentLang(){return this.$i18n.locale}},created(){const i=localStorage.getItem("theme")||"light";this.setTheme(i)},methods:{toggleLang(){this.langOpen=!this.langOpen,this.themeOpen=!1},toggleTheme(){this.themeOpen=!this.themeOpen,this.langOpen=!1},toggleMenu(){this.menuOpen=!this.menuOpen,this.menuOpen&&(this.langOpen=!1,this.themeOpen=!1)},closeLang(){this.langOpen=!1},closeTheme(){this.themeOpen=!1},closeMenu(){this.menuOpen=!1},setLang(i){this.$i18n.locale=i,localStorage.setItem("language",i),document.documentElement.lang=i==="zh"?"zh-CN":"en-US",this.langOpen=!1},setTheme(i){this.currentTheme=i,this.themeOpen=!1,localStorage.setItem("theme",i);let e=i;i==="auto"&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),document.documentElement.setAttribute("data-theme",e)}}};var Y=function(){var e=this,t=e._self._c;return t("header",{staticClass:"site-header"},[t("div",{staticClass:"container header-content"},[t("div",{staticClass:"logo-section"},[t("div",{staticClass:"logo-icon"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"24",height:"24"}},[t("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"}})])]),t("span",{staticClass:"logo-text"},[e._v("数维探索_IT")])]),t("button",{staticClass:"mobile-menu-btn",class:{active:e.menuOpen},on:{click:e.toggleMenu}},[t("span"),t("span"),t("span")]),t("nav",{staticClass:"main-nav",class:{"mobile-open":e.menuOpen}},[t("ul",[t("li",{on:{click:e.closeMenu}},[t("router-link",{attrs:{to:"/","exact-active-class":"active"}},[e._v(e._s(e.$t("nav.home")))])],1),t("li",{on:{click:e.closeMenu}},[t("router-link",{attrs:{to:"/tools","active-class":"active"}},[e._v(e._s(e.$t("nav.tools")))])],1)])]),t("div",{staticClass:"header-actions"},[t("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:e.closeLang,expression:"closeLang"}],staticClass:"dropdown-wrapper"},[t("div",{staticClass:"action-item lang-selector",on:{click:e.toggleLang}},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[t("path",{attrs:{fill:"currentColor",d:"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08-2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.28 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"}})]),t("span",{staticClass:"action-label"},[e._v(e._s(e.currentLangLabel))]),t("svg",{class:{rotate:e.langOpen},attrs:{viewBox:"0 0 24 24",width:"12",height:"12"}},[t("path",{attrs:{fill:"currentColor",d:"M7 10l5 5 5-5z"}})])]),e.langOpen?t("div",{staticClass:"dropdown-menu"},[t("div",{staticClass:"dropdown-item",class:{active:e.currentLang==="zh"},on:{click:function(s){return e.setLang("zh")}}},[e._v("简体中文")]),t("div",{staticClass:"dropdown-item",class:{active:e.currentLang==="en"},on:{click:function(s){return e.setLang("en")}}},[e._v("English")])]):e._e()]),t("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:e.closeTheme,expression:"closeTheme"}],staticClass:"dropdown-wrapper"},[t("div",{staticClass:"action-item theme-toggle",on:{click:e.toggleTheme}},[e.currentTheme==="light"?t("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[t("path",{attrs:{fill:"currentColor",d:"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"}})]):e.currentTheme==="dark"?t("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[t("path",{attrs:{fill:"currentColor",d:"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"}})]):t("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[t("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.13-14.71a.5.5 0 0 0-.58.12l-3 4a.5.5 0 0 0 .4.8h1.55l-2.07 4.14a.5.5 0 0 0 .45.72h2l-2.22 4.44a.5.5 0 0 0 .89.44l7-14a.5.5 0 0 0-.42-.66z"}})]),t("svg",{class:{rotate:e.themeOpen},attrs:{viewBox:"0 0 24 24",width:"12",height:"12"}},[t("path",{attrs:{fill:"currentColor",d:"M7 10l5 5 5-5z"}})])]),e.themeOpen?t("div",{staticClass:"dropdown-menu"},[t("div",{staticClass:"dropdown-item",class:{active:e.currentTheme==="light"},on:{click:function(s){return e.setTheme("light")}}},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[t("path",{attrs:{fill:"currentColor",d:"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"}})]),t("span",[e._v(e._s(e.$t("theme.light")||"浅色"))])]),t("div",{staticClass:"dropdown-item",class:{active:e.currentTheme==="dark"},on:{click:function(s){return e.setTheme("dark")}}},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[t("path",{attrs:{fill:"currentColor",d:"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"}})]),t("span",[e._v(e._s(e.$t("theme.dark")||"深色"))])]),t("div",{staticClass:"dropdown-item",class:{active:e.currentTheme==="auto"},on:{click:function(s){return e.setTheme("auto")}}},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[t("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"}})]),t("span",[e._v(e._s(e.$t("theme.auto")||"自动"))])])]):e._e()]),t("div",{staticClass:"auth-buttons"})])])])},ee=[],te=d(Q,Y,ee,!1,null,"ef01867a",null,null);const D=te.exports;const ie={name:"DropdownFilter",props:{placeholder:{type:String,default:"请选择"},options:{type:Array,required:!0},value:{type:Array,default:()=>[]},searchable:{type:Boolean,default:!0},showChips:{type:Boolean,default:!1}},data(){return{isOpen:!1,searchQuery:"",internalValue:[...this.value]}},watch:{value(i){this.internalValue=[...i]}},computed:{filteredOptions(){if(!this.searchQuery)return this.options;const i=this.searchQuery.toLowerCase();return this.options.filter(e=>e.toLowerCase().includes(i))}},methods:{toggle(){this.isOpen=!this.isOpen},close(){this.isOpen=!1},updateValue(){this.$emit("input",this.internalValue)},remove(i){const e=this.internalValue.indexOf(i);e>-1&&(this.internalValue.splice(e,1),this.updateValue())}},directives:{"click-outside":{bind(i,e,t){i.clickOutsideEvent=function(s){i===s.target||i.contains(s.target)||t.context[e.expression](s)},document.body.addEventListener("click",i.clickOutsideEvent)},unbind(i){document.body.removeEventListener("click",i.clickOutsideEvent)}}}};var se=function(){var e=this,t=e._self._c;return t("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:e.close,expression:"close"}],staticClass:"dropdown-filter"},[t("div",{staticClass:"dropdown-trigger",class:{"is-open":e.isOpen},on:{click:e.toggle}},[t("div",{staticClass:"selected-area"},[e.value.length>0?[e.showChips?t("div",{staticClass:"chips"},e._l(e.value,function(s){return t("span",{key:s,staticClass:"chip"},[e._v(" "+e._s(s)+" "),t("i",{staticClass:"close-icon",on:{click:function(a){return a.stopPropagation(),e.remove(s)}}},[e._v("×")])])}),0):t("span",{staticClass:"text-truncate"},[e._v(e._s(e.value.join(", ")))])]:t("span",{staticClass:"placeholder"},[e._v(e._s(e.placeholder))])],2),t("div",{staticClass:"arrow-icon"},[t("svg",{style:{transform:e.isOpen?"rotate(180deg)":""},attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[t("path",{attrs:{fill:"currentColor",d:"M7 10l5 5 5-5z"}})])])]),t("transition",{attrs:{name:"fade-slide"}},[e.isOpen?t("div",{staticClass:"dropdown-panel"},[e.searchable?t("div",{staticClass:"search-box"},[t("svg",{staticClass:"search-icon",attrs:{viewBox:"0 0 24 24",width:"16",height:"16"}},[t("path",{attrs:{fill:"currentColor",d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}})]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.searchQuery,expression:"searchQuery"}],staticClass:"search-input",attrs:{type:"text",placeholder:"搜索"+e.placeholder+"..."},domProps:{value:e.searchQuery},on:{input:function(s){s.target.composing||(e.searchQuery=s.target.value)}}}),e.searchQuery?t("i",{staticClass:"clear-icon",on:{click:function(s){e.searchQuery=""}}},[e._v("×")]):e._e()]):e._e(),t("div",{staticClass:"options-list"},[e._l(e.filteredOptions,function(s){return t("label",{key:s,staticClass:"option-item"},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.internalValue,expression:"internalValue"}],attrs:{type:"checkbox"},domProps:{value:s,checked:Array.isArray(e.internalValue)?e._i(e.internalValue,s)>-1:e.internalValue},on:{change:[function(a){var n=e.internalValue,o=a.target,u=!!o.checked;if(Array.isArray(n)){var c=s,r=e._i(n,c);o.checked?r<0&&(e.internalValue=n.concat([c])):r>-1&&(e.internalValue=n.slice(0,r).concat(n.slice(r+1)))}else e.internalValue=u},e.updateValue]}}),t("span",{staticClass:"checkbox-custom"}),t("span",{staticClass:"option-label"},[e._v(e._s(s))])])}),e.filteredOptions.length===0?t("div",{staticClass:"no-options"},[e._v("无匹配结果")]):e._e()],2)]):e._e()])],1)},ae=[],ne=d(ie,se,ae,!1,null,"23fe5532",null,null);const oe=ne.exports,f="/assets/thumb-1-02307e90.png",k="/assets/thumb-2-9a0be4a2.png",A="/assets/thumb-3-49794369.png",I="/assets/thumb-4-8c527afd.png",re="/assets/leaf-main-a05e1022.png",le="/assets/jsonview-thumb-e1134dfc.png",ce="/assets/cors-thumb-5c824e56.png",x="/assets/mapbox-3d-thumb-ee13df80.png",T="/assets/thumb-2-9a0be4a2.png",S="/assets/antigravity-thumb-5b6695cb.png",L="/assets/antigravity-thumb-5b6695cb.png",P="/assets/wireshark-windows-xp-guide-thumb-df60f83d.png",M="/assets/google-antigravity-2026-guide-thumb-67aaf437.png",de="/assets/cors-thumb-5c824e56.png",ue="/assets/karpathy-ai-coding-rules-thumb-80c1775d.png",pe="/assets/knowledge-vs-workflows-thumb-261093f9.png",me="/assets/ai-knowledge-advanced-thumb-a03c63c4.png",he="/assets/global-skill-configuration-thumb-13abf383.png",l=`

---
专注于分享经过验证的开发技巧与实用资源，致力于为你节省检索信息的时间，以及AI工具经验分享获取更多干货。关注微信公众号：数维探索`,v=[{id:1,slug:"antigravity-unban-guide",title:"Google Antigravity 账号解封指南, 官方解封教程来了(附唯一申诉入口)",image:L,date:"2026-04-07",author:"数维探索",views:"2,500",category:"视频",duration:"05:30",excerpt:"近期, 不少开发者反映其用于体验 Google 全新 AI IDE Antigravity(或 Gemini CLI)的账号遭到了封禁. 如果你也遇到了同样的问题, 不必惊慌. 本期视频将为你提供一份详尽的官方解封教程, 帮助你抓住这唯一一次的解封机会.",tags:[{name:"账号解封",type:"blue"},{name:"Antigravity",type:"blue"},{name:"AI工具",type:"green"}],collection:"AI百科",relatedIds:[13,2,3],recommendationIds:[2,3,6,7],gallery:[L],markdownContent:`
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
`+l},{id:2,slug:"antigravity-2026-ban-analysis",title:"Google AI IDE Antigravity 2026大规模封号事件深度解析: 原因与应对策略",image:S,date:"2026-04-07",author:"数维探索",views:"1,000",category:"视频",duration:"08:00",excerpt:"2026年2月12日, 科技圈迎来一次震动, 许多开发者登录 Google 的前沿 AI IDE Antigravity时, 惊讶地发现自己的账号已被封禁. 这次事件波及范围广泛, 从普通用户到付费的Pro乃至Ultra用户都未能幸免...",tags:[{name:"封号事件",type:"blue"},{name:"AI工具",type:"blue"},{name:"Antigravity",type:"green"}],collection:"AI百科",relatedIds:[1,3,4],recommendationIds:[3,4,7,8],gallery:[S],markdownContent:`
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
`+l},{id:3,slug:"llm-open-source-panic-v2",title:"AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?",image:T,date:"2026-04-07",author:"数维探索",views:"1,500",category:"视频",duration:"06:30",excerpt:"近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本视频将带你深入探究这一话题的来龙去脉。",tags:[{name:"AI趋势",type:"blue"},{name:"LLM",type:"blue"},{name:"开源",type:"green"}],collection:"AI百科",relatedIds:[1,7,14],recommendationIds:[2,7,8,12],gallery:[T],markdownContent:`
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
`+l},{id:4,slug:"cli-proxy-settings-ai-beginners",title:"AI新手必备: 命令行代理设置终极教程(临时与永久)",image:A,date:"2026-04-07",author:"数维探索",views:"2,100",category:"教程",duration:"10:30",excerpt:"在探索AI的世界时，网络限制常是第一道坎。本指南手把手教你如何为命令行设置临时与永久代理，助你高效学习。",tags:[{name:"AI学习",type:"blue"},{name:"命令行",type:"blue"},{name:"代理设置",type:"green"}],collection:"数维探索工具箱",relatedIds:[13,5,6],recommendationIds:[5,6,9,10],gallery:[A],markdownContent:`
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
`+l},{id:5,slug:"ai-engineer-rules-and-workflows",title:"AI 工程师全局规则与项目规范",image:f,date:"2026-04-07",author:"数维探索",views:"3,200",category:"教程",duration:"15:00",excerpt:"最新发布的 AI 全局开发准则与项目级工作流，涵盖 HTML 与 VUE 工程师的角色职责与标准化技术栈规范。",tags:[{name:"AI工具",type:"blue"},{name:"工作流",type:"blue"},{name:"开发规范",type:"green"}],collection:"数维探索工具箱",relatedIds:[13,6,10],recommendationIds:[6,7,9,10],gallery:[f],markdownContent:`
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
`+l},{id:6,slug:"gemini-3-1-pro-hongkong",title:"重磅消息：Google Gemini 3.1 Pro 正式登陆香港, AI 新时代开启!",image:I,date:"2026-04-07",author:"数维探索",views:"2,800",category:"新闻",duration:"05:45",excerpt:"近日, Google 旗下最先进的大语言模型之一 Gemini 3.1 Pro, 现已通过其 Web 应用正式向香港地区用户开放。",tags:[{name:"Gemini",type:"blue"},{name:"Gemini 3.1 Pro",type:"blue"},{name:"香港",type:"green"}],collection:"AI百科",relatedIds:[1,7,8],recommendationIds:[1,2,9,10],gallery:[I],markdownContent:`
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
`+l},{id:7,slug:"llm-open-source-panic",title:"AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?",image:k,date:"2026-04-07",author:"数维探索",views:"1,500",category:"新闻",duration:"06:30",excerpt:"近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本文将带你深入探究这一话题的来龙去脉。",tags:[{name:"AI趋势",type:"blue"},{name:"LLM",type:"blue"},{name:"开源",type:"green"}],collection:"AI百科",relatedIds:[3,8,12],recommendationIds:[3,12,14,15],gallery:[k],markdownContent:`
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
`+l},{id:8,slug:"claude-opus-4-6-antigravity",title:"Claude Opus 4.6 登陆 Antigravity: 是完整升级还是“残血版”? Pro 用户上手初体验",image:f,date:"2026-04-07",author:"数维探索",views:"1,000",category:"评测",duration:"08:00",excerpt:"备受期待的 Claude Opus 4.6 模型终于在 Google 的 AI IDE 平台 Antigravity 上线! 本视频将为你详细解析更新内容及1M上下文测试。",tags:[{name:"Claude",type:"blue"},{name:"Opus 4.6",type:"blue"},{name:"Antigravity",type:"green"}],collection:"AI百科",relatedIds:[1,9,10],recommendationIds:[1,10,12,14],gallery:[f],markdownContent:`
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
`+l},{id:9,slug:"mapbox-3d-map",title:"Mapbox GL JS 初始化 3D 建筑与地形教程",image:x,date:"2026-04-03",author:"数维探索",views:"1,100",category:"教程",duration:"12:30",excerpt:"学习如何使用 Mapbox GL JS 快速初始化一个包含 3D 建筑挤压（Fill-Extrusion）和数字高程模型（DEM）地形的交互式 3D 地图。",tags:[{name:"Mapbox",type:"blue"},{name:"3D地图",type:"blue"},{name:"WebGIS",type:"green"}],collection:"地图",relatedIds:[10,11,12],recommendationIds:[10,11,12,1],gallery:[x],markdownContent:`
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
`+l},{id:10,slug:"chrome-cors-plugin",title:"Chrome & Firefox 跨域插件配置教程",image:ce,date:"2026-04-02",author:"数维探索",views:"1,800",category:"教程",duration:"08:15",excerpt:"本地开发遇到 Cross-Origin 跨域问题？通过 Chrome 和 Firefox 插件轻松开启 Access-Control-Allow-Origin，加速前后端调试。",tags:[{name:"Chrome",type:"blue"},{name:"插件",type:"blue"},{name:"跨域",type:"green"}],collection:"数维探索工具箱",relatedIds:[11,12,1],recommendationIds:[11,12,1,2],gallery:[],markdownContent:`
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
`+l},{id:11,slug:"chrome-jsonview-install",title:"Chrome 安装 JSONview 插件教程",image:le,date:"2026-04-02",author:"数维探索",views:"1,500",category:"教程",duration:"05:00",excerpt:"Chrome 安装 JSONview 插件后，可以在浏览器中直接查看格式化后的 JSON 内容，是开发者必备的工具。",tags:[{name:"Chrome",type:"blue"},{name:"插件",type:"blue"},{name:"JSON",type:"green"}],collection:"数维探索工具箱",relatedIds:[10,12,1],recommendationIds:[10,12,1,2],gallery:["/11/1.png","/11/2.png","/11/3.png","/11/4.png"],markdownContent:`
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
`+l},{id:12,slug:"offline-leaflet-map",title:"Leaflet 离线地图下载与加载教程",image:re,date:"2026-04-02",author:"数维探索",views:"1,200",category:"教程",duration:"10:00",excerpt:"本教程详细介绍了下载离线地图瓦片的两种方式（osm 和 MapTileDownloader），并提供了在 Leaflet 中加载离线地图的代码示例。",tags:[{name:"Leaflet",type:"blue"},{name:"地图",type:"blue"}],collection:"数维探索工具箱",relatedIds:[13,1,2],recommendationIds:[1,2,3,11],gallery:[],markdownContent:`


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
`+l},{id:13,slug:"wireshark-windows-xp-guide",title:"Wireshark在Windows XP系统上的安装与使用指南",image:P,date:"2026-04-15",author:"数维探索",views:"1,200",category:"教程",duration:"10:00",excerpt:"Wireshark在Windows XP系统上运行需要特定的旧版本。本教程为你整理了最稳定的版本下载、WinPcap驱动安装及抓包注意事项。",tags:[{name:"Wireshark",type:"blue"},{name:"Windows XP",type:"blue"},{name:"抓包",type:"green"}],collection:"数维探索工具箱",relatedIds:[1,2,4],recommendationIds:[1,2,6,7],gallery:[P],markdownContent:`
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
`+l},{id:14,slug:"google-antigravity-2026-guide",title:"Google Antigravity：2026 年 AI 编程终极指南",image:M,date:"2026-04-16",author:"数维探索",views:"1,200",category:"教程",duration:"12:00",excerpt:"Google 于 2025 年底发布的 Agent-First IDE，原生支持 Gemini 3 Pro 和 Claude Sonnet 4.5，开启 Vibe Coding 全栈自动化新纪元。",tags:[{name:"Antigravity",type:"blue"},{name:"AI工具",type:"blue"},{name:"开发指南",type:"green"}],collection:"AI百科",relatedIds:[1,2,9,13],recommendationIds:[2,3,9,13],gallery:[M],markdownContent:`
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
`+l},{id:15,slug:"web-worker-vs-service-worker",title:"Web Worker vs Service Worker：多线程与离线缓存深度对比（含PWA实战）",image:de,date:"2026-04-21",author:"数维探索",views:"1,000",category:"教程",duration:"12:00",excerpt:"深入对比 Web Worker 与 Service Worker 的核心区别：前者专注 CPU 密集型后台计算，后者充当网络代理实现离线缓存与 PWA。本文含完整代码示例与 PWA 实战项目结构。",tags:[{name:"Web Worker",type:"blue"},{name:"Service Worker",type:"blue"},{name:"PWA",type:"green"}],collection:"数维探索工具箱",relatedIds:[4,9,10],recommendationIds:[4,9,10,12],gallery:["/15/1.png"],markdownContent:` **Web Worker** 和 **Service Worker** 都是浏览器提供的 JavaScript 多线程技术，但它们的用途和工作方式有显著区别。

| **对比项**                   | **Web Worker**                                          | **Service Worker**                                           |
| ---------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| **用途**                     | 用于在后台线程执行 CPU 密集型任务，避免阻塞主线程       | 主要用于离线缓存、网络请求拦截、推送通知等 PWA（渐进式 Web 应用）功能 |
| **生命周期**                 | 由页面创建，页面关闭后终止                              | 独立于页面，即使页面关闭也能运行（直到被浏览器终止）         |
| **DOM 访问**                 | ❌ 不能访问 DOM                                          | ❌ 不能访问 DOM                                               |
| **网络请求**                 | ⚠️ 可以发起 \`fetch\`，但不能拦截请求                      | ✅ 可以拦截、修改网络请求（\`fetch\` 事件）                     |
| **存储能力**                 | ⚠️ 可使用 \`IndexedDB\`、\`localStorage\`（同步 API 不可用） | ✅ 可使用 \`Cache API\`、\`IndexedDB\`                            |
| **通信方式**                 | ✅ \`postMessage\` 与主线程通信                            | ✅ 通过 \`postMessage\` 与页面通信，也支持 \`BroadcastChannel\`   |
| **典型应用场景**             | 大数据计算、图像处理、复杂算法                          | 离线缓存、资源预加载、后台同步、推送通知                     |
| **注册方式**                 | \`new Worker('worker.js')\`                               | \`navigator.serviceWorker.register('sw.js')\`                  |
| **作用范围**                 | 仅影响当前页面                                          | 可控制多个页面（作用域内）                                   |
| **是否支持 \`importScripts\`** | ✅ 支持                                                  | ✅ 支持                                                       |

## **Web Worker（专用 Worker）**

- **用途**：在独立线程运行脚本，防止主线程卡顿（如计算、数据处理）。
- **特点**：
  - 由页面创建，页面关闭后 Worker 终止。
  - 不能访问 DOM、\`window\`、\`document\`。
  - 通过 \`postMessage\` 与主线程通信。

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        // 主线程 main.js
const worker = new Worker('./worker.js');

// 接收消息
worker.onmessage = function(e) {
    console.log('1111');
  console.log('收到Worker消息:', e.data);
};

// 发送消息
worker.postMessage('开始计算zzz');
    <\/script>
</body>
</html>
\`\`\`

还需要执行的worker.js

\`\`\`javascript
// worker.js
self.onmessage = function(e) {
    console.log('收到主线程消息:', e.data);
    
    // 模拟耗时计算
    const result = heavyCalculation();
    
    // 发送结果
    self.postMessage(result);
  };
  
  function heavyCalculation() {
    // 复杂计算逻辑
    let sum = 0;
    for(let i = 0; i < 9999; i++) {
      sum += i;
    }
    return sum;
  }
\`\`\`



## **Service Worker 实现PWA页面**

- **用途**：充当网络代理，实现离线缓存、资源预加载、后台同步等 PWA 功能。
- **特点**：
  - 独立于页面运行，即使页面关闭也能存活（用于后台同步、推送通知）。
  - 可以拦截 \`fetch\` 请求，返回缓存数据。
  - 必须通过 HTTPS（本地开发允许 \`localhost\`）。

 需要注意的是使用http-server -c-1启动服务需要使用这样的地址访问[ http://127.0.0.1:8080/](http://127.0.0.1:8080/) 才能正常激活service worker

<img src='/15/1.png'>

###  目录结构



#### index.html

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Worker 示例</title>
    <link rel="stylesheet" href="./styles/main.css">
</head>
<body>
    <h1>Service Worker 演示</h1>
    <img src="./images/logo.png" alt="Logo">
    <script src="./scripts/app.js"><\/script>
    <script>
        // 注册 Service Worker
        if ('serviceWorker' in navigator) {
            console.log('浏览器支持 Service Worker');
            // 直接执行注册代码
            navigator.serviceWorker.register('./sw.js')
               .then(registration => {
                    console.log('ServiceWorker 注册成功: ', registration.scope);
                })
               .catch(err => {
                    console.error('ServiceWorker 注册失败，错误信息:', err.message, '错误堆栈:', err.stack);
                });
        } else {
            console.log('浏览器不支持 Service Worker');
        }
    <\/script>
</body>
</html>
\`\`\`



#### sw.js

\`\`\`javascript
const CACHE_NAME = 'my-site-cache-v1';
// 修改资源路径
const ASSETS_TO_CACHE = [
  './',
  './index.html', // 离线回退页面
  './styles/main.css',
  './scripts/app.js',
  './images/logo.png'
];

// 安装阶段 - 缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('正在缓存核心资源');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(err => {
        console.log('缓存失败: ', err);
      })
  );
})

// 激活阶段 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存: ', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求 - 缓存优先策略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 命中缓存则返回，否则网络请求
        return response || fetch(event.request);
      })
  );
});

// 后台同步示例（需配合 SyncManager API）
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(sendOfflineData());
  }
});

async function sendOfflineData() {
  // 在这里实现后台同步逻辑（如提交离线数据到服务器）
  console.log('后台同步执行...');
}
\`\`\`



#### styles/main.css

\`\`\`css
.img {
    height: 100px;
    width: 100px;
}
\`\`\`



####  scripts/app.js

\`\`\`javascript
console.log('主应用脚本已加载1');

// 检查 Service Worker 更新
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('发现新版本 Service Worker');
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            console.log('新内容已下载，刷新页面即可使用');
            // 这里可以添加 UI 提示用户刷新
          } else {
            console.log('内容已缓存，可离线使用');
          }
        }
      });
    });
  });
}
\`\`\`



### **关键功能说明**

1. **预缓存静态资源**
   - 在 \`install\` 阶段缓存 \`ASSETS_TO_CACHE\` 列表中的文件（如 HTML、CSS、JS）。
2. **动态缓存**
   - 在 \`fetch\` 事件中，优先返回缓存，若无则请求网络并缓存响应。
3. **离线回退**
   - 当网络请求失败且请求的是 HTML 时，返回 \`fallback.html\`。
4. **缓存清理**
   - 在 \`activate\` 阶段删除旧版本的缓存。
5. **后台同步**
   - 监听 \`sync\` 事件，在恢复网络后执行离线任务（需浏览器支持）。

------

###  **测试 Service Worker**

1. **首次加载**
   - 打开页面，检查 DevTools → Application → Service Workers 是否注册成功。
   - 在 Cache Storage 中应看到缓存的静态资源。
2. **离线测试**
   - 关闭网络，刷新页面，静态资源应能正常加载。
3. **更新 Service Worker**
   - 修改 \`sw.js\` 或 \`CACHE_NAME\` 版本号，重新加载页面触发更新。

------

### **注意事项**

- **HTTPS 要求**：生产环境必须使用 HTTPS（本地开发可用 \`localhost\`）。
- **缓存策略**：根据业务需求调整缓存逻辑（如不缓存 API 请求）。
- **作用域**：\`scope\` 决定 SW 控制的页面范围（如 \`/app/\` 下的页面）。

通过这个示例，你可以快速实现一个支持离线访问的 PWA 应用！

## PWA（**Progressive Web App**，渐进式网页应用）

是一种结合网页和原生应用优势的技术，通过现代 Web 技术提供类似原生应用的体验。以下是它的核心特点和解释：

------

### **1. 核心特点**

- **可离线使用**：通过 Service Worker 缓存资源，即使无网络也能访问。
- **安装到桌面**：用户可将网页添加到主屏幕，像独立应用一样启动（无需应用商店）。
- **响应式设计**：适配手机、平板、电脑等多种设备。
- **推送通知**：支持消息推送（类似原生 App）。
- **安全性**：必须运行在 HTTPS 环境下，确保数据安全。

------

### **2. 关键技术**

- **Service Worker**：后台运行的脚本，管理缓存和离线功能。
- **Web App Manifest**：JSON 文件，定义应用名称、图标、启动样式等。
- **HTTPS**：强制要求，保证安全性。
- **App Shell 架构**：快速加载核心界面框架，提升性能。

------

### **3. 优势 vs 传统网页/原生应用**

| **对比项** | **PWA**                | **传统网页** | **原生应用**       |
| ---------- | ---------------------- | ------------ | ------------------ |
| 安装方式   | 浏览器添加到主屏幕     | 仅浏览器访问 | 应用商店下载       |
| 离线功能   | ✅ 支持                 | ❌ 不支持     | ✅ 支持             |
| 更新       | 自动（Service Worker） | 实时刷新     | 需应用商店审核     |
| 开发成本   | 低（Web 技术）         | 最低         | 高（需多平台开发） |

------

### **4. 典型应用场景**

- 电商（如 AliExpress、京东 Lite）
- 社交媒体（Twitter Lite）
- 新闻博客（内容型网站）
- 工具类应用（计算器、天气预报）



## **总结**

| **场景**                     | **选择**                                          |
| ---------------------------- | ------------------------------------------------- |
| 需要后台计算（如大数据处理） | **Web Worker**                                    |
| 需要离线缓存、拦截网络请求   | **Service Worker**                                |
| 需要推送通知、后台同步       | **Service Worker**                                |
| 需要多线程并行计算           | **Web Worker** 或 **Shared Worker**（跨页面通信） |

两者可以结合使用，例如用 **Web Worker** 处理数据，用 **Service Worker** 缓存结果。
`+l},{id:16,slug:"karpathy-ai-coding-rules",title:"GitHub 6万星！Karpathy 的 AI 编码铁律：如何让 AI 乖乖写代码（附 Antigravity Knowledge 配置教程）",image:ue,date:"2026-04-22",author:"数维探索",views:"8,623",category:"教程",duration:"08:00",excerpt:"GitHub 趋势榜第一、Star 破6万的 AI 编码规范项目——基于 Karpathy 经验的4条铁律，配合 Antigravity Knowledge 全局配置，让 AI 写出更可控的代码。",tags:[{name:"AI工具",type:"blue"},{name:"Antigravity",type:"blue"},{name:"CLAUDE.md",type:"green"}],collection:"AI百科",relatedIds:[1,2,5],recommendationIds:[1,5,14,2],gallery:[],markdownContent:`这是目前 GitHub 前端/AI 圈最火的方向。因为大家都在用 AI 写代码，发现 AI 容易"放飞自我"（写得太复杂、乱改代码），所以大神们总结了一套**"如何让 AI 乖乖写代码"**的知识库。

- **项目名称**：**\`andrej-karpathy-skills\`** (或者叫 \`CLAUDE.md\` 规范)

- **火爆程度**：一周内冲上趋势榜第一，Star 数破 6 万。

- 核心内容

  这不是代码，而是一份 Markdown 文档。它基于 AI 大神 Andrej Karpathy 的经验，总结了 4 条 AI 必须遵守的铁律：

  1. **编码前思考**：遇到歧义先问，别瞎猜。
  2. **简洁优先**：能用 50 行写完，绝不写 200 行（拒绝过度抽象）。
  3. **精准修改**：只改必须改的地方，别顺手重构别人的代码。
  4. **目标驱动**：先写测试复现 Bug，再修复它。

- **怎么用**：
  你可以直接把它的核心内容复制到你 Antigravity 的 \`knowledge\` 目录里，或者在项目根目录放一个 \`CLAUDE.md\` 文件。这能极大提升 AI 写前端代码的"听话程度"。

全局添加 Antigravity 的 Knowledge（知识库）非常简单，这相当于给你的 AI 装上一个"永久记忆体"。一旦配置好，无论你打开哪个项目，AI 都会自动读取这些规则，不需要重复配置。

以下是具体的操作步骤：

### 第一步：找到或创建全局目录

\`Antigravity\`的全局配置通常存储在用户主目录下的 \`.gemini\` 文件夹中。

1. **打开文件资源管理器**（Windows）或 **访达**（Mac）。

2. 进入以下路径

   - **Windows**: \`C:\\\\Users\\\\你的用户名\\\\.gemini\\\\antigravity\\\\\`
   - **Mac / Linux**: \`~/.gemini/antigravity/\`

3. 检查目录

   查看是否存在名为 \`knowledge\` 的文件夹。

   - **如果没有**：请手动新建一个文件夹，命名为 \`knowledge\`。

> **小贴士**：\`.gemini\` 是隐藏文件夹。
>
> - **Windows**: 如果看不到，需要在查看选项中勾选"隐藏的项目"。
> - **Mac**: 在访达中按 \`Command + Shift + .\` 可以显示隐藏文件。

把对应的CLAUDE.md放在\`knowledge\`这个文件夹下面即可

\`\`\`markdown
# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" -> "Write tests for invalid inputs, then make them pass"
- "Fix the bug" -> "Write a test that reproduces it, then make it pass"
- "Refactor X" -> "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
\`\`\`

**Trae** 的全局配置通常在用户主目录下：
Windows: \`C:\\\\Users\\\\你的用户名\\\\.trae\\\\\`
Mac: \`~/.trae/\`
创建规则文件
在 .trae 目录下，找到或新建一个名为 rules 或 knowledge 的文件夹。
`+l},{id:17,slug:"knowledge-vs-workflows",title:"Antigravity 深度解析：Knowledge（知识库）vs Workflows（工作流）——AI 编程的内功与外功",image:pe,date:"2026-04-22",author:"数维探索",views:"3,450",category:"教程",duration:"06:00",excerpt:'Knowledge 是 AI 的"内功心法"（静态知识），Workflows 是"外功招式"（动态指令）。前者决定下限，后者决定上限。本文用厨师比喻带你彻底搞懂两者的区别与最佳实践。',tags:[{name:"Antigravity",type:"blue"},{name:"Knowledge",type:"blue"},{name:"Workflows",type:"green"}],collection:"AI百科",relatedIds:[16,5,14],recommendationIds:[16,5,14,1],gallery:[],markdownContent:`这两个概念虽然都是用来"调教"AI 的，但它们的作用机制完全不同。

简单来说：**Knowledge 是"内功心法"（静态知识），Workflows 是"外功招式"（动态指令）。**

为了让你更直观地理解，我们可以把 AI 想象成一个**厨师**：

### Knowledge (知识库) = 厨师的"参考书"与"口味偏好"

- **性质**：**静态的、被动的**。

- **作用**：它告诉 AI **"是什么"** 和 **"喜欢什么"**。

- 内容

  - 你的技术栈偏好（如：只用 React，不用 Vue）。
  - 项目的背景文档（如：API 接口文档、数据库结构图）。
  - 代码风格指南（如：变量命名规范、缩进习惯）。

- **触发方式**：**自动触发**。只要你提问，AI 就会先去翻阅这些"书"，确保回答符合你的规范。

- **你的场景**：你在 \`knowledge\` 目录里写"必须响应式"，AI 写代码时就会**潜意识**地加上媒体查询，不需要你每次都喊口号。

### Workflows (工作流) = 厨师的"标准作业程序"

- **性质**：**动态的、主动的**。

- **作用**：它告诉 AI **"怎么做"** 和 **"步骤是什么"**。

- 内容
  - 具体的执行步骤（如：第一步先搜索配色，第二步再生成代码）。
  - 调用的外部工具（如：运行 Python 脚本、执行 Shell 命令）。
  - 复杂的逻辑判断（如：如果报错，就自动重试）。

- **触发方式**：**手动触发**（通常通过斜杠命令）。你需要明确喊出 \`/ui-ux-pro-max\`，AI 才会启动这一套复杂的流程。

- **你的场景**：\`UI-UX Pro Max\` 就是一个 Workflow。它不仅仅是知道"要好看"，而是**实际运行**了一个 Python 脚本去搜索配色方案，然后把结果填入代码中。

### 总结对比表

| 维度 | Knowledge (知识库) | Workflows (工作流) |
| --- | --- | --- |
| **核心逻辑** | 上下文注入 | 任务自动化 |
| **比喻** | 员工手册、设计规范文档 | 自动化流水线、专用工具 |
| **AI 的行为** | 哦，原来老板喜欢这样，我记住了 | 收到指令！开始执行操作步骤 |
| **文件形式** | .md 文档、.txt 文本 | .md (带指令格式)、.json 配置 |
| **前端应用** | 规定用 Tailwind、TypeScript | 自动搜索配色、运行测试脚本 |
| **典型指令** | (无，自动生效) | /ui-ux-pro-max, /test, /deploy |

### 针对你的建议

作为前端工程师，这两者你是**都要用**的，它们互补：

1. **用 Knowledge 打底**：
   在 \`knowledge\` 目录里写好你的《前端规范》（React + Tailwind + 响应式）。这样，哪怕你只是随口问一句"写个按钮"，它生成的代码也是符合你项目标准的。
2. **用 Workflows 攻坚**：
   当你需要做一个**非常复杂、需要特定流程**的任务时（比如"帮我设计一套全新的设计系统"），这时候调用 \`/ui-ux-pro-max\` 这个 Workflow，让它去跑脚本、查资料、生成全套方案。

**一句话总结：Knowledge 决定了 AI 的"下限"（不会写出烂代码），Workflows 决定了 AI 的"上限"（能帮你干复杂的大活）。**
`+l},{id:18,slug:"ai-knowledge-advanced-management",title:"AI 知识库实战：分类管理进阶与三大核心配置模板",image:me,date:"2026-04-22",author:"数维探索",views:"5,102",category:"教程",duration:"07:00",excerpt:"将 AI 规则拆分为前端规范、接口文档和设计系统，附赠直接可用的高频 API 模板与 Tailwind UI/UX 原则，让 AI 秒变全能前端助手。",tags:[{name:"AI知识库",type:"blue"},{name:"前沿趋势",type:"green"}],collection:"AI百科",relatedIds:[17,16],recommendationIds:[17,16,5,14],gallery:[],markdownContent:`### 💡 进阶技巧：分类管理

如果你的规则很多，可以把它们拆分成多个文件放在 \`knowledge\` 目录下，Antigravity 会读取该目录下所有的 Markdown 文件：

- \`frontend-rules.md\` (放代码规范)
- \`company-api-docs.md\` (放公司的 API 文档，方便随时调用)
- \`ui-design-system.md\` (放设计系统的配色和字体规范)

这样，无论你在哪里，AI 都随身携带着你的"前端开发百科全书"

### 第一步：创建你的"前端规范"文件

在这个 \`knowledge\` 文件夹里，你可以创建任意数量的 \`.md\` (Markdown) 文件。建议创建一个名为 \`frontend-rules.md\` 的文件，专门存放你的前端开发铁律。

**文件内容示例（你可以直接复制并修改）：**

\`\`\`markdown
1# 前端开发核心规范
2
3## 1. 技术栈偏好
4- **框架**: 始终优先使用 React (Next.js App Router)。
5- **语言**: 必须使用 TypeScript，严禁使用 \`any\` 类型。
6- **样式**: 必须使用 Tailwind CSS。禁止使用原生 CSS 文件或 styled-components。
7- **图标**: 优先使用 \`lucide-react\`。
8
9## 2. 代码风格
10- **组件**: 使用函数式组件和 Hooks。
11- **命名**: 文件使用 kebab-case (如 \`user-card.tsx\`)，组件使用 PascalCase。
12- **结构**: 保持组件单一职责，一个文件只导出一个主要组件。
13
14## 3. UI/UX 原则
15- **响应式**: 所有布局必须默认移动端优先 (Mobile First)。
16- **交互**: 按钮和链接必须有 \`hover\` 状态反馈。
17- **无障碍**: 图片必须包含 \`alt\` 属性，表单输入必须关联 \`label\`。
18
19## 4. 禁止事项
20- ❌ 禁止使用 jQuery。
21- ❌ 禁止使用内联样式 \`style="..."\`。
22- ❌ 禁止在组件中硬编码文字内容。
\`\`\`

#### 🚀 验证生效

配置完成后，**重启 Antigravity 客户端**（如果它正在运行）。

你可以通过以下方式验证是否生效：

1. 随便打开一个项目（或者新建一个空项目）。
2. 在对话框输入："帮我写一个登录框"。
3. 观察结果
   - 如果 AI 自动使用了 **React + TypeScript**。
   - 如果 AI 自动使用了 **Tailwind CSS** 类名。
   - 如果 AI 自动考虑了 **移动端适配**。

那么恭喜你，你的全局 Knowledge 已经成功"附体"到 AI 身上了！

### 第二步：接口文档，变成了 AI 随时能查阅的"随身笔记"

这个文件其实就是把你那些原本要反复复制粘贴的接口文档，变成了 AI 随时能查阅的"随身笔记"。

它的核心目的只有一个：**让 AI 在不联网、不看 Swagger 的情况下，也能精准地写出符合你后端要求的 API 调用代码。**

一个高质量的 \`company-api-docs.md\` 通常包含以下 4 个核心板块。你可以直接参考这个模板来填充你们公司的实际接口信息：

#### 📋 通用配置板块

这部分告诉 AI 请求的基础信息，避免它每次都问你"接口地址是多少"或者"Header 要带什么"。

\`\`\`markdown
1## 1. 基础配置
2- **Base URL**: \`https://api.your-company.com/v1\`
3- **认证方式**: Bearer Token (JWT)
4- **通用请求头**:
5  - \`Content-Type\`: \`application/json\`
6  - \`Authorization\`: \`Bearer <token>\`
7- **通用响应结构**:
8  所有接口返回的数据都包裹在一个标准结构中：
9  \`\`\`json
10  {
11    "code": 200, // 200表示成功，非200表示业务错误
12    "msg": "success", // 错误信息
13    "data": { ... } // 实际数据载荷
14  }
\`\`\`

\`\`\`markdown
1
2### 📚 核心数据模型板块
3不要把所有字段都写上去，只写**高频复用**的实体。这能防止 AI 瞎编字段名（比如把 \`userName\` 写成 \`username\`，导致前端报错）。
4
5\`\`\`markdown
6## 2. 核心数据类型
7### 用户
8- \`id\`: string - 用户唯一标识 (UUID)
9- \`username\`: string - 登录用户名
10- \`email\`: string - 邮箱
11- \`role\`: enum - 角色 ('admin', 'editor', 'viewer')
12- \`status\`: enum - 状态 ('active', 'banned')
13
14### 商品
15- \`sku\`: string - 库存单位编码
16- \`price\`: number - 价格 (单位: 分，不是元！)
17- \`stock\`: number - 库存数量
\`\`\`

#### 🔌 高频接口板块

这是最有价值的部分。只记录**最常用**的接口，或者**逻辑最复杂**的接口。

**格式建议**：使用类似 Swagger 的简洁写法，或者直接贴 curl 示例。



\`\`\`markdown
1## 3. 常用接口定义
2
3### 获取用户列表 (分页)
4- **URL**: \`GET /users\`
5- **参数**:
6  - \`page\`: number (默认 1)
7  - \`pageSize\`: number (默认 10)
8  - \`role\`: string (可选，筛选角色)
9- **返回示例**:
10  \`\`\`json
11  {
12    "code": 200,
13    "data": {
14      "list": [ ...用户数组... ],
15      "total": 100
16    }
17  }
\`\`\`

#### 创建订单

- **URL**: \`POST /orders\`

- 请求体

  \`\`\`json
  1{
  2  "userId": "string",
  3  "items": [
  4    { "sku": "string", "count": "number" }
  5  ]
  6}
  \`\`\`

- **特殊逻辑**: 创建订单前必须检查库存，如果库存不足直接返回 code 4001。

\`\`\`markdown
1
2### ⚠️ 业务逻辑与坑点板块
3这是 AI 绝对不知道的"隐形知识"。比如某些字段虽然叫 \`price\`，但其实是"分"不是"元"；或者某些状态流转的特殊规则。
4
5\`\`\`markdown
6## 4. 业务规则与注意事项
7- **金额处理**: 所有涉及金额的字段（price, totalAmount）后端返回的都是**整数（分）**，前端展示时必须除以 100。
8- **日期格式**: 后端所有时间字段都是 Unix 时间戳 (毫秒)，不是字符串。
9- **图片地址**: 接口返回的 \`avatar\` 只是相对路径，前端需要拼接 CDN 域名 \`https://cdn.your-company.com\`。
10- **状态码**:
11  - \`401\`: Token 过期，需跳转登录。
12  - \`4001\`: 库存不足。
13  - \`4002\`: 优惠券不可用。
\`\`\`

### 📌 总结：怎么写才好用？

1. **只写"热"数据**：不要把你公司几百个接口全贴上去，AI 会看晕。只贴你每天开发都要用的那 10-20 个核心接口。
2. **保持更新**：如果后端改了字段（比如把 \`userName\` 改成了 \`nickname\`），记得同步更新这个文件。
3. **格式清晰**：AI 喜欢结构化的数据，用 Markdown 的列表和代码块排版，它理解得最快。

把这个文件放进全局 \`knowledge\` 目录后，你下次只要说："帮我写个获取用户列表的函数"，AI 就会自动知道要请求 \`/users\`，要处理分页，还要把金额除以 100。

### 第三步：UI 设计系统规范 ui-design-system.md

本文件定义了项目的全局视觉规范。所有前端代码生成必须严格遵循以下变量和原则，以确保 UI 的一致性。

#### 1. 设计令牌

所有样式必须使用 Tailwind CSS 的 \`extend\` 配置或标准工具类，禁止使用硬编码的十六进制颜色或像素值。

**色彩系统**

- **主色调**: \`primary-500\` (#3B82F6) - 用于主要按钮、激活状态、链接。

- 功能色
  - \`success-500\` (#10B981) - 成功提示、完成状态。
  - \`warning-500\` (#F59E0B) - 警告提示、待处理状态。
  - \`danger-500\` (#EF4444) - 错误提示、删除操作。

- 中性色
  - 背景: \`gray-50\` (浅色模式背景), \`gray-900\` (深色模式背景)。
  - 文本: \`gray-900\` (主标题), \`gray-600\` (正文), \`gray-400\` (次要文本/占位符)。

- **边框**: \`gray-200\` (默认分割线), \`gray-300\` (输入框边框)。

**排版系统**

- **字体家族**: Inter, system-ui, sans-serif.

- 字号
  - 超大标题: \`text-4xl\` (2.25rem) - 页面主标题。
  - 大标题: \`text-2xl\` (1.5rem) - 卡片标题。
  - 正文: \`text-base\` (1rem) - 标准内容。
  - 小字: \`text-sm\` (0.875rem) - 辅助说明、图注。

- 字重
  - 粗体: \`font-bold\` (700) - 强调。
  - 中等: \`font-medium\` (500) - 按钮、标题。
  - 常规: \`font-normal\` (400) - 正文。

**间距与布局**

- **基础单位**: 4px (Tailwind 默认单位)。

- 常用间距
  - 紧凑: \`p-2\`, \`p-4\` (组件内部填充)。
  - 标准: \`p-6\`, \`p-8\` (卡片、容器填充)。
  - 宽松: \`gap-4\`, \`gap-6\` (元素间距)。

- 圆角
  - 小元素: \`rounded\` (4px) - 按钮、标签。
  - 容器: \`rounded-lg\` (8px) - 卡片、模态框、输入框。
  - 全屏: \`rounded-full\` - 头像。

**阴影与层级**

- **卡片阴影**: \`shadow-sm\` (默认), \`shadow-md\` (悬浮/悬停)。

- **模态框阴影**: \`shadow-xl\`。

- 层级
  - 下拉菜单: \`z-10\`。
  - 模态框: \`z-50\`。
  - 提示条: \`z-50\`。
`+l},{id:19,slug:"global-skill-configuration-uipro",title:"全局技能配置实战：如何在所有项目中通用 UI-UX Pro Max",image:he,date:"2026-04-22",author:"数维探索",views:"2,109",category:"教程",duration:"06:00",excerpt:"深入解析 Antigravity 技能架构的“全局库+项目引用”模式，两步实现在任意项目中全局调用 UI-UX Pro Max 技能，彻底解放生产力。",tags:[{name:"AI工具",type:"blue"},{name:"开发指南",type:"green"}],collection:"AI百科",relatedIds:[18,17],recommendationIds:[18,17,16,5],gallery:[],markdownContent:`要在**所有项目**中都使用 \`UI-UX Pro Max Skill\`，你需要理解 Antigravity 的技能架构是**"全局库 + 项目级引用"**的模式。

简单来说，你需要做两件事：

1. **全局安装**：把技能包下载到你电脑的"仓库"里（只需做一次）。
2. **项目配置**：在每个项目中创建一个"遥控器"（Workflow 文件），告诉 Antigravity 去"仓库"里调用这个技能。

以下是实现"全项目通用"的完整操作指南：

### 🛠️ 第一步：全局安装（只需执行一次）

首先，确保你的电脑里已经有了这个技能的"本体"。

1. 打开终端，运行以下命令安装 CLI 工具（如果之前装过可跳过）：

   \`\`\`bash
   npm install -g uipro-cli
   \`\`\`

2. 安装到当前项目

   \`\`\`bash
   # Go to your project
   cd /path/to/your/project
   
   # Install for your AI assistant
   uipro init --ai claude      # Claude Code
   uipro init --ai cursor      # Cursor
   uipro init --ai windsurf    # Windsurf
   uipro init --ai antigravity # Antigravity
   \`\`\`

3. 安装到全局目录

   为了确保所有项目都能找到它，建议确认技能已存在于 Antigravity 的全局目录中。

   - **目录路径**：\`~/.gemini/antigravity/skills/\`

   - 操作

     \`\`\`bash
     cd ~/.gemini/antigravity/skills
     # 如果目录下没有 ui-ux-pro-max-skill 文件夹，请运行：
     git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git
     \`\`\`

   - *此时，你的全局仓库里已经有了这个技能。*

---

### 🔌 第二步：如何在"所有项目"中生效

由于 Antigravity 的设计初衷是**项目级隔离**（避免不同项目加载过多无用技能导致变慢），它**没有**一个"一键全局开启"的开关。

要在每个项目中使用，你有两种策略：

#### 策略 A：标准做法（在每个项目中初始化）

这是最推荐的做法，因为它会在项目中生成必要的配置文件，确保技能稳定运行。

1. 进入你的项目目录。

2. 运行初始化命令：

   \`\`\`bash
   uipro init --ai antigravity
   \`\`\`

3. **原理**：这个命令会自动在你的项目根目录创建 \`.agent/skills/ui-ux-pro-max.md\` 文件。这个文件就是"遥控器"，它指向你第一步中安装的全局技能。

4. **建议**：将 \`.agent/\` 目录添加到你的 \`.gitignore\` 文件中，以免污染代码库。

#### 策略 B：手动复用（如果你不想在每个项目都敲命令）

如果你已经在一个项目中配置好了，想快速应用到另一个项目，可以直接复制配置文件。

1. 在**已配置好的项目**中，找到 \`.agent/skills/ui-ux-pro-max.md\` 文件。
2. 将其**复制**到**新项目**的 \`.agent/skills/\` 目录下（如果没有该目录则新建）。
3. 重启 Antigravity，新项目中即可直接通过 \`/ui-ux-pro-max\` 调用。

---

### 🚀 第三步：验证与使用

配置完成后，你可以在任何项目中通过以下方式验证并使用：

1. **查看技能列表**：
   在 Antigravity 对话框输入 \`/\`，你应该能看到 \`ui-ux-pro-max\` 出现在列表中。

2. 直接使用

   输入指令即可触发全局技能：

   > \`/ui-ux-pro-max 为这个项目设计一个现代化的登录页面，使用深色模式\`

### 💡 核心提示

- **不要手动修改全局文件**：\`~/.gemini/antigravity/skills/\` 下的内容是"只读"的库。如果你需要微调技能行为，请在**项目级**的 \`.agent/skills/\` 文件中修改，或者创建新的 Workflow 文件指向全局库。
- **依赖检查**：确保你的每个项目环境（或全局环境）都安装了 **Python 3**，因为 \`UI-UX Pro Max\` 的核心搜索功能依赖 Python 脚本运行。
`+l}].reverse(),ge=["AI百科","2.5G网络","2026","AI","AI IDE","AI Studio","AI工具","AI学习","AI新闻","AI编程","AI趋势","acme.sh","Antigravity","Claude","DeepSeek","Gemini","Mac OS","Python","账号解封","Wireshark","Windows XP","抓包","开发指南","Web Worker","Service Worker","PWA","CLAUDE.md","Knowledge","Workflows","AI知识库","前沿趋势"],ve=["AI百科","Docker百科","地图","数维探索工具箱","数维探索 行业研报"],fe=["视频","文章","教程","新闻","评测","展望"];const ye={name:"FilterSection",components:{DropdownFilter:oe},props:{totalResults:{type:Number,default:0}},data(){return{allTags:ge,allCollections:ve,allTypes:fe,filters:{tags:[],collections:[],types:[],keyword:""}}},computed:{hasFilters(){return this.filters.tags.length>0||this.filters.collections.length>0||this.filters.types.length>0||this.filters.keyword!==""}},watch:{filters:{deep:!0,handler(i){this.$emit("filter-change",{...i})}}},methods:{handleSearch(){this.$emit("filter-change",{...this.filters})},clearFilters(){this.filters={tags:[],collections:[],types:[],keyword:""}}}};var _e=function(){var e=this,t=e._self._c;return t("section",{staticClass:"filter-section"},[t("div",{staticClass:"container"},[t("div",{staticClass:"filter-card fade-in"},[t("div",{staticClass:"filter-grid"},[t("div",{staticClass:"filter-item"},[t("span",{staticClass:"filter-label"},[e._v(e._s(e.$t("search.tagLabel")))]),t("DropdownFilter",{attrs:{placeholder:e.$t("search.tagPlaceholder"),options:e.allTags,showChips:!0},model:{value:e.filters.tags,callback:function(s){e.$set(e.filters,"tags",s)},expression:"filters.tags"}})],1),t("div",{staticClass:"filter-item"},[t("span",{staticClass:"filter-label"},[e._v(e._s(e.$t("search.collectionLabel")))]),t("DropdownFilter",{attrs:{placeholder:e.$t("search.collectionPlaceholder"),options:e.allCollections},model:{value:e.filters.collections,callback:function(s){e.$set(e.filters,"collections",s)},expression:"filters.collections"}})],1),t("div",{staticClass:"filter-item"},[t("span",{staticClass:"filter-label"},[e._v(e._s(e.$t("search.typeLabel")))]),t("DropdownFilter",{attrs:{placeholder:e.$t("search.typePlaceholder"),options:e.allTypes},model:{value:e.filters.types,callback:function(s){e.$set(e.filters,"types",s)},expression:"filters.types"}})],1),t("div",{staticClass:"filter-item search-box-wrapper"},[t("span",{staticClass:"filter-label"},[e._v(e._s(e.$t("search.keywordLabel")))]),t("div",{staticClass:"search-box"},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.filters.keyword,expression:"filters.keyword"}],staticClass:"search-input",attrs:{type:"text",placeholder:e.$t("search.keywordPlaceholder")},domProps:{value:e.filters.keyword},on:{keyup:function(s){return!s.type.indexOf("key")&&e._k(s.keyCode,"enter",13,s.key,"Enter")?null:e.handleSearch.apply(null,arguments)},input:function(s){s.target.composing||e.$set(e.filters,"keyword",s.target.value)}}}),t("button",{staticClass:"search-btn",on:{click:e.handleSearch}},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[t("path",{attrs:{fill:"currentColor",d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}})])])])])]),t("div",{staticClass:"results-bar"},[t("div",{staticClass:"results-count",domProps:{innerHTML:e._s(e.$t("search.resultsCount",{total:`<span class='highlight'>${e.totalResults}</span>`}))}}),e.hasFilters?t("button",{staticClass:"clear-btn",on:{click:e.clearFilters}},[e._v(e._s(e.$t("search.clear")))]):e._e()])])])])},we=[],Ce=d(ye,_e,we,!1,null,"3a2c80c9",null,null);const be=Ce.exports;const ke={name:"ContentCard",props:{item:{type:Object,required:!0}}};var Ae=function(){var e=this,t=e._self._c;return t("div",{staticClass:"content-card fade-in"},[t("div",{staticClass:"card-image"},[t("img",{attrs:{src:e.item.image,alt:e.item.title}}),t("div",{staticClass:"image-overlay"})]),t("div",{staticClass:"card-body"},[t("h3",{staticClass:"card-title"},[e._v(e._s(e.item.title))]),t("div",{staticClass:"card-meta"},[t("div",{staticClass:"meta-item"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[t("path",{attrs:{fill:"currentColor",d:"M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"}})]),t("span",[e._v(e._s(e.item.date))])]),t("div",{staticClass:"meta-item"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[t("path",{attrs:{fill:"currentColor",d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}})]),t("span",[e._v(e._s(e.item.author))])])]),t("p",{staticClass:"card-excerpt"},[e._v(e._s(e.item.excerpt))]),t("div",{staticClass:"card-tags"},e._l(e.item.tags,function(s){return t("span",{key:s,staticClass:"tag",class:"tag-"+s.type},[e._v(e._s(s.name))])}),0)])])},Ie=[],xe=d(ke,Ae,Ie,!1,null,"3bba609e",null,null);const O=xe.exports;const Te={name:"Pagination",props:{total:{type:Number,required:!0},current:{type:Number,required:!0},totalItems:{type:Number,required:!0}},computed:{displayedPages(){const i=[];for(let e=1;e<=this.total;e++)i.push(e);return i}},methods:{changePage(i){i>=1&&i<=this.total&&this.$emit("change",i)}}};var Se=function(){var e=this,t=e._self._c;return t("div",{staticClass:"pagination-container fade-in"},[t("div",{staticClass:"pagination"},[t("button",{staticClass:"page-btn prev",attrs:{disabled:e.current===1},on:{click:function(s){return e.changePage(e.current-1)}}},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[t("path",{attrs:{fill:"currentColor",d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}})])]),t("div",{staticClass:"page-numbers"},e._l(e.displayedPages,function(s){return t("button",{key:s,staticClass:"page-number",class:{active:s===e.current},on:{click:function(a){return e.changePage(s)}}},[e._v(" "+e._s(s)+" ")])}),0),t("button",{staticClass:"page-btn next",attrs:{disabled:e.current===e.total},on:{click:function(s){return e.changePage(e.current+1)}}},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[t("path",{attrs:{fill:"currentColor",d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}})])])]),t("div",{staticClass:"pagination-info"},[e._v(" "+e._s(e.$t("pagination.info",{total:e.totalItems,current:e.current,pages:e.total}))+" ")])])},Le=[],Pe=d(Te,Se,Le,!1,null,"a694815c",null,null);const Me=Pe.exports;const We={name:"SiteFooter",data(){return{showScrollTop:!1}},mounted(){window.addEventListener("scroll",this.handleScroll)},beforeDestroy(){window.removeEventListener("scroll",this.handleScroll)},methods:{handleScroll(){this.showScrollTop=window.pageYOffset>300},scrollToTop(){window.scrollTo({top:0,behavior:"smooth"})}}};var $e=function(){var e=this,t=e._self._c;return t("footer",{staticClass:"site-footer"},[t("div",{staticClass:"footer-bottom"},[t("div",{staticClass:"container"},[t("p",[e._v("© 2026 内容创作展示网站 toolset.site 保留所有权利 | 代理条款 | "),t("router-link",{attrs:{to:"/privacy-policy"}},[e._v("隐私政策")])],1)])]),t("div",{staticClass:"floating-actions",class:{show:e.showScrollTop}},[t("button",{staticClass:"float-btn to-top",attrs:{title:"回到顶部"},on:{click:e.scrollToTop}},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"24",height:"24"}},[t("path",{attrs:{fill:"currentColor",d:"M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"}})])])])])},Fe=[],Ee=d(We,$e,Fe,!1,null,"95a51643",null,null);const z=Ee.exports;const De={name:"Home",components:{SiteHeader:D,FilterSection:be,ContentCard:O,Pagination:Me,SiteFooter:z},data(){return{contentItems:v,filters:{tags:[],collections:[],types:[],keyword:""},currentPage:1,pageSize:8}},computed:{filteredItems(){return this.contentItems.filter(i=>{const e=!this.filters.keyword||i.title.toLowerCase().includes(this.filters.keyword.toLowerCase())||i.excerpt.toLowerCase().includes(this.filters.keyword.toLowerCase()),t=this.filters.tags.length===0||i.tags.some(n=>this.filters.tags.includes(n.name)),s=this.filters.collections.length===0||this.filters.collections.includes(i.collection),a=this.filters.types.length===0||this.filters.types.includes(i.category);return e&&t&&s&&a})},totalPages(){return Math.ceil(this.filteredItems.length/this.pageSize)||1},paginatedItems(){const i=(this.currentPage-1)*this.pageSize,e=i+this.pageSize;return this.filteredItems.slice(i,e)}},methods:{handleFilterChange(i){this.filters={...i},this.currentPage=1},handlePageChange(i){this.currentPage=i,window.scrollTo({top:0,behavior:"smooth"})},goToDetail(i){const e=this.contentItems.find(t=>t.id===i);e&&this.$router.push(`/detail/${e.slug}`)}}};var Oe=function(){var e=this,t=e._self._c;return t("div",{staticClass:"home-page"},[t("SiteHeader"),t("main",[t("FilterSection",{attrs:{totalResults:e.filteredItems.length},on:{"filter-change":e.handleFilterChange}}),t("section",{staticClass:"container py-40"},[e.paginatedItems.length>0?t("div",[t("div",{staticClass:"grid fade-in"},e._l(e.paginatedItems,function(s){return t("ContentCard",{key:s.id,attrs:{item:s},nativeOn:{click:function(a){return e.goToDetail(s.id)}}})}),1),t("Pagination",{attrs:{total:e.totalPages,current:e.currentPage,totalItems:e.filteredItems.length},on:{change:e.handlePageChange}})],1):t("div",{staticClass:"no-results fade-in"},[t("div",{staticClass:"no-results-content"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"64",height:"64"}},[t("path",{attrs:{fill:"currentColor",d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}})]),t("p",[e._v(e._s(e.$t("search.noResults")))])])])])],1),t("SiteFooter")],1)},ze=[],Ge=d(De,Oe,ze,!1,null,"c1f16c41",null,null);const Ue=Ge.exports;const Ve={name:"RelatedContent",props:{items:{type:Array,required:!0}},methods:{handleItemClick(i){this.$emit("select",i)}}};var Re=function(){var e=this,t=e._self._c;return t("aside",{staticClass:"sidebar"},[t("div",{staticClass:"sidebar-header"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[t("path",{attrs:{fill:"var(--primary-color)",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4h2v4zm0-6h-2V7h2v4z"}})]),t("span",[e._v("关联内容")])]),t("div",{staticClass:"related-list"},e._l(e.items,function(s){return t("div",{key:s.id,staticClass:"related-item",on:{click:function(a){return e.handleItemClick(s.id)}}},[t("div",{staticClass:"related-thumb"},[t("img",{attrs:{src:s.image,alt:"Thumbnail"}})]),t("div",{staticClass:"related-info"},[t("h4",{staticClass:"related-title"},[e._v(e._s(s.title))]),t("div",{staticClass:"related-meta"},[t("span",[e._v("时长: "+e._s(s.duration))]),t("span",{staticClass:"author"},[e._v("| "+e._s(s.author))])]),t("div",{staticClass:"related-tags"},e._l(s.tags.slice(0,2),function(a){return t("span",{key:a.name,staticClass:"mini-tag"},[e._v(e._s(a.name))])}),0)])])}),0)])},Be=[],Ne=d(Ve,Re,Be,!1,null,"e7c5a0d7",null,null);const He=Ne.exports;const G=new B({html:!0,highlight:function(i,e){if(e&&w.getLanguage(e))try{return`<pre class="hljs"><code>${w.highlight(i,{language:e}).value}</code><button class="copy-btn" data-clipboard-text="${encodeURIComponent(i)}">Copy</button></pre>`}catch{}return`<pre class="hljs"><code>${G.utils.escapeHtml(i)}</code><button class="copy-btn" data-clipboard-text="${encodeURIComponent(i)}">Copy</button></pre>`}}),je={name:"MarkdownRenderer",props:{content:{type:String,default:""}},computed:{previewHtml(){return G.render(this.content)}},mounted(){this.$el.addEventListener("click",this.handleCopy),this.addLazyLoading()},beforeDestroy(){this.$el.removeEventListener("click",this.handleCopy)},watch:{content(){this.$nextTick(()=>{this.addLazyLoading()})}},methods:{handleCopy(i){if(i.target.classList.contains("copy-btn")){const e=decodeURIComponent(i.target.getAttribute("data-clipboard-text"));navigator.clipboard.writeText(e).then(()=>{const t=i.target.innerText;i.target.innerText="Copied!",setTimeout(()=>{i.target.innerText=t},2e3)})}},addLazyLoading(){this.$el.querySelectorAll("img").forEach(e=>{e.setAttribute("loading","lazy")})}}};var Ze=function(){var e=this,t=e._self._c;return t("div",{staticClass:"markdown-body",domProps:{innerHTML:e._s(e.previewHtml)}})},qe=[],Je=d(je,Ze,qe,!1,null,null,null,null);const Ke=Je.exports;const Xe={name:"ContentDetail",components:{SiteHeader:D,SiteFooter:z,ContentCard:O,RelatedContent:He,MarkdownRenderer:Ke},props:{slug:{type:String,required:!0}},data(){return{item:null,relatedItems:[],recommendationItems:[]}},watch:{slug:{handler:"loadItem",immediate:!0}},methods:{loadItem(){if(this.item=v.find(i=>i.slug===this.slug),this.item){this.relatedItems=v.filter(e=>this.item.relatedIds.includes(e.id));const i=this.item.recommendationIds;this.recommendationItems=v.filter(e=>i.includes(e.id)).slice(0,4)}},goToDetail(i){const e=v.find(t=>t.id===i);e&&e.slug!==this.slug&&this.$router.push(`/detail/${e.slug}`)}}};var Qe=function(){var e=this,t=e._self._c;return t("div",{staticClass:"content-detail-page"},[t("SiteHeader"),t("main",{staticClass:"container detail-container fade-in"},[e.item?t("div",{staticClass:"detail-layout"},[t("div",{staticClass:"main-content"},[t("div",{staticClass:"video-player"},[t("img",{attrs:{src:e.item.image,alt:"Thumbnail"}}),t("div",{staticClass:"player-overlay"},[t("div",{staticClass:"play-btn-large"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"48",height:"48"}},[t("path",{attrs:{fill:"white",d:"M8 5v14l11-7z"}})])])])]),t("div",{staticClass:"content-info"},[t("h1",{staticClass:"detail-title"},[e._v(e._s(e.item.title))]),t("div",{staticClass:"meta-data-section"},[t("div",{staticClass:"full-meta"},[t("div",{staticClass:"meta-row"},[t("span",{staticClass:"meta-label"},[e._v("发布时间:")]),t("span",{staticClass:"meta-value"},[e._v(e._s(e.item.date))]),t("span",{staticClass:"meta-label ml-20"},[e._v("作者:")]),t("span",{staticClass:"meta-value"},[e._v(e._s(e.item.author))])]),t("div",{staticClass:"meta-row"},[t("span",{staticClass:"meta-label"},[e._v("浏览数:")]),t("span",{staticClass:"meta-value"},[e._v(e._s(e.item.views)+" 次")]),t("span",{staticClass:"meta-label ml-20"},[e._v("分类:")]),t("span",{staticClass:"meta-value"},[e._v(e._s(e.item.category))])])]),t("div",{staticClass:"interaction-bar"},[t("div",{staticClass:"stats-group"},[t("button",{staticClass:"stat-btn"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[t("path",{attrs:{fill:"currentColor",d:"M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"}})]),t("span",[e._v("0")])]),t("button",{staticClass:"stat-btn"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[t("path",{attrs:{fill:"currentColor",d:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"}})]),t("span",[e._v("0")])]),t("button",{staticClass:"stat-btn"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[t("path",{attrs:{fill:"currentColor",d:"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"}})]),t("span",[e._v("0")])])])])]),t("div",{staticClass:"detail-tags"},e._l(e.item.tags,function(s){return t("span",{key:s.name,staticClass:"tag",class:"tag-"+s.type},[e._v(e._s(s.name))])}),0),t("section",{staticClass:"markdown-section"},[t("div",{staticClass:"section-header"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[t("path",{attrs:{fill:"currentColor",d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}})]),t("span",[e._v("支持内容")])]),t("div",{staticClass:"markdown-content-card"},[t("MarkdownRenderer",{attrs:{content:e.item.markdownContent}})],1)])])]),t("RelatedContent",{attrs:{items:e.relatedItems},on:{select:e.goToDetail}})],1):t("div",{staticClass:"not-found"},[e._v(" Loading... ")]),t("section",{staticClass:"recommendations"},[t("div",{staticClass:"section-header"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[t("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.13-14.71a.5.5 0 0 0-.58.12l-3 4a.5.5 0 0 0 .4.8h1.55l-2.07 4.14a.5.5 0 0 0 .45.72h2l-2.22 4.44a.5.5 0 0 0 .89.44l7-14a.5.5 0 0 0-.42-.66z"}})]),t("span",[e._v("相关推荐")])]),t("div",{staticClass:"grid"},e._l(e.recommendationItems,function(s){return t("ContentCard",{key:s.id,attrs:{item:s},nativeOn:{click:function(a){return e.goToDetail(s.id)}}})}),1)])]),t("SiteFooter")],1)},Ye=[],et=d(Xe,Qe,Ye,!1,null,"f37a6643",null,null);const tt=et.exports,W=[{category:"AI 热门应用",icon:"🔥",tools:[{name:"股票趋势分析",desc:"基于历史数据和AI算法分析股票价格走势",url:"https://www.tradingview.com",icon:"https://api.iowen.cn/favicon/tradingview.com.png"},{name:"市场情绪分析",desc:"分析新闻、社交媒体等数据，评估市场情绪",url:"https://www.sentimentinvestor.com",icon:"https://api.iowen.cn/favicon/sentimentinvestor.com.png"},{name:"投资组合优化",desc:"根据风险偏好和目标收益优化投资组合",url:"https://www.portfoliooptimizer.io",icon:"https://api.iowen.cn/favicon/portfoliooptimizer.io.png"},{name:"股票预测模型",desc:"使用机器学习算法预测股票未来价格",url:"https://www.stockprediction.ai",icon:"https://api.iowen.cn/favicon/stockprediction.ai.png"}]},{category:"AI 对话",icon:"💬",tools:[{name:"Jasper Chat",desc:"Jasper针对内容创作者出品的AI聊天工具",url:"https://www.jasper.ai",icon:"https://api.iowen.cn/favicon/jasper.ai.png"},{name:"IngestAI",desc:"一种帮助人们将他们的知识库转化为聊天机器人的工具",url:"https://ingestai.io",icon:"https://api.iowen.cn/favicon/ingestai.io.png"},{name:"Andi",desc:"人工智能搜索——Andi机器人",url:"https://andi.com",icon:"https://api.iowen.cn/favicon/andi.com.png"},{name:"AI对话【问答宝】",desc:"【问答宝】ChatGPT，目前这个工具很受欢迎",url:"https://www.askbob.ai",icon:"https://api.iowen.cn/favicon/askbob.ai.png"},{name:"ChatGPT",desc:"open AI",url:"https://chat.openai.com",icon:"https://api.iowen.cn/favicon/openai.com.png"},{name:"文心一言",desc:"文心一言",url:"https://yiyan.baidu.com",icon:"https://api.iowen.cn/favicon/baidu.com.png"},{name:"CatGPT",desc:"完全免费",url:"https://catgpt.app",icon:"https://api.iowen.cn/favicon/catgpt.app.png"},{name:"趣学ChatGPT",desc:"免费链，国内可用",url:"https://chatgpt.kuxueai.com",icon:"https://api.iowen.cn/favicon/kuxueai.com.png"},{name:"ChatGPT3.5",desc:"chat3.5，免费链，国内可用",url:"https://chatgpt35.com",icon:"https://api.iowen.cn/favicon/chatgpt35.com.png"}]},{category:"AI 写作",icon:"✍️",tools:[{name:"AI帮个忙",desc:"多功能AI小帮手",url:"https://aibang.ai",icon:"https://api.iowen.cn/favicon/aibang.ai.png"},{name:"Glasp",desc:"高亮网页，全文摘要，内容概要",url:"https://glasp.co",icon:"https://api.iowen.cn/favicon/glasp.co.png"},{name:"Fireflies",desc:"为会议生成成绩单和智能摘要",url:"https://fireflies.ai",icon:"https://api.iowen.cn/favicon/fireflies.ai.png"},{name:"Yaara",desc:"几分钟内创建高质量、引人入胜的内容",url:"https://yaara.ai",icon:"https://api.iowen.cn/favicon/yaara.ai.png"},{name:"Hoppy Copy",desc:"编写长篇内容，将混乱的笔记转换成清晰的文章",url:"https://hoppycopy.co",icon:"https://api.iowen.cn/favicon/hoppycopy.co.png"}]},{category:"AI 编程",icon:"💻",tools:[{name:"GitHub Copilot",desc:"AI 编程助手",url:"https://github.com/features/copilot",icon:"https://api.iowen.cn/favicon/github.com.png"},{name:"Cursor",desc:"基于 AI 的代码编辑器",url:"https://cursor.sh",icon:"https://api.iowen.cn/favicon/cursor.sh.png"}]},{category:"影音编辑",icon:"🎬",tools:[{name:"Easy-Peasy",desc:"包含AI生成文案、图片、智能对话等多种功能",url:"https://easy-peasy.ai",icon:"https://api.iowen.cn/favicon/easy-peasy.ai.png"},{name:"Papercup",desc:"下一代人工智能配音服务，使视频内容更具吸引力",url:"https://papercup.com",icon:"https://api.iowen.cn/favicon/papercup.com.png"},{name:"Mubert",desc:"面向内容创作者、品牌和开发者的AI音乐生成平台",url:"https://mubert.com",icon:"https://api.iowen.cn/favicon/mubert.com.png"},{name:"Murf",desc:"20种语言的AI语音生成器，120多个语音选项",url:"https://murf.ai",icon:"https://api.iowen.cn/favicon/murf.ai.png"}]}];let m=null;const it={name:"VideoCutter",data(){return{videoSrc:"",videoFile:null,fileName:"video.mp4",startTime:0,endTime:0,duration:0,currentTime:0,isProcessing:!1,progress:0,loadingStatus:"idle"}},computed:{loadingStatusText(){return{"loading-engine":this.isZh?"正在加载引擎...":"Loading Engine...",uploading:this.isZh?"正在读取文件...":"Reading File...",processing:this.isZh?"正在处理...":"Processing...",saving:this.isZh?"正在保存...":"Saving..."}[this.loadingStatus]||""},isZh(){return this.$i18n.locale==="zh"},cutDuration(){return Math.max(0,this.endTime-this.startTime)},supportsWasm(){return typeof WebAssembly<"u"},ffmpegCommand(){const i=`cut_${this.fileName}`;return`ffmpeg -i "${this.fileName}" -ss ${this.startTime.toFixed(2)} -t ${this.cutDuration.toFixed(2)} -c copy "${i}"`}},methods:{handleFileChange(i){const e=i.target.files[0];e&&(this.videoFile=e,this.fileName=e.name,this.videoSrc=URL.createObjectURL(e))},onVideoLoaded(){const i=this.$refs.videoPlayer;this.duration=i.duration,this.endTime=i.duration},onTimeUpdate(){this.currentTime=this.$refs.videoPlayer.currentTime},updatePreview(i){const e=this.$refs.videoPlayer;i==="start"?e.currentTime=this.startTime:e.currentTime=this.endTime},setCurrentTime(i){i==="start"?this.startTime=Number(this.currentTime.toFixed(2)):this.endTime=Number(this.currentTime.toFixed(2))},async loadFFmpeg(){if(!(m&&m.isLoaded())){console.log("[FFmpeg v0.11] Initializing single-threaded engine..."),this.loadingStatus="loading-engine",m=C.createFFmpeg({corePath:"/ffmpeg-core-st.js",log:!0,progress:({ratio:i})=>{this.progress=Math.round(i*100)}});try{console.log("[FFmpeg v0.11] Calling ffmpeg.load()..."),await m.load(),console.log("[FFmpeg v0.11] Engine loaded successfully!")}catch(i){console.error("[FFmpeg v0.11] Load failed:",i);const e=(this.isZh?"加载 FFmpeg 引擎失败：":"Failed to load FFmpeg: ")+i.message;throw new Error(e)}}},async cutAndDownload(){if(this.videoFile)try{this.isProcessing=!0,this.progress=0,await this.loadFFmpeg(),console.log("Starting cut process..."),this.loadingStatus="uploading";const i="input_"+this.fileName.replace(/[^a-zA-Z0-9.]/g,"_"),e=`output_${Date.now()}.mp4`;console.log(`Writing ${this.fileName} to virtual FS...`),m.FS("writeFile",i,await C.fetchFile(this.videoFile)),console.log("File written"),this.loadingStatus="processing";const t=["-ss",this.startTime.toFixed(2),"-i",i,"-t",this.cutDuration.toFixed(2),"-c","copy",e];console.log(`Executing: ffmpeg ${t.join(" ")}`);try{await m.run(...t),console.log("FFmpeg run completed")}catch(u){throw console.error("FFmpeg run error:",u),new Error(this.isZh?"FFmpeg 执行失败，请检查视频格式。":"FFmpeg execution failed. Check video format.")}this.loadingStatus="saving",console.log(`Reading output: ${e}`);let s;try{s=m.FS("readFile",e)}catch(u){throw console.error("Read error:",u),new Error(this.isZh?"读取输出文件失败。":"Failed to read output file.")}const a=new Blob([s.buffer],{type:"video/mp4"}),n=URL.createObjectURL(a),o=document.createElement("a");o.href=n,o.download=`cut_${this.fileName}`,o.click(),URL.revokeObjectURL(n);try{m.FS("unlink",i),m.FS("unlink",e)}catch(u){console.warn("Cleanup error:",u)}this.isProcessing=!1,this.loadingStatus="idle",alert(this.isZh?"剪切成功！":"Video cut successfully!")}catch(i){console.error("Processing error:",i),alert((this.isZh?"处理出错：":"Error: ")+i.message),this.isProcessing=!1,this.loadingStatus="idle"}},reset(){this.videoSrc="",this.videoFile=null,this.startTime=0,this.endTime=0,this.duration=0},copyCommand(){navigator.clipboard.writeText(this.ffmpegCommand).then(()=>{alert(this.isZh?"命令已复制":"Command copied")})}}};var st=function(){var e=this,t=e._self._c;return t("div",{staticClass:"video-cutter-tool"},[t("div",{staticClass:"tool-header"},[t("h3",[e._v(e._s(e.isZh?"视频剪切工具":"Video Cutter"))]),t("p",[e._v(e._s(e.isZh?"通过可视化界面轻松剪切视频并生成 FFmpeg 命令。":"Easily cut videos and generate FFmpeg commands with a visual interface."))])]),e.supportsWasm?e._e():t("div",{staticClass:"warning-banner"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[t("path",{attrs:{fill:"currentColor",d:"M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"}})]),t("span",[e._v(e._s(e.isZh?"您的浏览器尚未启用共享内存支持。请确保已重启开发服务器（npm run dev），并使用最新版 Chrome/Edge 访问。":"SharedArrayBuffer is not enabled. Please restart dev server (npm run dev) and use latest Chrome/Edge."))])]),t("div",{staticClass:"tool-container"},[e.videoSrc?t("div",{staticClass:"editor-layout"},[t("div",{staticClass:"preview-section"},[t("video",{ref:"videoPlayer",attrs:{src:e.videoSrc,controls:""},on:{loadedmetadata:e.onVideoLoaded,timeupdate:e.onTimeUpdate}}),t("div",{staticClass:"range-controls"},[t("div",{staticClass:"range-inputs"},[t("div",{staticClass:"input-group"},[t("label",[e._v(e._s(e.isZh?"开始时间 (秒)":"Start Time (s)"))]),t("input",{directives:[{name:"model",rawName:"v-model.number",value:e.startTime,expression:"startTime",modifiers:{number:!0}}],attrs:{type:"number",min:"0",max:e.endTime,step:"0.1"},domProps:{value:e.startTime},on:{input:[function(s){s.target.composing||(e.startTime=e._n(s.target.value))},function(s){return e.updatePreview("start")}],blur:function(s){return e.$forceUpdate()}}})]),t("div",{staticClass:"input-group"},[t("label",[e._v(e._s(e.isZh?"结束时间 (秒)":"End Time (s)"))]),t("input",{directives:[{name:"model",rawName:"v-model.number",value:e.endTime,expression:"endTime",modifiers:{number:!0}}],attrs:{type:"number",min:e.startTime,max:e.duration,step:"0.1"},domProps:{value:e.endTime},on:{input:[function(s){s.target.composing||(e.endTime=e._n(s.target.value))},function(s){return e.updatePreview("end")}],blur:function(s){return e.$forceUpdate()}}})]),t("div",{staticClass:"input-group duration-info"},[t("label",[e._v(e._s(e.isZh?"持续时间":"Duration"))]),t("div",{staticClass:"value"},[e._v(e._s(e.cutDuration.toFixed(2))+"s")])])]),t("div",{staticClass:"quick-actions"},[t("button",{staticClass:"btn-outline",on:{click:function(s){return e.setCurrentTime("start")}}},[e._v(e._s(e.isZh?"设为开始点":"Set as Start"))]),t("button",{staticClass:"btn-outline",on:{click:function(s){return e.setCurrentTime("end")}}},[e._v(e._s(e.isZh?"设为结束点":"Set as End"))]),t("button",{staticClass:"btn-primary",attrs:{disabled:e.isProcessing||!e.supportsWasm||!e.videoFile},on:{click:e.cutAndDownload}},[e.isProcessing?t("span",[e.loadingStatus==="processing"?[e._v(e._s(e.isZh?"处理中 "+e.progress+"%":"Processing "+e.progress+"%"))]:[e._v(e._s(e.loadingStatusText))]],2):t("span",[e._v(e._s(e.isZh?"开始剪切并下载":"Start Cut & Download"))])]),t("button",{staticClass:"btn-danger",attrs:{disabled:e.isProcessing},on:{click:e.reset}},[e._v(e._s(e.isZh?"清除视频":"Clear Video"))])])])]),t("div",{staticClass:"command-section"},[t("h4",[e._v(e._s(e.isZh?"生成的 FFmpeg 命令":"Generated FFmpeg Command"))]),t("div",{staticClass:"command-box"},[t("code",[e._v(e._s(e.ffmpegCommand))]),t("button",{staticClass:"btn-copy",on:{click:e.copyCommand}},[e._v(" "+e._s(e.isZh?"复制命令":"Copy Command")+" ")])]),t("div",{staticClass:"tips"},[t("p",[t("strong",[e._v(e._s(e.isZh?"提示：":"Tip:"))])]),t("ul",[t("li",[e._v(e._s(e.isZh?"点击“开始剪切并下载”将直接在浏览器中处理，无需上传服务器。":'Clicking "Start Cut & Download" will process directly in your browser.'))]),t("li",[e._v(e._s(e.isZh?"首次使用会加载约 30MB 的处理引擎，请耐心等待。":"The processing engine (~30MB) will be loaded on first use."))]),t("li",[e._v(e._s(e.isZh?"处理大视频可能需要较多内存和 CPU。":"Processing large videos may require significant memory and CPU."))])])])])]):t("div",{staticClass:"upload-zone",on:{click:function(s){return e.$refs.fileInput.click()}}},[t("div",{staticClass:"upload-icon"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"48",height:"48"}},[t("path",{attrs:{fill:"currentColor",d:"M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"}})])]),t("p",[e._v(e._s(e.isZh?"点击或拖拽视频文件到此处进行预览":"Click or drag video file here to preview"))]),t("input",{ref:"fileInput",attrs:{type:"file",accept:"video/*",hidden:""},on:{change:e.handleFileChange}})])])])},at=[],nt=d(it,st,at,!1,null,"2e00e448",null,null);const ot=nt.exports;const rt={name:"ToolStation",components:{VideoCutter:ot},data(){return{currentTs:Math.floor(Date.now()/1e3),timer:null,inputTs:"",inputDate:"",convertResult:"",aiToolsGroups:W,activeCategory:W[0].category}},computed:{isZh(){return this.$i18n.locale==="zh"},currentGroup(){return this.aiToolsGroups.find(i=>i.category===this.activeCategory)},description(){return this.isZh?"快速在 Unix 时间戳和人类可读时间之间进行准确转换。":"Quickly convert between Unix timestamps and human-readable time."}},mounted(){this.startTimer()},beforeDestroy(){this.stopTimer()},methods:{startTimer(){this.timer=setInterval(()=>{this.currentTs=Math.floor(Date.now()/1e3)},1e3)},stopTimer(){this.timer&&(clearInterval(this.timer),this.timer=null)},toggleTimer(){this.timer?this.stopTimer():this.startTimer()},copy(i){navigator.clipboard.writeText(String(i)).then(()=>{const e=document.createElement("div");e.className="toast-msg",e.textContent=this.isZh?"✓ 已复制":"✓ Copied",document.body.appendChild(e),setTimeout(()=>e.remove(),2e3)})},toTime(){if(!this.inputTs)return;let i=parseInt(this.inputTs);this.inputTs.length===10&&(i*=1e3);const e=new Date(i);this.convertResult=e.toLocaleString()},toTs(){if(!this.inputDate)return;const i=new Date(this.inputDate);if(isNaN(i.getTime())){this.convertResult=this.isZh?"无效的日期格式":"Invalid date format";return}this.convertResult=Math.floor(i.getTime()/1e3).toString()},handleImgError(i){i.target.src="/favicon-default.png"}}};var lt=function(){var e=this,t=e._self._c;return t("div",{staticClass:"tool-station-page"},[t("div",{staticClass:"container"},[t("div",{staticClass:"page-hero"},[t("div",{staticClass:"hero-icon"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"28",height:"28",fill:"none",stroke:"currentColor","stroke-width":"1.8"}},[t("path",{attrs:{"stroke-linecap":"round","stroke-linejoin":"round",d:"M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"}})])]),t("div",[t("h1",{staticClass:"hero-title"},[e._v(e._s(e.isZh?"工具站":"Tool Station"))]),t("p",{staticClass:"hero-sub"},[e._v(e._s(e.isZh?"开发者效率工具集合":"Developer Productivity Toolkit"))])])]),t("section",{staticClass:"tool-section"},[t("div",{staticClass:"section-header"},[t("div",{staticClass:"section-title-group"},[t("div",{staticClass:"section-icon"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor","stroke-width":"2"}},[t("circle",{attrs:{cx:"12",cy:"12",r:"9"}}),t("path",{attrs:{"stroke-linecap":"round","stroke-linejoin":"round",d:"M12 7v5l3 3"}})])]),t("h2",[e._v(e._s(e.isZh?"时间戳转换工具":"Timestamp Converter"))])]),t("p",{staticClass:"section-desc"},[e._v(e._s(e.description))])]),t("div",{staticClass:"converter-body"},[t("div",{staticClass:"live-ts-bar"},[t("div",{staticClass:"live-badge"},[t("span",{staticClass:"live-dot"}),e._v(" "+e._s((e.isZh,"LIVE"))+" ")]),t("div",{staticClass:"live-ts-value"},[e._v(e._s(e.currentTs))]),t("div",{staticClass:"live-actions"},[t("button",{staticClass:"btn-icon",attrs:{title:e.timer?e.isZh?"暂停":"Pause":e.isZh?"继续":"Resume"},on:{click:e.toggleTimer}},[e.timer?t("svg",{attrs:{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor"}},[t("path",{attrs:{d:"M6 19h4V5H6v14zm8-14v14h4V5h-4z"}})]):t("svg",{attrs:{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor"}},[t("path",{attrs:{d:"M8 5v14l11-7z"}})])]),t("button",{staticClass:"btn-copy",on:{click:function(s){return e.copy(e.currentTs)}}},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor","stroke-width":"2"}},[t("rect",{attrs:{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}}),t("path",{attrs:{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"}})]),e._v(" "+e._s(e.isZh?"复制":"Copy")+" ")])])]),t("div",{staticClass:"converter-grid"},[t("div",{staticClass:"input-group"},[t("label",{staticClass:"input-label"},[t("span",{staticClass:"label-tag"},[e._v("Unix")]),e._v(" "+e._s(e.isZh?"时间戳 (s 或 ms)":"Timestamp (s or ms)")+" ")]),t("div",{staticClass:"input-row"},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.inputTs,expression:"inputTs"}],staticClass:"code-input",attrs:{type:"text",placeholder:"1712110000"},domProps:{value:e.inputTs},on:{input:function(s){s.target.composing||(e.inputTs=s.target.value)}}}),t("button",{staticClass:"btn-primary",on:{click:e.toTime}},[e._v(" "+e._s(e.isZh?"→ 日期":"→ Date")+" ")])])]),t("div",{staticClass:"input-group"},[t("label",{staticClass:"input-label"},[t("span",{staticClass:"label-tag"},[e._v("ISO")]),e._v(" "+e._s(e.isZh?"日期时间":"Datetime")+" ")]),t("div",{staticClass:"input-row"},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.inputDate,expression:"inputDate"}],staticClass:"code-input",attrs:{type:"text",placeholder:"2024-04-03 10:00:00"},domProps:{value:e.inputDate},on:{input:function(s){s.target.composing||(e.inputDate=s.target.value)}}}),t("button",{staticClass:"btn-primary",on:{click:e.toTs}},[e._v(" "+e._s(e.isZh?"→ 戳":"→ Ts")+" ")])])])]),t("transition",{attrs:{name:"slide-fade"}},[e.convertResult?t("div",{staticClass:"result-box"},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor","stroke-width":"2"}},[t("path",{attrs:{"stroke-linecap":"round","stroke-linejoin":"round",d:"m4.5 12.75 6 6 9-13.5"}})]),t("span",{staticClass:"result-label"},[e._v(e._s(e.isZh?"结果":"Result"))]),t("span",{staticClass:"result-value"},[e._v(e._s(e.convertResult))]),t("button",{staticClass:"btn-copy-sm",on:{click:function(s){return e.copy(e.convertResult)}}},[t("svg",{attrs:{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor","stroke-width":"2"}},[t("rect",{attrs:{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}}),t("path",{attrs:{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"}})])])]):e._e()])],1)]),t("section",{staticClass:"tool-section video-cutter-section"},[t("VideoCutter")],1)])])},ct=[],dt=d(rt,lt,ct,!1,null,"03c96818",null,null);const ut=dt.exports;y.use(F);const pt=[{path:"/",name:"Home",component:Ue},{path:"/tools",name:"ToolStation",component:ut},{path:"/detail/:slug",name:"ContentDetail",component:tt,props:!0},{path:"/privacy-policy",name:"PrivacyPolicy",component:()=>X(()=>import("./PrivacyPolicy-cc702f0e.js"),["assets/PrivacyPolicy-cc702f0e.js","assets/vue-vendor-b0d8f4d9.js","assets/markdown-98eb5fe8.js","assets/highlight-2a9f9d24.js","assets/ffmpeg-3bd2b020.js","assets/highlight-a597b77c.css","assets/PrivacyPolicy-2e535899.css"])}],mt=new F({mode:"history",base:"/",routes:pt,scrollBehavior(){return{x:0,y:0}}}),ht={nav:{home:"首页",content:"内容",about:"关于",tools:"在线工具站"},header:{login:"登录",register:"注册"},search:{tagLabel:"标签搜索",tagPlaceholder:"请选择标签",collectionLabel:"合集筛选",collectionPlaceholder:"请选择合集",typeLabel:"内容类型",typePlaceholder:"请选择内容类型",keywordLabel:"关键词搜索",keywordPlaceholder:"输入关键词搜索...",resultsCount:"搜索结果：共找到 {total} 个",clear:"清空重置",noResults:"未找到匹配的内容，请尝试更换关键词或清除筛选条件"},pagination:{info:"共 {total} 个，当前第 {current} 页，共 {pages} 页",prev:"上一页",next:"下一页"},footer:{subscribe:"邮件订阅",subscribeDesc:"加入邮件列表，获取最新内容更新和资讯",emailPlaceholder:"请输入您的邮箱地址...",subscribeBtn:"订阅",navTitle:"网站导航",aboutTitle:"关于我们",ecoTitle:"生态",socialTitle:"社交媒体",home:"首页",contentList:"内容列表",userCenter:"用户中心",favorites:"收藏夹",company:"公司介绍",contact:"联系我们",join:"加入我们",privacy:"隐私政策",tools:"在线工具站",blog:"数维探索IT 博客",wiki:"Wiki",tracker:"CSDN 博客"}},gt={nav:{home:"Home",content:"Content",about:"About",tools:"Online Tools"},header:{login:"Log In",register:"Sign Up"},search:{tagLabel:"Tags",tagPlaceholder:"Select Tags",collectionLabel:"Collections",collectionPlaceholder:"Select Collection",typeLabel:"Content Type",typePlaceholder:"Select Type",keywordLabel:"Keywords",keywordPlaceholder:"Search keywords...",resultsCount:"Results: {total} found",clear:"Clear All",noResults:"No content matched your filters. Please try changing keywords or clearing filters."},pagination:{info:"Total {total}, Page {current} of {pages}",prev:"Previous",next:"Next"},footer:{subscribe:"Subscribe",subscribeDesc:"Join our mailing list for the latest updates",emailPlaceholder:"Enter your email address...",subscribeBtn:"Subscribe",navTitle:"Navigation",aboutTitle:"About Us",ecoTitle:"Ecosystem",socialTitle:"Social Media",home:"Home",contentList:"Content List",userCenter:"User Center",favorites:"Favorites",company:"Company Profile",contact:"Contact Us",join:"Join Us",privacy:"Privacy Policy",tools:"Online Tools",blog:"数维探索IT Blog",wiki:"Wiki",tracker:"CSDN Blog"}};y.use(E);const U={zh:ht,en:gt},$=localStorage.getItem("language")||"zh",V=Object.keys(U).includes($)?$:"zh";document.documentElement.lang=V==="zh"?"zh-CN":"en-US";const vt=new E({locale:V,fallbackLocale:"zh",messages:U});new y({router:mt,i18n:vt,render:i=>i(q)}).$mount("#app");export{d as n};
