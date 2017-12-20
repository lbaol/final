package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.EventDO;
import com.lbaol.mapper.EventMapper;
import com.lbaol.web.control.common.RpcResult;

@RestController
public class EventControl {
	
	@Autowired
	private EventMapper eventMapper;
	
	@RequestMapping("/event/getAll")
    Map getAll() {  
		Map map = new HashMap();
		List<EventDO>  eventList =  eventMapper.getAll();
		map.put("eventList", eventList);
        return map;  
    }
	
	@RequestMapping("/event/save")
	RpcResult save(String code,String eventDate,String type) { 
		RpcResult result = new RpcResult();
		EventDO eventDO = new EventDO();
		eventDO.setCode(code);
		eventDO.setEventDate(eventDate);
		eventDO.setType(type);
		eventMapper.insert(eventDO);
		result.setIsSuccess(true);
		return result;
    }
	
	@RequestMapping("/event/deleteById")
	RpcResult deleteById(Integer id) { 
		RpcResult result = new RpcResult();
		eventMapper.deleteById(id);
		result.setIsSuccess(true);
		return result;
    }
    
}