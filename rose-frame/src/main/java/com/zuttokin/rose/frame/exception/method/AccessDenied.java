package com.zuttokin.rose.frame.exception.method;

import com.zuttokin.rose.frame.exception.base.BusinessException;

import java.nio.file.AccessDeniedException;

import static com.zuttokin.rose.frame.model.response.Status.ACCESS_DENIED;

public class AccessDenied extends BusinessException {

    private static final String ACCESS_DENIED_DESC = "Access denied.";

    public AccessDenied(String message) {
        super(ACCESS_DENIED, message);
    }

    public AccessDenied(AccessDeniedException exception) {
        super(ACCESS_DENIED, ACCESS_DENIED_DESC);
    }

}
