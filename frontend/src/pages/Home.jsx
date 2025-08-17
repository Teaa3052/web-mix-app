// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import background from "../images/background.jpg";
import illustration from "../images/illustration.png";
import question from "../images/question.png";

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 1200,
          width: "100%",
          padding: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 4, md: 6 },
        }}
      >
        {/* Ilustracija */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: { xs: 0, md: 2 },
          }}
        >
          <Box
            component="img"
            src={illustration}
            alt="Graf smjese"
            sx={{
              width: { xs: "100%", sm: "80%", md: "100%" },
              maxWidth: 400,
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Tekst + oblačići */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Kalkulator smjesa
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, maxWidth: 450 }}>
            Jednostavan alat za precizan izračun mješavina prema zadanim parametrima.
          </Typography>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/how-it-works")}
              sx={{
                px: 3,
                py: 2.2,
                minWidth: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Saznaj kako radi
              <Box
                component="img"
                src={question}
                alt="?"
                sx={{ width: 24, height: 24, ml: 1 }}
              />
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/simple-mix")}
              sx={{
                px: 3,
                py: 1.5,
                minWidth: 220,
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                mt: isMobile ? 2 : 0,
              }}
            >
              Jednostavni račun smjese
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                Za miješanje 2 istovrsnih komponenti
              </Typography>
            </Button>

            <Button
              variant="outlined"
              sx={{
                px: 3,
                py: 1.5,
                minWidth: 220,
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                mt: isMobile ? 2 : 0,
              }}
            >
              Složeni račun smjese
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                Za miješanje 3 ili više istovrsnih komponenti
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}