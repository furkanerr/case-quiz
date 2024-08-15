import React from 'react';

const Results = ({ results, restartQuiz }) => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#B05BF7' }}>
      <h1>Test Results</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid white', padding: '8px' }}>Question</th>
            <th style={{ border: '1px solid white', padding: '8px' }}>Your Answer</th>
            <th style={{ border: '1px solid white', padding: '8px' }}>Correct Answer</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} style={{
              backgroundColor: result.selectedOption === result.correctOption ? '#12D18E' : '#F85E5E'
            }}>
              <td style={{ border: '1px solid white', padding: '8px' }}>{result.question}</td>
              <td style={{ border: '1px solid white', padding: '8px' }}>{result.selectedOption}</td>
              <td style={{ border: '1px solid white', padding: '8px' }}>{result.correctOption}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={restartQuiz} style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#4CAF50', color: 'white', marginTop: '20px' }}>
        Restart
      </button>
    </div>
  );
};

export default Results;

