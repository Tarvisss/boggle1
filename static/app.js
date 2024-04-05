class BoggleGame {
    /* make a new game at this DOM id */
  //all the functions listed here are tools you can use, but do not have to used if not needed
    constructor(boardId, secs = 60) {
      //the constuctor is only run once.......... Can not be ran again. 
      this.secs = secs; // game length
      this.showTimer();
  
      this.score = 0;
      this.words = new Set();// create empty set to contain found words
      this.board = $("#" + boardId);
      
      // every 1000 msec, "tick"
      this.timer = setInterval(this.tick.bind(this), 1000);
  
      $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }
  
    /* show word in list of words */
    //appends found word below boggle board
  
    showWord(word) {
      $(".words", this.board).append($("<li>", { text: word }));
      
    }
       
    /* show score in html */
    // updates val as you play
  
    showScore() {
      $(".score", this.board).text(this.score);
    }
  
    /* show a status message */
  
    showMessage(msg,) {
      $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg`);
    }
  
    /* handle submission of word: if unique and valid, score & show */
  
    async handleSubmit(evt) {
      evt.preventDefault();
      const $word = $(".word", this.board);
  
      let word = $word.val();
      if (!word) return;
  
      if (this.words.has(word)) {
        // has is a set method, so is add
        this.showMessage(`Already found ${word}`, "err");
        return;
      }
  
      // check server for validity
      const resp = await axios.get("/check-word", { params: { word: word }});
      // return response from our flask session
      if (resp.data.result === "not-word") {
        this.showMessage(`${word} is not a valid English word`, "err");
      } else if (resp.data.result === "not-on-board") {
        this.showMessage(`${word} is not a valid word on this board`, "err");
      } else {
        // result is "ok" then update message text and score
        this.showWord(word);
        this.score += word.length;
        this.showScore();
        // this word was found and is saved to the set()
        this.words.add(word);
        this.showMessage(`Added: ${word}`, "ok");
      }
  
      $word.val("").focus();
    }
  
    /* Update timer in DOM */
  
    showTimer() {
      $(".timer", this.board).text(this.secs);
    }
  
    /* Tick: handle a second passing in game */
  
    async tick() {
      this.secs -= 1;
      this.showTimer();
  
      if (this.secs === 0) {
        clearInterval(this.timer);
        await this.scoreGame();
      }
    }
  
    /* end of game: score and update message. */
  
    async scoreGame() {
      $(".add-word", this.board).hide();
      const resp = await axios.post("/post-score", { score: this.score });
      if (resp.data.brokeRecord) {
        this.showMessage(`New record: ${this.score}`, "ok");
      } else {
        this.showMessage(`Final score: ${this.score}`, "ok");
      }
    }
  }