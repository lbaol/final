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

import com.lbaol.dataobject.AlertDO;

public interface AlertMapper {
	
	
	
	@Insert("INSERT INTO alert(code,type,count,time,date,time_price,alert_price) "
			+ "VALUES(#{code}, #{type}, #{count}, #{time},#{date}, #{timePrice}, #{alertPrice})")
    void insert(AlertDO alertDO);
	
	@SelectProvider(type = AlertProvider.class, method = "getByParams")  
	@Results({
        @Result(property = "timePrice", column = "time_price"),
        @Result(property = "alertPrice", column = "alert_price")
    })
	public List<AlertDO> getByParams(Map params);  
	
	@DeleteProvider(type = AlertProvider.class,  
            method = "deleteByParams")  
			int deleteByParams(Map params);  

	@UpdateProvider(type = AlertProvider.class,  
            method = "update")  
			int update(AlertDO alertDO);  
    
    class AlertProvider {  
        public String getByParams(Map params) {  
        	return new SQL(){{      
                SELECT("*");          
                FROM("alert");      
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
                if(params.get("startDate")!=null){      
                    WHERE("date >= #{startDate}");      
                }
                ORDER_BY("time desc");
            }}.toString();  
        }  
        
        public String deleteByParams(Map params) {  
        	return new SQL(){{      
        		DELETE_FROM("alert");  
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
        
        public String update(AlertDO alertDO) {  
        	return new SQL()  
            {  
                {  
                    UPDATE("alert");  
                    if (alertDO.getTime() != null){  
                        SET("time = #{time}");  
                    }
                    if(alertDO.getAlertPrice()!=null) {
                    	SET("alert_price = #{alertPrice}"); 
                    }
                    if(alertDO.getTimePrice()!=null) {
                    	SET("time_price = #{timePrice}"); 
                    }
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        }  
        
        
    } 
}
