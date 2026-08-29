package com.zuttokin.rose.base.exception.argument;

import com.zuttokin.rose.base.exception.base.BusinessException;
import jakarta.validation.constraints.NotNull;

import static com.zuttokin.rose.base.enumeration.base.ExceptionCode.INVALID_ENUMERATION;

public class InvalidEnumeration extends BusinessException {

    private static final String MESSAGE = "Invalid enumeration (%s) value (%s).";

    public <TClass extends Enum<?>> InvalidEnumeration(@NotNull Class<TClass> clazz, Object value) {
        super(INVALID_ENUMERATION.getValue(), String.format(MESSAGE, clazz.getSimpleName(), value));
    }

}
