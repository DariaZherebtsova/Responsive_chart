
// Перечисление зависимостей:
var path = require('path');
var express = require('express');

// Описание настроек:
var staticSiteOptions = {
   portnum: 8080, // слушать порт 80
   maxAge: 1000 * 60 * 1 // хранить страницы в кэше 1 минут
};

// Запуск сайта:
express().use(express.static(
   path.join(__dirname, '/'),
   staticSiteOptions
)).listen(staticSiteOptions.portnum);

console.log('Serverrrrrrrr');

