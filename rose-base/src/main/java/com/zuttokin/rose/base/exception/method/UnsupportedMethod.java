package com.zuttokin.rose.base.exception.method;

import com.zuttokin.rose.base.exception.base.BusinessException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.HttpRequestMethodNotSupportedException;

import static com.zuttokin.rose.base.enumeration.base.ExceptionCode.UNSUPPORTED_METHOD;
import static com.zuttokin.rose.base.util.base.Strings.COMMA_SPACE;

public class UnsupportedMethod extends BusinessException {

    private static final String UNSUPPORTED_METHOD_DESC = "Unsupported method, please use (%s)";

    public UnsupportedMethod(String message) {
        super(UNSUPPORTED_METHOD.getValue(), message);
    }

    public UnsupportedMethod(HttpRequestMethodNotSupportedException exception) {
        super(UNSUPPORTED_METHOD.getValue(), String.format(UNSUPPORTED_METHOD_DESC,
                StringUtils.join(exception.getSupportedMethods(), COMMA_SPACE)));
    }

}
