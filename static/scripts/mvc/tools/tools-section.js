/**
    This class creates a tool form section and populates it with input elements. It also handles repeat blocks and conditionals by recursively creating new sub sections. New input elements can be plugged in by adding cases to the switch block defined in the _addRow() function.
*/
define(['utils/utils', 'mvc/ui/ui-table', 'mvc/ui/ui-misc', 'mvc/tools/tools-repeat', 'mvc/tools/tools-select-content', 'mvc/tools/tools-input'],
    function(Utils, Table, Ui, Repeat, SelectContent, InputElement) {

    // create form view
    var View = Backbone.View.extend({
        // initialize
        initialize: function(app, options) {
            // link app
            this.app = app;
            
            // link inputs
            this.inputs = options.inputs;
            
            // add table class for tr tag
            // this assist in transforming the form into a json structure
            options.cls_tr = 'section-row';
            
            // create table
            this.table = new Table.View(options);
            
            // configure portlet and form table
            this.setElement(this.table.$el);
            
            // render tool section
            this.render();
        },
        
        /** Render section view
        */
        render: function() {
            // reset table
            this.table.delAll();
            
            // load settings elements into table
            for (var i in this.inputs) {
                this._add(this.inputs[i]);
            }
        },
        
        /** Add a new input element
        */
        _add: function(input) {
            // link this
            var self = this;
            
            // clone definition
            var input_def = jQuery.extend(true, {}, input);
            
            // create unique id
            input_def.id = input.id = Utils.uuid();
    
            // add to sequential list of inputs
            this.app.input_list[input_def.id] = input_def;
            
            // identify field type
            var type = input_def.type;
            switch(type) {
                // conditional field
                case 'conditional':
                    this._addConditional(input_def);
                    break;
                // repeat block
                case 'repeat':
                    this._addRepeat(input_def);
                    break;
                // default single element row
                default:
                    this._addRow(type, input_def);
            }
        },
        
        /** Add a conditional block
        */
        _addConditional: function(input_def) {
            // add label to input definition root
            input_def.label = input_def.test_param.label;
        
            // add value to input definition root
            input_def.value = input_def.test_param.value;
        
            // build options field
            var field = this._addRow('conditional', input_def);
            
            // add fields
            for (var i in input_def.cases) {
                // create id tag
                var sub_section_id = input_def.id + '-section-' + i;
                
                // create sub section
                var sub_section = new View(this.app, {
                    inputs  : input_def.cases[i].inputs,
                    cls     : 'ui-table-plain'
                });
                
                // displays as grouped subsection
                sub_section.$el.addClass('ui-table-form-section');
                
                // create table row
                this.table.add(sub_section.$el);
                
                // append to table
                this.table.append(sub_section_id);
            }
            
            // trigger refresh on conditional input field after all input elements have been created
            field.trigger('change');
        },
        
        /** Add a repeat block
        */
        _addRepeat: function(input_def) {
            // link this
            var self = this;
            
            // block index
            var block_index = 0;
            
            // helper function to create new repeat blocks
            function create (inputs, deleteable) {
                // create id tag
                var sub_section_id = input_def.id + '-section-' + (block_index++);
            
                // enable/disable repeat delete button
                var ondel = null;
                if (deleteable) {
                    ondel = function() {
                        // delete repeat block
                        repeat.del(sub_section_id);
                        
                        // retitle repeat block
                        repeat.retitle(input_def.title);
                        
                        // trigger refresh
                        self.app.rebuild();
                        self.app.refresh();
                    }
                }
                    
                // create sub section
                var sub_section = new View(self.app, {
                    inputs  : inputs,
                    cls     : 'ui-table-plain'
                });
                
                // add tab
                repeat.add({
                    id      : sub_section_id,
                    title   : input_def.title,
                    $el     : sub_section.$el,
                    ondel   : ondel
                });
                
                // retitle repeat block
                repeat.retitle(input_def.title);
            }
            
            //
            // create repeat block element
            //
            var repeat = new Repeat.View({
                title_new       : input_def.title,
                max             : input_def.max,
                onnew           : function() {
                    // create
                    create(input_def.inputs, true);
                            
                    // trigger refresh
                    self.app.rebuild();
                    self.app.refresh();
                }
            });
            
            //
            // add parsed/minimum number of repeat blocks
            //
            var n_min   = input_def.min;
            var n_cache = _.size(input_def.cache);
            for (var i = 0; i < Math.max(n_cache, n_min); i++) {
                // select input source
                var inputs = null;
                if (i < n_cache) {
                    inputs = input_def.cache[i];
                } else {
                    inputs = input_def.inputs;
                }
                
                // create repeat block
                create(inputs, i >= n_min);
            }
            
            // create input field wrapper
            var input_element = new InputElement(this.app, {
                label       : input_def.title,
                help        : input_def.help,
                field       : repeat
            });
            
            // displays as grouped subsection
            input_element.$el.addClass('ui-table-form-section');
                
            // create table row
            this.table.add(input_element.$el);
            
            // append row to table
            this.table.append(input_def.id);
        },
        
        /** Add a single field element
        */
        _addRow: function(field_type, input_def) {
            // get id
            var id = input_def.id;

            // field wrapper
            var field = null;
            
            // identify field type
            switch(field_type) {
                // text input field
                case 'text' :
                    field = this._fieldText(input_def);
                    break;
                    
                // select field
                case 'select' :
                    field = this._fieldSelect(input_def);
                    break;
                    
                // data selector
                case 'data':
                    field = this._fieldData(input_def);
                    break;
                
                // data column
                case 'data_column':
                    field = this._fieldSelect(input_def);
                    break;
                    
                // conditional select field
                case 'conditional':
                    field = this._fieldConditional(input_def);
                    break;
                
                // hidden field
                case 'hidden':
                    field = this._fieldHidden(input_def);
                    break;
                
                // integer field
                case 'integer':
                    field = this._fieldSlider(input_def);
                    break;
                
                // float field
                case 'float':
                    field = this._fieldSlider(input_def);
                    break;
                                    
                // boolean field
                case 'boolean':
                    field = this._fieldBoolean(input_def);
                    break;
                    
                // genome field
                case 'genomebuild':
                    field = this._fieldSelect(input_def);
                    break;
                    
                // field not found
                default:
                    // flag
                    this.app.incompatible = true;
                    
                    // with or without options
                    if (input_def.options) {
                        // assign select field
                        field = this._fieldSelect(input_def);
                    } else {
                        // assign text field
                        field = this._fieldText(input_def);
                    }
                    
                    // log
                    console.debug('tools-form::_addRow() : Auto matched field type (' + field_type + ').');
            }
            
            // deactivate dynamic fields
            if (input_def.is_dynamic) {
                //this.app.incompatible = true;
                this.app.is_dynamic = true;
            }
            
            // set field value
            if (input_def.value !== undefined) {
                field.value(input_def.value);
            }
            
            // add to field list
            this.app.field_list[id] = field;
            
            // create input field wrapper
            var input_element = new InputElement(this.app, {
                label       : input_def.label,
                optional    : input_def.optional,
                help        : input_def.help,
                field       : field
            });
            
            // add to element list
            this.app.element_list[id] = input_element;
               
            // create table row
            this.table.add(input_element.$el);
            
            // append to table
            this.table.append(id);
            
            // return created field
            return field;
        },
        
        /** Conditional input field selector
        */
        _fieldConditional : function(input_def) {
            // link this
            var self = this;

            // configure options fields
            var options = [];
            for (var i in input_def.test_param.options) {
                var option = input_def.test_param.options[i];
                options.push({
                    label: option[0],
                    value: option[1]
                });
            }
            
            // select field
            return new Ui.Select.View({
                id          : 'field-' + input_def.id,
                data        : options,
                onchange    : function(value) {
                    // check value in order to hide/show options
                    for (var i in input_def.cases) {
                        // get case
                        var case_def = input_def.cases[i];
                        
                        // identify subsection name
                        var section_id = input_def.id + '-section-' + i;
                        
                        // identify row
                        var section_row = self.table.get(section_id);
                        
                        // check if non-hidden elements exist
                        var nonhidden = false;
                        for (var j in case_def.inputs) {
                            var type = case_def.inputs[j].type;
                            if (type && type !== 'hidden') {
                                nonhidden = true;
                                break;
                            }
                        }
                        
                        // show/hide sub form
                        if (case_def.value == value && nonhidden) {
                            section_row.fadeIn('fast');
                        } else {
                            section_row.hide();
                        }
                    }
                    
                    // refresh form inputs
                    self.app.refresh();
                }
            });
        },
        
        /** Data input field
        */
        _fieldData : function(input_def) {
            var self = this;
            return new SelectContent.View(this.app, {
                id          : 'field-' + input_def.id,
                extensions  : input_def.extensions,
                multiple    : input_def.multiple,
                onchange    : function() {
                    self.app.refresh();
                }
            });
        },
        
        /** Select/Checkbox/Radio options field
        */
        _fieldSelect : function (input_def) {
            // configure options fields
            var options = [];
            for (var i in input_def.options) {
                var option = input_def.options[i];
                options.push({
                    label: option[0],
                    value: option[1]
                });
            }
            
            // identify display type
            var SelectClass = Ui.Select;
            switch (input_def.display) {
                case 'checkboxes':
                    SelectClass = Ui.Checkbox;
                    break;
                case 'radio':
                    SelectClass = Ui.Radio;
                    break;
            }
            
            // select field
            var self = this;
            return new SelectClass.View({
                id      : 'field-' + input_def.id,
                data    : options,
                multiple: input_def.multiple,
                onchange: function() {
                    self.app.refresh();
                }
            });
        },
        
        /** Text input field
        */
        _fieldText : function(input_def) {
            var self = this;
            return new Ui.Input({
                id      : 'field-' + input_def.id,
                area    : input_def.area,
                onchange: function() {
                    self.app.refresh();
                }
            });
        },
        
        /** Slider field
        */
        _fieldSlider: function(input_def) {
            return new Ui.Slider.View({
                id      : 'field-' + input_def.id,
                precise : input_def.type == 'float',
                min     : input_def.min,
                max     : input_def.max
            });
        },
        
        /** Hidden field
        */
        _fieldHidden : function(input_def) {
            return new Ui.Hidden({
                id      : 'field-' + input_def.id
            });
        },
        
        /** Boolean field
        */
        _fieldBoolean : function(input_def) {
            return new Ui.RadioButton.View({
                id      : 'field-' + input_def.id,
                data    : [ { label : 'Yes', value : 'true'  },
                            { label : 'No',  value : 'false' }]
            });
        }
    });

    return {
        View: View
    };
});
