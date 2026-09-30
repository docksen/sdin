package com.zuttokin.rose.frame.exception.base;

import com.zuttokin.rose.frame.model.response.Status;
import jakarta.validation.constraints.NotNull;

public non-sealed abstract class BusinessException extends ServiceException {

    protected BusinessException(@NotNull Status code, @NotNull String message) {
        super(code, message);
    }

}
