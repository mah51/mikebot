const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const Command = require('../../structures/commands');

module.exports = class CountryInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'country-info',
      aliases: ['countryinfo', 'cinfo'],
      group: 'lookups',
      memberName: 'country-info',
      description: 'Returns information on a given country',
      examples: ['country-info United Kingdom'],
      args: [{
        key: 'query',
        prompt: 'Value that will be matched in the database.',
        type: 'string',
      }],
    });
  }

  async run(msg, { query }, fromPattern, result) {
    const data = await axios.get(`https://restcountries.eu/rest/v2/name/${query}`);
    const req = data.data;
    if (req.length > 1) {
      let countries = '';

      req.forEach((country) => {
        countries += (`\n${country.name},`);
      });
      await msg.reply(`That returned this list of countries: ${countries} \nPlease be more specific with your query!`);
    } if (req.length === 0) {
      await msg.say('Country not found :/.');
    } else if (req === 'undefined') {
      await msg.say('Country api did not respond 😢');
    } else {
      const embed = new MessageEmbed();
      const reqs = req[0];
      let currencies_s = '';
      let languages_s = '';
      reqs.currencies.forEach((current) => {
        currencies_s += (`${current.symbol} - ${current.name}\n`);
      });
      reqs.languages.forEach((language) => {
        languages_s += `${language.name} - ${language.iso639_1}\n`;
      });
      embed
        .setColor(this.client.setting.colour)
        .setFooter(this.client.setting.footer)
        .setTitle(`Country lookup - ${reqs.name}`)
        .setTimestamp()
        .setDescription(`Native name - ${reqs.nativeName}`)
        .addFields(
          { name: 'Continent', value: reqs.region, inline: true },
          { name: 'Population', value: reqs.population, inline: true },
          { name: 'Capital', value: reqs.capital, inline: true },
          { name: 'Size', value: `${reqs.area} km²`, inline: true },
          { name: 'Domain', value: `.co${reqs.topLevelDomain}`, inline: true },
          { name: 'Currencies', value: currencies_s, inline: true },
          { name: 'Languages', value: languages_s, inline: true },
        );
      await msg.say(embed);
    }
  }
};
