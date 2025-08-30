import { API_BASE_URL } from "../config/api";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MixPieChart from "../components/MixPieChart";


export default function SimpleMixForm() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [m, setM] = useState("");
  const [S, setS] = useState("");

  const [unitConcentration, setUnitConcentration] = useState("");
  const [unitQuantity, setUnitQuantity] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const parsedA1 = parseFloat(a1);
    const parsedA2 = parseFloat(a2);
    const parsedM = parseFloat(m);
    const parsedS = parseFloat(S);

    if (
      isNaN(parsedA1) ||
      isNaN(parsedA2) ||
      isNaN(parsedM) ||
      isNaN(parsedS)
    ) {
      setError("Molimo unesite ispravne numeričke vrijednosti.");
      return;
    }

    if (unitConcentration.trim() === "" || unitQuantity.trim() === "") {
      setError("Molimo unesite obje mjerne jedinice.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/mix/simple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          a1: parsedA1,
          a2: parsedA2,
          m: parsedM,
          S: parsedS,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Greška prilikom izračuna.");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Došlo je do greške prilikom slanja zahtjeva.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
      }}
    >
      <Card sx={{ maxWidth: 800, width: "100%", p: 3 }}>
        <CardContent>
          <Typography variant="h3" align="center" gutterBottom>
            Jednostavni račun smjese
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              mt: 1,
            }}
          >
            <TextField
              label="Intenzitet prve komponente"
              value={a1}
              onChange={(e) => setA1(e.target.value)}
              fullWidth={false}
              margin="dense"
              placeholder="a₁ "
              sx={{ maxWidth: 400, width: "100%" }}
            />
            <TextField
              label="Intenzitet druge komponente"
              value={a2}
              onChange={(e) => setA2(e.target.value)}
              fullWidth
              margin="dense"
              placeholder="a₂ "
              sx={{ maxWidth: 400, width: "100%" }}
            />
            <TextField
              label="Željeni prosječni intenzitet"
              value={m}
              onChange={(e) => setM(e.target.value)}
              fullWidth
              margin="dense"
              placeholder="m"
              sx={{ maxWidth: 400, width: "100%" }}
            />
            <TextField
              label="Mjerna oznaka komponenti"
              value={unitConcentration}
              onChange={(e) => setUnitConcentration(e.target.value)}
              fullWidth
              margin="dense"
              sx={{ maxWidth: 400, width: "100%" }}
            />
            <TextField
              label="Ukupna količina smjese"
              value={S}
              onChange={(e) => setS(e.target.value)}
              fullWidth
              margin="dense"
              placeholder="S"
              sx={{ maxWidth: 400, width: "100%" }}
            />
            <TextField
              label="Mjerna oznaka za količinu"
              value={unitQuantity}
              onChange={(e) => setUnitQuantity(e.target.value)}
              fullWidth
              margin="dense"
              sx={{ maxWidth: 400, width: "100%" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ maxWidth: 200, width: "100%", backgroundColor: "#1B5FC5"  }}
              fullWidth
            >
              Izračunaj
            </Button>
          </Box>

          <Button variant="compact" onClick={goHome}>
          <ArrowBackIcon sx={{ mr: 1, fontSize: 18 }} />
          <Typography variant="button">Početna</Typography>
          </Button>




          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box sx={{ mt: 3 }}>
              <Typography>
                Ukoliko želimo dobiti {S}{unitQuantity} smjese s prosječnim intenzitetom{" "}
                {m}{unitConcentration}, potrebno je miješati{" "}
                {result.quantities_formatted?.[0]}{unitQuantity}
                {" "}prve komponente s intenzitetom{" "}
                {a1}{unitConcentration}{" "}i{" "}
                {result.quantities_formatted?.[1]}{unitQuantity}{" "}
                druge komponente s intenzitetom {a2}{unitConcentration}.
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Omjer u tom slučaju iznosi {result.simplified_ratio}.
              </Typography>

              <Typography sx={{ mt: 1 }}>Grafički prikaz rješenja:</Typography>
              <MixPieChart
                data={[
                  {
                    name: "Prva komponenta",
                    value: parseFloat(result.quantities_formatted?.[0]),
                    formatted: result.quantities_formatted?.[0],
                  },
                  {
                    name: "Druga komponenta",
                    value: parseFloat(result.quantities_formatted?.[1]),
                    formatted: result.quantities_formatted?.[1],
                  },
                ]}
                unit={unitQuantity}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}