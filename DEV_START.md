# 🚀 Comando Único para Rodar Tudo

## ⚡ Rodar Backend + Frontend e abrir a página

```bash
npm start
```

Este comando inicia:
- ✅ Backend (Express em `http://localhost:4000`) com auto-reload via nodemon
- ✅ Frontend (Expo Web em `http://localhost:8082`) e abre a página no navegador

## 🎯 Saída esperada

Você verá:
```
[0] Servidor rodando em http://localhost:4000
[1] Waiting on http://localhost:8082
[1] Web is waiting on http://localhost:8082
```

A página abre sozinha em `http://localhost:8082`. Se não abrir, acesse essa URL no navegador.

## 📝 Outros scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm start` | 🔥 Backend + Frontend Web (abre a página) |
| `npm run dev` | Backend + Frontend com `--clear` (porta 8083) |
| `npm run expo` | Expo só (menu com QR code) |
| `npm run backend` | Backend só (sem auto-reload) |
| `npm run android` | Expo em Android |
| `npm run ios` | Expo em iOS |
| `npm run web` | Expo em Web (sem backend) |

## 🛑 Parar os servidores

Pressione `Ctrl+C` no terminal para parar ambos os servidores.

## ✨ Benefícios

- ✅ Um único comando para tudo
- ✅ Backend auto-recarrega com nodemon
- ✅ Frontend auto-recarrega com Expo
- ✅ Perfeito para desenvolvimento
