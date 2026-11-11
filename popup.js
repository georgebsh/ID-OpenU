const KEY = "openuId";
const input = document.getElementById("id");
const status = document.getElementById("status");

chrome.storage.local.get(KEY, (data) => { input.value = data[KEY] || ""; });

document.getElementById("save").addEventListener("click", () => {
  const id = input.value.replace(/\D/g, "");
  if (id.length < 5) { status.style.color = "#b42318"; status.textContent = "מספר לא תקין"; return; }
  chrome.storage.local.set({ [KEY]: id }, () => { status.style.color = "#1f7a3a"; status.textContent = "נשמר ✓"; });
});

document.getElementById("clear").addEventListener("click", () => {
  chrome.storage.local.remove(KEY, () => { input.value = ""; status.style.color = "#1f7a3a"; status.textContent = "נמחק"; });
});
