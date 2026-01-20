import crypto from "crypto"

export const hashSecretKey = (key) => {
    return crypto
        .createHmac("sha256", process.env.SECRET_KEY_PEPPER)
        .update(key)
        .digest("hex")
}

export const verifySecretKey = (inputKey, storedHash) => {
    const inputHash = hashSecretKey(inputKey)

    if (inputHash.length !== storedHash.length) return false

    return crypto.timingSafeEqual(
        Buffer.from(inputHash, "hex"),
        Buffer.from(storedHash, "hex")
    )
}
