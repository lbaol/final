package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	RpcResult addOrUpdate(Integer id,String code,Double count,Double price,String date,Integer groupId,String oper,String subOper,
			@RequestParam(value="fee",required = false,defaultValue  = "0") Double fee,String market,String type,
			Integer openId,
			Double returnsPrice) { 
		RpcResult rpcResult = new RpcResult();
		
		RecordDO recordDO = new RecordDO();
		if(count!=null && count >= 0) {
			recordDO.setCount(count);
		}
		if(price!=null && price >= 0) {
			recordDO.setPrice(price);
		}
		if(fee!=null && fee >= 0) {
			recordDO.setFee(fee);
		}
		if(returnsPrice!=null && returnsPrice >= 0) {
			recordDO.setReturnsPrice(returnsPrice);
		}
		if(groupId!=null && groupId >= 0) {
			recordDO.setGroupId(groupId);
		}
		if(openId!=null) {
			recordDO.setOpenId(openId);
		}
		
		if(StringUtils.isNotEmpty(code)) {
			recordDO.setCode(code);
		}
		if(StringUtils.isNotEmpty(oper)) {
			recordDO.setOper(oper);
		}
		if(StringUtils.isNotEmpty(subOper)) {
			recordDO.setSubOper(subOper);
		}
	
		if(StringUtils.isNotEmpty(date)) {
			recordDO.setDate(date);
		}
		if(StringUtils.isNotEmpty(market)) {
			recordDO.setMarket(market);
		}
		if(StringUtils.isNotEmpty(type)) {
			recordDO.setType(type);
		}
		
		if(id != null && id >0) {
			recordDO.setId(id);
			recordMapper.update(recordDO);
			if(isOpenRecord(recordDO)) {
				updateOpenRecordRemainingAndRetruns(id);
			}
			if(isCloseRecord(recordDO)) {
				updateCloseRecordReturns(id);
				updateOpenRecordRemainingAndRetruns(openId);
			}
			
		}else {
			if(isOpenRecord(recordDO)) {
				recordDO.setRemaining(count);
			}
			recordMapper.insert(recordDO);
			if(isCloseRecord(recordDO)) {
				updateCloseRecordReturns(recordDO.getId());
				updateOpenRecordRemainingAndRetruns(openId);
			}
			
		}
		updateRecordGroupCountAndCost(groupId);
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	private boolean isOpenRecord(RecordDO recordDO) {
		if("stock".equals(recordDO.getType())){
			if("buy".equals(recordDO.getOper())) {
				return true;
			}
		}
		if("futures".equals(recordDO.getType())){
			if("open".equals(recordDO.getSubOper())) {
				return true;
			}
		}
		return false;
	}
	
	private boolean isCloseRecord(RecordDO recordDO) {
		if("stock".equals(recordDO.getType())){
			if("sell".equals(recordDO.getOper())) {
				return true;
			}
		}
		if("futures".equals(recordDO.getType())){
			if("close".equals(recordDO.getSubOper())) {
				return true;
			}
		}
		return false;
	}
	
	
	
	@RequestMapping("/record/getById")
	RecordDO getById(Integer id) {  
		RecordDO recordDO = recordMapper.getById(id);
		return recordDO;
    }
	
	@RequestMapping("/record/deleteById")
	RpcResult deleteById(Integer id) {  
		RpcResult rpcResult = new RpcResult();
		RecordDO recordDO = recordMapper.getById(id);
		recordMapper.deleteById(id);
		updateRecordGroupCountAndCost(recordDO.getGroupId());
		if(recordDO.getOpenId()!=null) {
			updateOpenRecordRemainingAndRetruns(recordDO.getOpenId());
		}
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	@RequestMapping("/record/getByGroupId")
    Map getByGroupId(Integer groupId) {  
		Map map = new HashMap();
		List<RecordDO>  recordList =  recordMapper.getByGroupId(groupId);
		map.put("list", recordList);
        return map;  
    }
	
	//计算期货开仓剩余数量
	private void updateOpenRecordRemainingAndRetruns(Integer openId) {
		RecordDO openRecord = recordMapper.getById(openId);
		if(openId!=null && openId>0) {
			Map params = new HashMap();
			params.put("openId", openId);
			if("stock".equals(openRecord.getType())) {
				params.put("oper","sell" );
			}else if("futures".equals(openRecord.getType())) {
				params.put("subOper","close" );
			}
			
			List<RecordDO> closeRecordList = recordMapper.getByParams(params);
			Double closeCount = 0d;
			Double retruns = 0d;
			for(RecordDO closeRecord : closeRecordList) {
				closeCount = NumberUtil.add(closeRecord.getCount(), closeCount);
				retruns =  NumberUtil.add(closeRecord.getReturns(), retruns);
			}
			Double remaining = NumberUtil.sub(openRecord.getCount(), closeCount);
			
			openRecord.setRemaining(remaining);
			openRecord.setReturns(retruns);
			recordMapper.update(openRecord);
		}
	}
	
	private void updateCloseRecordReturns(Integer closeRecordId) {
		RecordDO closeRecord = recordMapper.getById(closeRecordId);
		
			if(closeRecord.getPrice()!=null && closeRecord.getPrice()>0 && closeRecord.getOpenId()!=null && closeRecord.getOpenId()>0) {
				
				Double returnsPrice = 0d;
				if(closeRecord.getReturnsPrice()==null || closeRecord.getReturnsPrice()==0) {
					RecordDO openRecord = recordMapper.getById(closeRecord.getOpenId());
					returnsPrice = openRecord.getPrice();
					closeRecord.setReturnsPrice(returnsPrice);
				}
				
				Double d = NumberUtil.sub( closeRecord.getPrice(),closeRecord.getReturnsPrice());
				Double returns = NumberUtil.mul(d, closeRecord.getCount());
				closeRecord.setReturns(returns);
				
				RecordGroupDO recordGroupDO = recordGroupMapper.getById(closeRecord.getGroupId());
				//如果是期货做空，则收益需要取反
				if("short".equals(recordGroupDO.getDirection())&&"futures".equals(recordGroupDO.getType())) {
					Double returns2 = NumberUtil.div(0, returns);
					closeRecord.setReturns(returns2);
				}
				
				recordMapper.update(closeRecord);
			}
		
		
	}
	
	//计算股票剩余数量
//	private void updateStockOpenRecordRemaining(Integer openId) {
//		RecordDO openRecord = recordMapper.getById(openId);
//		if(openId!=null && openId>0) {
//			Map params = new HashMap();
//			params.put("openId", openId);
//			params.put("oper","sell" );
//			List<RecordDO> closeRecordList = recordMapper.getByParams(params);
//			Double closeCount = 0d;
//			for(RecordDO closeRecord : closeRecordList) {
//				closeCount = NumberUtil.add(closeRecord.getCount(), closeCount);
//			}
//			Double remaining = NumberUtil.sub(openRecord.getCount(), closeCount);
//			openRecord.setRemaining(remaining);
//			recordMapper.update(openRecord);
//		}
//	}
	
	private void updateRecordGroupCountAndCost(Integer groupId) {
		RecordGroupDO recordGroupDO =  recordGroupMapper.getById(groupId);
		if(recordGroupDO.getType()=="stock") {
			List<RecordDO> recordList = recordMapper.getByGroupId(groupId);
			Double totalCount = 0d ;
			Double totalValue = 0d ;
			for(RecordDO record : recordList) {
				totalCount = NumberUtil.add(record.getCount(), totalCount);
				Double value = NumberUtil.mul(record.getPrice(), record.getCount());
				totalValue = NumberUtil.add(value, totalValue);
			}
			Double price = 0d;
			if(totalCount!=0) {
				price = NumberUtil.round(NumberUtil.div(totalValue, totalCount));
			}
			recordGroupDO.setCount(totalCount);
			recordGroupDO.setPrice(price);
			recordGroupMapper.update(recordGroupDO);
		}
		
		
		
	}
	
	
	
	
    
}