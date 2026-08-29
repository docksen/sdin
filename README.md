# Rose

```sql
CREATE
DATABASE IF NOT EXISTS rose CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Build

```shell
./gradlew clean bootJar
```

## Start

```shell
java -jar rose-api.jar
```
