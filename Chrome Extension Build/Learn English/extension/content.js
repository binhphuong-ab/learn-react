let iconEl = null;
let tooltipEl = null;
let currentSelection = null;
let outsideClickBound = false;
let activeAudio = null;
let speakingUtterance = null;

function removeIcon() {
  if (iconEl) {
    iconEl.remove();
    iconEl = null;
  }
}

function removeTooltip() {
  if (tooltipEl) {
    tooltipEl.remove();
    tooltipEl = null;
  }
}

function clearUi() {
  stopAudioPlayback();
  removeIcon();
  removeTooltip();
}

function stopAudioPlayback() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = "";
    activeAudio = null;
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    speakingUtterance = null;
  }
}

function isEnglishVoice(voice) {
  return String(voice?.lang || "").toLowerCase().startsWith("en");
}

function pickPreferredVoice(voices = []) {
  const byName = (text) => voices.find((voice) => String(voice.name || "").toLowerCase() === text);
  const byIncludes = (text) =>
    voices.find((voice) => String(voice.name || "").toLowerCase().includes(text) && isEnglishVoice(voice));

  return (
    byName("google us english") ||
    byName("google uk english female") ||
    byIncludes("google us english") ||
    byIncludes("google uk english") ||
    voices.find((voice) => isEnglishVoice(voice) && String(voice.lang || "").toLowerCase() === "en-us") ||
    voices.find((voice) => isEnglishVoice(voice)) ||
    voices[0] ||
    null
  );
}

function loadVoice(timeoutMs = 1200) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve(null);
      return;
    }

    const immediate = window.speechSynthesis.getVoices();
    if (immediate.length > 0) {
      resolve(pickPreferredVoice(immediate));
      return;
    }

    let settled = false;
    const settle = (voice) => {
      if (settled) {
        return;
      }
      settled = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      clearTimeout(timer);
      resolve(voice);
    };

    const onVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      settle(pickPreferredVoice(voices));
    };

    const timer = setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      settle(pickPreferredVoice(voices));
    }, timeoutMs);

    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
  });
}

async function speakWithWebSpeech(text) {
  if (!window.speechSynthesis) {
    throw new Error("Speech synthesis not supported");
  }

  stopAudioPlayback();

  const utteranceText = String(text || "").trim();
  if (!utteranceText) {
    throw new Error("No text to pronounce");
  }

  const voice = await loadVoice();
  const utterance = new SpeechSynthesisUtterance(utteranceText);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || "en-US";
  } else {
    utterance.lang = "en-US";
  }
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  speakingUtterance = utterance;

  await new Promise((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("Web Speech playback failed"));
    window.speechSynthesis.speak(utterance);
  });
}

async function playDictionaryAudio(audioUrl) {
  const src = String(audioUrl || "").trim();
  if (!src) {
    throw new Error("No dictionary audio URL");
  }

  stopAudioPlayback();

  await new Promise((resolve, reject) => {
    const audio = new Audio(src);
    activeAudio = audio;
    audio.onended = () => {
      activeAudio = null;
      resolve();
    };
    audio.onerror = () => {
      activeAudio = null;
      reject(new Error("Dictionary audio failed"));
    };
    audio
      .play()
      .then(() => resolve())
      .catch(() => {
        activeAudio = null;
        reject(new Error("Dictionary audio failed"));
      });
  });
}

async function playPronunciation(term, lookup) {
  const word = String(term || "").trim();
  if (!word) {
    updateStatus("No word selected for pronunciation", true);
    return;
  }

  updateStatus("Playing pronunciation...");

  if (lookup?.audioUrl) {
    try {
      await playDictionaryAudio(lookup.audioUrl);
      updateStatus("Playing dictionary audio");
      return;
    } catch (_) {
      updateStatus("Dictionary audio failed, switching to built-in voice");
    }
  }

  try {
    await speakWithWebSpeech(word);
    updateStatus("Playing built-in voice");
  } catch (_) {
    updateStatus("Audio playback failed", true);
  }
}

function buildContext(range, term) {
  const container = range.startContainer?.textContent || "";
  const text = container.replace(/\s+/g, " ").trim();
  if (!text) {
    return term;
  }

  const normalizedTerm = term.trim();
  const idx = text.toLowerCase().indexOf(normalizedTerm.toLowerCase());
  if (idx < 0) {
    return text.slice(0, 180);
  }

  const start = Math.max(0, idx - 70);
  const end = Math.min(text.length, idx + normalizedTerm.length + 70);
  return text.slice(start, end);
}

