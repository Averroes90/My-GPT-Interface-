// useTokenCounter.js
import { computed } from 'vue';

export function useTokenCounter(textRef) {
	const promptContentTokenCount = computed(() => {
		// Matches words and individual punctuation characters
		const simpleTokenizerRegex = /(\w+|[^\w\s])/g;
		const tokens = textRef.value.match(simpleTokenizerRegex);
		const rawTokenCount = tokens ? tokens.length : 0;

		// A fixed addition to account for the user tags that you mentioned are 10 tokens
		const additionalUserTagsTokenCount = 10;

		// The total token count is the sum of the raw tokens plus any additional fixed tokens
		return rawTokenCount + additionalUserTagsTokenCount;
	});

	return { promptContentTokenCount };
}
