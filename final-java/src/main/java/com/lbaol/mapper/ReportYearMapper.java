package com.lbaol.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.lbaol.dataobject.ReportDO;

public interface ReportYearMapper {
	
	
	
	@Select("SELECT * FROM report_${year}")
    @Results({
        @Result(property = "epsYoy", column = "eps_yoy"),
        @Result(property = "netProfits", column = "net_profits"),
        @Result(property = "profitsYoy", column = "profits_yoy"),
        @Result(property = "reportDate", column = "report_date")
    })
    List<ReportDO> getAll(@Param("year") String year);


}
