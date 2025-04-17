import * as tf from "@tensorflow/tfjs-node";
import { NextResponse } from "next/server";

let windModel: tf.LayersModel | null = null;

async function loadWindModel() {
  if (!windModel) {
    // For demonstration, create a simple dummy model.
    // In production, load a pre-trained model from disk or URL.
    // Wind model: 9 inputs and 3 outputs (predicted wind speed, wind direction, energy yield)
    windModel = tf.sequential();
    windModel.add(tf.layers.dense({ inputShape: [9], units: 16, activation: "relu" }));
    windModel.add(tf.layers.dense({ units: 8, activation: "relu" }));
    windModel.add(tf.layers.dense({ units: 3, activation: "linear" }));
    windModel.compile({ loss: "meanSquaredError", optimizer: "adam" });
    // Optionally, load model weights:
    // windModel = await tf.loadLayersModel("file://path/to/wind-model/model.json");
  }
  return windModel;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expected inputs for wind model:
    // temperature, windSpeed, windDirection, airDensity, cloudCover,
    // atmosphericPressure, precipitation, dayOfYear, altitude
    const inputArray = [
      body.temperature,
      body.windSpeed,
      body.windDirection,
      body.airDensity,
      body.cloudCover,
      body.atmosphericPressure,
      body.precipitation,
      body.dayOfYear,
      body.altitude,
    ];
    const model = await loadWindModel();
    const inputTensor = tf.tensor2d([inputArray]); // shape [1,9]
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const predArray = prediction.arraySync()[0] as number[];

    // Generate 7-day forecast with small random variations
    const forecast = Array.from({ length: 7 }, (_, index) => {
      const variation = 1 + (Math.random() - 0.5) * 0.1;
      return {
        day: index + 1,
        predictedWindSpeed: (predArray[0] * variation).toFixed(2),
        predictedWindDirection: (predArray[1] * variation).toFixed(2),
        predictedEnergyYield: (predArray[2] * variation).toFixed(2),
      };
    });

    return NextResponse.json({ forecast });
  } catch (error) {
    console.error("Wind forecast error:", error);
    return NextResponse.error();
  }
}