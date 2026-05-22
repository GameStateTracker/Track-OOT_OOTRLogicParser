const LOG_ENTRY_TPL = `
<div class="container">
    <label class="content">
        <input id="collapse" type="checkbox">
        <div id="time"></div>
        <div id="message"></div>
    </label>
    <slot id="children"></slot>
</div>`;

const LOG_ENTRY_STYLE = `
:host {
    display: block;
}

:host(:not(:last-child)) {
    margin-bottom: 4px;
}

.container {
    display: block;
    padding: 4px;
    border-radius: 4px;
    color: #ffffff;
    background-color: #333333;

    .content {
        position: sticky;
        display: flex;
        align-items: flex-start;
        top: 0px;
        margin: -4px;
        padding: 4px;
        border-radius: 4px;
        background-color: #333333;
        box-shadow: 0px -4px 0px 0px #222;
        z-index: 10;

        #time {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            margin-right: 0.5em;
            padding: 0.05em 0.5em;
            background-color: #222;
            border-radius: 2px;
            font-size: 0.9em;
            white-space: pre;
        }

        #message {
            display: flex;
            flex: 1;
        }
    }

    #children {
        position: relative;
        display: none;
        margin-top: 0.5em;
        margin-left: 2.25em;
        padding: 4px;
        background-color: #222;
        border-radius: 6px;
        z-index: 0;
    }

    &:has(#collapse:not(:checked)) #children {
        display: none;
    }
}

:host([type=error]) .container {
    color: #ffbaba;
    background-color: #640000;
}

:host([type=warn]) .container {
    color: #ffffba;
    background-color: #856600;
}

:host([type=info]) .container {
    color: #babaff;
    background-color: #000064;
}

#collapse {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1em;
    height: 1em;
    margin: 0em 1em 0em .25em;
    pointer-events: none;
    appearance: none;
    color: inherit;
    transform-origin: center;

    &::after {
        line-height: 1em;
    }

    &:checked {
        transform: rotate(90deg);
    }
}

:host(:not(:empty)) {
    #children {
        display: block;
    }

    #collapse {
        pointer-events: all;

        &::after {
            content: "▶";
        }
    }
}
`;

const  LOG_VALUE_TPL = `
<div id="container">
</div>`;

const LOG_VALUE_STYLE = `
:host {
    padding-left: 0.5em;
}
#container {
    display: flex;
}
ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
}
ul[data-label]::before {
    content: attr(data-label);
}
li {
    color: #f5aef9;
}
li[data-label]::before {
    margin-right: 0.5em;
    color: #70acf8;
    content: attr(data-label);
}
.collapse {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1em;
    height: 1em;
    margin: .1em .2em;
    appearance: none;
    color: inherit;
    transform-origin: center;

    &::after {
        line-height: 1em;
        content: "▶";
    }
    &:checked {
        transform: rotate(90deg);
    }
}
.collapse:not(:checked) + ul > li {
    display: none;
}
`;

