const ResultSummary = ({ answers }) => (
  <div>
    {answers.map((a, i) => (
      <div key={i}>
        <p><b>Q:</b> {a.question}</p>
        <p><b>Your Answer:</b> {a.userAnswer}</p>
        <p>{a.feedback}</p>
        <hr />
      </div>
    ))}
  </div>
);

export default ResultSummary;
