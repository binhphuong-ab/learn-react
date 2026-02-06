const healthEl = document.getElementById("health");
const dueEl = document.getElementById("due-count");
const listEl = document.getElementById("recent-list");
const statusEl = document.getElementById("quick-add-status");
const form = document.getElementById("quick-add-form");
const searchInput = document.getElementById("search");

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (!response?.ok) {
        reject(new Error(response?.error || "Request failed"));
        return;
      }

      resolve(response.data);
    });
  });
}

function renderList(items) {
  listEl.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "No words yet";
    listEl.appendChild(li);
    return;
  }

  for (const item of items) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="item-term">${item.term}</div>
      <div class="item-meaning">${item.meaning || "No meaning"}</div>
      <div class="item-source">${item.sourceTitle || "No source title"}</div>
    `;
    listEl.appendChild(li);
  }
}

async function getActiveTabSource() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  return {
    sourceTitle: String(tab?.title || "").trim(),
    sourceUrl: String(tab?.url || "").trim()
  };
}

async function loadHealth() {
  try {
    const result = await sendMessage({ type: "HEALTH_CHECK" });
    healthEl.textContent = result.dbReady ? "API connected" : "API up, DB not ready";
  } catch (error) {
    healthEl.textContent = `API offline: ${error.message}`;
  }
}

async function loadDue() {
  try {
    const result = await sendMessage({ type: "GET_DUE" });
    dueEl.textContent = `Due words: ${result.total}`;
  } catch (error) {
    dueEl.textContent = `Due words: unavailable (${error.message})`;
  }
}

async function loadRecent(query = "") {
  try {
    const result = await sendMessage({
      type: "LIST_VOCAB",
      query: {
        limit: 15,
        q: query
      }
    });
    renderList(result.items || []);
  } catch (error) {
    renderList([]);
    statusEl.textContent = error.message;
    statusEl.style.color = "#7f1d1d";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Saving...";
  statusEl.style.color = "#111827";

  const formData = new FormData(form);
  const source = await getActiveTabSource();
  const payload = {
    term: String(formData.get("term") || "").trim(),
    meaning: String(formData.get("meaning") || "").trim(),
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    examples: String(formData.get("example") || "").trim() ? [String(formData.get("example") || "").trim()] : [],
    sourceTitle: source.sourceTitle,
    sourceUrl: source.sourceUrl
  };

  try {
    await sendMessage({ type: "SAVE_VOCAB", payload });
    statusEl.textContent = "Saved";
    statusEl.style.color = "#14532d";
    form.reset();
    loadRecent(searchInput.value);
    loadDue();
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.style.color = "#7f1d1d";
  }
});

searchInput.addEventListener("input", () => {
  loadRecent(searchInput.value.trim());
});

loadHealth();
loadDue();
loadRecent();
