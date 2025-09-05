async function getServerInsight(foodName) {
  if (!foodName) return { error: 'Food name required' };

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName })
    });

    const json = await res.json();
    return json;

  } catch (err) {
    console.error(err);
    return { error: 'Network or server error' };
  }
}

const appData = {
  // Initial static comparison data (will be populated dynamically by AI for trending foods)
  comparisons: {
    // These will serve as fallback or base examples if AI doesn't provide trending
    yogurt: {
      title: "Sweetened Yogurts vs. Plain Yogurt",
      deceptive: {
        name: "Typical Flavored Yogurt (e.g., Dannon Strawberry, Yoplait Original)",
        primaryDesc: "Marketed as a probiotic-rich snack, but often contains as much added sugar as a candy bar, significantly impacting its 'Key Nutrients' profile.",
        secondaryDesc: "Despite appearing light, it has high calories and saturated fat due to added sugar and flavorings, making it less ideal when considering 'Other Nutrients' like overall energy and unhealthy fat content.",
        sugar: 19, fiber: 0, sodium: 70, calories: 146, protein: 5, saturatedFat: 2.5
      },
      healthy: {
        name: "Plain Greek Yogurt (Low-Fat, e.g., Fage 0%, Chobani Plain)",
        primaryDesc: "A truly healthy food, with low natural sugar and sodium, making its 'Key Nutrients' profile excellent for a balanced diet.",
        secondaryDesc: "High in protein and low in saturated fat, plain Greek yogurt offers superior 'Other Nutrients' for muscle building and healthy eating, with fewer calories.",
        sugar: 4, fiber: 0, sodium: 34, calories: 73, protein: 10, saturatedFat: 1
      },
      primaryExplanation: "Flavored yogurts often hide excessive added sugars behind a 'healthy' image. Choosing plain yogurt allows you to control sweetness and avoid hidden sugars, which are detrimental to health.",
      secondaryExplanation: "While protein in flavored yogurt can be decent, the high calories and saturated fat from added sugars and flavorings make it less ideal. Plain yogurt offers a better nutritional balance for these metrics."
    },
    granola: {
      title: "Granola Bars vs. Whole Nuts & Seeds",
      deceptive: {
        name: "Typical Granola Bar (e.g., Quaker Chewy, Nature Valley Crunch)",
        primaryDesc: "Promoted for 'whole grain goodness' and convenience, but many are high-calorie products held together with significant amounts of sugar syrups (corn syrup, brown sugar syrup), often resembling a dessert more than a healthy snack in terms of 'Key Nutrients'.",
        secondaryDesc: "Despite appearing light, it often has high calories due to added sugar and fat, providing less protein and beneficial fats compared to whole nuts and seeds when considering 'Other Nutrients'.",
        sugar: 12, fiber: 2, sodium: 100, calories: 150, protein: 3, saturatedFat: 2
      },
      healthy: {
        name: "Mixed Nuts & Seeds (e.g., Almonds, Walnuts, Pumpkin Seeds)",
        primaryDesc: "A powerhouse of nutrition, providing essential healthy fats, plant-based protein, and abundant fiber with no added sugars or artificial ingredients, excellent for 'Key Nutrients'.",
        secondaryDesc: "Nuts and seeds are calorie-dense but primarily from healthy fats and protein, with minimal saturated fat, making them a superior choice when considering 'Other Nutrients'.",
        sugar: 0, fiber: 8, sodium: 5, calories: 320, protein: 13, saturatedFat: 2.5
      },
      primaryExplanation: "Many granola bars are sugar traps. They offer little fiber and high added sugar, contrasting sharply with the fiber-rich, naturally sugar-free goodness of nuts and seeds.",
      secondaryExplanation: "Despite appearing light, granola bars can be high in calories due to added sugars and fats, providing less protein and beneficial fats than whole nuts and seeds."
    },
    juice: {
      title: "Packaged Juices & Vitamin Waters vs. Whole Fruit & Plain Water",
      deceptive: {
        name: "100% Fruit Juice (e.g., Minute Maid, Tropicana Apple Juice)",
        primaryDesc: "Even '100% juice' is a concentrated source of natural sugars with beneficial dietary fiber removed, leading to rapid blood sugar spikes, making it less ideal as a 'Key Nutrient' source.",
        secondaryDesc: "Despite being convenient, juice provides very little protein and no saturated fat, making it less beneficial than whole fruit in terms of 'Other Nutrients'.",
        sugar: 22, fiber: 0.5, sodium: 10, calories: 120, protein: 0.5, saturatedFat: 0
      },
      healthy: {
        name: "Whole Fruit (e.g., Medium Apple, Orange) & Water",
        primaryDesc: "Provides a complete package of vitamins, minerals, and natural sugar, crucially bundled with fiber, which aids digestion, promotes satiety, and moderates sugar absorption, making it excellent in 'Key Nutrients'.",
        secondaryDesc: "Whole fruit is naturally lower in calories, has no saturated fat, and is better for hydration when paired with water, making it a superior choice for 'Other Nutrients'.",
        sugar: 10, fiber: 4, sodium: 1, calories: 95, protein: 0.5, saturatedFat: 0
      },
      primaryExplanation: "Packaged juices are essentially sugar water without fiber, leading to sugar spikes. Whole fruit provides natural sugars with essential fiber, slowing absorption and promoting health.",
      secondaryExplanation: "While convenient, juices offer minimal protein and no saturated fat, unlike whole fruit which is a more complete and naturally balanced nutritional package."
    },
    bread: {
      title: "'Healthy' Breads & Wraps vs. 100% Whole Grain",
      deceptive: {
        name: "Multigrain or Wheat Bread (e.g., Wonder Bread Wheat, Sara Lee Delightful)",
        primaryDesc: "Often means refined flour from which most beneficial nutrients and fiber have been stripped during processing, offering little more than white bread for 'Key Nutrients'.",
        secondaryDesc: "Despite similar calories, refined grain bread often has less protein and sometimes more unhealthy fats compared to 100% whole grain bread, making it less ideal for 'Other Nutrients'.",
        sugar: 2, fiber: 1, sodium: 170, calories: 67, protein: 2, saturatedFat: 0.5
      },
      healthy: {
        name: "100% Whole Grain Bread (e.g., Ezekiel 4:9, Dave's Killer Bread)",
        primaryDesc: "Ensures you receive the entire grain kernel—bran, germ, and endosperm—providing vital dietary fiber and essential minerals crucial for sustained energy and digestive health, excellent for 'Key Nutrients'.",
        secondaryDesc: "100% whole grain bread has more protein and often healthier fats compared to refined breads, making it a better choice for 'Other Nutrients'.",
        sugar: 2, fiber: 4, sodium: 160, calories: 87, protein: 3, saturatedFat: 0.5
      },
      primaryExplanation: "Deceptive breads lack fiber and can be surprisingly high in sodium. True whole grain breads offer significantly more fiber and healthier sodium levels.",
      secondaryExplanation: "Despite similar calories, 100% whole grain bread provides more protein and less saturated fat than misleading 'wheat' or 'multigrain' options."
    },
    chips: {
      title: "Veggie Chips & Crunchy Snacks vs. Fresh Vegetables",
      deceptive: {
        name: "Veggie Straws/Chips (e.g., Garden Veggie Straws, Terra Vegetable Chips)",
        primaryDesc: "Primarily made from potato or corn flour, with a token sprinkle of vegetable powder, then deep-fried and heavily loaded with salt, negating any perceived vegetable benefit for 'Key Nutrients'.",
        secondaryDesc: "Despite the 'veggie' name, these chips are often calorie-dense and high in unhealthy saturated fats, with very little protein, making them a poor choice for 'Other Nutrients'.",
        sugar: 1, fiber: 1, sodium: 250, calories: 130, protein: 1, saturatedFat: 1.5
      },
      healthy: {
        name: "Fresh Veggies (e.g., Carrots, Cucumber, Bell Peppers)",
        primaryDesc: "A quintessential crunchy, low-calorie, and hydrating snack, naturally packed with abundant vitamins, minerals, and dietary fiber, excellent for 'Key Nutrients'.",
        secondaryDesc: "Fresh vegetables are naturally low in calories and have no saturated fat, making them a superior and more beneficial choice for 'Other Nutrients'.",
        sugar: 5, fiber: 3, sodium: 70, calories: 52, protein: 1, saturatedFat: 0
      },
      primaryExplanation: "Veggie chips offer minimal fiber but excessive sodium, making them far less healthy than fresh vegetables. Prioritize fresh for true nutritional benefits.",
      secondaryExplanation: "Despite the 'veggie' name, these chips are often calorie-dense and high in unhealthy saturated fats, with very little protein, unlike natural vegetables."
    },
    proteinBar: {
      title: "Protein Bars & Drinks vs. Lean Protein Sources",
      deceptive: {
        name: "Typical Protein Bar (e.g., Quest Bar, Clif Bar, 60g bar)",
        primaryDesc: "Marketed for muscle gain and recovery, but many are highly processed candy bars with added protein, often featuring high amounts of sugar, artificial sweeteners, and synthetic ingredients, making them a poor choice for 'Key Nutrients'.",
        secondaryDesc: "While protein bars boast high protein, they also come with high calories and saturated fat. Lean meats offer superior protein with fewer unhealthy additions, making them better for 'Other Nutrients'.",
        sugar: 15, fiber: 5, sodium: 150, calories: 250, protein: 20, saturatedFat: 5
      },
      healthy: {
        name: "Lean Protein (e.g., 3oz Chicken Breast, Hard-boiled Eggs, Cottage Cheese)",
        primaryDesc: "Whole food sources provide superior quality protein with a complete amino acid profile, free from added sugars, artificial flavors, and unnecessary fillers, excellent for 'Key Nutrients'.",
        secondaryDesc: "Lean protein sources are high in protein, lower in calories and saturated fat, making them a superior choice for muscle building and overall health in terms of 'Other Nutrients'.",
        sugar: 0, fiber: 0, sodium: 75, calories: 165, protein: 24, saturatedFat: 2
      },
      primaryExplanation: "Many protein bars are sugar traps. They offer little fiber and high added sugar, contrasting sharply with the fiber-rich, naturally sugar-free goodness of nuts and seeds.",
      secondaryExplanation: "While protein bars boast high protein, they also come with high calories and saturated fat. Lean meats offer superior protein with fewer unhealthy additions."
    },
    cereal: {
      title: "Sweetened Breakfast Cereals vs. Plain Oatmeal",
      deceptive: {
        name: "Typical Sweetened Cereal (e.g., Frosted Flakes, Lucky Charms)",
        primaryDesc: "Often marketed as a 'good source of vitamins,' but primarily composed of refined grains and high amounts of added sugar, leading to rapid energy spikes followed by inevitable crashes and hunger, making it a poor choice for 'Key Nutrients'.",
        secondaryDesc: "Sweetened cereals, despite similar calories, offer less protein and more unhealthy fats compared to plain oatmeal, making them less ideal for 'Other Nutrients'.",
        sugar: 14, fiber: 1, sodium: 190, calories: 150, protein: 2, saturatedFat: 0.5
      },
      healthy: {
        name: "Plain Rolled Oats",
        primaryDesc: "A true powerhouse of a whole grain, offering a rich source of soluble fiber (beta-glukán) that provides sustained energy, helps regulate blood sugar, and supports heart health, excellent for 'Key Nutrients'.",
        secondaryDesc: "Plain oatmeal is high in protein and low in saturated fat, making it a better choice for 'Other Nutrients' for breakfast, providing sustained energy throughout the day.",
        sugar: 0, fiber: 4, sodium: 0, calories: 150, protein: 5, saturatedFat: 1
      },
      primaryExplanation: "Sweetened cereals are sugar bombs with minimal fiber, leading to energy crashes. Plain oatmeal offers great fiber and no added sugar for sustained energy.",
      secondaryExplanation: "Sweetened cereals, despite similar calories, offer less protein and more unhealthy fats compared to the superior nutritional profile of oatmeal."
    },
    energyDrink: {
      title: "Energy Drinks vs. Natural Energy Boosters",
      deceptive: {
        name: "Typical Energy Drink (e.g., Red Bull, Monster Energy)",
        primaryDesc: "Marketed for quick and intense energy boosts, these beverages often contain excessively high levels of added sugar, artificial ingredients, and synthetic caffeine, leading to adverse effects like jitters, anxiety, and severe energy crashes, making them a poor choice for 'Key Nutrients'.",
        secondaryDesc: "Despite the boost, energy drinks are high in calories from sugar and lack protein or healthy fats, unlike natural energy sources that can offer more balanced nutrition, making them a poor choice for 'Other Nutrients'.",
        sugar: 27, fiber: 0, sodium: 100, calories: 110, protein: 0, saturatedFat: 0
      },
      healthy: {
        name: "Black Coffee or Green Tea",
        primaryDesc: "Natural, unprocessed sources of caffeine and powerful antioxidants, providing a clean and sustained energy lift without unnecessary added sugars, artificial colors, or questionable additives, excellent for 'Key Nutrients'.",
        secondaryDesc: "Black coffee or green tea have almost zero calories, protein, and saturated fat, making them an excellent and healthy energy alternative for 'Other Nutrients'.",
        sugar: 0, fiber: 0, sodium: 5, calories: 2, protein: 0.2, saturatedFat: 0
      },
      primaryExplanation: "Energy drinks are loaded with sugar and sodium, offering no fiber. Natural alternatives like coffee or green tea provide clean energy without these added negatives.",
      secondaryExplanation: "Despite the boost, energy drinks are high in calories from sugar and lack protein or healthy fats, unlike natural energy sources that can offer more balanced nutrition."
    }
  },
  athleteMyths: [
    {
      question: "Myth: I need to load up on protein to build muscle.",
      answer: "Reality: Your body can only effectively utilize about 20-30 grams of protein at a time for muscle protein synthesis and repair. Consuming excess protein beyond this threshold is often stored as fat or simply excreted. Consistent, progressive training combined with a balanced diet that includes adequate (but not excessive) protein intake is the true driver of muscle growth. Most teenagers and active individuals can easily meet their protein requirements through diverse whole foods like lean meats (chicken, fish), legumes (beans, lentils), eggs, and dairy products (yogurt, cottage cheese)."
    },
    {
      question: "Myth: Carbs make you fat, so athletes should strictly avoid them.",
      answer: "Reality: Carbohydrates are unequivocally your body's primary and most efficient fuel source, especially crucial for high-intensity and endurance exercise. Severe carbohydrate restriction leads to profound fatigue, impaired cognitive function, and significantly compromised athletic performance. Focus on nutrient-dense, complex carbohydrates like whole grains (brown rice, quinoa), fruits, starchy vegetables (sweet potatoes), and legumes for sustained energy release."
    },
    {
      question: "Myth: All fat is bad and will slow me down.",
      answer: "Reality: Healthy fats, sourced from foods like avocados, nuts, seeds, and olive oil, are absolutely essential. They play vital roles in energy production (especially for longer duration activities), brain function, hormone production, and the absorption of fat-soluble vitamins (A, D, E, K). While it's prudent to limit unhealthy saturated and trans fats, completely eliminating all fats from your diet is detrimental to overall health, recovery, and peak athletic performance."
    },
    {
      question: "Myth: I need specialized sports drinks and supplements to perform my best.",
      answer: "Reality: For the vast majority of workouts lasting less than 60-90 minutes, plain water remains the gold standard for hydration. Sports drinks, with their high sugar and electrolyte content, are generally only necessary for prolonged, intense exercise sessions to replenish lost fluids and minerals. Relying on a well-balanced diet rich in whole foods is overwhelmingly superior to consuming an array of supplements, many of which are unregulated, lack robust scientific backing, and can even carry health risks. Prioritize real food nutrition first."
    }
  ]
};

