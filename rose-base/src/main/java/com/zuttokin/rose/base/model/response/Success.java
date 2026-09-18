package com.zuttokin.rose.base.model.response;

import com.zuttokin.rose.base.exception.base.ServiceException;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.io.Serial;
import java.io.Serializable;
import java.util.function.Function;

import static org.springframework.http.HttpStatus.OK;

@Getter
public final class Success<TData, TError extends ServiceException> extends Result<TData, TError> implements Serializable {

    @Serial
    private static final long serialVersionUID = -1429806873500399820L;

    private static final Success<?, ?> EMPTY = new Success<>(null);

    private final TData data;

    private Success(TData data) {
        this.data = data;
    }

    @NotNull
    @SuppressWarnings("unchecked")
    public static <TData, TError extends ServiceException> Success<TData, TError> of() {
        return (Success<TData, TError>) EMPTY;
    }

    @NotNull
    public static <TData, TError extends ServiceException> Success<TData, TError> of(TData data) {
        return data == null ? of() : new Success<>(data);
    }

    @Override
    public boolean success() {
        return true;
    }

    @Override
    public boolean failure() {
        return false;
    }

    @NotNull
    public HttpStatus fetchStatus() {
        return OK;
    }

    @Override
    public TData unwrap() throws TError {
        return data;
    }

    @Override
    public <RData> RData unwrap(@NotNull Function<@NotNull TData, RData> converter) throws TError {
        return data == null ? null : converter.apply(data);
    }

    @Override
    public TData unwrapSuccess() {
        return data;
    }

    @Override
    public <RData> RData unwrapSuccess(@NotNull Function<@NotNull TData, RData> converter) {
        return data == null ? null : converter.apply(data);
    }

    @Override
    public TError unwrapFailure() {
        return null;
    }

    @Override
    public <RError extends ServiceException> RError unwrapFailure(@NotNull Function<@NotNull TError, RError> converter) {
        return null;
    }

    @NotNull
    @Override
    public <RData> Result<RData, TError> mapSuccess(@NotNull Function<@NotNull TData, RData> mapper) {
        RData newData = data == null ? null : mapper.apply(data);
        return newData == null ? Success.of() : Success.of(newData);
    }

    @NotNull
    @Override
    @SuppressWarnings("unchecked")
    public <RError extends ServiceException> Result<TData, RError> mapFailure(@NotNull Function<@NotNull TError, RError> mapper) {
        return (Result<TData, RError>) this;
    }

}
