---
sidebar_position: 33
---

# 3.3 JPA 扩展

在上一节中，我们提到可以使用 Micronaut 框架提供的默认 CRUD 操作实现，以减少常规 CRUD 操作的开发，本节我们简要介绍下相关的使用方法以及如何与标准 JPA 操作方法的结合使用。

## 使用仓库接口

基于上一节的 demo，我们新建一个接口 `CategoryRepositoryNew.java`，示例如下：

```java
package fun.mortnon.demo;

import fun.mortnon.demo.models.Category;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

/**
 * @author dev2007
 * @date 2023/9/21
 */
@Repository
public interface CategoryRepositoryNew extends CrudRepository<Category,Long> {
}

```

可以看到，我们只要继承 Micronaut 提供的接口，然后为我们自己的接口添加注解 `@Repository`，即可完成数据访问层的实现。然后我们调整一下 `CategoryController.java` 中的调用代码，就能达到和上一节中一样的效果，示例如下：

```java
package fun.mortnon.demo;

import fun.mortnon.demo.models.Category;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import jakarta.inject.Inject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * @author dev2007
 * @date 2023/9/20
 */
@Controller("/category")
public class CategoryController {
    @Inject
    private CategoryRepositoryNew categoryRepository;

    @Get("/{id}")
    public Category show(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Put("/")
    public HttpResponse<?> update(@Body Category category) {
        categoryRepository.update(category);
        return HttpResponse.noContent();
    }

    @Get(value = "/list")
    public List<Category> list() {
        Iterator<Category> iterator = categoryRepository.findAll().iterator();
        List<Category> list = new ArrayList<>();
        while (iterator.hasNext()) {
            list.add(iterator.next());
        }

        return list;
    }

    @Post("/")
    public HttpResponse<Category> save(@Body Category category) {
        Category result = categoryRepository.save(category);
        return HttpResponse.created(result);
    }

    @Delete("/{id}")
    public HttpResponse<?> delete(Long id) {
        categoryRepository.deleteById(id);
        return HttpResponse.noContent();
    }
}

```

## 自定义 CRUD 声明

我们可以看一下 Micronaut 框架提供的 `CrudRepository` 定义了哪些方法，如下：

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
package io.micronaut.data.repository;

import io.micronaut.core.annotation.NonNull;
import io.micronaut.core.annotation.Blocking;
import io.micronaut.validation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Optional;

/**
 * A repository interface for performing CRUD (Create, Read, Update, Delete). This is a blocking
 * variant and is largely based on the same interface in Spring Data, however includes integrated validation support.
 *
 * @author graemerocher
 * @since 1.0
 * @param <E> The entity type
 * @param <ID> The ID type
 */
@Blocking
@Validated
public interface CrudRepository<E, ID> extends GenericRepository<E, ID> {
    /**
     * Saves the given valid entity, returning a possibly new entity representing the saved state. Note that certain implementations may not be able to detect whether a save or update should be performed and may always perform an insert. The {@link #update(Object)} method can be used in this case to explicitly request an update.
      *
     * @param entity The entity to save. Must not be {@literal null}.
     * @return The saved entity will never be {@literal null}.
     * @throws javax.validation.ConstraintViolationException if the entity is {@literal null} or invalid.
     * @param <S> The generic type
     */
    @NonNull
    <S extends E> S save(@Valid @NotNull @NonNull S entity);

    /**
     * This method issues an explicit update for the given entity. The method differs from {@link #save(Object)} in that an update will be generated regardless if the entity has been saved previously or not. If the entity has no assigned ID then an exception will be thrown.
     *
     * @param entity The entity to save. Must not be {@literal null}.
     * @return The updated entity will never be {@literal null}.
     * @throws javax.validation.ConstraintViolationException if the entity is {@literal null} or invalid.
     * @param <S> The generic type
     */
    @NonNull
    <S extends E> S update(@Valid @NotNull @NonNull S entity);

    /**
     * This method issues an explicit update for the given entities. The method differs from {@link #saveAll(Iterable)} in that an update will be generated regardless if the entity has been saved previously or not. If the entity has no assigned ID then an exception will be thrown.
     *
     * @param entities The entities to update. Must not be {@literal null}.
     * @return The updated entities will never be {@literal null}.
     * @throws javax.validation.ConstraintViolationException if entities is {@literal null} or invalid.
     * @param <S> The generic type
     */
    @NonNull
    <S extends E> Iterable<S> updateAll(@Valid @NotNull @NonNull Iterable<S> entities);

    /**
     * Saves all given entities, possibly returning new instances representing the saved state.
     *
     * @param entities The entities to saved. Must not be {@literal null}.
     * @param <S> The generic type
     * @return The saved entities objects. will never be {@literal null}.
     * @throws javax.validation.ConstraintViolationException if the entities are {@literal null}.
     */
    @NonNull
    <S extends E> Iterable<S> saveAll(@Valid @NotNull @NonNull Iterable<S> entities);

    /**
     * Retrieves an entity by its id.
     *
     * @param id The ID of the entity to retrieve. Must not be {@literal null}.
     * @return the entity with the given id or {@literal Optional#empty()} if none found
     * @throws javax.validation.ConstraintViolationException if the id is {@literal null}.
     */
    @NonNull
    Optional<E> findById(@NotNull @NonNull ID id);

