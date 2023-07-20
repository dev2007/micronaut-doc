---
sidebar_position: 220
---

# 6.22 文件传输

Micronaut 支持通过几种简单的方式将文件发送到客户端。

## 发送文件对象

可以从控制器方法返回 File 对象，数据将返回到客户端。文件响应的 `Content-Type` 头是根据文件的名称计算的。

要控制要发送的文件的媒体类型，或设置要下载的文件（即使用 `Content-Disposition` 头），请使用要使用的文件构造 [SystemFile](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/types/files/SystemFile.html)。例如：

*发送一个 SystemFile*

```java
@Get
public SystemFile download() {
    File file = ...
    return new SystemFile(file).attach("myfile.txt");
    // or new SystemFile(file, MediaType.TEXT_HTML_TYPE)
}
```

---

## 发送一个 InputStream

对于无法引用 `File` 对象的情况（例如 JAR 文件中的资源），Micronaut 支持传输输入流。要从控制器方法返回数据的流，请构造 [StreamedFile](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/types/files/StreamedFile.html)。

:::note 提示
为了方便起见，`StreamedFile` 的构造函数也接受 `java.net.URL`。
:::

*发送一个 StreamedFile*

```java
@Get
public StreamedFile download() {
    InputStream inputStream = ...
    return new StreamedFile(inputStream, MediaType.TEXT_PLAIN_TYPE)
    // An attach(String filename) method is also available to set the Content-Disposition
}
```

如果正在传输的文件没有改变，并且请求包含适当的头，则服务器支持返回 `304`（Not Modified，未修改）响应。此外，如果客户端接受编码的响应，Micronaut 会在适当的情况下对文件进行编码。如果文件是基于文本的，并且默认情况下大于 1KB，则会进行编码。对数据进行编码的阈值是可配置的。详细信息，参阅服务器配置参考。

:::note 提示
要使用自定义数据源通过输入流发送数据，请构造 [PipedInputStream](https://docs.oracle.com/javase/8/docs/api/java/io/PipedInputStream.html) 和 [PipedOutputStream](https://docs.oracle.com/javase/8/docs/api/java/io/PipedOutputStream.html) 以将数据从输出流写入输入。请确保在一个单独的线程上进行工作，以便可以立即返回文件。
:::

---

## 缓存配置

默认情况下，文件响应包括缓存头。以下选项决定了 `Cache-Control` 头的构建方式。

*表 1.[FileTypeHandlerConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/netty/types/files/FileTypeHandlerConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|`netty.responses.file.cache-seconds`|int|缓存秒数。默认值（60）。|

*表 2.[CacheControlConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/netty/types/files/FileTypeHandlerConfiguration.CacheControlConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|`netty.responses.file.cache-control`|[FileTypeHandlerConfiguration$CacheControlConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/netty/types/files/FileTypeHandlerConfiguration.CacheControlConfiguration.html)|设置缓存控制配置。|
|`netty.responses.file.cache-control.public`|boolean|设置是否缓存控制是公开的。默认值（false）。|

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#transfers)
