package com.zuttokin.rose.core;

import com.zuttokin.rose.data.DataApplication;
import com.zuttokin.rose.extra.ExtraApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(value = {DataApplication.class, ExtraApplication.class})
public class CoreApplication {
}
