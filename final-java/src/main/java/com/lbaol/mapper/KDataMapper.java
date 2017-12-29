package com.lbaol.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.lbaol.dataobject.KDataDO;

public interface KDataMapper {
	

	@Select("SELECT * FROM kdata_temp  WHERE code = #{code} order by date desc")
    @Results()
    List<KDataDO> getByCodeOrderByDateDesc(@Param("code") String code);
	
	
	@Select("SELECT * FROM kdata_temp  WHERE code = #{code} order by date asc")
    @Results()
    List<KDataDO> getByCodeOrderByDateAsc(@Param("code") String code);
	
	
}
