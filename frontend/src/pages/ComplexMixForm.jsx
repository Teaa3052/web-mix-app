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
  IconButton,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MixPieChart from "../components/MixPieChart";

export default function ComplexMixForm() {
  const navigate = useNavigate();

  // State for components (starting with 3 components)
  const [components, setComponents] = useState([
    { intensity: "" },
    { intensity: "" },
    { intensity: "" },
  ]);
  
  const [totalAmount, setTotalAmount] = useState("");
  const [desiredIntensity, setDesiredIntensity] = useState("");
  const [unitConcentration, setUnitConcentration] = useState("");
  const [unitQuantity, setUnitQuantity] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Helper function to convert number to ordinal word
  const getOrdinalWord = (index) => {
    const ordinals = ['prve', 'druge', 'treće', 'četvrte'];
    return ordinals[index] || `${index + 1}.`;
  };

  // Helper function for calculating average intensity
  const calculateAvgIntensity = (quantities) => {
    const totalWeighted = quantities.reduce((sum, qty, index) => 
      sum + (qty * parseFloat(components[index]?.intensity || 0)), 0);
    const totalQty = quantities.reduce((sum, qty) => sum + qty, 0);
    return totalWeighted / totalQty;
  };

  const addComponent = () => {
    if (components.length < 4) {
      setComponents([...components, { intensity: "" }]);
    }
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

  const validateInputs = () => {
    const parsedTotalAmount = parseFloat(totalAmount);
    const parsedDesiredIntensity = parseFloat(desiredIntensity);

    if (isNaN(parsedTotalAmount) || parsedTotalAmount <= 0) {
      setError("Molimo unesite ispravnu numeričku vrijednost za ukupnu količinu.");
      return false;
    }

    if (isNaN(parsedDesiredIntensity)) {
      setError("Molimo unesite ispravnu numeričku vrijednost za željeni intenzitet.");
      return false;
    }

    if (!unitConcentration.trim() || !unitQuantity.trim()) {
      setError("Molimo unesite obje mjerne jedinice.");
      return false;
    }

    // Validate components
    for (let i = 0; i < components.length; i++) {
      const comp = components[i];
      if (!comp.intensity || isNaN(parseFloat(comp.intensity))) {
        setError(`Molimo unesite ispravnu numeričku vrijednost intenziteta za komponentu ${i + 1}.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!validateInputs()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/mix/complex`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          components: components.map((comp, i) => ({
            name: `Komponenta ${i + 1}`,
            intensity: parseFloat(comp.intensity)
          })),
          total_amount: parseFloat(totalAmount),
          desired_intensity: parseFloat(desiredIntensity),
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

  const renderSingleSolution = () => (
    <Box>
      <Typography sx={{ mt: 1 }}>
        Ukoliko želimo dobiti {totalAmount}{unitQuantity} smjese s prosječnim intenzitetom {desiredIntensity}{unitConcentration}, potrebno je miješati:
      </Typography>
      
      {result.components.map((comp, index) => (
        <Typography key={index} sx={{ mt: 0.5, ml: 2 }}>
          • {comp.quantity_formatted}{unitQuantity} {getOrdinalWord(index)} istovrsne komponente s intenzitetom {comp.intensity}{unitConcentration}
        </Typography>
      ))}

      <Typography sx={{ mt: 1 }}>
        Omjer u tom slučaju iznosi {result.simplified_ratio}.
      </Typography>

      <Typography sx={{ mt: 1 }}>
        Grafički prikaz rješenja:
      </Typography>
      <MixPieChart
        data={result.components.map(comp => ({
          name: comp.name,
          value: parseFloat(comp.quantity_formatted),
          formatted: comp.quantity_formatted,
        }))}
        unit={unitQuantity}
      />
    </Box>
  );

  const renderMultipleSolutions = () => (
    <Box>
      {result.method_details.all_solutions.map((solution, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            {solution.combination_used}
          </Typography>
          
          <Typography sx={{ mt: 1 }}>
            Ukoliko želimo dobiti {totalAmount}{unitQuantity} smjese s prosječnim intenzitetom {desiredIntensity}{unitConcentration}, potrebno je miješati:
          </Typography>
          
          {solution.quantities.map((quantity, compIndex) => (
            <Typography key={compIndex} sx={{ mt: 0.5, ml: 2 }}>
              • {quantity.toFixed(2)}{unitQuantity} {getOrdinalWord(compIndex)} istovrsne komponente s intenzitetom {components[compIndex]?.intensity}{unitConcentration}
            </Typography>
          ))}
          
          <Typography sx={{ mt: 1 }}>
            Omjer u tom slučaju iznosi {solution.simplified_ratio}.
          </Typography>
          
          <Typography sx={{ mt: 1 }}>
            Grafički prikaz:
          </Typography>
          <MixPieChart
            data={solution.quantities.map((quantity, compIndex) => ({
              name: `Komponenta ${compIndex + 1}`,
              value: quantity,
              formatted: quantity.toFixed(2),
            }))}
            unit={unitQuantity}
          />
        </Paper>
      ))}
    </Box>
  );

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
              </Box>
            ))}

            {components.length < 4 && (
              <Button
                onClick={addComponent}
                startIcon={<AddIcon />}
                variant="outlined"
                sx={{ maxWidth: 400, width: "100%", mb: 2 }}
              >
                Dodaj komponentu
              </Button>
            )}

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
            >
              Izračunaj
            </Button>
          </Box>

          <Button variant="compact" onClick={() => navigate("/")}>
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
              {result.method_details?.all_solutions 
                ? renderMultipleSolutions() 
                : renderSingleSolution()}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}