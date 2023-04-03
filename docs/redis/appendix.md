---
sidebar_position: 100
---

# 10. 附录

## 10.1 中断更改

本节记录版本之间的中断更改。

### 5.3.0

- 可用于测试的嵌入式 Redis 服务器已更改为仅绑定到 localhost。

如果你希望恢复到以前的行为，则需要使用特定于测试的 `application.yml` 文件中指定的配置文件。

*embedded-redis.conf*

```yaml
embedded-redis.conf
```

*test-application.yml*

```yaml
redis:
  embedded:
    config-file: '/full/path/to/embedded-redis.conf'
```

> [英文链接](https://micronaut-projects.github.io/micronaut-redis/5.3.2/guide/index.html#appendix)
