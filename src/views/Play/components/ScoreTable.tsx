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
import EditNoteIcon from "@mui/icons-material/EditNote";

interface IScoreTableProps {
  currentTeeBoxDisplayName: string;
  currentDistance: Array<number>;
  currentHcp: Array<number>;
  currentPar: Array<number>;
  authorScores: Array<number>;
  authorDisplayName: string;
  currentOut: number;
  currentIn: number;
  currentTotal: number;
  opponents: {
    scores: Array<number>;
    displayName: string;
    currentOut: number;
    currentIn: number;
    currentTotal: number;
  }[];
  onOpenModal: (key: number) => void;
}

export const ScoreTable: React.FC<IScoreTableProps> = ({
  authorDisplayName,
  currentTeeBoxDisplayName,
  currentDistance,
  currentHcp,
  currentPar,
  authorScores,
  currentOut,
  currentIn,
  currentTotal,
  onOpenModal,
  opponents,
}) => {
  const getOrientation = () => window.screen?.orientation?.type;

  const useScreenOrientation = () => {
    const [orientation, setOrientation] = React.useState(getOrientation());

    const updateOrientation = () => {
      setOrientation(getOrientation());
    };

    React.useEffect(() => {
      window.addEventListener("orientationchange", updateOrientation);
      return () => {
        window.removeEventListener("orientationchange", updateOrientation);
      };
    }, []);

    return orientation;
  };
  const orientation = useScreenOrientation();
  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const isLandscape = () => {
    if (isMobile()) {
      return (
        orientation === "landscape-primary" ||
        orientation === "landscape-secondary"
      );
    }
    return false;
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const stylesLandScape = isLandscape()
    ? { fontSize: "9px", width: "30px", padding: "0px !important" }
    : { padding: "10px !important" };

  const StyledTable = styled(Table)(({ theme }) => ({
    "td, th": {
      ...stylesLandScape,
    },
  }));

  const StyledTableRowSpecial = styled(TableRow)(({ theme }) => ({
    "& > td, & > th": {
      border: 0,
      backgroundColor: theme.palette.action.active,
      color: theme.palette.background.paper,
    },
  }));

  const StyledTableCellSpecial = styled(TableCell)(({ theme }) => ({
    borderLeft: `1px solid ${theme.palette.action.active}`,
    borderRight: `1px solid ${theme.palette.action.active}`,
    textAlign: "center",
    borderBottom: 0,
    backgroundColor: theme.palette.action.active,
    color: theme.palette.background.paper,
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

  const cellStyle = (
    size?: string,
    isBold?: boolean,
    hasBackground?: boolean
  ) => ({
    border: 0.5,
    color: "rgb(118, 118, 118);",
    ...(hasBackground ? { backgroundColor: "rgba(0, 0, 0, 0.04)" } : {}),
    ...(isBold ? { fontWeight: 700 } : {}),
    ...(size ? { width: size } : {}),
  });

  const getDistanceCell = (key: number) => {
    if (key < 9) {
      return currentDistance[key];
    }
    if (key === 9) {
      return totals.OUT;
    }
    if (key <= 18) {
      return currentDistance[key - 1];
    }
    if (key === 19) {
      return totals.IN;
    }
    if (key === 20) {
      return "";
    }
    return 0;
  };

  const getHCPCell = (key: number) => {
    if (key < 9) {
      return currentHcp[key];
    }
    if (key === 9 || key === 19 || key === 20) {
      return "  ";
    }
    if (key <= 18) {
      return currentHcp[key - 1];
    }
    return 0;
  };

  const getParCell = (key: number) => {
    if (key < 9) {
      return currentPar[key];
    }
    if (key === 9) {
      return pars.OUT;
    }
    if (key <= 18) {
      return currentPar[key - 1];
    }
    if (key === 19) {
      return pars.IN;
    }
    if (key === 20) {
      return "";
    }
    return 0;
  };

  const getAuthorCell = (key: number) => {
    if (key < 9) {
      return !isLandscape() ? (
        <Button type="button" size="large" onClick={() => onOpenModal(key)}>
          {authorScores[key] ? (
            <strong>{authorScores[key]}</strong>
          ) : (
            <EditNoteIcon fontSize="small" />
          )}
        </Button>
      ) : authorScores[key] ? (
        <strong>{authorScores[key]}</strong>
      ) : (
        ""
      );
    }
    if (key === 9) {
      return currentOut;
    }
    if (key === 19) {
      return currentIn;
    }
    if (key <= 18) {
      return !isLandscape() ? (
        <Button type="button" size="large" onClick={() => onOpenModal(key - 1)}>
          {authorScores[key - 1] ? (
            <strong>{authorScores[key - 1]}</strong>
          ) : (
            <EditNoteIcon fontSize="small" />
          )}
        </Button>
      ) : authorScores[key - 1] ? (
        <strong>{authorScores[key - 1]}</strong>
      ) : (
        ""
      );
    }
    if (key == 20) {
      return currentTotal;
    }
    return 0;
  };

  const getOpponentCell = (
    key: number,
    opponentScores: Array<number>,
    currentOut: number,
    currentIn: number,
    totals: number
  ) => {
    if (key < 9) {
      return !isLandscape() ? (
        <Button type="button" size="large" onClick={() => onOpenModal(key)}>
          {opponentScores[key] ? (
            <strong>{opponentScores[key]}</strong>
          ) : (
            <EditNoteIcon fontSize="small" />
          )}
        </Button>
      ) : opponentScores[key] ? (
        <strong>{opponentScores[key]}</strong>
      ) : (
        ""
      );
    }
    if (key === 9) {
      return currentOut;
    }
    if (key === 19) {
      return currentIn;
    }
    if (key <= 18) {
      return !isLandscape() ? (
        <Button type="button" size="large" onClick={() => onOpenModal(key - 1)}>
          {opponentScores[key - 1] ? (
            <strong>{opponentScores[key - 1]}</strong>
          ) : (
            <EditNoteIcon fontSize="small" />
          )}
        </Button>
      ) : opponentScores[key - 1] ? (
        <strong>{opponentScores[key - 1]}</strong>
      ) : (
        ""
      );
    }
    if (key == 20) {
      return totals;
    }
    return 0;
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          marginBottom: "50px",
          marginTop: "50px",
        }}
      >
        <StyledTable
          aria-label="score table"
          sx={
            isLandscape()
              ? {
                  tableLayout: "fixed",
                  width: "100%",
                }
              : {}
          }
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={cellStyle("60px", true, true)}
              ></TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                1
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                2
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                3
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                4
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                5
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                6
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                7
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                8
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                9
              </TableCell>
              <StyledTableCellSpecial align="center">
                {!isLandscape() ? "OUT" : "O"}
              </StyledTableCellSpecial>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                10
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                11
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                12
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                13
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                14
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                15
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                16
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                17
              </TableCell>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                18
              </TableCell>
              <StyledTableCellSpecial align="center">
                {!isLandscape() ? "IN" : "I"}
              </StyledTableCellSpecial>
              <StyledTableCellSpecial align="center">
                {!isLandscape() ? "TOTAL" : "T"}
              </StyledTableCellSpecial>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLandscape() && (
              <TableRow>
                <TableCell align="center" sx={cellStyle("60px", true, true)}>
                  {currentTeeBoxDisplayName}
                </TableCell>
                {Array(21)
                  .fill(0)
                  .map((value, key) =>
                    key != 9 && key !== 19 && key !== 20 ? (
                      <TableCell
                        align="center"
                        sx={cellStyle("60px", false, true)}
                      >
                        {getDistanceCell(key)}
                      </TableCell>
                    ) : (
                      <StyledTableCellSpecial>
                        {getDistanceCell(key)}
                      </StyledTableCellSpecial>
                    )
                  )}
              </TableRow>
            )}
            <TableRow>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                HCP
              </TableCell>
              {Array(21)
                .fill(0)
                .map((value, key) =>
                  key != 9 && key !== 19 && key !== 20 ? (
                    <TableCell
                      align="center"
                      sx={cellStyle("60px", false, true)}
                    >
                      {getHCPCell(key)}
                    </TableCell>
                  ) : (
                    <StyledTableCellSpecial>
                      {getHCPCell(key)}
                    </StyledTableCellSpecial>
                  )
                )}
            </TableRow>
            <TableRow>
              <TableCell align="center" sx={cellStyle("60px", true, true)}>
                PAR
              </TableCell>
              {Array(21)
                .fill(0)
                .map((value, key) =>
                  key != 9 && key !== 19 && key !== 20 ? (
                    <TableCell
                      align="center"
                      sx={cellStyle("60px", false, true)}
                    >
                      {getParCell(key)}
                    </TableCell>
                  ) : (
                    <StyledTableCellSpecial>
                      {getParCell(key)}
                    </StyledTableCellSpecial>
                  )
                )}
            </TableRow>
            {opponents.map((opponent) => (
              <TableRow>
                <TableCell align="center" sx={cellStyle("60px", true)}>
                  {opponent.displayName}
                </TableCell>
                {Array(21)
                  .fill(0)
                  .map((value, key) =>
                    key != 9 && key !== 19 && key !== 20 ? (
                      <TableCell align="center" sx={cellStyle()}>
                        {getOpponentCell(
                          key,
                          opponent.scores,
                          opponent.currentOut,
                          opponent.currentIn,
                          opponent.currentTotal
                        )}
                      </TableCell>
                    ) : (
                      <StyledTableCellSpecial>
                        {getOpponentCell(
                          key,
                          opponent.scores,
                          opponent.currentOut,
                          opponent.currentIn,
                          opponent.currentTotal
                        )}
                      </StyledTableCellSpecial>
                    )
                  )}
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="center" sx={cellStyle("60px", true)}>
                {authorDisplayName}
              </TableCell>
              {Array(21)
                .fill(0)
                .map((value, key) =>
                  key != 9 && key !== 19 && key !== 20 ? (
                    <TableCell align="center" sx={cellStyle()}>
                      {getAuthorCell(key)}
                    </TableCell>
                  ) : (
                    <StyledTableCellSpecial>
                      {getAuthorCell(key)}
                    </StyledTableCellSpecial>
                  )
                )}
            </TableRow>
          </TableBody>
        </StyledTable>
      </TableContainer>
      {/* <TableContainer
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
      </TableContainer> */}
    </>
  );
};
