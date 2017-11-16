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
//        List<ReportDO> reportYearList = convertMapper.getReportByYear(year);
//        for(ReportDO r1 : reportYearList) {
//        	List<ReportDO> listDB = reportMapper.getByCodeAndReportDate(r1.getCode(),year +"-"+r1.getReportDate());
//        	if(listDB != null && listDB.size()>=1) {
////        		System.out.println("找到 "+r1.getCode()+ " "+year +"-"+r1.getReportDate()+" "+listDB.size()+"条，准备删除");
//        		for(ReportDO rDB : listDB) {
//        			reportMapper.deleteById(rDB.getId());
//        		}
//        		r1.setReportDate(year+"-"+r1.getReportDate());
//        		reportMapper.insert(r1);
//        	}else {
//        		r1.setReportDate(year+"-"+r1.getReportDate());
//        		reportMapper.insert(r1);
//        	}
//        }
//    }
    
    
    @Test
    public void convertForecast() throws Exception {
        List<ForecastDO> list = convertMapper.getForecast();
        for(ForecastDO ff : list) {
        	List<ForecastDO> listDB = forecastMapper.getByCodeAndReportDate(ff.getCode(),ff.getReportDate());
        	if(listDB != null && listDB.size()>=1) {
        		for(ForecastDO rDB : listDB) {
        			forecastMapper.deleteById(rDB.getId());
        		}
        		ff.setRanges(ff.getRange());
        		forecastMapper.insert(ff);
        	}else {
        		ff.setRanges(ff.getRange());
        		forecastMapper.insert(ff);
        	}
        }
    }
    
    

    
}
