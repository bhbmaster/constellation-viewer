// Constellation data with star positions (RA/Dec) and magnitudes
// Based on the Hipparcos catalog and constellation boundaries

export const CONSTELLATION_DATA = {
    'Ursa Major': {
        stars: [
            { name: 'Dubhe', ra: 11.0621, dec: 61.7511, mag: 1.79, id: 'alpha' },
            { name: 'Merak', ra: 11.0309, dec: 56.3824, mag: 2.37, id: 'beta' },
            { name: 'Phecda', ra: 11.8976, dec: 53.6948, mag: 2.44, id: 'gamma' },
            { name: 'Megrez', ra: 12.2574, dec: 57.0326, mag: 3.31, id: 'delta' },
            { name: 'Alioth', ra: 12.9006, dec: 55.9598, mag: 1.77, id: 'epsilon' },
            { name: 'Mizar', ra: 13.4199, dec: 54.9254, mag: 2.27, id: 'zeta' },
            { name: 'Alkaid', ra: 13.7923, dec: 49.3133, mag: 1.86, id: 'eta' },
            { name: 'Muscida', ra: 8.5084, dec: 60.7176, mag: 3.05, id: 'omicron' },
            { name: 'Tania Borealis', ra: 10.3722, dec: 42.9147, mag: 3.45, id: 'lambda' }
        ],
        lines: [
            ['alpha', 'beta'], ['beta', 'gamma'], ['gamma', 'delta'],
            ['delta', 'epsilon'], ['epsilon', 'zeta'], ['zeta', 'eta'],
            ['alpha', 'omicron'], ['beta', 'lambda']
        ]
    },

    'Ursa Minor': {
        stars: [
            { name: 'Polaris', ra: 2.5302, dec: 89.2641, mag: 1.98, id: 'alpha' },
            { name: 'Kochab', ra: 14.8451, dec: 74.1553, mag: 2.08, id: 'beta' },
            { name: 'Pherkad', ra: 15.3446, dec: 71.8340, mag: 3.05, id: 'gamma' },
            { name: 'Yildun', ra: 17.5367, dec: 86.5864, mag: 4.35, id: 'delta' },
            { name: 'Urodelus', ra: 16.7661, dec: 82.0373, mag: 4.25, id: 'epsilon' },
            { name: 'Ahfa al Farkadain', ra: 15.7344, dec: 77.7945, mag: 5.02, id: 'zeta' },
            { name: 'Anwar al Farkadain', ra: 13.7511, dec: 71.8334, mag: 4.95, id: 'eta' }
        ],
        lines: [
            ['alpha', 'delta'], ['delta', 'epsilon'], ['epsilon', 'zeta'], ['zeta', 'eta'],
            ['eta', 'gamma'], ['gamma', 'beta'], ['beta', 'zeta']
        ]
    },

    'Orion': {
        stars: [
            { name: 'Betelgeuse', ra: 5.9195, dec: 7.4069, mag: 0.50, id: 'alpha' },
            { name: 'Rigel', ra: 5.2422, dec: -8.2017, mag: 0.13, id: 'beta' },
            { name: 'Bellatrix', ra: 5.4188, dec: 6.3497, mag: 1.64, id: 'gamma' },
            { name: 'Mintaka', ra: 5.5336, dec: -0.2991, mag: 2.23, id: 'delta' },
            { name: 'Alnilam', ra: 5.6036, dec: -1.2019, mag: 1.70, id: 'epsilon' },
            { name: 'Alnitak', ra: 5.6793, dec: -1.9426, mag: 1.77, id: 'zeta' },
            { name: 'Saiph', ra: 5.7958, dec: -9.6697, mag: 2.09, id: 'kappa' },
            { name: 'Meissa', ra: 5.5880, dec: 9.9342, mag: 3.33, id: 'lambda' },
            { name: 'Hatysa', ra: 5.3689, dec: -5.9099, mag: 3.69, id: 'iota' },
            { name: 'M42 (Orion Nebula)', ra: 5.5889, dec: -5.3911, mag: 4.0, id: 'm42' }
        ],
        lines: [
            // Main body outline (hourglass shape)
            ['alpha', 'gamma'], ['gamma', 'beta'], ['beta', 'kappa'], ['kappa', 'alpha'],
            // Orion's Belt (three stars in a line)
            ['delta', 'epsilon'], ['epsilon', 'zeta'],
            // Cross connections from main body to belt
            ['alpha', 'delta'], ['gamma', 'delta'], ['beta', 'zeta'],
            // Head connection
            ['lambda', 'gamma'],
            // Orion's Sword (from belt to nebula)
            ['zeta', 'm42']
        ]
    },

    'Cassiopeia': {
        stars: [
            { name: 'Shedar', ra: 0.6751, dec: 56.5373, mag: 2.23, id: 'alpha' },
            { name: 'Caph', ra: 0.1532, dec: 59.1497, mag: 2.27, id: 'beta' },
            { name: 'Gamma Cas', ra: 0.9457, dec: 60.7168, mag: 2.47, id: 'gamma' },
            { name: 'Ruchbah', ra: 1.4309, dec: 60.2353, mag: 2.68, id: 'delta' },
            { name: 'Segin', ra: 1.9066, dec: 63.6700, mag: 3.38, id: 'epsilon' },
            { name: 'Fulu', ra: 1.7253, dec: 58.2137, mag: 5.17, id: 'zeta' }
        ],
        lines: [
            ['alpha', 'beta'], ['beta', 'gamma'], ['gamma', 'delta'], ['delta', 'epsilon'],
            ['delta', 'zeta']
        ]
    },

    'Leo': {
        stars: [
            { name: 'Regulus', ra: 10.1395, dec: 11.9672, mag: 1.35, id: 'alpha' },
            { name: 'Denebola', ra: 11.8177, dec: 14.5721, mag: 2.14, id: 'beta' },
            { name: 'Algieba', ra: 10.3328, dec: 19.8414, mag: 2.28, id: 'gamma' },
            { name: 'Zosma', ra: 11.2361, dec: 20.5236, mag: 2.56, id: 'delta' },
            { name: 'Ras Elased Australis', ra: 9.7639, dec: 23.7742, mag: 2.98, id: 'epsilon' },
            { name: 'Adhafera', ra: 10.1328, dec: 23.4172, mag: 3.43, id: 'zeta' },
            { name: 'Chort', ra: 11.2361, dec: 15.4297, mag: 3.34, id: 'theta' }
        ],
        lines: [
            ['epsilon', 'zeta'], ['zeta', 'gamma'], ['gamma', 'alpha'],
            ['alpha', 'theta'], ['theta', 'delta'], ['delta', 'beta']
        ]
    },

    'Cygnus': {
        stars: [
            { name: 'Deneb', ra: 20.6901, dec: 45.2803, mag: 1.25, id: 'alpha' },
            { name: 'Albireo', ra: 19.5123, dec: 27.9597, mag: 3.18, id: 'beta' },
            { name: 'Sadr', ra: 20.3704, dec: 40.2567, mag: 2.20, id: 'gamma' },
            { name: 'Gienah', ra: 20.7703, dec: 33.9703, mag: 2.87, id: 'epsilon' },
            { name: 'Fawaris', ra: 19.7495, dec: 45.1308, mag: 2.89, id: 'delta' },
            { name: 'Aljanah', ra: 21.3099, dec: 30.2267, mag: 3.77, id: 'eta' }
        ],
        lines: [
            ['alpha', 'gamma'], ['gamma', 'beta'], ['gamma', 'epsilon'],
            ['gamma', 'delta'], ['epsilon', 'eta']
        ]
    },

    'Aquila': {
        stars: [
            { name: 'Altair', ra: 19.8464, dec: 8.8683, mag: 0.77, id: 'alpha' },
            { name: 'Alshain', ra: 19.9218, dec: 6.4067, mag: 3.71, id: 'beta' },
            { name: 'Tarazed', ra: 19.7714, dec: 10.6131, mag: 2.72, id: 'gamma' },
            { name: 'Deneb el Okab', ra: 19.4211, dec: 3.1150, mag: 3.36, id: 'epsilon' },
            { name: 'Al Thalimain', ra: 19.0925, dec: -5.7391, mag: 3.23, id: 'lambda' }
        ],
        lines: [
            ['gamma', 'alpha'], ['alpha', 'beta'], ['alpha', 'epsilon'], ['epsilon', 'lambda']
        ]
    },

    'Lyra': {
        stars: [
            { name: 'Vega', ra: 18.6156, dec: 38.7837, mag: 0.03, id: 'alpha' },
            { name: 'Sheliak', ra: 18.8347, dec: 33.3628, mag: 3.45, id: 'beta' },
            { name: 'Sulafat', ra: 18.9827, dec: 32.6896, mag: 3.24, id: 'gamma' },
            { name: 'Delta Lyr', ra: 18.8888, dec: 36.8939, mag: 4.30, id: 'delta' },
            { name: 'Epsilon Lyr', ra: 18.7487, dec: 39.6131, mag: 4.59, id: 'epsilon' }
        ],
        lines: [
            ['alpha', 'epsilon'], ['epsilon', 'delta'], ['delta', 'beta'], ['beta', 'gamma']
        ]
    },

    'Bootes': {
        stars: [
            { name: 'Arcturus', ra: 14.2610, dec: 19.1824, mag: -0.05, id: 'alpha' },
            { name: 'Nekkar', ra: 15.0326, dec: 40.3900, mag: 3.50, id: 'beta' },
            { name: 'Seginus', ra: 14.5347, dec: 38.3081, mag: 3.03, id: 'gamma' },
            { name: 'Izar', ra: 14.7499, dec: 27.0742, mag: 2.37, id: 'epsilon' },
            { name: 'Muphrid', ra: 13.9110, dec: 18.3976, mag: 2.68, id: 'eta' }
        ],
        lines: [
            ['alpha', 'eta'], ['eta', 'gamma'], ['gamma', 'beta'],
            ['alpha', 'epsilon'], ['epsilon', 'gamma']
        ]
    },

    'Gemini': {
        stars: [
            { name: 'Castor', ra: 7.5766, dec: 31.8883, mag: 1.57, id: 'alpha' },
            { name: 'Pollux', ra: 7.7553, dec: 28.0262, mag: 1.14, id: 'beta' },
            { name: 'Alhena', ra: 6.6287, dec: 16.3992, mag: 1.93, id: 'gamma' },
            { name: 'Wasat', ra: 7.3348, dec: 21.9823, mag: 3.53, id: 'delta' },
            { name: 'Mebsuta', ra: 6.3827, dec: 22.5070, mag: 3.06, id: 'epsilon' },
            { name: 'Mekbuda', ra: 7.0654, dec: 20.5700, mag: 3.78, id: 'zeta' },
            { name: 'Tejat', ra: 6.4799, dec: 12.8956, mag: 2.87, id: 'mu' }
        ],
        lines: [
            ['alpha', 'beta'], ['beta', 'gamma'], ['gamma', 'mu'],
            ['alpha', 'epsilon'], ['epsilon', 'zeta'], ['zeta', 'delta'], ['delta', 'gamma']
        ]
    },

    'Virgo': {
        stars: [
            { name: 'Spica', ra: 13.4199, dec: -11.1614, mag: 1.04, id: 'alpha' },
            { name: 'Zavijava', ra: 11.8451, dec: 1.7647, mag: 3.61, id: 'beta' },
            { name: 'Porrima', ra: 12.6939, dec: -1.4497, mag: 2.74, id: 'gamma' },
            { name: 'Auva', ra: 12.9262, dec: 3.3972, mag: 3.38, id: 'delta' },
            { name: 'Vindemiatrix', ra: 13.0366, dec: 10.9592, mag: 2.85, id: 'epsilon' },
            { name: 'Heze', ra: 13.5362, dec: -0.5958, mag: 3.39, id: 'zeta' }
        ],
        lines: [
            ['beta', 'epsilon'], ['epsilon', 'delta'], ['delta', 'gamma'],
            ['gamma', 'zeta'], ['zeta', 'alpha']
        ]
    },

    'Taurus': {
        stars: [
            { name: 'Aldebaran', ra: 4.5987, dec: 16.5093, mag: 0.85, id: 'alpha' },
            { name: 'Elnath', ra: 5.4381, dec: 28.6078, mag: 1.68, id: 'beta' },
            { name: 'Alcyone', ra: 3.7904, dec: 24.1052, mag: 2.87, id: 'eta' },
            { name: 'Ain', ra: 4.4284, dec: 19.1804, mag: 3.54, id: 'epsilon' },
            { name: 'Tianguan', ra: 5.6276, dec: 21.1425, mag: 3.00, id: 'zeta' },
            { name: 'Lambda Tau', ra: 4.0058, dec: 12.4900, mag: 3.47, id: 'lambda' }
        ],
        lines: [
            ['lambda', 'alpha'], ['alpha', 'epsilon'], ['alpha', 'zeta'],
            ['zeta', 'beta'], ['alpha', 'eta']
        ]
    },

    'Scorpius': {
        stars: [
            { name: 'Antares', ra: 16.4902, dec: -26.4320, mag: 1.09, id: 'alpha' },
            { name: 'Acrab', ra: 16.0540, dec: -19.8056, mag: 2.62, id: 'beta' },
            { name: 'Dschubba', ra: 16.0037, dec: -22.6217, mag: 2.29, id: 'delta' },
            { name: 'Sargas', ra: 17.6221, dec: -42.9986, mag: 1.87, id: 'theta' },
            { name: 'Shaula', ra: 17.5603, dec: -37.1038, mag: 1.63, id: 'lambda' },
            { name: 'Lesath', ra: 17.7507, dec: -37.2958, mag: 2.69, id: 'upsilon' },
            { name: 'Wei', ra: 16.8397, dec: -34.2931, mag: 2.32, id: 'epsilon' }
        ],
        lines: [
            ['beta', 'delta'], ['delta', 'alpha'], ['alpha', 'epsilon'],
            ['epsilon', 'theta'], ['theta', 'lambda'], ['lambda', 'upsilon']
        ]
    },

    'Pegasus': {
        stars: [
            { name: 'Markab', ra: 23.0793, dec: 15.2053, mag: 2.49, id: 'alpha' },
            { name: 'Scheat', ra: 23.0628, dec: 28.0828, mag: 2.42, id: 'beta' },
            { name: 'Algenib', ra: 0.2209, dec: 15.1832, mag: 2.83, id: 'gamma' },
            { name: 'Enif', ra: 21.7364, dec: 9.8749, mag: 2.38, id: 'epsilon' },
            { name: 'Homam', ra: 22.1169, dec: 6.1978, mag: 3.40, id: 'zeta' }
        ],
        lines: [
            ['alpha', 'beta'], ['beta', 'gamma'], ['gamma', 'alpha'],
            ['alpha', 'epsilon'], ['epsilon', 'zeta']
        ]
    },

    'Andromeda': {
        stars: [
            { name: 'Alpheratz', ra: 0.1398, dec: 29.0906, mag: 2.06, id: 'alpha' },
            { name: 'Mirach', ra: 1.1618, dec: 35.6206, mag: 2.06, id: 'beta' },
            { name: 'Almach', ra: 2.0655, dec: 42.3297, mag: 2.26, id: 'gamma' },
            { name: 'Delta And', ra: 0.6555, dec: 30.8606, mag: 3.27, id: 'delta' },
            { name: 'Adhil', ra: 1.6295, dec: 41.4069, mag: 4.06, id: 'xi' }
        ],
        lines: [
            ['alpha', 'delta'], ['delta', 'beta'], ['beta', 'gamma']
            // Fixed: Removed incorrect 'mirach' reference
        ]
    },

    'Perseus': {
        stars: [
            { name: 'Mirfak', ra: 3.4054, dec: 49.8612, mag: 1.79, id: 'alpha' },
            { name: 'Algol', ra: 3.1362, dec: 40.9564, mag: 2.12, id: 'beta' },
            { name: 'Gamma Per', ra: 3.0798, dec: 53.5064, mag: 2.93, id: 'gamma' },
            { name: 'Delta Per', ra: 3.7123, dec: 47.7875, mag: 3.01, id: 'delta' },
            { name: 'Epsilon Per', ra: 3.9579, dec: 40.0103, mag: 2.89, id: 'epsilon' },
            { name: 'Zeta Per', ra: 3.9013, dec: 31.8839, mag: 2.85, id: 'zeta' }
        ],
        lines: [
            ['gamma', 'alpha'], ['alpha', 'delta'], ['alpha', 'epsilon'],
            ['epsilon', 'zeta'], ['alpha', 'beta']
        ]
    },

    'Draco': {
        stars: [
            { name: 'Thuban', ra: 14.0734, dec: 64.3758, mag: 3.65, id: 'alpha' },
            { name: 'Rastaban', ra: 17.9434, dec: 52.3014, mag: 2.79, id: 'beta' },
            { name: 'Eltanin', ra: 17.9434, dec: 51.4889, mag: 2.23, id: 'gamma' },
            { name: 'Tyl', ra: 19.2095, dec: 67.6617, mag: 3.17, id: 'delta' },
            { name: 'Aldhibah', ra: 16.4199, dec: 61.5142, mag: 3.83, id: 'eta' }
        ],
        lines: [
            ['alpha', 'eta'], ['eta', 'beta'], ['beta', 'gamma'], ['gamma', 'delta']
        ]
    },

    'Hercules': {
        stars: [
            { name: 'Kornephoros', ra: 16.5034, dec: 21.4897, mag: 2.77, id: 'beta' },
            { name: 'Zeta Her', ra: 16.6883, dec: 31.6028, mag: 2.81, id: 'zeta' },
            { name: 'Pi Her', ra: 17.2506, dec: 36.8089, mag: 3.16, id: 'pi' },
            { name: 'Eta Her', ra: 16.7155, dec: 38.9222, mag: 3.53, id: 'eta' },
            { name: 'Delta Her', ra: 17.2506, dec: 24.8394, mag: 3.14, id: 'delta' }
        ],
        lines: [
            ['beta', 'zeta'], ['zeta', 'eta'], ['eta', 'pi'], ['zeta', 'delta']
        ]
    },

    'Corona Borealis': {
        stars: [
            { name: 'Alphecca', ra: 15.5781, dec: 26.7147, mag: 2.23, id: 'alpha' },
            { name: 'Nusakan', ra: 15.4623, dec: 29.1058, mag: 4.13, id: 'beta' },
            { name: 'Gamma CrB', ra: 15.7104, dec: 26.2950, mag: 3.84, id: 'gamma' },
            { name: 'Delta CrB', ra: 15.8229, dec: 26.0672, mag: 4.63, id: 'delta' },
            { name: 'Epsilon CrB', ra: 15.9576, dec: 26.8781, mag: 4.15, id: 'epsilon' }
        ],
        lines: [
            ['beta', 'alpha'], ['alpha', 'gamma'], ['gamma', 'delta'], ['delta', 'epsilon']
        ]
    },

    'Libra': {
        stars: [
            { name: 'Zubenelgenubi', ra: 14.8479, dec: -16.0417, mag: 2.75, id: 'alpha' },
            { name: 'Zubeneschamali', ra: 15.2829, dec: -9.3831, mag: 2.61, id: 'beta' },
            { name: 'Zubenelakrab', ra: 15.0110, dec: -25.2819, mag: 3.29, id: 'gamma' },
            { name: 'Brachium', ra: 15.0994, dec: -14.7897, mag: 4.94, id: 'sigma' }
        ],
        lines: [
            ['alpha', 'sigma'], ['sigma', 'beta'], ['alpha', 'gamma']
        ]
    }
};

