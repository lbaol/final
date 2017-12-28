package com.lbaol.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.jdbc.SQL;

import com.lbaol.dataobject.StockDO;

public interface StockMapper {
	
	@Select("SELECT * FROM stock")
    @Results()
    List<StockDO> getAll();
	
	@Select("SELECT * FROM stock  WHERE code = #{code}")
    @Results()
    StockDO getByCode(@Param("code") String code);
	
	
	@Insert("INSERT INTO stock(code,name,timeToMarket) VALUES(#{code}, #{name}, #{timeToMarket})")
	@Options(useGeneratedKeys=true, keyProperty="id")
	void insert(StockDO stockDO);
	
	@UpdateProvider(type = EventProvider.class,  
            method = "update")  
			int update(StockDO stockDO);  
    
    class EventProvider {  
       
        
        public String update(StockDO stockDO) {  
        	return new SQL()  
            {  
                {  
                    UPDATE("stock");  
                    if (stockDO.getName() != null)  
                    {  
                        SET("name = #{name}");  
                    }  
                    if (stockDO.getTimeToMarket() != null)  
                    {  
                        SET("timeToMarket = #{timeToMarket}");  
                    } 
                    WHERE("id = #{id}");  
                }  
            } .toString();  
        }  
    } 
}
