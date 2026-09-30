package com.zuttokin.rose.frame.util.lang;

import com.zuttokin.rose.frame.util.primitive.Strings;
import jakarta.validation.constraints.NotNull;
import lombok.experimental.UtilityClass;

import java.util.Optional;

@UtilityClass
public class Reflections {

    /**
     * Get the stack frame at the specified depth.
     *
     * @param stackFrameDepth 0 = current method, 1 = caller, 2 = caller's caller, ...
     */
    @NotNull
    public static Optional<StackWalker.StackFrame> fetchStackFrame(int stackFrameDepth) {
        return StackWalker.getInstance().walk(stream -> stream.skip(stackFrameDepth + 1).findFirst());
    }

    /**
     * Get the stack frame method name at the specified depth.
     *
     * @param stackFrameDepth 0 = current method, 1 = caller, 2 = caller's caller, ...
     */
    @NotNull
    public static String fetchMethodName(int stackFrameDepth) {
        return fetchStackFrame(stackFrameDepth + 1).map(StackWalker.StackFrame::getMethodName).orElse(Strings.EMPTY);
    }

    /**
     * Get the stack frame class name at the specified depth.
     *
     * @param stackFrameDepth 0 = current method, 1 = caller, 2 = caller's caller, ...
     */
    @NotNull
    public static String fetchClassName(int stackFrameDepth) {
        return fetchStackFrame(stackFrameDepth + 1).map(StackWalker.StackFrame::getClassName).orElse(Strings.EMPTY);
    }

}
