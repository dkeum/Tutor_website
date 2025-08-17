import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import NavbarLoggedIn from '../components/NavbarLoggedIn';

const FinalExamPrep = ({ questions = [] }) => {
  const [answers, setAnswers] = useState({});

  const handleChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    console.log('User Answers:', answers);
    alert('Answers submitted! Check console for output.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLoggedIn />
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Final Exam Prep</h1>

        {questions.length === 0 && (
          <p className="text-center text-gray-500">No questions available yet.</p>
        )}

        {questions.map((q, index) => (
          <Card key={index} className="border-gray-200">
            <CardHeader>
              <h2 className="font-semibold text-lg">{`Q${index + 1}: ${q}`}</h2>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Type your answer..."
                value={answers[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </CardContent>
          </Card>
        ))}

        {questions.length > 0 && (
          <div className="flex justify-center mt-4">
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Submit Answers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Example questions as default prop
FinalExamPrep.defaultProps = {
  questions: [
    'What is the capital of France?',
    'Solve 5 + 7',
    'Explain the concept of polymorphism in OOP.'
  ]
};

export default FinalExamPrep;
