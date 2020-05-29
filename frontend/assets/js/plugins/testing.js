;var TD = {};
(function ($, window, document) {
    'use strict';

    TD = {
        init: function () {
            $(document).ready(function () {
                // this will fire when document is ready
                TD.utils.init();
                TD.bindings.init();
            });
            // this will fire before document is ready
        },
        utils: {
            init: function () {
                this.smoothScroll();
            },
            smoothScroll: function () {
                // smooth scroll has to be here and not in a function
                $('a[href*="#"]').on('click', function (e) {
                    e.preventDefault();
                    var headerHeight = $('#site-header').height(),
                        offset = headerHeight - 1;

                    $('html, body').animate(
                        {
                            scrollTop: $($(this).attr('href')).offset().top - offset,
                        },
                        500,
                        'linear'
                    )
                })
            },
            whichTransitionEvent: function () {
                var t,
                    el = document.createElement("fakeelement");

                var transitions = {
                    "transition"      : "transitionend",
                    "OTransition"     : "oTransitionEnd",
                    "MozTransition"   : "transitionend",
                    "WebkitTransition": "webkitTransitionEnd"
                };

                for (t in transitions){
                    if (el.style[t] !== undefined){
                        return transitions[t];
                    }
                }
            },
            scrollTo: function ($element, offset) {
                offset = typeof offset !== 'undefined' ? offset : 0;
                $('html, body').animate(
                    {
                        scrollTop: $element.offset().top - offset,
                    },
                    500,
                    'linear'
                );
            }
        },
        vals: {},
        bindings: {
            init: function () {
                $('.mobile-nav-button__hamburger-menu, .mobile-nav-button__button-menu, .mobile-nav-button__button-close').on('click', function (e) {
                    e.preventDefault();
                    TD.methods.mobileMenuToggle($(this));
                });
                $('.mobile-nav__menu .menu-item-has-children > a').on('click', function (e) {
                    e.preventDefault();
                    TD.methods.mobileSubMenuToggle($(this));
                });
            },
        },
        methods: {
            mobileMenuToggle: function ($this) {
                $this.parent('.mobile-nav-button__button-wrapper').toggleClass('mobile-nav-button__button-wrapper--open');
                $('#mobile-nav__container').stop().slideToggle();
                $('.mobile-nav-button__hamburger-menu').toggleClass('animate');

                $('.mobile-nav__menu').find('a.sub-menu--open').removeClass('sub-menu--open').siblings('.sub-menu').slideUp();
            },
            mobileSubMenuToggle: function ($this) {
                $this.siblings('.sub-menu').stop().slideToggle();
                if ($this.hasClass('sub-menu--open')) {
                    setTimeout(function () {
                        $this.removeClass('sub-menu--open');
                    }, 300);
                } else {
                    $this.addClass('sub-menu--open');
                }
            },
        },
    };

    TD.init();

})(jQuery, window, document);