package com.lbaol.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.lbaol.dataobject.ReportDO;

public interface ReportMapper {
	
	@Select("SELECT * FROM report")
    @Results({
        @Result(property = "epsYoy", column = "eps_yoy"),
        @Result(property = "netProfits", column = "net_profits"),
        @Result(property = "profitsYoy", column = "profits_yoy"),
        @Result(property = "reportDate", column = "report_date")
    })
    List<ReportDO> getAll();
	
	
	@Select("SELECT * FROM report WHERE code = #{code} and report_date = #{reportDate}")
	@Results({
        @Result(property = "epsYoy", column = "eps_yoy"),
        @Result(property = "netProfits", column = "net_profits"),
        @Result(property = "profitsYoy", column = "profits_yoy"),
        @Result(property = "reportDate", column = "report_date")
    })
	List<ReportDO> getByCodeAndReportDate(@Param("code") String code,@Param("reportDate") String reportDate);
	
	@Select("SELECT * FROM report WHERE code = #{code}")
	@Results({
        @Result(property = "epsYoy", column = "eps_yoy"),
        @Result(property = "netProfits", column = "net_profits"),
        @Result(property = "profitsYoy", column = "profits_yoy"),
        @Result(property = "reportDate", column = "report_date")
    })
	List<ReportDO> getByCode(@Param("code") String code);

    @Insert("INSERT INTO report(code,name,eps,eps_yoy,bvps,roe,epcf,net_profits,profits_yoy,distrib,report_date) VALUES(#{code}, #{name}, #{eps}, #{epsYoy}, #{bvps}, #{roe}, #{epcf}, #{netProfits}, #{profitsYoy}, #{distrib}, #{reportDate})")
    void insert(ReportDO reportDO);

    @Delete("DELETE FROM report WHERE id =#{id}")
    void deleteById(Integer id);


}
