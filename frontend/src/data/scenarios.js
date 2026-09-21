export const scenarios = [
  {
    id: "dns-001",
    ticketNumber: "INC-1001",
    title: "The Missing File Server",
    category: "Windows / Networking",
    difficulty: "Beginner",

    user: {
      name: "Sarah Miller",
      department: "Accounting",
      computer: "ACCT-PC-04",
    },

    issue:
      "Sarah can browse the internet, but she cannot access FILESERVER01 by hostname. Other employees can access FILESERVER01 normally.",

    objective:
      "Investigate the workstation, identify the root cause, and recommend a fix.",

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

      "ping 10.0.0.20": `Pinging 10.0.0.20 with 32 bytes of data:

Reply from 10.0.0.20: bytes=32 time<1ms TTL=128
Reply from 10.0.0.20: bytes=32 time<1ms TTL=128
Reply from 10.0.0.20: bytes=32 time<1ms TTL=128
Reply from 10.0.0.20: bytes=32 time<1ms TTL=128

Ping statistics for 10.0.0.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
    },

    expectedDiagnosis:
      "The workstation is configured to use an unreachable or incorrect DNS server.",

    expectedSolution:
      "Correct the workstation DNS configuration or renew its DHCP configuration so it receives the proper DNS server.",

    diagnosisKeywords: ["dns", "dns server", "name resolution", "10.0.0.53"],

    solutionKeywords: [
      "dns",
      "dhcp",
      "renew",
      "correct",
      "change",
      "server",
      "configuration",
    ],

    recommendedCommands: [
      "ping 8.8.8.8",
      "ping fileserver01",
      "nslookup fileserver01",
      "ipconfig /all",
    ],
  },
];