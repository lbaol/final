package com.lbaol.web.control;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.ForecastDO;
import com.lbaol.mapper.ForecastMapper;

@RestController
public class ForecastControl {
	
	@Autowired
	private ForecastMapper forecastMapper;
	
	@RequestMapping("/forecast/getAll")
	public List<ForecastDO> getAll() {
		List<ForecastDO> list = forecastMapper.getAll();
		return list;
	}
	
    
    
}