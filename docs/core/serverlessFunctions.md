---
sidebar_position: 90
---

# 9. 无服务器函数

在无服务器架构中，你部署的功能完全由云环境管理，并在短暂进程中执行，这需要一种独特的方法。

传统的框架（如 Grails 和 Spring）其实并不适合，因为低内存消耗和快速启动时间至关重要，因为功能即服务（FaaS）服务器通常会使用冷启动让你的功能运行一段时间，然后保持热启动。

Micronaut 的编译时方法、快速启动时间和低内存占用使其成为开发函数的理想选择，Micronaut 还包括专门的支持，用于开发函数并将其部署到 AWS Lambda、Google Cloud Function、Azure Function 以及任何支持将函数作为容器运行的 FaaS 系统（如 OpenFaaS、Rift 或 Fn）。
使用 Micronaut 编写函数通常有两种方法：

1. 使用函数平台的本地 API 编写低级函数
2. 高级函数，你只需像在典型 Micronaut 应用程序中那样定义控制器，然后部署到函数平台。

第一种启动时间开销较少，通常用于非 HTTP 功能，如监听事件的功能或后台功能。

第二种方法仅适用于 HTTP 功能，适用于希望从现有应用中抽取一部分并将其部署为无服务器功能的用户。如果冷启动性能是一个问题，建议你考虑使用 GraalVM 构建一个本机镜像来实现此选项。

## 9.1 AWS Lambda

对 AWS Lambda 的支持在 Micronaut AWS 子项目中实现。

**使用 AWS Lambda 的简单函数**

你可以用 Micronaut 实现直接实现 AWS Lambda SDK API 的 AWS 请求处理程序。更多信息，参阅 [Micronaut 请求处理程序](/aws/lambda.html#107-lambda-处理器)文档。

:::note 提示
*使用 CLI*

创建 AWS Lambda 函数：

```bash
$ mn create-function-app my-app --features aws-lambda
```

或者使用 Micronaut Launch：

```bash
$ curl https://launch.micronaut.io/create/function/example\?features\=aws-lambda -o example.zip
$ unzip example.zip -d example
```
:::

**使用 AWS Lambda 的 HTTP 函数**

你可以使用 Micronaut 对 AWS API Gateway 的支持，部署使用 [@Controller](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Controller.html) 等的常规 Micronaut 应用程序。更多信息，参阅 [AWS API Gateway 支持](/aws/amazonApiGateway.html)文档。

:::note 提示
*使用 CLI*

创建 AWS API Gateway 代理应用程序：

```bash
$ mn create-app my-app --features aws-lambda
```

或者使用 Micronaut Launch：

```bash
$ curl https://launch.micronaut.io/example.zip\?features\=aws-lambda -o example.zip
$ unzip example.zip -d example
```

:::

## 9.2 Google Cloud 函数

[Micronaut GCP](/gcp/cloudFunction.html) 子项目支持 Google Cloud 函数。

**使用云函数的简单函数**

你可以用 Micronaut 实现云函数，直接实现[云函数框架 API](https://github.com/GoogleCloudPlatform/functions-framework-java)。更多信息，参阅[简单函数文档](/gcp/cloudFunction.html#71-简单函数)。

:::note 提示
*使用 CLI*

创建 Google 云函数：

```bash
$ mn create-function-app my-app --features google-cloud-function
```
或者使用 Micronaut Launch：

```bash
$ curl https://launch.micronaut.io/create/function/example\?features\=google-cloud-function -o example.zip
$ unzip example.zip -d example
```

**使用云函数的 HTTP 函数**

你可以使用 Micronaut 对 HTTP 函数的支持，部署使用 [@Controller](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Controller.html) 等的常规 Micronaut 应用程序。更多信息，参阅 [Google Cloud HTTP 函数](/gcp/cloudFunction.html#72-http-函数)文档。

:::note 提示
*使用 CLI*

创建 Google Cloud HTTP 函数：

```bash
$ mn create-app my-app --features google-cloud-function
```

或者使用 Micronaut Launch：

```bash
$ curl https://launch.micronaut.io/example.zip\?features\=google-cloud-function -o example.zip
$ unzip example.zip -d example
```
:::

## 9.3 Google Cloud Run

要部署到 [Google Cloud Run](https://cloud.google.com/run)，我们建议使用 [JIB](https://github.com/GoogleContainerTools/jib) 对应用程序进行容器化。

:::note 提示
*使用 CLI*

使用 JIB 创建应用程序：

```bash
$ mn create-app my-app --features jib
```

或者使用 Micronaut Launch：

```bash
$ curl https://launch.micronaut.io/example.zip\?features\=jib -o example.zip
$ unzip example.zip -d example
```
:::

设置 JIB 以将应用程序部署到 Google 容器注册中心后，运行：

```bash
$ ./gradlew jib
```

现在你可以部署应用程序了：

```bash
$ gcloud run deploy --image gcr.io/[PROJECT ID]/example --platform=managed --allow-unauthenticated
```

其中 `[PROJECT ID]` 是你的项目 ID。你将被要求指定一个区域，并将看到如下输出：

```bash
Service name: (example):
Deploying container to Cloud Run service [example] in project [PROJECT_ID] region [us-central1]

✓ Deploying... Done.
  ✓ Creating Revision...
  ✓ Routing traffic...
  ✓ Setting IAM Policy...
Done.
Service [example] revision [example-00004] has been deployed and is serving 100 percent of traffic at https://example-9487r97234-uc.a.run.app
```

URL 是 Cloud Run 应用程序的 URL。

## 9.4 Azure 函数

对 Azure Function 的支持在 [Micronaut Azure](/azure.html#2-Azure-函数支持) 子项目中实现。

**使用 Azure Function 实现简单函数**

你可以用 Micronaut 实现 Azure Function，直接实现 [Azure Function Java SDK](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-java?tabs=consumption)。更多信息，参阅 [Azure Functions](/azure.html#2-Azure-函数支持) 文档。

:::note 提示
*使用 CLI*

创建 Azure 函数：

```bash
$ mn create-function-app my-app --features azure-function
```

或者使用 Micronaut Launch：

```bash
$ curl https://launch.micronaut.io/create/function/example\?features\=azure-function -o example.zip
$ unzip example.zip -d example
```
:::

**使用 Azure Function 的 HTTP 函数**

你可以使用 Micronaut 对 Azure HTTP Functions 的支持，部署使用 [@Controller](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/http/annotation/Controller.html) 等的常规 Micronaut 应用程序。有关详细信息，参阅有关 [Azure HTTP 函数](/azure.html#2-Azure-函数支持) 的文档。

:::note 提示
*使用 CLI*

创建 Azure HTTP 函数：

```bash
$ mn create-app my-app --features azure-function
```

或者使用 Micronaut Launch：

```bash
$ curl https://launch.micronaut.io/example.zip\?features\=azure-function -o example.zip
$ unzip example.zip -d example
```
:::

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#serverlessFunctions)
