---
description: Micronaut ACME
keywords: [micronaut,micronaut 文档,micronaut 中文文档,文档,Micronaut ACME,ACME]
---

# Micronaut ACME

集成 Micronaut 和 Acme 的扩展。

## 1. 简介

Micronaut 通过 `micronaut-acme` 模块支持 [ACME](https://en.wikipedia.org/wiki/Automated_Certificate_Management_Environment)。

## 2. 发布历史

关于本项目，你可以在这里找到发布列表（含发布说明）：https://github.com/micronaut-projects/micronaut-acme/releases

## 3. 配置

需要 Micronaut 1.3.0 或以上版本，并且你的 classpath 上必须有 `micronaut-acme` 依赖：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Gradle" label="Gradle">

```groovy
implementation("io.micronaut.acme:micronaut-acme:3.2.0")
```

  </TabItem>
  <TabItem value="Maven" label="Maven">

```xml
<dependency>
    <groupId>io.micronaut.acme</groupId>
    <artifactId>micronaut-acme</artifactId>
    <version>3.2.0</version>
</dependency>
```

  </TabItem>
</Tabs>

`micronaut-acme` 模块传递的包含 `org.shrzone.acme4j:acme4j-client` 和 `org.shrzone.acme4j:acme4j-utilsdependency`。

*src/main/resources/application.yml*

```yaml
micronaut:
    server:
        port : 80 
        dual-protocol: true 
        ssl:
            enabled: true 
acme:
    enabled: true 
    tos-agree: true 
    cert-location: /path/to/store/certificates 
    domains: 
      - stage.domain.com
      - test.domain.com
    refresh:
        delay: 1m 
        frequency: 24h 
    domain-key: | 
        -----BEGIN RSA PRIVATE KEY-----
        MIIEowIBAAKCAQEAi32GgrNvt5sYonmvFRs1lYMdUTsoFHz33knzsTvBRb+S1JCc
        al86zAx3dRdFiLyWw4/lXmS6oS5B/NT1w9R7nW3vd0oi4ump/QjWjOd8SxCBqMcR
        ....
        MIIEowIBAAKCAQEAi32GgrNvt5sYonmvFRs1lYMdUTsoFHz33knzsTvBRb+S1JCc
        al86zAx3dRdFiLyWw4/lXmS6oS5B/NT1w9R7nW3vd0oi4ump/QjWjOd8SxCBqMcR
        -----END RSA PRIVATE KEY-----
    account-key: | 
        -----BEGIN RSA PRIVATE KEY-----
        MIIEowIBAAKCAQEAi32GgrNvt5sYonmvFRs1lYMdUTsoFHz33knzsTvBRb+S1JCc
        al86zAx3dRdFiLyWw4/lXmS6oS5B/NT1w9R7nW3vd0oi4ump/QjWjOd8SxCBqMcR
        ....
        MIIEowIBAAKCAQEAi32GgrNvt5sYonmvFRs1lYMdUTsoFHz33knzsTvBRb+S1JCc
        al86zAx3dRdFiLyWw4/lXmS6oS5B/NT1w9R7nW3vd0oi4ump/QjWjOd8SxCBqMcR
        -----END RSA PRIVATE KEY-----
    acme-server: acme://server.com 
    order:
        pause: 3s 
        refresh-attempts: 10 
    auth:
        pause: 1m 
        refresh-attempts: 10 
    renew-within: 30 
    challenge-type: tls 
    timeout: 10s 
```

1. 为 micronaut 设置 http 端口。如果使用 http 挑战类型，则必须将其设置为端口 80，除非使用负载均衡器或其他代理（例如 Let's Encrypt）仅将请求发送到端口 80。
2. 启用允许绑定 http 和 https 的双端口模式。默认值 `false`
3. 为 Micronaut 启用 ssl。默认值 `false`
4. 支持 Micronaut 的 ACME 集成。默认值 `false`
5. 同意 ACME 提供器的服务条款。默认值 `false`
6. 在服务器上存储证书的位置。
7. 证书的域名。可以是 1 个或多个域，甚至是通配符域。
8. 等待服务器启动 ACME 后台进程的时间。默认值 `24 hours`
9. 服务器检查新的 ACME 证书并在需要时刷新它的频率。默认值 `24 hours`
10. 用于加密证书的私钥。你可以在此处使用的其他选项是 `classpath:/path/to/key.pem` 或 `file:/path/to/key.pem`。建议不要将其签入源代码管理，因为这是处理域加密的机密。
11. 在 ACME 提供器处设置账户时使用的私钥。你可以在此处使用的其他选项是 `classpath:/path/to/key.pem` 或 `file:/path/to/key.pem`。建议不要将其签入源代码管理，因为这是你的账户标识符。
12. ACME 服务器的网址（例如 acme://letsencrypt.org/staging）
13. 在 ACME 服务器的轮询顺序状态之间等待的时间。默认值 `3 seconds`
14. 轮询 ACME 服务器的订单状态的次数。默认值 `10`
15. 在 ACME 服务器的轮询授权状态之间等待的时间。默认值 `3 seconds`
16. 轮询 ACME 服务器的授权状态的次数。默认值为 10
17. 该过程开始尝试刷新来自 ACME 提供程序的证书之前的天数。默认值 `30 days`
18. 要使用的质询类型。默认值为 `tls`。可能的选项：`http`、`tls`、`dns`
19. 设置对 ACME 服务器进行 http 调用时的连接/读取超时。默认来自这里 https://shredzone.org/maven/acme4j/acme4j-client/apidocs/src-html/org/shredzone/acme4j/connector/NetworkSettings.html#line.61

## 4. 挑战类型

ACME 支持 3 种不同的挑战类型，在证书签发前用于验证你是否确实拥有域名。

### 4.1 HTTP-01

利用 `http` 挑战类型，你需要做以下两件事之一：
1. 启用双协议支持
2. 在你的应用程序前的任何负载均衡器/代理服务器中设置从 http → https 的重定向。

这样做的原因是，例如 Let's Encrypt 只会通过 http 调用 http 挑战类型，而不会调用其他类型，但会跟随重定向。

*src/main/resources/application.yml*

```yaml
acme:
  challenge-type: 'http'

micronaut:
  server:
    dual-protocol: true
```

### 4.2 TLS-APLN-01

使用 `tls` 挑战类型是最简单的配置，因此也是默认的，因为你只需要为服务器打开默认的安全端口，允许挑战服务器进行验证。

*src/main/resources/application.yml*

```yaml
acme:
  challenge-type: 'tls'
```

### 4.3 DNS-01

利用 `DNS` 挑战类型可以通过输入DNS TXT记录进行验证。目前，应用程序将记录如下信息。

*DNS 输出*

```bash
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
							CREATE DNS `TXT` ENTRY AS FOLLOWS
				_acme-challenge.example.com with value 79ZNJaxlcLYIFootHL6Rrbh2VUCfFGgPeurVyjoRrS8
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
```

输出完成后，你需要登录 DNS 提供商并创建一个 TXT 条目，其中包含以下键和值。
- 键：`_acme-challenge.example.com`
- 值：`79ZNJaxlcLYIFootHL6Rrbh2VUCfFGgPeurVyjoRrS8`

由于这是一个手动过程，你还需要缩短 `acme.auth.pause` 的持续时间，以便在重试和手动输入/DNS 传播之间有足够的时间。

*src/main/resources/application.yml*

```yaml
acme:
  challenge-type: 'dns'
  auth:
    # Due to the current manual nature in which the dns validation has to be done currently
    # we change the amount of time we wait before trying to authorize again to make sure there
    # is time for us logging into the dns interface, setting a TXT record and waiting for it
    # to propagate.
    pause: 2m
```

## 5. CLI

为了能够使用 ACME 来保护你的应用程序，在你开始使用新证书之前，有一些必要的设置步骤。micronaut-starter(https://github.com/micronaut-projects/micronaut-starter)已经支持 ACME 和这些设置。

### 5.1 用法

要使用这些功能，你必须首先在应用程序中启用 `acme` 特性。

### 对于新应用

在创建时，你需要选择 `acme` 特性。

使用 Micronaut CLI 在创建时选择 `acme` 特性。

```bash
mn create-app --features acme hello-world
```

或者使用 Micronaut Launch https://micronaut.io/launch/，只需在下载预置应用程序之前选择 `acme` 特性即可。

---

### 对于已有应用

使用 micronaut cli 对退出的应用程序进行 `feature-diff`，以显示启用该功能所需的更改。

例如 CLI 功能差异

```bash
cd <project directory>
mn feature-diff --features acme
```

---

### 创建密钥对

帮助创建密钥对的工具。这类似于用 openssl 做类似的事情

```bash
$ openssl genrsa -out /tmp/mydomain.com-key.pem 4096
```

这些密钥对将用于 ACME 账户，每个域也需要定义自己的密钥对。

用法

```bash
Usage: mn create-key [-fhvVx] [-k=<keyDir>] -n=<keyName> [-s=<keySize>]
Creates an keypair for use with ACME integration
  -f, --force                Whether to overwrite existing files
  -h, --help                 Show this help message and exit.
  -k, --key-dir=<keyDir>     Custom location on disk to put the key to be used
                               with this account.
                               Default: src/main/resources
  -n, --key-name=<keyName>   Name of the key to be created
  -s, --key-size=<keySize>   Size of the key to be generated
                               Default: 4096
  -v, --verbose              Create verbose output.
  -V, --version              Print version information and exit.
  -x, --stacktrace           Show full stack trace when exceptions occur.
```

---

### 创建账户

为指定的 ACME 提供器创建一个新账户。该命令将为你创建一个新账户密钥对，你也可以将使用 `mn create-key` 或通过 `openssl` 或其他方法生成的账户密钥对作为参数传入。

如果不想使用该工具，[Certbot](https://certbot.eff.org/) 或许多其他工具也可以完成这一步。

用法：

```bash
Usage: mn create-acme-account (-u=<serverUrl> | --lets-encrypt-prod | --lets-encrypt-staging)
                              [-fhvVx] -e=<email> [-k=<keyDir>] -n=<keyName> [-s=<keySize>]
Creates a new account on the given ACME server
  -e, --email=<email>        Email address to create account with.
  -f, --force                Whether to overwrite existing files
  -h, --help                 Show this help message and exit.
  -k, --key-dir=<keyDir>     Custom location on disk to put the key to be used with this
                               account.
                               Default: src/main/resources
  -n, --key-name=<keyName>   Name of the key to be created
  -s, --key-size=<keySize>   Size of the key to be generated
                               Default: 4096
  -v, --verbose              Create verbose output.
  -V, --version              Print version information and exit.
  -x, --stacktrace           Show full stack trace when exceptions occur.
ACME server URL
      --lets-encrypt-prod    Use the Let's Encrypt prod URL.
      --lets-encrypt-staging Use the Let's Encrypt staging URL
  -u, --url=<serverUrl>      URL of ACME server to use
```

---

### 停用帐户

根据创建账户时使用的账户密钥停用指定账户。

使用方法：

```bash
Usage: mn deactivate-acme-account (-u=<serverUrl> | --lets-encrypt-prod |
                                  --lets-encrypt-staging) [-fhvVx] [-k=<keyDir>] [-n=<keyName>]
Deactivates an existing ACME account
  -f, --force                Whether to overwrite existing files
  -h, --help                 Show this help message and exit.
  -k, --key-dir=<keyDir>     Directory to find the key to be used for this account.
                               Default: src/main/resources
  -n, --key-name=<keyName>   Name of the key to be used
                               Default: null
  -v, --verbose              Create verbose output.
  -V, --version              Print version information and exit.
  -x, --stacktrace           Show full stack trace when exceptions occur.
ACME server URL
      --lets-encrypt-prod    Use the Let's Encrypt prod URL.
      --lets-encrypt-staging Use the Let's Encrypt staging URL
  -u, --url=<serverUrl>      URL of ACME server to use
```

## 6. 仓库

你可以在这个资源库中找到该项目的源代码：

https://github.com/micronaut-projects/micronaut-acme

> [英文链接](https://micronaut-projects.github.io/micronaut-acme/latest/guide/index.html)
