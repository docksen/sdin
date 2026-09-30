package com.zuttokin.rose.frame.model.response;

import com.zuttokin.rose.frame.exception.argument.InvalidArgument;
import com.zuttokin.rose.frame.exception.argument.InvalidEnumeration;
import com.zuttokin.rose.frame.exception.argument.RepeatedArgument;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public record Status(@NotNull @Min(10000_0000) @Max(99999_9999) Integer value, @NotNull HttpStatus status) {

    public static final Status OK = new Status(10000_0001, HttpStatus.OK);
    public static final Status CREATED = new Status(10000_0002, HttpStatus.CREATED);
    public static final Status NO_CONTENT = new Status(10000_0003, HttpStatus.NO_CONTENT);

    public static final Status UNEXPECTED_FAILURE = new Status(10000_2491, HttpStatus.INTERNAL_SERVER_ERROR);
    public static final Status INVALID_ARGUMENT = new Status(10000_5730, HttpStatus.UNPROCESSABLE_CONTENT);
    public static final Status MISSING_ARGUMENT = new Status(10000_7008, HttpStatus.BAD_REQUEST);
    public static final Status INVALID_ENUMERATION = new Status(10000_6594, HttpStatus.UNPROCESSABLE_CONTENT);
    public static final Status REPEATED_ARGUMENT = new Status(10000_9872, HttpStatus.UNPROCESSABLE_CONTENT);
    public static final Status UNSUPPORTED_FORMAT = new Status(10000_4042, HttpStatus.BAD_REQUEST);
    public static final Status CONSTRAINT_VIOLATION = new Status(10000_7452, HttpStatus.UNPROCESSABLE_CONTENT);
    public static final Status UNSUPPORTED_METHOD = new Status(10000_5518, HttpStatus.BAD_REQUEST);
    public static final Status MISSING_METHOD = new Status(10000_3907, HttpStatus.NOT_FOUND);
    public static final Status ACCESS_DENIED = new Status(10000_8729, HttpStatus.FORBIDDEN);

    private static final Map<Integer, Status> VALUE_TO_ENUM = new HashMap<>();

    public Status(@NotNull Integer value, @NotNull HttpStatus status) {
        this.value = value;
        this.status = status;
        if (value == null || value < 10000_0000 || value > 99999_9999) {
            throw new InvalidArgument(0, 1, value);
        }
        if (VALUE_TO_ENUM.containsKey(value)) {
            throw new RepeatedArgument(0, 1, value);
        } else {
            VALUE_TO_ENUM.put(value, this);
        }
    }

    @Nullable
    public static Status fromValue(Integer value) {
        return VALUE_TO_ENUM.get(value);
    }

    @NotNull
    public static Status fromValueOrThrow(Integer value) {
        return Optional.ofNullable(fromValue(value))
                .orElseThrow(() -> new InvalidEnumeration(Status.class, value));
    }

    public boolean success() {
        return status.is2xxSuccessful();
    }

}
