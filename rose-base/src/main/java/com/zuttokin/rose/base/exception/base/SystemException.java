package com.zuttokin.rose.base.exception.base;

import jakarta.validation.constraints.NotNull;

public non-sealed class SystemException extends ServiceException {

    public SystemException(@NotNull Integer code, @NotNull String message) {
        super(code, message);
    }

}
