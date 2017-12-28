package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.EventDO;
import com.lbaol.dataobject.ForecastDO;
import com.lbaol.dataobject.ReportDO;
import com.lbaol.dataobject.StockDO;
import com.lbaol.mapper.ConvertMapper;
import com.lbaol.mapper.EventMapper;
import com.lbaol.mapper.StockMapper;
import com.lbaol.web.control.common.RpcResult;

@RestController
public class ConvertControl {
	
	@Autowired
    private ConvertMapper convertMapper;
	
	
	@Autowired
    private EventMapper eventMapper;
	
	
	@Autowired
    private StockMapper stockMapper;
	
	
	/**
     * 从外部导入的数据没有年份，从年份表中取出合并到report表
     * @throws Exception
     */
    private EventDO convertReportToEvent(ReportDO reportDO,Integer year , Integer quarter) {
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
    
    private EventDO convertForecastToEvent(ForecastDO forecastDO,Integer year , Integer quarter) {
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
    
    private boolean checkEventAndReportNeedUpdate(EventDO eventDO,ReportDO report) {
    	if(StringUtils.equals(eventDO.getEventDate(),report.getReportDate()) &&
    			ObjectUtils.compare(eventDO.getProfitsYoy(), report.getProfitsYoy()) == 0 && 
    					ObjectUtils.compare(eventDO.getNetProfits(), report.getNetProfits())==0) {
    		return false;
    	}
    	return true;
    }
    
    private boolean checkEventAndForecastNeedUpdate(EventDO eventDO,ForecastDO forecastDO) {
    	if(StringUtils.equals(eventDO.getEventDate(),forecastDO.getReportDate()) &&
    			ObjectUtils.compare(eventDO.getRanges(), forecastDO.getRange()) == 0 ) {
    		return false;
    	}
    	return true;
    }
    
    
    private boolean checkStockNeedUpdate(StockDO stock1,StockDO stock2) {
    	if(StringUtils.equals(stock1.getTimeToMarket(),stock2.getTimeToMarket())  ) {
    		return false;
    	}
    	return true;
    }
    
    public void convertReportService(Integer year,Integer quarter) {
    	RpcResult result = new RpcResult();
        List<ReportDO> reportYearList = convertMapper.getReportByYearAndQuarter(year,quarter);
        for(ReportDO reportDO : reportYearList) {
        	reportDO.setReportDate(year+"-"+reportDO.getReportDate());
        	
        	Map params = new HashMap();
        	params.put("code", reportDO.getCode());
        	params.put("eventDate", reportDO.getReportDate());
        	params.put("type", "report");
        	List<EventDO> eventListDB = eventMapper.getByParams(params);
        	
        	if(eventListDB != null && eventListDB.size()>=1) {

        		if(eventListDB.size()>1) {
            		System.out.println("找到 "+reportDO.getCode()+ " "+reportDO.getName()+  " "+reportDO.getReportDate()+" "+eventListDB.size()+"条，准备删除后，重新插入");

        			for(EventDO eventDB : eventListDB) {
        				eventMapper.deleteById(eventDB.getId());
            		}
        			EventDO eventDO = convertReportToEvent(reportDO,year,quarter);
            		eventMapper.insert(eventDO);
        		}else if(eventListDB.size() == 1) {
            		
            		if(checkEventAndReportNeedUpdate(eventListDB.get(0),reportDO) == true) {
                		System.out.println("找到 "+reportDO.getCode()+ " "+reportDO.getName()+  " "+reportDO.getReportDate()+" "+eventListDB.size()+"条，准备更新");

            			EventDO eventDO = convertReportToEvent(reportDO,year,quarter);
                		eventDO.setId(eventListDB.get(0).getId());
                		eventMapper.update(eventDO);
            		}
            		
        		}
        	}else {
        		EventDO eventDO = convertReportToEvent(reportDO,year,quarter);
        		eventMapper.insert(eventDO);
        	}
        }
    }
    
    
    public void convertForecastService(Integer year,Integer quarter)  {
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
        			EventDO eventDO = convertForecastToEvent(forecastDO,year,quarter);
        			eventMapper.insert(eventDO);
        		}else if(eventListDB.size() == 1) {
                	if(checkEventAndForecastNeedUpdate(eventListDB.get(0),forecastDO) == true) {
                    	System.out.println("找到  "+forecastDO.getCode()+ " "+forecastDO.getName()+ " "+forecastDO.getReportDate()+" "+eventListDB.size()+"条，准备更新");

                		EventDO eventDO = convertForecastToEvent(forecastDO,year,quarter);
                		eventDO.setId(eventListDB.get(0).getId());
                		eventMapper.update(eventDO);
                	}
                	
        		}
        		
        	}else {
            	EventDO eventDO = convertForecastToEvent(forecastDO,year,quarter);
            	eventMapper.insert(eventDO);
        	}
        }
    }
    
    public void convertBasicService() {
    	List<StockDO> tempStockList = convertMapper.getAllTempStocks();
    	for(StockDO stock1 : tempStockList) {
    		StockDO stock2 = stockMapper.getByCode(stock1.getCode());
    		if(stock2 == null) {
    			stockMapper.insert(stock1);
    		}else if(checkStockNeedUpdate(stock1,stock2) == true) {
    			stock1.setId(stock2.getId());
    			stockMapper.update(stock1);
    		}
    		
    	}
    }
    
    @RequestMapping("/convert/report")
	RpcResult convertReport(String reportType,Integer year,Integer quarter) { 
		RpcResult result = new RpcResult();
		if("report".equals(reportType)) {
			convertReportService(year,quarter);
		}
		if("forecast".equals(reportType)) {
			convertForecastService(year,quarter);
		}
		result.setIsSuccess(true);
		return result;
    }
    
    
    @RequestMapping("/convert/basic")
	RpcResult convertBasic() { 
		RpcResult result = new RpcResult();
		convertBasicService();
		result.setIsSuccess(true);
		return result;
    }
    
    @RequestMapping("/convert/test")
	RpcResult convertTest() { 
		RpcResult result = new RpcResult();
		result.setIsSuccess(true);
		return result;
    }
    
    
    
}