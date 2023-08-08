# 4. Micronaut Launch

项目生成器的核心功能包含在 `micronaut-starter-core` 子项目中：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Maven" label="Maven" default>

```xml
<dependency>
    <groupId>io.micronaut.starter</groupId>
    <artifactId>micronaut-starter-core</artifactId>
    <version>3.8.4</version>
</dependency>
```

  </TabItem>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.starter:micronaut-starter-core:3.8.4")
```

  </TabItem>
</Tabs>

## 4.1 CLI 应用

子项目 `starter-cli` 提供了一个可以作为命令行应用程序（CLI）运行的实现。

**本地构建**

从项目根目录：

```bash
./gradlew clean micronaut-cli:assemble
```

现在，你可以在交互模式下启动 CLI，运行以下命令：

```bash
java -jar starter-cli/build/libs/micronaut-cli-3.8.4-all.jar
```

**构建本地镜像**

安装 GraalVM 和本地镜像。按照上一节中的步骤构建 CLI，然后运行：

```bash
native-image --no-fallback -cp starter-cli/build/libs/micronaut-cli-3.8.4-all.jar
```

这将生成 mn 可执行文件，你可以从以下内容开始：

```bash
./mn
```

## 4.2 OpenAPI 规范

该项目使用 [Micronaut 的 OpenAPI](/openapi/introduction.html) 支持来生成 OpenAPI 规范；描述 API 的是广泛采用的行业标准。

运行：

```bash
$ ./gradlew starter-api:classes
```

你可以以 YAML 格式打开 OPEN API 规范：

```bash
$ open starter-api/build/classes/java/main/META-INF/swagger/micronaut-starter-1.0.yml
```

## 4.3 Web API 应用

子项目 `starter-web-netty` 提供了一个在 Netty 上运行的实现。

**在本地运行应用**

从项目根目录：

```bash
./gradlew clean starter-web-netty:run
```

并访问 [http://localhost:8080/application-types](http://localhost:8080/application-types)

你可以在以下位置查看 Swagger UI 定义：

[http://localhost:8080/swagger/views/swagger-ui/index.html](http://localhost:8080/swagger/views/swagger-ui/index.html)

或使用 RapiDoc：

[http://localhost:8080/swagger/views/rapidoc/index.html](http://localhost:8080/swagger/views/rapidoc/index.html)

**部署应用**

你可以使用以下命令构建 WAR 文件：

```bash
./gradlew clean starter-web-netty:shadowJar
```

可运行的 JAR 文件将位于 `starter-web-servlet/build/libs` 中：

```bash
$ java -jar starter-web-netty/build/libs/starter-web-netty-3.8.4-all.jar
```

## 4.4 Micronaut Launch React UI

[Micronaut Launch 的 UI](https://micronaut.io/launch) 是用 React 编写的，源代码可以在[这里](https://github.com/micronaut-projects/static-website/tree/master/main/src/main/js/launch)作为一个单独的项目找到。

## 4.5 WAR 部署

子项目 `starter-web-servlet` 提供了一个可以部署到任何最近的 Servlet 4+ 容器（Tomcat 9、Jetty 9 等）的实现。

**在本地运行应用程序**

从项目根目录：

```bash
./gradlew clean starter-web-servlet:run
```

并访问 [http://localhost:8080/application-types](http://localhost:8080/application-types)

你可以在以下位置查看 Swagger UI 定义：

[http://localhost:8080/swagger/views/swagger-ui](http://localhost:8080/swagger/views/swagger-ui)

或使用 RapiDoc：

[http://localhost:8080/swagger/views/rapidoc](http://localhost:8080/swagger/views/rapidoc)


**部署应用**

你可以使用以下命令构建 WAR 文件：

```bash
./gradlew clean starter-web-servlet:assemble
```

WAR 文件将位于 `starter-web-servlet/build/libs` 中，可以部署到任何现代 Servlet 容器中（例如 Jetty 9 或 Tomcat 9）。

## 4.6 Google Cloud Run

子项目 `starter-web-netty` 提供了一个可以作为 GraalVM 本机镜像持续部署到 Cloud Run 的实现。

**在本地运行应用程序**

安装 GraalVM 和本地镜像工具，然后运行：

```bash
$ docker build . -t micronaut-starter -f DockerfileCloudRun
$ docker run -p 8080:8080 micronaut-starter
```

然后访问 [http://localhost:8080/swagger/views/swagger-ui/index.html](http://localhost:8080/swagger/views/swagger-ui/index.html)

**持续部署**

Micronaut Starter 使用 Github Actions 作为本地 GraalVM 应用程序持续部署到 [Google Cloud Run](https://cloud.google.com/run)。

[GCR 工作流快照](https://github.com/micronaut-projects/micronaut-starter/actions?query=workflow%3A%22Snapshot+to+GCR%22)（由 `.github/workflows/GCR-Snapshot.yml` 定义）在每次提交时部署应用程序，可以通过以下 URL 访问应用程序：

[https://micronaut-starter-staging-ucxwqnh6ka-uc.a.run.app/swagger/views/swagger-ui/index.html](https://micronaut-starter-staging-ucxwqnh6ka-uc.a.run.app/swagger/views/swagger-ui/index.html)

**部署应用**

要自己构建和部署项目，请安装 Google Cloud CLI，然后从项目根目录构建 docker 镜像并将其推送到 Google Container Registry：

```bash
$ docker build . -t micronaut-starter -f DockerfileCloudRun
$ docker tag micronaut-starter gcr.io/[PROJECT ID]/micronaut-starter
$ docker push gcr.io/[PROJECT ID]/micronaut-starter
```

你现在可以部署应用程序了：

```bash
$ gcloud beta run deploy --image gcr.io/[PROJECT ID]/micronaut-starter
```

其中 `[PROJECT ID]` 被替换为项目 ID。你应该看到如下输出：

```bash
Service name: (micronaut-starter):
Deploying container to Cloud Run service [micronaut-starter] in project [PROJECT_ID] region [us-central1]

