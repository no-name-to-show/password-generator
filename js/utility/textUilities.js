// ============================================================
// CONFIGURACIÓN / CONSTANTES
// ============================================================

/**
 * Mapa de sustituciones tipo "leet speak" (letra -> número visualmente similar).
 * @type {Record<string, string>}
 */
const LEET_REPLACEMENTS = {
    a: "4",
    e: "3",
    i: "1",
    o: "0",
};

/** Símbolos disponibles para insertar en la contraseña. @type {string[]} */
const PASSWORD_SYMBOLS = [
    "@",
    "#",
    "$",
    "%",
    "&",
    "*",
    "!",
    "+",
    "=",
    "_"
];

/**
 * Símbolos actualmente seleccionados por el usuario (persisten entre generaciones).
 * Por defecto se inicializa con todos los símbolos disponibles.
 * @type {string[]}
 */
let PASSWORD_SYMBOLS_SELECTED = [...PASSWORD_SYMBOLS];

/** Longitud mínima deseada para la contraseña generada. */
const MIN_PASSWORD_LENGTH = 12;

/** Probabilidad (0-1) de convertir un carácter a mayúscula. */
const UPPERCASE_PROBABILITY = 0.3;


// ============================================================
// GENERACIÓN DE CONTRASEÑA
// ============================================================

/**
 * Genera una contraseña legible basada en palabras aleatorias, combinando
 * sustituciones tipo leet, mayúsculas aleatorias y un símbolo insertado al azar.
 *
 * @param {string[]} words - Listado de palabras candidatas para formar la contraseña.
 * @returns {string} La contraseña generada.
 * @throws {Error} Si `words` está vacío/no es un arreglo, o si no hay símbolos seleccionados.
 */
export function generatePassword(words) {
    validateWords(words);

    const passwordWords = [
        transformWord(getRandomWord(words)),
        transformWord(getRandomWord(words)),
    ];

    let password = passwordWords.join("-");

    if (password.length < MIN_PASSWORD_LENGTH) {
        password += `-${transformWord(getRandomWord(words))}`;
    }

    password = applyRandomUppercase(password);
    password = insertRandomSymbol(password);

    return password;
}

/**
 * Valida que el arreglo de palabras sea utilizable.
 *
 * @param {string[]} words
 * @throws {Error} Si `words` no es un arreglo o está vacío.
 */
function validateWords(words) {
    if (!Array.isArray(words) || words.length === 0) {
        throw new Error("Se requiere un arreglo de palabras no vacío.");
    }
}

/**
 * Obtiene una palabra aleatoria del listado.
 *
 * @param {string[]} words
 * @returns {string}
 */
function getRandomWord(words) {
    return words[Math.floor(Math.random() * words.length)];
}

/**
 * Aplica sustituciones tipo leet (a->4, e->3, i->1, o->0) sobre una palabra en minúsculas.
 *
 * @param {string} word
 * @returns {string}
 */
function transformWord(word) {
    let result = word.toLowerCase();

    for (const [character, replacement] of Object.entries(LEET_REPLACEMENTS)) {
        result = result.replaceAll(character, replacement);
    }

    return result;
}

/**
 * Convierte caracteres aleatorios de la cadena a mayúscula, según una probabilidad dada.
 *
 * @param {string} value
 * @param {number} [probability] - Probabilidad (0-1) de convertir cada carácter. Por defecto {@link UPPERCASE_PROBABILITY}.
 * @returns {string}
 */
function applyRandomUppercase(value, probability = UPPERCASE_PROBABILITY) {
    return value
        .split("")
        .map((character) =>
            Math.random() < probability
                ? character.toUpperCase()
                : character
        )
        .join("");
}

/**
 * Inserta un símbolo aleatorio (de {@link PASSWORD_SYMBOLS_SELECTED}) en una posición aleatoria de la cadena.
 *
 * @param {string} value
 * @returns {string}
 * @throws {Error} Si el usuario no tiene ningún símbolo seleccionado.
 */
function insertRandomSymbol(value) {
    if (PASSWORD_SYMBOLS_SELECTED.length === 0) {
        throw new Error("Selecciona al menos un símbolo antes de generar la contraseña.");
    }

    const symbol = getRandomItem(PASSWORD_SYMBOLS_SELECTED);
    const position = Math.floor(Math.random() * (value.length + 1));

    return value.slice(0, position) + symbol + value.slice(position);
}

/**
 * Obtiene un elemento aleatorio de un arreglo.
 *
 * @template T
 * @param {T[]} items
 * @returns {T}
 */
function getRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}


// ============================================================
// PANEL DE SELECCIÓN DE SÍMBOLOS (UI)
// ============================================================

/**
 * Referencias del DOM del panel de símbolos, capturadas una única vez
 * mediante {@link initSymbolPanel}. Evita repetir `getElementById` en
 * cada apertura del panel.
 *
 * @type {{
 *   container: HTMLElement,
 *   selectAllCheckbox: HTMLInputElement,
 *   saveButton: HTMLButtonElement,
 *   cancelButton: HTMLButtonElement
 * } | null}
 */
