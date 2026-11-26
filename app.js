const DERIV_APP_ID = "34ZfveN7Be9dqW8mOCJAe";
const AFFILIATE_TOKEN = "3A2CFHPG722B";

const DEFAULT_MINUTE_TIMEFRAMES = ['1', '2', '3', '5', '10', '15', '30'];
const DEFAULT_SHIFT_SECONDS = 8;
const MAX_RUNS_CAP = 6;
const DEFAULT_RUNS_TARGET = 6;

const exhaustiveAssets = [
    { symbol: 'R_10',     name: 'Volatility 10',      market: 'volatility',    pip: 3, base: 6321.450, tv: 'FX:EURUSD', initialEven50: 56, initialEven20: 60, initialFlips: 5, initialWick: 0.16, defaultFeeder: 8, playbook: 'Even Skew Surge' },
    { symbol: 'R_25',     name: 'Volatility 25',      market: 'volatility',    pip: 3, base: 3120.100, tv: 'FX:GBPUSD', initialEven50: 43, initialEven20: 40, initialFlips: 5, initialWick: 0.19, defaultFeeder: 7, playbook: 'Odd Skew Surge' },
    { symbol: 'R_50',     name: 'Volatility 50',      market: 'volatility',    pip: 3, base: 2450.750, tv: 'FX:USDJPY', initialEven50: 57, initialEven20: 58, initialFlips: 4, initialWick: 0.21, defaultFeeder: 6, playbook: 'Even Cluster Lock' },
    { symbol: 'R_75',     name: 'Volatility 75',      market: 'volatility',    pip: 3, base: 8940.200, tv: 'FX:AUDUSD', initialEven50: 42, initialEven20: 39, initialFlips: 5, initialWick: 0.18, defaultFeeder: 5, playbook: 'Odd Cluster Lock' },
    { symbol: 'R_100',    name: 'Volatility 100',     market: 'volatility',    pip: 3, base: 4120.900, tv: 'FX:USDCAD', initialEven50: 55, initialEven20: 59, initialFlips: 6, initialWick: 0.22, defaultFeeder: 4, playbook: 'Even Anti-Chop' },
    { symbol: '1HZ10V',   name: 'Volatility 10 (1s)', market: 'volatility_1s', pip: 2, base: 9452.18,  tv: 'FX:EURUSD', initialEven50: 41, initialEven20: 38, initialFlips: 4, initialWick: 0.15, defaultFeeder: 9, playbook: 'Odd Anti-Chop' },
    { symbol: '1HZ25V',   name: 'Volatility 25 (1s)', market: 'volatility_1s', pip: 2, base: 5320.45,  tv: 'FX:GBPUSD', initialEven50: 56, initialEven20: 60, initialFlips: 5, initialWick: 0.20, defaultFeeder: 2, playbook: 'Vol 1s Skew' },
    { symbol: '1HZ50V',   name: 'Volatility 50 (1s)', market: 'volatility_1s', pip: 2, base: 48912.34, tv: 'FX:USDJPY', initialEven50: 44, initialEven20: 41, initialFlips: 6, initialWick: 0.24, defaultFeeder: 3, playbook: 'Odd Skew Surge' },
    { symbol: '1HZ75V',   name: 'Volatility 75 (1s)', market: 'volatility_1s', pip: 2, base: 12450.80, tv: 'FX:AUDUSD', initialEven50: 58, initialEven20: 60, initialFlips: 4, initialWick: 0.17, defaultFeeder: 0, playbook: 'Even Cluster Lock' },
    { symbol: '1HZ100V',  name: 'Volatility 100 (1s)',market: 'volatility_1s', pip: 2, base: 1428.64,  tv: 'FX:USDCHF', initialEven50: 42, initialEven20: 40, initialFlips: 5, initialWick: 0.21, defaultFeeder: 1, playbook: 'Odd Cluster Lock' },
    { symbol: 'JD10',     name: 'Jump 10 Index',      market: 'jump',          pip: 2, base: 1240.50,  tv: 'FX:EURGBP', initialEven50: 55, initialEven20: 58, initialFlips: 5, initialWick: 0.19, defaultFeeder: 8, playbook: 'Jump Skew' },
    { symbol: 'JD25',     name: 'Jump 25 Index',      market: 'jump',          pip: 2, base: 2150.80,  tv: 'FX:NZDUSD', initialEven50: 44, initialEven20: 41, initialFlips: 7, initialWick: 0.30, defaultFeeder: 7, playbook: 'Odd Skew Surge' },
    { symbol: 'JD50',     name: 'Jump 50 Index',      market: 'jump',          pip: 2, base: 3420.10,  tv: 'FX:AUDJPY', initialEven50: 56, initialEven20: 59, initialFlips: 5, initialWick: 0.20, defaultFeeder: 6, playbook: 'Even Skew Surge' },
    { symbol: 'JD75',     name: 'Jump 75 Index',      market: 'jump',          pip: 2, base: 5120.40,  tv: 'FX:GBPJPY', initialEven50: 43, initialEven20: 40, initialFlips: 8, initialWick: 0.34, defaultFeeder: 3, playbook: 'Jump Skew' },
    { symbol: 'JD100',    name: 'Jump 100 Index',     market: 'jump',          pip: 2, base: 8940.20,  tv: 'FX:EURUSD', initialEven50: 44, initialEven20: 42, initialFlips: 6, initialWick: 0.23, defaultFeeder: 9, playbook: 'Odd Skew Surge' }
];

const EVEN_ODD_SETUPS = [
    { direction: 'even', name: 'EVEN (DIGITEVEN)', shortName: 'EVEN', api: 'DIGITEVEN', ticks: 3, runs: 6, payoutMult: 0.94, boatId: 1 },
    { direction: 'odd',  name: 'ODD (DIGITODD)',   shortName: 'ODD',  api: 'DIGITODD',  ticks: 3, runs: 6, payoutMult: 0.94, boatId: 2 }
];

