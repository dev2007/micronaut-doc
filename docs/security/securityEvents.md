---
sidebar_position: 150
---

# 15. 安全事件

Micronaut 安全类会生成几个 [ApplicationEvent](https://micronaut-projects.github.io/micronaut-core/latest/api/io/micronaut/context/event/ApplicationEvent.html)，你可以订阅它们。

|事件名称|描述|
|--|--|
|[LoginFailedEvent](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/event/LoginFailedEvent.html)|登录失败时触发。|
|[LoginSuccessfulEvent](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/event/LoginSuccessfulEvent.html)|登录成功时触发。|
|[LogoutEvent](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/event/LogoutEvent.html)|用户注销时触发。|
|[TokenValidatedEvent](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/event/TokenValidatedEvent.html)|令牌验证时触发。|
|[AccessTokenGeneratedEvent](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/event/AccessTokenGeneratedEvent.html)|生成 JWT 访问令牌时触发。|
|[RefreshTokenGeneratedEvent](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/token/event/RefreshTokenGeneratedEvent.html)|生成 JWT 刷新令牌时触发。|

要了解如何监听事件，参阅文档中的[上下文事件](/core/ioc#313-上下文事件)部分。

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#securityEvents)
