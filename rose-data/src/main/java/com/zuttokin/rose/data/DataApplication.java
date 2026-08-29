package com.zuttokin.rose.data;

import com.zuttokin.rose.base.BaseApplication;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(value = {BaseApplication.class})
@MapperScan("com.zuttokin.rose.data.mapper")
public class DataApplication {
}
