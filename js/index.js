import { setDataToGeneratePassword, getWords, clearData } from "./getData.js";
import { generatePassword, selectSymbolToPassword, initSymbolPanel } from "./utility/textUilities.js";
import { alertContainer, alertErrorContainer } from "./container/alert-container.js";

const DOM_IDS = {
    GENERATE_BUTTON: "btnGeneratePassword",
    PASSWORD_INPUT: "inputGeneratedPassword",
    BODY_CONTAINER: "bodyContainer",
    CLEAR_CACHE_BUTTON: "clearWebCache",
    FORM_CONTAINER: "passwordFormContainer",
    SYMBOL_PANEL_BUTTON: "symbolPanelBtn",
    SYMBOL_CHOICE_PANEL: "symbolChoicePanel",
    SYMBOL_PANEL_SELECT_ALL: "selectAllSymbols",
    SYMBOL_PANEL_SAVE_BUTTON: "saveSymbolsBtn",
    SYMBOL_PANEL_CANCEL_BUTTON: "cancelSymbolsBtn",
};

const dom = initializeDom();

/**
 * Inicializa y valida las referencias a los elementos del DOM utilizados por la aplicación.
 * Lanza un error temprano si falta algún elemento requerido, evitando fallos silenciosos
 * más adelante durante el registro de eventos.
 *
 * @returns {{
 *   generateButton: HTMLButtonElement,
 *   passwordInput: HTMLInputElement,
 *   bodyContainer: HTMLElement,
 *   clearCacheButton: HTMLAnchorElement,
 *   passwordFormContainer: HTMLFormElement,
 *   symbolPanelButton: HTMLAnchorElement,
 *   symbolChoicePanel: HTMLElement,
 *   symbolPanelSelectAll: HTMLInputElement,
 *   symbolPanelCancelButton: HTMLButtonElement,
 *   symbolPanelSaveButton: HTMLButtonElement
 * }}
 */
function initializeDom() {
    const generateButton = document.getElementById(DOM_IDS.GENERATE_BUTTON);
    const passwordInput = document.getElementById(DOM_IDS.PASSWORD_INPUT);
    const bodyContainer = document.getElementById(DOM_IDS.BODY_CONTAINER);
    const clearCacheButton = document.getElementById(DOM_IDS.CLEAR_CACHE_BUTTON);
    const passwordFormContainer = document.getElementById(DOM_IDS.FORM_CONTAINER);
    const symbolPanelButton = document.getElementById(DOM_IDS.SYMBOL_PANEL_BUTTON);
    const symbolChoicePanel = document.getElementById(DOM_IDS.SYMBOL_CHOICE_PANEL);
    const symbolPanelSelectAll = document.getElementById(DOM_IDS.SYMBOL_PANEL_SELECT_ALL);
    const symbolPanelCancelButton = document.getElementById(DOM_IDS.SYMBOL_PANEL_CANCEL_BUTTON);
    const symbolPanelSaveButton = document.getElementById(DOM_IDS.SYMBOL_PANEL_SAVE_BUTTON);

    if (!generateButton || !passwordInput
        || !bodyContainer || !clearCacheButton
        || !passwordFormContainer || !symbolPanelButton
        || !symbolChoicePanel || !symbolPanelSelectAll
        || !symbolPanelSaveButton || !symbolPanelCancelButton) {
        throw new Error(
            "No fue posible inicializar los elementos requeridos del DOM."
        );
    }

    return {
        generateButton,
        passwordInput,
        bodyContainer,
        clearCacheButton,
        passwordFormContainer,
        symbolPanelButton,
        symbolChoicePanel,
        symbolPanelSelectAll,
        symbolPanelCancelButton,
        symbolPanelSaveButton,
    };
}

/**
 * Copia un texto al portapapeles del usuario y muestra una alerta de éxito o error.
 *
 * @param {string} text - Texto a copiar (típicamente la contraseña generada).
 * @returns {Promise<void>}
 */
async function copyToClipboard(text) {
    try {
        if (!text?.trim()) {
            throw new Error("Empty password");
        }

        await navigator.clipboard.writeText(text);

        dom.bodyContainer.appendChild(
            alertContainer("Password copied to clipboard!")
        );
    } catch {
        dom.bodyContainer.appendChild(
            alertErrorContainer("Failed to copy password to clipboard.")
        );
    }
}

/**
 * Genera una contraseña a partir de las palabras disponibles y la muestra en pantalla.
 * Si no hay símbolos seleccionados (o cualquier otro error de generación), se informa
 * al usuario mediante una alerta en vez de romper la ejecución en silencio.
 *
 * @returns {void}
 */
function handleGeneratePassword() {
    const words = getWords();

    if (words.length === 0) {
        console.warn(
            "No hay palabras disponibles para generar la contraseña."
        );
        dom.bodyContainer.appendChild(
            alertErrorContainer("No hay palabras disponibles para generar la contraseña.")
        );
        return;
    }

    try {
        const password = generatePassword(words);
        dom.passwordInput.value = password;
    } catch (error) {
        dom.bodyContainer.appendChild(
            alertErrorContainer(error.message)
        );
    }
}

/**
 * Registra todos los eventos de la aplicación (generar, copiar, limpiar caché,
 * abrir panel de símbolos).
 *
 * @returns {void}
 */
function registerEvents() {
    dom.generateButton.addEventListener(
        "click",
        handleGeneratePassword
    );

    dom.passwordInput.addEventListener(
        "click",
        () => copyToClipboard(dom.passwordInput.value)
    );

    // Es un <a href="#">: sin preventDefault, el navegador salta al top de la página.
    dom.clearCacheButton.addEventListener("click", async (event) => {
        event.preventDefault();

        dom.passwordFormContainer.reset();
        dom.passwordInput.value = "";

        try {
            await clearData();
        } catch {
            dom.bodyContainer.appendChild(
                alertErrorContainer("No fue posible recargar el listado de palabras.")
            );
        }
    });

    // Mismo caso: es <a href="#">, se previene el salto al ancla.
    dom.symbolPanelButton.addEventListener("click", (event) => {
        event.preventDefault();

        selectSymbolToPassword();
    });
}

/**
 * Inicializa la aplicación: carga los datos necesarios, prepara el panel de
 * símbolos con sus referencias del DOM (una única vez) y registra los eventos.
 *
 * @returns {Promise<void>}
 */
async function bootstrap() {
    await setDataToGeneratePassword();

    initSymbolPanel({
        container: dom.symbolChoicePanel,
        selectAllCheckbox: dom.symbolPanelSelectAll,
        saveButton: dom.symbolPanelSaveButton,
        cancelButton: dom.symbolPanelCancelButton,
    });

    registerEvents();
}

bootstrap().catch((error) => {
    console.error(
        "Error durante la inicialización de la aplicación:",
        error
    );
});