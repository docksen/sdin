package com.zuttokin.rose.base.model.response;

import com.zuttokin.rose.base.exception.base.ServiceException;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.Serial;
import java.io.Serializable;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Function;

public sealed abstract class Result<TData extends Serializable, TError extends ServiceException>
        implements Serializable permits Success, Failure {

    @Serial
    private static final long serialVersionUID = 4734001200382416274L;

    public static <TData extends Serializable, TError extends ServiceException> Result<TData, TError> ofSuccess() {
        return Success.of();
    }

    public static <TData extends Serializable, TError extends ServiceException>
    Result<TData, TError> ofSuccess(TData data) {
        return Success.of(data);
    }

    public static <TData extends Serializable, TError extends ServiceException>
    Result<TData, TError> ofFailure(@NotNull TError error) {
        return Failure.of(error);
    }

    public abstract boolean success();

    public abstract boolean failure();

    @NotNull
    public abstract HttpStatus fetchStatus();

    public abstract TData unwrap() throws TError;

    public abstract TData unwrapSuccess();

    public abstract TError unwrapFailure();

    public abstract <RData extends Serializable> RData unwrap(
            @NotNull Function<@NotNull TData, RData> converter) throws TError;

    public abstract <RData extends Serializable> RData unwrapSuccess(
            @NotNull Function<@NotNull TData, RData> converter);

    public abstract <RError extends ServiceException> RError unwrapFailure(
            @NotNull Function<@NotNull TError, RError> converter);

    public abstract void on(@NotNull BiConsumer<TData, TError> consumer);

    public abstract void onSuccess(@NotNull Consumer<TData> consumer);

    public abstract void onFailure(@NotNull Consumer<@NotNull TError> consumer);

    public abstract <RData extends Serializable> Result<RData, TError> mapSuccess(
            @NotNull Function<@NotNull TData, RData> mapper);

    public abstract <RError extends ServiceException> Result<TData, RError> mapFailure(
            @NotNull Function<@NotNull TError, RError> mapper);

    @NotNull
    public ResponseEntity<Result<TData, TError>> toResponse() {
        return ResponseEntity.status(fetchStatus()).body(this);
    }

}
