# Books Store

## Getting Started

### What you'll need

* Node LTS >=18
* Docker

### Installation

Go to `apps/books-stock` and `app/books-store` and create `.env` file as in `.env.example`.

Then to install the monorepo and all of its dependencies, run at the root of the project:

```sh
npm install
```

### Run application locally

At the root of the project run:

```sh
npm run infrastructure:start
npm run books-store:start:dev
npm run books-stock:start:dev
```

The `books-store` and `books-stock` apps should be up and running on the ports set in corresponding `.env` files.

## Idea of the project

The idea behind this entire project is to create an event-driven, microservices based application for book stock management so that the user can order books from the stock and check the current status of their order. 

### Application architecture diagram

![C4 Application architecture diagram](./c4-books-store.drawio.png)
