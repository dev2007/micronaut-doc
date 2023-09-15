---
sidebar_position: 170
---

# 17 提前优化（AOT 优化）

:::note 提示
Micronaut AOT 是一个为 Micronaut 应用程序和库实现超前（AOT）优化的框架。这些优化包括在构建时计算通常在运行时完成的事情]。
Micronaut Security 提供了几种超前优化。
:::

## 17.1 Micronaut 安全性 AOT 配置

使用 [Micronaut Gradle Plugin](https://micronaut-projects.github.io/micronaut-gradle-plugin/latest/#_configuration)，可以使用 `aotPlugins` 配置来声明要使用的其他 AOT 模块：

```groovy
dependencies {
...
..
//http://github.com/micronaut-projects/micronaut-security/releases
aotPlugins("io.micronaut.security:micronaut-security-aot:3.9.0")
}
```

对于 [Micronaut Maven 插件](https://micronaut-projects.github.io/micronaut-maven-plugin/latest/examples/aot.html)，你需要这样做：

```xml
  <build>
    <plugins>
      <plugin>
        <groupId>io.micronaut.build</groupId>
        <artifactId>micronaut-maven-plugin</artifactId>
        <configuration>
          <aotDependencies>
            <dependency>
              <groupId>io.micronaut.security</groupId>
              <artifactId>micronaut-security-aot</artifactId>
              <version>3.9.0</version>
            </dependency>
            ...
          </aotDependencies>
        </configuration>
      </plugin>
    </plugins>
  </build>
```

## 17.2 优化 OpenID 配置

当你在 Micronaut 应用程序中使用 [OpenID Connect](/security/oauth) 时，应用程序通过在你为每个 OAuth 2.0 客户端通过 `micronaut.security.oauth2.clients.*.openid.issuer` 指定的值后面添加 `.well-known/openid-configuration` 来构建 URL。它会访问 URL 以获取与指定授权服务器相关的 OpenID Connect 元数据，并对自身进行配置。

不过，这是一个网络请求，可能会比较慢。此外，应用程序很可能需要执行这个网络请求来为第一个请求提供服务。

你可以使用 Micronaut Security 提前构建优化功能，在构建时执行请求。

要启用此优化，在 `aot.properties` 中添加 `micronaut.security.openid-configuration.enabled=true` 即可。

:::caution 警告
应用程序在构建时使用授权服务器上的配置。如果授权服务器在构建时间和应用程序启动之间更改了配置，则配置可能会过时。
:::

了解 [Micronaut Maven 插件 AOT 配置](https://micronaut-projects.github.io/micronaut-maven-plugin/latest/examples/aot.html#configuration)和 [Micronaut Gradle 插件 AOT 配置](https://micronaut-projects.github.io/micronaut-gradle-plugin/latest/#_configuration)。

## 17.3 JWKS 优化

Micronaut 安全支持 JWKS（JSON 网络密钥集），可[直接](/security/authenticationStrategies#10321-远程-JWKS)指定或通过获取 OpenID Connect 元数据时获得的 jwks_uri 指定。Micronaut 安全性使用 JWKS 来验证其他应用程序或授权服务器发出的令牌的签名。

Micronaut 应用程序需要发出网络请求才能获取 JWKS。你可以使用 Micronaut Security 提前构建优化功能，在构建时发出请求。

要启用此优化，在 `aot.properties` 中添加 `micronaut.security.jwks.enabled.enabled=true`

:::caution 警告
应用程序使用授权服务器在构建时公开的 JWKS。如果授权服务器在构建时间和应用程序启动之间更改了 JWKS，则 JWKS 可能会过时。你可以使用 `JwksSignature::clear` 或 `JwkSetFetcher::clearCache` 清除密钥。
:::

了解 [Micronaut Maven 插件 AOT 配置](https://micronaut-projects.github.io/micronaut-maven-plugin/latest/examples/aot.html#configuration)和 [Micronaut Gradle 插件 AOT 配置](https://micronaut-projects.github.io/micronaut-gradle-plugin/latest/#_configuration)。

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#aot)
