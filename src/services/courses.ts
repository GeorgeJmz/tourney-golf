export interface TeeBox {
  color: string;
  id: string;
  length: string;
}

export interface GolfCourse {
  id: string;
  name: string;
  address: string;
  distance: string;
  teeBoxes: TeeBox[];
}

export interface GolfCoursesResponse {
  courses: GolfCourse[];
}

export const getCourses = (): GolfCoursesResponse => ({
  courses: [
    {
      id: "BonitaGolfCourse",
      name: "Bonita Golf Course",
      address: "5540 Clubhouse Dr, Chula Vista, CA, USA",
      distance: "2.5 miles",
      teeBoxes: [
        {
          id: "BonitaGolfCourseBlue",
          color: "Blue",
          length: "69 / 118, 6150",
        },
        {
          id: "BonitaGolfCourseWhite",
          color: "White",
          length: "67.3 / 114, 5758",
        },
        {
          id: "BonitaGolfCourseGold",
          color: "Gold",
          length: "70.8 / 121, 5359",
        },
      ],
    },
    {
      id: "BonitaGolfCourse2",
      name: "Bonita Golf Course 2",
      address: "5540 Clubhouse Dr, Chula Vista, CA, USA",
      distance: "2.5 miles",
      teeBoxes: [
        {
          id: "BonitaGolfCourseBlue2",
          color: "Blue 2",
          length: "69 / 118, 6150",
        },
        {
          id: "BonitaGolfCourseWhite2",
          color: "White 2",
          length: "67.3 / 114, 5758",
        },
        {
          id: "BonitaGolfCourseGold2",
          color: "Gold 2",
          length: "70.8 / 121, 5359",
        },
      ],
    },
  ],
});

export interface ICourseDetail {
  distance: Array<number>;
  hcp: Array<number>;
  par: Array<number>;
  in: Array<number>;
  out: Array<number>;
  total: Array<number>;
}

export interface ICoursesDetail {
  [key: string]: ICourseDetail;
}

export const getCourseDetail = (id: string): ICourseDetail => {
  const details: ICoursesDetail = {
    BonitaGolfCourseBlue: {
      distance: [
        418, 425, 502, 306, 402, 190, 332, 287, 171, 344, 202, 521, 365, 329,
        139, 359, 371, 487,
      ],
      hcp: [1, 5, 9, 17, 3, 11, 7, 15, 13, 2, 10, 14, 4, 16, 18, 6, 8, 12],
      par: [4, 4, 5, 4, 4, 3, 4, 4, 3, 4, 3, 5, 4, 4, 3, 4, 4, 5],
      in: [3117, 36],
      out: [3033, 35],
      total: [6150, 71],
    },
    BonitaGolfCourseWhite: {
      distance: [
        403, 408, 482, 292, 369, 172, 322, 280, 166, 314, 136, 495, 357, 297,
        115, 337, 348, 465,
      ],
      hcp: [1, 5, 9, 17, 3, 11, 7, 15, 13, 2, 10, 14, 4, 16, 18, 6, 8, 12],
      par: [4, 4, 5, 4, 4, 3, 4, 4, 3, 4, 3, 5, 4, 4, 3, 4, 4, 5],
      in: [2864, 36],
      out: [2894, 35],
      total: [5758, 71],
    },
    BonitaGolfCourseGold: {
      distance: [
        366, 386, 468, 270, 336, 129, 310, 271, 148, 280, 117, 474, 347, 284,
        100, 319, 319, 435,
      ],
      hcp: [1, 5, 9, 17, 3, 11, 7, 15, 13, 2, 10, 14, 4, 16, 18, 6, 8, 12],
      par: [4, 4, 5, 4, 4, 3, 4, 4, 3, 4, 3, 5, 4, 4, 3, 4, 4, 5],
      in: [2675, 36],
      out: [2684, 35],
      total: [5359, 71],
    },
    BonitaGolfCourseGold2: {
      distance: randomArray(100, 500, 18),
      hcp: [1, 5, 9, 17, 3, 11, 7, 15, 13, 2, 10, 14, 4, 16, 18, 6, 8, 12],
      par: [4, 4, 5, 4, 4, 3, 4, 4, 3, 4, 3, 5, 4, 4, 3, 4, 4, 5],
      in: [2675, 36],
      out: [2684, 35],
      total: [5359, 71],
    },
  };
  const course = details[id];
  return course;
};

// Arrow function to create a random arrays of numbers between 2 values, with a length of a value
export const randomArray = (min: number, max: number, length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * (max - min) + min));
