const DEFAULT_API_BASE = "http://localhost:8083";

async function getApiBase() {
  const stored = await chrome.storage.local.get(["apiBase"]);
  return stored.apiBase || DEFAULT_API_BASE;
}

async function apiRequest(path, options = {}) {
  const base = await getApiBase();
  const response = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === "object" ? payload.error : payload;
    throw new Error(message || "Request failed");
  }

  return payload;
}

function createContextMenu() {
  chrome.contextMenus.create({
    id: "learn-english-save-selection",
    title: "Save to Learn English",
    contexts: ["selection"]
  });
}

async function saveSelection(selectionText, tab) {
  const term = String(selectionText || "").trim();
  if (!term) {
    return { ok: false, error: "No selected text" };
  }

  let lookup = null;
  try {
    lookup = await apiRequest(`/api/lookup?term=${encodeURIComponent(term)}`);
  } catch (error) {
    lookup = null;
  }

  const payload = {
    term,
    sourceUrl: tab?.url || "",
    sourceTitle: tab?.title || "",
    context: term,
    pronunciation: lookup?.phonetic || "",
    audioUrl: lookup?.audioUrl || "",
    meaning: lookup?.shortDefinition || "",
    examples: lookup?.example ? [lookup.example] : []
  };

  const saved = await apiRequest("/api/vocab", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return { ok: true, item: saved };
}

chrome.runtime.onInstalled.addListener(() => {
  createContextMenu();
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "learn-english-save-selection") {
    return;
  }

  try {
    await saveSelection(info.selectionText, tab);
  } catch (error) {
    console.error("Failed to save selection", error);
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "quick-save-selection") {
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    return;
  }

  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() || ""
    });

    const selected = String(result || "").trim();
    if (!selected) {
      return;
    }

    await saveSelection(selected, tab);
  } catch (error) {
    console.error("Quick save failed", error);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message?.type) {
      case "LOOKUP_TERM": {
        const result = await apiRequest(`/api/lookup?term=${encodeURIComponent(message.term)}`);
        sendResponse({ ok: true, data: result });
        break;
      }
      case "SAVE_VOCAB": {
        const result = await apiRequest("/api/vocab", {
          method: "POST",
          body: JSON.stringify(message.payload || {})
        });
        sendResponse({ ok: true, data: result });
        break;
      }
      case "UPDATE_VOCAB": {
        const result = await apiRequest(`/api/vocab/${message.id}`, {
          method: "PUT",
          body: JSON.stringify(message.payload || {})
        });
        sendResponse({ ok: true, data: result });
        break;
      }
      case "DELETE_VOCAB": {
        const result = await apiRequest(`/api/vocab/${message.id}`, {
          method: "DELETE"
        });
        sendResponse({ ok: true, data: result });
        break;
      }
      case "LIST_VOCAB": {
        const query = new URLSearchParams(message.query || {}).toString();
        const result = await apiRequest(`/api/vocab${query ? `?${query}` : ""}`);
        sendResponse({ ok: true, data: result });
        break;
      }
      case "GET_DUE": {
        const result = await apiRequest("/api/review/due?limit=20");
        sendResponse({ ok: true, data: result });
        break;
      }
      case "REVIEW_ITEM": {
        const result = await apiRequest(`/api/review/${message.id}`, {
          method: "POST",
          body: JSON.stringify({ rating: message.rating })
        });
        sendResponse({ ok: true, data: result });
        break;
      }
      case "HEALTH_CHECK": {
        const result = await apiRequest("/health");
        sendResponse({ ok: true, data: result });
        break;
      }
      case "GET_SETTINGS": {
        const result = await apiRequest("/api/settings");
        sendResponse({ ok: true, data: result });
        break;
      }
      case "UPDATE_SETTINGS": {
        const result = await apiRequest("/api/settings", {
          method: "PUT",
          body: JSON.stringify(message.payload || {})
        });
        if (message.payload?.apiBase) {
          await chrome.storage.local.set({ apiBase: message.payload.apiBase });
        }
        sendResponse({ ok: true, data: result });
        break;
      }
      default:
        sendResponse({ ok: false, error: "Unsupported message type" });
    }
  })().catch((error) => {
    sendResponse({ ok: false, error: error.message || "Unknown error" });
  });

  return true;
});
