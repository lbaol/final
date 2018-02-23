package com.lbaol.dataobject;

import java.util.List;

public class RecordGroupDO {
	
	private Integer id;
	private String startDate;
	private String endDate;
	private String code;
	private Double count;
	private Double cost;
	
	private List<RecordDO> recordList;
	
	
	
	public List<RecordDO> getRecordList() {
		return recordList;
	}
	public void setRecordList(List<RecordDO> recordList) {
		this.recordList = recordList;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	
	public Double getCount() {
		return count;
	}
	public void setCount(Double count) {
		this.count = count;
	}
	public Double getCost() {
		return cost;
	}
	public void setCost(Double cost) {
		this.cost = cost;
	}
	
	
	

}
