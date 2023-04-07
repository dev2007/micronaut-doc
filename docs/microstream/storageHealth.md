---
sidebar_position: 100
---

# 10. 健康

[健康端点](../core/management.html#1523-健康端点)暴露 Micronaut 应用程序中 MicroStream 实例的状态。

添加 [management](../core/management.html) 依赖后，具有一个名为 `blue` 的 MicroStream 实例的 Micronaut 应用程序的 `/health` 端点将返回：

```json
{
  "name": "application",
  "status": "UP",
  "details": {
    "microstream.blue": {
      "name": "application",
      "status": "UP",
      "details": {
        "startingUp": false,
        "running": true,
        "active": true,
        "acceptingTasks": true,
        "shuttingDown": false,
        "shutdown": false
      }
    },
    ...
  }
}
```

默认情况下，上面可见的详细信息仅显示给经过认证的用户。有关如何配置该设置，参阅[健康端点](../core/management.html#1523-健康端点)文档。

如果你希望在仍使用 `management` 依赖项的情况下禁用 MicroStream 运行状况检查，则可以在应用程序配置中将 `endpoints.health.microsoftstream.enabled` 属性设置为 `false`。

```yaml
endpoints:
  health:
    microstream:
      enabled: false
```

> [英文链接](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/guide/index.html#storageHealth)