let comparisonChart = null;
let aiInsightChart = null; // New chart instance for AI insight
let currentFoodKey = 'yogurt';
let currentMetricGroup = 'primary';
let trendingFoodsLoaded = false; // Flag to track if trending foods have been loaded

function getChartDataAndLabels(foodData, metricGroup) {
  if (metricGroup === 'primary') {
    return {
      labels: ['Added Sugar (g)', 'Dietary Fiber (g)', 'Sodium (mg)'],
      deceptiveData: [foodData.deceptive.sugar, foodData.deceptive.fiber, foodData.deceptive.sodium],
      healthyData: [foodData.healthy.sugar, foodData.healthy.fiber, foodData.healthy.sodium],
      unitCallbacks: [
        (value) => `${value} g`,
        (value) => `${value} g`,
        (value) => `${value} mg`
      ]
    };
  } else {
    return {
      labels: ['Calories (kcal)', 'Protein (g)', 'Saturated Fat (g)'],
      deceptiveData: [foodData.deceptive.calories, foodData.deceptive.protein, foodData.deceptive.saturatedFat],
      healthyData: [foodData.healthy.calories, foodData.healthy.protein, foodData.healthy.saturatedFat],
      unitCallbacks: [
        (value) => `${value} kcal`,
        (value) => `${value} g`,
        (value) => `${value} g`
      ]
    };
  }
}

