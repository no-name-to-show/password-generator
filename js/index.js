import { setDataToGeneratePassword, getWords } from "./getData.js";
import { generatePassword } from "./utility/textUtils.js";
import { alertContainer } from "./container/alert-container.js";

const DOM_IDS = {
    GENERATE_BUTTON: "btnGeneratePassword",
    PASSWORD_INPUT: "inputGeneratedPassword",
    BODY_CONTAINER: "bodyContainer",
};

const dom = initializeDom();

/**
 * Inicializa las referencias del DOM.
 *
 * @returns {{
 *   generateButton: HTMLButtonElement,
 *   passwordInput: HTMLInputElement
 * }}
 */
function initializeDom() {
    const generateButton = document.getElementById(
        DOM_IDS.GENERATE_BUTTON
    );

    const passwordInput = document.getElementById(
        DOM_IDS.PASSWORD_INPUT
    );

    const bodyContainer = document.getElementById(
        DOM_IDS.BODY_CONTAINER
    );



    if (!generateButton || !passwordInput || !bodyContainer) {
        throw new Error(
            "No fue posible inicializar los elementos requeridos del DOM."
        );
    }

    return {
        generateButton,
        passwordInput,
        bodyContainer,
    };
}

/**
 * Copia texto al portapapeles.
 *
 * @param {string} text
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        dom.bodyContainer.appendChild(
            alertContainer("Password copied to clipboard!")
        );
    } catch (error) {
        console.error(
            "No fue posible copiar la contraseña al portapapeles:",
            error
        );
    }
}

/**
 * Genera una contraseña, la muestra en pantalla y la copia al portapapeles.
 */
async function handleGeneratePassword() {
    const words = getWords();

    if (words.length === 0) {
        console.warn(
            "No hay palabras disponibles para generar la contraseña."
        );
        return;
    }

    const password = generatePassword(words);

    dom.passwordInput.value = password;
}

/**
 * Registra los eventos de la aplicación.
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
}

/**
 * Inicializa la aplicación.
 */
async function bootstrap() {
    await setDataToGeneratePassword();
    registerEvents();
}

bootstrap().catch((error) => {
    console.error(
        "Error durante la inicialización de la aplicación:",
        error
    );
});