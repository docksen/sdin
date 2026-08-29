package com.zuttokin.rose.base.enumeration.base;

import com.zuttokin.rose.base.exception.argument.InvalidArgument;
import com.zuttokin.rose.base.exception.argument.InvalidEnumeration;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@Getter
public enum ExceptionCode {

    SERVICE_EXCEPTION(1739_46563, INTERNAL_SERVER_ERROR),
    SYSTEM_EXCEPTION(1739_77166, INTERNAL_SERVER_ERROR),
    BUSINESS_EXCEPTION(1739_87511, BAD_REQUEST),
    UNEXPECTED_FAILURE(1739_30451, INTERNAL_SERVER_ERROR),
    INVALID_ARGUMENT(1739_60431, UNPROCESSABLE_CONTENT),
    MISSING_ARGUMENT(1739_77008, BAD_REQUEST),
    INVALID_ENUMERATION(1739_97094, UNPROCESSABLE_CONTENT),
    UNSUPPORTED_FORMAT(1739_10042, BAD_REQUEST),
    CONSTRAINT_VIOLATION(1739_27452, UNPROCESSABLE_CONTENT),
    UNSUPPORTED_METHOD(1739_87542, BAD_REQUEST),
    MISSING_METHOD(1739_33421, NOT_FOUND),
    ACCESS_DENIED(1739_98724, FORBIDDEN),
    ;

    private static final Map<Integer, ExceptionCode> VALUE_TO_ENUM = Arrays.stream(values())
            .collect(Collectors.toMap(ExceptionCode::getValue, Function.identity()));

    @NotNull
    @Min(1739_00000)
    @Max(1739_99999)
    private final Integer value;

    @NotNull
    @Min(400)
    @Max(599)
    private final HttpStatus status;

    ExceptionCode(@NotNull Integer value, @NotNull HttpStatus status) {
        this.value = value;
        this.status = status;
        if (value == null || value < 1739_00000 || value > 1739_99999) {
            throw new InvalidArgument(0, 1, value);
        }
        if (status == null || status.value() < 400 || status.value() > 599) {
            throw new InvalidArgument(0, 2, status);
        }
    }

    @Nullable
    public static ExceptionCode fromValue(Integer value) {
        return VALUE_TO_ENUM.get(value);
    }

    @NotNull
    public static ExceptionCode fromValueOrThrow(Integer value) {
        return Optional.ofNullable(fromValue(value))
                .orElseThrow(() -> new InvalidEnumeration(ExceptionCode.class, value));
    }

}
