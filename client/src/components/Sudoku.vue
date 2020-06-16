<template>
  <div class="hello">
    <table>
      <tr v-for="(line, i) in sudokuMatrix" :key="i">
        <td v-for="(number, j) in line" :key="j">
          <input type="text" min="1" max="9" @keydown="validateInput" v-model="sudokuMatrix[i][j]" />
        </td>
      </tr>
    </table>
    <button @click="solve">Solve</button>
  </div>
</template>

<script>

export default {
  name: "Sudoku",
  data: () => ({
    sudokuMatrix: []
  }),
  mounted: function() {
     fetch("http://localhost:1020/api/generate/")
     .then(res => res.json())
     .then(matrix => {
       this.sudokuMatrix = matrix;
     }).catch(err => {
       console.log(err);
     })
  },
  methods: {
    /**
     * Check if the value inputed is a number in range [1-9]
     * @returns { Void }
     */
    validateInput: function(event) {
      const keyPress = parseInt(event.key);

      if ((isNaN(keyPress) || keyPress === 0 || event.target.value) && event.which !== 8) {
        event.preventDefault()
      }
    },
    solve: function() {
      fetch("http://localhost:1020/api/solve", {
         headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
        method: "POST",
        body: JSON.stringify(this.sudokuMatrix)
      })
        .then(res => {
          return res.json();
        })
        .then(sudokuSolved => {
          // const sudokuSolved = JSON.parse(res);
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
