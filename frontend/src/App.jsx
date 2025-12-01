import { useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import EmailAnalyzer from './components/EmailAnalyzer'
import ResultDisplay from './components/ResultDisplay'

const API_URL = 'http://localhost:8000/api';

function App() {
    const [emailText, setEmailText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const analyzeEmail = async () => {
        if (!emailText.trim()) {
            alert('Please enter email text to analyze');
            return;
        }

        setAnalyzing(true);
        setResult(null);

        try {
            const response = await axios.post(`${API_URL}/predict`, {
                text: emailText
            });

            setResult(response.data);
        } catch (error) {
            console.error('Error analyzing email:', error);
            alert('Failed to analyze email. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="app">
            <div className="bg-overlay"></div>
            <Header />

            <main className="page">
                <section className="card">
                    <EmailAnalyzer
                        emailText={emailText}
                        setEmailText={setEmailText}
                        analyzing={analyzing}
                        analyzeEmail={analyzeEmail}
                    />

                    {result && <ResultDisplay result={result} />}
                </section>

                <footer className="footer">
                </footer>
            </main>
        </div>
    );
}

export default App;
