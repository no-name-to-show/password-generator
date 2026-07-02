/** Clave utilizada para almacenar el listado de palabras en localStorage. */
const WORDS_CACHE_KEY = "words_";

/** Ruta del archivo fuente con el listado de palabras. */
const WORDS_SOURCE_PATH = "./json/wordList.json";

/**
 * Carga el listado de palabras desde el archivo fuente y lo guarda en caché,
 * solo si aún no existe una caché válida.
 *
 * @returns {Promise<void>}
 * @throws {Error} Si la petición falla o la respuesta no es exitosa.
 */
export async function setDataToGeneratePassword() {
    if (hasWordsCache()) {
        return;
    }

    try {
        const response = await fetch(WORDS_SOURCE_PATH);

        if (!response.ok) {
            throw new Error(
                `Error al cargar el listado de palabras (${response.status})`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data.words_)) {
            throw new Error(
                "El archivo de palabras no contiene un listado válido."
            );
        }

        saveWordsToCache(data.words_);
    } catch (error) {
        console.error(
            "No fue posible cargar el listado de palabras:",
            error
        );

        throw error;
    }
}

/**
 * Obtiene las palabras almacenadas en caché.
 *
 * @returns {string[]}
 */
export function getWords() {
    try {
        const cachedData = localStorage.getItem(WORDS_CACHE_KEY);

        return cachedData ? JSON.parse(cachedData) : [];
    } catch (error) {
        console.error(
            "Error al leer las palabras desde caché:",
            error
        );

        return [];
    }
}

/**
 * Elimina la caché existente y vuelve a cargar el listado de palabras desde el origen.
 *
 * @returns {Promise<void>}
 */
export async function clearData() {
    localStorage.clear();
    await setDataToGeneratePassword();
}

/**
 * Guarda el listado de palabras en caché.
 *
 * @param {string[]} words
 */
function saveWordsToCache(words) {
    localStorage.setItem(
        WORDS_CACHE_KEY,
        JSON.stringify(words)
    );
}

/**
 * Indica si existe una caché válida de palabras.
 *
 * @returns {boolean}
 */
function hasWordsCache() {
    return localStorage.getItem(WORDS_CACHE_KEY) !== null;
}