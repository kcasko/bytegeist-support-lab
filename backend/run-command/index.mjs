const scenarios = {
  "dns-001": {
    commands: {
      "ipconfig": `Windows IP Configuration

Ethernet adapter Ethernet:

   IPv4 Address. . . . . . . . . . . : 10.0.0.44
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 10.0.0.1`,

      "ipconfig /all": `Windows IP Configuration

Host Name . . . . . . . . . . . . : ACCT-PC-04
Primary DNS Suffix  . . . . . . . . : bytegeist.local

Ethernet adapter Ethernet:

   DHCP Enabled. . . . . . . . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 10.0.0.44
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 10.0.0.1
   DHCP Server . . . . . . . . . . . : 10.0.0.5
   DNS Servers . . . . . . . . . . . : 10.0.0.53`,

      "ping 8.8.8.8": `Pinging 8.8.8.8 with 32 bytes of data:

Reply from 8.8.8.8: bytes=32 time=18ms TTL=117
Reply from 8.8.8.8: bytes=32 time=17ms TTL=117
Reply from 8.8.8.8: bytes=32 time=19ms TTL=117
Reply from 8.8.8.8: bytes=32 time=18ms TTL=117

Ping statistics for 8.8.8.8:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,

      "ping fileserver01": `Ping request could not find host FILESERVER01.
Please check the name and try again.`,

      "ping 10.0.0.20": `Pinging 10.0.0.20 with 32 bytes of data:

Reply from 10.0.0.20: bytes=32 time<1ms TTL=128
Reply from 10.0.0.20: bytes=32 time<1ms TTL=128
Reply from 10.0.0.20: bytes=32 time<1ms TTL=128
Reply from 10.0.0.20: bytes=32 time<1ms TTL=128

Ping statistics for 10.0.0.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,

      "nslookup fileserver01": `DNS request timed out.
    timeout was 2 seconds.
Server:  Unknown
Address:  10.0.0.53

DNS request timed out.`,

      "nslookup google.com": `DNS request timed out.
    timeout was 2 seconds.
Server:  Unknown
Address:  10.0.0.53

DNS request timed out.`,
    },
  },
};

function normalizeCommand(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export const handler = async (event) => {
  try {
    const scenarioId = event.pathParameters?.id;
    const body = JSON.parse(event.body || "{}");
    const command = body.command;

    if (!scenarioId) {
      return response(400, {
        error: "Scenario ID is required.",
      });
    }

    if (!command || typeof command !== "string") {
      return response(400, {
        error: "Command is required.",
      });
    }

    const scenario = scenarios[scenarioId];

    if (!scenario) {
      return response(404, {
        error: "Scenario not found.",
      });
    }

    const normalizedCommand = normalizeCommand(command);

    const output =
      scenario.commands[normalizedCommand] ??
      `'${command.trim()}' is not available in this training environment.

Try commands such as:
ipconfig /all
ping 8.8.8.8
ping fileserver01
nslookup fileserver01`;

    return response(200, {
      scenarioId,
      command: command.trim(),
      output,
    });
  } catch (error) {
    console.error(error);

    return response(500, {
      error: "Internal server error.",
    });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}