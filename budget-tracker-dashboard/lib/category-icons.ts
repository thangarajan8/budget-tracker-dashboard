const CATEGORY_EMOJI: Record<string, string> = {
  "food": "🍔",
  "groceries": "🛒",
  "transport": "🚕",
  "fuel": "⛽",
  "shopping": "🛍️",
  "bills & utilities": "💡",
  "bills": "💡",
  "utilities": "💡",
  "rent": "🏠",
  "healthcare": "🏥",
  "entertainment": "🎬",
  "education": "📚",
  "travel": "✈️",
  "subscriptions": "📺",
  "personal care": "💆",
  "family": "👨‍👩‍👧‍👦",
  "insurance": "🛡️",
  "investment": "📈",
  "cash withdrawal": "🏧",
  "other": "📦",
};

const MERCHANT_EMOJI: Record<string, string> = {
  "mcdonald's": "🍔",
  "mcdonalds": "🍔",
  "starbucks": "☕",
  "zomato": "🍽️",
  "swiggy": "🛵",
  "amazon": "📦",
  "netflix": "📺",
  "uber": "🚕",
  "google": "🔍",
  "apple": "🍎",
  "flipkart": "🛍️",
};

const TYPE_EMOJI: Record<string, string> = {
  "income": "💰",
  "expense": "💸",
  "transfer": "🔄",
};

export function getCategoryEmoji(category: string | null | undefined): string {
  if (!category) return "📦";
  return CATEGORY_EMOJI[category.toLowerCase()] ?? "📦";
}

export function getMerchantEmoji(
  merchant: string | null | undefined,
  category: string | null | undefined
): string {
  if (merchant) {
    const key = merchant.toLowerCase();
    for (const [name, emoji] of Object.entries(MERCHANT_EMOJI)) {
      if (key.includes(name)) return emoji;
    }
  }
  return getCategoryEmoji(category);
}

export function getTypeEmoji(transactionType: string): string {
  return TYPE_EMOJI[transactionType.toLowerCase()] ?? "💸";
}
