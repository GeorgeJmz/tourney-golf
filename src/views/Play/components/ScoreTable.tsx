import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

interface IScoreTableProps {
  currentTeeBoxDisplayName: string;
  currentDistance: Array<number>;
  currentHcp: Array<number>;
  currentPar: Array<number>;
  authorScores: Array<number>;
  currentOut: number;
  currentIn: number;
  currentTotal: number;
  onOpenModal: (key: number) => void;
}

export const ScoreTable: React.FC<IScoreTableProps> = ({
  currentTeeBoxDisplayName,
  currentDistance,
  currentHcp,
  currentPar,
  authorScores,
  currentOut,
  currentIn,
  currentTotal,
  onOpenModal,
}) => {
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const StyledTableRowSpecial = styled(TableRow)(({ theme }) => ({
    "& > td, & > th": {
      border: 0,
      backgroundColor: theme.palette.action.active,
      color: theme.palette.background.paper,
    },
  }));

  type scoreTableTotals = {
    [key: string]: number;
  };

  const totals: scoreTableTotals = {
    OUT: currentDistance.slice(0, 9).reduce((a, b) => a + b, 0),
    IN: currentDistance.slice(9, 18).reduce((a, b) => a + b, 0),
    TOT: currentDistance.slice(0, 18).reduce((a, b) => a + b, 0),
  };

  const pars: scoreTableTotals = {
    OUT: currentPar.slice(0, 9).reduce((a, b) => a + b, 0),
    IN: currentPar.slice(9, 18).reduce((a, b) => a + b, 0),
    TOT: currentPar.slice(0, 18).reduce((a, b) => a + b, 0),
  };

  const getSpecialRow = (type: string, value: number) => (
    <StyledTableRowSpecial>
      <TableCell align="center" sx={{ fontWeight: 700 }}>
        {type}
      </TableCell>
      <TableCell align="center">{totals[type]}</TableCell>
      <TableCell align="center"></TableCell>
      <TableCell align="center">{pars[type]}</TableCell>
      <TableCell align="center">{value}</TableCell>
    </StyledTableRowSpecial>
  );

  const cellStyle = (size?: string, isBold?: boolean) => ({
    border: 0.5,
    color: "rgb(118, 118, 118);",
    ...(isBold ? { fontWeight: 700 } : {}),
    ...(size ? { width: size } : {}),
  });

  return (
    <TableContainer
      component={Paper}
      sx={{
        marginBottom: "50px",
      }}
    >
      <Table aria-label="score table" style={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={cellStyle("60px")}>
              Hole
            </TableCell>
            <TableCell align="center" sx={cellStyle("60px")}>
              {currentTeeBoxDisplayName}
            </TableCell>
            <TableCell align="center" sx={cellStyle("60px")}>
              Hcp
            </TableCell>
            <TableCell align="center" sx={cellStyle("60px")}>
              Par
            </TableCell>
            <TableCell align="center" sx={cellStyle("100px")}>
              Score
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentDistance.map((value, key) => {
            const hole = key + 1;
            const distance = value;
            const hcp = currentHcp[key];
            const par = currentPar[key];
            const score = authorScores[key];
            const returnElement = [
              <StyledTableRow>
                <TableCell align="center" sx={cellStyle(undefined, true)}>
                  {hole}
                </TableCell>
                <TableCell align="center" sx={cellStyle()}>
                  {distance}
                </TableCell>
                <TableCell align="center" sx={cellStyle()}>
                  {hcp}
                </TableCell>
                <TableCell align="center" sx={cellStyle()}>
                  {par}
                </TableCell>
                <TableCell align="center" sx={cellStyle()}>
                  <Button
                    type="button"
                    size="large"
                    onClick={() => onOpenModal(key)}
                  >
                    {score || "Enter Score"}
                  </Button>
                </TableCell>
              </StyledTableRow>,
            ];

            if (key === 8) {
              const out = currentOut;
              const specialRow = getSpecialRow("OUT", out);
              returnElement.push(specialRow);
            }
            if (key === 17) {
              const inEl = currentIn;
              const total = currentTotal;
              const specialRowIn = getSpecialRow("IN", inEl);
              const specialRowTotal = getSpecialRow("TOTAL", total);
              returnElement.push(specialRowIn);
              returnElement.push(specialRowTotal);
            }
            return returnElement;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
