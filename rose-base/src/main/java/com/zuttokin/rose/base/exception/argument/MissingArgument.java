package com.zuttokin.rose.base.exception.argument;

import com.zuttokin.rose.base.exception.base.BusinessException;
import com.zuttokin.rose.base.util.lang.Reflections;
import org.springframework.web.bind.MissingServletRequestParameterException;

import static com.zuttokin.rose.base.enumeration.base.ExceptionCode.MISSING_ARGUMENT;

public class MissingArgument extends BusinessException {

    private static final String MESSAGE = "Missing method (%s) argument (%s).";

    public MissingArgument(String message) {
        super(MISSING_ARGUMENT.getValue(), message);
    }

    public MissingArgument(int stackFrameDepth, int argumentOrder) {
        super(MISSING_ARGUMENT.getValue(), String.format(MESSAGE,
                Reflections.fetchMethodName(stackFrameDepth + 1), argumentOrder));
    }

    public MissingArgument(MissingServletRequestParameterException exception) {
        super(MISSING_ARGUMENT.getValue(), exception.getMessage());
    }

}
