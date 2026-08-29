package com.zuttokin.rose.base.exception.base;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zuttokin.rose.base.enumeration.base.ExceptionCode;
import com.zuttokin.rose.base.model.response.Result;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.Serializable;
import java.util.Objects;

import static com.zuttokin.rose.base.enumeration.base.ExceptionCode.*;

@JsonIgnoreProperties({"cause", "suppressed", "stackTrace", "localizedMessage"})
public sealed class ServiceException extends RuntimeException permits SystemException, BusinessException {

    @Getter
    @NotNull
    private final Integer code;

    public ServiceException(@NotNull Integer code, @NotNull String message) {
        super(message, null);
        this.code = code;
    }

    @NotNull
    public ExceptionCode fetchCode() {
        ExceptionCode exceptionCode = ExceptionCode.fromValue(code);
        return Objects.requireNonNullElseGet(exceptionCode, () -> switch (this) {
            case BusinessException _ -> BUSINESS_EXCEPTION;
            case SystemException _ -> SYSTEM_EXCEPTION;
            default -> SERVICE_EXCEPTION;
        });
    }

    @NotNull
    public HttpStatus fetchStatus() {
        return fetchCode().getStatus();
    }

    @NotNull
    public <TData extends Serializable> ResponseEntity<Result<TData, ServiceException>> toResponse() {
        Result<TData, ServiceException> result = Result.ofFailure(this);
        return ResponseEntity.status(fetchStatus()).body(result);
    }

}
