# DSC Laboratory Kit 中文文档

## 1. 项目简介

DSC Laboratory Kit 是由 Zhang Haozhi 开发的一个用于 MIS-DSC 实验系统的软件。项目的当前版本为 1.0.1。

## 2. 开发环境

- Node.js 版本：v16.13 或更高
- npm 版本：v8.1 或更高

## 3. 主要依赖

- Vue.js：用于构建用户界面的 JavaScript 框架
- Vue Router：用于 Vue.js 的官方路由管理器
- ECharts：一个使用 JavaScript 实现的开源可视化库
- Element Plus：一个基于 Vue 3.0 的桌面端组件库
- Electron：用于构建跨平台桌面应用的开源库

## 4. 开发和构建脚本

- `npm run dev`：运行开发环境
- `npm run build`：构建项目
- `npm run compile`：使用 electron-builder 构建 Electron 应用
- `npm run test`：运行测试
- `npm run lint`：运行 ESLint 进行代码质量检查

## 5. 项目构建

项目使用 electron-builder 进行构建，构建的应用 ID 为 `com.zhanghaozhi.dsckit`。electron-builder 的配置文件为 `electron-builder.config.js`，在该文件中，你可以看到如下的配置：

- 对于 macOS，目标格式为 dmg
- 对于 Windows，目标格式为 zip
- 输出目录为 'dist'
- 构建资源目录为 'buildResources'
- 包含的文件为 'packages/dist/'

运行 `npm run compile` 命令会根据这些配置进行构建。

## 6. 开发依赖

项目的开发依赖包括但不限于：

- `@vitejs/plugin-vue`：Vite 的 Vue 插件
- `cross-env`：跨平台设置和使用环境变量的脚本
- `concurrently`：用于并行运行多个 npm 脚本的工具
- `electron`：用于构建跨平台桌面应用的开源库
- `electron-builder`：一个完整的、可配置的 Electron 应用打包器
- `electron-devtools-installer`：一个用于 Electron 的 Chrome DevTools 扩展安装器
- `eslint`：一个开源的 JavaScript 和 JSX 检查工具
- `eslint-plugin-vue`：一个针对 Vue.js 的 ESLint 插件
- `vite`：一个由原生 ESM 驱动的 Web 开发构建工具

## 7. GitHub Actions 自动编译

该项目使用 GitHub Actions 进行自动编译和发布。相关的配置文件为 `.github/workflows/release.yml`。以下是该文件的主要内容和用法：

- 当主分支（main）有新的 push 时，该工作流将被触发。但是，如果 push 的内容只包含 markdown 文件、spec.js 文件、.idea 文件、.gitignore 文件或 .github 文件夹中的文件（除了 release.yml 文件），则不会触发该工作流。
- 该工作流包含两个工作：draft 和 upload_artifacts。
- draft 工作在 ubuntu-latest 环境下运行，主要用于生成发布说明和版本号。它首先获取最后一个 git 标签，然后生成从该标签到当前引用的发布说明，最后根据当前日期获取版本号。
- upload_artifacts 工作需要 draft 工作完成后才能运行，它在 windows-latest 和 macos-latest 环境下运行。它首先安装依赖，然后准备发布说明，最后编译应用并上传构建产物。
- 你可以在 GitHub 仓库的 "Actions" 选项卡中查看和管理这些工作流。

注意：在使用 GitHub Actions 时，你需要在仓库的 "Settings" -> "Secrets" 中设置 `GITHUB_TOKEN`。这是一个自动提供给 GitHub Actions 的令牌，用于访问你的仓库。

## 8. 许可证

该项目使用的许可证信息可以在 LICENSE 文件中找到。
