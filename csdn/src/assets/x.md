v1.23.2 「不出项目规则」，基本都是**路径不对、文件没识别、UI 没切到 Workspace、或版本本身的小 Bug**。下面按最常见原因给你一套直接能照做的排查方案（不用重装）。

------

## 一、先确认：v1.23.2 规则的正确位置（很多人放错）

v1.23.x 优先读取：

- 项目规则（只对当前项目生效）：



  

  

  

  

  ```plaintext
  项目根目录/.agent/rules/*.md
  项目根目录/GEMINI.md 或 AGENTS.md
  ```

  

- 全局规则（所有项目生效）：



  

  

  

  

  ```plaintext
  ~/.gemini/antigravity/rules/*.md
  ~/.gemini/GEMINI.md
  ```

  

⚠️ **必须是 `.md` 后缀（markdown component），普通 `.md` 有时不加载**。

------

## 二、UI 里看不到「Workspace 规则」？（最常见）

1. 右上角点
   …（更多）→ Customizations
2. 切到 **Rules → 右侧选 Workspace**（不是 Global）

3. 看有没有你的规则；没有就点 **+ Workspace** 新建

如果切到 Workspace 是空的：

→ 说明 IDE **没识别当前文件夹为 Workspace**（你只是打开了文件，没打开文件夹）。

### 解决：必须「打开文件夹」

- 左上角：**File → Open Folder**，选你的`项目根目录（优先使用这种方式处理）`
- 打开后，左侧资源管理器顶部会显示文件夹名，此时 Workspace 规则才会出现

------

## 三、文件放对了但不生效？（v1.23.2 特有问题）

### 1. 文件名 / 格式问题（严格）

- ✅ 正确：`.agent/rules/01-project-rules.md`
- ❌ 错误：`.agent/rules/rules.md` / `project-rules.txt` / `RULES.MD`（大小写敏感）

### 2. 目录结构必须严格











```plaintext
your-project/
├── .agent/
│   └── rules/
│       └── my-rules.md
└── GEMINI.md（可选）
```

⚠️ **`.agent` 前面有个点**，Windows 要勾选「显示隐藏的文件」才能看到。

### 3. 编码必须是 UTF-8（无 BOM）

- 用 VS Code 打开 → 右下角选「UTF-8」→ 保存
- 有 BOM 或 GBK 会直接静默不加载

------

## 四、v1.23.2 已知 Bug：首次打开不加载旧规则

现象：从旧版升级到 1.23.2 后，原来的 Workspace 规则列表为空，但文件还在。

### 临时修复（不用删文件）

1. 关闭 Antigravity

2. 删掉项目里的缓存：


   

   

   

   

   ```plaintext
   your-project/.agent/cache/
   ```

   

3. 重新用「Open Folder」打开项目

4. 再进 Customizations → Rules → Workspace，一般就出来了

------

## 五、日志确认：到底有没有读到规则

1. 右上角 … → **Help → Show Logs**
2. 搜索关键词：
   - `loading workspace rules`：看是否扫描到 .agent/rules
   - `skipped invalid rule file`：说明文件格式 / 编码错了
   - `no workspace rules found`：路径或文件夹没打开对

------

## 六、最简测试（3 步验证规则是否工作）

1. 新建空文件夹 `test-rules`

2. 里面建：



   

   

   

   

   ```plaintext
   test-rules/.agent/rules/test.md
   ```

   

   内容写：

   md

   

   

   

   

   ```md
   永远用中文回答，开头先写【规则生效】
   ```

   

3. Antigravity → Open Folder 选

    

   ```
   test-rules
   ```

   

   发一句：

   ```
   你好
   ```

   

   预期回复：

   【规则生效】你好

如果这都不触发：就是版本对 Workspace 规则的识别有问题，可**临时降级到 1.23.1**（官网历史版有），等后续补丁。

------

## 七、一句话总结（你可以直接对照）

1. 必须 **Open Folder**，不是打开文件
2. 项目规则放 **/.agent/rules/\*.md**（点开头、md 后缀）
3. 编码 **UTF-8 无 BOM**
4. 1.23.2 有缓存 Bug，删 `.agent/cache` 重开