package com.zuttokin.rose.data.database;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.po.TableField;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.config.rules.IColumnType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.model.ClassAnnotationAttributes;
import com.baomidou.mybatisplus.generator.type.TypeRegistry;
import com.zaxxer.hikari.HikariDataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Types;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;

@SpringBootTest
public class MysqlGenerationTest {

    private static final String PRO_MOD_DIR = System.getProperty("user.dir");

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private HikariDataSource dataSource;

    @Test
    public void initialize() {
        executeSqlFile("database/schema/create-user-table.sql");
        executeSqlFile("database/data/init-user-table.sql");
    }

    @Test
    public void generate() {
        List<String> tableNameList = List.of("user");
        FastAutoGenerator.create(fetchDataSourceConfigBuilder())
                .globalConfig(fetchGlobalConfigFetcher())
                .packageConfig(fetchPackageConfigFetcher())
                .strategyConfig(fetchStrategyConfigFetcher(tableNameList))
                .execute();
    }

    private DataSourceConfig.Builder fetchDataSourceConfigBuilder() {
        return new DataSourceConfig.Builder(dataSource)
                .typeConvertHandler(this::convertFieldType);
    }

    private Consumer<GlobalConfig.Builder> fetchGlobalConfigFetcher() {
        return builder -> builder
                .author("Docksen")
                .outputDir(PRO_MOD_DIR + "/src/main/java")
                .disableOpenDir()
                .commentDate("yyyy-MM-dd HH:mm:ss Z");
    }

    private Consumer<PackageConfig.Builder> fetchPackageConfigFetcher() {
        return builder -> builder
                .parent("com.zuttokin.rose.data")
                .entity("entity")
                .mapper("mapper")
                .service("service")
                .serviceImpl("service.impl")
                .xml("mapper.xml")
                .pathInfo(Collections.singletonMap(
                        OutputFile.xml, PRO_MOD_DIR + "/src/main/resources/mapper"
                ));
    }

    private Consumer<StrategyConfig.Builder> fetchStrategyConfigFetcher(List<String> tableNameList) {
        return builder -> builder
                .addInclude(tableNameList)
                .entityBuilder()
                .javaTemplate("database/template/entity.java.vm")
                .formatFileName("%sDataEntity")
                .enableLombok(new ClassAnnotationAttributes("@Data", "lombok.Data"))
                .enableSerialAnnotation()
                .enableTableFieldAnnotation()
                .enableFileOverride()
                .enableRemoveIsPrefix()
                .naming(NamingStrategy.underline_to_camel)
                .columnNaming(NamingStrategy.underline_to_camel)
                .mapperBuilder()
                .mapperTemplate("database/template/mapper.java.vm")
                .mapperXmlTemplate("database/template/mapper.xml.vm")
                .formatMapperFileName("%sDataMapper")
                .formatXmlFileName("%sDataMapper")
                .serviceBuilder()
                .serviceTemplate("database/template/service.java.vm")
                .serviceImplTemplate("database/template/service-impl.java.vm")
                .formatServiceFileName("%sDataService")
                .formatServiceImplFileName("%sDataServiceImpl")
                .controllerBuilder()
                .enableRestStyle()
                .disable();
    }

    private IColumnType convertFieldType(GlobalConfig globalConfig, TypeRegistry typeRegistry,
                                         TableField.MetaInfo metaInfo) {
        int typeCode = metaInfo.getJdbcType().TYPE_CODE;
        if (typeCode == Types.TINYINT) {
            return DbColumnType.BOOLEAN;
        } else {
            return typeRegistry.getColumnType(metaInfo);
        }
    }

    private void executeSqlFile(String location) {
        String sql = readFile(location);
        String[] statements = sql.split(";");
        for (String statement : statements) {
            String trimmed = statement.trim();
            if (!trimmed.isEmpty()) {
                jdbcTemplate.execute(trimmed);
            }
        }
    }

    private String readFile(String location) {
        try {
            Resource resource = new ClassPathResource(location);
            return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read SQL file: " + location, e);
        }
    }

}
