package com.lbaol.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import com.lbaol.dataobject.StockDO;

public interface StockMapper {
	
	@Select("SELECT * FROM stock")
    @Results()
    List<StockDO> getAll();
	
	@Select("SELECT * FROM stock  WHERE code = #{code}")
    @Results()
    StockDO getByCode(@Param("code") String code);


}
