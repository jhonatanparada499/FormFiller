const rowsContainer = document.getElementById("rows");
const addRowBtn = document.getElementById("addRow");
const saveBtn = document.getElementById("save");
const fillBtn = document.getElementById("fill");

// Add a new row for input
function addRow(field = "", value = "") {
    const row = document.createElement("div");

    const fieldInput = document.createElement("input");
    fieldInput.placeholder = "Field";
    fieldInput.value = field;

    const valueInput = document.createElement("input");
    valueInput.placeholder = "Value";
    valueInput.value = value;

    row.appendChild(fieldInput);
    row.appendChild(valueInput);
    rowsContainer.appendChild(row);
}

// Load saved values
chrome.storage.local.get("autofillData", (result) => {
    const data = result.autofillData || {};
    for (let key in data) {
        addRow(key, data[key]);
    }
    if (Object.keys(data).length === 0) addRow(); // Start with one empty row
});

// Add new row
addRowBtn.onclick = () => addRow();

// Save all rows
saveBtn.onclick = () => {
    const data = {};
    rowsContainer.querySelectorAll("div").forEach(row => {
        const inputs = row.querySelectorAll("input");
        if (inputs[0].value.trim() && inputs[1].value.trim()) {
            data[inputs[0].value.trim().toLowerCase()] = inputs[1].value.trim();
        }
    });

    chrome.storage.local.set({ autofillData: data }, () => {
        alert("Data saved!");
    });
};

fillBtn.onclick = () => {
    const data = {};
    rowsContainer.querySelectorAll("div").forEach(row => {
        const inputs = row.querySelectorAll("input");
        if (inputs[0].value.trim() && inputs[1].value.trim()) {
            data[inputs[0].value.trim().toLowerCase()] = inputs[1].value.trim();
        }
    });

    chrome.storage.local.set({ autofillData: data }, () => {
        // Step 1: Tag inputs
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;

            chrome.tabs.sendMessage(tabId, { action: "tag_inputs" }, () => {
                // Step 2: Autofill after tagging
                chrome.tabs.sendMessage(tabId, { action: "fill_form" });
            });
        });
    });
};