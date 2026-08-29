package com.zuttokin.rose.base.exception.system;

import com.zuttokin.rose.base.exception.base.SystemException;

import static com.zuttokin.rose.base.enumeration.base.ExceptionCode.UNEXPECTED_FAILURE;

public class UnexpectedFailure extends SystemException {

    public UnexpectedFailure(Throwable cause) {
        super(UNEXPECTED_FAILURE.getValue(), cause.getMessage());
    }

    public UnexpectedFailure(String message) {
        super(UNEXPECTED_FAILURE.getValue(), message);
    }

}
