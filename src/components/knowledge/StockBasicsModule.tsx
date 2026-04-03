import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STOCK_BASICS, type StockBasicsTopic } from "@/data/stockBasics";
import StockVisual from "./diagrams/StockVisual";

const INK = "#0F172A";
const INK_MUTED = "#475569";
const COPPER = "#0D9488";
const AMBER = "#D97706";
const RED = "#DC2626";
const GREEN = "#16A34A";

/* ── Quiz data (3 questions per topic, by index) ─────────── */
interface QuizQ { q: string; options: string[]; correct: number; explanation: string; }

const QUIZ_DATA: QuizQ[][] = [
  // Topic 0 — What is a Stock
  [
    { q: "What does owning stock in a company actually mean?", options: ["You can use their office space", "You own a proportional share of the company's assets and earnings", "You get a fixed monthly dividend", "You become an employee"], correct: 1, explanation: "Stock ownership gives you a fractional claim on the company's value — its assets and future earnings." },
    { q: "If a company has 1,000 shares and you own 10, what % do you own?", options: ["0.1%", "1%", "10%", "100%"], correct: 1, explanation: "10 ÷ 1,000 = 1%. Your ownership percentage is simply your shares divided by total outstanding shares." },
    { q: "Which best describes 'common stock'?", options: ["Bonds with interest payments", "Ownership shares that may include voting rights", "Guaranteed savings accounts", "A type of mutual fund"], correct: 1, explanation: "Common stockholders get voting rights and potential dividends, but are last in line if the company liquidates." },
  ],
  // Topic 1 — Stock Exchanges
  [
    { q: "What is a stock exchange?", options: ["A bank that lends to companies", "A regulated marketplace where shares are bought and sold", "A government agency", "A type of insurance product"], correct: 1, explanation: "Exchanges like NYSE and NASDAQ provide the infrastructure and rules for buyers/sellers to transact." },
    { q: "What does 'market hours' mean for NYSE?", options: ["24/7 trading", "9:30 AM – 4:00 PM ET on weekdays", "Midnight trading only", "Weekends only"], correct: 1, explanation: "Most major exchanges operate during set business hours. After-hours trading exists but has lower volume." },
    { q: "What is a 'listing requirement'?", options: ["A minimum number of investors needed to buy", "Standards a company must meet to have its shares traded on an exchange", "The cost to buy shares", "A type of stock order"], correct: 1, explanation: "Exchanges set requirements on market cap, revenue, and governance before a company can be listed." },
  ],
  // Topic 2 — How Prices Work
  [
    { q: "What primarily drives a stock's price moment-to-moment?", options: ["The CEO's mood", "Supply and demand from buyers and sellers", "Government mandates", "The stock's book value alone"], correct: 1, explanation: "Price reflects the aggregate belief of all buyers and sellers — when more people want to buy than sell, price rises." },
    { q: "What is the 'bid-ask spread'?", options: ["The gap between a company's profits and losses", "The difference between the highest price a buyer will pay and the lowest a seller will accept", "A trading fee", "A measure of volatility"], correct: 1, explanation: "The bid is the max buyers want to pay; the ask is the min sellers want. The spread is their difference — it's a hidden transaction cost." },
    { q: "A stock's 52-week high tells you:", options: ["What the stock will be worth next year", "The highest price it has traded at in the past year", "The guaranteed minimum price", "The company's book value"], correct: 1, explanation: "The 52-week high is just historical context — it shows sentiment range but doesn't predict future prices." },
  ],
  // Topic 3 — Market Cap
  [
    { q: "How is market capitalization calculated?", options: ["Revenue × Profit margin", "Share price × Total shares outstanding", "Assets − Liabilities", "Earnings per share × 10"], correct: 1, explanation: "Market cap = price × shares outstanding. It measures what the market believes the entire company is worth right now." },
    { q: "Which of these is typically classified as a 'large-cap' company?", options: ["A startup with $10M value", "A regional retailer worth $500M", "A global corporation worth $200B+", "Any company with > 1000 employees"], correct: 2, explanation: "Large-cap is generally > $10B. The $200B example dwarfs even that threshold." },
    { q: "Why might a small-cap stock be riskier than a large-cap?", options: ["They pay higher dividends", "Less liquidity, less analyst coverage, and more vulnerable to economic shocks", "They trade on different exchanges", "Government doesn't regulate them"], correct: 1, explanation: "Small-caps often have less institutional support, thinner trading volumes, and fewer resources to weather downturns." },
  ],
  // Topic 4 — P/E Ratio
  [
    { q: "What does a P/E ratio of 20 mean?", options: ["The stock costs $20", "Investors pay $20 for every $1 of earnings", "The company has 20% profit margin", "The stock is 20% undervalued"], correct: 1, explanation: "P/E = Price ÷ Earnings per share. A P/E of 20 means you're paying 20x the annual earnings for each share." },
    { q: "A very high P/E ratio typically implies:", options: ["The company is going bankrupt", "Investors expect strong future growth", "The stock is definitely overvalued", "Low risk investment"], correct: 1, explanation: "High P/E often signals growth expectations — investors pay a premium today expecting earnings to rise significantly." },
    { q: "Which sector typically has higher P/E ratios?", options: ["Utilities", "Banks", "Technology/Growth", "Mining"], correct: 2, explanation: "Tech and high-growth sectors command premium P/E ratios because investors project rapid future earnings expansion." },
  ],
  // Topic 5 — Dividends
  [
    { q: "What is a dividend?", options: ["A penalty for owning stock too long", "A portion of company profits distributed to shareholders", "The spread between buy/sell price", "A type of stock split"], correct: 1, explanation: "Dividends are cash (or additional shares) distributed to shareholders, usually quarterly, from company profits." },
    { q: "Dividend yield is calculated as:", options: ["Dividend ÷ Share price × 100", "Share price ÷ Dividend × 100", "Earnings ÷ Dividend", "Dividend × Revenue"], correct: 0, explanation: "Yield = (Annual dividend ÷ current price) × 100. A $2 dividend on a $40 stock = 5% yield." },
    { q: "An 'ex-dividend date' means:", options: ["The company stopped paying dividends", "You must own the stock before this date to receive the next dividend", "Dividends are taxed after this date", "The dividend payment date"], correct: 1, explanation: "Buy before the ex-date = you get the dividend. Buy on or after = the previous owner gets it." },
  ],
  // Topic 6 — Bull vs Bear Markets
  [
    { q: "A 'bear market' is defined as:", options: ["A market with heavy institutional trading", "A decline of 20% or more from recent highs over a sustained period", "Any day the market falls", "A period of very low trading volume"], correct: 1, explanation: "The 20% threshold from recent highs over at least 2 months is the standard definition of a bear market." },
    { q: "What does 'buying the dip' mean?", options: ["Purchasing stocks that pay high dividends", "Buying shares when prices have temporarily fallen", "Shorting a declining stock", "Investing in commodities"], correct: 1, explanation: "Buying the dip is a strategy of purchasing after price drops, betting the dip is temporary rather than a trend." },
    { q: "Historically, how long do bull markets last compared to bear markets?", options: ["About the same duration", "Bull markets are shorter", "Bull markets are significantly longer on average", "Bear markets never end"], correct: 2, explanation: "Bull markets historically last much longer (years) than bear markets (months to ~1.5 years). Time in market matters." },
  ],
  // Topic 7 — Buying Your First Stock
  [
    { q: "What is a 'market order'?", options: ["An order placed only during pre-market hours", "An instruction to buy/sell immediately at the current market price", "An order that expires after one month", "A bulk purchase discount"], correct: 1, explanation: "Market orders execute immediately at whatever price is available. Fast but you don't control the exact price." },
    { q: "Why might a beginner prefer an index fund over individual stocks?", options: ["Index funds always outperform stocks", "They provide instant diversification across many companies", "They have no fees", "They're only available to professionals"], correct: 1, explanation: "Index funds spread risk across dozens or hundreds of companies, reducing the impact of any single stock's failure." },
    { q: "What does 'dollar-cost averaging' (DCA) mean?", options: ["Buying stocks at their 52-week low", "Investing a fixed amount at regular intervals regardless of price", "Timing the market perfectly", "Only buying stocks under $10"], correct: 1, explanation: "DCA removes timing pressure — you buy more shares when prices are low and fewer when high, averaging your cost basis." },
  ],
  // Topic 8 — Risk & Diversification
  [
    { q: "Diversification primarily helps by:", options: ["Guaranteeing higher returns", "Reducing the impact of any single investment's poor performance", "Increasing trading frequency", "Eliminating market risk entirely"], correct: 1, explanation: "Diversification doesn't eliminate risk, but it ensures one bad stock can't devastate your entire portfolio." },
    { q: "What is 'systematic risk'?", options: ["Risk from poor company management", "Market-wide risk that affects all stocks, not just one", "Risk from IT system failures", "Currency exchange risk"], correct: 1, explanation: "Systematic risk (market risk) can't be diversified away — things like recessions, pandemics, and rate hikes affect everything." },
    { q: "A portfolio of 20 uncorrelated stocks is generally:", options: ["Riskier than 1 stock", "Safer than 1 stock due to diversification", "Identical in risk to 1 stock", "Only safe for professionals"], correct: 1, explanation: "Research shows most diversification benefit is captured by ~15-20 stocks across different sectors and geographies." },
  ],
  // Topic 9 — Reading the Tape
  [
    { q: "What does 'volume' tell you about a stock movement?", options: ["Nothing useful", "High volume confirms the move has conviction; low volume may be noise", "Volume predicts exactly where price goes next", "Volume equals market cap"], correct: 1, explanation: "A price move on high volume is considered more significant than the same move on thin volume — it shows conviction." },
    { q: "What is 'relative strength' in stock analysis?", options: ["How much the stock can withstand earthquakes", "How a stock is performing compared to the broader market or peers", "A technical measure of RSI only", "The stock's beta value"], correct: 1, explanation: "Relative strength shows whether a stock is outperforming or underperforming its benchmark — useful for momentum strategies." },
    { q: "If a stock breaks through a key resistance level on high volume, traders typically interpret this as:", options: ["A sell signal", "A potential bullish breakout confirmation", "Market manipulation", "A neutral signal"], correct: 1, explanation: "Resistance levels that break on strong volume suggest real buying conviction, not just noise — often a bullish sign." },
  ],
];

