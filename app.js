const defaultColors = [
  { name: "绿色", value: "#16770c" },
  { name: "红色", value: "#9c221d" },
  { name: "橙色", value: "#a84f2f" }
];

const COLOR_STORAGE_KEY = "rich-text-tool-colors";
const DEFAULT_COLOR_SETTINGS_KEY = "rich-text-tool-default-color";
const PREVIEW_SETTINGS_KEY = "rich-text-tool-preview-settings";
const TEXT_CONTENT_STORAGE_KEY = "rich-text-tool-text-content";
const ACTIVE_TOOL_STORAGE_KEY = "rich-text-tool-active-tool";

const starterTexts = [
  "不需要的装备可以回收为金币。",
  "品质越高，回收获得的金币越多。",
  "装备回收为【不可逆操作（红色）】，回收后将无法回退，请谨慎操作。",
  "当背包满时无法继续拾取装备，请【及时清理（绿色）】回收背包中不需要的装备。",
  "回收装备还有概率获得【共鸣石（绿色）】，可以用于提升装备强化共鸣等级。"
];

function loadStoredColors() {
  try {
    const rawValue = window.localStorage.getItem(COLOR_STORAGE_KEY);
    if (!rawValue) {
      return structuredClone(defaultColors);
    }

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return structuredClone(defaultColors);
    }

    const normalizedColors = parsedValue
      .filter((item) => item && typeof item.name === "string" && typeof item.value === "string")
      .map((item) => ({
        name: item.name,
        value: item.value
      }));

    return normalizedColors.length > 0 ? normalizedColors : structuredClone(defaultColors);
  } catch (error) {
    return structuredClone(defaultColors);
  }
}

function persistColors() {
  window.localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(state.colors));
}

function loadDefaultColorSettings() {
  try {
    const rawValue = window.localStorage.getItem(DEFAULT_COLOR_SETTINGS_KEY);
    if (!rawValue) {
      return {
        enabled: false,
        value: "#ffffff"
      };
    }

    const parsedValue = JSON.parse(rawValue);
    return {
      enabled: Boolean(parsedValue.enabled),
      value: typeof parsedValue.value === "string" && parsedValue.value.trim()
        ? parsedValue.value
        : "#ffffff"
    };
  } catch (error) {
    return {
      enabled: false,
      value: "#ffffff"
    };
  }
}

function persistDefaultColorSettings() {
  window.localStorage.setItem(
    DEFAULT_COLOR_SETTINGS_KEY,
    JSON.stringify(state.defaultTextColor)
  );
}

function loadPreviewSettings() {
  const defaultPreviewBackground = "#fffaf0";

  try {
    const rawValue = window.localStorage.getItem(PREVIEW_SETTINGS_KEY);
    if (!rawValue) {
      return {
        backgroundColor: defaultPreviewBackground
      };
    }

    const parsedValue = JSON.parse(rawValue);
    return {
      backgroundColor: typeof parsedValue.backgroundColor === "string" && parsedValue.backgroundColor.trim()
        ? parsedValue.backgroundColor
        : defaultPreviewBackground
    };
  } catch (error) {
    return {
      backgroundColor: defaultPreviewBackground
    };
  }
}

function persistPreviewSettings() {
  window.localStorage.setItem(
    PREVIEW_SETTINGS_KEY,
    JSON.stringify(state.previewSettings)
  );
}

function persistAllConfig() {
  persistColors();
  persistDefaultColorSettings();
  persistPreviewSettings();
}

function getDefaultRows() {
  return starterTexts.map((text, index) => ({
    id: index + 1,
    content: text
  }));
}

function loadTextContent() {
  try {
    const rawValue = window.localStorage.getItem(TEXT_CONTENT_STORAGE_KEY);
    if (!rawValue) {
      return {
        rows: getDefaultRows(),
        bulkText: "",
        richEditorHtml: "",
        reverseText: "",
        numberText: "",
        numberColor: "#a84f2f",
        effectRules: []
      };
    }

    const parsedValue = JSON.parse(rawValue);
    const rows = Array.isArray(parsedValue.rows)
      ? parsedValue.rows
        .filter((row) => row && typeof row.content === "string")
        .map((row, index) => ({
          id: index + 1,
          content: row.content
        }))
      : getDefaultRows();

    return {
      rows: rows.length > 0 ? rows : getDefaultRows(),
      bulkText: typeof parsedValue.bulkText === "string" ? parsedValue.bulkText : "",
      richEditorHtml: typeof parsedValue.richEditorHtml === "string" ? parsedValue.richEditorHtml : "",
      reverseText: typeof parsedValue.reverseText === "string" ? parsedValue.reverseText : "",
      numberText: typeof parsedValue.numberText === "string" ? parsedValue.numberText : "",
      numberColor: typeof parsedValue.numberColor === "string" && parsedValue.numberColor.trim()
        ? parsedValue.numberColor
        : "#a84f2f",
      effectRules: Array.isArray(parsedValue.effectRules)
        ? parsedValue.effectRules
          .filter((item) => item && typeof item.keyword === "string" && typeof item.color === "string")
          .map((item) => ({
            keyword: item.keyword,
            color: item.color
          }))
        : []
    };
  } catch (error) {
    return {
      rows: getDefaultRows(),
      bulkText: "",
      richEditorHtml: "",
      reverseText: "",
      numberText: "",
      numberColor: "#a84f2f",
      effectRules: []
    };
  }
}

