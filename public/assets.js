let gameAssets = {};

const assetRead = async (filename) => {
  const response = await fetch(`./assets/${filename}`);
  const jsonData = await response.json();

  return jsonData;
};

export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      assetRead('stage.json'),
      assetRead('item.json'),
      assetRead('item_unlock.json'),
    ]);

    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

// // assetRead('stage.json', 'stages');
// // assetRead('item.json', 'items');
// // assetRead('item_unlock.json', 'itemUnlocks');

export const getGameAssets = () => {
  return gameAssets;
};
