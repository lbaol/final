package com.lbaol.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.lbaol.web.control.ConvertControl;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ConverterTest {

    @Autowired
    private ConvertControl convertControl;
    
    
    
    private Integer year = 2017;
	private Integer quarter = 1;

    
    
    
    
    
    @Test
    public void convertBasic() throws Exception {
    	convertControl.convertBasicService();
    }
    
//    @Test
//    public void convertReport() throws Exception {
//    	convertControl.convertReport(year, quarter);
//    }
    
    
    
//    @Test
//    public void convertForecast() throws Exception {
//    	convertControl.convertForecast(year, quarter);
//    }
 
    

    
}