let currentCategory = 'all';
let currentParityFilter = 'all';
let rotationCursor = 0;
let currentSymbol = exhaustiveAssets[0].symbol;
let activeCandleTf = '5';
let rotationIntervalSec = DEFAULT_SHIFT_SECONDS;
let shiftTimer = null;
let shiftCountdown = DEFAULT_SHIFT_SECONDS;
let cooldownUntil = 0;
let marketDataStore = {};
let activeAccountMode = 'demo';
let simulatedBalance = 1000.00;
let sessionNetPnl = 0;
let sessionWins = 0;
let sessionLosses = 0;
let consecutiveLosses = 0;
let lastExecutionTimestamp = 0;
let pendingContractId = null;
let activeAutomationMode = null;

function extractPipLastDigit(quote, pipSize = 2) {
    const formatted = Number(quote).toFixed(pipSize);
    const ch = formatted.charAt(formatted.length - 1);
    return /\d/.test(ch) ? Number(ch) : 0;
}

function getSelectedRunsTarget() {
    const val = parseInt(document.getElementById('runs-target-input')?.value, 10);
    if (!isNaN(val) && val >= 1 && val <= MAX_RUNS_CAP) return val;
    return DEFAULT_RUNS_TARGET;
}

function getSelectedTickHold() {
    const val = parseInt(document.getElementById('tick-hold-input')?.value, 10);
    if (!isNaN(val) && val >= 1 && val <= 10) return val;
    return 3;
}

function updateTickHoldOverride() {
    const ticks = getSelectedTickHold();
    Object.values(marketDataStore).forEach(st => {
        st.ticks = ticks;
        st.strategy.ticks = ticks;
    });
    updateSignalUI(currentSymbol);
    renderScanner();
}

function updateRunsTargetOverride() {
    const st = marketDataStore[currentSymbol];
    if (st) {
        st.runsTarget = getSelectedRunsTarget();
        st.runsCompleted = 0;
        updateSignalUI(currentSymbol);
    }
}

function updateRotationIntervalFromInput() {
    const val = parseInt(document.getElementById('loss-cooldown-sec')?.value, 10);
    rotationIntervalSec = (!isNaN(val) && val >= 4 && val <= 30) ? val : DEFAULT_SHIFT_SECONDS;
    shiftCountdown = Math.min(shiftCountdown, rotationIntervalSec);
    const pill = document.getElementById('shift-countdown-pill');
    if (pill) pill.innerText = `${shiftCountdown}s`;
}

function computeDualWindowSkewAndChop(prices, fallbackEven50 = 55, fallbackEven20 = 58, fallbackFlips = 5, fallbackWick = 0.18, direction = 'even', pipSize = 2, fallbackFeeder = 8) {
    const recent = (prices && prices.length > 0) ? prices.slice(-50) : [0];
    const digits = recent.map(q => extractPipLastDigit(q, pipSize));

    if (digits.length < 6) {
        return {
            even50Pct: fallbackEven50,
            even20Pct: fallbackEven20,
            flips12: fallbackFlips,
            noiseRatio: fallbackWick,
            feederDigit: fallbackFeeder,
            sampleCount: digits.length
        };
    }

    const even50Pct = Math.round((digits.filter(d => d % 2 === 0).length / digits.length) * 100);
    const last20 = digits.slice(-20);
    const even20Pct = Math.round((last20.filter(d => d % 2 === 0).length / last20.length) * 100);

    const last12 = digits.slice(-12);
    let flips12 = 0;
    for (let i = 1; i < last12.length; i++) {
        const prevEven = last12[i - 1] % 2 === 0;
        const currEven = last12[i] % 2 === 0;
        if (prevEven !== currEven) flips12++;
    }

    let totalRange = 0;
    const netMove = Math.abs(recent[recent.length - 1] - recent[0]);
    for (let i = 1; i < recent.length; i++) {
        totalRange += Math.abs(recent[i] - recent[i - 1]);
    }
    const rawNoise = totalRange > 0 ? Math.max(0.09, Math.min(0.45, 1 - (netMove / (totalRange + 1e-9)) * 0.55)) : fallbackWick;
    const noiseRatio = Number(((rawNoise + fallbackWick) / 2).toFixed(2));

    const recent30 = digits.slice(-30);
    const counts = Array(10).fill(0);
    recent30.forEach(d => counts[d]++);

    let bestDigit = fallbackFeeder;
    let bestScore = -Infinity;
    for (let d = 0; d < 10; d++) {
        const parityMatch = (direction === 'even' && d % 2 === 0) || (direction === 'odd' && d % 2 === 1);
        const score = (counts[d] / recent30.length) * 1.5 + (parityMatch ? 0.20 : 0);
        if (score > bestScore) {
            bestScore = score;
            bestDigit = d;
        }
    }

    return {
        even50Pct,
        even20Pct,
        flips12,
        noiseRatio,
        feederDigit: bestDigit,
        sampleCount: digits.length
    };
}

function getMarketTypeLabel(marketKey) {
    if (marketKey === 'volatility_1s') return 'Vol 1s';
    if (marketKey === 'jump') return 'Jump';
    return 'Volatility';
}

exhaustiveAssets.forEach((a, idx) => {
    const tf = DEFAULT_MINUTE_TIMEFRAMES[idx % DEFAULT_MINUTE_TIMEFRAMES.length];
    const startDir = a.initialEven50 >= 50 ? 'even' : 'odd';
    const strat = EVEN_ODD_SETUPS.find(s => s.direction === startDir) || EVEN_ODD_SETUPS[0];
    const ticks = getSelectedTickHold();

    marketDataStore[a.symbol] = {
        name: a.name,
        market: a.market,
        pip: a.pip,
        price: a.base.toFixed(a.pip),
        feederDigit: a.defaultFeeder,
        lockedDirection: startDir,
        priceHistory: [a.base],
        timeframe: tf,
        ticks: ticks,
        runsTarget: DEFAULT_RUNS_TARGET,
        runsCompleted: 0,
        strategy: { ...strat, ticks: ticks },
        playbook: a.playbook,
        even50Pct: a.initialEven50,
        even20Pct: a.initialEven20,
        flips12: a.initialFlips,
        wickRatio: a.initialWick,
        lastTickDir: 'up'
    };
});