function persistTextContent() {
  window.localStorage.setItem(
    TEXT_CONTENT_STORAGE_KEY,
    JSON.stringify({
      rows: state.rows.map((row) => ({ content: row.content })),
      bulkText: state.bulkText,
      richEditorHtml: richTextEditor?.innerHTML || state.richEditorHtml || "",
      reverseText: state.reverseText,
      numberText: state.numberText,
      numberColor: state.numberColor,
      effectRules: state.effectRules
    })
  );
}

function loadActiveTool() {
  const savedTool = window.localStorage.getItem(ACTIVE_TOOL_STORAGE_KEY);
  const allowedTools = new Set(["tool1", "tool2", "tool3", "tool4", "tool5"]);
  return allowedTools.has(savedTool) ? savedTool : "tool3";
}

function persistActiveTool() {
  window.localStorage.setItem(ACTIVE_TOOL_STORAGE_KEY, state.activeTool);
}

const savedTextContent = loadTextContent();

const state = {
  activeTool: loadActiveTool(),
  colors: loadStoredColors(),
  defaultTextColor: loadDefaultColorSettings(),
  previewSettings: loadPreviewSettings(),
  bulkText: savedTextContent.bulkText,
  bulkOutput: "",
  richEditorHtml: savedTextContent.richEditorHtml,
  reverseText: savedTextContent.reverseText,
  reverseOutput: "",
  numberText: savedTextContent.numberText,
  numberColor: savedTextContent.numberColor,
  numberOutput: "",
  effectRules: savedTextContent.effectRules,
  editorSelection: null,
  richEditorOutput: "",
  rows: savedTextContent.rows
};

const colorConfig = document.querySelector("#colorConfig");
const toolTabs = document.querySelectorAll(".tool-tab");
const toolPanels = document.querySelectorAll(".tool-panel");
const tableBody = document.querySelector("#tableBody");
const bulkTextInput = document.querySelector("#bulkTextInput");
const bulkOutput = document.querySelector("#bulkOutput");
const editorColorButtons = document.querySelector("#editorColorButtons");
const richTextEditor = document.querySelector("#richTextEditor");
const richEditorOutput = document.querySelector("#richEditorOutput");
const reverseInput = document.querySelector("#reverseInput");
const reversePreview = document.querySelector("#reversePreview");
const reverseOutput = document.querySelector("#reverseOutput");
const numberTextInput = document.querySelector("#numberTextInput");
const numberColorInput = document.querySelector("#numberColorInput");
const numberOutput = document.querySelector("#numberOutput");
const effectRuleList = document.querySelector("#effectRuleList");
const effectRuleCount = document.querySelector("#effectRuleCount");
const applyDefaultColorButton = document.querySelector("#applyDefaultColor, #clearSelectedColor");
const finalText = document.querySelector("#finalText");
const richPreview = document.querySelector("#richPreview");
const generateResultButton = document.querySelector("#generateResult");
const copyFinalTextButton = document.querySelector("#copyFinalText");
const addColorButton = document.querySelector("#addColor");
const exportConfigButton = document.querySelector("#exportConfig");
const importConfigButton = document.querySelector("#importConfig");
const configFileInput = document.querySelector("#configFileInput");
const addTextRowButton = document.querySelector("#addTextRow");
const clearTool1TextButton = document.querySelector("#clearTool1Text");
const clearTool2TextButton = document.querySelector("#clearTool2Text");
const clearTool3TextButton = document.querySelector("#clearTool3Text");
const clearTool4TextButton = document.querySelector("#clearTool4Text");
const clearTool5TextButton = document.querySelector("#clearTool5Text");
const addEffectRuleButton = document.querySelector("#addEffectRule");
const toggleEffectLibraryButton = document.querySelector("#toggleEffectLibrary");
const parseRichTextButton = document.querySelector("#parseRichText");
const sendParsedToTool3Button = document.querySelector("#sendParsedToTool3");
const includeDefaultColorInput = document.querySelector("#includeDefaultColor");
const defaultTextColorInput = document.querySelector("#defaultTextColor");
const previewBackgroundColorInput = document.querySelector("#previewBackgroundColor");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getColorMap() {
  const map = new Map();
  state.colors.forEach((item) => {
    const key = item.name.trim();
    if (key) {
      map.set(key, item.value.trim() || "#000000");
    }
  });
  return map;
}

