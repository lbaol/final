package com.lbaol.test;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.lbaol.dataobject.ReportDO;
import com.lbaol.mapper.ReportMapper;
import com.lbaol.mapper.ReportYearMapper;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ReportYearMapperTest {

    @Autowired
    private ReportYearMapper reportYearMapper;
    
    @Autowired
    private ReportMapper reportMapper;

    @Test
    public void testQuery() throws Exception {
        List<ReportDO> reportYearList = reportYearMapper.getAll("2017");
        for(ReportDO r1 : reportYearList) {
        	List<ReportDO> listDB = reportMapper.getByCodeAndReportDate(r1.getCode(), "2017-"+r1.getReportDate());
        	if(listDB != null && listDB.size()>=1) {
        		for(ReportDO rDB : listDB) {
        			reportMapper.deleteById(rDB.getId());
        		}
        		r1.setReportDate("2017-"+r1.getReportDate());
        		reportMapper.insert(r1);
        	}else {
        		r1.setReportDate("2017-"+r1.getReportDate());
        		reportMapper.insert(r1);
        		
        	}
        }
    }
    
    

    
}
