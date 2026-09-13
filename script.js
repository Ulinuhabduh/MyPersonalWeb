/* Neo-brutalism interactions */
(function () {
  var bar = document.getElementById("progress-bar");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (bar) bar.style.width = p + "%";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  var d = document.getElementById("edition-date");
  if (d) { try { d.textContent = new Date().getFullYear(); } catch (e) {} }
  var btn = document.getElementById("theme");
  if (btn) {
    var saved = null;
    try { saved = localStorage.getItem("nuha-theme"); } catch (e) {}
    if (saved === "dark") document.body.classList.add("dark");
    syncLabel();
    btn.addEventListener("click", function () {
      document.body.classList.toggle("dark");
      try { localStorage.setItem("nuha-theme", document.body.classList.contains("dark") ? "dark" : "light"); } catch (e) {}
      syncLabel();
    });
    function syncLabel() { btn.textContent = document.body.classList.contains("dark") ? "Light" : "Dark"; }
  }
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("in"); }); }
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) { links.forEach(function (a) { a.classList.remove("active"); }); var a = map[x.target.id]; if (a) a.classList.add("active"); }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["projects", "experience", "publications", "honors", "skills", "contact"].forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }
  var form = document.getElementById("contact-form");
  var result = document.getElementById("form-result");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var b = form.querySelector(".submit");
      var orig = "Send it \u2192";
      b.disabled = true; b.textContent = "Sending...";
      if (result) { result.className = "form-result"; result.style.display = "none"; }
      var fd = new FormData(form);
      var key = fd.get("access_key");
      if (!key || key === "YOUR_ACCESS_KEY_HERE") {
        var n = fd.get("name") || "", em = fd.get("email") || "", m = fd.get("message") || "";
        window.location.href = "mailto:mulinuhaa@gmail.com?subject=" + encodeURIComponent("Hi from " + n) + "&body=" + encodeURIComponent("Name: " + n + "\nEmail: " + em + "\n\n" + m);
        if (result) { result.textContent = "Opening your mail app..."; result.className = "form-result error"; result.style.display = "block"; }
        setTimeout(function () { b.disabled = false; b.textContent = orig; }, 3000);
        return;
      }
      try {
        var r = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
        var data = await r.json();
        if (r.status === 200 && data.success) { b.textContent = "Sent! \u2713"; form.reset(); if (result) { result.textContent = "Message received — talk soon!"; result.className = "form-result success"; result.style.display = "block"; } }
        else { throw new Error(data.message || "failed"); }
      } catch (err) { b.textContent = "Failed \u2716"; if (result) { result.textContent = "Could not send — write to mulinuhaa@gmail.com"; result.className = "form-result error"; result.style.display = "block"; } }
      finally { setTimeout(function () { b.disabled = false; b.textContent = orig; }, 5000); }
    });
  }
})();
