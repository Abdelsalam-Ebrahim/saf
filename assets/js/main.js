
(function ($) {
    "use strict";
    var windowOn = $(window);
   /*======================================
   Data Css js
   ========================================*/
    $("[data-background]").each(function() {
        $(this).css(
            "background-image",
            "url( " + $(this).attr("data-background") + "  )"
        );
    });

    $("[data-width]").each(function() {
        $(this).css("width", $(this).attr("data-width"));
    });

    // prelaoder
    let span = $('.letter'),
        tlSmell = new TimelineMax({repeat : -1});
    tlSmell
        .staggerFromTo($('svg .smell'), 3, {y: 50, autoAlpha: 0.5}, {y: -20, autoAlpha: 1}, 1);
    TweenMax.fromTo($('svg #body'), 3, {x: -1, repeat : -1, yoyo : true}, {x: 1, repeat : -1, yoyo : true});

    /*width100ScrollTriggerAnimation*/
    function updateSeparatorWidth(selector, direction = 'right') {
        if(direction === 'left') {
            $(selector).each(function(index, item) {
                const width = parseInt($(item).data('width')) || 0;
                $(item).parent().css('margin-left', (width + 10) + 'px');
            });
        } else {
            $(selector).each(function(index, item) {
                const width = parseInt($(item).data('width')) || 0;
                $(item).parent().css('margin-left', (width + 10) + 'px');
            });
        }
    }
    updateSeparatorWidth('.right-separetor', 'right');
    updateSeparatorWidth('.left-separetor', 'left');

    class GSAPAnimation {
        static Init() {
            /*title-animation*/
            this.upDownScrollTriggerAnimation('.b-t__scroll');
            $('.right-separetor').length && this.width100ScrollTriggerAnimation('.right-separetor');
            $('.left-separetor').length && this.width100ScrollTriggerAnimation('.left-separetor');
            $('.title-animation').length && this.sectionTitleAnimation('.title-animation');
        }
        
        static sectionTitleAnimation(activeClass) {
            let sectionTitleLines = gsap.utils.toArray(activeClass);

            sectionTitleLines.forEach(sectionTextLine => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionTextLine,
                        start: 'top 90%',
                        end: 'bottom 60%',
                        scrub: false,
                        markers: false,
                        toggleActions: 'play none none none'
                    }
                });

                const itemSplitted = new SplitText(sectionTextLine, { type: "chars, words" });
                gsap.set(sectionTextLine, { perspective: 100 });
                itemSplitted.split({ type: "words" })
                tl.from(itemSplitted.words, {
                    opacity: 0, 
                    autoAlpha: 0, 
                    transformOrigin: "top center -50",
                    y: "10px",
                    duration: 0.9,
                    stagger: 0.1,
                    ease: "power2.out",
                });
            });
        }

        static width100ScrollTriggerAnimation(activeClass) {
            let Lines = gsap.utils.toArray(activeClass);
            Lines.forEach(Line => {
                const maxWidth = Line.getAttribute('data-width') || '100%';
                gsap.fromTo(Line, {
                    width: "0"
                }, {
                    opacity: 1,
                    width: maxWidth,
                    duration: 0.9,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: Line,
                        start: 'top 100%',
                        end: 'top 10%',
                        scrub: true,
                        markers: false,
                        toggleActions: 'play none none none'
                    }
                });
            });
        }

        static upDownScrollTriggerAnimation(titleClass) {
            let Title = gsap.utils.toArray(titleClass);

            Title.forEach(TitleSingle => {
                const TitleSingleTarget = TitleSingle.getAttribute('data-target');
                const TitleSingleTargetHeight = TitleSingle.getAttribute('data-target-height');

                gsap.to(TitleSingle, {
                    scrollTrigger: {
                        trigger: TitleSingle,
                        start: "top 20%",
                        end: () => {
                            let totalHeight = 0;
                            if(TitleSingleTarget) {
                                totalHeight += $(TitleSingleTarget).innerHeight();
                                totalHeight -=$(TitleSingle).innerHeight();
                            }
                            if(TitleSingleTargetHeight) {
                                totalHeight += parseInt(TitleSingleTargetHeight);
                            }
                            return `+=${totalHeight}`;
                        },
                        pin: true,
                        pinSpacing: false,
                        scrub: true,
                        markers: false,
                    }
                });
            });
        }
    }

    class RRDEVS {
        constructor() {
            this.isLoaded = false;
        }
        static LoadedAfterDoted() {
            if (this.isLoaded) {
                return false;
            }
            this.isLoaded = true;
            $('#preloader').delay(1).fadeOut(0);

            $('.odometer').waypoint(function(direction) {
                if (direction === 'down') {
                    let countNumber = $(this.element).attr("data-count");
                    $(this.element).html(countNumber);
                }
            }, {
                offset: '80%'
            });

            /*Wow Js*/
            if ($('.wow').length) {
                var wow = new WOW({
                    boxClass: 'wow',
                    animateClass: 'animated',
                    offset: 0,
                    mobile: false,
                    // live: true,
                    live: false,
                });
                wow.init();
            }

            /*GSAPAnimation*/
            GSAPAnimation.Init();
        }

        async LoadedAfterProgress(type) {
            if (this.isLoaded) {
                return false;
            }
            this.isLoaded = true;
            if('click' === type) {
                let tl = gsap.timeline();
                tl
                    .to(".preloader-close", {
                        duration: 0.1,
                        scale: 0,
                        onComplete: () => {
                            document.querySelector(".preloader-close").style.display = "none";
                        }
                    })
                    .to(".preloader", {
                        duration: 0.2,
                        height: 0,
                        onComplete: () => {
                            document.querySelector(".preloader").style.display = "none";
                        }
                    });

                await this.delay(0);
            }
            else {
                let randomStop = Math.random() * (0.8 - 0.3) + 0.3;
                let tl = gsap.timeline();
                const preloaderTextElement = document.querySelector(".preloader-text");
                const newText = preloaderTextElement.dataset.text;
                tl
                    .to(".preloader-text", {
                        duration: 1,
                        text: newText
                    })
                    .to(".progress-bar", {
                        duration: 0.3,
                        opacity: 1
                    })
                    .to(".progress", {
                        duration: .1,
                        width: `${randomStop * 100}%`
                    })
                    .to(".progress", {
                        duration: 1 - randomStop,
                        width: "100%"
                    })
                    .to(".preloader-text, .progress-bar", {
                        duration: 0.1,
                        opacity: 0
                    })
                    .to(".preloader", {
                        duration: 0.2,
                        height: 0,
                        onComplete: () => {
                            document.querySelector(".preloader").style.display = "none";
                        }
                    });

                await this.delay(2000);
            }

            $('.odometer').waypoint(function(direction) {
                if (direction === 'down') {
                    let countNumber = $(this.element).attr("data-count");
                    $(this.element).html(countNumber);
                }
            }, {
                offset: '80%'
            });

            /*Wow Js*/
            if ($('.wow').length) {
                var wow = new WOW({
                    boxClass: 'wow',
                    animateClass: 'animated',
                    offset: 0,
                    mobile: false,
                    live: true
                });
                wow.init();
            }

            /*GSAPAnimation*/
            GSAPAnimation.Init();
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    /*======================================
      Preloader activation with multiple
     ========================================*/
    const preloaders = $("[data-preloader]");
    preloaders.each(function(index, item) {
        if($(item).data('preloader') === 'active') {
            if($(item).data('loaded') === 'progress') {
                const RRDevsInit = new RRDEVS();
                $(".preloader-close").on("click", () => RRDevsInit.LoadedAfterProgress('click'));
                $(window).on('load', () => RRDevsInit.LoadedAfterProgress('load'));
            } else if($(item).data('loaded') === 'doted') {
                $(".preloader-close").on("click", () => RRDEVS.LoadedAfterDoted());
                $(window).on('load', () => RRDEVS.LoadedAfterDoted());
            }
        }
    });

    window.addEventListener('resize', function() {
        gsap.globalTimeline.clear();
    });

    /*======================================
      Mobile Menu Js
      ========================================*/
    $("#mobile-menu").meanmenu({
        meanMenuContainer: ".mobile-menu",
        meanScreenWidth: "1199",
        meanExpand: ['<i class="fa-regular fa-angle-right"></i>'],
    });

    /*======================================
      Sidebar Toggle
      ========================================*/
    $(".offcanvas__close,.offcanvas__overlay").on("click", function () {
        $(".offcanvas__area").removeClass("info-open");
        $(".offcanvas__overlay").removeClass("overlay-open");
    });
    // Scroll to bottom then close navbar
    $(window).scroll(function(){
        if($("body").scrollTop() > 0 || $("html").scrollTop() > 0) {
            $(".offcanvas__area").removeClass("info-open");
            $(".offcanvas__overlay").removeClass("overlay-open");
        }
    });
    $(".sidebar__toggle").on("click", function () {
        $(".offcanvas__area").addClass("info-open");
        $(".offcanvas__overlay").addClass("overlay-open");
    });

    /*======================================
      Body overlay Js
      ========================================*/
    $(".body-overlay").on("click", function () {
        $(".offcanvas__area").removeClass("opened");
        $(".body-overlay").removeClass("opened");
    });

    /*======================================
    Page Scroll Percentage
    ========================================*/
    const scrollTopPercentage = ()=> {
        const scrollPercentage = () => {
            const scrollTopPos = document.documentElement.scrollTop;
            const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollValue = Math.round((scrollTopPos / calcHeight) * 100);
            const scrollElementWrap = $("#scroll-percentage");

            scrollElementWrap.css("background", `conic-gradient( var(--rr-theme-primary) ${scrollValue}%, var(--rr-heading-primary) ${scrollValue}%)`);

            if ( scrollTopPos > 100 ) {
                scrollElementWrap.addClass("active");
            } else {
                scrollElementWrap.removeClass("active");
            }

            if( scrollValue < 96 ) {
                $("#scroll-percentage-value").text(`${scrollValue}%`);
            } else {
                $("#scroll-percentage-value").html('<i class="fa-solid fa-angle-up"></i>');
            }
        }
        window.onscroll = scrollPercentage;
        window.onload = scrollPercentage;

        // Back to Top
        function scrollToTop() {
            document.documentElement.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        $("#scroll-percentage").on("click", scrollToTop);
    }
    scrollTopPercentage();

    /*======================================
	Smoth animatio Js
	========================================*/
    $(document).on('click', '.smoth-animation', function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top - 50
        }, 300);
    });

    if ($(".count-bar").length) {
        $(".count-bar").appear(
            function() {
                var el = $(this);
                var percent = el.data("percent");
                $(el).css("width", percent).addClass("counted");
            }, {
                accY: -50
            }
        );
    }

    $('.live-comment-widget__form-input-select select, .contact-us-message__form-input-select select, .get-in-touch__form-input-select select, .banner-3__form-input-select select, .contact__form-input-select select').niceSelect();

    /*brand__active***/
    let brand = new Swiper(".brand__active", {
        slidesPerView: 1,
        spaceBetween: 156,
        loop: true,
        roundLengths: true,
        clickable: true,
        autoplay: {
            delay: 3000,
        },
        breakpoints: {
            1401: {
                slidesPerView: 5,
            },
            1200: {
                slidesPerView: 4,
            },
            992: {
                slidesPerView: 3,
            },
            576: {
                spaceBetween: 30,
                slidesPerView: 3,
            },
            481: {
                slidesPerView: 2,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });

    function lastNobullet() {
        $(".last_no_bullet ul").each(function() {
            var $listItems = $(this).find("li");

            if ($listItems.length > 1) {
                $listItems.last().addClass("no_bullet");
            }
        });
    }

    lastNobullet();

    $(window).resize(function() {
        lastNobullet();
    });

    $('.carouselTicker-nav').carouselTicker({});

    class MagneticButton {
        constructor(options) {
            this.settings = $.extend({
                target: $('[data-magnetic]'),
                class: 'magnetizing',
                attraction: 0.45,
                distance: 100,
                onEnter: function (data) {},
                onExit: function (data) {},
                onUpdate: function (data) {},
            }, options);

            if (!this.settings.target.length) return;

            this.init();
        }

        init() {
            $(window).on('mousemove', (e) => this.magnetize(e));
        }

        distanceFromMouse($target, mouseX, mouseY) {
            let centerX = $target.offset().left + $target.outerWidth() / 2,
                centerY = $target.offset().top + $target.outerHeight() / 2,
                pointX = mouseX - centerX,
                pointY = mouseY - centerY,
                distance = Math.sqrt(Math.pow(pointX, 2) + Math.pow(pointY, 2));

            return Math.floor(distance);
        }

        magnetize(e) {
            let mouseX = e.pageX, mouseY = e.pageY;

            this.settings.target.each((index, element) => {
                let $this = $(element),
                    centerX = $this.offset().left + $this.outerWidth() / 2,
                    centerY = $this.offset().top + $this.outerHeight() / 2,
                    attraction = $this.data('magnetic-attraction') || this.settings.attraction,
                    distance = $this.data('magnetic-distance') || this.settings.distance,
                    deltaX = Math.floor(centerX - mouseX) * -1 * attraction,
                    deltaY = Math.floor(centerY - mouseY) * -1 * attraction,
                    mouseDistance = this.distanceFromMouse($this, mouseX, mouseY),
                    isEnter = $this.data('isEnter') || false,
                    data = {target: $this, y: deltaY, x: deltaX, distance: mouseDistance};

                if (mouseDistance < distance) {
                    gsap.to($this, {y: deltaY, x: deltaX});

                    if (!isEnter) {
                        $this.data('isEnter', true);
                        $this.addClass(this.settings.class);
                        this.settings.onEnter(data);
                    }

                    this.settings.onUpdate(data);
                } else {
                    gsap.to($this, {y: 0, x: 0});

                    if (isEnter) {
                        $this.data('isEnter', false);
                        $this.removeClass(this.settings.class);
                        this.settings.onExit(data);
                    }
                }
            });
        }
    }

    new MagneticButton({
        attraction: (data) => data.target[0].dataset.magneticAttraction,
        distance: (data) => data.target[0].dataset.magneticDistance,
        onEnter: function (data) {
            gsap.to(data.target, {scale: data.target[0].dataset.magneticZoom});
        },
        onExit: function (data) {
            gsap.to(data.target, {scale: 1});
        },
        onUpdate: function (data) {}
    });

    let banner__slider = new Swiper ('.banner__slider', {
        slidesPerView: '1',
        centeredSlides: true,
        loop: true,
        loopedSlides: 3,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            type: "fraction",
        },
    });

    let portfolioDetails__media__slider = new Swiper ('.project-details__media__slider', {
        slidesPerView: '1',
        centeredSlides: true,
        loop: true,
        loopedSlides: 6,
        navigation: {
            prevEl: ".project-details__media__slider__arrow-prev",
            nextEl: ".project-details__media__slider__arrow-next",
        },
    });

    let ourProject = new Swiper ('.our-project__slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        clickable: true,
        autoplay: {
            delay: 3000,
        },
        breakpoints: {
            1200: {
                slidesPerView: 3,
            },
            881: {
                slidesPerView: 2,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });

    /*circleAnimation*/
    const circleAnimation = document.querySelector(".c-text");
    if (circleAnimation) {
        circleAnimation.innerHTML = [...circleAnimation.innerText]
            .map((char, i) => `<span style="transform:rotate(${i * 7.5 }deg)">${char}</span>`)
            .join("");
    }

    $('.grid').imagesLoaded(function () {
        var $grid = $('.grid').isotope({
            itemSelector: '.grid-item',
        });

        $('.masonary-menu').on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
        });
        $('.masonary-menu button').on('click', function (event) {
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
            event.preventDefault();
        });
    });

    $(document).ready(function () {
        function sliderAnimations(elements) {
            var animationEndEvents = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
            elements.each(function () {
                var $this = $(this);
                var $animationDelay = $this.data("delay");
                var $animationDuration = $this.data("duration");
                var $animationType = "ribuid-animation " + $this.data("animation");
                $this.css({
                    "animation-delay": $animationDelay,
                    "-webkit-animation-delay": $animationDelay,
                    "animation-duration": $animationDuration,
                });
                $this.addClass($animationType).one(animationEndEvents, function () {
                    $this.removeClass($animationType);
                });
            });
        }
        var sliderOptions = {
            speed: 1500,
            autoplay: {
                delay: 7000,
            },
            disableOnInteraction: false,
            initialSlide: 0,
            parallax: false,
            mousewheel: false,
            loop: true,
            grabCursor: true,
            // effect: "fade",
            navigation: {
                nextEl: ".banner-2__slider__arrow-next",
                prevEl: ".banner-2__slider__arrow-prev",
            },
        };
        sliderOptions.on = {
            slideChangeTransitionStart: function () {
                var swiper = this;
                var animatingElements = $(swiper.slides[swiper.activeIndex]).find("[data-animation]");
                sliderAnimations(animatingElements);
            },

            resize: function () {
                this.update();
            },
        };

        var swiper = new Swiper(".banner-2__slider", sliderOptions);
        
    });
})(jQuery);

const form = document.getElementById('request-a-quote__form');

if(form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
    
        const button = document.querySelector('.rr-btn .btn-wrap');
        const originalText = button.innerHTML;
        const successMessage = document.getElementById('success-message');
    
        button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`;
    
        setTimeout(() => {
            button.innerHTML = originalText;
            successMessage.style.display = "block";
            form.reset();
            
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 3000);
        }, 3000);
    });
}