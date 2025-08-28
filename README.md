<div id="top" class="">

<div align="center" class="text-center">
<h1>WEBEMPLOYEEPROFILEPLATFORM</h1>
<p><em>Empoderando equipes, elevando o desempenho de forma contínua</em></p>

<img alt="último-commit" src="https://img.shields.io/github/last-commit/Ag0ds/WebEmployeeProfilePlatform?style=flat&logo=git&logoColor=white&color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="linguagem-principal" src="https://img.shields.io/github/languages/top/Ag0ds/WebEmployeeProfilePlatform?style=flat&color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="quantidade-linguagens" src="https://img.shields.io/github/languages/count/Ag0ds/WebEmployeeProfilePlatform?style=flat&color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">

<p><em>Construído com as ferramentas e tecnologias:</em></p>
<img alt="Express" src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white">
<img alt="JSON" src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white">
<img alt="Markdown" src="https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white">
<img alt="npm" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white">
<img alt="Prettier" src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=black">
<img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black">
<img alt="pino" src="https://img.shields.io/badge/pino-687634.svg?style=flat&logo=pino&logoColor=white">
<img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black">
<br>
<img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white">
<img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748.svg?style=flat&logo=Prisma&logoColor=white">
<img alt="Zod" src="https://img.shields.io/badge/Zod-3E67B1.svg?style=flat&logo=Zod&logoColor=white">
<img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white">
<img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white">
<img alt="React Hook Form" src="https://img.shields.io/badge/React%20Hook%20Form-EC5990.svg?style=flat&logo=React-Hook-Form&logoColor=white">
</div>

<br>
<hr>

<h2>Índice</h2>
<ul>
<li><a href="#visao-geral">Visão Geral</a></li>
<li><a href="#primeiros-passos">Primeiros Passos</a>
  <ul>
    <li><a href="#pre-requisitos">Pré-requisitos</a></li>
    <li><a href="#instalacao">Instalação</a></li>
    <li><a href="#uso">Uso</a></li>
    <li><a href="#testes">Testes</a></li>
  </ul>
</li>
</ul>

<hr>

<h2 id="visao-geral">Visão Geral</h2>
<p>O WebEmployeeProfilePlatform é uma ferramenta full-stack projetada para otimizar o gerenciamento de funcionários, acompanhamento de projetos e administração de dados organizacionais. Construído com tecnologias modernas, oferece uma arquitetura escalável, segura e de fácil manutenção para aplicações de nível empresarial.</p>

<p><strong>Por que usar o WebEmployeeProfilePlatform?</strong></p>
<p>Este projeto capacita desenvolvedores a criar e implantar rapidamente aplicações web seguras e baseadas em papéis (roles). Entre as principais funcionalidades estão:</p>

<ul>
<li>🔒 <strong>Controle de Acesso Baseado em Papéis:</strong> Garante permissões de usuários e autenticação segura via tokens JWT.</li>
<li>🛠️ <strong>Arquitetura Modular:</strong> Separa responsabilidades entre módulos, garantindo escalabilidade e manutenção simplificada.</li>
<li>🐳 <strong>Implantação em Contêiner:</strong> Usa Docker para garantir consistência em desenvolvimento e produção.</li>
<li>🎯 <strong>Integração Full-Stack:</strong> Combina frontend em Next.js com backend em Node.js, oferecendo experiências contínuas ao usuário.</li>
<li>🧹 <strong>Validação e Serialização de Dados:</strong> Mantém a integridade e a segurança dos dados em todo o sistema.</li>
</ul>

<hr>

<h2 id="primeiros-passos">Primeiros Passos</h2>

<h3 id="pre-requisitos">Pré-requisitos</h3>
<p>Este projeto requer as seguintes dependências:</p>
<ul>
<li><strong>Linguagem de Programação:</strong> TypeScript</li>
<li><strong>Gerenciador de Pacotes:</strong> Npm</li>
<li><strong>Runtime de Contêiner:</strong> Docker</li>
</ul>

<h3 id="instalacao">Instalação</h3>
<p>Construa o WebEmployeeProfilePlatform a partir do código-fonte e instale as dependências:</p>
<ol>
<li>
<p><strong>Clone o repositório:</strong></p>
<pre><code class="language-sh">git clone https://github.com/Ag0ds/WebEmployeeProfilePlatform
</code></pre>
</li>
<li>
<p><strong>Acesse o diretório do projeto:</strong></p>
<pre><code class="language-sh">cd WebEmployeeProfilePlatform
</code></pre>
</li>
<li>
<p><strong>Crie um arquivo .env:</strong></p>
<pre><code class="language-sh"# API>
PORT=3000
CORS_ORIGIN=http://localhost:3001
JWT_SECRET=troque-jwt
BCRYPT_ROUNDS=10
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/psd_colab?schema=public
</code></pre>
</li>
<li>
<p><strong>Instale as dependências:</strong></p>
</li>
</ol>

<p><strong>Usando <a href="https://www.docker.com/">docker</a>:</strong></p>
<pre><code class="language-sh">docker compose up -d db
</code></pre>

<p><strong>Usando <a href="https://www.npmjs.com/">npm</a>:</strong></p>
<pre><code class="language-sh">npm install
npx prisma migrate dev
npx prisma generate
npm run seed
</code></pre>

<p><strong>Frontend (Next.js)</p>
<pre><code class="language-sh">cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
npm pkg set scripts.dev="next dev -p 3001"
</code></pre>

<h3 id="uso">Uso</h3>
<p>Execute o projeto com:</p>

<p><strong>Backend (API)</strong></p>
<pre><code class="language-sh">npm run dev
</code></pre>

<p><strong>Front (Next)</strong></p>
<pre><code class="language-sh">cd frontend
npm run dev
</code></pre>

<p><strong>Usando <a href="https://www.docker.com/">docker</a>:</strong></p>
<pre><code class="language-sh">DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/psd_colab?schema=public
docker build -t webemployee-api .
docker run --name webemployee-api --env-file .env -p 3000:3000 -d webemployee-api
</code></pre>

<h3 id="testes">Testes</h3>

<p><strong>Login (PowerShell)</strong></p>
<pre><code class="language-sh">$body = '{"email":"gestor@empresa.com","password":"admin123"}'
Invoke-RestMethod -Method Post -Uri http://localhost:3000/auth/login -ContentType 'application/json' -Body $body
</code></pre>


<hr>
<div align="left"><a href="#top">⬆ Voltar ao topo</a></div>
<hr>
</div>

---
PS.: Me diverti muito fazendo o projeto, apesar de não ter ficado 100% como eu queria por falta de tempo, sinto que aprendi muito, e estou orgulhoso. Mesmo que não venha a ser aprovado, o projeto foi de grande enriquecimento e sinto que estou mais preparado. 
