export const fetchQuestions = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await response.json();
      const questionsList = data.slice(0, 10).map((item) => {
        const options = item.body
          .split("\n")
          .slice(0, 4)
          .map((option, index) => ({
            id: String.fromCharCode(65 + index), // A, B, C, D şeklinde id'ler
            text: option.trim(),
          }));
        const correctOptionIndex = Math.floor(Math.random() * options.length);
        return {
          id: item.id,
          question: item.title,
          options: options,
          answer: options[correctOptionIndex].text,
        };
      });
      return questionsList;
    } catch (error) {
      console.error("Error fetching questions: ", error);
      throw error;
    }
  };
  