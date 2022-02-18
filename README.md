![cover](cover.png)

# Juicy Api Database Workshop - Example project

Example project for the workshop *"API & Databases in the Artistic Context using Node.js"* as part of the [Juicy Workshops](https://github.com/digitalmediabremen/juicy-workshops) organized by the Digital Media Studio @ Hfk Bremen.

## Dependencies

- [express](https://www.npmjs.com/package/express)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [socket.io](https://socket.io/)

## Setup

```
npm install
```

Create `.env` file.

```
touch .env
```

And fill the following fields:

```
PORT=
MONGODB_CLUSTER=
MONGODB_USERNAME=
MONGODB_PASSWORD=
MONGODB_COLLECTION=
```

## Run

```
npm run start
```

For live update on server changes

```
npm run watch
```