# 🚀 Comando Único para Rodar Tudo

## ⚡ Rodar Backend + Frontend Simultaneamente

```bash
npm run dev
```

Este comando inicia:
- ✅ Backend (Express em `http://localhost:4000`) com auto-reload via nodemon
- ✅ Frontend (Expo em `http://localhost:8082`) com auto-refresh

## 🎯 Saída esperada

Você verá:
```
[0] Servidor rodando em http://localhost:4000
[1] › Scan the QR code above to open in Expo Go.
[1] › Web: http://localhost:8082
```

## 📝 Outros scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | 🔥 Backend + Frontend (com auto-reload) |
| `npm start` | Frontend só (sem auto-reload) |
| `npm run backend` | Backend só (sem auto-reload) |
| `npm run android` | Expo em Android |
| `npm run ios` | Expo em iOS |
| `npm run web` | Expo em Web |

## 🛑 Parar os servidores

Pressione `Ctrl+C` no terminal para parar ambos os servidores.

## ✨ Benefícios

- ✅ Um único comando para tudo
- ✅ Backend auto-recarrega com nodemon
- ✅ Frontend auto-recarrega com Expo
- ✅ Perfeito para desenvolvimento
