import { MLConsts } from "../Consts/MLConsts";
import { IMLModelNormalization } from "../Interfaces/IMLModel";
import MLModel from "./MLModel";
import * as tf from "@tensorflow/tfjs-node";

export default class MLEnergyModel extends MLModel {
  name: string = "energy";

  async create() {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({ units: 64, activation: "relu", inputShape: [8] })
    );
    model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1 }));

    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.001, undefined, undefined, 0.01),
      loss: "meanSquaredError",
    });

    return model;
  }

  async train(
    model: tf.LayersModel,
    inputTensor: tf.Tensor,
    outputTensor: tf.Tensor
  ) {
    await model.fit(inputTensor, outputTensor, {
      epochs: 50,
      batchSize: 8,
      callbacks: {
        onEpochEnd: (epoch, logs) =>
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss}`),
      },
    });
  }

  async save(model: tf.LayersModel, normalization: IMLModelNormalization) {
    await model.save(`file://./src/${MLConsts.models_path}/${this.name}`);

    require("fs").writeFileSync(
      `./src/${MLConsts.models_path}/${this.name}/normalization.json`,
      JSON.stringify(normalization)
    );
  }

  async load() {
    const model = await tf.loadLayersModel(
      `file://./src/${MLConsts.models_path}/${this.name}/model.json`
    );

    const normalization: IMLModelNormalization = JSON.parse(
      require("fs").readFileSync(
        `./src/${MLConsts.models_path}/${this.name}/normalization.json`,
        "utf-8"
      )
    );

    return { model, normalization };
  }
}
