# Debug 403 Error

Jalankan script berikut di **browser console** (F12 → Console tab):

```javascript
// 1. Check localStorage
const authUser = localStorage.getItem("auth_user");
const user = JSON.parse(authUser || "{}");
const TOKEN_KEYS = ["token", "accessToken", "authToken", "access_token", "bearerToken"];

function findToken(obj, depth = 3) {
  if (!obj || typeof obj !== "object") return null;
  for (const key of Object.keys(obj)) {
    if (TOKEN_KEYS.includes(key)) {
      return obj[key];
    }
  }
  if (depth <= 0) return null;
  for (const nested of Object.values(obj)) {
    if (typeof nested === "object" && nested !== null) {
      const token = findToken(nested, depth - 1);
      if (token) return token;
    }
  }
  return null;
}

const token = findToken(user, 4);

// 2. Test API call with Authorization header
const testPayload = new FormData();
testPayload.append("namaShelter", "Test");
testPayload.append("deskripsi", "Test Desc");
testPayload.append("metodePembayaran", "mandiri");
testPayload.append("nomorRekening", "123");
testPayload.append("namaPemilikRekening", "Name");
testPayload.append("alamatLengkap", "Address");

const blob = new Blob(["test"], { type: "image/png" });
testPayload.append("logo", blob, "test.png");

fetch("/shelter/create", {
  method: "POST",
  headers: token ? { "Authorization": `Bearer ${token}` } : {},
  body: testPayload
})
.then(r => r.json())
.then(data => {
  const debugOutput = {
    localStorage_auth_user: authUser ? JSON.parse(authUser) : null,
    token_found: token ? true : false,
    token_value: token || null,
    api_response: data
  };
  console.log(JSON.stringify(debugOutput, null, 2));
})
.catch(err => {
  console.log(JSON.stringify({
    error: err.message,
    localStorage_auth_user: authUser ? JSON.parse(authUser) : null,
    token_found: token ? true : false
  }, null, 2));
});
```

Kirimkan hasil output dari console ke sini, terutama:
- Apa isi `localStorage.auth_user`?
- Token di-extract dengan benar?
- Response dari test fetch?
