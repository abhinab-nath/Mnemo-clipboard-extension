const input = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveBtn");
const notesList = document.getElementById("notesList");

document.addEventListener("DOMContentLoaded", loadNotes);
saveBtn.addEventListener("click", saveNote);

function saveNote() {
  const text = input.value.trim();
  if (!text) return;

  chrome.storage.local.get(["notes"], function (result) {
    const notes = result.notes || [];
    notes.push(text);

    chrome.storage.local.set({ notes: notes }, function () {
      input.value = "";
      loadNotes();
    });
  });
}

function loadNotes() {
  chrome.storage.local.get(["notes"], function (result) {
    notesList.innerHTML = "";
    const notes = result.notes || [];

    notes.forEach((note, index) => {
      const li = document.createElement("li");

      const textSpan = document.createElement("span");
      textSpan.textContent = note;
      textSpan.style.cursor = "pointer";

      // Copy on click
      textSpan.addEventListener("click", () => {
        navigator.clipboard.writeText(note);
        showToast();
        // alert("Copied!");
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.style.marginLeft = "10px";

      // Delete functionality
      deleteBtn.addEventListener("click", () => {
        notes.splice(index, 1);
        chrome.storage.local.set({ notes: notes }, loadNotes);
      });

      li.appendChild(textSpan);
      li.appendChild(deleteBtn);
      notesList.appendChild(li);
    });
  });
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}