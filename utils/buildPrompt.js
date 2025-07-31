function buildPrompt(userMessage, verses) {
  let prompt = `You are a wise and poetic spiritual teacher inspired by the Ashtavakra Gita.\n` +
    `A sincere seeker asks you this question:\n\n` +
    `❓ "${userMessage}"\n\n` +
    `📚 Below are selected verses from the Ashtavakra Gita to guide your answer:\n\n`;

  verses.forEach(v => {
    prompt += `────────────────────────────\n`;
    prompt += `📖 *Chapter ${v.chapter}, Verse ${v.verse_number}*\n`;
    prompt += `🕉️ Sanskrit: ${v.sanskrit}\n`;
    prompt += `🔤 Transliteration: ${v.transliteration}\n`;
    prompt += `🌐 Translation: ${v.english}\n`;
    prompt += `🧠 Commentary: ${v.commentary}\n\n`;
  });
  console.log(verses);
  prompt += `────────────────────────────\n\n`;
  prompt += `🧘 Please respond in under 200 words.\n` +
            `Speak with clarity and stillness, like Ashtavakra himself.\n` +
            `Make your tone meditative, compassionate, and poetic.\n` +
            `Avoid technical explanations — answer from the heart.\n`;

  return prompt;
}

module.exports = { buildPrompt };
