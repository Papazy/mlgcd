const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

    const classes = ['Cancer', 'Non-cancer'];

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classResult = confidenceScore > 50 ? 0 : 1;
    const label = classes[classResult];
    let suggestion;

    if (label === 'Cancer') {
      suggestion = 'Anda terdeteksi sakit, segera periksa ke dokter!';
    } else {
      suggestion = 'Anda tidak terdeteksi sakit, tetap jaga kesehatan!';
    }
    return { confidenceScore, label, suggestion, prediction, score };
  } catch (error) {
    if (error instanceof clientErrors) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }
    if (response instanceof InputError) {
      const newResponse = h.response({
        status: 'fail',
        message: `${response.message} Silakan gunakan foto lain.`,
      });
      newResponse.code(error.statusCode);
      return newResponse;
    }
  }
}

module.exports = predictClassification;