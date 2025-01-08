ALTER TABLE chat_content ADD FOREIGN KEY (parent_id) REFERENCES chat_content(id) ON DELETE CASCADE;
ALTER TABLE chat_content ADD FOREIGN KEY (model_id) REFERENCES model(id);
ALTER TABLE chat ADD FOREIGN KEY (player_id) REFERENCES player(id);
ALTER TABLE model ADD FOREIGN KEY(language_id) REFERENCES language(id);
ALTER TABLE player ADD FOREIGN KEY (preferred_language) REFERENCES language(id);
ALTER TABLE player ADD FOREIGN KEY (platform) REFERENCES platform(id);
ALTER TABLE player ADD FOREIGN KEY (title) REFERENCES title(id);


--LANGUAGE DATA
INSERT INTO language(name) VALUES ('English');
INSERT INTO language(name) VALUES ('Hindi');
INSERT INTO language(name) VALUES ('Spanish');

--MODEL DATA
INSERT INTO model(language_id) VALUES (1);
INSERT INTO model(language_id) VALUES (2);
INSERT INTO model(language_id) VALUES (3);


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


--CHAT CONTENT DATA

--ENGLISH 
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Hello! How can I help you?','Question', null , 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Game is lagging','Answer',1, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Account hacked','Answer', 1, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Report some other Issue','Answer',1, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Did you restart the Game?','Question',2, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Yes, I restarted the Game','Answer',5, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, I didn''t restart the Game','Answer',5, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Please try restarting the Game','Question',7, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Didn''t that fix the Issue?','Question',6, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Yes, It fixed the issue','Answer',9, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, It didn''t fix the issue','Answer',9, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Did you restart the Device?','Question',11, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Yes, I restarted the Device','Answer',12, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, I didn''t restart the Device','Answer',12, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Please try restarting the Device','Question',14, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Didn''t that fix the Issue?','Question',13, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Yes, It fixed the issue','Answer',16, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, It didn''t fix the issue','Answer',16, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Please describe the issue below','Question',18, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Do you want to restore the account?','Question',3, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Yes, I want to restore the account','Answer',20, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, I don''t want to restore the account','Answer',20, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('How do you want to restore?','Question',21, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Full restore (Restores the account data with a new account)','Answer',23, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Partial restore(Restore only hacked platform)','Answer',23, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Please mention the new account details below','Question',24, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Please help up by providing the hacked platform details below','Question',25, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Please describe the issue below','Question',4, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Yes, It fixed the issue','Answer',8, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, I have different issue','Answer',8, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Please describe the issue below','Question',30, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Yes, It fixed the issue','Answer',15, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, I have different issue','Answer',15, 1);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Please describe the issue below','Question',33, 1);

--HINDI
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?','Question', null, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('खेल पिछड़ रहा है','Answer',35, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('अकाउंट हैक हो गया','Answer', 35, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('किसी अन्य मुद्दे की रिपोर्ट करें','Answer',35, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('क्या आपने गेम पुनः आरंभ किया?','Question',36, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('हाँ, मैंने खेल पुनः प्रारंभ किया','Answer',39, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('नहीं, मैंने गेम पुनः प्रारंभ नहीं किया है','Answer',39, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('कृपया खेल को पुनः आरंभ करने का प्रयास करें','Question',41, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('क्या इससे समस्या ठीक नहीं हुई?','Question',40, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('हाँ, इससे समस्या ठीक हो गई','Answer',43, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('नहीं, इससे समस्या ठीक नहीं हुई','Answer',43, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('क्या आपने डिवाइस को पुनरारंभ किया?','Question',45, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('हां, मैंने डिवाइस को पुनः प्रारंभ किया है','Answer',46, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('नहीं, मैंने डिवाइस को पुनरारंभ नहीं किया','Answer',46, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('कृपया डिवाइस को पुनः प्रारंभ करने का प्रयास करें','Question',48, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('क्या इससे समस्या ठीक नहीं हुई?','Question',47, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('हाँ, इससे समस्या ठीक हो गई','Answer',50, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('नहीं, इससे समस्या ठीक नहीं हुई','Answer',50, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('कृपया नीचे समस्या का वर्णन करें','Question',52, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('क्या आप खाता पुनर्स्थापित करना चाहते हैं?','Question',37, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('हाँ, मैं खाता पुनर्स्थापित करना चाहता हूँ','Answer',54, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('नहीं, मैं खाता पुनर्स्थापित नहीं करना चाहता','Answer',54, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('आप कैसे पुनर्स्थापित करना चाहते हैं?','Question',55, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('पूर्ण पुनर्स्थापना (नए खाते के साथ खाता डेटा पुनर्स्थापित करता है)','Answer',57, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('आंशिक पुनर्स्थापना (केवल हैक किए गए प्लेटफ़ॉर्म को पुनर्स्थापित करें)','Answer',57, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('कृपया नीचे नए खाते का विवरण बताएं','Question',58, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('कृपया नीचे हैक किए गए प्लेटफ़ॉर्म विवरण प्रदान करके सहायता करें','Question',59, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('कृपया नीचे समस्या का वर्णन करें','Question',38, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('हाँ, इससे समस्या ठीक हो गई','Answer',42, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('नहीं, मेरा मुद्दा अलग है','Answer',42, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('कृपया नीचे समस्या का वर्णन करें','Question',64, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('हाँ, इससे समस्या ठीक हो गई','Answer',49, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('नहीं, मेरा मुद्दा अलग है','Answer',49, 2);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('कृपया नीचे समस्या का वर्णन करें','Question',67, 2);

--SPANISH
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('¡Hola! ¿Le puedo ayudar en algo?','Question', null , 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('El juego está retrasado','Answer',69, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Cuenta pirateada','Answer', 69, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Informar algún otro problema','Answer',69, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('¿Reinició el juego?','Question',70, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Sí, reinicié el juego','Answer',73, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, no reinicié el juego','Answer',73, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Por favor intenta reiniciar el juego','Question',75, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('¿Eso no solucionó el problema?','Question',74, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Sí, solucionó el problema','Answer',77, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, no solucionó el problema','Answer',77, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('¿Reinició el dispositivo?','Question',79, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Sí, reinicié el dispositivo','Answer',80, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, no reinicié el dispositivo','Answer',80, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Intente reiniciar el dispositivo','Question',82, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('¿Eso no solucionó el problema?','Question',81, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Sí, solucionó el problema','Answer',84, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, no solucionó el problema','Answer',84, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Describe el problema a continuación','Question',86, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('¿Quieres restaurar la cuenta?','Question',71, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Sí, quiero restaurar la cuenta','Answer',88, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, no quiero restaurar la cuenta','Answer',88, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('¿Cómo quieres restaurar?','Question',89, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Restauración completa (restaura los datos de la cuenta con una cuenta nueva)','Answer',91, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Restauración parcial (Restaurar solo plataforma pirateada)','Answer',91, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Por favor mencione los detalles de la nueva cuenta a continuación','Question',92, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Ayúdenos proporcionando los detalles de la plataforma pirateada a continuación','Question',93, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Describe el problema a continuación','Question',72, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Sí, solucionó el problema','Answer',76, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, tengo un problema diferente','Answer',76, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Describe el problema a continuación','Question',98, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Sí, solucionó el problema','Answer',83, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('No, tengo un problema diferente','Answer',83, 3);
INSERT INTO chat_content(content,content_type,parent_id, model_id) VALUES ('Describe el problema a continuación','Question',101, 3);
