import {GoogleGenAI}from '@google/genai';

const ai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_CLOUD_API_KEY!,
    // organizationId:process.env.GOOGLE_ORGANIZATION_ID!
})
export default ai;