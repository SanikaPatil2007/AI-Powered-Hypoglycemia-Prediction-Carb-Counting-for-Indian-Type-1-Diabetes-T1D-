import {
  INDIAN_FOODS_DATASET,
  FOOD_CATEGORIES
} from '../data/indianFoods';

const API_URL = 'http://127.0.0.1:5000';


// ============================================================
// GET FOOD CATEGORIES
// ============================================================

export async function getCategories() {
  return FOOD_CATEGORIES;
}


// ============================================================
// SEARCH FOODS
// Uses local Indian food dataset
// ============================================================

export async function searchFoods(
  query = '',
  category = 'All'
) {
  const cleanQuery = query.toLowerCase().trim();

  return INDIAN_FOODS_DATASET
    .filter((food) => {

      const matchesCategory =
        category === 'All' ||
        food.category === category;

      const matchesQuery =
        cleanQuery === '' ||
        food.name
          .toLowerCase()
          .includes(cleanQuery) ||
        food.category
          .toLowerCase()
          .includes(cleanQuery);

      return (
        matchesCategory &&
        matchesQuery
      );
    })
    .map((food) => ({
      ...food,
      id: food.id || food._id
    }));
}


// ============================================================
// CALCULATE MEAL CARBS
// ============================================================

export function calculateMealCarbs(
  mealItems = []
) {
  const totalCarbs =
    mealItems.reduce(
      (sum, item) => {

        const itemTotal =
          (Number(item.carbsGrams) || 0) *
          (Number(item.quantity) || 1);

        return sum + itemTotal;
      },
      0
    );

  const totalCalories =
    mealItems.reduce(
      (sum, item) => {

        const itemTotal =
          (Number(item.calories) || 0) *
          (Number(item.quantity) || 1);

        return sum + itemTotal;
      },
      0
    );

  return {
    totalCarbs:
      Math.round(
        totalCarbs * 10
      ) / 10,

    totalCalories:
      Math.round(
        totalCalories
      ),

    itemCount:
      mealItems.length
  };
}


// ============================================================
// SAVE MEAL TO MONGODB
// ============================================================

export async function saveMealLog(
  mealItems
) {
  try {

    const calculated =
      calculateMealCarbs(
        mealItems
      );

    const mealData = {

      items: mealItems,

      totalCarbs:
        calculated.totalCarbs,

      totalCalories:
        calculated.totalCalories,

      itemCount:
        calculated.itemCount
    };

    const response =
      await fetch(
        `${API_URL}/meals`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              mealData
            )
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Failed to save meal'
      );
    }

    return {
      success: true,

      logId:
        data.id,

      message:
        data.message ||
        'Meal saved successfully',

      ...data
    };

  } catch (error) {

    console.error(
      'Save Meal API Error:',
      error
    );

    throw error;
  }
}