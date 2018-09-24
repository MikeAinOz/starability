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
                const new_p: HTMLFormElement = document.createElement("form");
                new_p.appendChild(document.createTextNode("Update count:"));
                const new_em: HTMLElement = document.createElement("em");
                this.textNode = document.createTextNode(this.updateCount.toString());
                new_em.appendChild(this.textNode);
                new_p.appendChild(new_em);
                new_p.appendChild(starability());
                var new_b = document.createElement("input");
                new_b.setAttribute('type', "submit");
                new_b.setAttribute('value', "Test");
                new_b.setAttribute('id',"bUpdate");
                /*
                new_b.onclick = function () {
                       var val = getRadioVal( ni, 'rating' );
                       alert(val);
                       
                }*/
                new_p.appendChild(new_b);
                this.target.appendChild(new_p);
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
                var legendtext = document.createTextNode("Basic Star Rating");
                legend.appendChild(legendtext);
                fieldset.appendChild(legend);
                for (var i in titles) {
                    var j = parseInt(i) + 1;
                    var rb = document.createElement("input");
                    rb.setAttribute('type',"radio");
                    rb.setAttribute('id', "rate" + j);
                    rb.setAttribute('name',"rating");
                    rb.setAttribute('value',j.toString());
                // var txt = document.createTextNode(titles[i]);
                    fieldset.appendChild(rb);
                    var lb = document.createElement("label");
                    lb.setAttribute('for',"rate" + j);
                    lb.setAttribute('title',titles[i]);
                    lb.setAttribute('value',"Star " + j);
                    fieldset.appendChild(lb);
                }
                return fieldset;
            }
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            console.log('Visual update', options);
            if (typeof this.textNode !== "undefined") {
                this.textNode.textContent = (this.updateCount++).toString();
            }
            this.targetUrl = DataViewObjects.getValue(options.dataViews[0].metadata.objects, { objectName: "url", propertyName: "targetUrl" }, this.targetUrl);           
           // console.log(this.targetUrl);  
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