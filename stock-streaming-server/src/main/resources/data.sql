create database if not exists stock_streaming_server;

use stock_streaming_server;

create table if not exists `user`(
	id int not null auto_increment primary key,
    first_name varchar(45) not null,
    last_name varchar(45) not null,
	email varchar(50) not null unique,
    username varchar(50) not null unique,
    `password` varchar(60) not null, -- encrypted
    user_status enum('Active', 'Inactive') default 'Inactive'

);

create table if not exists `confirmation_token`(
   id int not null auto_increment primary key,
   token varchar(60) not null,
   user_id int,
   created_on datetime not null default current_timestamp,
   foreign key(user_id) references `user`(id)
);
