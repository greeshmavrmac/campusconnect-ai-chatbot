/**
 * Helper to ensure ALL AI responses are extremely short, professional,
 * student-friendly, and easy to read on mobile as requested.
 */
export function formatAiResponse(rawText: string, category: string, isTel: boolean): string {
  if (!rawText) return "";

  // Split raw text lines and clean
  const lines = rawText.split("\n").map(l => l.trim()).filter(l => l !== "");

  // Determine standard bot base name
  let botBase = category || "CampusConnect";
  if (botBase === "Placements") botBase = "Placement";
  if (botBase === "Admissions") botBase = "Admission";
  if (botBase === "Examinations") botBase = "Examination";

  let title = isTel ? `${botBase} AI సమాచారం` : `${botBase} AI Details`;

  // Look for a bold title in the first 3 lines
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    const line = lines[i];
    if (line.startsWith("**") && line.endsWith("**") && line.length > 5 && line.length < 80) {
      title = line.replace(/\*\*/g, "");
      break;
    }
  }

  // Gather bullet points
  const points: string[] = [];
  lines.forEach(l => {
    const cleanLine = l.replace(/\*\*/g, "").trim();
    if (!cleanLine) return;

    // Skip preamble or greeting lines
    if (cleanLine.toLowerCase().includes("hi!") || cleanLine.toLowerCase().includes("hello!") || cleanLine.includes("నమస్కారం!")) {
      return;
    }

    // Is it list-styled already?
    const listMatch = cleanLine.match(/^(\d+[\.\)\-:]\s*|[-•*▪■]\s*)(.*)/);
    if (listMatch) {
      const bulletText = listMatch[2].trim();
      if (bulletText) points.push(bulletText);
    } else if (cleanLine.includes(":") && cleanLine.length > 15 && cleanLine.length < 130) {
      // key-value style like "Annual Fee: INR 85,000"
      points.push(cleanLine);
    } else if (cleanLine.length > 20 && cleanLine.length < 120 && !cleanLine.endsWith("?") && !cleanLine.toLowerCase().includes("support") && !cleanLine.includes("సంప్రదించండి")) {
      points.push(cleanLine);
    }
  });

  // Settle on unique items, limit strictly to 3 points as requested
  const uniquePoints = Array.from(new Set(points)).filter(p => p.length > 5).slice(0, 3);

  // If list is too short, populate with backup lines from raw text
  if (uniquePoints.length === 0) {
    const backups = lines
      .map(l => l.replace(/\*\*/g, "").trim())
      .filter(l => l.length > 15 && l.length < 140 && !l.includes("?") && !l.toLowerCase().includes("support") && !l.includes("సంప్రదించండి"));
    uniquePoints.push(...backups.slice(0, 3));
  }

  // Ensure we have at least fallback bullets
  if (uniquePoints.length === 0) {
    uniquePoints.push(
      isTel 
        ? "మరింత సమాచారం లేదా దరఖాస్తు ఫారమ్ కొరకు మా హెల్ప్‌డెస్క్‌ని సంప్రదించండి." 
        : "Verify latest schedules directly inside the corresponding campus portal."
    );
  }

  const finalBullets = uniquePoints.map(p => `• ${p}`);

  const noteHeader = isTel ? "అధికారిక సూచన:" : "Official Note:";
  const noteBody = isTel
    ? "సంబంధిత ప్రాథమిక సమాచారం విద్యాపాలక మండలి ద్వారా క్రమబద్ధంగా మార్పులకు లోనవుతుంది."
    : "Relevant information is subject to periodic updates by the college administration.";

  return `**${title}**\n\n${finalBullets.join("\n\n")}\n\n**${noteHeader}**\n${noteBody}`;
}
