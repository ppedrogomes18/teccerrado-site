# TecCerrado · site

Site de uma página da TecCerrado, assistência técnica de computadores em Luziânia - GO.
É HTML, CSS e JavaScript puros: não tem framework nem etapa de build. Basta subir os arquivos.

```
index.html            página inteira (todo o texto fica aqui)
css/style.css         estilos (feitos primeiro para o celular)
js/main.js            CONFIG (WhatsApp/Instagram), menu, animações e easter egg
assets/               logos originais, logo.svg e favicon.svg
assets/img/           imagens otimizadas, imagem de compartilhamento e fotos provisórias
scripts/gerar-imagens.py   gera as imagens otimizadas a partir dos logos
```

## Encontrando o que falta preencher

Tudo o que é provisório está marcado com **`TODO`**. No VS Code, aperte `Ctrl+Shift+F`
(`Cmd+Shift+F` no Mac) e pesquise `TODO` para ver a lista completa.

## WhatsApp, Instagram e mensagem padrão

Abra `js/main.js`. Logo no topo está o objeto `CONFIG`:

```js
const CONFIG = {
  whatsapp: '5561900000000',   // 55 + DDD + número, só números
  instagram: 'tec_cerrado',    // sem o @
  mensagemPadrao: 'Olá, TecCerrado! Vim pelo site e gostaria de um orçamento.',
};
```

O script atualiza sozinho todos os botões do site. Mesmo assim, para o caso de alguém
abrir o site com JavaScript desligado (e para o Google), faça também uma busca e
substituição em `index.html`:

- `5561900000000` → seu número no mesmo formato
- `(61) 90000-0000` → seu número formatado
- `+55-61-90000-0000` (dentro do bloco `application/ld+json`) → seu número
- `tec_cerrado/` nos links do Instagram → o novo @, se um dia mudar

### Mensagens de cada serviço

Cada botão "Pedir orçamento" tem um atributo `data-msg` com a mensagem que já chega
escrita no WhatsApp. É só editar o texto em `index.html`.

## Preços

Em `index.html`, procure por `R$ XX` (cada card de serviço tem um). Use o formato
brasileiro: `R$ 99,90`.

## Garantia, horário e formas de pagamento

Também em `index.html`:

- **Garantia:** procure `XX dias` na seção de dúvidas.
- **Prazos e pagamento:** os textos das dúvidas estão logo abaixo de cada `TODO`.
- **Horário:** procure `seg. a sáb., das 8h às 18h` e também `openingHours` no bloco
  `application/ld+json`, no topo do arquivo (formato: `Mo-Sa 08:00-18:00`).

## Fotos e depoimentos (retirados por enquanto)

As seções **Antes e depois** e **Depoimentos** foram tiradas do site até existirem
fotos e depoimentos reais. O código delas está guardado em `secoes-guardadas.html`.
Para trazer de volta, copie o trecho desse arquivo e cole no `index.html`, logo antes
do comentário `Criação de sites`. O comparador volta a funcionar sozinho, porque o
`main.js` já está preparado. Depois, edite o conteúdo como explicado abaixo.

### Antes e depois (comparador)

1. Tire duas fotos **do mesmo ângulo**, uma antes e outra depois da limpeza.
2. Recorte as duas no mesmo tamanho (sugestão: 1200 × 750) e salve em `.webp`
   (dá para converter de graça em https://squoosh.app).
3. Coloque em `assets/img/`, por exemplo `antes.webp` e `depois.webp`.
4. Em `index.html`, troque `antes-placeholder.svg` e `depois-placeholder.svg` pelos
   novos nomes e ajuste `width`/`height` se o tamanho for outro.

### Galeria

Os quatro quadrados com "Foto em breve" usam `assets/img/galeria-placeholder.svg`.
Troque cada `src` por uma foto quadrada (600 × 600, `.webp`) e atualize o `alt`
(descrição da foto) e a legenda (`figcaption`).

### Depoimentos

Na seção "Depoimentos" há três cartões com `TODO: depoimento real de cliente`.
Substitua pelo texto real e pelo nome do cliente, **sempre com autorização dele**.
Não invente depoimentos. Se tiver só um ou dois, apague os cartões que sobrarem
(cada um é um `<li class="depo">`).

## Domínio, imagem de compartilhamento e logos

- O endereço `https://teccerrado.com.br/` aparece no `<head>` (canonical, Open Graph,
  Twitter e JSON-LD). Se o domínio for outro, troque todos.
- Se mudar o logo, coloque os novos `assets/logo-horizontal.png` e
  `assets/logo-quadrada.png` (sempre com fundo `#0D0C08`) e rode:

  ```bash
  pip install pillow
  python3 scripts/gerar-imagens.py
  ```

  Isso recria as versões WebP/PNG, a imagem de compartilhamento (1200 × 630) e os favicons.

## Testar no computador

Na pasta do projeto:

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000 no navegador. Para ver como fica no celular, use o modo
de dispositivo do Chrome (F12 → ícone de celular).

## Publicar

### Vercel

1. Crie uma conta em https://vercel.com (pode entrar com o GitHub).
2. Suba esta pasta para um repositório no GitHub.
3. Na Vercel: **Add New → Project**, escolha o repositório.
4. Em *Framework Preset* deixe **Other**. Não precisa de comando de build nem de pasta de saída.
5. Clique em **Deploy**. Em um minuto o site está no ar num endereço `.vercel.app`.

Sem GitHub: instale o Node.js e rode `npx vercel` dentro da pasta.

### Netlify

1. Crie uma conta em https://netlify.com.
2. Mais rápido: em **Sites → Add new site → Deploy manually**, arraste a pasta do projeto.
3. Ou conecte o repositório do GitHub (**Import an existing project**), deixando o
   comando de build vazio e a pasta de publicação como `/`.

Toda vez que você fizer `git push`, a Vercel e a Netlify publicam a nova versão sozinhas.

## Domínio próprio (teccerrado.com.br)

1. Registre o domínio em https://registro.br. Domínios `.com.br` podem ser registrados
   com CPF, então não precisa de CNPJ.
2. **Vercel:** no projeto, vá em **Settings → Domains**, adicione `teccerrado.com.br`
   e também `www.teccerrado.com.br`. A Vercel mostra os registros DNS que você precisa criar.
   **Netlify:** **Domain management → Add a domain**, e ela mostra os registros.
3. No Registro.br, abra o domínio → **DNS → Editar zona** (ou "Configurar endereçamento")
   e crie os registros indicados. Normalmente são:
   - um registro **A** para `teccerrado.com.br` apontando para o IP informado;
   - um **CNAME** para `www` apontando para o endereço informado
     (ex.: `cname.vercel-dns.com` ou `seu-site.netlify.app`).
4. Aguarde a propagação (de minutos a algumas horas). O HTTPS (cadeado) é ativado
   automaticamente.

## Acessibilidade e movimento

- Quem ativa "reduzir movimento" no celular ou no computador vê o site sem animações
  (o mascote fica parado na pose do logo e a caça aos bugs é desligada).
- O verde-oliva (`#6B8E23`) é usado só em texto grande, para manter bom contraste.
- O menu, as dúvidas e o comparador antes/depois funcionam pelo teclado.

## Easter egg

De vez em quando, pequenos bugs em pixel art atravessam a tela (no máximo três por vez).
Tocar em um faz ele explodir e soma no placar "bugs caçados". Os bugs nunca bloqueiam
cliques: dá para tocar em botões e links normalmente, mesmo se um bug estiver passando
por cima. O placar fica salvo só no navegador de cada pessoa.
