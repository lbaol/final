package com.lbaol.mapper;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.RecordDO;

public interface RecordMapper {
	
	
	@Select("SELECT * FROM record where group_id=#{groupId}")
    @Results({
		@Result(property = "stopPrice", column = "stop_price"),
        @Result(property = "groupId", column = "group_id")
	})
	List<RecordDO> getByGroupId(@Param("groupId") Integer groupId);
	
	@Select("SELECT * FROM record where id=#{id}")
    @Results({
    	@Result(property = "stopPrice", column = "stop_price"),
        @Result(property = "groupId", column = "group_id")
	})
	RecordDO getById(@Param("id") Integer id);
	
	@Select("SELECT * FROM record")
    @Results({
		@Result(property = "stopPrice", column = "stop_price"),
        @Result(property = "groupId", column = "group_id")
	})
    List<RecordDO> getAll();
    
	@Delete("DELETE FROM record WHERE id =#{id}")
    void deleteById(Integer id);
	
	@Insert("INSERT INTO record(code,count,date,fee,stop_price,direction,group_id) VALUES(#{code}, #{count}, #{date}, #{fee}, #{stopPrice}, #{direction}, #{groupId})")
	@Options(useGeneratedKeys=true, keyProperty="id")
	void insert(RecordDO recordDO);
	
	@UpdateProvider(type = RecordProvider.class,  
            method = "update")  
			int update(RecordDO recordDO);  
	
    
    class RecordProvider {  
    	
        public String update(RecordDO recordDO) {  
        	
        	return new SQL()  
            {  
                {  
                    UPDATE("pos");  
                    
                    if(recordDO.getCount()!=null){  
                    	SET("count = #{count}");
                    }
                    if(StringUtils.isNotEmpty(recordDO.getDate())){  
                    	SET("date = #{date}");
                    }
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        }  
        
        
    } 

  
}
