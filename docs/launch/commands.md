# 3. 可用的命令

**名字**

mn——用于生成项目和服务的 Micronaut CLI 命令行界面。

**概要**

**mn** [**-hvVx**] [COMMAND]

**描述**

用于生成项目和服务的 Micronaut CLI 命令行界面。应用程序生成命令包括：

- **create-app** NAME
- **create-cli-app** NAME
- **create-function-app** NAME
- **create-grpc-app** NAME
- **create-messaging-app** NAME

**选项**

- **-h**，**--help**

    展示帮助信息并退出。

- **-v**，**--verbose**

    创建详细输出。

- **-V**，**--version**

    打印版本信息并退出。

- **-x**，**--stacktrace**

    发生异常时显示完整堆栈跟踪。

## 命令

- [create-app](#create-app)

    创建一个应用

- [create-cli-app](#create-cli-app)

    创建一个 CLI 应用

- [create-function-app](#create-function-app)

    创建一个云应用

- [create-grpc-app](#create-grpc-app)

    创建一个 gRPC 应用

- [create-messaging-app](#create-messaging-app)

    创建一个消息应用

- [create](#create)

    创建应用程序的指导性步骤

- [create-aws-lambda](#create-aws-lambda)

    创建 lambda 函数的指导性步骤

### create-app

**名字**

mn-create-app —— 创建一个应用

**概要**

**mn** **create-app** [**-hivVx**] [**--list-features**] [**-b**=BUILD-TOOL] [**--jdk**=<javaVersion>] [**-l**=LANG] [**-t**=TEST] [**-f**=FEATURE[,FEATURE…​]]…​ [NAME]

**描述**

创建一个应用

**选项**

- **-b**，**--build**=*BUILD-TOOL*

    要配置的生成工具。可能的值：gradle、gradle_kotlin、maven。

- **-f**，**--features**=*FEATURE*[,*FEATURE*…​]

    使用的特性。可能的值：jdbc-ucp, jdbc-tomcat, jdbc-dbcp, jdbc-hikari, data-r2dbc, spring, data-hibernate-reactive, springloaded, cassandra, oracle, logback, tracing-opentelemetry-gcp, kubernetes-reactor-client, micrometer-jmx, nats, micrometer-appoptics, security-jwt, kubernetes-informer, slf4j-simple, netflix-archaius, gcp-cloud-trace, multi-tenancy, arm, testcontainers, micronaut-aot, rss, cache-caffeine, tracing-opentelemetry-xray, crac, mysql, netflix-hystrix, micrometer-dynatrace, log4j2, security, oci-devops-build-ci, tracing-opentelemetry-zipkin, dynamodb, agorapulse-gru-http, aws-secrets-manager, jooq, mongo-reactive, oracle-function, security-ldap, http-client, data-mongodb, dekorate-kubernetes, email-javamail, object-storage-oracle-cloud, netty-server, postgres, azure-key-vault, graalvm, jms-sqs, dekorate-openshift, hibernate-reactive-jpa, github-workflow-ci, assertj, rxjava2, data-jdbc, views-velocity, kubernetes, micrometer-influx, rxjava1, gradle-enterprise, spring-data-jpa, neo4j-bolt, jmx, github-workflow-graal-docker-registry, jib, micrometer-azure-monitor, email-template, cache-coherence, jackson-xml, dekorate-halkyon, cache-ehcache, knative, coherence, jasync-sql, undertow-server, data-jpa, mqttv3, vertx-mysql-client, aws-v2-sdk, data-mongodb-reactive, hamcrest, sql-jdbi, elasticsearch, micrometer-atlas, jms-oracle-aq, hibernate-validator, openapi, sqlserver, agorapulse-micronaut-worker, jms-activemq-classic, discovery-consul, tomcat-server, github-workflow-oracle-cloud-functions, jetty-server, aws-lambda-custom-runtime, google-cloud-workflow-ci, dekorate-prometheus, micrometer-ganglia, jax-rs, kafka, microstream-cache, gcp-pubsub, discovery-kubernetes, config-kubernetes, tracing-opentelemetry-exporter-logging, views-thymeleaf, views-soy, coherence-data, tracing-zipkin, object-storage-azure, camunda-platform7, micrometer-datadog, object-storage-aws, rabbitmq, agorapulse-micronaut-permissions, mongo-sync, amazon-api-gateway-http, spring-web, micrometer-statsd, views-handlebars, kotlin-extension-functions, github-workflow-google-cloud-run-graalvm, config-consul, swagger-ui, cache-hazelcast, micrometer-humio, camunda-external-worker, micrometer-annotation, amazon-cognito, multi-tenancy-gorm, aws-lambda, micrometer-new-relic, azure-function, azure-cosmos-db, micrometer-kairos, micrometer-stackdriver, test-resources, email-amazon-ses, micrometer-graphite, agorapulse-micronaut-console, mariadb, tracing-jaeger, serialization-jsonp, microstream, coherence-grpc-client, oracle-cloud-sdk, graphql, problem-json, email-postmark, serialization-bson, micrometer-elastic, dekorate-jaeger, gitlab-workflow-ci, tracing-opentelemetry-exporter-otlp, discovery-eureka, google-cloud-function, mqtt, redis-lettuce, oracle-cloud-atp, coherence-distributed-configuration, reactor, rss-itunes-podcast, jackson-databind, h2, micrometer-signalfx, github-workflow-azure-container-instance-graalvm, coherence-session, flyway, hibernate-gorm, hibernate-jpa, rxjava3, kafka-streams, micrometer-prometheus, awaitility, tracing-opentelemetry-jaeger, spring-boot, kubernetes-rxjava2-client, micrometer-wavefront, kubernetes-client, junit-params, aws-codebuild-workflow-ci, github-workflow-google-cloud-run, mongo-gorm, asciidoctor, acme, management, jms-core, x86, netflix-ribbon, views-rocker, email-sendgrid, dekorate-knative, http-session, views-jte, dekorate-servicecatalog, github-workflow-oracle-cloud-functions-graalvm, aws-alexa, gcp-secrets-manager, liquibase, email-mailjet, views-freemarker, camunda-zeebe, micrometer-cloudwatch, vertx-pg-client, localstack, neo4j-gorm, oracle-cloud-vault, mockito, cache-infinispan, aws-parameter-store, serialization-jackson, jrebel, microstream-rest, spring-data-jdbc, lombok, object-storage-gcp, github-workflow-docker-registry, r2dbc, views-pebble, github-workflow-azure-container-instance, jms-activemq-artemis, openrewrite, amazon-api-gateway, micronaut-test-rest-assured, micrometer-oracle-cloud, security-oauth2, security-session, aws-cdk, ktor, shade, config4k, properties, toml

- **-h**，**--help**

    展示帮助信息并退出。

- **-i**，**--inplace**

    使用当前目录创建一个服务

- **--jdk**，**--java-version**=`<javaVersion>`

    项目将使用的 JDK 版本

- **-l**，**--lang**=*LANG*

    要使用的值。可能的值：java, groovy, kotlin。

- **--list-features**

    输出可用特性及其描述

- **-t**，**--test**=*TEST*

    要使用的测试框架。可能的值：junit, spock, kotest。

- **-v**，**--verbose**

    创建详细输出。

- **-V**，**--version**

    打印版本信息并退出。

- **-x**，**--stacktrace**

    发生异常时显示完整堆栈跟踪。

**参数**

- *[NAME]*

    创建的应用名字。

### create-cli-app

**名字**

mn-create-cli-app —— 创建一个 CLI 应用

**概要**

**mn** **create-cli-app** [**-hivVx**] [**--list-features**] [**-b**=BUILD-TOOL] [**--jdk**=<javaVersion>] [**-l**=LANG] [**-t**=TEST] [**-f**=FEATURE[, FEATURE…​]]…​ [NAME]

**描述**

创建一个 CLI 应用

**选项**

- **-b**，**--build**=*BUILD-TOOL*

    要配置的生成工具。可能的值：gradle、gradle_kotlin、maven。

- **-f**，**--features**=*FEATURE*[,*FEATURE*…​]

    待使用的特性。可能的值：jdbc-ucp, jdbc-tomcat, jdbc-dbcp, jdbc-hikari, data-r2dbc, spring, data-hibernate-reactive, springloaded, cassandra, oracle, logback, kubernetes-reactor-client, nats, security-jwt, kubernetes-informer, slf4j-simple, gcp-cloud-trace, multi-tenancy, arm, testcontainers, cache-caffeine, crac, mysql, netflix-hystrix, log4j2, security, oci-devops-build-ci, dynamodb, jooq, mongo-reactive, security-ldap, http-client, data-mongodb, email-javamail, object-storage-oracle-cloud, postgres, graalvm, jms-sqs, hibernate-reactive-jpa, github-workflow-ci, assertj, rxjava2, data-jdbc, rxjava1, gradle-enterprise, spring-data-jpa, neo4j-bolt, github-workflow-graal-docker-registry, jib, email-template, cache-coherence, jackson-xml, cache-ehcache, coherence, jasync-sql, data-jpa, mqttv3, vertx-mysql-client, aws-v2-sdk, data-mongodb-reactive, hamcrest, sql-jdbi, elasticsearch, jms-oracle-aq, hibernate-validator, sqlserver, jms-activemq-classic, github-workflow-oracle-cloud-functions, google-cloud-workflow-ci, kafka, microstream-cache, gcp-pubsub, coherence-data, object-storage-azure, object-storage-aws, rabbitmq, agorapulse-micronaut-permissions, mongo-sync, kotlin-extension-functions, github-workflow-google-cloud-run-graalvm, cache-hazelcast, multi-tenancy-gorm, azure-cosmos-db, test-resources, email-amazon-ses, mariadb, serialization-jsonp, microstream, coherence-grpc-client, oracle-cloud-sdk, graphql, problem-json, email-postmark, serialization-bson, gitlab-workflow-ci, mqtt, redis-lettuce, oracle-cloud-atp, reactor, jackson-databind, h2, github-workflow-azure-container-instance-graalvm, coherence-session, flyway, hibernate-gorm, hibernate-jpa, rxjava3, kafka-streams, awaitility, spring-boot, kubernetes-rxjava2-client, kubernetes-client, junit-params, aws-codebuild-workflow-ci, github-workflow-google-cloud-run, mongo-gorm, asciidoctor, jms-core, x86, netflix-ribbon, email-sendgrid, http-session, github-workflow-oracle-cloud-functions-graalvm, liquibase, email-mailjet, vertx-pg-client, localstack, neo4j-gorm, mockito, cache-infinispan, serialization-jackson, jrebel, microstream-rest, spring-data-jdbc, lombok, object-storage-gcp, github-workflow-docker-registry, r2dbc, github-workflow-azure-container-instance, jms-activemq-artemis, openrewrite, micronaut-test-rest-assured, security-oauth2, security-session, shade, config4k, properties, toml

- **-h**，**--help**

    展示帮助信息并退出。

- **-i**，**--inplace**

    使用当前目录创建一个服务

- **--jdk**，**--java-version**=`<javaVersion>`

    项目将使用的 JDK 版本

- **-l**，**--lang**=*LANG*

    要使用的值。可能的值：java, groovy, kotlin。

- **--list-features**

    输出可用特性及其描述

- **-t**，**--test**=*TEST*

    要使用的测试框架。可能的值：junit, spock, kotest。

- **-v**，**--verbose**

    创建详细输出。

- **-V**，**--version**

    打印版本信息并退出。

- **-x**，**--stacktrace**

    发生异常时显示完整堆栈跟踪。

**参数**

- *[NAME]*

    创建的应用名字。

### create-function-app

**名字**
mn-create-function-app —— 创建一个 Cloud 应用

**概要**

**mn** **create-function-app** [**-hivVx**] [**--list-features**] [**-b**=BUILD-TOOL] [**--jdk**=<javaVersion>] [**-l**=LANG] [**-t**=TEST] [**-f**=FEATURE[, FEATURE…​]]…​ [NAME]

**描述**

创建一个 Cloud 应用

**选项**

- **-b**，**--build**=*BUILD-TOOL*

    要配置的生成工具。可能的值：gradle、gradle_kotlin、maven。

- **-f**，**--features**=*FEATURE*[,*FEATURE*…​]

    待使用的特性。可能的值：Possible values: jdbc-ucp, jdbc-tomcat, jdbc-dbcp, jdbc-hikari, data-r2dbc, spring, data-hibernate-reactive, springloaded, cassandra, oracle, logback, tracing-opentelemetry-gcp, kubernetes-reactor-client, nats, security-jwt, kubernetes-informer, slf4j-simple, netflix-archaius, gcp-cloud-trace, multi-tenancy, arm, testcontainers, cache-caffeine, tracing-opentelemetry-xray, mysql, netflix-hystrix, log4j2, security, oci-devops-build-ci, tracing-opentelemetry-zipkin, dynamodb, aws-secrets-manager, jooq, mongo-reactive, oracle-function, security-ldap, http-client, data-mongodb, email-javamail, aws-lambda-s3-event-notification, object-storage-oracle-cloud, postgres, azure-key-vault, graalvm, jms-sqs, aws-lambda-function-url, hibernate-reactive-jpa, aws-lambda-scheduled-event, github-workflow-ci, assertj, rxjava2, data-jdbc, rxjava1, gradle-enterprise, spring-data-jpa, neo4j-bolt, github-workflow-graal-docker-registry, jib, email-template, cache-coherence, jackson-xml, cache-ehcache, coherence, jasync-sql, data-jpa, mqttv3, vertx-mysql-client, aws-v2-sdk, data-mongodb-reactive, hamcrest, sql-jdbi, elasticsearch, jms-oracle-aq, hibernate-validator, sqlserver, jms-activemq-classic, discovery-consul, github-workflow-oracle-cloud-functions, aws-lambda-custom-runtime, google-cloud-workflow-ci, kafka, microstream-cache, gcp-pubsub, discovery-kubernetes, tracing-opentelemetry-exporter-logging, coherence-data, tracing-zipkin, object-storage-azure, object-storage-aws, rabbitmq, agorapulse-micronaut-permissions, mongo-sync, amazon-api-gateway-http, kotlin-extension-functions, github-workflow-google-cloud-run-graalvm, config-consul, cache-hazelcast, multi-tenancy-gorm, aws-lambda, azure-function, azure-cosmos-db, test-resources, email-amazon-ses, mariadb, tracing-jaeger, serialization-jsonp, microstream, coherence-grpc-client, oracle-cloud-sdk, graphql, problem-json, email-postmark, serialization-bson, gitlab-workflow-ci, tracing-opentelemetry-exporter-otlp, discovery-eureka, google-cloud-function, mqtt, redis-lettuce, oracle-cloud-atp, coherence-distributed-configuration, reactor, jackson-databind, h2, github-workflow-azure-container-instance-graalvm, coherence-session, flyway, hibernate-gorm, hibernate-jpa, rxjava3, kafka-streams, awaitility, tracing-opentelemetry-jaeger, spring-boot, kubernetes-rxjava2-client, kubernetes-client, junit-params, aws-codebuild-workflow-ci, github-workflow-google-cloud-run, mongo-gorm, asciidoctor, jms-core, x86, netflix-ribbon, email-sendgrid, http-session, github-workflow-oracle-cloud-functions-graalvm, aws-alexa, gcp-secrets-manager, liquibase, email-mailjet, vertx-pg-client, localstack, neo4j-gorm, oracle-cloud-vault, mockito, cache-infinispan, aws-parameter-store, serialization-jackson, jrebel, microstream-rest, spring-data-jdbc, lombok, object-storage-gcp, github-workflow-docker-registry, r2dbc, github-workflow-azure-container-instance, jms-activemq-artemis, openrewrite, amazon-api-gateway, micronaut-test-rest-assured, security-oauth2, security-session, aws-cdk, shade, config4k, properties, toml

- **-h**，**--help**

    展示帮助信息并退出。

- **-i**，**--inplace**

    使用当前目录创建一个服务

- **--jdk**，**--java-version**=`<javaVersion>`

    项目将使用的 JDK 版本

- **-l**，**--lang**=*LANG*

    要使用的值。可能的值：java, groovy, kotlin。

- **--list-features**

    输出可用特性及其描述

- **-t**，**--test**=*TEST*

    要使用的测试框架。可能的值：junit, spock, kotest。

- **-v**，**--verbose**

    创建详细输出。

- **-V**，**--version**

    打印版本信息并退出。

- **-x**，**--stacktrace**

    发生异常时显示完整堆栈跟踪。

**参数**

- *[NAME]*

    创建的应用名字。

### create-grpc-app

**名字**

mn-create-grpc-app —— 创建一个 gRPC 应用

**概要**

**mn** **create-grpc-app** [**-hivVx**] [**--list-features**] [**-b**=BUILD-TOOL] [**--jdk**=<javaVersion>] [**-l**=LANG] [**-t**=TEST] [**-f**=FEATURE[, FEATURE…​]]…​ [NAME]

**描述**

创建一个 gRPC 应用

**选项**

- **-b**，**--build**=*BUILD-TOOL*

    要配置的生成工具。可能的值：gradle、gradle_kotlin、maven。

- **-f**，**--features**=*FEATURE*[,*FEATURE*…​]

    待使用的特性。可能的值：Possible values: jdbc-ucp, jdbc-tomcat, jdbc-dbcp, jdbc-hikari, data-r2dbc, spring, data-hibernate-reactive, springloaded, cassandra, oracle, logback, tracing-opentelemetry-gcp, kubernetes-reactor-client, nats, security-jwt, kubernetes-informer, slf4j-simple, netflix-archaius, gcp-cloud-trace, multi-tenancy, arm, testcontainers, cache-caffeine, tracing-opentelemetry-xray, mysql, netflix-hystrix, log4j2, security, oci-devops-build-ci, tracing-opentelemetry-zipkin, dynamodb, aws-secrets-manager, jooq, mongo-reactive, security-ldap, http-client, data-mongodb, dekorate-kubernetes, email-javamail, object-storage-oracle-cloud, postgres, azure-key-vault, graalvm, jms-sqs, dekorate-openshift, hibernate-reactive-jpa, github-workflow-ci, assertj, rxjava2, data-jdbc, kubernetes, rxjava1, gradle-enterprise, spring-data-jpa, neo4j-bolt, github-workflow-graal-docker-registry, jib, email-template, cache-coherence, jackson-xml, dekorate-halkyon, cache-ehcache, knative, coherence, jasync-sql, data-jpa, mqttv3, vertx-mysql-client, aws-v2-sdk, data-mongodb-reactive, hamcrest, sql-jdbi, elasticsearch, jms-oracle-aq, hibernate-validator, sqlserver, jms-activemq-classic, discovery-consul, github-workflow-oracle-cloud-functions, google-cloud-workflow-ci, dekorate-prometheus, kafka, microstream-cache, gcp-pubsub, discovery-kubernetes, config-kubernetes, tracing-opentelemetry-exporter-logging, coherence-data, tracing-zipkin, object-storage-azure, object-storage-aws, rabbitmq, agorapulse-micronaut-permissions, mongo-sync, kotlin-extension-functions, github-workflow-google-cloud-run-graalvm, config-consul, cache-hazelcast, multi-tenancy-gorm, azure-cosmos-db, test-resources, email-amazon-ses, mariadb, tracing-jaeger, serialization-jsonp, microstream, coherence-grpc-client, oracle-cloud-sdk, graphql, problem-json, email-postmark, serialization-bson, dekorate-jaeger, gitlab-workflow-ci, tracing-opentelemetry-exporter-otlp, discovery-eureka, mqtt, redis-lettuce, oracle-cloud-atp, coherence-distributed-configuration, reactor, jackson-databind, h2, github-workflow-azure-container-instance-graalvm, coherence-session, flyway, hibernate-gorm, hibernate-jpa, rxjava3, kafka-streams, awaitility, tracing-opentelemetry-jaeger, spring-boot, kubernetes-rxjava2-client, kubernetes-client, junit-params, aws-codebuild-workflow-ci, github-workflow-google-cloud-run, mongo-gorm, asciidoctor, jms-core, x86, netflix-ribbon, email-sendgrid, dekorate-knative, http-session, dekorate-servicecatalog, github-workflow-oracle-cloud-functions-graalvm, gcp-secrets-manager, liquibase, email-mailjet, vertx-pg-client, localstack, neo4j-gorm, oracle-cloud-vault, mockito, cache-infinispan, aws-parameter-store, serialization-jackson, jrebel, microstream-rest, spring-data-jdbc, lombok, object-storage-gcp, github-workflow-docker-registry, r2dbc, github-workflow-azure-container-instance, jms-activemq-artemis, openrewrite, micronaut-test-rest-assured, security-oauth2, security-session, shade, config4k, properties, toml

- **-h**，**--help**

    展示帮助信息并退出。

- **-i**，**--inplace**

    使用当前目录创建一个服务

- **--jdk**，**--java-version**=`<javaVersion>`

    项目将使用的 JDK 版本

- **-l**，**--lang**=*LANG*

    要使用的值。可能的值：java, groovy, kotlin。

- **--list-features**

    输出可用特性及其描述

- **-t**，**--test**=*TEST*

    要使用的测试框架。可能的值：junit, spock, kotest。

- **-v**，**--verbose**

    创建详细输出。

- **-V**，**--version**

    打印版本信息并退出。

- **-x**，**--stacktrace**

    发生异常时显示完整堆栈跟踪。

**参数**

- *[NAME]*

    创建的应用名字。

### create-messaging-app

**名字**
mn-create-messaging-app —— 创建一个消息应用

**概要**

**mn** **create-messaging-app** [**-hivVx**] [**--list-features**] [**-b**=BUILD-TOOL] [**--jdk**=<javaVersion>] [**-l**=LANG] [**-t**=TEST] [**-f**=FEATURE[, FEATURE…​]]…​ [NAME]

**描述**

创建一个消息应用

**选项**

- **-b**，**--build**=*BUILD-TOOL*

    要配置的生成工具。可能的值：gradle、gradle_kotlin、maven。

- **-f**，**--features**=*FEATURE*[,*FEATURE*…​]

    待使用的特性。可能的值： jdbc-ucp, jdbc-tomcat, jdbc-dbcp, jdbc-hikari, data-r2dbc, spring, data-hibernate-reactive, springloaded, cassandra, oracle, logback, tracing-opentelemetry-gcp, kubernetes-reactor-client, nats, security-jwt, kubernetes-informer, slf4j-simple, netflix-archaius, gcp-cloud-trace, multi-tenancy, arm, testcontainers, cache-caffeine, tracing-opentelemetry-xray, mysql, netflix-hystrix, log4j2, security, oci-devops-build-ci, tracing-opentelemetry-zipkin, dynamodb, aws-secrets-manager, jooq, mongo-reactive, security-ldap, http-client, data-mongodb, email-javamail, object-storage-oracle-cloud, postgres, azure-key-vault, graalvm, jms-sqs, hibernate-reactive-jpa, github-workflow-ci, assertj, rxjava2, data-jdbc, rxjava1, gradle-enterprise, spring-data-jpa, neo4j-bolt, github-workflow-graal-docker-registry, jib, email-template, cache-coherence, jackson-xml, cache-ehcache, coherence, jasync-sql, data-jpa, mqttv3, vertx-mysql-client, aws-v2-sdk, data-mongodb-reactive, hamcrest, sql-jdbi, elasticsearch, jms-oracle-aq, hibernate-validator, sqlserver, jms-activemq-classic, discovery-consul, github-workflow-oracle-cloud-functions, google-cloud-workflow-ci, kafka, microstream-cache, gcp-pubsub, discovery-kubernetes, config-kubernetes, tracing-opentelemetry-exporter-logging, coherence-data, tracing-zipkin, object-storage-azure, object-storage-aws, rabbitmq, agorapulse-micronaut-permissions, mongo-sync, kotlin-extension-functions, github-workflow-google-cloud-run-graalvm, config-consul, cache-hazelcast, multi-tenancy-gorm, azure-cosmos-db, test-resources, email-amazon-ses, mariadb, tracing-jaeger, serialization-jsonp, microstream, coherence-grpc-client, oracle-cloud-sdk, graphql, problem-json, email-postmark, serialization-bson, gitlab-workflow-ci, tracing-opentelemetry-exporter-otlp, discovery-eureka, mqtt, redis-lettuce, oracle-cloud-atp, coherence-distributed-configuration, reactor, jackson-databind, h2, github-workflow-azure-container-instance-graalvm, coherence-session, flyway, hibernate-gorm, hibernate-jpa, rxjava3, kafka-streams, awaitility, tracing-opentelemetry-jaeger, spring-boot, kubernetes-rxjava2-client, kubernetes-client, junit-params, aws-codebuild-workflow-ci, github-workflow-google-cloud-run, mongo-gorm, asciidoctor, jms-core, x86, netflix-ribbon, email-sendgrid, http-session, github-workflow-oracle-cloud-functions-graalvm, gcp-secrets-manager, liquibase, email-mailjet, vertx-pg-client, localstack, neo4j-gorm, oracle-cloud-vault, mockito, cache-infinispan, aws-parameter-store, serialization-jackson, jrebel, microstream-rest, spring-data-jdbc, lombok, object-storage-gcp, github-workflow-docker-registry, r2dbc, github-workflow-azure-container-instance, jms-activemq-artemis, openrewrite, micronaut-test-rest-assured, security-oauth2, security-session, shade, config4k, properties, toml

- **-h**，**--help**

    展示帮助信息并退出。

- **-i**，**--inplace**

    使用当前目录创建一个服务

- **--jdk**，**--java-version**=`<javaVersion>`

    项目将使用的 JDK 版本

- **-l**，**--lang**=*LANG*

    要使用的值。可能的值：java, groovy, kotlin。

- **--list-features**

    输出可用特性及其描述

- **-t**，**--test**=*TEST*

    要使用的测试框架。可能的值：junit, spock, kotest。

- **-v**，**--verbose**

    创建详细输出。

- **-V**，**--version**

    打印版本信息并退出。

- **-x**，**--stacktrace**

    发生异常时显示完整堆栈跟踪。

**参数**

- *[NAME]*

    创建的应用名字。

> [英文链接](https://micronaut-projects.github.io/micronaut-starter/3.8.4/guide/#commands)
