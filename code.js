// code.js — основной файл плагина Figma
// Показываем UI (ui.html) при запуске плагина
figma.showUI(__html__, { width: 400, height: 400 });

// Функция для проверки статуса сервера
async function checkServerStatus() {
  try {
    const response = await fetch('http://localhost:5500/proxy.html');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Функция для инициализации плагина
async function initializePlugin() {
  // Проверяем статус сервера
  const serverRunning = await checkServerStatus();
  
  if (!serverRunning) {
    figma.notify("⚠️ Сервер не запущен. Запустите start-server.sh (Mac/Linux) или start-server.bat (Windows)", { timeout: 5000 });
    figma.ui.postMessage({ type: "server-status", running: false });
    return;
  }

  // Забираем выделенный слой и сразу передаём его текст в интерфейс
  const selection = figma.currentPage.selection;
  if (selection.length === 0 || selection[0].type !== "TEXT") {
    figma.notify("❗ Пожалуйста, выберите текстовый слой перед запуском плагина.");
    figma.closePlugin();
  } else {
    const textNode = /** @type {TextNode} */ (selection[0]);
    // Загружаем шрифт, чтобы можно было редактировать текст
    figma.loadFontAsync(textNode.fontName).then(() => {
      // Отправляем текущий текст в ui.html
      figma.ui.postMessage({ type: "load-text", text: textNode.characters });
      figma.ui.postMessage({ type: "server-status", running: true });
    });
  }
}

// Запускаем инициализацию
initializePlugin();

// Обработка сообщений из ui.html
figma.ui.onmessage = async (msg) => {
  if (msg.type === "apply-corrected") {
    // Меняем содержимое слоя на то, что пришло из интерфейса
    const sel = figma.currentPage.selection;
    if (sel.length && sel[0].type === "TEXT") {
      const textNode = /** @type {TextNode} */ (sel[0]);
      textNode.characters = msg.text;
      figma.notify("✅ Текст успешно обновлён.");
    }
    figma.closePlugin();
  }
};
