/*
Author :Kevin Kline B. Gargar
Date Created: May 13 2014
Description: This a suggestion list dropdown jquery plugin that capable to fill up multiple text fields values.

*/

;(function($) {


    var defaults = {
        'data'            : false,
        'max_suggestion'  :3
    };


    function Multifill(element, config) {
        this.config = $.extend({}, defaults, config);
        this.elem = element;
        this.listdiv = false;
        this.listitem=false;
        if(this.config['data'] !== false){
            this.init();  
        }
        
    
    };

    //Initialize all listeners and functions for the assigned element
    Multifill.prototype.init = function() {
        var self =this;
        var data = self.config.data;
        var current_selected = 0;
        var current_state = 1;
        this.elemid = $(self.elem).attr('id');
        this.listdiv = 'multifill-'+self.elemid+'-suggestion';
        this.listitem = 'multifill-'+self.elemid+'-suggestion-item';
        $('<div>', {
            id: self.listdiv
        }).insertAfter(self.elem);
     
        //drop down list css style
        $('#'+this.listdiv).css({
            'position': 'fixed',
            'z-index': 9999,
            'min-width':$(this.elem).width()+'px',
            'border':'1px solid #BEBCBC',
            'background-color':'white',
            'display':'none',
            'left':$(self.elem).offset().left,
            'max-height':'150px',
            'overflow-y':'auto'
        });

        $( window ).resize(function() {
            $('#'+self.listdiv).css({
                    'min-width':$(this.elem).width()+'px',
                    'left':$(self.elem).offset().left
            });
        });
        
        //listener to highlight the item when mouseover
        $('body').delegate('.'+self.listitem, 'mouseover', function() {
            var id = this.id;
            var inc_item = id.split("_")[1];
            current_selected =parseInt(inc_item);
            current_state = 3;
            $('.'+self.listitem).removeClass("multifill_selected_item");
    
            $(this).addClass("multifill_selected_item");

        });

        //Apply all field values on the selected item
        function fillInput(id){
            
            var record_position = $('#'+id).attr('data-mf-position');
            var fields = data[record_position]['fields'];
            
            if(fields !== undefined){
                for(var ii=0;ii<fields.length;ii++){

                    if($(fields[ii]['selector']).length !== 0 ){
                        var element_type = $(fields[ii]['selector']).attr('type');
                        if(element_type == undefined){
                           

                            var tagname= $(fields[ii]['selector'])[0].nodeName.toLowerCase();
                            if(tagname.toLowerCase() == 'select'){
                                $(fields[ii]['selector']+" option[value='"+fields[ii]['value']+"']").prop("selected",true);
                            }else{
                                console.log("Cannot assigned value in element with selector"+fields[ii]['selector']);
                            }
                        }else{
                            if(element_type.toLowerCase() == "radio"){
                               

                                $(fields[ii]['selector']).each(function(){
                                    $(this).prop('checked',false);
                                    if($(this).val() == fields[ii]['value'] ){
                                        $(this).prop('checked', true); 
                                    }
                                });
                                

                            }else if(element_type.toLowerCase() == "checkbox"){
                                var values = [];
                                if(typeof fields[ii]['value'] == 'object'){
                                    values = fields[ii]['value'];
                                }else{
                                    values.push(fields[ii]['value']);
                                }
                                $(fields[ii]['selector']).each(function(){
                                    $(this).prop('checked', false);
                                    for(var xx =0;xx < values.length ;xx++){
                                    
                                        if(values[xx] == $(this).val()){
                                            $(this).prop('checked', true);
                                        } 
                                    }
                                   
                                });
                            }else{
                                $(fields[ii]['selector']).val(fields[ii]['value']); 
                            }
                        }
                         
                    }else{
                        //Gives warning to the browser console if the given element was not found.
                        console.log("Multifill warning : No element has an id of "+fields[ii]['id']);
                    }

                    
                }   
            }
        }
        function clearfields(){
            
            var fields = data[0]['fields'];
           
                   
            for(var ii=0;ii<fields.length;ii++){
                if((fields !== undefined) && ($(fields[ii]['selector']).attr('id') !== self.elemid)){
                    if($(fields[ii]['selector']).length !== 0 ){
                        var element_type = $(fields[ii]['selector']).attr('type');
                        if(element_type == undefined){
                           
                            var tagname= $(fields[ii]['selector'])[0].nodeName.toLowerCase();
                            if(tagname.toLowerCase() == 'select'){
                                $(fields[ii]['selector']).attr("selected",false);
                            }else{
                                console.log("Cannot clear value in element with selector"+fields[ii]['selector']);
                            }
                        }else{
                            if(element_type.toLowerCase() == "radio"){
                               

                                $(fields[ii]['selector']).each(function(){
                                    $(this).prop('checked',false);
                                    
                                });
                                

                            }else if(element_type.toLowerCase() == "checkbox"){
                               
                                $(fields[ii]['selector']).each(function(){
                                    $(this).prop('checked', false);                                           
                                });
                            }else{
                                $(fields[ii]['selector']).val(""); 
                            }
                        }
                         
                    }else{
                        //Gives warning to the browser console if the given element was not found.
                        console.log("Multifill warning : No element has an id of "+fields[ii]['id']);
                    }

                    
                }   
            }
               
        }

        
        //listener when the item was click.Fillup all field values
        $('body').undelegate('click').delegate('.'+self.listitem, 'touchstart', function() {
            var id = this.id;
            fillInput(id);
            $('#'+self.listdiv).html("");
            $('#'+self.listdiv).hide();
            return false;
            
        });

        //listener when the item was click.Fillup all field values
        $('body').undelegate('click').delegate('.'+self.listitem, 'click', function() {
            var id = this.id;
            fillInput(id);
            $('#'+self.listdiv).html("");
            $('#'+self.listdiv).hide();
            return false;
            
        });
        
        
        // get the values entered by a user to produce a suggestion list
        $(this.elem).keyup(function(e){
            
            var inc_x=0;
            //If not pressing up and down arrow key proceed to create suggestion list
            if((e.keyCode !==40) && (e.keyCode !==38)){
                clearfields();
                $('#'+self.listdiv).scrollTop(0);
                $("#"+self.listdiv).html("");
                $('#'+self.listdiv).hide();
                var textvalue = $(this).val();
                
                current_selected = 0;
                current_state = 1;
                if(textvalue == ""){
                    $('#'+self.listdiv).html("");
                    return true;
                };
                $('#'+self.listdiv).css({
         
                    'min-width':$(this.elem).width()+'px',
                    'left':$(self.elem).offset().left
                 
                });
                var displayname_val = [];

                for(var xx=0;xx< data.length;xx++){
                    
                    if(data[xx]['displayname'].toLowerCase().indexOf(textvalue.toLowerCase()) !== -1){
               
                        
                        var item = {
                            'displayname':data[xx]['displayname'],
                            'position':xx
                        };
                        displayname_val.push(item);
                        //sort the displayname alphabetically
                        var item_sorted = displayname_val.sort(function(a, b){
                                            var x = a.displayname; var y =b.displayname;
                                            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                                    
                                            });
                    }   
                }
                
                // create the element for the list
                for(var yy=0;yy <displayname_val.length;yy++){
                    
                    if(yy < self.config['max_suggestion']){
                        $('<div>',{
                            'class':'multifill-'+self.elemid+'-suggestion-item',
                            'id':'multifill-'+self.elemid+'-suggestion-item_'+inc_x,
                            'data-mf-position':displayname_val[yy]['position'],
                            'text':displayname_val[yy]['displayname'],
                            'style':'padding:5px 10px 5px 10px;',

                        }).appendTo($('#'+self.listdiv)[0]);
                        inc_x++;
                    }
                    
                }
                
                if(inc_x > 0){
                    
                    $('#'+self.listdiv).show();
                    //adjust the dropdown div so that will not allow the scrollbar break the content
                    $('#'+self.listdiv).css({   
                            'width':"", 
                        }).css({   
                            'width':(parseInt($('#'+self.listdiv).width())+30)+'px', 
                        });
                    
                }
            }

            var total_item_div_scroll = Math.floor(parseFloat($('#'+self.listdiv).height()) / parseFloat($('.'+self.listitem).height()+10)); 
            var fixed_item_div_scroll = Math.floor(parseFloat($('#'+self.listdiv).height()) / parseFloat($('.'+self.listitem).height()+10));

            // transition of items when pressing up arrow key
            if(e.keyCode == 38){
                //scroll up to the next item
                if(current_selected >= total_item_div_scroll){
                    $('#'+self.listdiv).scrollTop($('#'+self.listdiv).scrollTop()-30);
                }
                if(current_selected !== 0){
                    if((current_state == 1) && (current_state!==3))current_selected--;
                    if($('#'+'multifill-'+self.elemid+'-suggestion-item_'+current_selected)[0] !== undefined){
                        
                        current_state=0;
                        current_selected--;

                        $('.'+self.listitem).removeClass("multifill_selected_item");
                        $('#'+'multifill-'+self.elemid+'-suggestion-item_'+current_selected).addClass("multifill_selected_item");

                        fillInput('multifill-'+self.elemid+'-suggestion-item_'+current_selected);
                       
                    }
                    
                    
                }
            }
            // transition of items when pressing down arrow key

            if(e.keyCode == 40){
                
                if((current_state == 0) || (current_state==3))current_selected++;
                var current_item = 'multifill-'+self.elemid+'-suggestion-item_'+current_selected;
                if($('#'+current_item)[0] !== undefined){
                    //scroll down to the next item
                    if(current_selected >= total_item_div_scroll){
                        $('#'+self.listdiv).scrollTop($('#'+self.listdiv).scrollTop()+30);
                    }
                    $('.'+self.listitem).removeClass("multifill_selected_item");
                    $('#'+current_item).addClass("multifill_selected_item");

                    fillInput(current_item);
                    current_selected++;
                    current_state = 1;  
                }
            }

            //remove dropdown list when the enter key pressed
            if(e.keyCode == 13){
                $('#'+self.listdiv).html("");
                $('#'+self.listdiv).hide();
            }

            
        });
        //remove dropdown list when user click outside the dropdown element
        $('body').click(function(){
            $('#'+self.listdiv).html("");
                $('#'+self.listdiv).hide();
        })

    };
    



    $.fn.Multifill = function(config) {
            

        new Multifill(this.first(),config);
        return this.first();
    };


}(jQuery));