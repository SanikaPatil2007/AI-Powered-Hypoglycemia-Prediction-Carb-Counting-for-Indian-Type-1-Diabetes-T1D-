import React, { useState, useEffect } from 'react';
import { searchFoods, getCategories, calculateMealCarbs, saveMealLog } from '../services/foodApi';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Utensils, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Info,
  RotateCcw,
  AlertCircle,
  Calculator
} from 'lucide-react';

/**
 * Indian Meal & Carb Counter Page Component
 * Fully functional frontend prototype for Indian T1D carbohydrate estimation.
 */
export default function CarbCounter() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Active selected food focus item for portion preview tuner
  const [selectedFood, setSelectedFood] = useState(null);
  const [portionQty, setPortionQty] = useState(1);

  // Today's Meal Items array: [{ id, name, carbsGrams, quantity, servingSize, calories }]
  const [mealItems, setMealItems] = useState([
    { id: 'f01', name: 'Roti / Chapati / Phulka (Whole Wheat)', category: 'Breads & Roti', servingSize: '1 medium (30g raw wheat)', carbsGrams: 15, quantity: 2, calories: 80 },
    { id: 'f19', name: 'Dal Tadka (Yellow Toor Dal)', category: 'Dals & Curries', servingSize: '1 katori/bowl (150g)', carbsGrams: 18, quantity: 1, calories: 140 }
  ]);

  const [notification, setNotification] = useState(null);

  // Load dataset & categories
  useEffect(() => {
    let isCancelled = false;
    async function loadData() {
      setLoading(true);
      const [cats, foodList] = await Promise.all([
        getCategories(),
        searchFoods(searchQuery, selectedCategory)
      ]);
      if (!isCancelled) {
        setCategories(cats);
        setFoods(foodList);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isCancelled = true;
    };
  }, [searchQuery, selectedCategory]);

  // Calculate live meal summary totals
  const mealSummary = calculateMealCarbs(mealItems);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Add food item to meal list with custom quantity
  const handleAddFoodToMeal = (food, qty = 1) => {
    const validQty = Math.max(0.5, Number(qty) || 1);
    setMealItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === food.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity = Math.round((updated[existingIndex].quantity + validQty) * 10) / 10;
        return updated;
      } else {
        return [...prevItems, { ...food, quantity: validQty }];
      }
    });
    showToast(`Added ${validQty}x ${food.name} to meal`);
  };

  // Update item quantity directly in the meal list
  const handleUpdateMealQuantity = (foodId, newQty) => {
    if (newQty <= 0) {
      handleRemoveMealItem(foodId);
      return;
    }
    const roundedQty = Math.round(newQty * 10) / 10;
    setMealItems((prevItems) =>
      prevItems.map((item) => (item.id === foodId ? { ...item, quantity: roundedQty } : item))
    );
  };

  // Remove individual item from meal list
  const handleRemoveMealItem = (foodId) => {
    setMealItems((prevItems) => prevItems.filter((item) => item.id !== foodId));
    showToast('Item removed from meal', 'info');
  };

  // Clear / Reset entire meal list
  const handleClearMeal = () => {
    if (mealItems.length === 0) return;
    setMealItems([]);
    showToast('Meal list cleared', 'info');
  };

  // Log meal simulation
  const handleLogMeal = async () => {
    if (mealItems.length === 0) return;
    const res = await saveMealLog(mealItems);
    if (res.success) {
      showToast(`Meal logged! Total: ${mealSummary.totalCarbs}g carbs recorded.`);
    }
  };

  return (
    <div className="carb-counter-page">
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`toast-notification ${notification.type}`}>
          <CheckCircle2 size={18} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header title */}
      <div className="page-header-row" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 className="page-header-title">Indian Meal & Carb Counter</h2>
          <p className="page-header-subtitle">
            Carbohydrate estimations tailored for traditional Indian rottis, rice, dals, snacks & sweets.
          </p>
        </div>
      </div>

      {/* Two-Column Responsive Layout */}
      <div className="carb-counter-grid">
        {/* LEFT COLUMN: Search & Indian Food Catalog */}
        <div className="food-catalog-container">
          {/* Search Box */}
          <div className="search-box-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="food-search-input"
              placeholder="Search Indian foods (Roti, Chapati, Rice, Dal, Poha, Upma, Idli, Dosa, Sabudana Khichdi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="categories-pill-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Subheader */}
          <div className="food-results-header">
            <span>Showing <strong>{foods.length}</strong> Indian Foods</span>
            {selectedCategory !== 'All' && (
              <span className="active-filter-badge">Filter: {selectedCategory}</span>
            )}
          </div>

          {/* Selected Food Detail Focus Box (If user selected a food card to tune portion) */}
          {selectedFood && (
            <div className="selected-food-tuner-card">
              <div className="tuner-header">
                <div>
                  <span className="tuner-tag">Selected Food Details</span>
                  <h4 className="tuner-title">{selectedFood.name}</h4>
                  <div className="tuner-sub">{selectedFood.servingSize} • {selectedFood.carbsGrams}g carbs per serving</div>
                </div>
                <button className="tuner-close-btn" onClick={() => setSelectedFood(null)}>✕</button>
              </div>

              <div className="tuner-body">
                <div className="tuner-qty-col">
                  <label className="tuner-label">Portion Quantity</label>
                  <div className="stepper-wrapper large">
                    <button
                      className="stepper-btn"
                      onClick={() => setPortionQty((q) => Math.max(0.5, Math.round((q - 0.5) * 10) / 10))}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      className="portion-number-input"
                      value={portionQty}
                      onChange={(e) => setPortionQty(Math.max(0.1, Number(e.target.value) || 1))}
                    />
                    <button
                      className="stepper-btn"
                      onClick={() => setPortionQty((q) => Math.round((q + 0.5) * 10) / 10)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="tuner-calc-col">
                  <div className="tuner-calc-label">
                    <Calculator size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Calculated Carbohydrates
                  </div>
                  <div className="tuner-calc-val">
                    {Math.round(selectedFood.carbsGrams * portionQty * 10) / 10} <span className="tuner-unit">grams</span>
                  </div>
                  <div className="tuner-formula">
                    ({selectedFood.carbsGrams}g × {portionQty} portion)
                  </div>
                </div>

                <button
                  className="btn-add-to-meal-lg"
                  onClick={() => {
                    handleAddFoodToMeal(selectedFood, portionQty);
                    setSelectedFood(null);
                    setPortionQty(1);
                  }}
                >
                  <Plus size={16} />
                  <span>Add {portionQty}x to Meal</span>
                </button>
              </div>
            </div>
          )}

          {/* Food Cards List */}
          {loading ? (
            <div className="loading-state">Loading Indian food catalog...</div>
          ) : foods.length === 0 ? (
            <div className="no-results-card">
              <Utensils size={36} color="var(--text-light)" />
              <h4>No Indian foods found matching "{searchQuery}"</h4>
              <p>Try searching for Chapati, Rice, Dal, Dosa, Poha, Upma or select "All".</p>
            </div>
          ) : (
            <div className="food-items-list">
              {foods.map((food) => {
                const inMeal = mealItems.find((item) => item.id === food.id);
                return (
                  <div 
                    key={food.id} 
                    className={`food-item-card ${selectedFood?.id === food.id ? 'focused' : ''}`}
                    onClick={() => {
                      setSelectedFood(food);
                      setPortionQty(1);
                    }}
                  >
                    <div className="food-info-col">
                      <div className="food-name">{food.name}</div>
                      <div className="food-meta-row">
                        <span className="food-cat-tag">{food.category}</span>
                        <span className="food-portion">{food.servingSize}</span>
                      </div>
                    </div>

                    <div className="food-action-col" onClick={(e) => e.stopPropagation()}>
                      <div className="carb-badge">
                        <span className="carb-val">{food.carbsGrams}g</span>
                        <span className="carb-lbl">per serving</span>
                      </div>

                      <button
                        className={`add-food-btn ${inMeal ? 'in-meal' : ''}`}
                        onClick={() => handleAddFoodToMeal(food, 1)}
                        title="Add 1 serving directly to current meal"
                      >
                        <Plus size={16} />
                        <span>{inMeal ? `Add (+${inMeal.quantity})` : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Today's Meal List & Daily Total */}
        <div className="meal-builder-container">
          <div className="meal-card-sticky">
            <div className="meal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Utensils size={20} className="header-teal-icon" />
                <h3 className="meal-title">Today's Meal List</h3>
              </div>
              <span className="meal-item-count">{mealSummary.itemCount} items</span>
            </div>

            {/* Daily Total Live Banner */}
            <div className="carb-total-banner">
              <div className="total-label">Daily Total Carbohydrates</div>
              <div className="total-value-row">
                <span className="total-number">{mealSummary.totalCarbs}</span>
                <span className="total-unit">grams</span>
              </div>

              <div className="total-submetrics">
                <span className="submetric">
                  <Flame size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  ~{mealSummary.totalCalories} total kcal
                </span>
                <span className="submetric-dot">•</span>
                <span className="submetric">Daily Logged Total</span>
              </div>
            </div>

            {/* Meal Items List */}
            {mealItems.length === 0 ? (
              <div className="empty-meal-state">
                <Sparkles size={32} color="var(--teal-500)" style={{ margin: '0 auto 0.75rem auto' }} />
                <p className="empty-meal-title">Your meal list is currently empty</p>
                <p className="empty-meal-desc">
                  Select an Indian food on the left and click <strong>"+ Add"</strong> to calculate total carbs.
                </p>
              </div>
            ) : (
              <>
                <div className="meal-items-scroll-list">
                  {mealItems.map((item) => {
                    const itemTotalCarbs = Math.round(item.carbsGrams * item.quantity * 10) / 10;
                    return (
                      <div key={item.id} className="meal-item-row">
                        <div className="meal-item-details">
                          <div className="meal-item-name">{item.name}</div>
                          <div className="meal-item-sub">
                            {item.carbsGrams}g × {item.quantity} = <strong>{itemTotalCarbs}g carbs</strong>
                          </div>
                        </div>

                        {/* Quantity Stepper Controls */}
                        <div className="stepper-wrapper">
                          <button
                            className="stepper-btn"
                            onClick={() => handleUpdateMealQuantity(item.id, item.quantity - 1)}
                            title="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="stepper-qty">{item.quantity}</span>
                          <button
                            className="stepper-btn"
                            onClick={() => handleUpdateMealQuantity(item.id, item.quantity + 1)}
                            title="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove Meal Item Option */}
                        <button
                          className="remove-item-btn"
                          onClick={() => handleRemoveMealItem(item.id)}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Reset / Log Actions */}
                <div className="meal-actions-footer">
                  <button className="btn-clear-meal" onClick={handleClearMeal}>
                    <RotateCcw size={16} />
                    <span>Clear Meal</span>
                  </button>

                  <button className="btn-log-meal" onClick={handleLogMeal}>
                    <CheckCircle2 size={16} />
                    <span>Log Meal</span>
                  </button>
                </div>
              </>
            )}

            {/* Prototype Demo Safety Notice */}
            <div className="meal-info-note">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-amber)' }} />
              <span>
                <strong>Carbohydrate Reference Note:</strong> Carbohydrate estimations shown are reference estimates based on standard Indian recipe portions and do <em>not</em> provide automated insulin dosage recommendations. Always verify carb counts with a certified diabetes educator or clinical dietitian.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
