---
sidebar_position: 190
---

# 6.19 处理表单数据

为了使表单数据和 JSON 之间的数据绑定模型自定义保持一致，Micronaut 使用 Jackson 实现表单提交中的绑定数据。

这种方法的优点是，用于自定义 JSON 绑定的相同 Jackson 注解可以用于表单提交。

在实践中，这意味着要绑定常规表单数据，对以前的 JSON 绑定代码所需的唯一更改就是更新所使用的 [MediaType](https://docs.micronaut.io/3.8.4/api/io/micronaut/http/MediaType.html)：

*绑定表单数据到 POJO*

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/people")
public class PersonController {

    Map<String, Person> inMemoryDatastore = new ConcurrentHashMap<>();

@Post
public HttpResponse<Person> save(@Body Person person) {
    inMemoryDatastore.put(person.getFirstName(), person);
    return HttpResponse.created(person);
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/people")
class PersonController {

    Map<String, Person> inMemoryDatastore = new ConcurrentHashMap<>()

@Post
HttpResponse<Person> save(@Body Person person) {
    inMemoryDatastore.put(person.getFirstName(), person)
    HttpResponse.created(person)
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/people")
class PersonController {

    internal var inMemoryDatastore: MutableMap<String, Person> = ConcurrentHashMap()

@Post
fun save(@Body person: Person): HttpResponse<Person> {
    inMemoryDatastore[person.firstName] = person
    return HttpResponse.created(person)
}

}
```

  </TabItem>
</Tabs>

:::note 提示
为了避免拒绝服务攻击，绑定期间创建的集合类型和数组受到 `application.yml` 中设置 `jackson.arraySizeThreshold` 的限制
:::

或者，你可以将表单数据直接绑定到方法参数，而不是使用 POJO（这也适用于 JSON！）：

*绑定表单数据为参数*

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Controller("/people")
public class PersonController {

    Map<String, Person> inMemoryDatastore = new ConcurrentHashMap<>();

@Post("/saveWithArgs")
public HttpResponse<Person> save(String firstName, String lastName, Optional<Integer> age) {
    Person p = new Person(firstName, lastName);
    age.ifPresent(p::setAge);
    inMemoryDatastore.put(p.getFirstName(), p);
    return HttpResponse.created(p);
}

}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Controller("/people")
class PersonController {

    Map<String, Person> inMemoryDatastore = new ConcurrentHashMap<>()

@Post("/saveWithArgs")
HttpResponse<Person> save(String firstName, String lastName, Optional<Integer> age) {
    Person p = new Person(firstName, lastName)
    age.ifPresent({ a -> p.setAge(a)})
    inMemoryDatastore.put(p.getFirstName(), p)
    HttpResponse.created(p)
}

}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Controller("/people")
class PersonController {

    internal var inMemoryDatastore: MutableMap<String, Person> = ConcurrentHashMap()

@Post("/saveWithArgs")
fun save(firstName: String, lastName: String, age: Optional<Int>): HttpResponse<Person> {
    val p = Person(firstName, lastName)
    age.ifPresent { p.age = it }
    inMemoryDatastore[p.firstName] = p
    return HttpResponse.created(p)
}

}
```

  </TabItem>
</Tabs>

正如你从上面的示例中看到的那样，这种方法允许你使用诸如对 [Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html) 类型的支持之类的功能，并限制要绑定的参数。使用 POJO 时，必须小心使用 Jackson 注解来排除不应绑定的属性。

> [英文链接](https://docs.micronaut.io/3.9.4/guide/index.html#formData)
