// ===============================
// 1) DOM references
// ===============================
const actions = document.getElementById("resourceActions");
const resourceNameCnt = document.getElementById("resourceNameCnt");
const resourceDescriptionCnt = document.getElementById("resourceDescriptionCnt");
// Example roles
const role = "admin"; // "reserver" | "admin"

// Will hold references to buttons
let createButton = null;
let updateButton = null;
let deleteButton = null;

// Resource validation status
let resourceNameValid = false;
let resourceDescriptionValid = false;
let resourcePriceValid = true; // NEW (for negative check)

// ===============================
// 2) Button creation helpers
// ===============================

const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";

const BUTTON_ENABLED_CLASSES =
  "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

const BUTTON_DISABLED_CLASSES =
  "cursor-not-allowed opacity-50";

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.name = "action";
  if (value) btn.value = value;

  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();

  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;

  btn.disabled = !enabled;

  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);

  if (!enabled) {
    btn.classList.remove("hover:bg-brand-dark/80");
  } else {
    if (
      btn.value === "create" ||
      btn.value === "update" ||
      btn.value === "delete" ||
      btn.textContent === "Create"
    ) {
      btn.classList.add("hover:bg-brand-dark/80");
    }
  }
}

function renderActionButtons(currentRole) {
  if (currentRole === "reserver") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  if (currentRole === "admin") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });

    updateButton = addButton({
      label: "Update",
      value: "update",
      classes: BUTTON_ENABLED_CLASSES,
    });

    deleteButton = addButton({
      label: "Delete",
      value: "delete",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  setButtonEnabled(createButton, false);
  setButtonEnabled(updateButton, false);
  setButtonEnabled(deleteButton, false);
}

// ===============================
// 3) Input creation + validation
// ===============================
function createResourceNameInput(container) {
  const input = document.createElement("input");

  input.id = "resourceName";
  input.name = "resourceName";
  input.type = "text";
  input.placeholder = "e.g., Meeting Room A";

  input.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white
    px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
    transition-all duration-200 ease-out
  `;

  container.appendChild(input);
  return input;
}

function isResourceNameValid(value) {
  const trimmed = value.trim();
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;

  const lengthValid = trimmed.length >= 5 && trimmed.length <= 30;
  const charactersValid = allowedPattern.test(trimmed);

  return lengthValid && charactersValid;
}

function isResourceDescriptionValid(value) {
  const trimmed = value.trim();
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ><!\?\-\+\/\\]+$/;

  const lengthValid = trimmed.length >= 10 && trimmed.length <= 50;
  const charactersValid = allowedPattern.test(trimmed);

  return lengthValid && charactersValid;
}

function isPriceValid(value) {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0;
}

function createResourceDescriptionArea(container) {
  const textarea = document.createElement("textarea");

  textarea.id = "resourceDescription";
  textarea.name = "resourceDescription";
  textarea.rows = 5;
  textarea.placeholder =
    "Describe location, capacity, included equipment, or any usage notes…";

  textarea.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all duration-200 ease-out
  `;

  container.appendChild(textarea);
  return textarea;
}

function setInputVisualState(input, state) {
  input.classList.remove(
    "border-green-500",
    "bg-green-100",
    "focus:ring-green-500/30",
    "border-red-500",
    "bg-red-100",
    "focus:ring-red-500/30",
    "focus:border-brand-blue",
    "focus:ring-brand-blue/30"
  );

  input.classList.add("focus:ring-2");

  if (state === "valid") {
    input.classList.add("border-green-500", "bg-green-100", "focus:ring-green-500/30");
  } else if (state === "invalid") {
    input.classList.add("border-red-500", "bg-red-100", "focus:ring-red-500/30");
  }
}

function updateAllButtons() {
  const priceValue = document.getElementById("resourcePrice")?.value ?? "";
  resourcePriceValid = isPriceValid(priceValue);

  const formValid =
    resourceNameValid && resourceDescriptionValid && resourcePriceValid;

  setButtonEnabled(createButton, formValid);
  setButtonEnabled(updateButton, formValid);
  setButtonEnabled(deleteButton, formValid);
}

function attachResourceNameValidation(input) {
  const update = () => {
    const raw = input.value;

    if (raw.trim() === "") {
      setInputVisualState(input, "neutral");
      resourceNameValid = false;
      updateAllButtons();
      return;
    }

    resourceNameValid = isResourceNameValid(raw);
    setInputVisualState(input, resourceNameValid ? "valid" : "invalid");
    updateAllButtons();
  };

  input.addEventListener("input", update);
  update();
}

function attachResourceDescriptionValidation(input) {
  const update = () => {
    const raw = input.value;

    if (raw.trim() === "") {
      setInputVisualState(input, "neutral");
      resourceDescriptionValid = false;
      updateAllButtons();
      return;
    }

    resourceDescriptionValid = isResourceDescriptionValid(raw);
    setInputVisualState(input, resourceDescriptionValid ? "valid" : "invalid");
    updateAllButtons();
  };

  input.addEventListener("input", update);
  update();
}

// ===============================
// 4) Bootstrapping
// ===============================
renderActionButtons(role);

const resourceNameInput = createResourceNameInput(resourceNameCnt);
attachResourceNameValidation(resourceNameInput);

const resourceDescriptionArea = createResourceDescriptionArea(resourceDescriptionCnt);
attachResourceDescriptionValidation(resourceDescriptionArea);

const priceInput = document.getElementById("resourcePrice");
if (priceInput) {
  priceInput.addEventListener("input", updateAllButtons);
}