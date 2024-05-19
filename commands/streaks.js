const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { AttachmentBuilder,EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const file2 = new AttachmentBuilder('./assets/horse.jpg');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('streaks')
		.setDescription('List leaderboard of highest current streak holders within the server'),
	async execute(interaction) {

		const guildId = interaction.guildId;
		const itemsPerPage = 5;
        const db = new sqlite3.Database('./userbalDB.db');
		
		function getUserStatsForGuild(guildId, callback) {
	
			// Query to get user statistics for the provided guild ID
			let query = `
				SELECT u.id, u.userID, u.current_streak
				FROM guilds gs
				INNER JOIN users u ON gs.UserID = u.id
				WHERE gs.GuildID = ?;
			`;
			const params = [guildId];
		
			// Execute the query
			db.all(query, params, (err, rows) => {
				if (err) {
					console.error(err.message);
					callback(err, null);
				} else {
					//Convert the rows into a dictionary
					let result = {};
					rows.forEach(row => {
						result[row.id] = {
							name: row.userID,
							streak: row.current_streak
						};
					});
					callback(null, rows);
				}
			});
		
			// Close the database connection
			db.close();
		}


		getUserStatsForGuild(guildId, async (err, userStats) => {
			let pageIndex = 0;

			if (err) {
				console.error('Error fetching user stats:', err);
			} else {
							
				userStats.sort(function(a,b) {
					return b.current_streak - a.current_streak
				});
				

				// Function to get the current page items
				const getPageItems = (pageIndex) => {
					const start = pageIndex * itemsPerPage;
					const end = start + itemsPerPage;
					return userStats.slice(start, end);
				};
		
				// Function to create the embed message with buttons
				const createMessage = (pageIndex) => {
					const pageItems = getPageItems(pageIndex);

					const previous = new ButtonBuilder()
						.setCustomId('prev')
						.setLabel('◀')
						.setStyle(ButtonStyle.Primary)
						.setDisabled(pageIndex === 0);

					const next = new ButtonBuilder()
						.setCustomId('next')
						.setLabel('▶')
						.setStyle(ButtonStyle.Primary)
						.setDisabled(pageIndex >= Math.ceil(userStats.length / itemsPerPage) - 1)

					const row = new ActionRowBuilder()
						.addComponents(previous, next);

					let content = ""
					pageItems.forEach(function (value) {
						if (userStats.indexOf(value) + 1 == 1){
							content += `🥇 - ${value.userID} | ${value.current_streak} \n`
						}
						else if (userStats.indexOf(value) + 1 == 2){
							content += `🥈 - ${value.userID} | ${value.current_streak} \n`
						}
						else if (userStats.indexOf(value) + 1 == 3){
							content += `🥉 - ${value.userID} | ${value.current_streak} \n`
						}
						else{
							content += `${userStats.indexOf(value) + 1} - ${value.userID} | ${value.current_streak} \n`
						}
					});
		
					let embed = new Discord.EmbedBuilder()
					.setTitle("»│ Leaderboard │«")
					.setColor(0xff0000)
					.setAuthor({name:`ʳᵃᶜᵉ ʷᶦⁿˢ`})
					.setDescription("The top 5 current streak leaders")
					.addFields({ name: 'Leaderboard:', value: `**${content}**`, inline: true })
					.setFooter({ text: '𝗕𝗲 𝗙𝗶𝗿𝘀𝘁 | 𝐆𝐨𝐨𝐝 𝐋𝐮𝐜𝐤 |', iconURL: 'attachment://horse.jpg' })
					.setTimestamp();
		
					return { embeds: [embed], files: [file2], components: [row] };
				};
		
				const response = await interaction.reply(createMessage(pageIndex));

				const filter = i => i.customId === 'prev' || i.customId === 'next';

				const collector = response.createMessageComponentCollector({ filter, time: 30000 });
		
				collector.on('collect', async i => {
					if (i.customId === 'prev' ) {
						pageIndex = Math.max(pageIndex - 1, 0);
					} else if (i.customId === 'next') {
						pageIndex = Math.min(pageIndex + 1, Math.ceil(userStats.length / itemsPerPage) - 1);
					}

					await interaction.editReply(createMessage(pageIndex));
				});

				collector.on('end', () => {
					interaction.editReply({ components: [] }); // Remove buttons after timeout
				});

			}
		});

	

	},
};
