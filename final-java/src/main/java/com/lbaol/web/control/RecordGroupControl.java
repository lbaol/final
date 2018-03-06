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
	RpcResult addOrUpdate(Integer id,
				String code,
				Double count,
				Double price,
				String startDate,
				String endDate,
				String status,
				String market,
				String type,
				String direction) { 
		RpcResult rpcResult = new RpcResult();
		
		RecordGroupDO recordGroupDO = new RecordGroupDO();
		if(count!=null && count >= 0) {
			recordGroupDO.setCount(count);
		}
		if(StringUtils.isNotEmpty(code)) {
			recordGroupDO.setCode(code);
		}
		if(price!=null && price >= 0) {
			recordGroupDO.setPrice(price);
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
		if(StringUtils.isNotEmpty(market)) {
			recordGroupDO.setMarket(market);
		}
		if(StringUtils.isNotEmpty(type)) {
			recordGroupDO.setType(type);
		}
		if(StringUtils.isNotEmpty(direction)) {
			recordGroupDO.setDirection(direction);
		}
		if(id != null && id >0) {
			recordGroupDO.setId(id);
			recordGroupMapper.update(recordGroupDO);
		}else {
			recordGroupMapper.insert(recordGroupDO);
			//如果是股票，同时插入一条买入记录
			Integer groupId = recordGroupDO.getId();
			if(groupId>0) {
				RecordDO recordDO = new RecordDO();
				recordDO.setGroupId(groupId);
				recordDO.setOper("buy");
				if(count!=null && count >= 0) {
					recordDO.setCount(count);
					recordDO.setRemaining(count);
				}
				if(StringUtils.isNotEmpty(code)) {
					recordDO.setCode(code);
				}
				if(price!=null && price >= 0) {
					recordDO.setPrice(price);
				}
				if(StringUtils.isNotEmpty(startDate)) {
					recordDO.setDate(startDate);
				}
				if(StringUtils.isNotEmpty(market)) {
					recordDO.setMarket(market);
				}	
				if(StringUtils.isNotEmpty(type)) {
					recordDO.setType(type);
				}
				recordMapper.insert(recordDO);
			}
			
			
			
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
    Map getList(@RequestParam(value="isGetRecord",required = false,defaultValue  = "false") Boolean isGetRecord,
    		String type) {  
		Map map = new HashMap();
		Map params = new HashMap();
		params.put("type", type);
		List<RecordGroupDO>  recordGroupList =  recordGroupMapper.getByParams(params);
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
	
	@RequestMapping("/recordGroup/getPositionByMarketAndType")
    Map getPositionList(String market,String type) {  
		Map map = new HashMap();
		if(market == null) {
			market = "";
		}
		if(type == null) {
			type = "";
		}
		List<RecordGroupDO>  recordGroupList =  recordGroupMapper.getPositionByMarketAndType(market,type);
		for(RecordGroupDO recordGroupDO : recordGroupList) {
			List<RecordDO> recordList = getOpenRecordList(recordGroupDO.getId(),recordGroupDO.getType());
			recordGroupDO.setRecordList(recordList);
		}
		map.put("list", recordGroupList);
        return map;  
    }
	
	@RequestMapping("/recordGroup/getAllPosition")
    Map getAllPosition() {  
		Map map = new HashMap();
		List<RecordGroupDO>  recordGroupList =  recordGroupMapper.getAllPosition();
		for(RecordGroupDO recordGroupDO : recordGroupList) {
			List<RecordDO> recordList = getOpenRecordList(recordGroupDO.getId(),recordGroupDO.getType());
			recordGroupDO.setRecordList(recordList);
		}
		map.put("list", recordGroupList);
        return map;  
    }
	
	private List<RecordDO> getOpenRecordList(Integer groupId,String type) {
		Map params1 = new HashMap();
		params1.put("groupId", groupId);
		if("stock".equals(type)) {
			params1.put("oper", "buy");
		}
		if("futures".equals(type)) {
			params1.put("subOper", "open");
		}
		List<RecordDO> openRecordList = recordMapper.getByParams(params1);
		for(RecordDO openRecord : openRecordList) {
			Map params2 = new HashMap();
			params2.put("openId", openRecord.getId());
			List<RecordDO> closeRecordList = recordMapper.getByParams(params2);
			openRecord.setCloseRecordList(closeRecordList);
		}
		
		return openRecordList;
		
	}
	
	
	
	
	
    
}