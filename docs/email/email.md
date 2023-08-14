---
description: Micronaut Email
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut Email,Email]
---

# Micronaut Email

与交易电子邮件提供者集成。

## 1. 简介

Micronaut 电子邮件模块可与[亚马逊简单电子邮件服务](https://aws.amazon.com/ses/)、[Postmark](https://postmarkapp.com/)、[Mailjet](https://www.mailjet.com/) 或 [SendGrid](https://sendgrid.com/) 等事务电子邮件提供者集成。

## 2. 重大变更

**Micronaut Email 2**

Micronaut Email 2 迁移到 [Jakarta 邮件](https://jakartaee.github.io/mail-api/)包命名空间，从 `javax.mail` 到 `jakarta.mail`。此外，它使用传递依赖 `jakarta.mail:jakarta.mail-api` 代替 `com.sun.mail:javax.mail`。Jakarta Mail 还分离了 API 和实现。以前的实现源现在是 [Eclipse Angus](https://eclipse-ee4j.github.io/angus-mail/) 项目的一部分，是 JavaMail/JakartaMail 的直接继承者。除了 `jakarta-mail-api` 之外，还需要额外依赖 `org.eclipse.angus:angus-mail`。请注意，对于 Eclipse Angus，模式和软件包前缀已从 `com.sun.mail` 改为 `org.eclipse.angus.mail`。

此版本还将 ActiveCampaign Postmark 库从 1.8.x 升级到 1.9.0。尽管这只是一个小的修订，但它重构了软件包名称，并将依赖关系 groupId 从 `com.wildbit.java` 改为 `com.postmarkapp`。

## 3. 发布历史

关于此项目，你可以在此处找到发布版本列表（含发布说明）：

https://github.com/micronaut-projects/micronaut-email/releases

## 4. 快速入门

首先，你需要[安装依赖项并为你的事务电子邮件提供者添加配置](#9-集成)。

然后，你就可以通过注入一个 [EmailSender](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/EmailSender.html) 类型的 Bean 来发送电子邮件了。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package io.micronaut.email.docs;

import io.micronaut.email.BodyType;
import io.micronaut.email.EmailSender;
import io.micronaut.email.Email;
import io.micronaut.email.MultipartBody;
import jakarta.inject.Singleton;

@Singleton
public class WelcomeService {
    private final EmailSender<?, ?> emailSender;

    public WelcomeService(EmailSender<?, ?> emailSender) {
        this.emailSender = emailSender;
    }

    public void sendWelcomeEmail() {
        emailSender.send(Email.builder()
                .from("sender@example.com")
                .to("john@example.com")
                .subject("Micronaut test")
                .body(new MultipartBody("<html><body><strong>Hello</strong> dear Micronaut user.</body></html>", "Hello dear Micronaut user")));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package io.micronaut.email.docs


import io.micronaut.email.Email
import io.micronaut.email.EmailSender
import jakarta.inject.Singleton

@Singleton
class WelcomeService {
    private final EmailSender<?, ?> emailSender

    WelcomeService(EmailSender<?, ?> emailSender) {
        this.emailSender = emailSender
    }

    void sendWelcomeEmail() {
        emailSender.send(Email.builder()
                .from("sender@example.com")
                .to("john@example.com")
                .subject("Micronaut test")
                .body("<html><body><strong>Hello</strong> dear Micronaut user.</body></html>", "Hello dear Micronaut user"))
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package io.micronaut.email.docs

import io.micronaut.email.EmailSender
import io.micronaut.email.Email
import io.micronaut.email.MultipartBody
import jakarta.inject.Singleton

@Singleton
class WelcomeService(private val emailSender: EmailSender<Any, Any>) {
    fun sendWelcomeEmail() {
        emailSender.send(
            Email.builder()
                .from("sender@example.com")
                .to("john@example.com")
                .subject("Micronaut test")
                .body(MultipartBody("<html><body><strong>Hello</strong> dear Micronaut user.</body></html>", "Hello dear Micronaut user"))
        )
    }
}
```

  </TabItem>
</Tabs>

## 5. 附件

要发送附件，请使用[Attachment](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/Attachment.html)生成器。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package io.micronaut.email.docs;

import io.micronaut.email.Attachment;
import io.micronaut.email.BodyType;
import io.micronaut.email.Email;
import io.micronaut.email.EmailSender;
import io.micronaut.email.MultipartBody;
import io.micronaut.email.test.SpreadsheetUtils;
import io.micronaut.http.MediaType;
import jakarta.inject.Singleton;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Singleton
public class SendAttachmentService {
    private final EmailSender<?, ?> emailSender;

    public SendAttachmentService(EmailSender<?, ?> emailSender) {
        this.emailSender = emailSender;
    }

    public void sendReport() throws IOException {
        emailSender.send(Email.builder()
                .from("sender@example.com")
                .to("john@example.com")
                .subject("Monthly reports")
                .body(new MultipartBody("<html><body><strong>Attached Monthly reports</strong>.</body></html>", "Attached Monthly reports"))
                .attachment(Attachment.builder()
                        .filename("reports.xlsx")
                        .contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                        .content(excel())
                        .build()));
    }

    private static byte[] excel() throws IOException {
        XSSFWorkbook wb = new XSSFWorkbook();
        wb.createSheet("Reports");
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try {
            wb.write(bos);
        } finally {
            bos.close();
        }
        return bos.toByteArray();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package io.micronaut.email.docs

import io.micronaut.email.Attachment
import io.micronaut.email.Email
import io.micronaut.email.EmailSender
import io.micronaut.email.MultipartBody
import jakarta.inject.Singleton
import org.apache.poi.xssf.usermodel.XSSFWorkbook

@Singleton
class SendAttachmentService {
    private final EmailSender<?, ?> emailSender;

    SendAttachmentService(EmailSender<?, ?> emailSender) {
        this.emailSender = emailSender;
    }

    void sendReport() throws IOException {
        emailSender.send(Email.builder()
                .from("sender@example.com")
                .to("john@example.com")
                .subject("Monthly reports")
                .body(new MultipartBody("<html><body><strong>Attached Monthly reports</strong>.</body></html>", "Attached Monthly reports"))
                .attachment(Attachment.builder()
                        .filename("reports.xlsx")
                        .contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                        .content(excel())
                        .build()))
    }

    private static byte[] excel() throws IOException {
        XSSFWorkbook wb = new XSSFWorkbook()
        wb.createSheet("Reports")
        ByteArrayOutputStream bos = new ByteArrayOutputStream()
        try {
            wb.write(bos)
        } finally {
            bos.close()
        }
        bos.toByteArray()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package io.micronaut.email.docs

import io.micronaut.email.*
import jakarta.inject.Singleton
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import java.io.ByteArrayOutputStream

@Singleton
class SendAttachmentService(private val emailSender: EmailSender<Any, Any>) {

    fun sendWelcomeEmail() {
        emailSender.send(
            Email.builder()
                .from("sender@example.com")
                .to("john@example.com")
                .subject("Monthly reports")
                .body(MultipartBody("<html><body><strong>Attached Monthly reports</strong>.</body></html>", "Attached Monthly reports"))
                .attachment(
                    Attachment.builder()
                    .filename("reports.xlsx")
                    .contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .content(excel())
                    .build()))
    }

    private fun excel(): ByteArray {
        val wb = XSSFWorkbook()
        wb.createSheet("Reports")
        val bos = ByteArrayOutputStream()
        bos.use { byteArrayOutputStream ->
            wb.write(byteArrayOutputStream)
        }
        return bos.toByteArray()
    }
}
```

  </TabItem>
</Tabs>

## 6. 装饰器

如果你总是从同一个电子邮件地址发送电子邮件，你可以通过配置指定它，并在创建电子邮件时跳过填充发件人字段。

*表 1. [FromConfigurationProperties](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/configuration/FromConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.email.from.email|java.lang.String||
|micronaut.email.from.name|java.lang.String|发送电子邮件的联系人姓名|

通过设置 `micronaut.email.from.email`，Micronaut Email 注册了一个 [FromDecorator](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/FromDecorator.html) 类型的 Bean，如果在构建电子邮件时未指定 `from` 字段，该 Bean 将填充该字段。

此外，如果你有自定义需求（例如，总是密送电子邮件地址，在特定环境中为电子邮件主题添加前缀），你可以注册一个 [EmailDecorator](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/EmailDecorator.html) 类型的 Bean。

## 7. 自定义电子邮件

如果你需要自定义发送的电子邮件，例如在电子邮件中添加标题，那么你可以使用 [EmailSender](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/EmailSender.html) 的 Consumer 变体。

这里我们展示了一个使用 jakarta.mail.Message 类的 JavaMail 示例，但也可根据你使用的邮件平台请求类进行修改。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package io.micronaut.email.docs;

import io.micronaut.email.Email;
import io.micronaut.email.EmailSender;
import io.micronaut.email.MultipartBody;
import jakarta.inject.Singleton;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * An example of customization for JavaMail messages
 */
@Singleton
public class CustomizedJavaMailService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomizedJavaMailService.class);

    private final EmailSender<Message, ?> emailSender;

    public CustomizedJavaMailService(EmailSender<Message, ?> emailSender) {
        this.emailSender = emailSender;
    }

    public void sendCustomizedEmail() {
        Email.Builder email = Email.builder()
                .from("sender@example.com")
                .to("john@example.com")
                .subject("Micronaut test")
                .body(
                        new MultipartBody(
                                "<html><body><strong>Hello</strong> dear Micronaut user.</body></html>",
                                "Hello dear Micronaut user"
                        )
                );

        // Customize the message with a header prior to sending
        emailSender.send(email, message -> {
            try {
                message.addHeader("List-Unsubscribe", "<mailto:list@host.com?subject=unsubscribe>");
            } catch (MessagingException e) {
                LOG.error("Failed to add header", e);
            }
        });
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package io.micronaut.email.docs

import io.micronaut.email.Email
import io.micronaut.email.EmailSender
import io.micronaut.email.MultipartBody
import jakarta.inject.Singleton
import jakarta.mail.Message
import jakarta.mail.MessagingException
import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * An example of customization for JavaMail messages
 */
@Singleton
class CustomizedJavaMailService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomizedJavaMailService.class);

    private final EmailSender<Message, ?> emailSender

    CustomizedJavaMailService(EmailSender<Message, ?> emailSender) {
        this.emailSender = emailSender
    }

    void sendCustomizedEmail() {
        def email = Email.builder()
                .from("sender@example.com")
                .to("john@example.com")
                .subject("Micronaut test")
                .body(
                        new MultipartBody(
                                "<html><body><strong>Hello</strong> dear Micronaut user.</body></html>",
                                "Hello dear Micronaut user"
                        )
                )

        // Customize the message with a header prior to sending
        emailSender.send(email, message -> {
            try {
                message.addHeader("List-Unsubscribe", "<mailto:list@host.com?subject=unsubscribe>");
            } catch (MessagingException e) {
                LOG.error("Failed to add header", e);
            }
        })
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package io.micronaut.email.docs

import io.micronaut.email.Email
import io.micronaut.email.EmailSender
import io.micronaut.email.MultipartBody
import jakarta.inject.Singleton
import jakarta.mail.Message
import jakarta.mail.MessagingException
import org.slf4j.LoggerFactory

/**
 * An example of customization for JavaMail messages
 */
@Singleton
class CustomizedJavaMailService(private val emailSender: EmailSender<Message, *>) {

    fun sendCustomizedEmail() {
        val email = Email.builder()
            .from("sender@example.com")
            .to("john@example.com")
            .subject("Micronaut test")
            .body(
                MultipartBody(
                    "<html><body><strong>Hello</strong> dear Micronaut user.</body></html>",
                    "Hello dear Micronaut user"
                )
            )

        // Customize the message with a header prior to sending
        emailSender.send(email) { message: Message ->
            try {
                message.addHeader("List-Unsubscribe", "<mailto:list@host.com?subject=unsubscribe>")
            } catch (e: MessagingException) {
                LOG.error("Failed to add header", e)
            }
        }
    }

    companion object {
        private val LOG = LoggerFactory.getLogger(CustomizedJavaMailService::class.java)
    }
}
```

  </TabItem>
</Tabs>

## 8. 模板

如果要使用模板发送电子邮件，请在应用程序中添加以下依赖。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.email:micronaut-email-template")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.email</groupId>
    <artifactId>micronaut-email-template</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

你可以使用 [Micronaut Views](/views) 支持的任何模板引擎。

例如，如果包含以下依赖，你就可以使用 velocity 模板来发送电子邮件：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.views:micronaut-views-velocity")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.views</groupId>
    <artifactId>micronaut-views-velocity</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

指定电子邮件文本或 HTML 作为 [TemplateBody](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/template/TemplateBody.html) 发送模板。

[TemplateBodyDecorator](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/template/TemplateBodyDecorator.html) 类型的 Bean 会渲染这些模板。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package io.micronaut.email.docs;

import io.micronaut.core.util.CollectionUtils;
import io.micronaut.email.BodyType;
import io.micronaut.email.Email;
import io.micronaut.email.EmailSender;
import io.micronaut.email.MultipartBody;
import io.micronaut.email.template.TemplateBody;
import io.micronaut.views.ModelAndView;
import jakarta.inject.Singleton;

import java.util.Map;

@Singleton
public class WelcomeWithTemplateService {
    private final EmailSender<?, ?> emailSender;

    public WelcomeWithTemplateService(EmailSender<?, ?> emailSender) {
        this.emailSender = emailSender;
    }

    public void sendWelcomeEmail() {
        Map<String, String> model = CollectionUtils.mapOf("message", "Hello dear Micronaut user",
                "copyright", "© 2021 MICRONAUT FOUNDATION. ALL RIGHTS RESERVED",
                "address", "12140 Woodcrest Executive Dr., Ste 300 St. Louis, MO 63141");
        emailSender.send(Email.builder()
                        .from("sender@example.com")
                        .to("john@example.com")
                        .subject("Micronaut test")
                        .body(new MultipartBody(
                                new TemplateBody<>(BodyType.HTML, new ModelAndView<>("htmltemplate", model)),
                                new TemplateBody<>(BodyType.TEXT, new ModelAndView<>("texttemplate", model)))));
    }

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package io.micronaut.email.docs

import io.micronaut.email.BodyType
import io.micronaut.email.Email
import io.micronaut.email.EmailSender
import io.micronaut.email.MultipartBody
import io.micronaut.email.template.TemplateBody
import io.micronaut.views.ModelAndView
import jakarta.inject.Singleton

@Singleton
class WelcomeWithTemplateService {
    private final EmailSender<?, ?> emailSender

    WelcomeWithTemplateService(EmailSender<?, ?> emailSender) {
        this.emailSender = emailSender
    }

    void sendWelcomeEmail() {
        Map<String, String> model = [message: "Hello dear Micronaut user",
                copyright: "© 2021 MICRONAUT FOUNDATION. ALL RIGHTS RESERVED",
                address: "12140 Woodcrest Executive Dr., Ste 300 St. Louis, MO 63141"]
        emailSender.send(Email.builder()
                .from("sender@example.com")
                .to("john@example.com")
                .subject("Micronaut test")
                .body(new MultipartBody(
                        new TemplateBody(BodyType.HTML, new ModelAndView<>("htmltemplate", model)),
                        new TemplateBody(BodyType.TEXT, new ModelAndView<>("texttemplate", model)))))
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package io.micronaut.email.docs

import io.micronaut.email.BodyType
import io.micronaut.email.Email
import io.micronaut.email.EmailSender
import io.micronaut.email.MultipartBody
import io.micronaut.email.template.TemplateBody
import io.micronaut.views.ModelAndView
import jakarta.inject.Singleton

@Singleton
class WelcomeWithTemplateService(private val emailSender: EmailSender<Any, Any>) {

    fun sendWelcomeEmail() {
        val model = mapOf(
            "message" to "Hello dear Micronaut user",
            "copyright" to "© 2021 MICRONAUT FOUNDATION. ALL RIGHTS RESERVED",
            "address" to "12140 Woodcrest Executive Dr., Ste 300 St. Louis, MO 63141"
        )
        emailSender.send(
            Email.builder()
                .from("sender@example.com")
                .to("john@example.com")
                .subject("Micronaut test")
                .body(MultipartBody(
                    TemplateBody(BodyType.HTML, ModelAndView("htmltemplate", model)),
                    TemplateBody(BodyType.TEXT, ModelAndView("texttemplate", model))))
        )
    }

}
```

  </TabItem>
</Tabs>

在前面的例子中，你可以使用一个 Velocity 模板，例如：

*src/main/resources/views/texttemplate.vm*

```bash
Hello

$message

thanks,
Micronaut Framework

$address

$copyright
```

## 9. 集成

### 9.1 SES

要与[亚马逊简单电子邮件服务](https://aws.amazon.com/ses/)集成，请在应用程序中添加以下依赖 。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.email:micronaut-email-amazon-ses")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.email</groupId>
    <artifactId>micronaut-email-amazon-ses</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

此集成使用 [Micronaut AWS SDK v2](/aws/sdkv2) 集成。

了解更多：

- [提供 AWS 凭据](/aws/sdkv2#72-提供-AWS-证书)。
- 选择 [AWS 区域](/aws/sdkv2#73-AWS-区域选择)
- [SES bean](/aws/sdkv2#78-SES)

### 9.2 Postmark

要与 Postmark 集成，请在应用程序中添加以下依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.email:micronaut-email-postmark")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.email</groupId>
    <artifactId>micronaut-email-postmark</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

你需要通过配置提供 Postmark 的 API 令牌：

*表 1. [PostmarkConfigurationProperties](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/postmark/PostmarkConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|postmark.enabled|boolean|如果启用了 Postmark 集成。默认值：`true`|
|postmark.api-token|java.lang.String||
|postmark.track-opens|boolean|是否跟踪电子邮件是否被打开。默认值：`true`|
|postmark.track-links|[TrackLinks](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/TrackLinks.html)|是否跟踪电子邮件的链接。默认值 `DO_NOT_TRACK`。|

### 9.3 SendGrid

要与 [SendGrid](https://sendgrid.com/) 集成，请在应用程序中添加以下依赖。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.email:micronaut-email-sendgrid")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.email</groupId>
    <artifactId>micronaut-email-sendgrid</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

你需要通过配置提供 SendGrid 的 API 密钥和秘密：

*表 1. [SendGridConfigurationProperties](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/sendgrid/SendGridConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|sendgrid.enabled|boolean|如果启用 SendGrid 集成。默认值 `true`|
|sendgrid.api-key|java.lang.String||

### 9.4 Mailjet

要与 [Mailjet](https://www.mailjet.com/) 集成，请在你的应用程序中添加以下依赖。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.email:micronaut-email-mailjet")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.email</groupId>
    <artifactId>micronaut-email-mailjet</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

你需要通过配置提供 Mailjet 的 API 密钥和秘密：

*表 1. MailjetConfigurationProperties 的配置属性*

|属性|类型|描述|
|--|--|--|
|mailjet.enabled|boolean|如果启用 Mailjet 集成。默认值：`true`|
|mailjet.version|java.lang.String|Mailjet API 版本。默认值：`"v3.1"`|
|mailjet.api-key|java.lang.String|Mailjet API key。|
|mailjet.api-secret|java.lang.String|Mailjet API secret。|

### 9.5 Jakarta Mail

要使用 [Jakarta Mail](https://jakartaee.github.io/mail-api/)，请在应用程序中添加以下依赖。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.email:micronaut-email-javamail")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.email</groupId>
    <artifactId>micronaut-email-javamail</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

此外，你还需要为 Jakarta Mail api 的实现提供运行时依赖关系。Eclipse Angus 是 JavaMail/JakartaMail 先前版本的直接继承者。

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
runtimeOnly("org.eclipse.angus:angus-mail")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>org.eclipse.angus</groupId>
    <artifactId>angus-mail</artifactId>
    <scope>runtime</scope>
</dependency>
```

  </TabItem>
</Tabs>

你需要提供 [MailPropertiesProvider](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/javamail/sender/MailPropertiesProvider.html) 和 [SessionProvider](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/javamail/sender/SessionProvider.html) 类型的 bean 以匹配你的配置。

**通过配置进行验证**

除了提供自己的 [SessionProvider](https://micronaut-projects.github.io/micronaut-email/latest/api/io/micronaut/email/javamail/sender/SessionProvider.html) 用于认证外，你还可以通过配置来配置基于密码的认证：

```yaml
javamail:
  authentication:
    username: 'my.username'
    password: 'my.password'
```

## 10. 仓库

你可以在此资源库中找到此项目的源代码：

https://github.com/micronaut-projects/micronaut-email

> [英文链接](https://micronaut-projects.github.io/micronaut-email/latest/guide/)
