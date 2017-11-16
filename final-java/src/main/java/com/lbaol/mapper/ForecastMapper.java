package com.lbaol.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.lbaol.dataobject.ForecastDO;

public interface ForecastMapper {
	
	@Select("SELECT * FROM forecast")
    @Results({
        @Result(property = "reportDate", column = "report_date"),
        @Result(property = "preEps", column = "pre_eps")
    })
    List<ForecastDO> getAll();
	
	@Select("SELECT * FROM forecast WHERE code = #{code}")
    @Results({
        @Result(property = "reportDate", column = "report_date"),
        @Result(property = "preEps", column = "pre_eps")
    })
    List<ForecastDO> getByCode(@Param("code") String code);


}
