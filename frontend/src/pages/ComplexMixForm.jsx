// src/pages/ComplexMixForm.jsx
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
  FormControl,
  ButtonGroup,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MixPieChart from "../components/MixPieChart";

export default function ComplexMixForm() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  // State for components (starting with 3 components)
  const [components, setComponents] = useState([
    { intensity: "", priority: 1 },
    { intensity: "", priority: 2 },
    { intensity: "", priority: 3 },
  ]);
  
  const [totalAmount, setTotalAmount] = useState("");
  const [desiredIntensity, setDesiredIntensity] = useState("");
  const [mixType, setMixType] = useState("standard");
  const [unitConcentration, setUnitConcentration] = useState("");
  const [unitQuantity, setUnitQuantity] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const addComponent = () => {
    setComponents([
      ...components,
      { 
        intensity: "", 
        priority: components.length + 1 
      },
    ]);
  };

  const removeComponent = (index) => {
    if (components.length > 3) {
      const newComponents = components.filter((_, i) => i !== index);
      setComponents(newComponents);
    }
  };

  const updateComponent = (index, field, value) => {
    const newComponents = [...components];
    newComponents[index][field] = value;
    setComponents(newComponents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const parsedTotalAmount = parseFloat(totalAmount);
    const parsedDesiredIntensity = parseFloat(desiredIntensity);

    if (isNaN(parsedTotalAmount) || parsedTotalAmount <= 0) {
      setError("Molimo unesite ispravne numeričke vrijednosti za ukupnu količinu.");
      return;
    }

    if (isNaN(parsedDesiredIntensity)) {
      setError("Molimo unesite ispravnu numeričku vrijednost za željeni intenzitet.");
      return;
    }

    if (unitConcentration.trim() === "" || unitQuantity.trim() === "") {
      setError("Molimo unesite obje mjerne jedinice.");
      return;
    }

    // Validate components
    for (let i = 0; i < components.length; i++) {
      const comp = components[i];
      if (!comp.intensity || isNaN(parseFloat(comp.intensity))) {
        setError(`Molimo unesite ispravnu numeričku vrijednost intenziteta za komponentu ${i + 1}.`);
        return;
      }
      if (mixType === "priority" && (!comp.priority || comp.priority < 1)) {
        setError(`Molimo unesite ispravan prioritet za komponentu ${i + 1}.`);
        return;
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/mix/complex`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          components: components.map((comp, i) => ({
            name: `Komponenta ${i + 1}`,
            intensity: parseFloat(comp.intensity),
            priority: mixType === "priority" ? parseInt(comp.priority) : undefined
          })),
          total_amount: parsedTotalAmount,
          desired_intensity: parsedDesiredIntensity,
          mix_type: mixType,
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
            Složeni račun smjese
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
            {/* Mix Type Selection */}
            <FormControl
              component="fieldset"
              sx={{
                maxWidth: 400,
                width: "100%",
                mb: 2,
                alignItems: "center",
              }}
            >
              <ButtonGroup>
                <Button
                  variant={mixType === "standard" ? "contained" : "outlined"}
                  onClick={() => setMixType("standard")}
                >
                  Standardno
                </Button>
                <Button
                  variant={mixType === "priority" ? "contained" : "outlined"}
                  onClick={() => setMixType("priority")}
                >
                  Prioritetno
                </Button>
              </ButtonGroup>
            </FormControl>

            {/* Components */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Komponente smjese:
            </Typography>
            
            {components.map((component, index) => (
              <Box key={index} sx={{ maxWidth: 400, width: "100%", mb: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2 }}>
                    Komponenta {index + 1}:
                  </Typography>
                  {components.length > 3 && (
                    <IconButton
                      onClick={() => removeComponent(index)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                
                <TextField
                  label="Intenzitet komponente"
                  value={component.intensity}
                  onChange={(e) => updateComponent(index, "intensity", e.target.value)}
                  fullWidth
                  margin="dense"
                  placeholder={`a${index + 1}`}
                />

                {mixType === "priority" && (
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Prioritet</InputLabel>
                    <Select
                      value={component.priority}
                      label="Prioritet"
                      onChange={(e) => updateComponent(index, "priority", e.target.value)}
                    >
                      {[...Array(components.length)].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          Prioritet {i + 1} {i === 0 ? "(najviši)" : i === components.length - 1 ? "(najniži)" : ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            ))}

            <Button
              onClick={addComponent}
              startIcon={<AddIcon />}
              variant="outlined"
              sx={{ maxWidth: 400, width: "100%", mb: 2 }}
            >
              Dodaj komponentu
            </Button>

            <TextField
              label="Željeni prosječni intenzitet"
              value={desiredIntensity}
              onChange={(e) => setDesiredIntensity(e.target.value)}
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
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
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
              sx={{ maxWidth: 200, width: "100%", backgroundColor: "#1B5FC5" }}
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
                Za {totalAmount}{unitQuantity} smjese korištenjem {result.mix_type === "standard" ? "standardnog" : "prioritetnog"} miješanja, potrebno je:
              </Typography>

              {result.components.map((comp, index) => (
                <Typography key={index} sx={{ mt: 1, ml: 2 }}>
                  • {comp.name}: {comp.quantity_formatted}{unitQuantity} (intenzitet: {comp.intensity}{unitConcentration})
                  {comp.priority && ` - prioritet: ${comp.priority}`}
                </Typography>
              ))}

              <Typography sx={{ mt: 1 }}>
                Omjer komponenti iznosi {result.simplified_ratio}.
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Prosječni intenzitet smjese: {result.average_intensity}{unitConcentration}.
              </Typography>

              <Typography sx={{ mt: 1 }}>Grafički prikaz rješenja:</Typography>
              <MixPieChart
                data={result.components.map(comp => ({
                  name: comp.name,
                  value: parseFloat(comp.quantity_formatted),
                  formatted: comp.quantity_formatted,
                }))}
                unit={unitQuantity}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}