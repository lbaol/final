package com.lbaol.common;

import org.apache.commons.lang3.StringUtils;

public class MapperUtil {
	
	static public String toWhereInString(String str) {
		if(StringUtils.isNotEmpty(str)) {
			String newStr = "(";
			String[] sArray = str.split(",");
			int i = 1;
			for(String s : sArray) {
				newStr = newStr + "'"+s+"'";
				if(i!=sArray.length) {
					newStr = newStr+",";
				}
				i++;
			}
			return newStr+")";
		}else {
			return str;
		}
	}

}