function refreshRowIds() {
  state.rows.forEach((row, index) => {
    row.id = index + 1;
  });
}

function syncRowsFromInputs() {
  tableBody.querySelectorAll("textarea[data-row-index]").forEach((textarea) => {
    const rowIndex = Number(textarea.dataset.rowIndex);
    if (state.rows[rowIndex]) {
      state.rows[rowIndex].content = textarea.value;
    }
  });
}

function syncBulkTextFromInput() {
  state.bulkText = bulkTextInput.value;
}

function syncEditorHtmlFromInput() {
  state.richEditorHtml = richTextEditor.innerHTML;
}

function syncReverseTextFromInput() {
  state.reverseText = reverseInput.value;
}

function syncNumberTextFromInput() {
  state.numberText = numberTextInput.value;
}

function syncNumberColorFromInput() {
  state.numberColor = numberColorInput.value.trim() || "#a84f2f";
}

function syncEditorSelection() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return;
  }

  const range = selection.getRangeAt(0);
  if (richTextEditor.contains(range.commonAncestorContainer)) {
    state.editorSelection = range.cloneRange();
  }
}

function convertColorMarkers(content, colorMap) {
  return content.replace(
    /【([^【】]+?)（([^（）]+?)）】/g,
    (fullMatch, label, colorName) => {
      const mappedColor = colorMap.get(colorName.trim());
      if (!mappedColor) {
        return label.trim();
      }
      return `<color=${mappedColor}>${label.trim()}</color>`;
    }
  );
}

function convertContent(content, rowNumber, colorMap) {
  const source = content.trim();
  if (!source) {
    return "";
  }

  const numberedText = `${rowNumber}、${source}`;

  return convertColorMarkers(numberedText, colorMap);
}

function splitBulkTextBySequence(content) {
  const source = content.trim();
  if (!source) {
    return [];
  }

  const normalizedSource = source.replace(/\r?\n+/g, " ");
  const matches = findSequenceMatches(normalizedSource);

  if (matches.length === 0) {
    return [normalizedSource];
  }

  return matches
    .map((match, index) => {
      const start = match.index;
      const end = index + 1 < matches.length ? matches[index + 1].index : normalizedSource.length;
      return normalizedSource.slice(start, end).trim();
    })
    .filter(Boolean);
}

function splitJoinedTextBySequence(content) {
  return splitBulkTextBySequence(content).join("\\n");
}

function splitTextPreservingSequence(content) {
  const source = content.trim();
  if (!source) {
    return [];
  }

  const normalizedSource = source.replace(/\r?\n+/g, " ");
  const matches = findSequenceMatches(normalizedSource);

  if (matches.length === 0) {
    return [{
      sequence: "",
      text: normalizedSource
    }];
  }

  return matches
    .map((match, index) => {
      const start = match.index;
      const end = index + 1 < matches.length ? matches[index + 1].index : normalizedSource.length;
      const segment = normalizedSource.slice(start, end).trim();
      return {
        sequence: match.value,
        text: segment.slice(match.value.length)
      };
    })
    .filter((item) => item.sequence || item.text.trim());
}

function findSequenceMatches(text) {
  const sequencePattern = /(^|[\s。；;！？!?])(\d+、|\d+[.．](?!\d))/g;
  const matches = [];
  let match;

  while ((match = sequencePattern.exec(text)) !== null) {
    const prefix = match[1] || "";
    matches.push({
      index: match.index + prefix.length,
      value: match[2]
    });
  }

  return matches;
}

