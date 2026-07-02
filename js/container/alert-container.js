/** Duración (en milisegundos) que una alerta permanece visible antes de auto-eliminarse. */
const ALERT_DURATION_MS = 3000;

/**
 * Clases CSS asociadas a cada tipo de alerta.
 * NOTA: "succes" reproduce intencionalmente el nombre de clase usado en el CSS
 * (.alert-container.succes). Si se corrige el typo en el CSS, debe corregirse aquí también.
 * @type {Record<"success" | "error", string>}
 */
const ALERT_TYPE_CLASSES = {
    success: "succes",
    error: "error",
};

/**
 * Crea el elemento de alerta, eliminando cualquier alerta previa visible en pantalla
 * (solo se permite una alerta a la vez) y programa su auto-eliminación.
 *
 * @param {string} message - Texto a mostrar en la alerta.
 * @param {string} typeClass - Clase CSS del tipo de alerta (ver {@link ALERT_TYPE_CLASSES}).
 * @returns {HTMLDivElement} El contenedor de la alerta, listo para insertarse en el DOM.
 */
function createAlertElement(message, typeClass) {
    removeExistingAlert();

    const container = document.createElement("div");
    container.classList.add("alert-container", typeClass);

    const text = document.createElement("p");
    text.textContent = message;

    container.appendChild(text);

    setTimeout(() => {
        container.remove();
    }, ALERT_DURATION_MS);

    return container;
}

/** Elimina la alerta actualmente visible en pantalla, si existe. */
function removeExistingAlert() {
    const existingAlert = document.querySelector(".alert-container");

    if (existingAlert) {
        existingAlert.remove();
    }
}

/**
 * Crea una alerta de éxito.
 *
 * @param {string} message - Mensaje a mostrar.
 * @returns {HTMLDivElement} El contenedor de la alerta, para ser insertado en el DOM por quien la invoque.
 */
export function alertContainer(message) {
    return createAlertElement(message, ALERT_TYPE_CLASSES.success);
}

/**
 * Crea una alerta de error.
 *
 * @param {string} message - Mensaje a mostrar.
 * @returns {HTMLDivElement} El contenedor de la alerta, para ser insertado en el DOM por quien la invoque.
 */
export function alertErrorContainer(message) {
    return createAlertElement(message, ALERT_TYPE_CLASSES.error);
}