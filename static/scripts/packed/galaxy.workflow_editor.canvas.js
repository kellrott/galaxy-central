var Terminal=Backbone.Model.extend({initialize:function(a){this.element=a.element;this.connectors=[]},connect:function(a){this.connectors.push(a);if(this.node){this.node.markChanged()}},disconnect:function(a){this.connectors.splice($.inArray(a,this.connectors),1);if(this.node){this.node.markChanged()}},redraw:function(){$.each(this.connectors,function(a,b){b.redraw()})},destroy:function(){$.each(this.connectors.slice(),function(a,b){b.destroy()})}});var OutputTerminal=Terminal.extend({initialize:function(a){Terminal.prototype.initialize.call(this,a);this.datatypes=a.datatypes}});var InputTerminal=Terminal.extend({initialize:function(a){Terminal.prototype.initialize.call(this,a);this.datatypes=a.datatypes;this.multiple=a.multiple},can_accept:function(a){if(this.connectors.length<1||this.multiple){for(var c in this.datatypes){var f=new Array();f=f.concat(a.datatypes);if(a.node.post_job_actions){for(var d in a.node.post_job_actions){var g=a.node.post_job_actions[d];if(g.action_type=="ChangeDatatypeAction"&&(g.output_name==""||g.output_name==a.name)&&g.action_arguments){f.push(g.action_arguments.newtype)}}}for(var b in f){if(f[b]=="input"||issubtype(f[b],this.datatypes[c])){return true}}}}return false}});function Connector(b,a){this.canvas=null;this.dragging=false;this.inner_color="#FFFFFF";this.outer_color="#D8B365";if(b&&a){this.connect(b,a)}}$.extend(Connector.prototype,{connect:function(b,a){this.handle1=b;if(this.handle1){this.handle1.connect(this)}this.handle2=a;if(this.handle2){this.handle2.connect(this)}},destroy:function(){if(this.handle1){this.handle1.disconnect(this)}if(this.handle2){this.handle2.disconnect(this)}$(this.canvas).remove()},redraw:function(){var d=$("#canvas-container");if(!this.canvas){this.canvas=document.createElement("canvas");if(window.G_vmlCanvasManager){G_vmlCanvasManager.initElement(this.canvas)}d.append($(this.canvas));if(this.dragging){this.canvas.style.zIndex="300"}}var n=function(c){return $(c).offset().left-d.offset().left};var i=function(c){return $(c).offset().top-d.offset().top};if(!this.handle1||!this.handle2){return}var h=n(this.handle1.element)+5;var g=i(this.handle1.element)+5;var p=n(this.handle2.element)+5;var m=i(this.handle2.element)+5;var f=100;var k=Math.min(h,p);var a=Math.max(h,p);var j=Math.min(g,m);var t=Math.max(g,m);var b=Math.min(Math.max(Math.abs(t-j)/2,100),300);var o=k-f;var s=j-f;var q=a-k+2*f;var l=t-j+2*f;this.canvas.style.left=o+"px";this.canvas.style.top=s+"px";this.canvas.setAttribute("width",q);this.canvas.setAttribute("height",l);h-=o;g-=s;p-=o;m-=s;var r=this.canvas.getContext("2d");r.lineCap="round";r.strokeStyle=this.outer_color;r.lineWidth=7;r.beginPath();r.moveTo(h,g);r.bezierCurveTo(h+b,g,p-b,m,p,m);r.stroke();r.strokeStyle=this.inner_color;r.lineWidth=5;r.beginPath();r.moveTo(h,g);r.bezierCurveTo(h+b,g,p-b,m,p,m);r.stroke()}});var Node=Backbone.Model.extend({initialize:function(a){this.element=a.element;this.input_terminals={};this.output_terminals={};this.tool_errors={}},redraw:function(){$.each(this.input_terminals,function(a,b){b.redraw()});$.each(this.output_terminals,function(a,b){b.redraw()})},destroy:function(){$.each(this.input_terminals,function(a,b){b.destroy()});$.each(this.output_terminals,function(a,b){b.destroy()});workflow.remove_node(this);$(this.element).remove()},make_active:function(){$(this.element).addClass("toolForm-active")},make_inactive:function(){var a=this.element.get(0);(function(b){b.removeChild(a);b.appendChild(a)})(a.parentNode);$(a).removeClass("toolForm-active")},init_field_data:function(b){if(b.type){this.type=b.type}this.name=b.name;this.form_html=b.form_html;this.tool_state=b.tool_state;this.tool_errors=b.tool_errors;this.tooltip=b.tooltip?b.tooltip:"";this.annotation=b.annotation;this.post_job_actions=b.post_job_actions?b.post_job_actions:{};this.workflow_outputs=b.workflow_outputs?b.workflow_outputs:[];var a=this;var c=new NodeView({el:this.element[0],node:a,});a.nodeView=c;$.each(b.data_inputs,function(f,d){c.addDataInput(d)});if((b.data_inputs.length>0)&&(b.data_outputs.length>0)){c.addRule()}$.each(b.data_outputs,function(f,d){c.addDataOutput(d)});c.render();workflow.node_changed(this)},update_field_data:function(c){var b=this;nodeView=b.nodeView;this.tool_state=c.tool_state;this.form_html=c.form_html;this.tool_errors=c.tool_errors;this.annotation=c.annotation;var d=$.parseJSON(c.post_job_actions);this.post_job_actions=d?d:{};b.nodeView.renderToolErrors();var f=nodeView.$("div.inputs");var a=nodeView.newInputsDiv();$.each(c.data_inputs,function(h,g){b.nodeView.replaceDataInput(g,a)});f.replaceWith(a);f.find("div.input-data-row > .terminal").each(function(){this.terminal.destroy()});this.markChanged();this.redraw()},error:function(d){var a=$(this.element).find(".toolFormBody");a.find("div").remove();var c="<div style='color: red; text-style: italic;'>"+d+"</div>";this.form_html=c;a.html(c);workflow.node_changed(this)},markChanged:function(){workflow.node_changed(this)}});function Workflow(a){this.canvas_container=a;this.id_counter=0;this.nodes={};this.name=null;this.has_changes=false;this.active_form_has_changes=false}$.extend(Workflow.prototype,{add_node:function(a){a.id=this.id_counter;a.element.attr("id","wf-node-step-"+a.id);this.id_counter++;this.nodes[a.id]=a;this.has_changes=true;a.workflow=this},remove_node:function(a){if(this.active_node==a){this.clear_active_node()}delete this.nodes[a.id];this.has_changes=true},remove_all:function(){wf=this;$.each(this.nodes,function(b,a){a.destroy();wf.remove_node(a)})},rectify_workflow_outputs:function(){var b=false;var a=false;$.each(this.nodes,function(c,d){if(d.workflow_outputs&&d.workflow_outputs.length>0){b=true}$.each(d.post_job_actions,function(g,f){if(f.action_type==="HideDatasetAction"){a=true}})});if(b!==false||a!==false){$.each(this.nodes,function(c,g){if(g.type==="tool"){var f=false;if(g.post_job_actions==null){g.post_job_actions={};f=true}var d=[];$.each(g.post_job_actions,function(i,h){if(h.action_type=="HideDatasetAction"){d.push(i)}});if(d.length>0){$.each(d,function(h,j){f=true;delete g.post_job_actions[j]})}if(b){$.each(g.output_terminals,function(i,j){var h=true;$.each(g.workflow_outputs,function(l,m){if(j.name===m){h=false}});if(h===true){f=true;var k={action_type:"HideDatasetAction",output_name:j.name,action_arguments:{}};g.post_job_actions["HideDatasetAction"+j.name]=null;g.post_job_actions["HideDatasetAction"+j.name]=k}})}if(workflow.active_node==g&&f===true){workflow.reload_active_node()}}})}},to_simple:function(){var a={};$.each(this.nodes,function(c,f){var g={};$.each(f.input_terminals,function(i,j){g[j.name]=null;var h=[];$.each(j.connectors,function(k,l){h[k]={id:l.handle1.node.id,output_name:l.handle1.name};g[j.name]=h})});var b={};if(f.post_job_actions){$.each(f.post_job_actions,function(j,h){var k={action_type:h.action_type,output_name:h.output_name,action_arguments:h.action_arguments};b[h.action_type+h.output_name]=null;b[h.action_type+h.output_name]=k})}if(!f.workflow_outputs){f.workflow_outputs=[]}var d={id:f.id,type:f.type,tool_id:f.tool_id,tool_state:f.tool_state,tool_errors:f.tool_errors,input_connections:g,position:$(f.element).position(),annotation:f.annotation,post_job_actions:f.post_job_actions,workflow_outputs:f.workflow_outputs};a[f.id]=d});return{steps:a}},from_simple:function(b){wf=this;var c=0;wf.name=b.name;var a=false;$.each(b.steps,function(g,f){var d=prebuild_node(f.type,f.name,f.tool_id);d.init_field_data(f);if(f.position){d.element.css({top:f.position.top,left:f.position.left})}d.id=f.id;wf.nodes[d.id]=d;c=Math.max(c,parseInt(g));if(!a&&d.type==="tool"){if(d.workflow_outputs.length>0){a=true}else{$.each(d.post_job_actions,function(i,h){if(h.action_type==="HideDatasetAction"){a=true}})}}});wf.id_counter=c+1;$.each(b.steps,function(g,f){var d=wf.nodes[g];$.each(f.input_connections,function(i,h){if(h){if(!$.isArray(h)){h=[h]}$.each(h,function(k,j){var m=wf.nodes[j.id];var n=new Connector();n.connect(m.output_terminals[j.output_name],d.input_terminals[i]);n.redraw()})}});if(a&&d.type==="tool"){$.each(d.output_terminals,function(h,i){if(d.post_job_actions["HideDatasetAction"+i.name]===undefined){d.workflow_outputs.push(i.name);callout=$(d.element).find(".callout."+i.name);callout.find("img").attr("src",galaxy_config.root+"static/images/fugue/asterisk-small.png");workflow.has_changes=true}})}})},check_changes_in_active_form:function(){if(this.active_form_has_changes){this.has_changes=true;$("#right-content").find("form").submit();this.active_form_has_changes=false}},reload_active_node:function(){if(this.active_node){var a=this.active_node;this.clear_active_node();this.activate_node(a)}},clear_active_node:function(){if(this.active_node){this.active_node.make_inactive();this.active_node=null}parent.show_form_for_tool("<div>No node selected</div>")},activate_node:function(a){if(this.active_node!=a){this.check_changes_in_active_form();this.clear_active_node();parent.show_form_for_tool(a.form_html+a.tooltip,a);a.make_active();this.active_node=a}},node_changed:function(a){this.has_changes=true;if(this.active_node==a){this.check_changes_in_active_form();parent.show_form_for_tool(a.form_html+a.tooltip,a)}},layout:function(){this.check_changes_in_active_form();this.has_changes=true;var i={};var b={};$.each(this.nodes,function(l,k){if(i[l]===undefined){i[l]=0}if(b[l]===undefined){b[l]=[]}});$.each(this.nodes,function(l,k){$.each(k.input_terminals,function(m,n){$.each(n.connectors,function(p,q){var o=q.handle1.node;i[k.id]+=1;b[o.id].push(k.id)})})});node_ids_by_level=[];while(true){level_parents=[];for(var a in i){if(i[a]==0){level_parents.push(a)}}if(level_parents.length==0){break}node_ids_by_level.push(level_parents);for(var f in level_parents){var j=level_parents[f];delete i[j];for(var g in b[j]){i[b[j][g]]-=1}}}if(i.length){return}var d=this.nodes;var h=80;v_pad=30;var c=h;$.each(node_ids_by_level,function(k,l){l.sort(function(p,o){return $(d[p].element).position().top-$(d[o].element).position().top});var m=0;var n=v_pad;$.each(l,function(o,r){var q=d[r];var p=$(q.element);$(p).css({top:n,left:c});m=Math.max(m,$(p).width());n+=$(p).height()+v_pad});c+=m+h});$.each(d,function(k,l){l.redraw()})},bounds_for_all_nodes:function(){var d=Infinity,b=-Infinity,c=Infinity,a=-Infinity,f;$.each(this.nodes,function(h,g){e=$(g.element);f=e.position();d=Math.min(d,f.left);b=Math.max(b,f.left+e.width());c=Math.min(c,f.top);a=Math.max(a,f.top+e.width())});return{xmin:d,xmax:b,ymin:c,ymax:a}},fit_canvas_to_nodes:function(){var a=this.bounds_for_all_nodes();var f=this.canvas_container.position();var i=this.canvas_container.parent();var d=fix_delta(a.xmin,100);var h=fix_delta(a.ymin,100);d=Math.max(d,f.left);h=Math.max(h,f.top);var c=f.left-d;var g=f.top-h;var b=round_up(a.xmax+100,100)+d;var j=round_up(a.ymax+100,100)+h;b=Math.max(b,-c+i.width());j=Math.max(j,-g+i.height());this.canvas_container.css({left:c,top:g,width:b,height:j});this.canvas_container.children().each(function(){var k=$(this).position();$(this).css("left",k.left+d);$(this).css("top",k.top+h)})}});function fix_delta(a,b){if(a<b||a>3*b){new_pos=(Math.ceil(((a%b))/b)+1)*b;return(-(a-new_pos))}return 0}function round_up(a,b){return Math.ceil(a/b)*b}function prebuild_node(l,j,r){var i=$("<div class='toolForm toolFormInCanvas'></div>");var g=new Node({element:i});g.type=l;if(l=="tool"){g.tool_id=r}var n=$("<div class='toolFormTitle unselectable'>"+j+"</div>");i.append(n);i.css("left",$(window).scrollLeft()+20);i.css("top",$(window).scrollTop()+20);var m=$("<div class='toolFormBody'></div>");var h="<div><img height='16' align='middle' src='"+galaxy_config.root+"static/images/loading_small_white_bg.gif'/> loading tool info...</div>";m.append(h);g.form_html=h;i.append(m);var k=$("<div class='buttons' style='float: right;'></div>");k.append($("<div>").addClass("fa-icon-button fa fa-times").click(function(b){g.destroy()}));i.appendTo("#canvas-container");var d=$("#canvas-container").position();var c=$("#canvas-container").parent();var a=i.width();var q=i.height();i.css({left:(-d.left)+(c.width()/2)-(a/2),top:(-d.top)+(c.height()/2)-(q/2)});k.prependTo(n);a+=(k.width()+10);i.css("width",a);$(i).bind("dragstart",function(){workflow.activate_node(g)}).bind("dragend",function(){workflow.node_changed(this);workflow.fit_canvas_to_nodes();canvas_manager.draw_overview()}).bind("dragclickonly",function(){workflow.activate_node(g)}).bind("drag",function(o,p){var f=$(this).offsetParent().offset(),b=p.offsetX-f.left,s=p.offsetY-f.top;$(this).css({left:b,top:s});$(this).find(".terminal").each(function(){this.terminal.redraw()})});return g}function add_node(b,d,a){var c=prebuild_node(b,d,a);workflow.add_node(c);workflow.fit_canvas_to_nodes();canvas_manager.draw_overview();workflow.activate_node(c);return c}var ext_to_type=null;var type_to_type=null;function issubtype(b,a){b=ext_to_type[b];a=ext_to_type[a];return(type_to_type[b])&&(a in type_to_type[b])}function populate_datatype_info(a){ext_to_type=a.ext_to_class_name;type_to_type=a.class_to_classes}var NodeView=Backbone.View.extend({initialize:function(a){this.node=a.node;this.output_width=Math.max(150,this.$el.width());this.tool_body=this.$el.find(".toolFormBody");this.tool_body.find("div").remove();this.newInputsDiv().appendTo(this.tool_body)},render:function(){this.renderToolErrors();this.$el.css("width",Math.min(250,Math.max(this.$el.width(),this.output_width)))},renderToolErrors:function(){if(this.node.tool_errors){this.$el.addClass("tool-node-error")}else{this.$el.removeClass("tool-node-error")}},newInputsDiv:function(){return $("<div class='inputs'></div>")},updateMaxWidth:function(a){this.output_width=Math.max(this.output_width,a)},addRule:function(){this.tool_body.append($("<div class='rule'></div>"))},addDataInput:function(c){var d=new InputTerminalView({node:this.node,input:c});var f=d.el;var b=new DataInputView({terminalElement:f,input:c,nodeView:this,});var a=b.$el;var f=b.terminalElement;this.$(".inputs").append(a.prepend(f))},replaceDataInput:function(c,f){var g=new InputTerminalView({node:this.node,input:c});var d=g.el;this.$("div[name='"+c.name+"']").each(function(){$(this).find(".input-terminal").each(function(){var h=this.terminal.connectors[0];if(h){d.terminal.connectors[0]=h;h.handle2=d.terminal}});$(this).remove()});var b=new DataInputView({terminalElement:d,input:c,nodeView:this,skipResize:true,});var a=b.$el;f.append(a.prepend(d))},addDataOutput:function(a){var c=new OutputTerminalView({node:this.node,output:a});var b=new DataOutputView({output:a,terminalElement:c.el,nodeView:this,});this.tool_body.append(b.$el.append(b.terminalElement))}});var DataInputView=Backbone.View.extend({className:"form-row dataRow input-data-row",initialize:function(a){this.input=a.input;this.nodeView=a.nodeView;this.terminalElement=a.terminalElement;this.$el.attr("name",this.input.name).html(this.input.label);if(!a.skipResize){this.$el.css({position:"absolute",left:-1000,top:-1000,display:"none"});$("body").append(this.el);this.nodeView.updateMaxWidth(this.$el.outerWidth());this.$el.css({position:"",left:"",top:"",display:""});this.$el.remove()}},});var OutputCalloutView=Backbone.View.extend({tagName:"div",initialize:function(b){this.label=b.label;this.node=b.node;this.output=b.output;var a=this;this.$el.attr("class","callout "+this.label).css({display:"none"}).append($("<div class='buttons'></div>").append($("<img/>").attr("src",galaxy_config.root+"static/images/fugue/asterisk-small-outline.png").click(function(){if($.inArray(a.output.name,a.node.workflow_outputs)!=-1){a.node.workflow_outputs.splice($.inArray(a.output.name,a.node.workflow_outputs),1);a.$("img").attr("src",galaxy_config.root+"static/images/fugue/asterisk-small-outline.png")}else{a.node.workflow_outputs.push(a.output.name);a.$("img").attr("src",galaxy_config.root+"static/images/fugue/asterisk-small.png")}workflow.has_changes=true;canvas_manager.draw_overview()}))).tooltip({delay:500,title:"Mark dataset as a workflow output. All unmarked datasets will be hidden."});this.$el.css({top:"50%",margin:"-8px 0px 0px 0px",right:8});this.$el.show();this.resetImage()},resetImage:function(){if($.inArray(this.output.name,this.node.workflow_outputs)===-1){this.$("img").attr("src",galaxy_config.root+"static/images/fugue/asterisk-small-outline.png")}else{this.$("img").attr("src",galaxy_config.root+"static/images/fugue/asterisk-small.png")}},hoverImage:function(){this.$("img").attr("src",galaxy_config.root+"static/images/fugue/asterisk-small-yellow.png")}});var DataOutputView=Backbone.View.extend({className:"form-row dataRow",initialize:function(c){this.output=c.output;this.terminalElement=c.terminalElement;this.nodeView=c.nodeView;var a=this.output;var b=a.name;var d=this.nodeView.node;if(a.extensions.indexOf("input")<0){b=b+" ("+a.extensions.join(", ")+")"}this.$el.html(b);if(d.type=="tool"){var f=new OutputCalloutView({label:b,output:a,node:d,});this.$el.append(f.el);this.$el.hover(function(){f.hoverImage()},function(){f.resetImage()})}this.$el.css({position:"absolute",left:-1000,top:-1000,display:"none"});$("body").append(this.el);this.nodeView.updateMaxWidth(this.$el.outerWidth()+17);this.$el.css({position:"",left:"",top:"",display:""}).detach()}});var InputTerminalView=Backbone.View.extend({className:"terminal input-terminal",initialize:function(d){var h=d.node;var b=d.input;var c=b.name;var g=b.extensions;var a=b.multiple;var f=this.el.terminal=new InputTerminal({element:this.el,datatypes:g,multiple:a});f.node=h;f.name=c;h.input_terminals[c]=f},events:{dropinit:"onDropInit",dropstart:"onDropStart",dropend:"onDropEnd",drop:"onDrop",hover:"onHover",},onDropInit:function(b,c){var a=this.el.terminal;return $(c.drag).hasClass("output-terminal")&&a.can_accept(c.drag.terminal)},onDropStart:function(a,b){if(b.proxy.terminal){b.proxy.terminal.connectors[0].inner_color="#BBFFBB"}},onDropEnd:function(a,b){if(b.proxy.terminal){b.proxy.terminal.connectors[0].inner_color="#FFFFFF"}},onDrop:function(b,c){var a=this.el.terminal;new Connector(c.drag.terminal,a).redraw()},onHover:function(){var c=this.el;var b=c.terminal;if(b.connectors.length>0){var a=$("<div class='callout'></div>").css({display:"none"}).appendTo("body").append($("<div class='button'></div>").append($("<div/>").addClass("fa-icon-button fa fa-times").click(function(){$.each(b.connectors,function(f,d){if(d){d.destroy()}});a.remove()}))).bind("mouseleave",function(){$(this).remove()});a.css({top:$(c).offset().top-2,left:$(c).offset().left-a.width(),"padding-right":$(c).width()}).show()}},});var OutputTerminalView=Backbone.View.extend({className:"terminal output-terminal",initialize:function(c){var i=c.node;var a=c.output;var b=a.name;var h=a.extensions;var g=this.el;var f=g;var d=g.terminal=new OutputTerminal({element:g,datatypes:h});d.node=i;d.name=b;i.output_terminals[b]=d},events:{drag:"onDrag",dragstart:"onDragStart",dragend:"onDragEnd",},onDrag:function(b,c){var a=function(){var f=$(c.proxy).offsetParent().offset(),d=c.offsetX-f.left,g=c.offsetY-f.top;$(c.proxy).css({left:d,top:g});c.proxy.terminal.redraw();canvas_manager.update_viewport_overlay()};a();$("#canvas-container").get(0).scroll_panel.test(b,a)},onDragStart:function(b,f){$(f.available).addClass("input-terminal-active");workflow.check_changes_in_active_form();var a=$('<div class="drag-terminal" style="position: absolute;"></div>').appendTo("#canvas-container").get(0);a.terminal=new OutputTerminal({element:a});var g=new Connector();g.dragging=true;g.connect(this.el.terminal,a.terminal);return a},onDragEnd:function(a,b){b.proxy.terminal.connectors[0].destroy();$(b.proxy).remove();$(b.available).removeClass("input-terminal-active");$("#canvas-container").get(0).scroll_panel.stop()}});function ScrollPanel(a){this.panel=a}$.extend(ScrollPanel.prototype,{test:function(v,d){clearTimeout(this.timeout);var k=v.pageX,j=v.pageY,l=$(this.panel),c=l.position(),b=l.width(),i=l.height(),w=l.parent(),s=w.width(),a=w.height(),r=w.offset(),p=r.left,m=r.top,A=p+w.width(),u=m+w.height(),B=-(b-(s/2)),z=-(i-(a/2)),g=(s/2),f=(a/2),h=false,q=5,o=23;if(k-q<p){if(c.left<g){var n=Math.min(o,g-c.left);l.css("left",c.left+n);h=true}}else{if(k+q>A){if(c.left>B){var n=Math.min(o,c.left-B);l.css("left",c.left-n);h=true}}else{if(j-q<m){if(c.top<f){var n=Math.min(o,f-c.top);l.css("top",c.top+n);h=true}}else{if(j+q>u){if(c.top>z){var n=Math.min(o,c.top-B);l.css("top",(c.top-n)+"px");h=true}}}}}if(h){d();var l=this;this.timeout=setTimeout(function(){l.test(v,d)},50)}},stop:function(b,a){clearTimeout(this.timeout)}});function CanvasManager(b,a){this.cv=b;this.cc=this.cv.find("#canvas-container");this.oc=a.find("#overview-canvas");this.ov=a.find("#overview-viewport");this.init_drag()}$.extend(CanvasManager.prototype,{init_drag:function(){var b=this;var a=function(f,g){f=Math.min(f,b.cv.width()/2);f=Math.max(f,-b.cc.width()+b.cv.width()/2);g=Math.min(g,b.cv.height()/2);g=Math.max(g,-b.cc.height()+b.cv.height()/2);b.cc.css({left:f,top:g});b.update_viewport_overlay()};this.cc.each(function(){this.scroll_panel=new ScrollPanel(this)});var d,c;this.cv.bind("dragstart",function(){var g=$(this).offset();var f=b.cc.position();c=f.top-g.top;d=f.left-g.left}).bind("drag",function(f,g){a(g.offsetX+d,g.offsetY+c)}).bind("dragend",function(){workflow.fit_canvas_to_nodes();b.draw_overview()});this.ov.bind("drag",function(k,l){var h=b.cc.width(),n=b.cc.height(),m=b.oc.width(),j=b.oc.height(),f=$(this).offsetParent().offset(),i=l.offsetX-f.left,g=l.offsetY-f.top;a(-(i/m*h),-(g/j*n))}).bind("dragend",function(){workflow.fit_canvas_to_nodes();b.draw_overview()});$("#overview-border").bind("drag",function(g,i){var j=$(this).offsetParent();var h=j.offset();var f=Math.max(j.width()-(i.offsetX-h.left),j.height()-(i.offsetY-h.top));$(this).css({width:f,height:f});b.draw_overview()});$("#overview-border div").bind("drag",function(){})},update_viewport_overlay:function(){var b=this.cc,f=this.cv,a=this.oc,c=this.ov,d=b.width(),j=b.height(),i=a.width(),g=a.height(),h=b.position();c.css({left:-(h.left/d*i),top:-(h.top/j*g),width:(f.width()/d*i)-2,height:(f.height()/j*g)-2})},draw_overview:function(){var j=$("#overview-canvas"),m=j.parent().parent().width(),i=j.get(0).getContext("2d"),d=$("#canvas-container").width(),l=$("#canvas-container").height();var g,a,k,f;var h=this.cv.width();var b=this.cv.height();if(d<h&&l<b){k=d/h*m;f=(m-k)/2;g=l/b*m;a=(m-g)/2}else{if(d<l){a=0;g=m;k=Math.ceil(g*d/l);f=(m-k)/2}else{k=m;f=0;g=Math.ceil(k*l/d);a=(m-g)/2}}j.parent().css({left:f,top:a,width:k,height:g});j.attr("width",k);j.attr("height",g);$.each(workflow.nodes,function(t,q){i.fillStyle="#D2C099";i.strokeStyle="#D8B365";i.lineWidth=1;var s=$(q.element),n=s.position(),c=n.left/d*k,r=n.top/l*g,o=s.width()/d*k,p=s.height()/l*g;if(q.tool_errors){i.fillStyle="#FFCCCC";i.strokeStyle="#AA6666"}else{if(q.workflow_outputs!=undefined&&q.workflow_outputs.length>0){i.fillStyle="#E8A92D";i.strokeStyle="#E8A92D"}}i.fillRect(c,r,o,p);i.strokeRect(c,r,o,p)});this.update_viewport_overlay()}});