function colorizeNumbersInText(text, colorValue) {
  const numberPattern = /[-+]?(?:\d+(?:\.\d+)?|\.\d+)(?:%|％|倍|秒|点|级|层|次|个|米|码)?/g;

  return text.replace(numberPattern, (numberText, offset, fullText) => {
    const previousChar = offset > 0 ? fullText[offset - 1] : "";
    if (/[A-Za-z0-9_#]/.test(previousChar)) {
      return numberText;
    }

    return `<color=${colorValue}>${numberText}</color>`;
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function colorizeEffectKeywords(text) {
  const activeRules = state.effectRules
    .filter((rule) => rule.keyword.trim() && rule.color.trim())
    .sort((left, right) => right.keyword.length - left.keyword.length);

  return text
    .split(/(<color=[^>]+>.*?<\/color>)/g)
    .map((segment) => segment.startsWith("<color=") ? segment : colorizePlainEffectKeywords(segment, activeRules))
    .join("");
}

function colorizePlainEffectKeywords(text, activeRules) {
  let result = "";
  let index = 0;

  while (index < text.length) {
    const matchedRule = activeRules.find((rule) => text.startsWith(rule.keyword.trim(), index));

    if (matchedRule) {
      const keyword = matchedRule.keyword.trim();
      result += `<color=${matchedRule.color.trim()}>${keyword}</color>`;
      index += keyword.length;
      continue;
    }

    result += text[index];
    index += 1;
  }

  return result;
}

function colorizeBracketHighlights(text, colorValue) {
  return text.replace(/【([^【】]+?)】/g, `<color=${colorValue}>$1</color>`);
}

function colorizeNumbersOutsideTags(text, colorValue) {
  return text
    .split(/(<color=[^>]+>.*?<\/color>)/g)
    .map((segment) => segment.startsWith("<color=") ? segment : colorizeNumbersInText(segment, colorValue))
    .join("");
}

function convertNumberText() {
  const colorValue = state.numberColor.trim() || "#a84f2f";
  return splitTextPreservingSequence(state.numberText)
    .map((item) => {
      const bracketText = colorizeBracketHighlights(item.text, colorValue);
      const effectText = colorizeEffectKeywords(bracketText);
      const convertedText = colorizeNumbersOutsideTags(effectText, colorValue);
      return `${item.sequence}${convertedText}`.trim();
    })
    .filter(Boolean)
    .join("\\n");
}

function normalizeColorValue(value) {
  const probe = document.createElement("span");
  probe.style.color = value;
  document.body.appendChild(probe);
  const normalizedValue = getComputedStyle(probe).color;
  probe.remove();
  return normalizedValue;
}

function getColorTagValue(colorValue) {
  const normalizedColor = normalizeColorValue(colorValue);
  const matchedColor = state.colors.find((color) => normalizeColorValue(color.value) === normalizedColor);
  return matchedColor ? matchedColor.value.trim() : colorValue;
}

function isDefaultTextColor(colorValue) {
  const defaultColorValue = state.defaultTextColor.value.trim() || "#ffffff";
  return normalizeColorValue(colorValue) === normalizeColorValue(defaultColorValue);
}

function getNodeColor(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node;
  const dataColor = element.dataset?.richTextColor;
  if (dataColor) {
    return dataColor;
  }

  return element.style?.color || "";
}

function convertEditorNodeToTaggedText(node, inheritedColor = "") {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    if (!text) {
      return "";
    }

    const escapedText = escapeTagText(text);
    if (!inheritedColor || isDefaultTextColor(inheritedColor)) {
      return escapedText;
    }

    return `<color=${getColorTagValue(inheritedColor)}>${escapedText}</color>`;
  }

  if (node.nodeName === "BR") {
    return "\n";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const currentColor = getNodeColor(node) || inheritedColor;
  return Array.from(node.childNodes)
    .map((childNode) => convertEditorNodeToTaggedText(childNode, currentColor))
    .join("");
}

function escapeTagText(value) {
  return value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function decodeHtmlText(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function convertRichTextToEditorHtml(source) {
  const strippedSource = source
    .trim()
    .replace(/^<b>/i, "")
    .replace(/<\/b>$/i, "");

  const withLineBreaks = strippedSource
    .replace(/\\n/g, "<br>")
    .replace(/\r?\n/g, "<br>");

  const container = document.createElement("div");
  container.innerHTML = withLineBreaks.replace(
    /<color=([^>]+)>/gi,
    (match, colorValue) => `<span data-rich-text-color="${escapeHtml(colorValue.trim())}" style="color:${escapeHtml(colorValue.trim())}">`
  ).replace(/<\/color>/gi, "</span>");

  return normalizeParsedEditorHtml(container);
}

function normalizeParsedEditorHtml(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtml(decodeHtmlText(node.textContent || ""));
  }

  if (node.nodeName === "BR") {
    return "<br>";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const colorValue = node.dataset?.richTextColor || node.style?.color || "";
  const childrenHtml = Array.from(node.childNodes)
    .map((childNode) => normalizeParsedEditorHtml(childNode))
    .join("");

  if (colorValue && !isDefaultTextColor(colorValue)) {
    const tagColorValue = getColorTagValue(colorValue);
    return `<span data-rich-text-color="${escapeHtml(tagColorValue)}" style="color:${escapeHtml(tagColorValue)}">${childrenHtml}</span>`;
  }

  return childrenHtml;
}

function convertEditorToTaggedText() {
  const rawText = Array.from(richTextEditor.childNodes)
    .map((node) => convertEditorNodeToTaggedText(node))
    .join("")
    .trim();

  return splitJoinedTextBySequence(rawText);
}

function applyEditorColor(colorValue) {
  richTextEditor.focus();

  const selection = window.getSelection();
  selection.removeAllRanges();

  if (state.editorSelection) {
    selection.addRange(state.editorSelection);
  }

  if (!selection.rangeCount || selection.isCollapsed) {
    return;
  }

  const range = selection.getRangeAt(0);
  if (!richTextEditor.contains(range.commonAncestorContainer)) {
    return;
  }

  const span = document.createElement("span");
  span.dataset.richTextColor = colorValue;
  span.style.color = colorValue;

  try {
    range.surroundContents(span);
  } catch (error) {
    span.appendChild(range.extractContents());
    range.insertNode(span);
  }

  selection.removeAllRanges();
  state.editorSelection = null;
  syncEditorHtmlFromInput();
  persistTextContent();
  renderRichEditorTool();
}

function buildPreviewHtml(tagText, defaultColorValue) {
  const safeText = escapeHtml(tagText);
  const previewHtml = safeText
    .replace(/&lt;b&gt;([\s\S]*?)&lt;\/b&gt;/g, "<strong>$1</strong>")
    .replace(
      /&lt;color=([^&]+?)&gt;([\s\S]*?)&lt;\/color&gt;/g,
      (_, colorValue, textValue) => `<span style="color:${colorValue}">${textValue}</span>`
    )
    .replace(/\\n/g, "<br>")
    .replace(/\n/g, "<br>");

  return `<span style="color:${escapeHtml(defaultColorValue)}">${previewHtml}</span>`;
}

function renderColorConfig() {
  colorConfig.innerHTML = "";

  state.colors.forEach((color, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "color-item";

    wrapper.innerHTML = `
      <div class="color-item-header">
        <strong>颜色 ${index + 1}</strong>
        <span class="color-swatch" style="background:${escapeHtml(color.value)}"></span>
      </div>
      <div class="color-item-fields">
        <label class="config-field">
          <span>颜色名称</span>
          <input data-color-name-index="${index}" value="${escapeHtml(color.name)}" placeholder="例如：黑色、蓝色">
        </label>
        <label class="config-field">
          <span>RGB / Hex</span>
          <input data-color-value-index="${index}" value="${escapeHtml(color.value)}" placeholder="例如：#000000">
        </label>
      </div>
      <div class="color-item-actions">
        <button class="ghost-button" type="button" data-remove-color-index="${index}">删除</button>
      </div>
    `;

    colorConfig.appendChild(wrapper);
  });

  colorConfig.querySelectorAll("input[data-color-name-index]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const target = event.currentTarget;
      const index = Number(target.dataset.colorNameIndex);
      state.colors[index].name = target.value;
      persistColors();
      render();
    });
  });

  colorConfig.querySelectorAll("input[data-color-value-index]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const target = event.currentTarget;
      const index = Number(target.dataset.colorValueIndex);
      state.colors[index].value = target.value;
      persistColors();
      render();
    });
  });

  colorConfig.querySelectorAll("button[data-remove-color-index]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (state.colors.length <= 1) {
        return;
      }
      const target = event.currentTarget;
      const index = Number(target.dataset.removeColorIndex);
      state.colors.splice(index, 1);
      persistColors();
      render();
    });
  });
}

