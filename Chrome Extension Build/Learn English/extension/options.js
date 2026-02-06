const form = document.getElementById("settings-form");
const statusEl = document.getElementById("settings-status");
const bodyEl = document.getElementById("library-body");
const searchInput = document.getElementById("search");
const refreshButton = document.getElementById("refresh");
const itemById = new Map();

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

function renderRows(items) {
  bodyEl.innerHTML = "";
  itemById.clear();

  for (const item of items) {
    itemById.set(item._id, item);
    const tr = document.createElement("tr");
    const sourceLabel = item.sourceTitle || "No source";
    const sourceCell = item.sourceUrl
      ? `<a href="${item.sourceUrl}" target="_blank" rel="noreferrer">${sourceLabel}</a>`
      : sourceLabel;
    tr.innerHTML = `
      <td>${item.term}</td>
      <td>${item.meaning || ""}</td>
      <td>${sourceCell}</td>
      <td>${(item.tags || []).join(", ")}</td>
      <td>${item.masteryLevel || 0}</td>
      <td>
        <button class="action-btn" data-action="edit" data-id="${item._id}">Edit</button>
        <button class="action-btn" data-action="delete" data-id="${item._id}">Delete</button>
      </td>
    `;
    bodyEl.appendChild(tr);
  }
}

async function loadSettings() {
  try {
    const [settings, localSettings] = await Promise.all([
      sendMessage({ type: "GET_SETTINGS" }),
      chrome.storage.local.get(["apiBase"])
    ]);

    document.getElementById("apiBase").value = localSettings.apiBase || "http://localhost:8083";
    document.getElementById("dailyReviewLimit").value = settings.dailyReviewLimit || 20;
    document.getElementById("defaultIntervals").value = (settings.defaultIntervals || [1, 3, 7]).join(",");
    document.getElementById("quickSave").value = settings.keyboardShortcuts?.quickSave || "Ctrl+Shift+S";
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.style.color = "#7f1d1d";
  }
}

async function loadLibrary(query = "") {
  try {
    const result = await sendMessage({
      type: "LIST_VOCAB",
      query: { limit: 100, q: query }
    });
    renderRows(result.items || []);
  } catch (error) {
    bodyEl.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
  }
}

function toUpdatePayload(item, overrides = {}) {
  return {
    term: item.term || "",
    pronunciation: item.pronunciation || "",
    audioUrl: item.audioUrl || "",
    translation: item.translation || "",
    meaning: item.meaning || "",
    examples: item.examples || [],
    tags: item.tags || [],
    difficulty: item.difficulty || null,
    masteryLevel: item.masteryLevel || 0,
    sourceUrl: item.sourceUrl || "",
    sourceTitle: item.sourceTitle || "",
    context: item.context || "",
    review: item.review || {},
    ...overrides
  };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    apiBase: String(document.getElementById("apiBase").value || "").trim(),
    dailyReviewLimit: Number(document.getElementById("dailyReviewLimit").value || 20),
    defaultIntervals: String(document.getElementById("defaultIntervals").value || "")
      .split(",")
      .map((x) => Number(x.trim()))
      .filter((x) => Number.isFinite(x) && x > 0),
    keyboardShortcuts: {
      quickSave: String(document.getElementById("quickSave").value || "Ctrl+Shift+S").trim()
    }
  };

  try {
    await sendMessage({ type: "UPDATE_SETTINGS", payload });
    statusEl.textContent = "Settings saved";
    statusEl.style.color = "#14532d";
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.style.color = "#7f1d1d";
  }
});

bodyEl.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "delete") {
    if (!window.confirm("Delete this word?")) {
      return;
    }
    try {
      await sendMessage({ type: "DELETE_VOCAB", id });
      loadLibrary(searchInput.value.trim());
    } catch (error) {
      alert(error.message);
    }
  }

  if (action === "edit") {
    const item = itemById.get(id);
    if (!item) {
      return;
    }

    const term = window.prompt("Term", item.term || "");
    if (term === null) {
      return;
    }
    const meaning = window.prompt("Meaning", item.meaning || "") || "";

    try {
      await sendMessage({
        type: "UPDATE_VOCAB",
        id,
        payload: toUpdatePayload(item, { term, meaning })
      });
      loadLibrary(searchInput.value.trim());
    } catch (error) {
      alert(error.message);
    }
  }
});

searchInput.addEventListener("input", () => {
  loadLibrary(searchInput.value.trim());
});

refreshButton.addEventListener("click", () => {
  loadLibrary(searchInput.value.trim());
});

loadSettings();
loadLibrary();
