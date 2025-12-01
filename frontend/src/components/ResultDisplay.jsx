import { useEffect, useRef } from 'react';

function ResultDisplay({ result }) {
    const circleRef = useRef(null);

    useEffect(() => {
        if (circleRef.current && result) {
            const circle = circleRef.current;
            const radius = 28;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (result.confidence / 100) * circumference;

            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
        }
    }, [result]);

    if (!result) return null;

    const isPhishing = result.prediction === 'phishing';

    return (
        <section className="result">
            <div className="result-header">
                <span className={`badge ${isPhishing ? 'badge-danger' : 'badge-safe'}`}>
                    {isPhishing ? '⚠️ Phishing Detected' : '✓ Looks Safe'}
                </span>

                <div className="confidence-circle">
                    <svg className="circle-svg" width="65" height="65">
                        <circle className="bg" cx="32" cy="32" r="28" />
                        <circle
                            ref={circleRef}
                            className={`progress ${isPhishing ? 'progress-danger' : 'progress-safe'}`}
                            cx="32"
                            cy="32"
                            r="28"
                        />
                    </svg>
                    <div className="confidence-label">{result.confidence}%</div>
                </div>
            </div>

            <p className="result-message">
                {isPhishing
                    ? 'This email shows signs of phishing. Be cautious!'
                    : 'This email appears to be legitimate.'}
            </p>
        </section>
    );
}

export default ResultDisplay;
