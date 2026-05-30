import { setDataToGeneratePassword, getWords } from "./getData.js";
import { generatePassword } from "./utility/textUtils.js";

const DOM_IDS = {
    GENERATE_BUTTON: "btnGeneratePassword",
    PASSWORD_INPUT: "inputGeneratedPassword",
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

    if (!generateButton || !passwordInput) {
        throw new Error(
            "No fue posible inicializar los elementos requeridos del DOM."
        );
    }

    return {
        generateButton,
        passwordInput,
    };
}

/**
 * Genera una contraseña y la muestra en pantalla.
 */
function handleGeneratePassword() {
    const words = getWords();

    if (words.length === 0) {
        console.warn(
            "No hay palabras disponibles para generar la contraseña."
        );
        return;
    }

    dom.passwordInput.value = generatePassword(words);
}

/**
 * Registra los eventos de la aplicación.
 */
function registerEvents() {
    dom.generateButton.addEventListener(
        "click",
        handleGeneratePassword
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