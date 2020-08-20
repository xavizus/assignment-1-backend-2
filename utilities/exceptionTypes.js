class MissingKeysError extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingKeysError";
    }
}

module.exports = {
    MissingKeysError
}