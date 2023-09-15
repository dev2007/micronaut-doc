---
sidebar_position: 140
---

# 14. 检索已认证的用户

通常情况下，你可能需要检索已通过认证的用户。

你可以在控制器中绑定 `java.security.Principal` 作为方法的参数。

```groovy
import io.micronaut.core.annotation.Nullable
import io.micronaut.core.util.CollectionUtils
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.annotation.Secured

import java.security.Principal


@Controller("/user")
public class UserController {

    @Secured("isAnonymous()")
    @Get("/myinfo")
    public Map myinfo(@Nullable Principal principal) {
        if (principal == null) {
            return Collections.singletonMap("isLoggedIn", false);
        }
        return CollectionUtils.mapOf("isLoggedIn", true, "username", principal.getName());
    }
}
```

如果需要更详细的信息，可以将 [Authentication](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/authentication/Authentication.html) 绑定为控制器中方法的参数。

```groovy
import io.micronaut.core.annotation.Nullable
import io.micronaut.core.util.CollectionUtils
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.annotation.Secured
import io.micronaut.security.authentication.Authentication


@Controller("/user")
class UserController {

    @Secured("isAnonymous()")
    @Get("/myinfo")
    Map myinfo(@Nullable Authentication authentication) {
        if (authentication == null) {
            return Collections.singletonMap("isLoggedIn", false);
        }
        return CollectionUtils.mapOf("isLoggedIn", true,
                "username", authentication.getName(),
                "roles", authentication.getRoles()
        );
    }
}
```

## 14.1 控制器之外的用户

如果需要在控制器外访问当前已验证的用户，可以注入 [SecurityService](https://micronaut-projects.github.io/micronaut-security/latest/api/io/micronaut/security/utils/SecurityService.html) Bean，它提供了一组与验证和授权相关的便捷方法。

> [英文链接](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html#retrievingAuthenticatedUser)
