---
description: Micronaut Azure
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut Azure,Azure]
---

# Micronaut Azure

## 1. 简介

本项目提供 Micronaut 和 Microsoft Azure 之间的集成。

## 2. Azure 功能支持

Azure 函数模块为使用 Micronaut 编写针对 Azure Function 环境的无服务器函数提供支持。

### 2.1 简单的 Azure 函数

有两个模块，其中第一个模块（`micronaut-azure-function`）比较低级，允许你定义可以用 Micronaut 进行依赖注入的函数。

要开始使用，请按照说明使用 [Gradle](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-java-gradle) 或 Maven 创建 Azure Function 项目。

然后在项目中添加以下依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.microaut.azure:micronaut-azure-function:1.0.1")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.microaut.azure</groupId>
    <artifactId>micronaut-azure-function</artifactId>
    <version>1.0.1</version>
</dependency>
```

  </TabItem>
</Tabs>

并确保已配置 Micronaut 注解处理器：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
annotationProcessor("io.microaut.azure:micronaut-inject-java")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<annotationProcessorPaths>
    <path>
        <groupId>io.microaut.azure</groupId>
        <artifactId>micronaut-inject-java</artifactId>
    </path>
</annotationProcessorPaths>
```

  </TabItem>
</Tabs>

然后，你可以编写一个 [AzureFunction](https://micronaut-projects.github.io/micronaut-azure/1.0.x/api/io/micronaut/azure/function/AzureFunction.html) 子类的函数，该函数在执行时将被注入依赖。例如：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import com.microsoft.azure.functions.annotation.BlobOutput;
import com.microsoft.azure.functions.annotation.BlobTrigger;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.StorageAccount;
import io.micronaut.azure.function.AzureFunction;
import io.micronaut.context.event.ApplicationEvent;
import io.micronaut.context.event.ApplicationEventPublisher;

import javax.inject.Inject;

public class BlobFunction extends AzureFunction { 
    @Inject
    ApplicationEventPublisher eventPublisher; 

    @FunctionName("copy")
    @StorageAccount("AzureWebJobsStorage")
    @BlobOutput(name = "$return", path = "samples-output-java/{name}") 
    public String copy(@BlobTrigger(
            name = "blob",
            path = "samples-input-java/{name}") String content) {
        eventPublisher.publishEvent(new BlobEvent(content)); 
        return content;
    }

    public static class BlobEvent extends ApplicationEvent {
        public BlobEvent(String content) {
            super(content);
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import com.microsoft.azure.functions.annotation.BlobOutput
import com.microsoft.azure.functions.annotation.BlobTrigger
import com.microsoft.azure.functions.annotation.FunctionName
import com.microsoft.azure.functions.annotation.StorageAccount
import io.micronaut.azure.function.AzureFunction
import io.micronaut.context.event.ApplicationEvent
import io.micronaut.context.event.ApplicationEventPublisher

import javax.inject.Inject

class BlobFunction extends AzureFunction { 
    @Inject
    ApplicationEventPublisher eventPublisher 

    @FunctionName("copy")
    @StorageAccount("AzureWebJobsStorage")
    @BlobOutput(name = '$return', path = "samples-output-java/{name}") 
    String copy(@BlobTrigger(
            name = "blob",
            path = "samples-input-java/{name}") String content) {
        eventPublisher.publishEvent(new BlobEvent(content)) 
        return content
    }

    static class BlobEvent extends ApplicationEvent {
        BlobEvent(String content) {
            super(content)
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import com.microsoft.azure.functions.annotation.BlobOutput
import com.microsoft.azure.functions.annotation.BlobTrigger
import com.microsoft.azure.functions.annotation.FunctionName
import com.microsoft.azure.functions.annotation.StorageAccount
import io.micronaut.azure.function.AzureFunction
import io.micronaut.context.event.ApplicationEvent
import io.micronaut.context.event.ApplicationEventPublisher
import javax.inject.Inject

class BlobFunction : AzureFunction() { 
    @Inject
    lateinit var eventPublisher : ApplicationEventPublisher 

    @FunctionName("copy")
    @StorageAccount("AzureWebJobsStorage")
    @BlobOutput(name = "\$return", path = "samples-output-java/{name}") 
    fun copy(@BlobTrigger(name = "blob", path = "samples-input-java/{name}") content: String): String {
        eventPublisher.publishEvent(BlobEvent(content)) 
        return content
    }

    class BlobEvent(content: String) : ApplicationEvent(content)
}
```

  </TabItem>
</Tabs>

1. 该类是 [AzureFunction](https://micronaut-projects.github.io/micronaut-azure/1.0.x/api/io/micronaut/azure/function/AzureFunction.html) 的子类。请注意，必须使用零参数 public 构造函数
2. 使用 `@Inject` 可以依赖注入字段。在本例中，我们发布了一个事件。
3. 可以根据 Azure 函数 API 指定函数绑定
4. 注入的对象可在函数代码中使用

### 2.2 Azure HTTP 函数

存在一个名为 `micronaut-azure-function-http` 的附加模块，它允许你编写常规 Micronaut 控制器并使用 Azure Function 执行它们。要开始使用，请添加 micronaut-azure-function-http` 模块。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.microaut.azure:micronaut-azure-function-http:1.0.1")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.microaut.azure</groupId>
    <artifactId>micronaut-azure-function-http</artifactId>
    <version>1.0.1</version>
</dependency>
```

  </TabItem>
</Tabs>

然后，你需要定义一个 [AzureHttpFunction](https://micronaut-projects.github.io/micronaut-azure/1.0.x/api/io/micronaut/azure/function/http/AzureHttpFunction.html) 子类的函数，并重载 `invoke` 方法：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package example;

import com.microsoft.azure.functions.ExecutionContext;
import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.HttpResponseMessage;

import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import io.micronaut.azure.function.http.AzureHttpFunction;
import java.util.Optional;

public class MyHttpFunction extends AzureHttpFunction { 
    @FunctionName("ExampleTrigger") 
    public HttpResponseMessage invoke(
            @HttpTrigger(
                    name = "req",
                    methods = {HttpMethod.GET, HttpMethod.POST}, 
                    route = "{*route}", 
                    authLevel = AuthorizationLevel.ANONYMOUS) 
                    HttpRequestMessage<Optional<String>> request, 
            final ExecutionContext context) {
        return super.route(request, context); 
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package example

import com.microsoft.azure.functions.ExecutionContext
import com.microsoft.azure.functions.HttpMethod
import com.microsoft.azure.functions.HttpRequestMessage
import com.microsoft.azure.functions.HttpResponseMessage

import com.microsoft.azure.functions.annotation.AuthorizationLevel
import com.microsoft.azure.functions.annotation.FunctionName
import com.microsoft.azure.functions.annotation.HttpTrigger
import io.micronaut.azure.function.http.AzureHttpFunction

class MyHttpFunction extends AzureHttpFunction { 
    @FunctionName("ExampleTrigger") 
    HttpResponseMessage invoke(
            @HttpTrigger(
                    name = "req",
                    methods = [HttpMethod.GET, HttpMethod.POST], 
                    route = "{*route}", 
                    authLevel = AuthorizationLevel.ANONYMOUS) 
                    HttpRequestMessage<Optional<String>> request, 
            final ExecutionContext context) {
        return super.route(request, context) 
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package example

import com.microsoft.azure.functions.ExecutionContext
import com.microsoft.azure.functions.HttpMethod
import com.microsoft.azure.functions.HttpRequestMessage
import com.microsoft.azure.functions.HttpResponseMessage
import com.microsoft.azure.functions.annotation.AuthorizationLevel
import com.microsoft.azure.functions.annotation.FunctionName
import com.microsoft.azure.functions.annotation.HttpTrigger
import io.micronaut.azure.function.http.AzureHttpFunction
import java.util.Optional

class MyHttpFunction : AzureHttpFunction() { 
    @FunctionName("ExampleTrigger") 
    fun invoke(
            @HttpTrigger(name = "req",
                    methods = [HttpMethod.GET, HttpMethod.POST], 
                    route = "{*route}", 
                    authLevel = AuthorizationLevel.ANONYMOUS) 
            request: HttpRequestMessage<Optional<String>>,  
            context: ExecutionContext): HttpResponseMessage {
        return super.route(request, context) 
    }
}
```

  </TabItem>
</Tabs>

1. 函数类是 [AzureHttpFunction](https://micronaut-projects.github.io/micronaut-azure/1.0.x/api/io/micronaut/azure/function/http/AzureHttpFunction.html) 的子类，包含一个零参数构造函数。
2. 函数名称可以随心所欲
3. 可以选择只处理特定 HTTP 方法
4. 一般情况下，你希望使用示例中的全部捕获路由，但也可以对其进行自定义。
5. 授权级别指定了谁可以访问该函数。使用 `ANONYMOUS` 允许所有人访问。
6. 接收到的请求可选择包含原始字节
7. 方法的主体应调用超级实现的 `route` 方法。

有了这些，你就可以编写常规的 Micronaut 控制器，就像 HTTP 服务器[用户指南](/core/httpServer)中记录的那样，传入的函数请求将被路由到控制器并执行。

通过这种方法，你可以开发常规 Micronaut 应用程序，并根据需要将应用程序的片段部署为无服务器功能。

## 3. 仓库

你可以在此仓库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-azure

## 4. 发布历史

**1.0.0**

- 首次发布

> [英文链接](https://micronaut-projects.github.io/micronaut-azure/1.0.x/guide/index.html)
