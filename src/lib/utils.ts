export function rotateMatrix(matrix: number[][]): number[][]  {
  const rotated: number[][] = [];
  matrix.forEach((row, i) => {
    row.forEach((value, j) => {
      rotated[j] = rotated[j] || [];
      rotated[j][i] = value;
    });
  });
  return rotated.reverse();
}