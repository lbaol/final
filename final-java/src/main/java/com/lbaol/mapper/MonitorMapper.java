package com.lbaol.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.MonitorDO;

public interface MonitorMapper {
	
	
	
	@Insert("INSERT INTO monitor(code,type,count,time,date,time_price,alert_price) "
			+ "VALUES(#{code}, #{type}, #{count}, #{time},#{date}, #{timePrice}, #{alertPrice})")
    void insert(MonitorDO monitorDO);
	
	@SelectProvider(type = MonitorProvider.class, method = "getByParams")  
	@Results({
        @Result(property = "timePrice", column = "time_price"),
        @Result(property = "alertPrice", column = "alert_price")
    })
	public List<MonitorDO> getByParams(Map params);  
	
	@DeleteProvider(type = MonitorProvider.class,  
            method = "deleteByParams")  
			int deleteByParams(Map params);  

	@UpdateProvider(type = MonitorProvider.class,  
            method = "update")  
			int update(MonitorDO monitorDO);  
    
    class MonitorProvider {  
        public String getByParams(Map params) {  
        	return new SQL(){{      
                SELECT("*");          
                FROM("monitor");      
                if(params.get("code")!=null){      
                    WHERE("code = #{code}");      
                } 
                if(params.get("type")!=null){      
                    WHERE("type = #{type}");      
                }
                if(params.get("count")!=null){      
                    WHERE("count = #{count}");      
                }
                if(params.get("date")!=null){      
                    WHERE("date = #{date}");      
                }
                ORDER_BY("time desc");
            }}.toString();  
        }  
        
        public String deleteByParams(Map params) {  
        	return new SQL(){{      
        		DELETE_FROM("monitor");  
        		if(params.get("code")!=null){      
                    WHERE("code = #{code}");      
                } 
                if(params.get("type")!=null){      
                    WHERE("type = #{type}");      
                }
                if(params.get("count")!=null){      
                    WHERE("count = #{count}");      
                }
                if(params.get("date")!=null){      
                    WHERE("date = #{date}");      
                }
            }}.toString();  
        } 
        
        public String update(MonitorDO monitorDO) {  
        	return new SQL()  
            {  
                {  
                    UPDATE("monitor");  
                    if (monitorDO.getTime() != null){  
                        SET("time = #{time}");  
                    }
                    if(monitorDO.getAlertPrice()!=null) {
                    	SET("alert_price = #{alertPrice}"); 
                    }
                    
                    if(monitorDO.getTimePrice()!=null) {
                    	SET("time_price = #{timePrice}"); 
                    }
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        }  
        
        
    } 
}
