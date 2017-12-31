package com.lbaol.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.EventDO;

public interface EventMapper {
	
	@Select("SELECT * FROM event order by event_date desc")
    @Results({
    	@Result(property = "eventDate", column = "event_date"),
        @Result(property = "subType", column = "sub_type"),
        @Result(property = "netProfits", column = "net_profits"),
        @Result(property = "profitsYoy", column = "profits_yoy")
    })
    List<EventDO> getAll();
	
	
	@Select("SELECT * FROM event where type='report' or type='forecast' order by event_date desc")
    @Results({
    	@Result(property = "eventDate", column = "event_date"),
        @Result(property = "subType", column = "sub_type"),
        @Result(property = "netProfits", column = "net_profits"),
        @Result(property = "profitsYoy", column = "profits_yoy")
    })
    List<EventDO> getAllReport();
	
	
	@Select("SELECT * FROM event where code=#{code}  order by event_date desc")
    @Results({
    	@Result(property = "eventDate", column = "event_date"),
        @Result(property = "subType", column = "sub_type"),
        @Result(property = "netProfits", column = "net_profits"),
        @Result(property = "profitsYoy", column = "profits_yoy")
    })
    List<EventDO> getByCode(String code);
	
	
	
	
	@Delete("DELETE FROM event WHERE id =#{id}")
    void deleteById(Integer id);
	

	@Insert("INSERT INTO event(code,name,type,event_date,sub_type,ranges,profits_yoy,net_profits,year,quarter) "
			+ "VALUES(#{code}, #{name}, #{type}, #{eventDate},#{subType}, #{ranges},  #{profitsYoy}, #{netProfits}, #{year}, #{quarter})")
    void insert(EventDO eventDO);
	
	@SelectProvider(type = EventProvider.class, method = "getByParams")  
	@Results({
        @Result(property = "eventDate", column = "event_date"),
        @Result(property = "subType", column = "sub_type"),
        @Result(property = "netProfits", column = "net_profits"),
        @Result(property = "profitsYoy", column = "profits_yoy")
    })
	public List<EventDO> getByParams(Map params);  
    
    
	@UpdateProvider(type = EventProvider.class,  
            method = "update")  
			int update(EventDO eventDO);  
    
    class EventProvider {  
        public String getByParams(Map params) {  
        	return new SQL(){{      
                SELECT("*");          
                FROM("event");      
                if(params.get("code")!=null){      
                    WHERE("code = #{code}");      
                } 
                if(params.get("type")!=null){      
                    WHERE("type = #{type}");      
                }
                if(params.get("eventDate")!=null){      
                    WHERE("event_date = #{eventDate}");      
                }
                if(params.get("startDate")!=null){      
                    WHERE("event_date >= #{startDate}");      
                }
                if(params.get("endDate")!=null){      
                    WHERE("event_date <= #{endDate}");      
                }
                ORDER_BY("event_date desc");
            }}.toString();  
        }  
        
        public String update(EventDO eventDO) {  
        	return new SQL()  
            {  
                {  
                    UPDATE("event");  
                    if (eventDO.getProfitsYoy() != null)  
                    {  
                        SET("profits_yoy = #{profitsYoy}");  
                    }  
                    if (eventDO.getNetProfits() != null)  
                    {  
                        SET("net_profits = #{netProfits}");  
                    } 
                    if (eventDO.getYear() != null)  
                    {  
                        SET("year = #{year}");  
                    } 
                    if (eventDO.getQuarter() != null)  
                    {  
                        SET("quarter = #{quarter}");  
                    }
                    if (eventDO.getSubType() != null)  
                    {  
                        SET("sub_type = #{subType}");  
                    }
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        }  
    } 

  
}
