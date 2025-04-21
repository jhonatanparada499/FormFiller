chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fill_form") {
        chrome.storage.local.get("autofillData", (result) => {
            const autofillData = result.autofillData || {};

            function simulateTyping(input, value) {
                input.focus();
                input.value = ''; // clear any existing value

                for (let i = 0; i < value.length; i++) {
                    const char = value[i];
                    input.value += char;

                    input.dispatchEvent(new InputEvent('input', {
                        bubbles: true,
                        cancelable: true,
                        inputType: 'insertText',
                        data: char
                    }));
                }

                input.dispatchEvent(new Event('change', { bubbles: true }));
            }

            document.querySelectorAll("input[newClass], textarea[newClass]").forEach(input => {
                const label = input.getAttribute("newClass").toLowerCase();

                for (let key in autofillData) {
                    const pattern = new RegExp(`\\b${key}\\b`, "i");
                    if (pattern.test(label)) {
                        simulateTyping(input, autofillData[key]);
                        // console.log(`Filled "${key}" →`, input);
                        break;
                    }
                }
            });
        });
    }
});

// Version 1 (filds are defined using dictionaries) 

// const autofillData = {
//     "email": "jhonatanparada499@gmail.com",
//     "first name": "Jhonatan",
//     "last name":"Parada Torres",
//     "name": "Jhonatan Parada"
//   };  

// function simulateTyping(input, value) {
//     input.focus();
//     input.value = ''; // clear any existing value

//     for (let i = 0; i < value.length; i++) {
//         const char = value[i];
//         input.value += char;

//         input.dispatchEvent(new InputEvent('input', {
//             bubbles: true,
//             cancelable: true,
//             inputType: 'insertText',
//             data: char
//         }));
//     }

//     input.dispatchEvent(new Event('change', { bubbles: true }));
// }

// document.querySelectorAll("input[newClass], textarea[newClass]").forEach(input => {
//     const label = input.getAttribute("newClass").toLowerCase();

//     for (let key in autofillData) {
//         const pattern = new RegExp(`\\b${key}\\b`, "i"); // whole word match
//         if (pattern.test(label)) {
//             simulateTyping(input, autofillData[key]);
//             console.log(`Filled "${key}" →`, input);
//             break;
//         }
//     }
// });

// const input = document.querySelector("input[type='text']");
// simulateTyping(input, "Jhonatan Parada");

//##############################################################################33