/* ── Quiz sub-component ──────────────────────────────────── */
const TopicQuiz = ({ topicIndex, onPass, onFail }: { topicIndex: number; onPass: () => void; onFail: () => void; }) => {
  const questions = QUIZ_DATA[topicIndex] ?? QUIZ_DATA[0];
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const current = questions[qi];
  const answered = answers[qi] !== null;
  const allAnswered = answers.every(a => a !== null);
  const score = answers.filter((a, i) => a === questions[i].correct).length;

  const select = (idx: number) => {
    if (answers[qi] !== null) return;
    setAnswers(prev => { const n = [...prev]; n[qi] = idx; return n; });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (score >= 2) onPass(); else onFail();
  };

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        {questions.map((_, i) => (
          <button key={i} onClick={() => setQi(i)}
            className="w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-all"
            style={{
              background: i === qi ? INK : answers[i] !== null ? (answers[i] === questions[i].correct ? `${GREEN}15` : `${RED}15`) : `${INK}06`,
              color: i === qi ? "#F8FAFC" : answers[i] !== null ? (answers[i] === questions[i].correct ? GREEN : RED) : INK_MUTED,
              border: `1.5px solid ${i === qi ? INK : answers[i] !== null ? (answers[i] === questions[i].correct ? `${GREEN}30` : `${RED}30`) : `${INK}10`}`,
            }}>
            {answers[i] !== null ? (answers[i] === questions[i].correct ? "✓" : "✗") : i + 1}
          </button>
        ))}
        <span className="font-mono text-xs ml-auto" style={{ color: INK_MUTED }}>
          {answers.filter(a => a !== null).length}/{questions.length} answered
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={qi} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
          <p className="font-display text-base leading-relaxed mb-4" style={{ color: INK }}>
            <span className="font-mono text-xs mr-2" style={{ color: INK_MUTED }}>Q{qi + 1}.</span>
            {current.q}
          </p>
          <div className="space-y-2">
            {current.options.map((opt, i) => {
              const sel = answers[qi] === i;
              const correct = current.correct === i;
              const showResult = answers[qi] !== null;
              let bg = `${INK}03`; let border = `${INK}08`; let tc = INK;
              if (showResult && correct) { bg = `${GREEN}10`; border = `${GREEN}30`; tc = GREEN; }
              else if (showResult && sel && !correct) { bg = `${RED}08`; border = `${RED}25`; tc = RED; }
              return (
                <button key={i} onClick={() => select(i)}
                  className="w-full text-left px-4 py-3 rounded-xl font-display text-sm transition-all"
                  style={{ background: bg, border: `1.5px solid ${border}`, color: tc }}>
                  <span className="font-mono text-xs mr-3" style={{ color: INK_MUTED }}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                  {showResult && correct && <span className="ml-2 font-bold">✓</span>}
                </button>
              );
            })}
          </div>

          {answered && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-xl text-sm"
              style={{ background: answers[qi] === current.correct ? `${GREEN}08` : `${AMBER}08`, borderLeft: `2px solid ${answers[qi] === current.correct ? GREEN : AMBER}` }}>
              <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>
                💡 {current.explanation}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-2">
        {qi > 0 && (
          <button onClick={() => setQi(q => q - 1)} className="px-4 py-2 font-mono text-xs rounded-lg transition-all"
            style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>← Back</button>
        )}
        {qi < questions.length - 1 ? (
          <button onClick={() => setQi(q => q + 1)} disabled={!answered}
            className="ml-auto px-4 py-2 font-mono text-xs rounded-lg transition-all disabled:opacity-30"
            style={{ background: INK, color: "#F8FAFC" }}>Next →</button>
        ) : allAnswered && !submitted ? (
          <button onClick={handleSubmit} className="ml-auto px-6 py-2 font-mono text-xs rounded-lg transition-all"
            style={{ background: score >= 2 ? GREEN : RED, color: "#fff" }}>
            Submit — {score}/{questions.length} correct
          </button>
        ) : null}
      </div>
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────── */
interface StockBasicsModuleProps { onBack: () => void; }

const StockBasicsModule = ({ onBack }: StockBasicsModuleProps) => {
  const [activeTopic, setActiveTopic] = useState<StockBasicsTopic | null>(null);
  const [view, setView] = useState<"read" | "quiz">("read");
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [read, setRead] = useState<Set<string>>(new Set());
  const [quizFailed, setQuizFailed] = useState(false);

  const progress = Math.round((mastered.size / STOCK_BASICS.length) * 100);

  const handleOpenTopic = (topic: StockBasicsTopic) => {
    setActiveTopic(topic);
    setView("read");
    setQuizFailed(false);
    setRead(prev => new Set(prev).add(topic.id));
  };

  const handlePass = () => {
    if (activeTopic) setMastered(prev => new Set(prev).add(activeTopic.id));
    setView("read");
  };

  const handleFail = () => { setQuizFailed(true); setView("read"); };

  if (activeTopic) {
    const idx = STOCK_BASICS.findIndex(t => t.id === activeTopic.id);
    const isMastered = mastered.has(activeTopic.id);

    return (
      <div className="h-full flex flex-col" style={{ background: "#F8FAFC" }}>
        <div className="shrink-0 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${INK}08` }}>
          <button onClick={() => { setActiveTopic(null); setView("read"); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
            style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            <span className="font-mono text-xs">Topics</span>
          </button>
          <div className="flex items-center gap-2">
            {isMastered && (
              <span className="font-mono text-xs px-3 py-1 rounded-full"
                style={{ background: `${GREEN}10`, color: GREEN, border: `1px solid ${GREEN}20` }}>
                ✓ Mastered
              </span>
            )}
            <h2 className="font-display text-lg font-bold" style={{ color: INK }}>
              {activeTopic.icon} {activeTopic.title}
            </h2>
          </div>
        </div>

        {/* Tab bar */}
        <div className="shrink-0 px-4 md:px-8 pt-3 flex gap-2" style={{ borderBottom: `1px solid ${INK}06` }}>
          {([["read", "📖 Read"], ["quiz", "🧪 Quiz"]] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => { setView(tab); setQuizFailed(false); }}
              className="px-4 pb-3 font-mono text-xs uppercase tracking-widest transition-all"
              style={{
                color: view === tab ? COPPER : INK_MUTED,
                borderBottom: view === tab ? `2px solid ${COPPER}` : "2px solid transparent",
              }}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto">
            {view === "read" ? (
              <div className="space-y-4">
                <StockVisual topicId={activeTopic.id} />
                {quizFailed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-4 rounded-xl" style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}20` }}>
                    <p className="font-display text-sm" style={{ color: AMBER }}>
                      📖 Review the content below, then try the quiz again — you need 2/3 to master this topic.
                    </p>
                  </motion.div>
                )}
                {activeTopic.content.map((paragraph, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }} className="p-4 md:p-5 rounded-xl"
                    style={{ background: `${INK}02`, borderLeft: `2px solid ${COPPER}20` }}>
                    <div className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center font-mono text-xs rounded"
                        style={{ background: `${COPPER}10`, color: COPPER }}>{i + 1}</span>
                      <p className="font-display text-sm leading-relaxed" style={{ color: INK }}>{paragraph}</p>
                    </div>
                  </motion.div>
                ))}
                {!isMastered && (
                  <motion.button onClick={() => setView("quiz")} whileHover={{ scale: 1.02 }}
                    className="w-full py-3 mt-4 font-mono text-sm uppercase tracking-widest rounded-xl"
                    style={{ background: COPPER, color: "#fff" }}>
                    Test Your Understanding →
                  </motion.button>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-5 p-4 rounded-xl" style={{ background: `${INK}03`, border: `1px solid ${INK}08` }}>
                  <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: INK_MUTED }}>Quick Quiz</p>
                  <h3 className="font-display text-base font-bold" style={{ color: INK }}>{activeTopic.title}</h3>
                  <p className="font-mono text-xs mt-1" style={{ color: INK_MUTED }}>Get 2 of 3 correct to mark as mastered</p>
                </div>
                <TopicQuiz topicIndex={idx} onPass={handlePass} onFail={handleFail} />
              </div>
            )}
          </div>

          <div className="max-w-2xl mx-auto mt-8 flex items-center justify-between">
            <button onClick={() => { const i = STOCK_BASICS.findIndex(t => t.id === activeTopic.id); if (i > 0) handleOpenTopic(STOCK_BASICS[i - 1]); }}
              disabled={idx === 0}
              className="flex items-center gap-1 px-3 py-1.5 font-mono text-xs rounded-lg disabled:opacity-20 transition-all"
              style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>← Prev</button>
            <span className="font-mono text-xs" style={{ color: INK_MUTED }}>{idx + 1} / {STOCK_BASICS.length}</span>
            <button onClick={() => { if (idx < STOCK_BASICS.length - 1) handleOpenTopic(STOCK_BASICS[idx + 1]); }}
              disabled={idx === STOCK_BASICS.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 font-mono text-xs rounded-lg disabled:opacity-20 transition-all"
              style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>Next →</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6" style={{ background: "#F8FAFC" }}>
      <div className="shrink-0 mb-6 flex items-center gap-3">
        <button onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
          style={{ color: INK_MUTED, background: `${INK}04`, border: `1px solid ${INK}08` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          <span className="font-mono text-xs">Hub</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold mb-2" style={{ color: INK }}>Stock Market 101</h2>
          <p className="font-mono text-xs max-w-md mx-auto" style={{ color: INK_MUTED }}>
            Read each topic, take the quiz, earn mastery badges. You need 2/3 on each quiz.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 p-4 rounded-2xl" style={{ background: `${INK}03`, border: `1px solid ${INK}08` }}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: INK_MUTED }}>Your Progress</p>
            <p className="font-display text-sm font-bold" style={{ color: mastered.size === STOCK_BASICS.length ? GREEN : COPPER }}>
              {mastered.size}/{STOCK_BASICS.length} mastered
            </p>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: `${INK}08` }}>
            <motion.div className="h-full rounded-full" style={{ background: COPPER }}
              animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
          </div>
          {mastered.size === STOCK_BASICS.length && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-display text-sm font-bold text-center mt-2" style={{ color: GREEN }}>
              🏆 All topics mastered! You understand the market.
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {STOCK_BASICS.map((topic, i) => {
            const isMastered = mastered.has(topic.id);
            const isRead = read.has(topic.id);
            return (
              <motion.button key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} onClick={() => handleOpenTopic(topic)}
                className="text-left p-4 md:p-5 transition-all group rounded-xl"
                style={{ background: isMastered ? `${GREEN}06` : `${INK}02`, border: `1.5px solid ${isMastered ? `${GREEN}20` : `${INK}08`}` }}
                whileHover={{ y: -2, rotate: 0.5 }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base mb-0.5" style={{ color: INK }}>{topic.title}</h3>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs" style={{ color: INK_MUTED }}>{topic.content.length} cards</p>
                      {isMastered && <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${GREEN}12`, color: GREEN }}>✓ Mastered</span>}
                      {isRead && !isMastered && <span className="font-mono text-[10px]" style={{ color: AMBER }}>• Take quiz</span>}
                    </div>
                  </div>
                  <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: COPPER }}>→</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-8 text-center p-4 rounded-xl"
          style={{ background: `${INK}03`, border: `1px solid ${INK}06` }}>
          <p className="font-mono text-xs" style={{ color: INK_MUTED }}>
            ⚠ This is educational content, not financial advice. Always do your own research before investing.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StockBasicsModule;
