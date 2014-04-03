(function(){var b=0;var c=["ms","moz","webkit","o"];for(var a=0;a<c.length&&!window.requestAnimationFrame;++a){window.requestAnimationFrame=window[c[a]+"RequestAnimationFrame"];window.cancelRequestAnimationFrame=window[c[a]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame){window.requestAnimationFrame=function(h,e){var d=new Date().getTime();var f=Math.max(0,16-(d-b));var g=window.setTimeout(function(){h(d+f)},f);b=d+f;return g}}if(!window.cancelAnimationFrame){window.cancelAnimationFrame=function(d){clearTimeout(d)}}}());if(!Array.indexOf){Array.prototype.indexOf=function(c){for(var b=0,a=this.length;b<a;b++){if(this[b]==c){return b}}return -1}}function obj_length(c){if(c.length!==undefined){return c.length}var b=0;for(var a in c){b++}return b}$.fn.makeAbsolute=function(a){return this.each(function(){var b=$(this);var c=b.position();b.css({position:"absolute",marginLeft:0,marginTop:0,top:c.top,left:c.left,right:$(window).width()-(c.left+b.width())});if(a){b.remove().appendTo("body")}})};function make_popupmenu(b,c){var a=(b.data("menu_options"));b.data("menu_options",c);if(a){return}b.bind("click.show_popup",function(d){$(".popmenu-wrapper").remove();setTimeout(function(){var g=$("<ul class='dropdown-menu' id='"+b.attr("id")+"-menu'></ul>");var f=b.data("menu_options");if(obj_length(f)<=0){$("<li>No Options.</li>").appendTo(g)}$.each(f,function(j,i){if(i){var l=i.action||i;g.append($("<li></li>").append($("<a>").attr("href",i.url).html(j).click(l)))}else{g.append($("<li></li>").addClass("head").append($("<a href='#'></a>").html(j)))}});var h=$("<div class='popmenu-wrapper' style='position: absolute;left: 0; top: -1000;'></div>").append(g).appendTo("body");var e=d.pageX-h.width()/2;e=Math.min(e,$(document).scrollLeft()+$(window).width()-$(h).width()-5);e=Math.max(e,$(document).scrollLeft()+5);h.css({top:d.pageY,left:e})},10);setTimeout(function(){var f=function(h){$(h).bind("click.close_popup",function(){$(".popmenu-wrapper").remove();h.unbind("click.close_popup")})};f($(window.document));f($(window.top.document));for(var e=window.top.frames.length;e--;){var g=$(window.top.frames[e].document);f(g)}},50);return false})}function make_popup_menus(a){a=a||document;$(a).find("div[popupmenu]").each(function(){var b={};var d=$(this);d.find("a").each(function(){var g=$(this),i=g.get(0),e=i.getAttribute("confirm"),f=i.getAttribute("href"),h=i.getAttribute("target");if(!f){b[g.text()]=null}else{b[g.text()]={url:f,action:function(){if(!e||confirm(e)){if(h){window.open(f,h);return false}else{g.click()}}}}}});var c=$(a).find("#"+d.attr("popupmenu"));c.find("a").bind("click",function(f){f.stopPropagation();return true});make_popupmenu(c,b);c.addClass("popup");d.remove()})}function naturalSort(j,h){var p=/(-?[0-9\.]+)/g,k=j.toString().toLowerCase()||"",g=h.toString().toLowerCase()||"",l=String.fromCharCode(0),n=k.replace(p,l+"$1"+l).split(l),e=g.replace(p,l+"$1"+l).split(l),d=(new Date(k)).getTime(),o=d?(new Date(g)).getTime():null;if(o){if(d<o){return -1}else{if(d>o){return 1}}}var m,f;for(var i=0,c=Math.max(n.length,e.length);i<c;i++){m=parseFloat(n[i])||n[i];f=parseFloat(e[i])||e[i];if(m<f){return -1}else{if(m>f){return 1}}}return 0}$.fn.refresh_select2=function(){var b=$(this);var a={width:"resolve",closeOnSelect:!b.is("[MULTIPLE]")};return b.select2(a)};function replace_big_select_inputs(a,c,b){if(!jQuery.fn.select2){return}if(a===undefined){a=20}if(c===undefined){c=3000}b=b||$("select");b.each(function(){var e=$(this);var d=e.find("option").length;if((d<a)||(d>c)){return}if(e.hasClass("no-autocomplete")){return}e.refresh_select2()})}$.fn.make_text_editable=function(g){var d=("num_cols" in g?g.num_cols:30),c=("num_rows" in g?g.num_rows:4),e=("use_textarea" in g?g.use_textarea:false),b=("on_finish" in g?g.on_finish:null),f=("help_text" in g?g.help_text:null);var a=$(this);a.addClass("editable-text").click(function(l){if($(this).children(":input").length>0){return}a.removeClass("editable-text");var i=function(m){a.find(":input").remove();if(m!==""){a.text(m)}else{a.html("<br>")}a.addClass("editable-text");if(b){b(m)}};var h=("cur_text" in g?g.cur_text:a.text()),k,j;if(e){k=$("<textarea/>").attr({rows:c,cols:d}).text($.trim(h)).keyup(function(m){if(m.keyCode===27){i(h)}});j=$("<button/>").text("Done").click(function(){i(k.val());return false})}else{k=$("<input type='text'/>").attr({value:$.trim(h),size:d}).blur(function(){i(h)}).keyup(function(m){if(m.keyCode===27){$(this).trigger("blur")}else{if(m.keyCode===13){i($(this).val())}}})}a.text("");a.append(k);if(j){a.append(j)}k.focus();k.select();l.stopPropagation()});if(f){a.attr("title",f).tooltip()}return a};function async_save_text(d,f,e,a,c,h,i,g,b){if(c===undefined){c=30}if(i===undefined){i=4}$("#"+d).click(function(){if($("#renaming-active").length>0){return}var l=$("#"+f),k=l.text(),j;if(h){j=$("<textarea></textarea>").attr({rows:i,cols:c}).text($.trim(k))}else{j=$("<input type='text'></input>").attr({value:$.trim(k),size:c})}j.attr("id","renaming-active");j.blur(function(){$(this).remove();l.show();if(b){b(j)}});j.keyup(function(n){if(n.keyCode===27){$(this).trigger("blur")}else{if(n.keyCode===13){var m={};m[a]=$(this).val();$(this).trigger("blur");$.ajax({url:e,data:m,error:function(){alert("Text editing for elt "+f+" failed")},success:function(o){if(o!==""){l.text(o)}else{l.html("<em>None</em>")}if(b){b(j)}}})}}});if(g){g(j)}l.hide();j.insertAfter(l);j.focus();j.select();return})}function init_history_items(d,a,c){var b=function(){try{var e=$.jStorage.get("history_expand_state");if(e){for(var g in e){$("#"+g+" div.historyItemBody").show()}}}catch(f){$.jStorage.deleteKey("history_expand_state")}if($.browser.mozilla){$("div.historyItemBody").each(function(){if(!$(this).is(":visible")){$(this).find("pre.peek").css("overflow","hidden")}})}d.each(function(){var j=this.id,h=$(this).children("div.historyItemBody"),i=h.find("pre.peek");$(this).find(".historyItemTitleBar > .historyItemTitle").wrap("<a href='javascript:void(0);'></a>").click(function(){var k;if(h.is(":visible")){if($.browser.mozilla){i.css("overflow","hidden")}h.slideUp("fast");if(!c){k=$.jStorage.get("history_expand_state");if(k){delete k[j];$.jStorage.set("history_expand_state",k)}}}else{h.slideDown("fast",function(){if($.browser.mozilla){i.css("overflow","auto")}});if(!c){k=$.jStorage.get("history_expand_state");if(!k){k={}}k[j]=true;$.jStorage.set("history_expand_state",k)}}return false})});$("#top-links > a.toggle").click(function(){var h=$.jStorage.get("history_expand_state");if(!h){h={}}$("div.historyItemBody:visible").each(function(){if($.browser.mozilla){$(this).find("pre.peek").css("overflow","hidden")}$(this).slideUp("fast");if(h){delete h[$(this).parent().attr("id")]}});$.jStorage.set("history_expand_state",h)}).show()};b()}function commatize(b){b+="";var a=/(\d+)(\d{3})/;while(a.test(b)){b=b.replace(a,"$1,$2")}return b}function reset_tool_search(a){var c=$("#galaxy_tools").contents();if(c.length===0){c=$(document)}$(this).removeClass("search_active");c.find(".toolTitle").removeClass("search_match");c.find(".toolSectionBody").hide();c.find(".toolTitle").show();c.find(".toolPanelLabel").show();c.find(".toolSectionWrapper").each(function(){if($(this).attr("id")!=="recently_used_wrapper"){$(this).show()}else{if($(this).hasClass("user_pref_visible")){$(this).show()}}});c.find("#search-no-results").hide();c.find("#search-spinner").hide();if(a){var b=c.find("#tool-search-query");b.val("search tools")}}var GalaxyAsync=function(a){this.url_dict={};this.log_action=(a===undefined?false:a)};GalaxyAsync.prototype.set_func_url=function(a,b){this.url_dict[a]=b};GalaxyAsync.prototype.set_user_pref=function(a,b){var c=this.url_dict[arguments.callee];if(c===undefined){return false}$.ajax({url:c,data:{pref_name:a,pref_value:b},error:function(){return false},success:function(){return true}})};GalaxyAsync.prototype.log_user_action=function(c,b,d){if(!this.log_action){return}var a=this.url_dict[arguments.callee];if(a===undefined){return false}$.ajax({url:a,data:{action:c,context:b,params:d},error:function(){return false},success:function(){return true}})};function init_refresh_on_change(){$("select[refresh_on_change='true']").off("change").change(function(){var a=$(this),e=a.val(),d=false,c=a.attr("refresh_on_change_values");if(c){c=c.split(",");var b=a.attr("last_selected_value");if($.inArray(e,c)===-1&&$.inArray(b,c)===-1){return}}$(window).trigger("refresh_on_change");$(document).trigger("convert_to_values");a.get(0).form.submit()});$(":checkbox[refresh_on_change='true']").off("click").click(function(){var a=$(this),e=a.val(),d=false,c=a.attr("refresh_on_change_values");if(c){c=c.split(",");var b=a.attr("last_selected_value");if($.inArray(e,c)===-1&&$.inArray(b,c)===-1){return}}$(window).trigger("refresh_on_change");a.get(0).form.submit()});$("a[confirm]").off("click").click(function(){return confirm($(this).attr("confirm"))})}$(document).ready(function(){init_refresh_on_change();if($.fn.tooltip){$(".unified-panel-header [title]").tooltip({placement:"bottom"});$("[title]").tooltip()}make_popup_menus();replace_big_select_inputs(20,1500);$("a").click(function(){var b=$(this);var c=(parent.frames&&parent.frames.galaxy_main);if((b.attr("target")=="galaxy_main")&&(!c)){var a=b.attr("href");if(a.indexOf("?")==-1){a+="?"}else{a+="&"}a+="use_panels=True";b.attr("href",a);b.attr("target","_self")}return b})});