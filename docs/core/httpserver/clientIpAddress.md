---
sidebar_position: 80
---

# 6.8 客户端 IP 地址

你可能需要解析 HTTP 请求的原始 IP 地址。Micronaut 包括 [HttpClientAddressResolver](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/server/util/HttpClientAddressResolver.html) 的实现。
默认实现按顺序解析以下位置的客户端地址：

1. 配置的头
2. `Forwarded` 头
3. `X-Forwarded-For` 头
4. 请求中的远程地址

可以使用 `micronaut.server.client-address-header` 配置第一优先级头名称。

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#clientIpAddress)
