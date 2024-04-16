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
      id: "BalboaParkGolfCourse",
      name: "Balboa Park Golf Course",
      address: "2600 Golf Course Dr. San Diego, CA 92102",
      distance: "",
      teeBoxes: [
        {
          id: "BlueBalboaParkGolfCourse",
          color: "Blue",
          length: "6339",
        },
        {
          id: "WhiteBalboaParkGolfCourse",
          color: "White",
          length: "5835",
        },
      ],
    },
    {
      id: "BajamarGolfResort",
      name: "Bajamar Golf Resort",
      address: "Km. 77.5 Toll Road Tijuana Ensenada, BC Mexico",
      distance: "",
      teeBoxes: [
        {
          id: "BlueBajamarGolfResort",
          color: "Blue",
          length: "6569",
        },
        {
          id: "WhiteBajamarGolfResort",
          color: "White",
          length: "6036",
        },
      ],
    },
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
      id: "CarltonOaksCountryClub",
      name: "Carlton Oaks Country Club",
      address: "9200 Inwood Dr, Santee, CA 92071",
      distance: "",
      teeBoxes: [
        {
          id: "BlueCarltonOaksCountryClub",
          color: "Blue",
          length: "6700",
        },
        {
          id: "GreenCarltonOaksCountryClub",
          color: "Green",
          length: "6320",
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
      id: "CottonwoodGolfClub",
      name: "Cottonwood Golf Club",
      address: "3121 Willow Glen Drive, El Cajon, CA 92019",
      distance: "",
      teeBoxes: [
        {
          id: "BlackCottonwoodGolfClub",
          color: "Black",
          length: "6736",
        },
        {
          id: "WhiteCottonwoodGolfClub",
          color: "White",
          length: "6413",
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
      id: "RiverwalkGolfClub",
      name: "Riverwalk Golf Club",
      address: "1150 Fashion Valley Rd, San Diego, CA 92108",
      distance: "",
      teeBoxes: [
        {
          id: "BackRiverwalkGolfClub",
          color: "Back",
          length: "6550",
        },
        {
          id: "MiddleRiverwalkGolfClub",
          color: "Middle",
          length: "6156",
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
    {
      id: "oakGlen",
      name: "Singing Hills / Oak Glen",
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
      id: "SingingHillsWillowGlen",
      name: "Singing Hills / Willow Glen",
      address: "3199 Stonefield Dr, Jamul, CA 91935",
      distance: "",
      teeBoxes: [
        {
          id: "BlueSingingHillsWillowGlen",
          color: "Blue",
          length: "6651",
        },
        {
          id: "WhiteSingingHillsWillowGlen",
          color: "White",
          length: "6200",
        },
      ],
    },
    {
      id: "SteelCanyonGolfClubCanyonRanch",
      name: "Steel Canyon Golf Club / Canyon - Ranch",
      address: "3199 Stonefield Dr, Jamul, CA 91935",
      distance: "",
      teeBoxes: [
        {
          id: "BlueSteelCanyonGolfClubCanyonRanch",
          color: "Blue",
          length: "6432",
        },
        {
          id: "WhiteSteelCanyonGolfClubCanyonRanch",
          color: "White",
          length: "6196",
        },
      ],
    },
    {
      id: "SteelCanyonGolfClubRanchVineyard",
      name: "Steel Canyon Golf Club / Ranch - Vineyard",
      address: "3199 Stonefield Dr, Jamul, CA 91935",
      distance: "",
      teeBoxes: [
        {
          id: "BlueSteelCanyonGolfClubRanchVineyard",
          color: "Blue",
          length: "6456",
        },
        {
          id: "WhiteSteelCanyonGolfClubRanchVineyard",
          color: "White",
          length: "5618",
        },
      ],
    },
    {
      id: "SteelCanyonGolfClubVineyardCanyon",
      name: "Steel Canyon Golf Club / Vineyard - Canyon",
      address: "3199 Stonefield Dr, Jamul, CA 91935",
      distance: "",
      teeBoxes: [
        {
          id: "BlueSteelCanyonGolfClubVineyardCanyon",
          color: "Blue",
          length: "6144",
        },
        {
          id: "WhiteSteelCanyonGolfClubVineyardCanyon",
          color: "White",
          length: "5903",
        },
      ],
    },
    {
      id: "TorreyPinesGolfCourseSouth",
      name: "Torrey Pines Golf Course - South",
      address: "11480 N Torrey Pines Rd, La Jolla, CA 92037",
      distance: "",
      teeBoxes: [
        {
          id: "GreenTorreyPinesGolfCourseSouth",
          color: "Green",
          length: "6635",
        },
        {
          id: "WhiteTorreyPinesGolfCourseSouth",
          color: "White",
          length: "6145",
        },
      ],
    },
    {
      id: "TorreyPinesGolfCourseNorth",
      name: "Torrey Pines Golf Course - North",
      address: "11480 N Torrey Pines Rd, La Jolla, CA 92037",
      distance: "",
      teeBoxes: [
        {
          id: "GreenTorreyPinesGolfCourseNorth",
          color: "Green",
          length: "6346",
        },
        {
          id: "GoldTorreyPinesGolfCourseNorth",
          color: "Gold",
          length: "5851",
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
    BackRiverwalkGolfClub: {
      distance: [
        388, 293, 304, 526, 178, 354, 190, 378, 542, 398, 178, 511, 440, 393,
        538, 374, 148, 417,
      ],
      hcp: [5, 17, 7, 11, 9, 15, 3, 13, 1, 6, 12, 14, 4, 2, 16, 8, 18, 10],
      par: [4, 4, 4, 5, 3, 4, 3, 4, 5, 4, 3, 5, 4, 4, 5, 4, 3, 4],
      in: [3397, 36],
      out: [3153, 36],
      total: [6550, 72],
    },
    MiddleRiverwalkGolfClub: {
      distance: [
        376, 274, 285, 510, 143, 329, 161, 357, 521, 379, 156, 488, 416, 373,
        515, 350, 132, 391,
      ],
      hcp: [5, 17, 7, 11, 9, 15, 3, 13, 1, 6, 12, 14, 4, 2, 16, 8, 18, 10],
      par: [4, 4, 4, 5, 3, 4, 3, 4, 5, 4, 3, 5, 4, 4, 5, 4, 3, 4],
      in: [3200, 36],
      out: [2956, 36],
      total: [6156, 72],
    },
    BlueBalboaParkGolfCourse: {
      distance: [
        344, 502, 379, 371, 296, 215, 463, 327, 177, 439, 384, 392, 134, 532,
        315, 555, 198, 316,
      ],
      hcp: [15, 11, 5, 9, 1, 13, 3, 9, 17, 4, 12, 6, 16, 8, 18, 2, 14, 10],
      par: [4, 5, 4, 4, 4, 3, 5, 4, 3, 4, 4, 4, 3, 5, 4, 5, 3, 4],
      in: [3265, 36],
      out: [3074, 36],
      total: [6339, 72],
    },
    WhiteBalboaParkGolfCourse: {
      distance: [
        311, 468, 318, 338, 277, 193, 448, 302, 164, 379, 356, 379, 105, 494,
        299, 534, 167, 303,
      ],
      hcp: [15, 5, 9, 1, 13, 3, 7, 17, 11, 6, 10, 4, 18, 12, 14, 2, 16, 8],
      par: [4, 5, 4, 4, 4, 3, 5, 4, 3, 4, 4, 4, 3, 5, 4, 5, 3, 4],
      in: [3016, 36],
      out: [2819, 36],
      total: [5835, 72],
    },
    BlueCarltonOaksCountryClub: {
      distance: [
        394, 163, 518, 438, 303, 391, 198, 376, 528, 433, 355, 169, 574, 427,
        546, 347, 140, 400,
      ],
      hcp: [7, 11, 15, 1, 17, 5, 9, 3, 13, 6, 12, 8, 10, 2, 14, 18, 16, 4],
      par: [4, 3, 5, 4, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 5, 4, 3, 4],
      in: [3391, 36],
      out: [3309, 36],
      total: [6700, 72],
    },
    GreenCarltonOaksCountryClub: {
      distance: [
        394, 163, 502, 394, 303, 362, 139, 342, 505, 387, 338, 130, 527, 381,
        492, 311, 127, 364,
      ],
      hcp: [7, 11, 15, 1, 17, 5, 9, 3, 13, 6, 12, 8, 10, 2, 14, 18, 16, 4],
      par: [4, 3, 5, 4, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 5, 4, 3, 4],
      in: [3216, 36],
      out: [3104, 36],
      total: [6320, 72],
    },
    BlueBajamarGolfResort: {
      distance: [
        399, 527, 400, 150, 388, 407, 370, 398, 149, 433, 366, 391, 378, 339,
        173, 368, 405, 528,
      ],
      hcp: [11, 1, 3, 15, 9, 5, 13, 7, 17, 14, 18, 2, 8, 10, 16, 4, 6, 12],
      par: [4, 5, 4, 3, 4, 4, 4, 4, 3, 5, 4, 4, 4, 4, 3, 4, 4, 5],
      in: [3381, 37],
      out: [3188, 35],
      total: [6569, 72],
    },
    WhiteBajamarGolfResort: {
      distance: [
        345, 489, 349, 134, 347, 381, 330, 366, 115, 416, 351, 355, 352, 307,
        170, 344, 373, 512,
      ],
      hcp: [11, 1, 3, 15, 9, 5, 13, 7, 17, 14, 18, 2, 8, 10, 16, 4, 6, 12],
      par: [4, 5, 4, 3, 4, 4, 4, 4, 3, 5, 4, 4, 4, 4, 3, 4, 4, 5],
      in: [3180, 37],
      out: [2856, 35],
      total: [6036, 72],
    },
    GreenTorreyPinesGolfCourseSouth: {
      distance: [
        419, 344, 146, 420, 393, 505, 424, 149, 514, 352, 190, 444, 514, 394,
        355, 183, 398, 491,
      ],
      hcp: [5, 15, 13, 3, 11, 9, 1, 17, 7, 16, 14, 2, 6, 8, 12, 18, 4, 10],
      par: [4, 4, 3, 4, 4, 5, 4, 3, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5],
      in: [3321, 36],
      out: [3314, 36],
      total: [6635, 72],
    },
    WhiteTorreyPinesGolfCourseSouth: {
      distance: [
        409, 323, 142, 384, 382, 449, 387, 139, 457, 308, 171, 411, 486, 359,
        339, 151, 375, 473,
      ],
      hcp: [5, 15, 13, 3, 11, 9, 1, 17, 7, 16, 14, 2, 6, 8, 12, 18, 4, 10],
      par: [4, 4, 3, 4, 4, 5, 4, 3, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5],
      in: [3073, 36],
      out: [3072, 36],
      total: [6145, 72],
    },
    GreenTorreyPinesGolfCourseNorth: {
      distance: [
        395, 412, 183, 416, 483, 389, 274, 167, 476, 506, 321, 155, 399, 352,
        165, 345, 486, 422,
      ],
      hcp: [5, 1, 13, 3, 11, 7, 17, 15, 9, 12, 18, 14, 4, 6, 16, 8, 10, 2],
      par: [4, 4, 3, 4, 5, 4, 4, 3, 5, 5, 4, 3, 4, 4, 3, 4, 5, 4],
      in: [3151, 36],
      out: [3195, 36],
      total: [6346, 72],
    },
    GoldTorreyPinesGolfCourseNorth: {
      distance: [
        351, 355, 164, 357, 437, 380, 259, 161, 460, 460, 310, 108, 383, 340,
        145, 336, 472, 373,
      ],
      hcp: [5, 1, 13, 3, 11, 7, 17, 15, 9, 12, 18, 14, 4, 6, 16, 8, 10, 2],
      par: [4, 4, 3, 4, 5, 4, 4, 3, 5, 5, 4, 3, 4, 4, 3, 4, 5, 4],
      in: [2927, 36],
      out: [2924, 36],
      total: [5851, 72],
    },
    BlueSingingHillsWillowGlen: {
      distance: [
        375, 330, 399, 325, 502, 185, 416, 544, 184, 506, 403, 174, 395, 358,
        409, 431, 547, 168,
      ],
      hcp: [7, 13, 3, 11, 9, 15, 5, 1, 17, 12, 8, 16, 14, 10, 2, 6, 4, 18],
      par: [4, 4, 4, 4, 5, 3, 4, 5, 3, 5, 4, 3, 4, 4, 4, 4, 5, 3],
      in: [3391, 36],
      out: [3260, 36],
      total: [6651, 72],
    },
    WhiteSingingHillsWillowGlen: {
      distance: [
        341, 311, 374, 310, 484, 165, 388, 517, 161, 490, 370, 149, 371, 340,
        367, 387, 525, 150,
      ],
      hcp: [7, 13, 3, 11, 9, 15, 5, 1, 17, 12, 8, 16, 14, 10, 2, 6, 4, 18],
      par: [4, 4, 4, 4, 5, 3, 4, 5, 3, 5, 4, 3, 4, 4, 4, 4, 5, 3],
      in: [3149, 36],
      out: [3051, 36],
      total: [6200, 72],
    },
    BlueSteelCanyonGolfClubCanyonRanch: {
      distance: [
        409, 517, 163, 489, 209, 360, 150, 390, 373, 364, 385, 401, 174, 533,
        388, 414, 204, 509,
      ],
      hcp: [4, 2, 6, 1, 9, 7, 8, 3, 5, 9, 5, 4, 8, 1, 3, 6, 7, 2],
      par: [4, 5, 3, 5, 3, 4, 3, 4, 4, 4, 4, 4, 3, 5, 4, 4, 3, 5],
      in: [3372, 36],
      out: [3060, 35],
      total: [6432, 72],
    },
    WhiteSteelCanyonGolfClubCanyonRanch: {
      distance: [
        381, 517, 163, 489, 200, 330, 127, 358, 373, 329, 323, 401, 174, 533,
        371, 414, 204, 509,
      ],
      hcp: [4, 2, 6, 1, 9, 7, 8, 3, 5, 9, 5, 4, 8, 1, 3, 6, 7, 2],
      par: [4, 5, 3, 5, 3, 4, 3, 4, 4, 4, 4, 4, 3, 5, 4, 4, 3, 5],
      in: [3258, 36],
      out: [2938, 35],
      total: [6196, 72],
    },
    BlueSteelCanyonGolfClubRanchVineyard: {
      distance: [
        364, 385, 401, 174, 533, 388, 414, 204, 509, 418, 328, 173, 347, 393,
        519, 168, 351, 387,
      ],
      hcp: [9, 5, 4, 8, 1, 3, 6, 7, 2, 7, 5, 8, 4, 2, 1, 9, 3, 6],
      par: [4, 4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 3, 4, 4, 5, 3, 4, 4],
      in: [3084, 35],
      out: [3372, 36],
      total: [6456, 72],
    },
    WhiteSteelCanyonGolfClubRanchVineyard: {
      distance: [
        329, 323, 401, 174, 533, 371, 414, 204, 509, 396, 276, 173, 347, 393,
        519, 150, 351, 360,
      ],
      hcp: [9, 5, 4, 8, 1, 3, 6, 7, 2, 7, 5, 8, 4, 2, 1, 9, 3, 6],
      par: [4, 4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 3, 4, 4, 5, 3, 4, 4],
      in: [2965, 35],
      out: [3258, 36],
      total: [6223, 72],
    },
    BlueSteelCanyonGolfClubVineyardCanyon: {
      distance: [
        418, 328, 173, 347, 393, 519, 168, 351, 387, 409, 517, 163, 489, 209,
        360, 150, 390, 373,
      ],
      hcp: [7, 5, 8, 4, 2, 1, 9, 3, 6, 4, 2, 6, 1, 9, 7, 8, 3, 5],
      par: [4, 4, 3, 4, 4, 5, 3, 4, 4, 4, 5, 3, 5, 3, 4, 3, 4, 4],
      in: [3060, 35],
      out: [3084, 35],
      total: [6144, 72],
    },
    WhiteSteelCanyonGolfClubVineyardCanyon: {
      distance: [
        396, 276, 173, 347, 393, 519, 150, 351, 360, 381, 517, 163, 489, 200,
        330, 127, 358, 373,
      ],
      hcp: [7, 5, 8, 4, 2, 1, 9, 3, 6, 4, 2, 6, 1, 9, 7, 8, 3, 5],
      par: [4, 4, 3, 4, 4, 5, 3, 4, 4, 4, 5, 3, 5, 3, 4, 3, 4, 4],
      in: [2938, 35],
      out: [2965, 35],
      total: [5903, 72],
    },
    BlackCottonwoodGolfClub: {
      distance: [
        404, 539, 426, 159, 363, 411, 389, 567, 183, 429, 370, 170, 364, 341,
        486, 439, 490, 206,
      ],
      hcp: [13, 15, 3, 11, 7, 5, 9, 1, 17, 6, 8, 14, 12, 16, 10, 2, 18, 4],
      par: [4, 5, 4, 3, 4, 4, 4, 5, 3, 4, 4, 3, 4, 4, 5, 4, 5, 3],
      in: [3295, 36],
      out: [3441, 36],
      total: [6735, 72],
    },
    WhiteCottonwoodGolfClub: {
      distance: [
        354, 513, 399, 143, 357, 401, 379, 552, 169, 392, 364, 150, 351, 335,
        476, 425, 456, 197,
      ],
      hcp: [13, 15, 3, 11, 7, 5, 9, 1, 17, 6, 8, 14, 12, 16, 10, 2, 18, 4],
      par: [4, 5, 4, 3, 4, 4, 4, 5, 3, 4, 4, 3, 4, 4, 5, 4, 5, 3],
      in: [3146, 36],
      out: [3267, 36],
      total: [6413, 72],
    },
  };
  const course = details[id];
  return course;
};

// Arrow function to create a random arrays of numbers between 2 values, with a length of a value
export const randomArray = (min: number, max: number, length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * (max - min) + min));
