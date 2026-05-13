import {escapeHTML} from "../EscapeHTML.js";

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
            display: block;
            flex: 1;
            white-space: pre;
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
        const TPL = document.createElement("template");
        TPL.innerHTML = \`${LOG_ENTRY_TPL}\`;
        const STYLE = new CSSStyleSheet;
        STYLE.replaceSync(\`${LOG_ENTRY_STYLE}\`);
        class LogEntry extends HTMLElement {
            #collapseEl;
            #timeEl;
            #messageEl;
            constructor() {
                super();
                this.attachShadow({ mode: "open" });
                this.shadowRoot.append(document.importNode(TPL.content.cloneNode(true), true));
                this.shadowRoot.adoptedStyleSheets = [STYLE];
                this.#collapseEl = this.shadowRoot.getElementById("collapse");
                this.#timeEl = this.shadowRoot.getElementById("time");
                this.#messageEl = this.shadowRoot.getElementById("message");
            }
            set time(value) {
                this.setAttribute("time", value);
            }
            get time() {
                return this.getAttribute("time");
            }
            set message(value) {
                this.setAttribute("message", value);
            }
            get message() {
                return this.getAttribute("message");
            }
            set expanded(value) {
                this.setAttribute("expanded", value);
            }
            get expanded() {
                return this.getAttribute("expanded");
            }
            static get observedAttributes() {
                return ["time", "message", "expanded"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (name === "time") {
                    this.#timeEl.innerText = newValue ?? "";
                } else if (name === "message") {
                    this.#messageEl.innerHTML = newValue ?? "";
                } else if (name === "expanded") {
                    this.#collapseEl.setAttribute("checked", newValue && newValue !== "false");
                }
            }
        }
        customElements.define("log-entry", LogEntry);
    </script>
</head>

<body>
    <div class="view">
        $CONTENT
    </div>
</body>

</html>`;

export function generateHTMLog(name, data) {
    return TPL.replace("$LOG_NAME", name).replace("$CONTENT", () => {
        return data.map((entry) => formatMessage(entry)).join("\n");
    });
}

const TIME_FND = /(....)-(..)-(..)T(..:..:..\....)Z/;
const TIME_REP = "$1-$2-$3 $4";

function formatMessage(data) {
    const {
        type, time, message, children = [], collapsed
    } = data;
    const timeString = time.toJSON().replace(TIME_FND, TIME_REP);
    const typeString = `type="${type.toLowerCase()}"`;
    const formattedMessage = `${message.map(formatContent).join(" ")}`;
    const childString = children.length ? `\n${children.map((ch) => formatMessage(ch)).join("\n")}\n` : "";
    return `<log-entry ${typeString} time="${timeString}" message="${formattedMessage}" ${collapsed ? "" : "expanded"}>${childString}</log-entry>`;
}

function formatContent(content) {
    if (typeof content === "object") {
        // TODO create DOM view for JSON objects
        return escapeHTML(JSON.stringify(content, null, 4));
    }
    return escapeHTML(content.toString());
}
