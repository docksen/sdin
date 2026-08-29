package com.zuttokin.rose.api;

import com.zuttokin.rose.core.CoreApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(value = {CoreApplication.class})
public class ApiApplication {

    static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

}
