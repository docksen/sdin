package com.zuttokin.rose.base.exception.argument;

import com.zuttokin.rose.base.exception.base.BusinessException;
import com.zuttokin.rose.base.util.lang.Reflections;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.stream.Collectors;

import static com.zuttokin.rose.base.enumeration.base.ExceptionCode.INVALID_ARGUMENT;
import static com.zuttokin.rose.base.util.base.Strings.SEMICOLON_SPACE;

public class InvalidArgument extends BusinessException {

    private static final String MESSAGE = "Invalid method (%s) argument (%s) value (%s).";

    public InvalidArgument(String message) {
        super(INVALID_ARGUMENT.getValue(), message);
    }

    public InvalidArgument(int stackFrameDepth, int argumentOrder, Object value) {
        super(INVALID_ARGUMENT.getValue(), String.format(MESSAGE,
                Reflections.fetchMethodName(stackFrameDepth + 1), argumentOrder, value));
    }

    public InvalidArgument(MethodArgumentNotValidException exception) {
        super(INVALID_ARGUMENT.getValue(), formatMessage(exception));
    }

    private static String formatMessage(MethodArgumentNotValidException exception) {
        return exception.getBindingResult().getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(SEMICOLON_SPACE));
    }

}
