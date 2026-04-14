import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
  Stack,
  Chip
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const PayslipCard = ({ onView, payslips = [] }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        background: theme.palette.background.paper,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background Icon */}
      <Box
        sx={{
          position: "absolute",
          top: -15,
          right: -15,
          opacity: 0.1,
          transform: "rotate(20deg)"
        }}
      >
        <AttachMoneyIcon sx={{ fontSize: 100, color: "success.main" }} />
      </Box>

      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: "success.dark",
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <AttachMoneyIcon fontSize="small" /> My Payslips
        </Typography>

        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Quickly access your monthly salary statements and tax documents.
          </Typography>

          {/* 🔥 NEW: Multi-month chips */}
          {payslips.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {payslips.slice(0, 3).map((slip, index) => (
                <Chip
                  key={index}
                  label={`${new Date(0, slip.month - 1).toLocaleString("default", {
                    month: "short"
                  })} ${slip.year}`}
                  onClick={() => onView(slip)}
                  clickable
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: "bold" }}
                />
              ))}
            </Stack>
          )}

          {/* 🔥 Existing Button (fallback / full view) */}
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={() => onView(payslips[0])} // latest
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none"
            }}
          >
            View Latest Payslip
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PayslipCard;