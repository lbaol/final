package com.lbaol.common;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NumberUtil {
	
	public static double add(double v1, double v2) {// 加法  
        BigDecimal b1 = new BigDecimal(Double.toString(v1));  
        BigDecimal b2 = new BigDecimal(Double.toString(v2));  
        return b1.add(b2).doubleValue();  
    }  
  
    public static double sub(double v1, double v2) {// 减法  
        BigDecimal b1 = new BigDecimal(Double.toString(v1));  
        BigDecimal b2 = new BigDecimal(Double.toString(v2));  
        return b1.subtract(b2).doubleValue();  
    }  
  
    public static double mul(double v1, double v2) {// 乘法  
        BigDecimal b1 = new BigDecimal(Double.toString(v1));  
        BigDecimal b2 = new BigDecimal(Double.toString(v2));  
        return b1.multiply(b2).doubleValue();  
    }  
  
    public static double div(double v1, double v2) {// 除法  
        BigDecimal b1 = new BigDecimal(Double.toString(v1));  
        BigDecimal b2 = new BigDecimal(Double.toString(v2));  
        return b1.divide(b2, 3, BigDecimal.ROUND_HALF_UP).doubleValue();  
    }  
  
    public static double round(double v) {// 截取3位  
        BigDecimal b = new BigDecimal(Double.toString(v));  
        BigDecimal one = new BigDecimal("1");  
        return b.divide(one, 2, BigDecimal.ROUND_HALF_UP).doubleValue();  
    }  
  
    public static String decimalFormat(String pattern, double value) {  
        return new DecimalFormat(pattern).format(value);  
    }  
  
    public static String decimalFormat(double value) {  
        return new DecimalFormat("0.00").format(value);  
    }  
  
    public static String decimalFormat(double value, String pattern) {  
        return new DecimalFormat(pattern).format(value);  
    }  
  
    public static String decimalBlankFormat(double value) {  
        return new DecimalFormat("0").format(value);  
    }  
  
    public static boolean isNumber(String value) { // 检查是否是数字  
        String patternStr = "^\\d+$";  
        Pattern p = Pattern.compile(patternStr, Pattern.CASE_INSENSITIVE); // 忽略大小写;  
        Matcher m = p.matcher(value);  
        return m.find();  
    }  
  
}
