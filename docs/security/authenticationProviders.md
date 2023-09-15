---
sidebar_position: 80
---

# 8. 认证提供器

要对用户进行认证，必须提供 [AuthenticationProvider](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/AuthenticationProvider.html) 的实现。

下面的代码片段展示了一个简单的实现：

```java
import io.micronaut.context.annotation.Requires;
import io.micronaut.security.authentication.AuthenticationProvider;
import io.micronaut.security.authentication.AuthenticationRequest;
import io.micronaut.security.authentication.AuthenticationResponse;
import jakarta.inject.Singleton;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;
@Singleton
public class AuthenticationProviderUserPassword<T> implements AuthenticationProvider<T> {

    @Override
    public Publisher<AuthenticationResponse> authenticate(T httpRequest, AuthenticationRequest<?, ?> authenticationRequest) {
        return Mono.<AuthenticationResponse>create(emitter -> {
            if (authenticationRequest.getIdentity().equals("user") && authenticationRequest.getSecret().equals("password")) {
                emitter.success(AuthenticationResponse.success("user"));
            } else {
                emitter.error(AuthenticationResponse.exception());
            }
        });
    }
}
```

内置[登录控制器](/endpoints#131-登录控制器)会使用所有可用的认证提供器。第一个返回成功身份验证响应的提供程序将使用其值作为 JWT 标记或会话状态的基础。

作为 [AuthenticationFetcher](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/filters/AuthenticationFetcher.html) 实现的基本认证也会触发可用的 [AuthenticationProvider](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/AuthenticationProvider.html)。

Micronaut 自带用于 LDAP 和 OAuth 2.0 密码授予认证流的认证提供器。对于任何自定义认证，必须创建一个认证提供器。

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#authenticationProviders)
