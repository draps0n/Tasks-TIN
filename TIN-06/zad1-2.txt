const http = require("http");
const fs = require("node:fs");

const endpoints = {
  "/": {
    method: "GET",
    handler: handleIndexEndpoint,
  },
  "/form": {
    method: "GET",
    handler: handleFormEndpoint,
  },
  "/form-2": {
    method: "GET",
    handler: (req, res) => {
      handleFormEndpoint(req, res, "/submit-2");
    },
  },
  "/submit": {
    method: "POST",
    handler: handleSubmitEndpoint,
  },
  "/submit-2": {
    method: "POST",
    handler: (req, res) => {
      handleSubmitEndpoint(req, res, true);
    },
  },
};

const errors = {
  404: "Not Found",
  405: "Method Not Allowed",
  500: "Internal Server Error",
};

function handleIndexEndpoint(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(generateHtmlIndex());
}

function handleFormEndpoint(req, res, addressToSubmit = "/submit") {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(generateHtmlForm(addressToSubmit));
}

function handleSubmitEndpoint(req, res, saveToFile = false) {
  let data = "";
  req.on("data", (chunk) => (data += chunk));
  req.on("end", () => {
    const name = new URLSearchParams(data).get("name");
    if (saveToFile) {
      try {
        fs.writeFileSync("./result.txt", name);
      } catch (err) {
        console.error(err);
      }
      res.writeHead(302, { Location: "/form" });
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(generateHtmlResponse(name));
    }
  });
}

function handleError(res, code, message) {
  res.writeHead(code, { "Content-Type": "text/html" });
  res.end(generateHtmlError(`HTTP/1.1 ${code} ${errors[code]}`, message));
}

function getHtmlTemplate(title, body) {
  return `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            body { 
                margin-top: 50px;
                font-family: Arial, sans-serif;
                text-align: center;
                color: #2e2e2e;
                background-color: #f1f1f1;
                font-size: 1.5rem;
            }
            h1 {
                color: #2c3e50;
            }
            .error {
                color: #c0392b;
            }
            form {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            label, input[type="text"] {
                margin-bottom: 0.5rem;
            }
            input[type="submit"] {
                margin-top: 0.5rem;
            }
            .center {
                text-align: center;
            }
            ul {
                display: inline-block;
            }
          </style>
      </head>
      <body>
          ${body}
      </body>
      </html>
    `;
}

function generateHtmlIndex() {
  const body = `
    <h1>Strona główna</h1>
    <p>Witamy na stronie!</p>
    <div class="center">
      <ul>
        <li><a href="/form">Formularz 1</a></li>
        <li><a href="/form-2">Formularz 2</a></li>
      </ul>
    </div>
  `;
  return getHtmlTemplate("Strona główna", body);
}

function generateHtmlForm(addressToSubmit) {
  const body = `
    <h1>Formularz na ${addressToSubmit}</h1>
    <form action="${addressToSubmit}" method="post">
        <label for="name">Podaj swoje imię:</label>
        <input type="text" name="name" required>
        <input type="submit" value="Submit">
    </form>`;
  return getHtmlTemplate("Formularz", body);
}

function generateHtmlError(status, message) {
  const body = `
      <h1 class="error">${status}</h1>
      <p>${message}</p>
    `;
  return getHtmlTemplate("Błąd", body);
}

function generateHtmlResponse(name) {
  const body = `
  <h1>Wprowadzone dane</h1>
  <p>Użytkownik podał: <strong>${name}</strong>!</p>
  `;
  return getHtmlTemplate("Co wpisano?", body);
}

const server = http.createServer((req, res) => {
  let endpoint = endpoints[req.url];
  if (!endpoint) {
    handleError(res, 404, "Nie znaleziono szukanego zasobu");
    return;
  }
  if (endpoint.method !== req.method) {
    handleError(
      res,
      405,
      `Metoda ${req.method} nie jest obsługiwana dla tego endpointu`
    );
    return;
  }

  endpoint.handler(req, res);
});

const port = 8080;
server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
