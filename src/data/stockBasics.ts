export interface StockBasicsTopic {
  id: string;
  title: string;
  icon: string;
  content: string[];
}

export const STOCK_BASICS: StockBasicsTopic[] = [
  {
    id: "what-is-stock",
    title: "What Is a Stock?",
    icon: "🏢",
    content: [
      "A stock is a tiny piece of a company. When you buy a stock, you literally own a small slice of that business.",
      "If the company does well and makes more money, your slice becomes more valuable — and you can sell it for a profit.",
      "If the company does poorly, your slice loses value. Simple as that.",
      "Example: If Apple has 1,000 shares and you own 1, you own 0.1% of Apple. You'd get 0.1% of any profits they share (dividends) and you can sell your share whenever you want.",
    ],
  },
  {
    id: "how-market-works",
    title: "How the Stock Market Works",
    icon: "🏛️",
    content: [
      "Think of the stock market like a giant flea market, but instead of selling old furniture, people are buying and selling pieces of companies.",
      "The 'price' of a stock is simply what the last person paid for it. If more people want to buy (demand) than sell (supply), the price goes up. If more want to sell, it goes down.",
      "Markets have opening and closing times. In the US/Canada, it's usually 9:30 AM to 4:00 PM Eastern. You can also trade 'pre-market' and 'after-hours' but it's less active.",
      "Major stock markets: NYSE and NASDAQ (US), TSX (Canada), LSE (London). Most brokerages let you access all of these.",
    ],
  },
  {
    id: "stock-vs-etf",
    title: "Stocks vs ETFs vs Mutual Funds",
    icon: "📦",
    content: [
      "A single stock = owning a piece of ONE company. Risky, because if that company tanks, you lose big.",
      "An ETF (Exchange-Traded Fund) = a basket of many stocks bundled together. Example: SPY tracks the 500 biggest US companies. If one company drops, the others cushion the blow.",
      "A mutual fund is similar to an ETF but usually managed by a person (fund manager) who picks the stocks for you. They charge higher fees.",
      "For most beginners: Start with broad ETFs (like SPY, QQQ, or VTI). You get instant diversification without having to pick individual winners.",
    ],
  },
  {
    id: "how-to-make-money",
    title: "How You Actually Make Money",
    icon: "💰",
    content: [
      "Way #1 — Capital gains: You buy a stock at $50, it goes to $80, you sell it. You made $30. That's a capital gain.",
      "Way #2 — Dividends: Some companies share their profits with shareholders regularly. If a stock pays a $2 dividend per share per year, you get paid $2 for every share you own — just for holding it.",
      "Way #3 — Compound growth: If you reinvest your dividends to buy more shares, those new shares also earn dividends, which buy more shares... This snowball effect is how most wealth is built over time.",
      "The catch: You can also LOSE money. If you buy at $50 and it drops to $30, you've lost $20 per share. Never invest money you can't afford to lose.",
    ],
  },
  {
    id: "reading-stock-chart",
    title: "How to Read a Stock Chart",
    icon: "📊",
    content: [
      "The X-axis (horizontal) is time. The Y-axis (vertical) is price. A line going up-right means the price is increasing over time.",
      "Candlestick charts show more detail: each 'candle' shows the open, high, low, and close price for that time period (day, hour, minute).",
      "Green/white candle = price went UP that day (closed higher than it opened). Red/black candle = price went DOWN (closed lower than it opened).",
      "The 'body' is the thick part (open to close). The 'wicks' or 'shadows' are the thin lines showing how high and low the price went during that period.",
      "Volume (usually shown as bars at the bottom) tells you HOW MANY shares were traded. High volume = lots of interest. Low volume = not many people are trading.",
    ],
  },
  {
    id: "key-terms",
    title: "Key Terms You'll Hear",
    icon: "📖",
    content: [
      "Bull market = prices are going UP over time. People are optimistic. 'Bulls' charge upward.",
      "Bear market = prices are going DOWN over time (usually 20%+ from the peak). People are scared. 'Bears' swipe downward.",
      "Portfolio = all your investments combined. 'My portfolio is up 10%' means your total investments grew by 10%.",
      "Diversification = don't put all your eggs in one basket. Spread your money across different stocks, sectors, and asset types.",
      "Market cap = the total value of a company. Share price × total shares. A $100 stock with 1 billion shares = $100 billion market cap.",
      "P/E ratio = Price-to-Earnings. It tells you how 'expensive' a stock is relative to how much money the company makes. Lower = cheaper. Higher = people expect big growth.",
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started (Step by Step)",
    icon: "🚀",
    content: [
      "Step 1: Open a brokerage account. Popular choices: Wealthsimple (Canada), Robinhood or Fidelity (US), Interactive Brokers (global). Most are free to open.",
      "Step 2: Start small. You don't need thousands — many brokerages let you buy fractional shares (a piece of a share) for as little as $1.",
      "Step 3: Buy a broad ETF first. Something like VTI (total US market) or XEQT (global stocks, popular in Canada). This gives you instant diversification.",
      "Step 4: Set a schedule. Invest the same amount every week or month regardless of what the market is doing. This is called 'dollar-cost averaging' — it smooths out the ups and downs.",
      "Step 5: Don't check every day. Seriously. Set it and forget it. The biggest gains come from TIME in the market, not TIMING the market.",
    ],
  },
  {
    id: "common-mistakes",
    title: "Beginner Mistakes to Avoid",
    icon: "⚠️",
    content: [
      "Mistake #1: Trying to time the market. Nobody — not even professionals — can consistently predict when the market will go up or down. Don't try.",
      "Mistake #2: Panic selling. The market WILL drop sometimes. It always has and always will. If you sell during a crash, you lock in your losses. Historically, the market always recovers.",
      "Mistake #3: Putting all your money in one stock. Even 'sure things' can crash. Diversify.",
      "Mistake #4: Investing money you need soon. Money you need within 1-2 years should NOT be in stocks. The market can be down when you need it.",
      "Mistake #5: Following hype. If your friend, a TikTok influencer, or a Reddit post tells you to buy something — do your own research first. By the time something is 'hot,' you're usually too late.",
      "Mistake #6: Not starting. The best time to start investing was 10 years ago. The second best time is today. Even small amounts compound into real wealth over decades.",
    ],
  },
  {
    id: "support-resistance",
    title: "Support & Resistance Basics",
    icon: "📐",
    content: [
      "Support = a price level where a stock tends to STOP falling and bounces back up. Think of it as a floor. Buyers step in at this price because they think it's a good deal.",
      "Resistance = a price level where a stock tends to STOP rising and falls back. Think of it as a ceiling. Sellers take profits at this price.",
      "When a stock breaks THROUGH resistance, that old resistance often becomes new support (the ceiling becomes the floor). And vice versa.",
      "These levels aren't magic — they're just prices where lots of people have previously decided to buy or sell. They're psychological, not guaranteed.",
    ],
  },
  {
    id: "risk-management",
    title: "Managing Risk Like a Pro",
    icon: "🛡️",
    content: [
      "Rule #1: Never risk more than you can afford to lose. Seriously. Investing should be with money you won't need for 5+ years.",
      "Rule #2: Use stop-losses. A stop-loss is an automatic order to sell if the price drops to a certain level. It limits how much you can lose on any single trade.",
      "Rule #3: Position sizing. Don't put more than 5-10% of your portfolio in any single stock. If it crashes, it won't wipe you out.",
      "Rule #4: The 1% rule (for active traders). Never risk more than 1% of your total portfolio on a single trade. If your portfolio is $10,000, your maximum loss per trade should be $100.",
      "Rule #5: Have an emergency fund FIRST. Keep 3-6 months of living expenses in a savings account BEFORE you start investing. This way you won't have to sell investments during tough times.",
    ],
  },
];
