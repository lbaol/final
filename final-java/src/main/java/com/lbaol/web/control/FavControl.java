package com.lbaol.web.control;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.FavDO;
import com.lbaol.mapper.FavMapper;
import com.lbaol.mapper.StockMapper;
import com.lbaol.web.control.common.RpcResult;

import net.sf.json.JSONArray;



@RestController
public class FavControl {
	
	@Autowired
	private FavMapper favMapper;
	
	@Autowired
	private StockMapper stockMapper;
	
	@RequestMapping("/fav/getByParam")
    Map getByParam(String code,String type) {  
		Map map = new HashMap();
		Map params = new HashMap();
		params.put("code",code);
		params.put("type", type);
		List<FavDO>  favList =  favMapper.getByParams(params);
		map.put("favList", favList);
        return map;  
    }
	
	@RequestMapping("/fav/update")
	RpcResult getByCode(String code,String types) {  
		RpcResult rpcResult = new RpcResult();
		if(StringUtils.isNotEmpty(types)){
			JSONArray typeJsonArray = JSONArray.fromObject(types);
			List<FavDO> addList = new ArrayList<FavDO>();
			List<String> typeList = new ArrayList<String>();
			for(Object tempType : typeJsonArray) {
				String type = (String)tempType;
				typeList.add(type);
				List<FavDO> codeFavList = favMapper.getByCodeAndType(code,(String) type);
				if(codeFavList.size() < 1) {
					FavDO favDO = new FavDO();
					favDO.setCode(code);
					favDO.setType(type);
					addList.add(favDO);
				}
			}
			for(FavDO favDO : addList) {
				favMapper.insert(favDO);
			}
			
			
		}
		
		
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
    
}