/*
const Command = require('../../structures/commands');
const { checkBotPerms, checkPerms } = require('../../functions/commandChecks');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class LockCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'channel-lock',
            aliases: ['lock', 'cl'],
            group: 'moderation',
            memberName: 'channel-lock',
            description: 'Prevents users from posting in the current channel!',
            guildOnly: true,
            examples: ['channel-lock [start/stop]'],
            args: [{
                key: 'type',
                prompt: 'Please enter either start or stop.',
                type: 'string',
                default: '',
                validate: type => {
                    if (['start', 'stop'].includes(type.toLowerCase())) return true;
                    return 'Please enter either start or stop.';
                },
                parse: type => type.toLowerCase()
            }]
        });
    }

    async run(msg, {type}, fromPattern , something) {
        if(!checkPerms(msg, ['MANAGE_CHANNELS'], ['mod']))
            return
        if(!checkBotPerms(msg, ['MANAGE_CHANNELS']))
            return

        let lock = await msg.client.provider.get(msg.guild, 'channel_locked')
        let alreadyLocked;
        let indexe;
        if(lock) {
            lock.forEach((channel, index) => {
                if(channel.channel === msg.channel.id) {
                    indexe = index
                    alreadyLocked = channel
                }
            })
        }
        if(!type) {
            if(alreadyLocked) {
                type = 'stop'
            } else {
                type = 'start'
            }
        }
        if (type === 'start') {
            let roles = await msg.guild.roles.fetch()
            if(alreadyLocked)
                return msg.reply('The channel is already locked').catch(console.error);

            let rolePerms = roles.cache.map(role => {
                return {
                    id: role.id,
                    deny: ['SEND_MESSAGES']
                }
            })
            let oldPerms = roles.cache.map(role => {
                return {
                    id: role.id,
                    name: role.name,
                    include: role.permissionsIn(msg.channel).has('SEND_MESSAGES')
                }
            })
            const embed = new MessageEmbed()
                .setFooter(this.client.setting.footer)
                .setColor(this.client.setting.colour)
                .setTimestamp()
                .setTitle(msg.channel.name + ' was locked by ' + msg.author.username)
                .setDescription('This action can be un-done using channel-lock stop')
                .addField('Roles affected', '`' + roles.cache.map(role => role.name).join("`, `") + '`')
            msg.channel.overwritePermissions(rolePerms, 'Channel locked by ' + msg.author.username).catch(console.error)
            let pushing = {channel: msg.channel.id, user: msg.author, time: Date.now(), roles: oldPerms}
            if(lock) {
                lock.push(pushing)
                await this.client.provider.set(msg.guild, 'channel_locked', lock)
            } else {
                await this.client.provider.set(msg.guild, 'channel_locked', [pushing])
            }
            return msg.say(embed).catch(console.error);
        } else if (type === 'stop') {
            if(!lock) {
                return msg.reply('No channels in this server are locked!').catch(console.error)
            }
            if(!alreadyLocked)
                return msg.reply('That channel isn\'t locked').catch(console.error)
            let duration = moment.duration(moment().diff(moment(alreadyLocked.time))).humanize(false)
            let rolePermios = alreadyLocked.roles.map(role => {
                if(role.include) {
                    return {
                        id: role.id,
                        allow: ['SEND_MESSAGES']
                    }
                } else {
                    return {
                        id: role.id,
                        deny: ['SEND_MESSAGES']
                    }
                }
            })
            rolePermios = rolePermios.filter(role => role)
            console.log(rolePermios)
            const embed = new MessageEmbed()
                .setFooter(this.client.setting.footer)
                .setColor(this.client.setting.colour)
                .setTimestamp()
                .setTitle(msg.channel.name + ' was unlocked by ' + msg.author.username)
                .addField('Lock duration', duration)
                .addField('Roles affected', '`' + alreadyLocked.roles.map(role => role.name).join("`, `") + '`')
            msg.channel.overwritePermissions(rolePermios, 'Channel locked by ' + msg.author.username).catch(console.error)
            if(lock.length === 1) {
                msg.client.provider.remove(msg.guild, 'channel_locked').catch(console.error)
            } else {
                lock.splice(indexe, 1)
                await msg.client.provider.set(msg.guild, 'channel_locked', lock)
            }
            return msg.say(embed).catch(console.error);
        }
    }
};
*/
