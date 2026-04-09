import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [view, setView] = useState('vote');
    const [candidates, setCandidates] = useState([]);
    const [results, setResults] = useState([]);
    const [voterData, setVoterData] = useState({ content: [], totalPages: 0, number: 0 });
    
    const [voterId, setVoterId] = useState('');
    const [candidateSearch, setCandidateSearch] = useState('');
    const [voterFilter, setVoterFilter] = useState('');
    const [message, setMessage] = useState(null);

    const fetchCandidates = async (searchQuery = '') => {
        try {
            const res = await axios.get(`http://localhost:8080/api/candidates?search=${searchQuery}`);
            setCandidates(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchResults = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/results');
            setResults(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchVoters = async (page = 0) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/voters?page=${page}&size=10`);
            setVoterData(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchCandidates(candidateSearch);
        fetchResults();
        fetchVoters(0);
    }, [view, candidateSearch]);

    const handleVote = async (candidateId) => {
        if (!voterId.trim()) return setMessage({ type: 'error', text: "Authentication required: Please enter Voter ID." });
        try {
            const response = await axios.post('http://localhost:8080/api/vote', {
                voterId: voterId,
                candidateId: candidateId.toString()
            });
            setMessage({ type: 'success', text: response.data.message });
            setVoterId(''); 
            fetchCandidates(); 
            fetchResults();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || "Transaction failed." });
        }
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* FULL-WIDTH NAVY HEADER */}
            <div className="national-header">
                <h1>🗳️ SECURE VOTE</h1>
            </div>
            
            {/* CENTERED APP CONTENT */}
            <div className="page-container">
                <div className="nav-bar">
                    <button className={`nav-link ${view === 'vote' ? 'active' : ''}`} onClick={() => { setView('vote'); setMessage(null); }}>
                        Elections
                    </button>
                    <button className={`nav-link ${view === 'results' ? 'active' : ''}`} onClick={() => { setView('results'); setMessage(null); }}>
                        Live Analytics
                    </button>
                    <button className={`nav-link ${view === 'admin' ? 'active' : ''}`} onClick={() => { setView('admin'); setMessage(null); fetchVoters(0); }}>
                        Directory
                    </button>
                </div>

                {message && <div className={`system-alert alert-${message.type}`}>{message.text}</div>}

                {/* --- PORTAL: VOTE --- */}
                {view === 'vote' && (
                    <div style={{width: '100%'}}>
                        <div className="toolbar">
                            <input className="auth-input" type="text" placeholder="Authenticate with Voter ID" value={voterId} onChange={e => setVoterId(e.target.value)} />
                            <input className="auth-input" type="text" placeholder="Search Candidates" value={candidateSearch} onChange={e => setCandidateSearch(e.target.value)} />
                        </div>
                        
                        <div className="product-grid">
                            {candidates.map(candidate => (
                                <div key={candidate.id} className="product-card">
                                    <div className="card-content">
                                        <h3 className="candidate-name">{candidate.name}</h3>
                                        <p className="candidate-party">{candidate.party}</p>
                                    </div>
                                    <button className="add-to-cart-btn" onClick={() => handleVote(candidate.id)}>
                                        Cast Vote
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- PORTAL: RESULTS --- */}
                {view === 'results' && (
                    <div className="product-grid">
                        {results.map((candidate, index) => (
                            <div key={candidate.id} className="product-card" style={index === 0 && candidate.voteCount > 0 ? { borderColor: '#0b1f38', borderWidth: '2px'} : {}}>
                                <div className="card-content">
                                    <h3 className="candidate-name" style={index === 0 && candidate.voteCount > 0 ? {color: '#0b1f38'} : {}}>
                                        {index === 0 && candidate.voteCount > 0 ? '★ ' : ''}{candidate.name}
                                    </h3>
                                    <p className="candidate-party">{candidate.party}</p>
                                    <div className="vote-tally">
                                        {candidate.voteCount} <span>Votes</span>
                                    </div>
                                </div>
                                <div className="add-to-cart-btn" style={{cursor: 'default', color: '#888'}}>
                                    {index === 0 && candidate.voteCount > 0 ? 'Current Leader' : 'Verified'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- PORTAL: DIRECTORY --- */}
                {view === 'admin' && (
                    <div style={{width: '100%'}}>
                        <div className="toolbar" style={{marginBottom: '20px'}}>
                            <input className="auth-input" type="text" placeholder="Search directory..." value={voterFilter} onChange={e => setVoterFilter(e.target.value)} />
                        </div>
                        
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Voter ID</th>
                                    <th>Full Name</th>
                                    <th style={{textAlign: 'right'}}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voterData.content && voterData.content
                                    .filter(v => v.name.toLowerCase().includes(voterFilter.toLowerCase()))
                                    .map(voter => (
                                    <tr key={voter.voterId}>
                                        <td style={{fontWeight: '600'}}>{voter.voterId}</td>
                                        <td>{voter.name}</td>
                                        <td style={{textAlign: 'right', color: voter.hasVoted ? '#111' : '#888', fontWeight: voter.hasVoted ? '600' : '400'}}>
                                            {voter.hasVoted ? 'Voted' : 'Pending'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination-wrapper">
                            <button className="black-pill-btn" onClick={() => fetchVoters(voterData.number - 1)} disabled={voterData.number === 0}>
                                Previous
                            </button>
                            <span>Page {voterData.number + 1} of {voterData.totalPages === 0 ? 1 : voterData.totalPages}</span>
                            <button className="black-pill-btn" onClick={() => fetchVoters(voterData.number + 1)} disabled={voterData.number >= voterData.totalPages - 1}>
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;