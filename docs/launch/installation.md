# 2. 安装

## 2.1 使用 SDKman 安装

在 Unix 系统上安装 Micronaut 的最佳方法是使用 [SDKMAN](http://sdkman.io/)，它大大简化了多个 Micronaut 版本的安装和管理。

更新之前，请确保已安装最新版本的 SDKMAN。如果没有，运行：

```bash
$ sdk update
```

要安装 Micronaut，请运行以下命令：

```bash
$ sdk install micronaut
```

你还可以为 `sdk install` 命令指定版本。

```bash
$ sdk install micronaut {project-version}
```

你可以在 [SDKMAN 文档](http://sdkman.io/usage)中找到有关 SDKMAN 使用的更多信息。

现在应该可以运行 Micronaut CLI 了。

```bash
$ mn
| Starting interactive mode...
| Enter a command name to run. Use TAB for completion:
mn>
```

## 2.2 使用 Homebrew 安装

要安装 Micronaut，请运行以下命令：

```bash
$ brew install --cask micronaut-projects/tap/micronaut
```

你可以在他们的主页上找到有关 [Homebrew](https://brew.sh/) 使用的更多信息。

现在应该可以运行 Micronaut CLI 了。

:::note 提示
在 macOS 上，你可能会收到一条警告消息，`“mn” cannot be opened because the developer cannot be verified.`。要解决此问题，请单击 Apple 菜单，然后选择 **System Settings（系统设置）**。然后浏览到 **Privacy & Security（隐私和安全）**，并向下滚动到 **Security（安全部分）**。应该有一个警告，`"mn" was blocked`，并带有 **Allow Anyway（无论如何允许）**按钮。单击此按钮将解决此问题。
:::

有关详细信息，请参阅 [Homebrew 文档](https://docs.brew.sh/FAQ#why-cant-i-open-a-mac-app-from-an-unidentified-developer)。

```bash
$ mn
| Starting interactive mode...
| Enter a command name to run. Use TAB for completion:
mn>
```

## 2.3 使用 MacPorts 安装

安装前，建议同步最新的 Portfile。

```bash
$ sudo port sync
```

要安装 Micronaut，请运行以下命令：

```bash
$ sudo port install micronaut
```

你可以在他们的[主页](https://www.macports.org/)上找到有关 MacPorts 使用情况的更多信息。

现在应该可以运行 Micronaut CLI 了。

## 2.4 使用 Chocolatey 安装

如果使用 Windows，可以使用 [Chocolatey](https://chocolatey.org/) 安装 Micronaut CLI：

```bash
$ choco install micronaut
```

有关详细信息，请查看 [Micronaut 包页面](https://chocolatey.org/packages/micronaut)。

现在，你应该可以在命令提示符或 PowerShell 上通过运行 `mn` 来运行 Micronaut CLI：

```bash
$ mn
| Starting interactive mode...
| Enter a command name to run. Use TAB for completion:
mn>
```

## 2.5 在 Windows 上通过二进制安装

- 从 [Micronaut 网站](http://micronaut.io/download.html)下载最新二进制文件
- 将二进制文件提取到适当的位置（例如：`C:\micronaut`）
- 创建一个指向安装目录的环境变量 `MICRONAUT_HOME`，即 `C:\micronaut`
- 更新 `PATH` 环境变量，追加 `%MICRONAUT_HOME%\bin`。

现在，你应该能够从命令提示符运行 Micronaut CLI，如下所示：

```bash
$ mn
| Starting interactive mode...
| Enter a command name to run. Use TAB for completion:
mn>
```

## 2.6 从源码构建和安装

按如下方式克隆仓库：

```bash
$ git clone https://github.com/micronaut-projects/micronaut-starter.git
```

`cd` 到 `micronaut-starter` 目录中，并运行以下命令：

```bash
$ ./gradlew micronaut-cli:assembleDist
```

这将在 `starter-cli/build/distributions/` 文件夹中创建 CLI 的 zip 发行版（以当前版本命名）。

你需要在方便的地方解压。例如，要将其解压缩到用户主页中的点目录，可以执行以下操作：

```bash
$ mkdir ~/.micronaut
$ unzip starter-cli/build/distributions/micronaut-cli-VERSION.zip -d ~/.micronaut
```

在 shell 配置文件（`~/.bash_profile`，如果你使用的是 Bash shell）中，导出 `MICRONAUT_HOME` 目录（无论解压缩到何处）并将 CLI 路径添加到 `PATH`：

*bash_profile/.bashrc*

```bash
export MICRONAUT_HOME=~/path/to/unzipped/cli
export PATH="$PATH:$MICRONAUT_HOME/bin"
```

如果你正在使用 SDKMAN，不想弄乱 `$MICRONAUT_HOME`，也可以使用 `sdk install micronaut dev path/to/unzipped/cli` 将 SDKMAN 指向本地安装以进行开发。

重新加载终端或使用 `source` 来 `source` 你的 shell 配置文件：

```bash
$ source ~/.bash_profile
```

现在，你可以运行 Micronaut CLI。

```bash
$ mn
| Starting interactive mode...
| Enter a command name to run. Use TAB for completion:
mn>
```

> [英文链接](https://micronaut-projects.github.io/micronaut-starter/3.8.4/guide/#installation)
