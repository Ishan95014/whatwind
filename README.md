# Wind Energy Utilization Dashboard

This project visualizes the current wind energy utilization in Europe. The visualization changes color based on the percentage of utilized capacity, ranging from deep red (low utilization) to deep green (high utilization).

The point was to make this in a couple hours to settle a disagreement. It's an instant visualization of the actual live 

## Project Structure

```plaintext
.
├── app.js               # The main JS script that fetches and displays data
├── index.html           # The main HTML page
├── netlify              # Directory containing Netlify specific configurations
│   └── functions
│       └── fetchEnergyData.js   # Serverless function to fetch wind energy data
├── netlify.toml         # Configuration for Netlify deployment
├── package.json         # Project dependencies and metadata
└── styles.css           # Styles for the web page
```

## Acknowledgments

- The Energy Charts team for providing the wind energy data API.
- Netlify for hosting and serverless functions.
