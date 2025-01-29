# Knights FrontEnd

Seja bem-vindo ao Reino!
Knights FrontEnd é uma aplicação em Vue onde você pode criar um cavaleiro, renomear um cavaleiro e promover um cavaleiro ou deletá-lo.
E como bônus você pode também colocar um cavaleiro para lutar contra outro.
<br/><b>Não coloque menores de idade para lutar >.<</b>

## Sumário

- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Contribuição](#contribuição)
- [Suporte](#suporte)

## Tecnologias
  - **Vite**
  - **Vue**
  - **Axios**

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/aikid/knights-frontend.git
   cd knights-frontend
   ```

2. **Instale as dependências:**

   Certifique-se de ter o [Node.js](https://nodejs.org/) e o [npm](https://www.npmjs.com/) instalados. Em seguida, execute:

   ```bash
   npm install
   ```

## Configuração

1. **Porta da API para requisição:**

    Certifique-se de ter baixado o back-end do projeto [Back-End](https://github.com/aikid/knights-backend), após as devidas configurações do back-end, no arquivo api.ts do front-end dentro da pasta services verifique se a url usada esta assim:

   ```env
   const apiClient = axios.create({
      baseURL: 'http://localhost:3333',
    });
   ```

   Substitua o valor de `baseURL` pela URL da API na porta 3333 ou a que você definiu no back-end.

## Execução

- **Ambiente de Desenvolvimento:**

  Para iniciar a aplicação em modo de desenvolvimento:

  ```bash
  npm run dev
  ```

  A Aplicação estará disponível em:
  `http://localhost:5773`.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Suporte

  - Autor: Leandro Brito do Nascimento Nogueira
  - Linkedin: [https://www.linkedin.com/in/leandro-brito-do-nascimento-5b9319105/](https://www.linkedin.com/in/leandro-brito-do-nascimento-5b9319105/)
  - Github: [https://github.com/aikid](https://github.com/aikid/) 
