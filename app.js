const machines = [
  {
    id: "polar-mochi",
    name: "Polar Mochi Plush XL",
    category: "plush",
    status: "available",
    tag: "New drop",
    buyPrice: 82000,
    discountedPlayPrice: 8000,
    playReward: 180,
    buyReward: 35,
    waiting: 0,
    watching: 18,
    guaranteePlays: 10,
    image: "assets/prize-polar.png",
    popular: true,
    ticket: true,
  },
  {
    id: "neon-mecha",
    name: "Neon Mecha Figure",
    category: "figure",
    status: "busy",
    tag: "Hot",
    buyPrice: 95000,
    discountedPlayPrice: 7600,
    playReward: 170,
    buyReward: 40,
    waiting: 4,
    watching: 31,
    guaranteePlays: 12,
    image: "assets/prize-mecha.png",
    popular: true,
    ticket: false,
  },
  {
    id: "strawberry-cat",
    name: "Strawberry Cat Cushion",
    category: "plush",
    status: "available",
    tag: "Limited",
    buyPrice: 75000,
    discountedPlayPrice: 8000,
    playReward: 160,
    buyReward: 32,
    waiting: 1,
    watching: 22,
    guaranteePlays: 9,
    image: "assets/prize-cat.png",
    popular: false,
    ticket: true,
  },
  {
    id: "capsule-lab",
    name: "Capsule Lab Mystery Set",
    category: "snack",
    status: "available",
    tag: "Ticket OK",
    buyPrice: 39000,
    discountedPlayPrice: 5200,
    playReward: 90,
    buyReward: 18,
    waiting: 0,
    watching: 9,
    guaranteePlays: 7,
    image: "assets/prize-capsule.png",
    popular: false,
    ticket: true,
  },
  {
    id: "crystal-rabbit",
    name: "Crystal Rabbit Figure",
    category: "figure",
    status: "available",
    tag: "Premium",
    buyPrice: 102000,
    discountedPlayPrice: 7000,
    playReward: 190,
    buyReward: 44,
    waiting: 2,
    watching: 25,
    guaranteePlays: 14,
    image: "assets/prize-rabbit.png",
    popular: true,
    ticket: false,
  },
  {
    id: "mini-arcade",
    name: "Mini Arcade Keychain Pack",
    category: "limited",
    status: "available",
    tag: "Rare",
    buyPrice: 55000,
    discountedPlayPrice: 6600,
    playReward: 120,
    buyReward: 24,
    waiting: 0,
    watching: 14,
    guaranteePlays: 8,
    image: "assets/prize-arcade.png",
    popular: false,
    ticket: true,
  },
  {
    id: "ramen-stack",
    name: "Ramen Snack Tower",
    category: "snack",
    status: "busy",
    tag: "Restocked",
    buyPrice: 51000,
    discountedPlayPrice: 5500,
    playReward: 110,
    buyReward: 22,
    waiting: 3,
    watching: 16,
    guaranteePlays: 9,
    image: "assets/prize-ramen.png",
    popular: true,
    ticket: true,
  },
  {
    id: "space-duck",
    name: "Space Duck Plush Pair",
    category: "plush",
    status: "available",
    tag: "Pair prize",
    buyPrice: 81000,
    discountedPlayPrice: 7200,
    playReward: 150,
    buyReward: 34,
    waiting: 0,
    watching: 20,
    guaranteePlays: 11,
    image: "assets/prize-duck.png",
    popular: false,
    ticket: true,
  },
];

// Drop your real camera stills here:
// Front camera: assets/photo1.png
// Side camera: assets/photo2.png
// The demo fallback keeps the page usable until those files exist.
const cameraImages = {
  front: "assets/photo1.png",
  side: "assets/photo2.png",
  frontFallback: "assets/demo-crane-showcase.png",
  sideFallback: "assets/demo-crane-side.png",
};

const state = {
  category: "all",
  quick: "all",
  query: "",
  clawX: 50,
  clawY: 13,
  camera: 1,
  playing: false,
  cash: 250000,
  points: 0,
  cart: [],
  plays: {},
};

const app = document.querySelector("#app");
const homeTemplate = document.querySelector("#home-template");
const detailTemplate = document.querySelector("#detail-template");

function money(value) {
  return new Intl.NumberFormat("en-US").format(value) + " THB";
}

function points(value) {
  return new Intl.NumberFormat("en-US").format(value) + " pts";
}

function normalPlayPrice(machine) {
  return Math.ceil(machine.buyPrice / machine.guaranteePlays);
}

function guaranteeLabel(machine) {
  return `Guarantee ${machine.guaranteePlays} plays`;
}

function playCount(machine) {
  return state.plays[machine.id] || 0;
}

