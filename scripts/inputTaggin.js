function runInputTagging() {
    console.log('running inputaggin');
    const junkPhrases = [
        "required to answer",
        "single line text",
        "multi line text",
        "choice",
        "option",
        "required",
        "dropdown",
        "your answer"
    ];

    function cleanLabelText(raw) {
        let cleaned = raw.toLowerCase();
        for (let phrase of junkPhrases) {
            cleaned = cleaned.replace(phrase, "");
        }
        return cleaned.replace(/\s+/g, " ").trim().replace(/^\d+\.\s*/, '').replace(/^./, s => s.toUpperCase());
    }

    // Scan above the input for label text (used for Microsoft Forms + general layout)
    function findAboveText(input) {
        let el = input;
        for (let i = 0; i < 4; i++) {
            el = el.parentElement;
            if (!el) break;

            const possibleLabels = el.querySelectorAll("span, div, label");
            for (let label of possibleLabels) {
                const txt = label.textContent.trim();
                if (
                    txt &&
                    txt.length >= 3 &&
                    txt.length < 100 &&
                    !junkPhrases.some(j => txt.toLowerCase().includes(j))
                ) {
                    return cleanLabelText(txt);
                }
            }
        }
        return null;
    }

    // Scan forward in DOM from a span (used in Google Forms)
    function findInputNearSpan(span) {
        const rect = span.getBoundingClientRect();
        const allInputs = Array.from(document.querySelectorAll("input, textarea"));
        return allInputs.find(inp => {
            const iRect = inp.getBoundingClientRect();
            return Math.abs(iRect.top - rect.top) < 80 && Math.abs(iRect.left - rect.left) < 300;
        });
    }

    // --- Phase 1: Handle Google Forms-style labeling ---
    document.querySelectorAll("span").forEach(span => {
        const labelText = span.textContent.trim();
        if (
            labelText &&
            labelText.length >= 3 &&
            labelText.length < 100 &&
            !junkPhrases.some(j => labelText.toLowerCase().includes(j))
        ) {
            const cleanedLabel = cleanLabelText(labelText);
            const input = findInputNearSpan(span);
            if (input && !input.hasAttribute("newClass")) {
                input.setAttribute("newClass", cleanedLabel);
                // console.log(`Google-style assigned "${cleanedLabel}" to`, input);
            }
        }
    });

    // --- Phase 2: Handle Microsoft Forms / general input labeling ---
    document.querySelectorAll("input, textarea").forEach(input => {
        // Skip if already labeled in Phase 1
        if (input.hasAttribute("newClass")) return;

        let labelText = null;

        // Try using aria-labelledby
        const labelledById = input.getAttribute("aria-labelledby");
        if (labelledById) {
            const labelElem = document.getElementById(labelledById);
            if (labelElem) {
                labelText = cleanLabelText(labelElem.textContent.trim());
            }
        }

        // Fallback: scan parents for label text
        if (!labelText || labelText.length < 3) {
            labelText = findAboveText(input);
        }

        if (labelText) {
            input.setAttribute("newClass", labelText);
            // console.log(`General/Microsoft-style assigned "${labelText}" to`, input);
        }
    });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "tag_inputs") {
        runInputTagging();
    }
});