function renderEditorColorButtons() {
  editorColorButtons.innerHTML = "";

  state.colors.forEach((color) => {
    const button = document.createElement("button");
    button.className = "editor-color-button";
    button.type = "button";
    button.textContent = color.name || color.value;
    button.style.setProperty("--button-color", color.value || "#000000");
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
      applyEditorColor(color.value || "#000000");
    });
    editorColorButtons.appendChild(button);
  });
}

function renderEffectRules() {
  effectRuleList.innerHTML = "";
  effectRuleCount.textContent = `${state.effectRules.length} 条`;

  if (state.effectRules.length === 0) {
    const empty = document.createElement("div");
    empty.className = "config-tip";
    empty.textContent = "暂无效果词，点击“新增效果”添加。";
    effectRuleList.appendChild(empty);
    return;
  }

  state.effectRules.forEach((rule, index) => {
    const row = document.createElement("div");
    row.className = "effect-rule-row";

    const colorOptions = state.colors.map((color) => {
      const selected = color.value === rule.color ? "selected" : "";
      return `<option value="${escapeHtml(color.value)}" ${selected}>${escapeHtml(color.name || color.value)}</option>`;
    }).join("");

    row.innerHTML = `
      <input class="effect-keyword-input" data-effect-keyword-index="${index}" value="${escapeHtml(rule.keyword)}" placeholder="效果词，例如：物理伤害">
      <select data-effect-select-index="${index}">
        <option value="">选择颜色</option>
        ${colorOptions}
      </select>
      <input class="effect-color-input" data-effect-color-index="${index}" value="${escapeHtml(rule.color)}" placeholder="例如：#9c221d">
      <button class="ghost-button" type="button" data-save-effect-index="${index}">保存</button>
      <button class="ghost-button" type="button" data-remove-effect-index="${index}">移除</button>
    `;

    effectRuleList.appendChild(row);
  });

  effectRuleList.querySelectorAll("input[data-effect-keyword-index]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const index = Number(event.currentTarget.dataset.effectKeywordIndex);
      state.effectRules[index].keyword = event.currentTarget.value;
    });
  });

  effectRuleList.querySelectorAll("select[data-effect-select-index]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const index = Number(event.currentTarget.dataset.effectSelectIndex);
      if (event.currentTarget.value) {
        state.effectRules[index].color = event.currentTarget.value;
      }
      persistTextContent();
      renderEffectRules();
      renderNumberTool();
    });
  });

  effectRuleList.querySelectorAll("input[data-effect-color-index]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const index = Number(event.currentTarget.dataset.effectColorIndex);
      state.effectRules[index].color = event.currentTarget.value;
    });
  });

  effectRuleList.querySelectorAll("button[data-save-effect-index]").forEach((button) => {
    button.addEventListener("click", () => {
      persistTextContent();
      renderNumberTool();
    });
  });

  effectRuleList.querySelectorAll("button[data-remove-effect-index]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = Number(event.currentTarget.dataset.removeEffectIndex);
      state.effectRules.splice(index, 1);
      persistTextContent();
      renderEffectRules();
      renderNumberTool();
    });
  });
}

