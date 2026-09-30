package com.zuttokin.rose.frame.exception.argument;

import com.zuttokin.rose.frame.exception.base.BusinessException;
import jakarta.validation.constraints.NotNull;

import static com.zuttokin.rose.frame.model.response.Status.INVALID_ENUMERATION;

public class InvalidEnumeration extends BusinessException {

    private static final String MESSAGE = "Invalid enumeration (%s) value (%s).";

    public <TClass> InvalidEnumeration(@NotNull Class<TClass> clazz, Object value) {
        super(INVALID_ENUMERATION, String.format(MESSAGE, clazz.getSimpleName(), value));
    }

}
