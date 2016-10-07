var transition = '-webkit-transition' in document.documentElement.style ? '-webkit-transition' : 'transition';

var mouse = {
	moved: false,
	start: function(e) {
		e.preventDefault();
		if (moving) return;
		x = e.clientX;
		y = e.clientY;
		this.addEventListener("mousemove", mouse.move, true);
		this.addEventListener("mouseup", mouse.end, true);
		odd.style.removeProperty(transition);
		even.style.removeProperty(transition);
		var page = parseInt(this.getAttribute('page'));
		e = page % 2 ? even : odd;
		e.style.setProperty('left', -15 -w + 'px', '');
	},
	move: function(e) {
		e.preventDefault();
		if (!mouse.moved && Math.abs(e.clientX - x) <= 5 && Math.abs(e.clientY - y) <= 5) return;
		mouse.moved = true;
		var page = parseInt(this.getAttribute('page'));
		if (e.clientX > x) {
			if (page <= 1) return;
			show(page - 1);
			page % 2 ? even.style.setProperty('left', e.clientX - x - w + 'px', '') : odd.style.setProperty('left', e.clientX - x - w + 'px', '');
			if (page < pagenum) this.style.removeProperty('left');
		} else {
			if (page >= pagenum) return;
			show(page + 1);
			this.style.setProperty('left', e.clientX - x + 'px', '');
		}
	},
	end: function(e) {
		e.preventDefault();
		this.removeEventListener("mousemove", mouse.move, true);
		this.removeEventListener("mouseup", mouse.end, true);
		if (!mouse.moved) {
			if (0.4 > x / w) return turn.prev(this);
			if (0.6 < x / w) return turn.next(this);
			return 0.3 > y / h ? turn.prev(this) : 0.7 < y / h ? turn.next(this) : alert('显示菜单');
		}
		mouse.moved = false;
		x < e.clientX ? turn.prev(this) : turn.next(this);
	}
};

var touch = {
	moved: false,
	start: function(e) {
		e.preventDefault();
		if (moving) return;
		x= e.touches[0].clientX;
		y = e.touches[0].clientY;
		this.addEventListener("touchmove", touch.move, true);
		this.addEventListener("touchend", touch.end, true);
		odd.style.removeProperty(transition);
		even.style.removeProperty(transition);
		var page = parseInt(this.getAttribute('page'));
		e = page % 2 ? even : odd;
		e.style.setProperty('left', -15 -w + 'px', '');
	},
	move: function(e) {
		e.preventDefault();
		if (!touch.moved && Math.abs(e.touches[0].clientX - x) <= 5 && Math.abs(e.touches[0].clientY - y) <= 5) return;
		touch.moved = true;
		var page = parseInt(this.getAttribute('page'));
		if (e.touches[0].clientX > x) {
			if (page <= 1) return;
			show(page - 1);
			page % 2 ? even.style.setProperty('left', e.touches[0].clientX - x - w + 'px', '') : odd.style.setProperty('left', e.touches[0].clientX - x - w + 'px', '');
			if (page < pagenum) this.style.removeProperty('left');
		} else {
			if (page >= pagenum) return;
			show(page + 1);
			this.style.setProperty('left', e.touches[0].clientX - x + 'px', '');
		}
	},
	end: function(e) {
		e.preventDefault();
		this.removeEventListener("touchmove", touch.move, true);
		this.removeEventListener("touchend", touch.end, true);
		if (!touch.moved) return 0.4 > x / w ? turn.prev(this) : 0.6 < x / w ? turn.next(this) : alert('显示菜单');
		touch.moved = false;
		x < e.changedTouches[0].clientX ? turn.prev(this) : turn.next(this);
	}
};

var turn = {
	prev: function(e) {
		var page = parseInt(e.getAttribute('page'));
		if (page <= 1) return alert('到开头了！');
		show(page - 1);
		e = page % 2 ? even : odd;
		e.style.setProperty(transition, 'left 0.2s', '');
		e.style.setProperty('left', '0px', '');
		moving = true;
		setTimeout(function() {moving = false}, 100);
	},
	next: function(e) {
		var page = parseInt(e.getAttribute('page'));
		if (page >= pagenum) return alert('到结尾了！');
		show(page + 1);
		e.style.setProperty(transition, 'left 0.3s', '');
		e.style.setProperty('left', -15 - w + 'px', '');
		moving = true;
		setTimeout(function() {moving = false}, 100);
	}
}

function cengdie() {
	var articleHiehgt = h - 65;
	var lineHeight = 28;
	var lineSpace = 10;
	var articleLines = Math.floor(articleHiehgt / lineHeight);
	var para = odd.getElementsByTagName('p');
	var n = 0;
	for (var i = 0; i < para.length; i++) {
		if (para[i].nodeType != 1) continue;
		if (n > 0 && readList[n][0] == 0) readList[n][0] = para[i].offsetTop;
		if (readList[n][1] + para[i].offsetHeight + lineSpace + lineHeight <= articleHiehgt) {
			readList[n][1] += para[i].offsetHeight + lineSpace;
		} else if (readList[n][1] + para[i].offsetHeight <= articleHiehgt) {
			readList[n][1] += para[i].offsetHeight;
			readList[++n] = [0, 0];
		} else {
			var a = Math.floor((articleHiehgt - readList[n][1]) / lineHeight);
			var b = para[i].offsetHeight / lineHeight - a;
			readList[n][1] += a * lineHeight;
			for (var j = 0; j < b / articleLines; j++) {
				readList[++n] = [];
				readList[n][0] = para[i].offsetTop + a * lineHeight + j * lineHeight * articleLines;
				readList[n][1] = Math.min(para[i].offsetHeight - (a + j * articleLines) * lineHeight + lineSpace, lineHeight * articleLines);
			}
		}
	}
	if (n > 0 && readList[n][0] == 0) readList.pop();
	pagenum = readList.length;
}

function show(page) {
	var isTouch = 'ontouchstart' in window;
	var e = page % 2 ? odd : even;
	if (e.getAttribute('page') != page) {
		e.setAttribute('page', page);
		e.getElementsByTagName('div')[0].style.marginTop = 40 - readList[page - 1][0] + 'px';
		e.getElementsByTagName('div')[0].style.height = readList[page - 1][0] + readList[page - 1][1] + 'px';
		e.getElementsByTagName('footer')[0].innerHTML = page + ' / ' + pagenum;
	}
	e.style.zIndex = 1000 - page;
	e.style.removeProperty(transition);
	e.style.removeProperty('left');
	isTouch ? e.addEventListener("touchstart", touch.start, true) : e.addEventListener("mousedown", mouse.start, true);
}
