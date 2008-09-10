<%inherit file="/base.mako"/>
<%namespace file="common.mako" import="render_dataset" />

<%def name="title()">Import from Library</%def>
<%def name="stylesheets()">
    <link href="${h.url_for('/static/style/base.css')}" rel="stylesheet" type="text/css" />
    <link href="${h.url_for('/static/style/library.css')}" rel="stylesheet" type="text/css" />
</%def>

<script type="text/javascript">
    var q = jQuery.noConflict();
    q( document ).ready( function () {
        // Hide all the folder contents
        q("ul").filter("ul#subFolder").hide();
        // Handle the hide/show triangles
        q("li.libraryOrFolderRow").wrap( "<a href='#' class='expandLink'></a>" ).click( function() {
            var contents = q(this).parent().next("ul");
            if ( this.id == "libraryRow" ) {
                var icon_open = "${h.url_for( '/static/images/library_open.png' )}";
                var icon_closed = "${h.url_for( '/static/images/library_closed.png' )}";
            } else {
                var icon_open = "${h.url_for( '/static/images/folder_open.png' )}";
                var icon_closed = "${h.url_for( '/static/images/folder_closed.png' )}";
            }
            if ( contents.is(":visible") ) {
                contents.slideUp("fast");
                q(this).children().find("img.expanderIcon").each( function() { this.src = "${h.url_for( '/static/images/expander_closed.png' )}"; });
                q(this).children().find("img.rowIcon").each( function() { this.src = icon_closed; });
            } else {
                contents.slideDown("fast");
                q(this).children().find("img.expanderIcon").each( function() { this.src = "${h.url_for( '/static/images/expander_open.png' )}"; });
                q(this).children().find("img.rowIcon").each( function() { this.src = icon_open; });
            }
        });
        // Hide all dataset bodies
        q("div.historyItemBody").hide();
        // Handle the dataset body hide/show link.
        q("div.historyItemWrapper").each( function() {
            var id = this.id;
            var li = q(this).parent();
            var body = q(this).children( "div.historyItemBody" );
            var peek = body.find( "pre.peek" )
            q(this).children( ".historyItemTitleBar" ).find( ".historyItemTitle" ).wrap( "<a href='#'></a>" ).click( function() {
                if ( body.is(":visible") ) {
                    if ( q.browser.mozilla ) { peek.css( "overflow", "hidden" ) }
                    body.slideUp( "fast" );
                    li.removeClass( "datasetHighlighted" );
                } 
                else {
                    body.slideDown( "fast", function() { 
                        if ( q.browser.mozilla ) { peek.css( "overflow", "auto" ); } 
                    });
                    li.addClass( "datasetHighlighted" );
                }
                return false;
            });
        });
    });
</script>

<%def name="render_folder( parent, parent_pad )">
  <%
    if not trans.app.security_agent.check_folder_contents( trans.user, parent ):
      return ""
    pad = parent_pad + 20
  %>
  %if parent_pad == 0:
    <li class="folderRow libraryOrFolderRow" style="padding-left: ${pad}px;"><div class="rowTitle"><img src="${h.url_for( '/static/images/expander_open.png' )}" class="expanderIcon"/><img src="${h.url_for( '/static/images/folder_open.png' )}" class="rowIcon"/> ${parent.name}</div></li>
    <ul>
  %else:
    <li class="folderRow libraryOrFolderRow" style="padding-left: ${pad}px;"><div class="rowTitle"><img src="${h.url_for( '/static/images/expander_closed.png' )}" class="expanderIcon"/><img src="${h.url_for( '/static/images/folder_closed.png' )}" class="rowIcon"/> ${parent.name}</div></li>
    <ul id="subFolder">
  %endif
      %for folder in parent.active_folders:
        ${render_folder( folder, pad )}
      %endfor
      %for dataset in parent.active_datasets:
        %if trans.app.security_agent.allow_action( trans.user, trans.app.security_agent.permitted_actions.DATASET_ACCESS, dataset=dataset.dataset ):
            <li class="datasetRow" style="padding-left: ${pad + 18}px;">${render_dataset( dataset )}</li>
        %endif
      %endfor
    </ul>
</%def>

<h2>Libraries</h2>
<form name="import_from_library" action="${h.url_for( '/library/import_datasets' )}" method="post">
<ul>
%for library in libraries:
  %if trans.app.security_agent.check_folder_contents( trans.user, library ):
  <li class="libraryRow libraryOrFolderRow" id="libraryRow"><div class="rowTitle"><table cellspacing="0" cellpadding="0" border="0" width="100%" class="libraryTitle"><tr>
    <th width="*"><img src="${h.url_for( '/static/images/expander_open.png' )}" class="expanderIcon"/><img src="${h.url_for( '/static/images/library_open.png' )}" class="rowIcon"/> ${library.name}</th>
    <th width="100">Format</th>
    <th width="50">Db</th>
    <th width="200">Info</th>
  </tr></table></div></li>
    <ul>
      ${render_folder( library.root_folder, 0 )}
    </ul>
  <br/>
  %endif
%endfor
</ul>
<input type="submit" class="primary-button" name="import_dataset" value="Import selected datasets"/>
</form>
