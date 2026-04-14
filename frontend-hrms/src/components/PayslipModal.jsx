import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Box,
  Divider,
  useTheme
} from "@mui/material";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PayslipModal = ({ open, onClose, data }) => {
  
  const theme = useTheme();  

  const isDark = theme.palette.mode === "dark";

  const payslipRef = useRef();

  const [isDownloading, setIsDownloading] = useState(false);

  if (!data) return null;

const handleDownloadPDF = async () => {
  const element = payslipRef.current;

  const canvas = await html2canvas(element, {
    scale: 3,
    backgroundColor: "#ffffff",

    onclone: (doc) => {
      const cloned = doc.querySelector("[data-pdf]");

      if (cloned) {
        // force white background
        cloned.style.backgroundColor = "#ffffff";

        // force all text black
        const all = cloned.querySelectorAll("*");
        all.forEach(el => {
          el.style.color = "#000000";
        });
      }
    }
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  pdf.save(`Payslip-${data.month}-${data.year}.pdf`);
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>

      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        PAYSLIP - {data.month}/{data.year}
      </DialogTitle>
    
      <Divider />

      <DialogContent
        sx={{
            backgroundColor: isDownloading ? "#ffffff" : "background.default"
        }}
      >
        <Box
        ref={payslipRef}
        data-pdf
        sx={{
            p: 3,
            backgroundColor: "background.paper", // ✅ theme based
            color: "text.primary"                // ✅ theme based
        }}
        >

          <Typography align="center" mb={2}>
            Official Payslip
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Employee Info */}
          <Box mb={2}>
            <Typography><b>Name:</b> {data.name}</Typography>
            <Typography><b>Role:</b> {data.role}</Typography>
            <Typography>
                <b>Month:</b> {new Date(0, data.month - 1).toLocaleString("default", { month: "long" })}
            </Typography>
            <Typography><b>Year:</b> {data.year}</Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Salary Breakdown */}
          <Stack spacing={1.5}>
            
            <Box display="flex" justifyContent="space-between">
              <Typography>Basic Salary</Typography>
              <Typography>₹{data.basic_salary}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography>Allowance</Typography>
              <Typography>₹{data.allowance || 0}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography>Bonus</Typography>
              <Typography>₹{data.bonus || 0}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography>Deduction ({data.leave_days || 0} days)</Typography>
              <Typography>₹{data.deduction || 0}</Typography>
            </Box>

            <Divider />

            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">Net Salary</Typography>
              <Typography fontWeight="bold">
                ₹{data.final_salary}
              </Typography>
            </Box>

          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleDownloadPDF}
        >
          Download PDF
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default PayslipModal;