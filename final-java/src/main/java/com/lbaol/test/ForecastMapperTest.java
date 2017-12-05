package com.lbaol.test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.lbaol.dataobject.ForecastDO;
import com.lbaol.mapper.ConvertMapper;
import com.lbaol.mapper.ForecastMapper;
import com.lbaol.mapper.ReportMapper;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ForecastMapperTest {

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
    @Test
    public void test1() throws Exception {
    	Map map = new HashMap();
    	map.put("code","002008");
    	List<ForecastDO> listDB = forecastMapper.getByCodeTypeAndDate(map);
    	for(ForecastDO ff : listDB) {
    		System.out.println(ff.toString());
    	}
    }
    
    

    

    
}
