import http from "node:http";

const DEFAULT_PORT = 3000;

let requestCount = 0;
let requestCountsPerRoute = {
    health: 0,
    echo: 0,
    calculate: 0,
    requests: 0
}

export function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(body));
}

export function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            if (body.trim() === "") {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
}

export function handleCalculate(body) {
    const operation = body.operation
    if ( operation === "" ) {
        return {
            statusCode: 400,
            response: {
                error: "operation required for calulation"
            }
        }
    }

    const operandA = body.a
    const operandB = body.b
    if ("a" in body) {
        if (isNaN(operandA)) {
            return {
                statusCode: 400,
                response: {
                    error: "operand a must be number"
                }
            }
        }
    } else {
        return {
            statusCode: 200,
            response: {
                error: "operand a required for calulation"
            }
        }
    }
    
    if ("b" in body) {
        if (isNaN(operandB)) {
            return {
                statusCode: 400,
                response: {
                    error: "operand b must be number"
                }
            }
        }
    } else {
        return {
            statusCode: 400,
            response: {
                error: "operand b required for calulation"
            }
        }
    }
    

    switch (operation) {
        case "add":
            var operationRes = operandA + operandB
            return {
                statusCode: 200,
                response: { 
                    result: operationRes
                }
            }
            break;
        case "subtract":
            var operationRes = operandA - operandB
            return {
                statusCode: 200,
                response: { 
                    result: operationRes
                }
            }
            break;
        case "subtract":
            var operationRes = operandA - operandB
            return {
                statusCode: 200,
                response: { 
                    result: operationRes
                }
            }
            break;
        case "multiply":
            var operationRes = operandA * operandB
            return {
                statusCode: 200,
                response: { 
                    result: operationRes
                }
            }
            break;
        case "divide":
            if (operandB === 0) {
                return {
                    statusCode: 400,
                    response: {
                        error: "Cannot divide by 0"
                    }
                }
            }
            var operationRes = operandA / operandB
            return {
                statusCode: 200,
                response: { 
                    result: operationRes
                }
            }
            break;

        default:
            return {
                statusCode: 400,
                response: {
                    error: "Unsupported operation"
                }
        }
    };

}

export async function requestHandler(req, res) {
    requestCount += 1;

    const method = req.method;
    const url = req.url;

    if (method === "GET" && url === "/health") {
        requestCountsPerRoute.health += 1;
        sendJson(res, 200, { status: "ok" });
        return;
    }
    
    if (method === "GET" && url === "/requests") {
        requestCountsPerRoute.requests += 1;
        sendJson(res, 200, { count: requestCount, perRoute: requestCountsPerRoute });
        return;
    }
    
    if (method === "POST" && url === "/echo") {
        requestCountsPerRoute.echo += 1;
        try {
            const body = await readJsonBody(req);
            
            sendJson(res, 200, body );
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }
        
        return;
    }
    
    if (method === "POST" && url === "/calculate") {
        requestCountsPerRoute.calculate += 1;
        try {
            const body = await readJsonBody(req);
            const result = handleCalculate(body);

            sendJson(res, result.statusCode, result.response);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    sendJson(res, 404, { error: "Not found" });
}

export function createServer() {
    return http.createServer(requestHandler);
}

export function resetState() {
    requestCount = 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const port = process.env.PORT || DEFAULT_PORT;
    const server = createServer();

    server.listen(port, () => {
        console.log(`HTTP JSON server listening on port ${port}`);
    });
}