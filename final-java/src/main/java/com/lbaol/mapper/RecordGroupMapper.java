package com.lbaol.mapper;

import java.util.List;
import java.util.Map;

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

import com.lbaol.dataobject.PosDO;
import com.lbaol.dataobject.RecordDO;
import com.lbaol.dataobject.RecordGroupDO;

public interface RecordGroupMapper {
	
	
	@Select("SELECT * FROM record_group where id=#{id}")
    @Results({
		@Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date")
	})
	RecordGroupDO getById(@Param("id") Integer id);
	
	@Select("SELECT * FROM record_group where count != 0 order by start_date desc")
    @Results({
		@Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date")
	})
    List<RecordGroupDO> getAllPosition();
	
	@Select("SELECT * FROM record_group order by start_date desc")
    @Results({
		@Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date")
	})
    List<RecordGroupDO> getAll();
    
	@Delete("DELETE FROM record_group WHERE id =#{id}")
    void deleteById(Integer id);
	
	@Insert("INSERT INTO record_group(code,count,start_date,end_date,cost) VALUES(#{code}, #{count}, #{startDate}, #{endDate}, #{cost})")
	@Options(useGeneratedKeys=true, keyProperty="id")
	void insert(RecordGroupDO recordGroupDO);
	
	@UpdateProvider(type = RecordGroupProvider.class,  
            method = "update")  
			int update(RecordGroupDO recordGroupDO);  
	
    
    class RecordGroupProvider {  
    	
    	public String getByParams(Map params) {  
        	return new SQL(){{      
                SELECT("*");          
                FROM("record_group");      
                if(params.get("code")!=null){      
                    WHERE("code = #{code}");      
                } 
                
                ORDER_BY("id desc");
            }}.toString();  
        } 
    	
        public String update(RecordGroupDO recordGroupDO) {  
        	
        	return new SQL()  
            {  
                {  
                    UPDATE("pos");  
                    
                    if(recordGroupDO.getCount()!=null){  
                    	SET("count = #{count}");
                    }
                    if(recordGroupDO.getCost()!=null){  
                    	SET("cost = #{cost}");
                    }
                    if(StringUtils.isNotEmpty(recordGroupDO.getStartDate())){  
                    	SET("start_date = #{startDate}");
                    }
                    if(StringUtils.isNotEmpty(recordGroupDO.getEndDate())){  
                    	SET("end_date = #{endDate}");
                    }
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        }  
        
        
    } 

  
}
