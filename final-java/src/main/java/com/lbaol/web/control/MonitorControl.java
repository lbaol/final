package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.MonitorDO;
import com.lbaol.dataobject.NoteDO;
import com.lbaol.mapper.MonitorMapper;
import com.lbaol.web.control.common.RpcResult;





@RestController
public class MonitorControl {
	
	@Autowired
	private MonitorMapper monitorMapper;
	
	
	 
	
	 
	
	
	@RequestMapping("/monitor/addOrUpdate")
	RpcResult getByCode(String code,String type,Integer count,String date,String time,Double alertPrice,Double timePrice) { 
		RpcResult rpcResult = new RpcResult();
		Map params = new HashMap();
		params.put("code", code);
		params.put("type", type);
		params.put("count", count);
		params.put("date", date);
		List<MonitorDO> monitorList = monitorMapper.getByParams(params);
		if(monitorList.size() == 1) {
			MonitorDO monitorDO = monitorList.get(0);
			monitorDO.setTime(time);
			monitorDO.setAlertPrice(alertPrice);
			monitorDO.setTimePrice(timePrice);
		}else{
			monitorMapper.deleteByParams(params);
			MonitorDO monitorDO = new MonitorDO();
			monitorDO.setCode(code);
			monitorDO.setType(type);
			monitorDO.setCount(count);
			monitorDO.setDate(date);
			monitorDO.setTime(time);
			monitorDO.setAlertPrice(alertPrice);
			monitorDO.setTimePrice(timePrice);
			monitorMapper.insert(monitorDO);
		}
		
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
	
	
	
	
    
}