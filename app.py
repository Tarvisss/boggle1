from flask import Flask, request, render_template, redirect, flash, session, jsonify

from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "awesome"
# app = config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
boggle_game = Boggle()



@app.route("/")
def display_board():

    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    return render_template("board.html", board = board, highscore = highscore, nplays = nplays)

@app.route("/check-word")
def check_word():
    word = request.args['word']
    board = session['board']
    response = boggle_game.check_valid_word(board, word)
# create a dict aka JSON object and stringify it
    # use decorator to return the response to the JS file
    return jsonify({'result': response})

@app.route("/post-score", methods=["POST"])
def post_score():

    score = request.json['score']
    highscore = session.get("nplays", 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokenRecord = score > highscore)