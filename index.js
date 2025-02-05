const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const readlineSync = require("readline-sync");
const Todo = require("./schema/todo.schema");
const connectToDb = require("./schema/connectToDb");

const getAllTodo = async () => {
  const todos = await Todo.find();
  return todos;
};

const createTodo = async (todo) => {
  const newTodo = new Todo({
    todo: todo,
  });
  await newTodo.save();
  return newTodo;
};

const deleteTodo = async (id) => {
  const todo = await Todo.findByIdAndDelete(id);
  return todo?._id;
};

const searchTodo = async (todo) => {
  const todos = await Todo.find({ todo: { $regex: todo, $options: "i" } });
  return todos;
};

const actions = {
  getAllTodo,
  createTodo,
  deleteTodo,
  searchTodo,
};

const SYSTEM_PROMPT = `

You are an AI To-Do List Assistant with the responsibility to manage tasks effectively. Your workflow involves the following steps: START, PLAN, ACTION, OBSERVATION, and OUTPUT. Each step must follow a structured sequence.

Take the action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on START prompt and observations



TODO Schema :
  todo: String,
  createdAt : Date Time,
  updatedAt : Date Time

Available tools:
 - getAllTodo() : this will return all the todos 
 - createTodo(todo : string) : this will create a todo and store it in DB and return the id of the todo 
 - deleteTodo (id : string) : delete the todo by id
 - searchTodo(query :string) : search for all todos related to query  


 ### Workflow Description:

1. **START**: Begin by receiving user input.
    - Example:  
      '{ "type": "user", "user": "Add a task for shopping groceries." }'

2. **PLAN**: After receiving the input, create a clear and actionable plan based on the user's request.  
    - Example:  
      '{ "type": "plan", "plan": "I will use createTodo to create a new Todo in the database." }'

3. **ACTION**: After planning, execute the required action using the appropriate tool and specify the input. This is a functional JSON object.  
    - Example:  
      '{ "type": "action", "function": "createTodo", "input": "Shopping for groceries." }'

4. **OBSERVATION**: Once the action is executed, wait for the system to provide an observation or result. Use this to validate if the action was successful.  
    - Example:  
      '{ "type": "observation", "observation": "2" }'

5. **OUTPUT**: Based on the observation, generate a clear and concise user-friendly response in JSON format. Ensure that the user understands whether their request was successful or if there were any issues.  
    - Example:  
      '{ "type": "output", "output": "Your task has been added successfully with ID 2." }'



### Example Workflow
"""json
START

{ "type": "user", "user": "Add a task for shopping groceries." }
{ "type": "plan", "plan": "I will try to get more context on what user needs to shop." }
{ "type": "output", "output": "Can you tell me what all items you want to shop for?" }
{ "type": "user", "user": "I want to shop for milk, kurkure, lays and choco." }
{ "type": "plan", "plan": "I will use createTodo to create a new Todo in DB." }
{ "type": "action", "function": "createTodo", "input": "Shopping for milk, kurkure, lays and choco." }
{ "type": "observation", "observation": "2" }
{ "type": "output", "output": "You todo has been added successfully." }
 
"""


### Important Notes:
- if the user greet you must greet back
- You **MUST** always progress through the steps in the above order: PLAN → ACTION → OBSERVATION → OUTPUT.
- if you see that previous messages have plan then head over to function and generate a response of type "action" with suitable "function" and perfect "input parameters", see which function tool should be used for the desired task
- then response back the function json and 
- Once a PLAN is created, proceed directly to the corresponding ACTION.
- If an ACTION is executed, always wait for the OBSERVATION before generating the OUTPUT.
- You must use the **JSON format strictly** for all responses.
`;

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

const main = async () => {
  await connectToDb();

  while (true) {
    const userInput = readlineSync.question(">>");
    const userMessage = {
      type: "user",
      input: userInput,
    };

    messages.push({ role: "user", content: JSON.stringify(userMessage) });

    while (true) {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        response_format: { type: "json_object" },
      });

      const result = completion.choices[0].message.content;
      if (!result) throw new Error("Something went wrong !");

      const action = JSON.parse(result);
      console.log(action);

      if (action.type == "output") {
        console.log(action.output);
        break;
      } else if (action.type === "action") {
        const fn = actions[action.function];

        const observation = await fn(action.input);
        const observationMessage = {
          type: "observation",
          observation,
        };

        messages.push({
          role: "developer",
          content: JSON.stringify(observationMessage),
        });
      }
    }
  }
};

main();
