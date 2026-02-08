import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "lesson-plan") {
      systemPrompt = `You are an expert inclusive education specialist. Create adaptive lesson plans for neurodiverse learners. Always consider:
- Multiple learning modalities (visual, auditory, kinesthetic)
- Scaffolded instructions with clear steps
- Sensory-friendly approaches
- Built-in breaks and transitions
- Differentiated activities for various skill levels
Format your response in clear sections: Objectives, Materials, Activities (with timing), Accommodations, Assessment.`;
      userPrompt = context;
    } else if (type === "teaching-suggestion") {
      systemPrompt = `You are an AI teaching assistant specializing in neurodiverse education. Provide brief, actionable real-time suggestions for educators. Keep responses under 3 sentences. Focus on practical strategies like:
- Breaking tasks into smaller steps
- Using visual supports
- Providing movement breaks
- Adjusting sensory input
- Offering choice-based activities`;
      userPrompt = context;
    } else if (type === "resource-recommendation") {
      systemPrompt = `You are an inclusive education resource curator. Recommend specific strategies, activities, and approaches for teaching neurodiverse learners. Include practical tips that can be implemented immediately. Format as a numbered list of 5 actionable recommendations.`;
      userPrompt = context;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-lesson-planner error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
