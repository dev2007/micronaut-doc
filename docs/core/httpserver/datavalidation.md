---
sidebar_position: 150
---

# 6.15 数据校验

使用[验证通知（Validation Advice）](/core/aop.html#55-验证通知)，使用 Micronaut 控制器可以很容易地验证传入数据。

Micronaut 为带有 `micronaut-validation` 依赖项的 `javax.validation` 注解提供本机支持：


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut:micronaut-validation")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut</groupId>
    <artifactId>micronaut-validation</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

或者完全符合 JSR380 的 `micronaut-hibernate-validator` 依赖：

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.beanvalidation:micronaut-hibernate-validator")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.beanvalidation</groupId>
    <artifactId>micronaut-hibernate-validator</artifactId>
</dependency>
```

  </TabItem>
</Tabs>

我们可以在类级别使用 `javax.validation` 注解和 [Validated](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/validation/Validated.html) 注解来验证参数。

*示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.validation.Validated;

import javax.validation.constraints.NotBlank;
import java.util.Collections;

@Validated // (1)
@Controller("/email")
public class EmailController {

    @Get("/send")
    public HttpResponse send(@NotBlank String recipient, // (2)
                             @NotBlank String subject) { // (2)
        return HttpResponse.ok(Collections.singletonMap("msg", "OK"));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.validation.Validated

import javax.validation.constraints.NotBlank

@Validated // (1)
@Controller("/email")
class EmailController {

    @Get("/send")
    HttpResponse send(@NotBlank String recipient, // (2)
                      @NotBlank String subject) { // (2)
        HttpResponse.ok(msg: "OK")
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.validation.Validated
import javax.validation.constraints.NotBlank

@Validated // (1)
@Controller("/email")
open class EmailController {

    @Get("/send")
    open fun send(@NotBlank recipient: String, // (2)
                  @NotBlank subject: String): HttpResponse<*> { // (2)
        return HttpResponse.ok(mapOf("msg" to "OK"))
    }
}
```

  </TabItem>
</Tabs>

1. 用 [Validated](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/validation/Validated.html) 注解控制器
2. `subject` 和 `recipient` 不能为空

如果发生验证错误，将引发 `javax.validation.ConstraintViolationException`。默认情况下，集成的 `io.micronauth.validation.exception.ConstraintException` 处理程序会处理异常，导致如下测试所示的行为：

*示例测试*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Test
public void testParametersAreValidated() {
    HttpClientResponseException e = Assertions.assertThrows(HttpClientResponseException.class, () ->
        client.toBlocking().exchange("/email/send?subject=Hi&recipient="));
    HttpResponse<?> response = e.getResponse();

    assertEquals(HttpStatus.BAD_REQUEST, response.getStatus());

    response = client.toBlocking().exchange("/email/send?subject=Hi&recipient=me@micronaut.example");

    assertEquals(HttpStatus.OK, response.getStatus());
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
def "test parameter validation"() {
    when:
    client.toBlocking().exchange('/email/send?subject=Hi&recipient=')

    then:
    def e = thrown(HttpClientResponseException)
    def response = e.response
    response.status == HttpStatus.BAD_REQUEST

    when:
    response = client.toBlocking().exchange('/email/send?subject=Hi&recipient=me@micronaut.example')

    then:
    response.status == HttpStatus.OK
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
"test params are validated"() {
    val e = shouldThrow<HttpClientResponseException> {
        client.toBlocking().exchange<Any>("/email/send?subject=Hi&recipient=")
    }
    var response = e.response

    response.status shouldBe HttpStatus.BAD_REQUEST

    response = client.toBlocking().exchange<Any>("/email/send?subject=Hi&recipient=me@micronaut.example")

    response.status shouldBe HttpStatus.OK
}
```

  </TabItem>
</Tabs>

要使用自己的 `ExceptionHandler` 来处理约束异常，请使用 `@Replaces(ConstraintExceptionHandler.class)` 对其进行注解。

通常，你可能希望使用 POJO 作为控制器方法参数。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Introspected;

import javax.validation.constraints.NotBlank;

@Introspected
public class Email {

    @NotBlank // (1)
    String subject;

    @NotBlank // (1)
    String recipient;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Introspected

import javax.validation.constraints.NotBlank

@Introspected
class Email {

    @NotBlank // (1)
    String subject

    @NotBlank // (1)
    String recipient
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.annotation.Introspected
import javax.validation.constraints.NotBlank

@Introspected
open class Email {

    @NotBlank // (1)
    var subject: String? = null

    @NotBlank // (1)
    var recipient: String? = null
}
```

  </TabItem>
</Tabs>

1. 你可以在 POJO 中使用 `javax.validation` 注解。

用 [Validated](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/validation/Validated.html) 注解你的控制器，用 `@Valid` 注解绑定 POJO。

*示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.validation.Validated;

import javax.validation.Valid;
import java.util.Collections;

@Validated // (1)
@Controller("/email")
public class EmailController {

    @Post("/send")
    public HttpResponse send(@Body @Valid Email email) { // (2)
        return HttpResponse.ok(Collections.singletonMap("msg", "OK"));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.validation.Validated

import javax.validation.Valid

@Validated // (1)
@Controller("/email")
class EmailController {

    @Post("/send")
    HttpResponse send(@Body @Valid Email email) { // (2)
        HttpResponse.ok(msg: "OK")
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.validation.Validated
import javax.validation.Valid

@Validated // (1)
@Controller("/email")
open class EmailController {

    @Post("/send")
    open fun send(@Body @Valid email: Email): HttpResponse<*> { // (2)
        return HttpResponse.ok(mapOf("msg" to "OK"))
    }
}
```

  </TabItem>
</Tabs>

1. 用 [Validated](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/validation/Validated.html) 对控制器进行注解
2. 注解 POJO 以使用 `@Valid` 进行验证

POJO 的验证如以下测试所示：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Test
public void testPojoValidation() {
    HttpClientResponseException e = assertThrows(HttpClientResponseException.class, () -> {
        Email email = new Email();
        email.subject = "Hi";
        email.recipient = "";
        client.toBlocking().exchange(HttpRequest.POST("/email/send", email));
    });
    HttpResponse<?> response = e.getResponse();

    assertEquals(HttpStatus.BAD_REQUEST, response.getStatus());

    Email email = new Email();
    email.subject = "Hi";
    email.recipient = "me@micronaut.example";
    response = client.toBlocking().exchange(HttpRequest.POST("/email/send", email));

    assertEquals(HttpStatus.OK, response.getStatus());
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
def "invoking /email/send parse parameters in a POJO and validates"() {
    when:
    Email email = new Email(subject: 'Hi', recipient: '')
    client.toBlocking().exchange(HttpRequest.POST('/email/send', email))

    then:
    def e = thrown(HttpClientResponseException)
    def response = e.response
    response.status == HttpStatus.BAD_REQUEST

    when:
    email = new Email(subject: 'Hi', recipient: 'me@micronaut.example')
    response = client.toBlocking().exchange(HttpRequest.POST('/email/send', email))

    then:
    response.status == HttpStatus.OK
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
"test pojo validation" {
    val e = shouldThrow<HttpClientResponseException> {
        val email = Email()
        email.subject = "Hi"
        email.recipient = ""
        client.toBlocking().exchange<Email, Any>(HttpRequest.POST("/email/send", email))
    }
    var response = e.response

    response.status shouldBe HttpStatus.BAD_REQUEST

    val email = Email()
    email.subject = "Hi"
    email.recipient = "me@micronaut.example"
    response = client.toBlocking().exchange<Email, Any>(HttpRequest.POST("/email/send", email))

    response.status shouldBe HttpStatus.OK
}
```

  </TabItem>
</Tabs>

:::tip 注解
使用 Hibernate Validator 配置在自定义约束中支持 Bean 注入。
:::

## 6.15.1 验证组

你可以使用 [Validated](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/validation/Validated.html) 上的 `groups` 来使用[验证组](https://beanvalidation.org/2.0/spec/#validationapi-validatorapi-groups)，用于强制执行约束的子集。[Bean 验证](https://beanvalidation.org/2.0/spec/#constraintdeclarationvalidationprocess-groupsequence)规范中提供了更多信息。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.core.annotation.Introspected;

import javax.validation.constraints.NotBlank;

@Introspected
public class Email {

    @NotBlank // (1)
    String subject;

    @NotBlank(groups = FinalValidation.class) // (2)
    String recipient;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.core.annotation.Introspected

import javax.validation.constraints.NotBlank

@Introspected
class Email {

    @NotBlank // (1)
    String subject

    @NotBlank(groups = FinalValidation) // (2)
    String recipient
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.core.annotation.Introspected
import javax.validation.constraints.NotBlank

@Introspected
open class Email {

    @NotBlank // (1)
    var subject: String? = null

    @NotBlank(groups = [FinalValidation::class]) // (2)
    var recipient: String? = null
}
```

  </TabItem>
</Tabs>

1. 使用默认验证组指定约束。只有当 `Default` 处于活动状态时，才会强制执行此约束。
2. 使用自定义 `FinalValidation` 验证组指定约束。只有当 `FinalValidation` 处于活动状态时，才会强制执行此约束。

用 [Validated](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/validation/Validated.html) 注解控制器，指定将处于活动状态的验证组或使其默认为 `Default`。同时用 `@Valid` 注解绑定 POJO。

*示例*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.validation.Validated;

import javax.validation.Valid;
import java.util.Collections;

@Validated // (1)
@Controller("/email")
public class EmailController {

    @Post("/createDraft")
    public HttpResponse createDraft(@Body @Valid Email email) { // (2)
        return HttpResponse.ok(Collections.singletonMap("msg", "OK"));
    }

    @Post("/send")
    @Validated(groups = FinalValidation.class) // (3)
    public HttpResponse send(@Body @Valid Email email) { // (4)
        return HttpResponse.ok(Collections.singletonMap("msg", "OK"));
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.validation.Validated

import javax.validation.Valid

@Validated // (1)
@Controller("/email")
class EmailController {

    @Post("/createDraft")
    HttpResponse createDraft(@Body @Valid Email email) { // (2)
        HttpResponse.ok(msg: "OK")
    }

    @Post("/send")
    @Validated(groups = [FinalValidation]) // (3)
    HttpResponse send(@Body @Valid Email email) { // (4)
        HttpResponse.ok(msg: "OK")
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.validation.Validated
import javax.validation.Valid

@Validated // (1)
@Controller("/email")
open class EmailController {

    @Post("/createDraft")
    open fun createDraft(@Body @Valid email: Email): HttpResponse<*> { // (2)
        return HttpResponse.ok(mapOf("msg" to "OK"))
    }

    @Post("/send")
    @Validated(groups = [FinalValidation::class]) // (3)
    open fun send(@Body @Valid email: Email): HttpResponse<*> { // (4)
        return HttpResponse.ok(mapOf("msg" to "OK"))
    }
}
```

  </TabItem>
</Tabs>

1. 使用 [Validated](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/api/io/micronaut/validation/Validated.html) 进行注解而不指定组意味着 `Default` 组将处于活动状态。由于这是在类上定义的，因此它将应用于所有方法。
2. `Default` 验证组中的约束将被强制执行，继承自类。其效果是，当调用此方法时，将不会强制执行 `email.recipient` 上的 `@NotBlank`。
3. 指定 `groups` 意味着在调用此方法时将强制执行这些验证组。请注意，`FinalValidation` 继承 `Default`，因此将强制执行来自两个组的约束。
4. 由于 `FinalValidation` 继承 `Default`，因此将强制执行 `Default` 和 `FinalValidat` 验证组中的约束。其效果是，当调用此方法时， `email` 中的两个 `@NotBlank` 约束都将被强制执行。

以下测试显示了使用默认验证组对 POJO 的验证：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Test
public void testPojoValidation_defaultGroup() {
    HttpClientResponseException e = assertThrows(HttpClientResponseException.class, () -> {
        Email email = new Email();
        email.subject = "";
        email.recipient = "";
        client.toBlocking().exchange(HttpRequest.POST("/email/createDraft", email));
    });
    HttpResponse<?> response = e.getResponse();

    assertEquals(HttpStatus.BAD_REQUEST, response.getStatus());

    Email email = new Email();
    email.subject = "Hi";
    email.recipient = "";
    response = client.toBlocking().exchange(HttpRequest.POST("/email/createDraft", email));

    assertEquals(HttpStatus.OK, response.getStatus());
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
def "invoking /email/createDraft parse parameters in a POJO and validates using default validation groups"() {
    when:
    Email email = new Email(subject: '', recipient: '')
    client.toBlocking().exchange(HttpRequest.POST('/email/createDraft', email))

    then:
    def e = thrown(HttpClientResponseException)
    def response = e.response
    response.status == HttpStatus.BAD_REQUEST

    when:
    email = new Email(subject: 'Hi', recipient: '')
    response = client.toBlocking().exchange(HttpRequest.POST('/email/createDraft', email))

    then:
    response.status == HttpStatus.OK
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
"test pojo validation using default validation groups" {
    val e = shouldThrow<HttpClientResponseException> {
        val email = Email()
        email.subject = ""
        email.recipient = ""
        client.toBlocking().exchange<Email, Any>(HttpRequest.POST("/email/createDraft", email))
    }
    var response = e.response

    response.status shouldBe HttpStatus.BAD_REQUEST

    val email = Email()
    email.subject = "Hi"
    email.recipient = ""
    response = client.toBlocking().exchange<Email, Any>(HttpRequest.POST("/email/createDraft", email))

    response.status shouldBe HttpStatus.OK
}
```

  </TabItem>
</Tabs>

使用自定义 `FinalValidation` 验证组对 POJO 进行验证，如以下测试所示：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Test
public void testPojoValidation_finalValidationGroup() {
    HttpClientResponseException e = assertThrows(HttpClientResponseException.class, () -> {
        Email email = new Email();
        email.subject = "Hi";
        email.recipient = "";
        client.toBlocking().exchange(HttpRequest.POST("/email/send", email));
    });
    HttpResponse<?> response = e.getResponse();

    assertEquals(HttpStatus.BAD_REQUEST, response.getStatus());

    Email email = new Email();
    email.subject = "Hi";
    email.recipient = "me@micronaut.example";
    response = client.toBlocking().exchange(HttpRequest.POST("/email/send", email));

    assertEquals(HttpStatus.OK, response.getStatus());
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
def "invoking /email/send parse parameters in a POJO and validates using FinalValidation validation group"() {
    when:
    Email email = new Email(subject: 'Hi', recipient: '')
    client.toBlocking().exchange(HttpRequest.POST('/email/send', email))

    then:
    def e = thrown(HttpClientResponseException)
    def response = e.response
    response.status == HttpStatus.BAD_REQUEST

    when:
    email = new Email(subject: 'Hi', recipient: 'me@micronaut.example')
    response = client.toBlocking().exchange(HttpRequest.POST('/email/send', email))

    then:
    response.status == HttpStatus.OK
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
"test pojo validation using FinalValidation validation group" {
    val e = shouldThrow<HttpClientResponseException> {
        val email = Email()
        email.subject = "Hi"
        email.recipient = ""
        client.toBlocking().exchange<Email, Any>(HttpRequest.POST("/email/send", email))
    }
    var response = e.response

    response.status shouldBe HttpStatus.BAD_REQUEST

    val email = Email()
    email.subject = "Hi"
    email.recipient = "me@micronaut.example"
    response = client.toBlocking().exchange<Email, Any>(HttpRequest.POST("/email/send", email))

    response.status shouldBe HttpStatus.OK
}
```

  </TabItem>
</Tabs>

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#datavalidation)
