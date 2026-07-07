const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Detect labels in an image using Google Vision API
 * @param {string} imageUrl - Public URL of the image
 * @param {number} maxResults - Max labels to return
 */
export async function detectLabels(imageUrl, maxResults = 20) {
  if (!process.env.GOOGLE_VISION_API_KEY) {
    throw new Error('GOOGLE_VISION_API_KEY is not set');
  }

  const response = await fetch(
    `${VISION_API_URL}?key=${process.env.GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { source: { imageUri: imageUrl } },
          features: [
            { type: 'LABEL_DETECTION', maxResults },
            { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
          ],
        }],
      }),
    }
  );

  if (!response.ok) throw new Error('Vision API request failed');

  const data = await response.json();
  const labels = data.responses[0]?.labelAnnotations || [];
  return labels.map(l => l.description);
}
