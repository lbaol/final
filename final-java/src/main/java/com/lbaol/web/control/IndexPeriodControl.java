package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.AlertDO;
import com.lbaol.dataobject.IndexPeriodDO;
import com.lbaol.mapper.IndexPeriodMapper;
import com.lbaol.web.control.common.RpcResult;





@RestController
public class IndexPeriodControl {
	
	@Autowired
	private IndexPeriodMapper indexPeriodMapper;
	
	@RequestMapping("/indexPeriod/getLast")
	RpcResult addOrUpdate(String code,String type,Integer count,String date,String time,Double alertPrice,Double timePrice) { 
		RpcResult rpcResult = new RpcResult();
		
		IndexPeriodDO indexPeriodDO = indexPeriodMapper.getLast();
		
		rpcResult.setData(indexPeriodDO);
		
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
	@RequestMapping("/indexPeriod/getAll")
	Map getByParams(String code,String startDate,String date) { 
		Map params = new HashMap();
		List<IndexPeriodDO> indexPeriodList = indexPeriodMapper.getByParams(params);
		Map resultMap = new HashMap();
		resultMap.put("list", indexPeriodList);
		return resultMap;
    }
	
	@RequestMapping("/indexPeriod/save")
	RpcResult save(Integer id,String code,String market,String startDate,String endDate) { 
		IndexPeriodDO indexPeriodDO = new IndexPeriodDO();
		indexPeriodDO.setCode(code);
		indexPeriodDO.setMarket(market);
		indexPeriodDO.setStartDate(startDate);
		indexPeriodDO.setEndDate(endDate);
		if(StringUtils.isNotEmpty(market) && StringUtils.isNotEmpty(code)) {
			indexPeriodDO.setFullCode(market+code);
		}
		
		if(id !=null) {
			indexPeriodDO.setId(id);
			indexPeriodMapper.update(indexPeriodDO);
		}else {
			indexPeriodMapper.insert(indexPeriodDO);
		}
		
		RpcResult rpcResult = new RpcResult();
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
    
}