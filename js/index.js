import { setDataToGeneratePassword, getWords, clearData } from "./getData.js";
import { generatePassword } from "./utility/textUtils.js";
import { alertContainer, alertErrorContainer } from "./container/alert-container.js";

const DOM_IDS = {
    GENERATE_BUTTON: "btnGeneratePassword",
    PASSWORD_INPUT: "inputGeneratedPassword",
    BODY_CONTAINER: "bodyContainer",
    CLEAR_CACHE: "clearWebCache",
    FORM_BODY: "passwordFormContainer",
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

    const clearCacheButton = document.getElementById(
        DOM_IDS.CLEAR_CACHE
    )

    const passwordFormContainer = document.getElementById(
        DOM_IDS.FORM_BODY
    )


    if (!generateButton || !passwordInput
        || !bodyContainer || !clearCacheButton
        || !passwordFormContainer) {
        throw new Error(
            "No fue posible inicializar los elementos requeridos del DOM."
        );
    }

    return {
        generateButton,
        passwordInput,
        bodyContainer,
        clearCacheButton,
        passwordFormContainer
    };
}

/**
 * Copia texto al portapapeles.
 *
 * @param {string} text
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

    dom.clearCacheButton.addEventListener("click", () => {
        dom.passwordFormContainer.reset();
        dom.passwordInput.value = "";
        clearData();
    });
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