function renderRows() {
  const colorMap = getColorMap();
  tableBody.innerHTML = "";

  const outputLines = [];

  state.rows.forEach((row, index) => {
    const converted = convertContent(row.content, index + 1, colorMap);
    if (converted) {
      outputLines.push(converted);
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="index-badge">${index + 1}</span></td>
      <td>
        <textarea
          class="text-input"
          data-row-index="${index}"
          placeholder="请输入文本，例如：装备回收为【不可逆操作（红色）】，回收后将无法回退。"
        >${escapeHtml(row.content)}</textarea>
      </td>
      <td><pre class="output-box" data-output-index="${index}">${escapeHtml(converted)}</pre></td>
      <td>
        <button class="ghost-button" type="button" data-delete-row-index="${index}">删除</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  updateTool1Output();

  tableBody.querySelectorAll("textarea[data-row-index]").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      const target = event.currentTarget;
      const rowIndex = Number(target.dataset.rowIndex);
      state.rows[rowIndex].content = target.value;
      persistTextContent();
      updateTool1Output();
    });
  });

  tableBody.querySelectorAll("button[data-delete-row-index]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (state.rows.length <= 1) {
        state.rows[0].content = "";
      } else {
        const rowIndex = Number(event.currentTarget.dataset.deleteRowIndex);
        state.rows.splice(rowIndex, 1);
      }

      refreshRowIds();
      persistTextContent();
      renderRows();
    });
  });
}

function updateTool1Output() {
  const colorMap = getColorMap();
  const outputLines = [];

  state.rows.forEach((row, index) => {
    const converted = convertContent(row.content, index + 1, colorMap);
    const outputBox = tableBody.querySelector(`[data-output-index="${index}"]`);
    if (outputBox) {
      outputBox.textContent = converted;
    }
    if (converted) {
      outputLines.push(converted);
    }
  });

  updateFinalResult(outputLines.join("\\n"));
}

function renderBulkTool() {
  const colorMap = getColorMap();
  const lines = splitBulkTextBySequence(state.bulkText).map((line) => convertColorMarkers(line, colorMap));
  const joinedText = lines.join("\\n");

  state.bulkOutput = joinedText;
  bulkTextInput.value = state.bulkText;
  bulkOutput.value = joinedText;
  updateFinalResult(joinedText);
}

function renderRichEditorTool() {
  syncEditorHtmlFromInput();
  const joinedText = convertEditorToTaggedText();

  state.richEditorOutput = joinedText;
  richEditorOutput.value = joinedText;
  updateFinalResult(joinedText);
}

function renderReverseTool() {
  const parsedHtml = convertRichTextToEditorHtml(state.reverseText);

  state.reverseOutput = parsedHtml;
  reverseInput.value = state.reverseText;
  reversePreview.innerHTML = parsedHtml || "暂无解析内容";
  reversePreview.style.color = state.defaultTextColor.value.trim() || "#ffffff";
  reversePreview.style.background = state.previewSettings.backgroundColor || "#fffaf0";
  reverseOutput.value = parsedHtml;
  updateFinalResult(state.reverseText.trim());
}

function renderNumberTool() {
  const joinedText = convertNumberText();

  state.numberOutput = joinedText;
  numberTextInput.value = state.numberText;
  numberColorInput.value = state.numberColor;
  numberOutput.value = joinedText;
  updateFinalResult(joinedText);
}

