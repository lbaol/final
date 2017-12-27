package com.lbaol.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.NoteDO;

public interface NoteMapper {
	

	@Delete("DELETE FROM note WHERE code =#{code} and type =#{type} ")
    void deleteByCodeAndType(@Param("code") String code,@Param("type") String type);
	
	
	@InsertProvider(type = NoteProvider.class, method = "insert")  
	@Options(useGeneratedKeys=true, keyProperty="id")
	Integer insert(NoteDO noteDO);
	
	@SelectProvider(type = NoteProvider.class, method = "getByParams")  
	@Results()
	public List<NoteDO> getByParams(Map params);  
	
	
	@Select("SELECT * FROM note where code=#{code} and type=#{type}")
    @Results({})
	public List<NoteDO> getByCodeAndType(@Param("code") String code,@Param("type") String type);  
    
	
	@UpdateProvider(type = NoteProvider.class,  
            method = "update")  
			int update(NoteDO noteDO);  

    
    class NoteProvider {  
        public String getByParams(Map params) {  
        	return new SQL(){{      
                SELECT("*");          
                FROM("note");      
                if(params.get("code")!=null){      
                    WHERE("code = #{code}");      
                } 
                if(params.get("type")!=null){      
                    WHERE("type = #{type}");      
                }
                ORDER_BY("id desc");
            }}.toString();  
        }  
        
        public String insert(NoteDO noteDO) { 
        	if(noteDO.getType()==null || noteDO.getType()=="") {
        		noteDO.setType("default");
        	}
        	
        	return new SQL(){{      
        		INSERT_INTO("note");  
        			VALUES("code", "#{code}");  
        			VALUES("content", "#{content}"); 
    			if(noteDO.getType()!=null){   
    	        	VALUES("type", "#{type}"); 
    	        }
    	        if(noteDO.getDate()!=null){   
    	        	VALUES("date", "#{date}"); 
    	        }
            }}.toString();  
        }  
        
        public String update(NoteDO noteDO) {  
        	return new SQL()  
            {  
                {  
                    UPDATE("note");  
                    if (noteDO.getContent() != null)  
                    {  
                        SET("content = #{content}");  
                    }  
                    
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        } 
        
        
    } 

  
}
