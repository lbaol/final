package com.lbaol.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.DayDataDO;

public interface DayDataMapper {
	

	@Select("SELECT * FROM day_data  WHERE code = #{code} order by date desc")
    @Results({
    	@Result(property = "yearRise", column = "year_rise"),
    	@Result(property = "yearHalfRise", column = "year_half_rise")
    })
    List<DayDataDO> getByCode(@Param("code") String code);
	
	@Insert("INSERT INTO day_data(code,date,year_rise,year_half_rise) VALUES(#{code}, #{date}, #{yearRise}, #{yearHalfRise})")
    void insert(DayDataDO dayDataDO);
	
	
	@UpdateProvider(type = DayDataProvider.class,  
            method = "update")  
			int update(DayDataDO dayDataDO);  
    
    class DayDataProvider {  
        
        public String update(DayDataDO dayDataDO) {  
        	return new SQL()  
            {  
                {  
                    UPDATE("day_data");  
                    if(dayDataDO.getYearRise()!=null){      
                    	SET("year_rise = #{yearRise}");  
                    }
                    if(dayDataDO.getYearHalfRise()!=null){  
                    	SET("year_half_rise = #{yearHalfRise}"); 
                    }
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        }  
    } 
	
}
