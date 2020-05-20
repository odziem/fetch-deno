import * as log from "https://deno.land/std/log/mod.ts";

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: string[];
}

const launches = new Map<number, Launch>();

async function downloadLaunchData() {
  const response = await fetch("https://api.spacexdata.com/v3/launches");

  if (!response.ok) {
    return log.warning("Failed to fetch SpaceX launches");
  }

  const launchData = await response.json();

  log.info("Downloading launch data...");
  launches.clear();

  for (const launch of launchData) {
    const customers = launch["rocket"]["second_stage"]["payloads"].reduce((acc : string[], curr : any) => {
      return acc.concat(curr["customers"]);;
    }, []);

    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      customers,
    };

    log.info(JSON.stringify(flightData));

    launches.set(flightData.flightNumber, flightData);
  }
}

if (import.meta.main) {
  await downloadLaunchData();

  log.info(`Downloaded data for ${launches.size} SpaceX launches.`)
}