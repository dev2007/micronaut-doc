---
sidebar_position: 40
---

# 4. 认证与授权

在上一章中，我们学习了基本的数据库操作，到此为止，我们已经能基于 Micronaut 框架开发一个 Web 项目，提供对外的 API，实现业务逻辑，还能在业务逻辑中操作数据库数据。但是一个真正可用的应用或服务，一定不会允许自己的 API 能完全被外部直接访问。为了实现对 API 的访问控制，我们一般需要使用认证或鉴权的安全框架来进行访问控制。

在 Spring Boot 框架中，我们使用得比较多的安全框架为 Spring Securtiy 或 Shiro。Spring Security 作为 Spring 体系内的官方框架，与 Spring Boot 的结合非常顺滑，但是由于 Spring Security 的设计过于抽象，开发者使用 Spring Securit 的学习成本过高，这也导致很多开发者选用其他框架，如 Shiro 甚至 Pac4j。

而 Micronaut 框架的开发者们，吸取了 Spring Security 的设计经验，在 Micronaut 安全框架设计中，采用了更灵活的设计，基本达到了开箱即用的效果。

Micronaut 安全框架中，设计了认证接口 `LoginHandler` 和注销接口 `LogoutHandler`，代码如下：

- `LognHandler` 的定义

```java
/*
 * Copyright 2017-2020 original authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.micronaut.security.handlers;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.authentication.AuthenticationResponse;

/**
 * Defines how to respond to a successful or failed login attempt.
 * @author Sergio del Amo
 * @since 1.0
 */
public interface LoginHandler {

    /**
     * @param authentication Authenticated user's representation.
     * @param request The {@link HttpRequest} being executed
     * @return An HTTP Response. Eg. a redirect or an JWT token rendered to the response
     */
    MutableHttpResponse<?> loginSuccess(Authentication authentication, HttpRequest<?> request);

    /**
     * @param authentication Authenticated user's representation.
     * @param refreshToken The refresh token
     * @param request The {@link HttpRequest} being executed
     * @return An HTTP Response. Eg. a redirect or an JWT token rendered to the response
     */
    MutableHttpResponse<?> loginRefresh(Authentication authentication, String refreshToken, HttpRequest<?> request);

    /**
     * @param authenticationResponse Object encapsulates the Login failure
     * @param request The {@link HttpRequest} being executed
     * @return An HTTP Response. Eg. a redirect or 401 response
     */
    MutableHttpResponse<?> loginFailed(AuthenticationResponse authenticationResponse, HttpRequest<?> request);
}
```

以上代码中，我们可以看到 `LoginHandler` 定义了三个方法：`loginSuccess`、`loginRefresh` 和 `loginFailed`。三个方法分别对应登录成功后的处理、登录刷新的处理、登录失败的处理。

- `LogoutHandler` 的定义

```java
/*
 * Copyright 2017-2020 original authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.micronaut.security.handlers;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;

/**
 * Responsible for logging the user out and returning
 * an appropriate response.
 *
 * @author Sergio del Amo
 * @since 1.0.0
 */
@FunctionalInterface
public interface LogoutHandler {

    /**
     * @param request The {@link HttpRequest} being executed
     * @return An HttpResponse built after the user logs out
     */
    MutableHttpResponse<?> logout(HttpRequest<?> request);
}
```

`LogoutHandler` 则只定义了一个方法：`logout` 代表注销时的处理。

而各个认证方式提供了默认的实现类，如下表所示：

*表 1. 各认证方式的认证接口实现和注销接口实现*

|认证方式|认证接口实现|注销接口实现|依赖模块|
|--|--|--|--|
|cookie|`JwtCookieLoginHandler`|`JwtCookieClearerLogoutHandler`|micronaut-jwt|
|session|`SessionLoginHandler`|`SessionLogoutHandler`|micronaut-session|
|idtoken|`IdTokenLoginHandler`|`JwtCookieClearerLogoutHandler`|micronaut-oauth|
|bearer|`AccessRefreshTokenLoginHandler`||micronaut-jwt|

上表中的默认认证接口实现和注销接口实现，只要引入相应的依赖，相关类就会自动引入。这些类的默认实现，我们将在后面介绍认证方式时分别详细介绍。

另外在 `application.yml` 配置中，Micronaut 安全框架相关的配置如下：

|属性|类型|描述|
|--|--|--|
|micronaut.security.authentication|AuthenticationMode|定义要使用的认证。默认为空。可能的值有 `bearer`、`session`、`cookie`、`idtoken`。只有在服务处理登录和注销请求时才应提供。|
|micronaut.security.enabled|boolean|是否启用了安全功能。默认值 `true`|
|micronaut.security.intercept-url-map|java.util.List|定义拦截模式的映射。|
|micronaut.security.ip-patterns|java.util.List|允许的 IP 模式。默认值 `[]`|
|micronaut.security.intercept-url-map-prepend-pattern-with-context-path|boolean|如果定义了拦截 URL 模式，是否应在其前面加上上下文路径。默认为 `.`|
|micronaut.security.authentication-provider-strategy|AuthenticationStrategy|确定如何处理认证提供器。默认值为 `ANY`。可能的值：`ANY` 或 `ALL`。|
|micronaut.security.reject-not-found|boolean|服务器是否应对与服务器上任何路由都不匹配的请求作出 401 响应，如果设置为 `false`，则会对与服务器上任何路由都不匹配的请求返回 404。默认值 `true`。|

以上配置中，我们可以看到，如果要使用 Micronaut 安全框架，除了引入框架本身外，默认安全框架就是启用的，而最重要的还需要表明使用哪种认证方式。另外，我们还可以针对我们的项目或应用进行配置定制，比如 URL 拦截、IP 白名单等等。

除了上面提到的登录处理器、注销处理器，另一个重要的设计为认证提供器（AuthenticationProvider），所有实际认证逻辑的实现都需要在认证提供器里实现。而登录处理器更多是作为一个登录的入口以及认证提供器的上层调用者。`AuthenticationProvider` 代码如下：

```java
/*
 * Copyright 2017-2020 original authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.micronaut.security.authentication;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpRequest;
import org.reactivestreams.Publisher;

/**
 * Defines an authentication provider.
 *
 * @author Sergio del Amo
 * @author Graeme Rocher
 * @since 1.0
 */
public interface AuthenticationProvider {

    /**
     * Authenticates a user with the given request. If a successful authentication is
     * returned, the object must be an instance of {@link Authentication}.
     *
     * Publishers <b>MUST emit cold observables</b>! This method will be called for
     * all authenticators for each authentication request and it is assumed no work
     * will be done until the publisher is subscribed to.
     *
     * @param httpRequest The http request
     * @param authenticationRequest The credentials to authenticate
     * @return A publisher that emits 0 or 1 responses
     */
    Publisher<AuthenticationResponse> authenticate(@Nullable HttpRequest<?> httpRequest, AuthenticationRequest<?, ?> authenticationRequest);
}
```

从以上代码中我们可以看到，认证提供器定义了一个方法：`authenticate`，我们需要在该方法将实现具体的认证逻辑。

本章接下来的内容中，我们将会依次学习如何使用 Micronaut 安全框架提供的各种认证方式、自定义自己的认证配置以及如何实现认证逻辑等。
