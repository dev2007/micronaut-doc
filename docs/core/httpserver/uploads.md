---
sidebar_position: 210
---

# 6.21 文件上传

文件上传的处理在 Micronaut 中有特殊处理。支持通过 streaming 上传或 completed 上传以非阻塞方式进行上传流式传输。

要从多部分请求接收数据，请将方法注解的 `consumes` 参数设置为 [MULTIPART_FORM_DATA](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/MediaType.html#MULTIPART_FORM_DATA)。例如：

```java
@Post(consumes = MediaType.MULTIPART_FORM_DATA)
HttpResponse upload( ... )
```

## 路由参数

方法参数类型决定如何接收文件。数据可以在一次或上传完成时以块的形式接收。

:::note 注意
如果路由参数名称不能或不应与请求中 part 的名称匹配，请将 [Part](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Part.html) 注解添加到参数中，并在请求中指定所需的名称。
:::

**块数据类型**

[PartData](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/PartData.html) 表示在多部分请求中接收的数据块。[PartData](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/PartData.html) 接口方法将数据转换为 `byte[]`、[InputStream](https://docs.oracle.com/javase/8/docs/api/java/io/InputStream.html) 或 [ByteBuffer](https://docs.oracle.com/javase/8/docs/api/java/nio/ByteBuffer.html)。

:::tip 注意
数据只能从 [PartData](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/PartData.html)  中检索一次。底层缓冲区被释放，导致重试失败。
:::

[Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html) 类型的路由参数被视为用于接收单个文件，并且接收到的文件的每个块都将被发送到下游。如果泛型类型不是 [PartData](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/PartData.html)，则将尝试使用 Micronaut 的转换服务进行转换。默认情况下，支持转换为 `String` 和 `byte[]`。

如果你需要有关上载文件的元数据的知识，[StreamingFileUpload](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/StreamingFileUpload.html) 类是一个 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)，它还包含文件信息，如内容类型和文件名。

*Streaming 文件上传*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.multipart.StreamingFileUpload;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;
import io.micronaut.core.async.annotation.SingleResult;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

import static io.micronaut.http.HttpStatus.CONFLICT;
import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA;
import static io.micronaut.http.MediaType.TEXT_PLAIN;

@Controller("/upload")
public class UploadController {
// end:class[]

    @Post(value = "/", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
    @SingleResult
    public Publisher<HttpResponse<String>> upload(StreamingFileUpload file) { // (2)

        File tempFile;
        try {
            tempFile = File.createTempFile(file.getFilename(), "temp");
        } catch (IOException e) {
            return Mono.error(e);
        }
        Publisher<Boolean> uploadPublisher = file.transferTo(tempFile); // (3)

        return Mono.from(uploadPublisher)  // (4)
            .map(success -> {
                if (success) {
                    return HttpResponse.ok("Uploaded");
                } else {
                    return HttpResponse.<String>status(CONFLICT)
                                       .body("Upload Failed");
                }
            });
    }

    @Post(value = "/outputStream", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
    @SingleResult
    public Mono<HttpResponse<String>> uploadOutputStream(StreamingFileUpload file) { // (2)

        OutputStream outputStream = new ByteArrayOutputStream(); // (3)

        Publisher<Boolean> uploadPublisher = file.transferTo(outputStream); // (4)

        return Mono.from(uploadPublisher)  // (5)
                .map(success -> {
                    if (success) {
                        return HttpResponse.ok("Uploaded");
                    } else {
                        return HttpResponse.<String>status(CONFLICT)
                                .body("Upload Failed");
                    }
                });
    }

}

@Post(value = "/", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
@SingleResult
public Publisher<HttpResponse<String>> upload(StreamingFileUpload file) { // (2)

    File tempFile;
    try {
        tempFile = File.createTempFile(file.getFilename(), "temp");
    } catch (IOException e) {
        return Mono.error(e);
    }
    Publisher<Boolean> uploadPublisher = file.transferTo(tempFile); // (3)

    return Mono.from(uploadPublisher)  // (4)
        .map(success -> {
            if (success) {
                return HttpResponse.ok("Uploaded");
            } else {
                return HttpResponse.<String>status(CONFLICT)
                                   .body("Upload Failed");
            }
        });
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.http.multipart.StreamingFileUpload
import org.reactivestreams.Publisher
import reactor.core.publisher.Mono

import static io.micronaut.http.HttpStatus.CONFLICT
import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA
import static io.micronaut.http.MediaType.TEXT_PLAIN

@Controller("/upload")
class UploadController {

@Post(value = "/", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
Mono<HttpResponse<String>> upload(StreamingFileUpload file) { // (2)

    File tempFile = File.createTempFile(file.filename, "temp")
    Publisher<Boolean> uploadPublisher = file.transferTo(tempFile) // (3)

    Mono.from(uploadPublisher)  // (4)
        .map({ success ->
            if (success) {
                HttpResponse.ok("Uploaded")
            } else {
                HttpResponse.<String>status(CONFLICT)
                        .body("Upload Failed")
            }
        })
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.async.annotation.SingleResult
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus.CONFLICT
import io.micronaut.http.MediaType.MULTIPART_FORM_DATA
import io.micronaut.http.MediaType.TEXT_PLAIN
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.http.multipart.StreamingFileUpload
import org.reactivestreams.Publisher
import reactor.core.publisher.Mono
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.OutputStream

@Controller("/upload")
class UploadController {

@Post(value = "/", consumes = [MULTIPART_FORM_DATA], produces = [TEXT_PLAIN]) // (1)
fun upload(file: StreamingFileUpload): Mono<HttpResponse<String>> { // (2)

    val tempFile = File.createTempFile(file.filename, "temp")
    val uploadPublisher = file.transferTo(tempFile) // (3)

    return Mono.from(uploadPublisher)  // (4)
        .map { success ->
            if (success) {
                HttpResponse.ok("Uploaded")
            } else {
                HttpResponse.status<String>(CONFLICT)
                    .body("Upload Failed")
            }
        }
}

}
// end::endclass]
```

  </TabItem>
</Tabs>

1. 该方法使用 [MULTIPART_FORM_DATA](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/MediaType.html#MULTIPART_FORM_DATA)
2. 方法参数与表单属性名称匹配。在这种情况下，`file` 将匹配，例如 `<input type=“file”name=“file”>`
3. [StreamingFileUpload.transferTo(File)](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/StreamingFileUpload.html#transferTo-File-) 方法将文件传输到服务器。该方法返回一个 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)
4. 返回的 `Mono` 订阅 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)，并在上传完成后输出响应，而不会阻塞。

也可以使用 `transferTo` 方法传递输出流。

:::tip 注意
文件或流的读取将被卸载到 IO 线程池，以防止阻塞事件循环的可能性。
:::

*Streaming 文件上传*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.multipart.StreamingFileUpload;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;
import io.micronaut.core.async.annotation.SingleResult;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

import static io.micronaut.http.HttpStatus.CONFLICT;
import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA;
import static io.micronaut.http.MediaType.TEXT_PLAIN;

@Controller("/upload")
public class UploadController {
// end:class[]

    @Post(value = "/", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
    @SingleResult
    public Publisher<HttpResponse<String>> upload(StreamingFileUpload file) { // (2)

        File tempFile;
        try {
            tempFile = File.createTempFile(file.getFilename(), "temp");
        } catch (IOException e) {
            return Mono.error(e);
        }
        Publisher<Boolean> uploadPublisher = file.transferTo(tempFile); // (3)

        return Mono.from(uploadPublisher)  // (4)
            .map(success -> {
                if (success) {
                    return HttpResponse.ok("Uploaded");
                } else {
                    return HttpResponse.<String>status(CONFLICT)
                                       .body("Upload Failed");
                }
            });
    }

    @Post(value = "/outputStream", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
    @SingleResult
    public Mono<HttpResponse<String>> uploadOutputStream(StreamingFileUpload file) { // (2)

        OutputStream outputStream = new ByteArrayOutputStream(); // (3)

        Publisher<Boolean> uploadPublisher = file.transferTo(outputStream); // (4)

        return Mono.from(uploadPublisher)  // (5)
                .map(success -> {
                    if (success) {
                        return HttpResponse.ok("Uploaded");
                    } else {
                        return HttpResponse.<String>status(CONFLICT)
                                .body("Upload Failed");
                    }
                });
    }

}

@Post(value = "/outputStream", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
@SingleResult
public Mono<HttpResponse<String>> uploadOutputStream(StreamingFileUpload file) { // (2)

    OutputStream outputStream = new ByteArrayOutputStream(); // (3)

    Publisher<Boolean> uploadPublisher = file.transferTo(outputStream); // (4)

    return Mono.from(uploadPublisher)  // (5)
            .map(success -> {
                if (success) {
                    return HttpResponse.ok("Uploaded");
                } else {
                    return HttpResponse.<String>status(CONFLICT)
                            .body("Upload Failed");
                }
            });
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.http.multipart.StreamingFileUpload
import org.reactivestreams.Publisher
import reactor.core.publisher.Mono

import static io.micronaut.http.HttpStatus.CONFLICT
import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA
import static io.micronaut.http.MediaType.TEXT_PLAIN

@Controller("/upload")
class UploadController {

@Post(value = "/outputStream", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
@SingleResult
Mono<HttpResponse<String>> uploadOutputStream(StreamingFileUpload file) { // (2)

    OutputStream outputStream = new ByteArrayOutputStream() // (3)

    Publisher<Boolean> uploadPublisher = file.transferTo(outputStream) // (4)

    Mono.from(uploadPublisher)  // (5)
            .map({ success ->
                if (success) {
                    HttpResponse.ok("Uploaded")
                } else {
                    HttpResponse.<String>status(CONFLICT)
                            .body("Upload Failed")
                }
            })
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.async.annotation.SingleResult
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus.CONFLICT
import io.micronaut.http.MediaType.MULTIPART_FORM_DATA
import io.micronaut.http.MediaType.TEXT_PLAIN
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.http.multipart.StreamingFileUpload
import org.reactivestreams.Publisher
import reactor.core.publisher.Mono
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.OutputStream

@Controller("/upload")
class UploadController {

@Post(value = "/outputStream", consumes = [MULTIPART_FORM_DATA], produces = [TEXT_PLAIN]) // (1)
@SingleResult
fun uploadOutputStream(file: StreamingFileUpload): Mono<HttpResponse<String>> { // (2)
    val outputStream  = ByteArrayOutputStream() // (3)
    val uploadPublisher = file.transferTo(outputStream) // (4)

    return Mono.from(uploadPublisher) // (5)
        .map { success: Boolean ->
            return@map if (success) {
                HttpResponse.ok("Uploaded")
            } else {
                HttpResponse.status<String>(CONFLICT)
                    .body("Upload Failed")
            }
        }
}

}
// end::endclass]
```

  </TabItem>
</Tabs>

1. 该方法使用 [MULTIPART_FORM_DATA](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/MediaType.html#MULTIPART_FORM_DATA)
2. 方法参数与表单属性名称匹配。在这种情况下，`file` 将匹配，例如 `<input type=“file”name=“file”>`
3. 创建一个流来输出数据。在现实世界中，这可能来自其他来源。
4. [StreamingFileUpload.transferTo(OutputStream)](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/StreamingFileUpload.html#transferTo-OutputStream-) 方法将文件传输到服务器。该方法返回一个 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)
5. 返回的 `Mono` 订阅 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)，并在上传完成后输出响应，而不会阻塞

**整体数据类型**

不是发布者的路由参数会导致路由执行延迟，直到上传完成。接收到的数据将尝试转换为请求的类型。默认情况下，支持转换为 `String` 或 `byte[]`。此外，如果注册了支持文件媒体类型的媒体类型编解码器，则可以将文件转换为 POJO。默认情况下，包含一个媒体类型的编解码器，允许将 JSON 文件转换为 POJO。

*接收一个 byte 数组*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA;
import static io.micronaut.http.MediaType.TEXT_PLAIN;

@Controller("/upload")
public class BytesUploadController {

    @Post(value = "/bytes", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
    public HttpResponse<String> uploadBytes(byte[] file, String fileName) { // (2)
        try {
            File tempFile = File.createTempFile(fileName, "temp");
            Path path = Paths.get(tempFile.getAbsolutePath());
            Files.write(path, file); // (3)
            return HttpResponse.ok("Uploaded");
        } catch (IOException e) {
            return HttpResponse.badRequest("Upload Failed");
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post

import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA
import static io.micronaut.http.MediaType.TEXT_PLAIN

@Controller("/upload")
class BytesUploadController {

    @Post(value = "/bytes", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
    HttpResponse<String> uploadBytes(byte[] file, String fileName) { // (2)
        try {
            File tempFile = File.createTempFile(fileName, "temp")
            Path path = Paths.get(tempFile.absolutePath)
            Files.write(path, file) // (3)
            HttpResponse.ok("Uploaded")
        } catch (IOException e) {
            HttpResponse.badRequest("Upload Failed")
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.MediaType.MULTIPART_FORM_DATA
import io.micronaut.http.MediaType.TEXT_PLAIN
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths

@Controller("/upload")
class BytesUploadController {

    @Post(value = "/bytes", consumes = [MULTIPART_FORM_DATA], produces = [TEXT_PLAIN]) // (1)
    fun uploadBytes(file: ByteArray, fileName: String): HttpResponse<String> { // (2)
        return try {
            val tempFile = File.createTempFile(fileName, "temp")
            val path = Paths.get(tempFile.absolutePath)
            Files.write(path, file) // (3)
            HttpResponse.ok("Uploaded")
        } catch (e: IOException) {
            HttpResponse.badRequest("Upload Failed")
        }
    }
}
```

  </TabItem>
</Tabs>

如果你需要有关已上载文件的元数据的知识，[CompletedFileUpload](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/CompletedFileUpload.html) 类具有检索文件数据以及内容类型和文件名等文件信息的方法。

*使用元数据的文件上传*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.multipart.CompletedFileUpload;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA;
import static io.micronaut.http.MediaType.TEXT_PLAIN;

@Controller("/upload")
public class CompletedUploadController {

    @Post(value = "/completed", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
    public HttpResponse<String> uploadCompleted(CompletedFileUpload file) { // (2)
        try {
            File tempFile = File.createTempFile(file.getFilename(), "temp"); //(3)
            Path path = Paths.get(tempFile.getAbsolutePath());
            Files.write(path, file.getBytes()); //(3)
            return HttpResponse.ok("Uploaded");
        } catch (IOException e) {
            return HttpResponse.badRequest("Upload Failed");
        }
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.http.multipart.CompletedFileUpload

import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA
import static io.micronaut.http.MediaType.TEXT_PLAIN

@Controller("/upload")
class CompletedUploadController {

    @Post(value = "/completed", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
    HttpResponse<String> uploadCompleted(CompletedFileUpload file) { // (2)
        try {
            File tempFile = File.createTempFile(file.filename, "temp") //(3)
            Path path = Paths.get(tempFile.absolutePath)
            Files.write(path, file.bytes) //(3)
            HttpResponse.ok("Uploaded")
        } catch (IOException e) {
            HttpResponse.badRequest("Upload Failed")
        }
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType.MULTIPART_FORM_DATA
import io.micronaut.http.MediaType.TEXT_PLAIN
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.http.multipart.CompletedFileUpload
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths

@Controller("/upload")
class CompletedUploadController {

    @Post(value = "/completed", consumes = [MULTIPART_FORM_DATA], produces = [TEXT_PLAIN]) // (1)
    fun uploadCompleted(file: CompletedFileUpload): HttpResponse<String> { // (2)
        return try {
            val tempFile = File.createTempFile(file.filename, "temp") //(3)
            val path = Paths.get(tempFile.absolutePath)
            Files.write(path, file.bytes) //(3)
            HttpResponse.ok("Uploaded")
        } catch (e: IOException) {
            HttpResponse.badRequest("Upload Failed")
        }
    }
}
```

  </TabItem>
</Tabs>

1. 该方法使用 [MULTIPART_FORM_DATA](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/MediaType.html#MULTIPART_FORM_DATA)
2. 方法参数与表单属性名称匹配。在这种情况下，`file` 将匹配，例如 `<input type=“file”name=“file”>`
3. `CompletedFileUpload` 实例提供对有关上载的元数据的访问以及对文件内容的访问。

:::danger 危险
如果不读取文件，则**必须**调用文件对象上的 `discard` 方法以防止内存泄漏。
:::

---

## 多次上传

**不同的名字**

如果一个多部分请求有多个具有不同部件名称的上载，请为接收每个部件的路由创建一个参数。例如：

```java
HttpResponse upload(String title, String name)
```

像上面这样的路由方法签名需要两个不同的部分，一个命名为“title”，另一个名为“name”。

**相同的名字**

若要接收具有相同部件名称的多个部件，参数必须是发布服务器。当以以下方式之一使用时，发布者会为使用指定名称找到的每个部分发出一个项目。发布者必须接受以下类型之一：

- [StreamingFileUpload](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/StreamingFileUpload.html)
- [CompletedFileUpload](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/CompletedFileUpload.html)
- 用于属性的 [CompletedPart](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/CompletedPart.html)
- 任何 POJO，假设存在支持该内容类型的媒体编解码器
- 另一个接受上述分块数据类型之一的 [Publisher](http://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html)

例如：

```java
HttpResponse upload(Publisher<StreamingFileUpload> files)
HttpResponse upload(Publisher<CompletedFileUpload> files)
HttpResponse upload(Publisher<MyObject> files)
HttpResponse upload(Publisher<Publisher<PartData>> files)
HttpResponse upload(Publisher<CompletedPart> attributes)
```

---

## 全部请求体绑定

当事先不知道请求 part 的名称时，或者为了读取整个请求体，可以使用特殊类型来表示需要整个请求体。

如果路由有一个用 [@Body](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/annotation/Body.html) 注解的 [MultipartBody](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/multipart/MultipartBody.html) 类型的参数（不要与客户端的类混淆），那么请求的每个部分都将通过该参数发出。[MultipartBody](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/multipart/MultipartBody.html) 是 [CompletedPart](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/multipart/CompletedPart.html) 实例的发布者。

例如：

*绑定完整的 multipart 请求体*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.multipart.CompletedFileUpload;
import io.micronaut.http.multipart.CompletedPart;
import io.micronaut.http.server.multipart.MultipartBody;
import org.reactivestreams.Publisher;
import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;
import reactor.core.publisher.Mono;
import io.micronaut.core.async.annotation.SingleResult;
import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA;
import static io.micronaut.http.MediaType.TEXT_PLAIN;

@Controller("/upload")
public class WholeBodyUploadController {

    @Post(value = "/whole-body", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
    @SingleResult
    public Publisher<String> uploadBytes(@Body MultipartBody body) { // (2)

        return Mono.create(emitter -> {
            body.subscribe(new Subscriber<CompletedPart>() {
                private Subscription s;

                @Override
                public void onSubscribe(Subscription s) {
                    this.s = s;
                    s.request(1);
                }

                @Override
                public void onNext(CompletedPart completedPart) {
                    String partName = completedPart.getName();
                    if (completedPart instanceof CompletedFileUpload) {
                        String originalFileName = ((CompletedFileUpload) completedPart).getFilename();
                    }
                }

                @Override
                public void onError(Throwable t) {
                    emitter.error(t);
                }

                @Override
                public void onComplete() {
                    emitter.success("Uploaded");
                }
            });
        });
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.http.multipart.CompletedFileUpload
import io.micronaut.http.multipart.CompletedPart
import io.micronaut.http.server.multipart.MultipartBody
import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription
import reactor.core.publisher.Mono

import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA
import static io.micronaut.http.MediaType.TEXT_PLAIN

@Controller("/upload")
class WholeBodyUploadController {

    @Post(value = "/whole-body", consumes = MULTIPART_FORM_DATA, produces = TEXT_PLAIN) // (1)
    Mono<String> uploadBytes(@Body MultipartBody body) { // (2)

        Mono.<String>create({ emitter ->
            body.subscribe(new Subscriber<CompletedPart>() {
                private Subscription s

                @Override
                void onSubscribe(Subscription s) {
                    this.s = s
                    s.request(1)
                }

                @Override
                void onNext(CompletedPart completedPart) {
                    String partName = completedPart.name
                    if (completedPart instanceof CompletedFileUpload) {
                        String originalFileName = completedPart.filename
                    }
                }

                @Override
                void onError(Throwable t) {
                    emitter.error(t)
                }

                @Override
                void onComplete() {
                    emitter.success("Uploaded")
                }
            })
        })
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.MediaType.MULTIPART_FORM_DATA
import io.micronaut.http.MediaType.TEXT_PLAIN
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.http.multipart.CompletedFileUpload
import io.micronaut.http.multipart.CompletedPart
import io.micronaut.http.server.multipart.MultipartBody
import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription
import reactor.core.publisher.Mono

@Controller("/upload")
class WholeBodyUploadController {

    @Post(value = "/whole-body", consumes = [MULTIPART_FORM_DATA], produces = [TEXT_PLAIN]) // (1)
    fun uploadBytes(@Body body: MultipartBody): Mono<String> { // (2)
        return Mono.create { emitter ->
            body.subscribe(object : Subscriber<CompletedPart> {
                private var s: Subscription? = null

                override fun onSubscribe(s: Subscription) {
                    this.s = s
                    s.request(1)
                }

                override fun onNext(completedPart: CompletedPart) {
                    val partName = completedPart.name
                    if (completedPart is CompletedFileUpload) {
                        val originalFileName = completedPart.filename
                    }
                }

                override fun onError(t: Throwable) {
                    emitter.error(t)
                }

                override fun onComplete() {
                    emitter.success("Uploaded")
                }
            })
        }
    }
}
```

  </TabItem>
</Tabs>

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#uploads)
