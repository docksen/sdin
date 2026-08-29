package com.zuttokin.rose.base.exception.argument;

import com.zuttokin.rose.base.exception.base.BusinessException;
import jakarta.validation.ConstraintViolationException;

import java.util.stream.Collectors;

import static com.zuttokin.rose.base.enumeration.base.ExceptionCode.CONSTRAINT_VIOLATION;
import static com.zuttokin.rose.base.util.base.Strings.SEMICOLON_SPACE;
import static com.zuttokin.rose.base.util.base.Strings.SPACE;

public class ConstraintViolation extends BusinessException {

    public ConstraintViolation(String message) {
        super(CONSTRAINT_VIOLATION.getValue(), message);
    }

    public ConstraintViolation(ConstraintViolationException exception) {
        super(CONSTRAINT_VIOLATION.getValue(), formatMessage(exception));
    }

    private static String formatMessage(ConstraintViolationException exception) {
        return exception.getConstraintViolations().stream()
                .map(x -> x.getPropertyPath() + SPACE + x.getMessage())
                .collect(Collectors.joining(SEMICOLON_SPACE));
    }

}
