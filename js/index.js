$(document).ready(function() {

	//E-mail Ajax Send
  $("form").submit(function() { 
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "../mail/mail.php", //Change
			data: th.serialize()
		}).done(function() {
			$('#mess_send').text('Thank you');
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});

});


var Modal = (function() {

  var trigger = $qsa('.modal__trigger'); // what you click to activate the modal
  var modals = $qsa('.modal'); // the entire modal (takes up entire window)
  var modalsbg = $qsa('.modal__bg'); // the entire modal (takes up entire window)
  var content = $qsa('.modal__content'); // the inner content of the modal
	var closers = $qsa('.modal__close'); // an element used to close the modal
  var w = window;
  var isOpen = false;
	var contentDelay = 400; // duration after you click the button and wait for the content to show
  var len = trigger.length;

  // make it easier for yourself by not having to type as much to select an element
  function $qsa(el) {
    return document.querySelectorAll(el);
  }

  var getId = function(event) {

    event.preventDefault();
    var self = this;
    // get the value of the data-modal attribute from the button
    var modalId = self.dataset.modal;
    var len = modalId.length;
    // remove the '#' from the string
    var modalIdTrimmed = modalId.substring(1, len);
    // select the modal we want to activate
    var modal = document.getElementById(modalIdTrimmed);
    // execute function that creates the temporary expanding div
    makeDiv(self, modal);
  };

  var makeDiv = function(self, modal) {

    var fakediv = document.getElementById('modal__temp');

    /**
     * if there isn't a 'fakediv', create one and append it to the button that was
     * clicked. after that execute the function 'moveTrig' which handles the animations.
     */

    if (fakediv === null) {
      var div = document.createElement('div');
      div.id = 'modal__temp';
      self.appendChild(div);
      moveTrig(self, modal, div);
    }
  };

  var moveTrig = function(trig, modal, div) {
    var trigProps = trig.getBoundingClientRect();
    var m = modal;
    var mProps = m.querySelector('.modal__content').getBoundingClientRect();
    var transX, transY, scaleX, scaleY;
    var xc = w.innerWidth / 2;
    var yc = w.innerHeight / 2;

    // this class increases z-index value so the button goes overtop the other buttons
    trig.classList.add('modal__trigger--active');

    // these values are used for scale the temporary div to the same size as the modal
    scaleX = mProps.width / trigProps.width;
    scaleY = mProps.height / trigProps.height;

    scaleX = scaleX.toFixed(3); // round to 3 decimal places
    scaleY = scaleY.toFixed(3);


    // these values are used to move the button to the center of the window
    transX = Math.round(xc - trigProps.left - trigProps.width / 2);
    transY = Math.round(yc - trigProps.top - trigProps.height / 2);

		// if the modal is aligned to the top then move the button to the center-y of the modal instead of the window
    if (m.classList.contains('modal--align-top')) {
      transY = Math.round(mProps.height / 2 + mProps.top - trigProps.top - trigProps.height / 2);
    }


		// translate button to center of screen
		trig.style.transform = 'translate(' + transX + 'px, ' + transY + 'px)';
		trig.style.webkitTransform = 'translate(' + transX + 'px, ' + transY + 'px)';
		// expand temporary div to the same size as the modal
		div.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
		div.style.webkitTransform = 'scale(' + scaleX + ',' + scaleY + ')';


		window.setTimeout(function() {
			window.requestAnimationFrame(function() {
				open(m, div);
			});
		}, contentDelay);

  };

  var open = function(m, div) {

    if (!isOpen) {
      // select the content inside the modal
      var content = m.querySelector('.modal__content');
      // reveal the modal
      m.classList.add('modal--active');
      // reveal the modal content
      content.classList.add('modal__content--active');

      /**
       * when the modal content is finished transitioning, fadeout the temporary
       * expanding div so when the window resizes it isn't visible ( it doesn't
       * move with the window).
       */

      content.addEventListener('transitionend', hideDiv, false);

      isOpen = true;
    }

    function hideDiv() {
      // fadeout div so that it can't be seen when the window is resized
      div.style.opacity = '0';
      content.removeEventListener('transitionend', hideDiv, false);
    }
  };

  var close = function(event) {

		event.preventDefault();
    event.stopImmediatePropagation();

    var target = event.target;
    var div = document.getElementById('modal__temp');

    /**
     * make sure the modal__bg or modal__close was clicked, we don't want to be able to click
     * inside the modal and have it close.
     */

    if (isOpen && target.classList.contains('modal__bg') || target.classList.contains('modal__close')) {

      // make the hidden div visible again and remove the transforms so it scales back to its original size
      div.style.opacity = '1';
      div.removeAttribute('style');

			/**
			* iterate through the modals and modal contents and triggers to remove their active classes.
      * remove the inline css from the trigger to move it back into its original position.
			*/

			for (var i = 0; i < len; i++) {
				modals[i].classList.remove('modal--active');
				content[i].classList.remove('modal__content--active');
				trigger[i].style.transform = 'none';
        trigger[i].style.webkitTransform = 'none';
				trigger[i].classList.remove('modal__trigger--active');
			}

      // when the temporary div is opacity:1 again, we want to remove it from the dom
			div.addEventListener('transitionend', removeDiv, false);

      isOpen = false;

    }

    function removeDiv() {
      setTimeout(function() {
        window.requestAnimationFrame(function() {
          // remove the temp div from the dom with a slight delay so the animation looks good
          div.remove();
        });
      }, contentDelay - 50);
    }

  };

  var bindActions = function() {
    for (var i = 0; i < len; i++) {
      trigger[i].addEventListener('click', getId, false);
      closers[i].addEventListener('click', close, false);
      modalsbg[i].addEventListener('click', close, false);
    }
  };

  var init = function() {
    bindActions();
  };

  return {
    init: init
  };

}());

