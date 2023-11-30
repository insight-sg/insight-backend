import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import config from 'config';

export const getFrontBackFromOpenAIService = async (text_chunk: []) => {
  const prompting =
    "You are an expert in extracting questions and answer from lecture notes PDF,  ignore miscellanous text like unrelevant context subject to the lecture materials, names, email, phone numbers  subject module code, etc, which is not relevant to the text's subject's title, If you find the text redundant, please skip it and do not include in the flashcard,  please train on the text and help me create a flash card with the format : \nFront:\nBack:\nPlease make sure to your knowledge/trained data, that the Front value and Back value has similar context and they are directly representing one another.\nIn an array of json:";
  const prompt = [];
  prompt[0] = prompting + text_chunk.join(' ');

  console.log('Prompt :', prompt);
  const endpoint = config.get<string>('openai_endpoint');
  const key = config.get<string>('openai_key');
  const client = new OpenAIClient(endpoint, new AzureKeyCredential(key));
  const deployementId = 'gpt-35-turbo-instruct';
  const result = await client.getCompletions(deployementId, prompt);

  console.log('result From OpenAI : ', result);
  let i = 0;
  for (const choice of result.choices) {
    console.log(`choice ${i}: `, choice.text);
    i = i + 1;
  }

  return result;
};
