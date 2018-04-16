package com.lbaol.dataobject;

import java.util.List;

public class RecordDO {
	
	private Integer id;
	private String code;
	private Double count;
	private Double price;
	private Double fee;
	private Double stopPrice;
	private Integer groupId;
	private String date;
	private String type; //stock 股票;futures 期货;
	private String oper; 	//buy 买; sell 卖 ;
	private String subOper; //open 开仓;close 平仓;
	private String market; // a 大陆; hk 香港;us 美股;
	private Integer openId;
	private Double remaining;
	private Double returns;
	private Double returnsPrice;
	private List<RecordDO> closeRecordList;
	private RecordDO openRecordDO;
	private String statStatus; //统计状态
	private String openType;
	private String openSignal;
	
	
	public String getOpenSignal() {
		return openSignal;
	}
	public void setOpenSignal(String openSignal) {
		this.openSignal = openSignal;
	}
	public String getStatStatus() {
		return statStatus;
	}
	public void setStatStatus(String statStatus) {
		this.statStatus = statStatus;
	}
	public String getOpenType() {
		return openType;
	}
	public void setOpenType(String openType) {
		this.openType = openType;
	}
	public RecordDO getOpenRecordDO() {
		return openRecordDO;
	}
	public void setOpenRecordDO(RecordDO openRecordDO) {
		this.openRecordDO = openRecordDO;
	}
	
	public Double getReturns() {
		return returns;
	}
	public void setReturns(Double returns) {
		this.returns = returns;
	}
	public Double getReturnsPrice() {
		return returnsPrice;
	}
	public void setReturnsPrice(Double returnsPrice) {
		this.returnsPrice = returnsPrice;
	}
	
	
	public List<RecordDO> getCloseRecordList() {
		return closeRecordList;
	}
	public void setCloseRecordList(List<RecordDO> closeRecordList) {
		this.closeRecordList = closeRecordList;
	}
	public Integer getOpenId() {
		return openId;
	}
	public void setOpenId(Integer openId) {
		this.openId = openId;
	}
	public Double getRemaining() {
		return remaining;
	}
	public void setRemaining(Double remaining) {
		this.remaining = remaining;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getOper() {
		return oper;
	}
	public void setOper(String oper) {
		this.oper = oper;
	}
	public String getMarket() {
		return market;
	}
	public void setMarket(String market) {
		this.market = market;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	
	public Double getCount() {
		return count;
	}
	public void setCount(Double count) {
		this.count = count;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public Double getFee() {
		return fee;
	}
	public void setFee(Double fee) {
		this.fee = fee;
	}
	public Double getStopPrice() {
		return stopPrice;
	}
	public void setStopPrice(Double stopPrice) {
		this.stopPrice = stopPrice;
	}
	public String getSubOper() {
		return subOper;
	}
	public void setSubOper(String subOper) {
		this.subOper = subOper;
	}
	public Integer getGroupId() {
		return groupId;
	}
	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}

	
	
	
}
