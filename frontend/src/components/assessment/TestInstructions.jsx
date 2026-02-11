const TestInstructions = ({ onStart }) => (
  <div>
    <h2>Skill Assessment Instructions</h2>
    <ul>
      <li>Do not refresh the page</li>
      <li>Each question has only one correct answer</li>
      <li>Timer will auto-submit</li>
    </ul>

    <button onClick={onStart}>Start Test</button>
  </div>
);

export default TestInstructions;
