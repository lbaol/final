package com.lbaol.mapper;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.FavDO;
import com.lbaol.dataobject.PosDO;
import com.lbaol.dataobject.RecordDO;
import com.lbaol.dataobject.RecordGroupDO;
import com.lbaol.mapper.FavMapper.FavProvider;

public interface RecordGroupMapper {
	
	
	@Select("SELECT * FROM record_group where id=#{id}")
    @Results({
		@Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date")
	})
	RecordGroupDO getById(@Param("id") Integer id);
	
	@Select("SELECT * FROM record_group where (status != 'finish' || status  is null) && market=#{market} && type=#{type}  order by start_date desc")
    @Results({
		@Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date")
	})
    List<RecordGroupDO> getPositionByMarketAndType(@Param("market")String market,@Param("type")String type);
	
	@Select("SELECT * FROM record_group where status != 'finish' || status  is null  order by start_date desc")
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
	
	@InsertProvider(type = RecordGroupProvider.class, method = "insert")  
	@Options(useGeneratedKeys=true, keyProperty="id")
	Integer insert(RecordGroupDO recordGroupDO);
	
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
    	
    	public String insert(RecordGroupDO recordGroupDO) { 
    		if(recordGroupDO.getMarket() == null){  
    			recordGroupDO.setMarket("");
            }
    		if(recordGroupDO.getType() == null){  
    			recordGroupDO.setType("");
            }
    		if(recordGroupDO.getStatus() == null){  
    			recordGroupDO.setStatus("");
            }
    		if(recordGroupDO.getEndDate() == null){  
    			recordGroupDO.setEndDate("");
            }
    		if(recordGroupDO.getStartDate() == null){  
    			recordGroupDO.setStartDate("");
            }
        	return new SQL(){{      
        		INSERT_INTO("record_group");  
        			VALUES("code", "#{code}");  
        			VALUES("count", "#{count}");
        			VALUES("start_date", "#{startDate}");
        			VALUES("end_date", "#{endDate}");
        			VALUES("price", "#{price}");
        			VALUES("status", "#{status}");
        			VALUES("market", "#{market}");
        			VALUES("type", "#{type}");
        			VALUES("direction", "#{direction}");
            }}.toString();  
        } 
    	
    	
    	
        public String update(RecordGroupDO recordGroupDO) {  
        	
        	if(recordGroupDO.getStatus() == null) {
        		recordGroupDO.setStatus("");
        	}
        	if(recordGroupDO.getEndDate() == null) {
        		recordGroupDO.setEndDate("");
        	}
        	if(recordGroupDO.getStartDate() == null) {
        		recordGroupDO.setStartDate("");
        	}
        	
        	return new SQL()  
            {  
                {  
                    UPDATE("record_group");  
                    
                    if(recordGroupDO.getCount()!=null){  
                    	SET("count = #{count}");
                    }
                    if(recordGroupDO.getPrice()!=null){  
                    	SET("price = #{price}");
                    }
                    if(recordGroupDO.getStatus()!=null){  
                    	SET("status = #{status}");
                    }
                    if(recordGroupDO.getStartDate()!=null){  
                    	SET("start_date = #{startDate}");
                    }
                    if(recordGroupDO.getEndDate()!= null){  
                    	SET("end_date = #{endDate}");
                    }
                    if(StringUtils.isNotEmpty(recordGroupDO.getMarket())){  
                    	SET("market = #{market}");
                    }
                    if(StringUtils.isNotEmpty(recordGroupDO.getDirection())){  
                    	SET("direction = #{direction}");
                    }
                    if(StringUtils.isNotEmpty(recordGroupDO.getType())){  
                    	SET("type = #{type}");
                    }
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        }  
        
        
    } 

  
}
