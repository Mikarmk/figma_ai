figma.showUI(__html__, { width: 400, height: 400 });

const selection = figma.currentPage.selection;
if (selection.length === 0 || selection[0].type !== "TEXT") {
  figma.notify("❗ Пожалуйста, выберите текстовый слой перед запуском плагина.");
  figma.closePlugin();
} else {
  const textNode = /** @type {TextNode} */ (selection[0]);
  figma.loadFontAsync(textNode.fontName).then(() => {
    figma.ui.postMessage({ type: "load-text", text: textNode.characters });
  });
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "apply-corrected") {
    const sel = figma.currentPage.selection;
    if (sel.length && sel[0].type === "TEXT") {
      const textNode = /** @type {TextNode} */ (sel[0]);
      textNode.characters = msg.text;
      figma.notify("✅ Текст успешно обновлён.");
    }
    figma.closePlugin();
  }
};
