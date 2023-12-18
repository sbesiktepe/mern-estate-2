import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "mern-estate-myself",
  private_key_id: "2b5582e9c76f1f5272b8815651c2f5f59146ae7b",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDWc2VGUp9zaAmo\nL7p9XRlZr41qnU5oxz8hOb7VuWue8jPmQMLzf10mS8K6aPcF+l8HCXX7eaLesNCa\nylR18mUYFmb+PiF2sRtB5XPwdRcVXVPHtwn1y6Xx7mU0pTS5Zt3dt4WJn2RkimfO\nJfelSzoeXtY9KPlQR6DPbrutFWuXcmhdpdhZBmMfKz+XgGo8eIEofD8DaWOF35UG\nBCVA9QEZXcu56otu6TE0MRel9FZHeLNHpj6YAkd8FnyN36/KZpe+1LUAxkzgGA2x\naDov+mZkF2TyFX5WFfdnci+QI+9+PfYmflnsHS+6Vb/Ev4Wt9JrGm+fhd6OQ2w6b\nodEuWPenAgMBAAECggEAaYMrYBdE1q5omfSpyAanc2YZqUwuiQUHfZyA1X0+g1zd\nxjs08ENJHI+IBtmgOLPAT6ELCKkHRpQufwpv1fxmWxyinhMJufFX3Os9SSEDM4LQ\ntuHLJ8GEK23FI8rpDxOas/0Y2eavqXwjqN0rZIuH0+uLc1oWmLY1W/o6ouV4I3HD\nbc2XM64eHimDod7WzlZStXQefpfHucTV73SPbOMaLLRbr1jjidsDnn87gJZJTCaY\nC95H4B1AdRjfI734cOFhyJD189tC/eJd3HurZyrt4r9FM+EgeaG007hHwSi52wCy\nYf/Q0YTG1Agg6/wH1BTRcHNbogjWKW9qUqeQGnpEQQKBgQDsr6zxAijgHU7QiH53\nl/lncnrLbBDOqP9mtcLMkSBlVGj4gSYUbw0QF+2255rTEXV4lQz6wLcuhIATvEih\nl0UklD/ApqADgrN4vBttis8CH27As9KItkBwWKpAdWraLLGuum7YoAlg6Lpjq2QG\n2JlT7X1ManK1PDKdEWYBxcSShwKBgQDn8znUndLNqFFM+v8+PQYPDOTQsFALV+Gm\n6nJfPbdJ2JwPwrb2DYDE3livz8clZdLMaxRjbZDY0MUlToNC9P3onpd5nQMNtVk/\nJwDSbyYAIilgWImpzof3Oj9R9cMaOiWO8OPXQJ3J5+qZ9+z9sXlexE//GVUx5Cmj\n6er/s9MZ4QKBgEd3wGPBwC/0CZFkNbPM+u0mnzd/eQ+97ejIp3p3s+2E8HFhJetz\noOEkKI5bHt/u3Ka9cv7gZC+yqK3M462PbLxf22RDq/uDYsfpHOsVx+4fKaUcZ00K\noyiJTVdLXSll530YJFJa+Jn/jBB+dySuEJZMFtKVLe/Vrn7I+yE742BPAoGBALhz\nPwXJC53nv99LqjZAKNVHF56s1rpuhE9MGO+MEHl0+4W8/enlCwWDG1uUC3W950gP\nzwLSWmFQg7YLHW7djBy0IRjgt1DrabFCvvCY2ss4X1bykWariowbkccHfMMagkuN\nXGIMTG4HMxSFh7ymqTGnQ0ZFSu6F1mc22V3GDpWBAoGBAIXL2MjTW0bUjnS/TYy8\nUs2gNN5KBp4BG3nNcBXV4EgBDRKObQepn/eL+bnUqmSqZJapjMn41XOEacRD7x6M\nTargR4WjmN6igjZXj+u+8nZHra5HVPwcZjqATE//nBmAvlL7IlHkl+php2ch3Qfv\n5XN/fCWEvy09xEEE1VyHvfGM\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-4dt33@mern-estate-myself.iam.gserviceaccount.com",
  client_id: "111361329295991656375",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4dt33%40mern-estate-myself.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// // Firebase Storage
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://mern-estate-myself.appspot.com",
});
export const bucket = admin.storage().bucket();
