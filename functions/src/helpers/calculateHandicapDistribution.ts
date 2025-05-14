interface HandicapDistributionOutput {
  scoreHolesHP: number[];
  teamScoreHolesHP: number[];
}

const getArrayPositionLogic = (array: number[], values: number): number[] => {
  const hashPositions: Record<number, number> = array.reduce(
    (acc: Record<number, number>, value, index) => {
      acc[value] = index;
      return acc;
    },
    {}
  );

  const orderedValues = array.slice().sort((a, b) => a - b);
  const arrayPositions = orderedValues
    .slice(0, values)
    .map((value) => hashPositions[value])
    .filter((pos) => typeof pos === "number");

  if (arrayPositions.length < values) {
    let i = 0;
    do {
      arrayPositions.push(arrayPositions[i]);
      i++;
      if (i === arrayPositions.length) {
        i = 0;
      }
    } while (arrayPositions.length < values);
  }
  return arrayPositions;
};

export const calculateHandicapDistribution = (
  difference: number,
  hcp: Array<number>,
  isDifferentCourse: boolean,
  currentPlayerHandicap: number
): HandicapDistributionOutput => {
  const teamOutHcp = !isDifferentCourse
    ? Math.floor(currentPlayerHandicap / 2) + (currentPlayerHandicap % 2)
    : Math.ceil(currentPlayerHandicap / 2) - (currentPlayerHandicap % 2);
  const teamInHcp = !isDifferentCourse
    ? Math.ceil(currentPlayerHandicap / 2) - (currentPlayerHandicap % 2)
    : Math.floor(currentPlayerHandicap / 2) + (currentPlayerHandicap % 2);

  const outHcp = !isDifferentCourse
    ? Math.floor(difference / 2) + (difference % 2)
    : Math.ceil(difference / 2) - (difference % 2);
  const inHcp = !isDifferentCourse
    ? Math.ceil(difference / 2) - (difference % 2)
    : Math.floor(difference / 2) + (difference % 2);

  const hcpDistribution = {
    OUT: hcp.slice(0, 9),
    IN: hcp.slice(9, 18),
  };

  const outHcpArray = getArrayPositionLogic(hcpDistribution.OUT, outHcp);
  const inHcpArray = getArrayPositionLogic(hcpDistribution.IN, inHcp);
  const teamOutHcpArray = getArrayPositionLogic(
    hcpDistribution.OUT,
    teamOutHcp
  );
  const teamInHcpArray = getArrayPositionLogic(hcpDistribution.IN, teamInHcp);

  const inParsResult = Array(9).fill(0);
  const outParsResult = Array(9).fill(0);
  const teamInParsResult = Array(9).fill(0);
  const teamOutParsResult = Array(9).fill(0);

  const isValidIndex = (index: number, length: number) =>
    index >= 0 && index < length;

  outHcpArray.forEach((holeIndex) => {
    if (isValidIndex(holeIndex, outParsResult.length)) {
      outParsResult[holeIndex] += 1;
    }
  });
  inHcpArray.forEach((holeIndex) => {
    if (isValidIndex(holeIndex, inParsResult.length)) {
      inParsResult[holeIndex] += 1;
    }
  });
  teamOutHcpArray.forEach((holeIndex) => {
    if (isValidIndex(holeIndex, teamOutParsResult.length)) {
      teamOutParsResult[holeIndex] += 1;
    }
  });
  teamInHcpArray.forEach((holeIndex) => {
    if (isValidIndex(holeIndex, teamInParsResult.length)) {
      teamInParsResult[holeIndex] += 1;
    }
  });

  return {
    scoreHolesHP: [...outParsResult, ...inParsResult],
    teamScoreHolesHP: [...teamOutParsResult, ...teamInParsResult],
  };
};
