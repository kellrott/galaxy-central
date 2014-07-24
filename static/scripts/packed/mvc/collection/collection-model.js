define(["mvc/dataset/hda-model","mvc/base-mvc","utils/localization"],function(g,i,c){var j=Backbone.Model.extend(i.LoggableMixin).extend({defaults:{id:null,model_class:"DatasetCollectionElement",element_identifier:null,element_index:null,element_type:null},initialize:function(l,k){this.info(this+".initialize:",l,k);k=k||{};this.object=this._createObjectModel();this.on("change:object",function(){this.object=this._createObjectModel()})},_createObjectModel:function(){if(_.isUndefined(this.object)){this.object=null}if(!this.get("object")){return this.object}var k=this.get("object");this.unset("object",{silent:true});this.debug("DCE, element_type:",this.get("element_type"));switch(this.get("element_type")){case"dataset_collection":this.object=new f(k);break;case"hda":this.object=new g.HistoryDatasetAssociation(k);break;default:throw new TypeError("Unknown element_type: "+this.get("element_type"))}return this.object},toString:function(){var k=(this.object)?(""+this.object):(this.get("element_identifier"));return(["DatasetCollectionElement(",k,")"].join(""))}});var d=Backbone.Collection.extend(i.LoggableMixin).extend({model:j,initialize:function(l,k){k=k||{};this.info(this+".initialize:",l,k)},toString:function(){return(["DatasetCollectionElementCollection(",this.length,")"].join(""))}});var f=Backbone.Model.extend(i.LoggableMixin).extend({defaults:{collection_type:"list"},collectionClass:d,initialize:function(l,k){this.info("DatasetCollection.initialize:",l,k);this.elements=this._createElementsModel();this.on("change:elements",function(){this.log("change:elements");this.elements=this._createElementsModel()})},_createElementsModel:function(){this.log("_createElementsModel",this.get("elements"),this.elements);var k=this.get("elements")||[];this.info("elements:",k);this.unset("elements",{silent:true});this.elements=new this.collectionClass(k);return this.elements},hasDetails:function(){return this.elements.length!==0},toString:function(){var k=[this.get("id"),this.get("name")||this.get("element_identifier")];return"DatasetCollection("+(k.join(","))+")"}});var h=Backbone.Collection.extend(i.LoggableMixin).extend({model:f,initialize:function(l,k){k=k||{};this.info("DatasetCollectionCollection.initialize:",l,k)},toString:function(){return(["DatasetCollectionCollection(",this.get("name"),")"].join(""))}});var e=f.extend({toString:function(){return(["ListDatasetCollection(",this.get("name"),")"].join(""))}});var b=f.extend({toString:function(){return(["PairDatasetCollection(",this.get("name"),")"].join(""))}});var a=f.extend({toString:function(){return(["ListPairedDatasetCollection(",this.get("name"),")"].join(""))}});return{DatasetCollectionElement:j,DatasetCollectionElementCollection:d,DatasetCollection:f,DatasetCollectionCollection:h,ListDatasetCollection:e,PairDatasetCollection:b,ListPairedDatasetCollection:a}});