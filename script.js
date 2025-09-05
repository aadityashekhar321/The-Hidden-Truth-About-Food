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

// Example: attach to button click
document.getElementById('get-insight-btn').addEventListener('click', async () => {
  const foodName = document.getElementById('food-insight-input').value.trim();
  const result = await getServerInsight(foodName);
  document.getElementById('ai-insight-output').textContent = JSON.stringify(result, null, 2);
});
