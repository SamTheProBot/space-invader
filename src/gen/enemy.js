import { EnemyClass } from '../classes/enemy';
import { canvasHeight, canvasWidth } from '../store/canvasProperty';
import { PushArray } from '../store/gameObject';
import { solidRect } from '../algorithms/spawn.Config';

export function generateEnemy(col, row, enemy, type = solidRect) {
  const arr = type(col, row);
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (arr[i][j]) {
        const emy = new EnemyClass(
          canvasWidth / 1.5 - 70 * i,
          (j * canvasHeight) / row
        );
        emy.img = enemy;
        PushArray(emy);
      }
    }
  }
}
