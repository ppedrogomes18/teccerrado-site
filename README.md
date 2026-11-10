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

## Publicar (GitHub Pages)

O site fica no repositório público https://github.com/ppedrogomes18/teccerrado-site
e é publicado pelo **GitHub Pages**, de graça e sem selo de propaganda.

Para publicar uma alteração, salve os arquivos e envie para o GitHub:

```bash
git add -A
git commit -m "Descreva a alteração"
git push
```

Em 1 a 2 minutos o GitHub atualiza o site sozinho. Dá para acompanhar em
**Actions** ou **Settings → Pages**, no repositório.

O arquivo `_config.yml` lista o que fica no repositório mas **não** vai para o site
(README, scripts, seções guardadas e imagens provisórias). Se trouxer de volta a seção
"Antes e depois", tire as imagens `*-placeholder.svg` dessa lista.

## Domínio (teccerrado.com.br)

- **Registro:** Registro.br, no CPF do dono, com vencimento anual. Renove todo ano para
  não perder o domínio.
- **DNS:** fica na **Netlify** (servidores `dns1.p04.nsone.net` e `dns2.p04.nsone.net`).
  Não apague a conta da Netlify nem a zona DNS `teccerrado.com.br`, senão o domínio para
  de funcionar. Registros configurados:
  - `A` em `teccerrado.com.br` → `185.199.108.153`, `185.199.109.153`,
    `185.199.110.153` e `185.199.111.153` (GitHub Pages)
  - `AAAA` em `teccerrado.com.br` → `2606:50c0:8000::153` até `2606:50c0:8003::153`
  - `CNAME` em `www` → `ppedrogomes18.github.io`
- **Arquivo `CNAME`:** na raiz do projeto, avisa ao GitHub qual é o domínio. Não apague.
- **HTTPS:** emitido de graça pelo GitHub. Fica em **Settings → Pages → Enforce HTTPS**.

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
