import crypto from "crypto"

const hashSecretKey = (key) => {
    return crypto
        .createHmac("sha256", process.env.SECRET_KEY_PEPPER)
        .update(key)
        .digest("hex")
}

export default hashSecretKey
