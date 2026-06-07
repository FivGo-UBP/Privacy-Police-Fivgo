// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeToggleCircle = document.querySelector(".theme-toggle-circle");
const logoImage = document.querySelector(".logo-icon img");
const htmlElement = document.documentElement;
const lightLogo = "assets/logo light.png";
const darkLogo = "assets/logo dark.png";
const sunIcon = `
  <svg class="icon icon-sun" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
`;
const moonIcon = `
  <svg class="icon icon-moon" viewBox="0 0 24 24">
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z" />
  </svg>
`;

// Check for saved theme preference or default to 'dark'
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.classList.add("active");
  themeToggleCircle.innerHTML = moonIcon;
  logoImage.src = darkLogo;
} else {
  logoImage.src = lightLogo;
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.classList.toggle("active");

  const isDarkMode = document.body.classList.contains("dark-mode");
  themeToggleCircle.innerHTML = isDarkMode ? moonIcon : sunIcon;
  logoImage.src = isDarkMode ? darkLogo : lightLogo;
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

// Sidebar Navigation - Active Link
const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
const backToTopButton = document.querySelector(".footer-top-link");
let clickedActiveLink = null;

function clearClickedActiveLink() {
  clickedActiveLink = null;
}

function updateActiveLink() {
  if (clickedActiveLink) {
    sidebarLinks.forEach((link) => {
      link.classList.toggle("active", link === clickedActiveLink);
    });
    return;
  }

  const scrollPosition = window.scrollY + 90;
  let activeLink = null;

  sidebarLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));

    if (section && section.offsetTop <= scrollPosition) {
      activeLink = link;
    }
  });

  sidebarLinks.forEach((link) => {
    link.classList.toggle("active", link === activeLink);
  });
}

function updateBackToTopButton() {
  if (!backToTopButton) return;

  if (window.scrollY > 180) {
    backToTopButton.classList.remove("is-hidden");
  } else {
    backToTopButton.classList.add("is-hidden");
  }
}

// Update active link on scroll
window.addEventListener("scroll", updateActiveLink);
window.addEventListener("scroll", updateBackToTopButton);

// Update active link on click
sidebarLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const sectionId = link.getAttribute("href").substring(1);
    const section = document.getElementById(sectionId);

    if (section) {
      clickedActiveLink = link;
      sidebarLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      section.scrollIntoView({ behavior: "smooth" });
    }
  });
});

window.addEventListener("wheel", clearClickedActiveLink, { passive: true });
window.addEventListener("touchstart", clearClickedActiveLink, { passive: true });
window.addEventListener("keydown", (e) => {
  const scrollKeys = ["ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown", " "];
  if (scrollKeys.includes(e.key)) {
    clearClickedActiveLink();
  }
});

if (backToTopButton) {
  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Download PDF Button
const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", () => {
  const body = document.body;
  const wasDarkMode = body.classList.contains("dark-mode");

  // Temporarily switch to light mode so text colors are dark & readable in PDF
  if (wasDarkMode) {
    body.classList.remove("dark-mode");
  }

  // Clone the entire page content for PDF (header + highlights + content)
  const pageWrapper = document.createElement("div");
  pageWrapper.style.cssText = "background:#ffffff;padding:0;margin:0;";

  const contentEl = document.querySelector(".content");
  const cloned = contentEl.cloneNode(true);
  // Force solid colours on the clone so html2canvas captures them correctly
  cloned.style.cssText = [
    "background:#ffffff",
    "border:none",
    "box-shadow:none",
    "border-radius:0",
    "padding:2rem",
    "color:#111827",
  ].join(";");
  pageWrapper.appendChild(cloned);

  const opt = {
    margin: [10, 10, 10, 10],
    filename: "FivGo-Privacy-Policy.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    },
    jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
  };

  // Check if html2pdf is available, if not show alert
  if (typeof html2pdf !== "undefined") {
    html2pdf()
      .set(opt)
      .from(pageWrapper)
      .save()
      .finally(() => {
        // Restore dark mode after PDF is generated
        if (wasDarkMode) {
          body.classList.add("dark-mode");
        }
      });
  } else {
    // Fallback: use browser's print functionality
    if (wasDarkMode) {
      body.classList.add("dark-mode");
    }
    window.print();
  }
});

// Initialize active link on page load
updateActiveLink();
updateBackToTopButton();
