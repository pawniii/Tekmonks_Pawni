
const stopwords = new Set(['a', 'an', 'the', 'is', 'are', 'i', 'you', 'me', 'my', 'to', 'and']);

function cleanText(originalMessage) {
  if (!originalMessage) {
    return []; // Safety check
  }

  return originalMessage
    .toLowerCase() 
    .replace(/[^a-z0-9\s]/g, '') 
    .split(' ') 
    .filter(word => word.length > 0 && !stopwords.has(word)); 
}


module.exports = { cleanText };