package com.lbaol.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.lbaol.dataobject.ForecastDO;

public interface ForecastMapper {
	
	@Select("SELECT * FROM forecast")
    @Results({
        @Result(property = "index", column = "index"),
        @Result(property = "code", column = "code"),
        @Result(property = "name", column = "name"),
        @Result(property = "reportDate", column = "report_date"),
        @Result(property = "preEps", column = "pre_eps"),
        @Result(property = "range", column = "range")
    })
    List<ForecastDO> getAll();


}
