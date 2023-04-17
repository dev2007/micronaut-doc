---
sidebar_position: 60
---

# 6.7 区域解析

Micronaut 支持几种策略来解析给定请求的区域设置。[getLocale--](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/HttpRequest.html#getLocale--) 方法可用于请求，但它只支持解析 `Accept-Language` 头。对于区域设置可以在 cookie、用户会话中，或者应该设置为固定值的其他用例，可以使用 [HttpLocaleResolver](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/util/locale/HttpLocaleResolver.html) 来确定当前区域设置。

[LocaleResolver](https://docs.micronaut.io/3.8.4/api/io/micronaut/core/util/LocaleResolver.html) API 不需要直接使用。只需为 `java.util.Locale` 类型的控制器方法定义一个参数，就会自动解析和注入区域设置。

有几个配置选项可以控制如何解析区域设置：

*表 1. [HttpLocaleResolutionConfigurationProperties](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/HttpServerConfiguration.HttpLocaleResolutionConfigurationProperties.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.server.locale-resolution|HttpServerConfiguration$HttpLocaleResolutionConfigurationProperties|区域解析配置|
|micronaut.server.locale-resolution.fixed|java.util.Locale|设置区域设置的语言标记。支持 BCP 47 语言标签（例如“en-US”）和 ISO 标准（例如“en_US”）。|
|micronaut.server.locale-resolution.session-attribute|java.lang.String|设置会话中的键以查找区域设置。|
|micronaut.server.locale-resolution.cookie-name|java.lang.String|设置用于存储区域的 cookie 的名称。|
|micronaut.server.locale-resolution.header|boolean|如果应该从 `Accept-Language` 头解析区域设置，请设置为 true。默认值（true）。|
|micronaut.server.locale-resolution.default-locale|java.util.Locale|设置在无法通过任何方式解析区域设置时将使用的区域设置。默认为系统默认值。|

区域设置可以配置为“en_GB”格式，也可以配置为 BCP 47（语言标记）格式。如果配置了多个方法，则固定区域设置优先，然后是 session/cookie，然后是头。

如果任何内置方法都不符合你的用例，请创建 [HttpLocaleResolver](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/util/locale/HttpLocaleResolver.html) 类型的 bean，并设置其相对于现有解析器的顺序（通过 `getOrder` 方法）。

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#localeResolution)
