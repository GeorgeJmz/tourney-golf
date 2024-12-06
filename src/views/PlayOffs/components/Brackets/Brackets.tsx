import React, { useEffect, useState } from "react";
import { SelectInput } from "../../../../components/SelectInput";
import Box from "@mui/material/Box";
import { IPlayer } from "../../../../models/Tournament";
import { ITournamentElement } from "../../../../helpers/getTournamentFields";
import { Button } from "@mui/material";
import html2canvas from "html2canvas"; // Install the library
import { uploadIMGData } from "../../../../services/firebase";

interface BracketProps {
  bracketId?: string;
  player1: string;
  player2: string;
  player3?: string;
  winner: string;
  round: number;
  players: Partial<IPlayer>[];
  hideWinner?: boolean;
  onPlayerChange: (key: string, value: string, previous: string) => void;
  selectedPlayers: { [key: string]: string };
  isPlayer?: boolean;
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
      md: 4,
      lg: 4,
    },
    options,
  } as ITournamentElement);

const Bracket = ({
  bracketId,
  player1,
  player2,
  player3,
  winner,
  players,
  hideWinner,
  onPlayerChange,
  selectedPlayers,
  isPlayer,
}: BracketProps) => {
  const playerOptions = players.map((player) => ({
    displayName: player.name || "",
    value: player.id || "",
  }));

  return (
    <Box display={"flex"} alignItems="center" margin={2}>
      <Box>
        {[player1, player2, player3].filter(Boolean).map((player) => {
          if (isPlayer) {
            const selectedPlayer =
              selectedPlayers[`Select${bracketId}player${player}` || ""];
            const cplayer = players.find((p) => p.id === selectedPlayer);
            return (
              <Box border="1px solid black" padding={1} width={250}>
                {cplayer?.name || selectedPlayer || " - "}
              </Box>
            );
          }
          return (
            <Box
              key={`Select${bracketId}player${player}`}
              padding={1}
              width={150}
            >
              <SelectInput
                inputElement={getInputElement(
                  `Select${bracketId}player${player}`,
                  "Player",
                  [{ displayName: "Bye", value: "Bye" }, ...playerOptions]
                )}
                isError={false}
                onChangeHandler={(e) => {
                  console.log(
                    `Select${bracketId}player${player}`,
                    e.target.value
                  );
                  console.log(
                    "previous",
                    selectedPlayers[`Select${bracketId}player${player}`]
                  );
                  onPlayerChange(
                    `Select${bracketId}player${player}`,
                    e.target.value,
                    selectedPlayers[`Select${bracketId}player${player}`]
                  );
                }}
                value={
                  selectedPlayers[`Select${bracketId}player${player}`] || ""
                }
                error={""}
              />
            </Box>
          );
        })}
      </Box>
      {!hideWinner && (
        <Box border="1px solid black" padding={1} width={250} marginLeft={15}>
          {isPlayer ? (
            players.find((p) => p.id === selectedPlayers[winner])?.name || " - "
          ) : (
            <SelectInput
              inputElement={getInputElement(winner, "Player", [
                { displayName: "Bye", value: "Bye" },
                ...playerOptions,
              ])}
              isError={false}
              onChangeHandler={(e) =>
                onPlayerChange(winner, e.target.value, selectedPlayers[winner])
              }
              value={selectedPlayers[winner] || ""}
              error={""}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

interface BracketComponentProps {
  players: Partial<IPlayer>[];
  numberOfPreviousPlayers?: number;
  previousPlayers?: { [key: string]: string };
  previousMatches?: { [key: string]: string[] };
  isPlayer?: boolean;
  onSaveBracket: (
    brackets: { [key: string]: string },
    matches: { [key: string]: string[] },
    numberOfPlayers: number
  ) => void;
  exportMatrix?: {
    name: string;
    emails: string[];
  };
}

const BracketComponent = ({
  players,
  previousPlayers,
  previousMatches,
  numberOfPreviousPlayers,
  onSaveBracket,
  isPlayer,
  exportMatrix,
}: BracketComponentProps) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(
    numberOfPreviousPlayers || 4
  );
  const [selectedPlayers, setSelectedPlayers] = useState<{
    [key: string]: string;
  }>(previousPlayers || {});

  const [matches, setMatches] = useState<{
    [key: string]: string[];
  }>(previousMatches || {});
  const handlePlayerChange = (key: string, value: string) => {
    setSelectedPlayers((prev) => ({ ...prev, [key]: value }));
  };
  const handleOnSetMatches = (key: string, value: string, previous: string) => {
    console.log("previous", previous);
    setMatches((prev) => ({
      ...prev,
      [key]: prev[key]
        ? [...prev[key].filter((a) => a !== previous), value]
        : [value],
    }));
  };

  const generateBrackets = (numPlayers: number) => {
    const brackets = [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < Math.floor(numPlayers / 2); i++) {
      brackets.push({
        player1: `Player${i * 2 + 1}`,
        player2: `Player${i * 2 + 2}`,
        player3: "",
        winner: alphabet[i],
        round: 1,
        players,
        onPlayerChange: handlePlayerChange,
        selectedPlayers,
      });
    }

    if (numPlayers % 2 !== 0) {
      brackets.push({
        player1: `Player${numPlayers}`,
        player2: "",
        player3: "",
        winner: "Bye",
        round: 1,
        players,
        onPlayerChange: handlePlayerChange,
        selectedPlayers,
      });
    }

    return brackets;
  };

  const createTournamentRounds = (brackets: BracketProps[]) => {
    const rounds: BracketProps[][] = [brackets];
    let currentRound = brackets;

    while (currentRound.length > 1) {
      const nextRound: BracketProps[] = [];
      if (currentRound.length === 3) {
        nextRound.push({
          player1: currentRound[0].winner || currentRound[0].player1,
          player2: currentRound[1].winner || currentRound[1].player1,
          player3: currentRound[2].winner || currentRound[2].player1,
          winner: getWinnerText(
            currentRound[0],
            currentRound[1],
            currentRound[2]
          ),
          round: rounds.length + 1,
          players,
          onPlayerChange: handlePlayerChange,
          selectedPlayers,
        });
      } else {
        for (let i = 0; i < currentRound.length; i += 2) {
          if (i + 1 < currentRound.length) {
            nextRound.push({
              player1: currentRound[i].winner || currentRound[i].player1,
              player2:
                currentRound[i + 1].winner || currentRound[i + 1].player1,
              player3: "",
              winner: getWinnerText(currentRound[i], currentRound[i + 1]),
              round: rounds.length + 1,
              players,
              onPlayerChange: handlePlayerChange,
              selectedPlayers,
            });
          } else {
            nextRound.push({
              player1: currentRound[i].winner || currentRound[i].player1,
              player2: "",
              player3: "",
              winner: currentRound[i].winner || `${currentRound[i].player1}`,
              round: rounds.length + 1,
              players,
              onPlayerChange: handlePlayerChange,
              selectedPlayers,
            });
          }
        }
      }
      rounds.push(nextRound);
      currentRound = nextRound;
    }

    return rounds;
  };

  const getWinnerText = (
    bracket1: BracketProps,
    bracket2: BracketProps,
    bracket3?: BracketProps
  ) => {
    const winner1 = bracket1.winner || bracket1.player1;
    const winner2 = bracket2.winner || bracket2.player1;
    let winner3;

    if (bracket3) {
      winner3 = bracket3.winner || bracket3.player1;
      return `${winner1}vs${winner2}vs${winner3}`;
    } else {
      return `${winner1}vs${winner2}`;
    }
  };

  const rounds = createTournamentRounds(generateBrackets(numberOfPlayers));

  let BRB = 0;

  const exportRef = React.useRef<HTMLElement>(null);
  const [exported, setExported] = React.useState(false);

  useEffect(() => {
    if (exported) {
      handleDownloadImage();
    }
  }, [exported]);

  const stylesToExport =
    !exported && numberOfPlayers > 8
      ? {
          transform: "scale(0.5)",
          transformOrigin: "top left",
          marginBottom: "calc((0.5 - 1) * 100%)",
        }
      : {};

  const handleDownloadImage = async () => {
    if (exportRef.current) {
      const elementToCapture = exportRef.current;

      // **1. Calculate total width:**
      const totalWidth = elementToCapture.scrollWidth;

      // **2. Adjust canvas width:**
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = totalWidth;
      canvas.height = elementToCapture.offsetHeight; // Maintain original height

      // **3. Disable scroll and set width for capture:**
      elementToCapture.style.overflow = "hidden";
      elementToCapture.style.width = totalWidth + "px"; // Ensure full width capture

      let left = 0;
      while (left < totalWidth) {
        elementToCapture.scrollLeft = left; // Scroll horizontally

        // **4. Capture each section:**
        const capturedImage = await html2canvas(elementToCapture, {
          scale: 1, // Adjust scale as needed
          useCORS: true,
        });

        context?.drawImage(capturedImage, left, 0);
        left += capturedImage.width; // Update left position for next capture
      }

      // **5. Reset scroll and width:**
      elementToCapture.style.overflow = "auto";
      elementToCapture.style.width = "auto";

      const dataURL = canvas.toDataURL("image/png"); // Change format as needed
      const blob = await fetch(dataURL).then((res) => res.blob());
      await uploadIMGData(
        blob,
        exportMatrix?.name || "bracket",
        exportMatrix?.emails || []
      );
      setExported(false);
      onSaveBracket(selectedPlayers, matches, numberOfPlayers);
    } else {
      console.error("Element for export not found");
    }
  };

  return (
    <Box>
      {!isPlayer && (
        <SelectInput
          inputElement={getInputElement(
            "numberOfPlayers",
            "Number of positions (including byes)",
            [2, 4, 8, 16, 32, 64].map((num) => ({
              displayName: num.toString(),
              value: num.toString(),
            }))
          )}
          isError={false}
          onChangeHandler={(e) => {
            const value = parseInt(e.target.value);
            setNumberOfPlayers(value);
          }}
          value={numberOfPlayers}
          error={""}
        />
      )}
      <Box>
        <Box
          sx={{
            overflow: "auto",
            display: "flex",
          }}
          ref={exportRef}
          id="bracketToExport"
        >
          {rounds.map((round, roundIndex) => (
            <Box key={roundIndex} sx={stylesToExport}>
              <Box
                display={"flex"}
                flexDirection="column"
                justifyContent="space-around"
                sx={{ height: "100%" }}
              >
                {round.map((bracket) => {
                  BRB++;
                  const keyM = `${BRB}`;
                  return (
                    <Bracket
                      key={`bracket${keyM}`}
                      bracketId={keyM}
                      hideWinner={roundIndex !== rounds.length - 1}
                      {...bracket}
                      onPlayerChange={(key, value, previous) => {
                        handlePlayerChange(key, value);
                        handleOnSetMatches(keyM, value, previous);
                      }}
                      selectedPlayers={selectedPlayers}
                      isPlayer={isPlayer || exported}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
        {!isPlayer && (
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              background: "white",
              display: "flex",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onSaveBracket(selectedPlayers, matches, numberOfPlayers);
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => setExported(true)}
            >
              Save & Send Email
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                onSaveBracket({}, {}, 0);
              }}
            >
              Reset
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BracketComponent;
