const config = {
  shapes: [
    {
      color: '#eab308',
      matrix: [
        [2, 2],
        [2, 2]
      ],
    },
    {
      color: '#14b8a6',
      matrix: [
        [2, 0],
        [2, 0],
        [2, 2]
      ]
    },
    {
      color: '#ec4899',
      matrix: [
        [2, 2, 2],
      ]
    },
    {
      color: '#ef4444',
      matrix: [
        [0, 2, 0],
        [2, 2, 2]
      ]
    },
    {
      color: '#a855f7',
      matrix: [
        [2, 2, 0],
        [0, 2, 2]
      ]
    }
  ],
  colors: ['yellow', 'red', 'green'],
  boardWidth: 15,
  boardHeight: 25,
  generateBoard: () => 
    Array.from(
      {length: 25}, 
      (_, y) => 
        Array.from({length: 15}, 
          (_, x)=> (
            {
              x,
              y,
              color: '#0ea5e9',
              value: 0,
            }
          ))
    ),
};

export default config;