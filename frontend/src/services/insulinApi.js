const API_URL = 'http://127.0.0.1:5000';


// ============================================================
// SAVE INSULIN RECORD
// ============================================================

export async function saveInsulinRecord(record) {
  try {
    const response = await fetch(`${API_URL}/insulin`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        units: Number(record.units),
        type: record.type,
        context: record.context || '',
        note: record.note || '',
        timestamp: record.timestamp || new Date().toISOString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to save insulin record'
      );
    }

    return data;

  } catch (error) {
    console.error(
      'Save Insulin API Error:',
      error
    );

    throw error;
  }
}


// ============================================================
// GET ALL INSULIN RECORDS
// ============================================================

export async function getInsulinRecords() {
  try {
    const response = await fetch(`${API_URL}/insulin`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to fetch insulin records'
      );
    }

    return data;

  } catch (error) {
    console.error(
      'Get Insulin Records API Error:',
      error
    );

    throw error;
  }
}


// ============================================================
// GET LATEST INSULIN RECORD
// ============================================================

export async function getLatestInsulin() {
  try {
    const response =
      await fetch(`${API_URL}/insulin/latest`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Failed to fetch latest insulin record'
      );
    }

    return data;

  } catch (error) {
    console.error(
      'Get Latest Insulin API Error:',
      error
    );

    throw error;
  }
}


// ============================================================
// DELETE INSULIN RECORD
// ============================================================

export async function deleteInsulinRecord(id) {
  try {
    const response = await fetch(
      `${API_URL}/insulin/${id}`,
      {
        method: 'DELETE',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Failed to delete insulin record'
      );
    }

    return data;

  } catch (error) {
    console.error(
      'Delete Insulin API Error:',
      error
    );

    throw error;
  }
}