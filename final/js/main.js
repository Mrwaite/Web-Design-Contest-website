jQuery(document).ready(function($){
    var srcollNumber = 0;
	//check if background-images have been loaded and show list items
	$('.cd-single-project').bgLoaded({
	  	afterLoaded : function(){
	   		showCaption($('.projects-container li').eq(0));
	  	}
	});

	//open project
	$('.cd-single-project').on('click', function(){
		var selectedProject = $(this),
			toggle = !selectedProject.hasClass('is-full-width');//全宽为0，不是为1
		if(toggle) toggleProject($(this), $('.projects-container'), toggle);
	});

	//close project
	$('.projects-container .cd-scroll').on('click', function(){
		toggleProject($('.is-full-width'), $('.projects-container'), false);
	});



	//scroll to project info
	/*$('.cd-single-project .cd-scroll').on('click', function(){
		$('body').animate({'scrollTop':$(window).height()}, 500); 
	});*/

/*	$('.projects-container').on('scroll', function(){
		var iscrollTop = document.body.scrollTop;
		console.log(iscrollTop);
		// $('body').animate({'scrollTop':$(window).height()}, 500); 
	});*/

	


	//update title and .cd-scroll opacity while scrolling
	/*$('.projects-container').on('scroll', function(){
		window.requestAnimaclose-carbon-advtionFrame(changeOpacity);
	});*/


/*function () {
		var iscrollTop = document.body.scrollTop;
		var OneBlockHeight = parseInt(window.getComputedStyle(document.querySelector('.is-full-width'), '::after').getPropertyValue('height').replace(/px/g, ""));
		console.log(iscrollTop,OneBlockHeight);
	}*/


	function toggleProject(project, container, bool) {
		if(bool) {
			//expand project
			container.addClass('project-is-open');
			project.addClass('is-full-width').siblings('li').removeClass('is-loaded');
		} else {
			//check media query
			var mq = window.getComputedStyle(document.querySelector('.projects-container'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, ""),
				delay = ( mq == 'mobile' ) ? 100 : 0;

			container.removeClass('project-is-open');
			//fade out project
			project.animate({opacity: 0}, 800, function(){
				project.removeClass('is-loaded');
				$('.projects-container').find('.cd-scroll').attr('style', '');
				setTimeout(function(){
					project.attr('style', '').removeClass('is-full-width').find('.cd-title').attr('style', '');
				}, delay);
				setTimeout(function(){
					showCaption($('.projects-container li').eq(0));
				}, 300);
			});		
		}
	}

	function changeOpacity(){
		var newOpacity = 1- ($('.projects-container').scrollTop())/300;
		$('.projects-container .cd-scroll').css('opacity', newOpacity);
		$('.is-full-width .cd-title').css('opacity', newOpacity);
		//Bug fixed - Chrome background-attachment:fixed rendering issue
		$('.is-full-width').hide().show(0);
	}

	function showCaption(project) {
		if(project.length > 0 ) {
			setTimeout(function(){
				project.addClass('is-loaded');
				showCaption(project.next());
			}, 150);
		}
	}

	function handle(delta) {
	    var iscrollTop = document.body.scrollTop;
		var OneBlockHeight = document.querySelector('.is-full-width') ? parseInt(window.getComputedStyle(document.querySelector('.is-full-width'), '::after').getPropertyValue('height').replace(/px/g, "")) : 0;
		var jumpHeightUp;
		var jumpHeightDown;
		
		if(delta < 0){
		   jumpHeightDown = (Math.ceil(iscrollTop / OneBlockHeight) + 1) * OneBlockHeight;
		   $('body').animate({'scrollTop': jumpHeightDown }, 500,function(){
		   		window.addEventListener('DOMMouseScroll', wheel, false);
				window.onmousewheel = document.onmousewheel = wheel;
		   });
		} 
		else{
		   jumpHeightUp = (Math.ceil(iscrollTop / OneBlockHeight) - 1) * OneBlockHeight;
		   $('body').animate({'scrollTop': jumpHeightUp }, 500,function(){
		   		window.addEventListener('DOMMouseScroll', wheel, false);
				window.onmousewheel = document.onmousewheel = wheel;
		   }); 
		}
    }
 
	function wheel(event){
		    var delta = 0;
		    srcollNumber = (srcollNumber + 1) % 4;
		    if (!event) event = window.event;

		    if (event.wheelDelta) {
		        delta = event.wheelDelta/120; 
		        if (window.opera) delta = -delta;
		    } else if (event.detail) {
		        delta = -event.detail/3;
		    }
		    if (delta && srcollNumber == 0)
		    	window.removeEventListener('DOMMouseScroll', wheel, false);
				window.onmousewheel = document.onmousewheel = null;
		        handle(delta);
		}
	 
	if (window.addEventListener)
	window.addEventListener('DOMMouseScroll', wheel, false);
	window.onmousewheel = document.onmousewheel = wheel;


	
	$(".projects-cover img").on("click",function(){
		$(".projects-cover").addClass("magictime vanishOut");
		setTimeout(function(){
			$(".projects-cover").hide();
		},1000)
	});

});

 /*
 * BG Loaded
 * Copyright (c) 2014 Jonathan Catmull
 * Licensed under the MIT license.
 */
 (function($){
 	$.fn.bgLoaded = function(custom) {
	 	var self = this;

		// Default plugin settings
		var defaults = {
			afterLoaded : function(){
				this.addClass('bg-loaded');
			}
		};

		// Merge default and user settings
		var settings = $.extend({}, defaults, custom);

		// Loop through element
		self.each(function(){
			var $this = $(this),
				bgImgs = window.getComputedStyle($this.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
			$this.data('loaded-count',0);
			$.each( bgImgs, function(key, value){
				var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
				$('<img/>').attr('src', img).load(function() {
					$(this).remove(); // prevent memory leaks
					$this.data('loaded-count',$this.data('loaded-count')+1);
					if ($this.data('loaded-count') >= bgImgs.length) {
						settings.afterLoaded.call($this);
					}
				});
			});

		});
	};
})(jQuery);




/**
 * 简易的事件添加方法
 */
 
