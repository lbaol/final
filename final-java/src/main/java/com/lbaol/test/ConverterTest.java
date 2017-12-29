package com.lbaol.test;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.lbaol.dataobject.KDataDO;
import com.lbaol.mapper.KDataMapper;
import com.lbaol.web.control.ConvertControl;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ConverterTest {

    @Autowired
    private ConvertControl convertControl;
    
    @Autowired
    private KDataMapper KDataMapper;
    
    private SimpleDateFormat formatter =  new SimpleDateFormat ("yyyy-MM-dd"); ; 
    
    private Integer year = 2017;
	private Integer quarter = 1;

	@Test
	public void processRise() throws Exception {
		processRiseByDayCount(250);
		
	}
	
	private int findInsertIndex(List<KDataDO> kDataList,String date) {
		
		for(int i = 0 ; i < kDataList.size()-1;i++) {
			if(kDataList.get(i).getDate().compareTo(date)>0 &&
					date.compareTo(kDataList.get(i+1).getDate())>=0 ){
				return i+1;
			}
		}
		return -1;
	}
    
  
    
    private void processRiseByDayCount(Integer dayCount) throws Exception {
    	List<KDataDO> kDataList = KDataMapper.getByCodeOrderByDateDesc("600153");
  
    	for (int i =0;i<50;i++) { 
    		
    		String curDateString = kDataList.get(i).getDate();
    		Date curDate = formatter.parse(curDateString);
    		Calendar cal = Calendar.getInstance(); 
    		cal.setTime(curDate);
    		cal.add(Calendar.YEAR, -1);
    		String dateString = formatter.format(cal.getTime());
    		System.out.println(dateString);
    		Integer index = findInsertIndex(kDataList,dateString);
    		System.out.println(index);
    		System.out.println(kDataList.get(index).getDate());
    		System.out.println(kDataList.get(index+1).getDate());
	   } 
    }
    
    
//    @Test
//    public void convertBasic() throws Exception {
//    	convertControl.convertBasicService();
//    }
    
//    @Test
//    public void convertReport() throws Exception {
//    	convertControl.convertReport(year, quarter);
//    }
    
    
    
//    @Test
//    public void convertForecast() throws Exception {
//    	convertControl.convertForecast(year, quarter);
//    }
 
    

    
}
