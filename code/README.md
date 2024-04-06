# SCAP Documentation

## Getting Started

First of all, you need to install the dependencies using the following command:

```bash
npm install
```

### Database

Instalar MySql;
Criar o banco com os comandos abaixo:

```bash
mysql --user=USER --password=PASSWORD
CREATE DATABASE scap;
```

Preencher em .env com a url do banco, algo como

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Para rodar o prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Com o comando abaixo é possível abrir um visualizador das tabelas no navegador:

```bash
npx prisma studio
```

### Servidor

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

