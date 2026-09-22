import { useEffect, useRef, useState } from "react";
import { BrandMark, HeroArt, CoachMascot } from "./Art.jsx";

const API_URL = import.meta.env.VITE_API_URL;

/* ---------- inline icons (stroked, 1.75) ---------- */
const Icon = ({ path, size = 16, fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
);
const IconBrand = () => (
  <Icon
    path={
      <>
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="M5 12H2" />
        <path d="M22 12h-3" />
        <circle cx="12" cy="12" r="6" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </>
    }
    size={20}
  />
);
const IconTicket = () => (
  <Icon
    path={
      <>
        <path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6z" />
        <path d="M12 6v12" strokeDasharray="2 2" />
      </>
    }
    size={18}
  />
);
const IconTerminal = () => (
  <Icon
    path={
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 9l3 3-3 3" />
        <path d="M13 15h4" />
      </>
    }
    size={16}
  />
);
const IconSparkle = () => (
  <Icon
    path={
      <>
        <path d="M12 3l1.6 4.2L18 9l-4.4 1.8L12 15l-1.6-4.2L6 9l4.4-1.8L12 3z" />
        <path d="M19 15l.8 2 2 .8-2 .8L19 21l-.8-2-2-.8 2-.8L19 15z" />
      </>
    }
    size={16}
  />
);
const IconLightbulb = () => (
  <Icon
    path={
      <>
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3 11.2c.6.5 1 1.2 1 2V17h4v-.8c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
      </>
    }
    size={16}
  />
);
const IconDoc = () => (
  <Icon
    path={
      <>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
        <path d="M8 13h8M8 17h5" />
      </>
    }
    size={16}
  />
);
const IconCheck = () => (
  <Icon
    path={
      <>
        <path d="M4 12l5 5L20 6" />
      </>
    }
    size={16}
  />
);
const IconInfo = () => (
  <Icon
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v.01" />
        <path d="M11 12h1v4h1" />
      </>
    }
    size={13}
  />
);
const IconSend = () => (
  <Icon
    path={<path d="M4 12l16-8-6 18-4-8-6-2z" />}
    size={18}
  />
);
const IconArrowLeft = () => (
  <Icon path={<path d="M15 6l-6 6 6 6" />} size={16} />
);
const IconUser = () => (
  <Icon
    path={
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    }
    size={16}
  />
);
const IconBuilding = () => (
  <Icon
    path={
      <>
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h8" />
      </>
    }
    size={16}
  />
);
const IconMonitor = () => (
  <Icon
    path={
      <>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </>
    }
    size={16}
  />
);
const IconTarget = () => (
  <Icon
    path={
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </>
    }
    size={16}
  />
);
const IconBook = () => (
  <Icon
    path={
      <>
        <path d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4z" />
        <path d="M4 16a4 4 0 0 1 4-4h10" />
      </>
    }
    size={16}
  />
);
const IconWarn = () => (
  <Icon
    path={
      <>
        <path d="M12 3L2 20h20L12 3z" />
        <path d="M12 10v5M12 18v.01" />
      </>
    }
    size={16}
  />
);
const IconGear = () => (
  <Icon
    path={
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </>
    }
    size={16}
  />
);
const IconChat = () => (
  <Icon
    path={
      <>
        <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </>
    }
    size={16}
  />
);
const IconRefresh = () => (
  <Icon
    path={
      <>
        <path d="M4 4v6h6" />
        <path d="M20 20v-6h-6" />
        <path d="M4 10a8 8 0 0 1 14-3l2 3" />
        <path d="M20 14a8 8 0 0 1-14 3l-2-3" />
      </>
    }
    size={16}
  />
);
const IconClipboard = () => (
  <Icon
    path={
      <>
        <rect x="8" y="3" width="8" height="4" rx="1" />
        <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <path d="M9 12h6M9 16h4" />
      </>
    }
    size={16}
  />
);
const IconBot = () => (
  <Icon
    path={
      <>
        <rect x="4" y="8" width="16" height="12" rx="2" />
        <path d="M12 4v4" />
        <circle cx="9" cy="14" r="1" fill="currentColor" />
        <circle cx="15" cy="14" r="1" fill="currentColor" />
      </>
    }
    size={18}
  />
);
const IconUserSm = () => (
  <Icon
    path={
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    }
    size={16}
  />
);

