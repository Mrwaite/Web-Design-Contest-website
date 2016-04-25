/* 
-- jquery.zbCanvas
-- version 1.0 alpha
-- copyright Zhivko Bozhilov 2015
-- licensed under the GPL3
--
-- http://stachethemes.com
-- http://codecanyon.net/user/stachethemes
--
*/

(function($){
                
    "use strict";

    $.fn.extend({
        
        zbCanvas: function(userCanvasSettings) {

            var canvasElement = this;

            // Default Canvas Settings
            var _canvasSettings = {
                id    : "zbCanvas-id-" + new Date().getTime(),
                class : ""
            };

            var canvas = $(canvasElement).get(0);

            if ($(canvasElement).length <= 0) {
                console.warn("zbCanvas: No element selected");
            } else if (canvas instanceof HTMLCanvasElement === false) {
                console.warn("zbCanvas: Element is not a canvas");
            } else {
                $.extend(_canvasSettings, userCanvasSettings);

                $(canvas).attr("id",_canvasSettings.id)
                         .addClass(_canvasSettings.class);

                var ctx = canvas.getContext("2d");
            }

            this.circle = {

                // Default Circle Settings
                _circleSettings: {
                    diameter        : 200,
                    lineWidth     : 10,
                    bgWidth       : 10,
                    bgColor       : "none",
                    bgShadowBlur    : 0,
                    bgShadowOffsetX : 0,
                    bgShadowOffsetY : 0,
                    bgShadowColor   : "#000000",
                    bgColorGradient : false,
                    bgColorGradientPos : [0,0,0,0],
                    color         : "#000000",
                    colorGradient : false,
                    colorGradientPos : [0,0,0,0],
                    shadowBlur    : 0,
                    shadowOffsetX : 0,
                    shadowOffsetY : 0,
                    shadowColor   : "#000000",
                    degreeStart   : 0,
                    degreeEnd     : 360,
                    reverse       : false,
                    start         : function(){},
                    step          : function(){},
                    complete      : function(){}
                },

                _deg: function (deg) {
                    return this._circleSettings.reverse === true ? -1 * (Math.PI / 180) * deg - (Math.PI / 2) : (Math.PI / 180) * deg - (Math.PI / 2);
                },
                
                draw: function(userCircleSettings) {
                        
                    var parent = this;

                    $.extend(parent._circleSettings, userCircleSettings);

                    ctx.canvas.height = ctx.canvas.width = parent._circleSettings.diameter;

                    var drawStep = function(from, to) {
                        
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                        
                        if (parent._circleSettings.bgColor != "none") {
                            ctx.beginPath();
                            
                            ctx.strokeStyle   = parent._circleSettings.bgColor;
                            ctx.lineWidth     = parent._circleSettings.bgWidth;
                            ctx.shadowBlur    = parent._circleSettings.bgShadowBlur;
                            ctx.shadowOffsetX = parent._circleSettings.bgShadowOffsetX;
                            ctx.shadowOffsetY = parent._circleSettings.bgShadowOffsetY;
                            ctx.shadowColor   = parent._circleSettings.bgShadowColor;
                            
                            if (parent._circleSettings.bgColorGradient) {

                                var gx  = parent._circleSettings.bgColorGradientPos[0];
                                var gy  = parent._circleSettings.bgColorGradientPos[1];
                                var gx1 = parent._circleSettings.bgColorGradientPos[2];
                                var gy1 = parent._circleSettings.bgColorGradientPos[3];

                                var bgColorGradient = ctx.createLinearGradient(gx, gy, gx1, gy1);

                                $(parent._circleSettings.bgColorGradient).each(function (i) {
                                    bgColorGradient.addColorStop(i, this);
                                });

                                ctx.strokeStyle = bgColorGradient;
                            }
                            
                            ctx.arc(
                                parent._circleSettings.diameter / 2, 
                                parent._circleSettings.diameter / 2, 
                                parent._circleSettings.diameter / 2 - parent._circleSettings.bgWidth / 2 - parent._circleSettings.bgShadowBlur,
                                parent._deg(0), 
                                parent._deg(360)
                            );
                            ctx.stroke();
                            ctx.closePath();
                        }
                        
                        ctx.strokeStyle   = parent._circleSettings.color;
                        ctx.shadowBlur    = parent._circleSettings.shadowBlur;
                        ctx.shadowOffsetX = parent._circleSettings.shadowOffsetX;
                        ctx.shadowOffsetY = parent._circleSettings.shadowOffsetY;
                        ctx.shadowColor   = parent._circleSettings.shadowColor;
                        
                        if (parent._circleSettings.colorGradient) {
                            
                            var gx  = parent._circleSettings.colorGradientPos[0];
                            var gy  = parent._circleSettings.colorGradientPos[1];
                            var gx1 = parent._circleSettings.colorGradientPos[2];
                            var gy1 = parent._circleSettings.colorGradientPos[3];
                            
                            var colorGradient = ctx.createLinearGradient(gx,gy,gx1,gy1);
                            
                            $(parent._circleSettings.colorGradient).each(function(i){
                                colorGradient.addColorStop(i, this);
                            });
                            
                            ctx.strokeStyle = colorGradient;
                        }
                        
                        ctx.beginPath();
                        
                        ctx.arc(
                            parent._circleSettings.diameter / 2, 
                            parent._circleSettings.diameter / 2, 
                            parent._circleSettings.diameter / 2 - parent._circleSettings.lineWidth / 2 - parent._circleSettings.shadowBlur,
                            parent._deg(from), 
                            parent._deg(to)
                        );
                
                        ctx.lineWidth = parent._circleSettings.lineWidth;
                
                        if (typeof parent._circleSettings.step === "function") {
                            var step = to;
                            parent._circleSettings.step(canvas, step, parent._circleSettings.degreeStart, parent._circleSettings.degreeEnd);
                        }

                        ctx.stroke(); 
                        
                        ctx.closePath();
                    };

                    var from      = parent._circleSettings.degreeStart;
                    var to        = parent._circleSettings.degreeEnd;

                    drawStep(from, to);
                }
            };

            this.destroy = function(){

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.canvas.width = ctx.canvas.height = 0;

                $(canvas).removeAttr("id")
                         .removeClass(_canvasSettings.class);
                
            };

            return this;
        }
    });
    
}(jQuery));