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
      id: "EnagicGolfClubatEastlake",
      name: "Enagic Golf Club at Eastlake",
      address: "2375 Clubhouse Dr, Chula Vista, CA 91915, Estados Unidos",
      distance: "3.5 miles",
      teeBoxes: [
        {
          id: "PGATees",
          color: "PGA Tees",
          length: "73.4, 7107",
        },
        {
          id: "BlackTees",
          color: "Black Tees",
          length: "71.5/130, 6606",
        },
        {
          id: "BlueTees",
          color: "Blue Tees",
          length: "70.0/127, 6224",
        },
        {
          id: "WhiteTees",
          color: "White Tees",
          length: "68.2/122, 5834",
        },
      ],
    },
    {
      id: "ClubCampestreTijuana",
      name: "Club Campestre Tijuana",
      address: "Blvd. Agua Caliente 11311, Aviacion, 22020 Tijuana, B.C.",
      distance: "3.5 miles",
      teeBoxes: [
        {
          id: "BlackTijuana",
          color: "Black",
          length: "6878",
        },
        {
          id: "BlueTijuana",
          color: "Blue",
          length: "6523",
        },
        {
          id: "WhiteTijuana",
          color: "White",
          length: "6138",
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
    PGATees: {
      distance: [
        387, 448, 338, 179, 579, 471, 186, 396, 546, 382, 481, 201, 436, 561,
        361, 434, 211, 510,
      ],
      hcp: [15, 5, 17, 7, 3, 1, 13, 11, 9, 14, 4, 8, 2, 6, 16, 10, 18, 12],
      par: [4, 4, 4, 3, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5],
      in: [3577, 36],
      out: [3530, 36],
      total: [7107, 72],
    },
    BlackTees: {
      distance: [
        328, 390, 327, 173, 557, 446, 178, 380, 525, 382, 425, 172, 405, 525,
        348, 372, 163, 510,
      ],
      hcp: [15, 5, 17, 7, 3, 1, 13, 11, 9, 14, 4, 8, 2, 6, 16, 10, 18, 12],
      par: [4, 4, 4, 3, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5],
      in: [3302, 36],
      out: [3304, 36],
      total: [6606, 72],
    },
    BlueTees: {
      distance: [
        302, 363, 310, 154, 530, 414, 160, 365, 513, 360, 400, 153, 380, 495,
        335, 360, 145, 485,
      ],
      hcp: [15, 5, 17, 7, 3, 1, 13, 11, 9, 14, 4, 8, 2, 6, 16, 10, 18, 12],
      par: [4, 4, 4, 3, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5],
      in: [3113, 36],
      out: [3111, 36],
      total: [6224, 72],
    },
    WhiteTees: {
      distance: [
        285, 345, 280, 133, 500, 380, 139, 340, 480, 340, 390, 134, 355, 470,
        325, 340, 128, 470,
      ],
      hcp: [15, 5, 17, 7, 3, 1, 13, 11, 9, 14, 4, 8, 2, 6, 16, 10, 18, 12],
      par: [4, 4, 4, 3, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5],
      in: [2952, 36],
      out: [2882, 36],
      total: [5834, 72],
    },
    BlackTijuana: {
      distance: [
        476, 223, 420, 345, 355, 193, 387, 402, 514, 435, 445, 182, 410, 438,
        350, 476, 573, 236,
      ],
      hcp: [15, 3, 1, 17, 9, 11, 7, 5, 13, 2, 8, 14, 4, 6, 12, 18, 16, 10],
      par: [5, 3, 4, 4, 4, 3, 4, 4, 5, 4, 4, 3, 4, 4, 4, 5, 5, 3],
      in: [3333, 36],
      out: [3545, 36],
      total: [6878, 72],
    },
    BlueTijuana: {
      distance: [
        452, 204, 400, 345, 324, 174, 344, 387, 495, 412, 410, 170, 390, 429,
        338, 459, 557, 215,
      ],
      hcp: [15, 3, 1, 17, 9, 11, 7, 5, 13, 2, 8, 14, 4, 6, 12, 18, 16, 10],
      par: [5, 3, 4, 4, 4, 3, 4, 4, 5, 4, 4, 3, 4, 4, 4, 5, 5, 3],
      in: [3143, 36],
      out: [3380, 36],
      total: [6523, 72],
    },
    WhiteTijuana: {
      distance: [
        442, 190, 372, 313, 324, 134, 320, 374, 456, 370, 390, 155, 383, 400,
        323, 426, 524, 202,
      ],
      hcp: [15, 3, 1, 17, 9, 11, 7, 5, 13, 2, 8, 14, 4, 6, 12, 18, 16, 10],
      par: [5, 3, 4, 4, 4, 3, 4, 4, 5, 4, 4, 3, 4, 4, 4, 5, 5, 3],
      in: [2965, 36],
      out: [3173, 36],
      total: [6138, 72],
    },
  };
  const course = details[id];
  return course;
};

// Arrow function to create a random arrays of numbers between 2 values, with a length of a value
export const randomArray = (min: number, max: number, length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * (max - min) + min));
