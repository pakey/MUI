;(function ($) {
	$.extend($.fn, {
		scrollTo: function (m, t) {
			t = t == undefined ? 200 : t;
			var n = t / 10, s = m / n, that = this, timer = null, p = f = that.scrollTop();
			var smoothScroll = function () {
				if (m < 0 && (p - f < m || p <= 0)) {
					window.clearInterval(timer);
					return false;
				} else if (m > 0 && p - f > m) {
					window.clearInterval(timer);
					return false;
				} else if (m == 0) {
					window.clearInterval(timer);
					return false;
				}
				that.scrollTop(p);
				p = parseInt(p + s);
			};
			timer = window.setInterval(function () {
				smoothScroll();
			}, 10);
		}
	})
})($);
var $pt = {};
(function (window) {
	$pt.config = {
		base: {
			width: (window.innerWidth > 0) ? window.innerWidth : screen.width,
			height: (window.innerHeight > 0) ? window.innerHeight : screen.height,
			page:1,
			totalpage:1,
		},
		chapter: {
			title: '',
			content: '',
			next: '',
			prev: '',
		},
		reader: {
			status: 0,
			fontsize: 16,
			theme: '',
			moon: 0,
			style: 0,
			cache: 0,
		}
	};
	$pt.chapter = {
		//初始化
		init: function (chapter, reader) {
			$pt.chapter.initreader(reader);
			$pt.chapter.initchapter(chapter);
			$pt.chapter.menu.init();
		},
		//初始化阅读器
		initreader: function (config) {
			if (config) {
				$pt.config.reader = $.extend($pt.config.reader, config);
			}
			$pt.config.base.rh = parseInt($pt.config.reader.fontsize * 1.8 * 1.5);
			//初始化阅读器
			if($pt.config.reader.style==0){
				//竖屏
				$('.pt-reader').removeClass('about');
				$('.pt-reader .content').css({
					'width':$pt.config.base.width,
					'height':'auto',
					'-webkit-column-width':'inherit'
				})
			}else{
				//横屏
				$('.pt-reader').addClass('about');
				$('.pt-reader .body').css('height',null);
				$('.pt-reader .content').css({
					'width':$pt.config.base.width,
					'height':$pt.config.base.height,
					'-webkit-column-width':$pt.config.base.width,
				});
				$('.pt-reader .body .aboutheader').width($pt.config.base.width)
			}
		},
		//初始化章节信息
		initchapter: function (config) {
			if (config) {
				$pt.config.chapter = $.extend($pt.config.chapter, config);
			}
			$('.pt-reader').show();
			$('.loading').hide();
			//初始化章节之后如果横屏计算页码
			if($pt.config.reader.style==0){
				//竖屏
				$('.pt-reader .body').height(Math.ceil($('.pt-reader .body').height() / ( $pt.config.base.height - $pt.config.base.rh)) * ( $pt.config.base.height - $pt.config.base.rh));
			}else{
				//横屏
				$pt.config.base.page=1;
				$pt.config.base.totalpage=($('.pt-reader .content p').last().offset().left-15)/($pt.config.base.width-15);
				$('.page').html($pt.config.base.page+'/'+$pt.config.base.totalpage);
			}

		},
		//菜单
		menu: {
			init: function () {
				var width = $pt.config.base.width, height = $pt.config.base.height;
				$(document).on('click', function (event) {
					if ($pt.config.reader.status == 0) {
						var x = event.clientX, y = event.clientY;
						if (x / width < 0.4) {
							$pt.chapter.menu.prev();
						} else if (x / width > 0.6) {
							$pt.chapter.menu.next();
						} else {
							if (y / height < 0.3) {
								$pt.chapter.menu.prev();
							} else if (y / height > 0.7) {
								$pt.chapter.menu.next();
							} else {
								$pt.chapter.menu.show();
							}
						}
					}
				})
			},
			show: function () {
				$pt.config.reader.status = 1
			},
			hide: function () {
				$pt.config.reader.status = 0;
			},
			//向下
			next: function () {
				if($pt.config.reader.style==0){

					if ($('.pt-reader').scrollTop() + $pt.config.base.height == $('.pt-reader .body').height()) {
						//到达了底部则下一章
						$pt.chapter.chapter.next();
					} else {
						//没有到达了底部则下一页
						$pt.chapter.page.next();
					}
				}else{
					$pt.chapter.page.next();
				}
			},
			//向上
			prev: function () {
				if ($('.pt-reader').scrollTop() == 0) {
					//顶部则上一章
					$pt.chapter.chapter.prev();
				} else {
					//没有到顶部就到上一页
					$pt.chapter.page.prev();
				}
			},
		},
		//页面滚动操作
		page: {
			next: function () {
				if($pt.config.reader.style==0){
					$('.pt-reader').scrollTo($pt.config.base.height - $pt.config.base.rh, 300);
				}else{
					$pt.config.base.page++;
					$('.page').html($pt.config.base.page+'/'+$pt.config.base.totalpage);
					$('.pt-reader .content').css('-webkit-transform','translate3d(-' + $pt.config.base.page*($pt.config.base.width-15) + 'px, 0px, 0px)')
				}
			},
			prev: function () {
				if($pt.config.reader.style==0){
					$('.pt-reader').scrollTo(40 - parseInt($pt.config.base.height), 300);
				}else{

				}
			}
		},
		//上一章 下一章
		chapter: {
			next: function () {
				console.log('下一章');
			},
			prev: function () {
				console.log('上一章');
			}
		}
	}
})($);