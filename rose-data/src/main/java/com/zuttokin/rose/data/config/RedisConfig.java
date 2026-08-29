package com.zuttokin.rose.data.config;

import io.lettuce.core.api.StatefulConnection;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(fetchRedisConfig(), LettucePoolingClientConfiguration.builder()
                .poolConfig(fetchPoolConfig())
                .build());
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        GenericJacksonJsonRedisSerializer jsonSerializer = GenericJacksonJsonRedisSerializer.builder().build();
        RedisTemplate<String, Object> target = new RedisTemplate<>();
        target.setConnectionFactory(connectionFactory);
        target.setKeySerializer(stringSerializer);
        target.setValueSerializer(jsonSerializer);
        target.setHashKeySerializer(stringSerializer);
        target.setHashValueSerializer(jsonSerializer);
        target.afterPropertiesSet();
        return target;
    }

    private RedisStandaloneConfiguration fetchRedisConfig() {
        RedisStandaloneConfiguration target = new RedisStandaloneConfiguration();
        target.setHostName("localhost");
        target.setPort(6379);
        target.setPassword(RedisPassword.of("FH6VSdEFTF90H0QXwD6PBfpZidtxbZg3"));
        return target;
    }

    private GenericObjectPoolConfig<StatefulConnection<?, ?>> fetchPoolConfig() {
        GenericObjectPoolConfig<StatefulConnection<?, ?>> target = new GenericObjectPoolConfig<>();
        target.setMaxTotal(8);
        target.setMaxIdle(8);
        target.setMinIdle(0);
        return target;
    }

}
