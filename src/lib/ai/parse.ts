import { z } from "zod";
export function parseJson<T>(raw:string, schema:z.ZodType<T>) { const cleaned=raw.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/```json|```/g, "").trim(); const start=cleaned.indexOf("{"); const end=cleaned.lastIndexOf("}"); const candidate=start >= 0 && end > start ? cleaned.slice(start,end+1) : cleaned; return schema.parse(JSON.parse(candidate)); }
