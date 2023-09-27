## Getting Started

### What you'll need

* pnpm [PNPM installation](https://pnpm.io/installation).
* Node LTS >=18
* Docker

### Installation

To install the monorepo and all of its dependencies, run the following command at the root of the project:

```sh
pnpm install
```

## Start book_stock app

```sh
cd ./apps/books-stock
```

In this folder create an `.env` file and declare env variables by following `.env.example` example. 

Then:

```sh
docker-compose up -d
```

```sh
pnpm run dev
```
