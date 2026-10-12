import React, { useState, useRef, useEffect } from "react";
import { SelectInput } from "../../../../components/SelectInput";
import Box from "@mui/material/Box";
import { IPlayer } from "../../../../models/Tournament";
import { ITournamentElement } from "../../../../helpers/getTournamentFields";
import { Button, Typography, Modal } from "@mui/material";
import html2canvas from "html2canvas";
import { uploadIMGData } from "../../../../services/firebase";

interface SimplePlayOffsProps {
  players: Partial<IPlayer>[];
  numberOfPreviousPlayers?: number;
  previousPlayers?: { [key: string]: string };
  previousMatches?: { [key: string]: string[] };
  onSaveBracket: (
    brackets: { [key: string]: string },
    matches: { [key: string]: string[] },
    numberOfPlayers: number
  ) => void;
  exportMatrix?: {
    name: string;
    emails: string[];
  };
  readOnly?: boolean;
}

const getInputElement = (
  name: string,
  placeholder: string,
  options: {
    displayName: string;
    value: string;
  }[]
) =>
  ({
    name,
    placeholder,
    input: "select",
    size: {
      xs: 12,
      md: 6,
      lg: 4,
    },
    options,
  } as ITournamentElement);

const SimplePlayOffs: React.FC<SimplePlayOffsProps> = ({
  players,
  previousPlayers,
  previousMatches,
  numberOfPreviousPlayers,
  onSaveBracket,
  exportMatrix,
  readOnly,
}) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(
    numberOfPreviousPlayers || 4
  );
  const [selectedPlayers, setSelectedPlayers] = useState<{
    [key: string]: string;
  }>({});

  const [matches, setMatches] = useState<{
    [key: string]: string[];
  }>({});

  const exportRef = useRef<HTMLDivElement>(null);
  const [exported, setExported] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (exported) {
      handleDownloadImage();
    }
  }, [exported]);

  const handleDownloadImage = async () => {
    if (exportRef.current) {
      
      const canvas = await html2canvas(exportRef.current, {
        useCORS: true,
        backgroundColor: "#FFFFFF",
        logging: false, // Evitar logs innecesarios
      });
      
      const dataURL = canvas.toDataURL("image/png");
      const blob = await fetch(dataURL).then((res) => res.blob());
      await uploadIMGData(
        blob,
        exportMatrix?.name || "playoffs",
        exportMatrix?.emails || []
      );
      setExported(false);
      onSaveBracket(selectedPlayers, matches, numberOfPlayers);
    } else {
      console.error("Element for export not found");
    }
  };


  // Initialize state with previous data
  React.useEffect(() => {
    console.log("SimplePlayOffs - Initializing with previous data:");
    console.log("previousPlayers:", previousPlayers);
    console.log("previousMatches:", previousMatches);
    console.log("numberOfPreviousPlayers:", numberOfPreviousPlayers);

    if (numberOfPreviousPlayers && numberOfPreviousPlayers > 0) {
      setNumberOfPlayers(numberOfPreviousPlayers);
    }

    if (previousPlayers && Object.keys(previousPlayers).length > 0) {
      setSelectedPlayers(previousPlayers);
    }

    if (previousMatches && Object.keys(previousMatches).length > 0) {
      setMatches(previousMatches);
    }
  }, [previousPlayers, previousMatches, numberOfPreviousPlayers]);

  // Debug logs for state changes
  React.useEffect(() => {
    console.log("SimplePlayOffs - Current state:");
    console.log("numberOfPlayers:", numberOfPlayers);
    console.log("selectedPlayers:", selectedPlayers);
    console.log("matches:", matches);
  }, [numberOfPlayers, selectedPlayers, matches]);

  const playerOptions = players.map((player) => ({
    displayName: player.name || "",
    value: player.id || "",
  }));

  const handlePlayerChange = (key: string, value: string, previous: string) => {
    setSelectedPlayers((prev) => ({ ...prev, [key]: value }));

    // Update matches history
    setMatches((prev) => ({
      ...prev,
      [key]: prev[key]
        ? [...prev[key].filter((a) => a !== previous), value]
        : [value],
    }));
  };

  const generateRounds = (numPlayers: number) => {
    const rounds = [];
    let currentPlayers = numPlayers;
    let roundNumber = 1;

    while (currentPlayers > 1) {
      let roundName = "";
      let roundPrefix = "";
      let previousRound = "";

      if (currentPlayers === 2) {
        roundName = "Finals";
        roundPrefix = "F";
        previousRound = "S";
      } else if (currentPlayers === 4) {
        roundName = "Semifinals";
        roundPrefix = "S";
        previousRound = "Q";
      } else if (currentPlayers === 8) {
        roundName = "Quarterfinals";
        roundPrefix = "Q";
        previousRound = "A";
      } else if (currentPlayers === 16) {
        roundName = "Round A";
        roundPrefix = "A";
        previousRound = "B";
      } else if (currentPlayers === 32) {
        roundName = "Round B";
        roundPrefix = "B";
        previousRound = "C";
      } else if (currentPlayers === 64) {
        roundName = "Round C";
        roundPrefix = "C";
        previousRound = "";
      } else {
        roundName = `Round ${roundNumber}`;
        roundPrefix = `R${roundNumber}`;
      }

      if (numberOfPlayers === currentPlayers) {
        previousRound = "";
      }
      const matchesInRound = [];
      const numMatches = Math.ceil(currentPlayers / 2);

      for (let i = 0; i < numMatches; i++) {
        matchesInRound.push({
          id: `${roundPrefix}${i + 1}`,
          name: `${roundPrefix}${i + 1}`,
          roundName,
          player1Id: `${roundPrefix}${i + 1}_player1`,
          player2Id: `${roundPrefix}${i + 1}_player2`,
        });
      }

      rounds.push({
        name: roundName,
        prefix: roundPrefix,
        previousRound,
        matches: matchesInRound,
      });

      currentPlayers = Math.ceil(currentPlayers / 2);
      roundNumber++;
    }

    return rounds; // Keep ascending order (Round C → Round B → Round A → Quarterfinals → Semifinals → Finals)
  };

  const rounds = generateRounds(numberOfPlayers);

  const availablePlayerOptions = [
    { displayName: "Bye", value: "Bye" },
    ...playerOptions,
  ];

  // Nuevo contador global para los jugadores
  let playerCounter = 1;

  const getPlaceHolder = (round: { previousRound: string }, index: number) => {
    const hasPreviousRound = round.previousRound !== "";
    if (!hasPreviousRound) {
      // En la primera ronda del torneo, los placeholders son secuenciales.
      const playerPlaceholder = "Player " + playerCounter;
      playerCounter++;
      return playerPlaceholder;
    }
    // En las rondas posteriores, se hace referencia a la ronda anterior.
    return round.previousRound + index;
  };

  // Restablecer el contador cada vez que el componente se renderiza.
  playerCounter = 1;

  return (
    <Box sx={{ backgroundColor: "white", }}>
      {!readOnly && (
        <Box sx={{ mb: 3, backgroundColor: "white", }}>
          <SelectInput
            inputElement={getInputElement(
              "numberOfPlayers",
              "Number of players in playoffs",
              [2, 4, 8, 16, 32, 64].map((num) => ({
                displayName: num.toString(),
                value: num.toString(),
              }))
            )}
            isError={false}
            onChangeHandler={(e) => {
              const value = parseInt(e.target.value);
              setNumberOfPlayers(value);
              // Reset selections when changing number of players
              setSelectedPlayers({});
              setMatches({});
            }}
            value={numberOfPlayers.toString()}
            error={""}
          />
        </Box>
      )}

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 3, backgroundColor: "white", }}
        ref={exportRef}
      >
        {rounds.map((round) => (
          <Box key={round.name} sx={{ p: 3, backgroundColor: "white", }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, backgroundColor: "white", }}>
              {round.name}
            </Typography>
            <Box
              sx={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
                gap: 2, // reducir espacio entre tarjetas para que quepan 2 por fila
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {round.matches.map((match, index) => (
                <Box
                  key={match.id}
                  sx={{
                    // Mostrar 2 matches por renglón manteniendo el tamaño de los selects
                    flex: { xs: "1 1 100%", sm: "1 1 48%" },
                    maxWidth: { xs: "100%", sm: "48%" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ minWidth: "40px", fontWeight: "bold" , backgroundColor: "white", }}
                  >
                    {match.name}
                  </Typography>
                  <Box sx={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    border: "1px solid #ccc",
                    padding: 1, // antes 2; reduce ~16px de ancho total
                    borderRadius: 2,
                  }}>
                    <Box sx={{ width: "220px", backgroundColor: "white", }}>
                      {readOnly ? (
                        <Typography
                          variant="body2"
                          sx={{
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "white",
                            minHeight: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "500"
                          }}
                        >
                          {(() => {
                            const playerId = selectedPlayers[match.player1Id];
                            const player = players.find(p => p.id === playerId);
                            return player?.name || getPlaceHolder(round, index * 2 + 1);
                          })()}
                        </Typography>
                      ) : exported ? (
                        <Typography
                          variant="body2"
                          sx={{
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "white",
                            minHeight: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "500"
                          }}
                        >
                          {(() => {
                            const playerId = selectedPlayers[match.player1Id];
                            const player = players.find(p => p.id === playerId);
                            return player?.name || getPlaceHolder(round, index * 2 + 1);
                          })()}
                        </Typography>
                      ) : (
                        <SelectInput
                          inputElement={getInputElement(
                            match.player1Id,
                            getPlaceHolder(round, index * 2 + 1), // Usa la función actualizada
                            availablePlayerOptions
                          )}
                          isError={false}
                          onChangeHandler={(e) => {
                            const previous = selectedPlayers[match.player1Id] || "";
                            handlePlayerChange(
                              match.player1Id,
                              e.target.value,
                              previous
                            );
                          }}
                          value={selectedPlayers[match.player1Id] || ""}
                          error={""}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", mx: 0.5, backgroundColor: "white", }}
                    >
                      VS
                    </Typography>
                    <Box sx={{ width: "220px", backgroundColor: "white", }}>
                      {readOnly ? (
                        <Typography
                          variant="body2"
                          sx={{
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "white",
                            minHeight: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "500"
                          }}
                        >
                          {(() => {
                            const playerId = selectedPlayers[match.player2Id];
                            const player = players.find(p => p.id === playerId);
                            return player?.name || getPlaceHolder(round, index * 2 + 2);
                          })()}
                        </Typography>
                      ) : exported ? (
                        <Typography
                          variant="body2"
                          sx={{
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "white",
                            minHeight: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "500"
                          }}
                        >
                          {(() => {
                            const playerId = selectedPlayers[match.player2Id];
                            const player = players.find(p => p.id === playerId);
                            return player?.name || getPlaceHolder(round, index * 2 + 2);
                          })()}
                        </Typography>
                      ) : (
                        <SelectInput
                          inputElement={getInputElement(
                            match.player2Id,
                            getPlaceHolder(round, index * 2 + 2), // Usa la función actualizada
                            availablePlayerOptions
                          )}
                          isError={false}
                          onChangeHandler={(e) => {
                            const previous = selectedPlayers[match.player2Id] || "";
                            handlePlayerChange(
                              match.player2Id,
                              e.target.value,
                              previous
                            );
                          }}
                          value={selectedPlayers[match.player2Id] || ""}
                          error={""}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {!readOnly && (
        <Box sx={{ mt: 3, display: "flex", gap: 2, backgroundColor: "white" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onSaveBracket(selectedPlayers, matches, numberOfPlayers);
            }}
          >
            Save Playoffs
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => setExported(true)}
          >
            Save & Send Email
          </Button>
          {/* <Button
            variant="outlined"
            color="secondary"
            onClick={handlePreviewImage}
          >
            Preview Image
          </Button> */}
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setSelectedPlayers({});
              setMatches({});
              onSaveBracket({}, {}, 0);
            }}
          >
            Reset
          </Button>
        </Box>
      )}
      <Modal
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        aria-labelledby="preview-modal-title"
        aria-describedby="preview-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <img
            src={previewImage || ""}
            alt="Playoff Preview"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default SimplePlayOffs;
