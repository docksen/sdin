package com.zuttokin.rose.extra;

import com.zuttokin.rose.base.BaseApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(value = {BaseApplication.class})
public class ExtraApplication {
}
