import IMLModel, { IMLModelNormalization } from "../Interfaces/IMLModel";
import * as tf from "@tensorflow/tfjs-node";

abstract class MLModel implements IMLModel {
  abstract name: string;
  abstract create(): Promise<tf.Sequential>;
  abstract train(
    model: tf.LayersModel,
    inputTensor: tf.Tensor,
    outputTensor: tf.Tensor
  ): Promise<void>;
  abstract save(
    model: tf.LayersModel,
    normalization: IMLModelNormalization
  ): Promise<void>;
  abstract load(): Promise<{
    model: tf.LayersModel;
    normalization: IMLModelNormalization;
  }>;
}

export default MLModel;
