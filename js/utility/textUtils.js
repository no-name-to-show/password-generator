const LEET_REPLACEMENTS = {
    a: "4",
    e: "3",
    i: "1",
    o: "0",
};

const PASSWORD_SYMBOLS = ["@", "#", "$", "%", "&", "*"];

const MIN_PASSWORD_LENGTH = 12;
const UPPERCASE_PROBABILITY = 0.3;

/**
 * Genera una contraseña basada en palabras aleatorias.
 *
 * @param {string[]} words
 * @returns {string}
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
 * Obtiene una palabra aleatoria del listado.
 *
 * @param {string[]} words
 * @returns {string}
 */
function getRandomWord(words) {
    return words[Math.floor(Math.random() * words.length)];
}

/**
 * Aplica sustituciones tipo leet.
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
 * Inserta un símbolo aleatorio en una posición aleatoria.
 *
 * @param {string} value
 * @returns {string}
 */
function insertRandomSymbol(value) {
    const symbol = getRandomItem(PASSWORD_SYMBOLS);
    const position = Math.floor(Math.random() * (value.length + 1));

    return value.slice(0, position) + symbol + value.slice(position);
}

/**
 * Convierte caracteres aleatorios a mayúscula.
 *
 * @param {string} value
 * @param {number} probability
 * @returns {string}
 */
function applyRandomUppercase(
    value,
    probability = UPPERCASE_PROBABILITY
) {
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
 * Obtiene un elemento aleatorio de un arreglo.
 *
 * @template T
 * @param {T[]} items
 * @returns {T}
 */
function getRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

/**
 * Valida la colección de palabras.
 *
 * @param {string[]} words
 */
function validateWords(words) {
    if (!Array.isArray(words) || words.length === 0) {
        throw new Error(
            "Se requiere un arreglo de palabras no vacío."
        );
    }
}