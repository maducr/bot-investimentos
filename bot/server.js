const env = require('../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')
const bot = new Telegraf(env.token)

const tecladoOpcoes = Markup.keyboard([
    ['O que o bot faz?', 'Consultar ações!']
]).resize().extra()

bot.start(async ctx => {
    const nome = ctx.update.message.from.first_name
    await ctx.replyWithMarkdown(`Olá, ${nome}!`)
    await ctx.replyWithMarkdown(`_Posso te ajudar em algo?_`, tecladoOpcoes)
})

bot.hears('O que o bot faz?', ctx => {
    ctx.replyWithMarkdown('Esse Bot irá te ajudar a conferir e companhar as ações da bolsa de valores!', tecladoOpcoes)
})

bot.hears('Consultar ações!', ctx => {
    ctx.replyWithMarkdown('Qual ação deseja consultar?');
    bot.on("text", async (ctx) => {
        await ctx.telegram
            .sendMessage(ctx.message.chat.id, ctx.message.chat)
            .then(() => {
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
                        ctx.reply("As ações da " + acao + " estao custando " + resposta_da_api.results[0].regularMarketPrice + " no momento.");
                     });
             });
   });
})


bot.startPolling()