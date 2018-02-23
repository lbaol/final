package com.lbaol.dataobject;

public class RecordDO {
	
	private Integer id;
	private String code;
	private Double count;
	private Double price;
	private Double fee;
	private Double stopPrice;
	private String direction; //buy 买; sell 卖 ;
	private Integer groupId;
	private String date;
	private String type; //stock 股票;futures 期货;
	private String oper; //open 开仓;close 平仓;
	private String market; // a 大陆; hk 香港;us 美股;
	
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
	public String getDirection() {
		return direction;
	}
	public void setDirection(String direction) {
		this.direction = direction;
	}
	public Integer getGroupId() {
		return groupId;
	}
	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}

	
	
	
}
