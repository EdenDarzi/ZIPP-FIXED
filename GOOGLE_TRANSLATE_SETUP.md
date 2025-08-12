# 🌐 Configuração Google Translate API

Este guia mostra como configurar a Google Translate API no projeto para habilitar traduções automáticas.

## 📋 Pré-requisitos

1. **Conta Google Cloud Platform** (gratuita)
2. **Projeto no Google Cloud Console**
3. **Billing habilitado** (necessário mesmo para tier gratuito)

## 🚀 Passo a Passo

### 1. Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Select a project" → "New Project"
3. Nome: `zipp-translate` (ou qualquer nome)
4. Clique "CREATE"

### 2. Habilitar a Translation API

1. No menu lateral: **APIs & Services** → **Library**
2. Pesquise: `Cloud Translation API`
3. Clique na API → **ENABLE**

### 3. Configurar Billing (Obrigatório)

1. Menu lateral: **Billing**
2. **Link a billing account** ou criar nova
3. Adicione cartão de crédito (não será cobrado no tier gratuito)

### 4. Criar API Key

1. Menu lateral: **APIs & Services** → **Credentials**
2. **+ CREATE CREDENTIALS** → **API key**
3. Copie a chave gerada
4. **IMPORTANTE**: Clique em "RESTRICT KEY"
5. Em "API restrictions": Selecione **Cloud Translation API**
6. **SAVE**

### 5. Configurar no Projeto

1. Crie arquivo `.env.local` na raiz do projeto:
```bash
# Google Translate API
GOOGLE_TRANSLATE_API_KEY="AIzaSyC-sua-chave-aqui"
```

2. Adicione ao `.env.example`:
```bash
GOOGLE_TRANSLATE_API_KEY="your-google-translate-api-key-here"
```

3. **NUNCA** commite a chave real no Git!

## 💰 Custos

### Tier Gratuito (Suficiente para desenvolvimento)
- **500.000 caracteres/mês** gratuitos
- Depois: **$20 por 1 milhão de caracteres**

### Exemplo de Uso:
- "Hello world" = 11 caracteres
- Tradução completa do sistema (~10.000 strings) = ~100.000 caracteres
- **Resultado**: Várias traduções completas por mês no tier gratuito!

## 🔧 Testando a Configuração

1. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse: `http://localhost:3000/translation-demo`

3. Verifique se aparece **"Google Translate: Ativo"**

4. Teste tradução automática de textos customizados

## 🛡️ Segurança

### ✅ Boas Práticas:
- ✅ API Key restrita apenas à Translation API
- ✅ Chave apenas no `.env.local` (não commitada)
- ✅ Cache de traduções para evitar chamadas desnecessárias
- ✅ Rate limiting implementado

### ❌ Nunca Faça:
- ❌ Não commite a chave no Git
- ❌ Não use a chave no frontend (apenas backend)
- ❌ Não deixe a chave sem restrições

## 📊 Monitoramento

### Google Cloud Console:
1. **APIs & Services** → **Dashboard**
2. Veja uso da Translation API
3. Monitore quotas e custos

### No Sistema:
- Cache size no dashboard
- Hit rate das traduções
- Estatísticas de uso

## 🎯 Como Funciona o Sistema Híbrido

```
┌─────────────────┐
│  Usuário pede   │
│   tradução      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    SIM    ┌──────────────┐
│ Existe tradução │ ────────▶ │   Retorna    │
│    manual?      │           │   manual     │
└─────────┬───────┘           └──────────────┘
          │ NÃO
          ▼
┌─────────────────┐    SIM    ┌──────────────┐
│ Existe no cache │ ────────▶ │   Retorna    │
│   automático?   │           │    cache     │
└─────────┬───────┘           └──────────────┘
          │ NÃO
          ▼
┌─────────────────┐           ┌──────────────┐
│ Chama Google    │ ────────▶ │ Salva cache  │
│   Translate     │           │ + Retorna    │
└─────────────────┘           └──────────────┘
```

## 🚨 Resolução de Problemas

### "Google Translate: Inativo"
1. ✅ Verifique se `.env.local` existe
2. ✅ Verifique se a chave está correta
3. ✅ Reinicie o servidor (`npm run dev`)
4. ✅ Verifique se a API está habilitada no Google Cloud

### "Erro na tradução"
1. ✅ Verifique billing no Google Cloud
2. ✅ Verifique se não excedeu a quota
3. ✅ Verifique logs do console

### "Rate limit exceeded"
1. ✅ Aguarde alguns minutos
2. ✅ Implemente delay entre chamadas
3. ✅ Use mais cache

## 📈 Próximos Passos

1. **Produção**: Use Service Account em vez de API Key
2. **Performance**: Implemente Redis para cache distribuído
3. **Analytics**: Adicione métricas de uso
4. **Fallback**: Configure DeepL como backup

## 🎉 Resultado Final

Com a configuração completa, o sistema:

✅ **Traduz automaticamente** textos não traduzidos manualmente  
✅ **Cache inteligente** evita chamadas desnecessárias  
✅ **Fallback gracioso** se a API estiver indisponível  
✅ **Zero configuração** para desenvolvedores (funciona sem API)  
✅ **Escalável** para centenas de idiomas  

**Agora você tem um sistema de tradução profissional! 🚀**

