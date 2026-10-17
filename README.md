# token-meter

Mod do Claude Code que mostra o consumo da sessão numa linha de status, logo abaixo do campo de mensagem:

```
ctx 123k/1M (12%) · 5h 🟩⬜⬜⬜⬜ 23.5% ↻2h30m · 7d 🟨🟨🟨⬜⬜ 61% ↻2d7h · US$ 4.20
```

| Parte | O que significa |
| --- | --- |
| `ctx 123k/1M (12%)` | Tokens usados no contexto da conversa / tamanho da janela |
| `5h 🟩⬜⬜⬜⬜ 23.5% ↻2h30m` | Limite de uso de 5 horas: quanto já foi usado e quando zera |
| `7d 🟨🟨🟨⬜⬜ 61% ↻2d7h` | Limite de uso semanal (7 dias): quanto já foi usado e quando zera |
| `US$ 4.20` | Custo estimado da sessão (aparece só quando há custo) |

A cor da barra indica o risco de bater no limite: 🟩 com 1 ou 2 blocos cheios, 🟨 com 3 e 🟥 com 4 ou 5.

A linha se atualiza sozinha durante a sessão.

## Instalação

- **Terminal (dentro do Claude Code):** `/plugin install token-meter --marketplace iLolz/token-meter`
- **Shell:** `claude plugin install token-meter --marketplace iLolz/token-meter`
- **App desktop:** **+** → **Plugins** → **Add marketplace** `iLolz/token-meter` → **Add plugin**
