--FOREIGN KEY CONSTRAINTS
ALTER TABLE chat ADD FOREIGN KEY (player_id) REFERENCES player(id);
ALTER TABLE player ADD FOREIGN KEY (preferred_language) REFERENCES language(id);
ALTER TABLE player ADD FOREIGN KEY (platform) REFERENCES platform(id);
ALTER TABLE player ADD FOREIGN KEY (title) REFERENCES title(id);


--LANGUAGE DATA
INSERT INTO language(name, code) VALUES ('English', 'en');
INSERT INTO language(name, code) VALUES ('Italian', 'it');
INSERT INTO language(name, code) VALUES ('Spanish', 'es');
INSERT INTO language(name, code) VALUES ('German', 'de');
INSERT INTO language(name, code) VALUES ('Korean', 'ko');
INSERT INTO language(name, code) VALUES ('French', 'fr');

--PLATFORM DATA
INSERT INTO platform(name) VALUES('XBOX');
INSERT INTO platform(name) VALUES('PS');
INSERT INTO platform(name) VALUES('PC');


--TITLE DATA
INSERT INTO title(name) VALUES('CALL OF DUTY: MOBILE');
INSERT INTO title(name) VALUES('CRASH BANDICOOT 4');
INSERT INTO title(name) VALUES('GHOSTBUSTERS');
INSERT INTO title(name) VALUES('THE AMAZING SPIDER-MAN 2');
INSERT INTO title(name) VALUES('PRO SKATER');

--USER DATA
insert into users(first_name , last_name , preferred_language, platform, title) values('Test1', 'User1', ARRAY[1, 2], ARRAY[1, 2, 3], ARRAY[1, 2] );
insert into users(first_name , last_name , preferred_language, platform, title) values('Test2', 'User2', ARRAY[2, 3], ARRAY[1, 3], ARRAY[3, 4, 5] );
insert into users(first_name , last_name , preferred_language, platform, title) values('Test3', 'User3', ARRAY[1, 2], ARRAY[2, 3], ARRAY[2, 4] );

--PLAYER DATA   
INSERT INTO player(first_name, last_name, preferred_language,  platform, title) VALUES ('Test1', 'Player1', 1, 1, 2);
INSERT INTO player(first_name, last_name, preferred_language,  platform, title) VALUES ('Test2', 'Player2', 2, 1, 3);
INSERT INTO player(first_name, last_name, preferred_language,  platform, title) VALUES ('Test3', 'Player3', 3, 3, 5);
INSERT INTO player(first_name, last_name, preferred_language,  platform, title) VALUES ('Test4', 'Player4', 2, 2, 1);

