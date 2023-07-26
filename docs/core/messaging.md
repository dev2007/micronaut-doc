---
sidebar_position: 100
---

# 10. 消息驱动的微服务

在过去的单体应用程序中，用于监听消息系统消息的消息监听器经常被嵌入到同一个应用程序单元中。

在微服务架构中，由 RabbitMQ 或 Kafka 等消息系统驱动的单个微服务应用很常见。

事实上，消息驱动的微服务甚至可能没有 HTTP 端点或 HTTP 服务器（尽管从健康检查和可见性的角度来看可能很有价值）。

## 10.1 Kafka 支持

[Apache Kafka](https://kafka.apache.org/) 是一个分布式流处理平台，除流处理和实时数据处理外，还可用于满足各种消息传递需求。

Micronaut 专门支持定义 Kafka `Producer` 和 `Consumer` 实例。使用 Kafka 构建的 Micronaut 应用程序可以在有或没有 HTTP 服务器的情况下部署。

借助 Micronaut 高效的编译时 AOP 和云原生功能，编写使用极少资源的高效 Kafka 消费者应用程序易如反掌。

有关如何使用 Micronaut 构建 Kafka 应用程序的更多信息，参阅 [Micronaut Kafka](/kafka.html) 文档。

## 10.2 RabbitMQ 支持

[RabbitMQ](https://www.rabbitmq.com/) 是部署最广泛的开源消息代理。

Micronaut 专门支持 RabbitMQ 发布者和消费者的定义。使用 RabbitMQ 构建的 Micronaut 应用程序可在有或没有 HTTP 服务器的情况下部署。

借助 Micronaut 高效的编译时 AOP，使用 RabbitMQ 变得前所未有的简单。新增了对发布者确认和通过反应流的 RPC 的支持。

有关如何使用 Micronaut 构建 RabbitMQ 应用程序的更多信息，参阅 [Micronaut RabbitMQ](/rabbitmq.html) 文档。

## 10.3 Nats.io 支持

[Nats.io](https://nats.io/) 是一个简单、安全、高性能的开源消息系统，适用于云原生应用、物联网消息传递和微服务架构。

Micronaut 专门支持定义 Nats.io 发布者和消费者。使用 Nats.io 构建的 Micronaut 应用程序可以在有或没有 HTTP 服务器的情况下部署。

借助 Micronaut 高效的编译时 AOP，使用 Nats.io 变得前所未有的简单。新增了对发布者确认和通过反应流的 RPC 的支持。

有关如何使用 Micronaut 构建 Nats.io 应用程序的更多信息，参阅 [Micronaut Nats](/nats.html) 文档。

> [英文链接](https://micronaut-projects.github.io/micronaut-docs-mn3/3.9.4/guide/index.html#messaging)
