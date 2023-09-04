const axios = require("axios");

const MAX_ATTEMPTS = 24;

async function fetchDataForHour(shiftHour) {
  const now = new Date();
  now.setHours(now.getHours() - shiftHour);
  const endTime = now.toISOString(); // End time

  // Subtract an additional hour to get the start time
  now.setHours(now.getHours() - 1);
  const startTime = now.toISOString();

  const apiUrl = `https://api.energy-charts.info/power?country=all&start=${encodeURIComponent(
    startTime
  )}&end=${encodeURIComponent(endTime)}`;
  const response = await axios.get(apiUrl, {
    headers: {
      Accept: "application/json",
    },
  });
  return response.data;
}

exports.handler = async function (event, context) {
  try {
    let data;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      data = await fetchDataForHour(attempt);
      if (
        data["Wind offshore (MW)"] &&
        data["Wind offshore (MW)"].length > 0 &&
        data["Wind onshore (MW)"] &&
        data["Wind onshore (MW)"].length > 0
      ) {
        break;
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        //'Access-Control-Allow-Origin': 'https://your-website-domain.com', // I don't have a domain yet
        "Access-Control-Allow-Methods": "GET",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  }
};