✓ Deploying... Done.
  ✓ Creating Revision...
  ✓ Routing traffic...
Done.
Service [micronaut-starter] revision [micronaut-starter-00004] has been deployed and is serving traffic at https://micronaut-starter-xxxxxxx-uc.a.run.app
```

URL 是云运行应用程序的 URL。

## 4.7 Google Cloud Function

子项目 `starter-gcp-function` 提供了一个可以部署到 Google Cloud Function 的 function。

**在本地运行 function**

要在本地运行 function，请运行：

```bash
./gradlew clean starter-gcp-function:runFunction
```

接着访问 [http://localhost:8081/application-types](http://localhost:8081/application-types)

**持续部署**

Micronaut Starter API 作为无服务器 Java 应用程序持续部署到 [Google Cloud Function](https://cloud.google.com/functions) 中。

[GCF 工作流快照](https://github.com/micronaut-projects/micronaut-starter/actions?query=workflow%3A%22Snapshot+to+GCF%22)（由 `.github/workflows/GCF Snapshot.yml` 定义）在每次提交时部署应用程序，可以通过以下 URL 访问 API：

[https://us-central1-micronaut-projects.cloudfunctions.net/micronaut-starter-staging/application-types](https://us-central1-micronaut-projects.cloudfunctions.net/micronaut-starter-staging/application-types)

**自行部署 Function**

要部署 Function，首先使用以下命令构建函数：

```bash
$ ./gradlew clean starter-gcp-function:shadowJar
```

然后 `cd` 到 `starter-gcp-function/build/libs` 目录中（必须从 JAR 所在的位置进行部署）：

```bash
$ cd starter-gcp-function/build/libs
```

现在运行：

```bash
$ gcloud alpha functions deploy micronaut-starter --entry-point io.micronaut.gcp.function.http.HttpFunction --runtime java11 --trigger-http
```

如果不需要认证，请选择无认证的访问。

要获取触发器 URL，请执行以下操作：

```bash
$ YOUR_HTTP_TRIGGER_URL=$(gcloud alpha functions describe micronaut-starter --format='value(httpsTrigger.url)')
```

然后可以使用此变量测试函数调用：

```bash
$ curl -i $YOUR_HTTP_TRIGGER_URL/create/app/example -o application.zip
```

## 4.8 AWS Lambda

子项目 `starter-aws-lambda` 提供了一个可以作为 GraalVM 本地镜像部署到 AWS Lambda 的 function。

**本地运行 Lambda**

从项目根目录运行：

```bash
$ docker build . -f DockerfileLambda -t micronaut-starter
$ mkdir -p build
$ docker run --rm --entrypoint cat micronaut-starter  /home/application/function.zip > build/function.zip
```

然后使用 SAM 启动 function（[https://github.com/awslabs/aws-sam-cli](https://github.com/awslabs/aws-sam-cli)）。

```bash
$ sam local start-api --template sam-local.yml
```

接着访问 [http://localhost:3000/](http://localhost:3000/)

**持续部署**

Github Actions 使用自定义 AWS Lambda Runtime 将 Micronaut Starter API 作为无服务器 GraalVM 本地应用程序持续部署到 [AWS Lambda](https://aws.amazon.com/lambda/)。

[AWS Lambda 工作流快照](https://github.com/micronaut-projects/micronaut-starter/actions?query=workflow%3A%22Snapshot+to+AWS+Lambda%22)（由 `.github/workflows/gcf Snapshot.yml` 定义）在每次提交时部署应用，可以通过以下 URL 访问 API：

[https://cn58jiuova.execute-api.us-east-1.amazonaws.com/staging/application-types](https://cn58jiuova.execute-api.us-east-1.amazonaws.com/staging/application-types)

## 4.9 Microsoft Azure

子项目 `starter-azure-function` 函数提供了一个可以部署到 Microsoft Azure 的 function。

**在本地运行函数**

首先从 `starter-azure-function/build.grade` 中取消注解 Azure 插件：

```bash
./gradlew clean starter-azure-function:azureFunctionsRun
```

接着访问 [http://localhost:7071/api/application-types](http://localhost:7071/api/application-types)

**持续部署**

Micronaut Starter API 作为无服务器 Java 应用程序持续部署到 Azure Function。

[Azure 工作流快照](https://github.com/micronaut-projects/micronaut-starter/actions?query=workflow%3A%22Snapshot+to+Azure+Function%22)（由 `.github/workflows/azure-function-snapshot.yml` 定义）在每次提交时部署应用程序，并且可以通过以下 URL 访问 API：

[https://micronaut-starter.azurewebsites.net/api/application-types](https://micronaut-starter.azurewebsites.net/api/application-types)

**自行部署功能**

首先从 `starter-azure-function/build.grade` 中取消注解 Azure 插件，然后运行：

```bash
./gradlew clean starter-azure-function:azureFunctionsDeploy
```

> [英文链接](https://micronaut-projects.github.io/micronaut-starter/3.8.4/guide/#starterImpls)
