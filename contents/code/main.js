const GROUPS = {
  chrome: "browser",
  firefox: "browser",
  zen: "browser",
  "brave-browser": "browser",
  "org.kde.dolphin": "explorer",
  "org.kde.konsole": "terminal",
  "org.kde.plasma-systemmonitor": "monitor",
  "com.microsoft.vscode": "code",
  idea: "code",
  kate: "code",
  pycharm: "code",
  neovim: "code",
};

function getGroup(window) {
  if (!window || !window.normalWindow) return null;
  const res = (window.resourceClass || "").toLowerCase();
  return GROUPS[res] || "other";
}

function getGroupWindows(groupName) {
  const allWindows = workspace.windowList();
  const result = [];
  for (let i = 0; i < allWindows.length; i++) {
    const w = allWindows[i];
    if (w.normalWindow && getGroup(w) === groupName) {
      result.push(w);
    }
  }
  return result;
}

function activateLastGroupWindow(groupName) {
  const windows = getGroupWindows(groupName);
  if (windows.length === 0) return;
  const stack = workspace.stackingOrder;
  for (let i = stack.length - 1; i >= 0; i--) {
    const w = stack[i];
    if (w.normalWindow && getGroup(w) === groupName) {
      workspace.activeWindow = w;
      return;
    }
  }
}

function activateGroupWindowByIndex(groupName, index) {
  const windows = getGroupWindows(groupName);
  if (index >= 0 && index < windows.length) {
    workspace.activeWindow = windows[index];
  }
}

function getCurrentGroup() {
  return getGroup(workspace.activeWindow);
}

registerShortcut(
  "GroupSwitch: Browser",
  "Group Switcher: Focus Browser",
  "Meta+W",
  () => activateLastGroupWindow("browser"),
);

registerShortcut(
  "GroupSwitch: Code",
  "Group Switcher: Focus Code",
  "Meta+E",
  () => activateLastGroupWindow("code"),
);

registerShortcut(
  "GroupSwitch: Explorer",
  "Group Switcher: Focus Explorer",
  "Meta+D",
  () => activateLastGroupWindow("explorer"),
);

registerShortcut(
  "GroupSwitch: Terminal",
  "Group Switcher: Focus Terminal",
  "Meta+Q",
  () => activateLastGroupWindow("terminal"),
);

registerShortcut(
  "GroupSwitch: Monitor",
  "Group Switcher: Focus Monitor",
  "Meta+S",
  () => activateLastGroupWindow("monitor"),
);

registerShortcut(
  "GroupSwitch: Other",
  "Group Switcher: Focus Other",
  "Meta+Tab",
  () => activateLastGroupWindow("other"),
);

[1, 2, 3, 4, 5].forEach((num) => {
  registerShortcut(
    "GroupSwitch: Window " + num,
    "Group Switcher: Activate window #" + num,
    "Meta+" + num,
    () => {
      const currentGroup = getCurrentGroup();
      if (currentGroup) {
        activateGroupWindowByIndex(currentGroup, num - 1);
      }
    },
  );
});
