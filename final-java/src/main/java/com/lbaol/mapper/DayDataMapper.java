package com.lbaol.mapper;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.lbaol.dataobject.StockDO;

public interface DayDataMapper {
	

	@Select("SELECT * FROM k_data  WHERE code = #{code} order date desc")
    @Results()
    StockDO getByCode(@Param("code") String code);
	
	
}
