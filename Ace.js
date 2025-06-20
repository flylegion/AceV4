// Ace.js
export const AceHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      background: #1e1e1e;
      overflow: hidden;
    }
    #editor {
      width: 100%;
      height: 100%;
      font-size: 13px;
      line-height: 1;
      font-family: monospace;
    }
    .ace_mobile-button {
      display: none !important;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/gh/flylegion/AceEditorBase@main/ace.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/flylegion/AceEditorBase@main/ext-language_tools.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/flylegion/AceEditorBase@main/mode-javascript.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/flylegion/AceEditorBase@main/theme-monokai.js"></script>
</head>
<body>
  <div id="editor"></div>
  <script>
    ace.config.setModuleUrl(
      "ace/mode/javascript_worker",
      "https://cdn.jsdelivr.net/gh/flylegion/AceEditorBase@main/worker-javascript.js"
    );

    const editor = ace.edit("editor", {
      theme: "ace/theme/monokai",
      mode: "ace/mode/javascript",
      useWorker: true,
      showPrintMargin: false,
      highlightActiveLine: true,
      wrap: true,
    });

    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
    });

    editor.renderer.setScrollMargin(40, 40);
    editor.setOption("scrollPastEnd", 0);

    window.getCode = () => {
      window.ReactNativeWebView?.postMessage(editor.getValue());
    };

    window.handlePaste = function(text) {
      editor.insert(text);
    };

    document.addEventListener("message", function (event) {
      editor.setValue(event.data, -1);
    });

    window.sendAlert = function(level, message) {
      const payload = { type: "alert", level, message };
      window.ReactNativeWebView?.postMessage(JSON.stringify(payload));
    };

    editor.session.on("changeAnnotation", function() {
      const annotations = editor.session.getAnnotations();
      if (annotations.length > 0) {
        const messages = annotations.map(a => ({
          line: a.row + 1,
          message: a.text
        }));
        window.sendAlert("error", messages);
      } else {
        window.sendAlert("none", []);
      }
    });

    if (!window._addedEmptyLines) {
      const session = editor.getSession();
      const currentLines = session.getLength();
      for (let i = 0; i < 30; i++) {
        session.insert({ row: currentLines + i, column: 0 }, "\\n");
      }
      window._addedEmptyLines = true;
    }

    editor.moveCursorTo(0, 0);
    editor.scrollToLine(0, true, true, () => {});
  </script>
</body>
</html>`;

// Hook para scroll automático al aparecer teclado
import { useEffect } from 'react';
import { Keyboard } from 'react-native';

export function useAceKeyboardAutoScroll(webViewRef) {
  useEffect(() => {
    const listener = Keyboard.addListener('keyboardDidShow', () => {
      webViewRef.current?.injectJavaScript(`
        try {
          const editor = ace.edit("editor");
          const cursorPos = editor.getCursorPosition();
          editor.scrollToLine(cursorPos.row - 1.8, true, true, () => {});
        } catch (e) {}
        true;
      `);
    });

    return () => listener.remove();
  }, []);
}