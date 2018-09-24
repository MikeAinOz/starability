/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
import DataViewObjects = powerbi.extensibility.utils.dataview.DataViewObjects;

module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;
        private urlNode: Text;
        private targetUrl: string;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            this.updateCount = 0;
            this.targetUrl = "url not set"
            if (typeof document !== "undefined") {
                // hidden url
                const new_ph = document.createElement("p");
                new_ph.setAttribute('id',"hidden_url");
                new_ph.setAttribute('class',"hidden_url)");
                new_ph.hidden = true;
                
                this.urlNode = document.createTextNode(this.targetUrl);
                new_ph.appendChild(this.urlNode);
                this.target.appendChild(new_ph);
                //
                const new_f: HTMLFormElement = document.createElement("form");
                
                new_f.appendChild(starability());
                var new_b = document.createElement("input");
                new_b.setAttribute('type', "submit");
                new_b.setAttribute('value', "Rate");
                new_b.setAttribute('id',"bUpdate");
                
                new_b.onclick = function () {
                       var val = getRadioVal( new_f, 'rating' );
                       btnClick(options.element, val, new_ph.innerHTML);                       
                }
                new_f.appendChild(new_b);
                this.target.appendChild(new_f);
                const new_p5 = document.createElement("p");
                new_p5.setAttribute('id',"final_msg");
                new_p5.hidden = true;
                var new_message = document.createTextNode("Rating Received");
                new_p5.appendChild(new_message);
                this.target.appendChild(new_p5);
            }
            function starability(){
                var titles=[ "Unacceptable",
                        "Deficient",
                        "Mediocre",
                        "Copacetic",
                        "Outstanding"];
                var fieldset = document.createElement("fieldset");
                fieldset.setAttribute("class","starability-basic");
                var legend = document.createElement("legend");
                var legendtext = document.createTextNode("Rate Your Selection");
                legend.appendChild(legendtext);
                fieldset.appendChild(legend);
                var rb = document.createElement("input");
                rb.setAttribute('type',"radio");
                rb.setAttribute('id', "no-rate");
                rb.setAttribute('class',"input-no-rate" );
                rb.setAttribute('name',"rating");
                rb.setAttribute('value',"0");
                rb.checked = true;
                rb.setAttribute ('aria-label',"No rating.");
                fieldset.appendChild(rb);
                for (var i in titles) {
                    var j = parseInt(i) + 1;
                    var rb = document.createElement("input");
                    rb.setAttribute('type',"radio");
                    rb.setAttribute('id', "rate" + j);
                    rb.setAttribute('name',"rating");
                    rb.setAttribute('value',j.toString());
                    fieldset.appendChild(rb);
                    var lb = document.createElement("label");
                    lb.setAttribute('for',"rate" + j);
                    lb.setAttribute('title',titles[i]);
                    lb.setAttribute('value',"Star " + j);
                    fieldset.appendChild(lb);
                }
                return fieldset;
            }
            function getRadioVal(form, name) {
                var val;
                // get list of radio buttons with specified name
                var radios = form.elements[name];                
                // loop through list of radio buttons
                for (var i=0, len=radios.length; i<len; i++) {
                    if ( radios[i].checked ) { // radio checked?
                        val = radios[i].value; // if so, hold its value in val
                        break; // and break out of for loop
                    }
                }
                return val; // return value of checked radio or undefined if none checked
            } 
            function btnClick(target :HTMLElement, idValue , hiddenText){
                console.log("button click ")
                var new_p3 = document.createElement("p");
                var message = "";              
                var sendData = JSON.stringify({ "id" : idValue});
                
                var elem = document.createElement('textarea');
                elem.innerHTML = hiddenText;
                var postUrl = elem.value;
                
                $.ajax({
                    url: postUrl,
                    type:"POST",
                    data: sendData,
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    success: function(data){                                    
                        $('#final_msg').fadeIn(); ;                      
                        setTimeout(function() {
                            $('#final_msg').fadeOut();
                           }, 10000 )
                        },                
                    error: function( jqXhr, textStatus, errorThrown ){
                        console.log( errorThrown );
                    },                    
                    statusCode: {
                            202: function() {
                              message = "success 202" ;                         
                                new_p3.appendChild(document.createTextNode(message));
                                target.appendChild(new_p3);
                              }
                            }                    
                 }); 
                               
            }
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            console.log('Visual update', options);
            if (typeof this.textNode !== "undefined") {
                this.textNode.textContent = (this.updateCount++).toString();
            }
            this.targetUrl = DataViewObjects.getValue(options.dataViews[0].metadata.objects, { objectName: "url", propertyName: "targetUrl" }, this.targetUrl);        
            if (typeof this.urlNode !== "undefined") {
                this.urlNode.textContent = this.targetUrl
           }
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}