import React, { useMemo, useState } from "react";

const vocab = [
  {
    term: "Experiment",
    meaning: "An action we perform to see what result happens.",
    example: "Tossing a coin or rolling a die.",
  },
  {
    term: "Outcome",
    meaning: "One possible result of an experiment.",
    example: "Head is one outcome of a coin toss.",
  },
  {
    term: "Sample Space",
    meaning: "The set of all possible outcomes.",
    example: "For a coin toss: {Head, Tail}",
  },
  {
    term: "Event",
    meaning: "A group of outcomes we are interested in.",
    example: "Getting an even number on a die: {2, 4, 6}",
  },
  {
    term: "Favorable Outcomes",
    meaning: "The outcomes that match the event.",
    example: "For number greater than 4: {5, 6}",
  },
];

const quizItems = [
  {
    q: "What is the sample space of a coin toss?",
    options: ["{1,2}", "{Head, Tail}", "{Red, Blue}", "{Odd, Even}"],
    answer: "{Head, Tail}",
  },
  {
    q: "Which word means all possible outcomes?",
    options: ["Event", "Outcome", "Sample Space", "Experiment"],
    answer: "Sample Space",
  },
  {
    q: "Which are favorable outcomes for getting an even number on a die?",
    options: ["{1,3,5}", "{2,4,6}", "{4,5,6}", "{1,2,3}"],
    answer: "{2,4,6}",
  },
];

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl bg-white shadow-lg ${className}`}>{children}</div>;
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-2xl border border-slate-300 bg-white px-4 py-2 font-semibold hover:bg-slate-50 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="text-slate-600">{subtitle}</p>
    </div>
  );
}

function CoinVisual({ side }) {
  return (
    <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-8 border-yellow-300 bg-yellow-100 text-3xl font-bold shadow-lg">
      {side === "Head" ? "H" : "T"}
    </div>
  );
}

function DieFace({ value }) {
  const dots = {
    1: [[2, 2]],
    2: [[1, 1], [3, 3]],
    3: [[1, 1], [2, 2], [3, 3]],
    4: [[1, 1], [1, 3], [3, 1], [3, 3]],
    5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
    6: [[1, 1], [1, 3], [2, 1], [2, 3], [3, 1], [3, 3]],
  };

  return (
    <div className="mx-auto grid h-40 w-40 grid-cols-3 grid-rows-3 rounded-3xl border bg-white p-4 shadow-lg">
      {Array.from({ length: 9 }).map((_, i) => {
        const r = Math.floor(i / 3) + 1;
        const c = (i % 3) + 1;
        const active = dots[value]?.some(([dr, dc]) => dr === r && dc === c);
        return (
          <div key={i} className="flex items-center justify-center">
            <div className={active ? "h-4 w-4 rounded-full bg-slate-800" : "h-4 w-4 rounded-full bg-transparent"} />
          </div>
        );
      })}
    </div>
  );
}

function EqualSpinner({ angle }) {
  return (
    <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
      <div className="absolute top-2 z-20">
        <div className="h-0 w-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-slate-900" />
      </div>
      <div
        className="h-56 w-56 rounded-full border-8 border-slate-700 shadow-xl transition-transform duration-700 ease-out"
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: "center",
          background:
            "conic-gradient(from -90deg, #ef4444 0deg 90deg, #3b82f6 90deg 180deg, #22c55e 180deg 270deg, #eab308 270deg 360deg)",
        }}
      />
      <div className="absolute flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-slate-700 bg-white" />
      </div>
    </div>
  );
}

function HomeworkSpinner({ angle }) {
  return (
    <div className="relative mx-auto flex h-72 w-72 items-center justify-center overflow-visible">
      <div className="absolute top-3 z-20">
        <div className="h-0 w-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-slate-900" />
      </div>
      <div
        className="h-60 w-60 rounded-full border-8 border-slate-700 shadow-xl transition-transform duration-[2000ms] ease-out"
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: "center",
          background: "conic-gradient(from -90deg, #22c55e 0deg 356deg, #ef4444 356deg 360deg)",
        }}
      />
      <div className="absolute flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-4 border-slate-700 bg-white" />
      </div>
    </div>
  );
}

export default function ProbabilityLessonWebsite() {
  const [activeTab, setActiveTab] = useState("vocab");
  const [coinSide, setCoinSide] = useState("Head");
  const [dieValue, setDieValue] = useState(1);
  const [spinnerAngle, setSpinnerAngle] = useState(0);
  const [spinnerResult, setSpinnerResult] = useState("Red");
  const [homeworkAngle, setHomeworkAngle] = useState(0);
  const [homeworkResult, setHomeworkResult] = useState("Homework");
  const [eventInput, setEventInput] = useState("even");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [whiteboardText, setWhiteboardText] = useState("");

  const currentQuiz = quizItems[quizIndex];

  const eventAnswer = useMemo(() => {
    const e = eventInput.trim().toLowerCase();
    if (e.includes("even")) return "{2, 4, 6}";
    if (e.includes("odd")) return "{1, 3, 5}";
    if (e.includes("greater than 4") || e.includes(">4")) return "{5, 6}";
    if (e.includes("less than 3") || e.includes("<3")) return "{1, 2}";
    if (e.includes("prime")) return "{2, 3, 5}";
    return "Try: even, odd, greater than 4, less than 3, or prime";
  }, [eventInput]);

  const tossCoin = () => setCoinSide(Math.random() < 0.5 ? "Head" : "Tail");
  const rollDie = () => setDieValue(Math.floor(Math.random() * 6) + 1);

  const spinEqualSpinner = () => {
    const results = ["Red", "Blue", "Green", "Yellow"];
    const chosen = results[Math.floor(Math.random() * results.length)];
    const indexMap = { Red: 0, Blue: 1, Green: 2, Yellow: 3 };
    const target = indexMap[chosen] * 90 + 45;
    setSpinnerAngle((prev) => prev + 720 + (360 - target));
    setSpinnerResult(chosen);
  };

  const spinHomeworkWheel = () => {
    const isHomework = Math.random() < 0.99;
    const chosenWheelAngle = isHomework ? 8 + Math.random() * 340 : 358;
    const targetRotation = 270 - chosenWheelAngle;
    const normalized = ((targetRotation % 360) + 360) % 360;
    setHomeworkAngle((prev) => prev + 1080 + normalized);
    setHomeworkResult(isHomework ? "Homework" : "No Homework");
  };

  const checkAnswer = () => {
    if (!selected) return;
    setChecked(true);
  };

  const nextQuestion = () => {
    if (quizIndex < quizItems.length - 1) {
      setQuizIndex((i) => i + 1);
    } else {
      setQuizIndex(0);
    }
    setSelected("");
    setChecked(false);
  };

  const tabButton = (value, label) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`rounded-xl px-3 py-2 text-sm font-semibold ${activeTab === value ? "bg-white shadow" : "text-slate-600"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 pb-40 text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border border-slate-200 p-8 md:p-10">
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">Learn Probability with Coins, Dice, and Spinners</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Watch the spinner carefully and predict the result. What do you notice about the size of each section?
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#lesson"><Button>Start Lesson</Button></a>
              <a href="#activities"><Button>Go to Activities</Button></a>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-50 p-6 text-center">
              <p className="mb-4 text-lg font-bold">Homework Spinner</p>
              <HomeworkSpinner angle={homeworkAngle} />
              <div className="mt-4 flex justify-center">
                <Button onClick={spinHomeworkWheel}>Spin</Button>
              </div>
              <p className="mt-3 text-lg font-semibold">{homeworkResult}</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-600 to-sky-500 p-8 text-white">
            <h3 className="text-2xl font-bold">Learning Targets</h3>
            <div className="mt-5 space-y-4 text-sm leading-6">
              <div className="rounded-2xl bg-white/10 p-4">
                1. Understand experiment, outcome, event, sample space, and favorable outcomes.
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                2. List all elements of the sample space in a single experiment like a coin, die, spinner, or marble bag.
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="lesson" className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-6 grid w-full grid-cols-2 rounded-2xl bg-slate-100 p-1 md:grid-cols-6">
          {tabButton("vocab", "Vocabulary")}
          {tabButton("coin", "Coin")}
          {tabButton("die", "Die")}
          {tabButton("spinner", "Spinner")}
          {tabButton("events", "Events")}
          {tabButton("marbles", "Marbles")}
        </div>

        {activeTab === "vocab" && (
          <Card className="p-8">
            <SectionTitle title="Key Vocabulary" subtitle="Build meaning first using simple words and examples." />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {vocab.map((item) => (
                <div key={item.term} className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-5">
                  <h3 className="text-xl font-bold">{item.term}</h3>
                  <p className="mt-3 font-medium text-slate-700">{item.meaning}</p>
                  <p className="mt-3 text-sm text-slate-500">Example: {item.example}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "coin" && (
          <Card className="p-8">
            <SectionTitle title="Activity 1: Toss a Coin" subtitle="Use the visual, predict first, then identify outcomes and sample space." />
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <CoinVisual side={coinSide} />
                <div className="mt-5 flex justify-center gap-3">
                  <Button onClick={tossCoin}>Flip Coin</Button>
                  <Button onClick={() => setCoinSide("Head")}>Reset</Button>
                </div>
                <p className="mt-4 text-center text-lg font-semibold">Current outcome: {coinSide}</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-5"><p className="font-semibold">Experiment:</p><p>Tossing one coin</p></div>
                <div className="rounded-2xl bg-slate-50 p-5"><p className="font-semibold">Possible outcomes:</p><p>Head, Tail</p></div>
                <div className="rounded-2xl bg-indigo-50 p-5"><p className="font-semibold">Sample Space:</p><p className="text-xl font-bold">S = {"{Head, Tail}"}</p></div>
                <div className="rounded-2xl border border-dashed p-5 text-sm text-slate-600">Challenge: Predict the next result. How many outcomes are there? Can there be a third outcome?</div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "die" && (
          <Card className="p-8">
            <SectionTitle title="Activity 2: Roll a Die" subtitle="Observe a result and compare it with the full sample space." />
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <DieFace value={dieValue} />
                <div className="mt-5 flex justify-center gap-3">
                  <Button onClick={rollDie}>Roll Die</Button>
                  <Button onClick={() => setDieValue(1)}>Reset</Button>
                </div>
                <p className="mt-4 text-center text-lg font-semibold">Current outcome: {dieValue}</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-5"><p className="font-semibold">Experiment:</p><p>Rolling one fair die</p></div>
                <div className="rounded-2xl bg-indigo-50 p-5"><p className="font-semibold">Sample Space:</p><p className="text-xl font-bold">S = {"{1, 2, 3, 4, 5, 6}"}</p></div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className={`rounded-2xl border p-4 text-center text-lg font-bold ${dieValue === n ? "border-emerald-300 bg-emerald-100" : "bg-white"}`}>{n}</div>
                  ))}
                </div>
                <div className="rounded-2xl border border-dashed p-5 text-sm text-slate-600">Challenge: Which numbers are impossible? List all outcomes greater than 4. How many total outcomes are there?</div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "spinner" && (
          <Card className="p-8">
            <SectionTitle title="Activity 3: Spin a 4-Color Spinner" subtitle="Use color outcomes to practice writing sample space in words instead of numbers." />
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <EqualSpinner angle={spinnerAngle} />
                <div className="mt-5 flex justify-center gap-3">
                  <Button onClick={spinEqualSpinner}>Spin</Button>
                  <Button onClick={() => { setSpinnerAngle(0); setSpinnerResult("Red"); }}>Reset</Button>
                </div>
                <p className="mt-4 text-center text-lg font-semibold">Current outcome: {spinnerResult}</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-5"><p className="font-semibold">Possible outcomes:</p><p>Red, Blue, Green, Yellow</p></div>
                <div className="rounded-2xl bg-indigo-50 p-5"><p className="font-semibold">Sample Space:</p><p className="text-xl font-bold">S = {"{Red, Blue, Green, Yellow}"}</p></div>
                <div className="rounded-2xl border border-dashed p-5 text-sm text-slate-600">Challenge: Write the sample space. Which outcomes are favorable for Red or Blue? Which color is impossible?</div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "events" && (
          <Card className="p-8">
            <SectionTitle title="Events and Favorable Outcomes" subtitle="Type an event to see which die outcomes are favorable." />
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-3xl bg-slate-50 p-6">
                <label className="mb-2 block text-sm font-semibold text-slate-600">Try an event:</label>
                <input
                  value={eventInput}
                  onChange={(e) => setEventInput(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4"
                  placeholder="Type: even, odd, greater than 4, less than 3, prime"
                />
                <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Favorable outcomes</p>
                  <p className="mt-1 text-2xl font-bold text-indigo-700">{eventAnswer}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 p-6 text-white">
                <p className="text-lg font-bold">Examples</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="rounded-2xl bg-white/10 p-4">Event: even number → Favorable outcomes: {"{2, 4, 6}"}</div>
                  <div className="rounded-2xl bg-white/10 p-4">Event: odd number → Favorable outcomes: {"{1, 3, 5}"}</div>
                  <div className="rounded-2xl bg-white/10 p-4">Event: number greater than 4 → Favorable outcomes: {"{5, 6}"}</div>
                  <div className="rounded-2xl bg-white/10 p-4">Event: number less than 3 → Favorable outcomes: {"{1, 2}"}</div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "marbles" && (
          <Card className="p-8">
            <SectionTitle title="Activity 4: Pick a Marble" subtitle="A bag has 5 marbles: 3 blue and 2 red." />
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="flex justify-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-500 shadow" />
                <div className="h-16 w-16 rounded-full bg-blue-500 shadow" />
                <div className="h-16 w-16 rounded-full bg-blue-500 shadow" />
                <div className="h-16 w-16 rounded-full bg-red-500 shadow" />
                <div className="h-16 w-16 rounded-full bg-red-500 shadow" />
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-5"><p className="font-semibold">Experiment:</p><p>Picking one marble from a bag</p></div>
                <div className="rounded-2xl bg-indigo-50 p-5"><p className="font-semibold">Sample Space:</p><p className="text-xl font-bold">S = {"{Blue, Blue, Blue, Red, Red}"}</p></div>
                <div className="rounded-2xl border border-dashed p-5 text-sm text-slate-600">Challenge: How many marbles are there? Which outcomes are favorable for blue? Is getting red impossible?</div>
              </div>
            </div>
          </Card>
        )}
      </section>

      <section id="activities" className="mx-auto max-w-5xl px-4 py-8">
        <Card className="p-8">
          <h2 className="mb-4 text-2xl font-bold">Check Your Understanding</h2>
          <p className="mb-4 text-slate-600">Use this card to test events and outcomes.</p>
          <div className="grid gap-4">
            <div className="rounded-2xl bg-slate-100 p-4"><p className="font-semibold">Example Experiment</p><p>Rolling a die</p></div>
            <div className="rounded-2xl bg-slate-100 p-4"><p className="font-semibold">Sample Space</p><p>{"{1,2,3,4,5,6}"}</p></div>
            <div className="rounded-2xl bg-green-50 p-4"><p className="font-semibold">Event</p><p>Getting an even number</p></div>
            <div className="rounded-2xl bg-blue-50 p-4"><p className="font-semibold">Favorable Outcomes</p><p>{"{2,4,6}"}</p></div>
            <div className="rounded-2xl border border-dashed p-4 text-sm">Challenge: If the event is greater than 3, what are the favorable outcomes? If the event is odd number, which outcomes work? Can an outcome belong to two different events?</div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <Card className="p-8">
          <h2 className="mb-4 text-2xl font-bold">Differentiated Challenge</h2>
          <div className="space-y-4">
            <div className="rounded-2xl bg-green-50 p-4">Level 1: Write the sample space when a coin is tossed.</div>
            <div className="rounded-2xl bg-blue-50 p-4">Level 2: List favorable outcomes for getting an even number on a die.</div>
            <div className="rounded-2xl bg-purple-50 p-4">Level 3: Create your own spinner with 3 colors and write its sample space.</div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <Card className="p-8">
          <h2 className="mb-4 text-2xl font-bold">Quick MCQ Challenge</h2>
          <p className="mb-4 text-slate-600">Answer quickly before moving to the wrap-up.</p>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="mb-4 text-lg font-semibold">{currentQuiz.q}</p>
            <div className="space-y-3">
              {currentQuiz.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => !checked && setSelected(opt)}
                  className={`w-full rounded-xl border px-4 py-2 text-left ${selected === opt ? "border-indigo-400 bg-indigo-100" : "bg-white"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <Button onClick={checkAnswer} disabled={!selected || checked}>Check</Button>
              <Button onClick={nextQuestion}>Next</Button>
            </div>
            {checked && (
              <div className={`mt-4 rounded-xl p-3 ${selected === currentQuiz.answer ? "bg-green-100" : "bg-red-100"}`}>
                {selected === currentQuiz.answer ? "Correct!" : `Correct answer: ${currentQuiz.answer}`}
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Lesson Wrap-Up</h2>
          <p className="mb-6 text-lg">Quick reflection before we finish:</p>
          <div className="mx-auto max-w-xl space-y-4 text-left">
            <div className="rounded-2xl bg-slate-100 p-4">1. What is an experiment?</div>
            <div className="rounded-2xl bg-slate-100 p-4">2. What is the sample space of a coin toss?</div>
            <div className="rounded-2xl bg-slate-100 p-4">3. If we roll a die, which outcomes are even?</div>
            <div className="rounded-2xl bg-slate-100 p-4">4. In the marble bag, which color is more likely?</div>
          </div>
          <p className="mt-6 font-semibold">Exit Question: Why do some outcomes happen more often than others?</p>
        </Card>
      </section>

      <div className="fixed bottom-4 right-4 z-50 w-[320px] max-w-[calc(100vw-2rem)]">
        <Card className="border border-slate-300 bg-white/95 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold">Whiteboard</h3>
            <Button className="px-3 py-1 text-xs" onClick={() => setWhiteboardText("")}>Clear</Button>
          </div>
          <textarea
            value={whiteboardText}
            onChange={(e) => setWhiteboardText(e.target.value)}
            placeholder="Type notes, answers, or examples here..."
            className="min-h-[180px] w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm outline-none"
          />
        </Card>
      </div>
    </div>
  );
}
