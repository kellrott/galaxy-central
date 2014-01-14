(function(){var b=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["template-hda-body"]=b(function(g,r,p,k,z){this.compilerInfo=[4,">= 1.0.0"];p=this.merge(p,g.helpers);z=z||{};var q="",h,e="function",d=this.escapeExpression,o=this,c=p.blockHelperMissing;function n(D,C){var A="",B;A+='\n    <div class="dataset-summary">\n        ';if(B=p.body){B=B.call(D,{hash:{},data:C})}else{B=D.body;B=typeof B===e?B.apply(D):B}if(B||B===0){A+=B}A+='\n    </div>\n    <div class="dataset-actions clear">\n        <div class="left"></div>\n        <div class="right"></div>\n    </div>\n\n    ';return A}function m(D,C){var A="",B;A+='\n    <div class="dataset-summary">\n        ';B=p["if"].call(D,D.misc_blurb,{hash:{},inverse:o.noop,fn:o.program(4,l,C),data:C});if(B||B===0){A+=B}A+="\n\n        ";B=p["if"].call(D,D.data_type,{hash:{},inverse:o.noop,fn:o.program(6,j,C),data:C});if(B||B===0){A+=B}A+="\n\n        ";B=p["if"].call(D,D.metadata_dbkey,{hash:{},inverse:o.noop,fn:o.program(9,f,C),data:C});if(B||B===0){A+=B}A+="\n\n        ";B=p["if"].call(D,D.misc_info,{hash:{},inverse:o.noop,fn:o.program(12,x,C),data:C});if(B||B===0){A+=B}A+='\n    </div>\n\n    <div class="dataset-actions clear">\n        <div class="left"></div>\n        <div class="right"></div>\n    </div>\n\n    ';B=p.unless.call(D,D.deleted,{hash:{},inverse:o.noop,fn:o.program(14,w,C),data:C});if(B||B===0){A+=B}A+="\n\n    ";return A}function l(D,C){var A="",B;A+='\n        <div class="dataset-blurb">\n            <span class="value">';if(B=p.misc_blurb){B=B.call(D,{hash:{},data:C})}else{B=D.misc_blurb;B=typeof B===e?B.apply(D):B}A+=d(B)+"</span>\n        </div>\n        ";return A}function j(E,D){var A="",C,B;A+='\n        <div class="dataset-datatype">\n            <label class="prompt">';B={hash:{},inverse:o.noop,fn:o.program(7,i,D),data:D};if(C=p.local){C=C.call(E,B)}else{C=E.local;C=typeof C===e?C.apply(E):C}if(!p.local){C=c.call(E,C,B)}if(C||C===0){A+=C}A+='</label>\n            <span class="value">';if(C=p.data_type){C=C.call(E,{hash:{},data:D})}else{C=E.data_type;C=typeof C===e?C.apply(E):C}A+=d(C)+"</span>\n        </div>\n        ";return A}function i(B,A){return"format"}function f(E,D){var A="",C,B;A+='\n        <div class="dataset-dbkey">\n            <label class="prompt">';B={hash:{},inverse:o.noop,fn:o.program(10,y,D),data:D};if(C=p.local){C=C.call(E,B)}else{C=E.local;C=typeof C===e?C.apply(E):C}if(!p.local){C=c.call(E,C,B)}if(C||C===0){A+=C}A+='</label>\n            <span class="value">\n                ';if(C=p.metadata_dbkey){C=C.call(E,{hash:{},data:D})}else{C=E.metadata_dbkey;C=typeof C===e?C.apply(E):C}A+=d(C)+"\n            </span>\n        </div>\n        ";return A}function y(B,A){return"database"}function x(D,C){var A="",B;A+='\n        <div class="dataset-info">\n            <span class="value">';if(B=p.misc_info){B=B.call(D,{hash:{},data:C})}else{B=D.misc_info;B=typeof B===e?B.apply(D):B}A+=d(B)+"</span>\n        </div>\n        ";return A}function w(D,C){var A="",B;A+='\n    <div class="tags-display"></div>\n    <div class="annotation-display"></div>\n\n    <div class="dataset-display-applications">\n        ';B=p.each.call(D,D.display_apps,{hash:{},inverse:o.noop,fn:o.program(15,v,C),data:C});if(B||B===0){A+=B}A+="\n\n        ";B=p.each.call(D,D.display_types,{hash:{},inverse:o.noop,fn:o.program(15,v,C),data:C});if(B||B===0){A+=B}A+='\n    </div>\n\n    <div class="dataset-peek">\n    ';B=p["if"].call(D,D.peek,{hash:{},inverse:o.noop,fn:o.program(19,s,C),data:C});if(B||B===0){A+=B}A+="\n    </div>\n\n    ";return A}function v(D,C){var A="",B;A+='\n        <div class="display-application">\n            <span class="display-application-location">';if(B=p.label){B=B.call(D,{hash:{},data:C})}else{B=D.label;B=typeof B===e?B.apply(D):B}A+=d(B)+'</span>\n            <span class="display-application-links">\n                ';B=p.each.call(D,D.links,{hash:{},inverse:o.noop,fn:o.program(16,u,C),data:C});if(B||B===0){A+=B}A+="\n            </span>\n        </div>\n        ";return A}function u(E,D){var A="",C,B;A+='\n                <a target="';if(C=p.target){C=C.call(E,{hash:{},data:D})}else{C=E.target;C=typeof C===e?C.apply(E):C}A+=d(C)+'" href="';if(C=p.href){C=C.call(E,{hash:{},data:D})}else{C=E.href;C=typeof C===e?C.apply(E):C}A+=d(C)+'">';B={hash:{},inverse:o.noop,fn:o.program(17,t,D),data:D};if(C=p.local){C=C.call(E,B)}else{C=E.local;C=typeof C===e?C.apply(E):C}if(!p.local){C=c.call(E,C,B)}if(C||C===0){A+=C}A+="</a>\n                ";return A}function t(C,B){var A;if(A=p.text){A=A.call(C,{hash:{},data:B})}else{A=C.text;A=typeof A===e?A.apply(C):A}return d(A)}function s(D,C){var A="",B;A+='\n        <pre class="peek">';if(B=p.peek){B=B.call(D,{hash:{},data:C})}else{B=D.peek;B=typeof B===e?B.apply(D):B}if(B||B===0){A+=B}A+="</pre>\n    ";return A}q+='<div class="dataset-body">\n    ';h=p["if"].call(r,r.body,{hash:{},inverse:o.program(3,m,z),fn:o.program(1,n,z),data:z});if(h||h===0){q+=h}q+="\n</div>";return q})})();(function(){var b=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["template-hda-skeleton"]=b(function(f,r,p,k,w){this.compilerInfo=[4,">= 1.0.0"];p=this.merge(p,f.helpers);w=w||{};var q="",h,e="function",d=this.escapeExpression,o=this,c=p.blockHelperMissing;function n(B,A){var x="",z,y;x+='\n        <div class="errormessagesmall">\n            ';y={hash:{},inverse:o.noop,fn:o.program(2,m,A),data:A};if(z=p.local){z=z.call(B,y)}else{z=B.local;z=typeof z===e?z.apply(B):z}if(!p.local){z=c.call(B,z,y)}if(z||z===0){x+=z}x+=":\n            ";y={hash:{},inverse:o.noop,fn:o.program(4,l,A),data:A};if(z=p.local){z=z.call(B,y)}else{z=B.local;z=typeof z===e?z.apply(B):z}if(!p.local){z=c.call(B,z,y)}if(z||z===0){x+=z}x+="\n        </div>\n        ";return x}function m(y,x){return"There was an error getting the data for this dataset"}function l(z,y){var x;if(x=p.error){x=x.call(z,{hash:{},data:y})}else{x=z.error;x=typeof x===e?x.apply(z):x}return d(x)}function j(A,z){var x="",y;x+="\n            ";y=p["if"].call(A,A.purged,{hash:{},inverse:o.program(10,v,z),fn:o.program(7,i,z),data:z});if(y||y===0){x+=y}x+="\n        ";return x}function i(B,A){var x="",z,y;x+='\n            <div class="dataset-purged-msg warningmessagesmall"><strong>\n                ';y={hash:{},inverse:o.noop,fn:o.program(8,g,A),data:A};if(z=p.local){z=z.call(B,y)}else{z=B.local;z=typeof z===e?z.apply(B):z}if(!p.local){z=c.call(B,z,y)}if(z||z===0){x+=z}x+="\n            </strong></div>\n\n            ";return x}function g(y,x){return"This dataset has been deleted and removed from disk."}function v(B,A){var x="",z,y;x+='\n            <div class="dataset-deleted-msg warningmessagesmall"><strong>\n                ';y={hash:{},inverse:o.noop,fn:o.program(11,u,A),data:A};if(z=p.local){z=z.call(B,y)}else{z=B.local;z=typeof z===e?z.apply(B):z}if(!p.local){z=c.call(B,z,y)}if(z||z===0){x+=z}x+="\n            </strong></div>\n            ";return x}function u(y,x){return"This dataset has been deleted."}function t(B,A){var x="",z,y;x+='\n        <div class="dataset-hidden-msg warningmessagesmall"><strong>\n            ';y={hash:{},inverse:o.noop,fn:o.program(14,s,A),data:A};if(z=p.local){z=z.call(B,y)}else{z=B.local;z=typeof z===e?z.apply(B):z}if(!p.local){z=c.call(B,z,y)}if(z||z===0){x+=z}x+="\n        </strong></div>\n        ";return x}function s(y,x){return"This dataset has been hidden."}q+='<div class="dataset hda">\n    <div class="dataset-warnings">\n        ';h=p["if"].call(r,r.error,{hash:{},inverse:o.noop,fn:o.program(1,n,w),data:w});if(h||h===0){q+=h}q+="\n\n        ";h=p["if"].call(r,r.deleted,{hash:{},inverse:o.noop,fn:o.program(6,j,w),data:w});if(h||h===0){q+=h}q+="\n\n        ";h=p.unless.call(r,r.visible,{hash:{},inverse:o.noop,fn:o.program(13,t,w),data:w});if(h||h===0){q+=h}q+='\n    </div>\n\n    <div class="dataset-selector"><span class="fa fa-2x fa-square-o"></span></div>\n    <div class="dataset-primary-actions"></div>\n    \n    <div class="dataset-title-bar clear" tabindex="0">\n        <span class="dataset-state-icon state-icon"></span>\n        <div class="dataset-title">\n            <span class="hda-hid">';if(h=p.hid){h=h.call(r,{hash:{},data:w})}else{h=r.hid;h=typeof h===e?h.apply(r):h}q+=d(h)+'</span>\n            <span class="dataset-name">';if(h=p.name){h=h.call(r,{hash:{},data:w})}else{h=r.name;h=typeof h===e?h.apply(r):h}q+=d(h)+'</span>\n        </div>\n    </div>\n\n    <div class="dataset-body"></div>\n</div>';return q})})();(function(){var b=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["template-history-historyPanel-anon"]=b(function(h,r,p,l,t){this.compilerInfo=[4,">= 1.0.0"];p=this.merge(p,h.helpers);t=t||{};var q="",i,f,e="function",d=this.escapeExpression,o=this,c=p.blockHelperMissing;function n(x,w){var u="",v;u+='\n                <div class="history-name">\n                    ';if(v=p.name){v=v.call(x,{hash:{},data:w})}else{v=x.name;v=typeof v===e?v.apply(x):v}u+=d(v)+"\n                </div>\n            ";return u}function m(x,w){var u="",v;u+='\n            <div class="history-size">';if(v=p.nice_size){v=v.call(x,{hash:{},data:w})}else{v=x.nice_size;v=typeof v===e?v.apply(x):v}u+=d(v)+"</div>\n            ";return u}function k(x,w){var u="",v;u+='\n            \n            <div class="';if(v=p.status){v=v.call(x,{hash:{},data:w})}else{v=x.status;v=typeof v===e?v.apply(x):v}u+=d(v)+'message">';if(v=p.message){v=v.call(x,{hash:{},data:w})}else{v=x.message;v=typeof v===e?v.apply(x):v}u+=d(v)+"</div>\n            ";return u}function j(v,u){return"You are over your disk quota"}function g(v,u){return"Tool execution is on hold until your disk usage drops below your allocated quota"}function s(v,u){return"Your history is empty. Click 'Get Data' on the left pane to start"}q+='<div class="history-controls">\n        <div class="history-search-controls">\n            <div class="history-search-input"></div>\n        </div>\n\n        <div class="history-title">\n            \n            ';i=p["if"].call(r,r.name,{hash:{},inverse:o.noop,fn:o.program(1,n,t),data:t});if(i||i===0){q+=i}q+='\n        </div>\n\n        <div class="history-subtitle clear">\n            ';i=p["if"].call(r,r.nice_size,{hash:{},inverse:o.noop,fn:o.program(3,m,t),data:t});if(i||i===0){q+=i}q+='\n\n            <div class="history-secondary-actions"></div>\n        </div>\n\n        <div class="message-container">\n            ';i=p["if"].call(r,r.message,{hash:{},inverse:o.noop,fn:o.program(5,k,t),data:t});if(i||i===0){q+=i}q+='\n        </div>\n\n        <div class="quota-message errormessage">\n            ';f={hash:{},inverse:o.noop,fn:o.program(7,j,t),data:t};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+=".\n            ";f={hash:{},inverse:o.noop,fn:o.program(9,g,t),data:t};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+='.\n        </div>\n\n    </div>\n\n    \n    <div class="datasets-list"></div>\n\n    <div class="empty-history-message infomessagesmall">\n        ';f={hash:{},inverse:o.noop,fn:o.program(11,s,t),data:t};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+="\n    </div>";return q})})();(function(){var b=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["template-history-historyPanel-anon"]=b(function(h,r,p,l,t){this.compilerInfo=[4,">= 1.0.0"];p=this.merge(p,h.helpers);t=t||{};var q="",i,f,e="function",d=this.escapeExpression,o=this,c=p.blockHelperMissing;function n(x,w){var u="",v;u+='\n                <div class="history-name">\n                    ';if(v=p.name){v=v.call(x,{hash:{},data:w})}else{v=x.name;v=typeof v===e?v.apply(x):v}u+=d(v)+"\n                </div>\n            ";return u}function m(x,w){var u="",v;u+='\n            <div class="history-size">';if(v=p.nice_size){v=v.call(x,{hash:{},data:w})}else{v=x.nice_size;v=typeof v===e?v.apply(x):v}u+=d(v)+"</div>\n            ";return u}function k(x,w){var u="",v;u+='\n            \n            <div class="';if(v=p.status){v=v.call(x,{hash:{},data:w})}else{v=x.status;v=typeof v===e?v.apply(x):v}u+=d(v)+'message">';if(v=p.message){v=v.call(x,{hash:{},data:w})}else{v=x.message;v=typeof v===e?v.apply(x):v}u+=d(v)+"</div>\n            ";return u}function j(v,u){return"You are over your disk quota"}function g(v,u){return"Tool execution is on hold until your disk usage drops below your allocated quota"}function s(v,u){return"Your history is empty. Click 'Get Data' on the left pane to start"}q+='<div class="history-controls">\n        <div class="history-search-controls">\n            <div class="history-search-input"></div>\n        </div>\n\n        <div class="history-title">\n            \n            ';i=p["if"].call(r,r.name,{hash:{},inverse:o.noop,fn:o.program(1,n,t),data:t});if(i||i===0){q+=i}q+='\n        </div>\n\n        <div class="history-subtitle clear">\n            ';i=p["if"].call(r,r.nice_size,{hash:{},inverse:o.noop,fn:o.program(3,m,t),data:t});if(i||i===0){q+=i}q+='\n\n            <div class="history-secondary-actions"></div>\n        </div>\n\n        <div class="message-container">\n            ';i=p["if"].call(r,r.message,{hash:{},inverse:o.noop,fn:o.program(5,k,t),data:t});if(i||i===0){q+=i}q+='\n        </div>\n\n        <div class="quota-message errormessage">\n            ';f={hash:{},inverse:o.noop,fn:o.program(7,j,t),data:t};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+=".\n            ";f={hash:{},inverse:o.noop,fn:o.program(9,g,t),data:t};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+='.\n        </div>\n\n    </div>\n\n    \n    <div class="datasets-list"></div>\n\n    <div class="empty-history-message infomessagesmall">\n        ';f={hash:{},inverse:o.noop,fn:o.program(11,s,t),data:t};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+="\n    </div>";return q})})();(function(){var b=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["template-history-historyPanel"]=b(function(g,r,p,l,x){this.compilerInfo=[4,">= 1.0.0"];p=this.merge(p,g.helpers);x=x||{};var q="",i,f,e="function",d=this.escapeExpression,o=this,c=p.blockHelperMissing;function n(B,A){var y="",z;y+='\n            <div class="history-name">\n                ';if(z=p.name){z=z.call(B,{hash:{},data:A})}else{z=B.name;z=typeof z===e?z.apply(B):z}y+=d(z)+"\n            </div>\n            ";return y}function m(B,A){var y="",z;y+='\n            <div class="history-size">';if(z=p.nice_size){z=z.call(B,{hash:{},data:A})}else{z=B.nice_size;z=typeof z===e?z.apply(B):z}y+=d(z)+"</div>\n            ";return y}function k(C,B){var y="",A,z;y+='\n        <div class="warningmessagesmall"><strong>\n            ';z={hash:{},inverse:o.noop,fn:o.program(6,j,B),data:B};if(A=p.local){A=A.call(C,z)}else{A=C.local;A=typeof A===e?A.apply(C):A}if(!p.local){A=c.call(C,A,z)}if(A||A===0){y+=A}y+="\n        </strong></div>\n        ";return y}function j(z,y){return"You are currently viewing a deleted history!"}function h(B,A){var y="",z;y+='\n            \n            <div class="';if(z=p.status){z=z.call(B,{hash:{},data:A})}else{z=B.status;z=typeof z===e?z.apply(B):z}y+=d(z)+'message">';if(z=p.message){z=z.call(B,{hash:{},data:A})}else{z=B.message;z=typeof z===e?z.apply(B):z}y+=d(z)+"</div>\n            ";return y}function w(z,y){return"You are over your disk quota"}function v(z,y){return"Tool execution is on hold until your disk usage drops below your allocated quota"}function u(z,y){return"Select all"}function t(z,y){return"For all selected"}function s(z,y){return"Your history is empty. Click 'Get Data' on the left pane to start"}q+='<div class="history-controls">\n        <div class="history-search-controls">\n            <div class="history-search-input"></div>\n        </div>\n\n        <div class="history-title">\n            ';i=p["if"].call(r,r.name,{hash:{},inverse:o.noop,fn:o.program(1,n,x),data:x});if(i||i===0){q+=i}q+='\n        </div>\n\n        <div class="history-subtitle clear">\n            ';i=p["if"].call(r,r.nice_size,{hash:{},inverse:o.noop,fn:o.program(3,m,x),data:x});if(i||i===0){q+=i}q+='\n\n            <div class="history-secondary-actions"></div>\n        </div>\n\n        ';i=p["if"].call(r,r.deleted,{hash:{},inverse:o.noop,fn:o.program(5,k,x),data:x});if(i||i===0){q+=i}q+='\n\n        <div class="message-container">\n            ';i=p["if"].call(r,r.message,{hash:{},inverse:o.noop,fn:o.program(8,h,x),data:x});if(i||i===0){q+=i}q+='\n        </div>\n\n        <div class="quota-message errormessage">\n            ';f={hash:{},inverse:o.noop,fn:o.program(10,w,x),data:x};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+=".\n            ";f={hash:{},inverse:o.noop,fn:o.program(12,v,x),data:x};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+='.\n        </div>\n        \n        <div class="tags-display"></div>\n        <div class="annotation-display"></div>\n\n        <div class="history-dataset-actions">\n            <button class="history-select-all-datasets-btn btn btn-default"\n                    data-mode="select">';f={hash:{},inverse:o.noop,fn:o.program(14,u,x),data:x};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+='</button>\n            <button class="history-dataset-action-popup-btn btn btn-default"\n                    >';f={hash:{},inverse:o.noop,fn:o.program(16,t,x),data:x};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+='...</button>\n        </div>\n\n    </div>\n\n    \n    <div class="datasets-list"></div>\n\n    <div class="empty-history-message infomessagesmall">\n        ';f={hash:{},inverse:o.noop,fn:o.program(18,s,x),data:x};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+="\n    </div>";return q})})();(function(){var b=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["template-history-historyPanel"]=b(function(g,r,p,l,x){this.compilerInfo=[4,">= 1.0.0"];p=this.merge(p,g.helpers);x=x||{};var q="",i,f,e="function",d=this.escapeExpression,o=this,c=p.blockHelperMissing;function n(B,A){var y="",z;y+='\n            <div class="history-name">\n                ';if(z=p.name){z=z.call(B,{hash:{},data:A})}else{z=B.name;z=typeof z===e?z.apply(B):z}y+=d(z)+"\n            </div>\n            ";return y}function m(B,A){var y="",z;y+='\n            <div class="history-size">';if(z=p.nice_size){z=z.call(B,{hash:{},data:A})}else{z=B.nice_size;z=typeof z===e?z.apply(B):z}y+=d(z)+"</div>\n            ";return y}function k(C,B){var y="",A,z;y+='\n        <div class="warningmessagesmall"><strong>\n            ';z={hash:{},inverse:o.noop,fn:o.program(6,j,B),data:B};if(A=p.local){A=A.call(C,z)}else{A=C.local;A=typeof A===e?A.apply(C):A}if(!p.local){A=c.call(C,A,z)}if(A||A===0){y+=A}y+="\n        </strong></div>\n        ";return y}function j(z,y){return"You are currently viewing a deleted history!"}function h(B,A){var y="",z;y+='\n            \n            <div class="';if(z=p.status){z=z.call(B,{hash:{},data:A})}else{z=B.status;z=typeof z===e?z.apply(B):z}y+=d(z)+'message">';if(z=p.message){z=z.call(B,{hash:{},data:A})}else{z=B.message;z=typeof z===e?z.apply(B):z}y+=d(z)+"</div>\n            ";return y}function w(z,y){return"You are over your disk quota"}function v(z,y){return"Tool execution is on hold until your disk usage drops below your allocated quota"}function u(z,y){return"Select all"}function t(z,y){return"For all selected"}function s(z,y){return"Your history is empty. Click 'Get Data' on the left pane to start"}q+='<div class="history-controls">\n        <div class="history-search-controls">\n            <div class="history-search-input"></div>\n        </div>\n\n        <div class="history-title">\n            ';i=p["if"].call(r,r.name,{hash:{},inverse:o.noop,fn:o.program(1,n,x),data:x});if(i||i===0){q+=i}q+='\n        </div>\n\n        <div class="history-subtitle clear">\n            ';i=p["if"].call(r,r.nice_size,{hash:{},inverse:o.noop,fn:o.program(3,m,x),data:x});if(i||i===0){q+=i}q+='\n\n            <div class="history-secondary-actions"></div>\n        </div>\n\n        ';i=p["if"].call(r,r.deleted,{hash:{},inverse:o.noop,fn:o.program(5,k,x),data:x});if(i||i===0){q+=i}q+='\n\n        <div class="message-container">\n            ';i=p["if"].call(r,r.message,{hash:{},inverse:o.noop,fn:o.program(8,h,x),data:x});if(i||i===0){q+=i}q+='\n        </div>\n\n        <div class="quota-message errormessage">\n            ';f={hash:{},inverse:o.noop,fn:o.program(10,w,x),data:x};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+=".\n            ";f={hash:{},inverse:o.noop,fn:o.program(12,v,x),data:x};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+='.\n        </div>\n        \n        <div class="tags-display"></div>\n        <div class="annotation-display"></div>\n\n        <div class="history-dataset-actions">\n            <button class="history-select-all-datasets-btn btn btn-default"\n                    data-mode="select">';f={hash:{},inverse:o.noop,fn:o.program(14,u,x),data:x};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+='</button>\n            <button class="history-dataset-action-popup-btn btn btn-default"\n                    >';f={hash:{},inverse:o.noop,fn:o.program(16,t,x),data:x};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+='...</button>\n        </div>\n\n    </div>\n\n    \n    <div class="datasets-list"></div>\n\n    <div class="empty-history-message infomessagesmall">\n        ';f={hash:{},inverse:o.noop,fn:o.program(18,s,x),data:x};if(i=p.local){i=i.call(r,f)}else{i=r.local;i=typeof i===e?i.apply(r):i}if(!p.local){i=c.call(r,i,f)}if(i||i===0){q+=i}q+="\n    </div>";return q})})();