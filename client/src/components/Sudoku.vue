<template>
  <div class="hello">
    <table>
      <tr v-for="line in sudokuMatrix" :key="line">
        <td v-for="number in line" :key="number">
          <input type="text" :value="number" />
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
      fetch("http://localhost:3000")
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

<style scoped>
table input {
  text-align: center;
  width: 40px;
}
</style>
