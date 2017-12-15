package com.lbaol.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.ForecastDO;

public interface ForecastMapper {
	
	@Select("SELECT * FROM forecast order by report_date desc")
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
    
    @SelectProvider(type = ForecastProvider.class, method = "getByParams")  
	@Results({
        @Result(property = "reportDate", column = "report_date"),
        @Result(property = "preEps", column = "pre_eps")
    })
	public List<ForecastDO> getByParams(Map params);  
    
     
    
    class ForecastProvider {  
        public String getByParams(Map params) {  
        	return new SQL(){{      
                SELECT("*");          
                FROM("forecast");      
                if(params.get("code")!=null){      
                    WHERE("code = #{code}");      
                } 
                if(params.get("type")!=null){      
                    WHERE("type = #{type}");      
                }
                if(params.get("startDate")!=null){      
                    WHERE("report_date >= #{startDate}");      
                }
                if(params.get("endDate")!=null){      
                    WHERE("report_date <= #{endDate}");      
                }
                if(params.get("type")!=null){      
                    WHERE("type = #{type}");      
                }
                ORDER_BY("report_date desc");
            }}.toString();  
        }  
    } 
}
