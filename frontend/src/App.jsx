import { useEffect, useRef, useState } from "react";
import { scenarios } from "./data/scenarios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState(null);
  const [isRunningCommand, setIsRunningCommand] = useState(false);

  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  function startScenario(scenario) {
    setActiveScenario(scenario);
    setCommand("");
    setHistory([]);
    setDiagnosis("");
    setSolution("");
    setResult(null);
    setIsRunningCommand(false);
  }

  function returnHome() {
    setActiveScenario(null);
    setCommand("");
    setHistory([]);
    setDiagnosis("");
    setSolution("");
    setResult(null);
    setIsRunningCommand(false);
  }

  function normalizeCommand(value) {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
  }

  async function runCommand(event) {
    event.preventDefault();

    const submittedCommand = command.trim();

    if (!submittedCommand || isRunningCommand) {
      return;
    }

    setCommand("");
    setIsRunningCommand(true);

    try {
      const response = await fetch(
        `${API_URL}/scenarios/${activeScenario.id}/command`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            command: submittedCommand,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      setHistory((currentHistory) => [
        ...currentHistory,
        {
          command: submittedCommand,
          output: data.output,
        },
      ]);
    } catch (error) {
      console.error("Command request failed:", error);

      setHistory((currentHistory) => [
        ...currentHistory,
        {
          command: submittedCommand,
          output: `Unable to contact the ByteGeist training server.

Please try again.`,
        },
      ]);
    } finally {
      setIsRunningCommand(false);
    }
  }

  function calculateScore() {
    const normalizedDiagnosis = diagnosis.toLowerCase();
    const normalizedSolution = solution.toLowerCase();

    const diagnosisMatches = activeScenario.diagnosisKeywords.filter(
      (keyword) => normalizedDiagnosis.includes(keyword),
    );

    const solutionMatches = activeScenario.solutionKeywords.filter((keyword) =>
      normalizedSolution.includes(keyword),
    );

    const commandsUsed = history.map((entry) =>
      normalizeCommand(entry.command),
    );

    const recommendedCommandsUsed =
      activeScenario.recommendedCommands.filter((recommendedCommand) =>
        commandsUsed.includes(recommendedCommand),
      );

    let diagnosisScore = 0;

    if (diagnosisMatches.length >= 2) {
      diagnosisScore = 50;
    } else if (diagnosisMatches.length === 1) {
      diagnosisScore = 35;
    }

    let solutionScore = 0;

    if (solutionMatches.length >= 3) {
      solutionScore = 30;
    } else if (solutionMatches.length === 2) {
      solutionScore = 20;
    } else if (solutionMatches.length === 1) {
      solutionScore = 10;
    }

    const troubleshootingScore = Math.min(
      recommendedCommandsUsed.length * 5,
      20,
    );

    return {
      total: diagnosisScore + solutionScore + troubleshootingScore,
      diagnosisScore,
      solutionScore,
      troubleshootingScore,
      commandsUsed: recommendedCommandsUsed.length,
    };
  }

  function submitDiagnosis(event) {
    event.preventDefault();

    if (!diagnosis.trim() || !solution.trim()) {
      return;
    }

    setResult(calculateScore());
  }

  if (!activeScenario) {
    return (
      <main className="app-shell">
        <header className="hero">
          <p className="eyebrow">BYTEGEIST</p>

          <h1>Support Lab</h1>

          <p className="hero-copy">
            Practice real-world IT troubleshooting by investigating simulated
            support incidents.
          </p>
        </header>

        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">TRAINING QUEUE</p>
              <h2>Available Incidents</h2>
            </div>

            <span>{scenarios.length} available</span>
          </div>

          <div className="scenario-grid">
            {scenarios.map((scenario) => (
              <article className="scenario-card" key={scenario.id}>
                <div className="ticket-row">
                  <span>{scenario.ticketNumber}</span>
                  <span className="difficulty">{scenario.difficulty}</span>
                </div>

                <h3>{scenario.title}</h3>

                <p>{scenario.category}</p>

                <p className="scenario-description">{scenario.issue}</p>

                <button onClick={() => startScenario(scenario)}>
                  Start Incident
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (result) {
    return (
      <main className="app-shell">
        <button className="text-button" onClick={returnHome}>
          ← Incident Queue
        </button>

        <section className="results-card">
          <p className="eyebrow">{activeScenario.ticketNumber}</p>

          <h1>Incident Review</h1>

          <div className="score">{result.total}/100</div>

          <div className="score-breakdown">
            <div>
              <span>Diagnosis</span>
              <strong>{result.diagnosisScore}/50</strong>
            </div>

            <div>
              <span>Resolution</span>
              <strong>{result.solutionScore}/30</strong>
            </div>

            <div>
              <span>Troubleshooting</span>
              <strong>{result.troubleshootingScore}/20</strong>
            </div>
          </div>

          <div className="review-section">
            <h2>Your diagnosis</h2>
            <p>{diagnosis}</p>
          </div>

          <div className="review-section">
            <h2>Your resolution</h2>
            <p>{solution}</p>
          </div>

          <div className="review-section answer">
            <h2>Expected root cause</h2>
            <p>{activeScenario.expectedDiagnosis}</p>
          </div>

          <div className="review-section answer">
            <h2>Recommended resolution</h2>
            <p>{activeScenario.expectedSolution}</p>
          </div>

          <button onClick={() => startScenario(activeScenario)}>
            Retry Incident
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <button className="text-button" onClick={returnHome}>
        ← Incident Queue
      </button>

      <section className="ticket-panel">
        <div className="ticket-row">
          <span>{activeScenario.ticketNumber}</span>
          <span className="difficulty">{activeScenario.difficulty}</span>
        </div>

        <h1>{activeScenario.title}</h1>

        <div className="ticket-details">
          <div>
            <span>User</span>
            <strong>{activeScenario.user.name}</strong>
          </div>

          <div>
            <span>Department</span>
            <strong>{activeScenario.user.department}</strong>
          </div>

          <div>
            <span>Computer</span>
            <strong>{activeScenario.user.computer}</strong>
          </div>
        </div>

        <div className="issue-box">
          <h2>Reported issue</h2>
          <p>{activeScenario.issue}</p>
        </div>

        <p className="objective">{activeScenario.objective}</p>
      </section>

      <section className="terminal-panel">
        <div className="terminal-header">
          <span>{activeScenario.user.computer}</span>
          <span>Windows PowerShell</span>
        </div>

        <div className="terminal-output" ref={terminalRef}>
          <div className="terminal-entry">
            <p>
              ByteGeist Support Lab Terminal
              <br />
              Type troubleshooting commands below.
            </p>
          </div>

          {history.map((entry, index) => (
            <div className="terminal-entry" key={index}>
              <p className="terminal-command">
                C:\Users\sarah&gt; {entry.command}
              </p>

              <pre>{entry.output}</pre>
            </div>
          ))}
        </div>

        <form className="terminal-input-row" onSubmit={runCommand}>
          <span>C:\Users\sarah&gt;</span>

          <input
            autoFocus
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            aria-label="Terminal command"
            autoComplete="off"
            spellCheck="false"
            disabled={isRunningCommand}
          />

          {isRunningCommand && (
            <span className="terminal-status">Running...</span>
          )}
        </form>
      </section>

      <section className="diagnosis-panel">
        <h2>Resolve Incident</h2>

        <form onSubmit={submitDiagnosis}>
          <label htmlFor="diagnosis">What is the root cause?</label>

          <textarea
            id="diagnosis"
            value={diagnosis}
            onChange={(event) => setDiagnosis(event.target.value)}
            placeholder="Describe what you believe is causing the problem..."
            required
          />

          <label htmlFor="solution">How would you fix it?</label>

          <textarea
            id="solution"
            value={solution}
            onChange={(event) => setSolution(event.target.value)}
            placeholder="Describe the steps you would take to resolve the incident..."
            required
          />

          <button type="submit">Submit Resolution</button>
        </form>
      </section>
    </main>
  );
}

export default App;