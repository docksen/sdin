package com.zuttokin.rose.base.model.response;

import com.zuttokin.rose.base.exception.base.ServiceException;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.Serial;
import java.io.Serializable;
import java.util.function.Function;

public sealed abstract class Result<TData, TError extends ServiceException>
        implements Serializable permits Success, Failure {

    @Serial
    private static final long serialVersionUID = 4734001200382416274L;

    @NotNull
    public static <TData, TError extends ServiceException> Result<TData, TError> ofSuccess() {
        return Success.of();
    }

    @NotNull
    public static <TData, TError extends ServiceException> Result<TData, TError> ofSuccess(TData data) {
        return Success.of(data);
    }

    @NotNull
    public static <TData, TError extends ServiceException> Result<TData, TError> ofFailure(@NotNull TError error) {
        return Failure.of(error);
    }

    public abstract boolean success();

    public abstract boolean failure();

    @NotNull
    public abstract HttpStatus fetchStatus();

    public abstract TData unwrap() throws TError;

    public abstract <RData> RData unwrap(@NotNull Function<@NotNull TData, RData> converter) throws TError;

    public abstract TData unwrapSuccess();

    public abstract <RData> RData unwrapSuccess(@NotNull Function<@NotNull TData, RData> converter);

    public abstract TError unwrapFailure();

    public abstract <RError extends ServiceException> RError unwrapFailure(
            @NotNull Function<@NotNull TError, RError> converter);

    @NotNull
    public abstract <RData> Result<RData, TError> mapSuccess(@NotNull Function<@NotNull TData, RData> mapper);

    @NotNull
    public abstract <RError extends ServiceException> Result<TData, RError> mapFailure(
            @NotNull Function<@NotNull TError, RError> mapper);

    @NotNull
    public ResponseEntity<Result<TData, TError>> toResponse() {
        return ResponseEntity.status(fetchStatus()).body(this);
    }

}
