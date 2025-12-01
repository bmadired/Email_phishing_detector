function EmailAnalyzer({ emailText, setEmailText, analyzing, analyzeEmail }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            analyzeEmail();
        }
    };

    return (
        <section className="card-body">
            <label htmlFor="emailText" className="field-label">
                Email content
            </label>
            <textarea
                id="emailText"
                className="textarea"
                rows="10"
                placeholder="Paste the email text here..."
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={analyzing}
            />

            <div className="actions">
                <button
                    id="analyzeBtn"
                    className="btn-primary"
                    onClick={analyzeEmail}
                    disabled={analyzing}
                >
                    {analyzing ? 'Analyzing...' : 'Analyze Email'}
                </button>
                {analyzing && <span className="status-text">Processing...</span>}
            </div>
        </section>
    );
}

export default EmailAnalyzer;
