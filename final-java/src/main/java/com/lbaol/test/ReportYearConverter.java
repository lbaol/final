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
public class ReportYearConverter {

    @Autowired
    private ReportYearMapper reportYearMapper;
    
    @Autowired
    private ReportMapper reportMapper;

    /**
     * 从外部导入的数据没有年份，从年份表中取出合并到report表
     * @throws Exception
     */
    @Test
    public void getYearDataToReport() throws Exception {
    	String year = "2017";
        List<ReportDO> reportYearList = reportYearMapper.getAll(year);
        for(ReportDO r1 : reportYearList) {
        	List<ReportDO> listDB = reportMapper.getByCodeAndReportDate(r1.getCode(),year +"-"+r1.getReportDate());
        	if(listDB != null && listDB.size()>=1) {
//        		System.out.println("找到 "+r1.getCode()+ " "+year +"-"+r1.getReportDate()+" "+listDB.size()+"条，准备删除");
        		for(ReportDO rDB : listDB) {
        			reportMapper.deleteById(rDB.getId());
        		}
        		r1.setReportDate(year+"-"+r1.getReportDate());
        		reportMapper.insert(r1);
        	}else {
        		r1.setReportDate(year+"-"+r1.getReportDate());
        		reportMapper.insert(r1);
        	}
        }
    }
    
    

    
}