function evaluateEvenOddPro(st) {
    const minSkew = parseFloat(document.getElementById('filter-min-skew')?.value) || 55;
    const maxFlips = parseInt(document.getElementById('filter-max-flips')?.value, 10) || 8;

    const skew50 = st.strategy.direction === 'even' ? st.even50Pct : (100 - st.even50Pct);
    const skew20 = st.strategy.direction === 'even' ? st.even20Pct : (100 - st.even20Pct);

    const isChoppy = st.flips12 >= maxFlips;
    const isStrongSkew = skew50 >= minSkew && skew20 >= (minSkew - 2);
    const isPro = !isChoppy && isStrongSkew && st.wickRatio <= 0.42;

    const skewScore = (skew50 * 0.6) + (skew20 * 0.4);
    const score = skewScore - (st.flips12 * 3.5) - (st.wickRatio * 15) + (isPro ? 12 : 0);

    let gradeLabel = isPro ? `PRO ${st.strategy.shortName}` : (isChoppy ? 'CHOP PAUSE' : `SKEW ${st.strategy.shortName}`);
    let statusText = isPro
        ? `PRO ALIGNED: ${st.strategy.name} | 50t ${skew50}% • 20t ${skew20}% • Flips ${st.flips12}/12 • Feeder ${st.feederDigit}`
        : isChoppy
            ? `CHOP DETECTED (${st.flips12} flips/12t): Pausing entries & shifting to cleaner Even/Odd feed`
            : `PACED SKEW: ${st.strategy.name} | 50t ${skew50}% • 20t ${skew20}% • Flips ${st.flips12}/12 • Feeder ${st.feederDigit}`;

    return {
        isPro,
        isChoppy,
        skew50,
        skew20,
        score,
        gradeLabel,
        statusText
    };
}

function refreshAllFilterStatuses() {
    updateSignalUI(currentSymbol);
    renderScanner();
}

function logTransaction(msg, isHighlight = false) {
    const logContainer = document.getElementById('live-transaction-log');
    if (!logContainer) return;
    if (logContainer.querySelector('.italic')) logContainer.innerHTML = '';

    const time = new Date().toLocaleTimeString();
    const row = document.createElement('div');
    row.className = isHighlight
        ? 'p-1.5 rounded bg-emerald-950/80 border border-fxgreen text-fxgreen font-bold'
        : 'p-1 rounded bg-slate-950 border border-slate-800/80 text-slate-300';
    row.innerText = `[${time}] ${msg}`;
    logContainer.prepend(row);
    if (logContainer.children.length > 25) logContainer.lastChild.remove();
}

function dismissSplash() {
    const s = document.getElementById('splash-screen');
    if (s) { s.style.opacity = '0'; setTimeout(() => s.style.display = 'none', 300); }
}

function authDeriv() {
    if (window.derivApiInstance) {
        window.derivApiInstance.startOAuthLogin(AFFILIATE_TOKEN);
    }
}

function openDerivCashier(action) {
    const cashierUrl = action === 'withdraw'
        ? 'https://app.deriv.com/account/cashier/withdrawal'
        : 'https://app.deriv.com/account/cashier/deposit';
    window.open(cashierUrl, '_blank');
}

async function handleAccountSelect(accountId) {
    if (window.derivApiInstance && accountId) {
        const ok = await window.derivApiInstance.connectAuthenticatedWebSocket(accountId);
        if (ok) {
            const acc = window.derivApiInstance.accounts.find(a => a.account === accountId);
            const mode = acc && !acc.isVirtual ? 'real' : 'demo';
            activeAccountMode = mode;
            document.getElementById('btn-demo').className = mode === 'demo' ? "px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition" : "px-3 py-1 rounded-lg font-semibold text-slate-400";
            document.getElementById('btn-real').className = mode === 'real' ? "px-3 py-1 rounded-lg font-bold bg-gold text-slate-950 transition" : "px-3 py-1 rounded-lg font-semibold text-slate-400";
            document.getElementById('account-id-label').innerText = mode === 'real' ? 'Real Balance' : 'Demo Balance';
            logTransaction(`Connected OTP WebSocket to ${accountId}`, true);
        }
    }
}

async function setMode(mode) {
    activeAccountMode = mode;
    document.getElementById('btn-demo').className = mode === 'demo' ? "px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition" : "px-3 py-1 rounded-lg font-semibold text-slate-400";
    document.getElementById('btn-real').className = mode === 'real' ? "px-3 py-1 rounded-lg font-bold bg-gold text-slate-950 transition" : "px-3 py-1 rounded-lg font-semibold text-slate-400";
    document.getElementById('account-id-label').innerText = mode === 'real' ? 'Real Balance' : 'Demo Balance';

    if (window.derivApiInstance) {
        const switched = await window.derivApiInstance.switchAccountMode(mode);
        if (switched) {
            const sel = document.getElementById('account-selector');
            if (sel) sel.value = switched.account;
            logTransaction(`Switched to ${mode.toUpperCase()} Account (${switched.account})`, true);
        }
    }
}

function switchParityFilter(filterKey) {
    currentParityFilter = filterKey;
    ['all', 'even', 'odd', 'aplus'].forEach(k => {
        const btn = document.getElementById(`pf-${k}`);
        if (btn) {
            btn.className = k === filterKey
                ? "bg-cyan-600 text-white font-bold py-1 px-1 rounded"
                : "bg-slate-900 text-slate-300 py-1 px-1 rounded border border-slate-800";
        }
    });
    renderScanner();
}

function switchCategory(cat) {
    currentCategory = cat;
    ['all', 'volatility', 'volatility_1s', 'jump'].forEach(c => {
        const btn = document.getElementById(`cat-${c}`);
        if (btn) {
            btn.className = c === cat
                ? "bg-emerald-600 text-white font-bold py-1.5 px-1 rounded-lg transition"
                : "bg-slate-900 text-slate-300 py-1.5 px-1 rounded-lg transition border border-slate-800";
        }
    });
    renderScanner();
}

