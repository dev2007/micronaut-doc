---
sidebar_position: 20
---

# 6.2 在指定端口运行服务器

默认情况下，服务器在 `8080` 端口上运行。但是，你可以将服务器设置为在特定端口上运行：

```yaml
micronaut:
  server:
    port: 8086
```

也可以通过环境变量进行配置，例如：`MICRONAUT_SERVER_PORT=8086`

在随机端口上运行：

```yaml
micronaut:
  server:
    port: -1
```

:::note 提示
如果多个服务器同时在同一端口上启动，设置显式端口可能会导致测试失败。要防止这种情况，请在测试环境配置中指定一个随机端口。
:::


> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#runningSpecificPort)
