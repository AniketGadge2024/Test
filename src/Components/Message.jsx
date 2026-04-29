import React, { useState, useMemo } from 'react';

const Message = () => {
  const [quizInput, setQuizInput] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Core Logic: Converts raw text into a structured Quiz Object
  const generateQuiz = () => {
    if (!quizInput.trim()) return;

    // 1. Separate the Questions from the Answer Key
    const [content, keySection] = quizInput.split(/ANSWER KEY:/i);
    
    // 2. Parse the Answer Key (Format: 1-B, 2-C...)
    const answersMap = {};
    if (keySection) {
      const pairs = keySection.split(',');
      pairs.forEach(p => {
        const [qNum, letter] = p.trim().split('-');
        if (qNum && letter) answersMap[qNum.trim()] = letter.trim().toUpperCase();
      });
    }

    // 3. Parse Question Blocks
    const blocks = content.split(/\n(?=\d+\.)/);
    const parsedQuestions = blocks.map((block, index) => {
      const lines = block.trim().split('\n');
      const questionText = lines[0].replace(/^\d+\.\s*/, '');
      const options = lines.slice(1).filter(l => /^[A-D]\)/i.test(l.trim()));
      
      const qId = (index + 1).toString();
      return {
        id: qId,
        question: questionText,
        options: options.map(opt => opt.trim()),
        correctLetter: answersMap[qId]
      };
    }).filter(q => q.options.length > 0);

    setQuizData(parsedQuestions);
    setShowResults(false);
    setUserAnswers({});
  };

  const calculateScore = () => {
    let score = 0;
    quizData.forEach(q => {
      const selectedLetter = userAnswers[q.id]?.charAt(0).toUpperCase();
      if (selectedLetter === q.correctLetter) score++;
    });
    return score;
  };

  // Modern UI Styles
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e1e4e8',
    maxWidth: '800px',
    margin: '20px auto',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <div style={glassStyle}>
        <h2 style={{ color: '#1a73e8', marginBottom: '20px' }}>SST MCQ Auto-Generator</h2>
        
        {quizData.length === 0 ? (
          <div>
            <textarea
              style={{ width: '100%', height: '300px', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
              placeholder="Paste your 100 MCQs and Answer Key here..."
              value={quizInput}
              onChange={(e) => setQuizInput(e.target.value)}
            />
            <button 
              onClick={generateQuiz}
              style={{ marginTop: '15px', padding: '12px 24px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Build Interactive Quiz
            </button>
          </div>
        ) : (
          <div>
            {showResults && (
              <div style={{ backgroundColor: '#e8f0fe', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
                Total Score: {calculateScore()} / {quizData.length}
              </div>
            )}

            {quizData.map((q) => (
              <div key={q.id} style={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{q.id}. {q.question}</p>
                {q.options.map((opt, i) => {
                  const isSelected = userAnswers[q.id] === opt;
                  const isCorrect = opt.charAt(0).toUpperCase() === q.correctLetter;
                  
                  let bgColor = isSelected ? '#e8f0fe' : 'transparent';
                  if (showResults && isCorrect) bgColor = '#d4edda';
                  if (showResults && isSelected && !isCorrect) bgColor = '#f8d7da';

                  return (
                    <div 
                      key={i} 
                      onClick={() => !showResults && setUserAnswers({...userAnswers, [q.id]: opt})}
                      style={{ padding: '10px', margin: '5px 0', borderRadius: '5px', cursor: 'pointer', border: '1px solid #ddd', backgroundColor: bgColor }}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
            ))}

            {!showResults ? (
              <button 
                onClick={() => setShowResults(true)}
                style={{ width: '100%', padding: '15px', backgroundColor: '#34a853', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem' }}
              >
                Submit and Check Answers
              </button>
            ) : (
              <button onClick={() => setQuizData([])} style={{ width: '100%', padding: '15px', backgroundColor: '#70757a', color: '#fff', border: 'none', borderRadius: '8px' }}>
                Start New Quiz
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;