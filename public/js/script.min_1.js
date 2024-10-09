!function(){"use strict";!function(){var e="relevanssi_live_search";function s(e){this.config=null,this.input_el=e,this.results_id=null,this.results_el=null,this.messages=null,this.parent_el=null,this.results_showing=!1,this.form_el=null,this.timer=!1,this.last_string="",this.spinner=null,this.spinner_showing=!1,this.has_results=!1,this.current_request=!1,this.results_destroy_on_blur=!0,this.a11y_keys=[27,40,13,38,9],this.init()}s.prototype={init:function(){var e=this,s=this.input_el;this.form_el=s.parents("form:eq(0)"),this.results_id=this.uniqid("relevanssi_live_search_results_");var t=!1,r=s.data("rlvconfig");if(r&&void 0!==r)for(var i in relevanssi_live_search_params.config)r===i&&(t=!0,this.config=relevanssi_live_search_params.config[i]);else for(var a in relevanssi_live_search_params.config)"default"===a&&(t=!0,this.config=relevanssi_live_search_params.config[a]);if(t){s.attr("autocomplete","off"),s.attr("aria-owns",this.results_id),s.attr("aria-autocomplete","both");var n='<div aria-expanded="false" aria-live="polite" class="relevanssi-live-search-results" id="'+this.results_id+'" role="listbox" tabindex="0">';n+='<div class="ajax-results"></div>',n+="</div>";var l=s.data("rlvparentel");l?(this.parent_el=jQuery(l),this.parent_el.html(n)):this.config.parent_el?(this.parent_el=jQuery(this.config.parent_el),this.parent_el.html(n)):jQuery("body").append(jQuery(n)),this.results_el=jQuery("#"+this.results_id),this.messages=this.results_el.find(".live-ajax-messages"),this.position_results(),jQuery(window).on("resize",(function(){setTimeout((function(){s.closest("form").is(":hidden")?e.destroy_results():e.position_results()}),100)})),void 0===this.config.abort_on_enter&&(this.config.abort_on_enter=!0),s.on("keyup input",(function(s){jQuery.inArray(s.keyCode,e.a11y_keys)>-1||(e.current_request&&e.config.abort_on_enter&&13===s.keyCode&&e.current_request.abort(),e.input_el.val().trim().length?e.results_showing&&s.currentTarget.value.length<e.config.input.min_chars?e.destroy_results():!e.results_showing&&s.currentTarget.value.length>=e.config.input.min_chars&&(e.position_results(),e.results_el.addClass("relevanssi-live-search-results-showing"),e.show_spinner(e.results_el),e.results_showing=!0):e.destroy_results(),e.has_results&&!e.spinner_showing&&e.last_string!==e.input_el.val().trim()&&(e.results_el.find(".ajax-results").empty(),e.results_el.find(".live-ajax-messages").replaceWith(e.messages),e.results_el.find(".live-ajax-messages").append("<p class='screen-reader-text' id='relevanssi-live-search-status' role='status' aria-live='polite'>"+relevanssi_live_search_params.msg_loading_results+"</p>"),e.show_spinner(e.results_el)))})).on("keyup input",jQuery.proxy(this.maybe_search,this)),(this.config.results_destroy_on_blur||void 0===this.config.results_destroy_on_blur)&&jQuery("html").on("click",(function(s){jQuery(s.target).parents(".relevanssi-live-search-results").length||e.destroy_results()})),s.on("click",(function(e){e.stopPropagation()}))}else alert(relevanssi_live_search_params.msg_no_config_found);this.load_ajax_messages_template()},load_ajax_messages_template:function(){relevanssi_live_search_params.messages_template?(this.results_el.prepend(relevanssi_live_search_params.messages_template),this.messages=relevanssi_live_search_params.messages_template):jQuery.ajax({url:relevanssi_live_search_params.ajaxurl,data:"action=relevanssi_live_search_messages",dataType:"json",type:"GET",complete:function(e,s){},error:function(e,s,t){},success:function(e){this.results_el.prepend(e),this.messages=e}.bind(this)})},search:function(e){var s=this,t=this.form_el,r=t.serialize(),i=t.attr("action")?t.attr("action"):"",a=this.input_el,n=this.results_el;jQuery(document).trigger("relevanssi_live_search_start",[a,n,t,i,r]),this.aria_expanded(!1),r+="&action=relevanssi_live_search&rlvquery="+encodeURIComponent(a.val()),-1!==i.indexOf("?")&&(i=i.split("?"),r+="&"+i[1]),this.last_string=a.val(),this.has_results=!0,this.current_request=jQuery.ajax({url:relevanssi_live_search_params.ajaxurl,type:"POST",data:r,complete:function(){jQuery(document).trigger("relevanssi_live_search_complete",[a,n,t,i,r]),s.spinner_showing=!1,s.hide_spinner(s.results_el),this.current_request=!1,jQuery(document).trigger("relevanssi_live_search_shutdown",[a,n,t,i,r])},success:function(e){0===e&&(e=""),jQuery(document).trigger("relevanssi_live_search_success",[a,n,t,i,r]),s.position_results(),n.find(".ajax-results").html(e),s.aria_expanded(!0),s.keyboard_navigation(),jQuery(document).trigger("relevanssi_live_search_shutdown",[a,n,t,i,r])}})},keyboard_navigation:function(){var e=this,s=this.input_el,t=this.results_el,r="relevanssi-live-search-result--focused",i=".relevanssi-live-search-result",a=this.a11y_keys;jQuery(document).off("keyup.relevanssi_a11y").on("keyup.relevanssi_a11y",(function(n){if(t.hasClass("relevanssi-live-search-results-showing")){if(-1!==jQuery.inArray(n.keyCode,a)){if(n.preventDefault(),27===n.keyCode&&!s.is(":focus"))return e.destroy_results(),jQuery(document).off("keyup.relevanssi_a11y"),s.trigger("focus"),void jQuery(document).trigger("relevanssi_live_escape_results");if(40===n.keyCode){var l=jQuery(t[0]).find("."+r);1===l.length&&1===l.next().length?l.removeClass(r).attr("aria-selected","false").next().addClass(r).attr("aria-selected","true").find("a").trigger("focus"):(l.removeClass(r).attr("aria-selected","false"),t.find(i+":first").addClass(r).attr("aria-selected","true").find("a").trigger("focus")),jQuery(document).trigger("relevanssi_live_key_arrowdown_pressed")}if(38===n.keyCode){var o=jQuery(t[0]).find("."+r);1===o.length&&1===o.prev().length?o.removeClass(r).attr("aria-selected","false").prev().addClass(r).attr("aria-selected","true").find("a").trigger("focus"):(o.removeClass(r).attr("aria-selected","false"),t.find(i+":last").addClass(r).attr("aria-selected","true").find("a").trigger("focus")),jQuery(document).trigger("relevanssi_live_key_arrowup_pressed")}13===n.keyCode&&jQuery(document).trigger("relevanssi_live_key_enter_pressed"),9===n.keyCode&&jQuery(document).trigger("relevanssi_live_key_tab_pressed")}}else jQuery(document).off("keyup.relevanssi_a11y")})),jQuery(document).trigger("relevanssi_live_keyboad_navigation")},aria_expanded:function(e){var s=this.results_el;e?s.attr("aria-expanded","true"):s.attr("aria-expanded","false"),jQuery(document).trigger("relevanssi_live_aria_expanded")},position_results:function(){var e=this.input_el,s=e.offset(),t=this.results_el,r=0,i=e.closest("form");if(!e.is(":hidden")&&!i.is(":hidden")){if(s.top=this.better_offset(this.config.results.static_offset,e),this.parent_el){switch(s.left+=parseInt(this.config.results.offset.x,10),s.top+=parseInt(this.config.results.offset.y,10),this.config.results.position){case"top":r=0-t.height();break;default:r=e.outerHeight()}t.css("left",s.left),t.css("top",s.top+r+"px")}else{switch(s.left+=parseInt(this.config.results.offset.x,10),s.top+=parseInt(this.config.results.offset.y,10),this.config.results.position){case"top":r=0-t.height();break;default:r=e.outerHeight()}t.css("left",s.left),t.css("top",s.top+r+"px")}"auto"===this.config.results.width&&t.width(e.outerWidth()-parseInt(t.css("paddingRight").replace("px",""),10)-parseInt(t.css("paddingLeft").replace("px",""),10)),jQuery(document).trigger("relevanssi_live_position_results",[t.css("left"),t.css("top"),t.width()])}},better_offset:function(e,s,t){e="boolean"!=typeof e||e,s="object"==typeof s?s:$(s),t=null!=t?"object"==typeof t?t:$(t):null;var r=jQuery(window).scrollTop(),i=s.offset().top;if(t)var a=t.offset().top,n=t.scrollTop();return e?t?i-a+n:i:t?i-a:i-r},destroy_results:function(e){this.hide_spinner(this.results_el),this.aria_expanded(!1),this.results_el.find(".ajax-results").empty(),this.results_el.removeClass("relevanssi-live-search-results-showing"),this.results_showing=!1,this.has_results=!1,jQuery(document).trigger("relevanssi_live_destroy_results")},maybe_search:function(e){jQuery.inArray(e.keyCode,this.a11y_keys)>-1||(clearTimeout(this.timer),e.currentTarget.value.length>=this.config.input.min_chars&&(this.current_request&&this.current_request.abort(),this.timer=setTimeout(jQuery.proxy(this.search,this,e),this.config.input.delay)))},show_spinner:function(e){jQuery("#relevanssi-live-ajax-search-spinner",e).addClass("rlv-has-spinner")},hide_spinner:function(e){jQuery("#relevanssi-live-ajax-search-spinner",e).removeClass("rlv-has-spinner")},uniqid:function(e,s){var t;void 0===e&&(e="");var r=function(e,s){return s<(e=parseInt(e,10).toString(16)).length?e.slice(e.length-s):s>e.length?new Array(s-e.length+1).join("0")+e:e};return this.php_js||(this.php_js={}),this.php_js.uniqidSeed||(this.php_js.uniqidSeed=Math.floor(123456789*Math.random())),this.php_js.uniqidSeed++,t=e,t+=r(parseInt((new Date).getTime()/1e3,10),8),t+=r(this.php_js.uniqidSeed,5),s&&(t+=(10*Math.random()).toFixed(8).toString()),t}},jQuery.fn[e]=function(t){return this.each((function(){jQuery.data(this,"plugin_"+e)||jQuery.data(this,"plugin_"+e,new s(jQuery(this),t))})),this}}(),jQuery(document).ready((function(){"function"==typeof jQuery().relevanssi_live_search&&jQuery('input[data-rlvlive="true"]').relevanssi_live_search()}))}();