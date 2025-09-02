const createSpan = (className, index) => {
    const span = document.createElement("span");
    if (className) span.className = className;
    if (index !== undefined) span.dataset.index = index.toString();
    span.style.display = "inline-block";
    return span;
};

const appendText = (parent, text, className, index) => {
    const span = createSpan(className, index);
    span.textContent = text;
    parent.appendChild(span);
    return span;
};

const splitText = (element, {
    splitBy = " ",
    charClass = "split-char",
    wordClass = "split-word",
    lineClass = "split-line"
} = {}) => {
    const [targetElement] = Array.isArray(element) ? element : 
        typeof element === 'string' ? document.querySelectorAll(element) : 
        [element];

    if (!targetElement) {
        throw new Error("Element not found");
    }

    const text = targetElement.textContent || "";
    targetElement.setAttribute("aria-label", text);
    targetElement.textContent = "";

    const result = {
        chars: [],
        words: [],
        lines: []
    };

    const words = text.split(splitBy);
    const wordElements = [];
    const spacers = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordElement = createSpan(wordClass, i);
        result.words.push(wordElement);
        wordElements.push(wordElement);

        const chars = Array.from(word);
        for (let j = 0; j < chars.length; j++) {
            const char = appendText(wordElement, chars[j], charClass, j);
            result.chars.push(char);
        }

        if (targetElement.appendChild(wordElement), i < words.length - 1) {
            if (splitBy === " ") {
                const space = document.createTextNode(" ");
                targetElement.appendChild(space);
                spacers.push(space);
            } else {
                const delimiter = appendText(wordElement, splitBy, `${charClass}-delimiter`);
                result.chars.push(delimiter);
            }
        }
    }

    const wordPositions = wordElements.map((element, index) => ({
        element,
        top: element.offsetTop,
        index,
        spacer: index < spacers.length ? spacers[index] : null
    }));

    const lines = [];
    let currentLine = [];
    let currentTop = wordPositions[0]?.top ?? 0;
    let lineIndex = 0;

    for (let i = 0; i < wordPositions.length; i++) {
        const { element, top, spacer } = wordPositions[i];
        if (top > currentTop && currentLine.length > 0) {
            lines.push({ elements: currentLine, lineIndex: lineIndex++ });
            currentLine = [];
            currentTop = top;
        }
        currentLine.push(element);
        if (spacer) currentLine.push(spacer);
    }

    if (currentLine.length > 0) {
        lines.push({ elements: currentLine, lineIndex });
    }

    targetElement.textContent = "";

    for (const { elements, lineIndex } of lines) {
        const lineElement = createSpan(lineClass, lineIndex);
        lineElement.style.display = "inline-block";
        result.lines.push(lineElement);
        for (const element of elements) {
            lineElement.appendChild(element);
        }
        targetElement.appendChild(lineElement);
    }

    return result;
};

export {
    splitText,
    createSpan,
    appendText
};

