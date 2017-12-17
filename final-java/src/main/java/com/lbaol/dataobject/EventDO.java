package com.lbaol.dataobject;

public class EventDO {
	private Integer id;
	private String code;
	private String name;
	private String type;
	private String subType;
	private String eventDate;
	private String ranges;
	private Long netProfits;
	private Long profitsYoy;
	private Integer year;
	private Integer quarter;
	public Integer getYear() {
		return year;
	}
	public void setYear(Integer year) {
		this.year = year;
	}
	public Integer getQuarter() {
		return quarter;
	}
	public void setQuarter(Integer quarter) {
		this.quarter = quarter;
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getSubType() {
		return subType;
	}
	public void setSubType(String subType) {
		this.subType = subType;
	}
	
	public String getEventDate() {
		return eventDate;
	}
	public void setEventDate(String eventDate) {
		this.eventDate = eventDate;
	}
	public String getRanges() {
		return ranges;
	}
	public void setRanges(String ranges) {
		this.ranges = ranges;
	}
	public Long getNetProfits() {
		return netProfits;
	}
	public void setNetProfits(Long netProfits) {
		this.netProfits = netProfits;
	}
	public Long getProfitsYoy() {
		return profitsYoy;
	}
	public void setProfitsYoy(Long profitsYoy) {
		this.profitsYoy = profitsYoy;
	}
	
	
	
	
	

}
