const sections = [
  { type: 'cpu', label: 'CPU' },
  { type: 'videocard', label: 'GPU' },
  { type: 'motherboard', label: 'Motherboard' },
  { type: 'internalharddrive', label: 'Storage' },
  { type: 'powersupply', label: 'Power Supply' },
  { type: 'case', label: 'Case' },
  { type: 'monitor', label: 'Monitor' },
  { type: 'keyboard', label: 'Keyboard' },
  { type: 'mouse', label: 'Mouse' },
  { type: 'soundcard', label: 'Sound Card' },
];

const selectedComponents = {};
let totalPrice = 0;

const container = document.getElementById("component-sections");
const selectedList = document.getElementById("selected-list");
const priceValue = document.getElementById("price-value");
const saveButton = document.getElementById("save-build");
const toggleTheme = document.getElementById("toggle-theme");

// 🌓 Theme Setup
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
  loadAllSections();
});

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});

async function loadAllSections() {
  for (const section of sections) {
    const data = await loadJSON(`data/${section.type}.json`);
    if (data) renderSection(section.type, section.label, data);
  }

  // 💡 Call scroll nav setup after all sections are in the DOM
  setupScrollNavigation();
}

// 🌐 Fetch JSON file
async function loadJSON(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error(`Error loading ${url}`, err);
    return null;
  }
}

// 🧱 Render a component section
function renderSection(type, label, items) {
  const section = document.createElement("section");
  section.innerHTML = `<h2>${label}</h2>`;
  const row = document.createElement("div");
  row.classList.add("component-section");

  items.slice(0, 50).forEach(item => {
    const card = document.createElement("div");
    card.className = "component-card";
    card.setAttribute("data-type", type);
    card.setAttribute("data-compatible", "all");

    const imageURL = getRandomImage(type); // fallback placeholder

    card.innerHTML = `
    <h3>${item.name}</h3>
    <p>$${item.price ?? "N/A"}</p>
    <div class="specs">${getSpecsHTML(type, item)}</div>
    <button class="select-button" ${!item.price ? 'disabled' : ''}>Select</button>
    `;

    const button = card.querySelector(".select-button");

    button.addEventListener("click", () => {
      const previouslySelected = selectedComponents[type];
      const isSame = previouslySelected && previouslySelected.name === item.name;

      if (isSame) {
        // Deselect
        delete selectedComponents[type];
        totalPrice -= item.price;
        updateSelectedUI();
        unlockSection(type);
      } else {
        // Replace selection
        if (selectedComponents[type]) {
          totalPrice -= selectedComponents[type].price;
        }

        selectedComponents[type] = { ...item };
        totalPrice += item.price;
        updateSelectedUI();
        lockSection(type, card);
      }
    });

    
    button.addEventListener("click", () => {
      if (!item.price) return;
      if (selectedComponents[type]) {
        totalPrice -= selectedComponents[type].price;
      }
      selectedComponents[type] = { name: item.name, price: item.price };
      totalPrice += item.price;
      updateSelectedUI();
    });

    row.appendChild(card);
  });

  section.appendChild(row);
  container.appendChild(section);
}

// 🖼️ Image fallback per category
function getRandomImage(type) {
  const map = {
    cpu: "cpu.jpeg",
    motherboard: "motherboard.jpeg",
    ram: "memory.jpg",
    storage: "storage.jpg",
    case: "https://m.media-amazon.com/images/I/81UDT5vA2vL._AC_SL1500_.jpg",
    videocard: "https://m.media-amazon.com/images/I/81mxun+6pEL._AC_SL1500_.jpg",
    powersupply: "https://m.media-amazon.com/images/I/61yE46QXqPL._AC_SL1000_.jpg",
    keyboard: "https://m.media-amazon.com/images/I/81k8BwTckwL._AC_SL1500_.jpg",
    mouse: "https://m.media-amazon.com/images/I/71y1qA6zkIL._AC_SL1500_.jpg",
    monitor: "https://m.media-amazon.com/images/I/81tpiLpKFUL._AC_SL1500_.jpg",
    soundcard: "https://m.media-amazon.com/images/I/71PZ7NmPqgL._AC_SL1500_.jpg"
  };
  return map[type] || "https://via.placeholder.com/200";
}

function getSpecsHTML(type, item) {
  const fields = {
    cpu: ["core_count", "core_clock", "boost_clock", "tdp", "graphics"],
    videocard: ["chipset", "memory", "core_clock", "boost_clock", "length"],
    motherboard: ["socket", "form_factor", "max_memory", "memory_slots", "color"],
    internalharddrive: ["type", "capacity", "cache", "interface", "form_factor"],
    powersupply: ["type", "efficiency", "wattage", "modular", "color"],
    case: ["type", "color", "side_panel", "external_bays", "internal_bays"],
    monitor: ["screen_size", "resolution", "refresh_rate", "response_time", "panel_type"],
    keyboard: ["style", "mechanical", "backlit", "color", "switch_type"],
    mouse: ["tracking_method", "connection_type", "max_dpi", "hand_orientation", "color"],
    soundcard: ["channels", "digital_audio", "snr", "sample_rate", "interface"],
  };

  const props = fields[type] || [];
  return props
    .filter(key => key in item)
    .map(key => `<strong>${formatKey(key)}:</strong> ${formatValue(item[key])}`)
    .join("<br>");
}

