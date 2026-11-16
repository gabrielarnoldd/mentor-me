# Rodar no Expo Go

Instale as dependencias na primeira execucao:

```powershell
npm install
npm --prefix server install
```

Inicie o backend e o Expo com QR code:

```powershell
npm start
```

Conecte o celular e o computador a mesma rede Wi-Fi. No Android, escaneie o QR code pelo Expo Go; no iPhone, pela Camera. Use uma versao do Expo Go compativel com o SDK 58 deste projeto (https://expo.dev/go).

Login, cadastro, quizzes e progresso precisam do backend na porta 4000 e do MySQL configurado conforme MYSQL_SETUP.md. O aplicativo usa automaticamente o IP do computador informado pelo Metro. Permita o acesso do Node.js pela rede privada no firewall se o celular nao conseguir conectar.

Outros comandos:

- `npm run dev`: backend e Expo Go, limpando o cache do Metro.
- `npm run expo`: apenas Expo Go, com QR code na rede local.
- `npm run backend`: apenas backend.
- `npm run web`: apenas frontend web.

Para parar os servidores, pressione Ctrl+C.