function updateHeader() {
  document.querySelectorAll("#cash-balance").forEach((item) => {
    item.textContent = money(state.cash);
  });
  document.querySelectorAll("#points-balance").forEach((item) => {
    item.textContent = points(state.points);
  });
  document.querySelectorAll("#cart-count").forEach((item) => {
    item.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
  });
}

function spendCash(cost, rewardPoints) {
  if (state.cash < cost) {
    return { ok: false, text: `Need ${money(cost - state.cash)} more` };
  }

  state.cash -= cost;
  state.points += rewardPoints;
  updateHeader();
  return { ok: true };
}

function addToCart(machine, source) {
  const existing = state.cart.find((item) => item.id === machine.id && item.source === source);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: machine.id,
      name: machine.name,
      image: machine.image,
      price: source === "buy" ? machine.buyPrice : 0,
      source,
      qty: 1,
    });
  }
  updateHeader();
}

function filteredMachines() {
  return machines.filter((machine) => {
    const categoryMatch = state.category === "all" || machine.category === state.category;
    const queryMatch = machine.name.toLowerCase().includes(state.query.toLowerCase());
    const quickMatch =
      state.quick === "all" ||
      (state.quick === "available" && machine.status === "available") ||
      (state.quick === "ticket" && machine.ticket) ||
      (state.quick === "popular" && machine.popular);

    return categoryMatch && queryMatch && quickMatch;
  });
}

function renderHome() {
  app.replaceChildren(homeTemplate.content.cloneNode(true));
  updateHeader();
  bindGlobalButtons();
  bindHome();
  renderGrid();
}

function bindGlobalButtons() {
  document.querySelector("#cart-button")?.addEventListener("click", renderCartModal);
}

function bindHome() {
  const input = document.querySelector("#search-input");
  input.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    renderGrid();
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
      renderGrid();
    });
  });

  document.querySelectorAll("[data-quick]").forEach((button) => {
    button.addEventListener("click", () => {
      state.quick = button.dataset.quick;
      document.querySelectorAll("[data-quick]").forEach((item) => item.classList.toggle("active", item === button));
      renderGrid();
    });
  });

  document.querySelector("[data-scroll='hot']").addEventListener("click", () => {
    state.quick = "popular";
    document.querySelector("#machines").scrollIntoView({ behavior: "smooth" });
    document.querySelectorAll("[data-quick]").forEach((item) => item.classList.toggle("active", item.dataset.quick === "popular"));
    renderGrid();
  });
}

