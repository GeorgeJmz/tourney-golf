import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

export interface MatrizMatch {
  date: string;
  score: number;
  gross: number;
  hcp: number;
  net: number;
}

export interface MatrizValuesProps {
  matrizValues: {
    leagueName: string;
    data: {
      [key: string]: {
        [key: string]: MatrizMatch[];
      };
    };
    names: {
      conferenceName: string;
      results: { [key: string]: string };
    }[];
  };
}

const Matriz: React.FC<MatrizValuesProps> = ({ matrizValues }) => {
  console.log("MatrizValues", matrizValues);
  const playerEmails = Object.keys(matrizValues.data);
  const leagueName = matrizValues.leagueName;
  const sxCell = {
    border: "1px solid #8d8d8d",
    color: "rgb(118, 118, 118);",
    width: 80,
    height: 50,
    padding: "5px",
    textAlign: "center",
    lineHeight: "1",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {matrizValues.names.map((conference) => (
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 2,
            height: "304px",
          }}
        >
          <Table
            sx={{
              minWidth: 650,
              transform: "scale(0.2)",
              transformOrigin: "top left",
              marginBottom: "calc((0.2 - 1) * 100%)",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    textAlign: "center",
                    border: "1px solid #8d8d8d",
                  }}
                >
                  <Typography>{conference.conferenceName}</Typography>{" "}
                </TableCell>
                {Object.keys(conference.results).map((email) => (
                  <TableCell
                    key={email}
                    sx={{
                      textAlign: "center",
                      border: "1px solid #8d8d8d",
                    }}
                  >
                    {conference.results[email]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(conference.results).map((email1) => (
                <TableRow
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#f3f3f3",
                    },
                  }}
                  key={email1}
                >
                  <TableCell
                    sx={{
                      border: "1px solid #8d8d8d",
                      padding: "5px",
                      textAlign: "center",
                      lineHeight: "1",
                      maxWidth: 150,
                    }}
                  >
                    {conference.results[email1]}
                  </TableCell>
                  {Object.keys(conference.results).map((email2) => (
                    <TableCell
                      sx={{
                        border: "1px solid #8d8d8d",
                        padding: "0",
                        textAlign: "center",
                        lineHeight: "1",
                        width: 150,
                        height: 50,
                      }}
                      key={email2}
                    >
                      <Box>
                        {matrizValues.data[email1]?.[email2] && (
                          <Table
                            sx={{
                              width: 150,
                            }}
                          >
                            <TableBody>
                              <TableRow>
                                <TableCell sx={sxCell} colSpan={2}>
                                  {
                                    matrizValues.data[email1]?.[email2]?.[1]
                                      .date
                                  }
                                </TableCell>
                                <TableCell sx={sxCell}>
                                  {
                                    matrizValues.data[email1]?.[email2]?.[1]
                                      .net
                                  }
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={sxCell}>
                                  {
                                    matrizValues.data[email1]?.[email2]?.[1]
                                      .gross
                                  }
                                </TableCell>
                                <TableCell sx={sxCell}>
                                  {matrizValues.data[email1]?.[email2]?.[1].hcp}
                                </TableCell>
                                <TableCell sx={sxCell}>
                                  {matrizValues.data[email1]?.[email2]?.[1].score}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        )}
                        {/* {matrizValues.data[email1]?.[email2]?.map(
                          (match, index) => (
                            <Table
                              sx={{
                                width: 150,
                              }}
                            >
                              <TableBody>
                                <TableRow>
                                  <TableCell sx={sxCell}>
                                    {match.gross}
                                  </TableCell>
                                  <TableCell sx={sxCell}>{match.hcp}</TableCell>
                                  <TableCell sx={sxCell}>
                                    {match.score}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          )
                        )} */}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            {/* <TableBody>
                {playerEmails.map((email1) => (
                  <TableRow key={email1}>
                    <TableCell>{matrizValues.names[email1]}</TableCell>
                    {playerEmails.map((email2) => (
                      <TableCell key={email2}>
                        <Box>
                          {matrizValues.data[email1]?.[email2]?.map(
                            (match, index) => (
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell sx={sxCell}>{match.gross}</TableCell>
                                    <TableCell sx={sxCell}>{match.hcp}</TableCell>
                                    <TableCell sx={sxCell}>{match.score}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            )
                          )}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody> */}
          </Table>
        </TableContainer>
      ))}
    </Box>
  );
};

export default Matriz;
