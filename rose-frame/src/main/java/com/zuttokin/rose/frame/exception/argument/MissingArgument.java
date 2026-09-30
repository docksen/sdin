package com.zuttokin.rose.frame.exception.argument;

import com.zuttokin.rose.frame.exception.base.BusinessException;
import com.zuttokin.rose.frame.util.lang.Reflections;
import org.springframework.web.bind.MissingServletRequestParameterException;

import static com.zuttokin.rose.frame.model.response.Status.MISSING_ARGUMENT;

public class MissingArgument extends BusinessException {

    private static final String MESSAGE = "Missing argument (%s) in method (%s).";

    public MissingArgument(String message) {
        super(MISSING_ARGUMENT, message);
    }

    public MissingArgument(int stackFrameDepth, int argumentOrder) {
        super(MISSING_ARGUMENT, String.format(MESSAGE, argumentOrder,
                Reflections.fetchMethodName(stackFrameDepth + 1)));
    }

    public MissingArgument(MissingServletRequestParameterException exception) {
        super(MISSING_ARGUMENT, exception.getMessage());
    }

}
