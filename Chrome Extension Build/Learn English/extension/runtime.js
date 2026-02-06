(function initExtensionRuntimeShim() {
  const browserApi = globalThis.browser;
  const chromeApi = globalThis.chrome;

  if (!browserApi) {
    globalThis.LE_BROWSER = chromeApi || null;
    return;
  }

  let lastErrorValue = null;

  function callWithOptionalCallback(promise, callback) {
    if (typeof callback !== "function") {
      return promise;
    }

    promise
      .then((result) => {
        lastErrorValue = null;
        callback(result);
      })
      .catch((error) => {
        lastErrorValue = { message: error?.message || String(error || "Unknown error") };
        callback(undefined);
      })
      .finally(() => {
        setTimeout(() => {
          lastErrorValue = null;
        }, 0);
      });

    return undefined;
  }

  function normalizeSendArgs(args) {
    if (args.length === 1) {
      return { message: args[0], options: undefined, callback: undefined };
    }

    if (args.length === 2 && typeof args[1] === "function") {
      return { message: args[0], options: undefined, callback: args[1] };
    }

    return {
      message: args[0],
      options: args[1],
      callback: typeof args[2] === "function" ? args[2] : undefined
    };
  }

  function wrapEvent(eventLike) {
    return eventLike || { addListener() {}, removeListener() {}, hasListener() { return false; } };
  }

  const contextMenusApi = browserApi.contextMenus || browserApi.menus;

  const shim = {
    runtime: {
      ...browserApi.runtime,
      get lastError() {
        return lastErrorValue;
      },
      sendMessage(...args) {
        const { message, options, callback } = normalizeSendArgs(args);
        const promise =
          options === undefined
            ? Promise.resolve(browserApi.runtime.sendMessage(message))
            : Promise.resolve(browserApi.runtime.sendMessage(message, options));
        return callWithOptionalCallback(promise, callback);
      },
      onMessage: wrapEvent(browserApi.runtime?.onMessage),
      onInstalled: wrapEvent(browserApi.runtime?.onInstalled)
    },
    storage: {
      local: {
        get(keys, callback) {
          const promise = Promise.resolve(browserApi.storage.local.get(keys));
          return callWithOptionalCallback(promise, callback);
        },
        set(items, callback) {
          const promise = Promise.resolve(browserApi.storage.local.set(items));
          return callWithOptionalCallback(promise, callback);
        }
      }
    },
    tabs: {
      query(queryInfo, callback) {
        const promise = Promise.resolve(browserApi.tabs.query(queryInfo));
        return callWithOptionalCallback(promise, callback);
      },
      sendMessage(tabId, message, options, callback) {
        const sendOptions = typeof options === "object" && options !== null ? options : undefined;
        const sendCallback = typeof options === "function" ? options : callback;
        const promise =
          sendOptions === undefined
            ? Promise.resolve(browserApi.tabs.sendMessage(tabId, message))
            : Promise.resolve(browserApi.tabs.sendMessage(tabId, message, sendOptions));
        return callWithOptionalCallback(promise, sendCallback);
      }
    },
    contextMenus: {
      create(createProperties, callback) {
        if (!contextMenusApi?.create) {
          if (typeof callback === "function") {
            callback();
          }
          return undefined;
        }
        const promise = Promise.resolve(contextMenusApi.create(createProperties));
        return callWithOptionalCallback(promise, callback);
      },
      onClicked: wrapEvent(contextMenusApi?.onClicked)
    },
    commands: {
      onCommand: wrapEvent(browserApi.commands?.onCommand)
    },
    scripting: browserApi.scripting
      ? {
          executeScript(injection, callback) {
            const promise = Promise.resolve(browserApi.scripting.executeScript(injection));
            return callWithOptionalCallback(promise, callback);
          }
        }
      : undefined
  };

  globalThis.LE_BROWSER = shim;
  globalThis.chrome = chromeApi || shim;
})();
