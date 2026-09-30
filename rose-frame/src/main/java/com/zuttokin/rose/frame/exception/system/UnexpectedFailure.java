package com.zuttokin.rose.frame.exception.system;

import com.zuttokin.rose.frame.exception.base.SystemException;

import static com.zuttokin.rose.frame.model.response.Status.UNEXPECTED_FAILURE;

public class UnexpectedFailure extends SystemException {

    public UnexpectedFailure(Throwable cause) {
        super(UNEXPECTED_FAILURE, cause.getMessage());
    }

    public UnexpectedFailure(String message) {
        super(UNEXPECTED_FAILURE, message);
    }

}
