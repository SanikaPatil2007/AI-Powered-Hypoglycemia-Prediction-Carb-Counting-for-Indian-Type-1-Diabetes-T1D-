const API_URL = 'http://127.0.0.1:5000';

export async function predictHypoglycemia(inputData) {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Prediction request failed');
    }

    return data;
  } catch (error) {
    console.error('Prediction API Error:', error);
    throw error;
  }
}