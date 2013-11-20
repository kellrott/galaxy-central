define([
], function(){
//==============================================================================
/** @class (HDA) model for a Galaxy dataset
 *      related to a history.
 *  @name HistoryDatasetAssociation
 *
 *  @augments Backbone.Model
 *  @borrows LoggableMixin#logger as #logger
 *  @borrows LoggableMixin#log as #log
 *  @constructs
 */
var HistoryDatasetAssociation = Backbone.Model.extend( LoggableMixin ).extend(
/** @lends HistoryDatasetAssociation.prototype */{
    
    ///** logger used to record this.log messages, commonly set to console */
    //// comment this out to suppress log output
    //logger              : console,
    
    /** default attributes for a model */
    defaults : {
        // ---these are part of an HDA proper:

        // parent (containing) history
        history_id          : null,
        // often used with tagging
        model_class         : 'HistoryDatasetAssociation',
        hid                 : 0,
        
        // ---whereas these are Dataset related/inherited

        id                  : null,
        name                : '(unnamed dataset)',
        // one of HistoryDatasetAssociation.STATES
        state               : 'new',

        deleted             : false,
        visible             : true,

        accessible          : true,
        purged              : false,

        // sniffed datatype (sam, tabular, bed, etc.)
        data_type           : null,
        // size in bytes
        file_size           : 0,
        file_ext            : '',

        // array of associated file types (eg. [ 'bam_index', ... ])
        meta_files          : [],

        misc_blurb          : '',
        misc_info           : '',

        tags                : null
    },

    /** fetch location of this HDA's history in the api */
    urlRoot: galaxy_config.root + 'api/histories/',
    /** full url spec. for this HDA */
    url : function(){
        return this.urlRoot + this.get( 'history_id' ) + '/contents/' + this.get( 'id' );
    },
    
    /** controller urls assoc. with this HDA */
    urls : function(){
        var id = this.get( 'id' );
        if( !id ){ return {}; }
        var urls = {
            'purge'         : galaxy_config.root + 'datasets/' + id + '/purge_async',

            'display'       : galaxy_config.root + 'datasets/' + id + '/display/?preview=True',
            'edit'          : galaxy_config.root + 'datasets/' + id + '/edit',

            'download'      : galaxy_config.root + 'datasets/' + id + '/display?to_ext=' + this.get( 'file_ext' ),
            'report_error'  : galaxy_config.root + 'dataset/errors?id=' + id,
            'rerun'         : galaxy_config.root + 'tool_runner/rerun?id=' + id,
            'show_params'   : galaxy_config.root + 'datasets/' + id + '/show_params',
            'visualization' : galaxy_config.root + 'visualization',

            'annotation': { 'get': galaxy_config.root + 'dataset/get_annotation_async?id=' + id,
                            'set': galaxy_config.root + 'dataset/annotate_async?id=' + id },
            'meta_download' : galaxy_config.root + 'dataset/get_metadata_file?hda_id=' + id + '&metadata_name='
        };
        return urls;
    },

    /** Set up the model, determine if accessible, bind listeners
     *  @see Backbone.Model#initialize
     */
    initialize : function( data ){
        this.log( this + '.initialize', this.attributes );
        this.log( '\tparent history_id: ' + this.get( 'history_id' ) );
        
        //!! this state is not in trans.app.model.Dataset.states - set it here -
        if( !this.get( 'accessible' ) ){
            this.set( 'state', HistoryDatasetAssociation.STATES.NOT_VIEWABLE );
        }

        this._setUpListeners();
    },

    /** set up any event listeners
     *  event: state:ready  fired when this HDA moves into a ready state
     */
    _setUpListeners : function(){
        // if the state has changed and the new state is a ready state, fire an event
        this.on( 'change:state', function( currModel, newState ){
            this.log( this + ' has changed state:', currModel, newState );
            if( this.inReadyState() ){
                this.trigger( 'state:ready', currModel, newState, this.previous( 'state' ) );
            }
        });
    },

    // ........................................................................ common queries
    toJSON : function(){
        var json = Backbone.Model.prototype.toJSON.call( this );
        //HACK: this should be done on the server side when setting
        json.misc_info = jQuery.trim( json.misc_info );
        return json;
    },

    /** Is this hda deleted or purged? */
    isDeletedOrPurged : function(){
        return ( this.get( 'deleted' ) || this.get( 'purged' ) );
    },

    /** based on show_deleted, show_hidden (gen. from the container control),
     *      would this ds show in the list of ds's?
     *  @param {Boolean} show_deleted are we showing deleted hdas?
     *  @param {Boolean} show_hidden are we showing hidden hdas?
     */
    isVisible : function( show_deleted, show_hidden ){
        var isVisible = true;
        if( ( !show_deleted )
        &&  ( this.get( 'deleted' ) || this.get( 'purged' ) ) ){
            isVisible = false;
        }
        if( ( !show_hidden )
        &&  ( !this.get( 'visible' ) ) ){
            isVisible = false;
        }
        return isVisible;
    },
    
    /** the more common alias of visible */
    hidden : function(){
        return !this.get( 'visible' );
    },

    /** Is this HDA in a 'ready' state; where 'Ready' states are states where no
     *      processing (for the ds) is left to do on the server.
     */
    inReadyState : function(){
        var ready = _.contains( HistoryDatasetAssociation.READY_STATES, this.get( 'state' ) );
        return ( this.isDeletedOrPurged() || ready );
    },

    /** Does this model already contain detailed data (as opposed to just summary level data)? */
    hasDetails : function(){
        //?? this may not be reliable
        return _.has( this.attributes, 'genome_build' );
    },

    /** Convenience function to match hda.has_data. */
    hasData : function(){
        return ( this.get( 'file_size' ) > 0 );
    },

    // ........................................................................ ajax

    /** save this HDA, _Mark_ing it as deleted (just a flag) */
    'delete' : function _delete( options ){
        return this.save( { deleted: true }, options );
    },
    /** save this HDA, _Mark_ing it as undeleted */
    undelete : function _undelete( options ){
        return this.save( { deleted: false }, options );
    },

    /** save this HDA as not visible */
    hide : function _hide( options ){
        return this.save( { visible: false }, options );
    },
    /** save this HDA as visible */
    unhide : function _uhide( options ){
        return this.save( { visible: true }, options );
    },

    /** purge this HDA and remove the underlying dataset file from the server's fs */
//TODO: use, override model.destroy, HDA.delete({ purge: true })
    purge : function _purge( options ){
        options = options || {};
        options.url = galaxy_config.root + 'datasets/' + this.get( 'id' ) + '/purge_async';

        //TODO: ideally this would be a DELETE call to the api
        //  using purge async for now
        var hda = this,
            xhr = jQuery.ajax( options );
        xhr.done( function( message, status, responseObj ){
            hda.set( 'purged', true );
        });
        xhr.fail( function( xhr, status, message ){
            // Exception messages are hidden within error page including:  '...not allowed in this Galaxy instance.'
            // unbury and re-add to xhr
            var error = _l( "Unable to purge this dataset" );
            var messageBuriedInUnfortunatelyFormattedError = ( 'Removal of datasets by users '
                + 'is not allowed in this Galaxy instance' );
            if( xhr.responseJSON && xhr.responseJSON.error ){
                error = xhr.responseJSON.error;
            } else if( xhr.responseText.indexOf( messageBuriedInUnfortunatelyFormattedError ) !== -1 ){
                error = messageBuriedInUnfortunatelyFormattedError;
            }
            xhr.responseText = error;
            hda.trigger( 'error', hda, xhr, options, _l( error ), { error: error } );
        });
    },

    // ........................................................................ sorting/filtering
    /** what attributes of an HDA will be used in a search */
    searchKeys : [
        'name', 'file_ext', 'genome_build', 'misc_blurb', 'misc_info', 'annotation', 'tags'
    ],

    /** search this HDA for the string searchFor
     *  @param {String} searchFor   look for this string in all attributes listed in searchKeys (above) using indexOf
     *  @returns {Array} an array of attribute keys where searchFor was found
     */
    search : function( searchFor ){
        var model = this;
        searchFor = searchFor.toLowerCase();
        return _.filter( this.searchKeys, function( key ){
            var attr = model.get( key );
            return ( _.isString( attr ) && attr.toLowerCase().indexOf( searchFor ) !== -1 );
        });
    },

    /** alias of search, but returns a boolean
     *  @param {String} matchesWhat   look for this string in all attributes listed in searchKeys (above) using indexOf
     *  @returns {Boolean} was matchesWhat found in any attributes
     */
    matches : function( matchesWhat ){
        return !!this.search( matchesWhat ).length;
    },

    // ........................................................................ misc
    /** String representation */
    toString : function(){
        var nameAndId = this.get( 'id' ) || '';
        if( this.get( 'name' ) ){
            nameAndId = this.get( 'hid' ) + ' :"' + this.get( 'name' ) + '",' + nameAndId;
        }
        return 'HDA(' + nameAndId + ')';
    }
});

//------------------------------------------------------------------------------
/** Class level map of possible HDA states to their string equivalents.
 *      A port of galaxy.model.Dataset.states.
 */
HistoryDatasetAssociation.STATES = {
    // NOT ready states
    /** is uploading and not ready */
    UPLOAD              : 'upload',
    /** the job that will produce the dataset queued in the runner */
    QUEUED              : 'queued',
    /** the job that will produce the dataset is running */
    RUNNING             : 'running',
    /** metadata for the dataset is being discovered/set */
    SETTING_METADATA    : 'setting_metadata',

    // ready states
    /** was created without a tool */
    NEW                 : 'new',
    /** has no data */
    EMPTY               : 'empty',
    /** has successfully completed running */
    OK                  : 'ok',

    /** the job that will produce the dataset paused */
    PAUSED              : 'paused',
    /** metadata discovery/setting failed or errored (but otherwise ok) */
    FAILED_METADATA     : 'failed_metadata',
    /** not accessible to the current user (i.e. due to permissions) */
    NOT_VIEWABLE        : 'noPermission',   // not in trans.app.model.Dataset.states
    /** deleted while uploading */
    DISCARDED           : 'discarded',
    /** the tool producing this dataset failed */
    ERROR               : 'error'
};

/** states that are in a final state (the underlying job is complete) */
HistoryDatasetAssociation.READY_STATES = [
    HistoryDatasetAssociation.STATES.NEW,
    HistoryDatasetAssociation.STATES.OK,
    HistoryDatasetAssociation.STATES.EMPTY,
    HistoryDatasetAssociation.STATES.PAUSED,
    HistoryDatasetAssociation.STATES.FAILED_METADATA,
    HistoryDatasetAssociation.STATES.NOT_VIEWABLE,
    HistoryDatasetAssociation.STATES.DISCARDED,
    HistoryDatasetAssociation.STATES.ERROR
];

/** states that will change (the underlying job is not finished) */
HistoryDatasetAssociation.NOT_READY_STATES = [
    HistoryDatasetAssociation.STATES.UPLOAD,
    HistoryDatasetAssociation.STATES.QUEUED,
    HistoryDatasetAssociation.STATES.RUNNING,
    HistoryDatasetAssociation.STATES.SETTING_METADATA
];

//==============================================================================
/** @class Backbone collection of (HDA) models
 *
 *  @borrows LoggableMixin#logger as #logger
 *  @borrows LoggableMixin#log as #log
 *  @constructs
 */
var HDACollection = Backbone.Collection.extend( LoggableMixin ).extend(
/** @lends HDACollection.prototype */{
    model           : HistoryDatasetAssociation,

    ///** logger used to record this.log messages, commonly set to console */
    //// comment this out to suppress log output
    //logger              : console,

    /** root api url */
    urlRoot : galaxy_config.root + 'api/histories',
    /** complete api url */
    url : function(){
        return this.urlRoot + '/' + this.historyId + '/contents';
    },

    /** Set up.
     *  @see Backbone.Collection#initialize
     */
    initialize : function( models, options ){
        options = options || {};
        this.historyId = options.historyId;
        //this._setUpListeners();
    },

    //_setUpListeners : function(){
    //},

    // ........................................................................ common queries
    /** Get the ids of every hda in this collection
     *  @returns array of encoded ids
     */
    ids : function(){
        return this.map( function( hda ){ return hda.id; });
    },

    /** Get hdas that are not ready
     *  @returns array of HDAs
     */
    notReady : function(){
        return this.filter( function( hda ){
            return !hda.inReadyState();
        });
    },

    /** Get the id of every hda in this collection not in a 'ready' state (running).
     *  @returns an array of hda ids
     *  @see HistoryDatasetAssociation#inReadyState
     */
    running : function(){
        var idList = [];
        this.each( function( item ){
            if( !item.inReadyState() ){
                idList.push( item.get( 'id' ) );
            }
        });
        return idList;
    },

    /** Get the hda with the given hid
     *  @param {Int} hid the hid to search for
     *  @returns {HistoryDatasetAssociation} the hda with the given hid or undefined if not found
     */
    getByHid : function( hid ){
        return _.first( this.filter( function( hda ){ return hda.get( 'hid' ) === hid; }) );
    },

    /** Get every 'shown' hda in this collection based on show_deleted/hidden
     *  @param {Boolean} show_deleted are we showing deleted hdas?
     *  @param {Boolean} show_hidden are we showing hidden hdas?
     *  @returns array of hda models
     *  @see HistoryDatasetAssociation#isVisible
     */
    getVisible : function( show_deleted, show_hidden ){
        return this.filter( function( item ){ return item.isVisible( show_deleted, show_hidden ); });
    },

    // ........................................................................ ajax
    /** fetch detailed model data for all HDAs in this collection */
    fetchAllDetails : function( options ){
        options = options || {};
        var detailsFlag = { details: 'all' };
        options.data = ( options.data )?( _.extend( options.data, detailsFlag ) ):( detailsFlag );
        return this.fetch( options );
    },

    // ........................................................................ sorting/filtering
    /** return a new collection of HDAs whose attributes contain the substring matchesWhat */
    matches : function( matchesWhat ){
        return this.filter( function( hda ){
            return hda.matches( matchesWhat );
        });
    },

    // ........................................................................ misc
    set : function( models, options ){
        // arrrrrrrrrrrrrrrrrg...
        // override to get a correct/smarter merge when incoming data is partial (e.g. stupid backbone)
        //  w/o this partial models from the server will fill in missing data with model defaults
        //  and overwrite existing data on the client
        // see Backbone.Collection.set and _prepareModel
        var collection = this;
        models = _.map( models, function( model ){
            var existing = collection.get( model.id );
            if( !existing ){ return model; }

            // merge the models _BEFORE_ calling the superclass version
            var merged = existing.toJSON();
            _.extend( merged, model );
            return merged;
        });
        // now call superclass when the data is filled
        Backbone.Collection.prototype.set.call( this, models, options );
    },

    /** String representation. */
    toString : function(){
         return ( 'HDACollection()' );
    }
});

//==============================================================================
return {
    HistoryDatasetAssociation : HistoryDatasetAssociation,
    HDACollection             : HDACollection
};});
