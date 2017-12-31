package com.lbaol.test;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ObjectUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.lbaol.common.NumberUtil;
import com.lbaol.dataobject.DayDataDO;
import com.lbaol.dataobject.EventDO;
import com.lbaol.dataobject.KDataDO;
import com.lbaol.mapper.DayDataMapper;
import com.lbaol.mapper.EventMapper;
import com.lbaol.mapper.KDataMapper;
import com.lbaol.web.control.ConvertControl;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ConverterTest {

	@Autowired
	private ConvertControl convertControl;

	@Autowired
	private KDataMapper kDataMapper;
	
	
	@Autowired
	private EventMapper eventMapper;

	@Autowired
	private DayDataMapper dayDataMapper;

	private SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");;

	private Integer year = 2017;
	private Integer quarter = 1;

	
	public void processRise() throws Exception {
		processRisePercent("600153");

	}

	private int findInsertIndex(List<KDataDO> kDataList, String date) {

		for (int i = 0; i < kDataList.size() - 1; i++) {
			if (kDataList.get(i).getDate().compareTo(date) > 0 && date.compareTo(kDataList.get(i + 1).getDate()) >= 0) {
				return i + 1;
			}
		}
		return -1;
	}
	
	
	private Double calRisePercent(Double cur,Double pre) {
		Double rise = NumberUtil.sub(cur, pre);
		Double risePercent = NumberUtil.round(NumberUtil.mul(NumberUtil.div(rise, pre), 100));
		return risePercent;
	}
	
	@Test
	public void test() {
		List<EventDO> eventList = eventMapper.getByCode("300349");
		for(EventDO eventDO : eventList) {
			KDataDO curData1 = kDataMapper.getCurrentDataByCodeAndDateContain(eventDO.getCode(), eventDO.getEventDate());
			KDataDO preData1 = kDataMapper.getPreDataByCodeAndDateNotContain(eventDO.getCode(), eventDO.getEventDate());
			
			KDataDO curData2 = kDataMapper.getCurrentDataByCodeAndDateNotContain(eventDO.getCode(), eventDO.getEventDate());
			KDataDO preData2 = kDataMapper.getPreDataByCodeAndDateContain(eventDO.getCode(), eventDO.getEventDate());
			
			
			if(curData1 !=null  && preData1!=null) {
				Double rise1 = calRisePercent(curData1.getClose(),preData1.getClose());
				Double rise2 = calRisePercent(curData2.getClose(),preData2.getClose());
				//跳空+涨幅超过8，则是净利润断层
				if((rise1>8 || rise2>8 ) && curData1.getOpen()>preData1.getClose()) {
					System.out.println(eventDO.getCode() + " " + eventDO.getEventDate() + " rise1:" + rise1 + " rise2:" + rise2);
				}
			}
			
		}
		
	}

	private void processRisePercent(String code) throws Exception {
		List<KDataDO> kDataList = kDataMapper.getByCode(code);
		List<DayDataDO> dayDataListDB = dayDataMapper.getByCode(code);
		Map<String, DayDataDO> dayDataMapDB = new HashMap<String, DayDataDO>();
		for (DayDataDO dayDataDO : dayDataListDB) {
			dayDataMapDB.put(dayDataDO.getDate(), dayDataDO);
		}

		List<DayDataDO> newDayDataList = new ArrayList<DayDataDO>();
		int yearCount = 250;
		int yearHalfCount = 120;
		for (int i = 0; i < kDataList.size(); i++) {

			if ((yearCount + i > kDataList.size() - 1) && (yearHalfCount + i > kDataList.size() - 1)) {
				break;
			}

			KDataDO curKData = kDataList.get(i);
			DayDataDO dayDataDODB = dayDataMapDB.get(curKData.getDate());
			DayDataDO dayDataDO = new DayDataDO();

			dayDataDO.setDate(curKData.getDate());
			dayDataDO.setCode(curKData.getCode());
			if (yearCount + i <= kDataList.size() - 1) {
				// 可以计算250
				KDataDO preKData = kDataList.get(yearCount + i);
				Double risePercent = calRisePercent(curKData.getClose(), preKData.getClose());
				dayDataDO.setYearRise(risePercent);
			}
			if (yearHalfCount + i <= kDataList.size() - 1) {
				// 可以计算120
				KDataDO preKData = kDataList.get(yearHalfCount + i);
				Double yearHalfRise = calRisePercent(curKData.getClose(), preKData.getClose());
				dayDataDO.setYearHalfRise(yearHalfRise);
			}
			if (dayDataDODB != null) {
				if (ObjectUtils.compare(dayDataDO.getYearRise(), dayDataDODB.getYearRise()) != 0
						&& ObjectUtils.compare(dayDataDO.getYearHalfRise(), dayDataDODB.getYearHalfRise()) != 0) {
					dayDataDO.setId(dayDataDODB.getId());
					newDayDataList.add(dayDataDO);
				}
			} else {
				newDayDataList.add(dayDataDO);
			}
		}

		for (DayDataDO dd : newDayDataList) {
			if (dd.getId() != null) {
				dayDataMapper.update(dd);
			} else {
				dayDataMapper.insert(dd);
			}

		}

	}

	// @Test
	// public void convertBasic() throws Exception {
	// convertControl.convertBasicService();
	// }

	// @Test
	// public void convertReport() throws Exception {
	// convertControl.convertReport(year, quarter);
	// }

	// @Test
	// public void convertForecast() throws Exception {
	// convertControl.convertForecast(year, quarter);
	// }

}
