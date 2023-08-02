---
sidebar_position: 50
---

# 18.5 代理配置

要配置 CLI 以使用 HTTP 代理，有两个步骤。配置选项可通过 MN_OPTS 环境变量传递给 cli。

例如在 *nix 系统上：

```bash
export MN_OPTS="-Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=3128 -Dhttp.proxyUser=test -Dhttp.proxyPassword=test"
```

配置文件依赖关系通过 HTTPS 解析，因此代理端口和主机配置为 `https.`，但用户和密码指定为 `http.`。

对于 Windows 系统，可在 `My Computer/Advanced/Environment Variables` 下配置环境变量。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#proxy)
