const Discord = require('discord.js');
let pageEmbeds = [];

Discord.Message.prototype.replyPages = function(embeds){
    let msg = this;
    this.channel.send(embeds[0]).then(message => {
        message.react('⏪').then(() => {
            message.react('⬅').then(() => {
                message.react('⏹').then(() => {
                    message.react('➡').then(() => {
                        message.react('⏩').then(() => {
                            pageEmbeds[message.id] = {embeds: embeds, user: msg.author, currentPage: 0};
                        });
                    });
                });
            });
        });
    });
}

module.exports.createListener = function(client){
    client.on('messageReactionAdd', (reaction, user) => {
        if(pageEmbeds[reaction.message.id]){
            if(pageEmbeds[reaction.message.id].user.id==user.id){
                if(reaction.message.reactions.get('⬅').users.find('id', user.id)!=undefined){
                    if(pageEmbeds[reaction.message.id].currentPage!=0){
                        reaction.message.edit(pageEmbeds[reaction.message.id].embeds[pageEmbeds[reaction.message.id].currentPage - 1]);
                        pageEmbeds[reaction.message.id].currentPage--;
                    }
                }
                if(reaction.message.reactions.get('➡').users.find('id', user.id)!=undefined){
                    if(pageEmbeds[reaction.message.id].embeds.length!=pageEmbeds[reaction.message.id].currentPage + 1){
                        reaction.message.edit(pageEmbeds[reaction.message.id].embeds[pageEmbeds[reaction.message.id].currentPage + 1]);
                        pageEmbeds[reaction.message.id].currentPage++;
                    }
                }
                if(reaction.message.reactions.get('⏹').users.find('id', user.id)!=undefined){
                    pageEmbeds[reaction.message.id] = undefined;
                }
                if(reaction.message.reactions.get('⏪').users.find('id', user.id)!=undefined){
                    pageEmbeds[reaction.message.id].currentPage = 0;
                    reaction.message.edit(pageEmbeds[reaction.message.id].embeds[pageEmbeds[reaction.message.id].currentPage]);
                }
                if(reaction.message.reactions.get('⏩').users.find('id', user.id)!=undefined){
                    pageEmbeds[reaction.message.id].currentPage = 0;
                    reaction.message.edit(pageEmbeds[reaction.message.id].embeds[pageEmbeds[reaction.message.id].embeds.length - 1]);
                }
            }
        }
    });
}