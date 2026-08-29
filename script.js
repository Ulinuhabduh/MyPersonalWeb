const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

const hot = "a, button, input, textarea, .card, .contact-box, .pub-card, .exp-item, .box-panel";
document.querySelectorAll(hot).forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hot"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hot"));
});

const themeBtn = document.getElementById("theme");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("invert");
  });
}

const form = document.getElementById("contact-form") || document.querySelector(".form");
const formResult = document.getElementById("form-result");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector(".submit");
    const originalBtnText = "SEND MESSAGE ►";
    
    btn.disabled = true;
    btn.textContent = "SENDING...";
    if (formResult) {
      formResult.className = "form-result";
      formResult.style.display = "none";
    }

    const formData = new FormData(form);
    const accessKey = formData.get("access_key");

    // Fallback if access key is not yet configured
    if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
      const name = formData.get("name") || "";
      const email = formData.get("email") || "";
      const message = formData.get("message") || "";
      const mailtoUrl = `mailto:mulinuhaa@gmail.com?subject=${encodeURIComponent("Portfolio Contact from " + name)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
      
      btn.textContent = "OPENING EMAIL CLIENT ✔";
      if (formResult) {
        formResult.textContent = "Opening email client... (To enable direct inbox delivery, configure the Web3Forms Access Key in index.html)";
        formResult.className = "form-result error";
        formResult.style.display = "block";
      }
      window.location.href = mailtoUrl;
      
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalBtnText;
      }, 4000);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (response.status === 200 && data.success) {
        btn.textContent = "SENT ✔";
        btn.style.background = "var(--accent)";
        btn.style.color = "#0a0a0a";
        if (formResult) {
          formResult.textContent = "Your message has been sent successfully!";
          formResult.className = "form-result success";
          formResult.style.display = "block";
        }
        form.reset();
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      btn.textContent = "FAILED ✖";
      if (formResult) {
        formResult.textContent = "Failed to send message automatically. Please contact directly via email: mulinuhaa@gmail.com";
        formResult.className = "form-result error";
        formResult.style.display = "block";
      }
    } finally {
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalBtnText;
        btn.style.background = "";
        btn.style.color = "";
      }, 5000);
    }
  });
}

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

