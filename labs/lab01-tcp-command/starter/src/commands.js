export function handleCommand(line) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
        return "ERROR empty command";
    }

    const [command, ...parts] = trimmed.split(" ");
    const argument = parts.join(" ");

    switch (command.toUpperCase()) {
        case "ECHO":
            return argument;

        case "UPPER":
            return argument.toUpperCase();
        
        case "LOWER":
            return argument.toLowerCase();

        case "REVERSE":
            return reverseString(argument);

        case "TIME":
            const serverTime = new Date(Date.now())
            return serverTime.toString();

        case "QUIT":
            return "Goodbye.";

        default:
            return `ERROR unknown command: ${command}`;
    }
}

export function shouldCloseConnection(line) {
    return line.trim().toUpperCase() === "QUIT";
}

function reverseString(string) {
    var reversedStr = string.slice(-1)
    for (let index = 1; index < string.length; index++) {
        reversedStr += string.slice(-index-1, -index)
    }
    return reversedStr;
}