    /**
     * Returns whether an entity with the given id exists.
     *
     * @param id must not be {@literal null}.
     * @return {@literal true} if an entity with the given id exists, {@literal false} otherwise.
     * @throws javax.validation.ConstraintViolationException if the id is {@literal null}.
     */
    boolean existsById(@NotNull @NonNull ID id);

    /**
     * Returns all instances of the type.
     *
     * @return all entities
     */
    @NonNull Iterable<E> findAll();

    /**
     * Returns the number of entities available.
     *
     * @return the number of entities
     */
    long count();

    /**
     * Deletes the entity with the given id.
     *
     * @param id must not be {@literal null}.
     * @throws javax.validation.ConstraintViolationException if the entity is {@literal null}.
     */
    void deleteById(@NonNull @NotNull ID id);

    /**
     * Deletes a given entity.
     *
     * @param entity The entity to delete
     * @throws javax.validation.ConstraintViolationException if the entity is {@literal null}.
     */
    void delete(@NonNull @NotNull E entity);

    /**
     * Deletes the given entities.
     *
     * @param entities The entities to delete
     * @throws javax.validation.ConstraintViolationException if the entity is {@literal null}.
     */
    void deleteAll(@NonNull @NotNull Iterable<? extends E> entities);

    /**
     * Deletes all entities managed by the repository.
     */
    void deleteAll();
}

```

由以上定义可以看到，Micronaut 框架中定义常用的 CRUD 常用方法，而针对不同的响应或需求目标，框架还提供了很多接口，如下表：

*表 1. 内置仓库接口*

|接口|描述
|--|--|
|GenericRepository|根接口没有方法，但将实体类型和 ID 类型定义为通用参数|
|CrudRepository|扩展 GenericRepository 并添加执行 CRUD 的方法|
|JpaRepository|扩展了 CrudRepository，并添加了合并和刷新等 JPA 特定方法（需要 JPA 实现）|
|PageableRepository|扩展 CrudRepository 并添加分页方法|
|AsyncCrudRepository|扩展 GenericRepository 并添加异步 CRUD 执行方法|
|AsyncPageableRepository|扩展 AsyncCrudRepository 并添加分页方法|
|ReactiveStreamsCrudRepository|扩展了 GenericRepository 并添加了返回 Publisher 的 CRUD 方法|
|ReactiveStreamsPageableRepository|扩展 ReactiveStreamsCrudRepository 并添加分页方法|
|ReactorCrudRepository|扩展了 ReactiveStreamsCrudRepository，并使用了 Reactor 返回类型|
|ReactorPageableRepository|扩展 ReactorCrudRepository 并添加分页方法|
|RxJavaCrudRepository|扩展 GenericRepository 并添加可返回 RxJava 2 类型的 CRUD 方法|
|CoroutineCrudRepository|扩展了 GenericRepository，并使用 Kotlin 例程进行反应式 CRUD 操作|
|CoroutinePageableCrudRepository|扩展 CoroutineCrudRepository 并添加分页方法|

以上这些内置仓库接口已经很丰富，但他们只解决了一部分业务层面的问题，如果还有业务层面的数据需要解决，就只能我们按规范定义新的函数。

比如，仓库接口中像查询，就只有查询列表的 `findAll()` 或按 id 查询指定数据 `findById(ID id)`，如果我们要按名字查询数据，就需要自己定义新的方法，具体规则我们将在本章最后来介绍。

我们给 `CategoryRepositoryNew.java` 添加一个按名字查询数据的方法，示例如下：

```java
package fun.mortnon.demo;

import fun.mortnon.demo.models.Category;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

/**
 * @author dev2007
 * @date 2023/9/21
 */
@Repository
public interface CategoryRepositoryNew extends CrudRepository<Category,Long> {
    Category findByName(String name);
}

```

按以上定义完成后，该方法就会被框架自动实现，我们可以直接使用它。

## EntityManger 与仓库接口结合使用

以上实战中，我们可以看到，可以直接使用内置仓库接口的 CRUD 方法，也可以自定义 CRUD 声明，让框架帮我们实现。但实际项目，我们有可能部分操作是一个比较复杂的查询或更新，接口中定义的 CRUD 方法难以满足，我们需要在一个仓库中同时使用 EntityManger 操作数据库，也要使用仓库接口的默认方法。我们新建一个仓库 `CategoryRepositoryExtend.java` 示例如下：

```java
package fun.mortnon.demo;

import fun.mortnon.demo.models.Category;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import jakarta.inject.Inject;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

/**
 * @author dev2007
 * @date 2023/9/21
 */
@Repository
public abstract class CategoryRepositoryExtend implements CrudRepository<Category, Long> {
    @Inject
    private EntityManager entityManager;

    abstract Category findByName(String name);

    public List<Category> find() {
        String sql = "SELECT g FROM Category AS g";
        TypedQuery<Category> query = entityManager.createQuery(sql, Category.class);
        return query.getResultList();
    }
}

```

以上代码中，由于我们既要继承仓库接口的默认 CRUD 方法，也要自定义我们的数据操作方法，所以我们要使用抽象类继承接口，这一点一定要注意。

## 小结

本节介绍的内置仓库接口，Micronaut 框架提供了很多，而下一节的 R2DBC 中， 我们将看到所以有操作都是类似的操作，唯一区别就是 JPA 和 R2DBC 的响应，一个是阻塞的，一个是异步的。

Demo 代码参见：[JPA 仓库接口 demo](https://github.com/dev2007/micronaut-in-action-demo/tree/main/3.3-jpa-extend)
