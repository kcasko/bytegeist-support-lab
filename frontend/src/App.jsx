import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [activeScenario, setActiveScenario] = useState(null);

  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);

  const [diagnosis, setDiagnosis] = useState("");
  const [solution, setSolution] = useState("");

  const [result, setResult] = useState(null);

  const [isRunningCommand, setIsRunningCommand] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [
    availableScenarios,
    setAvailableScenarios,
  ] = useState([]);

  const [
    isLoadingScenarios,
    setIsLoadingScenarios,
  ] = useState(true);

  const [
    scenarioLoadError,
    setScenarioLoadError,
  ] = useState("");

  const [
    submissionMessage,
    setSubmissionMessage,
  ] = useState("");

  // -----------------------------------------
  // Tutor session state
  // -----------------------------------------

  const [sessionId, setSessionId] =
    useState("");

  const [
    isStartingSession,
    setIsStartingSession,
  ] = useState(false);

  const [sessionError, setSessionError] =
    useState("");

  const [hintLevel, setHintLevel] =
    useState(1);

  // -----------------------------------------
  // AI Coach state
  // -----------------------------------------

  const [coachInput, setCoachInput] =
    useState("");

  const [coachHistory, setCoachHistory] =
    useState([]);

  const [
    isCoachLoading,
    setIsCoachLoading,
  ] = useState(false);

  const [coachError, setCoachError] =
    useState("");

  const [
    coachLearningState,
    setCoachLearningState,
  ] = useState({
    concept: "",
    suggestedNextAction: "",
    conceptsDemonstrated: [],
    conceptsNeedingHelp: [],
    misconceptionsDetected: [],
  });

  const terminalRef = useRef(null);
  const commandInputRef = useRef(null);
  const coachHistoryRef = useRef(null);

  // -----------------------------------------
  // Load scenario queue
  // -----------------------------------------

  useEffect(() => {
    async function loadScenarios() {
      try {
        const response = await fetch(
          `${API_URL}/scenarios`,
        );

        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}`,
          );
        }

        const data = await response.json();

        setAvailableScenarios(
          data.scenarios ?? [],
        );

        setScenarioLoadError("");
      } catch (error) {
        console.error(
          "Unable to load scenarios:",
          error,
        );

        setScenarioLoadError(
          "Unable to load training incidents. Please try again.",
        );
      } finally {
        setIsLoadingScenarios(false);
      }
    }

    loadScenarios();
  }, []);

  // -----------------------------------------
  // Auto-scroll terminal
  // -----------------------------------------

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop =
        terminalRef.current.scrollHeight;
    }
  }, [history]);

  // -----------------------------------------
  // Auto-scroll coach conversation
  // -----------------------------------------

  useEffect(() => {
    if (coachHistoryRef.current) {
      coachHistoryRef.current.scrollTop =
        coachHistoryRef.current.scrollHeight;
    }
  }, [coachHistory]);

  // -----------------------------------------
  // Utility
  // -----------------------------------------

  async function getErrorMessage(
    response,
    fallback,
  ) {
    try {
      const data = await response.json();

      return data.error || fallback;
    } catch {
      return fallback;
    }
  }

  // -----------------------------------------
  // Start tutor session
  // -----------------------------------------

  async function createTutorSession(
    scenarioId,
  ) {
    const response = await fetch(
      `${API_URL}/scenarios/${scenarioId}/session`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      const message =
        await getErrorMessage(
          response,
          "Unable to create training session.",
        );

      throw new Error(message);
    }

    return response.json();
  }

  // -----------------------------------------
  // Open scenario
  // -----------------------------------------

  async function startScenarioFromQueue(
    scenarioSummary,
  ) {
    try {
      setScenarioLoadError("");

      const response = await fetch(
        `${API_URL}/scenarios/${scenarioSummary.scenarioId}`,
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`,
        );
      }

      const scenario =
        await response.json();

      await startScenario({
        ...scenario,
        id: scenario.scenarioId,
      });
    } catch (error) {
      console.error(
        "Unable to load scenario:",
        error,
      );

      setScenarioLoadError(
        "Unable to open this training incident. Please try again.",
      );
    }
  }

  async function startScenario(scenario) {
    setActiveScenario(scenario);

    setCommand("");
    setHistory([]);

    setDiagnosis("");
    setSolution("");

    setResult(null);

    setSubmissionMessage("");

    setIsRunningCommand(false);
    setIsSubmitting(false);

    setSessionId("");
    setSessionError("");
    setHintLevel(1);

    setCoachInput("");
    setCoachHistory([]);
    setCoachError("");

    setCoachLearningState({
      concept: "",
      suggestedNextAction: "",
      conceptsDemonstrated: [],
      conceptsNeedingHelp: [],
      misconceptionsDetected: [],
    });

    setIsStartingSession(true);

    try {
      const session =
        await createTutorSession(
          scenario.id,
        );

      setSessionId(
        session.sessionId,
      );

      setHintLevel(
        session.hintLevel ?? 1,
      );

      requestAnimationFrame(() => {
        commandInputRef.current?.focus();
      });
    } catch (error) {
      console.error(
        "Unable to start tutor session:",
        error,
      );

      setSessionError(
        error.message ||
          "Unable to start the training session.",
      );
    } finally {
      setIsStartingSession(false);
    }
  }

  async function retryTutorSession() {
    if (!activeScenario) {
      return;
    }

    setSessionError("");
    setIsStartingSession(true);

    try {
      const session =
        await createTutorSession(
          activeScenario.id,
        );

      setSessionId(
        session.sessionId,
      );

      setHintLevel(
        session.hintLevel ?? 1,
      );
    } catch (error) {
      console.error(
        "Unable to restart tutor session:",
        error,
      );

      setSessionError(
        error.message ||
          "Unable to start the training session.",
      );
    } finally {
      setIsStartingSession(false);
    }
  }

  // -----------------------------------------
  // Return to queue
  // -----------------------------------------

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

    setSessionId("");
    setSessionError("");
    setHintLevel(1);

    setCoachInput("");
    setCoachHistory([]);
    setCoachError("");

    setCoachLearningState({
      concept: "",
      suggestedNextAction: "",
      conceptsDemonstrated: [],
      conceptsNeedingHelp: [],
      misconceptionsDetected: [],
    });
  }

  // -----------------------------------------
  // Run terminal command
  // -----------------------------------------

  async function runCommand(event) {
    event.preventDefault();

    const submittedCommand =
      command.trim();

    if (
      !submittedCommand ||
      isRunningCommand ||
      !sessionId
    ) {
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
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            sessionId,
            command: submittedCommand,
          }),
        },
      );

      if (!response.ok) {
        const message =
          await getErrorMessage(
            response,
            "Unable to run command.",
          );

        throw new Error(message);
      }

      const data =
        await response.json();

      setHistory(
        (currentHistory) => [
          ...currentHistory,
          {
            command:
              submittedCommand,

            output:
              data.output,

            supported:
              data.supported,

            kind:
              data.kind,
          },
        ],
      );
    } catch (error) {
      console.error(
        "Command request failed:",
        error,
      );

      setHistory(
        (currentHistory) => [
          ...currentHistory,
          {
            command:
              submittedCommand,

            output:
              error.message ||
              `Unable to contact the ByteGeist training server.

Please try again.`,
          },
        ],
      );
    } finally {
      setIsRunningCommand(false);

      requestAnimationFrame(() => {
        commandInputRef.current?.focus();
      });
    }
  }

  // -----------------------------------------
  // AI Coach
  // -----------------------------------------

  async function requestCoach(
    action,
    message = "",
    displayMessage = "",
    selectedEvidence = null,
  ) {
    if (
      !sessionId ||
      isCoachLoading
    ) {
      return;
    }

    setCoachError("");
    setIsCoachLoading(true);

    if (displayMessage) {
      setCoachHistory(
        (current) => [
          ...current,
          {
            role: "user",
            message:
              displayMessage,
          },
        ],
      );
    }

    try {
      const response = await fetch(
        `${API_URL}/scenarios/${activeScenario.id}/coach`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            sessionId,
            action,
            message,
            selectedEvidence,
          }),
        },
      );

      if (!response.ok) {
        const errorMessage =
          await getErrorMessage(
            response,
            "The AI coach is unavailable.",
          );

        throw new Error(
          errorMessage,
        );
      }

      const data =
        await response.json();

      setCoachHistory(
        (current) => [
          ...current,
          {
            role: "assistant",

            message:
              data.message,

            teachingType:
              data.teachingType,

            concept:
              data.concept,
          },
        ],
      );

      setHintLevel(
        data.hintLevel ??
          hintLevel,
      );

      setCoachLearningState({
        concept:
          data.concept ?? "",

        suggestedNextAction:
          data.suggestedNextAction ??
          "",

        conceptsDemonstrated:
          data.conceptsDemonstrated ??
          [],

        conceptsNeedingHelp:
          data.conceptsNeedingHelp ??
          [],

        misconceptionsDetected:
          data.misconceptionsDetected ??
          [],
      });
    } catch (error) {
      console.error(
        "Coach request failed:",
        error,
      );

      setCoachError(
        error.message ||
          "The AI coach is unavailable.",
      );
    } finally {
      setIsCoachLoading(false);
    }
  }

  async function askCoach(event) {
    event.preventDefault();

    const message =
      coachInput.trim();

    if (
      !message ||
      isCoachLoading
    ) {
      return;
    }

    setCoachInput("");

    await requestCoach(
      "ask",
      message,
      message,
    );
  }

  async function getHint() {
    await requestCoach(
      "hint",
      "",
      "Give me a hint.",
    );
  }

  async function explainOutput(entry) {
    if (!entry) {
      setCoachError(
        "Select a terminal command to explain.",
      );

      return;
    }

    await requestCoach(
      "explain",
      "",
      `Explain this output: ${entry.command}`,
      {
        command: entry.command,
        output: entry.output,
      },
    );
  }

  async function explainLastOutput() {
    if (history.length === 0) {
      setCoachError(
        "Run a troubleshooting command first.",
      );

      return;
    }

    await explainOutput(
      history[history.length - 1],
    );
  }

  async function checkMyThinking() {
    const diagnosisText =
      diagnosis.trim();

    const solutionText =
      solution.trim();

    if (
      !diagnosisText &&
      !solutionText
    ) {
      setCoachError(
        "Enter your current diagnosis or resolution first.",
      );

      return;
    }

    const reasoning = [
      diagnosisText
        ? `My current diagnosis: ${diagnosisText}`
        : "",

      solutionText
        ? `My proposed resolution: ${solutionText}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    await requestCoach(
      "check",
      reasoning,
      "Check my current reasoning.",
    );
  }

  // -----------------------------------------
  // Submit incident
  // -----------------------------------------

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
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            diagnosis:
              diagnosis.trim(),

            solution:
              solution.trim(),

            commandsUsed:
              history.map(
                (entry) =>
                  entry.command,
              ),

            commandHistory:
              history.map(
                (entry) => ({
                  command:
                    entry.command,

                  output:
                    entry.output,
                }),
              ),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`,
        );
      }

      const data =
        await response.json();

      setResult(data);
    } catch (error) {
      console.error(
        "Unable to submit incident:",
        error,
      );

      setSubmissionMessage(
        "Unable to score this incident. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // -----------------------------------------
  // Incident queue
  // -----------------------------------------

  if (!activeScenario) {
    return (
      <main className="app-shell">
        <header className="hero">
          <p className="eyebrow">
            BYTEGEIST
          </p>

          <h1>Support Lab</h1>

          <p className="hero-copy">
            Practice real-world IT troubleshooting by investigating simulated
            support incidents.
          </p>
        </header>

        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                TRAINING QUEUE
              </p>

              <h2>
                Available Incidents
              </h2>
            </div>

            <span>
              {availableScenarios.length} available
            </span>
          </div>

          {isLoadingScenarios && (
            <p className="loading-message">
              Loading incidents...
            </p>
          )}

          {scenarioLoadError && (
            <p className="error-message">
              {scenarioLoadError}
            </p>
          )}

          {!isLoadingScenarios &&
            !scenarioLoadError && (
              <div className="scenario-grid">
                {availableScenarios.map(
                  (scenario) => (
                    <article
                      className="scenario-card"
                      key={
                        scenario.scenarioId
                      }
                    >
                      <div className="ticket-row">
                        <span>
                          {
                            scenario.ticketNumber
                          }
                        </span>

                        <span className="difficulty">
                          {
                            scenario.difficulty
                          }
                        </span>
                      </div>

                      <h3>
                        {scenario.title}
                      </h3>

                      <p>
                        {scenario.category}
                      </p>

                      <p className="scenario-description">
                        {scenario.issue}
                      </p>

                      <button
                        onClick={() =>
                          startScenarioFromQueue(
                            scenario,
                          )
                        }
                      >
                        Start Incident
                      </button>
                    </article>
                  ),
                )}
              </div>
            )}
        </section>
      </main>
    );
  }

  // -----------------------------------------
  // Results
  // -----------------------------------------

  if (result) {
    return (
      <main className="app-shell">
        <button
          className="text-button"
          onClick={returnHome}
        >
          ← Incident Queue
        </button>

        <section className="results-card">
          <p className="eyebrow">
            {
              activeScenario.ticketNumber
            }
          </p>

          <h1>Incident Review</h1>

          <div className="score">
            {result.total}/100
          </div>

          <div className="score-breakdown">
            <div>
              <span>Diagnosis</span>

              <strong>
                {
                  result.diagnosisScore
                }
                /50
              </strong>
            </div>

            <div>
              <span>Resolution</span>

              <strong>
                {
                  result.solutionScore
                }
                /30
              </strong>
            </div>

            <div>
              <span>
                Troubleshooting
              </span>

              <strong>
                {
                  result.troubleshootingScore
                }
                /20
              </strong>
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
              <h2>
                Expected root cause
              </h2>

              <p>
                {
                  result.expectedDiagnosis
                }
              </p>
            </div>
          )}

          {result.expectedSolution && (
            <div className="review-section answer">
              <h2>
                Recommended resolution
              </h2>

              <p>
                {
                  result.expectedSolution
                }
              </p>
            </div>
          )}

          {result.feedback && (
            <div className="review-section feedback">
              <h2>AI Coaching</h2>

              <p className="feedback-text">
                {result.feedback}
              </p>
            </div>
          )}

          <button
            onClick={() =>
              startScenario(
                activeScenario,
              )
            }
          >
            Retry Incident
          </button>
        </section>
      </main>
    );
  }

  // -----------------------------------------
  // Active scenario
  // -----------------------------------------

  return (
    <main className="app-shell">
      <button
        className="text-button"
        onClick={returnHome}
      >
        ← Incident Queue
      </button>

      <section className="ticket-panel">
        <div className="ticket-row">
          <span>
            {
              activeScenario.ticketNumber
            }
          </span>

          <span className="difficulty">
            {
              activeScenario.difficulty
            }
          </span>
        </div>

        <h1>
          {activeScenario.title}
        </h1>

        <div className="ticket-details">
          <div>
            <span>User</span>

            <strong>
              {
                activeScenario.user.name
              }
            </strong>
          </div>

          <div>
            <span>
              Department
            </span>

            <strong>
              {
                activeScenario.user
                  .department
              }
            </strong>
          </div>

          <div>
            <span>Computer</span>

            <strong>
              {
                activeScenario.user
                  .computer
              }
            </strong>
          </div>
        </div>

        <div className="issue-box">
          <h2>Reported issue</h2>

          <p>
            {activeScenario.issue}
          </p>
        </div>

        <p className="objective">
          {
            activeScenario.objective
          }
        </p>

        {isStartingSession && (
          <p className="loading-message">
            Starting AI tutor
            session...
          </p>
        )}

        {sessionError && (
          <div>
            <p className="error-message">
              {sessionError}
            </p>

            <button
              onClick={
                retryTutorSession
              }
              disabled={
                isStartingSession
              }
            >
              Retry Session
            </button>
          </div>
        )}
      </section>

      {/* ---------------------------------- */}
      {/* Terminal                           */}
      {/* ---------------------------------- */}

      <section className="terminal-panel">
        <div className="terminal-header">
          <span>
            {
              activeScenario.user
                .computer
            }
          </span>

          <span>
            Windows PowerShell
          </span>
        </div>

        <div
          className="terminal-output"
          ref={terminalRef}
        >
          <div className="terminal-entry">
            <p>
              ByteGeist Support Lab Terminal
              <br />

              {sessionId
                ? 'Type troubleshooting commands below. Type "help" if you need command guidance.'
                : "Waiting for training session..."}
            </p>
          </div>

          {history.map(
            (entry, index) => (
              <div
                className="terminal-entry"
                key={index}
              >
                <p className="terminal-command">
                  C:\Users\
                  {
                    activeScenario.user
                      .username
                  }
                  &gt;{" "}
                  {entry.command}
                </p>

                <pre>
                  {entry.output}
                </pre>

                <button
                  type="button"
                  className="terminal-explain-button"
                  onClick={() =>
                    explainOutput(entry)
                  }
                  disabled={
                    !sessionId ||
                    isCoachLoading
                  }
                >
                  Explain This Output
                </button>
              </div>
            ),
          )}
        </div>

        <form
          className="terminal-input-row"
          onSubmit={runCommand}
        >
          <span>
            C:\Users\
            {
              activeScenario.user
                .username
            }
            &gt;
          </span>

          <input
            ref={commandInputRef}
            autoFocus
            value={command}
            onChange={(event) =>
              setCommand(
                event.target.value,
              )
            }
            aria-label="Terminal command"
            autoComplete="off"
            spellCheck="false"
            readOnly={
              isRunningCommand ||
              !sessionId
            }
          />

          {isRunningCommand && (
            <span className="terminal-status">
              Running...
            </span>
          )}
        </form>
      </section>

      {/* ---------------------------------- */}
      {/* AI Coach                           */}
      {/* ---------------------------------- */}

      <section className="coach-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              AI TUTOR
            </p>

            <h2>
              ByteGeist AI Coach
            </h2>
          </div>

          <span>
            Hint level {hintLevel}/4
          </span>
        </div>

        <p>
          Use the coach to understand evidence,
          work through troubleshooting logic,
          and get progressive hints without
          immediately revealing the answer.
        </p>

        <div className="coach-actions">
          <button
            type="button"
            onClick={getHint}
            disabled={
              !sessionId ||
              isCoachLoading
            }
          >
            Get Hint
          </button>

          <button
            type="button"
            onClick={
              explainLastOutput
            }
            disabled={
              !sessionId ||
              isCoachLoading ||
              history.length === 0
            }
          >
            Explain Last Output
          </button>

          <button
            type="button"
            onClick={
              checkMyThinking
            }
            disabled={
              !sessionId ||
              isCoachLoading
            }
          >
            Check My Thinking
          </button>
        </div>

        <div
          className="coach-history"
          ref={coachHistoryRef}
        >
          {coachHistory.length ===
            0 && (
            <div className="coach-empty">
              <p>
                No coaching messages yet.
              </p>

              <p>
                Ask a question, request a
                hint, or investigate the
                incident in the terminal.
              </p>
            </div>
          )}

          {coachHistory.map(
            (entry, index) => (
              <div
                key={index}
                className={`coach-message coach-${entry.role}`}
              >
                <strong>
                  {entry.role ===
                  "assistant"
                    ? "AI Coach"
                    : "You"}
                </strong>

                <p>
                  {entry.message}
                </p>

                {entry.concept && (
                  <small>
                    Concept:{" "}
                    {entry.concept}
                  </small>
                )}
              </div>
            ),
          )}

          {isCoachLoading && (
            <div className="coach-message coach-assistant">
              <strong>
                AI Coach
              </strong>

              <p>
                Thinking about the evidence...
              </p>
            </div>
          )}
        </div>

        {coachError && (
          <p className="error-message">
            {coachError}
          </p>
        )}

        {coachLearningState.concept && (
          <div className="coach-context">
            <p>
              <strong>
                Current concept:
              </strong>{" "}
              {
                coachLearningState.concept
              }
            </p>

            {coachLearningState
              .suggestedNextAction && (
              <p>
                <strong>
                  Suggested next step:
                </strong>{" "}
                {
                  coachLearningState
                    .suggestedNextAction
                }
              </p>
            )}
          </div>
        )}

        <form
          className="coach-input-row"
          onSubmit={askCoach}
        >
          <input
            type="text"
            value={coachInput}
            onChange={(event) =>
              setCoachInput(
                event.target.value,
              )
            }
            placeholder="Ask the coach about the incident..."
            disabled={
              !sessionId ||
              isCoachLoading
            }
          />

          <button
            type="submit"
            disabled={
              !sessionId ||
              isCoachLoading ||
              !coachInput.trim()
            }
          >
            Ask Coach
          </button>
        </form>
      </section>

      {/* ---------------------------------- */}
      {/* Diagnosis                          */}
      {/* ---------------------------------- */}

      <section className="diagnosis-panel">
        <h2>Resolve Incident</h2>

        <form
          onSubmit={submitDiagnosis}
        >
          <label htmlFor="diagnosis">
            What is the root cause?
          </label>

          <textarea
            id="diagnosis"
            value={diagnosis}
            onChange={(event) => {
              setDiagnosis(
                event.target.value,
              );

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
              setSolution(
                event.target.value,
              );

              setSubmissionMessage("");
            }}
            placeholder="Describe the steps you would take to resolve the incident..."
            required
          />

          {submissionMessage && (
            <p className="error-message">
              {submissionMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Scoring..."
              : "Submit Resolution"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;