/**
 * @ck
 *
 * 
 * Local Storage 
 * This closure implement local  storage functionality provided by HTML5 and Browser.
 * So we can store data in key value pair in browser local storage provided to website. 
 * I also addded a expiry function that will erase data after defined time period.
 * It is set globally. 
  * 
 */
var ls = _myLocalStorage = function () {

    //  main sotrage object
    var storeObj = window.localStorage;
	 var debug = false;
    //	expiry Time from setting , if not defined than 30 min
    var expireTime = 1800 ;

    // setting expire time


    function setExpireTime(eT) {
        expireTime = eT;
    }

    // function return expireTime


    function getExpireTime() {
        return expireTime;
    }

    //		logging detail in console
	function setDebug(flag){
		debug = flag;		
		}

    function logDetail(detail) {
    	if(debug){
        console.log(detail);
		}
    }

    // get  timestamp in unixtimestamp format in second


    function currentTimeStamp() {
        return (Math.round((new Date()).getTime() / 1000) + 14300);
    }

    // check Json Data


    function isJson(data) {
        try {
            var lData = $.parseJSON(data);
            return true;
        } catch (e) {
            logDetail("Data is not proper json format." + e);
            return false;
        }
        return true;
    }

    // adding timestamp


    function addTimeStampInJson(json) {
	
        
            var newJson = {};
            newJson.data = json;
            newJson.timestamp = currentTimeStamp().toString();
            return newJson;
      
    }
    
    
    // // adding item value on direct json 
    function addItemValueInJson(json,item, value) {
        
            var newJson = {};
            /*if(typeof json.data !=='undefined'){

            newJson.data = json.data;
            }
            if(typeof json.timestamp  !=='undefined'){
            	
            	newJson.timestamp = json.timestamp;
            }*/
            newJson = json;
            
            
            newJson[item] = value;
            return newJson;
        
    }
    

    
    // adding custom Key Value Pair


    function addItemValueByKey(storeKey,item,value) {
    	if(isKeyExist(storeKey)){
    		var json = getStorage(storeKey);
			
    		if(json != '' && typeof json != 'undefined' && json != null){
    			 json[item] = value;
    			 clearStorageByKey(storeKey);
				 logDetail(json);
    			 if(  storeObj.setItem(storeKey, JSON.stringify(json))){
    				 return true;
    			 }else{
    				 return false;
    			 }
				 
    		}
    		
    	}else{
    		logDetail("Store Key Not Exist >> additemValueByKey()");
    	}
      
    }
    
    // check time stamp for that key


    function getItemValueByKey(storeKey,item) {
        if (storeKey != '') {
            var string = '';
            var json = '';
            if (storeObj) {
                string = storeObj.getItem(storeKey);
                try {
                    json = JSON.parse(string);
                } catch (e) {
                    logDetail("Step : getItemValueByKey::" + e)
                }
                if (json[item]) {
                    return json[item];
                } else {
                    logDetail("item couldn't found");
                    return null;
                }

            } else {
                logDetail("local Storage Not Supported.");
                return false;
            }
        } else {
            logDetail("getItemValueByKey() >>Key Not Found!")
            return null;
        }
    }

    // check if storage supported


    function isStorgaeSupport() {
        if (storeObj) {
            logDetail("storage supported");
            logDetail(storeObj);
            return true;
        } else {
            logDetail("storage not supported");
            return false;
        }
    }

    // function check length


 
    // set set storage


    function setStorage(key, value, addTimeStamp,itemValuePair) {
        var string = '',
            newJson;
        addTimeStamp = typeof addTimeStamp !== 'undefined' ? addTimeStamp : true;
        itemValuePair = typeof itemValuePair !== 'undefined' && itemValuePair !='' ? itemValuePair: false;
        if (key != '') {
            if (storeObj) {
                try {
                    if (addTimeStamp) {
                        newJson = addTimeStampInJson(value)
                    } else {
                        newJson = value;
                    }
                    if(itemValuePair){
	                    $.each(itemValuePair,function(e, d){
	                    newJson = addItemValueInJson(newJson,e,d);	
	                    });
                    }
                    if (newJson) {
                        storeObj.setItem(key, JSON.stringify(newJson));
                        logDetail("Storage Succeed");
                        return true;
                    } else {
                    	 logDetail("step : setStorage=>addTimeStamp");
                    	return null;
                       
                    }
                } catch (e) {
                    logDetail(" Exception Occurred" + e);
                }
                return null;
            } else {
                logDetail("local Storage Not Supported.");
                return null;
            }
        } else {
            logDetail("setStorage() >> Key Not Found!")
            return null;
        }
    }

    // function get value by key


    function getStorage(key) {
        if (key != '') {
            var string = '';
            if (storeObj) {
                string = storeObj.getItem(key);
                try {
                    return JSON.parse(string);
                } catch (e) {
                    logDetail("Step : getStorage" + e);
                    return null;
                }
            } else {
                logDetail("local Storage Not Supported.");
                return null;
            }
        } else {
            logDetail("getStorage() >> Key Not Found!")
            return null;
        }
    }

    // check if key exist or not


    function isKeyExist(key) {
        if (key != '') {
            if (storeObj) {
                if (storeObj.getItem(key)) {
                	logDetail("Key Exist! " + key);
                    return true;
                } else {
                    logDetail("isKeyExist() >> key Doesn't Exist in storage! "+ key);
                    return false;
                }
            } else {
                logDetail("local Storage Not Supported.");
                return null;
            }
        } else {
            logDetail("isKeyExist() >> Key Not Found!")
            return null;
        }
    }

    // check time stamp for that key


    function getKeyTimeStamp(key) {
        if (key != '') {
            var string = '';
            var json = '';
            if (storeObj) {
                string = storeObj.getItem(key);
                try {
                    json = JSON.parse(string);
                } catch (e) {
                    logDetail("Step : getKeyTimeStamp ::" + e)
                }
                if (json.timestamp) {
                	logDetail("Key Time Stmap Of >> "+ key + " is  : "+json.timestamp);
                    return json.timestamp;
                } else {
                    logDetail("time Stamp couldn't found");
                    return null;
                }

            } else {
                logDetail("local Storage Not Supported.");
                return false;
            }
        } else {
            logDetail("getKeyTimeStamp() >>Key Not Found!")
            return null;
        }
    }

    // check if data is expired


    function isExpired(key, eT, clearKey) {
        if (key != '') {
            // assign time stmap should be by default or specific
            eT = typeof eT !== 'undefined' && eT != ''? eT : expireTime;
            logDetail("expiretime >>"+eT);
            logDetail("currentTimeStmap >>"+currentTimeStamp());
            
            // assign clear automatically on expired or not bydefault true
            clearKey = typeof clearKey !== 'undefined'  ? clearKey : true;

            var timeStamp =parseInt(getKeyTimeStamp(key),10);
            logDetail(parseInt(timeStamp,10)+eT);
            if (timeStamp) {
                if ((timeStamp + eT) < currentTimeStamp()) {
                    if (clearKey) {
                        if (clearStorageByKey(key)) {
                            logDetail(key + " Expired ;");
                            logDetail("Key Time Stmap was >> "+timeStamp+" and current time stamp is >> "+currentTimeStamp());
                            return true;
                        } else {
                            logDetail("step: isExpired >> clearStorageByKey() ;");
                            return null;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            } else {
                logDetail("step: isExpired >> timestamp null");
            }
        } else {
            logDetail("isExpired >> Key Not Found!")
            return null;
        }
    }

    // clear storage


    function clearStorageByKey(key) {
        if (key != '') {
            if (typeof storeObj !=='undefined') {
            	if(isKeyExist(key)){
                storeObj.removeItem(key);
                    return true;
                } else {
                    logDetail("clearStorageBykey >> key Doesn't Exist in storage");
                    return false;
                }

            } else {
                logDetail("local Storage Not Supported.");
                return null;
            }
        } else {
            logDetail("clearStorageBykey >>  Key Not Found!")
            return null;
        }
    }

    // clear all


    function clearStorage() {
        if (storeObj) {
            if (storeObj.clear()) {
                return true;
            } else {
                logDetail("storage could not be cleared or there is no storage yet");
                return false;
            }

        } else {
            logDetail("local Storage Not Supported.");
            return null;
        }

    }

    //-setOption  function to set default optional parameter
    //- there are default option 
    /**
     * option={
     * doStore
     * render
     * itemValuePair
     * }
     * 
     */

    function setOption(option) {
        //-----do store is a key to set storing in local storage
        var defaultOpt = {
            doStore:  true,           
            itemValuePair:false,
            other:false,
        };
        var retOpt = {};
        if (typeof option !== 'undefined') {
            if (typeof option.doStore !== 'undefined') {
                retOpt["doStore"] = option.doStore;
            } else {
                retOpt["doStore"] = defaultOpt.doStore;
            }
            
            if (typeof option.itemValuePair !== 'undefined') {
                retOpt["itemValuePair"] = option.itemValuePair;
            } else {
                retOpt["itemValuePair"] = defaultOpt.itemValuePair;
            }
            if (typeof option.other !== 'undefined') {
                retOpt["other"] = option.other;
            } else {
                retOpt["other"] = defaultOpt.other;
            }
            return retOpt;

        } else {
            return retOpt = defaultOpt;
        }
    }


    // function handdle storage


    function handleStorage(key, response, addTimeStamp, option) {
    	var itemValuePair;
    	
        addTimeStamp = typeof addTimeStamp !== 'undefined' && addTimeStamp !='' ? addTimeStamp : true;
        
        if(typeof option !=='undefined' && option !=''){
        itemValuePair = typeof option.itemValuePair !== 'undefined' && option.itemValuePair !='' ? option.itemValuePair : false;
        }else{
        	itemValuePair =false;
        }
        setStorage(key, response, addTimeStamp, itemValuePair);
    }

    // function clearing automatically after expire time


    function autoClear(eT) {
        // not fully implemented
        // it will clear all storage after a defualt expire time
        // assign time stmap should be by default or specific
        eT = typeof eT !== 'undefined' ? eT : expireTime;
        setInterval(function () {
            clearStorage()
        }, eT);
    }

    // calculate size of webstorage


    function storageSize() {
        return (1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(storeObj))).length);
    }


    return {
        storeObj: storeObj,
        getExpireTime: getExpireTime,
        setExpireTime: setExpireTime,
        addTimeStampInJson: addTimeStampInJson,
        addItemValueByKey: addItemValueByKey,
        getItemValueByKey : getItemValueByKey,
        
        logDetail: logDetail,
        isStorageSupport: isStorgaeSupport,
        setStorage: setStorage,
        getStorage: getStorage,
        isKeyExist: isKeyExist,
        getKeyTimeStamp: getKeyTimeStamp,
        isExpired: isExpired,
        clearStorageByKey: clearStorageByKey,
        clearStorage: clearStorage,
        handleStorage: handleStorage,
        autoClear: autoClear,
        storageSize: storageSize,
        setDebug:setDebug

    }
}();