let symbolPanelDom = null;

/**
 * Inicializa el panel de selección de símbolos: guarda las referencias del DOM,
 * construye las tarjetas de símbolos y engancha los eventos. Debe llamarse
 * una única vez, típicamente durante el bootstrap de la aplicación.
 *
 * @param {{
 *   container: HTMLElement,
 *   selectAllCheckbox: HTMLInputElement,
 *   saveButton: HTMLButtonElement,
 *   cancelButton: HTMLButtonElement
 * }} elements - Referencias del DOM ya resueltas (una sola vez) por quien invoca.
 */
export function initSymbolPanel({ container, selectAllCheckbox, saveButton, cancelButton }) {
    symbolPanelDom = { container, selectAllCheckbox, saveButton, cancelButton };

    buildPanel(container);
    attachEvents(container, selectAllCheckbox, saveButton, cancelButton);
}

/**
 * Abre el panel de selección de símbolos y sincroniza los checkboxes con la
 * última selección guardada. Requiere que {@link initSymbolPanel} haya sido
 * llamado previamente.
 *
 * @throws {Error} Si el panel no fue inicializado con {@link initSymbolPanel}.
 */
export function selectSymbolToPassword() {
    if (!symbolPanelDom) {
        throw new Error(
            "El panel de símbolos no fue inicializado. Llama a initSymbolPanel() antes."
        );
    }

    openSymbolPanel();
    syncCheckboxesWithSelection(symbolPanelDom.container, symbolPanelDom.selectAllCheckbox);
}

/**
 * Construye el HTML de las tarjetas de símbolos dentro del contenedor.
 * Se ejecuta una sola vez, desde {@link initSymbolPanel}.
 *
 * @param {HTMLElement} container
 */
function buildPanel(container) {
    const html = PASSWORD_SYMBOLS
        .map(symbol => `
            <label class="choice-card">
                <input type="checkbox" name="plan" value="${symbol}" checked>
                <div class="card-content">
                    <h4>${symbol}</h4>
                </div>
            </label>
        `)
        .join('');

    container.insertAdjacentHTML('beforeend', html);
}

/**
 * Engancha los listeners del panel (delegación de eventos para los checkboxes,
 * "seleccionar todo", guardar y cancelar). Se ejecuta una sola vez, desde
 * {@link initSymbolPanel}.
 *
 * @param {HTMLElement} container
 * @param {HTMLInputElement} selectAllCheckbox
 * @param {HTMLButtonElement} saveButton
 * @param {HTMLButtonElement} cancelButton
 */
function attachEvents(container, selectAllCheckbox, saveButton, cancelButton) {
    // Delegación: un solo listener en el contenedor en vez de uno por checkbox.
    container.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"][name="plan"]')) {
            const allChecked = [...container.querySelectorAll('input[name="plan"]')]
                .every(cb => cb.checked);
            selectAllCheckbox.checked = allChecked;
        }
    });

    selectAllCheckbox.addEventListener('change', () => {
        container.querySelectorAll('input[name="plan"]')
            .forEach(cb => cb.checked = selectAllCheckbox.checked);
    });

    // Guardar: confirma la selección actual y la persiste en PASSWORD_SYMBOLS_SELECTED.
    saveButton.addEventListener('click', () => {
        PASSWORD_SYMBOLS_SELECTED = [...container.querySelectorAll('input[name="plan"]:checked')]
            .map(cb => cb.value);
        closeSymbolPanel();
    });

    // Cancelar: descarta cambios no guardados, revirtiendo al último estado persistido.
    cancelButton.addEventListener('click', () => {
        syncCheckboxesWithSelection(container, selectAllCheckbox);
        closeSymbolPanel();
    });
}

/**
 * Sincroniza el estado visual de los checkboxes (y el de "seleccionar todo")
 * con el último estado guardado en {@link PASSWORD_SYMBOLS_SELECTED}.
 *
 * @param {HTMLElement} container
 * @param {HTMLInputElement} selectAllCheckbox
 */
function syncCheckboxesWithSelection(container, selectAllCheckbox) {
    const selectedSet = new Set(PASSWORD_SYMBOLS_SELECTED);
    const checkboxes = container.querySelectorAll('input[name="plan"]');

    checkboxes.forEach(cb => {
        cb.checked = selectedSet.has(cb.value);
    });

    selectAllCheckbox.checked = PASSWORD_SYMBOLS_SELECTED.length === PASSWORD_SYMBOLS.length;
}

/** Muestra el panel de selección de símbolos (agrega la clase `.show`). */
function openSymbolPanel() {
    document.querySelector('.symbol-panel-container').classList.add('show');
}

/** Oculta el panel de selección de símbolos (quita la clase `.show`). */
function closeSymbolPanel() {
    document.querySelector('.symbol-panel-container').classList.remove('show');
}