function changeChartTimeframe(tf, syncState = true) {
    activeCandleTf = String(tf);
    document.querySelectorAll('.tf-btn').forEach(btn => {
        btn.className = btn.dataset.tf === activeCandleTf
            ? "tf-btn px-2 py-1 rounded bg-emerald-600 text-white font-bold"
            : "tf-btn px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300";
    });
    if (syncState && marketDataStore[currentSymbol]) {
        marketDataStore[currentSymbol].timeframe = activeCandleTf;
        updateSignalUI(currentSymbol);
    }
    initTradingView(currentSymbol, activeCandleTf);
}

function toggleChartFullscreen() {
    const w = document.getElementById('chart-card-wrapper');
    w.classList.toggle('fixed'); w.classList.toggle('inset-4'); w.classList.toggle('z-50');
}

function initTradingView(sym, tf = '5') {
    const c = document.getElementById('tradingview_advanced_chart');
    if (!c || typeof TradingView === 'undefined') return;
    c.innerHTML = '';
    const assetObj = exhaustiveAssets.find(a => a.symbol === sym);
    const tvSym = (assetObj && assetObj.tv) ? assetObj.tv : "FX:EURUSD";

    new TradingView.widget({
        width: "100%",
        height: "100%",
        symbol: tvSym,
        interval: tf,
        timezone: "Africa/Nairobi",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#030712",
        studies: ["STD;EMA", "STD;RSI", "STD;Directional_Movement"],
        container_id: "tradingview_advanced_chart"
    });
}

function buildCommandString(sym, st, gate) {
    const runsCap = getSelectedRunsTarget();
    return `EO_PRO(Market=${sym}, Contract=${st.strategy.api}, FeederDigit=${st.feederDigit}, TF=${st.timeframe}m, Ticks=${st.ticks}t, MaxRuns=${runsCap}, Grade=${gate.gradeLabel})`;
}

function updatePnlDisplay() {
    const badge = document.getElementById('pnl-summary-badge');
    const scoreEl = document.getElementById('metric-score');
    const streakEl = document.getElementById('noise-readout');

    if (badge) {
        const sign = sessionNetPnl >= 0 ? '+' : '';
        badge.innerText = `NET P&L: ${sign}$${sessionNetPnl.toFixed(2)}`;
        badge.className = sessionNetPnl >= 0
            ? "text-[10px] font-bold text-slate-950 bg-fxgreen px-2.5 py-1 rounded"
            : "text-[10px] font-bold text-white bg-rose-600 px-2.5 py-1 rounded";
    }
    if (scoreEl) scoreEl.innerText = `${sessionWins}W / ${sessionLosses}L`;
    if (streakEl) streakEl.innerText = `${consecutiveLosses}/2`;
}

function updateSignalUI(sym) {
    const st = marketDataStore[sym];
    if (!st) return;

    const runsCap = getSelectedRunsTarget();
    st.runsTarget = runsCap;
    const gate = evaluateEvenOddPro(st);
    const cmdStr = buildCommandString(sym, st, gate);

    if (typeof highlightActiveBoat === 'function') {
        highlightActiveBoat(st.strategy.boatId);
    }

    const filterBadge = document.getElementById('side-signal-live-badge');
    if (filterBadge) {
        filterBadge.innerText = gate.isPro ? 'PRO READY' : (gate.isChoppy ? 'CHOP GUARD' : 'SKEW WATCH');
        filterBadge.className = gate.isPro
            ? 'text-[9px] font-black bg-fxgreen text-slate-950 px-2 py-0.5 rounded'
            : 'text-[9px] font-black bg-gold text-slate-950 px-2 py-0.5 rounded';
    }

    document.getElementById('chart-title-label').innerText = `${st.name} (${sym}) • ${st.timeframe}m • ${st.strategy.name} • Feeder Digit ${st.feederDigit}`;
    document.getElementById('live-tick-symbol-tag').innerText = sym;
    document.getElementById('live-feeder-badge').innerText = st.feederDigit;
    document.getElementById('adaptive-shift-status').innerText = `Pro Locked -> ${st.name} | Feeder Digit ${st.feederDigit} | ${st.strategy.name} | TF ${st.timeframe}m • ${st.ticks} Ticks • Max ${runsCap} Runs`;

    document.getElementById('side-sig-asset').innerText = `${sym} (${getMarketTypeLabel(st.market)})`;
    document.getElementById('side-sig-contract').innerText = st.strategy.name;
    document.getElementById('side-sig-feeder').innerText = st.feederDigit;
    document.getElementById('side-sig-candle').innerText = `${st.timeframe}m Candle`;
    document.getElementById('side-sig-ticks').innerText = `${st.ticks} Ticks`;
    document.getElementById('side-sig-runs').innerText = `${st.runsCompleted} / ${runsCap} Runs`;
    document.getElementById('side-sig-boat').innerText = aiBoatsDirectory[st.strategy.boatId].name;
    document.getElementById('side-sig-command').innerText = cmdStr;

    const expBox = document.getElementById('expectancy-warning-box');
    const expBe = document.getElementById('exp-breakeven-rate');
    const expText = document.getElementById('exp-asymmetry-text');
    const expVerdict = document.getElementById('exp-filter-verdict');

    if (expBe && expText && expVerdict && expBox) {
        expBe.innerText = `50t: ${gate.skew50}% | 20t: ${gate.skew20}%`;
        expText.innerText = gate.statusText;
        expVerdict.innerText = `Feeder Digit ${st.feederDigit} Locked • Max ${runsCap} Runs • Profit Lock Active`;
        expVerdict.className = 'text-[9px] font-bold text-fxgreen';
        expBox.className = 'bg-emerald-950/50 border border-fxgreen/50 rounded-xl p-2.5 space-y-1 text-[10px]';
    }

    document.getElementById('man-asset').innerText = `${sym} • Digit ${st.feederDigit}`;
    document.getElementById('man-strat').innerText = st.strategy.name;
    document.getElementById('man-trigger').innerText = `${st.timeframe}m • ${st.ticks} Ticks • Max ${runsCap} Runs`;

    document.getElementById('stable-entry-digit-display').innerText = st.feederDigit;
    document.getElementById('momentum-readout').innerText = `${st.timeframe}m / ${st.ticks}t`;
    document.getElementById('streak-lock-badge').innerText = `RUNS: ${st.runsCompleted}/${runsCap}`;

    document.getElementById('metric-50t').innerText = `${st.even50Pct}%`;
    document.getElementById('metric-20t').innerText = `${st.even20Pct}%`;
    document.getElementById('metric-flips').innerText = `${st.flips12}`;
    document.getElementById('metric-wick').innerText = st.wickRatio.toFixed(2);
    document.getElementById('metric-ou-rate').innerText = gate.gradeLabel;

    updatePnlDisplay();
}

