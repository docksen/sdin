package com.zuttokin.rose.base.exception.method;

import com.zuttokin.rose.base.exception.base.BusinessException;
import org.springframework.web.servlet.NoHandlerFoundException;

import static com.zuttokin.rose.base.enumeration.base.ExceptionCode.MISSING_METHOD;

public class MissingMethod extends BusinessException {

    private static final String API_NOT_FOUND = "Not found API (%s %s).";

    public MissingMethod(String message) {
        super(MISSING_METHOD.getValue(), message);
    }

    public MissingMethod(NoHandlerFoundException exception) {
        super(MISSING_METHOD.getValue(), String.format(API_NOT_FOUND,
                exception.getHttpMethod(), exception.getRequestURL()));
    }

}
