package com.lbaol.test;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.lbaol.dataobject.ForecastDO;
import com.lbaol.dataobject.ReportDO;
import com.lbaol.mapper.ConvertMapper;
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

    /**
     * 从外部导入的数据没有年份，从年份表中取出合并到report表
     * @throws Exception
     */
//    @Test
//    public void convertReport() throws Exception {
//    	String year = "2017";
//    	String quarter = "2";
//        List<ReportDO> reportYearList = convertMapper.getReportByYearAndQuarter(year,quarter);
//        for(ReportDO rr : reportYearList) {
//        	List<ReportDO> listDB = reportMapper.getByCodeAndReportDate(rr.getCode(),year +"-"+rr.getReportDate());
//        	System.out.println("正在处理  "+rr.getCode()+ " "+rr.getName()+ " "+year +"-"+rr.getReportDate());
//        	if(listDB != null && listDB.size()>=1) {
//        		if(listDB.size()>1) {
//            		System.out.println("找到 "+rr.getCode()+ " "+rr.getName()+  " "+year +"-"+rr.getReportDate()+" "+listDB.size()+"条，准备删除");
//        			for(ReportDO rDB : listDB) {
//            			reportMapper.deleteById(rDB.getId());
//            		}
//            		rr.setReportDate(year+"-"+rr.getReportDate());
//            		reportMapper.insert(rr);
//        		}
//        		
//        	}else {
//        		
//        		rr.setReportDate(year+"-"+rr.getReportDate());
//        		reportMapper.insert(rr);
//        	}
//        }
//    }
//    
    
    @Test
    public void convertForecast() throws Exception {
    	String year = "2017";
    	String quarter = "1";
        List<ForecastDO> list = convertMapper.getForecastByYearAndQuarter(year, quarter);
        for(ForecastDO ff : list) {
        	List<ForecastDO> listDB = forecastMapper.getByCodeAndReportDate(ff.getCode(),ff.getReportDate());
        	System.out.println("正在处理  "+ff.getCode()+ " "+ff.getName()+ " "+year +"-"+ff.getReportDate());
        	if(listDB != null && listDB.size()>=1) {
        		if(listDB.size()>1) {
        			for(ForecastDO rDB : listDB) {
            			forecastMapper.deleteById(rDB.getId());
            		}
            		ff.setRanges(ff.getRange());
            		forecastMapper.insert(ff);
        		}
        		
        	}else {
        		ff.setRanges(ff.getRange());
        		forecastMapper.insert(ff);
        	}
        }
    }
 
    

    
}