function updateFinalResult(joinedText) {
  const defaultColorValue = state.defaultTextColor.value.trim() || "#ffffff";
  const finalContent = state.defaultTextColor.enabled
    ? `<color=${defaultColorValue}>${joinedText}</color>`
    : joinedText;
  const finalValue = joinedText ? `<b>${finalContent}</b>` : "";

  finalText.value = finalValue;
  richPreview.parentElement.style.background = state.previewSettings.backgroundColor || "#fffaf0";
  richPreview.innerHTML = finalValue ? buildPreviewHtml(finalValue, defaultColorValue) : "暂无内容";
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  finalText.focus();
  finalText.select();
  finalText.setSelectionRange(0, finalText.value.length);

  const copied = document.execCommand("copy");
  window.getSelection()?.removeAllRanges();

  if (!copied) {
    throw new Error("Copy command failed");
  }
}

function renderActiveToolResult() {
  if (state.activeTool === "tool5") {
    renderNumberTool();
    return;
  }

  if (state.activeTool === "tool4") {
    renderReverseTool();
    return;
  }

  if (state.activeTool === "tool3") {
    renderRichEditorTool();
    return;
  }

  if (state.activeTool === "tool2") {
    renderBulkTool();
    return;
  }

  renderRows();
}

function renderToolSwitch() {
  toolTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tool === state.activeTool);
  });

  toolPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `${state.activeTool}Panel`);
  });
}

function render() {
  includeDefaultColorInput.checked = state.defaultTextColor.enabled;
  defaultTextColorInput.value = state.defaultTextColor.value;
  previewBackgroundColorInput.value = state.previewSettings.backgroundColor;
  if (richTextEditor.innerHTML !== state.richEditorHtml) {
    richTextEditor.innerHTML = state.richEditorHtml;
  }
  richTextEditor.style.color = state.defaultTextColor.value.trim() || "#ffffff";
  richTextEditor.style.background = state.previewSettings.backgroundColor || "#fffaf0";
  renderToolSwitch();
  renderColorConfig();
  renderEditorColorButtons();
  renderEffectRules();
  renderActiveToolResult();
}

function buildExportConfig() {
  return {
    version: 1,
    colors: state.colors,
    defaultTextColor: state.defaultTextColor,
    previewSettings: state.previewSettings
  };
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function applyImportedConfig(config) {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid config");
  }

  if (Array.isArray(config.colors)) {
    const importedColors = config.colors
      .filter((item) => item && typeof item.name === "string" && typeof item.value === "string")
      .map((item) => ({
        name: item.name,
        value: item.value
      }));

    if (importedColors.length > 0) {
      state.colors = importedColors;
    }
  }

  if (config.defaultTextColor && typeof config.defaultTextColor === "object") {
    state.defaultTextColor = {
      enabled: Boolean(config.defaultTextColor.enabled),
      value: typeof config.defaultTextColor.value === "string" && config.defaultTextColor.value.trim()
        ? config.defaultTextColor.value
        : state.defaultTextColor.value
    };
  }

  if (config.previewSettings && typeof config.previewSettings === "object") {
    state.previewSettings = {
      backgroundColor: typeof config.previewSettings.backgroundColor === "string" && config.previewSettings.backgroundColor.trim()
        ? config.previewSettings.backgroundColor
        : state.previewSettings.backgroundColor
    };
  }

  persistAllConfig();
  render();
}

function generateCurrentResult() {
  syncRowsFromInputs();
  syncBulkTextFromInput();
  syncEditorHtmlFromInput();
  syncReverseTextFromInput();
  syncNumberTextFromInput();
  syncNumberColorFromInput();
  persistTextContent();
  renderActiveToolResult();
}

copyFinalTextButton.addEventListener("click", async () => {
  if (!finalText.value) {
    return;
  }

  try {
    await copyTextToClipboard(finalText.value);
    copyFinalTextButton.textContent = "复制成功";
    window.setTimeout(() => {
      copyFinalTextButton.textContent = "复制最终结果文本";
    }, 1200);
  } catch (error) {
    copyFinalTextButton.textContent = "复制失败";
    window.setTimeout(() => {
      copyFinalTextButton.textContent = "复制最终结果文本";
    }, 1200);
  }
});

generateResultButton.addEventListener("click", () => {
  try {
    generateCurrentResult();
    generateResultButton.textContent = "已生成";
    window.setTimeout(() => {
      generateResultButton.textContent = "生成结果";
    }, 900);
  } catch (error) {
    generateResultButton.textContent = "生成失败";
    window.setTimeout(() => {
      generateResultButton.textContent = "生成结果";
    }, 1200);
    console.error(error);
  }
});

addColorButton.addEventListener("click", () => {
  state.colors.push({
    name: `新颜色${state.colors.length + 1}`,
    value: "#000000"
  });
  persistColors();
  render();
});

addEffectRuleButton.addEventListener("click", () => {
  state.effectRules.push({
    keyword: "",
    color: state.numberColor || "#a84f2f"
  });
  effectRuleList.classList.remove("is-collapsed");
  persistTextContent();
  renderEffectRules();
});