function getSetupPool() {
    if (currentParityFilter === 'even') return EVEN_ODD_SETUPS.filter(s => s.direction === 'even');
    if (currentParityFilter === 'odd') return EVEN_ODD_SETUPS.filter(s => s.direction === 'odd');
    return EVEN_ODD_SETUPS;
}

function findBestRankedEvenOddSetup(candidates) {
    let bestCandidate = null;
    let bestScore = -Infinity;

    candidates.forEach((asset, idx) => {
        const st = marketDataStore[asset.symbol];
        if (!st) return;

        const pool = getSetupPool();
        const preferredSetup = currentParityFilter === 'all'
            ? (EVEN_ODD_SETUPS.find(s => s.direction === (st.even50Pct >= 50 ? 'even' : 'odd')) || EVEN_ODD_SETUPS[0])
            : pool[0];

        const gate = evaluateEvenOddPro({ ...st, strategy: preferredSetup });

        DEFAULT_MINUTE_TIMEFRAMES.forEach((tf, tIdx) => {
            const tfBonus = (tf === '5' || tf === '3' || tf === '1') ? 1.5 : 0.5;
            const totalScore = gate.score + tfBonus - (tIdx * 0.05) - (idx * 0.02);
            if (totalScore > bestScore) {
                bestScore = totalScore;
                bestCandidate = { asset, timeframe: tf, strategy: preferredSetup };
            }
        });
    });

    return bestCandidate;
}

function selectSymbol(sym, name, rotateStrategy = true) {
    currentSymbol = sym;
    shiftCountdown = rotationIntervalSec;
    const st = marketDataStore[sym];
    if (!st) return;

    st.runsCompleted = 0;
    const tickHold = getSelectedTickHold();
    if (rotateStrategy) {
        const pool = getSetupPool();
        const nextStrat = currentParityFilter === 'all'
            ? (EVEN_ODD_SETUPS.find(s => s.direction === (st.even50Pct >= 50 ? 'even' : 'odd')) || EVEN_ODD_SETUPS[0])
            : pool[0];
        st.strategy = { ...nextStrat, ticks: tickHold };
        st.ticks = tickHold;
        st.runsTarget = getSelectedRunsTarget();
        const calc = computeDualWindowSkewAndChop(st.priceHistory, st.even50Pct, st.even20Pct, st.flips12, st.wickRatio, st.strategy.direction, st.pip, st.feederDigit);
        st.feederDigit = calc.feederDigit;
        st.lockedDirection = st.strategy.direction;
    } else {
        st.ticks = tickHold;
        st.strategy.ticks = tickHold;
        st.runsTarget = getSelectedRunsTarget();
    }

    activeCandleTf = st.timeframe;
    changeChartTimeframe(activeCandleTf, false);
    updateSignalUI(sym);

    logTransaction(
        `Pro Signal -> ${name} (${sym}) | ${st.strategy.name} | Feeder Digit ${st.feederDigit} | 50t ${st.even50Pct}% • 20t ${st.even20Pct}% • Flips ${st.flips12}/12 | ${st.timeframe}m • Max ${st.runsTarget} Runs`,
        true
    );

    if (window.derivApiInstance) {
        window.derivApiInstance.subscribeTicks(sym, handleTick);
    }
    renderScanner();
}

function pickNextRotatedAsset() {
    const pool = currentCategory === 'all'
        ? exhaustiveAssets
        : exhaustiveAssets.filter(a => a.market === currentCategory);
    if (pool.length === 0) return exhaustiveAssets[0];

    const ordered = [];
    for (let i = 1; i <= pool.length; i++) {
        ordered.push(pool[(rotationCursor + i) % pool.length]);
    }

    const ranked = findBestRankedEvenOddSetup(ordered);
    if (ranked) {
        rotationCursor = pool.findIndex(a => a.symbol === ranked.asset.symbol);
        const mSt = marketDataStore[ranked.asset.symbol];
        mSt.timeframe = ranked.timeframe;
        mSt.strategy = { ...ranked.strategy, ticks: getSelectedTickHold() };
        const calc = computeDualWindowSkewAndChop(mSt.priceHistory, mSt.even50Pct, mSt.even20Pct, mSt.flips12, mSt.wickRatio, mSt.strategy.direction, mSt.pip, mSt.feederDigit);
        mSt.feederDigit = calc.feederDigit;
        mSt.lockedDirection = mSt.strategy.direction;
        return ranked.asset;
    }

    rotationCursor = (rotationCursor + 1) % pool.length;
    return pool[rotationCursor];
}

function forceNextMarketShift() {
    const nextAsset = pickNextRotatedAsset();
    if (nextAsset) {
        selectSymbol(nextAsset.symbol, nextAsset.name, true);
    }
}

function startActiveRotationLoop() {
    if (shiftTimer) clearInterval(shiftTimer);
    updateRotationIntervalFromInput();
    shiftCountdown = rotationIntervalSec;

    shiftTimer = setInterval(() => {
        shiftCountdown--;
        const pill = document.getElementById('shift-countdown-pill');
        if (pill) pill.innerText = `${Math.max(1, shiftCountdown)}s`;

        if (shiftCountdown <= 0) {
            shiftCountdown = rotationIntervalSec;
            forceNextMarketShift();
        }
    }, 1000);
}

