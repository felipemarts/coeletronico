# Coelectronico – Mapa de Coleta de Lixo Eletrônico

Este projeto é um **Mapa Interativo de Pontos de Coleta de Lixo Eletrônico, Pilhas, Lâmpadas e Toners**. Seu objetivo é facilitar que qualquer pessoa encontre pontos oficiais para o descarte correto de resíduos eletrônicos, contribuindo para o meio ambiente.

## ✨ Funcionalidades

- Visualização facilitada de pontos de coleta na sua cidade.
- Filtros por tipo de resíduo: eletrônico, pilhas, lâmpadas, toners, etc.
- Localização inicial automática pelo navegador.
- Lista lateral com todos os pontos visíveis e informações detalhadas.

## 🚀 Como rodar o projeto localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/coelectronico.git
   cd coelectronico
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn
   ```

3. **Execute em modo desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse:**  
   O app estará rodando normalmente em [http://localhost:5173](http://localhost:5173) ou endereço indicado no terminal.

---

## 📝 Como contribuir

1. **Fork este repositório.**
2. Crie uma branch para sua contribuição:
   ```bash
   git checkout -b feature/nome-da-sua-feature
   ```
3. Faça suas alterações e commits.
4. Abra um Pull Request com uma descrição clara das suas mudanças.

### Exemplos de contribuição
- Corrigir ou adicionar pontos no arquivo `pontos.json`.
- Sugerir melhorias de usabilidade.
- Corrigir bugs.
- Melhorar o visual.

---

## 📍 Como adicionar ou editar pontos no arquivo `pontos.json`

O arquivo [`public/pontos.json`](public/pontos.json) segue a estrutura:

```json
[
  {
    "tipo": "Pilhas e Baterias",
    "itens": [
      {
        "Empresa": "Supermercado Exemplo",
        "Endereço": "Rua das Flores, 50",
        "Região": "Centro",
        "Contato": "(11) 98765-4321",
        "latitude": -23.550520,
        "longitude": -46.633308
      },
      ...
    ]
  },
  ...
]
```

### Adicionando um novo ponto

1. Na seção `"tipo"` correspondente (ex: "Pilhas e Baterias"), adicione um novo objeto em `"itens"`:
    ```json
    {
      "Empresa": "Nova Loja",
      "Endereço": "Av. Nova, 100",
      "Região": "Bairro Novo",
      "Contato": "(11) 91234-5678",
      "latitude": -23.551234,
      "longitude": -46.624567
    }
    ```
2. Para um novo tipo (ex: "Baterias de Carro"), adicione todo um novo bloco:
    ```json
    {
      "tipo": "Baterias de Carro",
      "itens": [
        {
          "Empresa": "...",
          ...
        }
      ]
    }
    ```
**Certifique-se de que as coordenadas estão corretas!**  
Use Google Maps para encontrar latitude e longitude de um endereço: clique com botão direito → "O que há aqui?" e copie as coordenadas exibidas.

3. Salve o arquivo `pontos.json`.  
4. Faça um Pull Request com sua sugestão de ponto(s) ou atualização.

---

## 💡 Dúvidas?

Abra uma issue ou envie um Pull Request!

---

**Contribua 💚 e ajude a tornar o descarte eletrônico mais sustentável!**