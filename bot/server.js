const env = require('../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')
const bot = new Telegraf(env.token)

const tecladoOpcoes = Markup.keyboard([
    ['O que o bot faz?', '/menu'],
]).resize().extra()

const tecladoOpcoesIniciais = Markup.keyboard([
    ['Ações']
]).resize().extra()

const tecladoAcoes = Markup.keyboard([
    ['Consultar ações!']
]).resize().extra()

const tecladoOpcoes2 = Markup.keyboard([
    ['Consultar outra ação!', 'Não, obrigado!']
]).resize().extra()

const tecladoReiniciar = Markup.keyboard([
    ['/start']
]).resize().extra()

bot.start(async ctx => {
    const nome = ctx.update.message.from.first_name
    await ctx.replyWithMarkdown(`Olá, ${nome}!`)
    await ctx.replyWithMarkdown(`_Posso te ajudar em algo?_`, tecladoOpcoes)
})

bot.hears('O que o bot faz?', ctx => {
    ctx.replyWithMarkdown('Esse Bot irá te ajudar a conferir e companhar as ações da bolsa de valores!' + '\nVamos conferir?', tecladoOpcoes)
})

bot.hears('/menu', ctx => {
    ctx.replyWithMarkdown('Escolha uma opção: ', tecladoOpcoesIniciais)
})

bot.hears('Ações', ctx => {
    ctx.replyWithMarkdown('Vamos começar!', tecladoAcoes)
})

bot.hears('Consultar ações!', ctx => {
    ctx.replyWithMarkdown('Qual ação deseja consultar?');
    bot.on("text", async (ctx) => {
        var url_da_api = "https://brapi.dev/api/quote/";
        var acao = ctx.update.message.text;
        
        fetch((url_da_api + acao),{
                    method: 'GET',
                    headers: {
                            'Accept': 'application/json',
                        }
                })
                .then(resposta_da_api => resposta_da_api.json())
                .then(resposta_da_api => {
                    ctx.reply( `${resposta_da_api.results[0].symbol} - ${resposta_da_api.results[0].longName}` + `\n-> Cotação: ${resposta_da_api.results[0].regularMarketPrice}` + `\n-> Mínima do dia: ${resposta_da_api.results[0].regularMarketDayLow}⬆️` + `\n-> Máxima do dia: ${resposta_da_api.results[0].regularMarketDayHigh}⬇️` + `\n-> Mínima 52 semanas: ${resposta_da_api.results[0].fiftyTwoWeekLow}📉` + `\n-> Máxima 52 semanas: ${resposta_da_api.results[0].fiftyTwoWeekHigh}📈`);
                })
                .then( () => { ctx.replyWithMarkdown(`Posso te ajudar em algo mais?`, tecladoOpcoes2) });
   });
})


bot.hears('Consultar outra ação!', ctx => {
    ctx.replyWithMarkdown('Qual ação deseja consultar?');
    bot.on("text", async (ctx) => {
        var url_da_api = "https://brapi.dev/api/quote/";
        var acao = ctx.update.message.text;
        
        fetch((url_da_api + acao),{
                    method: 'GET',
                    headers: {
                            'Accept': 'application/json',
                        }
                })
                .then(resposta_da_api => resposta_da_api.json())
                .then(resposta_da_api => {
                    ctx.reply( `${resposta_da_api.results[0].symbol} - ${resposta_da_api.results[0].longName}` + `\nCusto atual: ${resposta_da_api.results[0].regularMarketPrice}` + `\nMenor custo: ${resposta_da_api.results[0].regularMarketDayLow}` + `\nMaior curso: ${resposta_da_api.results[0].regularMarketDayHigh}` + `\nPreço de fechamento: ${resposta_da_api.results[0].regularMarketPreviousClose}` + `\nPreço de abertura de pregão: ${resposta_da_api.results[0].regularMarketOpen}`);
                });
   });
})

bot.hears('Não, obrigado!', ctx => {
    ctx.replyWithMarkdown('Obrigada por usar nosso bot.' + '\nVolte sempre!😊', tecladoReiniciar)
})


bot.startPolling()

