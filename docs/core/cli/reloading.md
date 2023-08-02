---
sidebar_position: 40
---

# 18.4 重载

重新加载（或 "热加载"）是指当检测到源文件发生变化时，框架会重新初始化类（和应用程序的一部分）。

由于 Micronaut 优先考虑的是启动时间，而且大多数 Micronaut 应用程序都能在几秒钟内启动，因此在进行更改时重启应用程序，例如在集成开发环境中运行测试类，往往能实现高效的工作流程。

不过，要自动重新加载您的更改，Micronaut 支持自动重启和使用第三方重新加载代理。

### 18.4.1 自动重启

在 JVM 上重载类的方法有很多，各有利弊。以下是在不重启 JVM 的情况下实现重新加载的可行方法：

- **JVM 代理** —— 可以使用 JVM 代理（如 JRebel），但这些代理可能会产生异常错误，可能不支持所有 JDK 版本，并可能导致缓存或陈旧的类。
- **ClassLoader 重载** —— 基于类加载器的重载是大多数 JVM 框架使用的流行解决方案；但如果使用了不正确的类加载器，它同样会导致缓存或过期类、内存泄漏和奇怪的错误。
- **Debugger HotSwap** —— Java 调试器支持运行时更改的热插拔，但只支持少数用例。

考虑到现有解决方案存在的问题，以及 JVM 中缺乏重新加载更改的内置方法，重新加载的最安全、最好的解决方案，也是 Micronaut 团队推荐的解决方案，是通过第三方工具使用自动应用程序重启。

Micronaut 的启动时间很快，而且自动重启会带来全新的体验，不会出现难以调试的潜在问题或内存泄漏。

**Maven 重启**

要使用 Maven 自动重启应用程序，请使用 Micronaut Maven 插件（创建新 Maven 项目时默认包含）并运行以下命令：

*使用 Micronaut Maven 插件*

```bash
$ ./mvnw mn:run
```

每次更改类时，插件都会自动重启服务器。

**Gradle 重启**

使用 Micronaut Gradle 插件时，可以通过 `-t` 标志激活 Gradle 对持续构建的支持，从而激活 Gradle 自动重启功能：

*使用 Gradle 实现自动重启*

```bash
./gradlew run -t
```

每次更改类或资源时，Gradle 都会重新编译并重启应用程序。

## 18.4.2 JRebel

JRebel 是一种专有的重载解决方案，涉及一个代理库和复杂的集成开发环境支持。JRebel 文档包含集成开发环境集成和使用的详细步骤。本节将介绍如何为 Maven 和 Gradle 项目安装和配置代理。

:::note 提示
*使用 CLI*

如果使用 Micronaut CLI 创建项目，请使用 `jrebel` 功能在项目中预先配置 JRebel 重载。请注意，您需要安装 JRebel，并在 `gradle.properties` 文件（适用于 Gradle）或 `pom.xml` 文件（适用于 Maven）中提供代理的正确路径。必要步骤如下。

```bash
$ mn create-app my-app --features jrebel
```
:::

### 安装/配置 JRebel 代理

安装 JRebel 的最简单方法是从 [JRebel 下载页面](https://www.jrebel.com/products/jrebel/download)下载 "独立 "安装包。将下载的文件解压缩到一个方便的位置，例如 `~/bin/jrebel`

安装目录包含一个包含代理文件的 `lib` 目录。根据操作系统选择合适的代理，请参见下表：

*表 1.JRebel 代理*

|操作系统|代理|
|--|--|
|Windows 64-bit JDK|[jrebel directory]\lib\jrebel64.dll|
|Windows 32-bit JDK|[jrebel directory]\lib\jrebel32.dll|
|Mac OS X 64-bit JDK|[jrebel directory]/lib/libjrebel64.dylib|
|Mac OS X 32-bit JDK|[jrebel directory]/lib/libjrebel32.dylib|
|Linux 64-bit JDK|[jrebel directory]/lib/libjrebel64.so|
|Linux 32-bit JDK|[jrebel directory]/lib/libjrebel32.so|

注意相应代理的路径，并将该值添加到项目构建中。

**Gradle**

将路径添加到 *gradle.properties*（必要时创建文件），作为 `rebelAgent` 属性。

*gradle.properties*

```properites
#Assuming installation path of ~/bin/jrebel/
rebelAgent= -agentpath:~/bin/jrebel/lib/libjrebel64.dylib
```

将适当的 JVM arg 添加到 `build.gradle`（如果使用 CLI 功能，则无需添加）

```groovy
run.dependsOn(generateRebel)
if (project.hasProperty('rebelAgent')) {
    run.jvmArgs += rebelAgent
}
```

你可以使用 `./gradlew run` 启动应用程序，它将包含代理。参阅 [Gradle 重载](#1843-使用-gradle-重编译) 或 [IDE 重载](#1844-使用-ide-重编译) 部分设置重新编译。

**Maven**

相应配置 Micronaut Maven 插件：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <!-- ... -->
  <build>
    <plugins>
      <!-- ... -->
      <plugin>
        <groupId>io.micronaut.build</groupId>
        <artifactId>micronaut-maven-plugin</artifactId>
          <configuration>
            <jvmArguments>
              <jvmArgument>-agentpath:~/bin/jrebel/lib/jrebel6/lib/libjrebel64.dylib</jvmArgument>
            </jvmArguments>
          </configuration>
      </plugin>
      <plugin>
        <groupId>org.zeroturnaround</groupId>
        <artifactId>jrebel-maven-plugin</artifactId>
        <version>1.1.10</version>
        <executions>
          <execution>
            <id>generate-rebel-xml</id>
            <phase>process-resources</phase>
            <goals>
              <goal>generate</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      <!-- ... -->
    </plugins>
  </build>
</project>
```

## 18.4.3 使用 Gradle 重编译

Gradle 支持[持续构建](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build)，只要源文件发生变化，就会重新运行一个任务。要与重载代理（如上所述配置）一起使用，先正常运行应用程序（使用代理），然后在启用了持续模式的单独终端中运行重新编译任务。

*运行应用程序*

```bash
$ ./gradlew run
```

*运行重编译*

```bash
$ ./gradlew -t classes
```

每次修改源文件时，都会重新运行 `classes` 任务，使重载代理能够捕捉到变化。

## 18.4.4 使用集成开发环境重新编译

如果你使用的构建工具（如 Maven）不支持在文件更改时自动重新编译，你可以使用集成开发环境结合重载代理（如上述章节中的配置）来重新编译类。

**IntelliJ**

遗憾的是，IntelliJ 并不提供适用于运行中应用程序的自动重建选项。不过，你可以使用 `CMD-F9` (Mac) 或 `CTRL-F9` (Windows/Linux) 触发项目的 "重建"。

**Eclipse**

在 `Project` 菜单下，选中 `Build Automatically`（自动构建）选项。这将在文件更改保存到磁盘时触发项目的重新编译。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#reloading)
