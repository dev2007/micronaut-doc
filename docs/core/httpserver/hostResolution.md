---
sidebar_position: 60
---

# 6.6 主机解析

您可能需要解析当前服务器的主机名。Micronaut包括HttpHostResolver接口的实现。

默认实现按顺序在以下位置查找主机信息：

1. 提供的配置
2. `Forwarded` 头
3. `X-Forwarded-` 头。如果 `X-Forwarded-Host` 头不存在，则会忽略其他 `X-Forwarded` 头。
4. `Host` 头
5. 请求 URI 上的属性
6. 嵌入式服务器 URI 上的属性

通过以下配置可以更改要提取相关数据的头的行为：

*表 1. [HostResolutionConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/HttpServerConfiguration.HostResolutionConfiguration.html) 的配置属性*

|属性|类型|描述|
|--|--|--|
|micronaut.server.host-resolution|[HttpServerConfiguration$HostResolutionConfiguration](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/HttpServerConfiguration.HttpLocaleResolutionConfigurationProperties.html)|主机解析配置|
|micronaut.server.host-resolution.host-header|java.lang.String|存储主机的头名字|
|micronaut.server.host-resolution.protocol-header|java.lang.String|存储协议的头名字|
|micronaut.server.host-resolution.port-header|java.lang.String|存储端口的头名字|
|micronaut.server.host-resolution.port-in-host|boolean|True 代表主机头支持端口|
|micronaut.server.host-resolution.allowed-hosts|java.util.List|允许的主机正则表达式模式列表。任意已解决|

上述配置还支持允许的主机列表。配置此列表可确保任何解析的主机与提供的正则表达式模式之一匹配。这有助于防止主机缓存投毒攻击，建议进行配置。

> [英文链接](https://docs.micronaut.io/3.8.4/guide/index.html#hostResolution)
