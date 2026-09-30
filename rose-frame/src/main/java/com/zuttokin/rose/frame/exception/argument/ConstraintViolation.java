package com.zuttokin.rose.frame.exception.argument;

import com.zuttokin.rose.frame.exception.base.BusinessException;
import jakarta.validation.ConstraintViolationException;

import java.util.stream.Collectors;

import static com.zuttokin.rose.frame.model.response.Status.CONSTRAINT_VIOLATION;
import static com.zuttokin.rose.frame.util.primitive.Strings.SEMICOLON_SPACE;
import static com.zuttokin.rose.frame.util.primitive.Strings.SPACE;

public class ConstraintViolation extends BusinessException {

    public ConstraintViolation(String message) {
        super(CONSTRAINT_VIOLATION, message);
    }

    public ConstraintViolation(ConstraintViolationException exception) {
        super(CONSTRAINT_VIOLATION, formatMessage(exception));
    }

    private static String formatMessage(ConstraintViolationException exception) {
        return exception.getConstraintViolations().stream()
                .map(x -> x.getPropertyPath() + SPACE + x.getMessage())
                .collect(Collectors.joining(SEMICOLON_SPACE));
    }

}
