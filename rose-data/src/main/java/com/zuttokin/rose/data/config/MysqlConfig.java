package com.zuttokin.rose.data.config;

import com.zaxxer.hikari.HikariDataSource;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import java.nio.charset.StandardCharsets;
import java.time.ZoneOffset;

@Configuration
public class MysqlConfig {

    @Bean
    @Primary
    public HikariDataSource dataSource() {
        HikariDataSource target = new HikariDataSource();
        target.setJdbcUrl("jdbc:mysql://localhost:3306/rose");
        target.setUsername("root");
        target.setPassword("WBoKMJGRztOQT0GSLSLrn6UPQpCYdukr");
        target.setDriverClassName("com.mysql.cj.jdbc.Driver");
        target.setMinimumIdle(5);
        target.setMaximumPoolSize(20);
        target.setConnectionTimeout(30000);
        target.setIdleTimeout(600000);
        target.setMaxLifetime(1800000);
        target.setPoolName("RoseHikariPool");
        target.setLeakDetectionThreshold(60000);
        target.addDataSourceProperty("useSSL", BooleanUtils.FALSE);
        target.addDataSourceProperty("useUnicode", BooleanUtils.TRUE);
        target.addDataSourceProperty("useInformationSchema", BooleanUtils.TRUE);
        target.addDataSourceProperty("remarks", BooleanUtils.TRUE);
        target.addDataSourceProperty("tinyInt1isBit", BooleanUtils.TRUE);
        target.addDataSourceProperty("allowPublicKeyRetrieval", BooleanUtils.TRUE);
        target.addDataSourceProperty("createDatabaseIfNotExist", BooleanUtils.TRUE);
        target.addDataSourceProperty("serverTimezone", ZoneOffset.UTC.getId());
        target.addDataSourceProperty("characterEncoding", StandardCharsets.UTF_8.name());
        return target;
    }

    @Bean
    public JdbcTemplate jdbcTemplate(HikariDataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean
    public PlatformTransactionManager transactionManager(HikariDataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

}
