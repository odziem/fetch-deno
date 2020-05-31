import * as log from "https://deno.land/std/log/mod.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
}

const launches = new Map<number, Launch>();

async function downloadLaunchData() {
  log.info("Downloading launch data...");
  const response = await fetch("https://api.spacexdata.com/v3/launches");

  if (!response.ok) {
    log.warning("Failed to fetch SpaceX launches");
    throw new Error("Launch data download failed.");
  }

  const launchData = await response.json();

  for (const launch of launchData) {
    const payloads = launch["rocket"]["second_stage"]["payloads"];

    const customers = _.flatMap(payloads, (payload: any) => {
      return payload["customers"];
    });

    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      customers,
    };

    log.info(JSON.stringify(flightData, null, 2));

    launches.set(flightData.flightNumber, flightData);
  }
}

if (import.meta.main) {
  await downloadLaunchData();

  log.info(`Downloaded data for ${launches.size} SpaceX launches.`);
}