function renderScanner() {
    const list = document.getElementById('scanner-market-list');
    if (!list) return;
    list.innerHTML = '';

    const proFirst = document.getElementById('high-hit-bias-toggle')?.checked;
    let filtered = currentCategory === 'all'
        ? exhaustiveAssets
        : exhaustiveAssets.filter(a => a.market === currentCategory);

    if (currentParityFilter === 'even') {
        filtered = filtered.filter(a => marketDataStore[a.symbol].strategy.direction === 'even');
    } else if (currentParityFilter === 'odd') {
        filtered = filtered.filter(a => marketDataStore[a.symbol].strategy.direction === 'odd');
    } else if (currentParityFilter === 'aplus') {
        filtered = filtered.filter(a => evaluateEvenOddPro(marketDataStore[a.symbol]).isPro);
    }

    if (filtered.length === 0) {
        filtered = exhaustiveAssets;
    }

    const sorted = [...filtered].sort((a, b) => {
        const gateA = evaluateEvenOddPro(marketDataStore[a.symbol]);
        const gateB = evaluateEvenOddPro(marketDataStore[b.symbol]);
        const flagA = gateA.isPro ? 1 : 0;
        const flagB = gateB.isPro ? 1 : 0;
        if (proFirst && flagB !== flagA) return flagB - flagA;
        return gateB.score - gateA.score;
    });

    sorted.forEach(m => {
        const st = marketDataStore[m.symbol];
        const gate = evaluateEvenOddPro(st);
        const runsCap = getSelectedRunsTarget();
        const isSel = m.symbol === currentSymbol;
        const tickColor = st.lastTickDir === 'up' ? 'tick-up' : 'tick-down';

        const div = document.createElement('div');
        div.onclick = () => selectSymbol(m.symbol, m.name, true);
        div.className = `cursor-pointer p-2 rounded-xl border grid grid-cols-3 items-center text-[11px] transition ${isSel ? 'bg-emerald-950/70 border-fxgreen shadow-[0_0_10px_rgba(0,255,136,0.3)]' : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850'}`;
        div.innerHTML = `
            <div><div class="font-bold text-white truncate">${m.name}</div><div class="text-[9px] text-cyan-400">${st.timeframe}m • Flips ${st.flips12}/12</div></div>
            <div class="text-right"><div class="font-bold font-mono ${tickColor}" id="price-${m.symbol}">${st.price}</div><div class="text-[9px] text-gold truncate">${st.strategy.shortName} (${st.even50Pct}%E)</div></div>
            <div class="text-right font-mono"><div class="text-fxgreen font-bold text-[10px]">D:${st.feederDigit} • ${runsCap}R</div><div class="text-[9px] text-slate-400">${isSel ? 'ACTIVE' : gate.gradeLabel}</div></div>
        `;
        list.appendChild(div);
    });
}

function haltWithGuardrail(reason) {
    activeAutomationMode = null;
    pendingContractId = null;
    document.getElementById('tx-status-pill').innerText = `🛑 Guardrail Halt & Shift: ${reason}`;
    logTransaction(`GUARDRAIL HALT (${reason}) — Shifting to Next Even/Odd Pro Setup — ELHADARTGLOBALFX`, true);
    if (typeof triggerProfitAlert === 'function') {
        triggerProfitAlert(reason, sessionNetPnl);
    }
    forceNextMarketShift();
}

function settleSimulatedOutcome(stake, strategy, isPro) {
    const winProb = isPro ? 0.56 : 0.50;
    const isWin = Math.random() < winProb;

    if (isWin) {
        const profit = Number((stake * strategy.payoutMult).toFixed(2));
        sessionWins++;
        consecutiveLosses = 0;
        sessionNetPnl = Number((sessionNetPnl + profit).toFixed(2));
        simulatedBalance = Number((simulatedBalance + profit).toFixed(2));
        return { isWin: true, delta: profit };
    } else {
        const loss = Number(stake.toFixed(2));
        sessionLosses++;
        consecutiveLosses++;
        sessionNetPnl = Number((sessionNetPnl - loss).toFixed(2));
        simulatedBalance = Number(Math.max(0, simulatedBalance - loss).toFixed(2));
        return { isWin: false, delta: -loss };
    }
}

function recordOutcomeAndCheckGuardrails(sym, st, executorName, stake, tickDuration, runsCap, isWin, delta) {
    const tag = isWin ? `WIN +$${delta.toFixed(2)}` : `LOSS -$${Math.abs(delta).toFixed(2)}`;
    logTransaction(`Run ${st.runsCompleted}/${runsCap} | ${executorName} | ${sym} ${st.strategy.shortName} (Feeder ${st.feederDigit}, ${tickDuration}t) | ${tag}`, !isWin);

    const profitTarget = parseFloat(document.getElementById('session-profit-target')?.value) || 4.00;
    const maxStopLoss = parseFloat(document.getElementById('session-stop-loss')?.value) || 3.00;
    const maxStreak = 2;
    const now = Date.now();

    if (sessionNetPnl >= profitTarget) {
        haltWithGuardrail(`Profit Lock Target (+$${profitTarget.toFixed(2)}) Reached`);
        return;
    }

    if (!isWin) {
        cooldownUntil = now + 2000;
        if (consecutiveLosses >= maxStreak) {
            haltWithGuardrail(`Max Loss Streak (${maxStreak}) Hit`);
            return;
        }
        if (sessionNetPnl <= -Math.abs(maxStopLoss)) {
            haltWithGuardrail(`Session Stop-Loss (-$${Math.abs(maxStopLoss).toFixed(2)}) Hit`);
            return;
        }
    }

    updateSignalUI(sym);

    if (activeAutomationMode && st.runsCompleted >= runsCap) {
        const prevMode = activeAutomationMode;
        st.runsCompleted = 0;
        if (prevMode === 'BULK') {
            logTransaction(`${runsCap}-run cap completed on ${sym} — Shifting to next Even/Odd Pro setup...`, true);
            forceNextMarketShift();
        } else {
            activeAutomationMode = null;
            document.getElementById('tx-status-pill').innerText = `${runsCap} Runs Completed • Even/Odd Pro Scanner Ready`;
            logTransaction(`${runsCap}-run cycle completed (${executorName}) on ${sym} — Shifting to next Even/Odd Pro setup...`, true);
            forceNextMarketShift();
        }
    }
}

