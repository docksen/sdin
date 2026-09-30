package com.zuttokin.rose.frame.exception.argument;

import com.zuttokin.rose.frame.exception.base.BusinessException;
import com.zuttokin.rose.frame.util.lang.Reflections;

import static com.zuttokin.rose.frame.model.response.Status.REPEATED_ARGUMENT;

public class RepeatedArgument extends BusinessException {

    private static final String MESSAGE = "Repeated argument (%s) value (%s) in method (%s).";

    public RepeatedArgument(int stackFrameDepth, int argumentOrder, Object value) {
        super(REPEATED_ARGUMENT, String.format(MESSAGE, argumentOrder, value,
                Reflections.fetchMethodName(stackFrameDepth + 1)));
    }

}
