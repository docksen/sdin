package com.zuttokin.rose.api.advice;

import com.zuttokin.rose.base.exception.base.ServiceException;
import com.zuttokin.rose.base.exception.system.UnexpectedFailure;
import com.zuttokin.rose.base.model.response.Result;
import org.jspecify.annotations.NonNull;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.io.Serializable;

@ControllerAdvice
public class GlobalResponseHandler implements ResponseBodyAdvice<Object> {

    private static final String RESPONSE_DATA_IS_NOT_SERIALIZABLE = "Response data is not serializable.";

    @Override
    public boolean supports(@NonNull MethodParameter returnType,
                            @NonNull Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, @NonNull MethodParameter returnType,
                                  @NonNull MediaType selectedContentType,
                                  @NonNull Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  @NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response) {
        return switch (body) {
            case null -> Result.ofSuccess();
            case Result<?, ?> result -> result;
            case ServiceException exception -> Result.ofFailure(exception);
            case Serializable data -> Result.ofSuccess(data);
            default -> Result.ofFailure(new UnexpectedFailure(RESPONSE_DATA_IS_NOT_SERIALIZABLE));
        };
    }

}
