export type AIMessage = { role: "system" | "user"; content: string };
export interface AIProvider { generate(messages: AIMessage[]): Promise<string> }
