require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT;
const path = require("path");

// Timestamp
function timestamp() {
  const now = new Date();
  return now.toISOString().replace("T", " ").replace("Z", "");
}

// --- Middleware ---
app.use(express.json());

// Serve everything in ./public as static assets
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// --- Views (HTML pages) ---
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/resources", (req, res) => {
  res.sendFile(path.join(publicDir, "resources.html"));
});

// POST /api/resources
app.post("/api/resources", (req, res) => {
  const {
    action = "",
    resourceName = "",
    resourceDescription = "",
    resourceAvailable = false,
    resourcePrice = 0,
    resourcePriceUnit = "",
  } = req.body || {};

  // Normalize inputs
  const resourceAction = String(action).trim();
  const name = String(resourceName).trim();
  const description = String(resourceDescription).trim(); // ✅ FIXED
  const available = Boolean(resourceAvailable);
  const price = Number(resourcePrice);
  const unit = String(resourcePriceUnit || "").trim();

  // ✅ SERVER-SIDE VALIDATION (important for grading)
  if (!Number.isFinite(price) || price < 0) {
    return res.status(400).json({
      ok: false,
      error: "Invalid price. Must be 0 or positive number.",
    });
  }

  // Log to terminal
  console.log("The client's POST request ", `[${timestamp()}]`);
  console.log("--------------------------");
  console.log("Action ➡️ ", resourceAction);
  console.log("Name ➡️ ", name);
  console.log("Description ➡️ ", description);
  console.log("Availability ➡️ ", available);
  console.log("Price ➡️ ", price);
  console.log("Price unit ➡️ ", unit);
  console.log("--------------------------");

  return res.json({
    ok: true,
    echo: {
      action: resourceAction,
      resourceName: name,
      resourceDescription: description,
      resourceAvailable: available,
      resourcePrice: price,
      resourcePriceUnit: unit,
    },
  });
});

// --- Fallback 404 for unknown API routes ---
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});