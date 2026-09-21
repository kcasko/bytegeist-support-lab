import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState(null);

  const [isRunningCommand, setIsRunningCommand] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [availableScenarios, setAvailableScenarios] = useState([]);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(true);
  const [scenarioLoadError, setScenarioLoadError] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");

  const terminalRef = useRef(null);
  const commandInputRef = useRef(null);

  useEffect(() => {
    async function loadScenarios() {
      try {
        const response = await fetch(`${API_URL}/scenarios`);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        setAvailableScenarios(data.scenarios ?? []);
        setScenarioLoadError("");
      } catch (error) {
        console.error("Unable to load scenarios:", error);

        setScenarioLoadError(
          "Unable to load training incidents. Please try again.",
        );
      } finally {
        setIsLoadingScenarios(false);
      }
    }

    loadScenarios();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  async function startScenarioFromQueue(scenarioSummary) {
    try {
      setScenarioLoadError("");

      const response = await fetch(
        `${API_URL}/scenarios/${scenarioSummary.scenarioId}`,
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const scenario = await response.json();

      startScenario({
        ...scenario,
        id: scenario.scenarioId,
      });
    } catch (error) {
      console.error("Unable to load scenario:", error);

      setScenarioLoadError(
        "Unable to open this training incident. Please try again.",
      );
    }
  }

  function startScenario(scenario) {
    setActiveScenario(scenario);
    setCommand("");
    setHistory([]);
    setDiagnosis("");
    setSolution("");
    setResult(null);
    setSubmissionMessage("");
    setIsRunningCommand(false);
    setIsSubmitting(false);
  }

  function returnHome() {
    setActiveScenario(null);
    setCommand("");
    setHistory([]);
    setDiagnosis("");
    setSolution("");
    setResult(null);
    setSubmissionMessage("");
    setIsRunningCommand(false);
    setIsSubmitting(false);
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

      requestAnimationFrame(() => {
        commandInputRef.current?.focus();
      });
    }
  }

  async function submitDiagnosis(event) {
    event.preventDefault();

    if (
      !diagnosis.trim() ||
      !solution.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionMessage("");

    try {
      const response = await fetch(
        `${API_URL}/scenarios/${activeScenario.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            diagnosis: diagnosis.trim(),
            solution: solution.trim(),
            commandsUsed: history.map((entry) => entry.command),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error("Unable to submit incident:", error);

      setSubmissionMessage(
        "Unable to score this incident. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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

            <span>{availableScenarios.length} available</span>
          </div>

          {isLoadingScenarios && (
            <p className="loading-message">Loading incidents...</p>
          )}

          {scenarioLoadError && (
            <p className="error-message">{scenarioLoadError}</p>
          )}

          {!isLoadingScenarios && !scenarioLoadError && (
            <div className="scenario-grid">
              {availableScenarios.map((scenario) => (
                <article
                  className="scenario-card"
                  key={scenario.scenarioId}
                >
                  <div className="ticket-row">
                    <span>{scenario.ticketNumber}</span>
                    <span className="difficulty">
                      {scenario.difficulty}
                    </span>
                  </div>

                  <h3>{scenario.title}</h3>

                  <p>{scenario.category}</p>

                  <p className="scenario-description">
                    {scenario.issue}
                  </p>

                  <button
                    onClick={() => startScenarioFromQueue(scenario)}
                  >
                    Start Incident
                  </button>
                </article>
              ))}
            </div>
          )}
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

          {result.expectedDiagnosis && (
            <div className="review-section answer">
              <h2>Expected root cause</h2>
              <p>{result.expectedDiagnosis}</p>
            </div>
          )}

          {result.expectedSolution && (
            <div className="review-section answer">
              <h2>Recommended resolution</h2>
              <p>{result.expectedSolution}</p>
            </div>
          )}

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
          <span className="difficulty">
            {activeScenario.difficulty}
          </span>
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
                C:\Users\{activeScenario.user.username}&gt;{" "}
                {entry.command}
              </p>

              <pre>{entry.output}</pre>
            </div>
          ))}
        </div>

        <form className="terminal-input-row" onSubmit={runCommand}>
          <span>
            C:\Users\{activeScenario.user.username}&gt;
          </span>

          <input
            ref={commandInputRef}
            autoFocus
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            aria-label="Terminal command"
            autoComplete="off"
            spellCheck="false"
            readOnly={isRunningCommand}
          />

          {isRunningCommand && (
            <span className="terminal-status">Running...</span>
          )}
        </form>
      </section>

      <section className="diagnosis-panel">
        <h2>Resolve Incident</h2>

        <form onSubmit={submitDiagnosis}>
          <label htmlFor="diagnosis">
            What is the root cause?
          </label>

          <textarea
            id="diagnosis"
            value={diagnosis}
            onChange={(event) => {
              setDiagnosis(event.target.value);
              setSubmissionMessage("");
            }}
            placeholder="Describe what you believe is causing the problem..."
            required
          />

          <label htmlFor="solution">
            How would you fix it?
          </label>

          <textarea
            id="solution"
            value={solution}
            onChange={(event) => {
              setSolution(event.target.value);
              setSubmissionMessage("");
            }}
            placeholder="Describe the steps you would take to resolve the incident..."
            required
          />

          {submissionMessage && (
            <p className="error-message">{submissionMessage}</p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Scoring..." : "Submit Resolution"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;