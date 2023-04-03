---
sidebar_position: 50
---

# 5. Redis 和测试

出于测试目的，我们建议[通过 TestContainers](https://www.testcontainers.org/features/creating_container/#examples) 在 Docker 容器中运行 Redis 的真实版本。

```java
GenericContainer<?> redisContainer = new GenericContainer<>(DockerImageName.parse(REDIS_DOCKER_NAME))
    .withExposedPorts(REDIS_PORT)
    .waitingFor(
            Wait.forLogMessage(".*Ready to accept connections.*\\n", 1)
    );
redisContainer.start();
```

我们过去建议的嵌入式 redis 容器已从 5.3.0 开始弃用，并将在稍后删除。

> [英文链接](https://micronaut-projects.github.io/micronaut-redis/5.3.2/guide/index.html#testing)