/* ---------- helpers ---------- */
function initials(name) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function App() {
  const [activeScenario, setActiveScenario] = useState(null);

  const [command, setCommand] = useState("");
  const [commandHistoryStack, setCommandHistoryStack] = useState([]);
  const [commandHistoryIdx, setCommandHistoryIdx] = useState(-1);
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

  // Tutor session
  const [sessionId, setSessionId] = useState("");
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [hintLevel, setHintLevel] = useState(1);

  // AI Coach
  const [coachInput, setCoachInput] = useState("");
  const [coachHistory, setCoachHistory] = useState([]);
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState("");
  const [coachLearningState, setCoachLearningState] = useState({
    concept: "",
    suggestedNextAction: "",
    conceptsDemonstrated: [],
    conceptsNeedingHelp: [],
    misconceptionsDetected: [],
  });

  const terminalRef = useRef(null);
  const commandInputRef = useRef(null);
  const coachHistoryRef = useRef(null);

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
          "Unable to load training incidents. Please try again."
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

  useEffect(() => {
    if (coachHistoryRef.current) {
      coachHistoryRef.current.scrollTop = coachHistoryRef.current.scrollHeight;
    }
  }, [coachHistory]);

  async function getErrorMessage(response, fallback) {
    try {
      const data = await response.json();
      return data.error || fallback;
    } catch {
      return fallback;
    }
  }

  async function createTutorSession(scenarioId) {
    const response = await fetch(
      `${API_URL}/scenarios/${scenarioId}/session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );
    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Unable to create training session."
      );
      throw new Error(message);
    }
    return response.json();
  }

  async function startScenarioFromQueue(scenarioSummary) {
    try {
      setScenarioLoadError("");
      const response = await fetch(
        `${API_URL}/scenarios/${scenarioSummary.scenarioId}`
      );
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const scenario = await response.json();
      await startScenario({ ...scenario, id: scenario.scenarioId });
    } catch (error) {
      console.error("Unable to load scenario:", error);
      setScenarioLoadError(
        "Unable to open this training incident. Please try again."
      );
    }
  }

  async function startScenario(scenario) {
    setActiveScenario(scenario);
    window.scrollTo({ top: 0, behavior: "auto" });
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
      const session = await createTutorSession(scenario.id);
      setSessionId(session.sessionId);
      setHintLevel(session.hintLevel ?? 1);
      requestAnimationFrame(() => {
        commandInputRef.current?.focus({ preventScroll: true });
      });
    } catch (error) {
      console.error("Unable to start tutor session:", error);
      setSessionError(
        error.message || "Unable to start the training session."
      );
    } finally {
      setIsStartingSession(false);
    }
  }

  async function retryTutorSession() {
    if (!activeScenario) return;
    setSessionError("");
    setIsStartingSession(true);
    try {
      const session = await createTutorSession(activeScenario.id);
      setSessionId(session.sessionId);
      setHintLevel(session.hintLevel ?? 1);
    } catch (error) {
      console.error("Unable to restart tutor session:", error);
      setSessionError(
        error.message || "Unable to start the training session."
      );
    } finally {
      setIsStartingSession(false);
    }
  }

  function returnHome() {
    setActiveScenario(null);
    window.scrollTo({ top: 0, behavior: "auto" });
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

  async function runCommand(event) {
    event.preventDefault();
    const submittedCommand = command.trim();
    if (!submittedCommand || isRunningCommand || !sessionId) return;

    setCommand("");
    setCommandHistoryStack((prev) => {
      // avoid consecutive duplicates
      if (prev[prev.length - 1] === submittedCommand) return prev;
      return [...prev, submittedCommand].slice(-50);
    });
    setCommandHistoryIdx(-1);
    setIsRunningCommand(true);
    try {
      const response = await fetch(
        `${API_URL}/scenarios/${activeScenario.id}/command`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            command: submittedCommand,
          }),
        }
      );
      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Unable to run command."
        );
        throw new Error(message);
      }
      const data = await response.json();
      setHistory((currentHistory) => [
        ...currentHistory,
        {
          command: submittedCommand,
          output: data.output,
          supported: data.supported,
          kind: data.kind,
        },
      ]);
    } catch (error) {
      console.error("Command request failed:", error);
      setHistory((currentHistory) => [
        ...currentHistory,
        {
          command: submittedCommand,
          output:
            error.message ||
            `Unable to contact the ByteGeist training server.\n\nPlease try again.`,
        },
      ]);
    } finally {
      setIsRunningCommand(false);
      requestAnimationFrame(() => {
        commandInputRef.current?.focus({ preventScroll: true });
      });
    }
  }

  async function requestCoach(
    action,
    message = "",
    displayMessage = "",
    selectedEvidence = null
  ) {
    if (!sessionId || isCoachLoading) return;
    setCoachError("");
    setIsCoachLoading(true);

    if (displayMessage) {
      setCoachHistory((current) => [
        ...current,
        { role: "user", message: displayMessage },
      ]);
    }

    try {
      const response = await fetch(
        `${API_URL}/scenarios/${activeScenario.id}/coach`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            action,
            message,
            selectedEvidence,
          }),
        }
      );
      if (!response.ok) {
        const errorMessage = await getErrorMessage(
          response,
          "The AI coach is unavailable."
        );
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setCoachHistory((current) => [
        ...current,
        {
          role: "assistant",
          message: data.message,
          teachingType: data.teachingType,
          concept: data.concept,
        },
      ]);
      setHintLevel(data.hintLevel ?? hintLevel);
      setCoachLearningState({
        concept: data.concept ?? "",
        suggestedNextAction: data.suggestedNextAction ?? "",
        conceptsDemonstrated: data.conceptsDemonstrated ?? [],
        conceptsNeedingHelp: data.conceptsNeedingHelp ?? [],
        misconceptionsDetected: data.misconceptionsDetected ?? [],
      });
    } catch (error) {
      console.error("Coach request failed:", error);
      setCoachError(error.message || "The AI coach is unavailable.");
    } finally {
      setIsCoachLoading(false);
    }
  }

  async function askCoach(event) {
    event.preventDefault();
    const message = coachInput.trim();
    if (!message || isCoachLoading) return;
    setCoachInput("");
    await requestCoach("ask", message, message);
  }

  async function getHint() {
    await requestCoach("hint", "", "Give me a hint.");
  }

  async function explainOutput(entry) {
    if (!entry) {
      setCoachError("Select a terminal command to explain.");
      return;
    }
    await requestCoach(
      "explain",
      "",
      `Explain this output: ${entry.command}`,
      { command: entry.command, output: entry.output }
    );
  }

  async function explainLastOutput() {
    if (history.length === 0) {
      setCoachError("Run a troubleshooting command first.");
      return;
    }
    await explainOutput(history[history.length - 1]);
  }

  async function checkMyThinking() {
    const diagnosisText = diagnosis.trim();
    const solutionText = solution.trim();
    if (!diagnosisText && !solutionText) {
      setCoachError(
        "Enter your current diagnosis or resolution first."
      );
      return;
    }
    const reasoning = [
      diagnosisText ? `My current diagnosis: ${diagnosisText}` : "",
      solutionText ? `My proposed resolution: ${solutionText}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    await requestCoach("check", reasoning, "Check my current reasoning.");
  }

  async function submitDiagnosis(event) {
    event.preventDefault();
    if (!diagnosis.trim() || !solution.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionMessage("");
    try {
      const response = await fetch(
        `${API_URL}/scenarios/${activeScenario.id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            diagnosis: diagnosis.trim(),
            solution: solution.trim(),
            commandsUsed: history.map((entry) => entry.command),
            commandHistory: history.map((entry) => ({
              command: entry.command,
              output: entry.output,
            })),
          }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }
      const data = await response.json();
      setResult(data);
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (error) {
      console.error("Unable to submit incident:", error);
      setSubmissionMessage(
        "Unable to score this incident. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* --------------------------------- HEADER */
  const AppHeader = () => (
    <header className="app-header">
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="app-header-inner">
        <div className="brand">
          <div className="brand-mark">
            <BrandMark size={36} />
          </div>
          <div className="brand-text">
            <div className="brand-name">ByteGeist Support Lab</div>
            <div className="brand-tag">
              AI-guided IT troubleshooting practice
            </div>
          </div>
        </div>
        <div className="header-status">
          <div className="status-online">
            <span className="dot" />
            Lab Environment Online
          </div>
          <div className="divider" />
          <div className="status-sub">Powered by AWS + Bedrock</div>
        </div>
      </div>
    </header>
  );

  /* --------------------------------- QUEUE */
  if (!activeScenario) {
    return (
      <div className="app">
        <AppHeader />
        <main className="app-main" id="main" tabIndex={-1}>
          <section className="ops-header">
            <div className="ops-header-main">
              <p className="ops-eyebrow">
                <span className="ops-tag">ops</span>
                <span className="ops-sep">/</span>
                <span>incidents</span>
                <span className="ops-sep">/</span>
                <span className="ops-current">queue</span>
              </p>
              <h1>Incident queue</h1>
              <p className="ops-lede">
                Simulated support tickets. Investigate with the console,
                diagnose the root cause, get graded. Coach teaches, code grades.
              </p>
              <dl className="ops-stats">
                <div>
                  <dt>Open</dt>
                  <dd>
                    <span className="mono">{String(availableScenarios.length).padStart(2, "0")}</span>
                  </dd>
                </div>
                <div>
                  <dt>Region</dt>
                  <dd><span className="mono">us-east-1</span></dd>
                </div>
                <div>
                  <dt>Tutor</dt>
                  <dd>
                    <span className="tutor-online">
                      <span className="tutor-led" /> online
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="ops-art">
              <HeroArt />
            </div>
          </section>

          <div className="queue-section">
          <div className="queue-heading">
            <h2>Available incidents</h2>
            <span className="count">
              {availableScenarios.length} open
            </span>
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
                  data-cat={scenario.category}
                  key={scenario.scenarioId}
                >
                  <div className="scenario-anchor">
                    <span className="scenario-id">{scenario.ticketNumber}</span>
                    <span
                      className="badge badge-difficulty"
                      data-level={scenario.difficulty}
                    >
                      {scenario.difficulty}
                    </span>
                  </div>
                  <h3>{scenario.title}</h3>
                  <p className="scenario-desc">{scenario.issue}</p>
                  <div className="scenario-foot">
                    <span
                      className="scenario-cat"
                      data-cat={scenario.category}
                    >
                      {scenario.category}
                    </span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => startScenarioFromQueue(scenario)}
                    >
                      Open →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
          </div>
        </main>
      </div>
    );
  }

  /* --------------------------------- RESULTS */
  if (result) {
    const pct = Math.max(0, Math.min(100, Number(result.total) || 0));
    const scoreTier =
      pct >= 90 ? { label: "Excellent", cls: "excellent" }
      : pct >= 75 ? { label: "Strong", cls: "strong" }
      : pct >= 60 ? { label: "Passing", cls: "passing" }
      : { label: "Needs Review", cls: "review" };

    const supportedEvidenceCommands = [
      ...new Set(
        history
          .filter(
            (entry) =>
              entry.supported === true && entry.kind === "simulated"
          )
          .map((entry) => entry.command.trim())
      ),
    ];
    const unsupportedAttempts = history.filter(
      (entry) => entry.supported === false
    ).length;

    const demonstratedConcepts =
      coachLearningState.conceptsDemonstrated ?? [];
    const reinforcementConcepts =
      coachLearningState.conceptsNeedingHelp ?? [];
    const misconceptions =
      coachLearningState.misconceptionsDetected ?? [];

    const currentScenarioIndex = availableScenarios.findIndex(
      (scenario) => scenario.scenarioId === activeScenario.id
    );
    const orderedNextScenarios =
      currentScenarioIndex >= 0
        ? [
            ...availableScenarios.slice(currentScenarioIndex + 1),
            ...availableScenarios.slice(0, currentScenarioIndex),
          ]
        : availableScenarios;
    const nextScenario =
      orderedNextScenarios.find(
        (scenario) => scenario.scenarioId !== activeScenario.id
      ) ?? null;

    return (
      <div className="app">
        <AppHeader />
        <main className="app-main" id="main" tabIndex={-1}>
          <button className="back-link" onClick={returnHome}>
            <IconArrowLeft /> Incident queue
          </button>

          <div className="results-wrap">
            <section className="card">
              <div className="results-hero">
                <div>
                  <p className="eyebrow">
                    {activeScenario.ticketNumber} — Incident review
                  </p>
                  <h1>{activeScenario.title}</h1>
                  <p className="sub">
                    Deterministic score plus AI coaching feedback.
                  </p>
                </div>
                <div
                  className={`score-ring tier-${scoreTier.cls}`}
                  style={{ "--pct": pct }}
                  aria-label={`Score ${result.total} out of 100`}
                >
                  <span className="score-num">{result.total}</span>
                  <span className="score-den">/ 100</span>
                  <span className={`score-tier tier-${scoreTier.cls}`}>{scoreTier.label}</span>
                </div>
              </div>

              <div className="score-breakdown">
                <div className="score-cell">
                  <span className="lbl">Diagnosis</span>
                  <span className="val">
                    {result.diagnosisScore}
                    <small> / 50</small>
                  </span>
                </div>
                <div className="score-cell">
                  <span className="lbl">Resolution</span>
                  <span className="val">
                    {result.solutionScore}
                    <small> / 30</small>
                  </span>
                </div>
                <div className="score-cell">
                  <span className="lbl">Troubleshooting</span>
                  <span className="val">
                    {result.troubleshootingScore}
                    <small> / 20</small>
                  </span>
                </div>
              </div>

              <section
                className="learner-report"
                aria-labelledby="learner-report-title"
              >
                <div className="learner-report-header">
                  <div>
                    <p className="learner-report-kicker">
                      Session learning report
                    </p>
                    <h2 id="learner-report-title">
                      How you worked the incident
                    </h2>
                    <p>
                      Built from deterministic scoring, server-classified
                      terminal evidence, and the adaptive tutor state recorded
                      during this session.
                    </p>
                  </div>
                </div>

                <div className="learner-report-metrics">
                  <div className="report-metric">
                    <span className="report-metric-icon blue">
                      <IconTerminal />
                    </span>
                    <div>
                      <span className="report-metric-label">
                        Evidence gathered
                      </span>
                      <strong>{supportedEvidenceCommands.length}</strong>
                      <small>supported simulator commands</small>
                    </div>
                  </div>

                  <div className="report-metric">
                    <span className="report-metric-icon amber">
                      <IconLightbulb />
                    </span>
                    <div>
                      <span className="report-metric-label">
                        Tutor guidance
                      </span>
                      <strong>{hintLevel} / 4</strong>
                      <small>highest guidance level reached</small>
                    </div>
                  </div>

                  <div className="report-metric">
                    <span className="report-metric-icon slate">
                      <IconInfo />
                    </span>
                    <div>
                      <span className="report-metric-label">
                        Unsupported attempts
                      </span>
                      <strong>{unsupportedAttempts}</strong>
                      <small>never counted as diagnostic evidence</small>
                    </div>
                  </div>
                </div>

                {(demonstratedConcepts.length > 0 ||
                  reinforcementConcepts.length > 0 ||
                  misconceptions.length > 0) && (
                  <div className="learner-report-groups">
                    {demonstratedConcepts.length > 0 && (
                      <div className="report-group success">
                        <div className="report-group-title">
                          <IconCheck /> Concepts demonstrated
                        </div>
                        <div className="report-chip-row">
                          {demonstratedConcepts.map((conceptName, index) => (
                            <span
                              className="report-chip success"
                              key={index}
                            >
                              {conceptName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {reinforcementConcepts.length > 0 && (
                      <div className="report-group reinforce">
                        <div className="report-group-title">
                          <IconBook /> Areas to reinforce
                        </div>
                        <div className="report-chip-row">
                          {reinforcementConcepts.map((conceptName, index) => (
                            <span
                              className="report-chip reinforce"
                              key={index}
                            >
                              {conceptName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {misconceptions.length > 0 && (
                      <div className="report-group warning">
                        <div className="report-group-title">
                          <IconWarn /> Misconceptions detected
                        </div>
                        <div className="report-chip-row">
                          {misconceptions.map((misconception, index) => (
                            <span
                              className="report-chip warning"
                              key={index}
                            >
                              {misconception}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {nextScenario && (
                  <div className="report-next">
                    <div>
                      <span className="report-next-label">
                        Next practice option
                      </span>
                      <strong>
                        {nextScenario.ticketNumber} — {nextScenario.title}
                      </strong>
                      <span>{nextScenario.category}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => startScenarioFromQueue(nextScenario)}
                    >
                      Open next incident →
                    </button>
                  </div>
                )}
              </section>

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

              {result.feedback && (
                <div className="review-section feedback">
                  <h2>AI coaching</h2>
                  <p>{result.feedback}</p>
                </div>
              )}

              <div className="results-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => startScenario(activeScenario)}
                >
                  <IconRefresh /> Retry incident
                </button>
                <button className="btn btn-ghost" onClick={returnHome}>
                  Back to queue
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  /* --------------------------------- ACTIVE INCIDENT */
  const filled = Math.max(0, Math.min(4, hintLevel));
  const bars = [0, 1, 2, 3].map((i) => (
    <span key={i} className={`seg${i < filled ? " on" : ""}`} />
  ));

  const {
    concept,
    suggestedNextAction,
    conceptsNeedingHelp,
    misconceptionsDetected,
  } = coachLearningState;

  return (
    <div className="app">
      <AppHeader />
      <main className="app-main" id="main" tabIndex={-1}>
        <button className="back-link" onClick={returnHome}>
          <IconArrowLeft /> Incident queue
        </button>

        <p className="crumbs">
          Incidents <span className="crumb-sep">/</span>{" "}
          <span className="crumb-current">
            {activeScenario.ticketNumber}
          </span>
        </p>

        {/* -------- Incident summary -------- */}
        <section className="card incident-banner">
          <div className="incident-summary">
            <div className="incident-main">
              <div className="incident-heading">
                <span className="ticket-id">
                  {activeScenario.ticketNumber}
                </span>
                <span
                  className="badge badge-difficulty"
                  data-level={activeScenario.difficulty}
                >
                  {activeScenario.difficulty}
                </span>
                {activeScenario.category && (
                  <span
                    className="badge badge-cat"
                    data-cat={activeScenario.category}
                  >
                    {activeScenario.category}
                  </span>
                )}
              </div>
              <h1>{activeScenario.title}</h1>
              <p className="incident-issue-line">
                <span className="il-label">Issue</span>
                {activeScenario.issue}
              </p>
              {activeScenario.objective && (
                <p className="incident-objective-line">
                  <span className="il-label amber">Objective</span>
                  {activeScenario.objective}
                </p>
              )}
            </div>

            <dl className="incident-meta-inline">
              <div>
                <dt>User</dt>
                <dd>{activeScenario.user.name}</dd>
              </div>
              <div>
                <dt>Dept</dt>
                <dd>{activeScenario.user.department}</dd>
              </div>
              <div>
                <dt>Host</dt>
                <dd><span className="mono">{activeScenario.user.computer}</span></dd>
              </div>
            </dl>

            {isStartingSession && (
              <p className="loading-message" style={{ marginTop: "1rem" }}>
                Starting AI tutor session…
              </p>
            )}
            {sessionError && (
              <div style={{ marginTop: "1rem" }}>
                <p className="error-message">{sessionError}</p>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={retryTutorSession}
                  disabled={isStartingSession}
                >
                  Retry session
                </button>
              </div>
            )}
          </div>
        </section>

        {/* -------- Workspace: terminal + coach -------- */}
        <div className="workspace">
          {/* Terminal */}
          <section className="card terminal-panel">
            <div className="card-header terminal-header">
              <div className="card-title">
                <div className="icon-chip blue">
                  <IconTerminal />
                </div>
                <div>
                  <h2>{activeScenario.user.computer}</h2>
                  <span className="sub">Windows PowerShell / AWS CLI</span>
                </div>
              </div>
              <div className="status-inline">
                <span className="dot" /> Connected
              </div>
            </div>

            <div
              className="terminal-output"
              ref={terminalRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-busy={isRunningCommand}
              aria-label="Terminal output history"
            >
              <div className="terminal-intro">
                <p>
                  ByteGeist Support Lab Terminal
                  {"\n"}
                  {sessionId
                    ? 'Type troubleshooting commands below. Type "help" if you need command guidance.'
                    : "Waiting for training session..."}
                </p>
              </div>

                {history.map((entry, index) => {
                  const kindClass =
                    entry.kind === "help"
                      ? "help"
                      : entry.supported === false
                        ? "unsupported"
                        : entry.supported === true
                          ? "supported"
                          : "";
                  return (
                    <div className="term-entry" key={index}>
                      <div className="term-prompt">
                        <span className="term-idx">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="prompt-glyph">$</span>
                        <span className="cmd">{entry.command}</span>
                        {kindClass && (
                          <span
                            className={`kind-dot ${kindClass}`}
                            title={
                              kindClass === "supported"
                                ? "Simulator supported"
                                : kindClass === "unsupported"
                                  ? "Not simulated"
                                  : "Help output"
                            }
                          />
                        )}
                      </div>
                      <pre className="term-output">{entry.output}</pre>
                      <div className="term-actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => explainOutput(entry)}
                          disabled={!sessionId || isCoachLoading}
                        >
                          <IconInfo /> Explain this output
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <form
              className="terminal-input-row"
              onSubmit={runCommand}
            >
              <span className="prompt-glyph">$</span>
              <input
                ref={commandInputRef}
                value={command}
                onChange={(event) => {
                  setCommand(event.target.value);
                  setCommandHistoryIdx(-1);
                }}
                onKeyDown={(event) => {
                  if (commandHistoryStack.length === 0) return;
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    const nextIdx =
                      commandHistoryIdx < 0
                        ? commandHistoryStack.length - 1
                        : Math.max(0, commandHistoryIdx - 1);
                    setCommandHistoryIdx(nextIdx);
                    setCommand(commandHistoryStack[nextIdx] ?? "");
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    if (commandHistoryIdx < 0) return;
                    const nextIdx = commandHistoryIdx + 1;
                    if (nextIdx >= commandHistoryStack.length) {
                      setCommandHistoryIdx(-1);
                      setCommand("");
                    } else {
                      setCommandHistoryIdx(nextIdx);
                      setCommand(commandHistoryStack[nextIdx]);
                    }
                  }
                }}
                aria-label="Terminal command"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
                readOnly={isRunningCommand || !sessionId}
                placeholder={
                  sessionId
                    ? "Type a command  (↑/↓ for history)"
                    : "Session not ready"
                }
              />
              {isRunningCommand && (
                <span className="term-status">Running…</span>
              )}
            </form>
          </section>

          {/* Coach */}
          <section className="card coach-panel">
            <div className="coach-header">
              <div className="coach-header-left">
                <span className="tutor-badge">
                  <span className="tutor-led" />
                  tutor <span className="tutor-ver">v1</span>
                </span>
                <h2>AI Coach</h2>
                <span className="badge badge-pill badge-tutor">
                  bedrock
                </span>
              </div>
              <div
                className="hint-progress"
                role="progressbar"
                aria-label="Hint level"
                aria-valuemin={0}
                aria-valuemax={4}
                aria-valuenow={filled}
                aria-valuetext={`Hint level ${filled} of 4`}
              >
                <span className="label">
                  Hint Level {filled} of 4
                </span>
                <div className="hint-bars" aria-hidden="true">{bars}</div>
              </div>
            </div>

            <div className="coach-body">
              <div
                className="coach-history"
                ref={coachHistoryRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-busy={isCoachLoading}
                aria-label="AI Coach conversation"
              >
                {coachHistory.length === 0 && (
                  <div className="coach-empty">
                    <div className="coach-mascot-wrap">
                      <CoachMascot />
                    </div>
                    <p className="coach-empty-title">Coach standing by</p>
                    <p className="coach-empty-sub">
                      Ask a question, request a hint, or investigate
                      the incident in the terminal.
                    </p>
                    <div className="coach-quick">
                      <button
                        type="button"
                        className="quick-chip"
                        onClick={getHint}
                        disabled={!sessionId || isCoachLoading}
                      >
                        <IconLightbulb /> Give me a hint
                      </button>
                      <button
                        type="button"
                        className="quick-chip"
                        onClick={() =>
                          requestCoach(
                            "ask",
                            "Where should I start investigating?",
                            "Where should I start investigating?"
                          )
                        }
                        disabled={!sessionId || isCoachLoading}
                      >
                        <IconChat /> Where do I start?
                      </button>
                      <button
                        type="button"
                        className="quick-chip"
                        onClick={() =>
                          requestCoach(
                            "ask",
                            "What concept does this incident test?",
                            "What concept does this incident test?"
                          )
                        }
                        disabled={!sessionId || isCoachLoading}
                      >
                        <IconBook /> What am I learning?
                      </button>
                    </div>
                  </div>
                )}

                {coachHistory.map((entry, index) => (
                  <div
                    key={index}
                    className={`msg ${entry.role === "assistant" ? "assistant" : "user"}`}
                  >
                    <div
                      className={`msg-avatar ${entry.role === "assistant" ? "assistant" : "user"}`}
                      aria-hidden="true"
                    >
                      {entry.role === "assistant" ? <IconBot /> : <IconUserSm />}
                    </div>
                    <div className="msg-bubble">
                      <div className="msg-role">
                        {entry.role === "assistant"
                          ? "AI Coach"
                          : "You"}
                      </div>
                      <p className="msg-text">{entry.message}</p>
                      {entry.concept && (
                        <span className="msg-concept">
                          Concept: {entry.concept}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {isCoachLoading && (
                  <div className="msg assistant">
                    <div className="msg-avatar assistant" aria-hidden="true">
                      <IconBot />
                    </div>
                    <div className="msg-bubble">
                      <div className="msg-role">AI Coach</div>
                      <p className="msg-text typing">
                        <span></span><span></span><span></span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {(concept ||
                suggestedNextAction ||
                (conceptsNeedingHelp && conceptsNeedingHelp.length > 0) ||
                (misconceptionsDetected &&
                  misconceptionsDetected.length > 0)) && (
                <div className="learning-cards">
                  {concept && (
                    <div className="learning-card concept">
                      <div className="icon-chip blue">
                        <IconBook />
                      </div>
                      <div className="lc-body">
                        <div className="lc-title">Concept</div>
                        <p className="lc-text">{concept}</p>
                      </div>
                    </div>
                  )}
                  {suggestedNextAction && (
                    <div className="learning-card next">
                      <div className="icon-chip amber">
                        <IconLightbulb />
                      </div>
                      <div className="lc-body">
                        <div className="lc-title">
                          Suggested next step
                        </div>
                        <p className="lc-text">
                          {suggestedNextAction}
                        </p>
                      </div>
                    </div>
                  )}
                  {conceptsNeedingHelp &&
                    conceptsNeedingHelp.length > 0 && (
                      <div className="learning-card help">
                        <div className="icon-chip cyan">
                          <IconInfo />
                        </div>
                        <div className="lc-body">
                          <div className="lc-title">
                            Concepts needing help
                          </div>
                          <div className="chip-row">
                            {conceptsNeedingHelp.map((c, i) => (
                              <span key={i} className="chip">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  {misconceptionsDetected &&
                    misconceptionsDetected.length > 0 && (
                      <div className="learning-card miscon">
                        <div className="icon-chip red">
                          <IconWarn />
                        </div>
                        <div className="lc-body">
                          <div className="lc-title">
                            Misconceptions
                          </div>
                          <div className="chip-row">
                            {misconceptionsDetected.map((m, i) => (
                              <span key={i} className="chip warn">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {coachError && (
                <p className="error-message">{coachError}</p>
              )}

              <form className="coach-input-row" onSubmit={askCoach}>
                <input
                  type="text"
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  placeholder="Ask a question, get a hint, or share your thinking…"
                  disabled={!sessionId || isCoachLoading}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-icon"
                  aria-label="Ask coach"
                  disabled={
                    !sessionId || isCoachLoading || !coachInput.trim()
                  }
                >
                  <IconSend />
                </button>
              </form>

              <div className="coach-actions">
                <button
                  type="button"
                  className="btn btn-hint"
                  onClick={getHint}
                  disabled={!sessionId || isCoachLoading}
                >
                  <IconLightbulb /> Get Hint
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={explainLastOutput}
                  disabled={
                    !sessionId ||
                    isCoachLoading ||
                    history.length === 0
                  }
                >
                  <IconDoc /> Explain Last Output
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={checkMyThinking}
                  disabled={!sessionId || isCoachLoading}
                >
                  <IconCheck /> Check My Thinking
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* -------- Diagnose + resolve -------- */}
        <section className="card diagnose-card">
          <div className="card-header">
            <div className="card-title">
              <div className="icon-chip blue">
                <IconClipboard />
              </div>
              <div>
                <h2>Diagnose + Resolve</h2>
                <span className="sub">
                  Summarize your findings and propose a resolution.
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={submitDiagnosis} className="card-body">
            <div className="diagnose-grid">
              <div className="field">
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
                  placeholder="Describe what you believe is causing the problem…"
                  required
                />
              </div>
              <div className="field">
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
                  placeholder="Describe the steps you would take to resolve the incident…"
                  required
                />
              </div>
            </div>

            {submissionMessage && (
              <p className="error-message">{submissionMessage}</p>
            )}

            <div className="diagnose-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <IconSend />
                {isSubmitting ? "Scoring…" : "Submit Resolution"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={checkMyThinking}
                disabled={!sessionId || isCoachLoading}
              >
                <IconCheck /> Check My Thinking
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
