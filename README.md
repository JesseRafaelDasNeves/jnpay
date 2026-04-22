# JNPay - Sistema de Faturamento

Este é um projeto de faturamento desenvolvido como uma demonstração de conhecimentos técnicos avançados utilizando um ecossistema moderno focado em performance, tipagem e escalabilidade.

## 🚀 Sobre o Projeto

O JNPay busca exemplificar a integração entre um backend Robusto e um frontend Reativo.
As principais tecnologias utilizadas são:
- **Backend:** Laravel 13 & PHP 8.5
- **Frontend:** React & TypeScript
- **Banco de Dados:** PostgreSQL 18.1

---

## 🛠️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

### Para execução via Container (Recomendado):
- **Windows:** WSL2 (Windows Subsystem for Linux) instalado e configurado.
- **Docker & Docker Compose:** Instalados e em funcionamento.

### Para execução Local (Sem Docker):
- **PHP:** Versão 8.5 ou superior.
- **Node.js:** Versão 24 ou superior.
- **Gerenciador de Pacotes:** `npm` e `composer`.
- **Banco de Dados:** PostgreSQL configurado e acessível.

---

## 🏗️ Como Executar via Container (WSL/Docker)

Esta é a forma mais simples e rápida de rodar o projeto, garantindo que o ambiente seja idêntico ao de desenvolvimento.

1. **Configurar Ambiente:**
   Copie o arquivo de exemplo para o arquivo definitivo:
   ```bash
   cp .env.example .env
   ```
   *Certifique-se de que `DB_HOST` em seu `.env` esteja como `postgresbd` (o nome do serviço definido no Docker Compose).*

2. **Subir os Containers:**
   Execute o comando abaixo na raiz do projeto:
   ```bash
   docker-compose up -d
   ```
   *O Docker irá baixar as imagens, instalar as dependências do Composer e NPM, rodar as migrações e subir o servidor automaticamente.*

3. **Acessar a Aplicação:**
   A aplicação estará disponível em: [http://localhost:8000](http://localhost:8000)

---

## 💻 Como Executar Fora do Container

Caso prefira rodar o projeto diretamente em sua máquina:

1. **Instalar Dependências PHP:**
   ```bash
   composer install
   ```

2. **Instalar Dependências JavaScript:**
   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente:**
   Copie o arquivo `.env.example` para `.env` e configure suas credenciais de banco de dados locais.
   ```bash
   cp .env.example .env
   ```

4. **Gerar Chave da Aplicação:**
   ```bash
   php artisan key:generate
   ```

5. **Executar Migrações:**
   ```bash
   php artisan migrate
   ```

6. **Iniciar o Servidor de Desenvolvimento:**
   Você precisará de dois terminais abertos:
   
   **Terminal 1 (Backend):**
   ```bash
   php artisan serve
   ```
   
   **Terminal 2 (Frontend/Vite):**
   ```bash
   npm run dev
   ```

---

## ⚙️ Variáveis de Ambiente (.env)

O projeto depende do arquivo `.env` corretamente preenchido. O arquivo `.env.example` contém todas as chaves necessárias. Fique atento especialmente às chaves de banco de dados (`DB_CONNECTION`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`), garantindo que correspondam ao seu ambiente (Docker ou Local).

---

## 📜 Licença

Este projeto está sob a licença MIT.
