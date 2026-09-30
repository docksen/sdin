package com.zuttokin.rose.frame.model.response;

import jakarta.validation.constraints.NotNull;

import java.io.Serial;
import java.io.Serializable;

public class Response implements Serializable {

    @Serial
    private static final long serialVersionUID = -79661629390653457L;

    @NotNull
    protected final Integer status;

    public Response(@NotNull Status status) {
        this.status = status.value();
    }

    public boolean success() {
        return status.success();
    }

    public Status fetchStatus() {
        return Status.fromValue()
    }

}
