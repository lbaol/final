package com.lbaol.web.control;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

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
			List<FavDO> deleteList = new ArrayList<FavDO>();
			List<FavDO> codeFavListDB = favMapper.getByCode(code);
			Map<String,Integer> userSelectedMap = new HashMap<String,Integer>();
			for(Object type : typeJsonArray) {
				userSelectedMap.put((String)type, 0);
			}
			
			for(FavDO favDO : codeFavListDB) {
				if(userSelectedMap.get(favDO.getCode())==null) {
					deleteList.add(favDO);
				}else {
					userSelectedMap.put(favDO.getCode(), 1);
				}
			}
			
			for(FavDO favDO : deleteList) {
				favMapper.deleteById(favDO.getId());
			}
			
			for(Entry<String,Integer> entry : userSelectedMap.entrySet()) {
				if(entry.getValue() == 0) {
					FavDO favDO = new FavDO();
					favDO.setCode(code);
					favDO.setType(entry.getKey());
					favMapper.insert(favDO);
				}
			}
			
		}
		
		
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
	@RequestMapping("/fav/import")
	RpcResult importByCodes(String codes,String type) {  
		RpcResult rpcResult = new RpcResult();
		if(StringUtils.isNotEmpty(codes)){
			String[] codeArray = codes.split(",");
			for(String code : codeArray) {
				List<FavDO> favListDB = favMapper.getByCodeAndType(code, type);
				if(favListDB.size() == 0) {
					FavDO favDO = new FavDO();
					favDO.setCode(code);
					favDO.setType(type);
					favMapper.insert(favDO);
				}
			}
		}
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
	@RequestMapping("/fav/deleteById")
	RpcResult deleteById(Integer id) {  
		RpcResult rpcResult = new RpcResult();
		favMapper.deleteById(id);
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	@RequestMapping("/fav/deleteByType")
	RpcResult deleteByType(String type) {  
		RpcResult rpcResult = new RpcResult();
		favMapper.deleteByType(type);
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
    
}