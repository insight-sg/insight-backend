import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import config from 'config';

export const getFrontBackFromOpenAIService = async (text_chunk: []) => {
  const prompting =
    'You are an expert in extracting questions and answer from lecture notes PDF,  ignore miscellaneous text like irrelevant context subject to the lecture materials, names, email, phone numbers  subject module code, etc., which is not relevant to the text\'s subject\'s title, If you find the text redundant, please skip it and do not include in the flashcard,  please train on the text and help me create a flash card, Please make sure to your knowledge/trained data, that the Front value and Back value has similar context and they are directly representing one another. please make sure to return in a valid JSON format. Output format: { "FRONT":"", "BACK":""}';
  const prompt = text_chunk.join(' ');

  console.log('Prompt :', prompt);
  const message = [
    { role: 'system', content: prompting },
    { role: 'user', content: prompt },
  ];
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? '';
  const key = process.env.AZURE_OPENAI_KEY ?? '';
  const client = new OpenAIClient(endpoint, new AzureKeyCredential(key));
  const deployementId = 'insight-chat-v1';
  const result = await client.getChatCompletions(deployementId, message);

  console.log(
    '[getFrontBackFromOpenAIService] result.choices From OpenAI : ',
    result.choices,
  );
  if (result.choices[0].message?.content) {
    const jsonArray = result.choices[0].message.content
      .split('\n')
      .filter(Boolean) as any;

    // Parse each JSON string into an object

    const arrayOfObjects = jsonArray.map(JSON.parse);

    console.log(arrayOfObjects);

    return arrayOfObjects;
  }
  return null;
};

export const getQuestionsAndChoicesOpenAIService = async (text_chunk: []) => {
  const prompting =
    'You are an expert in extracting questions and answer from lecture notes PDF,  ignore miscellaneous text like irrelevant context subject to the lecture materials, names, email, phone numbers  subject module code, etc., which is not relevant to the text\'s subject\'s title, If you find the text redundant, please skip it and do not include in the quiz,  please train on the text and help me create a quiz with questions and question choices with 1 correct answer and populate the rest with incorrect answer, Please make sure to your knowledge/trained data, that the Questions and Questions Choices has similar context and they are directly representing one another. Output format: { "Question":"", "Choices":[ { Choice:"", Correct: true/false} ]  }, Assistant is an AI chatbot that helps users turn a natural language list into JSON format. After users input a list they want in JSON format, it will provide suggested list of attribute labels , please make sure to return in a valid JSON format.';
  const prompt = text_chunk.join(' ');

  console.log('Prompt :', prompt);
  const message = [
    { role: 'system', content: prompting },
    { role: 'user', content: prompt },
  ];
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? '';
  const key = process.env.AZURE_OPENAI_KEY ?? '';

  console.log('endpoint : ', endpoint);
  console.log('key : ', key);
  const client = new OpenAIClient(endpoint, new AzureKeyCredential(key));
  const deployementId = 'insight-chat-v1';
  const result = await client.getChatCompletions(deployementId, message);

  console.log(
    '[getQuestionsAndChoicesOpenAIService] result.choices From OpenAI : ',
    result.choices,
  );
  if (result.choices[0].message?.content) {
    // const fixedJsonArray = result.choices[0].message?.content
    //   .replace(/'/g, '"')
    //   .replace(/(\w+):/g, '"$1":');
    const jsonArray = result.choices[0].message.content
      .split('\n')
      .filter(Boolean) as any;

    // Parse each JSON string into an object

    const arrayOfObjects = jsonArray.map(JSON.parse);

    console.log(arrayOfObjects);

    return arrayOfObjects;
  }
  return null;
};
