import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Stack } from "@mui/material";

export default function MixPieChart({ data, unit }) {
  const COLORS = [
    "#5C0029",
    "#857C8D",
    "#61304B",
    "#94BFBE",
    "#7DF29E",
  ];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      mt={2}
      sx={{
        "& svg:focus": {
          outline: "none",
        },
        "& g:focus": {
          outline: "none",
        },
      }}
    >
      <Box sx={{ width: "60%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={ false } 
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                `${parseFloat(value).toFixed(2)} ${unit}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Stack
        direction="column"
        spacing={1}
        sx={{ ml: 4 }}
        justifyContent="center"
      >
        {data.map((entry, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: COLORS[index % COLORS.length],
                borderRadius: "4px",
                mr: 1,
              }}
            />
            <Typography variant="body2">
                {entry.name}: {entry.formatted}{unit}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}