function getSelectionInfo() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const text = selection.toString().trim();
  if (!text || text.length > 80) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (!rect || (!rect.width && !rect.height)) {
    return null;
  }

  return {
    term: text,
    rect,
    context: buildContext(range, text),
    sourceUrl: window.location.href,
    sourceTitle: document.title
  };
}

function positionWithinViewport(left, top, width, height) {
  const margin = 8;
  const maxLeft = window.innerWidth - width - margin;
  const maxTop = window.innerHeight - height - margin;
  return {
    left: Math.max(margin, Math.min(left, maxLeft)),
    top: Math.max(margin, Math.min(top, maxTop))
  };
}

function bindOutsideHandlers() {
  if (outsideClickBound) {
    return;
  }

  document.addEventListener("mousedown", onDocumentMouseDown, true);
  document.addEventListener("keydown", onDocumentKeyDown, true);
  outsideClickBound = true;
}

function unbindOutsideHandlers() {
  if (!outsideClickBound) {
    return;
  }

  document.removeEventListener("mousedown", onDocumentMouseDown, true);
  document.removeEventListener("keydown", onDocumentKeyDown, true);
  outsideClickBound = false;
}

function onDocumentMouseDown(event) {
  if (tooltipEl?.contains(event.target) || iconEl?.contains(event.target)) {
    return;
  }
  clearUi();
  unbindOutsideHandlers();
}

function onDocumentKeyDown(event) {
  if (event.key === "Escape") {
    clearUi();
    unbindOutsideHandlers();
  }
}

function createTooltip(selection, anchorRect) {
  removeTooltip();

  tooltipEl = document.createElement("div");
  tooltipEl.id = "learn-english-tooltip";
  tooltipEl.innerHTML = `
    <div class="le-header">
      <h4 class="le-term">${selection.term}</h4>
      <p class="le-phonetic">Loading...</p>
    </div>
    <div class="le-body">
      <p class="le-definition">Fetching definition...</p>
      <p class="le-example"></p>
      <p class="le-synonyms"></p>
      <div class="le-actions"></div>
      <p class="le-status"></p>
    </div>
  `;

  document.body.appendChild(tooltipEl);

  const desiredLeft = anchorRect.left;
  const desiredTop = anchorRect.bottom + 10;
  const pos = positionWithinViewport(desiredLeft, desiredTop, 300, tooltipEl.offsetHeight || 210);
  tooltipEl.style.left = `${pos.left}px`;
  tooltipEl.style.top = `${pos.top}px`;

  bindOutsideHandlers();
  loadDefinition(selection);
}

function updateStatus(message, isError = false) {
  if (!tooltipEl) {
    return;
  }
  const status = tooltipEl.querySelector(".le-status");
  if (!status) {
    return;
  }
  status.textContent = message;
  status.style.color = isError ? "#991b1b" : "#14532d";
}

function renderLookup(selection, lookup) {
  if (!tooltipEl) {
    return;
  }

  const phonetic = tooltipEl.querySelector(".le-phonetic");
  const definition = tooltipEl.querySelector(".le-definition");
  const example = tooltipEl.querySelector(".le-example");
  const synonyms = tooltipEl.querySelector(".le-synonyms");
  const actions = tooltipEl.querySelector(".le-actions");
  const status = tooltipEl.querySelector(".le-status");

  const shortDefinition = lookup.shortDefinition || lookup.meanings?.[0]?.definition || "";
  const examples = Array.isArray(lookup.examples) ? lookup.examples.filter(Boolean) : [];
  const exampleText = lookup.example || examples[0] || "";
  const synonymList = Array.isArray(lookup.synonyms) ? lookup.synonyms.filter(Boolean).slice(0, 5) : [];

  phonetic.textContent = lookup.phonetic || "Pronunciation unavailable";
  definition.textContent = shortDefinition || "No definition found";
  example.textContent = exampleText ? `Example: ${exampleText}` : "";
  synonyms.textContent = synonymList.length ? `Synonyms: ${synonymList.join(", ")}` : "";
  if (status) {
    status.textContent = lookup.matchedTerm ? `Using base form: ${lookup.matchedTerm}` : "";
    status.style.color = "#14532d";
  }

  actions.innerHTML = "";

  const saveButton = document.createElement("button");
  saveButton.className = "le-save";
  saveButton.textContent = "Save to Library";
  saveButton.addEventListener("click", () => saveToLibrary(selection, lookup));
  actions.appendChild(saveButton);

  const audioButton = document.createElement("button");
  audioButton.className = "le-audio";
  audioButton.textContent = "Play Audio";
  audioButton.addEventListener("click", () => {
    playPronunciation(selection.term, lookup);
  });
  actions.appendChild(audioButton);
}

