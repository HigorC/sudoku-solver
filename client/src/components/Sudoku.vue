<template>
  <div class="hello">
    <table>
      <tr v-for="(line, i) in sudokuMatrix" :key="line">
        <td v-for="(number, j) in line" :key="number">
          <input type="text"  v-model="sudokuMatrix[i][j]"/>
        </td>
      </tr>
    </table>
    <button @click="solve">Solve</button>
  </div>
</template>

<script>
import * as matrix from "../utils/matrix";

export default {
  name: "Sudoku",
  data: () => ({
    sudokuMatrix: []
  }),
  mounted: function() {
    this.sudokuMatrix = matrix.generateBaseMatrix();
  },
  methods: {
    solve: function() {
      fetch("http://localhost:3000/api/solve", {
        method: "POST",
        body: this.sudokuMatrix
      })
        .then(res => {
          return res.text();
        })
        .then(res => {
          const sudokuSolved = JSON.parse(res);
          this.sudokuMatrix = sudokuSolved;
        });
    }
  }
};
</script>

<style scoped lang="scss">
table {
  margin: 0 auto;
  input {
    text-align: center;
    width: 40px;
    height: 40px;
  }

  tr {
    &:nth-child(3n) {
      margin-bottom: 10px;
      color: lime;
      td {
        padding-bottom: 2em;
      }
    }

    td {
      &:nth-child(3n) {
        padding-right: 2em;
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
}
</style>
