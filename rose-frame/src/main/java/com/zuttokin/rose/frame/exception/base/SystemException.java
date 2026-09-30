package com.zuttokin.rose.frame.exception.base;

import com.zuttokin.rose.frame.model.response.Status;
import jakarta.validation.constraints.NotNull;

public non-sealed abstract class SystemException extends ServiceException {

    protected SystemException(@NotNull Status code, @NotNull String message) {
        super(code, message);
    }

}
