package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.RecordDO;
import com.lbaol.dataobject.RecordGroupDO;
import com.lbaol.mapper.RecordGroupMapper;
import com.lbaol.mapper.RecordMapper;
import com.lbaol.web.control.common.RpcResult;





@RestController
public class RecordGroupControl {
	
	@Autowired
	private RecordMapper recordMapper;
	
	@Autowired
	private RecordGroupMapper recordGroupMapper;
	
	
	@RequestMapping("/recordGroup/save")
	RpcResult addOrUpdate(Integer id,String code,Double count,Double cost,String startDate,String endDate,String status) { 
		RpcResult rpcResult = new RpcResult();
		
		RecordGroupDO recordGroupDO = new RecordGroupDO();
		if(count!=null && count >= 0) {
			recordGroupDO.setCount(count);
		}
		if(StringUtils.isNotEmpty(code)) {
			recordGroupDO.setCode(code);
		}
		if(cost!=null && cost >= 0) {
			recordGroupDO.setCost(cost);
		}
		if(StringUtils.isNotEmpty(startDate)) {
			recordGroupDO.setStartDate(startDate);
		}
		if(StringUtils.isNotEmpty(endDate)) {
			recordGroupDO.setEndDate(endDate);
		}
		if(StringUtils.isNotEmpty(status)) {
			recordGroupDO.setStatus(status);
		}
		if(id != null && id >0) {
			recordGroupDO.setId(id);
			recordGroupMapper.update(recordGroupDO);
		}else {
			recordGroupMapper.insert(recordGroupDO);
		}
		
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
	@RequestMapping("/recordGroup/getById")
	RecordGroupDO getById(Integer id) {  
		RecordGroupDO recordGroupDO = recordGroupMapper.getById(id);
		return recordGroupDO;
    }
	
	@RequestMapping("/recordGroup/getList")
    Map getList(@RequestParam(value="isGetRecord",required = false,defaultValue  = "false") Boolean isGetRecord) {  
		Map map = new HashMap();
		List<RecordGroupDO>  recordGroupList =  recordGroupMapper.getAll();
		map.put("list", recordGroupList);
        return map;  
    }
	
	@RequestMapping("/recordGroup/deleteById")
	RpcResult deleteById(Integer id) {  
		RpcResult rpcResult = new RpcResult();
		List<RecordDO> recordList = recordMapper.getByGroupId(id);
		if(recordList.size() > 0) {
			rpcResult.setIsSuccess(false);
	        return rpcResult;  
		}
		recordGroupMapper.deleteById(id);
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	@RequestMapping("/recordGroup/getPositionList")
    Map getPositionList() {  
		Map map = new HashMap();
		List<RecordGroupDO>  recordGroupList =  recordGroupMapper.getAllPosition();
		for(RecordGroupDO recordGroupDO : recordGroupList) {
			List<RecordDO> recordList = recordMapper.getByGroupId(recordGroupDO.getId());
			recordGroupDO.setRecordList(recordList);
		}
		map.put("list", recordGroupList);
        return map;  
    }
	
	
	
	
	
    
}