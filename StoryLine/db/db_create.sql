DROP TABLE ActivitySuggestion;
DROP TABLE EmotionSuggestion;
DROP TABLE Activity;
DROP TABLE Emotion;
DROP TABLE Word;

CREATE TABLE Activity (
    name		VARCHAR(64) NOT NULL PRIMARY KEY
);

CREATE TABLE Emotion (
    name		VARCHAR(64) NOT NULL PRIMARY KEY
);

CREATE TABLE Word (
    word		VARCHAR(64) NOT NULL PRIMARY KEY
);

CREATE TABLE ActivitySuggestion (
    activity	VARCHAR(64) REFERENCES Activity(name),
    word		VARCHAR(64) REFERENCES Word(word),
    CONSTRAINT pk PRIMARY KEY (activity, word)
);

CREATE TABLE EmotionSuggestion (
    emotion		VARCHAR(64) REFERENCES Emotion(name),
    word		VARCHAR(64) REFERENCES Word(word),
    CONSTRAINT pk PRIMARY KEY (emotion, word)
);


INSERT INTO Activity(name) VALUES('Kletsen');
INSERT INTO Activity(name) VALUES('Handen vasthouden');
INSERT INTO Activity(name) VALUES('Knuffelen');
INSERT INTO Activity(name) VALUES('Kussen');

INSERT INTO Emotion(name) VALUES('Bang');
INSERT INTO Emotion(name) VALUES('Bedroefd');
INSERT INTO Emotion(name) VALUES('Blij');
INSERT INTO Emotion(name) VALUES('Boos');

INSERT INTO Word(word) VALUES('Gefrustreerd');
INSERT INTO Word(word) VALUES('Rage-quit');
INSERT INTO Word(word) VALUES('Sad panda');
INSERT INTO Word(word) VALUES('Coward');
INSERT INTO Word(word) VALUES('Enthausiast');
INSERT INTO Word(word) VALUES('Ongemakkelijk');
INSERT INTO Word(word) VALUES('Fijn');
INSERT INTO Word(word) VALUES('Leuk');
INSERT INTO Word(word) VALUES('Raar');

INSERT INTO EmotionSuggestion(emotion, word) VALUES('Boos', 'Gefrustreerd');
INSERT INTO EmotionSuggestion(emotion, word) VALUES('Boos', 'Rage-quit');
INSERT INTO EmotionSuggestion(emotion, word) VALUES('Bedroefd', 'Sad panda');
INSERT INTO EmotionSuggestion(emotion, word) VALUES('Bang', 'Coward');
INSERT INTO EmotionSuggestion(emotion, word) VALUES('Blij', 'Enthausiast');

INSERT INTO ActivitySuggestion(emotion, word) VALUES('Kletsen', 'Gefrustreerd');
INSERT INTO ActivitySuggestion(emotion, word) VALUES('Kletsen', 'Leuk');
INSERT INTO ActivitySuggestion(emotion, word) VALUES('Handen vasthouden', 'Rage-quit');
INSERT INTO ActivitySuggestion(emotion, word) VALUES('Knuffelen', 'Fijn');
INSERT INTO ActivitySuggestion(emotion, word) VALUES('Knuffelen', 'Ongemakkelijk');
INSERT INTO ActivitySuggestion(emotion, word) VALUES('Kussen', 'Raar');