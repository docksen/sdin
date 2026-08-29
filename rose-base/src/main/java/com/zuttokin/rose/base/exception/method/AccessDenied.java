package com.zuttokin.rose.base.exception.method;

import com.zuttokin.rose.base.exception.base.BusinessException;

import java.nio.file.AccessDeniedException;

import static com.zuttokin.rose.base.enumeration.base.ExceptionCode.ACCESS_DENIED;

public class AccessDenied extends BusinessException {

    private static final String ACCESS_DENIED_DESC = "Access denied.";

    public AccessDenied(String message) {
        super(ACCESS_DENIED.getValue(), message);
    }

    public AccessDenied(AccessDeniedException exception) {
        super(ACCESS_DENIED.getValue(), ACCESS_DENIED_DESC);
    }

}
