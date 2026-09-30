package com.zuttokin.rose.frame.exception.base;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zuttokin.rose.frame.exception.argument.InvalidArgument;
import com.zuttokin.rose.frame.model.response.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@JsonIgnoreProperties({"cause", "suppressed", "stackTrace", "localizedMessage"})
public sealed abstract class ServiceException extends RuntimeException permits SystemException, BusinessException {

    @Getter
    @NotNull
    private final Status status;

    protected ServiceException(@NotNull Status status, @NotNull String message) {
        super(message, null);
        this.status = status;
        if (status.success()) {
            throw new InvalidArgument(0, 1, status);
        }
    }

}
