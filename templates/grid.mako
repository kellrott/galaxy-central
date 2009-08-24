<%!
def inherit(context):
    if context.get('use_panels'):
        return '/base_panels.mako'
    else:
        return '/base.mako'
%>
<%inherit file="${inherit(context)}"/>

<%def name="title()">${grid.title}</%def>

%if message:
    <p>
        <div class="${message_type}message transient-message">${message}</div>
        <div style="clear: both"></div>
    </p>
%endif

<%def name="javascripts()">
    ${parent.javascripts()}
    <script type="text/javascript">        
        ## TODO: generalize and move into galaxy.base.js
        $(document).ready(function() {
            $(".grid").each( function() {
                var grid = this;
                var checkboxes = $(this).find("input.grid-row-select-checkbox");
                var update = $(this).find( "span.grid-selected-count" );
                $(checkboxes).each( function() {
                    $(this).change( function() {
                        var n = $(checkboxes).filter("[checked]").size();
                        update.text( n );
                    });
                })
            });
        });
        ## Can this be moved into base.mako?
        %if refresh_frames:
            %if 'masthead' in refresh_frames:            
                ## Refresh masthead == user changes (backward compatibility)
                if ( parent.user_changed ) {
                    %if trans.user:
                        parent.user_changed( "${trans.user.email}", ${int( app.config.is_admin_user( trans.user ) )} );
                    %else:
                        parent.user_changed( null, false );
                    %endif
                }
            %endif
            %if 'history' in refresh_frames:
                if ( parent.frames && parent.frames.galaxy_history ) {
                    parent.frames.galaxy_history.location.href="${h.url_for( controller='root', action='history')}";
                    if ( parent.force_right_panel ) {
                        parent.force_right_panel( 'show' );
                    }
                }
            %endif
            %if 'tools' in refresh_frames:
                if ( parent.frames && parent.frames.galaxy_tools ) {
                    parent.frames.galaxy_tools.location.href="${h.url_for( controller='root', action='tool_menu')}";
                    if ( parent.force_left_panel ) {
                        parent.force_left_panel( 'show' );
                    }
                }
            %endif
        %endif
    </script>
</%def>

<%def name="stylesheets()">
    <link href="${h.url_for('/static/style/base.css')}" rel="stylesheet" type="text/css" />
    <style>
        ## Not generic to all grids -- move to base?
        .count-box {
            min-width: 1.1em;
            padding: 5px;
            border-width: 1px;
            border-style: solid;
            text-align: center;
            display: inline-block;
        }
    </style>
</%def>

<div class="grid-header">
    <h2>${grid.title}</h2>
    
    %if grid.global_actions:
        <ul class="manage-table-actions">
        %for action in grid.global_actions:
            <li>
                <a class="action-button" href="${h.url_for( **action.url_args )}">${action.label}</a>
            </li>
        %endfor
        </ul>
    %endif
    
    %if grid.standard_filters:
        <span class="title">Filter:</span>
        %for i, filter in enumerate( grid.standard_filters ):
            %if i > 0:    
                <span>|</span>
            %endif
            <span class="filter"><a href="${url( filter.get_url_args() )}">${filter.label}</a></span>
        %endfor
    %endif
</div>

<form action="${url()}" method="post" >
    <table class="grid">
        <thead>
            <tr>
                %if grid.has_multiple_item_operations:
                    <th></th>
                %endif
                %for column in grid.columns:
                    %if column.visible:
                        <%
                            href = ""
                            extra = ""
                            if column.sortable:
                                if sort_key == column.key:
                                    if sort_order == "asc":
                                        href = url( sort=( "-" + column.key ) )
                                        extra = "&darr;"
                                    else:
                                        href = url( sort=( column.key ) )
                                        extra = "&uarr;"
                                else:
                                    href = url( sort=column.key )
                        %>
                        <th\
                        %if column.ncells > 1:
                            colspan="${column.ncells}"
                        %endif
                        >
                            %if href:
                                <a href="${href}">${column.label}</a>
                            %else:
                                ${column.label}
                            %endif
                            <span>${extra}</span>
                        </th>
                    %endif
                %endfor
                <th></th>
            </tr>
        </thead>
        <tbody>
            %for i, item in enumerate( query ):
                <tr \
                %if current_item == item:
                    class="current" \
                %endif
                > 
                    ## Item selection column
                    %if grid.has_multiple_item_operations:
                        <td style="width: 1.5em;">
                            <input type="checkbox" name="id" value=${trans.security.encode_id( item.id )} class="grid-row-select-checkbox" />
                        </td>
                    %endif
                    ## Data columns
                    %for column in grid.columns:
                        %if column.visible:
                            <%
                                # Link
                                link = column.get_link( trans, grid, item )
                                if link:
                                    href = url( **link )
                                else:
                                    href = None
                                # Value (coerced to list so we can loop)
                                value = column.get_value( trans, grid, item )
                                if column.ncells == 1:
                                    value = [ value ]
                            %>
                            %for cellnum, v in enumerate( value ):
                                <%
                                    # Attach popup menu?
                                    if column.attach_popup and cellnum == 0:
                                        extra = '<a id="grid-%d-popup" class="arrow" style="display: none;"><span>&#9660;</span></a>' % i
                                    else:
                                        extra = ""
                                    # Button class
                                    if href and extra:
                                        cls = "menubutton split"
                                    elif extra:
                                        cls = "menubutton"
                                    else:
                                        cls = ""
                                %>
                                %if href:                    
                                    <td><div class="${cls}"><a class="label" href="${href}">${v|h}${extra}</a></div></td>
                                %else:
                                    <td><div class="${cls}">${v}${extra}</div></td>
                                %endif    
                            %endfor
                        %endif
                    %endfor
                    ## Actions column
                    <td>
                        <div popupmenu="grid-${i}-popup">
                            %for operation in grid.operations:
                                %if operation.allowed( item ):
                                    <%
                                    target = ""
                                    if operation.target:
                                        target = "target='" + operation.target + "'"
                                    %>  
                                    <a class="action-button" ${target} href="${url( **operation.get_url_args( item ) )}">${operation.label}</a>
                                %endif
                            %endfor
                        </div>
                    </td>
                </tr>
            %endfor
        </tbody>
        %if grid.has_multiple_item_operations:
        <tfoot>
            <tr>
                <td></td>
                <td colspan="100">
                    For <span class="grid-selected-count"></span> selected items:
                    %for operation in grid.operations:
                        %if operation.allow_multiple:
                            <input type="submit" name="operation" value="${operation.label}" class="action-button">
                        %endif
                    %endfor
                </td>
            </tr>
        </tfoot>
        %endif
    </table>
</form>
