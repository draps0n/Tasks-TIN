"use strict";

const http = require("http");
const url = require("url");

const PORT = 8080;
const OPERATIONS = {
  "/dodaj": {
    operator: "+",
    operation: (x, y) => x + y,
  },
  "/odejmij": {
    operator: "-",
    operation: (x, y) => x - y,
  },
  "/pomnoz": {
    operator: "*",
    operation: (x, y) => x * y,
  },
  "/podziel": {
    operator: "/",
    operation: (x, y) => {
      if (y === 0) {
        throw new Error("Nie można dzielić przez zero");
      }
      return x / y;
    },
  },
};

function validateRequest(req, parsedUrl) {
  if (req.method !== "GET") {
    return {
      code: 405,
      status: "405 Method Not Allowed",
      message: "Metoda nieobsługiwana. Obsługiwana jest tylko metoda GET.",
    };
  }
  if (!parsedUrl.pathname) {
    return {
      code: 400,
      status: "400 Bad Request",
      message: "Nieprawidłowy URL",
    };
  }
  if (!OPERATIONS[parsedUrl.pathname]) {
    return {
      code: 404,
      status: "404 Not Found",
      message: "Nie znaleziono żądanego zasobu",
    };
  }

  const x = parseFloat(parsedUrl.query.x);
  const y = parseFloat(parsedUrl.query.y);
  if (isNaN(x) || isNaN(y)) {
    return {
      code: 400,
      status: "400 Bad Request",
      message: "Podane wartości nie są liczbami",
    };
  }
  return null;
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
        </style>
    </head>
    <body>
        ${body}
    </body>
    </html>
  `;
}

function generateResultHtml(x, y, operator, result) {
  const body = `
    <h1>Wynik</h1>
    <p>${x} ${operator} ${y} = ${result}</p>
  `;
  return getHtmlTemplate("Wynik obliczeń", body);
}

function generateErrorHtml(status, message) {
  const body = `
    <h1 class="error">${status}</h1>
    <p>${message}</p>
  `;
  return getHtmlTemplate("Błąd", body);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const reqValidationError = validateRequest(req, parsedUrl);
  if (reqValidationError) {
    res.writeHead(reqValidationError.code, { "Content-Type": "text/html" });
    res.end(
      generateErrorHtml(
        `HTTP/1.1 ${reqValidationError.status}`,
        reqValidationError.message
      )
    );
    return;
  }

  const x = parseFloat(parsedUrl.query.x);
  const y = parseFloat(parsedUrl.query.y);
  const { operator, operation } = OPERATIONS[parsedUrl.pathname];
  try {
    const result = operation(x, y);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(generateResultHtml(x, y, operator, result));
  } catch (error) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(generateErrorHtml("HTTP/1.1 400 Bad Request", error.message));
  }
});

server.listen(PORT, () => {
  console.log(`Serwer działa na porcie http://localhost:${PORT}`);
});
