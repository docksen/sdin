package com.zuttokin.rose.base.model.response;

import com.zuttokin.rose.base.enumeration.base.ExceptionCode;
import com.zuttokin.rose.base.exception.base.ServiceException;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.io.Serial;
import java.io.Serializable;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Function;

@Getter
public final class Failure<TData extends Serializable, TError extends ServiceException>
        extends Result<TData, TError> implements Serializable {

    @Serial
    private static final long serialVersionUID = -79661629390653457L;

    @NotNull
    private final TError error;

    private Failure(@NotNull TError error) {
        this.error = error;
    }

    public static <TData extends Serializable, TError extends ServiceException>
    Failure<TData, TError> of(@NotNull TError exception) {
        return new Failure<>(exception);
    }

    @Override
    public boolean success() {
        return false;
    }

    @Override
    public boolean failure() {
        return true;
    }

    @NotNull
    public ExceptionCode fetchCode() {
        return error.fetchCode();
    }

    @NotNull
    @Override
    public HttpStatus fetchStatus() {
        return error.fetchStatus();
    }

    @Override
    public TData unwrap() throws TError {
        throw error;
    }

    @Override
    public TData unwrapSuccess() {
        return null;
    }

    @NotNull
    @Override
    public TError unwrapFailure() {
        return error;
    }

    @Override
    public <RData extends Serializable> RData unwrap(
            @NotNull Function<@NotNull TData, RData> converter) throws TError {
        throw error;
    }

    @Override
    public <RData extends Serializable> RData unwrapSuccess(@NotNull Function<@NotNull TData, RData> converter) {
        return null;
    }

    @Override
    public <RError extends ServiceException> RError unwrapFailure(
            @NotNull Function<@NotNull TError, RError> converter) {
        return converter.apply(error);
    }

    @Override
    public void on(@NotNull BiConsumer<TData, TError> consumer) {
        consumer.accept(null, error);
    }

    @Override
    public void onSuccess(@NotNull Consumer<TData> consumer) {
    }

    @Override
    public void onFailure(@NotNull Consumer<@NotNull TError> consumer) {
        consumer.accept(error);
    }

    @Override
    @SuppressWarnings("unchecked")
    public <RData extends Serializable> Result<RData, TError> mapSuccess(
            @NotNull Function<@NotNull TData, RData> mapper) {
        return (Result<RData, TError>) this;
    }

    @Override
    public <RError extends ServiceException> Result<TData, RError> mapFailure(
            @NotNull Function<@NotNull TError, RError> mapper) {
        RError newError = mapper.apply(error);
        return newError == null ? Success.of() : Failure.of(newError);
    }

}