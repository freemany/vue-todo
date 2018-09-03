/**
 * Mushodo Server communication framework
 * 
 * @author Ashik Ahmed
 * @namespace
 */
const DP = DP || {}
export default DP.mushodo = {

	/**
	 * Debug log?
	 */
	blnDebug      : false,
	
    /**
     * Flag constants to identify change in data
     */
    flagNochange  : "__nochange",
    flagDeleted   : "__deleted" ,

	
    /**
     * If a sync is in progress, this will be true
     * this variable is used for preventing multiple syncs from firing up
     * @var bool
     */
    blnSyncInProgress : false,
    
	/**
	 * Last time any communication happened with the server
	 *  This variable is embedded into the data of the DIV as modified as well by updateDiv and updateRepeater
	 *
	 * @var int
	 */
	intLastCommTimestamp : 0,
	
	
	/**
	 * Keeps the registered channels array
	 */
	_mixedChannelsArray : {},


	/**
	 * Keep a mapping of requests sent to server and their processing
	 */
	_mixedResponseMap : {},
	
	/**
	 * Register a Channel for Server communication
	 * Channels must be registered in QForm as well
	 * Channels are method names in form or QControl. If method name in QControl, then it must be in format of ControlId:MethodName
	 * Returns a registration id which you can use to unregister later
	 *
	 *
	 * @param strChannel channel name
	 * @param fnGetParams function to get parameters
	 * @param fnReturnHandler Function to be executed if call was successful
	 * @param fnOnError Function to be executed if call failed!
	 * @param blnSingleCall Whether this registration is single call only
	 * @return strRegistrationId
	 */
	register : function(strChannel , fnGetParams, fnReturnHandler , fnOnError , blnSingleCall){
		var objChannel = {channel : strChannel , getParams : fnGetParams , success : fnReturnHandler , error : fnOnError , singleCall : blnSingleCall};
		var index = "r" + (new Date()).getTime() + "_" + Math.floor(Math.random()*10000); // WARNING ? What are the chances?
		DP.mushodo._mixedChannelsArray[index] = objChannel;
		return index;
	},
	
	/**
	 * Unregister channels by given id
	 *
	 * @param strRegistrationId
	 * @return void
	 */
	unregister : function(strRegistrationId){
		delete DP.mushodo._mixedChannelsArray[strRegistrationId];
	},
	
	
	
	/**
	 * Unregister all channels by given channel names
	 *
	 * @param strChannel
	 * @return void
	 */
	unregisterChannel : function(strChannel){
		for(var i in DP.mushodo._mixedChannelsArray){
			DP.mushodo.unregister(i);
		}
	},

	
	/**
	 * Sync all registered channels
	 *
	 * @param mixedRequestArray If there are other requests to be sent as part of this request. Leave it null if unsure
	 * 							It is used by askSingle when it wants to send events
	 * @param {boolean} blnBlockGlobalEvents block global events (e.g. show/hide the ajax on progress label)
	 * @return void
	 */
	sync : function(mixedRequestArray, blnBlockGlobalEvents){
		
		// Request object
		if(!mixedRequestArray)
			mixedRequestArray = {};
			
		if (blnBlockGlobalEvents == undefined)
			blnBlockGlobalEvents = true;
		
		var ind, params, register, channel, fn;
		// to handle multiple requests at once, we will use timestamps with each request
		var ts = (new Date()).getTime();
		
		//don't do anything if there isn't a request
		if(DP.mushodo._mixedChannelsArray.length == 0)
			return;
		for(var i  in DP.mushodo._mixedChannelsArray){
			// Do not process non-existant objects
			if(!DP.mushodo._mixedChannelsArray[i]) continue;
			
			// Do not process single calls
			if(DP.mushodo._mixedChannelsArray[i].singleCall) continue;
			
			
			ind = "req" + ts + "_" + i;
			register = DP.mushodo._mixedChannelsArray[i];
			if(register.getParams){
				fn = register.getParams;
				params = fn();
			}
			mixedRequestArray[ind] = {channel : register.channel , param : params};
			DP.mushodo._mixedResponseMap[ind]= {ind: ind , registerId : i};
		}
		DP.mushodo.blnSyncInProgress = true;
		return DP.mushodo.post(mixedRequestArray, blnBlockGlobalEvents);
	},



	/**
	 * Same as sync above but ask for all the channels independently 
	 *   AWS Aurora allows multiple read nodes making things faster
	 * @param {boolean} blnBlockGlobalEvents block global events (e.g. show/hide the ajax on progress label)
	 * @return void
	 */
    syncAllIndependently: function(blnBlockGlobalEvents){
        //don't do anything if there isn't a request
		if(DP.mushodo._mixedChannelsArray.length == 0)
			return;
			
		for(var i  in DP.mushodo._mixedChannelsArray){
			// Do not process non-existant objects
			if(!DP.mushodo._mixedChannelsArray[i]) continue;
			
			// Do not process single calls
			if(DP.mushodo._mixedChannelsArray[i].singleCall) continue;

			register = DP.mushodo._mixedChannelsArray[i];

            if(register.getParams){
				fn = register.getParams;
				params = fn();
			}else
			    params = {};
			
			DP.mushodo.askSingle(register.channel , params , register.fnReturnHandler , register.fnOnError , false, blnBlockGlobalEvents);
			
		};
    },



	/**
	 * Communicate with server
	 * 
	 * @param {Object} objParam
	 * @param {boolean} blnBlockGlobalEvents block global events (e.g. show/hide the ajax on progress label)
	 */
	post: function(objParam, blnBlockGlobalEvents) {
		
		var $form = $('form:first');
		var state = $("#Qform__FormState").val();
		var created = $("#Qform__FormCreated").val();
		
		/* 
		 * Sanitize the post param so that empty arrays and objects are replaced
		 * by empty string.
		 * 
		 * @since version1.4.2
		 */
		//_log('::::::::Before sanitize ',objParam);
		objParam = DP.mushodo.sanitizePostParam(objParam);
		//_log("::::::::Sending request", objParam);
		
		var pdata = {
			Qform__FormId: $form.attr('id'),
			Qform__FormState: state,
			Qform__FormCreated: created,
			Qform__FormUpdates: '',
			Qform__FormCheckableControls: '',
			Qform__FormParameter: '',
			Qform__FormEvent: 'QChangeEvent',
			Qform__FormCallType: 'Ajax',
			Qform__FormControl: '',
			Qform__Mushodo: objParam
		};
		
		return jQuery.ajax({
			type: "POST",
			url: $form.attr('action'),
			dataType:"json",
			data: pdata,
			//async:false,
			error: function(xhr,thrownError){
					_log("status " , xhr.status , "obj " ,xhr , 'error ' , thrownError , 'Text' , xhr.responseText);
					//failCallback();
					//alert("WRONG!");
					
					// session has expired
						if(xhr.status == 417){
							history.go(0);
							return;
						}
						if(xhr.status == 412){
							DP.utils.redirectToLogin();
							return;
						}
					
					
					DP.mushodo.handleError();
				},
			success: function(objReply){
					//_log("server login");
					if(objReply)
						DP.mushodo.handleResponse(objReply);
				},
			global: (blnBlockGlobalEvents ? false : true)
		});
	},
	
	
	
	/**
	 * Sanitize the post param 
	 * 
	 * This method will process and sanitize the param object which is to be
	 * sent to the server via jquery.ajax
	 * 
	 * Since jquery-1.6.4, jquery.ajax will not send to the server an element
	 * that is an empty array or object. This may cause our code to break if
	 * it expects a certain key in the post array. This method which is invoked
	 * recursively checks all the elements that are to be posted and replaces
	 * empty arrays and objects with empty strings, so that the corresponding
	 * key does not get omitted from the post.
	 * 
	 * This is a Mushodo method but it can also be used as a utility from other
	 * modules where we do jquery.ajax on our own.
	 * 
	 * @author Theodore Raisis
	 * @since version1.4.2 & jquery-1.6.4
	 * 
	 * @param object objParam
	 * @return object objParam
	 */
	sanitizePostParam: function(objParam) {
		
		if(_.isArray(objParam) || _.isObject(objParam)) {
			_.each(objParam, function(mixValue, mixKey){
				if (mixValue) {
					if (_.isArray(mixValue)) { // only arrays return true for _.isArray, objects return false
						if (!mixValue.length) { // array has no items - make it empty string
							if(DP.mushodo.blnDebug) _log('empty array for key '+mixKey);
							objParam[mixKey] = '';
						} else { // array has items
							if (!mixValue.length) { // array does not have length, it is associative - make it an object
								if(DP.mushodo.blnDebug) _log('converting associative array to object for key '+mixKey);
								var mixValueProcessed = {};
								for (var k in mixValue) mixValueProcessed[k] = mixValue[k];
								mixValue = mixValueProcessed;
							}
							objParam[mixKey] = DP.mushodo.sanitizePostParam(mixValue);
						}
					} else if (_.isObject(mixValue)) { // both arrays and objects return true for _.isObject
						if (!_.size(mixValue)) { if(DP.mushodo.blnDebug)  _log('empty object for key '+mixKey); objParam[mixKey] = '';}
						else objParam[mixKey] = DP.mushodo.sanitizePostParam(mixValue);
					}
				}
			});
		}
		
		return objParam;
	},
	
	
	
	/**
	 * Ask a single question to server
	 *
	 * @param strChannel channel name
	 * @param mixedParams Parameters
	 * @param fnReturnHandler Function to be executed if call was successful
	 * @param fnOnError Function to be executed if call failed!
	 * @param blnSyncAll whether we synchronize everything else as well
	 * @param blnBlockGlobalEvents block global events (e.g. show/hide the ajax on progress label)
	 */
	askSingle : function(strChannel , mixedParams , fnReturnHandler , fnOnError , blnSyncAll, blnBlockGlobalEvents){
		// HACK for sending analytics
		if(strChannel == 'DPUsageCapture'){
			return DP.utils.recordAnalytics(mixedParams,"");
		}
		
		var ts = (new Date()).getTime();
		var i   = DP.mushodo.register(strChannel , null , fnReturnHandler , fnOnError , true);
		var ind = "sin" + ts + "_" + i;
		DP.mushodo._mixedResponseMap[ind] = {ind: ind , registerId : i , pop : true};
		var mixedRequestArray = {};
		mixedRequestArray[ind] = {channel : strChannel , param : mixedParams};
		if(blnSyncAll)
			return DP.mushodo.sync(mixedRequestArray, false);
		else
			return DP.mushodo.post(mixedRequestArray, blnBlockGlobalEvents);
	},
	

	/**
	 * Ask multiple questions to server
	 *
	 * @param mixedQuestionsArray   Must be an array objects, each of whom have these properties ( channel , params [optional] , returnHandler [optional] , error [optional] )
	 * @param blnSyncAll whether we synchronize everything else as well
	 * @param blnBlockGlobalEvents block global events (e.g. show/hide the ajax on progress label)
	 */
	askMultiple : function( mixedQuestionsArray , blnSyncAll, blnBlockGlobalEvents){
		var strChannel , mixedParams , fnReturnHandler , fnOnError;
		var mixedRequestArray = {};

		for(var k in mixedQuestionsArray){
			
			if(!mixedQuestionsArray[k].channel){
				if(DP.mushodo.blnDebug) _log("channel must be provided the request Array");
				continue;
			}
			
			strChannel = mixedQuestionsArray[k].channel;
			if(mixedQuestionsArray[k].params)
				mixedParams = mixedQuestionsArray[k].params;
			else
				mixedParams = null;
			
			if(mixedQuestionsArray[k].returnHandler)
				fnReturnHandler = mixedQuestionsArray[k].returnHandler;
			else
				fnReturnHandler = null;
			
			if(mixedQuestionsArray[k].error)
				fnOnError = mixedQuestionsArray[k].error;
			else
				fnOnError = null;
			
			// push this request with a unique timestamp
			var ts = (new Date()).getTime() + "_" + Math.floor(Math.random()*10000);
			var i   = DP.mushodo.register(strChannel , null , fnReturnHandler , fnOnError , true);
			var ind = "sin" + ts + "_" + i;
			DP.mushodo._mixedResponseMap[ind] = {ind: ind , registerId : i , pop : true};
			mixedRequestArray[ind] = {channel : strChannel , param : mixedParams};
			
		}
		
		if(DP.mushodo.blnDebug) _log("Sending multiple request");
		if(DP.mushodo.blnDebug) _log(mixedRequestArray);
		
		if(blnSyncAll)
			return DP.mushodo.sync(mixedRequestArray, false);
		else
			return DP.mushodo.post(mixedRequestArray, blnBlockGlobalEvents);
	},	
	
	
	
	
	/**
	 * Handle response from server side
	 * 
	 * @param {Object} objReply mixed json object
	 */
	handleResponse : function (objReply){
		var result , registerId;
		if(DP.mushodo.blnDebug) _log("Mushodo reply" , objReply);
		DP.mushodo.blnSyncInProgress = false;
		for(var key in objReply){
			result = objReply[key];
			
			// Form state has been updated?
			if(key == 'Qform__FormCreated'){
				if(DP.mushodo.blnDebug) _log("Updated form stage");
				$("#Qform__FormCreated").val(result);
				continue;
			}

			if(key == 'Mushodo__RequestTime'){
				if(DP.mushodo.blnDebug) _log("Last modified time is " + result);
				DP.mushodo.intLastCommTimestamp = result;
				continue;
			}



            // Running javascript
			if((key == 'Mushodo__JS') || (key == 'Mushodo__PriorityJS') ){
				if(DP.mushodo.blnDebug) _log("Received base64 JS");
				var js = DP.base64Decode(result);
				try{
				    eval(js);
				}catch(e){
				    _log("Mushodo Error" , e);
				    // DO nothing... continue..
				}
				continue;
			}
			
			
			//find the request in Key
			for(var i in DP.mushodo._mixedResponseMap){
				if(DP.mushodo._mixedResponseMap[i].ind == key){
					registerId = DP.mushodo._mixedResponseMap[i].registerId;
					//_log("Processing " + i + " with " + registerId, ' result ',result);
					if(DP.mushodo._mixedChannelsArray[registerId] && DP.mushodo._mixedChannelsArray[registerId].success)
						DP.mushodo._mixedChannelsArray[registerId].success(result);
					
					if(DP.mushodo._mixedResponseMap[i] && DP.mushodo._mixedResponseMap[i].pop)
						DP.mushodo.unregister(registerId);
						
					// Processed so remove
					delete DP.mushodo._mixedResponseMap[i];
				}
			}
		}
		
	} ,
	
	
	
	/**
	 * Handle error on server communication failure
	 */
	handleError : function(){
		//find the request in Key
		for(i in DP.mushodo._mixedResponseMap){
				registerId = DP.mushodo._mixedResponseMap[i].registerId;
				if(DP.mushodo._mixedChannelsArray[registerId].error)
					DP.mushodo._mixedChannelsArray[registerId].error();
				
				if(DP.mushodo._mixedResponseMap[i].pop)
					DP.mushodo.unregister(registerId);
					
				// Processed so remove
				delete DP.mushodo._mixedResponseMap[i];
		}
		
		
	},
	
	
	/**
	 * Update given QCodo control with given variables and partials
	 * We assume that there is a node called strDivId_mustache which has the template of the mustache control.
	 * 
	 * 
	 * @param {String} strDivId
	 * @param {Array} mixedVariables
	 * @param {String} strTemplateId
	 * @return void
	 */
	updateDivById : function(strDivId , mixedVariables , strTemplateId){
		
		$div = $("#" + strDivId);
		if($div.length ==0) return;
		
		// No change ?? nothing to do then
		if((typeof(mixedVariables) == "string")   && (mixedVariables == DP.mushodo.flagNochange)) return;

		// Deleted??
		if((typeof(mixedVariables) == "string")   && (mixedVariables == DP.mushodo.flagDeleted)){
			$div.empty(); // TODO should we run another function?? 
			return;
		}

		
		
		if(strTemplateId)
			var tempElem = document.getElementById(strTemplateId);
		else
			var tempElem = document.getElementById(strDivId + "_mustache");
		
		if(!tempElem){
			if(DP.mushodo.blnDebug) _log("Mustache template not found");
			return;
		}
		var template = tempElem.innerHTML;
        
		
		var arrPartialNames = $div.data('_partials');
		var partial = null , partElem , partName;
		if(arrPartialNames && (arrPartialNames.length>0)){
			partial = {};
			for(var i in arrPartialNames){
				partName = arrPartialNames[i];
				partElem = document.getElementById(strDivId + "_mustache_partial_" + partName);
				if(partElem)
					partial[partName] = partElem.innerHTML;
			}
		}
		
		// Update the modified time
		$div.data('modified' , DP.mushodo.intLastCommTimestamp);
		
		$div.html(Mustache.to_html(template, mixedVariables, partial));
	},
	
	
	
	
	/**
	 * Updates a div's repeater children by given records
	 *
	 * @param string strDivId  master div
	 * @param array  recordsArray    available records
	 */
	updateRepeater : function(strDivId , recordsArray){
	    var $div = $("#" + strDivId);
		if($div.length ==0) return;

		
		// No change ?? nothing to do then
		if((typeof(recordsArray) == "string")   && (recordsArray == DP.mushodo.flagNochange)) return;
		
		
	    var id, record, $itemDiv,template , content;

		var tempElem = document.getElementById(strDivId + "_mustache_partial_repeater");
		if(!tempElem){
			if(DP.mushodo.blnDebug) _log("Mustache template not found");
			return;
		}
		var template = tempElem.innerHTML;


		// Update the modified time
		$div.data('modified' , DP.mushodo.intLastCommTimestamp);

	    
	    for(var i in recordsArray){
	        record = recordsArray[i];
	        
	        // No change ?? nothing to do then
			if((typeof(record) == "string")   && (record == DP.mushodo.flagNochange)) continue;

			// Deleted??
			if((typeof(record) == "string")   && (record == DP.mushodo.flagDeleted)){
				$("#" + strDivId + "_" + i).remove();
				continue;
			}
	        
	        
	        id = i;
	        content = Mustache.to_html(template, record, null);
	        content = $(content).data('id' , i).data('modified' , DP.mushodo.intLastCommTimestamp);
	        
	        
	        $itemDiv = $("#" + strDivId + "_" + i);
	        
	        // it doesn't exist??? So new content?
	        if($itemDiv.length == 0){
	            $itemDiv = content;
	            $div.append($itemDiv);
	            continue;
	        }
	        
	        $itemDiv.replaceWith(content);
	    }
	
	
	},
	
	
	
	
	/**
	 * For given repeater
	 *    Construct an Array of [id => modificationTime]
	 *    
	 * @param string strRepeaterId
	 * @return array
	 */
	getRepeaterModificationArray : function(strRepeaterId){
		var retArray = {};
		var $div = $("#" + strRepeaterId);
		
		var $this , id , strTag;
		
		if($div.length == 0) return retArray;
		
		
		if($div.is("table") || $div.is("tbody")) // for tables it will be tr tags
			strTag = "tr";
		else				// for div it will be  div
			strTag = "div";
		// TODO , may be this should be fetched from the repeater 
		
		
		$div.find(strTag).each(function(){
			$this = $(this);
			id = $this.data('id');
			if(id) retArray["" + id] = $this.data('modified');
		});
		
		
		return retArray;
	},
	
	
	// dummy
	_ns: 'DP.mushodo'
	
};
