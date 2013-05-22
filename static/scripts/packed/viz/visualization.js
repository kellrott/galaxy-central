define(["libs/underscore","mvc/data","viz/trackster/util","utils/config"],function(s,i,l,o){var a=function(u,x,w,v){$.ajax({url:u,data:w,error:function(){alert("Grid failed")},success:function(y){show_modal("Select datasets for new tracks",y,{Cancel:function(){hide_modal()},Add:function(){var z=[];$("input[name=id]:checked,input[name=ldda_ids]:checked").each(function(){var A={data_type:"track_config",hda_ldda:"hda"},B=$(this).val();if($(this).attr("name")!=="id"){A.hda_ldda="ldda"}z[z.length]=$.ajax({url:x+"/"+B,data:A,dataType:"json"})});$.when.apply($,z).then(function(){var A=(arguments[0] instanceof Array?$.map(arguments,function(B){return B[0]}):[arguments[0]]);v(A)});hide_modal()}})}})};var j=function(u){return("promise" in u)};var f=function(u){this.default_font=u!==undefined?u:"9px Monaco, Lucida Console, monospace";this.dummy_canvas=this.new_canvas();this.dummy_context=this.dummy_canvas.getContext("2d");this.dummy_context.font=this.default_font;this.char_width_px=this.dummy_context.measureText("A").width;this.patterns={};this.load_pattern("right_strand","/visualization/strand_right.png");this.load_pattern("left_strand","/visualization/strand_left.png");this.load_pattern("right_strand_inv","/visualization/strand_right_inv.png");this.load_pattern("left_strand_inv","/visualization/strand_left_inv.png")};s.extend(f.prototype,{load_pattern:function(u,y){var v=this.patterns,w=this.dummy_context,x=new Image();x.src=galaxy_paths.attributes.image_path+y;x.onload=function(){v[u]=w.createPattern(x,"repeat")}},get_pattern:function(u){return this.patterns[u]},new_canvas:function(){var u=$("<canvas/>")[0];if(window.G_vmlCanvasManager){G_vmlCanvasManager.initElement(u)}u.manager=this;return u}});var q=Backbone.Model.extend({defaults:{num_elements:20,obj_cache:null,key_ary:null},initialize:function(u){this.clear()},get_elt:function(v){var w=this.attributes.obj_cache,x=this.attributes.key_ary,u=x.indexOf(v);if(u!==-1){if(w[v].stale){x.splice(u,1);delete w[v]}else{this.move_key_to_end(v,u)}}return w[v]},set_elt:function(v,x){var y=this.attributes.obj_cache,z=this.attributes.key_ary,w=this.attributes.num_elements;if(!y[v]){if(z.length>=w){var u=z.shift();delete y[u]}z.push(v)}y[v]=x;return x},move_key_to_end:function(v,u){this.attributes.key_ary.splice(u,1);this.attributes.key_ary.push(v)},clear:function(){this.attributes.obj_cache={};this.attributes.key_ary=[]},size:function(){return this.attributes.key_ary.length},most_recently_added:function(){return this.size()===0?null:this.attributes.key_ary[this.attributes.key_ary.length-1]}});var d=q.extend({defaults:s.extend({},q.prototype.defaults,{dataset:null,genome:null,init_data:null,min_region_size:200,filters_manager:null,data_type:"data",data_mode_compatible:function(u,v){return true},can_subset:function(u){return false}}),initialize:function(u){q.prototype.initialize.call(this);var v=this.get("init_data");if(v){this.add_data(v)}},add_data:function(u){if(this.get("num_elements")<u.length){this.set("num_elements",u.length)}var v=this;s.each(u,function(w){v.set_data(w.region,w)})},data_is_ready:function(){var x=this.get("dataset"),w=$.Deferred(),u=(this.get("data_type")==="raw_data"?"state":this.get("data_type")==="data"?"converted_datasets_state":"error"),v=new l.ServerStateDeferred({ajax_settings:{url:this.get("dataset").url(),data:{hda_ldda:x.get("hda_ldda"),data_type:u},dataType:"json"},interval:5000,success_fn:function(y){return y!=="pending"}});$.when(v.go()).then(function(y){w.resolve(y==="ok"||y==="data")});return w},search_features:function(u){var v=this.get("dataset"),w={query:u,hda_ldda:v.get("hda_ldda"),data_type:"features"};return $.getJSON(v.url(),w)},load_data:function(C,B,v,A){var y=this.get("dataset"),x={data_type:this.get("data_type"),chrom:C.get("chrom"),low:C.get("start"),high:C.get("end"),mode:B,resolution:v,hda_ldda:y.get("hda_ldda")};$.extend(x,A);var E=this.get("filters_manager");if(E){var F=[];var u=E.filters;for(var z=0;z<u.length;z++){F.push(u[z].name)}x.filter_cols=JSON.stringify(F)}var w=this,D=$.getJSON(y.url(),x,function(G){G.region=C;w.set_data(C,G)});this.set_data(C,D);return D},get_data:function(B,A,w,y){var C=this.get_elt(B);if(C&&(j(C)||this.get("data_mode_compatible")(C,A))){return C}var D=this.get("key_ary"),v=this.get("obj_cache"),E,u,z;for(var x=0;x<D.length;x++){E=D[x];u=new g({from_str:E});if(u.contains(B)){z=true;C=v[E];if(j(C)||(this.get("data_mode_compatible")(C,A)&&this.get("can_subset")(C))){this.move_key_to_end(E,x);if(!j(C)){var G=this.subset_entry(C,B);this.set(B,G);C=G}return C}}}if(!z&&B.length()<this.attributes.min_region_size){var F=new g({from_str:this.most_recently_added()});if(!F||(B.get("start")>F.get("start"))){B.set("end",B.get("start")+this.attributes.min_region_size)}else{B.set("start",B.get("end")-this.attributes.min_region_size)}B.set("genome",this.attributes.genome);B.trim()}return this.load_data(B,A,w,y)},set_data:function(v,u){this.set_elt(v,u)},DEEP_DATA_REQ:"deep",BROAD_DATA_REQ:"breadth",get_more_data:function(C,B,x,A,y){var E=this._mark_stale(C);if(!(E&&this.get("data_mode_compatible")(E,B))){console.log("ERROR: problem with getting more data: current data is not compatible");return}var w=C.get("start");if(y===this.DEEP_DATA_REQ){$.extend(A,{start_val:E.data.length+1})}else{if(y===this.BROAD_DATA_REQ){w=(E.max_high?E.max_high:E.data[E.data.length-1][2])+1}}var D=C.copy().set("start",w);var v=this,z=this.load_data(D,B,x,A),u=$.Deferred();this.set_data(C,u);$.when(z).then(function(F){if(F.data){F.data=E.data.concat(F.data);if(F.max_low){F.max_low=E.max_low}if(F.message){F.message=F.message.replace(/[0-9]+/,F.data.length)}}v.set_data(C,F);u.resolve(F)});return u},can_get_more_detailed_data:function(v){var u=this.get_elt(v);return(u.dataset_type==="bigwig"&&u.data.length<8000)},get_more_detailed_data:function(x,z,v,y,w){var u=this._mark_stale(x);if(!u){console.log("ERROR getting more detailed data: no current data");return}if(!w){w={}}if(u.dataset_type==="bigwig"){w.num_samples=1000*y}return this.load_data(x,z,v,w)},_mark_stale:function(v){var u=this.get_elt(v);if(!u){console.log("ERROR: no data to mark as stale: ",this.get("dataset"),v.toString())}u.stale=true;return u},get_genome_wide_data:function(u){var w=this,y=true,x=s.map(u.get("chroms_info").chrom_info,function(A){var z=w.get_elt(new g({chrom:A.chrom,start:0,end:A.len}));if(!z){y=false}return z});if(y){return x}var v=$.Deferred();$.getJSON(this.get("dataset").url(),{data_type:"genome_data"},function(z){w.add_data(z.data);v.resolve(z.data)});return v},subset_entry:function(w,x){var u={bigwig:function(y,z){return s.filter(y,function(A){return A[0]>=z.get("start")&&A[0]<=z.get("end")})},refseq:function(z,A){var B=A.get("start")-w.region.get("start"),y=w.data.length-(w.region.get("end")-A.get("end"));return w.data.slice(B,y)}};var v=w.data;if(!w.region.same(x)&&w.dataset_type in u){v=u[w.dataset_type](w.data,x)}return{region:x,data:v,dataset_type:w.dataset_type}},get_elt:function(u){return q.prototype.get_elt.call(this,u.toString())},set_elt:function(v,u){return q.prototype.set_elt.call(this,v.toString(),u)}});var p=d.extend({initialize:function(u){var v=new Backbone.Model();v.urlRoot=u.data_url;this.set("dataset",v)},load_data:function(w,x,u,v){return(w.length()<=100000?d.prototype.load_data.call(this,w,x,u,v):{data:null,region:w})}});var c=Backbone.Model.extend({defaults:{name:null,key:null,chroms_info:null},initialize:function(u){this.id=u.dbkey},get_chroms_info:function(){return this.attributes.chroms_info.chrom_info},get_chrom_region:function(u){var v=s.find(this.get_chroms_info(),function(w){return w.chrom===u});return new g({chrom:v.chrom,end:v.len})},get_chrom_len:function(u){return s.find(this.get_chroms_info(),function(v){return v.chrom===u}).len}});var g=Backbone.RelationalModel.extend({defaults:{chrom:null,start:0,end:0,genome:null},same:function(u){return this.attributes.chrom===u.get("chrom")&&this.attributes.start===u.get("start")&&this.attributes.end===u.get("end")},initialize:function(v){if(v.from_str){var x=v.from_str.split(":"),w=x[0],u=x[1].split("-");this.set({chrom:w,start:parseInt(u[0],10),end:parseInt(u[1],10)})}},copy:function(){return new g({chrom:this.get("chrom"),start:this.get("start"),end:this.get("end")})},length:function(){return this.get("end")-this.get("start")},toString:function(){return this.get("chrom")+":"+this.get("start")+"-"+this.get("end")},toJSON:function(){return{chrom:this.get("chrom"),start:this.get("start"),end:this.get("end")}},compute_overlap:function(B){var v=this.get("chrom"),A=B.get("chrom"),z=this.get("start"),x=B.get("start"),y=this.get("end"),w=B.get("end"),u;if(v&&A&&v!==A){return g.overlap_results.DIF_CHROMS}if(z<x){if(y<x){u=g.overlap_results.BEFORE}else{if(y<w){u=g.overlap_results.OVERLAP_START}else{u=g.overlap_results.CONTAINS}}}else{if(z>x){if(z>w){u=g.overlap_results.AFTER}else{if(y<=w){u=g.overlap_results.CONTAINED_BY}else{u=g.overlap_results.OVERLAP_END}}}else{u=(y>=w?g.overlap_results.CONTAINS:g.overlap_results.CONTAINED_BY)}}return u},trim:function(u){if(this.attributes.start<0){this.attributes.start=0}if(this.attributes.genome){var v=this.attributes.genome.get_chrom_len(this.attributes.chrom);if(this.attributes.end>v){this.attributes.end=v-1}}return this},contains:function(u){return this.compute_overlap(u)===g.overlap_results.CONTAINS},overlaps:function(u){return s.intersection([this.compute_overlap(u)],[g.overlap_results.DIF_CHROMS,g.overlap_results.BEFORE,g.overlap_results.AFTER]).length===0}},{overlap_results:{DIF_CHROMS:1000,BEFORE:1001,CONTAINS:1002,OVERLAP_START:1003,OVERLAP_END:1004,CONTAINED_BY:1005,AFTER:1006}});var m=Backbone.Collection.extend({model:g});var e=Backbone.RelationalModel.extend({defaults:{region:null,note:""},relations:[{type:Backbone.HasOne,key:"region",relatedModel:g}]});var r=Backbone.Collection.extend({model:e});var t=Backbone.RelationalModel.extend({relations:[{type:Backbone.HasOne,key:"dataset",relatedModel:i.Dataset}],initialize:function(u){this.set("config",o.ConfigSettingCollection.from_config_dict(u.prefs));this.get("config").add([{key:"name",value:this.get("name")},{key:"color"}]);var v=this.get("preloaded_data");if(v){v=v.data}else{v=[]}this.set("data_manager",new d({dataset:this.get("dataset"),init_data:v}))}});var n=Backbone.RelationalModel.extend({defaults:{title:"",type:""},url:galaxy_paths.get("visualization_url"),save:function(){return $.ajax({url:this.url(),type:"POST",dataType:"json",data:{vis_json:JSON.stringify(this)}})}});var k=n.extend({defaults:s.extend({},n.prototype.defaults,{dbkey:"",tracks:null,bookmarks:null,viewport:null}),relations:[{type:Backbone.HasMany,key:"tracks",relatedModel:t}],add_tracks:function(u){this.get("tracks").add(u)}});var b=Backbone.Model.extend({});var h=Backbone.Router.extend({initialize:function(v){this.view=v.view;this.route(/([\w]+)$/,"change_location");this.route(/([\w]+\:[\d,]+-[\d,]+)$/,"change_location");var u=this;u.view.on("navigate",function(w){u.navigate(w)})},change_location:function(u){this.view.go_to(u)}});return{BackboneTrack:t,BrowserBookmark:e,BrowserBookmarkCollection:r,Cache:q,CanvasManager:f,Genome:c,GenomeDataManager:d,GenomeRegion:g,GenomeRegionCollection:m,GenomeVisualization:k,GenomeReferenceDataManager:p,TrackBrowserRouter:h,TrackConfig:b,Visualization:n,select_datasets:a}});