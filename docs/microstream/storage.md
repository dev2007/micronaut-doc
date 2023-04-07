---
sidebar_position: 70
---

# 7. 存储

以下示例显示了如何为此仓库创建实现：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
package io.micronaut.microstream.docs;

import io.micronaut.core.annotation.NonNull;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository {

    @NonNull
    Customer save(@NonNull @NotNull @Valid CustomerSave customerSave);

    void update(@NonNull @NotBlank String id,
                @NonNull @NotNull @Valid CustomerSave customerSave);

    @NonNull
    Optional<Customer> findById(@NonNull @NotBlank String id);

    void deleteById(@NonNull @NotBlank String id);
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
package io.micronaut.microstream.docs

import io.micronaut.core.annotation.NonNull

import javax.validation.Valid
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

interface CustomerRepository {

    @NonNull
    Customer save(@NonNull @NotNull @Valid CustomerSave customer)

    void update(@NonNull @NotBlank String id,
                @NonNull @NotNull @Valid CustomerSave customer)

    @NonNull
    Optional<Customer> findById(@NonNull @NotBlank String id)

    void deleteById(@NonNull @NotBlank String id)
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
package io.micronaut.microstream.docs

import javax.validation.Valid
import javax.validation.constraints.NotBlank

interface CustomerRepository {
    fun save(customerSave: @Valid CustomerSave): Customer
    fun update(id: @NotBlank String, customerSave: @Valid CustomerSave)
    fun findById(id: @NotBlank String): Customer?
    fun deleteById(id: @NotBlank String)
}
```

  </TabItem>
</Tabs>

## 7.1 StorageManager

以下示例显示了如何创建一个仓库，该仓库注入 `StorageManager` 并检索根实例：

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
public class CustomerRepositoryImpl implements CustomerRepository {

    private final StorageManager storageManager;

    public CustomerRepositoryImpl(StorageManager storageManager) { // 
        this.storageManager = storageManager;
    }

	@Override
    @NonNull
	public Customer save(@NonNull @NotNull @Valid CustomerSave customerSave) {
        return XThreads.executeSynchronized(() -> { // 
            String id = UUID.randomUUID().toString();
            Customer customer = new Customer(id, customerSave.getFirstName(), customerSave.getLastName());
            data().getCustomers().put(id, customer);
            storageManager.store(data().getCustomers()); // 
            return customer;
        });
	}

    @Override
    public void update(@NonNull @NotBlank String id,
                       @NonNull @NotNull @Valid CustomerSave customerSave) {
        XThreads.executeSynchronized(() -> { // 
            Customer c = data().getCustomers().get(id);
            c.setFirstName(customerSave.getFirstName());
            c.setLastName(customerSave.getLastName());
            storageManager.store(c); // 
        });
    }

    @Override
    @NonNull
    public Optional<Customer> findById(@NonNull @NotBlank String id) {
        return Optional.ofNullable(data().getCustomers().get(id));
    }

    @Override
    public void deleteById(@NonNull @NotBlank String id) {
        XThreads.executeSynchronized(() -> { // 
            data().getCustomers().remove(id);
            storageManager.store(data().getCustomers()); // 
        });
    }

    private Data data() {
        return (Data) storageManager.root();
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
class CustomerRepositoryImpl implements CustomerRepository {

    private final StorageManager storageManager

    CustomerRepositoryImpl(StorageManager storageManager) { // 
        this.storageManager = storageManager
    }

    @Override
    @NonNull
    Customer save(@NonNull @NotNull @Valid CustomerSave customerSave) {
        XThreads.executeSynchronized(new Supplier<Customer>() { // 
            @Override
            Customer get() {
                String id = UUID.randomUUID().toString()
                Customer customer = new Customer(id, customerSave.getFirstName(), customerSave.getLastName())
                data().getCustomers().put(id, customer)
                store(data().getCustomers()) // 
                customer
            }
        })
    }

    @Override
    void update(@NonNull @NotBlank String id,
                @NonNull @NotNull @Valid CustomerSave customerSave) {
        XThreads.executeSynchronized(new Runnable() { // 
            @Override
            void run() {
                Customer c = data().getCustomers().get(id)
                c.setFirstName(customerSave.getFirstName())
                c.setLastName(customerSave.getLastName())
                store(c) // 
            }
        })
    }

    @Override
    @NonNull
    Optional<Customer> findById(@NonNull @NotBlank String id) {
        Optional.ofNullable(data().getCustomers().get(id))
    }

    @Override
    void deleteById(@NonNull @NotBlank String id) {
        XThreads.executeSynchronized(new Runnable() { // 
            @Override
            void run() {
                data().getCustomers().remove(id)
                store(data().getCustomers()) // 
            }
        })
    }

    private void store(Object instance) {
        storageManager.store(instance)
    }

    private Data data() {
        (Data) storageManager.root()
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
class CustomerRepositoryImpl(private val storageManager: StorageManager) // 
    : CustomerRepository {
    override fun save(customerSave: CustomerSave): Customer {
        val id = UUID.randomUUID().toString()
        val customer = Customer(id, customerSave.firstName, customerSave.lastName)
        XThreads.executeSynchronized { // 
            data.customers[customer.id] = customer
            storageManager.store(data.customers) // 
        }
        return customer
    }

    override fun update(id : String, customerSave: CustomerSave) {
        XThreads.executeSynchronized { // 
            val customer : Customer? = data.customers[id]
            if (customer != null) {
                with(customer) {
                    firstName = customerSave.firstName
                    lastName = customerSave.lastName
                }
                storageManager.store(customer) // 
            }
        }
    }

    @NonNull
    override fun findById(id: @NotBlank String): Customer? {
        return data.customers[id]
    }

    override fun deleteById(id: @NotBlank String) {
        XThreads.executeSynchronized { // 
            data.customers.remove(id)
            storageManager.store(data.customers) // 
        }
    }

    private val data: Data
        get() {
            val root = storageManager.root()
            return if (root is Data) root else throw RuntimeException("Root is not Data")
        }
}
```

  </TabItem>
</Tabs>

1. 如果 Micronaut 应用程序只有一个 MicroStream 实例，则不需要指定名称限定符来注入 `StorageManager`。
2. 当你在[多线程环境中使用 MicroStream 技术时](https://docs.microstream.one/manual/storage/root-instances.html#_shared_mutable_data)，必须同步读取和写入此共享对象图。
3. [要存储新创建的对象，请存储该对象的“所有者”](https://docs.microstream.one/manual/storage/storing-data/index.html)

## 7.2 使用注解

以下示例显示了等效实现如何利用 [Micronaut MicroStream 注解](../microstream/annotations.html)来简化对象存储。

<Tabs>
  <TabItem value="Java" label="Java" default>

```java
@Singleton
public class CustomerRepositoryStoreImpl implements CustomerRepository {

    private final RootProvider<Data> rootProvider;

    public CustomerRepositoryStoreImpl(RootProvider<Data> rootProvider) { // 
        this.rootProvider = rootProvider;
    }

    @Override
    @NonNull
    public Customer save(@NonNull @NotNull @Valid CustomerSave customerSave) {
        return addCustomer(rootProvider.root().getCustomers(), customerSave);
    }

    @Override
    public void update(@NonNull @NotBlank String id,
                       @NonNull @NotNull @Valid CustomerSave customerSave) {
        updateCustomer(id, customerSave);
    }

    @Override
    @NonNull
    public Optional<Customer> findById(@NonNull @NotBlank String id) {
        return Optional.ofNullable(rootProvider.root().getCustomers().get(id));
    }

    @Override
    public void deleteById(@NonNull @NotBlank String id) {
        removeCustomer(rootProvider.root().getCustomers(), id);
    }

    @StoreReturn // 
    @Nullable
    protected Customer updateCustomer(@NonNull String id,
                                      @NonNull CustomerSave customerSave) {
        Customer c = rootProvider.root().getCustomers().get(id);
        if (c != null) {
            c.setFirstName(customerSave.getFirstName());
            c.setLastName(customerSave.getLastName());
            return c;
        }
        return null;
    }

    @StoreParams("customers") // 
    protected Customer addCustomer(@NonNull Map<String, Customer> customers,
                                   @NonNull CustomerSave customerSave) {
        Customer customer = new Customer(UUID.randomUUID().toString(),
            customerSave.getFirstName(),
            customerSave.getLastName());
        customers.put(customer.getId(), customer);
        return customer;
    }

    @StoreParams("customers") // 
    protected void removeCustomer(@NonNull Map<String, Customer> customers,
                                  @NonNull String id) {
        customers.remove(id);
    }
}
```

  </TabItem>
  <TabItem value="Groovy" label="Groovy">

```groovy
@Singleton
class CustomerRepositoryStoreImpl implements CustomerRepository {

    private final RootProvider<Data> rootProvider

    CustomerRepositoryStoreImpl(RootProvider<Data> rootProvider) { // 
        this.rootProvider = rootProvider
    }

    @Override
    @NonNull
    Customer save(@NonNull @NotNull @Valid CustomerSave customerSave) {
        return addCustomer(rootProvider.root().customers, customerSave)
    }

    @Override
    void update(@NonNull @NotBlank String id,
                @NonNull @NotNull @Valid CustomerSave customerSave) {
        updateCustomer(id, customerSave)
    }

    @Override
    @NonNull
    Optional<Customer> findById(@NonNull @NotBlank String id) {
        Optional.ofNullable(rootProvider.root().customers[id])
    }

    @Override
    void deleteById(@NonNull @NotBlank String id) {
        removeCustomer(rootProvider.root().customers, id)
    }

    @StoreReturn // 
    @Nullable
    protected Customer updateCustomer(@NonNull String id,
                                      @NonNull CustomerSave customerSave) {
        Customer c = rootProvider.root().customers[id]
        if (c != null) {
            c.with {
                firstName = customerSave.firstName
                lastName = customerSave.lastName
            }
            return c
        }
        null
    }

    @StoreParams("customers") // 
    protected Customer addCustomer(@NonNull Map<String, Customer> customers,
                                   @NonNull CustomerSave customerSave) {
        Customer customer = new Customer(UUID.randomUUID().toString(),
            customerSave.firstName,
            customerSave.lastName)
        customers[customer.id] = customer
        customer
    }

    @StoreParams("customers") // 
    protected void removeCustomer(@NonNull Map<String, Customer> customers,
                                  @NonNull String id) {
        customers.remove(id)
    }
}
```

  </TabItem>
  <TabItem value="Kotlin" label="Kotlin">

```kt
@Singleton
open class CustomerRepositoryStoreImpl(private val rootProvider: RootProvider<Data>) // 
    : CustomerRepository {
    override fun save(customerSave: @Valid CustomerSave): Customer {
        return addCustomer(rootProvider.root().customers, customerSave)
    }

    override fun update(id : @NotBlank String,
                        customerSave: @Valid CustomerSave) {
        updateCustomer(id, customerSave)
    }

    @NonNull
    override fun findById(id: @NotBlank String): Customer? {
        return rootProvider.root().customers[id]
    }

    override fun deleteById(id: @NotBlank String) {
        removeCustomer(rootProvider.root().customers, id)
    }

    @StoreReturn // 
    @Nullable
    open fun updateCustomer(id: String, customerSave: CustomerSave): Customer? {
        val c: Customer? = rootProvider.root().customers[id]
        return if (c != null) {
            c.firstName = customerSave.firstName
            c.lastName = customerSave.lastName
            c
        } else null
    }

    @StoreParams("customers") // 
    open fun addCustomer(customers: MutableMap<String, Customer>, customerSave: CustomerSave): Customer {
        val customer = Customer(
            UUID.randomUUID().toString(),
            customerSave.firstName,
            customerSave.lastName
        )
        customers[customer.id] = customer
        return customer
    }

    @StoreParams("customers") // 
    open fun removeCustomer(customers: MutableMap<String, Customer>, id: String) {
        customers.remove(id)
    }
}
```

  </TabItem>
</Tabs>

1. 你还可以注入 [RootProvider](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/api/io/micronaut/microstream/RootProvider.html) 的实例，以便轻松访问 MicroStream 根实例。如果你的 Micronaut 应用程序只有一个 MicroStream 实例，则不需要指定名称限定符来注入它。
2. [规则是：“必须存储已修改的对象！”](https://docs.microstream.one/manual/storage/storing-data/index.html)。
3. [要存储新创建的对象，请存储该对象的“所有者”](https://docs.microstream.one/manual/storage/storing-data/index.html)。

:::tip 注意
[Micronaut MicroStream 注解](../microstream/annotations.html)仅适用于同步方法。它不对返回 `Publisher` 或 `CompletableFuture` 的方法执行任何逻辑操作。对于这些情况，请直接使用 `StorageManager` 。
:::


> [英文链接](https://micronaut-projects.github.io/micronaut-microstream/1.3.0/guide/index.html#storage)
