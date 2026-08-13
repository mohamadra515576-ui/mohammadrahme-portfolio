/* =================================================================
   Mohammad Rahme — B2B SaaS Content Writer
   Script
   - Mobile nav toggle
   - Smooth-scroll offset for sticky header
   - Portfolio "Read more" expand / collapse
   - Header scroll-state
   - Scroll-reveal observer
   ================================================================= */

(function () {
    'use strict';

    /* -------- Mobile nav toggle -------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    const siteHeader = document.getElementById('siteHeader');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close mobile menu after a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* -------- Header scroll-state (border appears on scroll) -------- */
    if (siteHeader) {
        const onScroll = function () {
            const y = window.scrollY || window.pageYOffset;
            siteHeader.classList.toggle('is-scrolled', y > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* -------- Smooth-scroll offset for the sticky header -------- */
    const headerOffset = function () {
        return siteHeader ? siteHeader.offsetHeight : 0;
    };

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset() + 1;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    });

    /* -------- Portfolio / Work expand / collapse -------- */
    const toggles = document.querySelectorAll('.work__toggle');

    toggles.forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            const work    = toggle.closest('.work');
            const content = work ? work.querySelector('.work__col-content') : null;
            const label   = toggle.querySelector('.toggle-label');
            if (!work || !content) return;

            const isOpen = work.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            content.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            if (label) label.textContent = isOpen ? label.dataset.openLabel || label.textContent.replace(/^Read /, 'Hide ') : label.dataset.closedLabel || label.textContent.replace(/^Hide /, 'Read ');
        });
    });

    /* Capture original labels so re-toggling reads sensibly */
    toggles.forEach(function (toggle) {
        const label = toggle.querySelector('.toggle-label');
        if (!label) return;
        if (!label.dataset.closedLabel) label.dataset.closedLabel = label.textContent;
        // produce a friendly "Show less" hint while open
        label.dataset.openLabel = label.textContent.replace(/^Read /, 'Hide ');
    });

    /* -------- Scroll-reveal observer -------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* -------- Footer year -------- */
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

}());