Modal.init();


/* //////////// */
  /* SLIDER */
/* //////////// */
// function Sim(sldrId) {

// 	let id = document.getElementById(sldrId);
// 	if(id) {
// 		this.sldrRoot = id
// 	}
// 	else {
// 		this.sldrRoot = document.querySelector('.sim-slider')
// 	};

// 	// Carousel objects
// 	this.sldrList = this.sldrRoot.querySelector('.sim-slider-list');
// 	this.sldrElements = this.sldrList.querySelectorAll('.sim-slider-element');
// 	this.sldrElemFirst = this.sldrList.querySelector('.sim-slider-element');
// 	this.leftArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-left');
// 	this.rightArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-right');
// 	this.indicatorDots = this.sldrRoot.querySelector('div.sim-slider-dots');

// 	// Initialization
// 	this.options = Sim.defaults;
// 	Sim.initialize(this)
// };

// Sim.defaults = {

// 	// Default options for the carousel
// 	loop: true,     // Бесконечное зацикливание слайдера
// 	auto: true,     // Автоматическое пролистывание
// 	interval: 5000, // Интервал между пролистыванием элементов (мс)
// 	arrows: true,   // Пролистывание стрелками
// 	dots: true      // Индикаторные точки
// };

// Sim.prototype.elemPrev = function(num) {
// 	num = num || 1;

// 	let prevElement = this.currentElement;
// 	this.currentElement -= num;
// 	if(this.currentElement < 0) this.currentElement = this.elemCount-1;

// 	if(!this.options.loop) {
// 		if(this.currentElement == 0) {
// 			this.leftArrow.style.display = 'none'
// 		};
// 		this.rightArrow.style.display = 'block'
// 	};
	
// 	this.sldrElements[this.currentElement].style.opacity = '1';
// 	this.sldrElements[prevElement].style.opacity = '0';

// 	if(this.options.dots) {
// 		this.dotOn(prevElement); this.dotOff(this.currentElement)
// 	}
// };

// Sim.prototype.elemNext = function(num) {
// 	num = num || 1;
	
// 	let prevElement = this.currentElement;
// 	this.currentElement += num;
// 	if(this.currentElement >= this.elemCount) this.currentElement = 0;

// 	if(!this.options.loop) {
// 		if(this.currentElement == this.elemCount-1) {
// 			this.rightArrow.style.display = 'none'
// 		};
// 		this.leftArrow.style.display = 'block'
// 	};

