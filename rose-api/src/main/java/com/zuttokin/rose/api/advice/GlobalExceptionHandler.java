package com.zuttokin.rose.api.advice;

import com.zuttokin.rose.base.exception.argument.ConstraintViolation;
import com.zuttokin.rose.base.exception.argument.InvalidArgument;
import com.zuttokin.rose.base.exception.argument.MissingArgument;
import com.zuttokin.rose.base.exception.argument.UnsupportedFormat;
import com.zuttokin.rose.base.exception.base.ServiceException;
import com.zuttokin.rose.base.exception.method.AccessDenied;
import com.zuttokin.rose.base.exception.method.MissingMethod;
import com.zuttokin.rose.base.exception.method.UnsupportedMethod;
import com.zuttokin.rose.base.exception.system.UnexpectedFailure;
import com.zuttokin.rose.base.model.response.Result;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.io.Serializable;
import java.nio.file.AccessDeniedException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result<Serializable, ServiceException>> handleException(Exception exception) {
        return new UnexpectedFailure(exception).toResponse();
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<Result<Serializable, ServiceException>> handleException(ServiceException exception) {
        return exception.toResponse();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Result<Serializable, ServiceException>> handleException(
            MethodArgumentNotValidException exception) {
        return new InvalidArgument(exception).toResponse();
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Result<Serializable, ServiceException>> handleException(
            ConstraintViolationException exception) {
        return new ConstraintViolation(exception).toResponse();
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Result<Serializable, ServiceException>> handleException(
            MissingServletRequestParameterException exception) {
        return new MissingArgument(exception).toResponse();
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Result<Serializable, ServiceException>> handleException(
            HttpMessageNotReadableException exception) {
        return new UnsupportedFormat(exception).toResponse();
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Result<Serializable, ServiceException>> handleException(
            MethodArgumentTypeMismatchException exception) {
        return new UnsupportedFormat(exception).toResponse();
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Result<Serializable, ServiceException>> handleException(NoHandlerFoundException exception) {
        return new MissingMethod(exception).toResponse();
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Result<Serializable, ServiceException>> handleException(
            HttpRequestMethodNotSupportedException exception) {
        return new UnsupportedMethod(exception).toResponse();
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Result<Serializable, ServiceException>> handleException(AccessDeniedException exception) {
        return new AccessDenied(exception).toResponse();
    }

}
