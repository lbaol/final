package com.lbaol.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.ReportDO;
import com.lbaol.mapper.ReportMapper;

@RestController
public class ReportControl {
	
	@Autowired
	private ReportMapper reportMapper;
	
	@RequestMapping("/report/getAll")
	public List<ReportDO> getAll() {
		List<ReportDO> list = reportMapper.getAll();
		return list;
	}
	
    
    
}