function createComparisonChart(foodKey, metricGroup) {
  const data = appData.comparisons[foodKey];
  if (!data) return;

  const { labels, deceptiveData, healthyData, unitCallbacks } = getChartDataAndLabels(data, metricGroup);
  const ctx = document.getElementById('comparison-chart').getContext('2d');

  if (comparisonChart) {
    comparisonChart.destroy();
  }

  comparisonChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: data.deceptive.name,
          data: deceptiveData,
          backgroundColor: 'rgba(231, 76, 60, 0.7)', /* Pomegranate */
          borderColor: 'rgba(231, 76, 60, 1)',
          borderWidth: 1
        },
        {
          label: data.healthy.name,
          data: healthyData,
          backgroundColor: 'rgba(46, 204, 113, 0.7)', /* Emerald */
          borderColor: 'rgba(46, 204, 113, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Nutritional Comparison',
          font: { size: 18, family: 'Open Sans' }, /* Updated font */
          color: '#E0E0E0' /* Light text for dark background */
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                const index = context.dataIndex;
                return label + unitCallbacks[index](context.parsed.y);
              }
              return label;
            }
          },
          titleColor: '#E0E0E0', /* Light text for tooltip title */
          bodyColor: '#E0E0E0', /* Light text for tooltip body */
          backgroundColor: '#3A3A3A' /* Dark background for tooltip */
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Value',
            color: '#E0E0E0', /* Light text for Y-axis title */
            font: { family: 'Open Sans' } /* Updated font */
          },
          ticks: {
            color: '#B0B0B0', /* Lighter gray for Y-axis ticks */
            font: { family: 'Open Sans' } /* Updated font */
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)' /* Very subtle grid lines */
          }
        },
        x: {
          title: {
            display: true,
            text: 'Nutrient',
            color: '#E0E0E0', /* Light text for X-axis title */
            font: { family: 'Open Sans' } /* Updated font */
          },
          ticks: {
            color: '#B0B0B0', /* Lighter gray for X-axis ticks */
            font: { family: 'Open Sans' } /* Updated font */
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)' /* Very subtle grid lines */
          }
        }
      }
    }
  });
}

