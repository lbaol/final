package com.lbaol.web;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController  
@EnableAutoConfiguration  
public class MainControl {
	@RequestMapping("/")  
    String home() {  
        return "Hello World 1!";  
    }  

}
