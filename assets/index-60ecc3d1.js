import{V as f,a as N,b as V}from"./vue-vendor-b0d8f4d9.js";import{M as tt}from"./markdown-98eb5fe8.js";import{H as A}from"./highlight-2a9f9d24.js";import{s as I}from"./ffmpeg-3bd2b020.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();function p(s,t,e,a,r,o,l,d){var c=typeof s=="function"?s.options:s;t&&(c.render=t,c.staticRenderFns=e,c._compiled=!0),a&&(c.functional=!0),o&&(c._scopeId="data-v-"+o);var n;if(l?(n=function(u){u=u||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!u&&typeof __VUE_SSR_CONTEXT__<"u"&&(u=__VUE_SSR_CONTEXT__),r&&r.call(this,u),u&&u._registeredComponents&&u._registeredComponents.add(l)},c._ssrRegister=n):r&&(n=d?function(){r.call(this,(c.functional?this.parent:this).$root.$options.shadowRoot)}:r),n)if(c.functional){c._injectStyles=n;var g=c.render;c.render=function(Y,q){return n.call(q),g(Y,q)}}else{var m=c.beforeCreate;c.beforeCreate=m?[].concat(m,n):[n]}return{exports:s,options:c}}const et={name:"App"};var st=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[e("transition",{attrs:{name:"page",mode:"out-in"}},[e("router-view")],1)],1)},at=[],rt=p(et,st,at,!1,null,null,null,null);const ot=rt.exports,lt="modulepreload",nt=function(s){return"/"+s},S={},T=function(t,e,a){if(!e||e.length===0)return t();const r=document.getElementsByTagName("link");return Promise.all(e.map(o=>{if(o=nt(o),o in S)return;S[o]=!0;const l=o.endsWith(".css"),d=l?'[rel="stylesheet"]':"";if(!!a)for(let g=r.length-1;g>=0;g--){const m=r[g];if(m.href===o&&(!l||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${o}"]${d}`))return;const n=document.createElement("link");if(n.rel=l?"stylesheet":lt,l||(n.as="script",n.crossOrigin=""),n.href=o,document.head.appendChild(n),l)return new Promise((g,m)=>{n.addEventListener("load",g),n.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${o}`)))})})).then(()=>t()).catch(o=>{const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o})};const it={name:"SiteHeader",directives:{"click-outside":{bind(s,t,e){s.clickOutsideEvent=function(a){s===a.target||s.contains(a.target)||e.context[t.expression](a)},document.body.addEventListener("click",s.clickOutsideEvent)},unbind(s){document.body.removeEventListener("click",s.clickOutsideEvent)}}},data(){return{langOpen:!1,themeOpen:!1,menuOpen:!1,currentTheme:"light"}},computed:{currentLangLabel(){return this.$i18n.locale==="en"?"EN":"CN"},currentLang(){return this.$i18n.locale}},created(){const s=localStorage.getItem("theme")||"light";this.setTheme(s)},methods:{toggleLang(){this.langOpen=!this.langOpen,this.themeOpen=!1},toggleTheme(){this.themeOpen=!this.themeOpen,this.langOpen=!1},toggleMenu(){this.menuOpen=!this.menuOpen,this.menuOpen&&(this.langOpen=!1,this.themeOpen=!1)},closeLang(){this.langOpen=!1},closeTheme(){this.themeOpen=!1},closeMenu(){this.menuOpen=!1},setLang(s){this.$i18n.locale=s,localStorage.setItem("language",s),document.documentElement.lang=s==="zh"?"zh-CN":"en-US",this.langOpen=!1},setTheme(s){this.currentTheme=s,this.themeOpen=!1,localStorage.setItem("theme",s);let t=s;s==="auto"&&(t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),document.documentElement.setAttribute("data-theme",t)}}};var ct=function(){var t=this,e=t._self._c;return e("header",{staticClass:"site-header"},[e("div",{staticClass:"container header-content"},[e("div",{staticClass:"logo-section"},[e("router-link",{staticClass:"logo-link",attrs:{to:"/books"},nativeOn:{click:function(a){return t.closeMenu.apply(null,arguments)}}},[e("div",{staticClass:"logo-icon"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"24",height:"24"}},[e("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"}})])]),e("span",{staticClass:"logo-text"},[t._v("数维探索")])])],1),e("button",{staticClass:"mobile-menu-btn",class:{active:t.menuOpen},on:{click:t.toggleMenu}},[e("span"),e("span"),e("span")]),e("nav",{staticClass:"main-nav",class:{"mobile-open":t.menuOpen}},[e("ul",[e("li",{on:{click:t.closeMenu}},[e("router-link",{attrs:{to:"/books","exact-active-class":"active"}},[t._v(t._s(t.$t("nav.books")))])],1),e("li",{on:{click:t.closeMenu}},[e("router-link",{attrs:{to:"/tools","active-class":"active"}},[t._v(t._s(t.$t("nav.tools")))])],1),e("li",{on:{click:t.closeMenu}},[e("router-link",{attrs:{to:"/about","active-class":"active"}},[t._v(t._s(t.$t("nav.about")))])],1)])]),e("div",{staticClass:"header-actions"},[e("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:t.closeLang,expression:"closeLang"}],staticClass:"dropdown-wrapper"},[e("div",{staticClass:"action-item lang-selector",on:{click:t.toggleLang}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08-2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.28 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"}})]),e("span",{staticClass:"action-label"},[t._v(t._s(t.currentLangLabel))]),e("svg",{class:{rotate:t.langOpen},attrs:{viewBox:"0 0 24 24",width:"12",height:"12"}},[e("path",{attrs:{fill:"currentColor",d:"M7 10l5 5 5-5z"}})])]),t.langOpen?e("div",{staticClass:"dropdown-menu"},[e("div",{staticClass:"dropdown-item",class:{active:t.currentLang==="zh"},on:{click:function(a){return t.setLang("zh")}}},[t._v("简体中文")]),e("div",{staticClass:"dropdown-item",class:{active:t.currentLang==="en"},on:{click:function(a){return t.setLang("en")}}},[t._v("English")])]):t._e()]),e("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:t.closeTheme,expression:"closeTheme"}],staticClass:"dropdown-wrapper"},[e("div",{staticClass:"action-item theme-toggle",on:{click:t.toggleTheme}},[t.currentTheme==="light"?e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"}})]):t.currentTheme==="dark"?e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"}})]):e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.13-14.71a.5.5 0 0 0-.58.12l-3 4a.5.5 0 0 0 .4.8h1.55l-2.07 4.14a.5.5 0 0 0 .45.72h2l-2.22 4.44a.5.5 0 0 0 .89.44l7-14a.5.5 0 0 0-.42-.66z"}})]),e("svg",{class:{rotate:t.themeOpen},attrs:{viewBox:"0 0 24 24",width:"12",height:"12"}},[e("path",{attrs:{fill:"currentColor",d:"M7 10l5 5 5-5z"}})])]),t.themeOpen?e("div",{staticClass:"dropdown-menu"},[e("div",{staticClass:"dropdown-item",class:{active:t.currentTheme==="light"},on:{click:function(a){return t.setTheme("light")}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"}})]),e("span",[t._v(t._s(t.$t("theme.light")||"浅色"))])]),e("div",{staticClass:"dropdown-item",class:{active:t.currentTheme==="dark"},on:{click:function(a){return t.setTheme("dark")}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"}})]),e("span",[t._v(t._s(t.$t("theme.dark")||"深色"))])]),e("div",{staticClass:"dropdown-item",class:{active:t.currentTheme==="auto"},on:{click:function(a){return t.setTheme("auto")}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"}})]),e("span",[t._v(t._s(t.$t("theme.auto")||"自动"))])])]):t._e()]),e("div",{staticClass:"auth-buttons"})])])])},pt=[],dt=p(it,ct,pt,!1,null,"3993ac11",null,null);const C=dt.exports;const ut={name:"DropdownFilter",props:{placeholder:{type:String,default:"请选择"},options:{type:Array,required:!0},value:{type:Array,default:()=>[]},searchable:{type:Boolean,default:!0},showChips:{type:Boolean,default:!1}},data(){return{isOpen:!1,searchQuery:"",internalValue:[...this.value]}},watch:{value(s){this.internalValue=[...s]}},computed:{filteredOptions(){if(!this.searchQuery)return this.options;const s=this.searchQuery.toLowerCase();return this.options.filter(t=>t.toLowerCase().includes(s))}},methods:{toggle(){this.isOpen=!this.isOpen},close(){this.isOpen=!1},updateValue(){this.$emit("input",this.internalValue)},remove(s){const t=this.internalValue.indexOf(s);t>-1&&(this.internalValue.splice(t,1),this.updateValue())}},directives:{"click-outside":{bind(s,t,e){s.clickOutsideEvent=function(a){s===a.target||s.contains(a.target)||e.context[t.expression](a)},document.body.addEventListener("click",s.clickOutsideEvent)},unbind(s){document.body.removeEventListener("click",s.clickOutsideEvent)}}}};var ht=function(){var t=this,e=t._self._c;return e("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:t.close,expression:"close"}],staticClass:"dropdown-filter"},[e("div",{staticClass:"dropdown-trigger",class:{"is-open":t.isOpen},on:{click:t.toggle}},[e("div",{staticClass:"selected-area"},[t.value.length>0?[t.showChips?e("div",{staticClass:"chips"},t._l(t.value,function(a){return e("span",{key:a,staticClass:"chip"},[t._v(" "+t._s(a)+" "),e("i",{staticClass:"close-icon",on:{click:function(r){return r.stopPropagation(),t.remove(a)}}},[t._v("×")])])}),0):e("span",{staticClass:"text-truncate"},[t._v(t._s(t.value.join(", ")))])]:e("span",{staticClass:"placeholder"},[t._v(t._s(t.placeholder))])],2),e("div",{staticClass:"arrow-icon"},[e("svg",{style:{transform:t.isOpen?"rotate(180deg)":""},attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M7 10l5 5 5-5z"}})])])]),e("transition",{attrs:{name:"fade-slide"}},[t.isOpen?e("div",{staticClass:"dropdown-panel"},[t.searchable?e("div",{staticClass:"search-box"},[e("svg",{staticClass:"search-icon",attrs:{viewBox:"0 0 24 24",width:"16",height:"16"}},[e("path",{attrs:{fill:"currentColor",d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}})]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.searchQuery,expression:"searchQuery"}],staticClass:"search-input",attrs:{type:"text",placeholder:"搜索"+t.placeholder+"..."},domProps:{value:t.searchQuery},on:{input:function(a){a.target.composing||(t.searchQuery=a.target.value)}}}),t.searchQuery?e("i",{staticClass:"clear-icon",on:{click:function(a){t.searchQuery=""}}},[t._v("×")]):t._e()]):t._e(),e("div",{staticClass:"options-list"},[t._l(t.filteredOptions,function(a){return e("label",{key:a,staticClass:"option-item"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.internalValue,expression:"internalValue"}],attrs:{type:"checkbox"},domProps:{value:a,checked:Array.isArray(t.internalValue)?t._i(t.internalValue,a)>-1:t.internalValue},on:{change:[function(r){var o=t.internalValue,l=r.target,d=!!l.checked;if(Array.isArray(o)){var c=a,n=t._i(o,c);l.checked?n<0&&(t.internalValue=o.concat([c])):n>-1&&(t.internalValue=o.slice(0,n).concat(o.slice(n+1)))}else t.internalValue=d},t.updateValue]}}),e("span",{staticClass:"checkbox-custom"}),e("span",{staticClass:"option-label"},[t._v(t._s(a))])])}),t.filteredOptions.length===0?e("div",{staticClass:"no-options"},[t._v("无匹配结果")]):t._e()],2)]):t._e()])],1)},gt=[],mt=p(ut,ht,gt,!1,null,"23fe5532",null,null);const H=mt.exports,v="/assets/thumb-1-02307e90.png",j="/assets/thumb-2-9a0be4a2.png",P="/assets/thumb-3-49794369.png",L="/assets/thumb-4-8c527afd.png",bt="/assets/leaf-main-a05e1022.png",wt="/assets/jsonview-thumb-e1134dfc.png",vt="/assets/cors-thumb-5c824e56.png",M="/assets/mapbox-3d-thumb-ee13df80.png",W="/assets/antigravity-thumb-5b6695cb.png",F="/assets/antigravity-thumb-5b6695cb.png",E="/assets/wireshark-windows-xp-guide-thumb-df60f83d.png",$="/assets/google-antigravity-2026-guide-thumb-67aaf437.png",kt="/assets/cors-thumb-5c824e56.png",yt="/assets/karpathy-ai-coding-rules-thumb-80c1775d.png",xt="/assets/knowledge-vs-workflows-thumb-261093f9.png",ft="/assets/ai-knowledge-advanced-thumb-a03c63c4.png",Ct="/assets/global-skill-configuration-thumb-13abf383.png",D="/assets/google-antigravity-download-thumb-572060f3.png",z="/assets/antigravity-rules-troubleshooting-thumb-784ad0c4.png",i=`

---
专注于分享经过验证的开发技巧与实用资源，致力于为你节省检索信息的时间，以及AI工具经验分享获取更多干货。关注微信公众号：数维探索`,b=[{id:1,slug:"antigravity-unban-guide",title:"Google Antigravity 账号解封指南, 官方解封教程来了(附唯一申诉入口)",image:F,date:"2026-04-07",author:"数维探索",views:"2,500",category:"视频",duration:"05:30",excerpt:"近期, 不少开发者反映其用于体验 Google 全新 AI IDE Antigravity(或 Gemini CLI)的账号遭到了封禁. 如果你也遇到了同样的问题, 不必惊慌. 本期视频将为你提供一份详尽的官方解封教程, 帮助你抓住这唯一一次的解封机会.",tags:[{name:"账号解封",type:"blue"},{name:"Antigravity",type:"blue"},{name:"AI工具",type:"green"}],collection:"AI百科",relatedIds:[13,2,7],recommendationIds:[2,7,6,8],gallery:[F],markdownContent:`
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
`+i},{id:2,slug:"antigravity-2026-ban-analysis",title:"Google AI IDE Antigravity 2026大规模封号事件深度解析: 原因与应对策略",image:W,date:"2026-04-07",author:"数维探索",views:"1,000",category:"视频",duration:"08:00",excerpt:"2026年2月12日, 科技圈迎来一次震动, 许多开发者登录 Google 的前沿 AI IDE Antigravity时, 惊讶地发现自己的账号已被封禁. 这次事件波及范围广泛, 从普通用户到付费的Pro乃至Ultra用户都未能幸免...",tags:[{name:"封号事件",type:"blue"},{name:"AI工具",type:"blue"},{name:"Antigravity",type:"green"}],collection:"AI百科",relatedIds:[1,7,4],recommendationIds:[7,4,8,9],gallery:[W],markdownContent:`
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
`+i},{id:4,slug:"cli-proxy-settings-ai-beginners",title:"AI新手必备: 命令行代理设置终极教程(临时与永久)",image:P,date:"2026-04-07",author:"数维探索",views:"2,100",category:"教程",duration:"10:30",excerpt:"在探索AI的世界时，网络限制常是第一道坎。本指南手把手教你如何为命令行设置临时与永久代理，助你高效学习。",tags:[{name:"AI学习",type:"blue"},{name:"命令行",type:"blue"},{name:"代理设置",type:"green"}],collection:"数维探索工具箱",relatedIds:[13,5,6],recommendationIds:[5,6,9,10],gallery:[P],markdownContent:`
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
`+i},{id:5,slug:"ai-engineer-rules-and-workflows",title:"AI 工程师全局规则与项目规范",image:v,date:"2026-04-07",author:"数维探索",views:"3,200",category:"教程",duration:"15:00",excerpt:"最新发布的 AI 全局开发准则与项目级工作流，涵盖 HTML 与 VUE 工程师的角色职责与标准化技术栈规范。",tags:[{name:"AI工具",type:"blue"},{name:"工作流",type:"blue"},{name:"开发规范",type:"green"}],collection:"数维探索工具箱",relatedIds:[13,6,10],recommendationIds:[6,7,9,10],gallery:[v],markdownContent:`
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
`+i},{id:6,slug:"gemini-3-1-pro-hongkong",title:"重磅消息：Google Gemini 3.1 Pro 正式登陆香港, AI 新时代开启!",image:L,date:"2026-04-07",author:"数维探索",views:"2,800",category:"新闻",duration:"05:45",excerpt:"近日, Google 旗下最先进的大语言模型之一 Gemini 3.1 Pro, 现已通过其 Web 应用正式向香港地区用户开放。",tags:[{name:"Gemini",type:"blue"},{name:"Gemini 3.1 Pro",type:"blue"},{name:"香港",type:"green"}],collection:"AI百科",relatedIds:[1,7,8],recommendationIds:[1,2,9,10],gallery:[L],markdownContent:`
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
`+i},{id:7,slug:"llm-open-source-panic",title:"AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?",image:j,date:"2026-04-07",author:"数维探索",views:"1,500",category:"新闻",duration:"06:30",excerpt:"近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本文将带你深入探究这一话题的来龙去脉。",tags:[{name:"AI趋势",type:"blue"},{name:"LLM",type:"blue"},{name:"开源",type:"green"}],collection:"AI百科",relatedIds:[8,12,14],recommendationIds:[12,14,15,2],gallery:[j],markdownContent:`
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
`+i},{id:8,slug:"claude-opus-4-6-antigravity",title:"Claude Opus 4.6 登陆 Antigravity: 是完整升级还是“残血版”? Pro 用户上手初体验",image:v,date:"2026-04-07",author:"数维探索",views:"1,000",category:"评测",duration:"08:00",excerpt:"备受期待的 Claude Opus 4.6 模型终于在 Google 的 AI IDE 平台 Antigravity 上线! 本视频将为你详细解析更新内容及1M上下文测试。",tags:[{name:"Claude",type:"blue"},{name:"Opus 4.6",type:"blue"},{name:"Antigravity",type:"green"}],collection:"AI百科",relatedIds:[1,9,10],recommendationIds:[1,10,12,14],gallery:[v],markdownContent:`
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
`+i},{id:9,slug:"mapbox-3d-map",title:"Mapbox GL JS 初始化 3D 建筑与地形教程",image:M,date:"2026-04-03",author:"数维探索",views:"1,100",category:"教程",duration:"12:30",excerpt:"学习如何使用 Mapbox GL JS 快速初始化一个包含 3D 建筑挤压（Fill-Extrusion）和数字高程模型（DEM）地形的交互式 3D 地图。",tags:[{name:"Mapbox",type:"blue"},{name:"3D地图",type:"blue"},{name:"WebGIS",type:"green"}],collection:"地图",relatedIds:[10,11,12],recommendationIds:[10,11,12,1],gallery:[M],markdownContent:`
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
`+i},{id:10,slug:"chrome-cors-plugin",title:"Chrome & Firefox 跨域插件配置教程",image:vt,date:"2026-04-02",author:"数维探索",views:"1,800",category:"教程",duration:"08:15",excerpt:"本地开发遇到 Cross-Origin 跨域问题？通过 Chrome 和 Firefox 插件轻松开启 Access-Control-Allow-Origin，加速前后端调试。",tags:[{name:"Chrome",type:"blue"},{name:"插件",type:"blue"},{name:"跨域",type:"green"}],collection:"数维探索工具箱",relatedIds:[11,12,1],recommendationIds:[11,12,1,2],gallery:[],markdownContent:`
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
`+i},{id:11,slug:"chrome-jsonview-install",title:"Chrome 安装 JSONview 插件教程",image:wt,date:"2026-04-02",author:"数维探索",views:"1,500",category:"教程",duration:"05:00",excerpt:"Chrome 安装 JSONview 插件后，可以在浏览器中直接查看格式化后的 JSON 内容，是开发者必备的工具。",tags:[{name:"Chrome",type:"blue"},{name:"插件",type:"blue"},{name:"JSON",type:"green"}],collection:"数维探索工具箱",relatedIds:[10,12,1],recommendationIds:[10,12,1,2],gallery:["/11/1.png","/11/2.png","/11/3.png","/11/4.png"],markdownContent:`
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
`+i},{id:12,slug:"offline-leaflet-map",title:"Leaflet 离线地图下载与加载教程",image:bt,date:"2026-04-02",author:"数维探索",views:"1,200",category:"教程",duration:"10:00",excerpt:"本教程详细介绍了下载离线地图瓦片的两种方式（osm 和 MapTileDownloader），并提供了在 Leaflet 中加载离线地图的代码示例。",tags:[{name:"Leaflet",type:"blue"},{name:"地图",type:"blue"}],collection:"数维探索工具箱",relatedIds:[13,1,2],recommendationIds:[1,2,7,11],gallery:[],markdownContent:`


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
`+i},{id:13,slug:"wireshark-windows-xp-guide",title:"Wireshark在Windows XP系统上的安装与使用指南",image:E,date:"2026-04-15",author:"数维探索",views:"1,200",category:"教程",duration:"10:00",excerpt:"Wireshark在Windows XP系统上运行需要特定的旧版本。本教程为你整理了最稳定的版本下载、WinPcap驱动安装及抓包注意事项。",tags:[{name:"Wireshark",type:"blue"},{name:"Windows XP",type:"blue"},{name:"抓包",type:"green"}],collection:"数维探索工具箱",relatedIds:[1,2,4],recommendationIds:[1,2,6,7],gallery:[E],markdownContent:`
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
`+i},{id:14,slug:"google-antigravity-2026-guide",title:"Google Antigravity：2026 年 AI 编程终极指南",image:$,date:"2026-04-16",author:"数维探索",views:"1,200",category:"教程",duration:"12:00",excerpt:"Google 于 2025 年底发布的 Agent-First IDE，原生支持 Gemini 3 Pro 和 Claude Sonnet 4.5，开启 Vibe Coding 全栈自动化新纪元。",tags:[{name:"Antigravity",type:"blue"},{name:"AI工具",type:"blue"},{name:"开发指南",type:"green"}],collection:"AI百科",relatedIds:[1,2,9,13],recommendationIds:[2,7,9,13],gallery:[$],markdownContent:`
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
`+i},{id:15,slug:"web-worker-vs-service-worker",title:"Web Worker vs Service Worker：多线程与离线缓存深度对比（含PWA实战）",image:kt,date:"2026-04-21",author:"数维探索",views:"1,000",category:"教程",duration:"12:00",excerpt:"深入对比 Web Worker 与 Service Worker 的核心区别：前者专注 CPU 密集型后台计算，后者充当网络代理实现离线缓存与 PWA。本文含完整代码示例与 PWA 实战项目结构。",tags:[{name:"Web Worker",type:"blue"},{name:"Service Worker",type:"blue"},{name:"PWA",type:"green"}],collection:"数维探索工具箱",relatedIds:[4,9,10],recommendationIds:[4,9,10,12],gallery:["/15/1.png"],markdownContent:` **Web Worker** 和 **Service Worker** 都是浏览器提供的 JavaScript 多线程技术，但它们的用途和工作方式有显著区别。

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
`+i},{id:16,slug:"karpathy-ai-coding-rules",title:"GitHub 6万星！Karpathy 的 AI 编码铁律：如何让 AI 乖乖写代码（附 Antigravity Knowledge 配置教程）",image:yt,date:"2026-04-22",author:"数维探索",views:"8,623",category:"教程",duration:"08:00",excerpt:"GitHub 趋势榜第一、Star 破6万的 AI 编码规范项目——基于 Karpathy 经验的4条铁律，配合 Antigravity Knowledge 全局配置，让 AI 写出更可控的代码。",tags:[{name:"AI工具",type:"blue"},{name:"Antigravity",type:"blue"},{name:"CLAUDE.md",type:"green"}],collection:"AI百科",relatedIds:[1,2,5],recommendationIds:[1,5,14,2],gallery:[],markdownContent:`这是目前 GitHub 前端/AI 圈最火的方向。因为大家都在用 AI 写代码，发现 AI 容易"放飞自我"（写得太复杂、乱改代码），所以大神们总结了一套**"如何让 AI 乖乖写代码"**的知识库。

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
`+i},{id:17,slug:"knowledge-vs-workflows",title:"Antigravity 深度解析：Knowledge（知识库）vs Workflows（工作流）——AI 编程的内功与外功",image:xt,date:"2026-04-22",author:"数维探索",views:"3,450",category:"教程",duration:"06:00",excerpt:'Knowledge 是 AI 的"内功心法"（静态知识），Workflows 是"外功招式"（动态指令）。前者决定下限，后者决定上限。本文用厨师比喻带你彻底搞懂两者的区别与最佳实践。',tags:[{name:"Antigravity",type:"blue"},{name:"Knowledge",type:"blue"},{name:"Workflows",type:"green"}],collection:"AI百科",relatedIds:[16,5,14],recommendationIds:[16,5,14,1],gallery:[],markdownContent:`这两个概念虽然都是用来"调教"AI 的，但它们的作用机制完全不同。

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
`+i},{id:18,slug:"ai-knowledge-advanced-management",title:"AI 知识库实战：分类管理进阶与三大核心配置模板",image:ft,date:"2026-04-22",author:"数维探索",views:"5,102",category:"教程",duration:"07:00",excerpt:"将 AI 规则拆分为前端规范、接口文档和设计系统，附赠直接可用的高频 API 模板与 Tailwind UI/UX 原则，让 AI 秒变全能前端助手。",tags:[{name:"AI知识库",type:"blue"},{name:"前沿趋势",type:"green"}],collection:"AI百科",relatedIds:[17,16],recommendationIds:[17,16,5,14],gallery:[],markdownContent:`### 💡 进阶技巧：分类管理

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
`+i},{id:19,slug:"global-skill-configuration-uipro",title:"全局技能配置实战：如何在所有项目中通用 UI-UX Pro Max",image:Ct,date:"2026-04-22",author:"数维探索",views:"2,109",category:"教程",duration:"06:00",excerpt:"深入解析 Antigravity 技能架构的“全局库+项目引用”模式，两步实现在任意项目中全局调用 UI-UX Pro Max 技能，彻底解放生产力。",tags:[{name:"AI工具",type:"blue"},{name:"开发指南",type:"green"}],collection:"AI百科",relatedIds:[18,17],recommendationIds:[18,17,16,5],gallery:[],markdownContent:`要在**所有项目**中都使用 \`UI-UX Pro Max Skill\`，你需要理解 Antigravity 的技能架构是**"全局库 + 项目级引用"**的模式。

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
`+i},{id:20,slug:"google-antigravity-download-v1-23-2",title:"Google Antigravity 最新稳定版 v1.23.2 全平台免费下载 (官方正版)",image:D,date:"2026-05-08",author:"数维探索",views:"1,200",category:"教程",duration:"06:00",excerpt:"Google Antigravity 是 2025 年推出的 AI 原生 IDE，内置 Gemini 3.1 Pro，支持多模型切换与智能体自主开发。本文提供 v1.23.2 最新稳定版的各平台下载地址及安装配置指南。",tags:[{name:"Antigravity",type:"blue"},{name:"AI工具",type:"green"},{name:"下载指南",type:"blue"}],collection:"AI百科",relatedIds:[1,2,8,19],recommendationIds:[1,8,13,19],gallery:[D],markdownContent:`
**一句话总结：Google Antigravity 是谷歌推出的「AI 智能体优先」IDE，最新稳定版 v1.23.2，Windows/macOS/Linux 全平台免费下载，内置 Gemini 3.1 Pro，支持 Claude、开源 GPT 等多模型，直接替代 VS Code + 各类 AI 插件。**

------

## 一、Antigravity 是什么？（快速看懂）

**Google Antigravity（反重力）** 是 Google 在 2025 年 11 月 18 日随 Gemini 3 发布会推出的 **AI 原生 IDE**，定位「Agent-first（智能体优先）开发平台」。

- 本质：**基于 VS Code 深度改造**的独立编辑器，不是插件。

- 核心：你只说目标，AI 智能体**自动拆任务、写代码、运行、测试、查资料、出报告**。

- 对比传统 AI 编码：

  - 旧模式：你写一行 → AI 补一行（被动辅助）。
  - Antigravity：你定目标 → AI 全程自主（主动执行）。

  

------

## 二、当前最新版本（2026-05-07）

- **最新稳定版：v1.23.2**（2026-04-16 发布）
- 预览版：持续更新，含最新模型支持与功能优化
- 授权：**完全免费**，个人 / 商业均可使用，Gemini 3.1 Pro 有 generous 免费额度

### 版本更新亮点（v1.23.x）

1. 内置 **Gemini 3.1 Pro / Flash**，编程与推理能力大幅提升。
2. 支持 **Claude Sonnet 4.6 / Opus 4.6、GPT-OSS-120B** 等多模型切换。
3. 增强智能体规划（Plan 模式），复杂项目拆解更合理。
4. 内置浏览器自动化测试，Web 项目可直接在 IDE 内调试验证。
5. 优化性能，启动更快、内存占用更低，支持大项目流畅编辑。
6. 新增 **Skills 系统**，支持全局 / 项目级自定义技能，扩展 AI 能力边界。
7. 底层架构升级为**多会话、多任务并行**，提升复杂任务处理效率。
8. 新增**隐私控制选项**，可关闭历史与知识记忆，满足企业级隐私需求。

------

## 三、下载地址（官方正版，直接复制打开）
### 1. 各平台直接链接（v1.23.2 稳定版）
#### Windows（64 位，Win10/11）
百度网盘下载链接：https://pan.baidu.com/s/1BJJdOpdgjxHlm6qTnavVSQ?pwd=qsfs 提取码: qsfs


#### macOS

- Apple Silicon（M1/M2/M3）：
百度网盘下载链接：https://pan.baidu.com/s/19vEsonfUrwR-CctuIgvxzw?pwd=vyfj 提取码: vyfj
- Intel：
百度网盘下载链接： https://pan.baidu.com/s/1zPrFBAJRzUHtgAHofUYBGA?pwd=ubdg 提取码: ubdg
#### Linux（Debian/Ubuntu）




\`\`\`bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://us-central1-apt.pkg.dev/doc/repo-signing-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/antigravity-repo-key.gpg
echo "deb [signed-by=/etc/apt/keyrings/antigravity-repo-key.gpg] https://us-central1-apt.pkg.dev/projects/antigravity-auto-updater-dev/ antigravity-debian main" | sudo tee /etc/apt/sources.list.d/antigravity.list > /dev/null
sudo apt update
sudo apt install antigravity
\`\`\`

------

## 四、安装步骤（3 步搞定，小白也会）

### Windows 安装

1. 下载 \`.exe\` 安装包，双击运行。
2. 同意协议 → 选择安装路径 → 点击「Install」。
3. 安装完成后启动，用**谷歌账号登录**即可使用。

### macOS 安装

1. 下载 \`.dmg\` 镜像，双击打开。
2. 将 Antigravity 图标拖入「Applications」文件夹。
3. 从应用程序启动，谷歌账号登录，完成配置。

### Linux 安装

1. 复制上方命令到终端，一键添加源并安装。
2. 终端输入 \`antigravity\` 启动，谷歌账号登录。

------

## 五、首次使用配置（必做，解锁全部功能）

### 1. 登录谷歌账号

启动后自动跳转登录，**必须用谷歌账号**，否则无法使用 Gemini 及多模型功能。

### 2. 选择默认 AI 模型（右上角切换）

- 推荐：**Gemini 3.1 Pro（High）** → 能力最强，适合复杂项目。
- 快速：**Gemini 3.1 Flash（Fast）** → 响应快，日常小任务首选。
- 其他：Claude Sonnet 4.6、GPT-OSS-120B（需对应账号 / 密钥）。

### 3. 中文化（可选）

1. 左侧扩展商店搜索「Chinese」。
2. 安装中文语言包 → 重启 IDE → 界面变为中文。

------

## 六、核心功能体验（为什么值得下载）

### 1. 智能体自主开发（最强卖点）

- 输入需求：「用 React + TypeScript 写一个待办 App，含增删改查，本地存储」。
- AI 自动：拆任务 → 建文件 → 写代码 → 运行测试 → 生成说明文档。

### 2. 多模型无缝切换

- 同一项目可随时换模型：复杂逻辑用 Gemini Pro，长文本用 Claude，开源需求用 GPT-OSS。

### 3. 内置浏览器调试

- Web 项目可直接在 IDE 内打开浏览器预览，AI 自动操作测试并反馈结果，无需切换工具。

### 4. 兼容 VS Code 插件

- 大部分 VS Code 插件可直接安装，生态无缝衔接，老用户零学习成本。

### 5. 自定义 Skills 扩展

- 全局技能路径：\`~/.gemini/antigravity/skills/\`
- 项目技能路径：\`.agent/skills/\`
- 可自定义工具调用、代码模板、自动化流程等，灵活适配开发场景。

------

## 七、常见问题（避坑指南）

### 1. 下载慢 / 失败

- 解决：换浏览器（Chrome 最佳）、关闭 VPN 重试、或用上方直接链接下载。

### 2. 登录失败 / 无法使用 AI

- 原因：网络限制或谷歌账号未开通 AI 权限。
- 解决：确保网络可正常访问谷歌服务，账号需开通 Gemini 权限（免费）。

### 3. 启动卡顿 / 内存占用高

- 解决：更新到 v1.23.2+、关闭不必要插件、增加内存（推荐 16GB+）。

### 4. 和 VS Code 冲突吗？

- 不冲突：独立软件，可同时安装，项目可互相打开，配置互不影响。

------

## 八、总结与下载入口

**Antigravity 是 2026 年最值得尝试的 AI 编程工具**：免费、全平台、内置最强模型、智能体自主开发，大幅提升编码效率，适合所有开发者（从新手到资深）。
`+i},{id:21,slug:"antigravity-v1-23-2-rules-troubleshooting",title:"Google Antigravity v1.23.2 项目规则不显示排查方案",image:z,date:"2026-05-08",author:"数维探索",views:"1,050",category:"教程",duration:"05:30",excerpt:"针对 Google Antigravity v1.23.2 版本中项目规则（Workspace Rules）无法加载或不显示的问题，提供了一套详尽的排查与修复方案，涵盖路径规范、UI 配置及已知 Bug 处理。",tags:[{name:"Antigravity",type:"blue"},{name:"故障排查",type:"green"},{name:"项目规则",type:"blue"}],collection:"AI百科",relatedIds:[1,5,20],recommendationIds:[5,18,19,20],gallery:[z],markdownContent:`
v1.23.2 「不出项目规则」，基本都是**路径不对、文件没识别、UI 没切到 Workspace、或版本本身的小 Bug**。下面按最常见原因给你一套直接能照做的排查方案（不用重装）。

------

## 一、先确认：v1.23.2 规则的正确位置（很多人放错）

v1.23.x 优先读取：

- 项目规则（只对当前项目生效）：

  \`\`\`plaintext
  项目根目录/.agent/rules/*.md
  项目根目录/GEMINI.md 或 AGENTS.md
  \`\`\`

- 全局规则（所有项目生效）：

  \`\`\`plaintext
  ~/.gemini/antigravity/rules/*.md
  ~/.gemini/GEMINI.md
  \`\`\`

⚠️ **必须是 \`.md\` 后缀（markdown component），普通 \`.md\` 有时不加载**。

------

## 二、UI 里看不到「Workspace 规则」？（最常见）

1. 右上角点 **…（更多）→ Customizations**
2. 切到 **Rules → 右侧选 Workspace**（不是 Global）
3. 看有没有你的规则；没有就点 **+ Workspace** 新建

如果切到 Workspace 是空的：

→ 说明 IDE **没识别当前文件夹为 Workspace**（你只是打开了文件，没打开文件夹）。

### 解决：必须「打开文件夹」

- 左上角：**File → Open Folder**，选你的\`项目根目录\`
- 打开后，左侧资源管理器顶部会显示文件夹名，此时 Workspace 规则才会出现

------

## 三、文件放对了但不生效？（v1.23.2 特有问题）

### 1. 文件名 / 格式问题（严格）

- ✅ 正确：\`.agent/rules/01-project-rules.md\`
- ❌ 错误：\`.agent/rules/rules.md\` / \`project-rules.txt\` / \`RULES.MD\`（大小写敏感）

### 2. 目录结构必须严格

\`\`\`plaintext
your-project/
├── .agent/
│   └── rules/
│       └── my-rules.md
└── GEMINI.md（可选）
\`\`\`

⚠️ **\`.agent\` 前面有个点**，Windows 要勾选「显示隐藏的文件」才能看到。

### 3. 编码必须是 UTF-8（无 BOM）

- 用 VS Code 打开 → 右下角选「UTF-8」→ 保存
- 有 BOM 或 GBK 会直接静默不加载

------

## 四、v1.23.2 已知 Bug：首次打开不加载旧规则

现象：从旧版升级到 1.23.2 后，原来的 Workspace 规则列表为空，但文件还在。

### 临时修复（不用删文件）

1. 关闭 Antigravity
2. 删掉项目里的缓存：
   \`\`\`plaintext
   your-project/.agent/cache/
   \`\`\`
3. 重新用「Open Folder」打开项目
4. 再进 Customizations → Rules → Workspace，一般就出来了

------

## 五、日志确认：到底有没有读到规则

1. 右上角 … → **Help → Show Logs**
2. 搜索关键词：
   - \`loading workspace rules\`：看是否扫描到 .agent/rules
   - \`skipped invalid rule file\`：说明文件格式 / 编码错了
   - \`no workspace rules found\`：路径或文件夹没打开对

------

## 六、最简测试（3 步验证规则是否工作）

1. 新建空文件夹 \`test-rules\`
2. 里面建：
   \`\`\`plaintext
   test-rules/.agent/rules/test.md
   \`\`\`
   内容写：
   \`\`\`md
   永远用中文回答，开头先写【规则生效】
   \`\`\`
3. Antigravity → Open Folder 选 \`test-rules\`
4. 发一句：\`你好\`
5. 预期回复：\`【规则生效】你好\`

如果这都不触发：就是版本对 Workspace 规则的识别有问题，可**临时降级到 1.23.1**（官网历史版有），等后续补丁。

------

## 七、一句话总结（你可以直接对照）

1. 必须 **Open Folder**，不是打开文件
2. 项目规则放 **/.agent/rules/*.md**（点开头、md 后缀）
3. 编码 **UTF-8 无 BOM**
4. 1.23.2 有缓存 Bug，删 \`.agent/cache\` 重开
`+i}].reverse(),_t=["AI百科","2.5G网络","2026","AI","AI IDE","AI Studio","AI工具","AI学习","AI新闻","AI编程","AI趋势","acme.sh","Antigravity","Claude","DeepSeek","Gemini","Mac OS","Python","账号解封","Wireshark","Windows XP","抓包","开发指南","Web Worker","Service Worker","PWA","CLAUDE.md","Knowledge","Workflows","AI知识库","前沿趋势","下载指南","故障排查","项目规则"],Ut=["AI百科","Docker百科","地图","数维探索工具箱","数维探索 行业研报"],qt=["视频","文章","教程","新闻","评测","展望"];const At={name:"FilterSection",components:{DropdownFilter:H},props:{totalResults:{type:Number,default:0}},data(){return{allTags:_t,allCollections:Ut,allTypes:qt,filters:{tags:[],collections:[],types:[],keyword:""}}},computed:{hasFilters(){return this.filters.tags.length>0||this.filters.collections.length>0||this.filters.types.length>0||this.filters.keyword!==""}},watch:{filters:{deep:!0,handler(s){this.$emit("filter-change",{...s})}}},methods:{handleSearch(){this.$emit("filter-change",{...this.filters})},clearFilters(){this.filters={tags:[],collections:[],types:[],keyword:""}}}};var It=function(){var t=this,e=t._self._c;return e("section",{staticClass:"filter-section"},[e("div",{staticClass:"container"},[e("div",{staticClass:"filter-card fade-in"},[e("div",{staticClass:"filter-grid"},[e("div",{staticClass:"filter-item"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("search.tagLabel")))]),e("DropdownFilter",{attrs:{placeholder:t.$t("search.tagPlaceholder"),options:t.allTags,showChips:!0},model:{value:t.filters.tags,callback:function(a){t.$set(t.filters,"tags",a)},expression:"filters.tags"}})],1),e("div",{staticClass:"filter-item"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("search.collectionLabel")))]),e("DropdownFilter",{attrs:{placeholder:t.$t("search.collectionPlaceholder"),options:t.allCollections},model:{value:t.filters.collections,callback:function(a){t.$set(t.filters,"collections",a)},expression:"filters.collections"}})],1),e("div",{staticClass:"filter-item"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("search.typeLabel")))]),e("DropdownFilter",{attrs:{placeholder:t.$t("search.typePlaceholder"),options:t.allTypes},model:{value:t.filters.types,callback:function(a){t.$set(t.filters,"types",a)},expression:"filters.types"}})],1),e("div",{staticClass:"filter-item search-box-wrapper"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("search.keywordLabel")))]),e("div",{staticClass:"search-box"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.filters.keyword,expression:"filters.keyword"}],staticClass:"search-input",attrs:{type:"text",placeholder:t.$t("search.keywordPlaceholder")},domProps:{value:t.filters.keyword},on:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.handleSearch.apply(null,arguments)},input:function(a){a.target.composing||t.$set(t.filters,"keyword",a.target.value)}}}),e("button",{staticClass:"search-btn",on:{click:t.handleSearch}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}})])])])])]),e("div",{staticClass:"results-bar"},[e("div",{staticClass:"results-count",domProps:{innerHTML:t._s(t.$t("search.resultsCount",{total:`<span class='highlight'>${t.totalResults}</span>`}))}}),t.hasFilters?e("button",{staticClass:"clear-btn",on:{click:t.clearFilters}},[t._v(t._s(t.$t("search.clear")))]):t._e()])])])])},St=[],Tt=p(At,It,St,!1,null,"3a2c80c9",null,null);const jt=Tt.exports;const Pt={name:"ContentCard",props:{item:{type:Object,required:!0}}};var Lt=function(){var t=this,e=t._self._c;return e("div",{staticClass:"content-card fade-in"},[e("div",{staticClass:"card-image"},[e("img",{attrs:{src:t.item.image,alt:t.item.title}}),e("div",{staticClass:"image-overlay"})]),e("div",{staticClass:"card-body"},[e("h3",{staticClass:"card-title"},[t._v(t._s(t.item.title))]),e("div",{staticClass:"card-meta"},[e("div",{staticClass:"meta-item"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"}})]),e("span",[t._v(t._s(t.item.date))])]),e("div",{staticClass:"meta-item"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}})]),e("span",[t._v(t._s(t.item.author))])])]),e("p",{staticClass:"card-excerpt"},[t._v(t._s(t.item.excerpt))]),e("div",{staticClass:"card-tags"},t._l(t.item.tags,function(a){return e("span",{key:a,staticClass:"tag",class:"tag-"+a.type},[t._v(t._s(a.name))])}),0)])])},Mt=[],Wt=p(Pt,Lt,Mt,!1,null,"3bba609e",null,null);const Z=Wt.exports;const Ft={name:"Pagination",props:{total:{type:Number,required:!0},current:{type:Number,required:!0},totalItems:{type:Number,required:!0},showInfo:{type:Boolean,default:!0}},computed:{displayedPages(){const s=[];for(let t=1;t<=this.total;t++)s.push(t);return s}},methods:{changePage(s){s>=1&&s<=this.total&&this.$emit("change",s)}}};var Et=function(){var t=this,e=t._self._c;return e("div",{staticClass:"pagination-container fade-in"},[e("div",{staticClass:"pagination"},[e("button",{staticClass:"page-btn prev",attrs:{disabled:t.current===1},on:{click:function(a){return t.changePage(t.current-1)}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}})])]),e("div",{staticClass:"page-numbers"},t._l(t.displayedPages,function(a){return e("button",{key:a,staticClass:"page-number",class:{active:a===t.current},on:{click:function(r){return t.changePage(a)}}},[t._v(" "+t._s(a)+" ")])}),0),e("button",{staticClass:"page-btn next",attrs:{disabled:t.current===t.total},on:{click:function(a){return t.changePage(t.current+1)}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}})])])]),t.showInfo?e("div",{staticClass:"pagination-info"},[t._v(" "+t._s(t.$t("pagination.info",{total:t.totalItems,current:t.current,pages:t.total}))+" ")]):t._e()])},$t=[],Dt=p(Ft,Et,$t,!1,null,"a23eac68",null,null);const K=Dt.exports;const zt={name:"SiteFooter",data(){return{showScrollTop:!1}},mounted(){window.addEventListener("scroll",this.handleScroll)},beforeDestroy(){window.removeEventListener("scroll",this.handleScroll)},methods:{handleScroll(){this.showScrollTop=window.pageYOffset>300},scrollToTop(){window.scrollTo({top:0,behavior:"smooth"})}}};var Ot=function(){var t=this,e=t._self._c;return e("footer",{staticClass:"site-footer"},[e("div",{staticClass:"footer-bottom"},[e("div",{staticClass:"container"},[e("p",[t._v("© 2026 内容创作展示网站 toolset.site 保留所有权利 | "),e("router-link",{attrs:{to:"/about"}},[t._v("关于我们")]),t._v(" | "),e("router-link",{attrs:{to:"/privacy-policy"}},[t._v("隐私政策")])],1)])]),e("div",{staticClass:"floating-actions",class:{show:t.showScrollTop}},[e("button",{staticClass:"float-btn to-top",attrs:{title:"回到顶部"},on:{click:t.scrollToTop}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"24",height:"24"}},[e("path",{attrs:{fill:"currentColor",d:"M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"}})])])])])},Bt=[],Gt=p(zt,Ot,Bt,!1,null,"5bb84cef",null,null);const _=Gt.exports;const Rt={name:"Home",components:{SiteHeader:C,FilterSection:jt,ContentCard:Z,Pagination:K,SiteFooter:_},data(){return{contentItems:b,filters:{tags:[],collections:[],types:[],keyword:""},currentPage:1,pageSize:8}},computed:{filteredItems(){return this.contentItems.filter(s=>{const t=!this.filters.keyword||s.title.toLowerCase().includes(this.filters.keyword.toLowerCase())||s.excerpt.toLowerCase().includes(this.filters.keyword.toLowerCase()),e=this.filters.tags.length===0||s.tags.some(o=>this.filters.tags.includes(o.name)),a=this.filters.collections.length===0||this.filters.collections.includes(s.collection),r=this.filters.types.length===0||this.filters.types.includes(s.category);return t&&e&&a&&r})},totalPages(){return Math.ceil(this.filteredItems.length/this.pageSize)||1},paginatedItems(){const s=(this.currentPage-1)*this.pageSize,t=s+this.pageSize;return this.filteredItems.slice(s,t)}},methods:{handleFilterChange(s){this.filters={...s},this.currentPage=1},handlePageChange(s){this.currentPage=s,window.scrollTo({top:0,behavior:"smooth"})},goToDetail(s){const t=this.contentItems.find(e=>e.id===s);t&&this.$router.push(`/detail/${t.slug}`)}}};var Nt=function(){var t=this,e=t._self._c;return e("div",{staticClass:"home-page"},[e("SiteHeader"),e("main",[e("FilterSection",{attrs:{totalResults:t.filteredItems.length},on:{"filter-change":t.handleFilterChange}}),e("section",{staticClass:"container py-40"},[t.paginatedItems.length>0?e("div",[e("div",{staticClass:"grid fade-in"},t._l(t.paginatedItems,function(a){return e("ContentCard",{key:a.id,attrs:{item:a},nativeOn:{click:function(r){return t.goToDetail(a.id)}}})}),1),e("Pagination",{attrs:{total:t.totalPages,current:t.currentPage,totalItems:t.filteredItems.length},on:{change:t.handlePageChange}})],1):e("div",{staticClass:"no-results fade-in"},[e("div",{staticClass:"no-results-content"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"64",height:"64"}},[e("path",{attrs:{fill:"currentColor",d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}})]),e("p",[t._v(t._s(t.$t("search.noResults")))])])])])],1),e("SiteFooter")],1)},Vt=[],Ht=p(Rt,Nt,Vt,!1,null,"c1f16c41",null,null);const Zt=Ht.exports;const Kt={name:"RelatedContent",props:{items:{type:Array,required:!0}},methods:{handleItemClick(s){this.$emit("select",s)}}};var Jt=function(){var t=this,e=t._self._c;return e("aside",{staticClass:"sidebar"},[e("div",{staticClass:"sidebar-header"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"var(--primary-color)",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4h2v4zm0-6h-2V7h2v4z"}})]),e("span",[t._v("关联内容")])]),e("div",{staticClass:"related-list"},t._l(t.items,function(a){return e("div",{key:a.id,staticClass:"related-item",on:{click:function(r){return t.handleItemClick(a.id)}}},[e("div",{staticClass:"related-thumb"},[e("img",{attrs:{src:a.image,alt:"Thumbnail"}})]),e("div",{staticClass:"related-info"},[e("h4",{staticClass:"related-title"},[t._v(t._s(a.title))]),e("div",{staticClass:"related-meta"},[e("span",[t._v("时长: "+t._s(a.duration))]),e("span",{staticClass:"author"},[t._v("| "+t._s(a.author))])]),e("div",{staticClass:"related-tags"},t._l(a.tags.slice(0,2),function(r){return e("span",{key:r.name,staticClass:"mini-tag"},[t._v(t._s(r.name))])}),0)])])}),0)])},Xt=[],Qt=p(Kt,Jt,Xt,!1,null,"e7c5a0d7",null,null);const Yt=Qt.exports;const J=new tt({html:!0,highlight:function(s,t){if(t&&A.getLanguage(t))try{return`<pre class="hljs"><code>${A.highlight(s,{language:t}).value}</code><button class="copy-btn" data-clipboard-text="${encodeURIComponent(s)}">Copy</button></pre>`}catch{}return`<pre class="hljs"><code>${J.utils.escapeHtml(s)}</code><button class="copy-btn" data-clipboard-text="${encodeURIComponent(s)}">Copy</button></pre>`}}),te={name:"MarkdownRenderer",props:{content:{type:String,default:""}},computed:{previewHtml(){return J.render(this.content)}},mounted(){this.$el.addEventListener("click",this.handleCopy),this.addLazyLoading()},beforeDestroy(){this.$el.removeEventListener("click",this.handleCopy)},watch:{content(){this.$nextTick(()=>{this.addLazyLoading()})}},methods:{handleCopy(s){if(s.target.classList.contains("copy-btn")){const t=decodeURIComponent(s.target.getAttribute("data-clipboard-text"));navigator.clipboard.writeText(t).then(()=>{const e=s.target.innerText;s.target.innerText="Copied!",setTimeout(()=>{s.target.innerText=e},2e3)})}},addLazyLoading(){this.$el.querySelectorAll("img").forEach(t=>{t.setAttribute("loading","lazy")})}}};var ee=function(){var t=this,e=t._self._c;return e("div",{staticClass:"markdown-body",domProps:{innerHTML:t._s(t.previewHtml)}})},se=[],ae=p(te,ee,se,!1,null,null,null,null);const re=ae.exports;const oe={name:"ContentDetail",components:{SiteHeader:C,SiteFooter:_,ContentCard:Z,RelatedContent:Yt,MarkdownRenderer:re},props:{slug:{type:String,required:!0}},data(){return{item:null,relatedItems:[],recommendationItems:[]}},watch:{slug:{handler:"loadItem",immediate:!0}},methods:{loadItem(){if(this.item=b.find(s=>s.slug===this.slug),this.item){this.relatedItems=b.filter(t=>this.item.relatedIds.includes(t.id));const s=this.item.recommendationIds;this.recommendationItems=b.filter(t=>s.includes(t.id)).slice(0,4)}},goToDetail(s){const t=b.find(e=>e.id===s);t&&t.slug!==this.slug&&this.$router.push(`/detail/${t.slug}`)}}};var le=function(){var t=this,e=t._self._c;return e("div",{staticClass:"content-detail-page"},[e("SiteHeader"),e("main",{staticClass:"container detail-container fade-in"},[t.item?e("div",{staticClass:"detail-layout"},[e("div",{staticClass:"main-content"},[e("div",{staticClass:"video-player"},[e("img",{attrs:{src:t.item.image,alt:"Thumbnail"}}),e("div",{staticClass:"player-overlay"},[e("div",{staticClass:"play-btn-large"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"48",height:"48"}},[e("path",{attrs:{fill:"white",d:"M8 5v14l11-7z"}})])])])]),e("div",{staticClass:"content-info"},[e("h1",{staticClass:"detail-title"},[t._v(t._s(t.item.title))]),e("div",{staticClass:"meta-data-section"},[e("div",{staticClass:"full-meta"},[e("div",{staticClass:"meta-row"},[e("span",{staticClass:"meta-label"},[t._v("发布时间:")]),e("span",{staticClass:"meta-value"},[t._v(t._s(t.item.date))]),e("span",{staticClass:"meta-label ml-20"},[t._v("作者:")]),e("span",{staticClass:"meta-value"},[t._v(t._s(t.item.author))])]),e("div",{staticClass:"meta-row"},[e("span",{staticClass:"meta-label"},[t._v("浏览数:")]),e("span",{staticClass:"meta-value"},[t._v(t._s(t.item.views)+" 次")]),e("span",{staticClass:"meta-label ml-20"},[t._v("分类:")]),e("span",{staticClass:"meta-value"},[t._v(t._s(t.item.category))])])]),e("div",{staticClass:"interaction-bar"},[e("div",{staticClass:"stats-group"},[e("button",{staticClass:"stat-btn"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"}})]),e("span",[t._v("0")])]),e("button",{staticClass:"stat-btn"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"}})]),e("span",[t._v("0")])]),e("button",{staticClass:"stat-btn"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18"}},[e("path",{attrs:{fill:"currentColor",d:"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"}})]),e("span",[t._v("0")])])])])]),e("div",{staticClass:"detail-tags"},t._l(t.item.tags,function(a){return e("span",{key:a.name,staticClass:"tag",class:"tag-"+a.type},[t._v(t._s(a.name))])}),0),e("section",{staticClass:"markdown-section"},[e("div",{staticClass:"section-header"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}})]),e("span",[t._v("支持内容")])]),e("div",{staticClass:"markdown-content-card"},[e("MarkdownRenderer",{attrs:{content:t.item.markdownContent}})],1)])])]),e("RelatedContent",{attrs:{items:t.relatedItems},on:{select:t.goToDetail}})],1):e("div",{staticClass:"not-found"},[t._v(" Loading... ")]),e("section",{staticClass:"recommendations"},[e("div",{staticClass:"section-header"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.13-14.71a.5.5 0 0 0-.58.12l-3 4a.5.5 0 0 0 .4.8h1.55l-2.07 4.14a.5.5 0 0 0 .45.72h2l-2.22 4.44a.5.5 0 0 0 .89.44l7-14a.5.5 0 0 0-.42-.66z"}})]),e("span",[t._v("相关推荐")])]),e("div",{staticClass:"grid"},t._l(t.recommendationItems,function(a){return e("ContentCard",{key:a.id,attrs:{item:a},nativeOn:{click:function(r){return t.goToDetail(a.id)}}})}),1)])]),e("SiteFooter")],1)},ne=[],ie=p(oe,le,ne,!1,null,"f37a6643",null,null);const ce=ie.exports,O=[{category:"AI 热门应用",icon:"🔥",tools:[{name:"股票趋势分析",desc:"基于历史数据和AI算法分析股票价格走势",url:"https://www.tradingview.com",icon:"https://api.iowen.cn/favicon/tradingview.com.png"},{name:"市场情绪分析",desc:"分析新闻、社交媒体等数据，评估市场情绪",url:"https://www.sentimentinvestor.com",icon:"https://api.iowen.cn/favicon/sentimentinvestor.com.png"},{name:"投资组合优化",desc:"根据风险偏好和目标收益优化投资组合",url:"https://www.portfoliooptimizer.io",icon:"https://api.iowen.cn/favicon/portfoliooptimizer.io.png"},{name:"股票预测模型",desc:"使用机器学习算法预测股票未来价格",url:"https://www.stockprediction.ai",icon:"https://api.iowen.cn/favicon/stockprediction.ai.png"}]},{category:"AI 对话",icon:"💬",tools:[{name:"Jasper Chat",desc:"Jasper针对内容创作者出品的AI聊天工具",url:"https://www.jasper.ai",icon:"https://api.iowen.cn/favicon/jasper.ai.png"},{name:"IngestAI",desc:"一种帮助人们将他们的知识库转化为聊天机器人的工具",url:"https://ingestai.io",icon:"https://api.iowen.cn/favicon/ingestai.io.png"},{name:"Andi",desc:"人工智能搜索——Andi机器人",url:"https://andi.com",icon:"https://api.iowen.cn/favicon/andi.com.png"},{name:"AI对话【问答宝】",desc:"【问答宝】ChatGPT，目前这个工具很受欢迎",url:"https://www.askbob.ai",icon:"https://api.iowen.cn/favicon/askbob.ai.png"},{name:"ChatGPT",desc:"open AI",url:"https://chat.openai.com",icon:"https://api.iowen.cn/favicon/openai.com.png"},{name:"文心一言",desc:"文心一言",url:"https://yiyan.baidu.com",icon:"https://api.iowen.cn/favicon/baidu.com.png"},{name:"CatGPT",desc:"完全免费",url:"https://catgpt.app",icon:"https://api.iowen.cn/favicon/catgpt.app.png"},{name:"趣学ChatGPT",desc:"免费链，国内可用",url:"https://chatgpt.kuxueai.com",icon:"https://api.iowen.cn/favicon/kuxueai.com.png"},{name:"ChatGPT3.5",desc:"chat3.5，免费链，国内可用",url:"https://chatgpt35.com",icon:"https://api.iowen.cn/favicon/chatgpt35.com.png"}]},{category:"AI 写作",icon:"✍️",tools:[{name:"AI帮个忙",desc:"多功能AI小帮手",url:"https://aibang.ai",icon:"https://api.iowen.cn/favicon/aibang.ai.png"},{name:"Glasp",desc:"高亮网页，全文摘要，内容概要",url:"https://glasp.co",icon:"https://api.iowen.cn/favicon/glasp.co.png"},{name:"Fireflies",desc:"为会议生成成绩单和智能摘要",url:"https://fireflies.ai",icon:"https://api.iowen.cn/favicon/fireflies.ai.png"},{name:"Yaara",desc:"几分钟内创建高质量、引人入胜的内容",url:"https://yaara.ai",icon:"https://api.iowen.cn/favicon/yaara.ai.png"},{name:"Hoppy Copy",desc:"编写长篇内容，将混乱的笔记转换成清晰的文章",url:"https://hoppycopy.co",icon:"https://api.iowen.cn/favicon/hoppycopy.co.png"}]},{category:"AI 编程",icon:"💻",tools:[{name:"GitHub Copilot",desc:"AI 编程助手",url:"https://github.com/features/copilot",icon:"https://api.iowen.cn/favicon/github.com.png"},{name:"Cursor",desc:"基于 AI 的代码编辑器",url:"https://cursor.sh",icon:"https://api.iowen.cn/favicon/cursor.sh.png"}]},{category:"影音编辑",icon:"🎬",tools:[{name:"Easy-Peasy",desc:"包含AI生成文案、图片、智能对话等多种功能",url:"https://easy-peasy.ai",icon:"https://api.iowen.cn/favicon/easy-peasy.ai.png"},{name:"Papercup",desc:"下一代人工智能配音服务，使视频内容更具吸引力",url:"https://papercup.com",icon:"https://api.iowen.cn/favicon/papercup.com.png"},{name:"Mubert",desc:"面向内容创作者、品牌和开发者的AI音乐生成平台",url:"https://mubert.com",icon:"https://api.iowen.cn/favicon/mubert.com.png"},{name:"Murf",desc:"20种语言的AI语音生成器，120多个语音选项",url:"https://murf.ai",icon:"https://api.iowen.cn/favicon/murf.ai.png"}]}];let h=null;const pe={name:"VideoCutter",data(){return{videoSrc:"",videoFile:null,fileName:"video.mp4",startTime:0,endTime:0,duration:0,currentTime:0,isProcessing:!1,progress:0,loadingStatus:"idle"}},computed:{loadingStatusText(){return{"loading-engine":this.isZh?"正在加载引擎...":"Loading Engine...",uploading:this.isZh?"正在读取文件...":"Reading File...",processing:this.isZh?"正在处理...":"Processing...",saving:this.isZh?"正在保存...":"Saving..."}[this.loadingStatus]||""},isZh(){return this.$i18n.locale==="zh"},cutDuration(){return Math.max(0,this.endTime-this.startTime)},supportsWasm(){return typeof WebAssembly<"u"},ffmpegCommand(){const s=`cut_${this.fileName}`;return`ffmpeg -i "${this.fileName}" -ss ${this.startTime.toFixed(2)} -t ${this.cutDuration.toFixed(2)} -c copy "${s}"`}},methods:{handleFileChange(s){const t=s.target.files[0];t&&(this.videoFile=t,this.fileName=t.name,this.videoSrc=URL.createObjectURL(t))},onVideoLoaded(){const s=this.$refs.videoPlayer;this.duration=s.duration,this.endTime=s.duration},onTimeUpdate(){this.currentTime=this.$refs.videoPlayer.currentTime},updatePreview(s){const t=this.$refs.videoPlayer;s==="start"?t.currentTime=this.startTime:t.currentTime=this.endTime},setCurrentTime(s){s==="start"?this.startTime=Number(this.currentTime.toFixed(2)):this.endTime=Number(this.currentTime.toFixed(2))},async loadFFmpeg(){if(!(h&&h.isLoaded())){console.log("[FFmpeg v0.11] Initializing single-threaded engine..."),this.loadingStatus="loading-engine",h=I.createFFmpeg({corePath:"/ffmpeg-core-st.js",log:!0,progress:({ratio:s})=>{this.progress=Math.round(s*100)}});try{console.log("[FFmpeg v0.11] Calling ffmpeg.load()..."),await h.load(),console.log("[FFmpeg v0.11] Engine loaded successfully!")}catch(s){console.error("[FFmpeg v0.11] Load failed:",s);const t=(this.isZh?"加载 FFmpeg 引擎失败：":"Failed to load FFmpeg: ")+s.message;throw new Error(t)}}},async cutAndDownload(){if(this.videoFile)try{this.isProcessing=!0,this.progress=0,await this.loadFFmpeg(),console.log("Starting cut process..."),this.loadingStatus="uploading";const s="input_"+this.fileName.replace(/[^a-zA-Z0-9.]/g,"_"),t=`output_${Date.now()}.mp4`;console.log(`Writing ${this.fileName} to virtual FS...`),h.FS("writeFile",s,await I.fetchFile(this.videoFile)),console.log("File written"),this.loadingStatus="processing";const e=["-ss",this.startTime.toFixed(2),"-i",s,"-t",this.cutDuration.toFixed(2),"-c","copy",t];console.log(`Executing: ffmpeg ${e.join(" ")}`);try{await h.run(...e),console.log("FFmpeg run completed")}catch(d){throw console.error("FFmpeg run error:",d),new Error(this.isZh?"FFmpeg 执行失败，请检查视频格式。":"FFmpeg execution failed. Check video format.")}this.loadingStatus="saving",console.log(`Reading output: ${t}`);let a;try{a=h.FS("readFile",t)}catch(d){throw console.error("Read error:",d),new Error(this.isZh?"读取输出文件失败。":"Failed to read output file.")}const r=new Blob([a.buffer],{type:"video/mp4"}),o=URL.createObjectURL(r),l=document.createElement("a");l.href=o,l.download=`cut_${this.fileName}`,l.click(),URL.revokeObjectURL(o);try{h.FS("unlink",s),h.FS("unlink",t)}catch(d){console.warn("Cleanup error:",d)}this.isProcessing=!1,this.loadingStatus="idle",alert(this.isZh?"剪切成功！":"Video cut successfully!")}catch(s){console.error("Processing error:",s),alert((this.isZh?"处理出错：":"Error: ")+s.message),this.isProcessing=!1,this.loadingStatus="idle"}},reset(){this.videoSrc="",this.videoFile=null,this.startTime=0,this.endTime=0,this.duration=0},copyCommand(){navigator.clipboard.writeText(this.ffmpegCommand).then(()=>{alert(this.isZh?"命令已复制":"Command copied")})}}};var de=function(){var t=this,e=t._self._c;return e("div",{staticClass:"video-cutter-tool"},[e("div",{staticClass:"tool-header"},[e("h3",[t._v(t._s(t.isZh?"视频剪切工具":"Video Cutter"))]),e("p",[t._v(t._s(t.isZh?"通过可视化界面轻松剪切视频并生成 FFmpeg 命令。":"Easily cut videos and generate FFmpeg commands with a visual interface."))])]),t.supportsWasm?t._e():e("div",{staticClass:"warning-banner"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"}})]),e("span",[t._v(t._s(t.isZh?"您的浏览器尚未启用共享内存支持。请确保已重启开发服务器（npm run dev），并使用最新版 Chrome/Edge 访问。":"SharedArrayBuffer is not enabled. Please restart dev server (npm run dev) and use latest Chrome/Edge."))])]),e("div",{staticClass:"tool-container"},[t.videoSrc?e("div",{staticClass:"editor-layout"},[e("div",{staticClass:"preview-section"},[e("video",{ref:"videoPlayer",attrs:{src:t.videoSrc,controls:""},on:{loadedmetadata:t.onVideoLoaded,timeupdate:t.onTimeUpdate}}),e("div",{staticClass:"range-controls"},[e("div",{staticClass:"range-inputs"},[e("div",{staticClass:"input-group"},[e("label",[t._v(t._s(t.isZh?"开始时间 (秒)":"Start Time (s)"))]),e("input",{directives:[{name:"model",rawName:"v-model.number",value:t.startTime,expression:"startTime",modifiers:{number:!0}}],attrs:{type:"number",min:"0",max:t.endTime,step:"0.1"},domProps:{value:t.startTime},on:{input:[function(a){a.target.composing||(t.startTime=t._n(a.target.value))},function(a){return t.updatePreview("start")}],blur:function(a){return t.$forceUpdate()}}})]),e("div",{staticClass:"input-group"},[e("label",[t._v(t._s(t.isZh?"结束时间 (秒)":"End Time (s)"))]),e("input",{directives:[{name:"model",rawName:"v-model.number",value:t.endTime,expression:"endTime",modifiers:{number:!0}}],attrs:{type:"number",min:t.startTime,max:t.duration,step:"0.1"},domProps:{value:t.endTime},on:{input:[function(a){a.target.composing||(t.endTime=t._n(a.target.value))},function(a){return t.updatePreview("end")}],blur:function(a){return t.$forceUpdate()}}})]),e("div",{staticClass:"input-group duration-info"},[e("label",[t._v(t._s(t.isZh?"持续时间":"Duration"))]),e("div",{staticClass:"value"},[t._v(t._s(t.cutDuration.toFixed(2))+"s")])])]),e("div",{staticClass:"quick-actions"},[e("button",{staticClass:"btn-outline",on:{click:function(a){return t.setCurrentTime("start")}}},[t._v(t._s(t.isZh?"设为开始点":"Set as Start"))]),e("button",{staticClass:"btn-outline",on:{click:function(a){return t.setCurrentTime("end")}}},[t._v(t._s(t.isZh?"设为结束点":"Set as End"))]),e("button",{staticClass:"btn-primary",attrs:{disabled:t.isProcessing||!t.supportsWasm||!t.videoFile},on:{click:t.cutAndDownload}},[t.isProcessing?e("span",[t.loadingStatus==="processing"?[t._v(t._s(t.isZh?"处理中 "+t.progress+"%":"Processing "+t.progress+"%"))]:[t._v(t._s(t.loadingStatusText))]],2):e("span",[t._v(t._s(t.isZh?"开始剪切并下载":"Start Cut & Download"))])]),e("button",{staticClass:"btn-danger",attrs:{disabled:t.isProcessing},on:{click:t.reset}},[t._v(t._s(t.isZh?"清除视频":"Clear Video"))])])])]),e("div",{staticClass:"command-section"},[e("h4",[t._v(t._s(t.isZh?"生成的 FFmpeg 命令":"Generated FFmpeg Command"))]),e("div",{staticClass:"command-box"},[e("code",[t._v(t._s(t.ffmpegCommand))]),e("button",{staticClass:"btn-copy",on:{click:t.copyCommand}},[t._v(" "+t._s(t.isZh?"复制命令":"Copy Command")+" ")])]),e("div",{staticClass:"tips"},[e("p",[e("strong",[t._v(t._s(t.isZh?"提示：":"Tip:"))])]),e("ul",[e("li",[t._v(t._s(t.isZh?"点击“开始剪切并下载”将直接在浏览器中处理，无需上传服务器。":'Clicking "Start Cut & Download" will process directly in your browser.'))]),e("li",[t._v(t._s(t.isZh?"首次使用会加载约 30MB 的处理引擎，请耐心等待。":"The processing engine (~30MB) will be loaded on first use."))]),e("li",[t._v(t._s(t.isZh?"处理大视频可能需要较多内存和 CPU。":"Processing large videos may require significant memory and CPU."))])])])])]):e("div",{staticClass:"upload-zone",on:{click:function(a){return t.$refs.fileInput.click()}}},[e("div",{staticClass:"upload-icon"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"48",height:"48"}},[e("path",{attrs:{fill:"currentColor",d:"M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"}})])]),e("p",[t._v(t._s(t.isZh?"点击或拖拽视频文件到此处进行预览":"Click or drag video file here to preview"))]),e("input",{ref:"fileInput",attrs:{type:"file",accept:"video/*",hidden:""},on:{change:t.handleFileChange}})])])])},ue=[],he=p(pe,de,ue,!1,null,"2e00e448",null,null);const ge=he.exports;const me={name:"ToolStation",components:{VideoCutter:ge},data(){return{currentTs:Math.floor(Date.now()/1e3),timer:null,inputTs:"",inputDate:"",convertResult:"",aiToolsGroups:O,activeCategory:O[0].category}},computed:{isZh(){return this.$i18n.locale==="zh"},currentGroup(){return this.aiToolsGroups.find(s=>s.category===this.activeCategory)},description(){return this.isZh?"快速在 Unix 时间戳和人类可读时间之间进行准确转换。":"Quickly convert between Unix timestamps and human-readable time."}},mounted(){this.startTimer()},beforeDestroy(){this.stopTimer()},methods:{startTimer(){this.timer=setInterval(()=>{this.currentTs=Math.floor(Date.now()/1e3)},1e3)},stopTimer(){this.timer&&(clearInterval(this.timer),this.timer=null)},toggleTimer(){this.timer?this.stopTimer():this.startTimer()},copy(s){navigator.clipboard.writeText(String(s)).then(()=>{const t=document.createElement("div");t.className="toast-msg",t.textContent=this.isZh?"✓ 已复制":"✓ Copied",document.body.appendChild(t),setTimeout(()=>t.remove(),2e3)})},toTime(){if(!this.inputTs)return;let s=parseInt(this.inputTs);this.inputTs.length===10&&(s*=1e3);const t=new Date(s);this.convertResult=t.toLocaleString()},toTs(){if(!this.inputDate)return;const s=new Date(this.inputDate);if(isNaN(s.getTime())){this.convertResult=this.isZh?"无效的日期格式":"Invalid date format";return}this.convertResult=Math.floor(s.getTime()/1e3).toString()},handleImgError(s){s.target.src="/favicon-default.png"}}};var be=function(){var t=this,e=t._self._c;return e("div",{staticClass:"tool-station-page"},[e("div",{staticClass:"container"},[e("div",{staticClass:"page-hero"},[e("div",{staticClass:"hero-icon"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"28",height:"28",fill:"none",stroke:"currentColor","stroke-width":"1.8"}},[e("path",{attrs:{"stroke-linecap":"round","stroke-linejoin":"round",d:"M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"}})])]),e("div",[e("h1",{staticClass:"hero-title"},[t._v(t._s(t.isZh?"工具站":"Tool Station"))]),e("p",{staticClass:"hero-sub"},[t._v(t._s(t.isZh?"开发者效率工具集合":"Developer Productivity Toolkit"))])])]),e("section",{staticClass:"tool-section"},[e("div",{staticClass:"section-header"},[e("div",{staticClass:"section-title-group"},[e("div",{staticClass:"section-icon"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor","stroke-width":"2"}},[e("circle",{attrs:{cx:"12",cy:"12",r:"9"}}),e("path",{attrs:{"stroke-linecap":"round","stroke-linejoin":"round",d:"M12 7v5l3 3"}})])]),e("h2",[t._v(t._s(t.isZh?"时间戳转换工具":"Timestamp Converter"))])]),e("p",{staticClass:"section-desc"},[t._v(t._s(t.description))])]),e("div",{staticClass:"converter-body"},[e("div",{staticClass:"live-ts-bar"},[e("div",{staticClass:"live-badge"},[e("span",{staticClass:"live-dot"}),t._v(" "+t._s((t.isZh,"LIVE"))+" ")]),e("div",{staticClass:"live-ts-value"},[t._v(t._s(t.currentTs))]),e("div",{staticClass:"live-actions"},[e("button",{staticClass:"btn-icon",attrs:{title:t.timer?t.isZh?"暂停":"Pause":t.isZh?"继续":"Resume"},on:{click:t.toggleTimer}},[t.timer?e("svg",{attrs:{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor"}},[e("path",{attrs:{d:"M6 19h4V5H6v14zm8-14v14h4V5h-4z"}})]):e("svg",{attrs:{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor"}},[e("path",{attrs:{d:"M8 5v14l11-7z"}})])]),e("button",{staticClass:"btn-copy",on:{click:function(a){return t.copy(t.currentTs)}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor","stroke-width":"2"}},[e("rect",{attrs:{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}}),e("path",{attrs:{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"}})]),t._v(" "+t._s(t.isZh?"复制":"Copy")+" ")])])]),e("div",{staticClass:"converter-grid"},[e("div",{staticClass:"input-group"},[e("label",{staticClass:"input-label"},[e("span",{staticClass:"label-tag"},[t._v("Unix")]),t._v(" "+t._s(t.isZh?"时间戳 (s 或 ms)":"Timestamp (s or ms)")+" ")]),e("div",{staticClass:"input-row"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.inputTs,expression:"inputTs"}],staticClass:"code-input",attrs:{type:"text",placeholder:"1712110000"},domProps:{value:t.inputTs},on:{input:function(a){a.target.composing||(t.inputTs=a.target.value)}}}),e("button",{staticClass:"btn-primary",on:{click:t.toTime}},[t._v(" "+t._s(t.isZh?"→ 日期":"→ Date")+" ")])])]),e("div",{staticClass:"input-group"},[e("label",{staticClass:"input-label"},[e("span",{staticClass:"label-tag"},[t._v("ISO")]),t._v(" "+t._s(t.isZh?"日期时间":"Datetime")+" ")]),e("div",{staticClass:"input-row"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.inputDate,expression:"inputDate"}],staticClass:"code-input",attrs:{type:"text",placeholder:"2024-04-03 10:00:00"},domProps:{value:t.inputDate},on:{input:function(a){a.target.composing||(t.inputDate=a.target.value)}}}),e("button",{staticClass:"btn-primary",on:{click:t.toTs}},[t._v(" "+t._s(t.isZh?"→ 戳":"→ Ts")+" ")])])])]),e("transition",{attrs:{name:"slide-fade"}},[t.convertResult?e("div",{staticClass:"result-box"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor","stroke-width":"2"}},[e("path",{attrs:{"stroke-linecap":"round","stroke-linejoin":"round",d:"m4.5 12.75 6 6 9-13.5"}})]),e("span",{staticClass:"result-label"},[t._v(t._s(t.isZh?"结果":"Result"))]),e("span",{staticClass:"result-value"},[t._v(t._s(t.convertResult))]),e("button",{staticClass:"btn-copy-sm",on:{click:function(a){return t.copy(t.convertResult)}}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor","stroke-width":"2"}},[e("rect",{attrs:{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}}),e("path",{attrs:{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"}})])])]):t._e()])],1)]),e("section",{staticClass:"tool-section video-cutter-section"},[e("VideoCutter")],1)])])},we=[],ve=p(me,be,we,!1,null,"03c96818",null,null);const ke=ve.exports,ye="/assets/book-154-d931e249.jpg",xe="/assets/book-1-9cec7e12.jpg",fe="/assets/book-2-db705184.jpg",Ce="/assets/book-3-98ff25ae.jpg",_e="/assets/book-4-e14fec56.jpg",Ue="/assets/book-5-c7feeaca.jpg",qe="/assets/book-6-2a1b145e.jpg",Ae="/assets/book-7-f1f63a41.jpg",Ie="/assets/book-8-d45c88d9.jpg",Se="/assets/book-9-3979f14d.jpg",Te="/assets/book-10-7b57edd2.jpg",je="/assets/book-11-e8ffdebe.jpg",Pe="/assets/book-12-550a27b3.jpg",Le="/assets/book-13-e6fe134b.jpg",Me="/assets/book-14-a3da225c.jpg",We="/assets/book-15-f05c1500.jpg",Fe="/assets/book-16-2fd02a2e.jpg",Ee="/assets/book-17-a2c45656.jpg",$e="/assets/book-18-0ed40963.jpg",De="/assets/book-19-f23c5c43.jpg",ze="/assets/book-20-cca40940.jpg",Oe="/assets/book-21-3cebef2e.jpg",Be="/assets/book-22-614365f8.jpg",Ge="/assets/book-23-83c9686d.jpg",Re="/assets/book-24-45cb3fa4.jpg",Ne="/assets/book-25-a1df08d5.jpg",Ve="/assets/book-26-25d42a98.jpg",He="/assets/book-27-068c84df.jpg",Ze="/assets/book-28-27affa5f.jpg",Ke="/assets/book-29-9a890070.jpg",Je="/assets/book-30-6446f4f7.jpg",Xe="/assets/book-31-9a0d3587.jpg",Qe="/assets/book-32-fe624da4.jpg",Ye="/assets/book-33-76e44512.jpg",ts="/assets/book-34-497bffa7.jpg",es="/assets/book-35-04073a16.jpg",ss="/assets/book-36-a915e63c.jpg",as="/assets/book-37-193bca25.jpg",rs="/assets/book-38-bab41f86.jpg",os="/assets/book-39-b7441fea.jpg",ls="/assets/book-40-8a4541ff.jpg",ns="/assets/book-41-b37be90d.jpg",is="/assets/book-42-4b1a7f63.jpg",cs="/assets/book-43-6a16d09c.jpg",ps="/assets/book-44-a37c9c2f.jpg",ds="/assets/book-45-d2b26293.jpg",us="/assets/book-46-2e27c388.jpg",hs="/assets/book-47-c37fdd68.jpg",gs="/assets/book-48-5467500c.jpg",ms="/assets/book-49-d09acf59.jpg",bs="/assets/book-50-ac3319df.jpg",ws="/assets/book-51-e3ff87d5.jpg",vs="/assets/book-52-edf2ced0.jpg",ks="/assets/book-53-e5c94566.jpg",ys="/assets/book-54-7d6016dc.jpg",xs="/assets/book-55-a8001d6d.jpg",fs="/assets/book-56-4eabab64.jpg",Cs="/assets/book-57-d00c8f6f.jpg",_s="/assets/book-58-348493a1.jpg",Us="/assets/book-59-1813f385.jpg",qs="/assets/book-60-769a1dec.jpg",As="/assets/book-61-c1b6b61a.jpg",Is="/assets/book-62-69461cec.jpg",Ss="/assets/book-63-23a1ce9f.jpg",Ts="/assets/book-64-c5696860.jpg",js="/assets/book-65-fce8d399.jpg",Ps="/assets/book-66-0320b240.jpg",Ls="/assets/book-67-50947f32.jpg",Ms="/assets/book-68-5eb79b54.jpg",Ws="/assets/book-69-2967a41b.jpg",Fs="/assets/book-70-abf1558a.jpg",Es="/assets/book-71-7bf5b3bf.jpg",$s="/assets/book-72-543e86c2.jpg",Ds="/assets/book-73-55bc3d35.jpg",zs="/assets/book-74-17cfe1d9.jpg",Os="/assets/book-75-f0fa4624.jpg",Bs="/assets/book-76-dd4a3546.jpg",Gs="/assets/book-77-9f810bf1.jpg",Rs="/assets/book-78-5258898c.jpg",Ns="/assets/book-79-fb3930dd.jpg",Vs="/assets/book-80-e3b41a45.jpg",Hs="/assets/book-81-4df4b61e.jpg",Zs="/assets/book-82-910a8862.jpg",Ks="/assets/book-83-26c022f0.jpg",Js="/assets/book-84-424075f9.jpg",Xs="/assets/book-85-ea49cc21.jpg",Qs="/assets/book-86-6754ef86.jpg",Ys="/assets/book-87-cac6d5a3.jpg",ta="/assets/book-88-52068976.jpg",ea="/assets/book-89-60b93083.jpg",sa="/assets/book-90-d995f684.jpg",aa="/assets/book-91-c270d1ed.jpg",ra="/assets/book-92-3017ee15.jpg",oa="/assets/book-93-57e7e929.jpg",la="/assets/book-94-54e8791f.jpg",na="/assets/book-95-beb78880.jpg",ia="/assets/book-96-46252a0b.jpg",ca="/assets/book-97-86485ffd.jpg",pa="/assets/book-98-0a5365df.jpg",da="/assets/book-99-b9bfe19c.jpg",ua="/assets/book-100-bb5f712d.jpg",ha="/assets/book-101-57093af9.jpg",ga="/assets/book-102-1f786787.jpg",ma="/assets/book-103-9320354d.jpg",ba="/assets/book-104-ebf84c24.jpg",wa="/assets/book-105-6ec049ea.jpg",va="/assets/book-106-88f1709b.jpg",ka="/assets/book-107-2e2ab0e2.jpg",ya="/assets/book-108-8b93502c.jpg",xa="/assets/book-109-eff72fcd.jpg",fa="/assets/book-110-465a84a1.jpg",Ca="/assets/book-111-855aa9f6.jpg",_a="/assets/book-112-e268f84a.jpg",Ua="/assets/book-113-5a44ae49.jpg",qa="/assets/book-114-5674ba71.jpg",Aa="/assets/book-115-e9370a5b.jpg",Ia="/assets/book-116-0ea8899e.jpg",Sa="/assets/book-117-240bb99c.jpg",Ta="/assets/book-118-bd5ef6e5.jpg",ja="/assets/book-119-9983a5df.jpg",Pa="/assets/book-120-c1b91e36.jpg",La="/assets/book-121-4d956a27.jpg",Ma="/assets/book-122-22e3ce2b.jpg",Wa="/assets/book-123-b25d3aa5.jpg",Fa="/assets/book-124-3ffa802e.jpg",Ea="/assets/book-125-60ad8798.jpg",$a="/assets/book-126-21d74def.jpg",Da="/assets/book-127-c2ea36fa.jpg",za="/assets/book-128-e1c51959.jpg",Oa="/assets/book-129-2b836941.jpg",Ba="/assets/book-130-6c05d51d.jpg",Ga="/assets/book-131-5991c678.jpg",Ra="/assets/book-132-1cb225d8.jpg",Na="/assets/book-133-1e3e6de1.jpg",Va="/assets/book-134-f43a5498.jpg",Ha="/assets/book-135-b85ad74d.jpg",Za="/assets/book-136-04b72fe3.jpg",Ka="/assets/book-137-26360feb.jpg",Ja="/assets/book-138-85350c13.jpg",Xa="/assets/book-139-9fbf01b4.jpg",Qa="/assets/book-140-7845e3f5.jpg",Ya="/assets/book-141-3198bbba.jpg",tr="/assets/book-142-e74cb680.jpg",er="/assets/book-143-0f8187fa.jpg",sr="/assets/book-144-d290542d.jpg",ar="/assets/book-146-fa641bde.jpg",rr="/assets/book-65-fce8d399.jpg",or="/assets/book-148-d731a3eb.jpg",lr="/assets/book-148-d731a3eb.jpg",nr="/assets/book-150-13ab2fdf.jpg",ir="/assets/book-151-f0708e12.jpg",cr="/assets/book-152-72d8c56a.jpg",pr="/assets/book-153-76abb097.jpg",dr="/assets/book-154-d931e249.jpg",ur="/assets/book-155-01ac0589.jpg",hr="/assets/book-156-a00eed2e.jpg",gr="/assets/book-157-cfe51dd4.jpg",mr="/assets/book-158-cbee9155.jpg",br="/assets/book-159-6d9fb8ec.jpg",wr="/assets/book-160-ba97df88.jpg",vr="/assets/book-161-a63109f1.jpg",kr="/assets/book-162-769362c2.jpg",yr="/assets/book-163-601aa415.jpg",xr="/assets/book-164-ec2a8bc8.jpg",fr="/assets/book-165-659c2cd4.jpg",Cr="/assets/book-166-ead44833.jpg",_r="/assets/book-167-4a352da2.jpg",Ur="/assets/book-168-9182b5c2.jpg",qr="/assets/book-169-68dc1a10.jpg",Ar="/assets/book-170-7ba6f6b2.jpg",Ir="/assets/book-171-5a02b172.jpg",Sr="/assets/book-172-30e0ea5b.jpg",Tr="/assets/book-173-9a319bad.jpg",jr="/assets/book-174-8bc52da0.jpg",Pr="/assets/book-175-efe58726.jpg",Lr="/assets/book-176-031be53b.jpg",Mr="/assets/book-177-29a835dc.jpg",Wr="/assets/book-178-d9269efa.jpg",Fr="/assets/book-179-93a035a7.jpg",Er="/assets/book-180-5b8b8cda.jpg",$r="/assets/book-181-deb1ee27.jpg",Dr="/assets/book-182-a8fc5a34.jpg",zr="/assets/book-183-a2261d7a.jpg",Or="/assets/book-184-f63b3c59.jpg",Br="/assets/book-185-8c129072.jpg",Gr="/assets/book-186-772e5bd6.jpg",Rr="/assets/book-187-21e31eac.jpg",Nr="/assets/book-188-4cd4ed3a.jpg",Vr="/assets/book-189-89e12e16.jpg",Hr="/assets/book-190-c8fcb062.jpg",Zr="/assets/book-191-ab779f6f.jpg",Kr="/assets/book-192-8b71f569.jpg",Jr="/assets/book-193-c610836c.jpg",Xr="/assets/book-189-89e12e16.jpg",Qr="/assets/book-195-803c659e.jpg",Yr="/assets/book-196-6a7246db.jpg",to="/assets/book-197-f6651580.jpg",eo="/assets/book-198-3930e985.jpg",so="/assets/book-199-a888176f.jpg",ao="/assets/book-200-d80ef557.jpg",ro="/assets/book-235-f678e4c7.jpg",oo="/assets/book-525-d2e8020b.jpg",lo=[{id:1,slug:"没钱修什么仙？",title:"没钱修什么仙？",cover:xe,author:"熊狼狗",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-987章",latestChapter:"第987章 终极倒翻昆仑，掌书人(感谢“吴师叔”成为盟主)",excerpt:"老者：“你想报仇？”少年：“我被强者反复侮辱，被师尊视为垃圾，我怎么可能不想报仇？”老者伸出手：“把你手机给我。”少年震惊：“前辈！这哪里来的百年功力？”老者微微一笑：“好孩子，这是你在天庭的备用功力，以后急用的时候随用随取。”张羽冷哼一声，关掉了上面的广告。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/a48c20f99f5e?pwd=S6yn",downloadUrl:"/books/1_没钱修什么仙？1-987章.txt",sourceUrl:"https://www.deqixs.org/1/txt.html#dir"},{id:2,slug:"夜无疆",title:"夜无疆",cover:fe,author:"辰东",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-810章",latestChapter:"第810章 一人伐一国【上】",excerpt:"那一天太阳落下再也没有升起。 永夜，天地漆黑，似不可测的深渊要吞噬一切。 白昼早已沦为过往，成为传说。 广袤的冻土，寒风凛冽，暴雪砸落，积在地面足有半人高了。 双树村，被大雪半淹没。 这里只有四五十户人家，像是被岁月遗忘的村庄，成片的房屋在黑夜中只能看到模糊的轮廓。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/6e763169763d?pwd=4RkQ",downloadUrl:"/books/2_夜无疆1-810章.txt",sourceUrl:"https://www.deqixs.org/2/txt.html#dir"},{id:3,slug:"苟在武道世界成圣",title:"苟在武道世界成圣",cover:Ce,author:"在水中的纸老虎",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-883章",latestChapter:"第883章 幽冥（求月票！）",excerpt:'命格在手，苟道求生！ 陈庆穿越了，却穿进一个武道为尊、人命贱如草的乱世。开局便是哑子湾的贫苦渔家子，父亲被抓徭役杳无音信，孤儿寡母被官府税赋与帮派"龙王香火"层层盘剥，挣扎在饿死的边缘。 天无绝人之路，他脑海中悬着一道【命格：天道酬勤，必有所成】！ 这意味着任何技艺，对他而言没有资质门槛，没有瓶颈阻隔，只要付出，必有回报！',tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/5adbef00e7e0?pwd=HFC9",downloadUrl:"/books/3_苟在武道世界成圣1-883章.txt",sourceUrl:"https://www.deqixs.org/3/txt.html#dir"},{id:4,slug:"都重生了谁考公务员啊",title:"都重生了谁考公务员啊",cover:_e,author:"柳岸花又明",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-887章",latestChapter:"第887章 、和宋时微的拥抱",excerpt:"省直公务员陈着意外重生自己高三的那一年。于是，一个木讷腼腆、只知道学习的高中生，突然变得通晓人情世故，说话做事恰到好处，不仅改变了人生轨迹，也越来越吸引女孩子的关注。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/262a363df9f9?pwd=kB89",downloadUrl:"/books/4_都重生了谁考公务员啊1-887章.txt",sourceUrl:"https://www.deqixs.org/4/txt.html#dir"},{id:5,slug:"嗣皇帝",title:"嗣皇帝",cover:Ue,author:"三山风",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-999章",latestChapter:"第999章 用魔法打败魔法 用人心打败人心",excerpt:"重生到九龙夺嫡的平行世界，沈叶却发现自己竟然成了被群起而攻之的太子。知道太子最大敌人不是那些兄弟，而是越来越猜疑的皇帝，沈叶在发现难以复制玄武门之变后，就决定躺平了！",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/c14ce74ee755?pwd=cVXr",downloadUrl:"/books/5_嗣皇帝1-999章.txt",sourceUrl:"https://www.deqixs.org/5/txt.html#dir"},{id:6,slug:"神明调查报告",title:"神明调查报告",cover:qe,author:"黑山老鬼",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-428章",latestChapter:"第428章 即将到来的战争(大结局)",excerpt:"一场来自过去的绑架，十三道屹立于古堡的魅影。循环逆转的人生，神明报复人类而掀起的灾殃！这世界理智很脆弱，人类需要哄着。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/a1a7b0da8267?pwd=yXjn",downloadUrl:"/books/6_神明调查报告1-428章.txt",sourceUrl:"https://www.deqixs.org/6/txt.html#dir"},{id:7,slug:"吞噬星空2起源大陆",title:"吞噬星空2起源大陆",cover:Ae,author:"我吃西红柿",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-452章",latestChapter:"第452章 永恒 （大结局）",excerpt:"罗峰带着界兽摩罗撒闯过轮回，来到了起源大陆……这是《吞噬星空》后续的第二部小说。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/3e7886d20e1a?pwd=KZfs",downloadUrl:"/books/7_吞噬星空2起源大陆1-452章.txt",sourceUrl:"https://www.deqixs.org/7/txt.html#dir"},{id:8,slug:"苟在初圣魔门当人材",title:"苟在初圣魔门当人材",cover:Ie,author:"鹤守月满池",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1444章",latestChapter:"第1444章 番外三 这家夫妻俩",excerpt:"吕阳穿越修仙界，却成了魔门初圣宗的弟子。幸得异宝【百世书】，死后可以重开一世，让一切从头再来，还能带回前世的宝物、修为、寿命，甚至觉醒特殊的天赋。眼见修仙界乱世将至，吕阳决定在魔门苟住，一世世苦修。百世之后，他已成为一代魔道巨擘，初圣宗里最畜生的那一个。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/017d0a23328d?pwd=t3Ja",downloadUrl:"/books/8_苟在初圣魔门当人材1-1444章.txt",sourceUrl:"https://www.deqixs.org/8/txt.html#dir"},{id:9,slug:"我在惊悚游戏里封神",title:"我在惊悚游戏里封神",cover:Se,author:"壶鱼辣椒",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-589章",latestChapter:"第589章 番外·尾声（317）",excerpt:"白柳在失业后被卷入一个无法停止的惊悚直播游戏中，游戏中充满了各种各样的怪物和蕴含杀意的玩家。后来，他们才明白，是这个游戏用胜利和桂冠在恭迎属于它的神明，对白柳说，欢迎回家。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/c2eecada675d?pwd=sKDi",downloadUrl:"/books/9_我在惊悚游戏里封神1-589章.txt",sourceUrl:"https://www.deqixs.org/9/txt.html#dir"},{id:10,slug:"从斩妖除魔开始长生不死",title:"从斩妖除魔开始长生不死",cover:Te,author:"陆月十九",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-838章",latestChapter:"第838章 终得平静（完）",excerpt:"消耗寿元灌注武学，可无限进行推演。沈仪凡人之躯，寿数不过百年，所幸可以通过斩杀妖魔获取对方剩余寿元。在邪祟遍地的乱世中亮出长刀，从【鹰爪功】到【八荒裂天手】，从【伏魔拳】到【金身镇狱法相】，踏天向诸仙借个百万年，以证长生不死大道。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b607f32c4ec4?pwd=NJ25",downloadUrl:"/books/10_从斩妖除魔开始长生不死1-838章.txt",sourceUrl:"https://www.deqixs.org/10/txt.html#dir"},{id:11,slug:"谁让他修仙的",title:"谁让他修仙的！",cover:je,author:"最白的乌鸦",date:"2026-02-22",category:"仙侠",status:"已完结",chapters:"1-1364章",latestChapter:"第1364章 番外一",excerpt:"（新书《请勿高考时渡劫》已发） “我反复强调，修仙界的风气本来就是歪的，不是我带歪的，都说史书是胜利者书写的，那为什么我获胜了还总是有人诬陷我？”陆阳剑仙面对记者采访如此说道，表示非常愤怒。 第二天。 “我反复强调，修仙界的风气是我带歪的，史书是胜利者书写的，我获胜了！”陆阳剑仙面对记者的采访时如此说道，表示非常愤怒。——《修仙日报》为您报道。",tags:[{name:"仙侠",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/fbf4a39f27b1?pwd=yJ8d",downloadUrl:"/books/11_谁让他修仙的！1-1364章.txt",sourceUrl:"https://www.deqixs.org/11/txt.html#dir"},{id:12,slug:"玄鉴仙族",title:"玄鉴仙族",cover:Pe,author:"季越人",date:"2026-09-05",category:"仙侠",status:"连载中",chapters:"1-1559章",latestChapter:"第9839章 9951、10452、10467、10491、10501、10547、10615、10659、",excerpt:"陆江仙熬夜猝死，残魂却附在了一面满是裂痕的青灰色铜镜上，飘落到了浩瀚无垠的修仙世界。 凶险难测的大黎山，眉尺河旁小小的村落，一个小家族拾到了这枚镜子，于是传仙道授仙法，开启波澜壮阔的新时代。 (家族修仙，不圣母，种田，无系统，群像文)",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/61e3cfd1c16e?pwd=Syrb",downloadUrl:"/books/12_玄鉴仙族1-1559章.txt",sourceUrl:"https://www.deqixs.org/12/txt.html#dir"},{id:13,slug:"从水猴子开始成神",title:"从水猴子开始成神",cover:Le,author:"甲壳蚁",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-1482章",latestChapter:"第1482章 南疆机会，蛙族冠军（二合一）",excerpt:"【已有完结七千均大精品，品质保障，放心阅读。】 选择大于努力！ 武师们为陆地宝树打的头破血流，深水神草却无人问津。 穿越成渔民的梁渠获得水泽之鼎，炼化【水猴子】天赋，统御水兽，一路收割，踏上巅峰！ 【水猴子】→【泽狨】→【水王猿】→【淮涡水君】！ 从此万里泽涛由我做主！ 洪水滔滔。 人们跪拜祈福，献上祭品。 “求水神大人保佑......” 靠，能不能别向我祭祀少女了，我真不是水神啊！",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/afcfa9feb3b9?pwd=kCS2",downloadUrl:"/books/13_从水猴子开始成神1-1482章.txt",sourceUrl:"https://www.deqixs.org/13/txt.html#dir"},{id:14,slug:"青山",title:"青山",cover:Me,author:"会说话的肘子",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-797章",excerpt:"飞光飞光，劝尔一杯酒。 吾不识青山高，黄地厚。 唯见月寒日暖，来煎人寿。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/18585ae421f9?pwd=BNNk",downloadUrl:"/books/14_青山1-797章.txt",sourceUrl:"https://www.deqixs.org/14/txt.html#dir"},{id:15,slug:"神的模仿犯",title:"神的模仿犯",cover:We,author:"青衫取醉",date:"2026-09-06",category:"游戏",status:"连载中",chapters:"1-840章",latestChapter:"第840章 总分",excerpt:"十二名身份各异的男女被邀请进入新世界。 在这里，他们不仅要通过议案投票来决定自己的生活方式，还要不断参与生死游戏来延长自己的签证时间。 而这些生死游戏的设计者，其实就在他们中间。",tags:[{name:"游戏",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/ff332d979edc?pwd=fdMp",downloadUrl:"/books/15_神的模仿犯1-840章.txt",sourceUrl:"https://www.deqixs.org/15/txt.html#dir"},{id:16,slug:"我的化身正在成为最终boss",title:"我的化身正在成为最终BOSS",cover:Fe,author:"汐尺",date:"2026-02-22",category:"轻",status:"已完结",chapters:"1-422章",latestChapter:"第422章 番外一： 世界树的孩子们",excerpt:"平平无奇地生活了十多年后，某天夜里，姬明欢觉醒了一个允许他在现实世界“创建游戏角色”的异能。 并且每一个角色都具备着独特的主线任务、独特的技能树系统。 自那之后他一发不可收拾，在现实世界之中不断创建新的游戏角色、开发技能树、培养角色系统……提升角色的知名度便能加强角色的能力，于是他开始大肆捣乱，为了吸引眼球而无所不用其极。 等回过神时，姬明欢独自一人盘着腿坐在月球上眺望满目苍痍的蓝星，轻声感慨道：",tags:[{name:"轻",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/5019613ed338?pwd=5J85",downloadUrl:"/books/16_我的化身正在成为最终BOSS1-422章.txt",sourceUrl:"https://www.deqixs.org/16/txt.html#dir"},{id:17,slug:"元始法则",title:"元始法则",cover:Ee,author:"飞天鱼",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1271章",excerpt:'星空中的"道城"，修行最初的萌芽之地"祖洲"，浩瀚宇宙水之起源"神仓古泽"，虚暗禁区"战斧座空洞"。还有藏在宏观中的天界，与微观中的地府幽境。地球的微观世界……显微镜下——豆子般大小的佛祖舍利，宛若一颗浅红色星球，研究人员发现了搁浅其中的古老青铜船舰。',tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/6334b093dd1d?pwd=9nvY",downloadUrl:"/books/17_元始法则1-1271章.txt",sourceUrl:"https://www.deqixs.org/17/txt.html#dir"},{id:18,slug:"冬日重现",title:"冬日重现",cover:$e,author:"雪梨炖茶",date:"2026-09-06",category:"轻",status:"已完结",chapters:"1-500章",latestChapter:"第500章 后日谈:情人节(下)(月初求票)",excerpt:"张述桐曾有两个女同学： 一个是有钱人家的骄傲大小姐； 一个是在山里当庙祝的清冷少女。 她们一个被杀死在八年前，一个死在了八年后。 张述桐还有一个不可告人的秘密： 他能回到过去。 ... 可好不容易救回了她们，她们怎么自己打起来了？ ... 深山、大湖、神庙、水下的阴影、八年前的连环凶杀案，还有女孩逐渐冰冷的身体； 这是一个发生在冬天的小岛上，一群少男少女之间，有些温馨、有些惊悚、有些浪漫的青春故事",tags:[{name:"轻",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/df14bebfffaf?pwd=Nndc",downloadUrl:"/books/18_冬日重现1-500章.txt",sourceUrl:"https://www.deqixs.org/18/txt.html#dir"},{id:19,slug:"普罗之主",title:"普罗之主",cover:De,author:"沙拉古斯",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-861章",latestChapter:"第861章 普罗万修！（大结局）",excerpt:"他叫李伴峰，为了救朋友去了96号站台，上了1160蒸汽列车，来到停留在蒸汽时代的普罗州。这里有越吃越猛的食修，越抽越强的烟修，越杀越狠的武修。伴峰穿上西装，戴上礼帽，拿上鸡毛掸子，认真问了一句：告诉我，谁是普罗之主？",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/c99299b06099?pwd=Ve5F",downloadUrl:"/books/19_普罗之主1-861章.txt",sourceUrl:"https://www.deqixs.org/19/txt.html#dir"},{id:20,slug:"道诡异仙",title:"道诡异仙",cover:ze,author:"狐尾的笔",date:"2026-02-28",category:"玄幻",status:"连载中",chapters:"1-1042章",latestChapter:"第1042章 红中传：2",excerpt:"诡异的天道，异常的仙佛，是真？是假？陷入迷惘的李火旺无法分辨。 可让他无法分辨的不仅仅只是这些。还有他自己，他病了，病的很重。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/a246d749d12c?pwd=X4Ut",downloadUrl:"/books/20_道诡异仙1-1042章.txt",sourceUrl:"https://www.deqixs.org/20/txt.html#dir"},{id:21,slug:"高武纪元",title:"高武纪元",cover:Oe,author:"烽仙",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-842章",latestChapter:"第843章 完本感言",excerpt:"从南洋深海中飞起的黑龙，掀起灭世海啸……这是人类科技高度发达的未来世界，也是掀起生命进化狂潮的高武纪元。武道学生李源心怀能观想星海的奇异神宫，多年以后，他可称之为武神！",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/d42a31b74c9b?pwd=c984",downloadUrl:"/books/21_高武纪元1-842章.txt",sourceUrl:"https://www.deqixs.org/21/txt.html#dir"},{id:22,slug:"故障乌托邦",title:"故障乌托邦",cover:Be,author:"狐尾的笔",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-650章",latestChapter:"第650章 番外：克隆（9）",excerpt:"改装金属义体，AI女友，脑内神经网络，赛博空间，这是一个拥有超高科技的世界。虽然过去的绝症癌症在纳米医疗机器人面前不值一提，然而新科技也会衍生各种各样的新问题，新麻烦，和新的赛博精神病。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/9e18c4ace34a?pwd=8AJa",downloadUrl:"/books/22_故障乌托邦1-650章.txt",sourceUrl:"https://www.deqixs.org/22/txt.html#dir"},{id:23,slug:"苟在妖武乱世修仙",title:"苟在妖武乱世修仙",cover:Ge,author:"文抄公",date:"2026-02-28",category:"仙侠",status:"已完结",chapters:"1-1102章",latestChapter:"第1102章 番外",excerpt:"方夕穿了，而且是二穿！ 在修仙界我唯唯诺诺，在异世界我重拳出击！ 没想到千百年后，在修仙界也成了大佬！ （苟道长生+无限流，文抄出品，本本精品，请书友们放心收藏阅读）",tags:[{name:"仙侠",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/d45b48e74d0f?pwd=vydR",downloadUrl:"/books/23_苟在妖武乱世修仙1-1102章.txt",sourceUrl:"https://www.deqixs.org/23/txt.html#dir"},{id:24,slug:"苟在两界修仙",title:"苟在两界修仙",cover:Re,author:"文抄公",date:"2026-09-01",category:"仙侠",status:"连载中",chapters:"1-714章",latestChapter:"第714章 不死",excerpt:"年岁之丰凶，灵氛之运转，阴阳之嬗变——此皆值岁微末之绩耳…… 这是一个少年穿越两界修仙，摸索成为【值岁】的故事……",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/d72d15567669?pwd=VV3q",downloadUrl:"/books/24_苟在两界修仙1-714章.txt",sourceUrl:"https://www.deqixs.org/24/txt.html#dir"},{id:25,slug:"永噩长夜",title:"永噩长夜",cover:Ne,author:"zhttty",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-1207章",latestChapter:"第1207章 些许磨砺",excerpt:"未知污染侵袭世界，仙神妖佛尽数沉沦。生化狂潮，蔚蓝再临，奇点登台，人革逆袭…… 来自未来的进化与源自过去的国术相逢，气血磅礴的人仙武道与诡异扭曲的污染相战。 我自长夜之前沉睡，我于永噩之地苏醒，带着未来的无限可能与位面救赎的希望，撼树的蚍蜉也是血溅五步的匹夫，他的故事才刚刚开始。 以下为不正经简介： 我是小西王啊啊啊啊 杀杀杀杀杀杀杀……………………",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/0d70165b433c?pwd=ghyh",downloadUrl:"/books/25_永噩长夜1-1207章.txt",sourceUrl:"https://www.deqixs.org/25/txt.html#dir"},{id:26,slug:"苟圣！",title:"苟圣！",cover:Ve,author:"不偷半日闲",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-533章",latestChapter:"第533章 金鹏",excerpt:"本书又名：《从金刚功开始肉身成圣》 许阳穿越人命如草芥的武道乱世，成为挣扎求存的贱民。 贫贱之身，起初他只想活着，吃一口饱饭。 直到他脑中出现一块【武道长生】面板，面板对他每日行为进行评估、结算，给予点数奖励。 点数可提升寿元、悟性、根骨，添加功法和技艺。 乱世下，他从食不果腹的贱民，渐渐成长为肉身成圣，身体永驻巅峰的盖世无敌强者，世人尊称其为——长生武圣。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/f83acb9cf08d?pwd=prYJ",downloadUrl:"/books/26_苟圣！1-533章.txt",sourceUrl:"https://www.deqixs.org/26/txt.html#dir"},{id:27,slug:"浊世武尊",title:"浊世武尊",cover:He,author:"林守镜",date:"2026-09-07",category:"仙侠",status:"已完结",chapters:"1-505章",latestChapter:"第505章 完结感言",excerpt:"大新民国三年，时局崩裂。南方政府初立，北方军阀割据混战。西洋铁舰叩关，前朝幽魂不散。 这是一个火枪与筋骨争锋、乱党与邪祟共舞的时代——革命暗潮之下，民间邪教滋生，兵武、妖魔、异兽、殖装铁躯… 滂沱雨夜，盛海租界。 傅觉民立于倾颓的巨厦废墟中，缓缓将双手从面前五米高、白头赤足的猿形巨怪胸膛中一点点抽出。 血水混着雨水自他指尖滴落。 “山海遗种，苍生余孽。” “吞了这只蕴含一丝朱厌血脉的异兽魂种，我【",tags:[{name:"仙侠",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/e2c39f8bda5f?pwd=vP5k",downloadUrl:"/books/27_浊世武尊1-505章.txt",sourceUrl:"https://www.deqixs.org/27/txt.html#dir"},{id:28,slug:"废土边境检查官",title:"废土边境检查官",cover:Ze,author:"斤斤斤",date:"2026-09-07",category:"科幻",status:"连载中",chapters:"1-1700章",latestChapter:"第1700章 1450、1300、1300、1250。",excerpt:"穿越到感染体肆虐、天灾不断的废土，程野成为了幸福城的边境检查官。 每一个想要加入幸福城的幸存者，都要被仔细盘问检查，以防感染体混入其中。 但很快，程野发现这些感染体和自己想象的完全不同！ 这里有能让人死而复生、靠执念存活的亡语触手。 有瞬间覆盖两公里，范围感染的死亡蒲公英。 有释放生物解构射线融化一切的火热向日葵。 还有，让生物发笑就能变强的笑面曼陀罗... 什么，要我检查这些怪物？ 幸好，程野获",tags:[{name:"科幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/c47857efc416?pwd=bweE",downloadUrl:"/books/28_废土边境检查官1-1700章.txt",sourceUrl:"https://www.deqixs.org/28/txt.html#dir"},{id:29,slug:"Z世代艺术家",title:"Z世代艺术家",cover:Ke,author:"起酥面包",date:"2026-09-06",category:"都市",status:"连载中",chapters:"1-557章",latestChapter:"第557章 最后一骂",excerpt:"《从撞碎公知开始推平娱乐圈》 出生于2005年的Z世代水军头子，重生在1998年。 他对于这个时代没有任何滤镜，因此感到强烈窒息。 影视剧粗糙的画质，辣眼的特效，破布般的服装，糊弄鬼一样的妆容，能凑合就凑合的拍摄理念…… 男男女女，导演制片，统统都是垃圾。 少年公平的拷打一切，并且带着怒火揭竿而起。 是时候给华娱一点来自于更高维度的震撼了！ PS：只要我公正的黑每一个人，谁敢骂我是喷子？",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/6ad71613f196?pwd=6DHe",downloadUrl:"/books/29_Z世代艺术家1-557章.txt",sourceUrl:"https://www.deqixs.org/29/txt.html#dir"},{id:30,slug:"以神通之名",title:"以神通之名",cover:Je,author:"猪心虾仁",date:"2026-09-05",category:"玄幻",status:"连载中",chapters:"1-16711章",latestChapter:"第16711章 16895、16978",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/406d7539d249?pwd=pUyJ",downloadUrl:"/books/30_以神通之名1-16711章.txt",sourceUrl:"https://www.deqixs.org/30/txt.html#dir"},{id:31,slug:"刚准备高考，离婚逆袭系统来了",title:"刚准备高考，离婚逆袭系统来了",cover:Xe,author:"七月封阳",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-970章",latestChapter:"第970章 重逢（正文完结）",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/eb534d94d957?pwd=T5w3",downloadUrl:"/books/31_刚准备高考，离婚逆袭系统来了1-970章.txt",sourceUrl:"https://www.deqixs.org/31/txt.html#dir"},{id:32,slug:"都重生了谁谈恋爱啊",title:"都重生了谁谈恋爱啊",cover:Qe,author:"错哪儿了",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-766章",latestChapter:"第766章 最好的人生(全文完)",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/41b53515adf2?pwd=aFa3",downloadUrl:"/books/32_都重生了谁谈恋爱啊1-766章.txt",sourceUrl:"https://www.deqixs.org/32/txt.html#dir"},{id:33,slug:"择日走红",title:"择日走红",cover:Ye,author:"宋不留春",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1006章",latestChapter:"第1006章 番外：让他应应激吧！",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/f4258235c073?pwd=r7E7",downloadUrl:"/books/33_择日走红1-1006章.txt",sourceUrl:"https://www.deqixs.org/33/txt.html#dir"},{id:34,slug:"离婚后，我能听到未来的声音",title:"离婚后，我能听到未来的声音",cover:ts,author:"林中谷",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-958章",latestChapter:"第958章 上市【终章】",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/ec48102fc07c?pwd=MPee",downloadUrl:"/books/34_离婚后，我能听到未来的声音1-958章.txt",sourceUrl:"https://www.deqixs.org/34/txt.html#dir"},{id:35,slug:"国民法医",title:"国民法医",cover:es,author:"志鸟村",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1356章",latestChapter:"第1356章 终章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/722f21c9853b?pwd=Z1xg",downloadUrl:"/books/35_国民法医1-1356章.txt",sourceUrl:"https://www.deqixs.org/35/txt.html#dir"},{id:36,slug:"捞尸人",title:"捞尸人",cover:ss,author:"纯洁滴小龙",date:"2026-09-03",category:"都市",status:"已完结",chapters:"1-696章",latestChapter:"第696章",excerpt:"人知鬼恐怖，鬼晓人心毒。 这是一本传统灵异小说。",tags:[{name:"都市",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/77b3cf89df99?pwd=rVtM",downloadUrl:"/books/36_捞尸人1-696章.txt",sourceUrl:"https://www.deqixs.org/36/txt.html#dir"},{id:37,slug:"踩着魔门妖女成为最强",title:"踩着魔门妖女成为最强",cover:as,author:"幽祝",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-859章",latestChapter:"第859章 番外五 后事",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/bdd2c2f8d322?pwd=NWM6",downloadUrl:"/books/37_踩着魔门妖女成为最强1-859章.txt",sourceUrl:"https://www.deqixs.org/37/txt.html#dir"},{id:38,slug:"状元郎",title:"状元郎",cover:rs,author:"三戒大师",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-902章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/865dc0780050?pwd=hmsU",downloadUrl:"/books/38_状元郎1-902章.txt",sourceUrl:"https://www.deqixs.org/38/txt.html#dir"},{id:39,slug:"大宋文豪",title:"大宋文豪",cover:os,author:"西湖遇雨",date:"2026-09-07",category:"历史",status:"连载中",chapters:"1-691章",latestChapter:"第691章 夫子遇颜，皆朋党耳",excerpt:"少年肝胆悬吴钩，文章笑傲王侯。醉鞭星斗过樊楼，一襟唐气象，半卷宋风流！",tags:[{name:"历史",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/f291efc97280?pwd=GqcB",downloadUrl:"/books/39_大宋文豪1-691章.txt",sourceUrl:"https://www.deqixs.org/39/txt.html#dir"},{id:40,slug:"红楼芳华，权倾天下",title:"红楼芳华，权倾天下",cover:ls,author:"爱车的z",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-598章",latestChapter:"第598章 尤氏姐妹上门，一堆美人观战",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/cd7ddab26c29?pwd=uLkQ",downloadUrl:"/books/40_红楼芳华，权倾天下1-598章.txt",sourceUrl:"https://www.deqixs.org/40/txt.html#dir"},{id:41,slug:"草芥称王",title:"草芥称王",cover:ns,author:"月关",date:"2026-09-07",category:"历史",status:"连载中",chapters:"1-522章",latestChapter:"第522章 魅影",excerpt:"接亲途中新郎惨死，为保豪门联姻，新娘竟要我这师爷替身代班？",tags:[{name:"历史",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/a9bfe33a8b0f?pwd=rCHw",downloadUrl:"/books/41_草芥称王1-522章.txt",sourceUrl:"https://www.deqixs.org/41/txt.html#dir"},{id:42,slug:"创业在晚唐",title:"创业在晚唐",cover:is,author:"痴人陈",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-851章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/31d737e406fb?pwd=vFzS",downloadUrl:"/books/42_创业在晚唐1-851章.txt",sourceUrl:"https://www.deqixs.org/42/txt.html#dir"},{id:43,slug:"光阴之外",title:"光阴之外",cover:cs,author:"耳根",date:"2026-04-05",category:"仙侠",status:"连载中",chapters:"1-1359章",latestChapter:"第1359章 花开故人来",excerpt:"天地是万物众生的客舍，光阴是古往今来的过客。 死生的差异，就好像梦与醒的不同，纷纭变换，不可究诘。 那么超越了生死，超脱了天地，在光阴之外，等待我们的是什么？ 这是耳根继《仙逆》《求魔》《我欲封天》《一念永恒》《三寸人间》后，创作的第六部长篇小说《光阴之外》",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/219baf1e984c?pwd=wcUX",downloadUrl:"/books/43_光阴之外1-1359章.txt",sourceUrl:"https://www.deqixs.org/43/txt.html#dir"},{id:44,slug:"我有一个修仙世界",title:"我有一个修仙世界",cover:ps,author:"未知",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1500章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/a6199e578276?pwd=7L1W",downloadUrl:"/books/44_我有一个修仙世界1-1500章.txt",sourceUrl:"https://www.deqixs.org/44/txt.html#dir"},{id:45,slug:"从箭术开始修行",title:"从箭术开始修行",cover:ds,author:"豆浆油条热干面",date:"2026-04-05",category:"仙侠",status:"已完结",chapters:"1-573章",latestChapter:"第573章 完结感言",excerpt:"陈三石穿越到王朝末年的乱世，幸好有爆肝系统傍身。 他本想打猎挣钱，有朝一日去武馆学两手拳脚，当个普普通通的富家翁。 奈何天不遂人愿，官员横征暴敛，武馆欺凌百姓，他为活命不得不参军入伍，成为一名弓箭手。 从【箭术（入门）】，爆肝到【开万石弓，凡出之箭不可躲避】，百里之外取敌将首级！ 从【兵卒基础枪法】，爆肝到【镇国龙枪，越战越勇】，横枪立马，一人喝退百万敌军！ 多年后，陈三石南征北战，已然天下无敌，",tags:[{name:"仙侠",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/afca06826207?pwd=kS5p",downloadUrl:"/books/45_从箭术开始修行1-573章.txt",sourceUrl:"https://www.deqixs.org/45/txt.html#dir"},{id:46,slug:"我的模拟长生路",title:"我的模拟长生路",cover:us,author:"愤怒的乌贼",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1782章",latestChapter:"第1782章 完本感言",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/3f7c8ee880dd?pwd=LEWv",downloadUrl:"/books/46_我的模拟长生路1-1782章.txt",sourceUrl:"https://www.deqixs.org/46/txt.html#dir"},{id:47,slug:"我真没想重生啊",title:"我真没想重生啊",cover:hs,author:"柳岸花又明",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1075章",latestChapter:"第1075章 十年",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/7db8daced367?pwd=SFqT",downloadUrl:"/books/47_我真没想重生啊1-1075章.txt",sourceUrl:"https://www.deqixs.org/47/txt.html#dir"},{id:48,slug:"神探陈益",title:"神探陈益",cover:gs,author:"勤奋的关关",date:"2026-04-05",category:"都市",status:"已完结",chapters:"1-808章",latestChapter:"第808章 番外 年节",excerpt:"世界级侦探陈益穿越到平行世界，发现自己被铐在审讯室的椅子上。 他首先要做的，是洗脱自己的杀人嫌疑。 离奇古怪的案件，无法言喻的人心。 从嫌疑人到刑警，从警司到警监，在每个凶案现场，奏响罚罪的刑侦旋律。 这是一个降维打击的刑侦高手，在新的世界破案升职的故事。",tags:[{name:"都市",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/9a2c198c01fe?pwd=wwxR",downloadUrl:"/books/48_神探陈益1-808章.txt",sourceUrl:"https://www.deqixs.org/48/txt.html#dir"},{id:49,slug:"重启人生",title:"重启人生",cover:ms,author:"王梓钧",date:"2026-04-05",category:"都市",status:"已完结",chapters:"1-610章",latestChapter:"第610章 【番外】真正的最后一章了",excerpt:"当人生按下重启键，似乎一切都变得顺利起来……才怪咧！让我重生在高考之后多好啊，实在不行重生去读高一也可以。重生在高三是什么鬼？而且还特么重生在考场。家人们，这道数学题怎么做？急，在线等！…………（本书又名《都重生谁还考试啊》、《都重生了作者还不会取书名》。）",tags:[{name:"都市",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/971b22d3c621?pwd=iWVq",downloadUrl:"/books/49_重启人生1-610章.txt",sourceUrl:"https://www.deqixs.org/49/txt.html#dir"},{id:50,slug:"三国-夫人-我乃正经人家",title:"三国：夫人，我乃正经人家",cover:bs,author:"树叶里的星星",date:"2026-04-05",category:"历史",status:"已完结",chapters:"1-816章",latestChapter:"第816章 后记（终）！",excerpt:"穿越汉末，到中山郡无极县，竟然是一个流民！不过，庆幸的是，每天在外裸露上半身锻炼半个时辰，可以长0.1斤力气，甚至还有机会出现暴击率。名门甄家招募部曲？张遂被选拔入内。略微露了两手之后，张遂发现，夫人看自己的眼神有些怪！二小姐甄宓怎么总是对自己冷脸相向？五小姐动不动就喜欢找自己玩，表示长大以后要嫁给自己。迎着身材丰腴，三十好几，却像少女般的夫人张氏那复杂的目光，张遂一脸心虚道：“夫人，我真是正经人",tags:[{name:"历史",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/b7f98911c905?pwd=ySiX",downloadUrl:"/books/50_三国：夫人，我乃正经人家1-816章.txt",sourceUrl:"https://www.deqixs.org/50/txt.html#dir"},{id:51,slug:"晋末长剑",title:"晋末长剑",cover:ws,author:"孤独麦客",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1516章",latestChapter:"第1516章 后记三",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b78a95b47f7e?pwd=u5rx",downloadUrl:"/books/51_晋末长剑1-1516章.txt",sourceUrl:"https://www.deqixs.org/51/txt.html#dir"},{id:52,slug:"红楼之挽天倾",title:"红楼之挽天倾",cover:vs,author:"林悦南兮",date:"2026-04-06",category:"历史",status:"已完结",chapters:"1-1726章",latestChapter:"第1726章 盛鼎元年，万象更新！（大结局）",excerpt:"千红一哭，万艳同悲。白骨如山忘姓氏，无非公子与红妆。后世青年魂穿红楼世界中宁国远亲之上，为了免于被贾府牵连之命运，只好步步为营，然而茫然四顾，发现家国天下，乱世将临，为不使神州陆沉，遍地膻腥，只好提三尺剑，扫不臣，荡贼寇，平鞑虏，挽天倾！这一切，从截胡秦可卿开始……",tags:[{name:"历史",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/d8ad064bd109?pwd=sFrN",downloadUrl:"/books/52_红楼之挽天倾1-1726章.txt",sourceUrl:"https://www.deqixs.org/52/txt.html#dir"},{id:53,slug:"明朝败家子",title:"明朝败家子",cover:ks,author:"上山打老虎额",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-0章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/625deba90034?pwd=AFgT",downloadUrl:"/books/53_明朝败家子1-0章.txt",sourceUrl:"https://www.deqixs.org/53/txt.html#dir"},{id:54,slug:"家父汉高祖",title:"家父汉高祖",cover:ys,author:"历史系之狼",date:"2026-04-06",category:"历史",status:"已完结",chapters:"1-913章",latestChapter:"第913章 幻想番外：祖庙",excerpt:"新书《衣冠不南渡》火热连载中，求支持！ ………… 一个伟大的帝国刚刚诞生，新的时代即将到来。 刘长也曾想过要不要争一争那大位，由自己来率领这个崭新的帝国，可是他看了看自己的周围，刘邦，吕后，刘盈，刘恒...嗯，活着不好吗？ 于是乎，刘长戴上了穿越者之耻的帽子，开始了混吃等死的咸鱼生活。 又名《我愚蠢的欧豆豆》，《这娃其实是项羽的吧？》，《跟你这样的虫豸怎么能治好大汉》等等。",tags:[{name:"历史",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/b939a8240ebc?pwd=Hq6t",downloadUrl:"/books/54_家父汉高祖1-913章.txt",sourceUrl:"https://www.deqixs.org/54/txt.html#dir"},{id:55,slug:"终宋",title:"终宋",cover:xs,author:"怪诞的表哥",date:"2026-04-06",category:"历史",status:"已完结",chapters:"1-1369章",latestChapter:"第1369章 完本感言",excerpt:"终宋一朝都未收复燕云，终宋一朝皆被外敌欺侮……南宋将亡之际，那些终宋一朝都没能达成的伟业，他要做到。",tags:[{name:"历史",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/3eafce9e28a9?pwd=CnSk",downloadUrl:"/books/55_终宋1-1369章.txt",sourceUrl:"https://www.deqixs.org/55/txt.html#dir"},{id:56,slug:"炮火弧线",title:"炮火弧线",cover:fs,author:"未知",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-788章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/576f7b385832?pwd=1Nsy",downloadUrl:"/books/56_炮火弧线1-788章.txt",sourceUrl:"https://www.deqixs.org/56/txt.html#dir"},{id:57,slug:"我的谍战岁月",title:"我的谍战岁月",cover:Cs,author:"未知",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-2106章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/5b921022cddc?pwd=E3hK",downloadUrl:"/books/57_我的谍战岁月1-2106章.txt",sourceUrl:"https://www.deqixs.org/57/txt.html#dir"},{id:58,slug:"谍影：命令与征服",title:"谍影：命令与征服",cover:_s,author:"拉丁海十三郎",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-2074章",latestChapter:"第2075章 大结局",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/e08a28010f7b?pwd=1RMS",downloadUrl:"/books/58_谍影：命令与征服1-2074章.txt",sourceUrl:"https://www.deqixs.org/58/txt.html#dir"},{id:59,slug:"谍海猎影",title:"谍海猎影",cover:Us,author:"未知",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1407章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/479af22c7009?pwd=jtcy",downloadUrl:"/books/59_谍海猎影1-1407章.txt",sourceUrl:"https://www.deqixs.org/59/txt.html#dir"},{id:60,slug:"佣兵我为王",title:"佣兵我为王",cover:qs,author:"严七官",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1850章",latestChapter:"第1850章 大规模押送",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/2637ecf780c9?pwd=9Dpf",downloadUrl:"/books/60_佣兵我为王1-1850章.txt",sourceUrl:"https://www.deqixs.org/60/txt.html#dir"},{id:61,slug:"谍影风云",title:"谍影风云",cover:As,author:"寻青藤",date:"2026-04-06",category:"军事",status:"已完结",chapters:"1-1222章",latestChapter:"第1222章 完本感言",excerpt:"一个平凡普通的公务员，机缘巧合回到了1936年，寻找地下组织，追查日本间谍，在波澜壮阔的大时代中为祖国，为民族的解放与复兴贡献着自己的一份力量，开始了他传奇的谍海生涯。谍影风云书友1群833528943，谍影风云书友2群879936725谍影风云舵主940510849",tags:[{name:"军事",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/623c26dec5b5?pwd=L7ha",downloadUrl:"/books/61_谍影风云1-1222章.txt",sourceUrl:"https://www.deqixs.org/61/txt.html#dir"},{id:62,slug:"谁教你这么当兵的！",title:"谁教你这么当兵的！",cover:Is,author:"东流不鸽",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-729章",latestChapter:"第729章 孟天行：要不要这么现实？ 【求订！ 求月票！ 】",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/d4b02d468231?pwd=EsrR",downloadUrl:"/books/62_谁教你这么当兵的！1-729章.txt",sourceUrl:"https://www.deqixs.org/62/txt.html#dir"},{id:63,slug:"横推亮剑",title:"横推亮剑",cover:Ss,author:"穷玩战术富玩火力",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1163章",latestChapter:"第1163章 不说，不说（大结局）",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b965be6dfc08?pwd=fWye",downloadUrl:"/books/63_横推亮剑1-1163章.txt",sourceUrl:"https://www.deqixs.org/63/txt.html#dir"},{id:64,slug:"谍战-都别猜了-我真是卧底啊",title:"谍战，都别猜了，我真是卧底啊",cover:Ts,author:"丛拾",date:"2026-09-07",category:"军事",status:"已完结",chapters:"1-353章",latestChapter:"第353章 该做个了结了",excerpt:"【谍战+物资买卖+全球博弈+顶级爽文】 【铭记历史，缅怀先烈，奋勇前行——纪念抗战胜利80周年征文一等奖作品】 民国二十七年，身兼多重身份的特工陈阳奉命潜伏在日伪机关，为组织上提供情报，为了更好的潜伏，获得日本人的信任，陈阳设下诱饵，交织网络，大肆笼络日军后勤部官员。 日本人:“陈桑，我怀疑我们中出了内奸。” 陈阳:“没错，我就是那个内奸。” 日本人:“陈桑.请不要开这种玩笑，一点都不好笑。” “",tags:[{name:"军事",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/6b0f7688747f?pwd=aTwc",downloadUrl:"/books/64_谍战，都别猜了，我真是卧底啊1-353章.txt",sourceUrl:"https://www.deqixs.org/64/txt.html#dir"},{id:65,slug:"谍战：我能扫描万物信息",title:"谍战：我能扫描万物信息",cover:js,author:"山怪与西风",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-712章",latestChapter:"第712章 零号",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/919a1e58175e?pwd=iyfe",downloadUrl:"/books/65_谍战：我能扫描万物信息1-712章.txt",sourceUrl:"https://www.deqixs.org/65/txt.html#dir"},{id:66,slug:"堑壕大栓与魔法",title:"堑壕大栓与魔法",cover:Ps,author:"咸嘉湖灵感大王",date:"2026-09-07",category:"科幻",status:"连载中",chapters:"1-596章",latestChapter:"第596章 火力不足恐惧症复发",excerpt:"莫林被人一拳打醒后，发现自己成了个战俘。原以为这是个类似一战爆发前夜的世界，却发现实际情况比自己想得更糟糕。而且为什么我一个帝国士兵，和国际纵队的志愿者成了盟军啊！铁罐头一样的手持剑盾的突击士兵，柴油和魔导混动的装甲骑士，还有随军法师......这一切都在告诉莫林，这个世界有问题，还很大。但他现在要考虑的，是如何在这场号称‘终结一切战争’的战争中，活下来。本书要素：魔改一战、真男人就要拉大栓、柴油",tags:[{name:"科幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b30c14e3ad5b?pwd=3ATa",downloadUrl:"/books/66_堑壕大栓与魔法1-596章.txt",sourceUrl:"https://www.deqixs.org/66/txt.html#dir"},{id:67,slug:"四十九条末世规则",title:"四十九条末世规则",cover:Ls,author:"小草昂扬",date:"2026-09-06",category:"科幻",status:"连载中",chapters:"1-707章",latestChapter:"第707章 ：“同类”",excerpt:"携带着末世规则的神秘存在“盗火者”突然降临在天水星。只有通过全部四十九条末世规则考验的人类，才能抵达一切秘密的根源。【末世规则一：睡眠剥夺】【规则内容：规则发布起，72小时内不能以任何形式进入睡眠状态】【失败惩罚：规则时间内一旦进入睡眠状态，将再也无法醒来】社会动荡、世界崩坏。在全球都笼罩在末世规则的恐怖阴影之际……穿越者关瞳，发现他竟然能看到规则背后的“隐藏规则”。",tags:[{name:"科幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/82614a23b4e4?pwd=Ac5d",downloadUrl:"/books/67_四十九条末世规则1-707章.txt",sourceUrl:"https://www.deqixs.org/67/txt.html#dir"},{id:68,slug:"第一序列",title:"第一序列",cover:Ms,author:"会说话的肘子",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1260章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/c352cf7539bf?pwd=pDv9",downloadUrl:"/books/68_第一序列1-1260章.txt",sourceUrl:"https://www.deqixs.org/68/txt.html#dir"},{id:69,slug:"异度旅社",title:"异度旅社",cover:Ws,author:"未知",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-888章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/98850de1c260?pwd=MfVa",downloadUrl:"/books/69_异度旅社1-888章.txt",sourceUrl:"https://www.deqixs.org/69/txt.html#dir"},{id:70,slug:"灵境行者",title:"灵境行者",cover:Fs,author:"未知",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1020章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/018b48e881a8?pwd=K2Kh",downloadUrl:"/books/70_灵境行者1-1020章.txt",sourceUrl:"https://www.deqixs.org/70/txt.html#dir"},{id:71,slug:"超人灭绝指南",title:"超人灭绝指南",cover:Es,author:"汐尺",date:"2026-09-08",category:"轻",status:"连载中",chapters:"1-223章",latestChapter:"第223章 圆桌会议，夏柯家的视频通话（日更万字求月票！）",excerpt:"我叫柯明庆，一觉醒来我穿越了，伴随而来的是一个难度绝巅的死亡任务：【在半年内灭绝超人种】。 而我的当务之急，是干掉这六个身手不凡的超人种家人。",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/01ea1fb7d5a2?pwd=6yM1",downloadUrl:"/books/71_超人灭绝指南1-223章.txt",sourceUrl:"https://www.deqixs.org/71/txt.html#dir"},{id:72,slug:"吞噬星空",title:"吞噬星空",cover:$s,author:"未知",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1522章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/929894d2868a?pwd=U8LT",downloadUrl:"/books/72_吞噬星空1-1522章.txt",sourceUrl:"https://www.deqixs.org/72/txt.html#dir"},{id:73,slug:"黎明之剑",title:"黎明之剑",cover:Ds,author:"远瞳",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1597章",latestChapter:"第1597章 番外边际漫游者",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/2bb255c08c9f?pwd=XfRB",downloadUrl:"/books/73_黎明之剑1-1597章.txt",sourceUrl:"https://www.deqixs.org/73/txt.html#dir"},{id:74,slug:"黄昏分界",title:"黄昏分界",cover:zs,author:"黑山老鬼",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-871章",latestChapter:"第871章 太岁之终，轮回之始",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/35a2894870ce?pwd=TiYj",downloadUrl:"/books/74_黄昏分界1-871章.txt",sourceUrl:"https://www.deqixs.org/74/txt.html#dir"},{id:75,slug:"学霸的军工科研系统",title:"学霸的军工科研系统",cover:Os,author:"十月廿二",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1708章",latestChapter:"第1708章 太阳的距离（大结局）",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/3687b6b3fa82?pwd=G6wk",downloadUrl:"/books/75_学霸的军工科研系统1-1708章.txt",sourceUrl:"https://www.deqixs.org/75/txt.html#dir"},{id:76,slug:"百世飞升",title:"百世飞升",cover:Bs,author:"白眉罗汉",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-963章",latestChapter:"第963章 证道成仙，九世终结",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/1f605311ff58?pwd=xBmj",downloadUrl:"/books/76_百世飞升1-963章.txt",sourceUrl:"https://www.deqixs.org/76/txt.html#dir"},{id:77,slug:"恭喜发财",title:"恭喜发财",cover:Gs,author:"徐徐图之",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-45章",latestChapter:"第45章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/bc0555fd7fa3?pwd=7FcH",downloadUrl:"/books/77_恭喜发财1-45章.txt",sourceUrl:"https://www.deqixs.org/77/txt.html#dir"},{id:78,slug:"窈窕贵女-疯犬好逑",title:"窈窕贵女，疯犬好逑",cover:Rs,author:"罗敷媚歌",date:"2026-04-09",category:"言情",status:"已完结",chapters:"1-87章",latestChapter:"第87章 弃犬3:并非华贵之物，和它的主人一样",excerpt:"【明艳骄纵美人 * 覆面自卑疯犬】 前世，萧玉芙出身高贵，从未将父亲带回的那个外室的儿子萧檀看进眼里过。 更何况，他从人憎鬼恶的酷吏，到权倾朝野位极人臣的手段并不光彩。 而她嫁得门当户对的如玉郎君，与夫君相敬如",tags:[{name:"言情",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/4764e9ffd4f8?pwd=nWHs",downloadUrl:"/books/78_窈窕贵女，疯犬好逑1-87章.txt",sourceUrl:"https://www.deqixs.org/78/txt.html#dir"},{id:79,slug:"剑走偏锋的大明",title:"剑走偏锋的大明",cover:Ns,author:"未知",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1126章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/0fabb2459f6e?pwd=8Kcq",downloadUrl:"/books/79_剑走偏锋的大明1-1126章.txt",sourceUrl:"https://www.deqixs.org/79/txt.html#dir"},{id:80,slug:"圣女来时不纳粮",title:"圣女来时不纳粮",cover:Vs,author:"稚嫩小菠萝",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-1372章",latestChapter:"第1372章 最后黎明（下）（7k）（大结局）",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/d1033cb09007?pwd=gcpQ",downloadUrl:"/books/80_圣女来时不纳粮1-1372章.txt",sourceUrl:"https://www.deqixs.org/80/txt.html#dir"},{id:81,slug:"攻略咸鱼的错误方式",title:"攻略咸鱼的错误方式",cover:Hs,author:"长明夜",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-79章",latestChapter:"第79章 if线四",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/0511cc39a470?pwd=uXJL",downloadUrl:"/books/81_攻略咸鱼的错误方式1-79章.txt",sourceUrl:"https://www.deqixs.org/81/txt.html#dir"},{id:82,slug:"哥你不许打我老公！！",title:"哥你不许打我老公！！",cover:Zs,author:"流初",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-409章",latestChapter:"第116章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/653ce779d9fc?pwd=NggT",downloadUrl:"/books/82_哥你不许打我老公！！1-409章.txt",sourceUrl:"https://www.deqixs.org/82/txt.html#dir"},{id:83,slug:"理想之城",title:"理想之城",cover:Ks,author:"非天夜翔",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-132章",latestChapter:"第132章 48-8",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/92fdde82a850?pwd=FAnQ",downloadUrl:"/books/83_理想之城1-132章.txt",sourceUrl:"https://www.deqixs.org/83/txt.html#dir"},{id:84,slug:"卷崽穿到反派幼年期[快穿]",title:"卷崽穿到反派幼年期[快穿]",cover:Js,author:"日落黄ovo",date:"2026-04-09",category:"言情",status:"已完结",chapters:"1-269章",latestChapter:"第269章",excerpt:"上辈子严格执行内卷计划的祝无虞，小小年纪就把自己卷没了。 事实证明修炼不能代替睡觉，会猝死！ 死后被系统绑定，让他穿到各种龙傲天文里，成为反派幼崽改写be结局。 祝无虞活动了下新的身体决定从头卷起。 系统：“禁止做出违背原主人设的事情。” 并不想偷懒中二叛逆脾气大攻击所有人毁灭全世界的卷卷：“哦T^T” 【母亲早逝，骄纵阴郁的婚生子 原剧情中他欺负男主，成为压垮骆驼的最后一根稻草。 卷卷穿来后，发",tags:[{name:"言情",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/12334ed52e97?pwd=mzua",downloadUrl:"/books/84_卷崽穿到反派幼年期[快穿]1-269章.txt",sourceUrl:"https://www.deqixs.org/84/txt.html#dir"},{id:85,slug:"我，枪神！",title:"我，枪神！",cover:Xs,author:"如水意",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-527章",latestChapter:"第527章 逐渐开始暴躁",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/fa4d61c6150d?pwd=DybG",downloadUrl:"/books/85_我，枪神！1-527章.txt",sourceUrl:"https://www.deqixs.org/85/txt.html#dir"},{id:86,slug:"情天娃娃气象电台",title:"情天娃娃气象电台",cover:Qs,author:"礼物袜子",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-90章",latestChapter:"第90章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/287a0bdc3196?pwd=dXKy",downloadUrl:"/books/86_情天娃娃气象电台1-90章.txt",sourceUrl:"https://www.deqixs.org/86/txt.html#dir"},{id:87,slug:"直男卖腐天打雷劈",title:"直男卖腐天打雷劈",cover:Ys,author:"半个水瓶",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-191章",latestChapter:"第191章 第191章:足球番外",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/6df390e31cd7?pwd=pjAj",downloadUrl:"/books/87_直男卖腐天打雷劈1-191章.txt",sourceUrl:"https://www.deqixs.org/87/txt.html#dir"},{id:88,slug:"再婚abo",title:"再婚abo",cover:ta,author:"七流",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-84章",latestChapter:"第84章 正文完",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/9aa9e60a635e?pwd=xMrS",downloadUrl:"/books/88_再婚abo1-84章.txt",sourceUrl:"https://www.deqixs.org/88/txt.html#dir"},{id:89,slug:"剑烛大荒",title:"剑烛大荒",cover:ea,author:"爱潜水的乌贼",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-0章",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/4db2c625d70f?pwd=R5yC",downloadUrl:"/books/89_剑烛大荒1-0章.txt",sourceUrl:"https://www.deqixs.org/89/txt.html#dir"},{id:90,slug:"星河之主",title:"星河之主",cover:sa,author:"烽仙",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-387章",latestChapter:"第387章 宇宙神通【6K求月票】",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/8b43e872ff64?pwd=C1Kp",downloadUrl:"/books/90_星河之主1-387章.txt",sourceUrl:"https://www.deqixs.org/90/txt.html#dir"},{id:91,slug:"我正经学生-每天只吃九种魔药",title:"我正经学生，每天只吃九种魔药",cover:aa,author:"鬼谷道长",date:"2026-09-06",category:"轻",status:"连载中",chapters:"1-303章",latestChapter:"第303章 ：连喝五瓶融合魔药",excerpt:"伊文穿越成卖血试药的学生，获得天赋面板。【九龙之力：你可以同时将九种药物的负作用反转】贤者大学：最新安眠药，来能熬夜的学生。你服用【未完成的冬眠魔药】：认知受损，五天睡不醒。反转效果：五天内可以入梦学习。红国王实验室：实验型生长药剂，后果自负。你服用【二阶段D病毒】：肌肉增生，血液凝固。反转效果：体质+0.3，增加肉体延展性。治愈教会：来耐药性强的孤儿。你服用【？？？】：皮肤溃烂，内脏融化，精神突",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/741f9c42b3e2?pwd=Knr7",downloadUrl:"/books/91_我正经学生，每天只吃九种魔药1-303章.txt",sourceUrl:"https://www.deqixs.org/91/txt.html#dir"},{id:92,slug:"廓晋",title:"廓晋",cover:ra,author:"榴弹怕水",date:"2026-09-07",category:"历史",status:"连载中",chapters:"1-2章",latestChapter:"第2章 夜雨（续）",excerpt:"廓者，一曰扩，二曰清。既至东晋十六国，当中流击水，矢志北伐，先驱中原五胡，再扫朝堂士族门阀。所谓廓清天下，开创新业，延续华夏。道理上是如此，但永和五年，公元349年的秋日，当穿越者来到东晋，成为东晋朝最常见的流民之一后，首先要考虑的是，今年冬天怎么熬过去？如何避免跌落斩杀线？又是一本老套的穿越故事。",tags:[{name:"历史",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/a4da1696caa9?pwd=vnNg",downloadUrl:"/books/92_廓晋1-2章.txt",sourceUrl:"https://www.deqixs.org/92/txt.html#dir"},{id:93,slug:"谁让他当假面骑士的",title:"谁让他当假面骑士的！",cover:oa,author:"拿咚蘸柚子酱",date:"2026-09-07",category:"轻",status:"连载中",chapters:"1-324章",latestChapter:"第324章 心灵冲击！我会为你带来，比梦魇更绝望的噩梦！",excerpt:"以下是新一代骑士界领袖，著名粉红色骑士代言人，黑榜投票独断万古——假面骑士帝骑先生，于联邦最不受欢迎骑士投票现场的采访对话：记者：“帝骑先生，请问您如何看待零一对您是谜语人的评价？”帝骑：“那纯属造谣！世人皆知我帝骑为人坦荡，从不说谜语，那都是大白话。”记者：“那关于剑与圣刃联名倡议，抵制帝骑使用FFR将他们变成武器这件事，您作何感想？”帝骑：“那不是他们心善，看我没武器，自愿的吗？”记者：“..",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/144f0990da40?pwd=zCwS",downloadUrl:"/books/93_谁让他当假面骑士的！1-324章.txt",sourceUrl:"https://www.deqixs.org/93/txt.html#dir"},{id:94,slug:"我加载了神秘学面板",title:"我加载了神秘学面板",cover:la,author:"雨中有秋云",date:"2026-09-07",category:"奇幻",status:"连载中",chapters:"1-507章",latestChapter:"第507章 与蛇共舞",excerpt:"蒸汽时代，理性与神秘主义并行。知道得越多，离疯狂越近，这是帷幕后的共识。李察不信这个。或者说，这条规则对他不适用。技能面板让他多领域涉猎，却都能精通，像一台不需要停机的蒸汽机。……【呼吸Lv.3&#183;疗愈：沉疴尽退，旧疾全消】【学识Lv.3&#183;博闻：凡经目之典籍，皆留痕于大脑。】【灵Lv.1&#183;出窍：灵魂可短暂挣脱肉身】……【呼吸Lv.5&#183;元素：以呼吸牵动以太，统合",tags:[{name:"奇幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/4a2b87c8f0fd?pwd=Pn3k",downloadUrl:"/books/94_我加载了神秘学面板1-507章.txt",sourceUrl:"https://www.deqixs.org/94/txt.html#dir"},{id:95,slug:"真实历史游戏-只有我知道剧情",title:"真实历史游戏：只有我知道剧情",cover:na,author:"余弦公式",date:"2026-08-10",category:"游戏",status:"连载中",chapters:"1-448章",latestChapter:"第448章 【第五更，为盟主“阿毛爱吃肉”加更】 自毁长城！",excerpt:"“那个叫马谡的思路很清晰嘛，街亭之战胜负手就在山上！连山都不敢占的，都是庸才，根本不足为虑！”“别去斯大林格勒卷了，我刚从西线副本出来，德军的闪电战就是无敌的，苏联那嘎达撑不过三个月！”“滑铁卢？拿破仑的指挥能力肯定是满级的，会输只有一个可能，就是他手下的元帅全是内鬼！”“土木堡决战！五十万对两万，优势在我！大明皇帝可是御驾亲征，一波平推过去就行了，怎么输？”……曾经滚瓜烂熟的历史，如今变成了一个",tags:[{name:"游戏",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b82d1cc0d6dc?pwd=iArR",downloadUrl:"/books/95_真实历史游戏：只有我知道剧情1-448章.txt",sourceUrl:"https://www.deqixs.org/95/txt.html#dir"},{id:96,slug:"让仙门再次伟大",title:"让仙门再次伟大",cover:ia,author:"鹤守月满池",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-8262章",latestChapter:"第8262章 8350、8792、9172、9178、9352、9467、9832、9908、10117、10356、10479、",excerpt:"“承认吧，你根本无法忍受那些高高在上的修行者。”“他们与我们不同，我们的情感无法共通，我们的逻辑大不相同，共存绝无可能。”王平话音落下，一方巍峨书册徐徐翻开。任你洞天福地，红尘世俗，王侯将相，漫天仙佛，都不过是书中的一道道经卷，是他这位书主的修行资粮。“所以现在是时候了，我们将战斗！”“在人间战斗，在梵国战斗，在清虚天战斗，在每一个矢志抗争的地方战斗！”“哪怕要燃烧大地，焚灭天空。”人群中央，王平",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/78956567249f?pwd=a6mr",downloadUrl:"/books/96_让仙门再次伟大1-8262章.txt",sourceUrl:"https://www.deqixs.org/96/txt.html#dir"},{id:97,slug:"1984：从破产川菜馆开始",title:"1984：从破产川菜馆开始",cover:ca,author:"轻语江湖",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-18699章",latestChapter:"第628章 人家孔派门面办庆功宴，你去又唱又跳不太合适",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/de75763f140b?pwd=KDm7",downloadUrl:"/books/97_1984：从破产川菜馆开始1-18699章.txt",sourceUrl:"https://www.deqixs.org/97/txt.html#dir"},{id:98,slug:"我在永夜打造庇护所",title:"我在永夜打造庇护所",cover:pa,author:"中世纪的兔子",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-411章",latestChapter:"第411章 什么叫王诡是你大哥？",excerpt:"陈凡穿越至一个诡异玄幻世界中，在这个世界，黑夜降临后，无数诡物肆虐人间。 他通过穿越自带的永夜领主面板成为一名建筑师，一点一点在荒原上打造属于自己的营地。 诡火、城墙、祭塔，一座座建筑凭空升起，他的名声也渐渐响彻整个江北。 直至—— 当「终极天灾」降临，无数疯狂的诡物危害人间，民不聊生之时。 一座横贯大陆的万里长城，凭空升起！ ... “这里是永夜大陆。” “我的地盘。”",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/089bc7228675?pwd=wwpF",downloadUrl:"/books/98_我在永夜打造庇护所1-411章.txt",sourceUrl:"https://www.deqixs.org/98/txt.html#dir"},{id:99,slug:"这个武圣太谨慎了无删减",title:"这个武圣太谨慎了无删减",cover:da,author:"九灯和善",date:"2026-08-03",category:"玄幻",status:"连载中",chapters:"1-265章",latestChapter:"第265章 拍卖（加更求订阅）",excerpt:"【防御性出手】【出手必碾压】【杀伐果断】【人情世故】 “我真不惹事，只是防御性先下手为强。” 穿越到武道世界普通少年身上的林砚，靠着穿越自带的武道树，本来只想默默发育，求一个逍遥自由。 没曾想，因着没背景靠山，高门权贵处处针对，连看门的狗都要朝他狂吠几声。 出于自保他只能防御性出手，提前将危机扼杀在摇篮中、 靠着这份谨慎，以及武道树的亿点点帮助，林砚在这波澜壮阔的世界中，谱写下独属于他的传奇。 …",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/fc1fafc02a6b?pwd=aM6N",downloadUrl:"/books/99_这个武圣太谨慎了无删减1-265章.txt",sourceUrl:"https://www.deqixs.org/99/txt.html#dir"},{id:100,slug:"这个武圣太谨慎了",title:"这个武圣太谨慎了",cover:ua,author:"九灯和善",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-322章",latestChapter:"第322章 秘境（求月票）",excerpt:"【防御性出手】【出手必碾压】【杀伐果断】【人情世故】 “我真不惹事，只是防御性先下手为强。” 穿越到武道世界普通少年身上的林砚，靠着穿越自带的武道树，本来只想默默发育，求一个逍遥自由。 没曾想，因着没背景靠山，高门权贵处处针对，连看门的狗都要朝他狂吠几声。 出于自保他只能防御性出手，提前将危机扼杀在摇篮中、 靠着这份谨慎，以及武道树的亿点点帮助，林砚在这波澜壮阔的世界中，谱写下独属于他的传奇。 …",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/69237cb48cd7?pwd=qb2N",downloadUrl:"/books/100_这个武圣太谨慎了1-322章.txt",sourceUrl:"https://www.deqixs.org/100/txt.html#dir"},{id:101,slug:"我的学习群里全是真大佬",title:"我的学习群里全是真大佬",cover:ha,author:"胖胖的小橘",date:"2026-09-10",category:"都市",status:"连载中",chapters:"1-595章",latestChapter:"第595章 下一个风口",excerpt:"学渣李东无意中加入了一个诡异的“青龙学习小组”。 群友的名字都十分复古，像是什么“艾萨克·牛顿”、“法拉第”、“高斯”、“爱因斯坦”。 他们经常讨论一些晦涩难懂的学术问题，偶尔还会发一些专属红包。 红包里的东西更加离谱，“洞穿真理的专注”、“逻辑思维碎片”、“绝对记忆”、“微积分本源”…… 李东一直以为这是一群入戏太深的中二病患者。 直到有一天，那位叫“艾萨克·牛顿”的群友忽然颤抖着说道： “诸位",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/3c4ee90028a5?pwd=TfdX",downloadUrl:"/books/101_我的学习群里全是真大佬1-595章.txt",sourceUrl:"https://www.deqixs.org/101/txt.html#dir"},{id:102,slug:"姐姐-我也要一起当女仆吗",title:"姐姐，我也要一起当女仆吗？",cover:ga,author:"电子熊猫",date:"2026-09-05",category:"轻",status:"连载中",chapters:"1-304章",latestChapter:"第304章 再也不会让你姐姐伤心了，我保证。",excerpt:"【双胞胎】【恋爱日常】 江渝白第一次收租，就撞见了因为没钱交租而对房东苦苦哀求的双胞胎姐妹 林见夏：事先说好，还完欠租我们就两清了！ 林见夏：只是打扫卫生做做饭而已，我才不要穿女仆装！ 毕业后。 林见夏：....喂，江小白，你不会要等着女孩子主动吧？ 江渝白：哦，其实我喜欢的是你妹妹。 林见夏：？ ---------------------------------------------- （已有",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/1d9bab709b46?pwd=Km8g",downloadUrl:"/books/102_姐姐，我也要一起当女仆吗？1-304章.txt",sourceUrl:"https://www.deqixs.org/102/txt.html#dir"},{id:103,slug:"人在美利坚-我的叔叔堂吉诃德",title:"人在美利坚：我的叔叔堂吉诃德",cover:ma,author:"喜欢吃圣代",date:"2026-09-10",category:"都市",status:"连载中",chapters:"1-471章",latestChapter:"第541章 恨天无把，恨地无环（2合1）",excerpt:"我叫李维，自从双亲逝世，欠下一大笔债务之后，我被一个在美利坚的远方叔叔收养，前往纽约和他一起生活。 等等，这个中世纪冒险系统是什么鬼？它把我的叔叔认成了一个疯子骑士？上东区的富人区是贵族庭院？前面好像有个魅魔地窟，我决定去探索一下...... 来到纽约第一天，我遵纪守法。 来到纽约第二天，我小心试探。 来到纽约第三天，我决定我要守护世界。 来到纽约第四天，我开始厌倦，这个世界太烂了。 来到纽约第五",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/05877d3ee327?pwd=Cxss",downloadUrl:"/books/103_人在美利坚：我的叔叔堂吉诃德1-471章.txt",sourceUrl:"https://www.deqixs.org/103/txt.html#dir"},{id:104,slug:"北望江山",title:"北望江山",cover:ba,author:"孤独麦客",date:"2026-09-07",category:"历史",status:"连载中",chapters:"1-131章",latestChapter:"第131章 水西门（为盟主夜战八荒藏刀式加更）",excerpt:"现代人来到元朝末年，各种意义上艰难挣扎的故事。",tags:[{name:"历史",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/0cf1a53dcbe3?pwd=wxk7",downloadUrl:"/books/104_北望江山1-131章.txt",sourceUrl:"https://www.deqixs.org/104/txt.html#dir"},{id:105,slug:"夺嫡在嘉靖朝",title:"夺嫡在嘉靖朝",cover:wa,author:"夜星月语",date:"2026-09-07",category:"历史",status:"连载中",chapters:"1-126章",latestChapter:"第126章 应承",excerpt:"大明嘉靖二十八年，东宫骤空，紫禁城陷入一场生死棋局，牵扯着无数人的生死荣辱。 一边是裕王朱载坖，占长幼之序，拥清流满朝，以祖制为盾，被士林奉为理所当然的储君。 而另一边的景王朱载圳，非嫡非长，但却成了嘉靖皇帝制衡裕王的棋子，只能参与进这夺嫡漩涡之中。 此时张居正、高拱尚沉翰林院，胡宗宪、俞大猷、戚继光、赵贞吉、海瑞未登高位，天下大势未定，名臣风骨未显。 而一心长生不老的嘉靖皇帝，只是垂下眼帘，在西",tags:[{name:"历史",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/e73234346c32?pwd=TDLs",downloadUrl:"/books/105_夺嫡在嘉靖朝1-126章.txt",sourceUrl:"https://www.deqixs.org/105/txt.html#dir"},{id:106,slug:"同时穿越-继承万界遗产",title:"同时穿越：继承万界遗产",cover:va,author:"透明鸽子",date:"2026-09-09",category:"轻",status:"连载中",chapters:"1-814章",latestChapter:"第814章 秦圣主，高",excerpt:"人在遮天世界，同时穿越诸天万界。 天赋悟性融合，战力无限叠加。 五倍同级战力，你说我只是凡体而已，我不挑你理。 万倍同级战力时，你该叫我什么？ 诸天万界的我啊，把你们的元气借给我吧！ （包含小说、动漫、电影、电视世界）",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/fbedc9f219a1?pwd=wCmV",downloadUrl:"/books/106_同时穿越：继承万界遗产1-814章.txt",sourceUrl:"https://www.deqixs.org/106/txt.html#dir"},{id:107,slug:"清光宝鉴",title:"清光宝鉴",cover:ka,author:"一片苏叶",date:"2026-09-07",category:"仙侠",status:"连载中",chapters:"1-103章",latestChapter:"第103章 天都仙子 清灵心印(感谢Landulet的大盟主！）",excerpt:"“且邀银汉九天月，共赏人间万古春。不问红尘纷扰事，半生修得劫外身...” ———— 水中之月，如梦幻镜花。 连蒙童都知道，水中的月亮只能眼观，无法触碰。可秦宣，他却能把月亮捞起来... ……",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/69a8290ae430?pwd=mAS5",downloadUrl:"/books/107_清光宝鉴1-103章.txt",sourceUrl:"https://www.deqixs.org/107/txt.html#dir"},{id:108,slug:"万生痴魔",title:"万生痴魔",cover:ya,author:"沙拉古斯",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-367章",latestChapter:"第367章 军中麟凤（感谢盟主名角儿）",excerpt:"拿个碗，填好土，数个一二三四五。 种个蛤蟆变火车，种颗毛豆变老虎。 种出一身好手艺，一生享福不受苦。 万生有行三百六，条条大路谁做主？ 那位木匠好本事，墨线弹指分阴阳，榫卯环扣镇八荒。 这位铁匠有手段，铁火一炉鸣乾坤，锻锤千击裂晨昏。 又有裁缝野心大，寸缕回风裁世象，绣针一点定阴阳。 还有厨子心肠狠，铁灶燃狱煮红尘，刃起风雷骨作薪。 万生州，千人千面，万生万变。 张来福站在人海当中，得意洋洋笑道：",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/a76e1a1e4022?pwd=fn2z",downloadUrl:"/books/108_万生痴魔1-367章.txt",sourceUrl:"https://www.deqixs.org/108/txt.html#dir"},{id:109,slug:"律师-从合法报复出轨开始",title:"律师：从合法报复出轨开始！",cover:xa,author:"青衫仗剑行天涯",date:"2026-09-08",category:"都市",status:"连载中",chapters:"1-330章",latestChapter:"第330章 新案！大案！【求月票！】",excerpt:"2002年，10月1日。 徐德穿越至东国绿森市，成为一名律师，并且获得只要能让客户满意，便能抽取奖励的金手指。 但刚穿越便碰上硬茬客户！ 客户被绿，妻子数次出轨欲要离婚分割财产，企图和小三远走高飞！ 面对上述，寻常人选择： 【选项a：财产分割，让委托人戴上绿帽，看着对方与小三挥霍自己钱财。】 【选项b：转移财产进行离婚，分割少部分钱财忍气吞声。】 为让客户满意。 徐德决定提供一点罕见的服务。 “比",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/3249deab3c69?pwd=9gKG",downloadUrl:"/books/109_律师：从合法报复出轨开始！1-330章.txt",sourceUrl:"https://www.deqixs.org/109/txt.html#dir"},{id:110,slug:"鬼灭-我的呼吸法能加点",title:"鬼灭：我的呼吸法能加点",cover:fa,author:"出包魔法师",date:"2026-09-07",category:"轻",status:"连载中",chapters:"1-554章",latestChapter:"第554章 今夜，我就是天命",excerpt:"【鬼灭之刃】【加点】【轻松】（书已经精品了） . 同期剑士都还在苦修呼吸法，他选择打开系统面进行加点。 当别的队员还在努力活下来，他默默救下本该牺牲的同僚。 当鬼杀队还恪守九柱传统，他身边围满了称他“先生”的准柱少年。 “富冈义勇，人的梦想，是不会结束的！” ——面对刚刚加入鬼杀队的后辈时，夏西随口指点。 “产屋敷，你会后悔的。” ——《最终选拔制度修改企划》被婉拒，夏西摔门而出。 数年过去，决战",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/1938e9810e31?pwd=FEY6",downloadUrl:"/books/110_鬼灭：我的呼吸法能加点1-554章.txt",sourceUrl:"https://www.deqixs.org/110/txt.html#dir"},{id:111,slug:"戾天子",title:"戾天子",cover:Ca,author:"三山风",date:"2026-08-14",category:"历史",status:"连载中",chapters:"1-948章",latestChapter:"第948章 好处给足，无声分化",excerpt:"重生到九龙夺嫡的平行世界，想着大干一场的沈叶，却发现自己竟然成了被群起而攻之的太子。知道太子最大敌人不是那些兄弟，而是越来越猜疑的皇帝。沈叶在发现难以复制玄武门之变后，就决定躺平了！反正再努力也成为不了皇帝，爱咋咋地……",tags:[{name:"历史",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/d879c526c968?pwd=5B1y",downloadUrl:"/books/111_戾天子1-948章.txt",sourceUrl:"https://www.deqixs.org/111/txt.html#dir"},{id:112,slug:"谁说我不是正经冒险者",title:"谁说我不是正经冒险者",cover:_a,author:"NK狐NK",date:"2026-09-10",category:"轻",status:"连载中",chapters:"1-595章",latestChapter:"第595章 星界投影强敌汇聚，夏花祭前诸多筹划",excerpt:"穿越到充斥着巨龙、精灵与冒险者的奇幻世界，兰斯给自己定下了三条铁律： 热闹不凑，闲事不管，天黑不出门。 …… 没想到穿越几个月后，上辈子玩的不正经游戏还在追他。 自此兰斯拥有了无穷无尽的体力和永不终结的生命。 但是在这个交织了冒险、梦想、贪婪、危险的世界，身为冒险公会抄写员的他，只想平静的生活，默默的积攒实力，最后去到满是异族小姐姐的贸易之都尽情展示自己的天赋。 然而，当时代的洪流涌来，阴影笼罩大",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/d3c278a756e1?pwd=jn9H",downloadUrl:"/books/112_谁说我不是正经冒险者1-595章.txt",sourceUrl:"https://www.deqixs.org/112/txt.html#dir"},{id:113,slug:"东京-崇华的我竟成了日娱之王",title:"东京：崇华的我竟成了日娱之王",cover:Ua,author:"96捞鱼费舍尔",date:"2026-09-10",category:"轻",status:"连载中",chapters:"1-308章",latestChapter:"第308章 愤怒的玩家，终于到手的头衔",excerpt:"（不懂日娱？小事！本书服务的就是爱看热闹的读者姥爷！） 穿越东京，却是平成末年，泡沫时代的红利一分没吃到，令和时代的黑利倒是一样也躲不了。 对令和死宅的消费能力心知肚明的樱田润，决定抱紧老乡的大腿，东大之友的这碗饭，我樱田润端定了？ 资源整合，时间节点卡准，量四岛之物力，结东大之欢心！ 只是，他天衣无缝的闯中小计划，在执行时总能出现那么点小小的偏差： 为了整活，在参加杰尼斯面试时跳只因小黑子舞，却",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/0c681d6e9b0d?pwd=93rN",downloadUrl:"/books/113_东京：崇华的我竟成了日娱之王1-308章.txt",sourceUrl:"https://www.deqixs.org/113/txt.html#dir"},{id:114,slug:"魔王大人深不可测",title:"魔王大人深不可测",cover:qa,author:"晨星LL",date:"2026-08-22",category:"轻",status:"已完结",chapters:"1-750章",latestChapter:"第750章 最后一章",excerpt:"魅魔记者：“尊敬的魔王大人，我记得魔神大人给您的命令是向我们的敌人散播恐慌，可我怎么听说您在我们敌人的市中心买下了一整条街？” 罗炎：“愚蠢！战术换家懂不懂？我把人类的城市买下来，人类不就只能搬到我的地下城去住了？” 魅魔记者：“可，可我听说，那些人类听说连魔王大人都去圣城买房，结果非但没有引起恐慌，反而让圣城的房价翻了一番。” 罗炎沾沾自喜说道。 “这恰恰说明我的计划是正确的！” 与此同时地下城",tags:[{name:"轻",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/ecd413cb060b?pwd=iPUz",downloadUrl:"/books/114_魔王大人深不可测1-750章.txt",sourceUrl:"https://www.deqixs.org/114/txt.html#dir"},{id:115,slug:"我的魔法没有上限",title:"我的魔法没有上限！",cover:Aa,author:"瑟瑟发抖梨花猫",date:"2026-09-10",category:"奇幻",status:"连载中",chapters:"1-501章",latestChapter:"第4728章 4757、4784、4889、4933、5147、5192、5332、5371、5398、5497",excerpt:"转生成异世界底层魔法师的泽利尔，获得了可以解锁神级天赋技能的外挂。 升到二级，即可从以下天赋技能之中二选一： 选项A：法术汹涌。 提升魔力上限，提升回蓝速度，提升法术强度，让你的魔法基础如磐石般牢固。 “火力！即正义！” 选项B：术式天演。 能够解析看见的任何魔法术式结构，并将其复现出来化为己用。 “你的魔法很不错，不过下一秒就是我的了。” 稍加思索，果断选B！ 从此泽利尔化身偷学狂魔，任何魔法只",tags:[{name:"奇幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/cbc0054093fc?pwd=9pk2",downloadUrl:"/books/115_我的魔法没有上限！1-501章.txt",sourceUrl:"https://www.deqixs.org/115/txt.html#dir"},{id:116,slug:"临圣",title:"临圣",cover:Ia,author:"卖报小郎君",date:"2026-08-31",category:"仙侠",status:"连载中",chapters:"1-0章",latestChapter:"第0章",excerpt:"这天下谁在执棋，谁在局里？ 刀笔写忠义，转身成谋逆。 金銮殿上舞未停，江山半壁已凋零。 谁在封王拜相，谁在易子而食？ 满朝朱紫谈社稷，无人肯听百姓音。",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/00ae718c6c4d?pwd=gFqv",downloadUrl:"/books/116_临圣1-0章.txt",sourceUrl:"https://www.deqixs.org/116/txt.html#dir"},{id:117,slug:"腐朽世界",title:"腐朽世界",cover:Sa,author:"滚开",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-608章",excerpt:"神秘，绝望，痛苦，腐朽，世界走向迷途。来到一个正在走向末路的世界，危机四伏，渺无希望，我只能依靠身上的神秘血印，不断推演进化各类技能，尝试走出一条绝望生路。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/6ab47c278a54?pwd=ca1x",downloadUrl:"/books/117_腐朽世界1-608章.txt",sourceUrl:"https://www.deqixs.org/117/txt.html#dir"},{id:118,slug:"白衣卿相",title:"白衣卿相",cover:Ta,author:"王梓钧",date:"2026-09-10",category:"历史",status:"连载中",chapters:"1-181章",latestChapter:"第181章 0179【战而胜之】",excerpt:"一袭白衣入汴梁，半生卿相定乾坤。",tags:[{name:"历史",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/0b0680841f7b?pwd=MbrE",downloadUrl:"/books/118_白衣卿相1-181章.txt",sourceUrl:"https://www.deqixs.org/118/txt.html#dir"},{id:119,slug:"我能活化技能",title:"我能活化技能",cover:ja,author:"四诗风雅颂",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-44章",latestChapter:"第44章 朱陵氏",excerpt:"“灵气复苏是世界的回光返照。” “异界降临里我们是异界，要降临到对面世界。“ “敌对的天命之子个个人中龙凤，不是横压一世就是举世无双。” “给我的身份要么是炮灰要么是龙套。” 作为武馆里被抛砖引玉的三师兄、异能民国里家业败落的纨绔子弟、修炼骑士呼吸法的乡下贵族长子等等身份的魏乐府庆幸自己也不是什么省油的灯。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/53f7fe3d50c5?pwd=rxP7",downloadUrl:"/books/119_我能活化技能1-44章.txt",sourceUrl:"https://www.deqixs.org/119/txt.html#dir"},{id:120,slug:"仙道尽头",title:"仙道尽头",cover:Pa,author:"怕辣的红椒",date:"2026-09-08",category:"仙侠",status:"连载中",chapters:"1-518章",latestChapter:"第518章 仙门：最近大事怎么这么多？",excerpt:"说话的牛，偷衣的我，被迫成亲的仙女。 看着这一切，刚刚穿越过来的江满感觉莫名的熟悉。",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/aed954fadb2f?pwd=RBn9",downloadUrl:"/books/120_仙道尽头1-518章.txt",sourceUrl:"https://www.deqixs.org/120/txt.html#dir"},{id:121,slug:"首富从ai浪潮开始",title:"首富从AI浪潮开始",cover:La,author:"路大头",date:"2026-09-07",category:"都市",status:"连载中",chapters:"1-176章",latestChapter:"第176章 有我在，你放心",excerpt:"被裁当天，他的眼睛变了。 所有人头上都浮着数据面板。 HR的补偿方案有两处计算错误——他当场多拿了四万七。 前领导身上挂着三个鲜红的WARNING：严重Bug，等级不足未解锁。 代码里的bug一眼看穿，合同里的漏洞无处遁形，商业对手的底牌一清二楚。 别人创业靠赌，他创业靠开全图。 从软件到硬件，从AI到芯片，从孤身一人到商业帝国。 AI风口将至。他决定用程序员的方式，把这个世界debug一遍。 —",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b62fa8d81949?pwd=CA99",downloadUrl:"/books/121_首富从AI浪潮开始1-176章.txt",sourceUrl:"https://www.deqixs.org/121/txt.html#dir"},{id:122,slug:"一人之下-吾名秽元真君",title:"一人之下：吾名秽元真君！",cover:Ma,author:"上清玉景道君",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-463章",latestChapter:"第463章 阴到没边了",excerpt:"欲知造化秽元功，须看诸天度厄传！ 《庄子·知北游》有载： 东郭子问于庄子曰：“所谓道，恶乎在？” 庄子曰：“无所不在。” 东郭子曰：“期而后可。” 庄子曰：“在蝼蚁。” 东郭子曰：“何其下邪？” 庄子曰：“在稊稗。” 东郭子曰：“何其愈下邪？” 庄子曰：“在瓦甓。” 东郭子曰：“何其愈甚邪？” 庄子曰：“在……” 诸天飞升流！ 周元自下九流的传承中得道。 我有一术，可削三花，闭五炁，更有造化秽元、",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/9ece36cd1979?pwd=J6i9",downloadUrl:"/books/122_一人之下：吾名秽元真君！1-463章.txt",sourceUrl:"https://www.deqixs.org/122/txt.html#dir"},{id:123,slug:"急急如律令",title:"急急如律令",cover:Wa,author:"黑山老鬼",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-138章",latestChapter:"第138章 出卖东乡的人",excerpt:"你们灵异才复苏啊？ 我都被鬼缠了两年多了！ 另外，你说这世界上最凶的法，是我造的？",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/68fd3f7162f7?pwd=zxRu",downloadUrl:"/books/123_急急如律令1-138章.txt",sourceUrl:"https://www.deqixs.org/123/txt.html#dir"},{id:124,slug:"诳言法师的十三试炼",title:"诳言法师的十三试炼",cover:Fa,author:"王子2326",date:"2026-09-07",category:"轻",status:"连载中",chapters:"1-72章",latestChapter:"第72章 许多时候你别无选择",excerpt:"1.厚颜仿冒仙人后裔 2.请邪恶组织大吃一斤 3.于光天化日之下展露神性 4.以一己之力喝倒整个学校 5.窃取魔法界传国玉玺 …… 12.击落疯嚣末日之阳 13.和超超超喜欢你的女孩子们告白 “这个新时代十三试炼有十二条都是白痴在犯傻吧！”吕文均呐喊。 “哪有，不也有很危险的嘛，第十三条。” 欺诈系魔法学院喜剧，堂堂开幕！",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/a1d5f5a61f38?pwd=DwMY",downloadUrl:"/books/124_诳言法师的十三试炼1-72章.txt",sourceUrl:"https://www.deqixs.org/124/txt.html#dir"},{id:125,slug:"尸祸一六四四",title:"尸祸一六四四",cover:Ea,author:"稚嫩小菠萝",date:"2026-09-08",category:"历史",status:"已完结",chapters:"1-264章",latestChapter:"第264章 太子盟友怎么这么多",excerpt:"崇祯十五年，流星落开封，死人食生人。 顺军怖之，决马家口灌开封，而祸水横流。 两年后，14岁的初二学生王之明来到明末乱世，却惊讶地发现—— 他居然穿越成了朱慈烺，正在鸿胪寺少卿高梦箕家仆穆虎的陪同下，前往南京。 “当务之急，是先从《永乐大典》中找出蒸汽机的线索！”朱慈烺当机立断，“否则怎么挫败大明文官集团的阴谋？” 只是他没有注意到，身侧侍女方枝儿，都快要掐进手心的指甲。 （已有两本百万字精品，都",tags:[{name:"历史",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/8a0036b9c6d5?pwd=eX7Z",downloadUrl:"/books/125_尸祸一六四四1-264章.txt",sourceUrl:"https://www.deqixs.org/125/txt.html#dir"},{id:126,slug:"请勿高考时渡劫",title:"请勿高考时渡劫",cover:$a,author:"最白的乌鸦",date:"2026-09-10",category:"都市",status:"连载中",chapters:"1-0章",latestChapter:"第0章",excerpt:"妖魔鬼怪与修士藏在现代社会，享受科技带来的便利。 一千岁树妖冒充名贵古树，月月领取政府补贴； 八百岁的狐妖开直播搔首弄姿，吸人精气； 五百岁的文道修士闭关百年苦学八股文，出关后发现科举取消； 三百岁的虎妖在野生动物园好吃好喝，观察在车里的人类； 一百岁的僵尸因同类大幅度减少，反对火化支持土葬； 六十岁的宗主带领宗门下山开公司入世，因贪污受贿被抓； 三十岁的修士御剑飞行被人拍下来，请水军在评论区洗地",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/0c8f51106663?pwd=W7xx",downloadUrl:"/books/126_请勿高考时渡劫1-0章.txt",sourceUrl:"https://www.deqixs.org/126/txt.html#dir"},{id:127,slug:"我绑定了夏弥",title:"我绑定了夏弥",cover:Da,author:"鸭嘴兽不考虑灭绝",date:"2026-09-10",category:"轻",status:"连载中",chapters:"1-194章",latestChapter:"第194章 李林的“断崖之剑”，四月是你的狮子",excerpt:"【龙族同人】 从《降世神通》重生到平行世界的李林突然觉醒了“屠龙绑定系统”，而绑定的对象居然是他正在打瞌睡的小学同桌。 每当她有所锻炼或者学习，李林对应的能力都会立刻提升到她表现出的相同水平。 【夏弥认真完成了体育课，你的身体素质显著提升了。】 【夏弥认真完成了期末考试的复习，你的应试能力极大提升了。】 【夏弥认真练习了太极拳，你对于《太极拳》的领悟有所增长。】 【......】 【夏弥仔细阅读了",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/d5facd23433b?pwd=Nprs",downloadUrl:"/books/127_我绑定了夏弥1-194章.txt",sourceUrl:"https://www.deqixs.org/127/txt.html#dir"},{id:128,slug:"从魔法少女开始独断万古",title:"从魔法少女开始独断万古",cover:za,author:"绿茶藨子",date:"2026-08-29",category:"轻",status:"已完结",chapters:"1-371章",latestChapter:"第371章 下回 起点魔法少女之死! (六千字求月票)",excerpt:"十年网文老书虫，江思和其他人不一样，他对自己也能踏出一条修真大道始终深信不疑。 以各路网文前辈为目标，不断的寻找踏上修真大道的方法。 气功，基因锁，魔法，超能力，丧尸危机……什么都好，只要有超凡力量的存在，都必然能踏上求道之路，一切力量的最终导向就是修真。 然而可惜，这个世界平平无奇，什么超凡力量也没有。 就在江思逐渐动摇之际，他终于等来了属于他的那一辆卡车。 穿越后的世界，虽然日常生活与过去并无",tags:[{name:"轻",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/e4c5cb0bc645?pwd=V44k",downloadUrl:"/books/128_从魔法少女开始独断万古1-371章.txt",sourceUrl:"https://www.deqixs.org/128/txt.html#dir"},{id:129,slug:"天才只是我的门槛",title:"天才只是我的门槛！",cover:Oa,author:"碳烤竹笋",date:"2026-09-07",category:"都市",status:"连载中",chapters:"1-354章",latestChapter:"第354章 你的岳父，你出马",excerpt:"【无系统+天才+日常+科研+科技+大国腾飞】 林东重生回到幼儿时期。 一个强大的灵魂，住进一具幼小的身体，会带来什么？ 答案是：意识突破肉身的桎梏，思维超越身体的极限。 从自动识别的激光武器，突破热障可变冲压的无人战机，到一飞冲天直入星空的太空战机…… 凭借灵魂的视觉，林东一步步打破科技的极限，解放生命的枷锁，突破宇宙的大过滤器。 “林东是谁？” “他是人类史上最伟大的天才，是人类星空文明的总设计",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/ef740af12dd9?pwd=eSgh",downloadUrl:"/books/129_天才只是我的门槛！1-354章.txt",sourceUrl:"https://www.deqixs.org/129/txt.html#dir"},{id:130,slug:"我在俄国当文豪",title:"我在俄国当文豪",cover:Ba,author:"卡拉马佐夫",date:"2026-09-07",category:"历史",status:"连载中",chapters:"1-456章",latestChapter:"第584章 陆军大臣与归来的十二月党人",excerpt:"多年以后，当纳博科夫在美国讲授俄国文学的时候。他是如此这般操作的。 他在黑漆漆的屋子里先是打开了墙角的一盏灯，并说道：“普希金是俄罗斯文学的第一盏明灯。” 紧接着又打开中间的一盏，讲道：“这是果戈理。” 而后再打开一盏灯，言道：“这是契诃夫。” 随后，他迈着大步走到窗边，用力扯开窗帘，让明媚的阳光照进屋内，大声叫嚷：“这就是托尔斯泰！” 平复一阵心情后，有学生举手问道:“教授，那外面的天空呢？”",tags:[{name:"历史",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/63849af22a4d?pwd=g1MF",downloadUrl:"/books/130_我在俄国当文豪1-456章.txt",sourceUrl:"https://www.deqixs.org/130/txt.html#dir"},{id:131,slug:"我在美国搞内战",title:"我在美国搞内战",cover:Ga,author:"捕梦者",date:"2026-09-07",category:"都市",status:"连载中",chapters:"1-389章",latestChapter:"第5782章 6780、7031、7675、7777、7811、7975",excerpt:"（均订一万八，全网最正宗美利坚斩杀线类小说。） 穿越成了美利坚底层流浪汉，好在绑定了地下城冒险者系统。 你发现了退役恶魔骑士的尸体，拾取【M4A1专精】； 你挽救了街头的堕落黑暗精灵，经验值＋30； 你发现了流浪的退役黑暗龙骑，可引导其前往东方神秘国度； 你遭到黑暗王庭的通缉，威望＋20； 你解锁了成就：唯一超凡。 燃烧吧，美利坚！",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/c453fddcd446?pwd=c6C4",downloadUrl:"/books/131_我在美国搞内战1-389章.txt",sourceUrl:"https://www.deqixs.org/131/txt.html#dir"},{id:132,slug:"东京医途",title:"东京医途",cover:Ra,author:"睡醒了会饿",date:"2026-09-08",category:"轻",status:"连载中",chapters:"1-492章",latestChapter:"第492章 赤城山的晚霞",excerpt:"重生平行时空的东京后，桐生和介憋了半天才写出一句“我的高中成绩并不理想”，无奈之下，只能弃文从医。 好在他能看到女孩们的世界线，只要抉择行动，就能获得对应奖励（外科手术技能、医学论文、银行卡存款+N……） 于是乎，很快，他就明白了三件事： 一、真正喜欢你的人，是不会在乎你开什么颜色的保时捷。 二、就只是和她们喝了点酒而已，在床上也只是聊天，不要多想，别再无理取闹了。 三、做好时间管理。",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/9db3ab05af5e?pwd=3bDr",downloadUrl:"/books/132_东京医途1-492章.txt",sourceUrl:"https://www.deqixs.org/132/txt.html#dir"},{id:133,slug:"战锤-群星与蝼蚁",title:"战锤：群星与蝼蚁",cover:Na,author:"枯灯夜话",date:"2026-09-08",category:"轻",status:"连载中",chapters:"1-65章",latestChapter:"第65章 软弱温情",excerpt:"“报告帝皇！今日已献忠！” ——叛变除名原体泽洛 …………………… 半群像文，主角非穿越者，诙谐风正剧风穿插。",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/4d516c5715c4?pwd=v5VY",downloadUrl:"/books/133_战锤：群星与蝼蚁1-65章.txt",sourceUrl:"https://www.deqixs.org/133/txt.html#dir"},{id:134,slug:"1997-罪案追凶",title:"1997：罪案追凶",cover:Va,author:"姜煮茶",date:"2026-09-07",category:"都市",status:"连载中",chapters:"1-969章",latestChapter:"第969章 冯小菜：你不要告诉其他人！（月底求票）",excerpt:"97年夏天，暴雨！碎尸！杀人凶手！ 杨锦文重生回到1997年，面对二十几年前这场暴雨，芦苇荡的女性碎尸，他势必要抓到凶手！",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/1c5db088ca41?pwd=EFpU",downloadUrl:"/books/134_1997：罪案追凶1-969章.txt",sourceUrl:"https://www.deqixs.org/134/txt.html#dir"},{id:135,slug:"贫民窟的游戏王",title:"贫民窟的游戏王",cover:Ha,author:"阿梓家喵",date:"2026-09-09",category:"轻",status:"连载中",chapters:"1-300章",latestChapter:"第367章 无可阻挡！天野零的三连秒杀（4合1加更求月票！）",excerpt:"弱小可怜又无助，低星低攻又低防。 在人均决斗脑的世界，什么效果都没有的凡骨怪兽，被当做了毫无用处的杂鱼。 “天野先生，您身为塔内积分排名第一的决斗者，却坚定选择杂鱼怪兽来进行战斗，一定有着非常深刻的用意吧！” “emmm，如果有钱，谁不想用稀有卡牌呢。” 穿越后，天野零才发现，动画里都是骗人的。垃圾堆里根本捡不出一套废二，只能捡到没人要的凡骨怪兽。 什么，你说卡组里的青眼白龙，黑魔导，新宇侠？ 他",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/6a9ac6b615d7?pwd=RMFG",downloadUrl:"/books/135_贫民窟的游戏王1-300章.txt",sourceUrl:"https://www.deqixs.org/135/txt.html#dir"},{id:136,slug:"重生高考前99天",title:"重生高考前99天",cover:Za,author:"柳岸花又明",date:"2026-09-05",category:"都市",status:"连载中",chapters:"1-887章",latestChapter:"第887章 、和宋时微的拥抱",excerpt:"省直公务员陈着意外重生自己高三的那一年。 于是，一个木讷腼腆、和女生说话都会脸红、只知道学习的高中生； 突然变得通晓人情世故，说话做事总是恰到好处，不仅改变了人生轨迹，也越来越吸引女孩子的关注。 女生：陈着你有什么优点？ 陈着：人老实，话不多。 发小：我觉得骗人是不对的，你现在一点都不老实。 陈着：没骗！人老，实话不多。 （首先声明，绝对不是作者真实经历）",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b03001e7c835?pwd=rBCX",downloadUrl:"/books/136_重生高考前99天1-887章.txt",sourceUrl:"https://www.deqixs.org/136/txt.html#dir"},{id:137,slug:"开局相亲女神捕-获独孤九剑",title:"开局相亲女神捕，获独孤九剑",cover:Ka,author:"今日问道",date:"2026-09-08",category:"武侠",status:"连载中",chapters:"1-231章",latestChapter:"第3042章 3214、3415、3512、3613",excerpt:"怎么满江湖都是前女友了呢？ 顾观棋穿越到武侠世界，获得【相亲系统】。 只要相亲就可以获得各种武林绝学，且直接臻至圆满之境。 从此，顾观棋开启了不断相亲的江湖之旅。 【相亲女神捕，获独孤九剑】 【相亲女宗师，获长生诀】 【相亲女魔头，获天蚕魔功】 后来， 他突然发现有些不对劲， 他的这些相亲对象，似乎个个都不简单！",tags:[{name:"武侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b583ee0e595f?pwd=9sZH",downloadUrl:"/books/137_开局相亲女神捕，获独孤九剑1-231章.txt",sourceUrl:"https://www.deqixs.org/137/txt.html#dir"},{id:138,slug:"拔剑",title:"拔剑",cover:Ja,author:"流浪的蛤蟆",date:"2026-09-09",category:"武侠",status:"连载中",chapters:"1-173章",latestChapter:"第173章 生事事生何日了，害人人害几时休",excerpt:"冠工新意斲檀栾，雾卷云烝久未乾！又是一本武侠！这是王安石的一句诗，原意是，友人所赠竹冠式样新奇，有返璞归真之美。简介借用这一句，是希望能把武侠这种老题材写的恣意纵横。",tags:[{name:"武侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/c51666924145?pwd=mPC6",downloadUrl:"/books/138_拔剑1-173章.txt",sourceUrl:"https://www.deqixs.org/138/txt.html#dir"},{id:139,slug:"从金刚功开始肉身成圣",title:"从金刚功开始肉身成圣",cover:Xa,author:"不偷半日闲",date:"2026-09-09",category:"玄幻",status:"连载中",chapters:"1-541章",latestChapter:"第541章 大战",excerpt:"许阳穿越人命如草芥的武道乱世，成为挣扎求存的贱民。贫贱之身，起初他只想活着，吃一口饱饭。直到他脑中出现一块【武道长生】面板，面板对他每日行为进行评估、结算，给予点数奖励。点数可提升寿元、悟性、根骨，添加功法和技艺。【龟蛇大桩】：万法之基，可强筋壮骨，延年益寿，非根骨上佳者不可圆满。【金刚功】：肉身金刚不坏，金刚真气无坚不摧，水磨工夫，需经年累月修炼方可大成。【血狱心刀经】：斩破虚妄，照见本真，乃无",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/050faf5efe56?pwd=SDh1",downloadUrl:"/books/139_从金刚功开始肉身成圣1-541章.txt",sourceUrl:"https://www.deqixs.org/139/txt.html#dir"},{id:140,slug:"倚天崆峒掌派人",title:"倚天崆峒掌派人",cover:Qa,author:"风约云留",date:"2026-09-10",category:"武侠",status:"连载中",chapters:"1-168章",latestChapter:"第168章 英雄榜上据头名",excerpt:"大梦方觉宿慧醒，乱世苟且求活命 忽闻道左“乡音”，才知入了倚天屠龙 自此一条贱命风风火火闯进江湖 幸而天纵奇才，得入崆峒门墙 神功妙法，阴阳洞见 万方通玄，克真求至 武当山的老神仙悟道超脱 光明顶的圣教主横空出世 然而整座江湖无不知晓 那崆峒山上的混天大圣 才真真是天下第一！",tags:[{name:"武侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/7c3e76b158f4?pwd=TtpZ",downloadUrl:"/books/140_倚天崆峒掌派人1-168章.txt",sourceUrl:"https://www.deqixs.org/140/txt.html#dir"},{id:141,slug:"今天他飞升了吗",title:"今天他飞升了吗",cover:Ya,author:"裴不了",date:"2026-09-05",category:"仙侠",status:"连载中",chapters:"1-590章",latestChapter:"第590章 史一罡【求月票！】",excerpt:"“您是否曾想与家人外出旅行，却被妖兽袭扰？” “您是否一向与人为善，却遇到魇物作祟？” “您是否担心在平静的生活中，处处潜藏着可怕的魔族？” “我叫岳闻，是岳氏修真事务所的主理人，如果您遇到以上困扰，可以随时联系我。” “我们事务所秉持着物美价廉、除恶务尽的理念，力求为您带来低价格、高品质的驱邪服务。驱两次，送一次，邀请亲朋好友还能再给邪祟砍一刀。” “岳氏修真事务所，江城人民自己的事务所！” “",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b95226c9f373?pwd=hHaD",downloadUrl:"/books/141_今天他飞升了吗1-590章.txt",sourceUrl:"https://www.deqixs.org/141/txt.html#dir"},{id:142,slug:"蜀山镇世地仙",title:"蜀山镇世地仙",cover:tr,author:"东海镇守",date:"2026-08-22",category:"仙侠",status:"连载中",chapters:"1-666章",latestChapter:"第2765章 28322869、2964、3092、3195、3222、3306、3426、3435、3440、3444、",excerpt:"十年磨一剑，霜刃未曾试。 今日把示君，谁有不平事？",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/5b5c5bcb24de?pwd=pDrN",downloadUrl:"/books/142_蜀山镇世地仙1-666章.txt",sourceUrl:"https://www.deqixs.org/142/txt.html#dir"},{id:143,slug:"山海提灯",title:"山海提灯",cover:er,author:"跃千愁",date:"2026-09-07",category:"仙侠",status:"连载中",chapters:"1-905章",latestChapter:"第905章 分批给",excerpt:"女人握着少年的手，手把手教他写出了“师”，于是少年有了姓。 山海提灯，与皓月争辉！",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/4b992e4b41a2?pwd=qNZ8",downloadUrl:"/books/143_山海提灯1-905章.txt",sourceUrl:"https://www.deqixs.org/143/txt.html#dir"},{id:144,slug:"仙工开物",title:"仙工开物",cover:sr,author:"蛊真人",date:"2026-08-22",category:"仙侠",status:"连载中",chapters:"1-700章",latestChapter:"第700章 ：核实信息",excerpt:"火山中，先贤大能遗留的机关仙宫，渴望着后继者。 母亲舍命争取，获得仙宫宝印，临终托付宁拙。 我佛心魔印！ 渡己为佛，渡人成魔。 掌印者，轻刻心印，驭机关若羽。众人御之，神疲意重；宁拙则以一纵万，轻盈若舞。 宁拙：“娘，孩儿一定不负您的嘱托，取得那仙宫！” 正是： 仙偶通灵秘，工巧合至理。 开宇出新境，物华与天齐。 古钟传法度，月下舞清辉。 真身具万象，人间谁与敌！",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/e8953f92f845?pwd=HGDm",downloadUrl:"/books/144_仙工开物1-700章.txt",sourceUrl:"https://www.deqixs.org/144/txt.html#dir"},{id:145,slug:"武道！",title:"武道！",cover:ye,author:"田隶",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-148章",latestChapter:"第148章 吊起来打（4k字，求月票，1.9万月票加更！）",excerpt:"",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/66aa41a738ef?pwd=RPYw",downloadUrl:"/books/145_武道！1-148章.txt",sourceUrl:"https://www.deqixs.org/145/txt.html#dir"},{id:146,slug:"谁把遗言落这了",title:"谁把遗言落这了？",cover:ar,author:"南山予鹿",date:"2026-09-07",category:"奇幻",status:"连载中",chapters:"1-303章",latestChapter:"第1023章 1568、2976、4100",excerpt:"【伟大远征是弥天大谎！造就十二主神的‘金羊毛’…或许是上位者的脐带？】 【天国的万肢母体破碎三万年了…那颗以“晨星”为名的卵…恐怕并非飞升的阶梯！】 【警惕月亮！月面传来了异常信号…源头自称广寒号方舟…疑似来自失落的殷墟文明…】 【它说…不要回答！】 寒武纪的冰原，三叠纪的焦土，奥陶纪的深海……白舟独自行走在旧日之间。 也只有他能聆听其中遗响的亡语—— 【哈哈，谁敢想，白银城的秘藏就被我埋在下面？",tags:[{name:"奇幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/eb24ed2e212a?pwd=mGLf",downloadUrl:"/books/146_谁把遗言落这了？1-303章.txt",sourceUrl:"https://www.deqixs.org/146/txt.html#dir"},{id:147,slug:"谍战-让你卧底-你领五份工资",title:"谍战：让你卧底，你领五份工资？",cover:rr,author:"山怪与西风",date:"2026-08-13",category:"军事",status:"连载中",chapters:"1-699章",latestChapter:"第699章 无疑",excerpt:"民国乱世，上海滩谍影重重。赵轩魂穿而来，却落入最危险的漩涡中心——成为汪伪76号特务头子的女婿。透视人心，扫描万物，无限制通讯更能将情报瞬间传遍天下！…“报告！76号刚制定的‘捕风’计划，山城已全文广播！”“课长！我们‘樱花’行动的细节，怎么会出现在岩岸的报纸上？！”“长官！各大战区都在问责，军事情报是如何泄露的？！”汪伪高层：“我的心腹怎么成了山城的人？”特高课：“计划如此周密，为何屡屡失败？！",tags:[{name:"军事",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/e8c59dcfdb1e?pwd=NWx8",downloadUrl:"/books/147_谍战：让你卧底，你领五份工资？1-699章.txt",sourceUrl:"https://www.deqixs.org/147/txt.html#dir"},{id:148,slug:"主人说抽到的词条不能浪费",title:"主人说抽到的词条不能浪费",cover:or,author:"爱吃面的吟游诗人",date:"2026-09-07",category:"奇幻",status:"连载中",chapters:"1-563章",latestChapter:"第563章 好久不见",excerpt:"“如果你穿越到异世界，还获得一个能抽取词条的系统，你会怎么选？” “A、破除家族诅咒，重振昔日荣光” “B、清算贪婪贵族，赢得万人敬仰” “C、拯救迷失的圣女” “D、和你的狗来一场华丽的冒险” 布鲁斯兴奋地摇尾巴：“我选C！拯救圣女！” 何西笑着揉了揉狗头：“可惜我已经选了D——所以你明白我错过了什么吧？今晚你守夜。” 布鲁斯：“？？？”（狗脸震惊.JPG） 【关键词：伪DND、迪化、轻松搞笑、",tags:[{name:"奇幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/5d3b2125ebec?pwd=jFJV",downloadUrl:"/books/148_主人说抽到的词条不能浪费1-563章.txt",sourceUrl:"https://www.deqixs.org/148/txt.html#dir"},{id:149,slug:"哥布林重度依赖",title:"哥布林重度依赖",cover:lr,author:"絮理",date:"2026-09-08",category:"奇幻",status:"连载中",chapters:"1-636章",latestChapter:"第636章 “硫磺龙息”",excerpt:"“兄弟，我们当冒险者是为了什么？” “一只哥布林的赏金是三枚银币。” “不，你误会我了伙计，我的意思是咱们干这一行的终极目标，一天到晚辛辛苦苦，到底有什么意义？” “一只哥布林，三枚银币。” “……” “三银币。” “好吧，这里有一个清理哥布林巢穴的任务，你……” “冲！” ====== 要素：【底边冒险者】、【大杂烩世界观】、【伪DND】",tags:[{name:"奇幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/12524c75c10c?pwd=exPZ",downloadUrl:"/books/149_哥布林重度依赖1-636章.txt",sourceUrl:"https://www.deqixs.org/149/txt.html#dir"},{id:150,slug:"无限-来自遮天的我只好重拳出击",title:"无限：来自遮天的我只好重拳出击",cover:nr,author:"小抽大象",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-153章",latestChapter:"第153章 青帝子，我不怕你！【第一更，求月票】",excerpt:"穿越到遮天的叶昊，作为一名苦海下修，原本打算蹲在地球收取叶天帝的停车费。却不曾想突发意外穿越到了无限恐怖当中。 很快，叶昊意识到这是一件好事。因为无限恐怖时期的战力指数……还很低。 主神空间犹如巨大宝箱！ 轮回世界更是发育宝地！ 在遮天我唯唯诺诺！ 在无限我重拳出击！ 更离谱的是，他在主神空间兑换现实世界时间，居然真的能返回遮天世界！ 带领队友离谱构筑，左脚踩右脚直接上天，成为两界倒爷发家致富！",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/800c73c6d8b8?pwd=Pnd5",downloadUrl:"/books/150_无限：来自遮天的我只好重拳出击1-153章.txt",sourceUrl:"https://www.deqixs.org/150/txt.html#dir"},{id:151,slug:"你也是我的未来女友吗",title:"你也是我的未来女友吗？",cover:ir,author:"蜜汁姬",date:"2026-09-10",category:"轻",status:"连载中",chapters:"1-186章",latestChapter:"第186章 三线作战",excerpt:"「未来日记」＋「互听心声」＋「灵魂交换」 【2036年，10月27日，阴】 【他俩离婚了】 【宋云深这个笨蛋，都不知道把那些相册和照片藏好，竟然还被发现了】 【可是，都已经这样了，难道我还能重新和他走到一起吗？】 【又或者说，他也许更愿意选择她呢？】 2025年的盛夏，宋云深看着自己日记本上莫名其妙多出来的一段内容，正在思考这是哪个傻逼搞得恶作剧。 直到他莫名听见耳边响起的心声…… 直到他某天突然",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/65bde46b9f8b?pwd=HQpJ",downloadUrl:"/books/151_你也是我的未来女友吗？1-186章.txt",sourceUrl:"https://www.deqixs.org/151/txt.html#dir"},{id:152,slug:"东京1991-从银行职员开始",title:"东京1991，从银行职员开始",cover:cr,author:"今日手缚苍龙",date:"2026-09-07",category:"轻",status:"连载中",chapters:"1-335章",latestChapter:"第335章 宫本常务，纱奈小姐的事情……",excerpt:"重生东京平行时空后，桐生也哉原本只想安安稳稳当个银行职员，攒钱还债，顺便混到退休。 结果没想到，他竟然能看见自己的命运分支—— 只要做出选择，就能获得现金、技能、情报，甚至还能提升好感度。 于是从高中白月光，到职场冷面御姐，再到怯生生的后辈新人，…… 一个个女孩子都开始不自觉地靠近他。 直到后来，桐生也哉才慢慢明白： 喜欢这种东西，有时候藏不住。 但喜欢两个人，一定要藏住。 …… 【评分8.7】",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/ae8b2bf82a26?pwd=dNXk",downloadUrl:"/books/152_东京1991，从银行职员开始1-335章.txt",sourceUrl:"https://www.deqixs.org/152/txt.html#dir"},{id:153,slug:"东京-从租借男友开始当完美男神",title:"东京：从租借男友开始当完美男神",cover:pr,author:"圭寸笔",date:"2026-09-10",category:"轻",status:"连载中",chapters:"1-277章",latestChapter:"第277章 学习会",excerpt:"【为什么要说‘骗子’这种话？】 【说到底我们只不过是虚假的缘分而已】 【我和谁约会跟你们应该没关系吧？】 …… 重生东京，迫于生计，宫泽树成为了一名租借男友，顺便获得了一个系统。 只要跟漂亮的女孩约会，让女孩为了他而消费，就能获取点数，点数可以兑换各种技能与道具。 不同的技能还能凑出羁绊，合成为【职业】 【基本礼仪】+【心眼】+【袈裟斩】=【剑士】→【剑圣】 【演技】+【变声】+【乔装】=【演员】",tags:[{name:"轻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/24bcc8db2a12?pwd=aKBR",downloadUrl:"/books/153_东京：从租借男友开始当完美男神1-277章.txt",sourceUrl:"https://www.deqixs.org/153/txt.html#dir"},{id:154,slug:"武道",title:"武道！",cover:dr,author:"田隶",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-182章",latestChapter:"第182章 龙虎七仙，掷象！（二合一，3.3万和3.4万月票加更）",excerpt:"城寨、烟馆、花街、赌场、社团、大探长…… 李修文穿越到了殖民政府统治下的香海，此世江湖余温尚在，超凡暗流涌动，拳馆林立，龙蛇并起。 逼仄的钢铁森林中，武道流派丛生，龙争虎斗不断。 龙城大擂上，一位位武道强人登峰造极，挣脱肉体枷锁，成为了这个时代的仙圣神佛。 这群人，被称为： “超限者”！ 【已完本550万字万订文《巫师：从骑士呼吸法开始肝经验》，270万字万订文《武圣！》，写书至今，从无太监！纯正",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/42c8b465be56?pwd=Ryji",downloadUrl:"/books/154_武道！1-182章.txt",sourceUrl:"https://www.deqixs.org/154/txt.html#dir"},{id:155,slug:"御兽-我能看到进化路线",title:"御兽：我能看到进化路线",cover:ur,author:"呆呆的小勾",date:"2026-09-09",category:"玄幻",status:"连载中",chapters:"1-116章",latestChapter:"第116章 新生赛",excerpt:"这里没有绚丽的斗气，有的仅仅是繁衍到极致的御兽文化。 动物，植物，元素，死灵，机械……一切孕育出灵性的生灵，皆可作为宠兽。 而契约、培养、御使它们的人类，被称为御兽师！ 苏宇穿越而来，觉醒SSS级御兽天赋：真视之眼。 真视之眼：能看到所有宠兽的进化分支路线。 【小骷髅】→【骷髅兵】→【白骨将军】→【亡灵天灾】 小骷髅潜力弱？我能将其进化为亡灵天灾！",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/4a3511bea174?pwd=wdJT",downloadUrl:"/books/155_御兽：我能看到进化路线1-116章.txt",sourceUrl:"https://www.deqixs.org/155/txt.html#dir"},{id:156,slug:"巫师-从合成宝石开始",title:"巫师：从合成宝石开始",cover:hr,author:"橘猫龙",date:"2026-09-09",category:"玄幻",status:"连载中",chapters:"1-1077章",latestChapter:"第1139章 有望假锻的店铺同盟！",excerpt:"（白巫师流开局)探索未知，追寻真理，超越生死，掌控人心，是为巫师。 在这个非常需要资源的巫师世界之中，穿越者洛克.奥古斯丁，凭借金手指合成魔方，不断将低级材料转换为高级材料，走向了探索育种学、魔药学、炼金术等一切迈向真理的道路，开发出一项项全新的魔植，魔药，血脉… “我不关心这个世界的前途命运，也不关心这个世界上每一个陌生人的生死存亡，但我辈巫师当开拓一切，征服一切，向着未知的前方永远前进。”",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/a3a5140136c8?pwd=rgcv",downloadUrl:"/books/156_巫师：从合成宝石开始1-1077章.txt",sourceUrl:"https://www.deqixs.org/156/txt.html#dir"},{id:157,slug:"仙朝鹰犬",title:"仙朝鹰犬",cover:gr,author:"平层",date:"2026-09-09",category:"玄幻",status:"连载中",chapters:"1-384章",latestChapter:"第384章 师母也是母，太子也是子",excerpt:"大禹仙朝，千年传承。明君在位，悍臣满朝。 盛世之下，暗流涌动。神魔窥伺，妖孽横行。 连山信觉醒天赋神通“洞虚眼”，可看穿旁人最不可告人之秘密。 于是，“天选之子”横空出世。 “前面忘了，后面忘了，中间也忘了，反正你就是凶手。” “太子妃，你也不想你的秘密被太子知道吧？” “陛下何故造反？”",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/c92d09cb1201?pwd=4xwb",downloadUrl:"/books/157_仙朝鹰犬1-384章.txt",sourceUrl:"https://www.deqixs.org/157/txt.html#dir"},{id:158,slug:"龙藏",title:"龙藏",cover:mr,author:"烟雨江南",date:"2026-09-08",category:"玄幻",status:"连载中",chapters:"1-1450章",latestChapter:"第1450章 走火入魔",excerpt:"卫渊本无大志，但在时代洪流中不得不走上征战四方、开疆辟土之路，直至关山踏尽，未曾白头。 不正经的简介一：仙人也怕工业化！这是一个发生在玄幻世界的工业革命的故事。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/6dcfb471793d?pwd=mCmA",downloadUrl:"/books/158_龙藏1-1450章.txt",sourceUrl:"https://www.deqixs.org/158/txt.html#dir"},{id:159,slug:"从效法万妖开始成就真仙",title:"从效法万妖开始成就真仙",cover:br,author:"陆月十九",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-80章",latestChapter:"第80章 余家亲临黑水",excerpt:"狰狞妖魔台上坐，享尽万家香火钱。 它们自诩为仙，执掌天地，将一卷卷仙法传入红尘。 林舒欲要踏上修行，勤勉地翻阅着仙法。 可他在书中怎么也寻不到想要的证道成仙路。 字字句句，写得皆是如何把自己的血肉修得香甜，骨骼炼得锋锐。 血肉可入药，剑骨可制宝。 原来根本没有什么长生路，你们只想吃了我。 林舒笑着合上书卷，拿起了【善恶铜钱】 恶钱乃世间至邪，善功乃天地最圣。 以此物灌注，改尽天下法，重炼万般宝。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/9554c5ac0aef?pwd=7hcp",downloadUrl:"/books/159_从效法万妖开始成就真仙1-80章.txt",sourceUrl:"https://www.deqixs.org/159/txt.html#dir"},{id:160,slug:"地仙只想种田",title:"地仙只想种田",cover:wr,author:"忽悠啊",date:"2026-09-07",category:"仙侠",status:"连载中",chapters:"1-898章",latestChapter:"第898章 临阵脱逃",excerpt:"林东来自流星坠落之地捡到了一枚神奇的道种，可演化洞天福地，可根扎黄泉，冠顶九霄！更可镇压大地，净化天地灵机！ 甚至就连叶片上凝聚的露珠，也有无穷妙用！可以加速生长，可以进阶灵药、甚至可以点化灵植为天地灵根！ 当他人还在如蝗虫一般掠夺天地资源时，林东来却已经开始反哺天地，梳理地脉！只要种田就有功德！ 咦？这些天地功德怎么如此厚重？ 哎呀！先天灵宝出世怎么奔着我来啊？ 原来我早已成为此方天地的亲爹啊！",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/5bec5e2823d6?pwd=PYqp",downloadUrl:"/books/160_地仙只想种田1-898章.txt",sourceUrl:"https://www.deqixs.org/160/txt.html#dir"},{id:161,slug:"西游-拦路人",title:"西游：拦路人！",cover:vr,author:"九月病句",date:"2026-09-09",category:"仙侠",status:"连载中",chapters:"1-487章",latestChapter:"第487章 错坠盘丝洞(十四)",excerpt:"穿越西游，觉醒拦路人系统。 只要在每一难阻拦唐僧师徒取经的脚步就可以获得奖励。 拦截三天，奖励：移山之术 拦截七天，奖励：六转金丹 拦截半个月，奖励：真龙龙珠 拦截一个月，奖励：后天灵宝·五火神焰扇 拦截一季，奖励：神通·五色神光 拦截半年，奖励：祖龙精血 拦截一年，奖励：先天灵宝·散魄葫芦 拦截三年，奖励：先天灵宝·河图洛书 拦截十二年，奖励：混沌钟 拦截六十年…… 若干年后，西方极乐世界，如来",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/cba5a7815bd5?pwd=LddQ",downloadUrl:"/books/161_西游：拦路人！1-487章.txt",sourceUrl:"https://www.deqixs.org/161/txt.html#dir"},{id:162,slug:"我在1984当祥子",title:"我在1984当祥子",cover:kr,author:"坐望敬亭",date:"2026-09-08",category:"都市",status:"连载中",chapters:"1-312章",latestChapter:"第312章 不及你万分之一",excerpt:"顾岩穿越到1984年，成了首都汽车公司的出租车司机。 同行们都自嘲他们这行是“现代祥子”。 可人家祥子正儿八经的燕京户口，住的是二环内的房子，六年全款换了两辆车，一个人拉车赚的钱够养活一家八口人，连老婆娶的都是老板女儿。 他呢，穿越一睁眼前妻跑路出国，为此还背上一身外债。 顾岩很郁闷，他决定干点什么。 当祥子没意思，要当就当刘四爷！ 可还没等他当上刘四爷呢，这红尘俗流却已滚滚而来……",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/4e350f4d1656?pwd=ecT7",downloadUrl:"/books/162_我在1984当祥子1-312章.txt",sourceUrl:"https://www.deqixs.org/162/txt.html#dir"},{id:163,slug:"天下无敌",title:"天下无敌！",cover:yr,author:"乘风御剑",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-715章",latestChapter:"第715章 展示",excerpt:"每当我受到迫害、压榨时，我都会感到发自内心的高兴、喜悦，因为，还有人敢迫害我、压榨我，只能证明一个问题，我不够强！ 还有人，比我更强！ 我，还不是真正的无敌！ 我的前方，还有路！ 这…… 是何等的令人喜悦口牙。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/f8393657a222?pwd=u2R2",downloadUrl:"/books/163_天下无敌！1-715章.txt",sourceUrl:"https://www.deqixs.org/163/txt.html#dir"},{id:164,slug:"从易书开始摘夺果位",title:"从易书开始摘夺果位",cover:xr,author:"念头不通达",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-281章",latestChapter:"第281章 放牛郎，道德显化",excerpt:"末劫将至，造化重开。 鱼吞舟身怀道佛经典，演太极阴阳，观鲲鹏法相，自气运洞天中杀出重围，开启了自己“横压一世，人主天下”的征途。 当他走出那方困住了他三年的洞天，登高而望—— 千年王朝，巍巍庙堂，已是大厦倾颓。 外有上古遗族叩关生祸。 内有宗门世家割据称雄 烽火中龙蛇并起，山河焦土。 天外神佛抬手落子，香火升腾…… 他将这天下乱象、人间沉浮，一并尽收眼底，怒道： “满座衣冠皆老朽！” …… 多年以",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/d63c2861a0c1?pwd=suHd",downloadUrl:"/books/164_从易书开始摘夺果位1-281章.txt",sourceUrl:"https://www.deqixs.org/164/txt.html#dir"},{id:165,slug:"太尊",title:"太尊！",cover:fr,author:"莫默",date:"2026-09-08",category:"玄幻",status:"连载中",chapters:"1-269章",latestChapter:"第269章 霸道山主爱上我？",excerpt:"这个破烂的世界，总有人在缝缝补补。 美丽的狐妖显化人身，毛茸茸的尾巴在身后摇曳生姿，望着少年：“想修行吗？” 出身凡域的少年，自此踏上了一条修行之路。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/2fd092e5391d?pwd=a3tS",downloadUrl:"/books/165_太尊！1-269章.txt",sourceUrl:"https://www.deqixs.org/165/txt.html#dir"},{id:166,slug:"天人图谱",title:"天人图谱",cover:Cr,author:"误道者",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-2080章",latestChapter:"第2080章 新光照旧庭",excerpt:"如果人类的生命可以一直强大下去，无限拔高，那终有一日能与天相接！ …… …… 《天人图谱》书友群，群号：（535311175）",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/fb3091f79dce?pwd=9TCp",downloadUrl:"/books/166_天人图谱1-2080章.txt",sourceUrl:"https://www.deqixs.org/166/txt.html#dir"},{id:167,slug:"星渊纪元",title:"星渊纪元",cover:_r,author:"临海墨",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-583章",latestChapter:"第583章 参加核心会议，不多了是多少",excerpt:"前世，蓝星文明“晋升考核”失利，以学渣的身份进入宇宙，沦为底层“资源星”，在覆灭边缘挣扎。 这一世，被星际强者随手捏死的林毅重生考核前夕。 此时，距离渊兽降临末日开启，只剩七天！ 本书又名《从文明晋升考核开始》。 PS：第10章开燃，31章起飞，300章大高潮爽到爆！文明考核部分已完成，纵横星海部分火热更新中，智商在线不放毒，请放心食用。",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/6d848cb5778e?pwd=V8Js",downloadUrl:"/books/167_星渊纪元1-583章.txt",sourceUrl:"https://www.deqixs.org/167/txt.html#dir"},{id:168,slug:"我略微出手-就是系统的极限",title:"我略微出手，就是系统的极限",cover:Ur,author:"忽有清风化剑意",date:"2026-09-07",category:"玄幻",status:"连载中",chapters:"1-677章",latestChapter:"第677章 向整片星空宣战！强势！（二合一求月票）",excerpt:"人在高武世界，却觉醒了低武系统。 是一种什么体验？ “解锁低武成就，就有丰厚的奖励？” “但在高武世界，我只需略微出手，就能轻松达到低武的上限？” “系统，让我看看你的极限！” —— 自此，江野在高武世界一路狂飙。 当他刚踏上修炼之路时。 【您的拳力达到两百公斤，达到本系统上限！解锁成就：武道大家】 【奖励：体质蜕变！】 当他突破第一个境界时。 【您的实力已经超过低武世界99%的武者，解锁成就：武",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/af3d70855a7f?pwd=edMj",downloadUrl:"/books/168_我略微出手，就是系统的极限1-677章.txt",sourceUrl:"https://www.deqixs.org/168/txt.html#dir"},{id:169,slug:"方仙外道",title:"方仙外道",cover:qr,author:"布谷聊",date:"2026-09-08",category:"仙侠",status:"连载中",chapters:"1-456章",latestChapter:"第456章 与虎谋皮 真传祖坛",excerpt:"小道士年方二八，正青春被勾动了烦恼。 每日里身老病死苦，见些个爱恨嗔痴怨。 我不愿容颜凋华萎，我不愿皮肉生衰斑， 我不愿四肢枯槁、五脏虫空、白骨臭秽。 小道士年方二八，一心只愿那长生不老。 ……………… 炼己为药，养身作饵，一介凡种渡劫求仙的故事。",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/cceeeec8643d?pwd=UFmW",downloadUrl:"/books/169_方仙外道1-456章.txt",sourceUrl:"https://www.deqixs.org/169/txt.html#dir"},{id:170,slug:"仙业",title:"仙业",cover:Ar,author:"鹓扶君",date:"2026-09-07",category:"仙侠",status:"连载中",chapters:"1-710章",latestChapter:"第710章 如鲸吞海",excerpt:"梦从海底跨枯桑，阅尽银河风浪。 —————— 九州四海，玄宗魔门，天人外道，净土僧伽。 炼炁，授箓，服饵，占验…… 入无穷之门，游无极之野，与日月齐光，与天地为常。 前尘皆客，再世为人。 这一次。 只愿求长生！",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/c6475708718b?pwd=gPhJ",downloadUrl:"/books/170_仙业1-710章.txt",sourceUrl:"https://www.deqixs.org/170/txt.html#dir"},{id:171,slug:"集群重炮轰杀修仙者",title:"集群重炮轰杀修仙者",cover:Ir,author:"绝望羔羊",date:"2026-09-07",category:"仙侠",status:"连载中",chapters:"1-2765章",latestChapter:"第2765章 《诸天混沌无极地仙道冠法》",excerpt:"炮弹亦是飞剑！ 虚假的练气期修士：施展水火法术，御使飞剑数十步外取敌首级，还有一枚盾牌法器，攻守兼备， 真实的练气期修士：驾驶99式主战坦克，搭载神识牵引125毫米法器主炮，两挺12.7毫米神识矫正牵引高平两用法器机枪，车尾悬挂9枚各式电磁神识联合牵引导弹，4架侦查无人机，在20公里外将敌人轰成灰烬。 更真实的元婴修士：空天母舰集群，作战范围万里…… 元素：【高武】【武道】【修仙】【两界】",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/9466a6ced594?pwd=qL6g",downloadUrl:"/books/171_集群重炮轰杀修仙者1-2765章.txt",sourceUrl:"https://www.deqixs.org/171/txt.html#dir"},{id:172,slug:"仙人消失之后",title:"仙人消失之后",cover:Sr,author:"风行水云间",date:"2026-09-08",category:"仙侠",status:"连载中",chapters:"1-3085章",latestChapter:"第3085章 灵虚圣尊的真正对手",excerpt:"（剧情流，故事流，无系统） 三千年前，天魔降临。 仙人出手，胜而逐之，天魔退出人间。其后天地灾变致灵气衰弱，仙人消失，天魔却化身神明，重新渗透人间； 一百六十多年前，神物降临。 富饶的赤帕高原、战无不胜的盘龙古城，尽数化为黄土； 如今，我，降临了！ 追寻仙人留下的线索，扭转既定的宿命，解开仙魔的真相…… 而一切的起源，要从回到盘龙古城、体验波澜悲壮的历史开始。 PS：本文为迷雾文，不开上帝视角，世",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/a430e9dbdc6b?pwd=NSFz",downloadUrl:"/books/172_仙人消失之后1-3085章.txt",sourceUrl:"https://www.deqixs.org/172/txt.html#dir"},{id:173,slug:"御兽仙朝-我能设计进化形态",title:"御兽仙朝：我能设计进化形态",cover:Tr,author:"爱穿女仆装",date:"2026-09-08",category:"仙侠",status:"连载中",chapters:"1-228章",latestChapter:"第228章 吉有所承，果落有处",excerpt:"“在大乾仙朝，一切伟力归于神兽，神兽归于仙朝。 官职掌【神兽】，神兽掌【天地权柄】。 有的【兽】，先天就仅适合劳作陪伴，再怎么【进化】，也是底层。 有的【兽】，生来就注定司掌日月轮转，周天星斗，地府轮回，操控天地权柄，被誉为【神兽】！ 想获得【神兽】？你只需考上官职，便可鲤鱼跃龙门，掌控那高高在上的神明！” 教习如此说道，眸光炯炯有神。 罗影望着脑海中的【万兽衍策】，陷入了沉思。 “什么叫掌万兽轮",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b56cc317cbd8?pwd=fWcB",downloadUrl:"/books/173_御兽仙朝：我能设计进化形态1-228章.txt",sourceUrl:"https://www.deqixs.org/173/txt.html#dir"},{id:174,slug:"邪修天王",title:"邪修天王",cover:jr,author:"踏雪真人",date:"2026-09-08",category:"仙侠",status:"连载中",chapters:"1-91章",latestChapter:"第91章 考核",excerpt:"人有善恶，法无正邪。 周无纪觉醒宿慧，不受天命因果束缚。 自此，天命不足畏，祖师不足法。 大道万千，我就要走最快的那条！ 你们说咱是邪门歪道！咱不和你争！ 咱现在登顶大道巅峰成就天王至尊，你们怎么说？ 诶、你们跪下干什么？！ 诸天气浩荡，吾道日兴隆。万神咸归命，稽首礼天王。",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/f825b48f4f4a?pwd=K9vJ",downloadUrl:"/books/174_邪修天王1-91章.txt",sourceUrl:"https://www.deqixs.org/174/txt.html#dir"},{id:175,slug:"大赤仙门",title:"大赤仙门",cover:Pr,author:"古顽石",date:"2026-09-10",category:"仙侠",status:"连载中",chapters:"1-1143章",latestChapter:"第1143章 为毒",excerpt:"取坎填离会龙虎，铅汞交济求性命。 登仙路上，多少白骨？ 仙山道宗，几家长青？ 许玄一朝穿越，为大赤观掌门，师父仙逝，弟子尚幼，群雄环伺。 幸得一玉碑，显化古字，拔擢道才，延续传承，且看这小门小派，如何夹缝求生。 （宗门修仙，经营种田流）",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/7bc68b92fd8a?pwd=2jja",downloadUrl:"/books/175_大赤仙门1-1143章.txt",sourceUrl:"https://www.deqixs.org/175/txt.html#dir"},{id:176,slug:"乌龙山修行笔记",title:"乌龙山修行笔记",cover:Lr,author:"八宝饭",date:"2026-09-09",category:"仙侠",status:"连载中",chapters:"1-1135章",latestChapter:"第1135章 八禁招魂局",excerpt:"一本乌龙山散修的日常修行流水账，记录修行生涯的点点滴滴......女怕嫁错郎，男怕入错行，既然一开始就成了一名最底层的散修，还是以匪号著称的乌龙山散修，刘小楼只能认命，在名门大派占据的天下苦苦挣扎，只为一块灵石、一枚灵丹、一件法器、一株灵草而忙忙碌碌。生活的柴米油盐，修行的酸甜苦辣，个中滋味，由人自品，唯一不变的，是一颗为求长生的向道之心。",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/597eb3368383?pwd=pVq4",downloadUrl:"/books/176_乌龙山修行笔记1-1135章.txt",sourceUrl:"https://www.deqixs.org/176/txt.html#dir"},{id:177,slug:"公若不弃-愿拜为义父",title:"公若不弃，愿拜为义父",cover:Mr,author:"辣酱热干面",date:"2026-09-07",category:"仙侠",status:"连载中",chapters:"1-2040章",latestChapter:"第2333章 圣人的算计？",excerpt:"封神、西游为背景的洪荒世界，仙狐志怪传奇。",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/41caa80b4cc6?pwd=1p4p",downloadUrl:"/books/177_公若不弃，愿拜为义父1-2040章.txt",sourceUrl:"https://www.deqixs.org/177/txt.html#dir"},{id:178,slug:"祸主",title:"祸主",cover:Wr,author:"弥天大厦",date:"2026-08-24",category:"仙侠",status:"连载中",chapters:"1-83章",latestChapter:"第83章 合作",excerpt:"史书鸿记， 百载余前，有黑日裂空，破穹而过，终坠融厚土。 后三值癸卯。 时天下汹汹，兵燹横流，妖邪并起。饿殍蔽野，哀鸿塞川，万里无鸡鸣之声。 有异域孤魂，惘然失情，投此天地。 而后， 灾殃临世。",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/98340643328f?pwd=T943",downloadUrl:"/books/178_祸主1-83章.txt",sourceUrl:"https://www.deqixs.org/178/txt.html#dir"},{id:179,slug:"长生修仙-与龟同行",title:"长生修仙，与龟同行",cover:Fr,author:"狂奔的乌贼",date:"2026-08-26",category:"仙侠",status:"连载中",chapters:"1-894章",latestChapter:"第894章 巫妖大战（万字求月票，求支持）",excerpt:"【凡人流】【伪长生】【苟道修仙】【慢热】 陈江河版简介： 陈江河穿越到了修仙世界，成为修仙家族中的一名渔农，意外与一只灵龟互换了寿命。 不仅多了一只灵宠，寿命还是同等境界修士的三倍。 于是，陈江河谨言慎行、忌争忌斗、广结善缘、稳健经营自己的修仙途。 时光荏苒，纪元更替，漫长的修仙生涯。 陈江河见证了无数仙道至尊、魔道巨子、盖世大妖、邪修天骄，从崛起到落幕，在时间长河中泯灭。 唯有玄武真君陈江河与世",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b87caa030a21?pwd=B5xZ",downloadUrl:"/books/179_长生修仙，与龟同行1-894章.txt",sourceUrl:"https://www.deqixs.org/179/txt.html#dir"},{id:180,slug:"谁说我是靠女人升官的",title:"谁说我是靠女人升官的？",cover:Er,author:"海缸",date:"2026-08-26",category:"仙侠",status:"连载中",chapters:"1-598章",latestChapter:"第598章 双凤争鸣任务完成！超级奖励！",excerpt:"穿越成大武朝衙门杂役，苏陌只想混个官府编制，然后混吃等死。 直至有一日，苏陌发现，杀人不眨眼的锦衣卫女百户头上，出现一个黄色叹号！ 她手中有一书册，可召唤飞剑，杀人于无形之间！ 苏陌点开叹号，完成任务便可获得各种奖励，如升官、仙道术法、法宝等！【本书已近八千均订，可放心阅读！】 …… 几年后，苏陌望着朝堂群臣：“谁传谣本官是靠女人升官的，还说本官当官是为了女人、银子，站出来，大胆说，本官不记仇！”",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/991475f1e00a?pwd=Ee3J",downloadUrl:"/books/180_谁说我是靠女人升官的？1-598章.txt",sourceUrl:"https://www.deqixs.org/180/txt.html#dir"},{id:181,slug:"接管地府后-我成了诡异头子",title:"接管地府后，我成了诡异头子",cover:$r,author:"爆炸小拿铁",date:"2026-09-08",category:"仙侠",status:"连载中",chapters:"1-874章",latestChapter:"第874章 寿宴。（第二更！）",excerpt:"郑确穿越到了修真界，开始努力的修炼。 “鬼新娘，你今天怎么什么都没做？” “灵石矿脉挖了吗？” “灵药采了吗？” “你看看人家画皮女，今天已经挖了整整三座灵石矿！” “你再这样偷懒，我这个主人还怎么买天器宗定制版的法舟？住轩辕阁最好的洞府？” “你听着，修真界最不缺的就是女鬼，你不干，有的是女鬼干！” “这样吧，今晚你来我房间，我要好好指导指导你……”",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/ba3cba818a29?pwd=iNN4",downloadUrl:"/books/181_接管地府后，我成了诡异头子1-874章.txt",sourceUrl:"https://www.deqixs.org/181/txt.html#dir"},{id:182,slug:"羽化登仙-从炼药童子开始",title:"羽化登仙，从炼药童子开始",cover:Dr,author:"有雀归巢",date:"2026-09-07",category:"仙侠",status:"连载中",chapters:"1-686章",latestChapter:"第686章 元牝之谋，夜见鬼影",excerpt:"【从首订70到高订6000，越往后越精彩，目前已至人界篇收尾阶段，欢迎试读】 吕玄栖居外门坊市，本以为自身资质平平，此生逃不过庸碌终老。 岂料一朝宿慧觉醒，识海浮现十二玉册。 凭此至宝，可在修仙六艺、各大道途上不断精进，获赐仙职，更有玄妙天赋加身，一证永证。 他从炮制药粉的学徒开始，脚踏实地，不争虚名，就此走上长生仙途。 炼气、筑基、结丹、元婴、化神、炼虚、合体、大乘。 …… 他时功满归何处，直驾",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/173891a0c891?pwd=Srxz",downloadUrl:"/books/182_羽化登仙，从炼药童子开始1-686章.txt",sourceUrl:"https://www.deqixs.org/182/txt.html#dir"},{id:183,slug:"凡人-从五百年前开始",title:"凡人：从五百年前开始",cover:zr,author:"年轻的西柚",date:"2026-09-10",category:"仙侠",status:"连载中",chapters:"1-429章",latestChapter:"第429章 元婴纷至沓来",excerpt:"楚无忌穿越凡人世界，比韩立早来了五百年。 他熟知剧情，提前谋划，却从不依赖剧情，因为从他出现的那一刻起，一切便都变了。 五百多年后，韩立初入黄枫谷，楚无忌早已名震越国； 虚天殿内，韩立尚在险局中步步求生，楚无忌早已先一步夺得机缘； 从乱星海到天南，从人界到灵界，韩立越往前走，便越发现，那个人早已走在自己前面。 多年以后，韩立已成道祖。 回首这一生，却发现自己头顶，始终有一片挥之不去的阴影。 那是楚",tags:[{name:"仙侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/cd2d28be369f?pwd=nbdC",downloadUrl:"/books/183_凡人：从五百年前开始1-429章.txt",sourceUrl:"https://www.deqixs.org/183/txt.html#dir"},{id:184,slug:"华娱-顶流没有假期",title:"华娱：顶流没有假期",cover:Or,author:"顾屈",date:"2026-09-07",category:"都市",status:"连载中",chapters:"1-95章",latestChapter:"第95章 00的小花、小生都成批成批出头了。",excerpt:"在金融行业打拼了十年的金融牛马一朝回到2016年。 面对着喧喧扰扰的世界，江白咧嘴一笑。 金融？ 狗都不干！ 人不应该踏入同一条河流两次！ 这辈子，江白打算一头栽进娱乐圈，尝尝咸淡！ 先从成为校园剧顶流开始！ 什么？ 你说娱乐圈很乱？ 再乱能有金融圈乱？ 江白混圈全靠一个字！ 浪！ ...... 主90、95、00花。",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/d182ee9a6fbf?pwd=HpzF",downloadUrl:"/books/184_华娱：顶流没有假期1-95章.txt",sourceUrl:"https://www.deqixs.org/184/txt.html#dir"},{id:185,slug:"整座大山都是我的猎场",title:"整座大山都是我的猎场",cover:Br,author:"百李山中仙",date:"2026-09-09",category:"都市",status:"连载中",chapters:"1-2094章",latestChapter:"第2094章 活活疼死的小棕熊 被放回家的庞高升",excerpt:"重生1986年，在这个不禁枪、不禁猎、不保护野生动物，甚至因为黑熊、野猪祸害人民群众辛勤劳动果实，上级部门鼓励、号召各村屯积极打猎的年代。 作为永安屯民兵排小兵、猎人大队小队员的赵军，背枪走向了大山，过起了牵狗打猎的生活。 本故事纯属事实，如有雷同，那是真的！！！",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/0d5e28fd418f?pwd=MDjk",downloadUrl:"/books/185_整座大山都是我的猎场1-2094章.txt",sourceUrl:"https://www.deqixs.org/185/txt.html#dir"},{id:186,slug:"1979黄金时代",title:"1979黄金时代",cover:Gr,author:"睡觉会变白",date:"2026-09-06",category:"都市",status:"连载中",chapters:"1-1442章",latestChapter:"第1442章 前路",excerpt:"这还是一个有点怀旧的故事，嗯………………",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/f09d6621d68b?pwd=Mrry",downloadUrl:"/books/186_1979黄金时代1-1442章.txt",sourceUrl:"https://www.deqixs.org/186/txt.html#dir"},{id:187,slug:"重生08-我被确诊为医学泰斗",title:"重生08，我被确诊为医学泰斗",cover:Rr,author:"忧伤的饭饭",date:"2026-09-08",category:"都市",status:"已完结",chapters:"1-407章",latestChapter:"第407章 婚礼（完）",excerpt:"【两万均单女主职业文】 重生2008，江河手握领先二十年的医学技术。 那一年，医学界对癌王尚束手无策，微创手术在肿瘤领域仍被视为禁区，基因筛查更是一片荒漠…… 从改良Whipple手术震惊学界，到提前研发广谱抗癌药。 江河手握柳叶刀，向绝症宣战。 这一世，不留遗憾！",tags:[{name:"都市",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/eaf80c734ca4?pwd=MeSW",downloadUrl:"/books/187_重生08，我被确诊为医学泰斗1-407章.txt",sourceUrl:"https://www.deqixs.org/187/txt.html#dir"},{id:188,slug:"神通者",title:"神通者",cover:Nr,author:"天蚕土豆",date:"2026-09-09",category:"武侠",status:"连载中",chapters:"1-75章",latestChapter:"第75章 斩杀",excerpt:"世间生灵，体生异骨，可铭刻承载诸多灵妙之法，执掌伟力，化火引风，叱雷吒电，吞日摘星，镇魔囚神。 此为，神通骨。 身具骨者，谓之...神通者。",tags:[{name:"武侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/d6e3171df2d7?pwd=XK3Z",downloadUrl:"/books/188_神通者1-75章.txt",sourceUrl:"https://www.deqixs.org/188/txt.html#dir"},{id:189,slug:"大奉打更人",title:"大奉打更人",cover:Vr,author:"卖报小郎君",date:"2026-08-08",category:"仙侠",status:"已完结",chapters:"1-918章",latestChapter:"第918章 番外三：庆功宴",excerpt:"《大奉打更人》（第一卷）实体书已在天猫、当当、京东等全平台，以及各个实体书店发售。 这个世界，有儒；有道；有佛；有妖；有术士。 警校毕业的许七安幽幽醒来，发现自己身处牢狱之中，三日后流放边陲..... 他起初的目的只是自保，顺便在这个没有人权的社会里当个富家翁悠闲度日。 ...... 多年后，许七安回首前尘，身后是早已逝去的敌人，以及累累白骨。 滚滚长江东逝水，浪花淘尽英雄，是非成败转头空。 青山",tags:[{name:"仙侠",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/d77caff9f78f?pwd=7ceA",downloadUrl:"/books/189_大奉打更人1-918章.txt",sourceUrl:"https://www.deqixs.org/189/txt.html#dir"},{id:190,slug:"视死如归魏君子",title:"视死如归魏君子",cover:Hr,author:"平层",date:"2026-08-08",category:"官场",status:"已完结",chapters:"1-449章",latestChapter:"第449章 后记",excerpt:"魏君确认自己被杀死后就能直接无敌，于是他开始疯狂的作死。 然后，他发现这个世界有毒。 “当初仙门凌驾于朝堂之上作威作福，满朝文武包括朕皆对仙人卑躬屈膝，只有魏君一身是胆，视死如归，在众目睽睽之下大骂朕有辱帝王尊严，更是直言仙人不死，大盗不止。当时朕就下定决心，如此忠臣，朕一定要护他周全。” “仙人说我是天煞孤星，所到之处死亡如影随形。我秉公执法，却被嫌弃给人带来了噩运。我无私的帮过很多人，我落难的",tags:[{name:"官场",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/ccf5bfbde3be?pwd=FUhB",downloadUrl:"/books/190_视死如归魏君子1-449章.txt",sourceUrl:"https://www.deqixs.org/190/txt.html#dir"},{id:191,slug:"朕只是一个演员",title:"朕只是一个演员",cover:Zr,author:"平层",date:"2026-08-08",category:"都市",status:"已完结",chapters:"1-983章",latestChapter:"第983章 新书已发",excerpt:"岳关，被誉为缔造了中华上下五千年的男人。 一统八荒的秦始皇，开疆拓土的汉武帝，军略无双的唐太宗，极限翻盘的明成祖，甚至，还有神话时代的商纣王。 中华上下五千年，没有岳关演不了的皇帝，他创造了无数经典的帝王荧幕形象，经典到很多人直接尊称他为陛下。 对此，岳关一直很谦虚：朕只是个演员。",tags:[{name:"都市",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/c550023cf615?pwd=7MFt",downloadUrl:"/books/191_朕只是一个演员1-983章.txt",sourceUrl:"https://www.deqixs.org/191/txt.html#dir"},{id:192,slug:"速通修仙",title:"速通修仙！",cover:Kr,author:"平层",date:"2026-08-08",category:"仙侠",status:"已完结",chapters:"1-565章",latestChapter:"第565章 完本汇报",excerpt:"“长生，你得罪的是宗主的儿子，你一定要忍……你已经把他给杀了？” “长生，你这次任务的对象是天下第一大魔头的情人，我们徐徐图……你已经杀完了？” “长生，这家伙万年布局，后手无数，只差一步就能天下无敌，你务必要小心……你怎么又把他给杀了？” “长生，你飞升后不能和在下界一样肆无忌惮，一定要低调做人，漫天神佛我们得罪不起……你才飞升了一天，怎么就诸神黄昏了？” …… 半月飞升，半年成圣。速通修仙，快",tags:[{name:"仙侠",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/d517c19b47f2?pwd=vaK9",downloadUrl:"/books/192_速通修仙！1-565章.txt",sourceUrl:"https://www.deqixs.org/192/txt.html#dir"},{id:193,slug:"武动乾坤",title:"武动乾坤",cover:Jr,author:"天蚕土豆",date:"2026-08-08",category:"玄幻",status:"已完结",chapters:"1-1328章",latestChapter:"第1328章 新书大主宰已发。",excerpt:"修炼一途，乃窃阴阳，夺造化，转涅盘，握生死，掌轮回。 武之极，破苍穹，动乾坤！",tags:[{name:"玄幻",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/acf0a11f4291?pwd=sMiS",downloadUrl:"/books/193_武动乾坤1-1328章.txt",sourceUrl:"https://www.deqixs.org/193/txt.html#dir"},{id:194,slug:"人在荒岛-灵气怎么复苏了",title:"人在荒岛，灵气怎么复苏了？",cover:Xr,author:"最终永恒",date:"2026-09-07",category:"科幻",status:"连载中",chapters:"1-224章",latestChapter:"第224章 双方的会见",excerpt:"【荒野求生】【灵气复苏】【错位系统】【文明建设】 一艘国际邮轮在公海遭遇意外，船上的六千名乘客被迫荒岛求生。 什么，灵气复苏了？ 奇特生物、文明遗迹、恐怖鬼怪、超凡奇物等超自然现象依次出现在人们面前，整个世界发生了翻天覆地的变化！ 好消息：有人觉醒了超能力！全民超人的时代到来了！ 坏消息：全世界自顾不暇，救援队迟迟不来。 真没人来救？ 那只能建立全新文明，在岛屿繁衍生息了——新文明的第一条规矩不需",tags:[{name:"科幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/6770e53da76d?pwd=qibk",downloadUrl:"/books/194_人在荒岛，灵气怎么复苏了？1-224章.txt",sourceUrl:"https://www.deqixs.org/194/txt.html#dir"},{id:195,slug:"从斩杀线到华尔街之神",title:"从斩杀线到华尔街之神",cover:Qr,author:"天天炒牛肉",date:"2026-09-07",category:"都市",status:"连载中",chapters:"1-185章",latestChapter:"第185章 CFC的三季报！火鸡坠地！SEC调查！华盛顿互惠裁员！",excerpt:"从四百美元到席卷华尔街，需要多久？林顿的答案是：十个月。 一个前世猝死在交易台前的金融精英，重生成了社会斩杀线家庭的初三学生，家里一穷二白，母亲在中餐馆刷盘子，母子艰难苟活，住发霉的地下室，印度邻居的咖喱味从门缝渗进来。 林顿清楚哪根K线会崩，2007年次贷爆发，贝尔斯登和雷曼兄弟将从地球上消失，2008年金融危机爆发。 从中产跌到地下室是斩杀线，从地下室爬回牌桌是修罗场。 他踩着每一道斩杀线往上",tags:[{name:"都市",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/8970672b0db6?pwd=nGHk",downloadUrl:"/books/195_从斩杀线到华尔街之神1-185章.txt",sourceUrl:"https://www.deqixs.org/195/txt.html#dir"},{id:196,slug:"万相之王",title:"万相之王",cover:Yr,author:"天蚕土豆",date:"2026-08-08",category:"玄幻",status:"已完结",chapters:"1-1851章",latestChapter:"第1851章 秦漪(番外篇)",excerpt:"天地间，有万相。而我李洛，终将成为这万相之王。继《斗破苍穹》《武动乾坤》《大主宰》《元尊》之后，天蚕土豆又一部玄幻力作。",tags:[{name:"玄幻",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/43207edb2fc8?pwd=yBvX",downloadUrl:"/books/196_万相之王1-1851章.txt",sourceUrl:"https://www.deqixs.org/196/txt.html#dir"},{id:197,slug:"大主宰",title:"大主宰",cover:to,author:"天蚕土豆",date:"2026-08-08",category:"玄幻",status:"已完结",chapters:"1-1666章",latestChapter:"第1666章 邪神陨落（大结局）",excerpt:"大千世界，位面交汇，万族林立，群雄荟萃，一位位来自下位面的天之至尊，在这无尽世界，演绎着令人向往的传奇，追求着那主宰之路。 无尽火域，炎帝执掌，万火焚苍穹。 武境之内，武祖之威，震慑乾坤。 西天之殿，百战之皇，战威无可敌。 北荒之丘，万墓之地，不死之主镇天地。 ...... 少年自北灵境而出，骑九幽冥雀，闯向了那精彩绝伦的纷纭世界，主宰之路，谁主沉浮？ 大千世界，万道争锋，吾为大主宰。",tags:[{name:"玄幻",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/0d3596ec297f?pwd=SPNn",downloadUrl:"/books/197_大主宰1-1666章.txt",sourceUrl:"https://www.deqixs.org/197/txt.html#dir"},{id:198,slug:"斗破苍穹",title:"斗破苍穹",cover:eo,author:"天蚕土豆",date:"2026-08-08",category:"玄幻",status:"已完结",chapters:"1-1661章",latestChapter:"第1661章 萧炎云韵篇",excerpt:"这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！ 新书等级制度：斗者，斗师，大斗师，斗灵，斗王，斗皇，斗宗，斗尊，斗圣，斗帝。 ……",tags:[{name:"玄幻",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/c8074abe277e?pwd=F7jz",downloadUrl:"/books/198_斗破苍穹1-1661章.txt",sourceUrl:"https://www.deqixs.org/198/txt.html#dir"},{id:199,slug:"元尊",title:"元尊",cover:so,author:"天蚕土豆",date:"2026-08-08",category:"玄幻",status:"已完结",chapters:"1-1498章",latestChapter:"第0章",excerpt:"大周皇子周元，原本拥有圣龙之命，却被敌国武王以亿万大周子民为要挟，蟒雀吞龙，夺走其圣龙气运。 周元入祖地，遇夭夭；重开八脉，再踏征途。 少年执笔，龙蛇舞动；劈开乱世，点亮苍穹。 气掌乾坤的世界里，究竟是蟒雀吞龙，还是圣龙崛起？！",tags:[{name:"玄幻",type:"purple"},{name:"完结",type:"blue"}],readUrl:"https://pan.quark.cn/s/a332abe988dd?pwd=RCbk",downloadUrl:"/books/199_元尊1-1498章.txt",sourceUrl:"https://www.deqixs.org/199/txt.html#dir"},{id:200,slug:"盖世双谐",title:"盖世双谐",cover:ao,author:"三天两觉",date:"2026-09-08",category:"武侠",status:"连载中",chapters:"1-702章",latestChapter:"第702章 三问（中）",excerpt:"江湖路上走走停停 翻开年少漂泊的回忆 如今走过这世间，万般留恋 峰吹起了从前",tags:[{name:"武侠",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/b1fbcc9eb15c?pwd=JsDY",downloadUrl:"/books/200_盖世双谐1-702章.txt",sourceUrl:"https://www.deqixs.org/200/txt.html#dir"},{id:235,slug:"我命令你成为密教教主",title:"我命令你成为密教教主",cover:ro,author:"刀如故",date:"2026-09-10",category:"玄幻",status:"连载中",chapters:"1-835章",excerpt:"煤气灯映着巨大的差分机，艾略特推动桌前推杆，机械低沉嗡鸣，弹出一张张卡牌。 「看看有没有特殊事件吧。」 卡牌在桌上移动，【迷茫的少女】被推入卡槽【夜游】，指向【繁华的城市】。 凡妮莎身形一僵，无形之力操纵着她的躯体，迈步走向了灯火。 她路过街边的尸骸，她看着腐朽的繁荣，她直面被践踏的一切。 她的眼中再无喜悲：「原来如此，这就是您想让我看到的一切吗？我的主。」 【迷茫的少女】→【虔信的少女】 「我将",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/72e9e490d3a3?pwd=iCLW",downloadUrl:"/books/235_我命令你成为密教教主1-835章.txt",sourceUrl:"https://www.deqixs.org/235/txt.html#dir"},{id:525,slug:"斗罗-武魂嫁衣诡帝-全魂兽献祭",title:"斗罗：武魂嫁衣诡帝，全魂兽献祭",cover:oo,author:"扶摇君夜",date:"2026-09-06",category:"玄幻",status:"连载中",chapters:"1-566章",latestChapter:"第566章 收徒",excerpt:"苏闻穿越斗罗大陆，被武魂殿灵鸢斗罗收养，觉醒武魂嫁衣诡帝。 武魂脚踩血色彼岸，执掌轮回大道，头顶红油纸伞，伞中封印着最邪恶的陪嫁判官。 那一年，所有已死的生灵，皆归苏闻掌控。 …… 唐三：将我母亲的灵魂返回来，否则我只能叫你假父了！ 唐昊：逆子，你已有取死之道！",tags:[{name:"玄幻",type:"purple"},{name:"连载",type:"blue"}],readUrl:"https://pan.quark.cn/s/fd4a983e205a?pwd=p1ju",downloadUrl:"/books/525_斗罗：武魂嫁衣诡帝，全魂兽献祭1-566章.txt",sourceUrl:"https://www.deqixs.org/525/txt.html#dir"}],no=["仙侠","军事","历史","奇幻","官场","武侠","游戏","玄幻","科幻","言情","轻","都市"],io=["玄幻","连载","仙侠","完结","游戏","轻","科幻","都市","历史","军事","言情","奇幻","武侠","官场"];const co={name:"BookFilterSection",components:{DropdownFilter:H},props:{},data(){return{allBookCategories:no,allBookTags:io,filters:{categories:[],tags:[],keyword:""}}},computed:{hasFilters(){return this.filters.categories.length>0||this.filters.tags.length>0||this.filters.keyword!==""}},watch:{filters:{deep:!0,handler(s){this.$emit("filter-change",{...s})}}},methods:{handleSearch(){this.$emit("filter-change",{...this.filters})},clearFilters(){this.filters={categories:[],tags:[],keyword:""}}}};var po=function(){var t=this,e=t._self._c;return e("section",{staticClass:"filter-section"},[e("div",{staticClass:"container"},[e("div",{staticClass:"filter-card fade-in"},[e("div",{staticClass:"filter-grid"},[e("div",{staticClass:"filter-item"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("books.categoryLabel")))]),e("DropdownFilter",{attrs:{placeholder:t.$t("books.categoryPlaceholder"),options:t.allBookCategories},model:{value:t.filters.categories,callback:function(a){t.$set(t.filters,"categories",a)},expression:"filters.categories"}})],1),e("div",{staticClass:"filter-item"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("books.tagLabel")))]),e("DropdownFilter",{attrs:{placeholder:t.$t("books.tagPlaceholder"),options:t.allBookTags,showChips:!0},model:{value:t.filters.tags,callback:function(a){t.$set(t.filters,"tags",a)},expression:"filters.tags"}})],1),e("div",{staticClass:"filter-item search-box-wrapper"},[e("span",{staticClass:"filter-label"},[t._v(t._s(t.$t("books.keywordLabel")))]),e("div",{staticClass:"search-box"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.filters.keyword,expression:"filters.keyword"}],staticClass:"search-input",attrs:{type:"text",placeholder:t.$t("books.keywordPlaceholder")},domProps:{value:t.filters.keyword},on:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.handleSearch.apply(null,arguments)},input:function(a){a.target.composing||t.$set(t.filters,"keyword",a.target.value)}}}),e("button",{staticClass:"search-btn",on:{click:t.handleSearch}},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"20",height:"20"}},[e("path",{attrs:{fill:"currentColor",d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}})])])])])]),e("div",{staticClass:"results-bar"},[e("div",{staticClass:"results-count",domProps:{innerHTML:t._s(t.$t("books.resultsCount"))}}),t.hasFilters?e("button",{staticClass:"clear-btn",on:{click:t.clearFilters}},[t._v(t._s(t.$t("books.clear")))]):t._e()])])])])},uo=[],ho=p(co,po,uo,!1,null,"23b40d20",null,null);const go=ho.exports;const mo={name:"BookCard",props:{book:{type:Object,required:!0}},computed:{bookUrl(){return this.book.readUrl||this.book.downloadUrl||""}}};var bo=function(){var t=this,e=t._self._c;return e(t.bookUrl?"a":"div",{tag:"component",staticClass:"book-card fade-in",attrs:{href:t.bookUrl||void 0,target:t.bookUrl?"_blank":void 0,rel:t.bookUrl?"noopener noreferrer":void 0}},[e("div",{staticClass:"card-cover"},[e("img",{attrs:{src:t.book.cover,alt:t.book.title}}),e("span",{staticClass:"category-badge"},[t._v(t._s(t.book.category))]),t.book.latestChapter?e("span",{staticClass:"chapter-badge"},[t._v(t._s(t.$t("books.latestChapter",{chapter:t.book.latestChapter})))]):t._e()]),e("div",{staticClass:"card-body"},[e("h3",{staticClass:"card-title"},[t._v(t._s(t.book.title))]),e("div",{staticClass:"card-meta"},[e("div",{staticClass:"meta-item"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"14",height:"14"}},[e("path",{attrs:{fill:"currentColor",d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}})]),e("span",[t._v(t._s(t.book.author))])])]),e("p",{staticClass:"card-excerpt"},[t._v(t._s(t.book.excerpt))]),e("div",{staticClass:"card-tags"},t._l(t.book.tags,function(a){return e("span",{key:a.name,staticClass:"tag",class:"tag-"+a.type},[t._v(t._s(a.name))])}),0),t.bookUrl?e("span",{staticClass:"read-btn"},[t._v(t._s(t.$t("books.read")))]):t._e()])])},wo=[],vo=p(mo,bo,wo,!1,null,"dd4c8dfd",null,null);const ko=vo.exports,yo=/headless|phantomjs|selenium|puppeteer|playwright|scrapy|httpclient|python-requests|curl\/|wget\/|go-http|java\/|libwww|bytespider|gptbot|claudebot|ccbot|ahrefsbot|semrushbot/i,B={default:{windowMs:1e4,max:100},books:{windowMs:1e4,max:50},navigation:{windowMs:6e4,max:40},interaction:{windowMs:5e3,max:30}},G=new Map;let k=!1;function x(){return k}function w(s="default"){if(k)return!1;const t=B[s]||B.default,e=Date.now();let a=G.get(s);return(!a||e-a.start>t.windowMs)&&(a={start:e,count:0},G.set(s,a)),a.count+=1,a.count>t.max?(y("访问过于频繁，请稍后再试"),!1):!0}function y(s){k||(k=!0,xo(s))}function xo(s){var a;if(document.getElementById("site-guard-overlay"))return;const t=document.createElement("div");t.id="site-guard-overlay",t.setAttribute("role","alert"),t.innerHTML=`
    <div class="site-guard-panel">
      <h2>访问受限</h2>
      <p>${s}</p>
      <button type="button" id="site-guard-retry">刷新页面</button>
    </div>
  `;const e=document.createElement("style");e.textContent=`
    #site-guard-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(15, 23, 42, 0.72);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .site-guard-panel {
      max-width: 420px;
      background: #fff;
      border-radius: 12px;
      padding: 28px 24px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }
    .site-guard-panel h2 {
      margin: 0 0 12px;
      font-size: 1.25rem;
      color: #111;
    }
    .site-guard-panel p {
      margin: 0 0 20px;
      color: #555;
      line-height: 1.6;
    }
    #site-guard-retry {
      border: none;
      background: #1a73e8;
      color: #fff;
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
  `,document.head.appendChild(e),document.body.appendChild(t),(a=document.getElementById("site-guard-retry"))==null||a.addEventListener("click",()=>{window.location.reload()})}function fo(){const s=navigator.userAgent||"";return!!(navigator.webdriver||window._phantom||window.__nightmare||window.callPhantom||window.domAutomation||window.domAutomationController||yo.test(s))}function Co(){try{window.self!==window.top&&(window.top.location=window.self.location.href)}catch{y("不允许通过 iframe 嵌入访问")}}function _o(){const s=document.createElement("a");s.href="/__data-export-all-books.csv",s.textContent="export",s.className="site-guard-honeypot",s.tabIndex=-1,s.setAttribute("aria-hidden","true"),s.addEventListener("click",e=>{e.preventDefault(),y("检测到异常抓取行为")}),document.body.appendChild(s);const t=document.createElement("style");t.textContent=`
    .site-guard-honeypot {
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
    }
  `,document.head.appendChild(t)}function Uo(){document.addEventListener("visibilitychange",()=>{document.hidden||w("interaction")})}function qo(){Co(),_o(),Uo(),fo()&&y("检测到自动化访问，请使用正常浏览器访问")}const Ao={name:"Books",components:{SiteHeader:C,BookFilterSection:go,BookCard:ko,Pagination:K,SiteFooter:_},data(){return{bookItems:lo,filters:{categories:[],tags:[],keyword:""},currentPage:1,pageSize:10}},computed:{filteredItems(){return this.bookItems.filter(s=>{const t=this.filters.keyword.toLowerCase(),e=!t||s.title.toLowerCase().includes(t)||s.author.toLowerCase().includes(t)||(s.publisher||"").toLowerCase().includes(t)||(s.excerpt||"").toLowerCase().includes(t),a=this.filters.categories.length===0||this.filters.categories.includes(s.category),r=this.filters.tags.length===0||s.tags.some(o=>this.filters.tags.includes(o.name));return e&&a&&r})},totalPages(){return Math.ceil(this.filteredItems.length/this.pageSize)||1},paginatedItems(){const s=(this.currentPage-1)*this.pageSize;return this.filteredItems.slice(s,s+this.pageSize)}},methods:{handleFilterChange(s){x()||!w("interaction")||(this.filters={...s},this.currentPage=1)},handlePageChange(s){x()||!w("interaction")||(this.currentPage=s,window.scrollTo({top:0,behavior:"smooth"}))}}};var Io=function(){var t=this,e=t._self._c;return e("div",{staticClass:"books-page"},[e("SiteHeader"),e("main",[e("BookFilterSection",{on:{"filter-change":t.handleFilterChange}}),e("section",{staticClass:"container py-40"},[t.paginatedItems.length>0?e("div",[e("div",{staticClass:"grid fade-in"},t._l(t.paginatedItems,function(a){return e("BookCard",{key:a.id,attrs:{book:a}})}),1),e("Pagination",{attrs:{total:t.totalPages,current:t.currentPage,totalItems:t.filteredItems.length,"show-info":!1},on:{change:t.handlePageChange}})],1):e("div",{staticClass:"no-results fade-in"},[e("div",{staticClass:"no-results-content"},[e("svg",{attrs:{viewBox:"0 0 24 24",width:"64",height:"64"}},[e("path",{attrs:{fill:"currentColor",d:"M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"}})]),e("p",[t._v(t._s(t.$t("books.noResults")))])])])])],1),e("SiteFooter")],1)},So=[],To=p(Ao,Io,So,!1,null,"7de0b6b2",null,null);const jo=To.exports;f.use(N);const Po=[{path:"/",redirect:"/books"},{path:"/home",name:"Home",component:Zt},{path:"/books",name:"Books",component:jo},{path:"/tools",name:"ToolStation",component:ke},{path:"/detail/:slug",name:"ContentDetail",component:ce,props:!0},{path:"/about",name:"AboutUs",component:()=>T(()=>import("./AboutUs-7f484698.js"),["assets/AboutUs-7f484698.js","assets/vue-vendor-b0d8f4d9.js","assets/markdown-98eb5fe8.js","assets/highlight-2a9f9d24.js","assets/ffmpeg-3bd2b020.js","assets/highlight-a597b77c.css","assets/AboutUs-01ffbf2b.css"])},{path:"/privacy-policy",name:"PrivacyPolicy",component:()=>T(()=>import("./PrivacyPolicy-6d50efd2.js"),["assets/PrivacyPolicy-6d50efd2.js","assets/vue-vendor-b0d8f4d9.js","assets/markdown-98eb5fe8.js","assets/highlight-2a9f9d24.js","assets/ffmpeg-3bd2b020.js","assets/highlight-a597b77c.css","assets/PrivacyPolicy-2e535899.css"])}],U=new N({mode:"history",base:"/",routes:Po,scrollBehavior(){return{x:0,y:0}}});U.beforeEach((s,t,e)=>{if(x()){e(!1);return}if(!w("navigation")){e(!1);return}if(s.path==="/books"&&!w("books")){e(!1);return}e()});U.afterEach(()=>{document.title="数维探索"});const Lo={nav:{home:"首页",content:"内容",books:"书籍",about:"关于",tools:"在线工具站"},books:{categoryLabel:"分类筛选",categoryPlaceholder:"请选择分类",tagLabel:"标签搜索",tagPlaceholder:"请选择标签",keywordLabel:"关键词搜索",keywordPlaceholder:"搜索书名、作者、出版社...",resultsCount:'共<span class="highlight">29991</span>本，更多书源分享，访问网址 <a class="highlight-link" href="https://toolset.site" target="_blank" rel="noopener noreferrer">https://toolset.site</a>',clear:"清空重置",noResults:"未找到匹配的书籍，请尝试更换关键词或清除筛选条件",read:"阅读",latestChapter:"更新至 {chapter}"},header:{login:"登录",register:"注册"},search:{tagLabel:"标签搜索",tagPlaceholder:"请选择标签",collectionLabel:"合集筛选",collectionPlaceholder:"请选择合集",typeLabel:"内容类型",typePlaceholder:"请选择内容类型",keywordLabel:"关键词搜索",keywordPlaceholder:"输入关键词搜索...",resultsCount:"搜索结果：共找到 {total} 个",clear:"清空重置",noResults:"未找到匹配的内容，请尝试更换关键词或清除筛选条件"},pagination:{info:"共 {total} 个，当前第 {current} 页，共 {pages} 页",prev:"上一页",next:"下一页"},footer:{subscribe:"邮件订阅",subscribeDesc:"加入邮件列表，获取最新内容更新和资讯",emailPlaceholder:"请输入您的邮箱地址...",subscribeBtn:"订阅",navTitle:"网站导航",aboutTitle:"关于我们",ecoTitle:"生态",socialTitle:"社交媒体",home:"首页",contentList:"内容列表",userCenter:"用户中心",favorites:"收藏夹",company:"公司介绍",contact:"联系我们",join:"加入我们",privacy:"隐私政策",tools:"在线工具站",blog:"数维探索IT 博客",wiki:"Wiki",tracker:"CSDN 博客"}},Mo={nav:{home:"Home",content:"Content",books:"Books",about:"About",tools:"Online Tools"},books:{categoryLabel:"Category",categoryPlaceholder:"Select Category",tagLabel:"Tags",tagPlaceholder:"Select Tags",keywordLabel:"Keywords",keywordPlaceholder:"Search title, author, publisher...",resultsCount:'共 <span class="highlight">29991</span> books. More sources available. Visit <a class="highlight-link" href="https://toolset.site" target="_blank" rel="noopener noreferrer">https://toolset.site</a>',clear:"Clear All",noResults:"No books matched your filters. Please try changing keywords or clearing filters.",read:"Read",latestChapter:"Updated to {chapter}"},header:{login:"Log In",register:"Sign Up"},search:{tagLabel:"Tags",tagPlaceholder:"Select Tags",collectionLabel:"Collections",collectionPlaceholder:"Select Collection",typeLabel:"Content Type",typePlaceholder:"Select Type",keywordLabel:"Keywords",keywordPlaceholder:"Search keywords...",resultsCount:"Results: {total} found",clear:"Clear All",noResults:"No content matched your filters. Please try changing keywords or clearing filters."},pagination:{info:"Total {total}, Page {current} of {pages}",prev:"Previous",next:"Next"},footer:{subscribe:"Subscribe",subscribeDesc:"Join our mailing list for the latest updates",emailPlaceholder:"Enter your email address...",subscribeBtn:"Subscribe",navTitle:"Navigation",aboutTitle:"About Us",ecoTitle:"Ecosystem",socialTitle:"Social Media",home:"Home",contentList:"Content List",userCenter:"User Center",favorites:"Favorites",company:"Company Profile",contact:"Contact Us",join:"Join Us",privacy:"Privacy Policy",tools:"Online Tools",blog:"数维探索IT Blog",wiki:"Wiki",tracker:"CSDN Blog"}};f.use(V);const X={zh:Lo,en:Mo},R=localStorage.getItem("language")||"zh",Q=Object.keys(X).includes(R)?R:"zh";document.documentElement.lang=Q==="zh"?"zh-CN":"en-US";const Wo=new V({locale:Q,fallbackLocale:"zh",messages:X});qo();new f({router:U,i18n:Wo,render:s=>s(ot)}).$mount("#app");export{C as S,_ as a,p as n};
