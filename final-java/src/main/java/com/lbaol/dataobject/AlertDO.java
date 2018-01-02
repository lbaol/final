package com.lbaol.dataobject;

public class AlertDO {
	private Integer id;
	private String code;
	private String type;
	private String time;
	private String date;
	private String dates;

	public String getDates() {
		return dates;
	}
	public void setDates(String dates) {
		this.dates = dates;
	}
	private Double timePrice;
	private Double alertPrice;
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	private Integer count;
	
	
	public Double getTimePrice() {
		return timePrice;
	}
	public void setTimePrice(Double timePrice) {
		this.timePrice = timePrice;
	}
	public Double getAlertPrice() {
		return alertPrice;
	}
	public void setAlertPrice(Double alertPrice) {
		this.alertPrice = alertPrice;
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
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
	
	
}
