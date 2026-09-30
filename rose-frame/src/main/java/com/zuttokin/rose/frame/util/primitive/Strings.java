package com.zuttokin.rose.frame.util.primitive;

import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;

@UtilityClass
public class Strings {

    public static final String EMPTY = StringUtils.EMPTY;
    public static final String SPACE = " ";
    public static final String FULL_WIDTH_SPACE = "　";
    public static final String PERIOD = ".";
    public static final String FULL_WIDTH_PERIOD = "．";
    public static final String COMMA = ",";
    public static final String COMMA_SPACE = ", ";
    public static final String FULL_WIDTH_COMMA = "，";
    public static final String QUESTION_MARK = "?";
    public static final String FULL_WIDTH_QUESTION_MARK = "？";
    public static final String EXCLAMATION_MARK = "!";
    public static final String FULL_WIDTH_EXCLAMATION_MARK = "！";
    public static final String COLON = ":";
    public static final String COLON_SPACE = ": ";
    public static final String FULL_WIDTH_COLON = "：";
    public static final String SEMICOLON = ";";
    public static final String SEMICOLON_SPACE = "; ";
    public static final String FULL_WIDTH_SEMICOLON = "；";
    public static final String QUOTATION_MARK = "\"";
    public static final String FULL_WIDTH_QUOTATION_MARK = "“";
    public static final String APOSTROPHE = "'";
    public static final String FULL_WIDTH_APOSTROPHE = "‘";
    public static final String LEFT_PARENTHESIS = "(";
    public static final String RIGHT_PARENTHESIS = ")";
    public static final String FULL_WIDTH_LEFT_PARENTHESIS = "（";
    public static final String FULL_WIDTH_RIGHT_PARENTHESIS = "）";
    public static final String LEFT_SQUARE_BRACKET = "[";
    public static final String RIGHT_SQUARE_BRACKET = "]";
    public static final String FULL_WIDTH_LEFT_SQUARE_BRACKET = "［";
    public static final String FULL_WIDTH_RIGHT_SQUARE_BRACKET = "］";
    public static final String LEFT_CURLY_BRACE = "{";
    public static final String RIGHT_CURLY_BRACE = "}";
    public static final String FULL_WIDTH_LEFT_CURLY_BRACE = "｛";
    public static final String FULL_WIDTH_RIGHT_CURLY_BRACE = "｝";
    public static final String LESS_THAN_SIGN = "<";
    public static final String GREATER_THAN_SIGN = ">";
    public static final String FULL_WIDTH_LESS_THAN_SIGN = "＜";
    public static final String FULL_WIDTH_GREATER_THAN_SIGN = "＞";
    public static final String AT_SIGN = "@";
    public static final String FULL_WIDTH_AT_SIGN = "＠";
    public static final String NUMBER_SIGN = "#";
    public static final String FULL_WIDTH_NUMBER_SIGN = "＃";
    public static final String PERCENT_SIGN = "%";
    public static final String FULL_WIDTH_PERCENT_SIGN = "％";
    public static final String AMPERSAND = "&";
    public static final String FULL_WIDTH_AMPERSAND = "＆";
    public static final String ASTERISK = "*";
    public static final String FULL_WIDTH_ASTERISK = "＊";
    public static final String UNDERSCORE = "_";
    public static final String FULL_WIDTH_UNDERSCORE = "＿";
    public static final String PLUS_SIGN = "+";
    public static final String FULL_WIDTH_PLUS_SIGN = "＋";
    public static final String HYPHEN_MINUS = "-";
    public static final String FULL_WIDTH_HYPHEN_MINUS = "－";
    public static final String EQUALS_SIGN = "=";
    public static final String FULL_WIDTH_EQUALS_SIGN = "＝";
    public static final String TILDE = "~";
    public static final String FULL_WIDTH_TILDE = "～";
    public static final String BACKSLASH = "\\";
    public static final String FULL_WIDTH_BACKSLASH = "＼";
    public static final String VERTICAL_BAR = "|";
    public static final String FULL_WIDTH_VERTICAL_BAR = "｜";
    public static final String ELLIPSIS = "...";
    public static final String FULL_WIDTH_ELLIPSIS = "……";

    public static String join(final Object[] array, final String delimiter) {
        return StringUtils.join(array, delimiter);
    }

}
