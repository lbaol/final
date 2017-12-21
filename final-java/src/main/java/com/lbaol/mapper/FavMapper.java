package com.lbaol.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.FavDO;

public interface FavMapper {
	
	@Select("SELECT * FROM fav where code=#{code} and type=#{type} order by id desc")
    @Results({})
    List<FavDO> getByCodeAndType(@Param("code") String code,@Param("type") String type);
	
	
	
	
	@Delete("DELETE FROM fav WHERE code =#{code}")
    void deleteByCode(String code);
	

	@InsertProvider(type = EventProvider.class, method = "insert")  
	@Options(useGeneratedKeys=true, keyProperty="id")
	Integer insert(FavDO favDO);
	
	@SelectProvider(type = EventProvider.class, method = "getByParams")  
	@Results()
	public List<FavDO> getByParams(Map params);  
    
	@Delete("DELETE FROM fav WHERE code=#{code} type not in (#{types})")
	public void deleteNotExistsTypes(String code,List<String> types);  

    
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
                ORDER_BY("id desc");
            }}.toString();  
        }  
        
        public String insert(FavDO favDO) {  
        	return new SQL(){{      
        		INSERT_INTO("fav");  
        			VALUES("code", "#{code}");  
    	        if(favDO.getType()==null || favDO.getType()==""){   
    	        	VALUES("type", "default"); 
    	        }else {
    	        	VALUES("type", "#{type}"); 
    	        }
            }}.toString();  
        }  
        
        
    } 

  
}
