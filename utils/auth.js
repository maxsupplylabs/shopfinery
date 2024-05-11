import { SignJWT, jwtVerify } from "jose";
// import { verify, errors as joseErrors } from "jose";

// const { JWTExpired } = joseErrors;

const eky = "f1a2c3e4f5a6b7c8d9e0f1a2c3e4f5a6b7c8d9e0f1a2c3e4f5a6b7c8d9e0f1a2";

// Convert hexadecimal string to Uint8Array
const keyBuffer = Buffer.from(eky, "hex");
const secretKey = new Uint8Array(keyBuffer);

export async function createToken(payload) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("hostme.com") // Replace with your actual issuer
    .setAudience("user") // Replace with your actual audience
    .sign(secretKey);

  return jwt;
}

export async function readToken(token) {
  try {
    const { payload, protectedHeader } = await jwtVerify(token, secretKey, {
      issuer: "hostme.com",
      audience: "user",
    });
    // Access the decoded payload and protected header
    // console.log("Decoded Payload:", payload);
    // console.log("Protected Header:", protectedHeader);

    return payload;
  } catch (error) {
    if (error instanceof JWTExpired) {
      console.error("Token has expired");
    } else {
      console.error("Error verifying token:", error);
    }

    throw error;
  }
}
