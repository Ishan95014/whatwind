const windOffshoreCapacity = 16.46; // in GW
const windOnshoreCapacity = 189.87; // in GW

// Helper function to interpolate between two RGB colors
function getGradientColorsForPercentage(pct) {
  let startColor, endColor;

  if (pct < 0.3) {
    startColor = [255, 0, 0]; // Deep red
    endColor = [255, 85, 85]; // Lighter red
  } else if (pct <= 0.7) {
    const interPct = (pct - 0.3) / 0.4; // Normalize pct to range [0, 1] for the orange transition
    startColor = [
      255,
      Math.round(85 + interPct * (170 - 85)), // Transition from lighter red to green
      0,
    ];
    endColor = [255 - startColor[0], 255 - startColor[1], 255 - startColor[2]];
  } else {
    startColor = [85, 255, 85]; // Lighter green
    endColor = [0, 128, 0]; // Deep green
  }

  return {
    start: `rgb(${startColor[0]}, ${startColor[1]}, ${startColor[2]})`,
    end: `rgb(${endColor[0]}, ${endColor[1]}, ${endColor[2]})`,
  };
}

async function fetchAndDisplayData() {
  try {
    const response = await fetch("/.netlify/functions/fetchEnergyData");
    const data = await response.json();

    // Extract the first value from the arrays for the respective wind energy type
    const windOffshoreProduction = data["Wind offshore (MW)"]
      ? data["Wind offshore (MW)"][0]
      : 0;
    const windOnshoreProduction = data["Wind onshore (MW)"]
      ? data["Wind onshore (MW)"][0]
      : 0;

    const totalInstalledPower = windOffshoreCapacity + windOnshoreCapacity;
    const totalProduction = windOffshoreProduction + windOnshoreProduction;
    const utilizationPercentage =
      (totalProduction / (totalInstalledPower * 1000)) * 100;

    // Get current date and time
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
      })
      .replace(/\s(\d+) h/, " $1h"); // Removes space before "h"

    // Updated text display with date and time
    const dataDisplayElement = document.getElementById("dataDisplay");
    const totalProductionInGW = totalProduction / 1000;
    dataDisplayElement.innerHTML = `
    En ce moment, ${formattedDate}, le bon vouloir d'Éole permet à l'ensemble du parc éolien Européen de produire ${totalProductionInGW.toFixed(
      2
    )}&nbsp;GW, sur une capacité installée de ${totalInstalledPower.toFixed(
      2
    )}&nbsp;GW.<br><br>
    ${utilizationPercentage.toFixed(
      2
    )}&nbsp;% de la capacité installée.
`;

    // Set gradient background color based on utilization percentage
    const colors = getGradientColorsForPercentage(utilizationPercentage / 100);
    document.body.style.background = `linear-gradient(135deg, ${colors.start}, ${colors.end})`;
  } catch (error) {
    console.error("Failed to fetch and display data", error);
  }
}

window.onload = fetchAndDisplayData;