function renderGrid() {
  const grid = document.querySelector("#machine-grid");
  const liveCount = document.querySelector("#live-count");
  const items = filteredMachines();
  liveCount.textContent = machines.filter((machine) => machine.status === "available").length;

  if (!items.length) {
    grid.innerHTML = '<div class="empty">No machines match this filter</div>';
    return;
  }

  grid.innerHTML = items
    .map((machine) => {
      const regular = normalPlayPrice(machine);
      return `
        <article class="machine-card" tabindex="0" role="link" data-id="${machine.id}" aria-label="Open ${machine.name}">
          <span class="tag">${machine.tag}</span>
          <img src="${machine.image}" alt="${machine.name}" />
          <div class="card-copy">
            <h3>${machine.name}</h3>
            <div class="guarantee-line">${guaranteeLabel(machine)}</div>
            <div class="card-meta">
              <span class="badge">${machine.status === "available" ? "Ready" : `${machine.waiting} queue`}</span>
              
            </div>
            <div class="price-compare">
              <span>Buy now</span>
              <strong>${money(machine.buyPrice)}</strong>
            </div>
            <div class="reward-line">
              Play reward ${points(machine.playReward)} per try · Buy reward ${points(machine.buyReward)} once
            </div>
            <div class="card-actions">
              <button class="play-card-button" type="button" data-action="play" data-id="${machine.id}">Play ${money(machine.discountedPlayPrice)}</button>
              <button class="buy-card-button" type="button" data-action="buy" data-id="${machine.id}">Buy ${money(machine.buyPrice)}</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  grid.querySelectorAll(".machine-card").forEach((card) => {
    const open = () => {
      location.hash = `machine/${card.dataset.id}`;
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter") open();
    });
  });

  grid.querySelectorAll("[data-action='play']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      location.hash = `machine/${button.dataset.id}`;
    });
  });

  grid.querySelectorAll("[data-action='buy']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const machine = machines.find((item) => item.id === button.dataset.id);
      renderCheckoutModal(machine);
    });
  });
}

function renderDetail(id) {
  const machine = machines.find((item) => item.id === id) || machines[0];
  state.clawX = 50;
  state.clawY = 13;
  state.camera = 1;
  state.playing = false;

  app.replaceChildren(detailTemplate.content.cloneNode(true));
  updateHeader();
  bindGlobalButtons();

  document.querySelector("#detail-status").textContent = machine.status === "available" ? "Ready to play" : "Queue active";
  document.querySelector("#detail-name").textContent = machine.name;
  document.querySelector("#detail-price").textContent = `Play ${money(machine.discountedPlayPrice)}`;

  document.querySelector("#detail-buy-inline").textContent = money(machine.buyPrice);
  document.querySelector("#detail-play-reward").textContent = `${points(machine.playReward)} / play`;
  document.querySelector("#detail-buy-reward").textContent = `${points(machine.buyReward)} / order`;
  document.querySelector("#detail-waiting").textContent = machine.waiting;
  document.querySelector("#detail-watching").textContent = machine.watching;
  document.querySelector("#detail-guarantee").textContent = guaranteeLabel(machine);
  const hero = document.querySelector("#detail-hero");
  hero.src = cameraImages.front;
  hero.alt = `${machine.name} claw machine view`;
  hero.onerror = () => {
    hero.onerror = null;
    hero.src = cameraImages.frontFallback;
  };
  updateGuaranteeProgress(machine);

  const row = document.querySelector("#preview-row");
  row.innerHTML = machines
    .filter((item) => item.category === machine.category)
    .slice(0, 5)
    .map(
      (item) => `
      <article class="preview-item">
        <img src="${item.image}" alt="${item.name}" />
        <strong>${item.name}</strong>
        <span>${guaranteeLabel(item)} · Play ${money(item.discountedPlayPrice)}</span>
      </article>
    `,
    )
    .join("");

  bindDetail(machine);
  updateClaw();
}

function bindDetail(machine) {
  const toast = document.querySelector("#play-toast");
  const playButton = document.querySelector("#play-button");
  const buyButton = document.querySelector("#buy-button");
  const dropButton = document.querySelector("#drop-button");
  const cancelButton = document.querySelector("#cancel-button");
  const controlPanel = document.querySelector(".control-panel");
  const livePanel = document.querySelector(".live-panel");
  
  cancelButton.addEventListener("click", () => {
  state.playing = false;

  controlPanel.classList.remove("is-playing");
  livePanel.classList.remove("is-playing");

  playButton.style.display = "block";

  toast.textContent = "Stopped playing";
});

  document.querySelectorAll("[data-move]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!state.playing) return;
      const move = button.dataset.move;
      if (move === "left") state.clawX = Math.max(18, state.clawX - 7);
      if (move === "right") state.clawX = Math.min(82, state.clawX + 7);
      if (move === "up") state.clawY = Math.max(10, state.clawY - 5);
      if (move === "down") state.clawY = Math.min(42, state.clawY + 5);
      toast.textContent = `Position ${Math.round(state.clawX)} / ${Math.round(state.clawY)}`;
      updateClaw();
    });
  });

  playButton.addEventListener("click", () => {
  state.playing = true;

  controlPanel.classList.add("is-playing");
  livePanel.classList.add("is-playing");

  playButton.style.display = "none";

  toast.textContent = "Controls unlocked. Aim the claw.";
});

  buyButton.addEventListener("click", () => {
    renderCheckoutModal(machine);
  });

  dropButton.addEventListener("click", () => {
  if (!state.playing) return;

  const result = spendCash(
    machine.discountedPlayPrice,
    machine.playReward
  );

  if (!result.ok) {
    toast.textContent = result.text;
    return;
  }

  state.plays[machine.id] = playCount(machine) + 1;

  updateGuaranteeProgress(machine);

  const claw = document.querySelector("#claw");

  claw.classList.add("dropping");

  toast.textContent =
    `-${money(machine.discountedPlayPrice)} • Dropping...`;

  window.setTimeout(() => {
    claw.classList.remove("dropping");

    const success = Math.abs(state.clawX - 50) < 9;

    if (success) {
      toast.textContent =
        `Nice catch! +${points(machine.playReward)}`;
    } else {
      toast.textContent =
        `Missed... +${points(machine.playReward)}`;
    }

    if (playCount(machine) >= machine.guaranteePlays) {
      addToCart(machine, "guarantee");

      state.plays[machine.id] = 0;

      updateGuaranteeProgress(machine);

      toast.textContent =
        `${guaranteeLabel(machine)} complete. Prize added to cart automatically.`;
    }
  }, 720);
});

  document.querySelectorAll("[data-camera]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!state.playing) return;
      state.camera = Number(button.dataset.camera);
      const hero = document.querySelector("#detail-hero");
      hero.onerror = () => {
        hero.onerror = null;
        hero.src = state.camera === 1 ? cameraImages.frontFallback : cameraImages.sideFallback;
      };
      hero.src = state.camera === 1 ? cameraImages.front : cameraImages.side;
      document.querySelector("#camera-label").textContent = `CAM 0${state.camera}`;
      document.querySelector("#camera-hud-label").textContent = state.camera === 1 ? "FRONT CAMERA" : "SIDE CAMERA";
      document.querySelector("#machine-viewport").classList.toggle("side-camera", state.camera === 2);
      document.querySelectorAll("[data-camera]").forEach((item) => item.classList.toggle("active", item === button));
      toast.textContent = state.camera === 1 ? "Front camera" : "Side camera";
    });
  });

  document.querySelectorAll("[data-share]").forEach((button) => {
    button.addEventListener("click", () => {
      const label = button.dataset.share;
      toast.textContent = `Share draft ready for ${label}: ${machine.name}`;
    });
  });
}

function updateGuaranteeProgress(machine) {
  const progress = document.querySelector("#guarantee-progress");
  if (!progress) return;
  progress.textContent = `${playCount(machine)} / ${machine.guaranteePlays} plays`;
}

function updateClaw() {
  const claw = document.querySelector("#claw");
  if (!claw) return;
  claw.style.setProperty("--x", `${state.clawX}%`);
  claw.style.setProperty("--y", `${state.clawY}%`);
}

function renderCheckoutModal(machine) {
  renderModal(`
    <div class="checkout-modal">
      <div class="modal-head">
        <div>
          <p class="eyebrow">Checkout demo</p>
          <h2>Buy ${machine.name}</h2>
        </div>
        <button class="modal-close" type="button" data-close-modal>Close</button>
      </div>
      <div class="checkout-grid">
        <div class="checkout-product">
          <img src="${machine.image}" alt="${machine.name}" />
          <div>
            <strong>${machine.name}</strong>
            <span>Buy now price ${money(machine.buyPrice)}</span>
            <span>Reward ${points(machine.buyReward)}</span>
          </div>
        </div>
        <div class="checkout-steps">
          <label>
            Shipping name
            <input value="Demo Player" />
          </label>
          <label>
            Delivery address
            <input value="Bangkok demo address" />
          </label>
          <label>
            Payment method
            <select>
              <option>Wallet cash</option>
              <option>QR PromptPay</option>
              <option>Credit card demo</option>
            </select>
          </label>
          <div class="checkout-total">
            <span>Total</span>
            <strong>${money(machine.buyPrice)}</strong>
          </div>
          <button class="checkout-confirm" type="button" data-confirm-buy="${machine.id}">Confirm purchase</button>
        </div>
      </div>
    </div>
  `);

  document.querySelector("[data-confirm-buy]")?.addEventListener("click", () => {
    const result = spendCash(machine.buyPrice, machine.buyReward);
    const message = document.querySelector(".modal-message");
    if (!result.ok) {
      message.textContent = result.text;
      return;
    }

    addToCart(machine, "buy");
    message.textContent = `${machine.name} added to cart. +${points(machine.buyReward)} reward points.`;
    document.querySelector("[data-confirm-buy]").disabled = true;
    document.querySelector("[data-confirm-buy]").textContent = "Purchased";
  });
}

function renderCartModal() {
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const items = state.cart.length
    ? state.cart
        .map(
          (item) => `
          <article class="cart-item">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <strong>${item.name}</strong>
              <span>${item.source === "guarantee" ? "Won by guarantee" : "Purchased"} · Qty ${item.qty}</span>
            </div>
            <b>${item.price ? money(item.price * item.qty) : "Prize"}</b>
          </article>
        `,
        )
        .join("")
    : '<div class="empty-cart">Cart is empty</div>';

  renderModal(`
    <div class="cart-modal">
      <div class="modal-head">
        <div>
          <p class="eyebrow">Cart</p>
          <h2>Prize cart</h2>
        </div>
        <button class="modal-close" type="button" data-close-modal>Close</button>
      </div>
      <div class="cart-list">${items}</div>
      <div class="checkout-total">
        <span>Paid items total</span>
        <strong>${money(total)}</strong>
      </div>
      <button class="checkout-confirm" type="button" data-close-modal>Continue shopping</button>
    </div>
  `);
}

function renderModal(content) {
  document.querySelector(".modal-layer")?.remove();
  const layer = document.createElement("div");
  layer.className = "modal-layer";
  layer.innerHTML = `
    <div class="modal-card">
      ${content}
      <p class="modal-message" aria-live="polite"></p>
    </div>
  `;
  document.body.append(layer);
  layer.addEventListener("click", (event) => {
    if (event.target === layer || event.target.matches("[data-close-modal]")) {
      layer.remove();
    }
  });
}

function route() {
  const hash = location.hash.replace("#", "");
  if (hash.startsWith("machine/")) {
    renderDetail(hash.split("/")[1]);
    return;
  }

  renderHome();
  if (hash && hash !== "home") {
    window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView();
    });
  }
}

updateHeader();
window.addEventListener("hashchange", route);
route();
