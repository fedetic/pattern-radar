"use strict";
/**
 * Test suite to ensure all detected patterns have corresponding pattern details
 * This prevents "Pattern details not available" messages from appearing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHART_PATTERNS = exports.STATISTICAL_PATTERNS = exports.HARMONIC_PATTERNS = exports.VOLUME_PATTERNS = exports.CANDLESTICK_PATTERNS = exports.ALL_PATTERNS = exports.testPatternDetailStructure = exports.testAllPatternsHaveDetails = void 0;
// Import the pattern names from the backend modules
const CANDLESTICK_PATTERNS = [
    'Doji', 'Hammer', 'Hanging Man', 'Engulfing Pattern', 'Morning Star', 'Evening Star',
    'Shooting Star', 'Dragonfly Doji', 'Gravestone Doji', 'Marubozu', 'Spinning Top',
    'Piercing Pattern', 'Dark Cloud Cover', 'Harami Pattern', 'Harami Cross',
    'Thrusting Pattern', 'Advance Block', 'Three Black Crows', 'Three White Soldiers',
    'Three Inside Up/Down', 'Three Outside Up/Down'
];
exports.CANDLESTICK_PATTERNS = CANDLESTICK_PATTERNS;
const VOLUME_PATTERNS = [
    'Volume Spike', 'Volume Breakout', 'Accumulation Pattern', 'Distribution Pattern',
    'Volume Climax', 'Low Volume Pullback', 'Volume Confirmation', 'Volume Divergence',
    'High Volume Reversal', 'Volume Thrust', 'Volume Drying Up', 'Volume Expansion',
    'Volume Contraction', 'OBV Bullish Trend', 'OBV Bearish Trend', 'VPT Confirmation',
    'Heavy Volume Rejection'
];
exports.VOLUME_PATTERNS = VOLUME_PATTERNS;
const HARMONIC_PATTERNS = [
    'Gartley Pattern', 'Butterfly Pattern', 'Bat Pattern', 'Crab Pattern', 'ABCD Pattern',
    'Three Drives Pattern', 'Cypher Pattern', 'Shark Pattern', 'NenStar Pattern',
    'Anti Pattern', 'Deep Crab Pattern', 'Perfect Pattern'
];
exports.HARMONIC_PATTERNS = HARMONIC_PATTERNS;
const STATISTICAL_PATTERNS = [
    'Bollinger Band Squeeze', 'Bollinger Upper Breakout', 'Bollinger Lower Breakout',
    'Bollinger Band Bounce', 'RSI Overbought', 'RSI Oversold', 'RSI Bearish Divergence',
    'RSI Bullish Divergence', 'MACD Bullish Crossover', 'MACD Bearish Crossover',
    'MACD Zero Line Cross', 'Stochastic Overbought', 'Stochastic Oversold',
    'Williams %R Overbought', 'Williams %R Oversold', 'Momentum Shift Bullish',
    'Momentum Shift Bearish', 'High Volatility Alert', 'Low Volatility Alert',
    'Strong Trend Signal', 'Weak Trend Signal', 'Parabolic SAR Bullish',
    'Parabolic SAR Bearish', 'Aroon Signal', 'MFI Signal', 'OBV Trend',
    'Ultimate Oscillator', 'TRIX Signal', 'DMI Signal', 'ROC Signal',
    'Ichimoku Signal', 'Keltner Channel', 'Donchian Channel'
];
exports.STATISTICAL_PATTERNS = STATISTICAL_PATTERNS;
const CHART_PATTERNS = [
    'Support Level Test', 'Resistance Level Test', 'Bullish Trend', 'Bearish Trend'
];
exports.CHART_PATTERNS = CHART_PATTERNS;
// Combine all patterns
const ALL_PATTERNS = [
    ...CANDLESTICK_PATTERNS,
    ...VOLUME_PATTERNS,
    ...HARMONIC_PATTERNS,
    ...STATISTICAL_PATTERNS,
    ...CHART_PATTERNS
];
exports.ALL_PATTERNS = ALL_PATTERNS;
// Mock the getPatternInfo function from ChartDisplay component
const getPatternInfo = (patternName, direction = "bullish") => {
    const patternInfoMap = {
        "Doji": {
            meaning: "A candle with virtually the same opening and closing price, indicating market indecision.",
            significance: "Shows equilibrium between buyers and sellers. Often signals potential trend reversal.",
            trading: "Wait for confirmation before trading. Look for the next candle to confirm direction.",
            reliability: "Medium - requires confirmation from subsequent price action"
        },
        "Hammer": {
            meaning: "A small body with a long lower shadow, appearing after a downtrend.",
            significance: "Bullish reversal signal. Shows buyers stepped in after sellers pushed price down.",
            trading: "Consider long positions with stops below the hammer's low. Target resistance levels.",
            reliability: "High - especially when appearing at support levels"
        },
        "Hanging Man": {
            meaning: "Similar to hammer but appears after an uptrend, signaling potential bearish reversal.",
            significance: "Warning sign that the uptrend may be losing momentum.",
            trading: "Consider taking profits or tightening stops. Wait for bearish confirmation.",
            reliability: "Medium - needs volume and next candle confirmation"
        },
        "Shooting Star": {
            meaning: "Small body with long upper shadow after an uptrend, showing rejection at higher levels.",
            significance: "Bearish reversal signal. Buyers pushed price up but sellers took control.",
            trading: "Consider short positions with stops above the high. Target support levels.",
            reliability: "High - especially with high volume"
        },
        "Engulfing Pattern": {
            meaning: direction === "bullish" ? "A large bullish candle that engulfs the previous bearish candle." : "A large bearish candle that engulfs the previous bullish candle.",
            significance: direction === "bullish" ? "Strong bullish reversal signal showing buying pressure." : "Strong bearish reversal signal showing selling pressure.",
            trading: direction === "bullish" ? "Consider long positions with stops below the pattern low." : "Consider short positions with stops above the pattern high.",
            reliability: "Very High - one of the most reliable reversal patterns"
        },
        "Morning Star": {
            meaning: "Three-candle bullish reversal pattern: bearish candle, small-bodied candle, then bullish candle.",
            significance: "Strong bullish reversal signal appearing after a downtrend.",
            trading: "Enter long positions with stops below the pattern low. Target key resistance levels.",
            reliability: "Very High - highly reliable reversal pattern"
        },
        "Evening Star": {
            meaning: "Three-candle bearish reversal pattern: bullish candle, small-bodied candle, then bearish candle.",
            significance: "Strong bearish reversal signal appearing after an uptrend.",
            trading: "Enter short positions with stops above the pattern high. Target key support levels.",
            reliability: "Very High - highly reliable reversal pattern"
        },
        "Three Black Crows": {
            meaning: "Three consecutive bearish candles with progressively lower closes.",
            significance: "Strong bearish continuation signal showing sustained selling pressure.",
            trading: "Consider short positions or exit long positions. Target lower support levels.",
            reliability: "High - strong bearish momentum indicator"
        },
        "Three White Soldiers": {
            meaning: "Three consecutive bullish candles with progressively higher closes.",
            significance: "Strong bullish continuation signal showing sustained buying pressure.",
            trading: "Consider long positions or exit short positions. Target higher resistance levels.",
            reliability: "High - strong bullish momentum indicator"
        },
        "Support Level Test": {
            meaning: "Price is testing a key support level where buying interest has previously emerged.",
            significance: "Critical decision point - if support holds, bullish bounce likely; if broken, bearish continuation.",
            trading: "Watch for bounce off support for long entry, or break below for short entry.",
            reliability: "High - support/resistance levels are key technical levels"
        },
        "Resistance Level Test": {
            meaning: "Price is testing a key resistance level where selling interest has previously emerged.",
            significance: "Critical decision point - if resistance breaks, bullish continuation likely; if rejected, bearish reversal.",
            trading: "Watch for break above resistance for long entry, or rejection for short entry.",
            reliability: "High - support/resistance levels are key technical levels"
        },
        "Bullish Trend": {
            meaning: "Price is above both 20-period and 50-period moving averages in ascending order.",
            significance: "Strong bullish momentum with institutional and retail support.",
            trading: "Consider long positions on pullbacks to moving averages. Trend is your friend.",
            reliability: "High - moving average alignment is a strong trend indicator"
        },
        "Bearish Trend": {
            meaning: "Price is below both 20-period and 50-period moving averages in descending order.",
            significance: "Strong bearish momentum with institutional and retail selling pressure.",
            trading: "Consider short positions on bounces to moving averages. Avoid fighting the trend.",
            reliability: "High - moving average alignment is a strong trend indicator"
        },
        "Gravestone Doji": {
            meaning: "A candle with long upper shadow, no lower shadow, and open/close at or near the low.",
            significance: "Strong bearish reversal signal indicating selling pressure at higher levels.",
            trading: "Consider short positions with stops above the high. Wait for bearish confirmation.",
            reliability: "High - especially when appearing at resistance levels after an uptrend"
        },
        "Dragonfly Doji": {
            meaning: "A candle with long lower shadow, no upper shadow, and open/close at or near the high.",
            significance: "Strong bullish reversal signal indicating buying support at lower levels.",
            trading: "Consider long positions with stops below the low. Wait for bullish confirmation.",
            reliability: "High - especially when appearing at support levels after a downtrend"
        },
        "Marubozu": {
            meaning: direction === "bullish" ? "A large bullish candle with no shadows, indicating strong buying throughout the session." : "A large bearish candle with no shadows, indicating strong selling throughout the session.",
            significance: direction === "bullish" ? "Very strong bullish momentum with continuous buying pressure." : "Very strong bearish momentum with continuous selling pressure.",
            trading: direction === "bullish" ? "Consider long positions on pullbacks. Strong continuation signal." : "Consider short positions on bounces. Strong continuation signal.",
            reliability: "Very High - clear directional momentum with no hesitation"
        },
        "Spinning Top": {
            meaning: "A candle with small body and long shadows on both sides, indicating market indecision.",
            significance: "Shows equilibrium between buyers and sellers with high volatility but no clear direction.",
            trading: "Wait for confirmation before trading. Market is at a decision point.",
            reliability: "Medium - requires confirmation from subsequent price action"
        },
        "Piercing Pattern": {
            meaning: "Two-candle bullish reversal: bearish candle followed by bullish candle that opens below and closes above midpoint.",
            significance: "Strong bullish reversal signal showing buying pressure overwhelming selling.",
            trading: "Enter long positions with stops below the pattern low. Target resistance levels.",
            reliability: "High - reliable bullish reversal pattern"
        },
        "Dark Cloud Cover": {
            meaning: "Two-candle bearish reversal: bullish candle followed by bearish candle that opens above and closes below midpoint.",
            significance: "Strong bearish reversal signal showing selling pressure overwhelming buying.",
            trading: "Enter short positions with stops above the pattern high. Target support levels.",
            reliability: "High - reliable bearish reversal pattern"
        },
        "Harami Pattern": {
            meaning: direction === "bullish" ? "Bullish harami: large bearish candle followed by small bullish candle contained within the first." : "Bearish harami: large bullish candle followed by small bearish candle contained within the first.",
            significance: direction === "bullish" ? "Potential bullish reversal signal indicating weakening bearish momentum." : "Potential bearish reversal signal indicating weakening bullish momentum.",
            trading: direction === "bullish" ? "Consider long positions on confirmation. Wait for follow-through." : "Consider short positions on confirmation. Wait for follow-through.",
            reliability: "Medium - needs confirmation from subsequent candles"
        },
        "Harami Cross": {
            meaning: "A harami pattern where the second candle is a doji, indicating even stronger indecision.",
            significance: "Stronger reversal signal than regular harami due to the doji's indecision element.",
            trading: "Wait for strong confirmation before trading. High probability reversal setup.",
            reliability: "High - combination of harami and doji increases reliability"
        },
        "Thrusting Pattern": {
            meaning: "Two-candle pattern: bearish candle followed by bullish candle that closes below the midpoint of the first.",
            significance: "Bearish continuation pattern showing failed bullish attempt.",
            trading: "Consider short positions as the pattern suggests continued selling pressure.",
            reliability: "Medium - continuation pattern with moderate reliability"
        },
        "Advance Block": {
            meaning: "Three consecutive bullish candles with progressively smaller bodies and longer upper shadows.",
            significance: "Bearish reversal warning - shows weakening bullish momentum despite higher prices.",
            trading: "Consider taking profits on long positions. Watch for reversal confirmation.",
            reliability: "Medium - early warning signal of potential trend change"
        },
        "Three Inside Up/Down": {
            meaning: direction === "bullish" ? "Three-candle bullish pattern: bearish, small bullish (harami), then strong bullish confirmation." : "Three-candle bearish pattern: bullish, small bearish (harami), then strong bearish confirmation.",
            significance: direction === "bullish" ? "Strong bullish reversal with harami setup and confirmation." : "Strong bearish reversal with harami setup and confirmation.",
            trading: direction === "bullish" ? "Enter long positions with stops below pattern low." : "Enter short positions with stops above pattern high.",
            reliability: "High - three-candle confirmation provides strong signal"
        },
        "Three Outside Up/Down": {
            meaning: direction === "bullish" ? "Three-candle bullish pattern: engulfing pattern followed by bullish confirmation candle." : "Three-candle bearish pattern: engulfing pattern followed by bearish confirmation candle.",
            significance: direction === "bullish" ? "Very strong bullish reversal with engulfing and confirmation." : "Very strong bearish reversal with engulfing and confirmation.",
            trading: direction === "bullish" ? "Strong long entry signal with high probability of continuation." : "Strong short entry signal with high probability of continuation.",
            reliability: "Very High - engulfing plus confirmation is extremely reliable"
        },
        // Volume Patterns
        "Volume Spike": {
            meaning: "Abnormally high trading volume compared to recent average, indicating significant market interest.",
            significance: direction === "bullish" ? "Strong buying interest driving volume surge." : "Heavy selling pressure creating volume spike.",
            trading: direction === "bullish" ? "Consider long positions as institutions may be accumulating." : "Watch for potential selling climax or distribution.",
            reliability: "High - volume spikes often precede significant price movements"
        },
        "Volume Breakout": {
            meaning: "Price breakout above resistance accompanied by increased volume confirming the move.",
            significance: "Volume validates the breakout, reducing chances of false breakout.",
            trading: "Enter long positions on confirmed volume breakout with stops below breakout level.",
            reliability: "Very High - volume confirmation significantly increases breakout success rate"
        },
        "Accumulation Pattern": {
            meaning: "Volume shows accumulation supporting price rise, indicating institutional buying.",
            significance: "Smart money is likely accumulating shares at current levels.",
            trading: "Consider long positions as accumulation often precedes major upward moves.",
            reliability: "High - accumulation patterns often mark intermediate bottoms"
        },
        "Distribution Pattern": {
            meaning: "Volume shows distribution supporting price decline, indicating institutional selling.",
            significance: "Smart money is likely distributing shares at current levels.",
            trading: "Consider reducing positions as distribution often precedes major downward moves.",
            reliability: "High - distribution patterns often mark intermediate tops"
        },
        "Volume Climax": {
            meaning: "Extreme volume combined with significant price movement, often marking exhaustion.",
            significance: "Potential reversal point as extreme volume suggests capitulation or euphoria.",
            trading: direction === "bullish" ? "Watch for bearish reversal after bullish climax." : "Watch for bullish reversal after bearish climax.",
            reliability: "Very High - volume climaxes are reliable reversal indicators"
        },
        "Low Volume Pullback": {
            meaning: "Healthy pullback on declining volume suggesting the main trend will continue.",
            significance: "Lack of selling pressure during pullback indicates underlying strength.",
            trading: "Consider adding to long positions on low volume pullbacks in uptrends.",
            reliability: "High - low volume pullbacks often provide good entry opportunities"
        },
        "Volume Confirmation": {
            meaning: "Volume trend confirms price movement direction, validating the current trend.",
            significance: direction === "bullish" ? "Rising volume supports upward price movement." : "Rising volume supports downward price movement.",
            trading: direction === "bullish" ? "Trend is confirmed, consider maintaining long positions." : "Trend is confirmed, consider maintaining short positions.",
            reliability: "High - volume confirmation strengthens trend reliability"
        },
        "Volume Divergence": {
            meaning: direction === "bullish" ? "Volume declining while price rising, suggesting weakening momentum." : "Volume increasing while price declining, suggesting potential reversal.",
            significance: direction === "bullish" ? "Bearish divergence warns of potential trend reversal." : "Bullish divergence suggests selling may be overdone.",
            trading: direction === "bullish" ? "Consider taking profits or tightening stops." : "Watch for potential reversal and buying opportunity.",
            reliability: "Medium - divergences can persist but often precede reversals"
        },
        "High Volume Reversal": {
            meaning: "Price reversal accompanied by unusually high volume, confirming the direction change.",
            significance: "High volume validates the reversal, increasing confidence in new direction.",
            trading: direction === "bullish" ? "Enter long positions on high volume bullish reversal." : "Enter short positions on high volume bearish reversal.",
            reliability: "Very High - high volume reversals are among most reliable signals"
        },
        "Volume Thrust": {
            meaning: "Powerful upward price movement on exceptional volume, indicating strong buying pressure.",
            significance: "Institutional buying or positive news driving strong demand.",
            trading: "Consider long positions but watch for profit-taking at resistance levels.",
            reliability: "High - volume thrusts often lead to sustained upward moves"
        },
        "Volume Drying Up": {
            meaning: "Volume declining significantly, often preceding a breakout in either direction.",
            significance: "Market consolidation with reduced interest, preparing for next move.",
            trading: "Prepare for breakout in either direction, wait for volume confirmation.",
            reliability: "Medium - low volume often precedes significant moves but direction uncertain"
        },
        "Volume Expansion": {
            meaning: "Volume increasing significantly, supporting the current price trend.",
            significance: direction === "bullish" ? "Growing interest supports upward movement." : "Increasing selling pressure supports downward movement.",
            trading: direction === "bullish" ? "Consider adding to long positions on volume expansion." : "Consider adding to short positions on volume expansion.",
            reliability: "High - volume expansion often extends existing trends"
        },
        "Volume Contraction": {
            meaning: "Systematic volume decline suggesting market consolidation or indecision.",
            significance: "Reduced trading interest indicates consolidation phase.",
            trading: "Wait for volume expansion to confirm next directional move.",
            reliability: "Medium - contraction often precedes significant moves"
        },
        "OBV Bullish Trend": {
            meaning: "On-Balance Volume trending upward, confirming bullish price action.",
            significance: "Volume flow supports the upward price trend.",
            trading: "Bullish OBV trend supports long positions and trend continuation.",
            reliability: "High - OBV trends are reliable momentum indicators"
        },
        "OBV Bearish Trend": {
            meaning: "On-Balance Volume trending downward, confirming bearish price action.",
            significance: "Volume flow supports the downward price trend.",
            trading: "Bearish OBV trend supports short positions and trend continuation.",
            reliability: "High - OBV trends are reliable momentum indicators"
        },
        "VPT Confirmation": {
            meaning: "Volume Price Trend indicator confirming the current price movement direction.",
            significance: direction === "bullish" ? "Volume weighted price trend supports bullish momentum." : "Volume weighted price trend supports bearish momentum.",
            trading: direction === "bullish" ? "VPT confirmation supports maintaining long positions." : "VPT confirmation supports maintaining short positions.",
            reliability: "High - VPT provides reliable trend confirmation"
        },
        "Heavy Volume Rejection": {
            meaning: direction === "bullish" ? "Heavy volume rejection at lower levels indicating strong support." : "Heavy volume rejection at higher levels indicating strong resistance.",
            significance: direction === "bullish" ? "Strong buying interest emerges at support levels." : "Strong selling interest emerges at resistance levels.",
            trading: direction === "bullish" ? "Consider long positions after heavy volume support test." : "Consider short positions after heavy volume resistance rejection.",
            reliability: "Very High - heavy volume rejections mark significant support/resistance"
        },
        // Harmonic Patterns
        "Gartley Pattern": {
            meaning: "Five-point harmonic pattern with specific Fibonacci retracements (XA-AB-BC-CD-DA structure).",
            significance: direction === "bullish" ? "Bullish Gartley suggests potential reversal from oversold conditions." : "Bearish Gartley suggests potential reversal from overbought conditions.",
            trading: direction === "bullish" ? "Enter long at D point with stops below X, target AB=CD completion." : "Enter short at D point with stops above X, target AB=CD completion.",
            reliability: "Very High - Gartley patterns have excellent risk/reward ratios"
        },
        "Butterfly Pattern": {
            meaning: "Harmonic pattern with 0.786 retracement and 1.27-1.618 extension, creating PRZ (Potential Reversal Zone).",
            significance: "Butterfly patterns often mark significant reversal points with extended price movements.",
            trading: direction === "bullish" ? "Enter long in PRZ with tight stops, target 0.382-0.618 retracement." : "Enter short in PRZ with tight stops, target 0.382-0.618 retracement.",
            reliability: "Very High - butterfly patterns offer precise entry points"
        },
        "Bat Pattern": {
            meaning: "Harmonic pattern with 0.382-0.5 B point and precise 0.886 retracement at D point.",
            significance: "Bat patterns provide high-probability reversal signals at 0.886 Fibonacci level.",
            trading: direction === "bullish" ? "Enter long at 0.886 retracement with stops below, target AB=CD." : "Enter short at 0.886 retracement with stops above, target AB=CD.",
            reliability: "Very High - 0.886 level is a strong harmonic reversal zone"
        },
        "Crab Pattern": {
            meaning: "Extreme harmonic pattern with 1.618 extension, representing deepest potential reversal zone.",
            significance: "Crab patterns mark extreme price extensions often leading to sharp reversals.",
            trading: direction === "bullish" ? "Enter long at 1.618 extension with tight stops, expect sharp reversal." : "Enter short at 1.618 extension with tight stops, expect sharp reversal.",
            reliability: "Excellent - crab patterns offer extreme risk/reward opportunities"
        },
        "ABCD Pattern": {
            meaning: "Simple harmonic pattern where CD leg equals AB leg in time and price proportion.",
            significance: "Basic harmonic completion suggesting natural price cycle completion.",
            trading: direction === "bullish" ? "Enter long at D completion with stops below C, target AB length." : "Enter short at D completion with stops above C, target AB length.",
            reliability: "High - ABCD patterns are fundamental harmonic structures"
        },
        "Three Drives Pattern": {
            meaning: "Seven-point harmonic pattern with three equal drives and Fibonacci relationships.",
            significance: "Complex pattern indicating major trend exhaustion and potential reversal.",
            trading: direction === "bullish" ? "Enter long after third drive completion with wide stops." : "Enter short after third drive completion with wide stops.",
            reliability: "High - three drives patterns mark significant trend changes"
        },
        "Cypher Pattern": {
            meaning: "Harmonic pattern with 0.786 retracement at D point and specific internal ratios.",
            significance: "Cypher patterns provide reliable reversal signals at 0.786 Fibonacci level.",
            trading: direction === "bullish" ? "Enter long at 0.786 retracement with stops below, target XA." : "Enter short at 0.786 retracement with stops above, target XA.",
            reliability: "High - cypher patterns have good win rates at 0.786 level"
        },
        "Shark Pattern": {
            meaning: "Five-point harmonic pattern with 0.886-1.13 retracement zone (deeper than Cypher).",
            significance: "Shark patterns indicate potential reversal in extended trending markets.",
            trading: direction === "bullish" ? "Enter long in 0.886-1.13 zone with stops below, target BC." : "Enter short in 0.886-1.13 zone with stops above, target BC.",
            reliability: "High - shark patterns work well in trending market conditions"
        },
        "NenStar Pattern": {
            meaning: "Complex harmonic pattern combining multiple Fibonacci relationships at confluence zone.",
            significance: "NenStar patterns mark high-probability reversal zones with multiple confirmations.",
            trading: direction === "bullish" ? "Enter long at confluence zone with multiple confirmations." : "Enter short at confluence zone with multiple confirmations.",
            reliability: "High - multiple Fibonacci confluence increases pattern reliability"
        },
        "Anti Pattern": {
            meaning: "Inverted harmonic structure providing alternative entry opportunities.",
            significance: "Anti patterns offer contrarian signals when traditional patterns fail.",
            trading: direction === "bullish" ? "Enter long on anti-pattern completion with modified stops." : "Enter short on anti-pattern completion with modified stops.",
            reliability: "Medium - anti patterns require experienced harmonic traders"
        },
        "Deep Crab Pattern": {
            meaning: "Extreme harmonic pattern extending beyond traditional Crab with deeper retracements.",
            significance: "Deep Crab indicates maximum price extension before potential sharp reversal.",
            trading: direction === "bullish" ? "Enter long at extreme extension with very tight stops." : "Enter short at extreme extension with very tight stops.",
            reliability: "Very High - deep crab patterns offer extreme risk/reward scenarios"
        },
        "Perfect Pattern": {
            meaning: "Ideal harmonic pattern with perfect Fibonacci ratios and optimal market structure.",
            significance: "Perfect patterns represent textbook harmonic formations with highest probability.",
            trading: direction === "bullish" ? "Enter long with high confidence at perfect completion zone." : "Enter short with high confidence at perfect completion zone.",
            reliability: "Excellent - perfect patterns have highest success rates in harmonic trading"
        },
        // Statistical Patterns
        "Bollinger Band Squeeze": {
            meaning: "Bollinger Bands contracting to unusually narrow width, indicating low volatility consolidation.",
            significance: "Low volatility periods typically precede high volatility breakouts in either direction.",
            trading: "Prepare for breakout in either direction, enter on volume confirmation after squeeze release.",
            reliability: "High - squeezes reliably precede significant moves, though direction uncertain"
        },
        "Bollinger Upper Breakout": {
            meaning: "Price closing above the upper Bollinger Band, indicating strong upward momentum.",
            significance: "Breakout above upper band suggests continuation of bullish trend with increased volatility.",
            trading: "Consider long positions but watch for potential pullback to band for entry.",
            reliability: "High - upper band breakouts often continue in trending markets"
        },
        "Bollinger Lower Breakout": {
            meaning: "Price closing below the lower Bollinger Band, indicating strong downward momentum.",
            significance: "Breakout below lower band suggests continuation of bearish trend with increased volatility.",
            trading: "Consider short positions but watch for potential bounce to band for entry.",
            reliability: "High - lower band breakouts often continue in trending markets"
        },
        "Bollinger Band Bounce": {
            meaning: direction === "bullish" ? "Price bouncing off lower Bollinger Band, suggesting support." : "Price bouncing off upper Bollinger Band, suggesting resistance.",
            significance: direction === "bullish" ? "Lower band acting as dynamic support in uptrend." : "Upper band acting as dynamic resistance in downtrend.",
            trading: direction === "bullish" ? "Enter long positions on bounce with stops below band." : "Enter short positions on bounce with stops above band.",
            reliability: "High - Bollinger Band bounces work well in ranging markets"
        },
        "RSI Overbought": {
            meaning: "RSI above 70, indicating potential overbought conditions and possible reversal.",
            significance: "High RSI suggests buying momentum may be exhausted, reversal possible.",
            trading: "Consider taking profits on long positions or preparing for short opportunities.",
            reliability: "Medium - RSI can remain overbought in strong trends"
        },
        "RSI Oversold": {
            meaning: "RSI below 30, indicating potential oversold conditions and possible reversal.",
            significance: "Low RSI suggests selling momentum may be exhausted, reversal possible.",
            trading: "Consider taking profits on short positions or preparing for long opportunities.",
            reliability: "Medium - RSI can remain oversold in strong trends"
        },
        "RSI Bearish Divergence": {
            meaning: "Price making higher highs while RSI making lower highs, indicating weakening momentum.",
            significance: "Momentum divergence warns of potential trend reversal despite rising prices.",
            trading: "Consider reducing long positions and preparing for potential reversal.",
            reliability: "High - RSI divergences are reliable early warning signals"
        },
        "RSI Bullish Divergence": {
            meaning: "Price making lower lows while RSI making higher lows, indicating strengthening momentum.",
            significance: "Momentum divergence suggests potential bullish reversal despite falling prices.",
            trading: "Consider reducing short positions and preparing for potential reversal.",
            reliability: "High - RSI divergences are reliable early warning signals"
        },
        "MACD Bullish Crossover": {
            meaning: "MACD line crossing above signal line, indicating increasing bullish momentum.",
            significance: "Bullish crossover suggests acceleration of upward price movement.",
            trading: "Consider long positions on bullish MACD crossover with trend confirmation.",
            reliability: "High - MACD crossovers are reliable momentum change indicators"
        },
        "MACD Bearish Crossover": {
            meaning: "MACD line crossing below signal line, indicating increasing bearish momentum.",
            significance: "Bearish crossover suggests acceleration of downward price movement.",
            trading: "Consider short positions on bearish MACD crossover with trend confirmation.",
            reliability: "High - MACD crossovers are reliable momentum change indicators"
        },
        "MACD Zero Line Cross": {
            meaning: direction === "bullish" ? "MACD crossing above zero line, confirming bullish trend." : "MACD crossing below zero line, confirming bearish trend.",
            significance: direction === "bullish" ? "Zero line cross confirms bullish trend strength." : "Zero line cross confirms bearish trend strength.",
            trading: direction === "bullish" ? "Strong bullish signal, consider adding to long positions." : "Strong bearish signal, consider adding to short positions.",
            reliability: "Very High - zero line crosses confirm major trend changes"
        },
        "Stochastic Overbought": {
            meaning: "Stochastic oscillator above 80, indicating potential overbought conditions.",
            significance: "High stochastic values suggest short-term reversal or consolidation likely.",
            trading: "Consider taking profits or waiting for pullback before new long positions.",
            reliability: "Medium - stochastic can remain overbought in strong trends"
        },
        "Stochastic Oversold": {
            meaning: "Stochastic oscillator below 20, indicating potential oversold conditions.",
            significance: "Low stochastic values suggest short-term reversal or consolidation likely.",
            trading: "Consider taking profits or waiting for bounce before new short positions.",
            reliability: "Medium - stochastic can remain oversold in strong trends"
        },
        "Williams %R Overbought": {
            meaning: "Williams %R above -20, indicating potential overbought conditions and reversal risk.",
            significance: "Extreme Williams %R readings suggest short-term momentum exhaustion.",
            trading: "Consider reducing long exposure as reversal risk increases.",
            reliability: "Medium - Williams %R provides good short-term timing signals"
        },
        "Williams %R Oversold": {
            meaning: "Williams %R below -80, indicating potential oversold conditions and bounce potential.",
            significance: "Extreme Williams %R readings suggest short-term bounce opportunity.",
            trading: "Consider reducing short exposure as bounce risk increases.",
            reliability: "Medium - Williams %R provides good short-term timing signals"
        },
        "Momentum Shift Bullish": {
            meaning: "Price momentum shifting from negative to positive, indicating trend change.",
            significance: "Momentum shift suggests potential beginning of new bullish phase.",
            trading: "Consider initiating long positions as momentum turns favorable.",
            reliability: "High - momentum shifts often mark important trend changes"
        },
        "Momentum Shift Bearish": {
            meaning: "Price momentum shifting from positive to negative, indicating trend change.",
            significance: "Momentum shift suggests potential beginning of new bearish phase.",
            trading: "Consider initiating short positions as momentum turns unfavorable.",
            reliability: "High - momentum shifts often mark important trend changes"
        },
        "High Volatility Alert": {
            meaning: "Average True Range indicates unusually high volatility compared to recent periods.",
            significance: "High volatility suggests increased uncertainty and potential for large moves.",
            trading: "Use wider stops and smaller position sizes due to increased volatility.",
            reliability: "High - ATR accurately measures volatility changes"
        },
        "Low Volatility Alert": {
            meaning: "Average True Range indicates unusually low volatility compared to recent periods.",
            significance: "Low volatility often precedes periods of higher volatility and larger moves.",
            trading: "Prepare for potential breakout, current low volatility may not persist.",
            reliability: "High - ATR accurately measures volatility changes"
        },
        "Strong Trend Signal": {
            meaning: "ADX above 25 indicates a strong trending market environment.",
            significance: "Strong trend conditions favor trend-following strategies over range-bound tactics.",
            trading: "Focus on trend-following strategies, avoid contrarian approaches.",
            reliability: "Very High - ADX is the most reliable trend strength indicator"
        }
    };
    return patternInfoMap[patternName] || {
        meaning: "Pattern details not available. This is a detected pattern in the market data.",
        significance: "Technical analysis pattern that may indicate potential price movement.",
        trading: "Analyze the pattern context and wait for confirmation before making trading decisions.",
        reliability: "Variable - depends on market conditions and pattern context"
    };
};
// Test functions
const testAllPatternsHaveDetails = () => {
    const missingPatterns = [];
    const patternsWithDetails = [];
    ALL_PATTERNS.forEach(patternName => {
        const patternInfo = getPatternInfo(patternName, "bullish");
        if (patternInfo.meaning === "Pattern details not available. This is a detected pattern in the market data.") {
            missingPatterns.push(patternName);
        }
        else {
            patternsWithDetails.push(patternName);
        }
    });
    return {
        totalPatterns: ALL_PATTERNS.length,
        patternsWithDetails: patternsWithDetails.length,
        missingPatterns: missingPatterns.length,
        missingPatternsList: missingPatterns,
        success: missingPatterns.length === 0
    };
};
exports.testAllPatternsHaveDetails = testAllPatternsHaveDetails;
const testPatternDetailStructure = () => {
    const incompletePatterns = [];
    ALL_PATTERNS.forEach(patternName => {
        const patternInfo = getPatternInfo(patternName, "bullish");
        // Check if pattern has all required fields
        if (!patternInfo.meaning || !patternInfo.significance || !patternInfo.trading || !patternInfo.reliability) {
            incompletePatterns.push(patternName);
        }
        // Check if any field is empty
        if (patternInfo.meaning.trim() === "" ||
            patternInfo.significance.trim() === "" ||
            patternInfo.trading.trim() === "" ||
            patternInfo.reliability.trim() === "") {
            incompletePatterns.push(patternName);
        }
    });
    return {
        totalPatterns: ALL_PATTERNS.length,
        incompletePatterns: incompletePatterns.length,
        incompletePatternsList: incompletePatterns,
        success: incompletePatterns.length === 0
    };
};
exports.testPatternDetailStructure = testPatternDetailStructure;
// Run tests
console.log("🧪 Running Pattern Detail Tests...");
const detailsTest = (0, exports.testAllPatternsHaveDetails)();
console.log("\n📋 Pattern Details Coverage Test:");
console.log(`✅ Total patterns: ${detailsTest.totalPatterns}`);
console.log(`✅ Patterns with details: ${detailsTest.patternsWithDetails}`);
console.log(`❌ Missing details: ${detailsTest.missingPatterns}`);
if (detailsTest.missingPatterns > 0) {
    console.log("\n🔍 Patterns missing details:");
    detailsTest.missingPatternsList.forEach(pattern => {
        console.log(`  - ${pattern}`);
    });
}
const structureTest = (0, exports.testPatternDetailStructure)();
console.log("\n📝 Pattern Detail Structure Test:");
console.log(`✅ Complete patterns: ${structureTest.totalPatterns - structureTest.incompletePatterns}`);
console.log(`❌ Incomplete patterns: ${structureTest.incompletePatterns}`);
if (structureTest.incompletePatterns > 0) {
    console.log("\n🔍 Patterns with incomplete details:");
    structureTest.incompletePatternsList.forEach(pattern => {
        console.log(`  - ${pattern}`);
    });
}
console.log(`\n🎯 Overall Test Result: ${detailsTest.success && structureTest.success ? "PASSED ✅" : "FAILED ❌"}`);
