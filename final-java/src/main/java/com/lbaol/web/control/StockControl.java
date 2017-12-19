package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.EventDO;
import com.lbaol.dataobject.ForecastDO;
import com.lbaol.dataobject.ReportDO;
import com.lbaol.dataobject.StockDO;
import com.lbaol.mapper.EventMapper;
import com.lbaol.mapper.ForecastMapper;
import com.lbaol.mapper.ReportMapper;
import com.lbaol.mapper.StockMapper;

@RestController  
@EnableAutoConfiguration  
public class StockControl {
	
	@Autowired
	private ReportMapper reportMapper;
	
	@Autowired
	private ForecastMapper forecastMapper;
	
	@Autowired
	private StockMapper stockMapper;
	
	@Autowired
	private EventMapper eventMapper;
	
	@RequestMapping("/")  
    String home() {  
        return "Hello Final!";  
    } 
	
	@RequestMapping("/stock/getByCode")
    Map getByCode(String code) {  
		Map map = new HashMap();
		StockDO stockDO = stockMapper.getByCode(code);
		Map params = new HashMap();
		params.put("code", code);
		List<EventDO> eventList = eventMapper.getByParams(params);
		map.put("baisc", stockDO);
		map.put("eventList",eventList);
        return map;  
    }
	
//	
//	@RequestMapping("/stock/getAllEvents")
//    Map getAllEvents() {  
//		Map map = new HashMap();
//		List<EventDO>  eventList =  eventMapper.getAll();
//		map.put("eventList", eventList);
//        return map;  
//    }
	
	@RequestMapping("/stock/getAll")
    List<StockDO> getAll() {  
        return stockMapper.getAll();
    }
}
