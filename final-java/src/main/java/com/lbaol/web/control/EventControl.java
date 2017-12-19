package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.EventDO;
import com.lbaol.mapper.EventMapper;

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
	
    
    
}