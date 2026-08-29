package com.zuttokin.rose.base.model.response;

import com.zuttokin.rose.base.exception.base.ServiceException;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.io.Serial;
import java.io.Serializable;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Function;

import static org.springframework.http.HttpStatus.OK;

@Getter
public final class Success<TData extends Serializable, TError extends ServiceException>
        extends Result<TData, TError> implements Serializable {

    @Serial
    private static final long serialVersionUID = -1429806873500399820L;

    private static final Success<?, ?> EMPTY = new Success<>(null);

    private final TData data;

    private Success(TData data) {
        this.data = data;
    }

    @SuppressWarnings("unchecked")
    public static <TData extends Serializable, TError extends ServiceException> Success<TData, TError> of() {
        return (Success<TData, TError>) EMPTY;
    }

    public static <TData extends Serializable, TError extends ServiceException> Success<TData, TError> of(TData data) {
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
    public TData unwrapSuccess() {
        return data;
    }

    @Override
    public TError unwrapFailure() {
        return null;
    }

    @Override
    public <RData extends Serializable> RData unwrap(
            @NotNull Function<@NotNull TData, RData> converter) throws TError {
        return data == null ? null : converter.apply(data);
    }

    @Override
    public <RData extends Serializable> RData unwrapSuccess(@NotNull Function<@NotNull TData, RData> converter) {
        return data == null ? null : converter.apply(data);
    }

    @Override
    public <RError extends ServiceException> RError unwrapFailure(
            @NotNull Function<@NotNull TError, RError> converter) {
        return null;
    }

    @Override
    public void on(@NotNull BiConsumer<TData, TError> consumer) {
        consumer.accept(data, null);
    }

    @Override
    public void onSuccess(@NotNull Consumer<TData> consumer) {
        consumer.accept(data);
    }

    @Override
    public void onFailure(@NotNull Consumer<@NotNull TError> consumer) {
    }

    @Override
    public <RData extends Serializable> Result<RData, TError> mapSuccess(
            @NotNull Function<@NotNull TData, RData> mapper) {
        RData newData = data == null ? null : mapper.apply(data);
        return newData == null ? Success.of() : Success.of(newData);
    }

    @Override
    @SuppressWarnings("unchecked")
    public <RError extends ServiceException> Result<TData, RError> mapFailure(
            @NotNull Function<@NotNull TError, RError> mapper) {
        return (Result<TData, RError>) this;
    }

}
