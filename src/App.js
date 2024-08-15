import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import QuizPage from './pages/Quiz/index';
import ResultPage from './pages/Result/index';

function App() {
    return (
        <Router>
            <Routes>
               
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/result" element={<ResultPage />} />
            </Routes>
        </Router>
    );
}

export default App;
