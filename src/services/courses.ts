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
          id: "BonitaGolfCourseBlack",
          color: "Black",
          length: "69 / 118, 6150",
        },
        {
          id: "BonitaGolfCourseWhite",
          color: "White",
          length: "67.3 / 114, 5758",
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
    {
      id: "EnagicGolfClubatEastlake",
      name: "Enagic Golf Club at Eastlake",
      address: "2375 Clubhouse Dr, Chula Vista, CA 91915, Estados Unidos",
      distance: "3.5 miles",
      teeBoxes: [
        // {
        //   id: "PGATees",
        //   color: "PGA Tees",
        //   length: "73.4, 7107",
        // },
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
      id: "oakGlen",
      name: "Singing Hills / Oak Glenn",
      address: "3007 Dehesa Rd, El Cajon, CA 92019",
      distance: "",
      teeBoxes: [
        {
          id: "BlueOak",
          color: "Blue",
          length: "6594",
        },
        {
          id: "RedOak",
          color: "Red",
          length: "5618",
        },
        {
          id: "WhiteOak",
          color: "White",
          length: "6131",
        },
      ],
    },
    {
      id: "sanDiegoCountry",
      name: "San Diego Country Club",
      address: "88 L Street, Chula Vista, CA 91911",
      distance: "",
      teeBoxes: [
        {
          id: "BlackSanDiegoCountry",
          color: "Black",
          length: "7033",
        },
        {
          id: "BlueSanDiegoCountry",
          color: "Blue",
          length: "6684",
        },
        {
          id: "WhiteSanDiegoCountry",
          color: "White",
          length: "6354",
        },
        // {
        //   id: "SilverSanDiegoCountry",
        //   color: "Silver",
        //   length: "6021",
        // },
        // {
        //   id: "RedSanDiegoCountry",
        //   color: "Red",
        //   length: "5637",
        // },
        // {
        //   id: "GreenSanDiegoCountry",
        //   color: "Green",
        //   length: "5385",
        // },
        // {
        //   id: "GoldSanDiegoCountry",
        //   color: "Gold",
        //   length: "4957",
        // },
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
    BonitaGolfCourseBlack: {
      distance: [
        418, 425, 502, 306, 402, 190, 332, 287, 171, 344, 202, 521, 365, 329,
        139, 359, 371, 487,
      ],
      hcp: [3, 1, 7, 17, 5, 9, 13, 15, 11, 2, 10, 16, 4, 8, 18, 14, 6, 12],
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
      hcp: [3, 1, 7, 17, 5, 9, 13, 15, 11, 2, 10, 16, 4, 8, 18, 14, 6, 12],
      par: [4, 4, 5, 4, 4, 3, 4, 4, 3, 4, 3, 5, 4, 4, 3, 4, 4, 5],
      in: [2864, 36],
      out: [2894, 35],
      total: [5758, 71],
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
    BlueOak: {
      distance: [
        391, 336, 328, 154, 412, 167, 502, 354, 395, 539, 382, 414, 357, 360,
        202, 410, 361, 530,
      ],
      hcp: [5, 11, 13, 15, 1, 17, 7, 9, 3, 4, 8, 10, 14, 12, 18, 2, 16, 6],
      par: [4, 4, 4, 3, 4, 3, 5, 4, 4, 5, 4, 4, 4, 4, 3, 4, 4, 5],
      in: [3555, 37],
      out: [3039, 35],
      total: [6594, 72],
    },
    WhiteOak: {
      distance: [
        372, 317, 311, 121, 395, 130, 483, 337, 372, 506, 361, 369, 312, 333,
        172, 385, 345, 510,
      ],
      hcp: [5, 11, 13, 15, 1, 17, 7, 9, 3, 4, 8, 10, 14, 12, 18, 2, 16, 6],
      par: [4, 4, 4, 3, 4, 3, 5, 4, 4, 5, 4, 4, 4, 4, 3, 4, 4, 5],
      in: [3293, 37],
      out: [3838, 35],
      total: [6131, 72],
    },
    RedOak: {
      distance: [
        348, 298, 283, 102, 335, 110, 453, 324, 345, 484, 347, 342, 280, 314,
        153, 310, 310, 480,
      ],
      hcp: [3, 13, 9, 15, 7, 17, 5, 11, 1, 2, 8, 14, 10, 16, 18, 6, 12, 4],
      par: [4, 4, 4, 3, 4, 3, 5, 4, 4, 5, 4, 4, 4, 4, 3, 4, 4, 5],
      in: [3020, 37],
      out: [2598, 35],
      total: [5618, 72],
    },
    BlackSanDiegoCountry: {
      distance: [
        368, 513, 236, 461, 401, 187, 377, 563, 427, 438, 158, 390, 202, 485,
        397, 603, 367, 460,
      ],
      hcp: [11, 9, 15, 1, 7, 17, 13, 5, 3, 2, 18, 8, 16, 10, 12, 6, 14, 4],
      par: [4, 5, 3, 4, 4, 3, 4, 5, 4, 4, 3, 4, 3, 5, 4, 5, 4, 4],
      in: [3500, 36],
      out: [3533, 36],
      total: [7033, 72],
    },
    BlueSanDiegoCountry: {
      distance: [
        361, 498, 217, 435, 392, 180, 358, 538, 386, 434, 145, 385, 181, 478,
        391, 526, 361, 418,
      ],
      hcp: [11, 9, 15, 1, 7, 17, 13, 5, 3, 2, 18, 8, 16, 10, 12, 6, 14, 4],
      par: [4, 5, 3, 4, 4, 3, 4, 5, 4, 4, 3, 4, 3, 5, 4, 5, 4, 4],
      in: [3319, 36],
      out: [3365, 36],
      total: [6684, 72],
    },
    SilverSanDiegoCountry: {
      distance: [
        349, 452, 182, 400, 372, 140, 333, 465, 337, 412, 123, 361, 144, 444,
        369, 474, 319, 345,
      ],
      hcp: [11, 9, 15, 1, 7, 17, 13, 5, 3, 2, 18, 8, 16, 10, 12, 6, 14, 4],
      par: [4, 5, 3, 4, 4, 3, 4, 5, 4, 4, 3, 4, 3, 5, 4, 5, 4, 4],
      in: [2991, 36],
      out: [3030, 36],
      total: [6021, 72],
    },
    RedSanDiegoCountry: {
      distance: [
        349, 452, 182, 320, 318, 140, 333, 465, 337, 301, 123, 309, 144, 444,
        282, 474, 319, 345,
      ],
      hcp: [11, 9, 15, 1, 7, 17, 13, 5, 3, 2, 18, 8, 16, 10, 12, 6, 14, 4],
      par: [4, 5, 3, 4, 4, 3, 4, 5, 4, 4, 3, 4, 3, 5, 4, 5, 4, 4],
      in: [2741, 36],
      out: [2896, 36],
      total: [5637, 72],
    },
    GreenSanDiegoCountry: {
      distance: [
        349, 452, 92, 320, 318, 140, 250, 465, 337, 301, 123, 309, 144, 444,
        282, 474, 296, 289,
      ],
      hcp: [11, 9, 15, 1, 7, 17, 13, 5, 3, 2, 18, 8, 16, 10, 12, 6, 14, 4],
      par: [4, 5, 3, 4, 4, 3, 4, 5, 4, 4, 3, 4, 3, 5, 4, 5, 4, 4],
      in: [2662, 36],
      out: [2723, 36],
      total: [5385, 72],
    },
    GoldSanDiegoCountry: {
      distance: [
        301, 349, 92, 320, 318, 113, 250, 419, 337, 301, 118, 309, 114, 347,
        282, 402, 296, 289,
      ],
      hcp: [11, 9, 15, 1, 7, 17, 13, 5, 3, 2, 18, 8, 16, 10, 12, 6, 14, 4],
      par: [4, 5, 3, 4, 4, 3, 4, 5, 4, 4, 3, 4, 3, 5, 4, 5, 4, 4],
      in: [2458, 36],
      out: [2499, 36],
      total: [4957, 72],
    },
  };
  const course = details[id];
  return course;
};

// Arrow function to create a random arrays of numbers between 2 values, with a length of a value
export const randomArray = (min: number, max: number, length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * (max - min) + min));