function updateComparisonDisplay() {
  const data = appData.comparisons[currentFoodKey];
  if (!data) {
    console.error("Food data not found for key:", currentFoodKey);
    return;
  }

  document.getElementById('comparison-title').textContent = data.title;

  // Dynamically update deceptive and healthy food descriptions based on metric group
  if (currentMetricGroup === 'primary') {
    document.getElementById('deceptive-desc-item').textContent = data.deceptive.primaryDesc;
    document.getElementById('healthy-desc-item').textContent = data.healthy.primaryDesc;
    document.getElementById('comparison-explanation').textContent = data.primaryExplanation; // Changed to data.primaryExplanation
  } else {
    document.getElementById('deceptive-desc-item').textContent = data.deceptive.secondaryDesc;
    document.getElementById('healthy-desc-item').textContent = data.healthy.secondaryDesc;
    document.getElementById('comparison-explanation').textContent = data.secondaryExplanation; // Changed to data.secondaryExplanation
  }

  document.getElementById('deceptive-title-item').textContent = data.deceptive.name;
  document.getElementById('healthy-title-item').textContent = data.healthy.name;

  createComparisonChart(currentFoodKey, currentMetricGroup);
}

function createAccordion() {
  const container = document.getElementById('accordion-container');
  container.innerHTML = '';
  appData.athleteMyths.forEach((item, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'content-card rounded-xl overflow-hidden';

    const button = document.createElement('button');
    button.className = 'w-full p-4 text-left font-semibold text-lg bg-[#3A3A3A] hover:bg-[#4A4A4A] flex justify-between items-center text-gray-200';
    button.innerHTML = `<span>${item.question}</span><span class="transform transition-transform duration-300 ">▼</span>`;

    const content = document.createElement('div');
    content.className = 'p-4 bg-[#2C2C2C] border-t border-gray-700 text-gray-300 hidden';
    content.textContent = item.answer;

    button.addEventListener('click', () => {
      const isHidden = content.classList.toggle('hidden');
      button.querySelector('span:last-child').style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    wrapper.appendChild(button);
    wrapper.appendChild(content);
    container.appendChild(wrapper);
  });
}

// Function to create/update the AI Insight chart
function createAiInsightChart(foodName, nutritionalData) {
  const ctx = document.getElementById('ai-insight-chart').getContext('2d');
  if (aiInsightChart) {
    aiInsightChart.destroy();
  }

  // Define all possible labels with units and their corresponding keys in nutritionalData
  const allNutrients = [
    { name: 'Calories', key: 'calories', unit: 'kcal' },
    { name: 'Sugar', key: 'sugar', unit: 'g' },
    { name: 'Fat', key: 'fat', unit: 'g' },
    { name: 'Sodium', key: 'sodium', unit: 'mg' },
    { name: 'Protein', key: 'protein', unit: 'g' },
    { name: 'Fiber', key: 'fiber', unit: 'g' },
    { name: 'Saturated Fat', key: 'saturatedFat', unit: 'g' }
  ];

  // Filter out nutrients with value 0
  const filteredLabels = []; // Labels for the pie chart slices
  const filteredDataValues = []; // Data values for the pie chart slices
  const filteredUnitNames = []; // Original names for tooltips and legends

  // Validate nutritionalData object and its properties
  if (!nutritionalData || typeof nutritionalData !== 'object') {
    console.warn("Invalid nutritionalData received:", nutritionalData);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const chartContainer = document.getElementById('ai-insight-chart-container');
    chartContainer.innerHTML = '<p class="text-center text-red-400 mt-4">Unable to display chart: Nutritional data is missing or invalid.</p>'; // Error message for user
    return;
  }

  allNutrients.forEach(nutrient => {
    const value = nutritionalData[nutrient.key];
    // Ensure value is a number and greater than 0, or safely default to 0
    const numericValue = typeof value === 'number' ? value : 0;
    if (numericValue > 0) {
      filteredLabels.push(`${nutrient.name} (${nutrient.unit})`); // Label format for pie chart
      filteredDataValues.push(numericValue);
      filteredUnitNames.push(nutrient.name); // Store original name for tooltip
    }
  });

  // If no data is available or all are zero, show a message
  if (filteredLabels.length === 0) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const chartContainer = document.getElementById('ai-insight-chart-container');
    chartContainer.innerHTML = '<p class="text-center text-gray-400 mt-4">No significant nutritional data (greater than 0) available for this product to display in chart.</p>'; // Updated to English
    return;
  }

  // Define a color palette for the pie chart slices
  const backgroundColors = [
    '#3498DB', // Deep Sky Blue (Calories)
    '#E74C3C', // Pomegranate (Sugar)
    '#F39C12', // Orange (Fat)
    '#2ECC71', // Emerald (Sodium)
    '#9B59B6', // Amethyst (Protein)
    '#1ABC9C', // Turquoise (Fiber)
    '#D35400', // Pumpkin (Saturated Fat)
    '#BDC3C7', // Silver (Fallback/Others)
    '#7F8C8D' // Asbestos (Fallback/Others)
  ];


  aiInsightChart = new Chart(ctx, {
    type: 'pie', // Changed to pie chart
    data: {
      labels: filteredLabels,
      datasets: [{
        data: filteredDataValues,
        backgroundColor: backgroundColors.slice(0, filteredLabels.length), // Assign colors based on filtered data length
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Nutritional Breakdown for ${foodName}`,
          font: { size: 18, family: 'Open Sans' },
          color: '#E0E0E0'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const labelText = context.label; // This is "Name (Unit)" from filteredLabels
              const value = context.parsed;
              const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
              const percentage = (total > 0 ? (value / total) * 100 : 0).toFixed(2); // Avoid division by zero

              // Extract name and unit from labelText
              const match = labelText.match(/(.*?)\s\((.*?)\)/);
              const name = match ? match[1] : labelText;
              const unit = match ? match[2] : '';

              return `${name}: ${value} ${unit} (${percentage}%)`;
            }
          },
          titleColor: '#E0E0E0',
          bodyColor: '#E0E0E0',
          backgroundColor: '#3A3A3A'
        },
        legend: { // Display legend for pie chart
          display: true,
          position: 'right', // Position legend on the right
          labels: {
            color: '#E0E0E0',
            font: {
              size: 12,
              family: 'Open Sans'
            },
            generateLabels: function (chart) {
              const data = chart.data;
              const dataset = data.datasets[0];
              if (data.labels.length && dataset) {
                return data.labels.map(function (label, i) {
                  const value = dataset.data[i];
                  const originalName = label.split(' (')[0];
                  const originalUnit = label.match(/\((.*?)\)/)?.[1] || '';

                  return {
                    text: `${originalName}: ${value} ${originalUnit}`,
                    fillStyle: dataset.backgroundColor[i],
                    strokeStyle: dataset.borderColor ? dataset.borderColor[i] : 'transparent',
                    lineWidth: dataset.borderWidth || 0,
                    hidden: isNaN(value) || value <= 0,
                    index: i
                  };
                });
              }
              return [];
            }
          }
        }
      }
      // No scales for pie charts
    }
  });
}

// Function to get trending food data from AI and populate appData.comparisons
async function getTrendingFood() {
  const foodSelector = document.getElementById('food-selector');
  // Save static options as default options for fallback
  const staticDefaultComparisons = JSON.parse(JSON.stringify(appData.comparisons)); // Deep copy

  // Clear existing options, but keep a default empty one to prevent UI issues if AI fails
  foodSelector.innerHTML = '<option value="">Loading Trending Foods...</option>';
  foodSelector.disabled = true; // Disable until loaded

  try {
    let chatHistory = [];
    const prompt = `Provide a list of 5 currently popular or trending "health halo" food pairs (one deceptive, one genuinely healthy alternative) in a JSON array. For each pair, include:
            - A unique 'key' (e.g., 'oatMilk')
            - A 'title' for the comparison (e.g., 'Oat Milk vs. Almond Milk')
            - 'deceptive' food details:
                - 'name' (e.g., 'Sweetened Oat Milk')
                - 'primaryDesc' (brief description focusing on key nutrients like sugar/fiber/sodium, ~2 sentences)
                - 'secondaryDesc' (brief description focusing on other nutrients like calories/protein/fat, ~2 sentences)
                - 'sugar', 'fiber', 'sodium', 'calories', 'protein', 'saturatedFat' (approximate numeric values per typical serving).
            - 'healthy' food details:
                - 'name' (e.g., 'Unsweetened Almond Milk')
                - 'primaryDesc' (brief description focusing on key nutrients, ~2 sentences)
                - 'secondaryDesc' (brief description focusing on other nutrients, ~2 sentences)
                - 'sugar', 'fiber', 'sodium', 'calories', 'protein', 'saturatedFat' (approximate numeric values per typical serving).
            - A general 'primaryExplanation' for the comparison when focusing on key nutrients.
            - A general 'secondaryExplanation' for the comparison when focusing on other nutrients.

            Example for one pair:
            {
                "key": "oatMilk",
                "title": "Oat Milk vs. Almond Milk",
                "deceptive": {
                    "name": "Sweetened Oat Milk",
                    "primaryDesc": "Often perceived as healthy, but sweetened oat milk can have high sugar content and minimal fiber, impacting its 'key nutrients' profile negatively.",
                    "secondaryDesc": "While lower in saturated fat than dairy, sweetened oat milk can still be calorie-dense and offer less protein than other milk alternatives, affecting 'other nutrients'.",
                    "sugar": 16, "fiber": 1, "sodium": 120, "calories": 130, "protein": 2, "saturatedFat": 0.5
                },
                "healthy": {
                    "name": "Unsweetened Almond Milk",
                    "primaryDesc": "A low-sugar, low-sodium option with some fiber, making it a better choice for 'key nutrients' compared to sweetened plant-based milks.",
                    "secondaryDesc": "Very low in calories and saturated fat, with a modest protein content, unsweetened almond milk is a good alternative for 'other nutrients' in a healthy diet.",
                    "sugar": 0, "fiber": 1, "sodium": 160, "calories": 30, "protein": 1, "saturatedFat": 0
                },
                "primaryExplanation": "Sweetened oat milk often contains hidden sugars that contribute to daily sugar intake, while unsweetened almond milk offers a much lower sugar content for a healthier choice.",
                "secondaryExplanation": "Considering calories and protein, unsweetened almond milk is significantly lower in calories and still provides some protein, unlike sweetened oat milk which can be deceptively high in calories."
            }`;

    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              "key": { "type": "STRING" },
              "title": { "type": "STRING" },
              "deceptive": {
                "type": "OBJECT",
                "properties": {
                  "name": { "type": "STRING" },
                  "primaryDesc": { "type": "STRING" },
                  "secondaryDesc": { "type": "STRING" },
                  "sugar": { "type": "NUMBER" },
                  "fiber": { "type": "NUMBER" },
                  "sodium": { "type": "NUMBER" },
                  "calories": { "type": "NUMBER" },
                  "protein": { "type": "NUMBER" },
                  "saturatedFat": { "type": "NUMBER" }
                },
                "required": ["name", "primaryDesc", "secondaryDesc", "sugar", "fiber", "sodium", "calories", "protein", "saturatedFat"]
              },
              "healthy": {
                "type": "OBJECT",
                "properties": {
                  "name": { "type": "STRING" },
                  "primaryDesc": { "type": "STRING" },
                  "secondaryDesc": { "type": "STRING" },
                  "sugar": { "type": "NUMBER" },
                  "fiber": { "type": "NUMBER" },
                  "sodium": { "type": "NUMBER" },
                  "calories": { "type": "NUMBER" },
                  "protein": { "type": "NUMBER" },
                  "saturatedFat": { "type": "NUMBER" }
                },
                "required": ["name", "primaryDesc", "secondaryDesc", "sugar", "fiber", "sodium", "calories", "protein", "saturatedFat"]
              },
              "primaryExplanation": { "type": "STRING" },
              "secondaryExplanation": { "type": "STRING" }
            },
            "required": ["key", "title", "deceptive", "healthy", "primaryExplanation", "secondaryExplanation"]
          }
        }
      }
    };
    const apiKey = ""; // Canvas will provide this in runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.error ? errorData.error.message : 'Unknown error'}`);
    }

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0 &&
      result.candidates[0].content && result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0) {
      const jsonText = result.candidates[0].content.parts[0].text;

      // Add explicit check for empty or non-string JSON text
      if (!jsonText || typeof jsonText !== 'string' || jsonText.trim() === '') { // Added trim check for empty string
        throw new Error("AI response was empty or not a valid string for JSON parsing.");
      }

      try {
        const trendingComparisons = JSON.parse(jsonText);

        // Validate if trendingComparisons is an array and not empty
        if (!Array.isArray(trendingComparisons) || trendingComparisons.length === 0) {
          throw new Error("AI returned an empty or invalid array for trending foods.");
        }

        // Merge trending foods into appData.comparisons
        Object.assign(appData.comparisons, trendingComparisons.reduce((acc, food) => {
          acc[food.key] = food;
          return acc;
        }, {}));

        // Repopulate dropdown with all available options (static + trending)
        foodSelector.innerHTML = '';
        for (const key in appData.comparisons) {
          const option = document.createElement('option');
          option.value = key;
          option.textContent = appData.comparisons[key].title;
          foodSelector.appendChild(option);
        }

        trendingFoodsLoaded = true;
        foodSelector.disabled = false; // Enable selector
        // Select the first trending food from AI, if available, otherwise default to 'yogurt'
        foodSelector.value = trendingComparisons[0] ? trendingComparisons[0].key : 'yogurt';
        currentFoodKey = foodSelector.value;
        updateComparisonDisplay(); // Update display with selected food

      } catch (jsonError) {
        console.error("Error parsing trending foods JSON:", jsonError, "Response:", jsonText);
        // Fallback to static options if AI parsing fails
        populateStaticFoods(staticDefaultComparisons); // Pass staticDefaultComparisons
        document.getElementById('food-selector').parentElement.querySelector('label').textContent += " (Failed to load trending foods, showing defaults)"; // Inform user
      }
    } else {
      console.error("No candidates found for trending foods.");
      // Fallback to static options if AI response is empty
      populateStaticFoods(staticDefaultComparisons); // Pass staticDefaultComparisons
      document.getElementById('food-selector').parentElement.querySelector('label').textContent += " (Failed to load trending foods, showing defaults)"; // Inform user
    }
  } catch (error) {
    console.error("Error fetching trending foods:", error);
    // Fallback to static options if API call fails
    populateStaticFoods(staticDefaultComparisons); // Pass staticDefaultComparisons
    document.getElementById('food-selector').parentElement.querySelector('label').textContent += " (Failed to load trending foods, showing defaults)"; // Inform user
  }
}

// Function to populate dropdown with static food options
// Added staticDefaultComparisons as a parameter to ensure it's accessible
function populateStaticFoods(staticDefaultComparisons) {
  const foodSelector = document.getElementById('food-selector');
  foodSelector.innerHTML = ''; // Clear current options
  for (const key in staticDefaultComparisons) { // Use the passed parameter
    const option = document.createElement('option');
    option.value = key;
    option.textContent = staticDefaultComparisons[key].title;
    foodSelector.appendChild(option);
  }
  foodSelector.disabled = false;
  foodSelector.value = 'yogurt'; // Default to yogurt
  currentFoodKey = 'yogurt';
  updateComparisonDisplay();
}


// Function to call Gemini API for food insight
async function getFoodInsight(foodName) {
    const insightOutput = document.getElementById('ai-insight-output');
    const loadingIndicator = document.getElementById('insight-loading');
    const aiChartContainer = document.getElementById('ai-insight-chart-container');

    aiChartContainer.innerHTML = '<canvas id="ai-insight-chart"></canvas>';
    insightOutput.classList.add('hidden');
    aiChartContainer.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
    insightOutput.textContent = '';

    try {
        // Call your serverless API route instead of Gemini directly
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foodName })
        });
        const result = await res.json();

        // Handle error from server
        if (!result.ok && result.error) {
            throw new Error(result.error);
        }

        // Try to use structured JSON if available
        const aiData = result.fromAI || result.raw || result;
        let parsedJson = aiData;

        // If fromAI is a string, try to parse it
        if (typeof aiData === 'string') {
            try {
                parsedJson = JSON.parse(aiData);
            } catch {
                // fallback: show raw string
                insightOutput.textContent = aiData;
                return;
            }
        }

        // Validate structure
        if (!parsedJson || !parsedJson.foodName || !parsedJson.summary || !parsedJson.nutritionalData) {
            insightOutput.textContent = "Could not get a clear insight for this food. Please try another one or clarify your query.";
            return;
        }

        insightOutput.textContent = parsedJson.summary;
        createAiInsightChart(parsedJson.foodName, parsedJson.nutritionalData);
        aiChartContainer.classList.remove('hidden');
    } catch (error) {
        insightOutput.textContent = `Error: ${error.message}. Please try again later.`;
    } finally {
        loadingIndicator.classList.add('hidden');
        insightOutput.classList.remove('hidden');
    }
}


