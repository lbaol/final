package com.lbaol.mapper;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.PosDO;

public interface PosMapper {
	
	
	@Select("SELECT * FROM pos where id=#{id}")
    @Results()
	PosDO getById(@Param("id") Integer id);
	
	@Select("SELECT * FROM pos")
    @Results()
    List<PosDO> getAll();
    
	@Delete("DELETE FROM pos WHERE id =#{id}")
    void deleteById(Integer id);
	
	@Insert("INSERT INTO pos(code,number,date,cost) VALUES(#{code}, #{number}, #{date}, #{cost})")
	@Options(useGeneratedKeys=true, keyProperty="id")
	void insert(PosDO posDO);
	
	@UpdateProvider(type = PosProvider.class,  
            method = "update")  
			int update(PosDO posDO);  
	
    
    class PosProvider {  
    	
        public String update(PosDO posDO) {  
        	
        	return new SQL()  
            {  
                {  
                    UPDATE("pos");  
                    
                    if(posDO.getNumber()!=null){  
                    	SET("number = #{number}");
                    }
                    if(posDO.getCost()!=null){  
                    	SET("cost = #{cost}");
                    }
                    if(StringUtils.isNotEmpty(posDO.getDate())){  
                    	SET("date = #{date}");
                    }
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        }  
        
        
    } 

  
}
