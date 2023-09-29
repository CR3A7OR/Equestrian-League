const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { AttachmentBuilder,EmbedBuilder } = require('discord.js');
const file = new AttachmentBuilder('./assets/gameplay.png');
const file2 = new AttachmentBuilder('./assets/horse.jpg');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with help!'),
	async execute(interaction) {
		let embed = new Discord.EmbedBuilder()
        .setTitle("»│ Information │«")
		.setColor(0xff0000)
		.setAuthor({name:`ʰᵒʷ ᵗᵒ ᵖˡᵃʸ`})
		.setImage('attachment://gameplay.png')
        .setDescription("Commands: \n » /race - start playing \n » /balance- return user balance \n » /help - show information")
		.addFields({ name: 'Placing Bets:', value: 'The odds are first displayed before the race begins, allowing you to select your betting amount. \n Operating using British fractional odds where the 5/1 odds means every $1 wagered could win you $5 if the bet is successful. \n\n 𝗣𝗿𝗼𝗳𝗶𝘁 = 𝗦𝘁𝗮𝗸𝗲 𝘅 (𝗙𝗿𝗮𝗰𝘁𝗶𝗼𝗻𝗮𝗹 𝗢𝗱𝗱) + 𝗦𝘁𝗮𝗸𝗲 ', inline: true })
		.addFields({ name: 'Racing:', value: 'Once the race begins you can select the horse you wish to vote on. The layout below is presented showing: \n 𝗥𝗮𝗰𝗲 𝗥𝗲𝘀𝘂𝗹𝘁 - left hand-side \n 𝗛𝗼𝗿𝘀𝗲 𝗡𝘂𝗺𝗯𝗲𝗿𝘀 - right hand-side \n 𝗧𝗿𝗮𝗰𝗸 - Middle section where the horses move along until the end is reached', inline: true })
		.setFooter({ text: '𝗚𝗮𝗺𝗯𝗹𝗲 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗹𝘆 | 𝐆𝐨𝐨𝐝 𝐋𝐮𝐜𝐤 |', iconURL: 'attachment://horse.jpg' })
		.setTimestamp();
        await interaction.reply({ embeds: [embed], files: [file,file2] });
	},
};
