const API_URL = 'http://127.0.0.1:5000';


// ============================================================
// SAVE GLUCOSE READING
// ============================================================

export async function saveGlucoseReading(reading) {
  try {
    const response = await fetch(`${API_URL}/glucose`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        value: Number(reading.value),
        unit: reading.unit || 'mg/dL',
        context: reading.context || 'Other',
        status: reading.status || 'In Range',
        note: reading.note || '',
        timestamp:
          reading.timestamp ||
          new Date().toISOString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Failed to save glucose reading'
      );
    }

    return data;

  } catch (error) {
    console.error(
      'Save Glucose API Error:',
      error
    );

    throw error;
  }
}


// ============================================================
// GET ALL GLUCOSE READINGS
// ============================================================

export async function getGlucoseReadings() {
  try {
    const response =
      await fetch(`${API_URL}/glucose`);

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Failed to fetch glucose readings'
      );
    }

    return data;

  } catch (error) {
    console.error(
      'Get Glucose API Error:',
      error
    );

    throw error;
  }
}


// ============================================================
// GET LATEST GLUCOSE
// ============================================================

export async function getLatestGlucose() {
  try {
    const response =
      await fetch(`${API_URL}/glucose/latest`);

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Failed to fetch latest glucose'
      );
    }

    return data;

  } catch (error) {
    console.error(
      'Get Latest Glucose API Error:',
      error
    );

    throw error;
  }
}


// ============================================================
// DELETE GLUCOSE
// ============================================================

export async function deleteGlucoseReading(id) {
  try {
    const response =
      await fetch(`${API_URL}/glucose/${id}`, {
        method: 'DELETE',
      });

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Failed to delete glucose reading'
      );
    }

    return data;

  } catch (error) {
    console.error(
      'Delete Glucose API Error:',
      error
    );

    throw error;
  }
}