class ExtLabirintoBuilder extends LabirintoBuilder {
  constructor(width, height) {

    super(width, height);

    this.removeNubbins();
    this.joinNubbins();
    this.placeSentinels(100);
    this.placeKey();

  }

  isA(value, ...cells) {
    return cells.every((array) => {
      let row, col;
      [row, col] = array;
      if((this.labirinto[row][col].length == 0) || !this.labirinto[row][col].includes(value)) {
        return false;
      }
      return true;
    });
  }

  removeNubbins() {

    this.labirinto.slice(2, -2).forEach((row, idx) => {

      let r = idx + 2;

      row.slice(2, -2).forEach((cell, idx) => {

        let c = idx + 2;

        if(!this.isA("wall", [r, c])) {
          return;
        }

        if(this.isA("wall", [r-1, c-1], [r-1, c], [r-1, c+1], [r+1, c]) && this.isGap([r+1, c-1], [r+1, c+1], [r+2, c])) {
          this.labirinto[r][c] = [];
          this.labirinto[r+1][c] = ["nubbin"];
        }

        if(this.isA("wall", [r-1, c+1], [r, c-1], [r, c+1], [r+1, c+1]) && this.isGap([r-1, c-1], [r, c-2], [r+1, c-1])) {
          this.labirinto[r][c] = [];
          this.labirinto[r][c-1] = ["nubbin"];
        }

        if(this.isA("wall", [r-1, c-1], [r, c-1], [r+1, c-1], [r, c+1]) && this.isGap([r-1, c+1], [r, c+2], [r+1, c+1])) {
          this.labirinto[r][c] = [];
          this.labirinto[r][c+1] = ["nubbin"];
        }

        if(this.isA("wall", [r-1, c], [r+1, c-1], [r+1, c], [r+1, c+1]) && this.isGap([r-1, c-1], [r-2, c], [r-1, c+1])) {
          this.labirinto[r][c] = [];
          this.labirinto[r-1][c] = ["nubbin"];
        }

      });

    });

  }

  joinNubbins() {

    this.labirinto.slice(2, -2).forEach((row, idx) => {

      let r = idx + 2;

      row.slice(2, -2).forEach((cell, idx) => {

        let c = idx + 2;

        if(!this.isA("nubbin", [r, c])) {
          return;
        }

        if(this.isA("nubbin", [r-2, c])) {
          this.labirinto[r-2][c].push("wall");
          this.labirinto[r-1][c] = ["nubbin", "wall"];
          this.labirinto[r][c].push("wall");
        }

        if(this.isA("nubbin", [r, c-2])) {
          this.labirinto[r][c-2].push("wall");
          this.labirinto[r][c-1] = ["nubbin", "wall"];
          this.labirinto[r][c].push("wall");
        }

      });

    });

  }

  placeSentinels(percent = 100) {

    percent = parseInt(percent, 10);

    if((percent < 1) || (percent > 100)) {
      percent = 100;
    }

    this.labirinto.slice(1, -1).forEach((row, idx) => {

      let r = idx + 1;

      row.slice(1, -1).forEach((cell, idx) => {

        let c = idx + 1;

        if(!this.isA("wall", [r,c])) {
          return;
        }

        if(this.rand(1, 100) > percent) {
          return;
        }

        if(this.isA("wall", [r-1,c-1],[r-1,c],[r-1,c+1],[r+1,c-1],[r+1,c],[r+1,c+1])) {
          this.labirinto[r][c].push("sentinel");
        }

        if(this.isA("wall", [r-1,c-1],[r,c-1],[r+1,c-1],[r-1,c+1],[r,c+1],[r+1,c+1])) {
          this.labirinto[r][c].push("sentinel");
        }

      });

    });
  }

  placeKey() {

    let fr, fc;
    [fr, fc] = this.getKeyLocation();

    if(this.isA("nubbin", [fr-1,fc-1]) && !this.isA("wall", [fr-1,fc-1])) {
      this.labirinto[fr-1][fc-1] = ["key"];
    } else if(this.isA("nubbin", [fr-1,fc+1]) && !this.isA("wall", [fr-1,fc+1])) {
      this.labirinto[fr-1][fc+1] = ["key"];
    } else if(this.isA("nubbin", [fr+1,fc-1]) && !this.isA("wall", [fr+1,fc-1])) {
      this.labirinto[fr+1][fc-1] = ["key"];
    } else if(this.isA("nubbin", [fr+1,fc+1]) && !this.isA("wall", [fr+1,fc+1])) {
      this.labirinto[fr+1][fc+1] = ["key"];
    } else {
      this.labirinto[fr][fc] = ["key"];
    }

  }

}