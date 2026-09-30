package com.zuttokin.rose.frame.exception.argument;

import com.zuttokin.rose.frame.exception.base.BusinessException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Optional;

import static com.zuttokin.rose.frame.model.response.Status.UNSUPPORTED_FORMAT;

public class UnsupportedFormat extends BusinessException {

    public static final String UNSUPPORTED_REQUEST_BODY_FORMAT = "Unsupported request body format.";
    public static final String PARAMETER_TYPE_ERROR = "Parameter (%s) type error, expected (%s).";

    public UnsupportedFormat(String message) {
        super(UNSUPPORTED_FORMAT, message);
    }

    public UnsupportedFormat(HttpMessageNotReadableException exception) {
        super(UNSUPPORTED_FORMAT, UNSUPPORTED_REQUEST_BODY_FORMAT);
    }

    public UnsupportedFormat(MethodArgumentTypeMismatchException exception) {
        super(UNSUPPORTED_FORMAT, String.format(PARAMETER_TYPE_ERROR,
                exception.getName(), Optional.ofNullable(exception.getRequiredType())
                        .map(Class::getSimpleName).orElse(null)));
    }

}
