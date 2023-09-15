---
sidebar_position: 60
---

# 6. 异常处理器

Micronaut Security 内置了多种异常处理程序：

|异常|处理器|
|--|--|
|[AuthenticationException](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/AuthenticationException.html)|[AuthenticationExceptionHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/AuthenticationExceptionHandler.html)
|[AuthorizationException](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/AuthorizationException.html)|[DefaultAuthorizationExceptionHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/DefaultAuthorizationExceptionHandler.html)|
|[AuthorizationErrorResponseException](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/oauth2/endpoint/authorization/response/AuthorizationErrorResponseException.html)|[AuthorizationErrorResponseExceptionHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/oauth2/endpoint/authorization/response/AuthorizationErrorResponseExceptionHandler.html)|
|[OauthErrorResponseException](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/errors/OauthErrorResponseException.html)|[OauthErrorResponseExceptionHandler](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/errors/OauthErrorResponseExceptionHandler.html)|

你可能需要[替换（replace）](/core/ioc#310-bean-替换)其中一些 bean，以便根据你的需要定制 Micronaut Security 异常处理。

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#exceptionHandlers)