const TPL = `
<!doctype html>
<html lang=en>

<head>
    <title>Logfile - $LOG_NAME</title>
    <meta charset=UTF-8>
    <meta content=none name=robots>
    <meta content="width=device-width,initial-scale=1,user-scalable=no" name=viewport>
    <meta content=#222222 name=theme-color>
    <style>
        * {
            position: relative;
            box-sizing: border-box;
            font-family: monospace
        }

        body {
            display: block;
            width: 100dvw;
            height: 100dvh;
            margin: 0;
            padding: 0;
            background-color: #222
        }

        .view {
            display: block;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 4px;
            background-color: #222;
            overflow: scroll
        }
    </style>
    <script>
        const ENTRY_TPL = document.createElement("template");
        ENTRY_TPL.innerHTML = \`${LOG_ENTRY_TPL}\`;
        const ENTRY_STYLE = new CSSStyleSheet;
        ENTRY_STYLE.replaceSync(\`${LOG_ENTRY_STYLE}\`);
        class LogEntry extends HTMLElement {
            #collapseEl;
            #timeEl;
            #messageEl;
            constructor() {
                super();
                this.attachShadow({ mode: "open" });
                this.shadowRoot.append(document.importNode(ENTRY_TPL.content.cloneNode(true), true));
                this.shadowRoot.adoptedStyleSheets = [ENTRY_STYLE];
                this.#collapseEl = this.shadowRoot.getElementById("collapse");
                this.#timeEl = this.shadowRoot.getElementById("time");
                this.#messageEl = this.shadowRoot.getElementById("message");
            }
            set type(value) {
                this.setAttribute("type", value);
            }
            get type() {
                return this.getAttribute("type");
            }
            set time(value) {
                this.setAttribute("time", value);
            }
            get time() {
                return this.getAttribute("time");
            }
            set expanded(value) {
                this.setAttribute("expanded", value);
            }
            get expanded() {
                return this.getAttribute("expanded");
            }
            static get observedAttributes() {
                return ["time", "expanded"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (name === "time") {
                    this.#timeEl.innerText = newValue ?? "";
                } else if (name === "expanded") {
                    if (newValue && newValue !== "false") {
                        this.#collapseEl.setAttribute("checked", "");
                    } else {
                        this.#collapseEl.removeAttribute("checked");
                    }
                }
            }
            addMessageValue(value) {
                const valueEl = document.createElement("log-value");
                valueEl.value = value;
                this.#messageEl.append(valueEl);
            }
        }
        customElements.define("log-entry", LogEntry);
    </script>
    <script>
        const VALUE_TPL = document.createElement("template");
        VALUE_TPL.innerHTML = \`${LOG_VALUE_TPL}\`;
        const VALUE_STYLE = new CSSStyleSheet;
        VALUE_STYLE.replaceSync(\`${LOG_VALUE_STYLE}\`);
        class LogValue extends HTMLElement {
            #containerEl;
            constructor() {
                super();
                this.attachShadow({ mode: "open" });
                this.shadowRoot.append(document.importNode(VALUE_TPL.content.cloneNode(true), true));
                this.shadowRoot.adoptedStyleSheets = [VALUE_STYLE];
                this.#containerEl = this.shadowRoot.getElementById("container");
            }
            set value(value) {
                this.setAttribute("value", JSON.stringify(value));
            }
            get value() {
                return JSON.parse(this.getAttribute("value"));
            }
            static get observedAttributes() {
                return ["value"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (name === "value") {
                    this.#renderTree(this.value);
                }
            }
            #renderTree(value, root = this.#containerEl) {
                if (value == null) {
                    const el = document.createElement("span");
                    el.innerText = "null";
                    root.append(el);
                } else if (typeof value === "object") {
                    const cbEl = document.createElement("input");
                    cbEl.className = "collapse";
                    cbEl.setAttribute("type", "checkbox");
                    root.append(cbEl);
                    const ulEl = document.createElement("ul");
                    if (Array.isArray(value)) {
                        ulEl.dataset.label = "(" + value.length + ") [...]";
                    } else {
                        ulEl.dataset.label = "{...}";
                    }
                    for (const i in value) {
                        const liEl = document.createElement("li");
                        liEl.dataset.label = i + ":";
                        this.#renderTree(value[i], liEl);
                        ulEl.append(liEl);
                    }
                    root.append(ulEl);
                } else {
                    const el = document.createElement("span");
                    el.innerText = JSON.stringify(value);
                    root.append(el);
                }
            }
        }
        customElements.define("log-value", LogValue);
    </script>
    <script type="module">
        const TIME_FND = /(....)-(..)-(..)T(..:..:..\\....)Z/;
        const TIME_REP = "$1-$2-$3 $4";
        const viewEl = document.getElementById("view");
        const logData = $CONTENT;
        function generateLog(data = logData, target = viewEl) {
            for (const entry of data) {
                const {
                    type, time, message = [], children = [], collapsed
                } = entry;
                const logEntryEl = document.createElement("log-entry");
                logEntryEl.type = type.toLowerCase();
                logEntryEl.time = time.replace(TIME_FND, TIME_REP);
                logEntryEl.expanded = !collapsed;
                for (const msg of message) {
                    logEntryEl.addMessageValue(msg);
                }
                generateLog(children, logEntryEl);
                target.append(logEntryEl);
            }
        }
        generateLog();
    </script>
</head>

<body>
    <div id="view">
    </div>
</body>

</html>`;

export function generateHTMLog(name, data) {
    return TPL.replace("$LOG_NAME", name).replace("$CONTENT", JSON.stringify(data));
}
