# employee-testing-app

## Swagger Rest API
#### https://app.swaggerhub.com/apis/aleksey-pavlov/employee-testing-app/1.0

## Database scheme
![Screenshot](./docs/database-scheme.jpg)

## Database sheme v2
#### Второй вариант предполагает копирование во время старта теста в таблицы с привязкой к юзеру. Такой вариант позволяет удалить оригинальный тест
#### Плюсы: сохраняется инфа по тесту на момент старта, во время теста можно работать только с таблицами UserTest не дергая оригиналы
#### Минусы: происходит дублирование данных
![Screenshot](./docs/database-scheme_v2.jpg)

## Запуск
#### Из корневой папки репозитория:
> #### Запускаем контейнер с базой
> `docker-compose up -d database` - на первом запуске происходит инициализация.
> процесс инициализации можно посмотреть по логам командой `docker-compose logs -f database`

> #### После завершения инициализации, накатываем структуру БД
> `sh database-install.sh`

> #### Запускаем сервер и клиент
> `docker-compose up -d server client`

> Приложение доступно по адресу http://127.0.0.1:8080