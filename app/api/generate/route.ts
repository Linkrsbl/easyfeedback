import { NextResponse } from "next/server";
import OpenAI from "openai";
import { systemPrompt, buildUserPrompt } from "@/lib/prompts/feedback";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { image, feedback_raw, mode } = await req.json();

    const userPrompt = buildUserPrompt(feedback_raw, mode);

    // Responses API input structure
    const input: any[] = [];

    // 시스템 프롬프트
    input.push({
      role: "system",
      content: [
        {
          type: "input_text",
          text: systemPrompt,
        },
      ],
    });

    // 유저 입력 content 배열
    const userContent: any[] = [];

    if (image) {
      userContent.push({
        type: "input_image",
        image_url: image,
      });
    }

    userContent.push({
      type: "input_text",
      text: userPrompt,
    });

    input.push({
      role: "user",
      content: userContent,
    });

    // Responses API 호출
    const response = await client.responses.create({
      model: "gpt-5-mini",
      input,
      max_output_tokens: 3000,
    });

    // 표준 출력 필드
    const result = response.output_text || "";

    return NextResponse.json(
      {
        result,
        usage: response.usage,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      {
        error: "LLM 호출 실패",
        detail: err.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
