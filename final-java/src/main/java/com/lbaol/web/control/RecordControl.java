package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.common.NumberUtil;
import com.lbaol.dataobject.RecordDO;
import com.lbaol.dataobject.RecordGroupDO;
import com.lbaol.mapper.RecordGroupMapper;
import com.lbaol.mapper.RecordMapper;
import com.lbaol.web.control.common.RpcResult;





@RestController
public class RecordControl {
	
	@Autowired
	private RecordMapper recordMapper;
	
	@Autowired
	private RecordGroupMapper recordGroupMapper;
	
	
	@RequestMapping("/record/save")
	RpcResult addOrUpdate(Integer id,String code,Double count,Double price,String date,Integer groupId) { 
		RpcResult rpcResult = new RpcResult();
		
		RecordDO recordDO = new RecordDO();
		if(count!=null && count >= 0) {
			recordDO.setCount(count);
		}
		if(price!=null && price >= 0) {
			recordDO.setPrice(price);
		}
		if(groupId!=null && groupId >= 0) {
			recordDO.setGroupId(groupId);
		}
		if(StringUtils.isNotEmpty(code)) {
			recordDO.setCode(code);
		}
	
		if(StringUtils.isNotEmpty(date)) {
			recordDO.setDate(date);
		}

		
		if(id != null && id >0) {
			recordDO.setId(id);
			recordMapper.update(recordDO);
		}else {
			recordMapper.insert(recordDO);
		}
		
		updateRecordGroupCountAndCost(groupId);
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
	@RequestMapping("/record/getById")
	RecordDO getById(Integer id) {  
		RecordDO recordDO = recordMapper.getById(id);
		return recordDO;
    }
	
	@RequestMapping("/record/getByGroupId")
    Map getByGroupId(Integer groupId) {  
		Map map = new HashMap();
		List<RecordDO>  recordList =  recordMapper.getByGroupId(groupId);
		map.put("list", recordList);
        return map;  
    }
	
	private void updateRecordGroupCountAndCost(Integer groupId) {
		RecordGroupDO recordGroupDO =  recordGroupMapper.getById(groupId);
		List<RecordDO> recordList = recordMapper.getByGroupId(groupId);
		Double totalCount = 0d ;
		Double totalValue = 0d ;
		for(RecordDO record : recordList) {
			totalCount = NumberUtil.add(record.getCount(), totalCount);
			Double value = NumberUtil.mul(record.getPrice(), record.getCount());
			totalValue = NumberUtil.add(value, totalValue);
		}
		Double cost = NumberUtil.round(NumberUtil.div(totalValue, totalCount));
		recordGroupDO.setCount(totalCount);
		recordGroupDO.setCost(cost);
		recordGroupMapper.update(recordGroupDO);
	}
	
	
	
	
    
}