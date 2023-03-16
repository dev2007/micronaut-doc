---
sidebar_position: 90
---

# 9. 中断变更

本单记录版本之间的中断变更

## 3.3.4

**绑定网络接口**

以前，默认的 servlet 引擎将绑定到所有网络接口。这是一个安全风险。现在，默认的 servlet 引擎将仅绑定到本地主机。要恢复原始功能，你需要配置 `micronaut.server.host`，或设置 `HOST` 环境变量。

> [英文链接](https://micronaut-projects.github.io/micronaut-servlet/3.3.5/guide/index.html#breaks)
