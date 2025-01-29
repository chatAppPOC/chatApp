

insert into users (id, first_name, last_name, platform, preferred_language, title, password, email, enabled) values
(100, 'admin', 'chat', ARRAY[1], ARRAY[1], ARRAY[5886], '$2a$12$gn5ID6i.V7b9K8G.varUGeR8J3jrRzxbj6PTZxCeY7PSfgpT4pDwu', 'admin@test.com', true),
(200, 'user', 'chat', ARRAY[1], ARRAY[1], ARRAY[5886], '$2a$12$X1vpL7Wp9Ra6RapPlY9beO.Ek5HC68cl9KqSys7dI8li.SQbemGHC', 'user@test.com', true)
------------------------------------------------------------------------------------------------------------------
insert into player (id, platform, preferred_language, title, first_name,last_name, email, enabled, password) values
(300, 1, 1, 5886, 'player', 'chat','player@test.com', true, '$2a$12$VuWa..Y77mH1UeBwFUUYJuLDbqyRA22sZKfZzWdcA1Z7xOqe/cHge')

--------------------------------------------------------------
CREATE TABLE roles (
  id bigint NOT NULL,
  name varchar(45) NOT NULL
);
insert into roles (id, name) values
(1,'ADMIN'),
(2,'USER')
-----------------------------------------------------------------
CREATE TABLE users_roles (
  user_id bigint NOT NULL,
  role_id bigint NOT NULL
);
insert into users_roles (user_id, role_id) values
(100,1),
(200,2)

insert into title (id, name) values
(5886,'MWII/WZ 2'),
(6043,'MWIII'),
(5895, 'WZ Mobile'),
(5861, 'Call of Duty: Vanguard'),
(5826, 'Call of Duty: Black Ops Cold War'),
(5893, 'Call of Duty: Modern Warfare'),
(6047, 'BO6')