import * as tf from "@tensorflow/tfjs-node";
import { NextResponse } from "next/server";

let solarModel: tf.LayersModel | null = null;

async function loadSolarModel() {
  if (!solarModel) {
    // For demonstration, create a simple dummy model.
    // In production, load a pre-trained model from disk or URL.
    solarModel = tf.sequential();
    solarModel.add(tf.layers.dense({ inputShape: [7], units: 16, activation: "relu" }));
    solarModel.add(tf.layers.dense({ units: 8, activation: "relu" }));
    solarModel.add(tf.layers.dense({ units: 2, activation: "linear" }));
    solarModel.compile({ loss: "meanSquaredError", optimizer: "adam" });
    // Optionally, load model weights:
    // solarModel = await tf.loadLayersModel("file://path/to/solar-model/model.json");
  }
  return solarModel;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expected inputs:
    // solarIrradiance, windSpeed, humidity, precipitation, cloudCover, dayOfYear, altitude
    const inputArray = [
      body.solarIrradiance,
      body.windSpeed,
      body.humidity,
      body.precipitation,
      body.cloudCover,
      body.dayOfYear,
      body.altitude,
    ];
    const model = await loadSolarModel();
    const inputTensor = tf.tensor2d([inputArray]); // shape [1,7]
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const predArray = prediction.arraySync()[0] as number[];

    // For demonstration, generate 7-day forecast using the model's prediction with slight random variation
    const forecast = Array.from({ length: 7 }, (_, index) => {
      const variation = 1 + (Math.random() - 0.5) * 0.1; // ±5% variation
      return {
        day: index + 1,
        predictedSolarOutput: (predArray[0] * variation).toFixed(2), // kW output
        predictedEnergyYield: (predArray[1] * variation).toFixed(2), // kWh yield
      };
    });

    return NextResponse.json({ forecast });
  } catch (error) {
    console.error("Solar forecast error:", error);
    return NextResponse.error();
  }
}