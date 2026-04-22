# JNPay - Sistema de Faturamento

Este é um projeto de faturamento desenvolvido como uma demonstração de conhecimentos técnicos utilizando o ecossistema PHP, JavaScript, TypeScript, React e PostgreSQL.

## 🚀 Sobre o Projeto

O JNPay busca exemplificar a integração entre um backend robusto e um frontend reativo.
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

    _Certifique-se de que `DB_HOST` em seu `.env` esteja como `postgresbd` (o nome do serviço definido no Docker Compose)._

2. **Subir os Containers:**
   Execute o comando abaixo na raiz do projeto:

    ```bash
    docker-compose up -d
    ```

    _O Docker irá baixar as imagens, instalar as dependências do Composer e NPM, rodar as migrações e subir o servidor automaticamente._

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

## 🧠 Regras de Negócio e Lógica de Pagamento

O sistema implementa uma lógica rigorosa de faturamento e pagamentos, centralizada no método `updatePay` do `InvoiceController`.

### 1. Criação de Fatura
- Uma fatura deve conter obrigatoriamente pelo menos um item.
- O valor total da fatura é calculado automaticamente pela soma dos valores de seus itens.
- O status inicial de toda nova fatura é **"PENDENTE"**.

### 2. Pagamento Parcial e Proporcionalidade
O sistema permite pagamentos flexíveis, seguindo a lógica:
- O usuário informa o valor que deseja pagar.
- **Distribuição Proporcional**: O valor pago é distribuído entre todos os itens da fatura com base no peso de cada um no valor total.
- **Exemplo de Cálculo**:
    - **Fatura Total**: R$ 100,00
    - **Item 1**: R$ 40,00 (40% do total)
    - **Item 2**: R$ 60,00 (60% do total)
    - **Pagamento Realizado**: R$ 50,00
    - **Resultado**: O Item 1 recebe R$ 20,00 (50% do seu valor) e o Item 2 recebe R$ 30,00 (50% do seu valor).
- **Status da Fatura**:
    - Se o valor pago for menor que o total: o status muda para **"PARCIALMENTE_PAGO"**.
    - Se o valor pago atingir 100% do total: o status muda para **"PAGO"** e todos os itens ficam com `percentualPago = 100`.

### 3. Validações de Consistência
- **Limite de Pagamento**: Não é permitido registrar um pagamento que resulte em um valor total superior ao valor da fatura.
- **Vínculo de Itens**: Itens só podem ser associados a faturas existentes.
- **Integridade**: O valor total da fatura deve ser sempre consistente com a soma dos itens relacionados.

---

## 🔑 Acesso ao Sistema

Após iniciar a aplicação, siga as orientações abaixo para o primeiro acesso:

### 📝 Primeiro Acesso (Registro)
1. Na tela inicial, localize e clique no botão **Registrar** (Register).
2. Preencha os campos solicitados (Nome, E-mail e Senha) para criar sua conta.
3. Após o registro, você será redirecionado para o dashboard do sistema.

### 🔓 Acessos Posteriores (Login)
1. Caso já possua uma conta, clique em **Login**.
2. Informe suas credenciais de acesso (E-mail e Senha) cadastradas anteriormente.
3. Clique em acessar para entrar no sistema.

---

## ⚙️ Variáveis de Ambiente (.env)

O projeto depende do arquivo `.env` corretamente preenchido. O arquivo `.env.example` contém todas as chaves necessárias. Fique atento especialmente às chaves de banco de dados (`DB_CONNECTION`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`), garantindo que correspondam ao seu ambiente (Docker ou Local).

---

## 📜 Licença

Este projeto está sob a licença MIT.
