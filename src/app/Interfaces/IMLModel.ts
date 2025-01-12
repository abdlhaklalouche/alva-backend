import * as tf from "@tensorflow/tfjs-node";

export type IMLModelNormalization = {
  inputMin: number;
  inputMax: number;
  valueMin: number;
  valueMax: number;
};

export default interface IMLModel {
  name: string;

  create(): Promise<tf.Sequential>;

  train(
    model: tf.LayersModel,
    inputTensor: tf.Tensor,
    outputTensor: tf.Tensor
  ): Promise<void>;

  save(
    model: tf.LayersModel,
    normalization: IMLModelNormalization
  ): Promise<void>;
  load(
    path: string
  ): Promise<{ model: tf.LayersModel; normalization: IMLModelNormalization }>;
}