toggleEffectLibraryButton.addEventListener("click", () => {
  effectRuleList.classList.toggle("is-collapsed");
});

exportConfigButton.addEventListener("click", () => {
  const content = JSON.stringify(buildExportConfig(), null, 2);
  downloadTextFile("rich-text-tool-config.json", content);
});

importConfigButton.addEventListener("click", () => {
  configFileInput.click();
});

configFileInput.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) {
    return;
  }

  try {
    const content = await file.text();
    applyImportedConfig(JSON.parse(content));
    importConfigButton.textContent = "导入成功";
    window.setTimeout(() => {
      importConfigButton.textContent = "导入配置";
    }, 1200);
  } catch (error) {
    importConfigButton.textContent = "导入失败";
    window.setTimeout(() => {
      importConfigButton.textContent = "导入配置";
    }, 1200);
    console.error(error);
  } finally {
    configFileInput.value = "";
  }
});

toolTabs.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    syncRowsFromInputs();
    syncBulkTextFromInput();
    syncReverseTextFromInput();
    syncNumberTextFromInput();
    syncNumberColorFromInput();
    state.activeTool = event.currentTarget.dataset.tool;
    persistActiveTool();
    render();
  });
});

addTextRowButton.addEventListener("click", () => {
  state.rows.push({
    id: state.rows.length + 1,
    content: ""
  });
  refreshRowIds();
  persistTextContent();
  renderActiveToolResult();
});

clearTool1TextButton.addEventListener("click", () => {
  state.rows.forEach((row) => {
    row.content = "";
  });
  persistTextContent();
  renderRows();
});

clearTool2TextButton.addEventListener("click", () => {
  state.bulkText = "";
  state.bulkOutput = "";
  persistTextContent();
  renderBulkTool();
});

clearTool3TextButton.addEventListener("click", () => {
  richTextEditor.innerHTML = "";
  state.richEditorHtml = "";
  state.editorSelection = null;
  state.richEditorOutput = "";
  persistTextContent();
  renderRichEditorTool();
});

clearTool4TextButton.addEventListener("click", () => {
  state.reverseText = "";
  state.reverseOutput = "";
  persistTextContent();
  renderReverseTool();
});

clearTool5TextButton.addEventListener("click", () => {
  state.numberText = "";
  state.numberOutput = "";
  persistTextContent();
  renderNumberTool();
});

bulkTextInput.addEventListener("input", (event) => {
  state.bulkText = event.currentTarget.value;
  persistTextContent();
  renderBulkTool();
});

reverseInput.addEventListener("input", (event) => {
  state.reverseText = event.currentTarget.value;
  persistTextContent();
  renderReverseTool();
});

parseRichTextButton.addEventListener("click", () => {
  syncReverseTextFromInput();
  persistTextContent();
  renderReverseTool();
});

numberTextInput.addEventListener("input", (event) => {
  state.numberText = event.currentTarget.value;
  persistTextContent();
  renderNumberTool();
});

numberColorInput.addEventListener("input", (event) => {
  state.numberColor = event.currentTarget.value.trim() || "#a84f2f";
  persistTextContent();
  renderNumberTool();
});

sendParsedToTool3Button.addEventListener("click", () => {
  syncReverseTextFromInput();
  const parsedHtml = convertRichTextToEditorHtml(state.reverseText);
  state.richEditorHtml = parsedHtml;
  richTextEditor.innerHTML = parsedHtml;
  state.activeTool = "tool3";
  persistTextContent();
  render();
});

if (applyDefaultColorButton) {
  applyDefaultColorButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
    applyEditorColor(state.defaultTextColor.value.trim() || "#ffffff");
  });
}

richTextEditor.addEventListener("mouseup", syncEditorSelection);
richTextEditor.addEventListener("keyup", syncEditorSelection);
richTextEditor.addEventListener("input", () => {
  syncEditorHtmlFromInput();
  persistTextContent();
  renderRichEditorTool();
});

includeDefaultColorInput.addEventListener("change", (event) => {
  state.defaultTextColor.enabled = event.currentTarget.checked;
  persistDefaultColorSettings();
  renderActiveToolResult();
});

defaultTextColorInput.addEventListener("input", (event) => {
  state.defaultTextColor.value = event.currentTarget.value;
  persistDefaultColorSettings();
  richTextEditor.style.color = state.defaultTextColor.value.trim() || "#ffffff";
  renderActiveToolResult();
});

previewBackgroundColorInput.addEventListener("input", (event) => {
  state.previewSettings.backgroundColor = event.currentTarget.value;
  persistPreviewSettings();
  richTextEditor.style.background = state.previewSettings.backgroundColor || "#fffaf0";
  renderActiveToolResult();
});

refreshRowIds();
render();
