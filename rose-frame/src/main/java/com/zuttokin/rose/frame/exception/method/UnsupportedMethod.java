package com.zuttokin.rose.frame.exception.method;

import com.zuttokin.rose.frame.exception.base.BusinessException;
import com.zuttokin.rose.frame.util.primitive.Strings;
import org.springframework.web.HttpRequestMethodNotSupportedException;

import static com.zuttokin.rose.frame.model.response.Status.UNSUPPORTED_METHOD;
import static com.zuttokin.rose.frame.util.primitive.Strings.COMMA_SPACE;

public class UnsupportedMethod extends BusinessException {

    private static final String UNSUPPORTED_METHOD_DESC = "Unsupported method, please use (%s).";

    public UnsupportedMethod(String message) {
        super(UNSUPPORTED_METHOD, message);
    }

    public UnsupportedMethod(HttpRequestMethodNotSupportedException exception) {
        super(UNSUPPORTED_METHOD, String.format(UNSUPPORTED_METHOD_DESC,
                Strings.join(exception.getSupportedMethods(), COMMA_SPACE)));
    }

}
