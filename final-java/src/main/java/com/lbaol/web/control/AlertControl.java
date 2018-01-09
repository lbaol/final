package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.AlertDO;
import com.lbaol.dataobject.NoteDO;
import com.lbaol.mapper.AlertMapper;
import com.lbaol.web.control.common.RpcResult;





@RestController
public class AlertControl {
	
	@Autowired
	private AlertMapper alertMapper;
	
	
	 
	
	 
	
	
	@RequestMapping("/alert/addOrUpdate")
	RpcResult addOrUpdate(String code,String type,Integer count,String date,String time,Double alertPrice,Double timePrice) { 
		RpcResult rpcResult = new RpcResult();
		Map params = new HashMap();
		params.put("code", code);
		params.put("type", type);
		params.put("count", count);
		params.put("date", date);
		List<AlertDO> monitorList = alertMapper.getByParams(params);
		
		Map params2 = new HashMap();
		params2.put("code", code);
		params2.put("type", type);
		params2.put("count", count);
		params2.put("time", time);
		params2.put("timePrice", timePrice);
		List<AlertDO> monitorList2 = alertMapper.getByParams(params2);
		
		if(monitorList2.size()<1) {
			if(monitorList.size() == 1) {
				AlertDO monitorDO = monitorList.get(0);
				monitorDO.setTime(time);
				monitorDO.setAlertPrice(alertPrice);
				monitorDO.setTimePrice(timePrice);
				alertMapper.update(monitorDO);
			}else{
				alertMapper.deleteByParams(params);
				AlertDO monitorDO = new AlertDO();
				monitorDO.setCode(code);
				monitorDO.setType(type);
				monitorDO.setCount(count);
				monitorDO.setDate(date);
				monitorDO.setTime(time);
				monitorDO.setAlertPrice(alertPrice);
				monitorDO.setTimePrice(timePrice);
				alertMapper.insert(monitorDO);
			}
		}
		
		
		
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
	
	@RequestMapping("/alert/getByParams")
	Map getByParams(String code,String startDate,String date) { 
		Map params = new HashMap();
		params.put("code", code);
		params.put("date", date);
		params.put("startDate", startDate);
		List<AlertDO> monitorList = alertMapper.getByParams(params);
		
		
		Map resultMap = new HashMap();
		resultMap.put("monitorList", monitorList);
		return resultMap;
		 
    }
	
	
    
}