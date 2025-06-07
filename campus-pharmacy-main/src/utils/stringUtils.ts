/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // substitution
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity score between two strings (0 to 1)
 */
export function stringSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1; // Both strings are empty
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLength;
}

/**
 * Find the best matching location based on string similarity
 */
export function findBestMatch(query: string, candidates: string[]): { text: string; score: number }[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  return candidates
    .map(candidate => ({
      text: candidate,
      score: Math.max(
        // Check full string similarity
        stringSimilarity(normalizedQuery, candidate.toLowerCase()),
        // Check if query is contained within candidate
        candidate.toLowerCase().includes(normalizedQuery) ? 0.9 : 0,
        // Check if candidate contains query
        normalizedQuery.includes(candidate.toLowerCase()) ? 0.8 : 0
      )
    }))
    .sort((a, b) => b.score - a.score);
}
