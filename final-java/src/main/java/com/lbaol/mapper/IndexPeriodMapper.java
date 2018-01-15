package com.lbaol.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.IndexPeriodDO;

public interface IndexPeriodMapper {
	
	@SelectProvider(type = IndexPeriodProvider.class, method = "getByParams")  
	@Results({
		@Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date"),
        @Result(property = "fullCode", column = "full_code")
	})
	public List<IndexPeriodDO> getByParams(Map params);  
	
	
	@Select("SELECT * FROM index_period order by start_date desc limit 1")
    @Results({
		@Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date"),
        @Result(property = "fullCode", column = "full_code")
	})
	IndexPeriodDO getLast();
	
	@Insert("INSERT INTO index_period(code,full_code,start_date,end_date,market) "
			+ "VALUES(#{code}, #{fullCode}, #{startDate}, #{endDate},#{market})")
	@Options(useGeneratedKeys=true, keyProperty="id")
    void insert(IndexPeriodDO indexPeriodDO);
	
	@UpdateProvider(type = IndexPeriodProvider.class,  
            method = "update")  
			int update(IndexPeriodDO indexPeriodDO);  

    
    class IndexPeriodProvider {  
        public String getByParams(Map params) {  
        	return new SQL(){{      
                SELECT("*");          
                FROM("index_period");   
                ORDER_BY("start_date desc");
            }}.toString();  
        }  
        
        
        public String update(IndexPeriodDO indexPeriodDO) {  
        	return new SQL()  
            {  
                {  
                    UPDATE("index_period");  
                    if(indexPeriodDO.getCode()!=null){   
                    	SET("code = #{code}"); 
        	        }
        	        if(indexPeriodDO.getMarket()!=null){   
        	        	SET("market = #{market}"); 
        	        }
        	        if(indexPeriodDO.getFullCode()!=null){   
        	        	SET("full_code = #{fullCode}"); 
        	        }
        	        if(indexPeriodDO.getStartDate()!=null){   
        	        	SET("start_date = #{startDate}"); 
        	        } 
        	        if(indexPeriodDO.getEndDate()!=null){   
        	        	SET("end_date = #{endDate}"); 
        	        } 
                    
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        } 
        
        
    } 

  
}
