package com.lbaol.test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.lbaol.dataobject.EventDO;
import com.lbaol.dataobject.ForecastDO;
import com.lbaol.dataobject.ReportDO;
import com.lbaol.mapper.ConvertMapper;
import com.lbaol.mapper.EventMapper;
import com.lbaol.mapper.ForecastMapper;
import com.lbaol.mapper.ReportMapper;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ConverterTest {

    @Autowired
    private ConvertMapper convertMapper;
    
    @Autowired
    private ReportMapper reportMapper;
    
    @Autowired
    private ForecastMapper forecastMapper;
    
    @Autowired
    private EventMapper eventMapper;
    
    private Integer year = 2017;
	private Integer quarter = 4;

    /**
     * 从外部导入的数据没有年份，从年份表中取出合并到report表
     * @throws Exception
     */
    private EventDO convertReportToEvent(ReportDO reportDO) {
    	EventDO eventDO = new EventDO();
		eventDO.setCode(reportDO.getCode());
		eventDO.setType("report");
		eventDO.setName(reportDO.getName());
		eventDO.setProfitsYoy(reportDO.getProfitsYoy());
		eventDO.setNetProfits(reportDO.getNetProfits());
		eventDO.setEventDate(reportDO.getReportDate());
		eventDO.setYear(year);
		eventDO.setQuarter(quarter);
		return eventDO;
    }
    
    private EventDO convertForecastToEvent(ForecastDO forecastDO) {
    	EventDO eventDO =new EventDO();
    	eventDO.setCode(forecastDO.getCode());
		eventDO.setType("forecast");
		eventDO.setName(forecastDO.getName());
		eventDO.setRanges(forecastDO.getRange());
		eventDO.setEventDate(forecastDO.getReportDate());
		eventDO.setSubType(forecastDO.getType());
		eventDO.setYear(year);
		eventDO.setQuarter(quarter);
    	return eventDO;
    }
    
//    @Test
//    public void convertReport() throws Exception {
//    	
//        List<ReportDO> reportYearList = convertMapper.getReportByYearAndQuarter(year,quarter);
//        for(ReportDO reportDO : reportYearList) {
//        	reportDO.setReportDate(year+"-"+reportDO.getReportDate());
//        	
//        	Map params = new HashMap();
//        	params.put("code", reportDO.getCode());
//        	params.put("eventDate", reportDO.getReportDate());
//        	params.put("type", "report");
//        	List<EventDO> eventListDB = eventMapper.getByParams(params);
//        	
//        	if(eventListDB != null && eventListDB.size()>=1) {
//
//        		if(eventListDB.size()>1) {
//            		System.out.println("找到 "+reportDO.getCode()+ " "+reportDO.getName()+  " "+reportDO.getReportDate()+" "+eventListDB.size()+"条，准备删除后，重新插入");
//
//        			for(EventDO eventDB : eventListDB) {
//        				eventMapper.deleteById(eventDB.getId());
//            		}
//        			EventDO eventDO = convertReportToEvent(reportDO);
//            		eventMapper.insert(eventDO);
//        		}else if(eventListDB.size() == 1) {
//            		System.out.println("找到 "+reportDO.getCode()+ " "+reportDO.getName()+  " "+reportDO.getReportDate()+" "+eventListDB.size()+"条，准备更新");
//            		EventDO eventDO = convertReportToEvent(reportDO);
//            		eventDO.setId(eventListDB.get(0).getId());
//            		eventMapper.update(eventDO);
//        		}
//        	}else {
//        		EventDO eventDO = convertReportToEvent(reportDO);
//        		eventMapper.insert(eventDO);
//        	}
//        }
//    }
    
    
    
    
    @Test
    public void convertForecast() throws Exception {
        List<ForecastDO> list = convertMapper.getForecastByYearAndQuarter(year, quarter);
        for(ForecastDO forecastDO : list) {

        	Map params = new HashMap();
        	params.put("code", forecastDO.getCode());
        	params.put("eventDate", forecastDO.getReportDate());
        	params.put("type", "forecast");
        	List<EventDO> eventListDB = eventMapper.getByParams(params);
        	if(eventListDB != null && eventListDB.size()>=1) {
        		if(eventListDB.size()>1) {
                	System.out.println("找到  "+forecastDO.getCode()+ " "+forecastDO.getName()+ " "+forecastDO.getReportDate()+" "+eventListDB.size()+"条，准备删除后，重新插入");

        			for(EventDO  eventDO : eventListDB) {
        				eventMapper.deleteById(eventDO.getId());
            		}
        			EventDO eventDO = convertForecastToEvent(forecastDO);
        			eventMapper.insert(eventDO);
        		}else if(eventListDB.size() == 1) {
                	System.out.println("找到  "+forecastDO.getCode()+ " "+forecastDO.getName()+ " "+forecastDO.getReportDate()+" "+eventListDB.size()+"条，准备更新");
                	EventDO eventDO = convertForecastToEvent(forecastDO);
            		eventDO.setId(eventListDB.get(0).getId());
            		eventMapper.update(eventDO);
        		}
        		
        	}else {
            	EventDO eventDO = convertForecastToEvent(forecastDO);
            	eventMapper.insert(eventDO);
        	}
        }
    }
 
    

    
}