// Additional bright stars not in main constellations
export const BRIGHT_STARS = [
    { name: 'Sirius', ra: 6.7525, dec: -16.7161, mag: -1.46, constellation: 'Canis Major' },
    { name: 'Canopus', ra: 6.3992, dec: -52.6956, mag: -0.74, constellation: 'Carina' },
    { name: 'Alpha Centauri', ra: 14.6600, dec: -60.8353, mag: -0.27, constellation: 'Centaurus' },
    { name: 'Capella', ra: 5.2781, dec: 45.9980, mag: 0.08, constellation: 'Auriga' },
    { name: 'Procyon', ra: 7.6551, dec: 5.2250, mag: 0.34, constellation: 'Canis Minor' },
    { name: 'Achernar', ra: 1.6286, dec: -57.2367, mag: 0.46, constellation: 'Eridanus' },
    { name: 'Hadar', ra: 14.0637, dec: -60.3730, mag: 0.61, constellation: 'Centaurus' },
    { name: 'Acrux', ra: 12.4433, dec: -63.0990, mag: 0.77, constellation: 'Crux' },
    { name: 'Aldebaran', ra: 4.5987, dec: 16.5093, mag: 0.85, constellation: 'Taurus' },
    { name: 'Antares', ra: 16.4902, dec: -26.4320, mag: 1.09, constellation: 'Scorpius' },
    { name: 'Pollux', ra: 7.7553, dec: 28.0262, mag: 1.14, constellation: 'Gemini' },
    { name: 'Fomalhaut', ra: 22.9608, dec: -29.6222, mag: 1.16, constellation: 'Piscis Austrinus' },
    { name: 'Deneb', ra: 20.6901, dec: 45.2803, mag: 1.25, constellation: 'Cygnus' },
    { name: 'Regulus', ra: 10.1395, dec: 11.9672, mag: 1.35, constellation: 'Leo' }
];

