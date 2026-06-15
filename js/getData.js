const WORDS_CACHE_KEY = "words_";
const WORDS_SOURCE_PATH = "./json/wordList.json";

/**
 * Carga y almacena las palabras en caché si aún no existen.
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

        saveWords(data.words_);
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
 * Guarda las palabras en caché.
 *
 * @param {string[]} words
 */
function saveWords(words) {
    localStorage.setItem(
        WORDS_CACHE_KEY,
        JSON.stringify(words)
    );
}

/**
 * Indica si existe una caché válida.
 *
 * @returns {boolean}
 */
function hasWordsCache() {
    return localStorage.getItem(WORDS_CACHE_KEY) !== null;
}


/**
 * Se borra la data antigua y se setea la nueva
 */

export function clearData(){
    localStorage.clear();
    setDataToGeneratePassword();
}