// 	this.sldrElements[this.currentElement].style.opacity = '1';
// 	this.sldrElements[prevElement].style.opacity = '0';

// 	if(this.options.dots) {
// 		this.dotOn(prevElement); this.dotOff(this.currentElement)
// 	}
// };

// Sim.prototype.dotOn = function(num) {
// 	this.indicatorDotsAll[num].style.cssText = 'background-color:#BBB; cursor:pointer;'
// };

// Sim.prototype.dotOff = function(num) {
// 	this.indicatorDotsAll[num].style.cssText = 'background-color:#556; cursor:default;'
// };

// Sim.initialize = function(that) {

// 	// Constants
// 	that.elemCount = that.sldrElements.length; // Количество элементов

// 	// Variables
// 	that.currentElement = 0;
// 	let bgTime = getTime();

// 	// Functions
// 	function getTime() {
// 		return new Date().getTime();
// 	};
// 	function setAutoScroll() {
// 		that.autoScroll = setInterval(function() {
// 			let fnTime = getTime();
// 			if(fnTime - bgTime + 10 > that.options.interval) {
// 				bgTime = fnTime; that.elemNext()
// 			}
// 		}, that.options.interval)
// 	};

// 	// Start initialization
// 	if(that.elemCount <= 1) {   // Отключить навигацию
// 		that.options.auto = false; that.options.arrows = false; that.options.dots = false;
// 		that.leftArrow.style.display = 'none'; that.rightArrow.style.display = 'none'
// 	};
// 	if(that.elemCount >= 1) {   // показать первый элемент
// 		that.sldrElemFirst.style.opacity = '1';
// 	};

// 	if(!that.options.loop) {
// 		that.leftArrow.style.display = 'none';  // отключить левую стрелку
// 		that.options.auto = false; // отключить автопркрутку
// 	}
// 	else if(that.options.auto) {   // инициализация автопрокруки
// 		setAutoScroll();
// 		// Остановка прокрутки при наведении мыши на элемент
// 		that.sldrList.addEventListener('mouseenter', function() {clearInterval(that.autoScroll)}, false);
// 		that.sldrList.addEventListener('mouseleave', setAutoScroll, false)
// 	};

// 	if(that.options.arrows) {  // инициализация стрелок
// 		that.leftArrow.addEventListener('click', function() {
// 			let fnTime = getTime();
// 			if(fnTime - bgTime > 1000) {
// 				bgTime = fnTime; that.elemPrev()
// 			}
// 		}, false);
// 		that.rightArrow.addEventListener('click', function() {
// 			let fnTime = getTime();
// 			if(fnTime - bgTime > 1000) {
// 				bgTime = fnTime; that.elemNext()
// 			}
// 		}, false)
// 	}
// 	else {
// 		that.leftArrow.style.display = 'none'; that.rightArrow.style.display = 'none'
// 	};

// 	if(that.options.dots) {  // инициализация индикаторных точек
// 		let sum = '', diffNum;
// 		for(let i=0; i<that.elemCount; i++) {
// 			sum += '<span class="sim-dot"></span>'
// 		};
// 		that.indicatorDots.innerHTML = sum;
// 		that.indicatorDotsAll = that.sldrRoot.querySelectorAll('span.sim-dot');
// 		// Назначаем точкам обработчик события 'click'
// 		for(let n=0; n<that.elemCount; n++) {
// 			that.indicatorDotsAll[n].addEventListener('click', function() {
// 				diffNum = Math.abs(n - that.currentElement);
// 				if(n < that.currentElement) {
// 					bgTime = getTime(); that.elemPrev(diffNum)
// 				}
// 				else if(n > that.currentElement) {
// 					bgTime = getTime(); that.elemNext(diffNum)
// 				}
// 				// Если n == that.currentElement ничего не делаем
// 			}, false)
// 		};
// 		that.dotOff(0);  // точка[0] выключена, остальные включены
// 		for(let i=1; i<that.elemCount; i++) {
// 			that.dotOn(i)
// 		}
// 	}
// };

// new Sim();