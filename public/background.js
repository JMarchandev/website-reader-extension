/*global chrome*/
chrome.runtime.onInstalled.addListener(() => {
  console.log('Chrome extension successfully installed!');

  chrome.contextMenus.create({
    id: 'reader',
    title: "Read selection",
    contexts: ["all"],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id, allFrames: true },
        func: getDocumentSelection,
      },
      async (res) => {
        const { result: text } = res[0];

        const language = await getlanguage(text);
        speech(text, language);
      });
  });
});

function getDocumentSelection() {
  return document.getSelection().toString()
}

function speech(text, lang) {
  chrome.tts.speak(text, { lang });
}

async function getlanguage(text) {
  const languagesFound = await detectLanguage(text);
  return languagesFound.languages[0].language;
}

function detectLanguage(text) {
  return chrome.i18n.detectLanguage(text);
}

