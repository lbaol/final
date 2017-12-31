package com.lbaol.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.lbaol.dataobject.KDataDO;

public interface KDataMapper {
	

	@Select("SELECT * FROM k_data  WHERE code = #{code} order by date desc")
    @Results()
    List<KDataDO> getByCode(@Param("code") String code);
	
	
	@Select("SELECT * FROM k_data  WHERE code = #{code} and date >= #{date} order by date asc limit 1")
    @Results()
    KDataDO getCurrentDataByCodeAndDateContain(@Param("code") String code,@Param("date") String date);
	
	@Select("SELECT * FROM k_data  WHERE code = #{code} and date > #{date} order by date asc limit 1")
    @Results()
    KDataDO getCurrentDataByCodeAndDateNotContain(@Param("code") String code,@Param("date") String date);
	
	@Select("SELECT * FROM k_data  WHERE code = #{code} and date < #{date} order by date desc limit 1")
    @Results()
    KDataDO getPreDataByCodeAndDateNotContain(@Param("code") String code,@Param("date") String date);
	
	
	@Select("SELECT * FROM k_data  WHERE code = #{code} and date <= #{date} order by date desc limit 1")
    @Results()
    KDataDO getPreDataByCodeAndDateContain(@Param("code") String code,@Param("date") String date);
}