// Deep sky objects - Messier catalog and other notable objects
export const DEEP_SKY_OBJECTS = [
    // Galaxies
    { name: 'M31 (Andromeda Galaxy)', ra: 0.7125, dec: 41.2689, type: 'galaxy', mag: 3.4, size: 8 },
    { name: 'M33 (Triangulum Galaxy)', ra: 1.5642, dec: 30.6600, type: 'galaxy', mag: 5.7, size: 4 },
    { name: 'M81 (Bode Galaxy)', ra: 9.9256, dec: 69.0651, type: 'galaxy', mag: 6.9, size: 3 },
    { name: 'M82 (Cigar Galaxy)', ra: 9.9256, dec: 69.6781, type: 'galaxy', mag: 8.4, size: 3 },
    { name: 'M51 (Whirlpool Galaxy)', ra: 13.4980, dec: 47.1951, type: 'galaxy', mag: 8.4, size: 3 },
    { name: 'M104 (Sombrero Galaxy)', ra: 12.6652, dec: -11.6237, type: 'galaxy', mag: 8.0, size: 3 },

    // Nebulae
    { name: 'M1 (Crab Nebula)', ra: 5.5756, dec: 22.0145, type: 'nebula', mag: 8.4, size: 4 },
    { name: 'M42 (Orion Nebula)', ra: 5.5889, dec: -5.3911, type: 'nebula', mag: 4.0, size: 6 },
    { name: 'M43 (De Mairan Nebula)', ra: 5.5917, dec: -5.2722, type: 'nebula', mag: 9.0, size: 3 },
    { name: 'M57 (Ring Nebula)', ra: 18.8858, dec: 33.0289, type: 'nebula', mag: 8.8, size: 3 },
    { name: 'M27 (Dumbbell Nebula)', ra: 19.9959, dec: 22.7214, type: 'nebula', mag: 7.5, size: 4 },
    { name: 'M97 (Owl Nebula)', ra: 11.2447, dec: 55.0178, type: 'nebula', mag: 9.9, size: 3 },
    { name: 'M76 (Little Dumbbell)', ra: 1.7041, dec: 51.5756, type: 'nebula', mag: 10.1, size: 2 },
    { name: 'M8 (Lagoon Nebula)', ra: 18.0635, dec: -24.3803, type: 'nebula', mag: 6.0, size: 5 },
    { name: 'M20 (Trifid Nebula)', ra: 18.0317, dec: -23.0319, type: 'nebula', mag: 6.3, size: 4 },
    { name: 'M16 (Eagle Nebula)', ra: 18.3119, dec: -13.8269, type: 'nebula', mag: 6.4, size: 4 },
    { name: 'M17 (Omega Nebula)', ra: 18.3411, dec: -16.1767, type: 'nebula', mag: 6.0, size: 4 },

    // Star Clusters - Globular
    { name: 'M13 (Hercules Cluster)', ra: 16.6950, dec: 36.4603, type: 'globular', mag: 5.8, size: 5 },
    { name: 'M22 (Sagittarius Cluster)', ra: 18.6089, dec: -23.9042, type: 'globular', mag: 5.1, size: 5 },
    { name: 'M4 (Cat Eye Cluster)', ra: 16.3958, dec: -26.5275, type: 'globular', mag: 5.6, size: 4 },
    { name: 'M5 (Rose Cluster)', ra: 15.3089, dec: 2.0808, type: 'globular', mag: 5.6, size: 4 },
    { name: 'M15 (Pegasus Cluster)', ra: 21.5014, dec: 12.1675, type: 'globular', mag: 6.2, size: 4 },
    { name: 'M92 (Hercules Cluster)', ra: 17.2850, dec: 43.1356, type: 'globular', mag: 6.4, size: 3 },
    { name: 'M3 (Canes Venatici)', ra: 13.7042, dec: 28.3769, type: 'globular', mag: 6.2, size: 4 },

    // Star Clusters - Open
    { name: 'M45 (Pleiades)', ra: 3.7904, dec: 24.1052, type: 'open', mag: 1.6, size: 7 },
    { name: 'M44 (Beehive Cluster)', ra: 8.6667, dec: 19.9833, type: 'open', mag: 3.7, size: 6 },
    { name: 'M67 (King Cobra Cluster)', ra: 8.8506, dec: 11.8167, type: 'open', mag: 6.1, size: 4 },
    { name: 'M35 (Gemini Cluster)', ra: 6.1436, dec: 24.3333, type: 'open', mag: 5.3, size: 5 },
    { name: 'M37 (Auriga Cluster)', ra: 5.8667, dec: 32.5500, type: 'open', mag: 6.2, size: 4 },
    { name: 'M36 (Pinwheel Cluster)', ra: 5.6050, dec: 34.1333, type: 'open', mag: 6.3, size: 3 },
    { name: 'M38 (Starfish Cluster)', ra: 5.4811, dec: 35.8333, type: 'open', mag: 7.4, size: 3 },
    { name: 'M6 (Butterfly Cluster)', ra: 17.6694, dec: -32.2167, type: 'open', mag: 5.3, size: 4 },
    { name: 'M7 (Ptolemy Cluster)', ra: 17.8875, dec: -34.8167, type: 'open', mag: 4.1, size: 5 },
    { name: 'M11 (Wild Duck Cluster)', ra: 18.8547, dec: -6.2667, type: 'open', mag: 6.3, size: 3 },
    { name: 'M50 (Heart-shaped)', ra: 7.0528, dec: -8.3333, type: 'open', mag: 6.3, size: 3 },
    { name: 'M52 (Cassiopeia Salt)', ra: 23.4067, dec: 61.5833, type: 'open', mag: 7.3, size: 3 },

    // Notable non-Messier objects
    { name: 'NGC 7000 (North America)', ra: 20.9667, dec: 44.3167, type: 'nebula', mag: 4.0, size: 5 },
    { name: 'NGC 6960 (Veil Nebula)', ra: 20.7589, dec: 30.7167, type: 'nebula', mag: 7.0, size: 4 },
    { name: 'NGC 7293 (Helix Nebula)', ra: 22.4967, dec: -20.8378, type: 'nebula', mag: 7.6, size: 4 },
    { name: 'NGC 2237 (Rosette Nebula)', ra: 6.5492, dec: 5.0333, type: 'nebula', mag: 6.0, size: 4 },
    { name: 'NGC 281 (Pacman Nebula)', ra: 0.8767, dec: 56.6333, type: 'nebula', mag: 7.4, size: 3 },
    { name: 'Double Cluster (h & χ Persei)', ra: 2.3333, dec: 57.1333, type: 'open', mag: 4.3, size: 5 },
    { name: 'Coal Sack Nebula', ra: 12.8333, dec: -63.0000, type: 'dark', mag: 7.0, size: 4 },
    { name: 'Hyades Cluster', ra: 4.4667, dec: 15.8667, type: 'open', mag: 0.5, size: 8 },
    { name: 'Alpha Persei Cluster', ra: 2.3333, dec: 49.0000, type: 'open', mag: 1.2, size: 6 }
];