function formatKey(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function formatValue(value) {
  if (Array.isArray(value)) return value.join(" x ");
  return value ?? "N/A";
}


// 🧾 Update selection UI
function updateSelectedUI() {
  selectedList.innerHTML = "";
  for (const key in selectedComponents) {
    const { name, price } = selectedComponents[key];
    const li = document.createElement("li");
    li.textContent = `${key.toUpperCase()}: ${name} — $${price.toFixed(2)}`;
    selectedList.appendChild(li);
  }
  priceValue.textContent = totalPrice.toFixed(2);
  updateBenchmarkScore();
}


function updateBenchmarkScore() {
  let score = 0;

  const cpu = selectedComponents["cpu"];
  const gpu = selectedComponents["videocard"];
  const ram = selectedComponents["memory"];
  const storage = selectedComponents["internalharddrive"];
  const psu = selectedComponents["powersupply"];

  // --- CPU ---
  if (cpu) {
    const cores = cpu.core_count || 4;
    const boost = parseFloat(cpu.boost_clock) || 3.0;
    const threads = cpu.thread_count || (cores * 2);
    score += (cores * boost * 5) + (threads * 2); // More sensitive
  }

  // --- GPU ---
  if (gpu) {
    const vram = gpu.memory || 4;
    const boost = parseFloat(gpu.boost_clock) || 1200;
    const base = parseFloat(gpu.core_clock) || 1000;
    const effectiveClock = (boost + base) / 2;
    score += (vram * effectiveClock / 1000) * 7; // Amplified impact
  }

  // --- RAM ---
  if (ram) {
    const ramSize = ram.memory_size || 8;
    const ramSpeed = ram.memory_speed || 2400;
    score += (ramSize * ramSpeed / 1000) * 0.8; // RAM effect
  }

  // --- Storage ---
  if (storage) {
    const isSSD = storage.type?.toLowerCase().includes("ssd");
    score += isSSD ? 10 : 5; // Simple SSD bonus
  }

  // --- PSU ---
  if (psu) {
    const wattage = psu.wattage || 500;
    score += wattage >= 750 ? 10 : 5;
  }

  // --- Final Normalization ---
  const maxPossible = 400; // You could scale this if high-end parts overshoot
  const roundedScore = Math.round(score);
  const percent = Math.min((roundedScore / maxPossible) * 100, 100);

  // Update UI
  const bar = document.getElementById("benchmark-bar");
  const label = document.getElementById("benchmark-value-label");
  if (bar) bar.style.width = `${percent}%`;
  if (label) label.textContent = `${roundedScore} / ${maxPossible}`;
}




// 💾 Save build to backend
saveButton.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Please login to save your build.");

  try {
    const res = await fetch("https://build-my-rig.onrender.com/api/builds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ components: selectedComponents, totalPrice }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Build saved successfully!");
    } else {
      alert(data.error || "Failed to save build.");
    }
  } catch (err) {
    console.error(err);
    alert("Error saving build.");
  }
});

function lockSection(type, selectedCard) {
  document.querySelectorAll(`.component-card[data-type="${type}"]`).forEach(card => {
    if (card !== selectedCard) {
      card.classList.add("dimmed");
    } else {
      card.classList.add("selected");
    }
  });
}

function unlockSection(type) {
  document.querySelectorAll(`.component-card[data-type="${type}"]`).forEach(card => {
    card.classList.remove("dimmed", "selected");
  });
}

// ⬆️⬇️ Scroll between component sections AFTER they're loaded
function setupScrollNavigation() {
  const sectionHeaders = Array.from(document.querySelectorAll("#component-sections > section"));
  if (sectionHeaders.length === 0) return;

  let currentIndex = 0;

  const navHeight = document.querySelector("nav").offsetHeight;

  const scrollToIndex = (index) => {
    if (index >= 0 && index < sectionHeaders.length) {
      currentIndex = index;
      const target = sectionHeaders[index];
      const offset = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  const scrollUpBtn = document.getElementById("scroll-up");
  const scrollDownBtn = document.getElementById("scroll-down");

  if (scrollUpBtn && scrollDownBtn) {
    scrollUpBtn.addEventListener("click", () => scrollToIndex(currentIndex - 1));
    scrollDownBtn.addEventListener("click", () => scrollToIndex(currentIndex + 1));
  }

  const goTopBtn = document.getElementById("go-top");
  const goBottomBtn = document.getElementById("go-bottom");

  if (goTopBtn) {
    goTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => updateCurrentIndexByScroll(sectionHeaders), 500);
    });
  }

  if (goBottomBtn) {
    goBottomBtn.addEventListener("click", () => {
      const offset = window.innerHeight * 1.2;
      const destination = Math.max(0, document.body.scrollHeight - offset);
      window.scrollTo({ top: destination, behavior: "smooth" });

      // Also update currentIndex after scroll completes
      setTimeout(() => updateCurrentIndexByScroll(sectionHeaders), 600);
    });
  }
}

function lockSection(type, selectedCard) {
  document.querySelectorAll(`.component-card[data-type="${type}"]`).forEach(card => {
    if (card !== selectedCard) {
      card.classList.add("dimmed");
    } else {
      card.classList.add("selected");
    }
  });
}

function unlockSection(type) {
  document.querySelectorAll(`.component-card[data-type="${type}"]`).forEach(card => {
    card.classList.remove("dimmed", "selected");
  });
}

function updateCurrentIndexByScroll(sectionHeaders) {
  const scrollY = window.scrollY;
  const navHeight = document.querySelector("nav")?.offsetHeight || 0;

  sectionHeaders.forEach((section, i) => {
    const offset = section.offsetTop - navHeight;
    const nextOffset = (sectionHeaders[i + 1]?.offsetTop || Infinity) - navHeight;

    if (scrollY >= offset && scrollY < nextOffset) {
      currentIndex = i;
    }
  });
}