// Intersection Observer for fade-in animations
const sectionsToAnimate = document.querySelectorAll('.fade-in, .slide-in-right');
const observerOptions = {
  root: null, // viewport
  rootMargin: '0px',
  threshold: 0.2 // Trigger when 20% of the element is visible
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target); // Stop observing once animated
    }
  });
}, observerOptions);

sectionsToAnimate.forEach(section => {
  sectionObserver.observe(section);
});


window.addEventListener('DOMContentLoaded', () => {
  const foodSelector = document.getElementById('food-selector');
  const metricRadios = document.querySelectorAll('input[name="metric-group"]');
  const startExploringBtn = document.getElementById('start-exploring');
  const getInsightBtn = document.getElementById('get-insight-btn'); // AI Insight button
  const foodInsightInput = document.getElementById('food-insight-input'); // AI Insight input

  // Initial loading of trending foods
  getTrendingFood();

  foodSelector.addEventListener('change', (e) => {
    currentFoodKey = e.target.value;
    updateComparisonDisplay();
  });

  metricRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentMetricGroup = e.target.value;
      updateComparisonDisplay();
    });
  });

  startExploringBtn.addEventListener('click', () => {
    document.getElementById('intro').scrollIntoView({ behavior: 'smooth' });
  });

  // Event listener for the new AI Insight button
  getInsightBtn.addEventListener('click', () => {
    const foodName = foodInsightInput.value.trim();
    if (foodName) {
      getFoodInsight(foodName);
    } else {
      // If input is empty, clear previous insight and show a message
      document.getElementById('ai-insight-output').textContent = "Please enter a food name to get an insight.";
      document.getElementById('ai-insight-output').classList.remove('hidden');
      document.getElementById('ai-insight-chart-container').classList.add('hidden'); // Hide chart if input is empty
      // Optionally, if input is empty, you could refresh trending foods as a fallback, but the user requested error handling here.
      // getTrendingFood(); 
    }
  });


  updateComparisonDisplay(); // Initial display
  createAccordion();

  const navLinks = document.querySelectorAll('#main-nav a');
  const sections = document.querySelectorAll('main section');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -30% 0px' });

  sections.forEach(section => navObserver.observe(section));
});
