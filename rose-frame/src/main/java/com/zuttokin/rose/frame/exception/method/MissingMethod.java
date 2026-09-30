package com.zuttokin.rose.frame.exception.method;

import com.zuttokin.rose.frame.exception.base.BusinessException;
import org.springframework.web.servlet.NoHandlerFoundException;

import static com.zuttokin.rose.frame.model.response.Status.MISSING_METHOD;

public class MissingMethod extends BusinessException {

    private static final String API_NOT_FOUND = "Not found API (%s %s).";

    public MissingMethod(String message) {
        super(MISSING_METHOD, message);
    }

    public MissingMethod(NoHandlerFoundException exception) {
        super(MISSING_METHOD, String.format(API_NOT_FOUND,
                exception.getHttpMethod(), exception.getRequestURL()));
    }

}
