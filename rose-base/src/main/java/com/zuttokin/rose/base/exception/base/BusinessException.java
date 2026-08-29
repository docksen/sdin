package com.zuttokin.rose.base.exception.base;

import jakarta.validation.constraints.NotNull;

public non-sealed class BusinessException extends ServiceException {

    public BusinessException(@NotNull Integer code, @NotNull String message) {
        super(code, message);
    }

}
