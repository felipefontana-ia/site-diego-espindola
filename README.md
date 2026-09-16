# Site — Dr. Diego Espíndola (Cirurgião Vascular)

Site institucional pronto pra publicar. Não precisa de instalação, build nem servidor — é só abrir
`index.html` no navegador ou publicar a pasta inteira.

## Como publicar (escolha uma opção)

### 1) Netlify Drop (mais fácil, sem conta)
1. Acesse **app.netlify.com/drop**
2. Arraste esta pasta inteira (`site-diego-espindola`) para a área de drop
3. Pronto — você recebe um link público na hora

### 2) GitHub Pages
1. Crie um repositório no GitHub e suba os arquivos desta pasta (o `index.html` precisa ficar na raiz)
2. Vá em **Settings → Pages** e ative a publicação a partir da branch principal
3. O site fica em `seuusuario.github.io/nome-do-repositorio`

### 3) Enviar por ZIP
Compacte esta pasta e envie para quem for hospedar o site (ou para o suporte do domínio).

## O que trocar antes de publicar de verdade (checklist)

As fotos usadas são reais (banco Pexels, uso comercial liberado), mas são temporárias:

1. Troque pelas fotos do próprio consultório/do Dr. Diego quando tiver.
2. Salve as novas fotos na pasta `img/` com os mesmos nomes dos arquivos atuais
   (`hero.jpg`, `dr-diego.jpg`, `exame-doppler.jpg`, `consultorio.jpg`, `sala-espera.jpg`, `exame-clinico.jpg`)
   — assim elas encaixam automaticamente no tamanho certo, sem quebrar o layout.
3. No `index.html`, procure os comentários `<!-- TROCAR: ... -->` — eles marcam:
   - o texto de formação/trajetória do médico (Sobre)
   - os depoimentos (são exemplos — troque por depoimentos reais de pacientes)
   - o horário de atendimento
   - e-mail e Instagram (estão como placeholder)
   - CNPJ, se o atendimento for via pessoa jurídica

## Outras observações

- O botão flutuante de WhatsApp e o formulário de contato já apontam para **(82) 99427-0960**.
- O mapa usa o endereço: Av. Comendador Gustavo Paiva, 2990, Mangabeiras, Maceió-AL (Centro Médico do
  Maceió Shopping) — carrega automaticamente quando o site está no ar (não aparece em preview local por
  bloqueio do navegador, é normal).
- A Política de Privacidade é uma base simples de LGPD — vale revisar com um profissional antes de publicar.
- Para rodar de novo esta skill: trocar paleta, adicionar página, atualizar quando o consultório mudar de
  endereço, ou gerar o site pra outro cliente.
