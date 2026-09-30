package com.zuttokin.rose.frame.exception.argument;

import com.zuttokin.rose.frame.exception.base.BusinessException;
import com.zuttokin.rose.frame.util.lang.Reflections;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.stream.Collectors;

import static com.zuttokin.rose.frame.model.response.Status.INVALID_ARGUMENT;
import static com.zuttokin.rose.frame.util.primitive.Strings.SEMICOLON_SPACE;

public class InvalidArgument extends BusinessException {

    private static final String MESSAGE = "Invalid argument (%s) value (%s) in method (%s).";

    public InvalidArgument(String message) {
        super(INVALID_ARGUMENT, message);
    }

    public InvalidArgument(int stackFrameDepth, int argumentOrder, Object value) {
        super(INVALID_ARGUMENT, String.format(MESSAGE, argumentOrder, value,
                Reflections.fetchMethodName(stackFrameDepth + 1)));
    }

    public InvalidArgument(MethodArgumentNotValidException exception) {
        super(INVALID_ARGUMENT, formatMessage(exception));
    }

    private static String formatMessage(MethodArgumentNotValidException exception) {
        return exception.getBindingResult().getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(SEMICOLON_SPACE));
    }

}
