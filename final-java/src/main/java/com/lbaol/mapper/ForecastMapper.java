package com.lbaol.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
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
	
	@Select("SELECT * FROM forecast WHERE code = #{code} and report_date = #{reportDate}")
    @Results({
        @Result(property = "reportDate", column = "report_date"),
        @Result(property = "preEps", column = "pre_eps")
    })
    List<ForecastDO> getByCodeAndReportDate(@Param("code") String code,@Param("reportDate") String reportDate);

	@Insert("INSERT INTO forecast(code,name,type,report_date,pre_eps,ranges) VALUES(#{code}, #{name}, #{type}, #{reportDate}, #{preEps}, #{ranges})")
    void insert(ForecastDO forecastDO);

    @Delete("DELETE FROM forecast WHERE id =#{id}")
    void deleteById(Integer id);
}