function handleTick(tick) {
    const sym = tick.symbol;
    const q = Number(tick.quote);
    if (isNaN(q)) return;

    const st = marketDataStore[sym];
    if (!st) return;

    const prevPrice = parseFloat(st.price);
    const pipSize = tick.pip_size || st.pip || 2;
    st.price = q.toFixed(pipSize);
    st.lastTickDir = q >= prevPrice ? 'up' : 'down';

    st.priceHistory.push(q);
    if (st.priceHistory.length > 55) st.priceHistory.shift();

    const calc = computeDualWindowSkewAndChop(st.priceHistory, st.even50Pct, st.even20Pct, st.flips12, st.wickRatio, st.strategy.direction, pipSize, st.feederDigit);
    st.even50Pct = calc.even50Pct;
    st.even20Pct = calc.even20Pct;
    st.flips12 = calc.flips12;
    st.wickRatio = calc.noiseRatio;

    const maxFlips = parseInt(document.getElementById('filter-max-flips')?.value, 10) || 8;
    const chopDisruption = st.flips12 >= maxFlips;

    if (chopDisruption) {
        st.feederDigit = calc.feederDigit;
    }

    const priceEl = document.getElementById(`price-${sym}`);
    if (priceEl) {
        priceEl.innerText = st.price;
        priceEl.className = `font-bold font-mono ${st.lastTickDir === 'up' ? 'tick-up' : 'tick-down'}`;
    }

    if (sym === currentSymbol) {
        const bigQuoteEl = document.getElementById('live-big-quote');
        const feederBadgeEl = document.getElementById('live-feeder-badge');
        if (bigQuoteEl) {
            bigQuoteEl.innerText = st.price;
            bigQuoteEl.className = st.lastTickDir === 'up' ? 'text-fxgreen font-black' : 'text-rose-400 font-black';
        }
        if (feederBadgeEl) feederBadgeEl.innerText = st.feederDigit;

        document.getElementById('metric-50t').innerText = `${st.even50Pct}%`;
        document.getElementById('metric-20t').innerText = `${st.even20Pct}%`;
        document.getElementById('metric-flips').innerText = `${st.flips12}`;
        document.getElementById('metric-wick').innerText = st.wickRatio.toFixed(2);
        document.getElementById('side-sig-feeder').innerText = st.feederDigit;
        document.getElementById('stable-entry-digit-display').innerText = st.feederDigit;
        document.getElementById('man-asset').innerText = `${sym} • Digit ${st.feederDigit}`;

        const now = Date.now();
        const runsCap = getSelectedRunsTarget();
        st.runsTarget = runsCap;
        const gate = evaluateEvenOddPro(st);

        if (activeAutomationMode && !pendingContractId && now >= cooldownUntil && (now - lastExecutionTimestamp > 1200)) {
            if (chopDisruption) {
                logTransaction(`Chop guard (${st.flips12} flips/12t) on ${sym} — Shifting to cleaner Even/Odd feed...`, true);
                forceNextMarketShift();
                return;
            }

            lastExecutionTimestamp = now;
            st.runsCompleted++;

            const stake = activeAutomationMode === 'BULK'
                ? (parseFloat(document.getElementById('bulk-stake').value) || 1.00)
                : (parseFloat(document.getElementById('manual-stake').value) || 1.00);

            const executorName = activeAutomationMode === 'BOAT'
                ? aiBoatsDirectory[currentActiveBoat].name
                : `${activeAutomationMode} E/O`;

            const tickDuration = getSelectedTickHold();
            st.ticks = tickDuration;

            if (!window.derivApiInstance || !window.derivApiInstance.isAuthorized) {
                const outcome = settleSimulatedOutcome(stake, st.strategy, gate.isPro);
                document.getElementById('account-balance').innerText = `$${simulatedBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                recordOutcomeAndCheckGuardrails(sym, st, executorName, stake, tickDuration, runsCap, outcome.isWin, outcome.delta);
            } else {
                const sent = window.derivApiInstance.buyContract({
                    symbol: sym,
                    contractType: st.strategy.api,
                    stake: stake,
                    duration: tickDuration
                });
                if (sent) {
                    logTransaction(`Run ${st.runsCompleted}/${runsCap} | ${executorName} | ${st.strategy.api} sent on ${sym} (${tickDuration}t, Feeder ${st.feederDigit}, flat $${stake.toFixed(2)})`);
                }
            }
        }
    }
}

function executeAutomatedManualTrade() {
    const st = marketDataStore[currentSymbol];
    st.runsCompleted = 0;
    st.runsTarget = getSelectedRunsTarget();
    st.ticks = getSelectedTickHold();
    consecutiveLosses = 0;
    cooldownUntil = 0;
    pendingContractId = null;
    activeAutomationMode = 'MANUAL';
    document.getElementById('tx-status-pill').innerText = `🟢 Manual (${currentSymbol} • ${st.strategy.shortName} • Feeder ${st.feederDigit} • Max ${st.runsTarget} Runs)...`;
    logTransaction(`Started Max ${st.runsTarget}-Run Manual Even/Odd Pro Setup on ${currentSymbol} | Feeder Digit ${st.feederDigit} | ${st.strategy.name} | ${st.timeframe}m • ${st.ticks} Ticks`, true);
}

function executeAutomatedBulkTrade() {
    const count = parseInt(document.getElementById('bulk-count').value, 10) || 5;
    const pool = currentCategory === 'all'
        ? exhaustiveAssets
        : exhaustiveAssets.filter(a => a.market === currentCategory);
    const basket = pool.slice(0, count);

    if (basket.length === 0) return;

    selectSymbol(basket[0].symbol, basket[0].name, false);
    marketDataStore[currentSymbol].runsCompleted = 0;
    consecutiveLosses = 0;
    cooldownUntil = 0;
    pendingContractId = null;
    activeAutomationMode = 'BULK';
    document.getElementById('tx-status-pill').innerText = `🟢 Bulk Even/Odd Rotating (${basket.map(a => a.symbol).join(', ')})...`;
    logTransaction(`Armed Bulk Even/Odd Pro Basket (${basket.length} markets): ${basket.map(a => a.symbol).join(', ')}`, true);
}

function startBoatAutomation(boatId) {
    const st = marketDataStore[currentSymbol];
    const oddBoats = [2, 4, 6];
    const desiredDir = oddBoats.includes(Number(boatId)) ? 'odd' : 'even';
    const matchedSetup = EVEN_ODD_SETUPS.find(s => s.direction === desiredDir) || EVEN_ODD_SETUPS[0];
    const tickHold = getSelectedTickHold();

    st.strategy = { ...matchedSetup, ticks: tickHold, boatId: Number(boatId) };
    st.ticks = tickHold;
    st.runsTarget = getSelectedRunsTarget();
    st.runsCompleted = 0;
    consecutiveLosses = 0;
    cooldownUntil = 0;
    pendingContractId = null;

    const calc = computeDualWindowSkewAndChop(st.priceHistory, st.even50Pct, st.even20Pct, st.flips12, st.wickRatio, st.strategy.direction, st.pip, st.feederDigit);
    st.feederDigit = calc.feederDigit;
    st.lockedDirection = st.strategy.direction;

    activeAutomationMode = 'BOAT';
    updateSignalUI(currentSymbol);
    document.getElementById('tx-status-pill').innerText = `🟢 ${aiBoatsDirectory[boatId].name} (Feeder ${st.feederDigit} • Max ${st.runsTarget} Runs)...`;
    logTransaction(`Running ${aiBoatsDirectory[boatId].name} on ${currentSymbol} | Feeder Digit ${st.feederDigit} | ${st.strategy.name} (${st.ticks} Ticks) | Max ${st.runsTarget} Runs`, true);
}

function stopAllAutomation() {
    activeAutomationMode = null;
    pendingContractId = null;
    if (marketDataStore[currentSymbol]) {
        marketDataStore[currentSymbol].runsCompleted = 0;
        updateSignalUI(currentSymbol);
    }
    document.getElementById('tx-status-pill').innerText = "🛑 Active Runs Stopped • Even/Odd Pro Scanner Running";
    logTransaction("Active trade runs stopped. Even/Odd Pro scanner and market/timeframe shift remain active.", true);
}

function copySideSignalSettings() {
    const st = marketDataStore[currentSymbol];
    const runsCap = getSelectedRunsTarget();
    const gate = evaluateEvenOddPro(st);
    const cmd = buildCommandString(currentSymbol, st, gate);
    const summary = `ELHADART EVEN / ODD PRO SIGNAL\nMarket: ${st.name} (${currentSymbol})\nContract: ${st.strategy.name} | Firm Feeder Digit: ${st.feederDigit}\nDual-Window Skew: 50t ${st.even50Pct}%E • 20t ${st.even20Pct}%E • Flips ${st.flips12}/12\nCandle TF: ${st.timeframe}m | Ticks/Run: ${st.ticks}t | Max Runs: ${runsCap}\nCommand: ${cmd}`;
    navigator.clipboard?.writeText(summary);
    alert(`📋 Copied Even / Odd Pro Signal:\n\n${summary}`);
}

function bootPlatform() {
    let totalSeconds = 90;
    const pBar = document.getElementById('splash-progress-bar');
    const cTxt = document.getElementById('splash-countdown-text');

    const countdownInterval = setInterval(() => {
        totalSeconds--;
        const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        if (cTxt) cTxt.innerText = `Loading Even / Odd Pro Scanner: ${mins}:${secs} (Live Synthetic Ticks Active)`;
        if (pBar) pBar.style.width = `${((90 - totalSeconds) / 90) * 100}%`;

        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            dismissSplash();
        }
    }, 1000);

    document.getElementById('header-asset-count').innerText = `${exhaustiveAssets.length} Synthetic Markets (Vol • Vol 1s • Jump) • 20t/50t Skew • Anti-Chop • Max 6 Runs`;
    selectSymbol(exhaustiveAssets[0].symbol, exhaustiveAssets[0].name, false);
    renderScanner();
    startActiveRotationLoop();

    if (typeof DerivAPIConnector !== 'undefined') {
        const api = new DerivAPIConnector(DERIV_APP_ID);
        window.derivApiInstance = api;
        api.onAccountsLoaded = (accounts, selectedId) => {
            const sel = document.getElementById('account-selector');
            if (sel && accounts.length > 0) {
                sel.innerHTML = accounts.map(a => `<option value="${a.account}" ${a.account === selectedId ? 'selected' : ''}>${a.account} (${a.isVirtual ? 'Demo' : 'Real'})</option>`).join('');
                sel.classList.remove('hidden');
            }
        };
        api.onBalanceUpdate = (b) => {
            document.getElementById('account-balance').innerText = `$${Number(b.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
            const badge = document.getElementById('oauth-connection-badge');
            if (badge && b.loginid) {
                badge.innerText = `🟢 Connected (${b.loginid})`;
                badge.className = "text-[10px] font-mono font-bold text-fxgreen bg-emerald-950 px-2.5 py-1 rounded border border-fxgreen/40";
            }
        };
        api.onContractPurchased = (buyData) => {
            pendingContractId = buyData.contract_id || true;
            logTransaction(`Deriv Even/Odd #${buyData.contract_id} Opened | Payout: $${buyData.payout}`);
        };
        api.onContractSettled = (poc) => {
            pendingContractId = null;
            const profit = Number(poc.profit || 0);
            const isWin = profit > 0;
            const st = marketDataStore[currentSymbol];
            const runsCap = getSelectedRunsTarget();
            const stake = parseFloat(document.getElementById('manual-stake')?.value) || 1.00;
            if (isWin) {
                sessionWins++;
                consecutiveLosses = 0;
            } else {
                sessionLosses++;
                consecutiveLosses++;
            }
            sessionNetPnl = Number((sessionNetPnl + profit).toFixed(2));
            if (st) {
                recordOutcomeAndCheckGuardrails(currentSymbol, st, `Deriv #${poc.contract_id}`, stake, st.ticks, runsCap, isWin, profit);
            }
        };
        api.connect(exhaustiveAssets).then(() => {
            api.subscribeTicks(currentSymbol, handleTick);
            api.subscribeMultipleTicks(exhaustiveAssets.map(a => a.symbol), handleTick);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPlatform);
} else {
    bootPlatform();
}
