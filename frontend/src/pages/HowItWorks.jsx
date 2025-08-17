// src/pages/HowItWorks.jsx
import React from "react";
import { Box, Paper, Typography, Divider, Button } from "@mui/material";
import MixPieChart from "../components/MixPieChart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function HowItWorks() {

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Paper elevation={3} sx={{ maxWidth: 800, width: "100%", p: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" gutterBottom>
          🧮 Kako koristiti kalkulator
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Npr. želimo od alkohola jakosti 70% i 95% napraviti mješavinu od 230
          litara jakosti 85%.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Koraci:
        </Typography>
        <Typography variant="body1">
          1. Upiši vrijednost prve komponente (a₁) – 70
          <br />
          2. Upiši vrijednost druge komponente (a₂) – 95
          <br />
          3. Upiši željeni prosječni intenzitet (m) – 85
          <br />
          4. Upiši mjernu oznaku komponenti – %
          <br />
          5. Upiši ukupnu količinu smjese (S) – 230
          <br />
          6. Upiši mjernu oznaku za količinu – l
          <br />
          7. Klikni “Izračunaj”
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Rješenje:
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography>
            Ukoliko želimo dobiti 230l smjese s prosječnim intenzitetom 85%,
            potrebno je miješati 92.00l prve komponente s intenzitetom 70% i
            138.00l druge komponente s intenzitetom 95%.
          </Typography>

          <Typography sx={{ mt: 1 }}>
            Omjer u tom slučaju iznosi 2 : 3.
          </Typography>
          <Typography sx={{ mt: 1 }}>Grafički prikaz rješenja:</Typography>

          <MixPieChart
            data={[
              { name: "Prva komponenta", value: 92, formatted: "92.00" },
              { name: "Druga komponenta", value: 138, formatted: "138.00" },
            ]}
            unit="l"
          />
        </Box>
        <Button variant="compact" onClick={goHome}>
          <ArrowBackIcon sx={{ mr: 1, fontSize: 18 }} />
          <Typography variant="button">Početna</Typography>
        </Button>
      </Paper>
    </Box>
  );
}