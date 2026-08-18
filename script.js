(function () {
    "use strict";
  
    const STORAGE_KEY = "portfolio-theme";
    const header = document.querySelector(".site-header");
    const navToggle = document.getElementById("nav-toggle");
    const siteNav = document.getElementById("site-nav");
    const themeToggle = document.getElementById("theme-toggle");
    const yearEl = document.getElementById("year");
  
    function getStoredTheme() {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    }
  
    function setStoredTheme(value) {
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {
        /* ignore */
      }
    }
  
    function getPreferredTheme() {
      return "light";
    }
  
    function applyTheme(theme) {
      const root = document.documentElement;
      if (theme === "dark") {
        root.setAttribute("data-theme", "dark");
      } else {
        root.removeAttribute("data-theme");
      }
      if (themeToggle) {
        themeToggle.setAttribute(
          "aria-label",
          theme === "dark" ? "切換為淺色主題" : "切換為深色主題"
        );
      }
    }
  
    function initTheme() {
      const stored = getStoredTheme();
      const theme = stored === "light" || stored === "dark" ? stored : getPreferredTheme();
      applyTheme(theme);
    }
  
    function toggleTheme() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      applyTheme(next);
      setStoredTheme(next);
    }
  
    function closeNav() {
      if (!header || !navToggle) return;
      header.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "開啟選單");
    }
  
    function openNav() {
      if (!header || !navToggle) return;
      header.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "關閉選單");
    }
  
    function toggleNav() {
      if (!header || !navToggle) return;
      if (header.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    }
  
    function initNavToggle() {
      if (!navToggle || !header) return;
      navToggle.addEventListener("click", toggleNav);
  
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeNav();
      });
  
      window.addEventListener("resize", function () {
        if (window.matchMedia("(min-width: 768px)").matches) {
          closeNav();
        }
      });
    }
  
    function initSmoothScroll() {
      const links = document.querySelectorAll('a[href^="#"]:not(.skip-link)');
      links.forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
          const id = anchor.getAttribute("href");
          if (!id || id === "#") return;
          const target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          closeNav();
          if (history.replaceState) {
            history.replaceState(null, "", id);
          }
        });
      });
    }
  
    function initReveal() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.querySelectorAll(".reveal").forEach(function (el) {
          el.classList.add("is-visible");
        });
        return;
      }
  
      const elements = document.querySelectorAll(".reveal");
      if (!elements.length) return;
  
      const observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
      );
  
      elements.forEach(function (el) {
        observer.observe(el);
      });
    }
  
    function initYear() {
      if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
      }
    }
  
    function initTabs() {
      const tabButtons = document.querySelectorAll(".tabs__btn");
      const tabPanels = document.querySelectorAll(".tab-panel");
      if (!tabButtons.length) return;
  
      tabButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const target = btn.getAttribute("data-tab");
          tabButtons.forEach(function (b) {
            b.classList.remove("is-active");
            b.setAttribute("aria-selected", "false");
          });
          tabPanels.forEach(function (panel) {
            const isMatch = panel.getAttribute("data-panel") === target;
            panel.classList.toggle("is-active", isMatch);
            panel.hidden = !isMatch;
          });
          btn.classList.add("is-active");
          btn.setAttribute("aria-selected", "true");
        });
      });
    }
  
    document.addEventListener("DOMContentLoaded", function () {
      initTheme();
      if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
      }
      initNavToggle();
      initSmoothScroll();
      initReveal();
      initYear();
      initTabs();
    });
  })();