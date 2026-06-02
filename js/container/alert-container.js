export function alertContainer(message) {
    const existingAlert = document.querySelector(
        ".alert-container"
    );

    if (existingAlert) {
        existingAlert.remove();
    }

    const container = document.createElement("div");
    container.classList.add("alert-container");

    const text = document.createElement("p");
    text.textContent = message;

    container.appendChild(text);

    setTimeout(() => {
        container.remove();
    }, 3000);

    return container;
}