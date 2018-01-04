package com.lbaol.web.control;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lbaol.dataobject.FavDO;
import com.lbaol.dataobject.NoteDO;
import com.lbaol.mapper.NoteMapper;
import com.lbaol.web.control.common.RpcResult;





@RestController
public class NoteControl {
	
	@Autowired
	private NoteMapper noteMapper;
	
	
	@RequestMapping("/note/getByParams")
    Map getByParams(String code,String type,String date) {  
		Map map = new HashMap();
		Map params = new HashMap();
		if("overall".equals(type)) {
			params.put("type", type);
		}else {
			params.put("code",code);
			params.put("type", type);
		}
		List<NoteDO> noteList =   noteMapper.getByParams(params);
		map.put("noteList", noteList);
        return map;  
    }
	
	
	@RequestMapping("/note/getOverall")
	NoteDO getOverall() {  
		NoteDO note =   noteMapper.getOverall();
        return note;  
    }
	
	
	@RequestMapping("/note/addOrUpdateContent")
	RpcResult getByCode(String code,String content,String type) { 
		RpcResult rpcResult = new RpcResult();
		if("summary".equals(type)) {
			List<NoteDO> noteList = noteMapper.getByCodeAndType(code,type);
			if(noteList.size() == 1) {
				NoteDO noteDO = noteList.get(0);
				noteDO.setContent(content);
				noteMapper.update(noteDO);
			}else{
				noteMapper.deleteByCodeAndType(code, type);
				NoteDO noteDO = new NoteDO();
				noteDO.setCode(code);
				noteDO.setContent(content);
				noteDO.setType(type);
				noteMapper.insert(noteDO);
			}
		}
		if("overall".equals(type)) {
			NoteDO noteDO  =   noteMapper.getOverall();
			if(noteDO != null) {
				noteDO.setContent(content);
				noteMapper.update(noteDO);
			}else{
				noteDO = new NoteDO();
				noteDO.setContent(content);
				noteDO.setType(type);
				noteMapper.insert(noteDO);
			}
		}
		
		rpcResult.setIsSuccess(true);
        return rpcResult;  
    }
	
	
	
	
	
	
    
}