import OptionItem from "./OptionItem";

const QuestionCard = ({ question, selected, onSelect }) => {
  return (
    <div>
      <h3>{question.question}</h3>

      {question.options.map((opt, index) => (
        <OptionItem
          key={index}
          text={opt}
          isSelected={selected === index}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
};

export default QuestionCard;
