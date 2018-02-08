package com.lbaol.web.control;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.lbaol.dataobject.FavDO;
import com.lbaol.dataobject.PosDO;
import com.lbaol.mapper.PosMapper;
import com.lbaol.web.control.common.RpcResult;





@RestController
public class PosControl {
	
	@Autowired
	private PosMapper posMapper;
	
	
	
	@RequestMapping("/pos/getAll")
    Map getByParam(String code,String type) {  
		Map map = new HashMap();
		List<PosDO>  posList =  posMapper.getAll();
		map.put("posList", posList);
        return map;  
    }
	
	
	@RequestMapping("/pos/getById")
	PosDO getById(Integer id) {  
		PosDO posDO = posMapper.getById(id);
		return posDO;
    }
	
	
	
	@RequestMapping("/pos/save")
	RpcResult updateById(Integer id,String date,Double number,Double cost,String code) {  
		RpcResult rpcResult = new RpcResult();
		PosDO posDO = new PosDO();
		if(number!=null && number >= 0) {
			posDO.setNumber(number);
		}
		if(cost!=null && cost >= 0) {
			posDO.setCost(cost);
		}
		if(StringUtils.isNotEmpty(date)) {
			posDO.setDate(date);
		}
		if(StringUtils.isNotEmpty(code)) {
			posDO.setCode(code);
		}
		if(id != null && id >0) {
			posDO.setId(id);
			posMapper.update(posDO);
		}else {
			posMapper.insert(posDO);
		}
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
	
	
	
	@RequestMapping("/pos/deleteById")
	RpcResult deleteById(Integer id) {  
		RpcResult rpcResult = new RpcResult();
		posMapper.deleteById(id);
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
	
    
}