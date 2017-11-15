package com.lbaol.dataobject;

public class ReportDO {
	private Integer id;
	private Long index;
	private String code;
	private String name;
	private Long eps;
	private Long epsYoy;
	private Long bvps;
	private Long roe;
	private Long epcf;
	private Long netProfits;
	private Long profitsYoy;
	private String distrib;
	private String reportDate;
	
	

	public Integer getId() {
		return id;
	}



	public void setId(Integer id) {
		this.id = id;
	}



	public Long getIndex() {
		return index;
	}



	public void setIndex(Long index) {
		this.index = index;
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



	public Long getEps() {
		return eps;
	}



	public void setEps(Long eps) {
		this.eps = eps;
	}



	public Long getEpsYoy() {
		return epsYoy;
	}



	public void setEpsYoy(Long epsYoy) {
		this.epsYoy = epsYoy;
	}



	public Long getBvps() {
		return bvps;
	}



	public void setBvps(Long bvps) {
		this.bvps = bvps;
	}



	public Long getRoe() {
		return roe;
	}



	public void setRoe(Long roe) {
		this.roe = roe;
	}



	public Long getEpcf() {
		return epcf;
	}



	public void setEpcf(Long epcf) {
		this.epcf = epcf;
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



	public String getDistrib() {
		return distrib;
	}



	public void setDistrib(String distrib) {
		this.distrib = distrib;
	}



	public String getReportDate() {
		return reportDate;
	}



	public void setReportDate(String reportDate) {
		this.reportDate = reportDate;
	}



	@Override
	public String toString() {
		return "ReportDO [index=" + index + ", code=" + code + ", name=" + name + ", eps=" + eps + ", epsYoy=" + epsYoy
				+ ", bvps=" + bvps + ", roe=" + roe + ", epcf=" + epcf + ", netProfits=" + netProfits + ", profitsYoy="
				+ profitsYoy + ", distrib=" + distrib + ", reportDate=" + reportDate + "]";
	}
	
	
}
