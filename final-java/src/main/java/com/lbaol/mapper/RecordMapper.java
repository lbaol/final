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
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.RecordDO;

public interface RecordMapper {
	
	
	@Select("SELECT * FROM record where group_id=#{groupId}")
    @Results({
		@Result(property = "stopPrice", column = "stop_price"),
        @Result(property = "groupId", column = "group_id"),
        @Result(property = "subOper", column = "sub_oper"),
        @Result(property = "openId", column = "open_id"),
		@Result(property = "openType", column = "open_type"),
		@Result(property = "statStatus", column = "stat_status"),
		@Result(property = "openSignal", column = "open_signal")
	})
	List<RecordDO> getByGroupId(@Param("groupId") Integer groupId);
	
	@Select("SELECT * FROM record where id=#{id}")
    @Results({
    	@Result(property = "stopPrice", column = "stop_price"),
        @Result(property = "groupId", column = "group_id"),
        @Result(property = "subOper", column = "sub_oper"),
        @Result(property = "openId", column = "open_id"),
		@Result(property = "openType", column = "open_type"),
		@Result(property = "statStatus", column = "stat_status"),
		@Result(property = "openSignal", column = "open_signal")
	})
	RecordDO getById(@Param("id") Integer id);
	
	@Select("SELECT * FROM record")
    @Results({
		@Result(property = "stopPrice", column = "stop_price"),
        @Result(property = "groupId", column = "group_id"),
        @Result(property = "subOper", column = "sub_oper"),
        @Result(property = "openId", column = "open_id"),
		@Result(property = "openType", column = "open_type"),
		@Result(property = "statStatus", column = "stat_status"),
		@Result(property = "openSignal", column = "open_signal")
	})
    List<RecordDO> getAll();
	
	@SelectProvider(type = RecordProvider.class, method = "getByParams")  
	@Results({
		@Result(property = "stopPrice", column = "stop_price"),
        @Result(property = "groupId", column = "group_id"),
        @Result(property = "subOper", column = "sub_oper"),
        @Result(property = "openId", column = "open_id"),
		@Result(property = "openType", column = "open_type"),
		@Result(property = "statStatus", column = "stat_status"),
		@Result(property = "openSignal", column = "open_signal")
    })
	public List<RecordDO> getByParams(Map params);  
    
	@Delete("DELETE FROM record WHERE id =#{id}")
    void deleteById(Integer id);
	
	@Insert("INSERT INTO record(code,market,count,date,fee,stop_price,oper,sub_oper,group_id,price,open_id,remaining,type,stat_status,open_type,open_signal) VALUES(#{code},#{market},  #{count}, #{date}, #{fee}, #{stopPrice}, #{oper}, #{subOper}, #{groupId}, #{price}, #{openId}, #{remaining}, #{type}, #{statStatus}, #{openType}, #{openSignal})")
	@Options(useGeneratedKeys=true, keyProperty="id")
	void insert(RecordDO recordDO);
	
	@UpdateProvider(type = RecordProvider.class,  
            method = "update")  
			int update(RecordDO recordDO);  
	
    
    class RecordProvider {  
    	
    	public String getByParams(Map params) {  
        	return new SQL(){{      
                SELECT("*");          
                FROM("record");      
                if(params.get("openId")!=null){      
                    WHERE("open_id = #{openId}");      
                }
                if(params.get("subOper")!=null){      
                    WHERE("sub_oper = #{subOper}");      
                }
                if(params.get("oper")!=null){      
                    WHERE("oper = #{oper}");      
                }
                if(params.get("type")!=null){      
                    WHERE("type = #{type}");      
                }
                if(params.get("code")!=null){      
                    WHERE("code = #{code}");      
                }
                if(params.get("openType")!=null){      
                    WHERE("open_type = #{openType}");      
                }
                if(params.get("openSignal")!=null){      
                    WHERE("open_signal = #{openSignal}");      
                }
                if(params.get("groupId")!=null){      
                    WHERE("group_id = #{groupId}");      
                }
                ORDER_BY("date desc");
            }}.toString();  
        } 
    	
        public String update(RecordDO recordDO) {  
        	
        	return new SQL()  
            {  
                {  
                    UPDATE("record");  
                    
                    if(recordDO.getCount()!=null){  
                    	SET("count = #{count}");
                    }
                    if(recordDO.getOpenId()!=null){  
                    	SET("open_id = #{openId}");
                    }
                    if(recordDO.getRemaining()!=null){  
                    	SET("remaining = #{remaining}");
                    }
                    if(recordDO.getCode()!=null){      
                    	SET("code = #{code}");      
                    }
                    if(recordDO.getPrice()!=null){  
                    	SET("price = #{price}");
                    }
                    if(recordDO.getOper()!=null){  
                    	SET("oper = #{oper}");
                    }
                    if(recordDO.getReturns()!=null){  
                    	SET("returns = #{returns}");
                    }
                    if(recordDO.getSubOper()!=null){  
                    	SET("sub_oper = #{subOper}");
                    }
                    if(recordDO.getStopPrice()!=null){  
                    	SET("stop_price = #{stopPrice}");
                    }
                    if(recordDO.getFee()!=null){  
                    	SET("fee = #{fee}");
                    }
                    if(StringUtils.isNotEmpty(recordDO.getDate())){  
                    	SET("date = #{date}");
                    }
                    if(StringUtils.isNotEmpty(recordDO.getMarket())){  
                    	SET("market = #{market}");
                    }
                    if(StringUtils.isNotEmpty(recordDO.getType())){  
                    	SET("type = #{type}");
                    }
                    if(recordDO.getStatStatus()!=null){      
                    	SET("stat_status = #{statStatus}");      
                    }
                    if(recordDO.getStatStatus()!=null){      
                    	SET("open_signal = #{openSignal}");      
                    }
                    
                    if(recordDO.getOpenType()!=null){      
                    	SET("open_type = #{openType}");      
                    }
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        }  
        
        
    } 

  
}
