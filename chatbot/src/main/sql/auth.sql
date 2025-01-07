

insert into users (id, first_name, last_name, platform, preferred_language, title, password, email, enabled) values
(100, 'admin', 'chat', ARRAY[1], ARRAY[1], ARRAY[5886], '$2a$12$gn5ID6i.V7b9K8G.varUGeR8J3jrRzxbj6PTZxCeY7PSfgpT4pDwu', 'admin@test.com', true),
(200, 'user', 'chat', ARRAY[1], ARRAY[1], ARRAY[5886], '$2a$12$X1vpL7Wp9Ra6RapPlY9beO.Ek5HC68cl9KqSys7dI8li.SQbemGHC', 'user@test.com', true),
(300, 'player', 'chat', ARRAY[1], ARRAY[1], ARRAY[5886], '$2a$12$VuWa..Y77mH1UeBwFUUYJuLDbqyRA22sZKfZzWdcA1Z7xOqe/cHge', 'player@test.com', true)
--------------------------------------------------------------
CREATE TABLE roles (
  id bigint NOT NULL,
  name varchar(45) NOT NULL
);
insert into roles (id, name) values
(1,'ADMIN'),
(2,'USER'),
(3,'PLAYER')
-----------------------------------------------------------------
CREATE TABLE users_roles (
  user_id bigint NOT NULL,
  role_id bigint NOT NULL
);
insert into users_roles (user_id, role_id) values
(100,1),
(200,2),
(300,3)