function renderLookupError(selection, message) {
  if (!tooltipEl) {
    return;
  }

  const phonetic = tooltipEl.querySelector(".le-phonetic");
  const definition = tooltipEl.querySelector(".le-definition");
  const example = tooltipEl.querySelector(".le-example");
  const synonyms = tooltipEl.querySelector(".le-synonyms");
  const actions = tooltipEl.querySelector(".le-actions");

  phonetic.textContent = "";
  definition.textContent = message || "Dictionary unavailable";
  example.textContent = "";
  synonyms.textContent = "";

  actions.innerHTML = "";
  const manualButton = document.createElement("button");
  manualButton.className = "le-manual";
  manualButton.textContent = "Add manually";
  manualButton.addEventListener("click", () => manualSave(selection));
  actions.appendChild(manualButton);
}

function loadDefinition(selection) {
  chrome.runtime.sendMessage(
    {
      type: "LOOKUP_TERM",
      term: selection.term
    },
    (response) => {
      if (chrome.runtime.lastError) {
        renderLookupError(selection, chrome.runtime.lastError.message);
        return;
      }

      if (!response?.ok) {
        renderLookupError(selection, response?.error || "Failed to load definition");
        return;
      }

      renderLookup(selection, response.data);
    }
  );
}

function saveToLibrary(selection, lookup) {
  const exampleFromLookup = lookup.example || (Array.isArray(lookup.examples) ? lookup.examples[0] : "") || "";
  const payload = {
    term: selection.term,
    pronunciation: lookup.phonetic || "",
    audioUrl: lookup.audioUrl || "",
    meaning: lookup.shortDefinition || "",
    examples: exampleFromLookup ? [exampleFromLookup] : [],
    sourceUrl: selection.sourceUrl,
    sourceTitle: selection.sourceTitle,
    context: selection.context,
    tags: ["inline"]
  };

  chrome.runtime.sendMessage({ type: "SAVE_VOCAB", payload }, (response) => {
    if (chrome.runtime.lastError) {
      updateStatus(chrome.runtime.lastError.message, true);
      return;
    }

    if (!response?.ok) {
      updateStatus(response?.error || "Save failed", true);
      return;
    }

    updateStatus("Saved");
  });
}

function manualSave(selection) {
  const meaning = window.prompt(`Meaning for "${selection.term}"`);
  if (meaning === null) {
    return;
  }

  const example = window.prompt("Example sentence (optional)") || "";

  const payload = {
    term: selection.term,
    meaning,
    examples: example ? [example] : [],
    sourceUrl: selection.sourceUrl,
    sourceTitle: selection.sourceTitle,
    context: selection.context,
    tags: ["manual"]
  };

  chrome.runtime.sendMessage({ type: "SAVE_VOCAB", payload }, (response) => {
    if (chrome.runtime.lastError) {
      updateStatus(chrome.runtime.lastError.message, true);
      return;
    }

    if (!response?.ok) {
      updateStatus(response?.error || "Save failed", true);
      return;
    }

    updateStatus("Saved manually");
  });
}

function createFloatingIcon(selection) {
  removeIcon();

  iconEl = document.createElement("button");
  iconEl.id = "learn-english-floating-icon";
  iconEl.type = "button";
  iconEl.textContent = "A";

  const pos = positionWithinViewport(selection.rect.right + 6, selection.rect.top - 4, 28, 28);
  iconEl.style.left = `${pos.left}px`;
  iconEl.style.top = `${pos.top}px`;

  iconEl.addEventListener("mousedown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  iconEl.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    createTooltip(selection, selection.rect);
  });

  document.body.appendChild(iconEl);
}

function onSelectionChange() {
  const info = getSelectionInfo();
  if (!info) {
    return;
  }

  currentSelection = info;
  createFloatingIcon(info);
}

document.addEventListener("mouseup", () => {
  setTimeout(onSelectionChange, 10);
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Shift" || event.key.startsWith("Arrow")) {
    setTimeout(onSelectionChange, 10);
  }
});

window.addEventListener("scroll", () => {
  if (!currentSelection || !iconEl) {
    return;
  }

  const pos = positionWithinViewport(currentSelection.rect.right + 6, currentSelection.rect.top - 4, 28, 28);
  iconEl.style.left = `${pos.left}px`;
  iconEl.style.top = `${pos.top}px`;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "GET_SELECTION_TEXT") {
    return undefined;
  }

  sendResponse({ text: window.getSelection()?.toString() || "" });
  return undefined;
});
