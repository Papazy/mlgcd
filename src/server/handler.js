const predictClassification = require('../services/inferenceService.js');
const crypto = require('crypto');
const { storeData, predictionsCollection } = require('../services/dataService.js');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { resultScore, result, suggestion } = await predictClassification(
    model,
    image
  );
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result,
    suggestion,
    createdAt,
  };

  await storeData(id, data);
  return h
    .response({
      status: 'success',
      message:
        resultScore > 99
          ? 'Model is predicted successfully'
          : 'Model is predicted successfully but under threshold. Please use the correct picture',
      data,
    })
    .code(201);
}

async function getPredictHistories(request, h) {
  const histories = (await predictionsCollection.get()).docs.map((doc) =>
    doc.data()
  );
  const data = histories.map((item) => ({
    id: item.id,
    history: item,
  }));
  return h.response({ status: 'success', data }).code(200);
}

module.exports = { postPredictHandler, getPredictHistories };