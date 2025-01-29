import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const languages = ["python", "java", "c"];

const predefinedQuestions = [
  {
    question: "Add two numbers",
    language: "python",
    testCases: [
      { input: "3 5", expectedOutput: "8" },
      { input: "10 20", expectedOutput: "30" }
    ]
  }
];

export default function CodeCompiler() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(predefinedQuestions[0]);
  const [output, setOutput] = useState("");
  const [passedCases, setPassedCases] = useState(0);

  const handleRun = async () => {
    let totalPassed = 0;
    for (let testCase of selectedQuestion.testCases) {
      try {
        const response = await axios.post("https://api.jdoodle.com/v1/execute", {
          clientId: "your-client-id",
          clientSecret: "your-client-secret",
          script: code,
          language: language,
          versionIndex: "0",
          stdin: testCase.input,
        });

        if (response.data.output.trim() === testCase.expectedOutput) {
          totalPassed++;
        }
      } catch (error) {
        setOutput("Error executing code");
        return;
      }
    }
    setPassedCases(totalPassed);
    setOutput(`Test Cases Passed: ${totalPassed} / ${selectedQuestion.testCases.length}`);
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <button onClick={() => navigate("/")} className="mb-4 px-4 py-2 bg-gray-500 text-white rounded">
        Back to Home
      </button>
      <h1 className="text-xl font-bold mb-2">Online Code Compiler</h1>
      
      <select 
        className="border p-2 rounded mb-2"
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>{lang.toUpperCase()}</option>
        ))}
      </select>

      <h2 className="font-semibold mt-4">{selectedQuestion.question}</h2>

      <textarea
        rows="6"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border rounded p-2"
      ></textarea>

      <button onClick={handleRun} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Run Code
      </button>

      <div className="mt-4 p-3 border rounded bg-gray-100">
        <h2 className="font-semibold">Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
