# SCAP Documentation

##### Table of Contents

- [APP](#app)
- [Getting Started](#getting-started)
- [Built With](#built-with)

## APP

SCAP is a system that aims to help manage requests from professors of the Department of Informatics (DI) at the Federal University of Espírito Santo (UFES) for leave to attend conferences.

#### Features

| Actors    | Features                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| Professor | - Request leave to attend international or national conferences; <br> - Manifest against a professor leave. |
| Secretary | - Manage system's users; <br> - Manage requests status.                                                     |

#### Professor's Features

The following gif represents some of the professor's features.

![Professor Features](./public/professor.gif)

#### Secretary's Features

The following gif represents some of the professor's features.

![Secretary Features](./public/secretario.gif)

## Getting Started

First of all, you need to install the dependencies using the following command:

```bash
npm install
```

### Database

Install MySql and create the database using the following commands:

```bash
mysql --user=USER --password=PASSWORD
CREATE DATABASE scap;
```

Fill the `.env` file with the database url, it should look like this:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Then run the following commands to generate tables with **prisma**.

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Prisma also allows you to visualize data within a browser, to do so

```bash
npx prisma studio
```

### Servidor

Finally, run the development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Built With

[![Next][Next.js]][Next-url]
[![Tailwind][Tailwind-css]][Tailwin-url]

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Tailwind-css]: https://img.shields.io/badge/tailwindcss-0F172A?style=for-the-badge&logo=tailwindcss
[Tailwin-url]: https://tailwindcss.com

