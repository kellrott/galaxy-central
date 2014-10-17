define(["mvc/history/history-model","mvc/history/history-panel-edit","mvc/collection/collection-panel","mvc/base-mvc","utils/localization"],function(d,c,a,h,b){var e=h.SessionStorageModel.extend({defaults:{tagsEditorShown:false,annotationEditorShown:false,scrollPosition:0},toString:function(){return"HistoryPanelPrefs("+JSON.stringify(this.toJSON())+")"}});e.storageKey=function f(){return("history-panel")};var g=c.HistoryPanelEdit;var i=g.extend({className:g.prototype.className+" current-history-panel",emptyMsg:b("This history is empty. Click 'Get Data' on the left tool menu to start"),noneFoundMsg:b("No matching datasets found"),HDCAViewClass:g.prototype.HDCAViewClass.extend({foldoutStyle:"drilldown"}),initialize:function(j){j=j||{};this.preferences=new e(_.extend({id:e.storageKey()},_.pick(j,_.keys(e.prototype.defaults))));g.prototype.initialize.call(this,j);this.panelStack=[];this.currentContentId=j.currentContentId||null},_setUpListeners:function(){g.prototype._setUpListeners.call(this);var j=this;this.$scrollContainer().on("scroll",function(k){if(j.$el.is(":visible")){j.preferences.set("scrollPosition",$(this).scrollTop())}});this.on("new-model",function(){j.preferences.set("scrollPosition",0)})},loadCurrentHistory:function(k){this.debug(this+".loadCurrentHistory");var j=this;return this.loadHistoryWithDetails("current",k).then(function(m,l){j.trigger("current-history",j)})},switchToHistory:function(m,l){var j=this,k=function(){return jQuery.getJSON(galaxy_config.root+"history/set_as_current?id="+m)};return this.loadHistoryWithDetails(m,l,k).then(function(o,n){j.trigger("switched-history",j)})},createNewHistory:function(l){if(!Galaxy||!Galaxy.currUser||Galaxy.currUser.isAnonymous()){this.displayMessage("error",b("You must be logged in to create histories"));return $.when()}var j=this,k=function(){return jQuery.getJSON(galaxy_config.root+"history/create_new_current")};return this.loadHistory(undefined,l,k).then(function(n,m){j.trigger("new-history",j)})},setModel:function(k,j,l){g.prototype.setModel.call(this,k,j,l);if(this.model){this.log("checking for updates");this.model.checkForUpdates()}return this},_setUpCollectionListeners:function(){g.prototype._setUpCollectionListeners.call(this);this.collection.on("state:ready",function(k,l,j){if((!k.get("visible"))&&(!this.storage.get("show_hidden"))){this.removeItemView(this.viewFromModel(k))}},this)},_setUpModelListeners:function(){g.prototype._setUpModelListeners.call(this);if(Galaxy&&Galaxy.quotaMeter){this.listenTo(this.model,"change:nice_size",function(){Galaxy.quotaMeter.update()})}},_buildNewRender:function(){if(!this.model){return $()}var j=g.prototype._buildNewRender.call(this);j.find(".search").prependTo(j.find(".controls"));this._renderQuotaMessage(j);return j},_renderQuotaMessage:function(j){j=j||this.$el;return $(this.templates.quotaMsg({},this)).prependTo(j.find(".messages"))},_renderEmptyMessage:function(l){var k=this,j=k.$emptyMessage(l),m=$(".toolMenuContainer");if((_.isEmpty(k.views)&&!k.searchFor)&&(Galaxy&&Galaxy.upload&&m.size())){j.empty();j.html([b("This history is empty"),". ",b("You can "),'<a class="uploader-link" href="javascript:void(0)">',b("load your own data"),"</a>",b(" or "),'<a class="get-data-link" href="javascript:void(0)">',b("get data from an external source"),"</a>"].join(""));j.find(".uploader-link").click(function(n){Galaxy.upload.show(n)});j.find(".get-data-link").click(function(n){m.parent().scrollTop(0);m.find('span:contains("Get Data")').click()});return j.show()}return g.prototype._renderEmptyMessage.call(this,l)},_renderTags:function(j){var k=this;g.prototype._renderTags.call(this,j);if(this.preferences.get("tagsEditorShown")){this.tagsEditor.toggle(true)}this.tagsEditor.on("hiddenUntilActivated:shown hiddenUntilActivated:hidden",function(l){k.preferences.set("tagsEditorShown",l.hidden)})},_renderAnnotation:function(j){var k=this;g.prototype._renderAnnotation.call(this,j);if(this.preferences.get("annotationEditorShown")){this.annotationEditor.toggle(true)}this.annotationEditor.on("hiddenUntilActivated:shown hiddenUntilActivated:hidden",function(l){k.preferences.set("annotationEditorShown",l.hidden)})},_swapNewRender:function(k){g.prototype._swapNewRender.call(this,k);var j=this;_.delay(function(){var l=j.preferences.get("scrollPosition");if(l){j.scrollTo(l)}},10);return this},_attachItems:function(k){g.prototype._attachItems.call(this,k);var j=this,l;if(j.currentContentId&&(l=j.viewFromModelId(j.currentContentId))){j.setCurrentContent(l)}return this},addItemView:function(l,m,k){var j=g.prototype.addItemView.call(this,l,m,k);if(!j){return j}if(this.panelStack.length){return this._collapseDrilldownPanel()}return j},_setUpItemViewListeners:function(k){var j=this;g.prototype._setUpItemViewListeners.call(j,k);k.on("expanded:drilldown",function(m,l){this._expandDrilldownPanel(l)},this);k.on("collapsed:drilldown",function(m,l){this._collapseDrilldownPanel(l)},this);k.on("display edit params rerun report-err visualize",function(l,m){this.setCurrentContent(l)},this);return this},setCurrentContent:function(j){this.$(".history-content.current-content").removeClass("current-content");if(j){j.$el.addClass("current-content");this.currentContentId=j.model.id}else{this.currentContentId=null}},_expandDrilldownPanel:function(j){this.panelStack.push(j);this.$("> .controls").add(this.$list()).hide();j.parentName=this.model.get("name");this.$el.append(j.render().$el)},_collapseDrilldownPanel:function(j){this.panelStack.pop();this.render()},connectToQuotaMeter:function(j){if(!j){return this}this.listenTo(j,"quota:over",this.showQuotaMessage);this.listenTo(j,"quota:under",this.hideQuotaMessage);this.on("rendered rendered:initial",function(){if(j&&j.isOverQuota()){this.showQuotaMessage()}});return this},showQuotaMessage:function(){var j=this.$el.find(".quota-message");if(j.is(":hidden")){j.slideDown(this.fxSpeed)}},hideQuotaMessage:function(){var j=this.$el.find(".quota-message");if(!j.is(":hidden")){j.slideUp(this.fxSpeed)}},connectToOptionsMenu:function(j){var k=this;if(!j){return k}this.on("new-storage show-deleted show-hidden",function(){var l=(Galaxy&&Galaxy.historyOptionsMenu)?Galaxy.historyOptionsMenu:undefined;if(l){l.findItemByHtml(b("Include Deleted Datasets")).checked=k.showDeleted;l.findItemByHtml(b("Include Hidden Datasets")).checked=k.showHidden}});return this},toString:function(){return"CurrentHistoryPanel("+((this.model)?(this.model.get("name")):(""))+")"}});i.prototype.templates=(function(){var j=h.wrapTemplate(['<div class="quota-message errormessage">',b("You are over your disk quota"),". ",b("Tool execution is on hold until your disk usage drops below your allocated quota"),".","</div>"],"history");return _.extend(_.clone(g.prototype.templates),{quotaMsg:j})}());return{CurrentHistoryPanel:i}});