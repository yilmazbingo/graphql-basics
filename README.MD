## START THE APP
```
- install nodemon as development dependency or as a global module. "nodmeon" is used to keep running the server in the development environment. Your app will not use in production. Since you might be building more apps in your local environment, it is better to install globally.
```
sudo npm i -g nodemon       // in linux global modules are installed with "sudo" privileges
```
- in package.json add this script

"scripts": {
    "start": "nodemon src/index.js --ext js,graphql --exec babel-node",
  }
```
    this script saying nodemon will serve "src/index.js" file through "babel-node"

## SET UP BABEL
```
npm i --save @babel/preset-env @babel/core @babel/node @babel/plugin-proposal-object-rest-spread
```
- create a ``` .babelrc ``` in the root of the app and add this
```
{
    "presets":["@babel/preset-env"]
}
```

## SET UP GRAPHQL
```
npm i --save graphql-yoga
```
## INSTALL POSTGRESQL IN DEBIAN LINUX
- Debian includes PostgreSQL by default. in case:
```
sudo apt install postgresql -y

```
- check if it is installed
 ```
which psql
psql --version
 ```
 start the server
 ```
 $ sudo service postgresql start
 <!-- OR -->
 $ 
 
 ```
 - enter to postgres prompt. by default when postgresql installed a "postgres" user is installed but it has no default password. so you need to set up the password

``` 
 kali@kali:~$ sudo -u postgres psql postgres
 <!-- now you are in postgresql db as "postgres" user -->
 postgres=# \password
<!-- you will get "Enter Password" prompt and then retype it  -->

```

-exit the prompt
```
\q
```

## INSTALL PGADMIN4
```
apt-get install curl ca-certificates gnupg
sudo wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo vim /etc/apt/sources.list.d/pgdg.list
<!-- deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main -->
deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main
apt-get update
apt-get install pgadmin4  pgadmin4-apache2
```
- if you get this error
```
   ImportError: cannot import name 'ImmutableDict' from 'werkzeug' (/usr/lib/python
3/dist-packages/werkzeug/__init__.py)
```
   this is because that code is changed to :
```
 from werkzeug.datastructures import ImmutableDict
```
## INSTALL PGADMIN4 WITH PYTHON
```
$ sudo mkdir /var/lib/pgadmin
$ sudo mkdir /var/log/pgadmin
$ sudo chown $USER /var/lib/pgadmin
$ sudo chown $USER /var/log/pgadmin
$ python3 -m venv pgadmin4
$ source pgadmin4/bin/activate
(pgadmin4) $ pip install pgadmin4
...
(pgadmin4) $ pgadmin4
```

## SET UP DOCKER
**INSTALL DOCKER in KALI**
```
kali@kali:~$ sudo apt update
kali@kali:~$ sudo apt install -y docker.io
kali@kali:~$ sudo systemctl enable docker --now
kali@kali:~$ docker
```
**INSTALL DOCKER-COMPOSE in KALI**
```
kali@kali:~$ sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
kali@kali:~$ sudo chmod +x /usr/local/bin/docker-compose
```
## SET UP PRISMA IN DEBIAN LINUX

- Prisma ORM is used to connect database instead of native drivers. It makes our life easy like migrations, data validation, map our models, set up relationships between our data. 
- Prisma is database agnostic. If in the future if you wanna switch your db, you will not have much work to do.
- prisma wraps our dbs and exposes a graphql api.

