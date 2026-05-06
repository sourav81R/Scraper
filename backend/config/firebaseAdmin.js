const jwt = require("jsonwebtoken");

const FIREBASE_CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

let cachedCerts = null;
let certsExpireAt = 0;

const isMissingOrPlaceholder = (value) => {
  if (!value) {
    return true;
  }

  const normalizedValue = value.trim();

  return (
    normalizedValue.length === 0 ||
    normalizedValue.includes("your_firebase") ||
    normalizedValue.includes("your-project-id")
  );
};

const getProjectId = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  return isMissingOrPlaceholder(projectId) ? "" : projectId;
};

const getCacheMaxAgeSeconds = (cacheControlHeader) => {
  if (!cacheControlHeader) {
    return 3600;
  }

  const match = cacheControlHeader.match(/max-age=(\d+)/i);
  return match ? Number.parseInt(match[1], 10) : 3600;
};

const getFirebaseCerts = async () => {
  if (cachedCerts && Date.now() < certsExpireAt) {
    return cachedCerts;
  }

  const response = await fetch(FIREBASE_CERTS_URL);

  if (!response.ok) {
    throw new Error("Unable to fetch Firebase public certificates");
  }

  const certs = await response.json();
  const cacheMaxAgeSeconds = getCacheMaxAgeSeconds(
    response.headers.get("cache-control")
  );

  cachedCerts = certs;
  certsExpireAt = Date.now() + cacheMaxAgeSeconds * 1000;

  return certs;
};

const verifyFirebaseToken = async (idToken) => {
  const projectId = getProjectId();

  if (!projectId) {
    throw new Error("Firebase project ID is not configured");
  }

  const decoded = jwt.decode(idToken, { complete: true });

  if (!decoded?.header || !decoded?.payload) {
    throw new Error("Invalid Firebase ID token");
  }

  if (decoded.header.alg !== "RS256" || !decoded.header.kid) {
    throw new Error("Invalid Firebase token header");
  }

  const certs = await getFirebaseCerts();
  const signingCert = certs[decoded.header.kid];

  if (!signingCert) {
    throw new Error("Firebase signing certificate not found");
  }

  const verifiedPayload = jwt.verify(idToken, signingCert, {
    algorithms: ["RS256"],
  });

  if (verifiedPayload.aud !== projectId) {
    throw new Error("Firebase token has an invalid audience");
  }

  if (verifiedPayload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new Error("Firebase token has an invalid issuer");
  }

  if (!verifiedPayload.sub || typeof verifiedPayload.sub !== "string") {
    throw new Error("Firebase token subject is invalid");
  }

  if (
    typeof verifiedPayload.auth_time !== "number" ||
    verifiedPayload.auth_time > Math.floor(Date.now() / 1000)
  ) {
    throw new Error("Firebase token auth_time is invalid");
  }

  return {
    uid: verifiedPayload.user_id || verifiedPayload.sub,
    email: verifiedPayload.email,
    name: verifiedPayload.name,
    picture: verifiedPayload.picture,
    ...verifiedPayload,
  };
};

const isFirebaseAuthConfigured = () => Boolean(getProjectId());

module.exports = { verifyFirebaseToken, isFirebaseAuthConfigured };
